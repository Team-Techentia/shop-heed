import React, { useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { TextField } from "@mui/material";
import OpenModal from "../../../pages/page/account/openModal";
import UserContext from "../../../helpers/user/UserContext";

const modalStyles = `
  .auth-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20000; /* raised above everything */
    backdrop-filter: blur(4px);
  }
  .auth-modal-content {
    background: white;
    border-radius: 16px;
    width: 90%;
    max-width: 480px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    overflow: hidden;
    animation: modalSlideIn 0.3s ease-out;
  }
  @keyframes modalSlideIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .auth-modal-header {
    padding: 24px 32px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .auth-modal-header h4 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #222;
  }
  .auth-close-btn {
    background: none;
    border: none;
    font-size: 24px;
    color: #666;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
  .auth-close-btn:hover { color: #222; background-color: #f5f5f5; }
  .auth-modal-body { padding: 32px; }
  .auth-continue-btn {
    width: 100%;
    padding: 16px;
    background-color: #222;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 24px;
    transition: background-color 0.3s, transform 0.1s;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .auth-continue-btn:hover { background-color: #000; transform: translateY(-1px); }
  .auth-continue-btn:active { transform: translateY(0); }
  .auth-switch-link {
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
    color: #666;
  }
  .auth-switch-link span {
    color: #222;
    text-decoration: underline;
    cursor: pointer;
    font-weight: 500;
  }
  .auth-switch-link span:hover { color: #000; }
  .auth-error-message {
    color: #d32f2f;
    font-size: 14px;
    margin-top: 8px;
  }
  .auth-input-spacing { margin-bottom: 20px; }
  body.modal-open {
    overflow: hidden !important;
    height: 100vh;
  }
`;

const AuthModal = () => {
  const {
    isLoginModalOpen,
    isRegisterModalOpen,
    isOTPModalOpen,
    closeAll,
    openLogin,
    openRegister,
    user,
    setUser,
    error,
    handleMobileNumberLogin,
    handleRegister,
    setIsOTPModalOpen,
  } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (value.length > 50) return;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // prevent scroll when modal open
  useEffect(() => {
    document.body.style.overflow = isLoginModalOpen || isRegisterModalOpen || isOTPModalOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isLoginModalOpen, isRegisterModalOpen, isOTPModalOpen]);

  return (
    <>
      <style>{modalStyles}</style>

      {/* Login */}
      {isLoginModalOpen && (
        <div className="auth-modal-overlay" onClick={closeAll}>
          <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="auth-modal-header">
              <h4>Log In / Sign Up</h4>
              <button className="auth-close-btn" onClick={closeAll}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="auth-modal-body">
              <TextField
                type="tel"
                label="Phone Number"
                variant="standard"
                fullWidth
                value={user.emailOrPhone}
                onChange={handleChange}
                name="emailOrPhone"
              />
              {error && <div className="auth-error-message">{error}</div>}
              <button className="auth-continue-btn" onClick={handleMobileNumberLogin}>Continue</button>
              <div className="auth-switch-link">
                New user? <span onClick={openRegister}>Register</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Register */}
      {isRegisterModalOpen && (
        <div className="auth-modal-overlay" onClick={closeAll}>
          <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="auth-modal-header">
              <h4>Sign Up</h4>
              <button className="auth-close-btn" onClick={closeAll}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="auth-modal-body">
              <TextField name="name" type="text" label="Name" variant="standard" fullWidth value={user.name} onChange={handleChange} />
              <TextField name="email" type="email" label="Email" variant="standard" fullWidth value={user.email} onChange={handleChange} />
              <TextField name="phoneNumber" type="number" label="Phone Number" variant="standard" fullWidth value={user.phoneNumber} onChange={handleChange} />
              <button className="auth-continue-btn" onClick={handleRegister}>Get OTP</button>
              <div className="auth-switch-link">
                Already have an account? <span onClick={openLogin}>Login</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTP */}
      <OpenModal
        userData={{ phoneNumber: user.phoneNumber || user.emailOrPhone, name: user.name, email: user.email }}
        popUpFor="checkoutPage"
        useBox="login"
      />
    </>
  );
};

export default AuthModal;
