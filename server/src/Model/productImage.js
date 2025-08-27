const mongoose = require('mongoose');

const productImagesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  images: [{ type: String, required: true }]
});

const Product = mongoose.model('ProductImages', productImagesSchema);

module.exports = Product;
