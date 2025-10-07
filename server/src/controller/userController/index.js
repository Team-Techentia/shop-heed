const userModel = require("../../Model/userModel");
const validator = require("../../validator/validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config()
const checkIsLogin = async function (req, res) {
  try {
    return res.status(200).json({ success: true, message: "User found" });
  } catch (error) { }
};

const checkUser = async function (req, res) {
  try {
    const { email, phoneNumber } = req.body;

    const data = { email, phoneNumber };

    if (!Object.keys(data)) {
      return res
        .status(404)
        .json({ success: false, message: "Please provide data for register" });
    }
    if (!validator.isValid(email)) {
      return res
        .status(404)
        .json({ success: false, message: "Please provide email for register" });
    }
    if (!validator.isValid(phoneNumber)) {
      return res.status(404).json({
        success: false,
        message: "Please provide phone Number for register",
      });
    }
    const findUserPhoneNumber = await userModel.findOne({
      phoneNumber: phoneNumber,
    });

    if (findUserPhoneNumber) {
      return res
        .status(200)
        .json({ success: false, exists: true, exists: true, message: "Phone number already exist" });
    }
    const findUserEmail = await userModel.findOne({ email: email });
    if (findUserEmail) {
      return res
        .status(200)
        .json({ success: false, exists: true, message: "Email already exist" });
    }

    return res.status(200).json({ success: true, exists: false, message: "User doesn't exist" });
  } catch (error) {

    res.status(500).json({ success: false, message: "Internal server error",error });
  }
};

const checkMobile = async function (req, res) {
  try {
    const { phoneNumber } = req.body;

    if (!validator.isValid(phoneNumber)) {
      return res.status(404).json({
        success: false,
        message: "Please provide phone Number for register",
      });
    }
    const findUserPhoneNumber = await userModel.findOne({
      phoneNumber: phoneNumber,
    });

    // checkMobile
    if (findUserPhoneNumber) {
      return res.status(200).json({ success: true, exists: true, message: "Phone number already exists" });
    }
    return res.status(200).json({ success: true, exists: false, message: "Phone number not registered" });

  } catch (error) {

    res.status(500).json({ success: false, message: "Internal server error",error });
  }
};

const signUp = async function (req, res) {
  try {
    const { name, email, phoneNumber } = req.body;

    const data = { name, email, phoneNumber };

    if (!Object.keys(data)) {
      return res
        .status(404)
        .json({ success: false, message: "Please provide data for register" });
    }

    if (!validator.isValid(name)) {
      return res
        .status(404)
        .json({ success: false, message: "Please provide name for register" });
    }
    if (!validator.isRightFormatemail(email)) {
      return res.status(404).json({
        success: false,
        message: "Please provide a valid email for register",
      });
    }
    if (!validator.isRightFormatPhoneNumber(phoneNumber)) {
      return res.status(404).json({
        success: false,
        message: "Please provide phone Number for register",
      });
    }
    // if (!validator.isValid(password)) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Please provide password for register",
    //   });
    // }

    // const hashpassword = await bcrypt.hash(password, 10);

    // req.body.password = hashpassword;
    const newUser = new userModel(req.body);
    const user = await newUser.save();
    if (user) {
      const { name, email, phoneNumber } = user;

      const token = jwt.sign(
        {
          userId: user._id.toString(),
          role: user.role,
          iat: new Date().getTime() / 1000,
        },
        process.env.JWT_SECRET_KEY
      );
      await userModel.findByIdAndUpdate(
        user._id,
        { $set: { lastLogin: Date.now() } },
        { new: true }
      );
      return res.status(200).json({
        msg: "Signup successful",
        data: { name, email, phoneNumber },
        token,
      });
    }
  } catch (error) {

    return res
      .status(500)
      .json({ success: false, message: "Internal server error",error });
  }
};

const loginUser = async function (req, res) {
  try {
    const { emailOrPhone } = req.body;
    if (!validator.isValid(emailOrPhone)) {
      return res.status(404).json({
        success: false,
        message: "Email or phone is require for login",
      });
    }
    // if (!validator.isValid(password)) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "Password is require for login" });
    // }

    let user;

    if (emailOrPhone.includes("@")) {
      user = await userModel.findOne({ email: emailOrPhone });
    } else {
      user = await userModel.findOne({ phoneNumber: emailOrPhone });
    }
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // const match = await bcrypt.compare(password, user.password);

    if (match) {
      const token = jwt.sign(
        { userId: user._id.toString(), role: user.role },
        process.env.JWT_SECRET_KEY
      );
      await userModel.findByIdAndUpdate(
        user._id,
        { $set: { lastLogin: Date.now() } },
        { new: true }
      );
      return res.status(200).json({
        token: token,
        data: {
          email: user.email,
          name: user.name,
          photo: user.photo,
          role: user.role,
        },
        message: "Login Successfully",
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Password does not match" });
    }
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ success: false, message: "Internal server error",error });
  }
};

const loginRegisterForCheckOutPage = async function (req, res) {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber || !validator.isValid(phoneNumber)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid mobile number" });
    }
    let user = await userModel.findOne({ phoneNumber: phoneNumber });
    if (!user) {
      return res
        .status(200)
        .json({ message: false, message: "user not found" });
    }
    await userModel.findByIdAndUpdate(
      user._id,
      { $set: { lastLogin: Date.now() } },
      { new: true }
    );
    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      process.env.JWT_SECRET_KEY
    );
    return res
      .status(200)
      .json({ success: true, message: "Successfully logged in", token });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error",error });
  }
};



