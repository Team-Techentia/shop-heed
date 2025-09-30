import React, { useEffect, useState, useContext } from "react";
import CommonLayout from "../../../components/shop/common-layout";
import { Container, Row, Col, Form } from "reactstrap";
import Api from "../../../components/Api";
import { useRouter } from "next/router";
import OpenModal from "./openModal";
import UserContext from "../../../helpers/user/UserContext";
import { LoaderContext } from "../../../helpers/loaderContext";
import { toast, Toaster } from "react-hot-toast";
import { TextField } from "@mui/material";

const Register = () => {
  const { isLogin } = useContext(UserContext);
  const { catchErrors, setLoading } = useContext(LoaderContext);
  const router = useRouter();

  const [isOpenTOTP, setIsOpenTOTP] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (isLogin) {
      window.location.href = "/";
    }

    const number = localStorage.getItem("phoneNumber");
    if (number) setUser((prev) => ({ ...prev, phoneNumber: number }));
  }, [isLogin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber" && value.length > 10) return;
    if (value.length > 50) return;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const openTOTPModal = () => setIsOpenTOTP(true);

  const handleRegister = async () => {
    if (!user.name || !user.email || !user.phoneNumber) {
      return toast.error("Please fill all required fields");
    }

    try {
      setLoading(true);
      const response = await Api.checkUser({
        phoneNumber: user.phoneNumber,
        email: user.email,
      });

      if (response.data.message === "Successfully") {
        openTOTPModal();
      }
    } catch (error) {
      catchErrors(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // const goToLogin = () => router.push("/page/account/login");

  return isLogin ? null : (
    <CommonLayout parent="home" title="register">
      <section className="register-page section-b-space page-login">
        <Container>
          <Row className="justify-content-center">
            <Col lg="6">
              <div className="text-center mb-4">
                <h2>Sign up</h2>
                <p>Enter your details to create an account</p>
              </div>

              <div className="theme-card p-4">
                <Form className="theme-form">
                  <TextField
                    name="name"
                    type="text"
                    label="Name"
                    variant="standard"
                    fullWidth
                    value={user.name}
                    onChange={handleChange}
                  />
                  <br /><br />

                  <TextField
                    name="email"
                    type="email"
                    label="Email"
                    variant="standard"
                    fullWidth
                    value={user.email}
                    onChange={handleChange}
                  />
                  <br /><br />

                  <TextField
                    name="phoneNumber"
                    type="number"
                    label="Phone Number"
                    variant="standard"
                    fullWidth
                    value={user.phoneNumber}
                    onChange={handleChange}
                    style={{ color: "grey" }}
                  />
                  <br /><br />

                  <div className="text-center mt-3">
                    <h6>
                      Already have an account?{" "}
                      <span
                        style={{ textDecoration: "underline", cursor: "pointer" }}
                        onClick={goToLogin}
                      >
                        Login
                      </span>
                    </h6>
                  </div>

                  <div className="text-center mt-3">
                    <button
                      type="button"
                      onClick={handleRegister}
                      className="btn btn-solid w-auto"
                    >
                      GET OTP
                    </button>
                  </div>

                  {/* <Toaster /> */}
                </Form>
              </div>
            </Col>
          </Row>
        </Container>

        <OpenModal
          setIsOpenTOTP={setIsOpenTOTP}
          isOpenTOTP={isOpenTOTP}
          userData={user}
        />
      </section>
    </CommonLayout>
  );
};

export default Register;
