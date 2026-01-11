import React, { useState, useContext, useEffect, useRef } from "react";
import { Col, Media, Row, Modal, ModalBody, Form, Button, FormGroup } from "reactstrap";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
} from "@mui/material";
import OTPInput from "react-otp-input";
import { toast, Toaster } from "react-hot-toast";
import { useMediaQuery } from "@mui/material";

import Api from "../../../components/Api";
import UserContext from "../../../helpers/user/UserContext";
import { setCookie } from "../../../components/cookies";
import { LoaderContext } from "../../../helpers/loaderContext";

const OpenModal = ({ userData }) => {
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const { setIslogin, isOTPModalOpen, setIsOTPModalOpen } =
    useContext(UserContext);

  const { setLoading, catchErrors } = useContext(LoaderContext);

  const [otpModal, setOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // 🆕 State for new user name input
  const [showNameInput, setShowNameInput] = useState(false);
  const [userName, setUserName] = useState("");

  // 🔐 Prevent double OTP send
  const otpSentRef = useRef(false);
  const mountedRef = useRef(false);

  // =========================
  // AUTO SEND OTP ONCE
  // =========================
  useEffect(() => {
    if (
      isOTPModalOpen && 
      userData?.phoneNumber && 
      !otpSentRef.current &&
      !mountedRef.current &&
      !isSending
    ) {
      console.log("🚀 Sending OTP for the first time");
      mountedRef.current = true;
      otpSentRef.current = true;
      sendOtp();
    }
    
    // Reset when modal closes
    if (!isOTPModalOpen) {
      otpSentRef.current = false;
      mountedRef.current = false;
      setOtp("");
      setOtpModal(false);
      setIsSending(false);
      setShowNameInput(false);
      setUserName("");
    }
  }, [isOTPModalOpen]);

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
      setIsSending(true);
      otpSentRef.current = true;
      setLoading(true);

      console.log("📤 Sending OTP to:", userData.phoneNumber);

      const res = await Api.sendOTP({
        phoneNumber: userData.phoneNumber,
        otpType: "Text_Message",
      });

      console.log("📥 OTP Response:", res.data);

      if (res.data.success) {
        toast.success("OTP sent successfully");
        setOtpModal(true);
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
      setLoading(false);
      setIsSending(false);
    }
  };

  // =========================
  // RESEND OTP
  // =========================
  const handleResendOtp = async () => {
    otpSentRef.current = false;
    setOtp("");
    await sendOtp();
  };

  // =========================
  // VERIFY OTP → CHECK USER → LOGIN/SIGNUP
  // =========================
  const handleOTPVerify = async () => {
    if (isVerifying) {
      console.log("🛑 Already verifying");
      return;
    }

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

      console.log("🔐 Step 1: Verifying OTP...");

      // ✅ STEP 1: VERIFY OTP
      const verifyRes = await Api.verifyOtp({
        phoneNumber: userData.phoneNumber,
        otp: otp,
        otpType: "Text_Message",
      });

      console.log("📥 Verify Response:", verifyRes.data);

      if (!verifyRes.data.success || !verifyRes.data.verified) {
        toast.error(verifyRes.data.message || "Invalid OTP");
        return;
      }

      console.log("✅ OTP Verified Successfully");

      // ✅ STEP 2: CHECK IF USER EXISTS
      console.log("🔍 Step 2: Checking if user exists...");
      
      const checkRes = await Api.checkMobile({
        phoneNumber: userData.phoneNumber
      });

      console.log("📥 Check Mobile Response:", checkRes.data);

      const userExists = checkRes.data?.exists || false;

      if (userExists) {
        // ✅ USER EXISTS → LOGIN
        console.log("✅ User exists, logging in...");

        const loginRes = await Api.loginUser({
          phoneNumber: userData.phoneNumber,
        });

        console.log("📥 Login Response:", loginRes.data);

        if (loginRes.data.success && loginRes.data.token) {
          setCookie(null, "ectoken", loginRes.data.token, 100);
          setIslogin(true);
          toast.success("Logged in successfully 🎉");

          // Reset & Redirect
          setOtp("");
          setOtpModal(false);
          setIsOTPModalOpen(false);

          setTimeout(() => {
            window.location.href = "/";
          }, 500);
        } else {
          toast.error(loginRes.data.message || "Login failed");
        }

      } else {
        // ✅ USER DOESN'T EXIST → SHOW NAME INPUT
        console.log("🆕 New user detected, asking for name...");
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
  // SIGNUP NEW USER
  // =========================
  const handleSignup = async () => {
    if (!userName || userName.trim().length < 2) {
      toast.error("Please enter your name");
      return;
    }

    try {
      setLoading(true);

      console.log("📝 Signing up new user...");

      const signupRes = await Api.signUp({
        name: userName,
        phoneNumber: userData.phoneNumber,
      });

      console.log("📥 Signup Response:", signupRes.data);

      if (signupRes.data.success && signupRes.data.token) {
        setCookie(null, "ectoken", signupRes.data.token, 100);
        setIslogin(true);
        toast.success("Account created successfully 🎉");

        // Reset & Redirect
        setOtp("");
        setUserName("");
        setShowNameInput(false);
        setOtpModal(false);
        setIsOTPModalOpen(false);

        setTimeout(() => {
          window.location.href = "/";
        }, 500);
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
    setOtp("");
    setUserName("");
    otpSentRef.current = false;
    mountedRef.current = false;
    setOtpModal(false);
    setIsOTPModalOpen(false);
    setIsSending(false);
    setShowNameInput(false);
  };

  if (!userData || !isOTPModalOpen) {
    return null;
  }

  return (
    <>
      {/* ================= SEND OTP MODAL ================= */}
      <Modal
        isOpen={isOTPModalOpen && !otpModal}
        toggle={handleCancelOtp}
        className="theme-modal modal-lg"
        centered
      >
        <ModalBody>
          <Row className="justify-content-center text-center">
            <Col lg="7" sm="12">
              <div className="modal-bg">
                <div className="offer-content">
                  <h3 className="mb-3">
                    {isSending ? "Sending OTP..." : "Send OTP"}
                  </h3>

                  <Form>
                    <FormGroup>
                      <TextField
                        variant="standard"
                        fullWidth
                        label="Phone Number"
                        value={userData.phoneNumber || ""}
                        disabled
                      />
                    </FormGroup>

                    <div className="mt-4 d-flex gap-3">
                      <Button 
                        className="btn btn-solid" 
                        onClick={handleResendOtp}
                        disabled={isSending}
                      >
                        {isSending ? "Sending..." : "Resend"}
                      </Button>
                      <Button
                        className="btn btn-outline"
                        onClick={handleCancelOtp}
                        disabled={isSending}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      {/* ================= OTP VERIFY MODAL ================= */}
      <Dialog open={otpModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography align="center" fontWeight={600}>
            {showNameInput ? "Complete Your Signup" : "Enter 6-digit OTP"}
          </Typography>
          <Typography align="center" variant="body2" color="textSecondary">
            {showNameInput ? "Just one more step!" : `Sent to ${userData.phoneNumber}`}
          </Typography>
        </DialogTitle>

        <DialogContent>
          {!showNameInput ? (
            // OTP INPUT
            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              <OTPInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                shouldAutoFocus
                renderInput={(props) => (
                  <input
                    {...props}
                    style={{
                      width: isSmallScreen ? "32px" : "44px",
                      height: "44px",
                      margin: "0 6px",
                      fontSize: "18px",
                      textAlign: "center",
                      border: "none",
                      borderBottom: "2px solid #000",
                      outline: "none",
                    }}
                  />
                )}
              />
            </div>
          ) : (
            // NAME INPUT (After OTP verified for new user)
            <div style={{ marginTop: "20px" }}>
              <TextField
                label="Full Name"
                variant="outlined"
                fullWidth
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                autoFocus
              />
            </div>
          )}
        </DialogContent>

        <DialogActions className="justify-content-end px-4 pb-3">
          {!showNameInput ? (
            <>
              <Button 
                onClick={handleResendOtp} 
                disabled={isVerifying || isSending}
              >
                {isSending ? "Sending..." : "Resend"}
              </Button>
              <Button 
                color="error" 
                onClick={handleCancelOtp} 
                disabled={isVerifying}
              >
                Cancel
              </Button>
              <Button 
                color="success" 
                onClick={handleOTPVerify} 
                disabled={isVerifying || otp.length !== 6}
              >
                {isVerifying ? "Verifying..." : "Verify OTP"}
              </Button>
            </>
          ) : (
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
          )}
        </DialogActions>
      </Dialog>

      <Toaster />
    </>
  );
};

export default OpenModal;