"use client";
import React, { Fragment, useEffect, useState } from "react";
import Slider from "react-slick";
import { useMediaQuery } from "@mui/material";
import axios from "axios";

const sliderSettings = {
  arrows: false,
  autoplay: true,
  autoplaySpeed: 10000,
  dots: true,
};

const HomeSlider = ({ router }) => {
  const [banners, setBanners] = useState([]);

  // Responsive breakpoints
  const isMobileWidth = useMediaQuery("(max-width: 768px)");
  const isMobileHeight = useMediaQuery("(max-height: 600px)");
  const isSmallScreen = isMobileWidth || isMobileHeight;

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const res = await axios.get(`${baseUrl}banner/public/active-banners`);
        if (res.data.success) {
          setBanners(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);

  return (
    <Fragment>
      <section className="p-0 service_slide">
        <Slider
          style={{ cursor: "pointer" }}
          {...sliderSettings}
          className="slide-1 home-slider text-white"
        >
          {banners.map((banner, i) => {
            const imageToShow =
              isSmallScreen && banner.mobileImage ? banner.mobileImage : banner.image;

            return (
              <img
                key={i}
                src={imageToShow}
                alt={banner.title}
                onClick={() => {
                  if (banner.targetSubCategory) {
                    router.push(`/collections/${banner.targetSubCategory}`);
                  } else if (banner.targetCategory) {
                    router.push(`/collections/${banner.targetCategory}`);
                  } else {
                    router.push(banner.link || "/");
                  }
                }}
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "50vh",
                
                }}
              />
            );
          })}
        </Slider>
      </section>
    </Fragment>
  );
};

export default HomeSlider;
