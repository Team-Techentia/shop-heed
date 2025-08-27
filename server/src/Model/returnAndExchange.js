const mongoose = require("mongoose");

module.exports = mongoose.model(
  "returnAndExchange",
  new mongoose.Schema(
    {
      orderId: {
        type: String,
      },
      name: {
        type: String,
      },
      
      email: {
        type: String,
        lowercase: true,
      },
      phone: {
        type: String,
      },
      option:{
        type:String,
        enums:["return","exchange"],
        default:"exchange"
      },
      message: {
        type: String,
      },
    },
    { timestamps: true }
  )
);
