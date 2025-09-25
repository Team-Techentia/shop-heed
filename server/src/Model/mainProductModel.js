const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
});
const mainProductModel = new mongoose.Schema({
  title: String,
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  shopType:[],
  description: String,
  brand: String,
  category: String,
  subCategory: [],
  price: String,
  discount: String,
  comments: [commentSchema],
  type: String,
    isDeleted:{
    type:Boolean,
    default:false
},
},{ suppressReservedKeysWarning: true, timestamps: true });

module.exports = mongoose.model('mainProductModel', mainProductModel);
