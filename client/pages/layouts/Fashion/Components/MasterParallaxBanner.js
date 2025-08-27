import React, { Fragment } from "react";

const MasterParallaxBanner = ({
  parallaxSectionClass,
  bg,
  parallaxClass,
}) => {
  return (
    <Fragment>
      <section className={`p-0 ${parallaxSectionClass}`}>
        <div className={`full-banner ${bg} parallax ${parallaxClass}`}>
        </div>
      </section>
    </Fragment>
  );
};

export default MasterParallaxBanner;
