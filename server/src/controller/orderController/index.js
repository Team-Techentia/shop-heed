const Razorpay = require("razorpay");
const crypto = require("crypto");
const Product = require("../../Model/productModel");
const Order = require("../../Model/orderModel");
const paymentModel = require("../../Model/paymentModel");
const Counter = require("../../Model/Counter");
require("dotenv").config();

const cron = require("node-cron");
const {
  EmailSendComponent,
  htmlContentForMailTemplate,
  orderConfirmationTemplate,
  adminNewOrderTemplate,
  orderShippedTemplate,
  orderCancelledTemplate,
  returnUpdateTemplate
} = require("../emailController");
const { createInvoice } = require("./invoice");
const { Promocode } = require("../../Model/promocode");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// Helper function to generate custom order ID
const getNextOrderId = async () => {
  const orders = await Order.find();
  console.log(orders.length);
  return `SH_${String(orders.length + 1).padStart(6, "0")}`;
};

const createOrder = async (req, res) => {
  try {
    const { items, orderTotal, paymentMethod, customerDetails, appliedPromocode } = req.body;

    // Validate all products first
    for (const item of items) {
      const product = await Product.findById(item.product._id);
      if (!product) throw new Error(`Product ${item.product._id} not found`);
      if (product.quantity < item.quantity) {
        throw new Error(`Insufficient stock for ${product.title}`);
      }
    }

    // Handle promocode (only once for the entire order)
    if (appliedPromocode) {
      const promo = await Promocode.findOne({ code: appliedPromocode });
      if (!promo) throw new Error("Promocode not found");

      if (!(await promo.canBeUsedByUser(req._id))) {
        throw new Error("Usage limit exceeded for this promocode");
      }

      await promo.applyUsage(req._id);
    }

    // Generate a single custom order ID for this transaction
    const customOrderId = await getNextOrderId();

    // Prepare order items array
    const orderItems = items.map((item) => ({
      product: item.product._id,
      image: item.product.image,
      title: item.product.title,
      sku: item.product.sku,
      size: item.product.size,
      price: item.product.price,           // original price
      finalPrice: item.product.finalPrice, // discounted or final price
      quantity: item.quantity,
      totalPrice: item.product.finalPrice * item.quantity
    }));


    // Create ONE order document for the entire cart
    const newOrder = new Order({
      userId: req._id,
      orderId: customOrderId,
      items: orderItems, // Array of items in the order
      totalAmount: orderTotal,
      totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
      paymentMethod,
      customerDetails,
      status: "pending",
      orderStatus: "Confirmed",
    });

    if (paymentMethod === "online") {
      // Create Razorpay order for the entire transaction
      const options = {
        amount: orderTotal * 100,
        currency: "INR",
        receipt: customOrderId,
      };

      const razorpayOrder = await razorpay.orders.create(options);

      // Update order with Razorpay details
      newOrder.paymentDetails = {
        orderId: razorpayOrder.id,
        paymentStatus: "pending"
      };

      // Save the order
      await newOrder.save();

      // Create ONE payment record for the transaction
      const payment = new paymentModel({
        transactionId: razorpayOrder.id,
        orderId: newOrder._id,
        userId: req._id,
        productIds: items.map((item) => item.product._id),
        amount: orderTotal,
        paymentStatus: "pending",
      });
      await payment.save();

      return res.status(201).json({
        success: true,
        orderId: razorpayOrder.id, // Razorpay order ID
        customOrderId, // Your custom order ID (SH_000001)
        itemCount: items.length
      });
    } else {
      // COD Flow - Save order and reduce inventory
      await newOrder.save();

      // Reduce inventory for all items
      await Promise.all(
        items.map(async (item) => {
          const product = await Product.findById(item.product._id);
          product.quantity -= item.quantity;
          await product.save();
        })
      );

      // Send confirmation email
      try {
        // Send to Customer
        EmailSendComponent(
          customerDetails.email,
          "Order Confirmation - " + customOrderId,
          orderConfirmationTemplate(newOrder)
        );

        // Send to Admin
        EmailSendComponent(
          "heed.brandsin@gmail.com",
          "New Order Alert - " + customOrderId,
          adminNewOrderTemplate(newOrder)
        );
      } catch (emailError) {
        console.error("Failed to send order emails:", emailError);
      }

      return res.status(201).json({
        success: true,
        order: newOrder,
        customOrderId,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Find the single order with this Razorpay order ID
    const order = await Order.findOne({
      "paymentDetails.orderId": razorpay_order_id,
    }).populate("items.product");

    if (!order)
      return res.status(400).json({ success: false, message: "Order not found" });

    // Verify signature
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest("hex");

    if (generated_signature === razorpay_signature) {
      // Update order payment status
      order.status = "paid";
      order.paymentDetails.paymentId = razorpay_payment_id;
      order.paymentDetails.paymentStatus = "paid";

      // Reduce inventory for all items in the order
      for (const item of order.items) {
        const product = await Product.findById(item.product._id || item.product);
        if (product && product.quantity >= item.quantity) {
          product.quantity -= item.quantity;
          await product.save();
        } else {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product?.title || 'product'}`
          });
        }
      }

      await order.save();

      // Update payment record
      const payment = await paymentModel.findOne({
        transactionId: razorpay_order_id,
      });
      if (payment) {
        payment.paymentId = razorpay_payment_id;
        payment.paymentStatus = "paid";
        await payment.save();
      }

      // Send confirmation email
      try {
        // Send to Customer
        EmailSendComponent(
          order.customerDetails.email,
          "Order Confirmation - " + order.orderId,
          orderConfirmationTemplate(order)
        );
        // Send to Admin
        EmailSendComponent(
          "heed.brandsin@gmail.com",
          "New Order Alert - " + order.orderId,
          adminNewOrderTemplate(order)
        );
      } catch (emailError) {
        console.error("Failed to send payment confirmation email:", emailError);
      }

      return res.json({ success: true });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getOrderByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req._id })
      .populate({ path: "items.product", select: "title image finalPrice" })
      .select("_id orderId totalAmount status orderStatus totalQuantity items createdAt")
      .sort({ createdAt: -1 })
      .lean();

    if (!orders || orders.length === 0)
      return res.status(404).json({
        success: false,
        message: "No orders found"
      });

    // Format the response to include item details
    const formattedOrders = orders.map(order => ({
      ...order,
      itemCount: order.items.length,
      products: order.items.map(item => ({
        title: item.product?.title,
        image: item.product?.image,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.totalPrice
      }))
    }));

    return res.status(200).json({
      success: true,
      data: formattedOrders,
      message: "Successfully retrieved orders",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.body.id);
    if (!order)
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });

    order.orderStatus = req.body.status;
    if (req.body.forwardAwb) order.forwardAwb = req.body.forwardAwb;
    if (req.body.reverseAwb) order.reverseAwb = req.body.reverseAwb;

    await order.save();

    // Send status update email based on status
    try {
      const statusLower = req.body.status.toLowerCase();

      if (statusLower === 'shipped') {
        EmailSendComponent(
          order.customerDetails.email,
          "Order Shipped - " + order.orderId,
          orderShippedTemplate(order, req.body.forwardAwb)
        );
      } else if (statusLower === 'cancelled') {
        EmailSendComponent(
          order.customerDetails.email,
          "Order Cancelled - " + order.orderId,
          orderCancelledTemplate(order)
        );
      } else if (statusLower.includes('return') || statusLower.includes('exchange')) {
        EmailSendComponent(
          order.customerDetails.email,
          "Return Update - " + order.orderId,
          returnUpdateTemplate(order, req.body.status)
        );
      } else {
        // Fallback for other statuses
        EmailSendComponent(
          order.customerDetails.email,
          "Order Status Update - " + order.orderId,
          htmlContentForMailTemplate(
            order.customerDetails.first_name,
            "Order Status Updated",
            `Your order ${order.orderId} status has been updated to: ${req.body.status}`
          )
        );
      }
    } catch (emailError) {
      console.error("Failed to send status update email:", emailError);
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// CRON to auto-update pending payments
cron.schedule("*/1 * * * *", async () => {
  try {
    const pendingPayments = await paymentModel.find({
      paymentStatus: "pending",
    });

    for (const payment of pendingPayments) {
      if (!payment.paymentId) {
        payment.paymentStatus = "failed";
        await payment.save();
        const order = await Order.findById(payment.orderId);
        if (order) {
          order.status = "failed";
          await order.save();
        }
        continue;
      }

      let razorpayPayment;
      try {
        razorpayPayment = await razorpay.payments.fetch(payment.paymentId);
      } catch {
        continue;
      }

      if (razorpayPayment && razorpayPayment.status === "captured") {
        payment.paymentStatus = "paid";
        await payment.save();

        const order = await Order.findById(payment.orderId);
        if (order) {
          order.status = "paid";
          await order.save();
        }
      } else if (new Date() - new Date(payment.createdAt) > 30 * 60 * 1000) {
        payment.paymentStatus = "failed";
        await payment.save();

        const order = await Order.findById(payment.orderId);
        if (order) {
          order.status = "failed";
          order.orderStatus = "cancelled";
          await order.save();
        }
      }
    }
  } catch (error) {
    console.error("Cron job error:", error);
  }
});

const getOrderById = async (req, res) => {
  try {
    const { _id: userId } = req;
    const orderId = req.params.id;

    if (!userId)
      return res.status(400).json({
        success: false,
        message: "User is missing"
      });
    if (!orderId)
      return res.status(400).json({
        success: false,
        message: "Order Id is missing"
      });

    const order = await Order.findById(orderId).populate("items.product");
    if (!order)
      return res.status(400).json({
        success: false,
        message: "Failed to fetch order by id"
      });

    return res.status(200).json({
      success: true,
      data: order,
      message: "Order retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { _id: userId } = req;
    if (!userId)
      return res.status(400).json({
        success: false,
        message: "User is missing"
      });

    const deletedId = req.params.id;
    if (!deletedId)
      return res.status(400).json({
        success: false,
        message: "Order id not provided"
      });

    const deleteOrder = await Order.findByIdAndDelete(deletedId);
    if (!deleteOrder)
      return res.status(400).json({
        success: false,
        message: "Failed to delete Order"
      });

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const generateInvoicing = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Find the single order with this Razorpay order ID
    const order = await Order.findOne({
      "paymentDetails.orderId": orderId,
    }).populate("items.product");

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    const customerDetails = order.customerDetails;
    const customOrderId = order.orderId;

    // Map items from the order
    const items = order.items.map((item, index) => ({
      sno: index + 1,
      quantity: item.quantity,
      Product: item.product.title,
      rate: item.price,
      subTotal: item.totalPrice,
      productId: item.product.productId,
      variantId: item.product._id,
    }));

    const totalSubTotal = order.totalAmount;

    const url = await createInvoice({
      invoiceNumber: customOrderId || `INV-${Math.floor(Math.random() * 10000)}`,
      orderNumber: orderId,
      invoiceDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      totalAmount: totalSubTotal,
      from: {
        name: "Shopheed",
        address:
          "A-39, WEST PATEL NAGAR, WEST PATEL NAGAR, NEW DELHI, Central Delhi, Delhi, 110008",
        email: "heed.brandsin@gmail.com",
      },
      to: {
        name: `${customerDetails.first_name} ${customerDetails.last_name}`,
        address: `${customerDetails.address}, ${customerDetails.city}, ${customerDetails.state}, ${customerDetails.pincode}`,
        email: customerDetails.email,
        mobile: customerDetails.phone,
      },
      items,
    });

    // Update the single order with invoice link
    order.invoiceLink = url;
    await order.save();

    // Send invoice via email
    EmailSendComponent(
      customerDetails.email,
      "Invoice for Your Order",
      htmlContentForMailTemplate(
        customerDetails.first_name,
        "Invoice Ready",
        `Your invoice for order ${customOrderId} is ready. Download it here: ${url}`
      )
    );

    return res.status(200).json({
      message: "Invoice generated successfully",
      url
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getOrderByUserId,
  updateOrderStatus,
  getOrderById,
  deleteOrder,
  generateInvoicing,
};