const mongoose = require('mongoose');

const promocodeSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    startDate: { type: Date, default: null }, // Made optional
    endDate: { type: Date, default: null }, // Made optional
    freeShipping: { type: Boolean, default: false },
    usedQuantity: { type: Number, default: 0 },
    discountType: { type: String, enum: ['percent', 'fixed'], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    status: { type: Boolean, default: false }, // Changed default to false for security
    // Restriction fields
    categories: [{ type: String, trim: true }],
    minimumSpend: { type: Number, default: null },
    // Usage limits
    perLimit: { type: Number, default: null }, // Total usage limit
    perCustomer: { type: Number, default: null }, // Usage limit per customer, null means unlimited
    usedBy: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, usageCount: { type: Number, default: 0 } }],
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

// Index for better query performance
promocodeSchema.index({ code: 1 });
promocodeSchema.index({ status: 1 });
promocodeSchema.index({ startDate: 1, endDate: 1 });

// Virtual to check if promocode is active
promocodeSchema.virtual('isActive').get(function () {
    const now = new Date();
    
    // Basic status check
    if (!this.status || this.isDeleted) return false;
    
    // Date range check (if dates are set)
    if (this.startDate && this.startDate > now) return false;
    if (this.endDate && this.endDate < now) return false;
    
    // Total usage limit check (if perLimit is set)
    if (this.perLimit && this.usedQuantity >= this.perLimit) return false;
    
    // Legacy quantity check (if quantity is set)
    if (this.quantity && this.usedQuantity >= this.quantity) return false;
    
    return true;
});

// Method to check if promocode can be used by a specific user
promocodeSchema.methods.canBeUsedByUser = function (userId) {
    if (!this.isActive) return false;
    
    // If no per customer limit is set, allow usage
    if (!this.perCustomer) return true;

    const userUsage = this.usedBy.find(usage => usage.userId.toString() === userId.toString());
    const currentUsage = userUsage ? userUsage.usageCount : 0;

    return currentUsage < this.perCustomer;
};

// Method to apply promocode usage
promocodeSchema.methods.applyUsage = function (userId) {
    this.usedQuantity += 1;

    const userUsage = this.usedBy.find(usage => usage.userId.toString() === userId.toString());
    if (userUsage) {
        userUsage.usageCount += 1;
    } else {
        this.usedBy.push({ userId, usageCount: 1 });
    }

    return this.save();
};

module.exports = mongoose.model('Promocode', promocodeSchema);