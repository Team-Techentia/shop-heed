import React, { useContext } from "react";
import { Media } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserContext from "../../../helpers/user/UserContext";
import { faUser } from '@fortawesome/free-solid-svg-icons'; // Import specific icon
import Link from "next/link";

const Currency = ({ icon }) => {
  const userContext = useContext(UserContext);
  const isLogin = userContext.isLogin;
  const logOut = userContext.logOut;

  return (
    <li  className="onhover-div">

{
  isLogin ? <> 
      <div>
        <Media
          style={{ height: "23px" }}
          src={icon}
          className="img-fluid"
          alt=""
        />
   
      </div>
      <div className="show-div setting">
        <ul>
          {isLogin ? (
            <>
              {" "}
              <li className="hoverTableEffect">
                <Link  href={`/page/user/profile`}> My profile</Link>
              </li>

              <li  className="hoverTableEffect">
                <Link className="" href={`/page/user/orders`}> My Orders</Link>
              </li >


              <li  className="hoverTableEffect" onClick={() => logOut()}>
                <a className="">Logout</a>
              </li>{" "}
            </>
          ) : (
            ""
          )}
        </ul>
      </div></> : <div >  <Link style={{fontSize:"16px" , fontWeight:"400" , color:"#000000"}} href={"/page/account/login"}> Account   </Link> <FontAwesomeIcon icon={faUser} style={{ marginRight: "8px", fontSize: "15px" }} /> {/* Add the icon */}  </div>
}



  
    </li>
  );
};

export default Currency;



