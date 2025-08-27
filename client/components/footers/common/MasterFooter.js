import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Container, Row, Col, Collapse } from "reactstrap";
import LogoImage from "../../headers/common/logo";
import CopyRight from "./copyright";
import XIcon from "@mui/icons-material/X";
import { toast } from "react-toastify";

const MasterFooter = ({
  layoutClass,
  footerClass,
  belowSection,
  belowContainerFluid,
  CopyRightFluid,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isOpen, setIsOpen] = useState();
  const [collapse, setCollapse] = useState(0);
  const width = typeof window !== "undefined" && window.innerWidth <= 767;
  useEffect(() => {
    const changeCollapse = () => {
      if (window.innerWidth <= 767) {
        setCollapse((prev) => (prev === 0 ? 1 : prev)); // keep previous collapse section
        // Don't auto-close on keyboard resize
      } else {
        setIsOpen(true);
      }
    };
  
    changeCollapse();
  
    // Debounce the resize event to avoid rapid fire issues
    let resizeTimeout;
    const debounceResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(changeCollapse, 200);
    };
  
    window.addEventListener("resize", debounceResize);
    return () => {
      window.removeEventListener("resize", debounceResize);
    };
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    toast.success("Thanks for subscribing");
    setNewsletterEmail("");
  };

  return (
    <footer className={footerClass}>
      <section className={belowSection}>
        <Container fluid={belowContainerFluid ? belowContainerFluid : ""}>
          <Row className="footer-theme partition-f">
            {/* About Section */}
            <Col lg="4" md="6">
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
                  style={{ color: "#FFFFFF" }}
                >
                  about
                  <span className="according-menu"></span>
                </h4>
              </div>
              <Collapse isOpen={width ? collapse === 1 && isOpen : true}>
                <div className="footer-contant">
                  <div className="footer-logo">
                    <LogoImage logo={"whitelogo.png"} />
                  </div>
                  <p>
                    Heed is an Indian contemporary clothing brand committed to
                    empowering discerning men to elevate their style with
                    comfort-luxury, while making every day great fashion
                    choices.
                  </p>
                  <div className="footer-social">
                    <ul>
                      <li>
                        <a
                          href="https://www.facebook.com/HeedYourLooks"
                          target="_blank"
                        >
                          <i className="fa fa-facebook" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li>
                        <a href="https://plus.google.com" target="_blank">
                          <i
                            className="fa fa-google-plus"
                            aria-hidden="true"
                          ></i>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://x.com/heedyourlooks?s=08"
                          target="_blank"
                        >
                          <XIcon
                            style={{ color: "#000000", fontSize: "20px" }}
                          />
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.instagram.com/heedyourlooks/"
                          target="_blank"
                        >
                          <i
                            className="fa fa-instagram"
                            aria-hidden="true"
                          ></i>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.youtube.com/@heedyourlooks"
                          target="_blank"
                        >
                          <i className="fa fa-rss" aria-hidden="true"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </Collapse>
            </Col>

            {/* Main Menu */}
            <Col className="offset-xl-1">
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
                  >
                    Main Menu
                    <span className="according-menu"></span>
                  </h4>
                </div>
                <Collapse isOpen={width ? collapse === 2 && isOpen : true}>
                  <div className="footer-contant">
                    <ul>
                      <li>
                        <Link href={`/`}>Home</Link>
                      </li>
                      <li>
                        <Link href={`/collections/all`}>All Products</Link>
                      </li>
                      <li>
                        <Link href={`/about-us`}>About Us</Link>
                      </li>
                      <li>
                        <Link href={`/contact-us`}>Contact Us</Link>
                      </li>
                      <li>
                        <Link href={`/blogs/all-blogs`}>Blog</Link>
                      </li>
                      <li>
                        <Link
                          href={`https://www.shiprocket.in/shipment-tracking/`}
                        >
                          Track Order
                        </Link>
                      </li>
                      <li>
                        <Link href={`/return-exchange`}>
                          Return And Exchange
                        </Link>
                      </li>
                    </ul>
                  </div>
                </Collapse>
              </div>
            </Col>

            {/* Sign Up & Save */}
            <Col>
              <div className="sub-title">
                <div
                  className={`footer-title ${
                    isOpen && collapse === 3 ? "active" : ""
                  } `}
                >
                  <h4
                    onClick={() => {
                      if (width) {
                        setIsOpen(!isOpen);
                        setCollapse(3);
                      } else {
                        setIsOpen(true);
                      }
                    }}
                    style={{ color: "#FFFFFF" }}
                  >
                    Sign up and save
                    <span className="according-menu"></span>
                  </h4>
                </div>
                <Collapse isOpen={width ? collapse === 3 && isOpen : true}>
                  <div className="footer-contant">
                    <ul>
                      <li>
                        <p>
                          Subscribe to get special offers, free giveaways, and
                          once-in-a-lifetime deals.
                        </p>
                        <form onSubmit={onSubmit}>
                          <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={newsletterEmail}
                            onChange={(e) =>
                              setNewsletterEmail(e.target.value)
                            }
                            className="w-full px-3 sm:w-auto px-4 py-2 text-black shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                          />
                          <button
                            type="submit"
                            className="btn btn-light mt-3 rounded d-block mb-3 p-6"
                            style={{
                              backgroundColor: "#a14c39",
                              border: "none",
                              color: "white",
                            }}
                          >
                            Subscribe
                          </button>
                        </form>
                      </li>
                    </ul>
                  </div>
                </Collapse>
              </div>
            </Col>

            {/* Visit Us */}
            <Col>
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
                  >
                    Visit us
                    <span className="according-menu"></span>
                  </h4>
                </div>
                <Collapse isOpen={width ? collapse === 4 && isOpen : true}>
                  <div className="footer-contant">
                    <ul className="contact-list">
                      <li>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: `<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14005.160709674936!2d77.1661815!3d28.6510289!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d02ec14d8d6cf%3A0x4052b4c2900e5c30!2sBrands%20In!5e0!3m2!1sen!2sin!4v1728665869319!5m2!1sen!2sin" width="300" height="200" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`,
                          }}
                        />
                      </li>
                      <li>
                        <i className="fa fa-envelope-o"></i>Email Us:{" "}
                        <a
                          href="mailto:info@shopheed.com"
                          className="text-white"
                        >
                          info@shopheed.com
                        </a>
                      </li>
                      <li className="mb-0">
                        <i className="fa fa-fax"></i>
                        <Link href="https://shopheed.com/" className="text-white">
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
        <div className="extra_space"></div>
      </section>

      <CopyRight
        layout={layoutClass}
        fluid={CopyRightFluid ? CopyRightFluid : ""}
      />
    </footer>
  );
};

export default MasterFooter;
