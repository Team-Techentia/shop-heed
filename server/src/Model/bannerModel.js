const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    
    image: {
        type: String,
        required: true
    },
    
    bannerType: {
        type: String,
        default: "home", // Always home
        enum: ["home"] // Restrict to home-only
    },
    
    isActive: {
        type: Boolean,
        default: true
    },
    
    priority: {
        type: Number,
        default: 1,
        min: 1,
        max: 10
    },
    
    // Click destination options (link to page)
    clickAction: {
        type: String,
        enum: ['none', 'category', 'subcategory'],
        default: 'none'
    },
    
    // For category page navigation
    targetCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    
    // For subcategory page navigation  
    targetSubCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        default: null
    }
    
}, {
    timestamps: true
});

// Index for better query performance
bannerSchema.index({ bannerType: 1, isActive: 1, priority: 1 });

module.exports = mongoose.model('Banner', bannerSchema);