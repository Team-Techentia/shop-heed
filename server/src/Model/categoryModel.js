const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    image:String,
    category: String,
    value: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('category', categorySchema);
