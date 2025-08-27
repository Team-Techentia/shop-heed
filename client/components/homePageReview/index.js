import React from "react";
import Slider from "react-slick";
import { Container, Col } from "reactstrap";


const Data = [
  {
    desc: "I've always been on the lookout for high-quality shirts that combine style and comfort, and that's when I discovered Heed shirts. After wearing them for just a few weeks, I've noticed a significant boost in both my confidence and comfort. I highly recommend Heed shirts to anyone seeking premium clothing that stands out. They’ve truly been a game-changer for my wardrobe, and I can't imagine my daily outfits without them now.",
    name: "Mr. Rahul",
  },
  {
    desc: "I've been searching for high-quality shirts that elevate my style and comfort, and discovering Heed shirts has been fantastic. Incorporating them into my wardrobe has brought noticeable improvements in both my look and feel. I wholeheartedly recommend Heed shirts to anyone looking for premium, stylish clothing. They've been a transformative addition to my wardrobe, and I believe they can enhance others' style and comfort as well.",
    name: "Pooja",
  },
  {
    desc: "As someone who has struggled with digestive issues for years, finding Hajmo Hajma Churna has been a game-changer for me. This natural remedy has truly transformed my digestive health. Thank you, Hajmo Hajma, for creating such an amazing product. It's been a relief to find something that truly works and supports my health naturally. I’m so grateful for the positive impact it has had on my life.",
    name: "Priya Kapoor",
  },
  { 
    desc: "As someone who has struggled to find the perfect balance between style and comfort, discovering Heed shirts has been a game-changer for me. These shirts have truly transformed my wardrobe with their exceptional quality and fit. Thank you, Heed, for creating such an outstanding product. It’s been a relief to find clothing that genuinely enhances my daily look and comfort. I’m so grateful for the positive impact these shirts have had on my style.",
    name: "Priya Sharma",
  },

];

const sliderSettings = {
  arrows: false,
  autoplay: true,
  autoplaySpeed: 2000,
  slidesToShow: 2,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

let RatingStars = [];
let rating = 5;
for (var i = 0; i < rating; i++) {
  RatingStars.push(<i className="fa fa-star"  style={{color:"#ffa200"}} key={i}></i>);
}

function HomePageReview() {
  return (
    <div style={{background:"#F7F7F7" , padding:"30px 0px"}}>
      <Container >
        <Slider {...sliderSettings} className="slide-1 home-slider text-white">
          {Data.map((data, i) => (
            <div key={i}>
              <Col className="mb-4">
                <div style={{textAlign:"center"}} className="">
                    <div className="rating mb-2">{RatingStars}</div>
                    <h5 className="">{data.title}</h5>
                    <p className="">{data.desc}</p>
                    <p className="card-text">
                      <h6 className="">{data.name}</h6>
                    </p>
                </div>
              </Col>
            </div>
          ))}
        </Slider>
      </Container>
    </div>
  );
}

export default HomePageReview;
