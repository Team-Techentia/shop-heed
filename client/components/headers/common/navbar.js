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
      return res.data;
    }
  });

  // Transform API data to match menu structure
  const dynamicMenuItems = useMemo(() => {
    if (!navCategoriesData?.data) return [];

    return navCategoriesData.data
      .sort((a, b) => b.subcategories.length - a.subcategories.length)
      // .slice(0, 5)
      .map(category => ({
        title: category.name,
        slug: category.slug,
        type: "sub",
        path: `/category/${category.slug}`,
        // Keep all subcategories (don't slice)
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
      if (menuItem.title === "Shop" && menuItem.megaMenu) {
        return {
          ...menuItem,
          children: [
            ...dynamicMenuItems,
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
                                  {/* Categories with subcategories */}
                                  {menuItem.children
                                    .filter(item => item.children && item.children.length > 0)
                                    .map((megaMenuItem, i) => {
                                      return (
                                        <div
                                          className="col-3 mb-4"
                                          key={i}
                                          style={{
                                            minWidth: '350px',
                                            maxWidth: '250px',
                                            paddingLeft: '30px',
                                            paddingRight: '30px'
                                          }}>
                                          <div className="link-section">
                                            <div className="menu-title">
                                              <Link href={megaMenuItem.path}>
                                                <h5 style={{ color: '#000', marginBottom: '15px', fontWeight: '700' }}>
                                                  {megaMenuItem.title}
                                                </h5>
                                              </Link>
                                            </div>
                                            <div className="menu-content">
                                              <ul style={{
                                                listStyle: 'none',
                                                padding: 0,
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(2, 1fr)',
                                                gap: '10px 20px',
                                                columnGap: '20px'
                                              }}>
                                                {megaMenuItem.children?.map(
                                                  (subMegaMenuItem, i) => {
                                                    return (
                                                      <li key={i} style={{ marginBottom: '0' }}>
                                                        <Link
                                                          href={subMegaMenuItem.path}
                                                          style={{ color: '#000', textDecoration: 'none' }}>
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

                                  {/* Categories without subcategories - show 3 per column */}
                                  {menuItem.children.filter(item => !item.children || item.children.length === 0).length > 0 && (() => {
                                    // Split categories into chunks of 3
                                    const noSubCategories = menuItem.children.filter(item => !item.children || item.children.length === 0);
                                    const chunked = [];
                                    for (let i = 0; i < noSubCategories.length; i += 3) {
                                      chunked.push(noSubCategories.slice(i, i + 3));
                                    }

                                    return (
                                      <>
                                        {chunked.map((group, colIndex) => (
                                          <div
                                            key={colIndex}
                                            className="col-3 mb-4"
                                            style={{
                                              minWidth: '250px',
                                              maxWidth: '250px',
                                              paddingLeft: '30px',
                                              paddingRight: '30px',
                                            }}
                                          >
                                            <div className="link-section">
                                              {group.map((megaMenuItem, i) => (
                                                <div className="menu-title" key={i} style={{ marginBottom: '20px' }}>
                                                  <Link href={megaMenuItem.path}>
                                                    <h5 style={{ color: '#000', marginBottom: '0', fontWeight: '700' }}>
                                                      {megaMenuItem.title}
                                                    </h5>
                                                  </Link>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        ))}
                                      </>
                                    );
                                  })()}

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