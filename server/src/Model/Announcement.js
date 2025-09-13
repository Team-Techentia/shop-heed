const mongoose = require("mongoose");
const { Schema } = mongoose;

const headerLineSchema = new Schema({
  text: {
    type: String,
    required: [true, "Header line text is required"],
    maxlength: [500, "Header line text must be less than 500 characters"],
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: false, // New header lines start as inactive
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to update updatedAt and ensure only one active header line
headerLineSchema.pre("save", async function (next) {
  this.updatedAt = new Date();
  
  // If this header line is being set to active, deactivate all others
  if (this.isActive && this.isModified('isActive')) {
    try {
      await this.constructor.updateMany(
        { _id: { $ne: this._id }, isActive: true },
        { $set: { isActive: false, updatedAt: new Date() } }
      );
    } catch (error) {
      return next(error);
    }
  }
  
  next();
});

// Index for faster queries
headerLineSchema.index({ isActive: 1, updatedAt: -1 });

module.exports = mongoose.model("HeaderLine", headerLineSchema);