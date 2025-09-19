import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import Image from "next/image";
import Link from "next/link";

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

import Api from "../../../../components/Api";
import { MENUITEMS } from "../../../../components/constant/menu";

// ----------- Data Arrays ----------------
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
  { img: cat1, img1: cat11, title: "Plain Shirts", link: "/collections/plain-shirts" },
  { img: cat2, img1: cat21, title: "Check Shirts", link: "/collections/check-shirts" },
  { img: cat3, img1: cat31, title: "Stripe Shirts", link: "/collections/stripe-shirts" },
  { img: cat5, img1: cat41, title: "Half Sleeve Shirts", link: "/collections/half-sleeve-shirts" },
  { img: cat5, img1: cat51, title: "Over Sized Shirts", link: "/collections/over-sized-shirts" },
  { img: cat3, img1: cat51, title: "Cargo Shirts", link: "/collections/cargo-shirts" },
  { img: cat3, img1: cat51, title: "Printed Shirts", link: "/collections/printed-shirts" },
];

// ----------- Master Section Card ----------------
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
        paddingBottom: "50px",
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
              transform: hovered ? "scale(1.03) rotate(-1deg)" : "scale(1) rotate(0deg)",
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
              height: "40px",
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
            <div
              className="everday_related_category"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <div style={{ textAlign: "center", width: "100%" }}>
                <p
                  style={{
                    color: "#000",
                    fontWeight: "500",
                    fontSize: "16px",
                    margin: "0",
                    wordBreak: "break-word",
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

// ----------- Sections Component ----------------
const Sections = ({ type }) => {
  const array = type === "shop-by-category" ? Data2 : Data;
  const [category, setCategory] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  // Detect Mobile
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 1000);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Fetch API data for shop-by-category
  const fetchData = async () => {
    if (type === "shop-by-category") {
      try {
        const getData = await Api.getFeaturedSection();
        setCategory(getData.data.data.filter((_) => _.category === "T-SHIRT"));
      } catch (error) {
        return;
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderShirtMenuItems = () => {
    const shopItem = MENUITEMS[1];
    const shirtItem = shopItem && shopItem.children.find((item) => item.title === "Shirt");
    return shirtItem.children.filter((item) => item.imageSrc);
  };

  return (
    <section className="section-b-space detail-cannabis bg-grey category">
      <Container>
        <Row style={{ marginTop: isMobile ? "0px" : "-100px" }}>
          <section className="section-b-space detail-cannabis bg-grey category">
            <Container>
              <Row style={{ gap: "25px 0px" }}>
                {array.map((data, i) => (
                  <Col
                    key={i}
                    lg={3}   
                    md={3}   
                    sm={6}   
                    xs={6}   
                  >
                    <MasterSection
                      img={data.img}
                      img1={data.img1}
                      title={data.title}
                      link={data.link}
                    />
                  </Col>
                ))}
              </Row>
            </Container>
          </section>
        </Row>
      </Container>
    </section>
  );
};

export default Sections;
