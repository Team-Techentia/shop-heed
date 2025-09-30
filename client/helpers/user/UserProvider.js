import UserContext from "./UserContext";
import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { getCookie, deleteCookie } from "../../components/cookies";
import Api from "../../components/Api";
import { LoaderContext } from "../loaderContext";
import { useRouter } from "next/router";
import AuthModal from "../../components/headers/common/AuthModal";

const UserProvider = ({ children }) => {
  const Router = useRouter();
  const LoaderContextData = useContext(LoaderContext);
  const { catchErrors, setLoading } = LoaderContextData;

  // login state
  const [isLogin, setIslogin] = useState(false);
  const token = getCookie("ectoken");

  // modal states
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);

  // user data and error
  const [user, setUser] = useState({
    emailOrPhone: "",
    name: "",
    email: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");

  // check if user is logged in
  const fetchUser = async () => {
    try {
      const res = await Api.checkIsLogin(token);
      if (res.data.success) setIslogin(true);
    } catch (err) {
      catchErrors(err);
    }
  };

  useEffect(() => {
    if (token) fetchUser();
  }, [token]);

  // logout
  const logOut = () => {
    deleteCookie(null, "ectoken");
    setIslogin(false);
    toast.success("LogOut successfully");
    openLogin();
    setUser({ emailOrPhone: "", name: "", email: "", phoneNumber: "" });
    setError("");
  };

  // modal helpers
  const openLogin = () => { closeAll(); setIsLoginModalOpen(true); };
  const openRegister = () => { closeAll(); setIsRegisterModalOpen(true); };
  const openOTP = () => { closeAll(); setIsOTPModalOpen(true); };
  const closeAll = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
    setIsOTPModalOpen(false);
  };

  // auth handlers
  const handleMobileNumberLogin = async () => {
    if (!user.emailOrPhone || user.emailOrPhone.length < 10) {
      setError("Enter a valid number");
      setTimeout(() => setError(""), 2000);
      return;
    }
    try {
      const res = await Api.checkMobile({ phoneNumber: user.emailOrPhone });
      if (res.data.message === "Phone number already exist") {
        setIsLoginModalOpen(false);
        setIsOTPModalOpen(true);
      } else {
        setUser((prev) => ({ ...prev, phoneNumber: user.emailOrPhone }));
        setIsLoginModalOpen(false);
        setIsRegisterModalOpen(true);
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };
  
  const handleRegister = async () => {
    if (!user.name || !user.email || !user.phoneNumber) {
      return toast.error("Please fill all required fields");
    }
    try {
      const response = await Api.checkUser({
        phoneNumber: user.phoneNumber,
        email: user.email,
      });
      if (response.data.message === "Successfully") {
        setIsRegisterModalOpen(false);
        setIsOTPModalOpen(true);
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <UserContext.Provider
      value={{
        isLogin,
        setIslogin,
        logOut,

        isLoginModalOpen,
        isRegisterModalOpen,
        isOTPModalOpen,
        
        setIsLoginModalOpen,
        setIsRegisterModalOpen,
        setIsOTPModalOpen,

        openLogin,
        openRegister,
        openOTP,
        closeAll,

        user,
        setUser,
        error,
        setError,

        handleMobileNumberLogin,
        handleRegister,
      }}
    >
      {children}

      {/* Global AuthModal */}
      <AuthModal />
    </UserContext.Provider>
  );
};

export default UserProvider;