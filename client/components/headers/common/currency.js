import React, { useState, useContext } from "react";
import { Media } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import UserContext from "../../../helpers/user/UserContext";

const Currency = ({ icon }) => {
  const { isLogin, logOut, openLogin } = useContext(UserContext);

  return (
    <li className="onhover-div">
      {isLogin ? (
        <>
          <div>
            <Media style={{ height: "23px" }} src={icon} className="img-fluid" alt="" />
          </div>
          <div className="show-div setting">
            <ul>
              <li className="hoverTableEffect">
                <Link href={`/page/user/profile`}>My profile</Link>
              </li>
              <li className="hoverTableEffect">
                <Link href={`/page/user/orders`}>My Orders</Link>
              </li>
              <li className="hoverTableEffect" onClick={logOut}>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <div
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          onClick={openLogin} // 👈 directly open login modal from context
        >
          <FontAwesomeIcon icon={faUser} style={{ marginRight: "8px", fontSize: "15px" }} />
          <span style={{ fontSize: "16px", fontWeight: "400", color: "#000" }}>Account</span>
        </div>
      )}
    </li>
  );
};

export default Currency;
