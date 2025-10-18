const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    
    number: {
        type: String,
        required: true,
        trim: true
    },
    
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    
    message: {
        type: String,
        required: true,
        trim: true
    },
    
    isApproved: {
        type: Boolean,
        default: false
    },
    
    isPublished: {
        type: Boolean,
        default: false
    },
    
    // For admin to add notes
    adminNotes: {
        type: String,
        default: ''
    },
    
    // Email sent status
    emailSent: {
        type: Boolean,
        default: false
    },
    
    emailSentAt: {
        type: Date,
        default: null
    }
    
}, {
    timestamps: true
});

// Indexes for better query performance
reviewSchema.index({ isApproved: 1, isPublished: 1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ email: 1 });

module.exports = mongoose.model('Review', reviewSchema);