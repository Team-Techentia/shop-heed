import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import Image from "next/image";
import Link from "next/link";
import Api from "../../../../components/Api";

const defaultImage = "/assets/images/fashion/default-category.png";

const MasterSection = ({ img, title, link }) => {
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
      }}
      className="detail_section"
    >
      <Link href={link}>
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          <Image
            className="image"
            style={{
              width: "100%",
              height: "100%",
              maxHeight: "450px",
            }}
            src={img || defaultImage}
            alt={title}
            width={300}
            height={300}
            layout="responsive"
          />

          {/* Overlay text */}
          <div
            className="overlay-text"
            style={{
              position: "absolute",
              bottom: "5px",
              left: "50%",
              transform: "translateX(-50%)",
              color: "#fff",
              fontWeight: "400",
              fontSize: "10px",
              textAlign: "center",
              width: "100%",
              letterSpacing: "0.5px",
              textTransform: "uppercase",

              /* 🔥 BLACK OUTLINE */
              textShadow: `
      -1px -1px 0 #000,
       1px -1px 0 #000,
      -1px  1px 0 #000,
       1px  1px 0 #000
    `,
            }}
          >
            {title}
          </div>
        </div>
      </Link>
    </div>
  );
};

const FeaturedSections = () => {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const getData = await Api.getFeaturedSection();
      if (getData?.data?.success && getData?.data?.data) {
        const sortedData = getData.data.data
          .filter(item => item.isActive)
          .sort((a, b) => a.priority - b.priority);
        setCategory(sortedData);
      }
    } catch (error) {
      console.error("Error fetching featured sections:", error);
      setCategory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCategoryName = (category, subCategory) => {
    // Agar subcategory hai toh sirf subcategory display karo
    if (subCategory) {
      // Space ko hyphen se replace karo aur uppercase mein convert karo
      return subCategory.replace(/-/g, ' ').toUpperCase();
    }
    // Agar sirf category hai toh category display karo
    return category.toUpperCase();
  };

  const generateLink = (category, subCategory) => {
    return subCategory ? `/category/${category}/${subCategory}` : `/category/${category}`;
  };

  if (loading) {
    return (
      <section className="section-b-space detail-cannabis bg-grey category">
        <Container>
          <Row style={{ gap: "10px 0px" }}>
            <div style={{ textAlign: "center", padding: "50px" }}>
              <p>Loading categories...</p>
            </div>
          </Row>
        </Container>
      </section>
    );
  }

  if (category.length === 0) {
    return (
      <section className="section-b-space detail-cannabis bg-grey category">
        <Container>
          <Row style={{ gap: "25px 0px" }}>
            <div style={{ textAlign: "center", padding: "50px" }}>
              <p>No categories available</p>
            </div>
          </Row>
        </Container>
      </section>
    );
  }

  return (
    <section className="section-b-space detail-cannabis bg-grey category">
      <Container>
        <Row style={{ gap: "10px 0px" }}>
          {category.map((data, i) => (
            <Col lg={4} md={4} sm={4} xs={4} key={data._id || i} style={{ padding: "2px" }}>
              <MasterSection
                img={data.image}
                title={formatCategoryName(data.category, data.subCategory)}
                link={generateLink(data.category, data.subCategory)}
              />
            </Col>
          ))}
        </Row>
      </Container>

      {/* Responsive styling */}
      <style jsx>{`
        @media (max-width: 768px) {
          .overlay-text {
            font-size: 14px !important;
            width: 80% !important;
            height: auto !important;
            line-height: 1.4em !important;
            padding: 5px 10px;
            bottom: 10px !important;
          }
          .detail_section .image {
            max-height: 250px !important;
          }
        }

        @media (max-width: 480px) {
          .overlay-text {
            font-size: 12px !important;
            width: 90% !important;
            line-height: 1.2em !important;
            padding: 4px 8px;
          }
        }
      `}</style>
    </section>
  );
};

export default FeaturedSections;