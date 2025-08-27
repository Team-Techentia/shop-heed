const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  transactionId: { type: String, required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel', required: true },
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],
  amount: { type: Number, required: true },
  paymentId: { type: String }, 
  paymentStatus: { type: String, default: 'pending' } 
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
