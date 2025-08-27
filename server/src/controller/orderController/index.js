const Razorpay = require("razorpay");
const crypto = require("crypto");
const Product = require("../../Model/productModel");
const Order = require("../../Model/orderModel");
const paymentModel = require("../../Model/paymentModel");
require('dotenv').config()

const cron = require("node-cron");
const {
  EmailSendComponent,
  htmlContentForMailTemplate,
} = require("../emailController");
const { createInvoice } = require("./invoice");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const { items, orderTotal, paymentMethod, customerDetails } = req.body;

    const orderPromises = items.map(async (item) => {
      const product = await Product.findById(item.product._id).sort({ createdAt: -1 });

      if (!product) {
        throw new Error("Product not found");
      }

      const newOrder = new Order({
        userId: req._id,
        product: item.product._id,
        totalAmount: product.finalPrice * item.quantity,
        totalQuantity: item.quantity,
        paymentMethod,
        customerDetails,
        status: "pending",
      });

      await newOrder.save();
      return newOrder;
    });

    const savedOrders = await Promise.all(orderPromises);

    if (paymentMethod === "online") {
      const options = {
        amount: orderTotal * 100,
        currency: "INR",
        receipt: savedOrders[0]._id.toString(),
      };

      const razorpayOrder = await razorpay.orders.create(options);

      const updatedOrders = await Promise.all(
        savedOrders.map(async (order) => {
          order.paymentDetails = {
            orderId: razorpayOrder.id,
          };
          await order.save();
          return order;
        })
      );
      const payment = new paymentModel({
        transactionId: razorpayOrder.id,
        orderId: updatedOrders[0]._id,
        userId: req._id,
        productIds: items.map((item) => item.product._id),
        amount: orderTotal,
        paymentStatus: "pending",
      });

      await payment.save();
      EmailSendComponent(
        customerDetails.email,
        "Order Confirmation success",
        htmlContentForMailTemplate(
          customerDetails.first_name,
          " Purchase confirmation",
          " Thanks for your purchase. We will send tracking info when your order ships. Your payment has been successfully"
        )
      );
      return res.status(201).json({ success: true, orderId: razorpayOrder.id });
    } else {
      items.map(async (item) => {
        const product = await Product.findById(item.product._id);
        if (product) {
          if (product.quantity >= item.quantity) {
            product.quantity -= item.quantity;
            await product.save();
          } else {
            return res
              .status(400)
              .json({ success: false, message: "Insufficient stock" });
          }
        } else {
          return res
            .status(400)
            .json({ success: false, message: "Product not found" });
        }
      });

      EmailSendComponent(
        customerDetails.email,
        "Order Confirmation",
        htmlContentForMailTemplate(
          customerDetails.first_name,
          " Purchase confirmation",
          " Thanks for your purchase. We willsend tracking info when your order ships."
        )
      );

      return res.status(201).json({ success: true, orders: savedOrders });
    }
  } catch (error) {
    
    return res.status(500).json({ success: false, message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const orders = await Order.find({
      "paymentDetails.orderId": razorpay_order_id,
    });

    if (!orders || orders.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Order not found" });
    }

    const hmac = crypto.createHmac(process.env.HMAC_KEY, process.env.RAZORPAY_API_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest("hex");

    if (generated_signature === razorpay_signature) {
      for (let order of orders) {
        order.status = "paid";
        order.paymentDetails.paymentId = razorpay_payment_id;
        order.paymentDetails.paymentStatus = "paid";
        await order.save();

        const product = await Product.findById(order.product);
        if (product) {
          if (product.quantity >= order.totalQuantity) {
            product.quantity -= order.totalQuantity;
            await product.save();
          } else {
            return res
              .status(400)
              .json({ success: false, message: "Insufficient stock" });
          }
        } else {
          return res
            .status(400)
            .json({ success: false, message: "Product not found" });
        }
      }

      const payment = await paymentModel.findOne({
        transactionId: razorpay_order_id,
      });
      if (payment) {
        payment.paymentId = razorpay_payment_id;
        payment.paymentStatus = "paid";
        await payment.save();
      }

      return res.json({ success: true });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
  
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getOrderByUserId = async function (req, res) {
  try {
    const orders = await Order.find({ userId: req._id })
      .populate({ path: "product", select: "title image " })
      .select("_id  totalAmount status orderStatus totalQuantity ")
      .lean()
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    return res
      .status(200)
      .json({
        success: true,
        data: orders,
        message: "Successfully retrieved orders",
      });
  } catch (error) {

    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const updateOrderStatus = async function (req, res) {
  try {
    const order = await Order.findById(req.body.id);
    if (order) {
      order.orderStatus = req.body.status;
      await order.save();
      return res
        .status(200)
        .json({ success: true, message: "Order status updated successfully" });
    }
    return res.status(404).json({ success: false, message: "Order not found" });
  } catch (error) {
    
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

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
      } catch (error) {
        
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
 
  }
});

const getOrderById = async function (req, res) {
  try {
    const userId = req._id;
    const orderId = req.params.id;
    
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User is missing" });
    }
    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, message: "Order Id is missing" });
    }

    const getOrder = await Order.findById(orderId).populate("product");
  
    if (!getOrder) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to fetch order by id" });
    }
    return res
      .status(200)
      .json({
        success: true,
        data: getOrder,
        message: "Order successfully by id",
      });
  } catch (error) {
   
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const deleteOrder = async function (req, res) {
  try {
    const userId = req._id;
    if (!userId) {
      return res
        .status(400)
        .josn({ success: false, message: "User is missing" });
    }

    const deletedId = req.params.id;

    if (!deletedId) {
      return res
        .status(400)
        .json({ success: false, message: "Order id not provided" });
    }

    const deleteOrder = await Order.findByIdAndDelete(deletedId);

    if (!deleteOrder) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to delete Order" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
   
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


async function generateInvoicing(req, res) {
  try {
  const orderId = req.params.orderId;

    const order = await Order.find({ "paymentDetails.orderId": orderId }).populate("product");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    const customerDetails = order[0].customerDetails;
    const items = await order.map((product, index) => ({
      sno: index + 1,
      quantity: product.totalQuantity,
      Product: product.product.title,
      rate: product.product.finalPrice,
      subTotal: product.totalAmount,
      productId:product.product.productId,
      variantId:product.product._id
    }));
    const totalSubTotal = items.reduce((sum, item) => sum + item.subTotal, 0);
    const url = await createInvoice({
      invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
      orderNumber: orderId,
      invoiceDate:   new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      totalAmount: totalSubTotal,
      from: {
        name: 'Shopheed',
        address: 'A-39, WEST PATEL NAGAR, WEST PATEL NAGAR, NEW DELHI, Central Delhi, Delhi, 110008',
        email: 'info@shopheed.com'
      },
      to: {
        name: `${customerDetails.first_name} ${customerDetails.last_name}`,
        address: `${customerDetails.address}, ${customerDetails.city}, ${customerDetails.state}, ${customerDetails.pincode}`,
        email: customerDetails.email,
        mobile: customerDetails.phone
      },
      items: items
    });
    await Order.updateMany(
      { "paymentDetails.orderId": orderId }, 
      { $set: { inVoiceLink: url } } 
    );
    return res.status(200).json({ message: "Invoice generated successfully", url: url });
  } catch (error) {
    
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}


module.exports = {
  createOrder,
  verifyPayment,
  getOrderByUserId,
  updateOrderStatus,
  getOrderById,
  deleteOrder,generateInvoicing
};
