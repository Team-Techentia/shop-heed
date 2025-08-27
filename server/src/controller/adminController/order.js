const orderModel = require("../../Model/orderModel");
const { login, order } = require("./shiprocket");

const getOrder = async function(req, res) {
    try {
      const { status, orderStatus } = req.query;
     
      let query = {}; 
  
      if (status && status !== "null" && status !== "undefined") {
        query.status = status;
      }
    
      if (orderStatus && orderStatus !== "null" && orderStatus !== "undefined") {
        query.orderStatus = orderStatus;
      }
  

        const orders = await orderModel.find(query).populate({path:"product userId" , select:"title image sku"}).select("_id  totalAmount status totalQuantity orderStatus paymentMethod orderDate paymentDetails inVoiceLink ").lean().sort({ createdAt: -1 })
  
        if (!orders || orders.length === 0) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        return res.status(200).json({ success: true, data: orders, message: "Successfully retrieved orders" });
    } catch (error) {
       
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }


  const getOrderById = async function(req, res) {
    try {
        const id = req.params.Id
        const order = await orderModel.findById(id).populate({path:"product userId" }).lean().sort({ createdAt: -1 })
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        return res.status(200).json({ success: true, data: order, message: "Successfully retrieved orders" });
    } catch (error) {
     
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  const updateOrder = async function(req, res) {
    try {
    const id = req.params.Id;
    const payLoad = {
      'orderStatus': req.body.orderStatus,
      'customerDetails.first_name': req.body.first_name,
      'customerDetails.last_name': req.body.last_name,
      'customerDetails.phone': req.body.phone,
      'customerDetails.pincode': req.body.pincode,
      'customerDetails.state': req.body.state,
      'customerDetails.address': req.body.address,
      'customerDetails.country': req.body.country,
      'customerDetails.city': req.body.city,
      'customerDetails.email': req.body.email
    }

    if (req.body.orderStatus === "shipping") {
      
      const weightInKg = req.body.weight / 1000;

      payLoad.weight = weightInKg;
      payLoad.height = req.body.height;
      payLoad.length = req.body.length;
      payLoad.breadth = req.body.breadth;

      try {
        const token = await login();
        await order(req.body, token);
      } catch (error) {
       
        return res.status(500).json({ success: false, message: "Failed to create order" });
      }
    }



  
      const updatedOrder = await orderModel.findByIdAndUpdate(
        id,
        {
          $set: {
            ...payLoad
          }
        },
        { new: true }
      ).populate({ path: "product userId" }).lean();
  
      if (!updatedOrder) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
  
      return res.status(200).json({ success: true, data: updatedOrder, message: "Successfully updated order" });
    } catch (error) {
      
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  



  const get_All_Orders = async function (req, res) {
    try {
      const userId = req._id; 
      const { status, orderStatus } = req.query;
  
      if (!userId) {
        return res.status(404).json({ success: false, message: "User is missing" });
      }
  
      let query = {}; 
  
      if (status && status !== "null" && status !== "undefined") {
        query.status = status;
      }
    
      if (orderStatus && orderStatus !== "null" && orderStatus !== "undefined") {
        query.orderStatus = orderStatus;
      }
  
      
  
      const orders = await orderModel
        .find(query)
        .populate({ path: "product userId", select: "title image" })
        .select("_id totalAmount status totalQuantity orderStatus paymentMethod orderDate paymentDetails")
        .lean()
        .sort({ createdAt: -1 });
  
      if (!orders || orders.length === 0) {
        return res.status(404).send({ success: false, message: "Orders not found" });
      }
  
      return res.status(200).send({
        success: true,
        message: "Successfully retrieved orders",
        data: orders,
        count: orders.length,
      });
    } catch (error) {
   
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  


  module.exports = {  getOrder , getOrderById , updateOrder , get_All_Orders };