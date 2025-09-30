import React, { useState } from "react";
import Banner from "./layouts/Fashion/Components/Banner";
import TopCollection from "../components/common/Collections/TopCollection";
import TabCollection9 from "../components/common/Collections/TabCollection9";
import HeaderOne from "../components/headers/header-one";
import { Product45 } from "../services/script";
import Paragraph from "../components/common/Paragraph";
import MasterFooter from "../components/footers/common/MasterFooter";
import Sections from "./layouts/Fashion/Components/Sections";
import { useRouter } from "next/router";
import FeaturedSections from "./layouts/Fashion/Components/FeaturedSection";
import OpenModal from "../pages/page/account/login-auth"; // Make sure path is correct

const Fashion = () => {
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(false); // modal state

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

      {/* Sections */}
      <Sections />

      {/* Top Collection */}
      <Paragraph
        title="title1 section-t-space"
        inner="title-inner1"
        hrClass={false}
        titleData="Our Top Shelf Pick"
      />
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
        titleData="Featured Category"
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

      {/* Button to trigger login modal */}
      <div className="text-center my-4">
        <button
          onClick={() => setIsLoginOpen(true)}
          className="btn btn-solid"
        >
          Login / Sign Up
        </button>
      </div>

      {/* Login Modal */}
      <OpenModal
        isOpenTOTP={isLoginOpen}
        setIsOpenTOTP={setIsLoginOpen}
        userData={{ phoneNumber: "" }}
        popUpFor={"homepage"}
        useBox="login"
      />
    </>
  );
};

export default Fashion;
