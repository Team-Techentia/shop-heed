import React, { Fragment, useContext, useMemo, useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import Link from "next/link";
import UserContext from "../../../helpers/user/UserContext";
import { useQuery } from "@tanstack/react-query";
import Api from "../../Api";

const SideBar = () => {
  const userContext = useContext(UserContext);
  const isLogin = userContext.isLogin;
  const logOut = userContext.logOut;

  const [expandedCategories, setExpandedCategories] = useState({});

  const { data: navCategoriesData, isLoading } = useQuery({
    queryKey: ["navCategories"],
    queryFn: async () => {
      const res = await Api.getNavbarCategories();
      return res.data; // API data
    }
  });

  // Transform API data - Show ALL categories
  const dynamicCategories = useMemo(() => {
    if (!navCategoriesData?.data) return [];
    return navCategoriesData.data
      // Comment out filter to show ALL categories
      // .filter(c => c.subcategories && c.subcategories.length > 0)
      .sort((a, b) => (b.subcategories?.length || 0) - (a.subcategories?.length || 0))
      // Remove slice to show all categories (not just top 5)
      // .slice(0, 5)
      .map(c => ({
        name: c.name,
        slug: c.slug,
        subcategories: c.subcategories?.map(sub => ({
          name: sub.name,
          path: `/category/${c.slug}/${sub.slug}`,
          slug: sub.slug
        })) || [] // Empty array if no subcategories
      }));
  }, [navCategoriesData]);

  // Initialize all categories as collapsed by default (not expanded)
  useEffect(() => {
    const initExpanded = {};
    dynamicCategories.forEach(cat => {
      initExpanded[cat.slug] = false; // Changed to false
    });
    setExpandedCategories(initExpanded);
  }, [dynamicCategories]);

  const toggleCategory = (categorySlug) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categorySlug]: !prev[categorySlug]
    }));
  };

  const closeNav = () => {
    const closemyslide = document.getElementById("mySidenav");
    if (closemyslide) {
      closemyslide.classList.remove("open-side");
      document.body.style.overflow = 'auto';
    }
  };

  const handleMegaSubmenu = (event) => {
    if (event.target.classList.contains("sub-arrow")) return;
    const menu = event.target.nextElementSibling;
    if (menu?.classList.contains("opensidesubmenu")) menu.classList.remove("opensidesubmenu");
    else menu?.classList.add("opensidesubmenu");
  };

  const renderDynamicCategories = () => {
    if (isLoading) {
      return (
        <Col xl="4">
          <div className="link-section">
            <h5>Loading categories...</h5>
          </div>
        </Col>
      );
    }

    if (!dynamicCategories.length) {
      return (
        <Col xl="4">
          <div className="link-section">
            <h5>Shirt</h5>
            <ul>
              <li><Link href="/collections/plain-shirts">Plain Shirts</Link></li>
              <li><Link href="/collections/check-shirts">Check Shirts</Link></li>
            </ul>
          </div>
        </Col>
      );
    }

    const categoriesPerColumn = Math.ceil(dynamicCategories.length / 3);
    const columns = [];

    for (let i = 0; i < 3; i++) {
      const startIndex = i * categoriesPerColumn;
      const endIndex = Math.min(startIndex + categoriesPerColumn, dynamicCategories.length);
      const columnCategories = dynamicCategories.slice(startIndex, endIndex);

      if (columnCategories.length > 0) {
        columns.push(
          <Col xl="4" key={i}>
            <div className="link-section">
              {columnCategories.map(category => (
                <Fragment key={category.slug}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                    {/* Category name links to category page */}
                    <Link href={`/category/${category.slug}`}>
                      <h5 style={{ cursor: "pointer", margin: 0 }}>{category.name}</h5>
                    </Link>

                    {/* Show + or - icon only if subcategories exist */}
                    {category.subcategories && category.subcategories.length > 0 && (
                      <span
                        style={{
                          cursor: "pointer",
                          fontSize: "20px",
                          fontWeight: "bold",
                          padding: "0 10px",
                          userSelect: "none"
                        }}
                        onClick={() => toggleCategory(category.slug)}
                      >
                        {expandedCategories[category.slug] ? '−' : '+'}
                      </span>
                    )}
                  </div>

                  {/* Subcategories list - only show if expanded */}
                  {expandedCategories[category.slug] && category.subcategories && category.subcategories.length > 0 && (
                    <ul style={{ marginBottom: "15px" }}>
                      {category.subcategories.map(sub => (
                        <li key={sub.slug}>
                          <Link href={sub.path}>{sub.name}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </Fragment>
              ))}

            </div>
          </Col>
        );
      }
    }

    return columns;
  };

  return (
    <Fragment>
      <div id="mySidenav" className="sidenav">
        <a href={null} className="sidebar-overlay" onClick={closeNav}></a>
        <nav>
          <a href={null} onClick={closeNav}>
            <div className="sidebar-back text-start">
              <i className="fa fa-angle-left pe-2" style={{ marginTop: "-2px" }}></i> Back
            </div>
          </a>
          <ul id="sub-menu" className="sidebar-menu">
            <li><Link href="/">Home</Link></li>
            <li>
              <a onClick={handleMegaSubmenu}>
                Shop
                <span
                  className="sub-arrow"
                  onClick={(e) => {
                    e.stopPropagation();
                    const element = document.getElementsByClassName('mega-menu clothing-menu')[0];
                    if (element) element.classList.toggle('opensidesubmenu');
                  }}
                ></span>
              </a>
              <ul className="mega-menu clothing-menu">
                <li>
                  <Row m="0">{renderDynamicCategories()}</Row>
                </li>
              </ul>
            </li>
            <li><Link href="/collections/price%20drop">PRICE DROP</Link></li>
            <li><Link href="/bulk-enquiry">Bulk Enquiry</Link></li>
            <li><Link href="/contact-us">Contact us</Link></li>
            <li>
              <a
                style={{ cursor: "pointer" }}
                onClick={() => {
                  closeNav();
                  const searchSidebar = document.getElementById("search_side_bar");
                  if (searchSidebar) searchSidebar.classList.add("open-side");
                }}
              >
                Search
              </a>
            </li>
             {isLogin ? (
              <>
                <li><Link href={`/page/user/profile`}>Profile</Link></li>
                <li><Link href="/page/user/orders">Orders</Link></li>
              </>
            ) : (
              <li>
                <button
                  type="button"
                  onClick={() => {
                    closeNav();
                    userContext.openLogin();
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    fontSize: "1rem",
                    color: "inherit",
                    fontWeight: "650",
                    marginLeft: "25px",
                  }}
                >
                  Account
                </button>
              </li>

            )}
            {isLogin && (
              <li style={{ cursor: "pointer" }} onClick={() => logOut()}>
                <a>Logout</a>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </Fragment>
  );
};

export default SideBar;