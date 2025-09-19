import React, { useState, useEffect } from "react";
import NavBar from "./common/navbar";
import SideBar from "./common/sidebar";
import CartContainer from "../containers/CartContainer";
import TopBarDark from "./common/topbar-dark";
import { Container, Row, Col, Input } from "reactstrap";
import LogoImage from "./common/logo";
import settings from "../../public/assets/images/icon/setting.png";
import cart from "../../public/assets/images/icon/cart.png";
import Currency from "./common/currency";
import { useRouter } from "next/router";
import SearchOverlay from "./common/search-overlay";
import { useMediaQuery } from "@mui/material";
import SearchSiteBar from "./common/searchSideBar";


const HeaderOne = ({ logoName }) => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const isSmallScreen = useMediaQuery("(max-width: 1199px)");
  useEffect(() => {
    setTimeout(function () {
      document.querySelectorAll(".loader-wrapper").style = "display:none";
    }, 2000);

    if (router.asPath !== "/layouts/Christmas")
      window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    let number =
      window.pageXOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    setTimeout(() => {
      if (document.getElementById("sticky").classList) {
        if (number > 1) {
          if (number >= 50) {
            if (window.innerWidth < 81)
              document.getElementById("sticky").classList.remove("fixed");
            else document.getElementById("sticky").classList.add("fixed");
          }
        } else document.getElementById("sticky").classList.remove("fixed");
      }
    }, 100);
  };

  const openNav = () => {
    var openmyslide = document.getElementById("mySidenav");
    if (openmyslide) {
      openmyslide.classList.add("open-side");
      document.body.style.overflow = 'hidden';
    };
  }

  return (
    <div>
      <header id="sticky" className="sticky header-2 header-6">
        <TopBarDark topClass="top-header d-sm-block" />

        <Container>
          <Row>
            <Col>
              <div className="main-menu border-section border-top-0">
                <div style={{ display: isSmallScreen ? "none" : "" }}>
                  <form
                    style={{
                      padding: "0px 15px ",
                      borderRadius: "5px",
                      backgroundColor: "#f8f8f8",
                    }}
                    className="form_search"
                    role="textbox"
                  >
                    <i
                      style={{
                        position: "absolute",
                        top: "15px",
                        fontSize: "18px",
                      }}
                      className="fa fa-search"
                    ></i>

                    <Input
                      id="query search-autocomplete"
                      placeholder="What are you looking for ?"
                      className="nav-search nav-search-field"
                      aria-expanded="true"
                      value={value}
                      style={{
                        border: "none",
                        boxShadow: "none",
                        marginLeft: "16px",
                      }}
                      onClick={() => {
                        var closemyslide =
                          document.getElementById("search_side_bar");
                        if (closemyslide)
                          closemyslide.classList.add("open-side");
                      }}
                    />
                  </form>
                </div>
                <SearchSiteBar />
                {isSmallScreen ? (
                  <>
                    {" "}
                    <a
                      style={{ position: "relative" }}
                      href={null}
                      onClick={openNav}
                    >
                      <i
                        style={{ fontSize: "23px" }}
                        className="fa fa-bars sidebar-bar"
                        aria-hidden="true"
                      ></i>
                    </a>
                    <SideBar />{" "}
                  </>
                ) : null}
                <div
                  className="brand-logo layout2-logo"
                  style={{ left: isSmallScreen ? "" : "-75px" }}
                >
                  <LogoImage logo={logoName} />
                </div>
                <div className="menu-right pull-right">
                  <div>
                    <div className="icon-nav">
                      <ul
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {isSmallScreen ? null : (
                          <Currency icon={settings.src} />
                        )}

                        <CartContainer icon={cart.src} />
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <Container>
          <Row>
            <Col lg="12">
              <div className="main-nav-center">
                <NavBar />
              </div>
            </Col>
          </Row>
        </Container>
      </header>

      <SearchOverlay />
    </div>
  );
};

export default HeaderOne;
