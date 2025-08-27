import React, { Fragment } from "react";
import MasterParallaxBanner from "./MasterParallaxBanner";

const Parallax = () => {
  return (
    <Fragment>
      <MasterParallaxBanner
        bg="parallax-banner1"
        parallaxClass="text-center p-left"
        title="2023"
        subTitle1="fashion trends"
        subTitle2="special offer"
      />
    </Fragment>
  );
};

export default Parallax;
