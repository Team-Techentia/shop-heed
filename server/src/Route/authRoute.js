const express = require("express"); 
const authRoute = express();
const user = require("../controller/userController/index");
const otp = require("../controller/otpController/index");
const email = require("../controller/emailController/index")
const auth = require("../auth/index")
const googleAuth = require("../controller/googleController/index")

const { authenticateToken, userAuthorisation } = auth

authRoute.get("/is-login-check" ,authenticateToken,user.checkIsLogin )

authRoute.post('/check-email-mobile' , user.checkUser)

authRoute.post('/check-mobile' , user.checkMobile)

authRoute.post("/signUp", user.signUp)

authRoute.post("/login", user.loginUser)

authRoute.post("/login-register-forCheck-outPage", user.loginRegisterForCheckOutPage)



authRoute.post("/forget-password" ,user.forgetPassword)

 
authRoute.put("/delete/user/:id" , authenticateToken, user.deleteUser)


authRoute.post("/send-otp", otp.sendOtp);

authRoute.post("/verify-otp" ,otp.verifyOtp)

authRoute.post("/auth/google", googleAuth.googleAuth)

authRoute.get("/get-user-by-id" ,authenticateToken  , userAuthorisation ,user.getUserById )

authRoute.put("/profile-change-by-id" ,authenticateToken  , userAuthorisation ,user.profileChange)

authRoute.post("/change-password",authenticateToken  , userAuthorisation,  user.changePassword);
authRoute.get("/change-number/:number",authenticateToken  , userAuthorisation,  user.ChangeNumber);

module.exports = authRoute