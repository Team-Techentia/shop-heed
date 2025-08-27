const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    category: String,
    subCategory: String,
    value: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('subcategory', subCategorySchema);
