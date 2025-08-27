import React, { useEffect, useState, useContext } from "react";
import CommonLayout from "../../../components/shop/common-layout";
import { LoaderContext } from "../../../helpers/loaderContext";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../../components/protectRoutes/ProtectedRoute";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
} from "reactstrap";
import { toast } from "react-hot-toast";
import { getCookie } from "../../../components/cookies";
import Api from "../../../components/Api";
import bagg from "../../../public/assets/images/bagg.png";
import Link from "next/link";

const MyOrders = () => {
  const token = getCookie("ectoken");
  const LoaderContextData = useContext(LoaderContext);
  const { catchErrors, setLoading } = LoaderContextData;

 
  useEffect(() => {
    fetchData();
  }, []);

  const [user, setUser] = useState();
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

  const [order, setOrder] = useState([]);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await Api.getOrderByUserId(token);
      setOrder(response.data.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();

  const handleRowClick = (orderId) => {
    router.push(`/page/user/order/${orderId}`);
  };

  return (
    <CommonLayout parent="home" title="my orders">
      <section className="dashboard-section section-b-space ">
        <Container>
          <Row>
            <Col sm="12">
              <Card className="dashboard-table mt-0" style={{ border: "none" }}>
                <CardBody>
                  <div
                    className="table-container"
                    style={{ overflowX: "auto" }}
                  >
                    {order && order.length === 0 ? (
                      <div>
                        <h4 className="text-center">
                          Sadly, you haven't placed any orders till now.
                        </h4>

                        <div style={{ textAlign: "center" }}>
                          <img
                            src={bagg.src}
                            style={{ width: "300px", height: "250px" }}
                            alt="ordernotfound"
                            className="bag-img-mobile"
                          />
                        </div>

                        <div
                          style={{ textAlign: "center", marginTop: "20px " }}
                        >
                          {" "}
                          <Link href={"/"}>
                          <button
                            style={{ backgroundColor: "white" }}
                            type="button"
                           
                            className="btn btn-solid w-auto"
                          >
                            Continue Shopping
                          </button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <table className="table table-responsive-sm mb-0">
                        <thead>
                          <tr>
                            <th
                              scope="col"
                              style={{
                                minWidth: "150px   ",
                                alignContent: "left",
                              }}
                            >
                              product image
                            </th>
                            <th
                              scope="col"
                              style={{
                                minWidth: "150px   ",
                                alignContent: "left",
                              }}
                            >
                              product name
                            </th>
                            <th
                              scope="col"
                              style={{
                                minWidth: "150px   ",
                                alignContent: "left",
                              }}
                            >
                              Payment status
                            </th>
                            <th
                              scope="col"
                              style={{
                                minWidth: "150px   ",
                                alignContent: "left",
                              }}
                            >
                              delivery status
                            </th>
                            <th
                              scope="col"
                              style={{
                                minWidth: "150px   ",
                                alignContent: "left",
                              }}
                            >
                              Total Quantity
                            </th>
                            <th
                              scope="col"
                              style={{
                                minWidth: "150px   ",
                                alignContent: "left",
                              }}
                            >
                              price
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {order &&
                            order.map((d, i) => {
                              return (
                                <tr
                                  key={i}
                                  style={{
                                    textAlign: "left",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleRowClick(d._id)}
                                >
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
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>

            <div className="extra_space"> </div>
          </Row>
        </Container>
      </section>
    </CommonLayout>
  );
};

export default ProtectedRoute(MyOrders);
