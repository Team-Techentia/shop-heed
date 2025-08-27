import React, { useEffect, useState, useContext } from "react";
import CommonLayout from "../../../components/shop/common-layout";
import { LoaderContext } from "../../../helpers/loaderContext";
import ProtectedRoute from "../../../components/protectRoutes/ProtectedRoute";
import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import { toast } from "react-hot-toast";
import { getCookie } from "../../../components/cookies";
import Api from "../../../components/Api";
import { TextField } from "@mui/material";
import OpenModal from "../account/openModal";

const Profile = () => {
  const token = getCookie("ectoken");

  const LoaderContextData = useContext(LoaderContext);
  const { catchErrors, setLoading } = LoaderContextData;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user.name || !user.email || !user.phoneNumber) {
      toast.error("All fields are required.");
      return;
    }

    if (!emailRegex.test(user.email)) {
      toast.error("Invalid email format.");
      return;
    }

    handleUpdateProfile();
  };

  useEffect(() => {
    fetchData1();
  }, []);
  const [isOpenTOTP, setIsOpenTOTP] = useState(false);
  const [user, setUser] = useState();
  const [verification , setVerification ] = useState(false)
  const [ChangeNumber , setChangeNumber ] = useState()
  const fetchData1 = async () => {
    try {
      setLoading(true);
      const response = await Api.getUserById(token);
      setUser(response.data.data);
    } catch (error) {
      catchErrors(error);

      return toast.error("SomeThing went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [id]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const response = await Api.profileChange(user, token);

      return toast.success(response.data.message);
    } catch (error) {
      catchErrors(error);
      if (error && error.response && error.response.message) {
        return toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const [password, setPassword] = useState({
    newPassword: "",
    currentPassword: "",
    cPassword: "",
  });
  const handleChangePassword = async () => {

    if(
      password.newPassword.length < 6
    ){
      return  toast.error("Minimum 6 digit is required Password field");
    }


    if (password.newPassword !== password.cPassword) {
      toast.error("Password not match");
      return;
    }
    try {
      setLoading(true);
      const response = await Api.changePassword(password, token);

      if (response.status === 200) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }

      setPassword({ newPassword: "", cPassword: "", currentPassword: "" });
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

      return toast.error("SomeThing went wrong");
    } finally {
      setLoading(false);
    }
  };
  const handlePassChange = (e) => {
    const { id, value } = e.target;
    setPassword((prevUser) => ({
      ...prevUser,
      [id]: value,
    }));
  };

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);
  const [modal1, setModal1] = useState(false);
  const toggle1 = () => setModal1(!modal1);
  const toggle2 = () => setVerification(!verification);


  const handleChangeNumber =async ()=>{
    try {
      await  Api.ChangeNumber(ChangeNumber , token)
       toggle2()
       fetchData1()
       return toast.success("Phone number successfully updated")
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
  }

  return (
    <CommonLayout parent="home" title="user profile">
      <section
        id="profile-section"
        className="dashboard-section section-b-space "
      >
        <Container>
          <Row>
            <Col sm="12" md="6">
              <Card className="mt-0" style={{ border: "none" }}>
                <CardBody>
                  <div className="dashboard-box">
                    <div
                      className="user-profile-change"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "auto auto",
                        gap: "20px",
                      }}
                    >
                      <div>
                        <Form onSubmit={handleSubmit}>
                          <FormGroup>
                            <Label for="name">Name</Label>

                            <TextField
                              multiline
                              id="name"
                              variant="standard"
                              fullWidth
                              type="text"
                              value={user && user.name}
                              onChange={handleChange}
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label for="email">Email</Label>

                            <TextField
                              multiline
                              id="email"
                              variant="standard"
                              fullWidth
                              type="email"
                              value={user && user.email}
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label for="mobile">Phone Number</Label>

                            <TextField
                              multiline
                              variant="standard"
                              fullWidth
                              type="tel"
                              id="mobile"
                              value={user && user.phoneNumber}
                            />
                          </FormGroup>

                          <p
                            style={{
                              cursor: "pointer",
                              textDecoration: "underline",
                              color:"#4c75e9"
                            }}
                            onClick={()=>{
                              setIsOpenTOTP(true)
                            }}
                          >
                            Change Phone Number
                          </p>

                          <FormGroup>
                            <Label for="mobile">Password</Label>

                            <TextField
                              multiline
                              variant="standard"
                              fullWidth
                              type="password"
                              id="mobile"
                              value={"******"}
                            />
                          </FormGroup>
                          <p
                            style={{
                              cursor: "pointer",
                              textDecoration: "underline",
                              color:"#4c75e9"
                            }}
                            onClick={toggle}
                          >
                            Change Password
                          </p>
                          <a
                            href="#"
                            className="btn btn-sm btn-solid"
                            onClick={handleUpdateProfile}
                          >
                            update
                          </a>
                        </Form>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Modal isOpen={modal} toggle={toggle} centered>
                <ModalHeader toggle={toggle}>
                  <h7 style={{ fontSize: "20px", fontWeight: "700" }}>
                    Change Password
                  </h7>
                </ModalHeader>
                <ModalBody className="p-4">
                  <div>
                    <Form>
                      <FormGroup className="profile-section">
                        <TextField
                          label="Current Password"
                          id="currentPassword"
                          variant="standard"
                          fullWidth
                          type="password"
                          value={password && password.currentPassword}
                          onChange={handlePassChange}
                        />
                      </FormGroup>
                      <FormGroup className="profile-section">
                        <TextField
                          label="New Password"
                          variant="standard"
                          fullWidth
                          type="password"
                          id="newPassword"
                          value={password.newPassword}
                          onChange={handlePassChange}
                          required
                        />
                      </FormGroup>
                      <FormGroup className="profile-section">
                        <TextField
                          label=" Confirm New Password"
                          variant="standard"
                          fullWidth
                          type="password"
                          id="cPassword"
                          value={password.cPassword}
                          onChange={handlePassChange}
                        />
                      </FormGroup>
                    </Form>
                  </div>

                  <div style={{ textAlign: "end" }}>
                    {" "}
                    <div
                      style={{ marginTop: "28px", color: "#2b9dff" }}
                      className="btn btn-sm btn-solid"
                      onClick={handleChangePassword}
                    >
                      change password
                    </div>
                  </div>
                </ModalBody>
              </Modal>

              <Modal isOpen={modal1} toggle={toggle1} centered>
                <ModalHeader toggle={toggle1}>
                  <h7 style={{ fontSize: "20px", fontWeight: "700" }}>
                    Verify Your EMAIL
                  </h7>
                </ModalHeader>
                <ModalBody className="p-4">
                  <div>
                    <Form>
                      <FormGroup>
                        <TextField
                          
                          multiline
                          variant="standard"
                          fullWidth
                          type="password"
                          id="cPassword"
                          value={user && user.email}
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
                        
                        toggle1()
                        setIsOpenTOTP(true)
                      }}
                    >
                      get otp
                    </div>
                  </div>
                </ModalBody>
              </Modal>


              <Modal isOpen={verification} toggle={toggle2} centered>
                <ModalHeader toggle={toggle2}>
                  <h7 style={{ fontSize: "20px", fontWeight: "700" }}>
                    Change Phone Number
                  </h7>
                </ModalHeader>
                <ModalBody className="p-4">
                  <div>
                    <Form>
                      <FormGroup>
                        <TextField
                          label=" Enter Phone Number"
                          multiline
                          variant="standard"
                          fullWidth
                          type="password"
                          id="cPassword"
                          value={ChangeNumber}
                          onChange={(e)=>{
                            setChangeNumber(e.target.value)
                          }}
                        />
                      </FormGroup>
                    </Form>
                  </div>

                  <div style={{ textAlign: "end" }}>
                    {" "}
                    <div
                      style={{ marginTop: "28px", color: "#2b9dff" }}
                      className="btn btn-sm btn-solid"
                    onClick={handleChangeNumber}
                    >
                    Change Number
                    </div>
                  </div>
                </ModalBody>
              </Modal>
            </Col>
            <div className="extra_space"> </div>
          </Row>
        </Container>
      </section>
      <OpenModal
        setIsOpenTOTP={setIsOpenTOTP}
        isOpenTOTP={isOpenTOTP}
        userData={{email: user && user.email}}
        popUpFor={"forgetPassword"}
        useBox="login"
        setVerification={setVerification}
      />
    </CommonLayout>
  );
};

export default ProtectedRoute(Profile);
