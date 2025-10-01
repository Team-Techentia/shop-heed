import UserContext from "./UserContext";
import React, { useState, useEffect, useContext } from "react";
import { getCookie, deleteCookie } from "../../components/cookies";
import Api from "../../components/Api";
import { LoaderContext } from "../loaderContext";
import { useRouter } from "next/router";
import AuthModal from "../../components/headers/common/AuthModal";
import toast from "react-hot-toast";

const UserProvider = ({ children }) => {
  const Router = useRouter();
  const LoaderContextData = useContext(LoaderContext);
  const { catchErrors, setLoading } = LoaderContextData;

  // login state
  const [isLogin, setIslogin] = useState(false);
  const [popUpFor, setPopUpFor] = useState("");
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
    Router.push("/")
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

      if (res.data.exists) {
        // Existing user → go to OTP login
        setIsLoginModalOpen(false);
        setIsOTPModalOpen(true);
        setPopUpFor("login");
      } else {
        // New user → go to Register
        setUser((prev) => ({ ...prev, phoneNumber: user.emailOrPhone }));
        setPopUpFor("signup");
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
      const res = await Api.checkUser({
        phoneNumber: user.phoneNumber,
        email: user.email,
      });

      if (!res.data.exists) {
        // No user → go to OTP for signup
        setIsRegisterModalOpen(false);
        setIsOTPModalOpen(true);
        setPopUpFor("signup");
      } else {
        console.log(res.data);
        toast.error(res.data.message || "User already registered");
      }
    } catch (err) {
      console.log(err.response.data);
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

        popUpFor,
        setPopUpFor,

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