const forgetPassword = async function (req, res) {
  try {
    const data = req.body;
    const emailORMobile = data.emailORMobile;
    const password = data.password;

    if (emailORMobile) {
      let user;
      if (emailORMobile.includes("@")) {
        user = await userModel.findOne({ email: emailORMobile });
      } else {
        user = await userModel.findOne({ mobileNumber: emailORMobile });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const updatePassword = await userModel.findByIdAndUpdate(
        user._id,
        { $set: { password: hashedPassword } },
        { new: true }
      );
      if (updatePassword) {
        return res
          .status(200)
          .json({ success: true, message: "Successfully reset password" });
      }
    }
  } catch (error) {

    res.status(500).json({ success: false, message: "Internal server error",error });
  }
};

const changePassword = async function (req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword) {
      return res.status(404).json({
        success: false,
        message: "Please enter your current password",
      });
    }

    if (!newPassword) {
      return res
        .status(404)
        .json({ success: false, message: "Please enter your new password" });
    }

    const user = await userModel.findById(req._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const matchPassword = await bcrypt.compare(currentPassword, user.password);

    if (!matchPassword) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const changePassword = await userModel.findByIdAndUpdate(
      req._id,
      { $set: { password: hashedPassword } },
      { new: true }
    );

    if (changePassword) {
      return res.status(200).json({
        success: true,
        message: "Password changed successfully",
        data: changePassword,
      });
    }

    return res
      .status(400)
      .json({ success: false, message: "Something went wrong" });
  } catch (error) {

    return res
      .status(500)
      .json({ success: false, message: "Internal server error",error });
  }
};

const isRightFormatPhoneNumber = function (phone) {
  return /^[0]?[6789]\d{9,11}$/.test(phone);
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const profileChange = async function (req, res) {
  try {
    const { name, email, phoneNumber } = req.body;
    const userId = req._id;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID not provided" });
    }

    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!name || !email || !phoneNumber) {
      return res
        .status(400)
        .json({ success: false, message: "All fields  are required" });
    }

    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    if (!isRightFormatPhoneNumber(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be between 10 and 12 digits",
      });
    }

    if (email !== existingUser.email) {
      const emailExists = await userModel.findOne({ email });
      if (emailExists) {
        return res
          .status(400)
          .json({ success: false, message: "Email is already registered" });
      }
    }

    if (phoneNumber !== existingUser.phoneNumber) {
      const phoneExists = await userModel.findOne({ phoneNumber });
      if (phoneExists) {
        return res.status(400).json({
          success: false,
          message: "Phone number is already registered",
        });
      }
    }

    const updateData = {
      name,
      email,
      phoneNumber,
    };

    const updatedProfile = await userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedProfile) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      data: updatedProfile,
      message: "Profile updated successfully",
    });
  } catch (error) {

    return res
      .status(500)
      .json({ success: false, message: "Internal server error",error });
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
      .json({ success: false, message: "Internal server error",error });
  }
};

const deleteUser = async function (req, res) {
  try {
    const userId = req._id;
    if (!userId) {
      return res
        .status(400)
        .josn({ success: false, message: "User is missing" });
    }

    const deletedId = req.params.id;

    if (!deletedId) {
      return res
        .status(400)
        .json({ success: false, message: "User id not provided" });
    }

    const deleteUser = await userModel.findByIdAndDelete(deletedId);

    if (!deleteUser) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to delete user" });
    }
    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {

    return res
      .status(500)
      .json({ success: false, message: "Internal server error",error });
  }
};

const ChangeNumber = async function (req, res) {
  try {
    const userId = req._id;
    const phoneNumber = req.params.number;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is missing" });
    }

    const checkUser = await userModel.findOne({ phoneNumber: phoneNumber });
    if (checkUser) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number is already registered" });
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { _id: userId },
      { phoneNumber: phoneNumber },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to change phone number" });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Phone number updated successfully",
        user: updatedUser,
      });
  } catch (error) {

    return res
      .status(500)
      .json({ success: false, message: "Internal server error",error });
  }
};

module.exports = {
  signUp,
  loginUser,
  forgetPassword,
  changePassword,
  profileChange,
  checkUser,
  checkIsLogin,
  getUserById,
  loginRegisterForCheckOutPage,
  checkMobile,
  deleteUser,
  ChangeNumber
};
