const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "userModel", required: true },
  
  label: { type: String, default: "Other" }, // Home, Work, Other, or custom
  isDefault: { type: Boolean, default: false },

  firstName: { type: String, required: true },
  lastName: { type: String },
  phone: { type: String, required: true, match: /\d{10}/ },
  email: { type: String },

  state: { type: String, required: true },
  city: { type: String, required: true },
  addressLine: { type: String, required: true },
  pincode: { type: String, required: true },

}, { timestamps: true });

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
