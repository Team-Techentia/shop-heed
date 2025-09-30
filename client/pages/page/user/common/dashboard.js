import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Input,
  TabContent,
  TabPane,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Label,
  Form,
  FormGroup,
} from "reactstrap";
import dynamic from "next/dynamic";
import { getCookie } from "../../../../components/cookies";
import Api from "../../../../components/Api";
import { toast, Toaster } from "react-hot-toast";
import UserContext from "../../../../helpers/user/UserContext";
import { LoaderContext } from "../../../../helpers/loaderContext";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const Dashboard = () => {

  
  const userContext = useContext(UserContext);
  const logOut = userContext.logOut;
  const router = useRouter();
  const { query } = router;
  const pageName = query.page
  const [activeTab, setActiveTab] = useState("4");
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const token = getCookie("ectoken");
  const [order, setOrder] = useState([]);
  const [user, setUser] = useState();
  const LoaderContextData = useContext(LoaderContext);
  const { catchErrors, setLoading } = LoaderContextData;

  useEffect(() => {
    fetchData1();
    if(pageName){
      if(pageName === 'orders'){ 

        setActiveTab("3");
        fetchData();
      }else if(pageName === 'profile'){
        setActiveTab("4");
      }
    }
  }, [pageName]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await Api.getOrderByUserId(token);
      setOrder(response.data.data);
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

  const fetchData1 = async () => {
    try {
      setLoading(true);
      const response = await Api.getUserById(token);
      setUser(response.data.data);
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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [id]: value,
    }));
  };
  const handlePassChange = (e) => {
    const { id, value } = e.target;
    setPassword((prevUser) => ({
      ...prevUser,
      [id]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const response = await Api.profileChange(user, token);

      if (response.status === 200) {
        toast.success(response.data.message);
       return setActiveTab("4");
      } else {
        return  toast.error(response.data.message);
      }
    } catch (error) {
      catchErrors(error);
      if (error && error.response && error.response.message) {
        return toast.error(error.response.data.message);
      }

      return toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const [password, setPassword] = useState({
    newPassword: "",
    cPassword: "",
  });
  const handleChangePassword = async () => {
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

      setPassword({ newPassword: "", cPassword: "" });
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

  return (
    <section className="dashboard-section section-b-space ">
      <Container>
        <Row>
          <Col lg="9" style={{ minHeight: "50vh" }}>
            <div className="faq-content">
              <TabContent activeTab={activeTab}>
                <TabPane tabId="3">
                  <Row>
                    <Col sm="12">
                      <Card className="dashboard-table mt-0">
                        <CardBody>
                          <div
                            className="table-container"
                            style={{ overflowX: "auto" }}
                          >
                            <table className="table table-responsive-sm mb-0">
                              <thead>
                                <tr>
                                  <th scope="col">product image</th>
                                  <th scope="col">product name</th>
                                  <th scope="col">Payment status</th>
                                  <th scope="col">delivery status</th>
                                  <th scope="col">Total Quantity</th>
                                  <th scope="col">price</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order &&
                                  order.map((d, i) => {
                                    return (
                                      <tr key={i} style={{ textAlign: "left" }}>
                                        <td>
                                          <img
                                            src={d.product.image[0]}
                                            alt="product image"
                                            style={{
                                              maxWidth: "100px",
                                              maxHeight: "100px",
                                            }} 
                                          />
                                        </td>
                                        <td style={{ whiteSpace: "nowrap" }}>
                                          {d.product.title}
                                        </td>
                                        <td>{d.status}</td>
                                        <td>{d.orderStatus}</td>
                                        <td>{d.totalQuantity}</td>
                                        <td>₹ {d.totalAmount}</td>
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </table>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="4">
                  <Row>
                    <Col sm="12">
                      <Card className="mt-0">
                        <CardBody>
                          <div className="dashboard-box">
                            <div className="dashboard-title">
                              <h4>profile</h4>
                              <span
                                data-toggle="modal"
                                data-target="#edit-profile"
                                onClick={() => {
                                  setActiveTab("edit");
                                }}
                              >
                                edit
                              </span>
                            </div>
                            <div className="dashboard-detail">
                              <ul>
                                {" "}
                                <li> Name : {user && user.name}</li>
                                <li>
                                  {" "}
                                  Mobile Number : {user && user.phoneNumber}
                                </li>
                                <li> E mail : {user && user.email}</li>
                              </ul>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </TabPane>

                <TabPane tabId="edit">
                  <Row>
                    <Col sm="12">
                      <Card className="mt-0">
                        <CardBody>
                          <div className="dashboard-box">
                            <div className="dashboard-title">
                              <div
                                onClick={() => {
                                  setActiveTab("4");
                                  fetchData1();
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                <ArrowBackIosNewIcon  />
                              </div>
                            </div>

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
                                    <Label for="name">Name:</Label>
                                    <Input
                                      type="text"
                                      id="name"
                                      value={user && user.name}
                                      onChange={handleChange}
                                      required
                                    />
                                  </FormGroup>
                                  <FormGroup>
                                    <Label for="email">Email:</Label>
                                    <Input
                                      type="email"
                                      id="email"
                                      value={user && user.email}
                                      onChange={handleChange}
                                      required
                                    />
                                  </FormGroup>
                                  <FormGroup>
                                    <Label for="mobile">Mobile:</Label>
                                    <Input
                                      type="tel"
                                      id="mobile"
                                      value={user && user.phoneNumber}
                                      onChange={handleChange}
                                      required
                                    />
                                  </FormGroup>
                                  <a
                                    href="#"
                                    className="btn btn-sm btn-solid"
                                    onClick={handleUpdateProfile}
                                  >
                                    update
                                  </a>
                                </Form>
                              </div>

                              <div style={{marginTop:"-15px"}}>
                                <Form >
                                  <FormGroup>
                                  </FormGroup>
                                  <FormGroup>
                                    <Label for="newPassword">
                                      New Password:
                                    </Label>
                                    <Input
                                      type="password"
                                      id="newPassword"
                                      value={password.newPassword}
                                      onChange={handlePassChange}
                                      required
                                    />
                                  </FormGroup>
                                  <FormGroup>
                                    <Label for="confirmPassword">
                                      Confirm New Password:
                                    </Label>
                                    <Input
                                      type="password"
                                      id="cPassword"
                                      value={password.cPassword}
                                      onChange={handlePassChange}
                                      required
                                    />
                                  </FormGroup>
                                  <div  style={{marginTop:"28px"}}
                                    className="btn btn-sm btn-solid"
                                    onClick={handleChangePassword}
                                  >
                                    change password
                                  </div>
                                </Form>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
              <Modal isOpen={modal} toggle={toggle} centered>
                <ModalHeader toggle={toggle}>Logging Out</ModalHeader>
                <ModalBody className="p-4">Do you want to logout?</ModalBody>
                <ModalFooter>
                  <Link
                    onClick={logOut}
                    href={"/"}
                    className="btn-solid btn-custom"
                    color="secondary"
                  >
                    Yes
                  </Link>
                  <Button
                    className="btn-solid btn-custom"
                    color="secondary"
                    onClick={toggle}
                  >
                    No
                  </Button>
                </ModalFooter>
              </Modal>
            </div>
          </Col>
        </Row>

        <br/><br/> <br/>
      </Container>

      {/* <Toaster /> */}
    </section>
  );
};

export default Dashboard;
