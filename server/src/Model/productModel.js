const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    title: String,
    description: String,
    size: String,
    color: String,
    image: [String],
    quantity: Number,
    brand: String,
    category: String,
    subCategory: [],
    price: String,
    numberSize: String,
    discount: String,
    type: String,
    shopType: [],
    uniquePropertyId: String,
    isDeleted: {
        type: Boolean,
        default: false
    },
    tags: [String],
    finalPrice: String,
    specificationArray: [],
    specificationSingleLine: [],
    sku:String



}, { suppressReservedKeysWarning: true, timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
