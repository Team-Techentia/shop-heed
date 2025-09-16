// featuredSectionModel.js
const mongoose = require('mongoose');

const featuredSectionSchema = new mongoose.Schema({
    category: { type: String, required: true, trim: true },
    subCategory: { type: String, trim: true, default: null },
    priority: { type: Number, default: 1, min: 1, max: 100 },
    isActive: { type: Boolean, default: true },
    description: { type: String, trim: true, maxlength: 500 },
    // Add image fields
    image: { type: String, trim: true, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Index for better query performance
featuredSectionSchema.index({ category: 1, subCategory: 1 });
featuredSectionSchema.index({ priority: 1, isActive: 1 });

// Pre-save middleware to update updatedAt
featuredSectionSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const FeaturedSection = mongoose.model('FeaturedSection', featuredSectionSchema);

module.exports = FeaturedSection;