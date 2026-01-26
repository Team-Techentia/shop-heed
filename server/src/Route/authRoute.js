const express = require("express");
const authRoute = express();
const user = require("../controller/userController/index");
const otp = require("../controller/otpController/index");
const auth = require("../auth/index");
const { getAllUser } = require("../controller/adminController/user");

const { authenticateToken, userAuthorisation, adminAuthorisation } = auth;

// ============================================
// USER ROUTES - MOBILE OTP BASED
// ============================================

// Step 1: Check if mobile exists
authRoute.post('/check-mobile', user.checkMobile);

// Step 2a: Send OTP (for both new and existing users)
authRoute.post("/send-otp", otp.sendOtp);

// Step 2b: Verify OTP
authRoute.post("/verify-otp", otp.verifyOtp);

// Step 3a: Signup (for new users after OTP verification)
authRoute.post("/user/signup", user.signUp);

// Step 3b: Login (for existing users after OTP verification)
authRoute.post("/user/login", user.loginUser);

// ============================================
// ADMIN ROUTES - EMAIL + PASSWORD BASED
// ============================================

// Admin Login (Email + Password)
authRoute.post("/admin/login", user.adminLogin);

// Create Admin - TEMPORARILY WITHOUT MIDDLEWARE FOR FIRST ADMIN
// ⚠️ IMPORTANT: After creating first admin, uncomment the middleware below:
authRoute.post("/admin/create", user.createAdmin);

// 🔒 SECURE VERSION (Use this after first admin is created):
// authRoute.post("/admin/create", 
//   authenticateToken, 
//   adminAuthorisation, 
//   user.createAdmin
// );

// ============================================
// COMMON ROUTES (Both User & Admin)
// ============================================

// Check if logged in
authRoute.get("/is-login-check", authenticateToken, user.checkIsLogin);

// Get user profile
authRoute.get("/profile",
   authenticateToken,
   userAuthorisation,
   user.getUserById
);

// Update profile
authRoute.put("/profile",
   authenticateToken,
   userAuthorisation,
   user.profileChange
);
authRoute.get("/all-user", getAllUser);
authRoute.get("/get-user-by-id/:id", user.getUserById);
// Change password
authRoute.post("/change-password",
   authenticateToken,
   userAuthorisation,
   user.changePassword
);

// Delete User (Unprotected as per request)
authRoute.put("/delete/user/:id", user.deleteUser);

module.exports = authRoute;

// ============================================
// COMPLETE FLOW DOCUMENTATION
// ============================================

/*

🎯 USER FLOW (Mobile OTP Based):

EXISTING USER:
1. POST /user/check-mobile → { phoneNumber: "9876543210" }
   Response: { exists: true, isNewUser: false }

2. POST /user/send-otp → { phoneNumber: "9876543210" }
   Response: { success: true, message: "OTP sent" }

3. POST /user/verify-otp → { phoneNumber: "9876543210", otp: "123456" }
   Response: { success: true, verified: true }

4. POST /user/login → { phoneNumber: "9876543210" }
   Response: { success: true, token: "...", data: {...} }

NEW USER:
1. POST /user/check-mobile → { phoneNumber: "9876543210" }
   Response: { exists: false, isNewUser: true }

2. POST /user/send-otp → { phoneNumber: "9876543210" }
   Response: { success: true, message: "OTP sent" }

3. POST /user/verify-otp → { phoneNumber: "9876543210", otp: "123456" }
   Response: { success: true, verified: true }

4. Frontend pe NAME input dikhaao

5. POST /user/signup → { name: "John Doe", phoneNumber: "9876543210" }
   Response: { success: true, token: "...", data: {...} }

---

🔐 ADMIN FLOW (Email + Password):

FIRST TIME - CREATE ADMIN:
POST /admin/create (with admin token)
{
  "name": "Admin Name",
  "email": "admin@example.com", 
  "password": "securePassword123",
  "phoneNumber": "9876543210"
}

ADMIN LOGIN:
POST /admin/login
{
  "email": "admin@example.com",
  "password": "securePassword123"
}
Response: { success: true, token: "...", data: { role: "admin" } }

*/