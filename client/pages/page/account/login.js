import React, { useEffect, useState, useContext } from "react";
import CommonLayout from "../../../components/shop/common-layout";
import { Container, Row, Col, Form } from "reactstrap";
import Api from "../../../components/Api";
import { useRouter } from "next/router";
import { toast, Toaster } from "react-hot-toast";
import UserContext from "../../../helpers/user/UserContext";
import { LoaderContext } from "../../../helpers/loaderContext";
import OpenModal from "./openModal";
import { TextField } from "@mui/material";

const Login = () => {
  const { isLogin } = useContext(UserContext);
  const { catchErrors, setLoading } = useContext(LoaderContext);
  const router = useRouter();

  const [user, setUser] = useState({ emailOrPhone: "" });
  const [isOpenTOTP, setIsOpenTOTP] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLogin) {
      router.push("/"); // Redirect if already logged in
    }
  }, [isLogin, router]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "number" && value.length > 10) return;
    if (value.length > 40) return;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleMobileNumberLogin = async () => {
    if (!user.emailOrPhone || user.emailOrPhone.length < 10) {
      setError("Enter a valid number");
      setTimeout(() => setError(""), 2000);
      return;
    }

    try {
      setLoading(true);
      const res = await Api.checkMobile({ phoneNumber: user.emailOrPhone });

      if (res.data.message === "Phone number already exist") {
        // Existing user → show OTP modal
        setIsOpenTOTP(true);
      } else {
        // New user → redirect to registration page with phone prefilled
        localStorage.setItem("phoneNumber", user.emailOrPhone);
        router.push("/page/account/register");
      }
    } catch (error) {
      catchErrors(error);
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="login-page d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        background: "transparent", // Fully transparent background
      }}
    >
      {/* Optional semi-transparent overlay */}
      
      

      <Container className="p-0" style={{ position: "relative", zIndex: 1 }}>
        <Row className="justify-content-center">
          <Col lg="4" md="6">
            <div
              className="theme-card p-4"
              style={{
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                background: "rgba(255,255,255,0.95)", // slightly transparent white
              }}
            >
              <div className="text-center mb-3">
                <h4 className="mb-0">Log in / Sign up</h4>
              </div>

              <Form className="theme-form mt-3">
                <div className="form-group mb-3">
                  <TextField
                    type="number"
                    label="Phone Number"
                    variant="standard"
                    fullWidth
                    value={user.emailOrPhone}
                    onChange={handleChange}
                    name="emailOrPhone"
                  />
                  {error && <div className="mt-2 text-danger">{error}</div>}
                </div>

                <div className="text-center">
                  <button
                    onClick={handleMobileNumberLogin}
                    type="button"
                    className="btn btn-solid w-100"
                  >
                    Continue
                  </button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>

      <OpenModal
        setIsOpenTOTP={setIsOpenTOTP}
        isOpenTOTP={isOpenTOTP}
        userData={{ phoneNumber: user.emailOrPhone }}
        popUpFor={"checkoutPage"}
        useBox="login"
      />
      <Toaster />
    </section>
  );
};

export default Login;
