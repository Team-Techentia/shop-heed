import React from "react";
import { useEffect, useState, useContext } from "react";
import CommonLayout from "../../../components/shop/common-layout";
import { Container, Row, Form, Col, FormGroup } from "reactstrap";
import Api from "../../../components/Api";
import { useRouter } from "next/router";
import OpenModal from "./openModal";
import UserContext from "../../../helpers/user/UserContext";
import { LoaderContext } from "../../../helpers/loaderContext";
import loginphoto1 from "../../../public/assets/images/loginphoto1.png";

import { toast, Toaster } from "react-hot-toast";
import { TextField } from "@mui/material";

const Register = () => {
  const userContext = useContext(UserContext);
  const isLogin = userContext.isLogin;
  const router = useRouter();
  const LoaderContextData = useContext(LoaderContext);
  const { catchErrors, setLoading } = LoaderContextData;
  const [isOpenTOTP, setIsOpenTOTP] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  useEffect(() => {
    if (isLogin) {
      return (window.location.href = "/");
    }

    const number = localStorage.getItem("phoneNumber");
    if (number) setUser({ ...user, phoneNumber: number });
  }, [isLogin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      if (value.length > 10) {
        return;
      }
    }
    if (value.length > 50) return;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const openTOTPModal = () => {
    setIsOpenTOTP(true);
  };

  const handleRegister = async () => {
       if(
        user.password.length < 6
       ){
        return toast.error("Minimum 6 digit is required Password field")
       }
    try {
      setLoading(true);
      const response = await Api.checkUser({
        phoneNumber: user.phoneNumber,
        email: user.email,
      });

      if (response.data.message == "Successfully") {
        return openTOTPModal();
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

      return toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    router.push("/page/account/login");
  };

  return isLogin ? (
    ""
  ) : (
    <CommonLayout parent="home" title="register">
      <section className="register-page section-b-space page-login">
        <Container>
          <Row>
            <Col lg="6">
              <h7 style={{ fontSize: "30px", fontWeight: "700" }}>
                Welcome to the world of Heed!
              </h7>
              <img src={loginphoto1.src} style={{ width: "100%" }} />
            </Col>
            <Col lg="6">
              <div style={{ textAlign: "center" }}>
                {" "}
                <h7 style={{ fontSize: "30px", fontWeight: "700" }}>
                  {" "}
                  Sign up
                </h7>
              </div>
              <div style={{ textAlign: "center" }}>
                {" "}
                <h7 style={{ fontSize: "20px", fontWeight: "700" }}>
                  Hi new buddy, let's get you started with the Heed!
                </h7>
              </div>

              <div className="theme-card">
                <Form className="theme-form paddingOfRegister">
                  <TextField
                   name="name"
                    type="text"
                    id="standard-multiline-flexible"
                    label=" Name"
                    multiline
                    variant="standard"
                    fullWidth
                    value={user.name}
                    onChange={handleChange}
                  />
                  <br />
                  <br />
                  <TextField
                    type="email"
                    id="standard-multiline-flexible"
                    label="Email"
                    multiline
                    variant="standard"
                    fullWidth
                    value={user.email}
                    onChange={handleChange}
                    name="email"
                  />

                  <br />
                  <br />

                  <TextField
                    type="number"
                    id="standard-multiline-flexible"
                    label="Phone Number"
                    multiline
                    variant="standard"
                    fullWidth
                    value={user.phoneNumber}
                    onChange={handleChange}
                    style={{ color: "grey" }}
                    name="phoneNumber"

                  />
                  <br />
                  <br />

            
                      <FormGroup className="login-section">
                  <TextField
                    type="password"
                     name="password"
                    id="standard-multiline-flexible"
                    label="Enter your password"
                  
                    variant="standard"
                    fullWidth
                    value={user.password}
                    onChange={handleChange}
                  />

</FormGroup>
                  <br />
                  <br />

                  <br />
                  <br />

                  <div style={{ textAlign: "center" }}>
                    {" "}
                    <h6>
                      Already have an account?{" "}
                      <span
                        style={{
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                        onClick={goToLogin}
                      >
                        Login
                      </span>
                    </h6>
                  </div>

                  <Col md="12">
                    <div style={{ textAlign: "center" }}>
                      {" "}
                      <button
                        type="button"
                        onClick={handleRegister}
                        className="btn btn-solid w-auto"
                      >
                        create Account
                      </button>
                    </div>
                  </Col>

                  <Toaster />
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <br />
      <br /> <br />
      <OpenModal
        setIsOpenTOTP={setIsOpenTOTP}
        isOpenTOTP={isOpenTOTP}
        userData={user}
      />
    </CommonLayout>
  );
};

export default Register;
