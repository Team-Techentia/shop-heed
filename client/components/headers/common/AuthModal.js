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
    border-radius: 14px;
    width: 90%;
    max-width: 420px;
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // 🔥 Simple: Just validate phone and open OTP modal
  const handleGetOtpClick = () => {
    // Validate phone number
    if (!user.phoneNumber || user.phoneNumber.length < 10) {
      toast.error("Enter valid 10-digit phone number");
      return;
    }

    console.log("📞 Opening OTP modal for:", user.phoneNumber);
    
    setIsLoginModalOpen(false);
    setIsOTPModalOpen(true);
  };

  useEffect(() => {
    document.body.style.overflow =
      isLoginModalOpen || isOTPModalOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isLoginModalOpen, isOTPModalOpen]);

  return (
    <>
      <style>{modalStyles}</style>

      {isLoginModalOpen && (
        <div className="auth-modal-overlay" onClick={closeAll}>
          <div
            className="auth-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="auth-modal-header">
              <h4>Shopheed Login</h4>
              <button 
                onClick={closeAll}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  fontSize: '23px'
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="auth-modal-body">
              {/* Just Phone Number Field */}
              <TextField
  label="Phone Number"
  name="phoneNumber"
  variant="standard"
  fullWidth
  type="tel"
  value={user.phoneNumber || ""}
  onChange={handleChange}
  autoFocus
  sx={{
    "& label": {
      color: "#000", // label black
    },
    "& label.Mui-focused": {
      color: "#000", // focused label black
    },
    "& .MuiInputBase-input": {
      color: "#000", // input text black
    },
    "& .MuiInput-underline:before": {
      borderBottomColor: "#000", // normal underline
    },
    "& .MuiInput-underline:hover:before": {
      borderBottomColor: "#000",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#000", // focused underline
    },
  }}
/>


              {/* Get OTP Button */}
              <button
                className="auth-continue-btn"
                onClick={handleGetOtpClick}
              >
                Get OTP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP MODAL - Only phone number needed */}
      {isOTPModalOpen && user?.phoneNumber && (
        <OpenModal
          userData={{
            phoneNumber: user.phoneNumber,
          }}
        />
      )}
    </>
  );
};

export default AuthModal;