import React, { Fragment, useContext, useMemo, useState } from "react";
import { Row, Col } from "reactstrap";
import Link from "next/link";
import UserContext from "../../../helpers/user/UserContext";
import { useQuery } from "@tanstack/react-query";
import Api from "../../Api";

const SideBar = () => {
  const userContext = useContext(UserContext);
  const isLogin = userContext.isLogin;
  const logOut = userContext.logOut;

  // State to track which categories are expanded
  const [expandedCategories, setExpandedCategories] = useState({});

  const { data: navCategoriesData, isLoading } = useQuery({
    queryKey: ["navCategories"],
    queryFn: async () => {
      const res = await Api.getNavbarCategories();
      return res.data; // Return the data object from the API response
    }
  });

  // Transform API data to match sidebar structure
  const dynamicCategories = useMemo(() => {
    if (!navCategoriesData?.data) return [];

    return navCategoriesData.data
      // Filter out categories with no subcategories (non-empty only)
      .filter(category => category.subcategories && category.subcategories.length > 0)
      // Sort by number of subcategories (descending - most subcategories first)
      .sort((a, b) => b.subcategories.length - a.subcategories.length)
      // Take only top 5 categories
      .slice(0, 5)
      // Transform to sidebar structure
      .map(category => ({
        name: category.name,
        slug: category.slug,
        subcategories: category.subcategories.map(subcategory => ({
          name: subcategory.name,
          path: `/category/${category.slug}/${subcategory.slug}`,
          slug: subcategory.slug
        }))
      }));
  }, [navCategoriesData]);

  const closeNav = () => {
    var closemyslide = document.getElementById("mySidenav");
    if (closemyslide) closemyslide.classList.remove("open-side");
  };

  const handleMegaSubmenu = (event) => {
    if (event.target.classList.contains("sub-arrow")) return;

    if (event.target.nextElementSibling.classList.contains("opensidesubmenu"))
      event.target.nextElementSibling.classList.remove("opensidesubmenu");
    else {
      event.target.nextElementSibling.classList.add("opensidesubmenu");
    }
  };

  // Toggle category expansion
  const toggleCategory = (categorySlug) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categorySlug]: !prev[categorySlug]
    }));
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
      // Fallback to static content if no dynamic data
      return (
        <Col xl="4">
          <div className="link-section">
            <h5>Shirt</h5>
            <ul>
              <li>
                <Link href="/collections/plain-shirts">{"Plain Shirts"}</Link>
              </li>
              <li>
                <Link href="/collections/check-shirts">{"Check Shirts"}</Link>
              </li>
              <li>
                <Link href="/collections/stripe-shirts">{"Stripe Shirts"}</Link>
              </li>
              <li>
                <Link href="/collections/half-sleeve-shirts">{"Half Sleeve Shirts"}</Link>
              </li>
              <li>
                <Link href="/collections/over-sized-shirts">{"Over Sized Shirts"}</Link>
              </li>
              <li>
                <Link href="/collections/cargo-shirts">{"Cargo Shirts"}</Link>
              </li>
              <li>
                <Link href="/collections/printed-shirts">{"Printed Shirts"}</Link>
              </li>
            </ul>
            <h5>{"Bottom"}</h5>
            <ul></ul>
            <h5>{"T-shirts"}</h5>
            <h5>{"Jackets"}</h5>
            <h5>{"Hoodies"}</h5>
          </div>
        </Col>
      );
    }

    // Render dynamic categories in columns
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
              {columnCategories.map((category, categoryIndex) => (
                <Fragment key={category.slug}>
                  <h5>{category.name}</h5>
                  <ul>
                    {category.subcategories.map((subcategory, subIndex) => (
                      <li key={subcategory.slug}>
                        <Link href={subcategory.path}>{subcategory.name}</Link>
                      </li>
                    ))}
                  </ul>
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
              <i style={{marginTop:"-2px"}} className="fa fa-angle-left pe-2" aria-hidden="true"></i> Back
            </div>
          </a>
          <ul id="sub-menu" className="sidebar-menu">

            {
              isLogin ? <>
              <li>
                <Link href={`/page/user/profile`}>profile</Link>
              </li>
              
              <li>
                <Link href="/page/user/orders">Orders</Link>
              </li></> :<>
                <li>
                  <Link href={`/page/account/login`}>Account</Link>
                </li>
                {/* <li>
                  <Link href={`/page/account/register`}>Register</Link>
                </li> */}
                </>
            }

            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <a onClick={(e) => handleMegaSubmenu(e)}>
                {"Shop"}
                <span className="sub-arrow" onClick={(e) => {
                  // e.stopPropagation(); // Prevents the event from bubbling up to <a>
                 // Get the first element with the class 'mega-menu clothing-menu'
                 const element = document.getElementsByClassName('mega-menu clothing-menu')[0];
                  // Check if the element contains a specific class
                  if (element && element.classList.contains('opensidesubmenu')) {
                        element.classList.remove("opensidesubmenu");
                  } else {
                        element.classList.add("opensidesubmenu");
                  }
                  }}></span>
              </a>
             
              <ul className="mega-menu clothing-menu">
                <li>
                  <Row m="0">
                    {renderDynamicCategories()}
                  </Row>
                </li>
              </ul>
            </li>
            <li>
              <Link href="/collections/trending"> Trending Now</Link>
            </li>
          
            <li>
              <Link href="/bulk-enquiry">Bulk Enquiry </Link>
            </li>
            <li>
              <Link href="/contact-us">Contact us</Link>
            </li>

            <li>
              <a style={{cursor:"pointer"}} onClick={()=>{
                closeNav()
                var closemyslide = document.getElementById("search_side_bar");
                if (closemyslide) closemyslide.classList.add("open-side");
              }}>Search</a>
            </li>
            {
              isLogin ? 
              <>
                <li style={{cursor:"pointer"}} onClick={() => logOut()}>
                  <a>Logout</a>
                </li>
              </> : ""
            }
          
          </ul>
        </nav>
      </div>
    </Fragment>
  );
};

export default SideBar;