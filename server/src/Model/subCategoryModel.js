const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
  category: String,
  subCategory: String,
  value: String,
  image: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('subcategory', subCategorySchema);
