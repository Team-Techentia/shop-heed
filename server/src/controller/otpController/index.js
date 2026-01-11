const otpModel = require("../../Model/otpModel");
const userModel = require("../../Model/userModel");
const axios = require("axios");
const { EmailSendComponent } = require("../emailController");
require("dotenv").config();

// Generate 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ============================================
// SEND OTP - FIXED VERSION
// ============================================
const sendOtp = async function (req, res) {
  try {
    const { phoneNumber, otpType, email } = req.body;

    // Validate input
    if (!phoneNumber && !email) {
      return res.status(400).json({ 
        success: false, 
        message: "Phone number or email is required" 
      });
    }

    const otp = generateOtp();

    // ============================================
    // PHONE NUMBER OTP
    // ============================================
    if (phoneNumber) {
      // Validate OTP type
      if (!otpType || !["Text_Message", "Phone_Call"].includes(otpType)) {
        return res.status(400).json({ 
          success: false, 
          message: "Valid otpType required (Text_Message or Phone_Call)" 
        });
      }

      // Delete existing OTP for this number
      await otpModel.findOneAndDelete({ 
        phoneNumber: phoneNumber, 
        otpType: otpType 
      });

      // Save new OTP
      const otpData = new otpModel({
        phoneNumber: phoneNumber,
        otp: otp,
        otpType: otpType,
        createdAt: new Date(),
      });

      const savedOtp = await otpData.save();

      if (!savedOtp) {
        return res.status(500).json({ 
          success: false, 
          message: "Failed to save OTP" 
        });
      }

      // Send OTP via SMS or Call
      try {
        let response;

        if (otpType === "Text_Message") {
          response = await axios.post(
            `${process.env.AUTHKEY_URL}=${process.env.AUTHKEY_SECRET_KEY}&mobile=${phoneNumber}&country_code=91&sid=${process.env.AUTHKEY_SID_KEY}&name=Twinkle&otp=${otp}`
          );
        } else if (otpType === "Phone_Call") {
          response = await axios.post(
            `${process.env.AUTHKEY_URL}=${process.env.AUTHKEY_SECRET_KEY}&mobile=${phoneNumber}&country_code=91&voice=Hello, I am from ShopHeed your OTP is ${otp} again your OTP is ${otp} again your OTP is ${otp}`
          );
        }

        console.log("✅ OTP sent successfully to:", phoneNumber);
        
        return res.status(200).json({ 
          success: true, 
          message: "OTP sent successfully" 
        });

      } catch (smsError) {
        console.error("❌ SMS API Error:", smsError.message);
        
        // Delete saved OTP if SMS failed
        await otpModel.findByIdAndDelete(savedOtp._id);
        
        return res.status(500).json({ 
          success: false, 
          message: "Failed to send OTP via SMS provider" 
        });
      }
    }

    // ============================================
    // EMAIL OTP
    // ============================================
    if (email) {
      // Delete existing OTP for this email
      await otpModel.findOneAndDelete({ 
        email: email, 
        otpType: "email" 
      });

      // Save new OTP
      const otpData = new otpModel({
        email: email,
        otp: otp,
        otpType: "email",
        createdAt: new Date(),
      });

      const savedOtp = await otpData.save();

      if (!savedOtp) {
        return res.status(500).json({ 
          success: false, 
          message: "Failed to save OTP" 
        });
      }

      // Send email
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
                    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">
                        <img height="40px" width="80px" src="https://shopheed.com/assets/images/icon/logo.png" />
                    </a>
                </div>
                <p style="font-size:1.1em">Hi,</p>
                <p>This OTP is valid for 5 mins. Never share this OTP with anyone else.</p>
                <h2 style="background: #000000;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                <p>Security Tip - If you did not request this OTP, or if you feel someone else may be trying to login to your account, please change your password immediately & <a href="https://shopheed.com/contact-us" style="font-size:1.4em;color: #000000;text-decoration:none;font-weight:600">Contact Us.</a> Do not use your password anywhere else.</p>
                <p style="font-size:0.9em;">Regards,<br />Shop Heed</p>
                <hr style="border:none;border-top:1px solid #eee" />
            </div>
        </div>
    </div>
</body>
</html>`;

      try {
        await EmailSendComponent(email, "OTP from Heed", html);
        
        console.log("✅ OTP sent successfully to:", email);
        
        return res.status(200).json({ 
          success: true, 
          message: "OTP sent successfully" 
        });
      } catch (emailError) {
        console.error("❌ Email Error:", emailError.message);
        
        // Delete saved OTP if email failed
        await otpModel.findByIdAndDelete(savedOtp._id);
        
        return res.status(500).json({ 
          success: false, 
          message: "Failed to send OTP via email" 
        });
      }
    }

  } catch (error) {
    console.error("❌ Send OTP Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// ============================================
// VERIFY OTP - FIXED VERSION
// ============================================
const verifyOtp = async function (req, res) {
  try {
    const { phoneNumber, email, otp, otpType } = req.body;

    // Validate input
    if (!otp) {
      return res.status(400).json({ 
        success: false, 
        message: "OTP is required" 
      });
    }

    if (!phoneNumber && !email) {
      return res.status(400).json({ 
        success: false, 
        message: "Phone number or email is required" 
      });
    }

    // ============================================
    // PHONE NUMBER VERIFICATION
    // ============================================
    if (phoneNumber) {
      if (!otpType) {
        return res.status(400).json({ 
          success: false, 
          message: "otpType is required for phone verification" 
        });
      }

      const otpRecord = await otpModel.findOne({ 
        phoneNumber: phoneNumber, 
        otpType: otpType, 
        otp: otp 
      });

      if (!otpRecord) {
        return res.status(400).json({ 
          success: false, 
          verified: false,
          message: "Invalid OTP" 
        });
      }

      // Check if OTP expired (5 minutes)
      const otpAge = Date.now() - new Date(otpRecord.createdAt).getTime();
      if (otpAge > 5 * 60 * 1000) {
        await otpModel.findByIdAndDelete(otpRecord._id);
        return res.status(400).json({ 
          success: false, 
          verified: false,
          message: "OTP expired" 
        });
      }

      // Delete OTP after successful verification
      await otpModel.findByIdAndDelete(otpRecord._id);

      console.log("✅ Phone OTP verified:", phoneNumber);

      return res.status(200).json({ 
        success: true, 
        verified: true,
        message: "OTP verified successfully" 
      });
    }

    // ============================================
    // EMAIL VERIFICATION
    // ============================================
    if (email) {
      const otpRecord = await otpModel.findOne({ 
        email: email, 
        otpType: "email", 
        otp: otp 
      });

      if (!otpRecord) {
        return res.status(400).json({ 
          success: false, 
          verified: false,
          message: "Invalid OTP" 
        });
      }

      // Check if OTP expired (5 minutes)
      const otpAge = Date.now() - new Date(otpRecord.createdAt).getTime();
      if (otpAge > 5 * 60 * 1000) {
        await otpModel.findByIdAndDelete(otpRecord._id);
        return res.status(400).json({ 
          success: false, 
          verified: false,
          message: "OTP expired" 
        });
      }

      // Delete OTP after successful verification
      await otpModel.findByIdAndDelete(otpRecord._id);

      console.log("✅ Email OTP verified:", email);

      return res.status(200).json({ 
        success: true, 
        verified: true,
        message: "OTP verified successfully" 
      });
    }

  } catch (error) {
    console.error("❌ Verify OTP Error:", error);
    return res.status(500).json({ 
      success: false, 
      verified: false,
      message: "Internal server error" 
    });
  }
};

module.exports = { sendOtp, verifyOtp };