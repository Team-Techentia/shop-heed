import React, { Fragment,useContext } from "react";
import { Row, Col } from "reactstrap";
import Link from "next/link";
import UserContext from "../../../helpers/user/UserContext";

const SideBar = () => {

  const userContext = useContext(UserContext);
  const isLogin = userContext.isLogin;
  const logOut = userContext.logOut;

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
          <Link  href={`/page/account/login`}>Account</Link>
            </li>
            {/* <li>
              <Link  href={`/page/account/register`}>Register</Link>
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
                        <ul>
                         
                        </ul>
                        <h5>{"T-shirts"}</h5>
                        <h5>{"Jackets"}</h5>
                        <h5>{"Hoodies"}</h5>

                      </div>
                    </Col>
                  
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
            <a style={{cursor:"pointer"}}   onClick={()=>{
              closeNav()
                        var closemyslide = document.getElementById("search_side_bar");
                        if (closemyslide) closemyslide.classList.add("open-side");
                      }}>Search</a>
            </li>
         {
          isLogin ? 

        <>
          
          
          <li style={{cursor:"pointer"}} onClick={() => logOut()}>
          <a >Logout</a>
        </li></> :""
         }
          
          </ul>
        </nav>
      </div>
    </Fragment>
  );
};

export default SideBar;
