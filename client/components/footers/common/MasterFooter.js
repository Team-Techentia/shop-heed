import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Container, Row, Col, Collapse } from "reactstrap";
import LogoImage from "../../headers/common/logo";
import CopyRight from "./copyright";
import XIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import EmailIcon from "@mui/icons-material/Email";
import LanguageIcon from "@mui/icons-material/Language";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { toast } from "react-toastify";

const MasterFooter = ({
  layoutClass,
  footerClass,
  belowSection,
  belowContainerFluid,
  CopyRightFluid,
}) => {
  const [isOpen, setIsOpen] = useState();
  const [collapse, setCollapse] = useState(0);
  const width = typeof window !== "undefined" && window.innerWidth <= 767;
  
  useEffect(() => {
    const changeCollapse = () => {
      if (window.innerWidth <= 767) {
        setCollapse((prev) => (prev === 0 ? 1 : prev));
      } else {
        setIsOpen(true);
      }
    };
  
    changeCollapse();
  
    let resizeTimeout;
    const debounceResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(changeCollapse, 200);
    };
  
    window.addEventListener("resize", debounceResize);
    return () => {
      window.removeEventListener("resize", debounceResize);
    };
  }, []);

  return (
    <footer className={footerClass} style={{ 
      background: "linear-gradient(135deg, #8B4513 0%, #A0522D 30%, #CD853F 100%)",
      color: "#fff",
      paddingTop: "40px",
      boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.15)"
    }}>
      <section className={belowSection}>
        <Container fluid={belowContainerFluid ? belowContainerFluid : ""}>
          <Row className="footer-theme partition-f">
            {/* About Section */}
            <Col lg="4" md="6" className="mb-4">
              <div
                className={`footer-title ${
                  isOpen && collapse === 1 ? "active" : ""
                } footer-mobile-title`}
              >
                <h4
                  onClick={() => {
                    setCollapse(1);
                    setIsOpen(!isOpen);
                  }}
                  style={{ color: "#FFFFFF", cursor: "pointer" }}
                >
                  About Us
                  <span className="according-menu">{width && (collapse === 1 && isOpen ? "−" : "+")}</span>
                </h4>
              </div>
              <Collapse isOpen={width ? collapse === 1 && isOpen : true}>
                <div className="footer-contant">
                  <div className="footer-logo mb-3">
                    <LogoImage logo={"whitelogo.png"} />
                  </div>
                  <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#F5DEB3" }}>
                    Heed is an Indian contemporary clothing brand committed to
                    empowering discerning men to elevate their style with
                    comfort-luxury, while making every day great fashion
                    choices.
                  </p>
                  <div className="footer-social mt-4">
                    <div className="d-flex gap-3">
                      <a
                        href="https://www.facebook.com/HeedYourLooks"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="d-flex align-items-center justify-content-center rounded-circle"
                        style={{ width: "40px", height: "40px", backgroundColor: "rgba(255,255,255,0.15)", transition: "all 0.3s" }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.25)"}
                        onMouseLeave={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.15)"}
                      >
                        <FacebookIcon style={{ color: "#FFFFFF", fontSize: "20px" }} />
                      </a>
                      <a
                        href="https://x.com/heedyourlooks?s=08"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="d-flex align-items-center justify-content-center rounded-circle"
                        style={{ width: "40px", height: "40px", backgroundColor: "rgba(255,255,255,0.15)", transition: "all 0.3s" }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.25)"}
                        onMouseLeave={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.15)"}
                      >
                        <XIcon style={{ color: "#FFFFFF", fontSize: "20px" }} />
                      </a>
                      <a
                        href="https://www.instagram.com/heedyourlooks/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="d-flex align-items-center justify-content-center rounded-circle"
                        style={{ width: "40px", height: "40px", backgroundColor: "rgba(255,255,255,0.15)", transition: "all 0.3s" }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.25)"}
                        onMouseLeave={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.15)"}
                      >
                        <InstagramIcon style={{ color: "#FFFFFF", fontSize: "20px" }} />
                      </a>
                      <a
                        href="https://www.youtube.com/@heedyourlooks"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="d-flex align-items-center justify-content-center rounded-circle"
                        style={{ width: "40px", height: "40px", backgroundColor: "rgba(255,255,255,0.15)", transition: "all 0.3s" }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.25)"}
                        onMouseLeave={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.15)"}
                      >
                        <YouTubeIcon style={{ color: "#FFFFFF", fontSize: "20px" }} />
                      </a>
                    </div>
                  </div>
                </div>
              </Collapse>
            </Col>

            {/* Main Menu */}
            <Col lg="4" md="6" className="mb-4">
              <div className="sub-title">
                <div
                  className={`footer-title ${
                    isOpen && collapse === 2 ? "active" : ""
                  }`}
                >
                  <h4
                    onClick={() => {
                      if (width) {
                        setIsOpen(!isOpen);
                        setCollapse(2);
                      } else setIsOpen(true);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    Main Menu
                    <span className="according-menu">{width && (collapse === 2 && isOpen ? "−" : "+")}</span>
                  </h4>
                </div>
                <Collapse isOpen={width ? collapse === 2 && isOpen : true}>
                  <div className="footer-contant">
                    <Row>
                      <Col sm="6">
                        <ul className="list-unstyled">
                          <li className="mb-2">
                            <Link href={`/`} className="text-white text-decoration-none d-block py-1" style={{ transition: "all 0.2s" }}
                              onMouseEnter={(e) => e.target.style.paddingLeft = "8px"}
                              onMouseLeave={(e) => e.target.style.paddingLeft = "0"}
                            >Home</Link>
                          </li>
                          <li className="mb-2">
                            <Link href={`/collections/all`} className="text-white text-decoration-none d-block py-1" style={{ transition: "all 0.2s" }}
                              onMouseEnter={(e) => e.target.style.paddingLeft = "8px"}
                              onMouseLeave={(e) => e.target.style.paddingLeft = "0"}
                            >All Products</Link>
                          </li>
                          <li className="mb-2">
                            <Link href={`/about-us`} className="text-white text-decoration-none d-block py-1" style={{ transition: "all 0.2s" }}
                              onMouseEnter={(e) => e.target.style.paddingLeft = "8px"}
                              onMouseLeave={(e) => e.target.style.paddingLeft = "0"}
                            >About Us</Link>
                          </li>
                          <li className="mb-2">
                            <Link href={`/contact-us`} className="text-white text-decoration-none d-block py-1" style={{ transition: "all 0.2s" }}
                              onMouseEnter={(e) => e.target.style.paddingLeft = "8px"}
                              onMouseLeave={(e) => e.target.style.paddingLeft = "0"}
                            >Contact Us</Link>
                          </li>
                        </ul>
                      </Col>
                      <Col sm="6">
                        <ul className="list-unstyled">
                          <li className="mb-2">
                            <Link href={`/blogs/all-blogs`} className="text-white text-decoration-none d-block py-1" style={{ transition: "all 0.2s" }}
                              onMouseEnter={(e) => e.target.style.paddingLeft = "8px"}
                              onMouseLeave={(e) => e.target.style.paddingLeft = "0"}
                            >Blog</Link>
                          </li>
                          <li className="mb-2">
                            <Link
                              href={`https://www.shiprocket.in/shipment-tracking/`}
                              className="text-white text-decoration-none d-block py-1" style={{ transition: "all 0.2s" }}
                              onMouseEnter={(e) => e.target.style.paddingLeft = "8px"}
                              onMouseLeave={(e) => e.target.style.paddingLeft = "0"}
                            >
                              Track Order
                            </Link>
                          </li>
                          <li className="mb-2">
                            <Link href={`/return-exchange`} className="text-white text-decoration-none d-block py-1" style={{ transition: "all 0.2s" }}
                              onMouseEnter={(e) => e.target.style.paddingLeft = "8px"}
                              onMouseLeave={(e) => e.target.style.paddingLeft = "0"}
                            >
                              Return And Exchange
                            </Link>
                          </li>
                        </ul>
                      </Col>
                    </Row>
                  </div>
                </Collapse>
              </div>
            </Col>

            {/* Contact Us */}
            <Col lg="4" md="6" className="mb-4">
              <div className="sub-title">
                <div
                  className={`footer-title ${
                    isOpen && collapse === 4 ? "active" : ""
                  }`}
                >
                  <h4
                    onClick={() => {
                      if (width) {
                        setIsOpen(!isOpen);
                        setCollapse(4);
                      } else setIsOpen(true);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    Contact Us
                    <span className="according-menu">{width && (collapse === 4 && isOpen ? "−" : "+")}</span>
                  </h4>
                </div>
                <Collapse isOpen={width ? collapse === 4 && isOpen : true}>
                  <div className="footer-contant">
                    <div className="mb-3" style={{ borderRadius: "8px", overflow: "hidden" }}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: `<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14005.160709674936!2d77.1661815!3d28.6510289!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d02ec14d8d6cf%3A0x4052b4c2900e5c30!2sBrands%20In!5e0!3m2!1sen!2sin!4v1728665869319!5m2!1sen!2sin" width="100%" height="150" style="border-radius:8px;border:none;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`,
                        }}
                      />
                    </div>
                    <ul className="list-unstyled contact-list">
                      <li className="mb-2 d-flex align-items-center">
                        <LocationOnIcon style={{ fontSize: "16px", marginRight: "10px", color: "#F5DEB3" }} />
                        <span style={{ color: "#F5DEB3", fontSize: "14px" }}>
                          Brands In, H-25/134, Delhi, India
                        </span>
                      </li>
                      <li className="mb-2 d-flex align-items-center">
                        <EmailIcon style={{ fontSize: "16px", marginRight: "10px", color: "#F5DEB3" }} />
                        <a
                          href="mailto:info@shopheed.com"
                          className="text-white text-decoration-none"
                          style={{ fontSize: "14px" }}
                        >
                          info@shopheed.com
                        </a>
                      </li>
                      <li className="d-flex align-items-center">
                        <LanguageIcon style={{ fontSize: "16px", marginRight: "10px", color: "#F5DEB3" }} />
                        <Link href="https://shopheed.com/" className="text-white text-decoration-none" style={{ fontSize: "14px" }}>
                          www.shopheed.com
                        </Link>
                      </li>
                    </ul>
                  </div>
                </Collapse>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <CopyRight
        layout={layoutClass}
        fluid={CopyRightFluid ? CopyRightFluid : ""}
      />
      
      <style jsx>{`
        @media (max-width: 767px) {
          .footer-title {
            padding: 12px 0;
            border-bottom: 1px solid rgba(255,255,255,0.1);
          }
          
          .footer-title h4 {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0;
          }
          
          .footer-contant {
            padding: 15px 0;
          }
        }
        
        .according-menu {
          font-weight: bold;
        }
      `}</style>
    </footer>
  );
};

export default MasterFooter;