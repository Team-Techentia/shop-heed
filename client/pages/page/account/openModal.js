import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Button } from "reactstrap";
import OTPInput from "react-otp-input";
import { toast, Toaster } from "react-hot-toast";
import { useMediaQuery } from "@mui/material";

import Api from "../../../components/Api";
import UserContext from "../../../helpers/user/UserContext";
import { setCookie } from "../../../components/cookies";
import { LoaderContext } from "../../../helpers/loaderContext";

const OpenModal = ({ userData }) => {
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const { setIslogin, isOTPModalOpen, setIsOTPModalOpen, setIsLoginModalOpen } =
    useContext(UserContext);

  const { setLoading, catchErrors } = useContext(LoaderContext);

  const [otpSent, setOtpSent] = useState(false); // 🔥 Changed from otpModal
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [showNameInput, setShowNameInput] = useState(false);
  const [userName, setUserName] = useState("");

  const otpSentRef = useRef(false);
  const AUTO_OTP_KEY = "auto_otp_sent";

  // =========================
  // SEND OTP
  // =========================
  const sendOtp = async () => {
    if (!userData?.phoneNumber) {
      toast.error("Phone number is required");
      return;
    }

    if (isSending || otpSentRef.current) {
      console.log("🛑 Already sending/sent OTP");
      return;
    }

    try {
      otpSentRef.current = true;
      setIsSending(true);

      console.log("📤 Sending OTP to:", userData.phoneNumber);

      const res = await Api.sendOTP({
        phoneNumber: userData.phoneNumber,
        otpType: "Text_Message",
      });

      console.log("📥 OTP Response:", res.data);

      if (res.data.success) {
        toast.success("OTP sent successfully");
        setOtpSent(true); // ✅ Show OTP input
      } else {
        toast.error(res.data.message || "Failed to send OTP");
        otpSentRef.current = false;
      }
    } catch (err) {
      console.error("❌ Send OTP Error:", err);
      catchErrors(err);
      toast.error(err?.response?.data?.message || "Failed to send OTP");
      otpSentRef.current = false;
    } finally {
      setIsSending(false);
    }
  };

  // =========================
  // RESEND OTP
  // =========================
  const handleResendOtp = async () => {
    console.log("🔄 Resending OTP...");
    otpSentRef.current = false;
    setOtp("");
    await sendOtp();
  };

  // =========================
  // VERIFY OTP
  // =========================
  const handleOTPVerify = async () => {
    if (isVerifying) return;

    if (!userData?.phoneNumber) {
      toast.error("Phone number is required");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Enter valid 6 digit OTP");
      return;
    }

    try {
      setIsVerifying(true);
      setLoading(true);

      console.log("🔐 Verifying OTP...");

      const verifyRes = await Api.verifyOtp({
        phoneNumber: userData.phoneNumber,
        otp: otp,
        otpType: "Text_Message",
      });

      if (!verifyRes.data.success || !verifyRes.data.verified) {
        toast.error(verifyRes.data.message || "Invalid OTP");
        return;
      }

      console.log("✅ OTP Verified");

      // Check if user exists
      const checkRes = await Api.checkMobile({
        phoneNumber: userData.phoneNumber
      });

      const userExists = checkRes.data?.exists || false;

      if (userExists) {
        // LOGIN
        const loginRes = await Api.loginUser({
          phoneNumber: userData.phoneNumber,
        });

        if (loginRes.data.success && loginRes.data.token) {
          setCookie(null, "ectoken", loginRes.data.token, 100);
          setIslogin(true);
          toast.success("Logged in successfully 🎉");

          // Close modals
          setOtp("");
          setOtpSent(false);
          setIsOTPModalOpen(false);
          setIsLoginModalOpen(false);
          sessionStorage.removeItem(AUTO_OTP_KEY);

          const redirectAfterLogin = localStorage.getItem("redirectAfterLogin");

          setTimeout(() => {
            if (redirectAfterLogin === "checkout") {
              window.location.href = "/page/account/checkout";
            } else {
              window.location.reload(); // Stay on same page
            }
            localStorage.removeItem("redirectAfterLogin");
          }, 300);
        } else {
          toast.error(loginRes.data.message || "Login failed");
        }
      } else {
        // NEW USER - Show name input
        setShowNameInput(true);
        toast.success("Please enter your name to complete signup");
      }

    } catch (err) {
      console.error("❌ Error:", err);
      catchErrors(err);
      toast.error(err?.response?.data?.message || "Verification failed");
    } finally {
      setIsVerifying(false);
      setLoading(false);
    }
  };

  // =========================
  // SIGNUP
  // =========================
  const handleSignup = async () => {
    if (!userName || userName.trim().length < 2) {
      toast.error("Please enter your name");
      return;
    }

    try {
      setLoading(true);

      const signupRes = await Api.signUp({
        name: userName,
        phoneNumber: userData.phoneNumber,
      });

      if (signupRes.data.success && signupRes.data.token) {
        setCookie(null, "ectoken", signupRes.data.token, 100);
        setIslogin(true);
        toast.success("Account created successfully 🎉");

        // Close everything
        setOtp("");
        setUserName("");
        setShowNameInput(false);
        setOtpSent(false);
        setIsOTPModalOpen(false);
        setIsLoginModalOpen(false);
        sessionStorage.removeItem(AUTO_OTP_KEY);

        const redirectAfterLogin = localStorage.getItem("redirectAfterLogin");

        setTimeout(() => {
          if (redirectAfterLogin === "checkout") {
            window.location.href = "/page/account/checkout";
          } else {
            window.location.reload(); // Stay on same page
          }
          localStorage.removeItem("redirectAfterLogin");
        }, 300);
      } else {
        toast.error(signupRes.data.message || "Signup failed");
      }
    } catch (err) {
      console.error("❌ Signup Error:", err);
      catchErrors(err);
      toast.error(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CANCEL
  // =========================
  const handleCancelOtp = () => {
    sessionStorage.removeItem(AUTO_OTP_KEY);
    setOtp("");
    setUserName("");
    otpSentRef.current = false;
    setOtpSent(false);
    setIsOTPModalOpen(false);
    setIsSending(false);
    setShowNameInput(false);
  };

  // =========================
  // AUTO SEND OTP
  // =========================
  useEffect(() => {
    if (!isOTPModalOpen) return;
    if (!userData?.phoneNumber) return;

    const alreadySent = sessionStorage.getItem(AUTO_OTP_KEY);
    if (alreadySent === "true") {
      setOtpSent(true); // Already sent, just show input
      return;
    }

    console.log("🚀 Auto-sending OTP...");
    sessionStorage.setItem(AUTO_OTP_KEY, "true");
    sendOtp();
  }, [isOTPModalOpen]);

  return (
    <>
      {/* 🔥 SINGLE DIALOG - ALWAYS OPEN WHEN isOTPModalOpen IS TRUE */}
      <Dialog
        open={isOTPModalOpen}
        maxWidth="sm"
        fullWidth
        onClose={handleCancelOtp}
        PaperProps={{
          style: {
            borderRadius: '16px'
          }
        }}
      >
        <DialogTitle>
          <Typography align="center" fontWeight={600}>
            {isSending
              ? "Sending OTP..."
              : showNameInput
                ? "Complete Your Signup"
                : `Enter 6-digit OTP Sent to ${userData.phoneNumber}`}
          </Typography>
          {(isSending || showNameInput) && (
            <Typography align="center" variant="body2" color="textSecondary">
              {isSending ? "Please wait..." : "Just one more step!"}
            </Typography>
          )}
        </DialogTitle>

        <DialogContent>
          {isSending ? (
            // 🔥 LOADING STATE
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <CircularProgress />
            </div>
          ) : !otpSent ? (
            // 🔥 WAITING FOR OTP TO SEND
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <Typography>Preparing OTP...</Typography>
            </div>
          ) : !showNameInput ? (
            // ✅ OTP INPUT
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
              <OTPInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                // separator={<span style={{ width: "24px" }}></span>} // Removed in favor of gap
                isInputNum={true}
                shouldAutoFocus={true}
                inputStyle={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  width: isSmallScreen ? "40px" : "54px",
                  height: isSmallScreen ? "40px" : "54px",
                  fontSize: "18px",
                  color: "#000",
                  fontWeight: "600",
                  caretColor: "blue",
                  margin: "0 6px" // Added spread gap directly
                }}
                focusStyle={{
                  border: "2px solid #007bff",
                  outline: "none",
                }}
                renderInput={(props) => (
                  <input
                    {...props}
                    type="tel"
                    pattern="[0-9]*"
                    inputMode="numeric"
                  />
                )}
              />
            </div>
          ) : (
            // ✅ NAME INPUT
            <div style={{ padding: '20px 0' }}>
              <TextField
                fullWidth
                label="Your Name"
                variant="outlined"
                value={userName}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                  setUserName(value);
                }}
                autoFocus
                placeholder="Enter your full name"
              />
            </div>
          )}
        </DialogContent>

        <DialogActions className="justify-content-end px-4 pb-3">
          {!showNameInput && otpSent ? (
            <>
              <Button
                onClick={handleResendOtp}
                disabled={isVerifying || isSending}
              >
                {isSending ? "Sending..." : "Resend"}
              </Button>

              <Button
                color="success"
                onClick={handleOTPVerify}
                disabled={isVerifying || otp.length !== 6}
              >
                {isVerifying ? "Verifying..." : "Verify"}
              </Button>
            </>
          ) : showNameInput ? (
            <>
              <Button
                color="error"
                onClick={handleCancelOtp}
              >
                Cancel
              </Button>
              <Button
                color="success"
                onClick={handleSignup}
                disabled={!userName || userName.trim().length < 2}
              >
                Complete Signup
              </Button>
            </>
          ) : (
            <Button
              color="error"
              onClick={handleCancelOtp}
            >
              Cancel
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Toaster />
    </>
  );
};

export default OpenModal;