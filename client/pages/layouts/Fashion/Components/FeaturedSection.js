import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import Image from "next/image";
import Link from "next/link";
import { Product7 } from "../../../../services/script";
import Slider from "react-slick";
import Api from "../../../../components/Api";

// Default fallback image
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
            src={img || defaultImage}
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

const FeaturedSections = () => {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const getData = await Api.getFeaturedSection();
      
      if (getData?.data?.success && getData?.data?.data) {
        // Sort by priority and filter active items
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

  // Function to format category name for display
  const formatCategoryName = (category, subCategory) => {
    let displayName = category.toUpperCase().replace("-", " ");
    
    if (subCategory) {
      displayName += ` - ${subCategory.toUpperCase()}`;
    }
    
    return displayName;
  };

  // Function to generate link from category and subcategory
  const generateLink = (category, subCategory) => {
  if (subCategory) {
    return `/category/${category}/${subCategory}`; // handle subcategory case
  }
  return `/category/${category}`; // handle only category
};

  if (loading) {
    return (
      <section className="section-b-space detail-cannabis bg-grey category">
        <Container>
          <Row style={{ gap: "25px 0px" }}>
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
    <Row style={{ gap: "25px 0px" }}>
      {category.map((data, i) => (
        <Col lg={3} md={4} sm={6} xs={12} key={data._id || i}>
          <MasterSection
            img={data.image}
            title={formatCategoryName(data.category, data.subCategory)}
            link={generateLink(data.category, data.subCategory)}
          />
        </Col>
      ))}
    </Row>
  </Container>
</section>
  );
};

export default FeaturedSections;