import React, { Fragment } from "react";
import Slider from "react-slick";
import { useMediaQuery } from '@mui/material';
import home1 from "../../../../public/assets/images/home-banner/01.png";
import home2 from "../../../../public/assets/images/home-banner/02.png";
import home3 from "../../../../public/assets/images/home-banner/03.png";
import home4 from "../../../../public/assets/images/home-banner/04.png";
import home5 from "../../../../public/assets/images/home-banner/05.png";
import home11 from "../../../../public/assets/images/home-banner/1.1.jpg";
import home21 from "../../../../public/assets/images/home-banner/2.1.jpg";
import home31 from "../../../../public/assets/images/home-banner/3.1.jpg";




const Data = [
  {
    img: home1,
    img1: home11,
    link: "/collections/check-shirts",
  },
  {
    img: home2,
    img1: home21,
    link: "/collections/check-shirts",
  },
  {
    img: home3,
    img1: home31,
    link: "/collections/printed-shirts",
  },
  {
    img: home4,
    img1: home31,
    link: "/collections/printed-shirts",
  },
  {
    img: home5,
    img1: home31,
    link: "/collections/printed-shirts",
  } 
];
const sliderSettings = {
  arrows: false,
  autoplay: true,
  autoplaySpeed: 10000,
  dots: true, 
};

const HomeSlider = ({router}) => {
  const isSmallScreen = useMediaQuery('(max-width: 650px)');

  return (
    <Fragment>
      <section className="p-0 service_slide">
        <Slider style={{cursor:"pointer"}} {...sliderSettings} className="slide-1 home-slider text-white">
          {Data.map((data, i) => (
             <img  onClick={()=>{
              router.push(data.link)
             }} 
            //  src={ isSmallScreen ? data.img1.src:    data.img.src} 
             src={data.img.src} 
             />
          ))}
        </Slider>
      </section>
    </Fragment>
  );
} 

export default HomeSlider;
