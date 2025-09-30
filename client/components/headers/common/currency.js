import React, { useState, useContext } from "react";
import { Media } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";

import UserContext from "../../../helpers/user/UserContext";
import { LoaderContext } from "../../../helpers/loaderContext";
import Api from "../../../components/Api";
import AuthModal from "./AuthModal";

const Currency = ({ icon }) => {
  const { isLogin, logOut } = useContext(UserContext);
  const { catchErrors, setLoading } = useContext(LoaderContext);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);

  const [user, setUser] = useState({
    emailOrPhone: "",
    name: "",
    email: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");

  const closeAllModals = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
    setIsOTPModalOpen(false);
  };

  const openLoginModal = () => {
    closeAllModals();
    setIsLoginModalOpen(true);
  };

  const switchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const switchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleMobileNumberLogin = async () => {
    if (!user.emailOrPhone || user.emailOrPhone.length < 10) {
      setError("Enter a valid number");
      setTimeout(() => setError(""), 2000);
      return;
    }

    try {
      setLoading(true);
      const res = await Api.checkMobile({ phoneNumber: user.emailOrPhone });

      if (res.data.message === "Phone number already exist") {
        setIsLoginModalOpen(false);
        setIsOTPModalOpen(true);
      } else {
        localStorage.setItem("phoneNumber", user.emailOrPhone);
        setIsLoginModalOpen(false);
        setIsRegisterModalOpen(true);
        setUser((prev) => ({ ...prev, phoneNumber: prev.emailOrPhone }));
      }
    } catch (error) {
      catchErrors(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user.name || !user.email || !user.phoneNumber) {
      return toast.error("Please fill all required fields");
    }

    try {
      setLoading(true);
      const response = await Api.checkUser({
        phoneNumber: user.phoneNumber,
        email: user.email,
      });

      if (response.data.message === "Successfully") {
        setIsRegisterModalOpen(false);
        setIsOTPModalOpen(true);
      }
    } catch (error) {
      catchErrors(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logOut();
    openLoginModal();
    setUser({ emailOrPhone: "", name: "", email: "", phoneNumber: "" });
    setError("");
  };

  return (
    <li className="onhover-div">
      {isLogin ? (
        <>
          <div>
            <Media style={{ height: "23px" }} src={icon} className="img-fluid" alt="" />
          </div>
          <div className="show-div setting">
            <ul>
              <li className="hoverTableEffect">
                <Link href={`/page/user/profile`}>My profile</Link>
              </li>
              <li className="hoverTableEffect">
                <Link href={`/page/user/orders`}>My Orders</Link>
              </li>
              <li className="hoverTableEffect" onClick={handleLogout}>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <div
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          onClick={openLoginModal}
        >
          <FontAwesomeIcon icon={faUser} style={{ marginRight: "8px", fontSize: "15px" }} />
          <span style={{ fontSize: "16px", fontWeight: "400", color: "#000" }}>Account</span>
        </div>
      )}

      <AuthModal
        isLoginModalOpen={isLoginModalOpen}
        isRegisterModalOpen={isRegisterModalOpen}
        isOTPModalOpen={isOTPModalOpen}
        closeAllModals={closeAllModals}
        switchToRegister={switchToRegister}
        switchToLogin={switchToLogin}
        handleMobileNumberLogin={handleMobileNumberLogin}
        handleRegister={handleRegister}
        user={user}
        setUser={setUser}
        error={error}
        setIsLoginModalOpen={setIsLoginModalOpen}
        setIsRegisterModalOpen={setIsRegisterModalOpen}
        setIsOTPModalOpen={setIsOTPModalOpen}
      />

      <Toaster />
    </li>
  );
};

export default Currency;
