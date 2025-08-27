const mongoose = require("mongoose")


const otpSchema = new mongoose.Schema({

    phoneNumber: {
        type:String
    } , 
    otp:{
        type:String
    },otpType:{
        type:String
    } , 
    email:{
        type:String
        
    }
   
  }, { timestamps: true });
  
  const User = mongoose.model('otpModel', otpSchema);
  
  module.exports = User;