const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: String, required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        title: { type: String, required: true },
        image: { type: [String], required: true }, // array of image URLs
        sku: { type: String },
        size: { type: String },
        price: { type: Number, required: true },      // original price
        finalPrice: { type: Number, required: true }, // discounted / effective price
        quantity: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    totalQuantity: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    customerDetails: { type: Object, required: true },
    status: { type: String, default: 'pending' },
    orderStatus: { type: String, default: 'processing' },
    paymentDetails: { type: Object },
    forwardAwb: { type: String, default: '' },
    reverseAwb: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
