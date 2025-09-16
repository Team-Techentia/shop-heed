const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
  category: { type: String, required: [true,"Missing category"] },
  subCategory: { type: String, required: [true,"Missing subcategory"] },
  value: { type: String, required: [true,"Missing value"] },
  image: { type: String, required: [true,"Missing image"] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('subcategory', subCategorySchema);
