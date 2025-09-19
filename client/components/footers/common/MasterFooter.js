import React from "react";
import Link from "next/link";
import { Container, Row, Col } from "reactstrap";
import LogoImage from "../../headers/common/logo";
import CopyRight from "./copyright";
import XIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import EmailIcon from "@mui/icons-material/Email";
import LanguageIcon from "@mui/icons-material/Language";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const MasterFooter = ({
  layoutClass,
  footerClass,
  belowSection,
  belowContainerFluid,
  CopyRightFluid,
}) => {
  return (
    <footer
      className={footerClass}
      style={{
        paddingTop: "15px",
      }}
    >
      <section className={belowSection}>
        <Container fluid={belowContainerFluid ? belowContainerFluid : ""}>
          <Row className="footer-theme partition-f">
            {/* About Section */}
            <Col lg="4" md="6" className="mb-4">
              <div className="footer-title footer-mobile-title">
                <h4 style={{ color: "#FFFFFF" }}>About Us</h4>
              </div>
              <div className="footer-contant">
                <div className="footer-logo mb-3">
                  <LogoImage logo={"whitelogo.png"} />
                </div>
                <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
                  Heed is an Indian contemporary clothing brand committed to
                  empowering discerning men to elevate their style with
                  comfort-luxury, while making every day great fashion choices.
                </p>
                <div className="footer-social mt-4">
                  <div className="d-flex gap-3">
                    <a
                      href="https://www.facebook.com/HeedYourLooks"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "rgba(255,255,255,0.15)",
                        transition: "all 0.3s",
                      }}
                    >
                      <FacebookIcon
                        style={{ color: "#FFFFFF", fontSize: "20px" }}
                      />
                    </a>
                    <a
                      href="https://x.com/heedyourlooks?s=08"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "rgba(255,255,255,0.15)",
                        transition: "all 0.3s",
                      }}
                    >
                      <XIcon style={{ color: "#FFFFFF", fontSize: "20px" }} />
                    </a>
                    <a
                      href="https://www.instagram.com/heedyourlooks/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "rgba(255,255,255,0.15)",
                        transition: "all 0.3s",
                      }}
                    >
                      <InstagramIcon
                        style={{ color: "#FFFFFF", fontSize: "20px" }}
                      />
                    </a>
                    <a
                      href="https://www.youtube.com/@heedyourlooks"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "rgba(255,255,255,0.15)",
                        transition: "all 0.3s",
                      }}
                    >
                      <YouTubeIcon
                        style={{ color: "#FFFFFF", fontSize: "20px" }}
                      />
                    </a>
                  </div>
                </div>
              </div>
            </Col>

            {/* Main Menu */}
            <Col lg="4" md="6" className="mb-4">
              <div className="sub-title">
                <div className="footer-title">
                  <h4>Main Menu</h4>
                </div>
                <div className="footer-contant">
                  <Row>
                    <Col sm="6">
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <Link
                            href={`/`}
                            className="text-white text-decoration-none"
                          >
                            Home
                          </Link>
                        </li>
                        <li className="mb-2">
                          <Link
                            href={`/collections/all`}
                            className="text-white text-decoration-none"
                          >
                            All Products
                          </Link>
                        </li>
                        <li className="mb-2">
                          <Link
                            href={`/about-us`}
                            className="text-white text-decoration-none"
                          >
                            About Us
                          </Link>
                        </li>
                        <li className="mb-2">
                          <Link
                            href={`/contact-us`}
                            className="text-white text-decoration-none"
                          >
                            Contact Us
                          </Link>
                        </li>
                      </ul>
                    </Col>
                    <Col sm="6">
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <Link
                            href={`/blogs/all-blogs`}
                            className="text-white text-decoration-none"
                          >
                            Blog
                          </Link>
                        </li>
                        <li className="mb-2">
                          <Link
                            href={`https://www.shiprocket.in/shipment-tracking/`}
                            className="text-white text-decoration-none"
                          >
                            Track Order
                          </Link>
                        </li>
                        <li className="mb-2">
                          <Link
                            href={`/return-exchange`}
                            className="text-white text-decoration-none"
                          >
                            Return And Exchange
                          </Link>
                        </li>
                      </ul>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>

            {/* Contact Us */}
            <Col lg="4" md="6" className="mb-4">
              <div className="sub-title">
                <div className="footer-title">
                  <h4>Contact Us</h4>
                </div>
                <div className="footer-contant">
                  <div
                    className="mb-3"
                    style={{ borderRadius: "8px", overflow: "hidden" }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: `<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14005.160709674936!2d77.1661815!3d28.6510289!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d02ec14d8d6cf%3A0x4052b4c2900e5c30!2sBrands%20In!5e0!3m2!1sen!2sin!4v1728665869319!5m2!1sen!2sin" width="100%" height="150" style="border-radius:8px;border:none;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`,
                      }}
                    />
                  </div>
                  <ul className="list-unstyled contact-list">
                    <li className="mb-2 d-flex align-items-center">
                      <LocationOnIcon
                        style={{
                          fontSize: "16px",
                          marginRight: "10px",
                          color: "#F5DEB3",
                        }}
                      />
                      <span style={{ fontSize: "14px" }}>
                        Brands In, H-25/134, Delhi, India
                      </span>
                    </li>
                    <li className="mb-2 d-flex align-items-center">
                      <EmailIcon
                        style={{
                          fontSize: "16px",
                          marginRight: "10px",
                          color: "#F5DEB3",
                        }}
                      />
                      <a
                        href="mailto:info@shopheed.com"
                        className="text-white text-decoration-none"
                        style={{ fontSize: "14px" }}
                      >
                        info@shopheed.com
                      </a>
                    </li>
                    <li className="d-flex align-items-center">
                      <LanguageIcon
                        style={{
                          fontSize: "16px",
                          marginRight: "10px",
                          color: "#F5DEB3",
                        }}
                      />
                      <Link
                        href="https://shopheed.com/"
                        className="text-white text-decoration-none"
                        style={{ fontSize: "14px" }}
                      >
                        www.shopheed.com
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <CopyRight
        layout={layoutClass}
        fluid={CopyRightFluid ? CopyRightFluid : ""}
      />
    </footer>
  );
};

export default MasterFooter;
