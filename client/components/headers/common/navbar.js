import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { MENUITEMS } from "../../constant/menu";
import { Container, Row } from "reactstrap";
import { useTranslation } from "react-i18next";
import LogoImage from "./logo";
import { useQuery } from "@tanstack/react-query";
import Api from "../../Api";

const NavBar = () => {
  const { t } = useTranslation();

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
        path: `/category/${category.slug}`,
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
            submenuItems.active = false;
          }
        });
      }
    });

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

  const openMblNav = (event) => {
    if (event.target.classList.contains("sub-arrow")) return;

    if (event.target.nextElementSibling.classList.contains("opensubmenu"))
      event.target.nextElementSibling.classList.remove("opensubmenu");
    else {
      document.querySelectorAll(".nav-submenu").forEach(function (value) {
        value.classList.remove("opensubmenu");
      });
      document
        .querySelector(".mega-menu-container")
        .classList.remove("opensubmenu");
      event.target.nextElementSibling.classList.add("opensubmenu");
    }
  };

  // Show loading state if categories are still being fetched
  if (isLoading) {
    return (
      <div className="main-navbar">
        <div id="mainnav">
          <ul className="nav-menu">
            <li className="mega-menu">
              <LogoImage />
            </li>
            <li>Loading menu...</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="main-navbar">
        <div id="mainnav">
          <ul className="nav-menu">
            {mergedMenuItems.map((menuItem, i) => {
              return (
                menuItem.logo === "logo" ? (
                  <li className="mega-menu" key={i}>
                    <LogoImage />
                  </li>
                ) : (
                  <li
                    key={i}
                    className={`${menuItem.megaMenu ? "mega-menu" : ""}`}>
                    {menuItem.type == "link" ? (
                      <Link href={menuItem.path} className="nav-link">
                        <div className="underline-hover" style={{ position: 'relative', display: 'inline-block' }}>
                          {t(menuItem.title)}
                        </div>
                      </Link>
                    ) : (
                      <a
                        href={`${menuItem.children.length == 0 ? "" : ""}`}
                        className="nav-link"
                        onClick={(e) => openMblNav(e)}
                      >
                        <div className="underline-hover" style={{ position: 'relative', display: 'inline-block' }}>
                          {t(menuItem.title)}
                          <span className="sub-arrow"></span>
                        </div>
                      </a>
                    )}
                    {menuItem.children && !menuItem.megaMenu ? (
                      <ul className="nav-submenu">
                        {menuItem.children.map((childrenItem, index) => {
                          return (
                            <li
                              key={index}
                              className={`${childrenItem.children ? "sub-menu " : ""
                                }`}>
                              {childrenItem.type === "sub" ? (
                                <a
                                  href={null}
                                  onClick={() => toggletNavActive(childrenItem)}>
                                  {childrenItem.title}
                                  {childrenItem.tag === "new" ? (
                                    <span className="new-tag">new</span>
                                  ) : (
                                    ""
                                  )}
                                  <i className="fa fa-angle-right ps-2"></i>
                                </a>
                              ) : (
                                ""
                              )}
                              {childrenItem.type === "link" ? (
                                <Link href={`${childrenItem.path}`}>
                                  {childrenItem.title}
                                  {childrenItem.tag === "new" ? (
                                    <span className="new-tag">new</span>
                                  ) : (
                                    ""
                                  )}
                                </Link>
                              ) : (
                                ""
                              )}
                              {childrenItem.children ? (
                                <ul
                                  className={`nav-sub-childmenu ${childrenItem.active ? "menu-open " : "active"
                                    }`}>
                                  {childrenItem.children.map(
                                    (childrenSubItem, key) => (
                                      <li key={key}>
                                        {childrenSubItem.type === "link" ? (
                                          <Link
                                            href={childrenSubItem.path}
                                            className="sub-menu-title">
                                            {childrenSubItem.title}
                                            {childrenSubItem.tag === "new" ? (
                                              <span className="new-tag">new</span>
                                            ) : (
                                              ""
                                            )}
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
                      <>
                        {menuItem.type !== "link" && (
                          <div
                            className={`mega-menu-container${menuItem.megaMenu ? "" : " opensubmenu"
                              }`}>
                            {menuItem.megaMenu === true ? (
                              <Container>
                                <Row>
                                  {menuItem.children.map((megaMenuItem, i) => {
                                    return (
                                      <div
                                        className={`${menuItem.megaMenuType == "small"
                                            ? "col-xl-2 col-lg-3 col-md-4 col-sm-6 mega-box"
                                            : menuItem.megaMenuType == "medium"
                                              ? "col-xl-3 col-lg-4 col-md-6 col-sm-12"
                                              : menuItem.megaMenuType == "large"
                                                ? "col-xl-4 col-lg-6 col-md-12"
                                                : "col-xl-2 col-lg-3 col-md-4 col-sm-6"
                                          } mb-3`}
                                        key={i}
                                        style={{
                                          minWidth: '200px',
                                          maxWidth: menuItem.megaMenuType == "small" ? '220px' :
                                            menuItem.megaMenuType == "medium" ? '280px' : '350px'
                                        }}>
                                        <div className="link-section">
                                          <div className="menu-title">
                                            <Link href={megaMenuItem.path}>
                                              <h5>
                                                {megaMenuItem.title}
                                              </h5>
                                            </Link>
                                          </div>
                                          <div className="menu-content">
                                            <ul>
                                              {megaMenuItem.children?.map(
                                                (subMegaMenuItem, i) => {
                                                  return (
                                                    <li key={i}>
                                                      <Link
                                                        href={subMegaMenuItem.path}>
                                                        {menuItem.title === "Elements" ? (
                                                          <>
                                                            <i
                                                              className={`icon-${subMegaMenuItem.icon}`}></i>
                                                            {subMegaMenuItem.title}
                                                          </>
                                                        ) : (
                                                          subMegaMenuItem.title
                                                        )}
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
                      </>
                    )}
                  </li>
                )
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;