  import React, { useEffect, useState } from "react";
  import { Container, Row } from "reactstrap";
  import Image from "next/image";
  import cat1 from "../../../../public/assets/images/fashion/Formal Wear.gif";
  import cat2 from "../../../../public/assets/images/fashion/Everyday Essentials.gif";
  import cat3 from "../../../../public/assets/images/fashion/Dress Shirt.gif";
  import cat4 from "../../../../public/assets/images/fashion/cat4.svg";
  import cat5 from "../../../../public/assets/images/fashion/Street Casuals.gif";
  import cat11 from "../../../../public/assets/images/fashion/cat1.png";
  import cat21 from "../../../../public/assets/images/fashion/cat2.png";
  import cat31 from "../../../../public/assets/images/fashion/cat3.png";
  import cat51 from "../../../../public/assets/images/fashion/cat5.png";
  import cat41 from "../../../../public/assets/images/fashion/cat4.png";
  import Link from "next/link";
  import { Product7 } from "../../../../services/script";
  import Slider from "react-slick";
  import Api from "../../../../components/Api";
  import { MENUITEMS } from "../../../../components/constant/menu";

  const Data = [
    {
      img: cat1,
      img1: cat1,
      title: "FORMAL WEAR",
      link: "/collections/formal wear",
    },
    {
      img: cat2,
      img1: cat2,
      title: "EVERYDAY WEAR",
      link: "/collections/everyday wear",
    },
    {
      img: cat3,
      img1: cat3,
      title: "DESIGNER WEAR",
      link: "/collections/designer wear",
    },

    {
      img: cat5,
      img1: cat5,
      title: "STREET WEAR",
      link: "/collections/street wear",
    },
  ];

  const Data2 = [
    {
      img: cat1,
      img1: cat11,
      title: "Plain Shirts",
      link: "/collections/plain-shirts",
    },
    {
      img: cat2,
      img1: cat21,
      title: "Check Shirts",
      link: "/collections/check-shirts",
    },
    {
      img: cat3,
      img1: cat31,
      title: "Stripe Shirts",
      link: "/collections/stripe-shirts",
    },

    {
      img: cat5,
      img1: cat41,
      title: "Half Sleeve Shirts",
      link: "/collections/half-sleeve-shirts",
    },
    {
      img: cat5,
      img1: cat51,
      title: "Over Sized Shirts",
      link: "/collections/over-sized-shirts",
    },
    {
      img: cat3,
      img1: cat51,
      title: "Cargo Shirts",
      link: "/collections/cargo-shirts",
    },
    {
      img: cat3,
      img1: cat51,
      title: "Printed Shirts",
      link: "/collections/printed-shirts",
    },
  ];

  const MasterSection = ({ img, title, link, img1 }) => {
    const [hovered, setHovered] = useState(false);

    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "100%",
          position: "relative",
          height: "100%",
          cursor: "pointer",
          paddingBottom: "80px",
        }}
        className="detail_section"
      >
        <Link href={link}>
          <div style={{ width: "100%" }}>
            <Image
              className="image"
              style={{
                width: "100%",

                height: "100%",
                maxHeight: "300px",
                objectFit: "cover",
                transform: hovered
                  ? "scale(1.03) rotate(-1deg)"
                  : "scale(1) rotate(0deg)",
                transition: "transform 0.3s ease",
              }}
              src={img}
              alt={title}
              width={500}
              height={200}
              layout="responsive"
            />
          </div>
        </Link>

        <Link href={link}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                height: "80px",
                position: "absolute",
                background: "#FFFFFF",
                bottom: "20px",
                width: "88%",
                boxShadow: "0 4px 8px #0003, 0 6px 20px #00000030",
                display: "flex",
                borderRadius: "5px",
                justifyContent: "start",
                alignItems: "center",
              }}
            >
              {" "}
              <div
                className="everday_related_category"
                style={{
                  display: "flex",
                  alignItems: "center", // Centers items vertically
                  justifyContent: "center", // Centers content horizontally
                  flexDirection: "column", // Stacks elements vertically
                  width: "100%", // Ensures full responsiveness
                }}
              >
                {/* Image component (if needed) */}
                <div style={{ textAlign: "center", width: "100%" }}>
                  <p
                    style={{
                      color: "#000",
                      fontWeight: "500",
                      fontSize: "16px",
                      margin: "0",
                      wordBreak: "break-word", // Ensures text breaks in small screens
                    }}
                  >
                    {title}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  const Sections = ({ type }) => {
    const array = type === "shop-by-category" ? Data2 : Data;
    const [category, setCategory] = useState([]);

    const fetchData = async () => {
      if (type === "shop-by-category") {
        try {
          const getData = await Api.getFeaturedSection();
          console.log(getData)
          setCategory(getData.data.data.filter((_) => _.category == "T-SHIRT"));
        } catch (error) {
          return;
        }
      }
    };

    useEffect(() => {
      fetchData();
    }, []);

    const renderShirtMenuItems = () => {
      //  const shopItem = MENUITEMS && MENUITEMS.find(item => item.title === "Shop");
      const shopItem = MENUITEMS[1];
      const shirtItem =
        shopItem && shopItem.children.find((item) => item.title === "Shirt");
      return shirtItem.children.filter((item) => item.imageSrc);
    };
    return (
      <section className="section-b-space detail-cannabis bg-grey category">
        <Container>
          <Row style={{ gap: "25px 0px" }}>
            <Slider {...Product7} className="product-m no-arrow">
              {type === "shop-by-category"
                ? renderShirtMenuItems() &&
                  renderShirtMenuItems().map((data, i) => (
                    <MasterSection
                      key={i}
                      img={data.imageSrc}
                      img1={data.imageSrc}
                      title={data.title}
                      link={data.path}
                    />
                  ))
                : array.map((data, i) => (
                    <MasterSection
                      key={i}
                      img={data.img}
                      img1={data.img1}
                      title={data.title}
                      link={data.link}
                    />
                  ))}
            </Slider>
          </Row>
        </Container>
      </section>
    );
  };

  export default Sections;
