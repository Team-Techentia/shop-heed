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
      unique: true,
      match: [/.+@.+\..+/, "Invalid email format"],
    },
    password: {
      type: String,
      // Only required for admin, not for users (OTP login)
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
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

// Index for faster queries
userSchema.index({ phoneNumber: 1, role: 1 });
userSchema.index({ email: 1, role: 1 });

const user = mongoose.model("userModel", userSchema);

module.exports = user;