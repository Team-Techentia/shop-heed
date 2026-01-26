const userModel = require("../../Model/userModel");
const validator = require("../../validator/validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

// ============================================
// USER SIDE - MOBILE OTP BASED AUTHENTICATION
// ============================================

// Check if user is logged in (middleware se aayega)
const checkIsLogin = async function (req, res) {
  try {
    return res.status(200).json({
      success: true,
      message: "User found"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error
    });
  }
};

// Step 1: Check if mobile number exists (USER FLOW)
const checkMobile = async function (req, res) {
  try {
    const { phoneNumber } = req.body;

    if (!validator.isValid(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Please provide phone number",
      });
    }

    if (!validator.isRightFormatPhoneNumber(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format",
      });
    }

    const user = await userModel.findOne({
      phoneNumber: phoneNumber,
      role: 'user' // Only check for users, not admins
    });

    if (user) {
      return res.status(200).json({
        success: true,
        exists: true,
        isNewUser: false,
        message: "Phone number registered. OTP will be sent.",
      });
    }

    return res.status(200).json({
      success: true,
      exists: false,
      isNewUser: true,
      message: "New user. Please provide name after OTP verification.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

// Step 2: Signup (after OTP verification for new users)
// Step 2: Signup (after OTP verification for new users)
const signUp = async function (req, res) {
  try {
    const { name, phoneNumber } = req.body;

    console.log("📝 Signup Request:", { name, phoneNumber });

    // ✅ VALIDATION
    if (!validator.isValid(name)) {
      return res.status(400).json({
        success: false,
        message: "Please provide name",
      });
    }

    if (!validator.isValid(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Please provide phone number",
      });
    }

    if (!validator.isRightFormatPhoneNumber(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format",
      });
    }

    // ✅ CHECK IF ALREADY EXISTS
    const existingUser = await userModel.findOne({
      phoneNumber: phoneNumber,
      role: 'user',
      isDeleted: false  // 🔥 Added isDeleted check
    });

    if (existingUser) {
      console.log("❌ User already exists:", phoneNumber);
      return res.status(400).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    // ✅ CREATE NEW USER
    const newUser = new userModel({
      name: name.trim(),
      phoneNumber: phoneNumber,
      role: 'user',
      isDeleted: false,  // 🔥 Explicitly set isDeleted
      lastLogin: Date.now()
    });

    console.log("💾 Saving user...");
    const user = await newUser.save();
    console.log("✅ User saved:", user._id);

    // ✅ GENERATE TOKEN
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '7d' }
    );

    console.log("✅ Token generated");

    return res.status(200).json({
      success: true,
      message: "Signup successful",
      data: {
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role
      },
      token,
    });

  } catch (error) {
    console.error("❌ Signup Error:", error);
    console.error("Error Stack:", error.stack);

    // 🔥 BETTER ERROR MESSAGES
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.message,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,  // 🔥 Send actual error message for debugging
    });
  }
};

