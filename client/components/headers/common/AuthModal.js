import React, { useContext, useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { TextField } from "@mui/material";
import { toast } from "react-hot-toast";
import OpenModal from "../../../pages/page/account/openModal";
import UserContext from "../../../helpers/user/UserContext";
import Api from "../../../components/Api";
import { LoaderContext } from "../../../helpers/loaderContext";

const modalStyles = `
  .auth-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20000;
  }
  .auth-modal-content {
    background: #fff;
    border-radius: 16px;
    width: 90%;
    max-width: 420px;
    overflow: hidden;
  }
  .auth-modal-header {
    padding: 16px 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .auth-modal-body {
    padding: 20px;
  }
  .auth-continue-btn {
    width: 100%;
    padding: 14px;
    margin-top: 20px;
    background: #000;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
  }
  .auth-continue-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const AuthModal = () => {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    isOTPModalOpen,
    setIsOTPModalOpen,
    closeAll,
    user,
    setUser,
  } = useContext(UserContext);

  const { setLoading } = useContext(LoaderContext);

  // 🔥 MAIN FIX: Handle close properly
  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
    setUser((prev) => ({ ...prev, phoneNumber: "" })); // Clear phone
  };

  const handleGetOtpClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("🔥 Get OTP Clicked - Phone:", user.phoneNumber);

    if (!user.phoneNumber || user.phoneNumber.length !== 10) {
      toast.error("Enter valid 10-digit phone number");
      return;
    }

    console.log("✅ Valid phone, opening OTP modal");

    // 🔥 CRITICAL: Just open OTP modal, don't close login modal
    setIsOTPModalOpen(true);
  };

  useEffect(() => {
    document.body.style.overflow =
      isLoginModalOpen || isOTPModalOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isLoginModalOpen, isOTPModalOpen]);

  // 🔥 DEBUG: Log state changes
  useEffect(() => {
    console.log("📊 Modal States:", {
      isLoginModalOpen,
      isOTPModalOpen,
      phone: user.phoneNumber
    });
  }, [isLoginModalOpen, isOTPModalOpen]);

  return (
    <>
      <style>{modalStyles}</style>

      {/* 🔥 Login Modal - Hide when OTP modal opens */}
      {isLoginModalOpen && !isOTPModalOpen && (
        <div
          className="auth-modal-overlay"
          onClick={handleCloseLoginModal}
        >
          <div
            className="auth-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="auth-modal-header">
              <h4> Login & Signup</h4>
              <button
                onClick={handleCloseLoginModal}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '23px',
                  color: '#000'
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="auth-modal-body" style={{ backgroundColor: "#fff" }}>
              <TextField
                label="Phone Number"
                name="phoneNumber"
                variant="standard"
                fullWidth
                type="tel"
                value={user.phoneNumber || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  if (value.length <= 10) {
                    setUser((prev) => ({ ...prev, phoneNumber: value }));
                  }
                }}
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleGetOtpClick(e);
                }}
                sx={{
                  "& label": {
                    color: "#000",
                  },
                  "& label.Mui-focused": {
                    color: "#000",
                  },
                  "& .MuiInputBase-input": {
                    color: "#000",
                  },
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "#000",
                  },
                  "& .MuiInput-underline:hover:before": {
                    borderBottomColor: "#000",
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "#000",
                  },
                }}
              />

              <button
                className="auth-continue-btn"
                onClick={handleGetOtpClick}
                type="button"
                style={{ background: "#000", color: "#fff" }}
              >
                Get OTP
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 🔥 OTP Modal - Always render when isOTPModalOpen is true */}
      <OpenModal
        userData={{ phoneNumber: user.phoneNumber }}
      />
    </>
  );
};

export default AuthModal;