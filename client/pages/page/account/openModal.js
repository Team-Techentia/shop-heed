import React, {  useState, useContext } from "react";
import { Col, Media, Row, Modal, ModalBody, Form, Button, FormGroup } from "reactstrap";
import Api from "../../../components/Api";
import {Dialog,DialogTitle,DialogContent,DialogActions,Snackbar,Alert,Typography,TextField,
} from "@mui/material";
import OTPInput from "react-otp-input";
import { toast, Toaster } from "react-hot-toast";
import UserContext from "../../../helpers/user/UserContext";
import { setCookie } from "../../../components/cookies";
import { LoaderContext } from "../../../helpers/loaderContext";
import { useMediaQuery } from '@mui/material';
const OpenModal = ({ setIsOpenTOTP, isOpenTOTP, userData, popUpFor ,setVerification}) => {
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const userContext = useContext(UserContext);
  const setIslogin = userContext.setIslogin;
  const [otpType, setOtpType] = useState("Text_Message");
  const [otpModel, setOtpModel] = useState(false);
  const [otp, setOtp] = useState("");

  const LoaderContextData = useContext(LoaderContext);
  const { catchErrors, setLoading } = LoaderContextData;

  const toggle = () => setIsOpenTOTP(!isOpenTOTP);

  const handleOTPVerify = async () => {
    try {
      setLoading(true);
      const response = await Api.verifyOtp({
        phoneNumber: userData.phoneNumber,
        email: userData.email,
        otpType: otpType,
        otp: otp,
      });

      if (
        response.data.message === "verification successfuy via phone number"
      ) {
        setOtp("")
        if (popUpFor === "checkoutPage") {
          setLoading(true);
          const response = await Api.loginRegisterForCheckOutPage(userData);
          setLoading(false);
          toast.success("Successfully logged in");
          setCookie(null, "ectoken", response.data.token, 100);
          setIslogin(true);
        }  else {
          setLoading(true);
          const response = await Api.signUp(userData);
          setLoading(false);
          toast.success("Signup successful");
          setCookie(null, "ectoken", response.data.token, 100);
          setIslogin(true);
          window.location.href = "/";
        }
        setOtpModel(false);
      }
      else if( response.data.message === "verification successfuy via email"){
        setOtp("")
        if (popUpFor === "forgetPassword") {
          setVerification(true)
        }
        setOtp("")
        setOtpModel(false);
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

  const handleOTPChange = (otpValue) => {
    setOtp(otpValue);
  };
  const handleInputChange = (e) => {
    const newOtp = otp.slice(0, index) + e.target.value + otp.slice(index + 1);
    handleOTPChange(newOtp);
  };

  const renderInput = ({ value, index, ...props }) => {
    const inputStyle = {
    
      marginRight:isSmallScreen? "10px":"22px",
      width:isSmallScreen? "20px":"40px",
      
      border: "none",
      borderBottom: "1px solid",
      borderRadius: "0.1px",
      textAlign:"center"
    };
    const separatorStyle = {
      marginLeft: "8px",
      fontSize: "20px",
      borderBottom: "1px solid",
      borderRadius: "0.1px",
    };

    return (
      <div className="input-otp-box" style={{ display: "flex" }}>
        {index > 0 && <span style={separatorStyle}>-</span>}
        <input
          key={index}
          type="text"
          name={`otp-${index}`}
          value={value}
          maxLength="1"
          onChange={handleInputChange}
          onFocus={(e) => e.target.select()}
          {...props}
          style={inputStyle}
        />
      </div>
    );
  };

  const handleSendOtp = async (otpType) => {
    try {
      setLoading(true);
      const response = await Api.sendOTP({
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        otpType,
      });

      if (response.data.message === "OTP sent successfully") {
        setIsOpenTOTP(false);
        setOtpModel(true);
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

  return (
    <>
      <div className="otp-model-model">
        <Modal
          isOpen={isOpenTOTP}
          toggle={toggle}
          className="theme-modal modal-lg otp-model-model"
          centered
        >
          <div>
            <ModalBody className="modal1 otp-model-model">
              <Row
                style={{
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "center",
                }}
                className="compare-modal"
              >
                <Col lg="7" sm="12">
                  <div className="modal-bg">
                    <div className="offer-content">
                      <Media
                        className="img-fluid blur-up lazyload"
                        alt=""
                      />
                     

                      {popUpFor === "forgetPassword" ? (
                        <div>



                           <h7 style={{ fontSize: "20px", fontWeight: "700" }}>
                    Verify Your EMAIL
                  </h7>

                  <div className="mt-4">
                    <Form>
                      <FormGroup>
                        <TextField
                          
                          multiline
                          variant="standard"
                          fullWidth
                          type="password"
                          id="cPassword"
                          value={userData && userData.email}
                        />
                      </FormGroup>
                    </Form>
                  </div>

                  <div style={{ textAlign: "end" }}>
                    {" "}
                    <div
                      style={{ marginTop: "28px", color: "#2b9dff" }}
                      className="btn btn-sm btn-solid"
                      onClick={()=>{
                        
                        handleSendOtp("email")
                      }}
                    >
                      get otp
                    </div>
                  </div>
                         
                        </div>
                      ) : (

                     <> <h3 className="mb-3">Send OTP</h3>
                        <Form
                          action=""
                          className="auth-form needs-validation"
                          method="post"
                          id="mc-embedded-subscribe-form"
                          name="mc-embedded-subscribe-form"
                          target="_blank"
                        >
                          <div className="form-group mx-sm-3">
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                {" "}
                                <h4
                                  style={{
                                    display: "flex",
                                    alignContent: "start",
                                  }}
                                >
                                  Text message (SMS)
                                </h4>
                                <p
                                  style={{
                                    display: "flex",
                                    alignContent: "start",
                                  }}
                                >
                                  We'll text you a code.
                                </p>
                              </div>
                              <input
                                type="radio"
                                id="textMessageRadioButton"
                                checked={
                                  otpType === "Text_Message" ? true : false
                                }
                                value="Text_Message"
                                onChange={(e) => setOtpType(e.target.value)}
                                style={{
                                  height: "18px",
                                  width: "18px",
                                  cursor: "pointer",
                                  color: "black",
                                }}
                              />
                            </div>
                            <br />

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                {" "}
                                <h4
                                  style={{
                                    display: "flex",
                                    alignContent: "start",
                                  }}
                                >
                                  Phone call
                                </h4>
                                <p
                                  style={{
                                    display: "flex",
                                    alignContent: "start",
                                  }}
                                >
                                  We'll call you with a code.
                                </p>
                              </div>
                              <input
                                type="radio"
                                id="phoneCallRadioButton"
                                value="Phone_Call"
                                checked={
                                  otpType === "Phone_Call" ? true : false
                                }
                                onChange={(e) => setOtpType(e.target.value)}
                                style={{
                                  height: "18px",
                                  width: "18px",
                                  cursor: "pointer",
                                }}
                              />
                            </div>

                            <Button
                              type="button"
                              className="btn btn-solid"
                              id="mc-submit"
                              onClick={() => {
                                handleSendOtp(otpType);
                              }}
                            >
                              send
                            </Button>
                          </div>
                        </Form></>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </ModalBody>
          </div>
        </Modal>
      </div>

      <div className="otp-otp">
        <Dialog
          open={otpModel}
          onClose={() => {
            setOtpModel(false);
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Typography
                style={{
                  fontSize: "17px",
                  color: "#292929",
                  fontWeight: "600",
                }}
              >
                Enter the 6-digit OTP
              </Typography>
            </div>
          </DialogTitle>

          <DialogContent dividers>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <OTPInput
                value={otp}
                onChange={handleOTPChange}
                numInputs={6}
                separator={<span>-</span>}
                isInputNum
                shouldAutoFocus
                inputStyle="otp-input"
                isInputSecure={false}
                renderInput={renderInput}
              />
            </div>
          </DialogContent>

          <DialogActions style={{ display: "flex", justifyContent: "end"  , paddingRight:isSmallScreen?"0px":"50px"}}>
          <Button
              style={{
                borderRadius: "10px",
                backgroundColor: "#FFFFFF",
                border: "none",
                color:"#000000"
              }}
              onClick={() => {
                handleSendOtp(otpType);
              }}
            >
              resend
            </Button>
            <Button
              style={{
                borderRadius: "10px",
                backgroundColor: "#ffffff",
                color:"#ff0000a3",
                border: "none",
              }}
              onClick={() => {
                setOtp("");
                setOtpModel(false);
                setOtpType("");
              }}
            >
              Cancel
            </Button>
          

            <Button
              onClick={handleOTPVerify}
              color="primary"
              style={{
                backgroundColor: "#FFFFFF",
                color:"#005b00c2",
                border: "none",
                borderRadius: "10px",
              }}
            >
              Verify
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={false} autoHideDuration={6000} onClose={() => {}}>
          <Alert severity="success" variant="success">
            OTP submitted successfully!
          </Alert>
        </Snackbar>
      </div>

      <Toaster />
    </>
  );
};

export default OpenModal;
