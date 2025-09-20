const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'userModel'
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  totalQuantity: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  inVoiceLink: {
    type: String,
  
  },
  customerDetails: {
    type: Object,
    required: true
  },
  status: {
    type: String,
    default: 'pending'
  },
  orderStatus: {
    type: String,
    default: 'processing'
  },
    weight: {
    type: String,
   
  },
  height: {
    type: String,
    
  },
  breadth: {
    type: String,
    
  },
  length: {
    type: String,
   
  },
  orderDate:{
    type: Date,
    default: Date.now()
  },
  paymentDetails: {
    orderId: String,
    paymentId: String,
    paymentStatus: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
