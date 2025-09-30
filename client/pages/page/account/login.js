import React, { useEffect, useState, useContext } from "react";
import CommonLayout from "../../../components/shop/common-layout";
import { Container, Row, Form,  Col, FormGroup } from "reactstrap";
import Api from "../../../components/Api";
import { useRouter } from "next/router";
import { toast, Toaster } from "react-hot-toast";
import { setCookie } from "../../../components/cookies";
import UserContext from "../../../helpers/user/UserContext";
import { LoaderContext } from "../../../helpers/loaderContext";
import OpenModal from "./openModal";
import loginphoto1 from "../../../public/assets/images/loginphoto1.png";
import Link from "next/link";
import { TextField } from "@mui/material";
const Login = () => {
  const userContext = useContext(UserContext);
  const isLogin = userContext.isLogin;
  const setIslogin = userContext.setIslogin;
  const [user, setUser] = useState({ password: "Prabh@123", emailOrPhone: "9650598120" });
  const router = useRouter();
  const LoaderContextData = useContext(LoaderContext);
  const { catchErrors, setLoading } = LoaderContextData;
  const [isOpenTOTP, setIsOpenTOTP] = useState(false);
  const [loginWithMobile, setLoginWithMobile] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (isLogin) {
      return (window.location.href = "/");
    }
  }, [isLogin]);

  const goToRegister = () => {
    router.push("/page/account/register");
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      if (value.length > 10) {
        return;
      }
    }

    if (value.length > 40) return;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await Api.loginUser(user);

      if (response.data.message === "Login Successfully") {
        setCookie(null, "ectoken", response.data.token, 100);
        toast.success("Login Successfully");
        setIslogin(true);
        return (window.location.href = "/");
      }
    } catch (error) {
      catchErrors(error);
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMobileNumberLogin = async () => {
    if (!user.emailOrPhone || user.emailOrPhone.length < 10) {
      setError("Enter a valid Number");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    try {
      const res = await Api.checkMobile({ phoneNumber: user.emailOrPhone });
      if (res.data.message === "Phone number already exist") {
        return setIsOpenTOTP(true);
      }

      localStorage.setItem("phoneNumber", user.emailOrPhone);
      router.push("/page/account/register");

      return;
    } catch (error) {
      catchErrors(error);
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return toast.error(error.response.data.message);
      }
    }
  };

  return isLogin ? (
    ""
  ) : (
   
    <CommonLayout parent="home" title="login">
      <section className="login-page section-b-space page-login">
        <Container>
          <Row>
          

            <Col lg="6">
              <div style={{ textAlign: "center" }}>
                {" "}
                <h7 style={{ fontSize: "30px", fontWeight: "700" }}>
                  Log in / Sign up
                </h7>
              </div>

              <div style={{ paddingTop: "5px" }} className="theme-card">
                <div style={{ textAlign: "center" }}>
                  {" "}
                 
                   
                </div>
                <Form className="theme-form  paddingOfRegister mt-3">
                  {loginWithMobile ? (
                    <>
                      {" "}
                      <div className="form-group">
                        <TextField
                          type="number"
                          id="standard-multiline-flexible"
                          label="Enter Your Phone Number"
                          multiline
                          variant="standard"
                          fullWidth
                          value={user.emailOrPhone}
                          onChange={handleChange}
                          name="emailOrPhone"
                        />

                        <div className="mt-2" style={{ color: "red" }}>
                          {" "}
                          {error}
                        </div>
                      </div>
                      {/* <h6 style={{ textAlign: "center" }}>
                        Continue With Email and Password
                        <span
                          style={{
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setLoginWithMobile(false);
                          }}
                        >
                          {" "}
                          click here
                        </span>
                      </h6> */}
                      <div style={{ textAlign: "center" }}>
                        {" "}
                        <button
                          onClick={handleMobileNumberLogin}
                          type="button"
                          className="btn btn-solid"
                        >
                          Send Otp
                        </button>
                      </div>{" "}
                    </>
                  ) : (
                    <>
                      {" "}
                      <div className="form-group">

                        <TextField
                          type="email"
                          id="standard-multiline-flexible"
                          label=" Email Or Phone Number"
                          name="emailOrPhone"
                          variant="standard"
                          fullWidth
                          multiline
                          value={user.emailOrPhone}
                          onChange={handleChange}
                        />
                      </div>

                      <FormGroup className="login-section">
                        <TextField
                          label=" Enter Your Password"
                          id=""
                          variant="standard"
                          fullWidth
                          type="password"
                          value={user.password}
                          onChange={handleChange}
                           name="password"
                        />
                      </FormGroup>

                      <h6 style={{ textAlign: "center" }}>
                        Continue With Phone Number{" "}
                        <span
                          style={{
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setLoginWithMobile(true);
                          }}
                        >
                          {" "}
                          click here
                        </span>
                      </h6>
                      <h6 style={{ textAlign: "center" }}>
                        Don't have an account?{" "}
                        <span
                          style={{
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                          onClick={goToRegister}
                        >
                          Register
                        </span>
                      </h6>
                      <div style={{ textAlign: "center" }}>
                        <button
                          type="button"
                          onClick={() => {
                            handleLogin();
                          }}
                          className="btn btn-solid"
                        >
                          Login
                        </button>
                      </div>
                      <h6 style={{ textAlign: "center" }}>
                        By creating an account or logging in, you agree with
                        Heed's{" "}
                        <span>
                          {" "}
                          <strong>
                            {" "}
                            <Link
                              style={{ color: "inherit" }}
                              href={"/terms-and-conditions"}
                            >
                              {" "}
                              Terms and Conditions
                            </Link>{" "}
                          </strong>{" "}
                        </span>{" "}
                        and
                        <span>
                          {" "}
                          <strong>
                            {" "}
                            <Link
                              style={{ color: "inherit" }}
                              href={"/privacy-policy"}
                            >
                              {" "}
                              Privacy Policy.
                            </Link>{" "}
                          </strong>{" "}
                        </span>
                      </h6>
                    </>
                  )}
                </Form>
              </div>
            </Col>
          </Row>
          <div style={{ height: "90px" }}></div>
        </Container>
      </section>
      <OpenModal
        setIsOpenTOTP={setIsOpenTOTP}
        isOpenTOTP={isOpenTOTP}
        userData={{ phoneNumber: user.emailOrPhone }}
        popUpFor={"checkoutPage"}
        useBox="login"
      />
      <Toaster />
    </CommonLayout>
  );
};

export default Login;
