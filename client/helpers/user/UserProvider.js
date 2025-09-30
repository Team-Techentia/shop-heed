import UserContext from "./UserContext";
import React, { useState, useEffect, useContext , } from "react";
import { toast } from "react-toastify";
import { getCookie , deleteCookie } from "../../components/cookies";
import Api from "../../components/Api";
import { LoaderContext } from "../loaderContext";
import { useRouter } from "next/router";
const UserProvider = (props) => {
  const Router  = useRouter()
  const LoaderContextData = useContext(LoaderContext)
  const { catchErrors , setLoading } = LoaderContextData
  const [isLogin, setIslogin] = useState(false);
  const token = getCookie("ectoken");

  const fetchUser = async () => {
    try {
     
      const res = await Api.checkIsLogin(token);

      if (res.data.success) {
        setIslogin(true);
      }
    } catch (error) {
      catchErrors(error)
    }
    finally {
      
    }
  };

  useEffect(() => {
  
    if (token) {
      fetchUser();
    }
  }, [token]);


  const logOut = ()=>{

    deleteCookie(null, "ectoken")
    setIslogin(false);
    // Router.push("")
    return toast.success("LogOut successfully")
  }

  return (
    <UserContext.Provider value={{ ...props, isLogin , logOut ,setIslogin}}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider;