// Step 3: Login (after OTP verification for existing users)
const loginUser = async function (req, res) {
  try {
    const { phoneNumber } = req.body;

    if (!validator.isValid(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const user = await userModel.findOne({
      phoneNumber: phoneNumber,
      role: 'user',
      isDeleted: false
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update last login
    await userModel.findByIdAndUpdate(
      user._id,
      { $set: { lastLogin: Date.now() } },
      { new: true }
    );

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      token: token,
      data: {
        name: user.name,
        phoneNumber: user.phoneNumber,
        email: user.email,
        role: user.role,
      },
      message: "Login Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

// ============================================
// ADMIN SIDE - EMAIL + PASSWORD AUTHENTICATION
// ============================================

// Admin Login (Email + Password)
const adminLogin = async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!validator.isValid(email)) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!validator.isValid(password)) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    // Find admin user only
    const admin = await userModel.findOne({
      email: email,
      role: 'admin',
      isDeleted: false
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (!admin.password) {
      return res.status(400).json({
        success: false,
        message: "Password not set for this admin",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Update last login
    await userModel.findByIdAndUpdate(
      admin._id,
      { $set: { lastLogin: Date.now() } },
      { new: true }
    );

    const token = jwt.sign(
      {
        userId: admin._id.toString(),
        role: admin.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      token: token,
      data: {
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      message: "Admin login successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

// Create Admin (Protected - only existing admin can create)
const createAdmin = async function (req, res) {
  try {
    const { name, email, password, phoneNumber } = req.body;

    // BASIC VALIDATION
    if (!validator.isValid(name))
      return res.status(400).json({ success: false, message: "Name is required" });

    if (!validator.isValid(email))
      return res.status(400).json({ success: false, message: "Email is required" });

    if (!validator.isValid(password))
      return res.status(400).json({ success: false, message: "Password is required" });

    if (!validator.isRightFormatPhoneNumber(phoneNumber))
      return res.status(400).json({ success: false, message: "Valid phone number is required" });

    // CHECK EXISTING ADMIN COUNT
    // CHECK EXISTING ADMIN COUNT
    const adminCount = await userModel.countDocuments({
      role: "admin",
      isDeleted: false,
    });

    // 🔐 IF ADMIN EXISTS → TOKEN REQUIRED
    if (adminCount > 0) {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "Token required",
        });
      }

      const token = authHeader.split(" ")[1];

      if (!token || token === "null" || token === "undefined") {
        return res.status(401).json({
          success: false,
          message: "Invalid token",
        });
      }

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      } catch (err) {
        return res.status(401).json({
          success: false,
          message: "Invalid token",
        });
      }

      if (decoded.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Admin access required",
        });
      }
    }


    // CHECK EMAIL DUPLICATE
    const existingAdmin = await userModel.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE ADMIN
    const admin = await userModel.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role: "admin",
      lastLogin: Date.now(),
    });

    return res.status(201).json({
      success: true,
      message:
        adminCount === 0
          ? "First admin created successfully"
          : "Admin created successfully",
      data: {
        name: admin.name,
        email: admin.email,
        phoneNumber: admin.phoneNumber,
        role: admin.role,
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ============================================
// COMMON FUNCTIONS
// ============================================

const changePassword = async function (req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword) {
      return res.status(400).json({
        success: false,
        message: "Please enter your current password",
      });
    }

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please enter your new password",
      });
    }

    const user = await userModel.findById(req._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const matchPassword = await bcrypt.compare(currentPassword, user.password);

    if (!matchPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid current password",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userModel.findByIdAndUpdate(
      req._id,
      { $set: { password: hashedPassword } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

const getUserById = async function (req, res) {
  try {
    const user = await userModel.findById(req._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res
      .status(200)
      .json({ success: true, data: user, message: "successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

const profileChange = async function (req, res) {
  try {
    const { name, email, phoneNumber } = req.body;
    const userId = req._id;

    const existingUser = await userModel.findById(userId);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updateData = {};

    if (name) updateData.name = name;
    if (email && email !== existingUser.email) {
      const emailExists = await userModel.findOne({ email, _id: { $ne: userId } });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email is already registered",
        });
      }
      updateData.email = email;
    }

    if (phoneNumber && phoneNumber !== existingUser.phoneNumber) {
      const phoneExists = await userModel.findOne({ phoneNumber, _id: { $ne: userId } });
      if (phoneExists) {
        return res.status(400).json({
          success: false,
          message: "Phone number is already registered",
        });
      }
      updateData.phoneNumber = phoneNumber;
    }

    const updatedProfile = await userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select('-password');

    return res.status(200).json({
      success: true,
      data: updatedProfile,
      message: "Profile updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

const deleteUser = async function (req, res) {
  try {
    const id = req.params.id;
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Soft delete
    await userModel.findByIdAndUpdate(id, { isDeleted: true });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

module.exports = {
  // User authentication (Mobile OTP based)
  checkMobile,
  signUp,
  loginUser,

  // Admin authentication (Email + Password)
  adminLogin,
  createAdmin,

  // Common
  checkIsLogin,
  changePassword,
  getUserById,
  profileChange,
  deleteUser, // Added
};