import React from "react";
import Link from "next/link";
import { Container, Row, Col } from "reactstrap";
import CopyRight from "./copyright";
import XIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";

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
        backgroundColor: "#EEE1C6", // Beige
        paddingTop: "20px",
        color: "#000000",
      }}
    >
      <section className={belowSection}>
        <Container fluid={belowContainerFluid ? belowContainerFluid : ""}>
          <Row className="footer-theme partition-f">
            {/* About Us */}
            <Col lg="4" md="6" className="mb-4">
              <div className="footer-title footer-mobile-title">
                <h4 style={{ color: "#000000", fontWeight: "bold" }}>About Us</h4>
              </div>
              <div className="footer-contant">
                <div className="footer-logo mb-3">
                  <img
                    src="assets/images/logo1.png"
                    alt="Heed Logo"
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#333" }}>
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
                        backgroundColor: "rgba(0,0,0,0.1)",
                      }}
                    >
                      <FacebookIcon style={{ color: "#000000", fontSize: "20px" }} />
                    </a>
                    <a
                      href="https://x.com/heedyourlooks?s=08"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "rgba(0,0,0,0.1)",
                      }}
                    >
                      <XIcon style={{ color: "#000000", fontSize: "20px" }} />
                    </a>
                    <a
                      href="https://www.instagram.com/heedyourlooks/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "rgba(0,0,0,0.1)",
                      }}
                    >
                      <InstagramIcon style={{ color: "#000000", fontSize: "20px" }} />
                    </a>
                    <a
                      href="https://www.youtube.com/@heedyourlooks"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "rgba(0,0,0,0.1)",
                      }}
                    >
                      <YouTubeIcon style={{ color: "#000000", fontSize: "20px" }} />
                    </a>
                  </div>
                </div>
              </div>
            </Col>

            {/* Main Menu */}
            <Col lg="4" md="6" className="mb-4">
              <div className="footer-title">
                <h4 style={{ color: "#000000", fontWeight: "bold" }}>Main Menu</h4>
              </div>
              <div className="footer-contant">
                <ul className="list-unstyled mb-2">
                  <li>
                    <Link href={`/about-us`} className="text-dark text-decoration-none">
                      About Us
                    </Link>
                  </li>
                </ul>
                <ul className="list-unstyled mb-2">
                  <li>
                    <Link href={`/contact-us`} className="text-dark text-decoration-none">
                      Contact Us
                    </Link>
                  </li>
                </ul>
                <ul className="list-unstyled mb-2">
                  <li>
                    <Link href={`/bulk-enquiry`} className="text-dark text-decoration-none">
                      Work With Us
                    </Link>
                  </li>
                </ul>
                <ul className="list-unstyled">
                  <li>
                    <Link href={`/blogs/all-blogs`} className="text-dark text-decoration-none">
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>
            </Col>

            {/* Help */}
            <Col lg="4" md="6" className="mb-4">
              <div className="footer-title">
                <h4 style={{ color: "#000000", fontWeight: "bold" }}>Help</h4>
              </div>
              <div className="footer-contant">
                <ul className="list-unstyled mb-2">
                  <li>
                    <Link href={`/return-exchange`} className="text-dark text-decoration-none">
                      Return & Exchange
                    </Link>
                  </li>
                </ul>
                <ul className="list-unstyled mb-2">
                  <li>
                    <Link href={`/shipping-delivery`} className="text-dark text-decoration-none">
                      Shipping & Delivery
                    </Link>
                  </li>
                </ul>
                <ul className="list-unstyled mb-2">
                  <li>
                    <Link href={`/privacy-policy`} className="text-dark text-decoration-none">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
                <ul className="list-unstyled">
                  <li>
                    <Link href={`/terms-conditions`} className="text-dark text-decoration-none">
                      Terms & Conditions
                    </Link>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <CopyRight/>
    </footer>
  );
};

export default MasterFooter;
