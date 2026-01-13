const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      sparse: true, // Allows null/undefined for users (only required for admin)
      // ❌ REMOVED: unique: true (will add partial index below)
      match: [/.+@.+\..+/, "Invalid email format"],
    },
    password: {
      type: String,
      // Only required for admin, not for users (OTP login)
    },
    phoneNumber: {
      type: String,
      required: true,
      // ❌ REMOVED: unique: true (will add partial index below)
      match: [/^[0]?[6789]\d{9,11}$/, "Phone number must be between 10 and 12 digits"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    uid: {
      type: String,
    },
    lastLogin: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ PARTIAL UNIQUE INDEX - Only for non-deleted users
// This ensures phoneNumber uniqueness only for active users
userSchema.index(
  { phoneNumber: 1, role: 1 },
  { 
    unique: true,
    partialFilterExpression: { isDeleted: false }
  }
);

// ✅ PARTIAL UNIQUE INDEX for email - Only for non-deleted users with email
userSchema.index(
  { email: 1, role: 1 },
  { 
    unique: true,
    sparse: true,
    partialFilterExpression: { isDeleted: false, email: { $exists: true, $ne: null } }
  }
);

// Regular index for faster queries
userSchema.index({ role: 1, isDeleted: 1 });

const user = mongoose.model("userModel", userSchema);

module.exports = user;