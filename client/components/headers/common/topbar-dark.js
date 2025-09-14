"use client";
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import styles from "../../../public/assets/scss/TopBarDark.module.css";
import Api from "../../Api/index";

const TopBarDark = ({ topClass, fluid }) => {
  const [announcement, setAnnouncement] = useState("");
  const [isActive, setIsActive] = useState(false);

  // ✅ Fetch announcement when component mounts
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

  if (!isActive) return null; // Hide bar if inactive

  return (
    <div className={topClass}>
      <Container fluid={fluid}>
        <Row>
          <Col lg="12">
            <div className={`${styles.marquee} header-contact`}>
              <div className={styles.marqueeContent}>
                <ul>
                  <li>{announcement || "Welcome to our store!"}</li>
                </ul>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TopBarDark;
