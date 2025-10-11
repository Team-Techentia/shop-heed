"use client";
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import Api from "../../Api/index";

const TopBarDark = ({ topClass, fluid }) => {
  const [announcement, setAnnouncement] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const res = await Api.getAnnouncement();
        setAnnouncement(res.data?.data?.text || "");
        setIsActive(res.data?.data?.isActive || false);
      } catch (err) {
        console.error("Failed to fetch announcement", err);
      }
    };
    fetchAnnouncement();
  }, []);

  if (!isActive) return null;

  // Inline styles
  const topBarStyle = {
    backgroundColor: "#A94C37",
    color: "white",
    padding: "10px 0",
  };

  const marqueeStyle = {
    overflow: "hidden",
    whiteSpace: "nowrap",
    animation: "marquee 15s linear infinite",
  };

  const marqueeContentStyle = {
    display: "inline-block",
    padding: 0,
    margin: 0,
    listStyle: "none",
  };

  const keyframesStyle = `
    @keyframes marquee {
      0% {
        transform: translateX(100%);
      }
      100% {
        transform: translateX(-100%);
      }
    }
  `;

  return (
    <>
      {/* Inject keyframes directly into page */}
      <style>{keyframesStyle}</style>

      <div className={`${topClass}`} style={topBarStyle}>
        <Container fluid={fluid}>
          <Row>
            <Col lg="12">
              <div style={marqueeStyle} className="header-contact">
                <div style={marqueeContentStyle}>
                  <ul style={{ display: "inline-block" }}>
                    <li style={{ display: "inline", paddingRight: "100%" }}>
                      {announcement || "Welcome to our store!"}
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default TopBarDark;
