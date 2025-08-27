import { Href, ImagePath } from "@/Constants";
import { MENUITEMS } from "@/Data/Sidebar";
import { useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "@/app/i18n/client";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import UserPanel from "./UserPanel";
import { useRouter } from "next/navigation";
type MenuItem = {
  sidebartitle?: string;
  path?: string;
  title: string;
  icon: any;
  type: "link" | "sub";
  badgeType?: string;
  active: boolean;
  children?: MenuItem[];
};
const Sidebar = () => {
  const { i18LangStatus } = useAppSelector((store) => store.LangReducer);
  const { sidebar } = useAppSelector((store) => store.LayoutReducer);
  const { t } = useTranslation(i18LangStatus);
  const [mainmenu, setMainMenu] = useState<any>(MENUITEMS);
  const [isChange, setIsChange] = useState(false);
  const [active, setActive] = useState<any>();
 const router = useRouter()

 
  useEffect(()=>{
    const currentUrl =( window.location.pathname).replaceAll("/en","");
    setActive(currentUrl)
  },[router])

  // useEffect(() => {
  //   const currentUrl =( window.location.pathname).replaceAll("/en","");
  
  //   // Traverse the menu items to find and activate the one that matches the current URL
  //   mainmenu.forEach((menuItem: MenuItem) => {
  //     if (menuItem.path === currentUrl) {
  //       setNavActive(menuItem);
  //     }
  
  //     if (menuItem.children) {
  //       menuItem.children.forEach((childItem) => {
  //         if (childItem.path === currentUrl) {
  //           setNavActive(childItem);
  //         }
  
  //         if (childItem.children) {
  //           childItem.children.forEach((subChildItem) => {
  //             if (subChildItem.path === currentUrl) {
  //               setNavActive(subChildItem);
  //             }
  //           });
  //         }
  //       });
  //     }
  //   });
  // }, [mainmenu]);

  // const setNavActive = (item: MenuItem) => {
  //   setIsChange(!isChange);
  //   MENUITEMS.filter((menuItem: MenuItem) => {
  //     if (menuItem !== item) menuItem.active = false;
  //     if (menuItem.children && menuItem.children.includes(item)) menuItem.active = true;
  //     if (menuItem.children) {
  //       menuItem.children.filter((submenuItems) => {
  //         if (submenuItems !== item) {
  //           submenuItems.active = false;
  //         }
  //         if (submenuItems.children) {
  //           submenuItems.children.map((childItem) => (childItem.active = false));
  //           if (submenuItems.children.includes(item)) {
  //             submenuItems.active = true;
  //             menuItem.active = true;
  //           }
  //         }
  //         return false;
  //       });
  //     }
  //     return false;
  //   });
  //   item.active = !item.active;
  //   setMainMenu(MENUITEMS);
  // };

  const mainMenu = mainmenu.map((menuItem: MenuItem, i: number) => (
    <li className={`${menuItem.active ? "active" : ""}`} key={i}>
      {menuItem.sidebartitle ? <div className="sidebar-title">{menuItem.sidebartitle}</div> : ""}
      {menuItem.type === "sub" ? (
        <a
          className="sidebar-header "
          href={Href}
          onClick={(event) => {
            event.preventDefault();
            // return setNavActive(menuItem);
          }}
        >
          <menuItem.icon />
          <span>{t(menuItem.title)}</span>
          <i className="fa fa-angle-right pull-right"></i>
        </a>
      ) : (
        ""
      )}
      {menuItem.type === "link" ? (
        <Link href={`/${i18LangStatus}${menuItem.path}`} className={`sidebar-header ${menuItem.path===active ? "active" : ""}`} 
        onClick={() =>
         setActive(menuItem.path)}
         >
          <menuItem.icon />
          <span>{t(menuItem.title)}</span>
          {menuItem.children ? <i className="fa fa-angle-right pull-right"></i> : ""}
        </Link>
      ) : (
        ""
      )}
      {menuItem.children ? (
        <ul className={`sidebar-submenu ${menuItem.active ? "menu-open" : ""}`} style={menuItem.active ? { opacity: 1, transition: "opacity 500ms ease-in" } : {}}>
          {menuItem.children.map((childrenItem, index) => (
            <li key={index} className={childrenItem.children ? (childrenItem.active ? "active" : "") : ""}>
              {childrenItem.type === "sub" ? (
                <a
                  href={Href}
                  onClick={(event) => {
                    event.preventDefault();
                    // return setNavActive(childrenItem);
                  }}
                >
                  <i className="fa fa-circle"></i>
                  {childrenItem.title} <i className="fa fa-angle-right pull-right"></i>
                </a>
              ) : (
                ""
              )}

              {childrenItem.type === "link" ? (
                <Link href={`/${i18LangStatus}${childrenItem.path}`} className={childrenItem.active ? "active" : ""} 
                // onClick={() => setNavActive(childrenItem)}
                >
                  <i className="fa fa-circle"></i>
                  {childrenItem.title}{" "}
                </Link>
              ) : (
                ""
              )}
              {childrenItem.children ? (
                <ul className={`sidebar-submenu ${childrenItem.active ? "menu-open" : "active"}`}>
                  {childrenItem.children.map((childrenSubItem, key) => (
                    <li className={childrenSubItem.active ? "active" : ""} key={key}>
                      {childrenSubItem.type === "link" ? (
                        <Link href={`/${i18LangStatus}${childrenSubItem.path}`} className={childrenSubItem.active ? "active" : ""} 
                        // onClick={() => setNavActive(childrenSubItem)}
                        >
                          <i className="fa fa-circle"></i>
                          {childrenSubItem.title}
                        </Link>
                      ) : (
                        ""
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                ""
              )}
            </li>
          ))}
        </ul>
      ) : (
        ""
      )}
    </li>
  ));
  return (
    <Fragment>
      <div className={`page-sidebar ${sidebar && "open"}`}>
        <div className="main-header-left d-none d-lg-block">
          <div className="logo-wrapper">
            <Link href={`/${i18LangStatus}/dashboard`}>
              <img style={{height:"70px"}} className="blur-up lazyloaded" src={`${ImagePath}/dashboard/ndh-logo.png`} alt="" />
            </Link>
          </div>
        </div>
        <div className="sidebar custom-scrollbar">
          <UserPanel />
          <ul className="sidebar-menu">{mainMenu}</ul>
        </div>
      </div>
    </Fragment>
  );
};

export default Sidebar;
