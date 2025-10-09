import React, { useContext, useState } from "react";
import Banner from "./layouts/Fashion/Components/Banner";
import Link from "next/link";
import TopCollection from "../components/common/Collections/TopCollection";
import TabCollection9 from "../components/common/Collections/TabCollection9";
import HeaderOne from "../components/headers/header-one";
import { Product45 } from "../services/script";
import Paragraph from "../components/common/Paragraph";
import MasterFooter from "../components/footers/common/MasterFooter";
import Sections from "./layouts/Fashion/Components/Sections";
import { useRouter } from "next/router";
import FeaturedSections from "./layouts/Fashion/Components/FeaturedSection";
import AuthModal from "../components/headers/common/AuthModal";
import toast from "react-hot-toast";
import Api from "../components/Api";
import UserContext from "../helpers/user/UserContext";

const Fashion = () => {
  const router = useRouter();

  // user & error states
  const [user, setUser] = useState({ emailOrPhone: "", name: "", email: "", phoneNumber: "" });
  const [error, setError] = useState("");

  const { openLogin, openRegister, openOTP } = useContext(UserContext);

  // Auth handlers
  const handleMobileNumberLogin = async () => {
    if (!user.emailOrPhone || user.emailOrPhone.length < 10) {
      setError("Enter a valid number");
      setTimeout(() => setError(""), 2000);
      return;
    }
    try {
      const res = await Api.checkMobile({ phoneNumber: user.emailOrPhone });
      if (res.data.message === "Phone number already exist") {
        // ✅ use context function instead of local state
        openOTP();
      } else {
        localStorage.setItem("phoneNumber", user.emailOrPhone);
        openRegister();
      }
    } catch (err) {
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
        openOTP();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      {/* Header */}
      <HeaderOne noTopBar={false} logoName={"logo.png"} topClass="top-header" />

      {/* Banner */}
      <Banner router={router} />

      {/* Section Title */}
      <Paragraph
        title="title1 section-t-space"
        inner="title-inner1"
        hrClass={false}
        titleData="HEED YOUR LOOKs"
      />

      {/* 🔑 Auth Modal (global control via context) */}
      <AuthModal
        handleMobileNumberLogin={handleMobileNumberLogin}
        handleRegister={handleRegister}
        user={user}
        setUser={setUser}
        error={error}
      />

      {/* Sections */}
      <Sections />

      {/* Top Collection */}
      <Link href="/collections/new" passHref legacyBehavior>
        <a style={{ textDecoration: "none" }}>
          <Paragraph
            title="title1 section-t-space"
            inner="title-inner1"
            hrClass={false}
            titleData="New AND Trending"
          />
        </a>
      </Link>
      <TopCollection
        dataContStart={0}
        dataContEnd={50}
        noTitle="null"
        backImage={true}
        type="fashion"
        subtitle="special offer"
        productSlider={Product45}
        designClass="section-b-space p-t-0 ratio_asos px-2"
        noSlider="false"
        cartClass="cart-info cart-wrap"
      />

      {/* Featured Category */}
      <Paragraph
        title="title1 section-t-space"
        inner="title-inner1"
        hrClass={false}
        titleData="Featured Categories"
      />
      <FeaturedSections />

      {/* Tab Collection */}
      <TabCollection9 type="marijuana" midBox={true} spanClass={true} />

      {/* Footer */}
      <MasterFooter
        footerClass={`footer-light`}
        footerLayOut={"light-layout upper-footer"}
        footerSection={"small-section border-section border-top-0"}
        belowSection={" light-layout"}
        newLatter={true}
        logoName={"logo.png"}
      />
    </>
  );
};

export default Fashion;
