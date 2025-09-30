const orderModel = require("../../Model/orderModel");
const { login, order } = require("./shiprocket");

const getOrder = async function(req, res) {
    try {
      const { status, orderStatus } = req.query;
     
      let query = {}; 
  
      // Better null checking
      if (status && status !== "null" && status !== "undefined" && status.trim() !== "") {
        query.status = status;
      }
    
      if (orderStatus && orderStatus !== "null" && orderStatus !== "undefined" && orderStatus.trim() !== "") {
        query.orderStatus = orderStatus;
      }

      console.log("Query filters:", query); // Debug log
  
      const orders = await orderModel.find(query)
        .select("_id orderId totalAmount status totalQuantity orderStatus paymentMethod orderDate paymentDetails inVoiceLink items customerDetails userId createdAt")
        .sort({ createdAt: -1 });

      console.log("Found orders count:", orders.length); // Debug log
  
      if (!orders || orders.length === 0) {
          return res.status(200).json({ success: true, data: [], message: "No orders found", count: 0 });
      }
      
      return res.status(200).json({ 
          success: true, 
          data: orders, 
          message: "Successfully retrieved orders",
          count: orders.length 
      });
    } catch (error) {
        console.error("Error in getOrder:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

const getOrderById = async function(req, res) {
    try {
        const id = req.params.Id;
        const order = await orderModel.findById(id)
          .lean();
          
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        return res.status(200).json({ success: true, data: order, message: "Successfully retrieved order" });
    } catch (error) {
        console.error("Error in getOrderById:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const updateOrder = async function (req, res) {
  try {
    const { Id } = req.params;

    const payLoad = {
      orderStatus: req.body.orderStatus,
      'customerDetails.first_name': req.body.first_name,
      'customerDetails.last_name': req.body.last_name,
      'customerDetails.phone': req.body.phone,
      'customerDetails.pincode': req.body.pincode,
      'customerDetails.state': req.body.state,
      'customerDetails.address': req.body.address,
      'customerDetails.country': req.body.country,
      'customerDetails.city': req.body.city,
      'customerDetails.email': req.body.email,

      // ✅ AWB numbers stored at root order level
      forwardAwb: req.body.forwardAwb || "",
      reverseAwb: req.body.reverseAwb || "",
    };

    const updatedOrder = await orderModel.findByIdAndUpdate(
      Id,
      { $set: payLoad },
      { new: true }
    ).lean();

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({
      success: true,
      data: updatedOrder,
      message: "Successfully updated order",
    });
  } catch (error) {
    console.error("Error in updateOrder:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};




const get_All_Orders = async function (req, res) {
    try {
        const { status, orderStatus, userId } = req.query;

        let query = {}; // No userId filter for admin - get ALL orders

        // Optional filtering by userId if provided in query
        if (userId && userId !== "null" && userId !== "undefined" && userId.trim() !== "") {
            query.userId = userId;
        }

        if (status && status !== "null" && status !== "undefined" && status.trim() !== "") {
            query.status = status;
        }

        if (orderStatus && orderStatus !== "null" && orderStatus !== "undefined" && orderStatus.trim() !== "") {
            query.orderStatus = orderStatus;
        }

        console.log("Admin query filters:", query); // Debug log

        const orders = await orderModel
            .find(query)
            .select("_id orderId totalAmount status totalQuantity orderStatus paymentMethod orderDate paymentDetails items customerDetails userId")
            .lean()
            .sort({ createdAt: -1 });

        console.log("Found orders count for admin:", orders.length); // Debug log

        if (!orders || orders.length === 0) {
            return res.status(200).send({ 
                success: true, 
                message: "No orders found", 
                data: [],
                count: 0 
            });
        }

        return res.status(200).send({
            success: true,
            message: "Successfully retrieved orders",
            data: orders,
            count: orders.length,
        });
    } catch (error) {
        console.error("Error in get_All_Orders:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

module.exports = { getOrder, getOrderById, updateOrder, get_All_Orders };