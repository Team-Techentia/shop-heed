const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    bannerType: { type: String, required: true, enum: ['home', 'category', 'subcategory'], default: 'home' },
    category: { type: String, default: null },
    subCategory: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    priority: { type: Number, default: 1, min: 1, max: 100 },
    link: { type: String, default: null }
}, { timestamps: true });

// Index for better query performance
bannerSchema.index({ bannerType: 1, isActive: 1, priority: 1 });
bannerSchema.index({ category: 1, bannerType: 1 });
bannerSchema.index({ subCategory: 1, bannerType: 1 });

module.exports = mongoose.model('Banner', bannerSchema);