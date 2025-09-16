import React from "react";
import Banner from "./layouts/Fashion/Components/Banner";
import TopCollection from "../components/common/Collections/TopCollection";
import TabCollection9 from "../components/common/Collections/TabCollection9";
import HeaderOne from "../components/headers/header-one";
import { Product4, Product45 } from "../services/script";
import Paragraph from "../components/common/Paragraph";
import Helmet from "react-helmet";
import MasterFooter from "../components/footers/common/MasterFooter";
import Sections from "./layouts/Fashion/Components/Sections";
import { useRouter } from "next/router";
import HomeMetaTag from "./MetaTag/homeMetaTag";
import FeaturedSections from "./layouts/Fashion/Components/FeaturedSection";
const Fashion = () => {
  const router = useRouter();
  return (
    <>
      <HomeMetaTag />

      <Helmet title="Buy Men’s Shirts Online | Affordable Luxurious Fashion - HEED">
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <HeaderOne noTopBar={false} logoName={"logo.png"} topClass="top-header" />
      <Banner router={router} />
      <Paragraph
        title="title1 section-t-space"
        inner="title-inner1"
        hrClass={false}
        titleData="HEED YOUR LOOKs"
      />

      <Sections />

      <Paragraph
        title="title1 section-t-space"
        inner="title-inner1"
        hrClass={false}
        titleData="Our Top Shelf Pick"
      />

      <TopCollection
        dataContStart={0}
        dataContEnd={50}
        noTitle="null" backImage={true} type="fashion" title="Most Selling Products" subtitle="special offer" productSlider={Product45} designClass="section-b-space p-t-0 ratio_asos px-2" noSlider="false" cartClass="cart-info cart-wrap"
      />

      {/* <TopCollection 
      dataContStart = {0}
       dataContEnd = {50}
       noTitle="null" backImage={true} type="fashion" title="Most Selling Products" subtitle="special offer" productSlider={Product45} designClass="section-b-space p-t-0 ratio_asos px-2" noSlider="false" cartClass="cart-info cart-wrap"
      /> */}

      <Paragraph
        title="title1 section-t-space"
        inner="title-inner1"
        hrClass={false}
        titleData="Featured Category"
      />
      <FeaturedSections />

      <TabCollection9 type="marijuana" midBox={true} spanClass={true} />
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
