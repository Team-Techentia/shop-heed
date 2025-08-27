const otpModel = require("../../Model/otpModel");
const userModel = require("../../Model/userModel");
const axios = require("axios");
const { EmailSendComponent } = require("../emailController");
require("dotenv").config()


const otpStorage = {};


function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function sendOTP(phoneNumber, otp, otpType) {


  return {
    otp: otp,
    phoneNumber: phoneNumber,
    otpType: otpType
  }

}


const sendOtp = async function (req, res) {
  const { phoneNumber, otpType, email } = req.body;

  const otp = generateOtp();

  if (phoneNumber) {

    otpStorage[phoneNumber] = otp;
    const data = sendOTP(phoneNumber, otp, otpType);

    const CheckUser = await otpModel.findOneAndDelete({ phoneNumber: phoneNumber, otpType: otpType });

    const postData = new otpModel(data);
    const user_otp = await postData.save();

    if (user_otp) {

      try {
        if (user_otp.otpType === "Text_Message") {
          const response = await axios.post(`${process.env.AUTHKEY_URL}=${process.env.AUTHKEY_SECRET_KEY}&mobile=${user_otp.phoneNumber}&country_code=91&sid=${process.env.AUTHKEY_SID_KEY}&name=Twinkle&otp=${user_otp.otp}`)
          return res.send({ success: true, message: 'OTP sent successfully',  });

        } else if (user_otp.otpType === "Phone_Call") {


          const response = await axios.post(`${process.env.AUTHKEY_URL}=${process.env.AUTHKEY_SECRET_KEY}&mobile=${user_otp.phoneNumber}&country_code=91&voice=Hello, I am from ShopHeed your  OTP is ${user_otp.otp} again your  OTP is ${user_otp.otp} again your  OTP is ${user_otp.otp}`)
          return res.send({ success: true, message: 'OTP sent successfully', });
        }
        

      } catch (error) {
        return res.status(500).send({ success: false, message: 'Error sending OTP via Authkey.io' });
      }

    }
  }
  if (email) {

    const checkMobile = await userModel.findOne({ email: email })

  
    otpStorage[email] = otp;
    const data = sendOTP(email, otp, "email");

    const CheckUser = await otpModel.findOneAndDelete({ email: email, otpType: "email" });

    const postData = new otpModel({ email: data.phoneNumber, otpType: "email", otp: data.otp });
    const user_otp = await postData.save();
    if (user_otp.otpType==="email") {
      const html = `<!DOCTYPE html>
      <html>
      <head>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f2f2f2;
              }
              .container {
                  width: 80%;
                  margin: auto;
                  padding: 20px;
                  background-color: #fff;
                  border: 1px solid #ddd;
                  border-radius: 5px;
                  margin-top: 50px;
                  box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
              }
              .container h2 {
                  color: #4CAF50;
                  margin-top: 0;
              }
              .container p {
                  color: #333;
              }
              .verification-code {
                  color: #4CAF50;
                  font-size: 2rem;
                  font-weight: bold;
                  margin: 20px 0;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div style="font-family: Helvetica,Arial,sans-serif;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:90%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600"> <img height="40px" width="80px" src="https://shopheed.com/assets/images/icon/logo.png" /> </a>
          </div>
          <p style="font-size:1.1em">Hi,</p>
          <p>This OTP is valid for 5 mins. Never share this OTP with anyone else.</p>
          <h2 style="background: #000000;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${user_otp.otp}</h2>
      
      <p> Security Tip - If you did not request this OTP, or if you feel someone else may be trying to login to your account, please change your password immediately &  <a href="https://shopheed.com/contact-us" style="font-size:1.4em;color: #000000;text-decoration:none;font-weight:600"> Contact Us.  </a> Do not use your password anywhere else. </p>
          <p style="font-size:0.9em;">Regards,<br />Shop Heed</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
           
          </div>
        </div>
      </div>
          </div>
      </body>
      </html>`

      EmailSendComponent(user_otp.email , "OTP from Heed" ,html)

      return res.status(200).send({message:"OTP sent successfully" , status:true})

    }
  }

};





const verifyOtp = async function (req, res) {

  try {
    const data = req.body


    if (data.phoneNumber) {
   
   
      const userMobile = await otpModel.findOne({ phoneNumber: data.phoneNumber, otpType: data.otpType, otp: data.otp })
      if (userMobile) {
        return res.status(200).json({ success: true, message: "verification successfuy via phone number" })
      } else {
        return res.status(404).json({ success: false, message: "invalid otp for phone" })
      }
    }


    if (data.email) {
      req.body.otpType = "email"
    
      const userEmail = await otpModel.findOne({ email: data.email, otpType: data.otpType, otp: data.otp })
      if (userEmail) {
        return res.status(200).json({ success: true, message: "verification successfuy via email" })
      } else {
        return res.status(400).send({ status: false, message: "Invalid OTP  for email" })
      }
    }

  } catch (error) {
   
    return res.status(500).json({ success: false, message: "internal server error" })
  }


}





module.exports = { sendOtp, verifyOtp }