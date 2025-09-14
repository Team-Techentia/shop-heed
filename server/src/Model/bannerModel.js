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
        default: "home",
        enum: ["home"]
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
        
    clickAction: {
        type: String,
        enum: ['none', 'category', 'subcategory'],
        default: 'none'
    },
        
    // CHANGED: String instead of ObjectId to store category values like "shirt"
    targetCategory: {
        type: String,  // Changed from ObjectId
        default: null
    },
        
    // CHANGED: String instead of ObjectId to store subcategory values like "half-sleeve-shirt"
    targetSubCategory: {
        type: String,  // Changed from ObjectId  
        default: null
    }
    
}, {
    timestamps: true
});

bannerSchema.index({ bannerType: 1, isActive: 1, priority: 1 });

module.exports = mongoose.model('Banner', bannerSchema);