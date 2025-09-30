import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import Image from "next/image";
import Link from "next/link";

import cat1 from "../../../../public/assets/images/fashion/Formal Wear.gif";
import cat2 from "../../../../public/assets/images/fashion/Everyday Essentials.gif";
import cat3 from "../../../../public/assets/images/fashion/Dress Shirt.gif";
import cat5 from "../../../../public/assets/images/fashion/Street Casuals.gif";

// Data Array
const Data = [
  { img: cat1, title: "FORMAL WEAR", link: "/collections/formal wear" },
  { img: cat2, title: "EVERYDAY WEAR", link: "/collections/everyday wear" },
  { img: cat3, title: "DESIGNER WEAR", link: "/collections/designer wear" },
  { img: cat5, title: "STREET WEAR", link: "/collections/street wear" },
];

// Master Section Card
const MasterSection = ({ img, title, link }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        cursor: "pointer",
        width: "100%",
        overflow: "hidden",
        borderRadius: "10px",
      }}
    >
      <Link href={link}>
        <Image
          src={img}
          alt={title}
          width={500}
          height={300}
          layout="responsive"
          style={{
            borderRadius: "10px",
            transition: "transform 0.3s ease",
            transform: hovered ? "scale(1.05)" : "scale(1)",
          }}
        />
      </Link>

      <Link href={link}>
        <div
          style={{
            position: "absolute",
            bottom: "15px",
            left: "15px",
            // backgroundColor: "rgba(0,0,0,0.6)",
            padding: "10px 15px",
            borderRadius: "5px",
            border:"2px solid #fff",
          }}
        >
          <p
            style={{
              color: "#fff",
              margin: 0,
              fontSize: "20px",
              fontWeight: "600",
            }}
          >
            {title}
          </p>
        </div>
      </Link>
    </div>
  );
};

// Sections Component
const Sections = ({ type }) => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect Mobile
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const array = Data; // for now, you can extend for type="shop-by-category"

  return (
    <section className="section-b-space bg-grey category">
      <Container>
        <Row className="g-3">
          {array.map((data, i) => (
            <Col
              key={i}
              lg={6}
              md={6}
              sm={12}
              xs={12}
              className="mb-3"
            >
              <MasterSection {...data} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Sections;
