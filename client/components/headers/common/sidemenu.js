import React, { useState, useEffect, Fragment, useMemo } from "react";
import Link from "next/link";
import { MENUITEMS } from "../../constant/menu";
import { Container, Row } from "reactstrap";
import { useQuery } from "@tanstack/react-query";
import Api from "../../Api";

const SideMenu = () => {
  const [navClose, setNavClose] = useState({ right: "0px" });

  const { data: navCategoriesData, isLoading } = useQuery({
    queryKey: ["navCategories"],
    queryFn: async () => {
      const res = await Api.getNavbarCategories();
      return res.data; // Return the data object from the API response
    }
  });

  // Transform API data to match menu structure
  const dynamicMenuItems = useMemo(() => {
    if (!navCategoriesData?.data) return [];

    return navCategoriesData.data
      // Filter out categories with no subcategories (non-empty only)
      .filter(category => category.subcategories && category.subcategories.length > 0)
      // Sort by number of subcategories (descending - most subcategories first)
      .sort((a, b) => b.subcategories.length - a.subcategories.length)
      // Take only top 5 categories
      .slice(0, 5)
      // Transform to menu structure
      .map(category => ({
        title: category.name,
        slug: category.slug,
        type: "sub",
        children: category.subcategories.map(subcategory => ({
          title: subcategory.name,
          path: `/category/${category.slug}/${subcategory.slug}`,
          type: "link",
          icon: subcategory.icon || "alert",
          image: subcategory.image
        }))
      }));
  }, [navCategoriesData]);

  // Merge static menu items with dynamic categories
  const mergedMenuItems = useMemo(() => {
    if (!dynamicMenuItems.length) return MENUITEMS;

    return MENUITEMS.map(menuItem => {
      // Update the Shop mega menu with dynamic categories
      if (menuItem.title === "Shop" && menuItem.megaMenu) {
        return {
          ...menuItem,
          children: [
            ...dynamicMenuItems,
            // Keep existing static categories that aren't replaced
            ...menuItem.children.filter(child => 
              !dynamicMenuItems.some(dynamic => 
                dynamic.title.toLowerCase() === child.title.toLowerCase()
              )
            )
          ]
        };
      }
      return menuItem;
    });
  }, [dynamicMenuItems]);

  const [mainmenu, setMainMenu] = useState(mergedMenuItems);

  // Update mainmenu when mergedMenuItems changes
  useEffect(() => {
    setMainMenu(mergedMenuItems);
  }, [mergedMenuItems]);

  useEffect(() => {
    if (window.innerWidth < 750) {
      setNavClose({ right: "-410px" });
    }
    if (window.innerWidth < 1199) {
      setNavClose({ right: "-300px" });
    }
  }, []);

  const openMblNav = (event) => {
    if (event.target.classList.contains("sub-arrow")) return;

    if (event.target.nextElementSibling.classList.contains("opensubmenu")) {
      event.target.nextElementSibling.classList.remove("opensubmenu");
      document.getElementById("arrow").classList.remove("minus-arrow");
    } else {
      document.querySelectorAll(".nav-submenu").forEach(function (value) {
        value.classList.remove("opensubmenu");
      });
      document
        .querySelector(".mega-menu-container")
        .classList.remove("opensubmenu");
      event.target.nextElementSibling.classList.add("opensubmenu");
      document.getElementById("arrow").classList.add("minus-arrow");
    }
  };

  const handleMegaSubmenu = (event) => {
    if (event.target.classList.contains("sub-arrow")) return;

    if (
      event.target.parentNode.nextElementSibling.classList.contains(
        "opensubmegamenu"
      )
    )
      event.target.parentNode.nextElementSibling.classList.remove(
        "opensubmegamenu"
      );
    else {
      document.querySelectorAll(".menu-content").forEach(function (value) {
        value.classList.remove("opensubmegamenu");
      });
      event.target.parentNode.nextElementSibling.classList.add(
        "opensubmegamenu"
      );
    }
  };

  useEffect(() => {
    const currentUrl = location.pathname;
    mergedMenuItems.filter((items) => {
      if (items.path === currentUrl) setNavActive(items);
      if (!items.children) return false;
      items.children.filter((subItems) => {
        if (subItems.path === currentUrl) setNavActive(subItems);
        if (!subItems.children) return false;
        subItems.children.filter((subSubItems) => {
          if (subSubItems.path === currentUrl) setNavActive(subSubItems);
        });
      });
    });
  }, [mergedMenuItems]);

  const setNavActive = (item) => {
    mergedMenuItems.filter((menuItem) => {
      if (menuItem != item) menuItem.active = false;
      if (menuItem.children && menuItem.children.includes(item))
        menuItem.active = true;
      if (menuItem.children) {
        menuItem.children.filter((submenuItems) => {
          if (submenuItems.children && submenuItems.children.includes(item)) {
            menuItem.active = true;
            submenuItems.active = true;
          }
        });
      }
    });
    item.active = !item.active;
    setMainMenu({ mainmenu: mergedMenuItems });
  };

  const toggletNavActive = (item) => {
    if (!item.active) {
      mergedMenuItems.forEach((a) => {
        if (mergedMenuItems.includes(item)) a.active = false;
        if (!a.children) return false;
        a.children.forEach((b) => {
          if (a.children.includes(item)) {
            b.active = false;
          }
          if (!b.children) return false;
          b.children.forEach((c) => {
            if (b.children.includes(item)) {
              c.active = false;
            }
          });
        });
      });
    }
    item.active = !item.active;
    setMainMenu({ mainmenu: mergedMenuItems });
  };

  // Show loading state if categories are still being fetched
  if (isLoading) {
    return (
      <Fragment>
        <ul id="sub-menu" className="sm pixelstrap sm-vertical">
          <li>Loading menu...</li>
        </ul>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <ul id="sub-menu" className="sm pixelstrap sm-vertical ">
        {mergedMenuItems.map((menuItem, i) => {
          return (
            <li key={i} className={` ${menuItem.megaMenu ? "mega-menu" : ""}`}>
              <a className="nav-link" onClick={(e) => openMblNav(e)}>
                {" "}
                {menuItem.title}
                <span id="arrow" className="sub-arrow"></span>
              </a>
              {menuItem.children && !menuItem.megaMenu ? (
                <ul className="nav-submenu">
                  {menuItem.children.map((childrenItem, index) => {
                    return (
                      <li
                        key={index}
                        className={`${
                          childrenItem.children ? "sub-menu " : ""
                        }`}>
                        {childrenItem.type === "sub" ? (
                          <a
                            href="#javascript"
                            onClick={() => toggletNavActive(childrenItem)}>
                            {childrenItem.title}{" "}
                            <i className="fa fa-angle-right ps-2"></i>
                          </a>
                        ) : (
                          ""
                        )}
                        {childrenItem.type === "link" ? (
                          <Link href={`${childrenItem.path}`}>
                            {childrenItem.title}
                          </Link>
                        ) : (
                          ""
                        )}
                        {childrenItem.children ? (
                          <ul
                            className={`nav-sub-childmenu ${
                              childrenItem.active ? "menu-open " : "active"
                            }`}>
                            {childrenItem.children.map(
                              (childrenSubItem, key) => (
                                <li key={key}>
                                  {childrenSubItem.type === "link" ? (
                                    <Link
                                      href={childrenSubItem.path}
                                      className="sub-menu-title">
                                      {childrenSubItem.title}
                                    </Link>
                                  ) : (
                                    ""
                                  )}
                                </li>
                              )
                            )}
                          </ul>
                        ) : (
                          ""
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div
                  className={`mega-menu-container  ${
                    menuItem.active ? "opensubmenu" : ""
                  }`}>
                  {menuItem.megaMenu === true ? (
                    <Container>
                      <Row>
                        {menuItem.children.map((megaMenuItem, i) => {
                          return (
                            <div
                              key={i}
                              className={`${
                                menuItem.megaMenuType == "small"
                                  ? "col-xl-4"
                                  : menuItem.megaMenuType == "medium"
                                  ? "col-lg-3"
                                  : menuItem.megaMenuType == "large"
                                  ? "col"
                                  : ""
                              } `}>
                              <div className="link-section">
                                <div className="menu-title">
                                  <h5 onClick={(e) => handleMegaSubmenu(e)}>
                                    {megaMenuItem.title}
                                  </h5>
                                </div>
                                <div className="menu-content">
                                  <ul>
                                    {menuItem.title === "Elements"
                                      ? megaMenuItem.children?.map(
                                          (subMegaMenuItem, i) => {
                                            return (
                                              <li key={i}>
                                                <Link href={subMegaMenuItem.path}>
                                                  <i
                                                    className={`icon-${subMegaMenuItem.icon}`}></i>
                                                  {subMegaMenuItem.title}
                                                </Link>
                                              </li>
                                            );
                                          }
                                        )
                                      : megaMenuItem.children?.map(
                                          (subMegaMenuItem, i) => {
                                            return (
                                              <li key={i}>
                                                <Link href={subMegaMenuItem.path}>
                                                  {subMegaMenuItem.title}
                                                </Link>
                                              </li>
                                            );
                                          }
                                        )}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </Row>
                    </Container>
                  ) : (
                    ""
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Fragment>
  );
};

export default SideMenu;