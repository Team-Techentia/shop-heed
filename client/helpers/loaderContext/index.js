import React, { createContext, useState } from "react";
import { toast } from "react-toastify";
import logo from "../../public/assets/images/icon/logo1.png"
const LoaderContext = createContext();
const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  
  const setLoadingState = (value) => {
    setLoading(value);
  };
  const catchErrors = (error) => {
    let errorMsg;
    if (error.response) {
      errorMsg = error.response.data.message;
      if (error.response.data.error) {
      return  errorMsg = error.response.data.error.message;
      } else if (error.response.data.msg) {
        return  errorMsg = error.response.data.msg;
      } else {
        return errorMsg = "Something went wrong";
      }
    } else if (error.request) {
      return  errorMsg = error.request;
    } else {
       errorMsg = "Something went wrong";
    }

    toast.error(errorMsg);
    setLoading(false);
  };

  const contextValue = {
    loading: loading,
    setLoading: setLoadingState,
    catchErrors: catchErrors,
  };
  return (
    <LoaderContext.Provider value={contextValue}>
      {children}
      {loading && (
      <div className="loader-wrapper">
      <img src={logo.src} alt="Loading" />
    </div>
      )}
    </LoaderContext.Provider>
  );
};

export { LoaderProvider, LoaderContext };
