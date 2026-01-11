const jwt = require("jsonwebtoken");
require("dotenv").config();

// Verify JWT Token
const authenticateToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.headers.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token is required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req._id = decoded.userId;
    req.role = decoded.role;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// Check if user is authorized (both user and admin)
const userAuthorisation = (req, res, next) => {
  try {
    if (!req._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authorization error",
      error,
    });
  }
};

// Check if user is admin
const adminAuthorisation = (req, res, next) => {
  try {
    if (!req._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (req.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authorization error",
      error,
    });
  }
};

module.exports = {
  authenticateToken,
  userAuthorisation,
  adminAuthorisation,
};
