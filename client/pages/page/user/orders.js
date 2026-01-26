import React, { useEffect, useState, useContext } from "react";
import CommonLayout from "../../../components/shop/common-layout";
import { LoaderContext } from "../../../helpers/loaderContext";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../../components/protectRoutes/ProtectedRoute";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { toast } from "react-hot-toast";
import { getCookie } from "../../../components/cookies";
import Api from "../../../components/Api";
import bagg from "../../../public/assets/images/bagg.png";
import Link from "next/link";

const MyOrders = () => {
  const token = getCookie("ectoken");
  const LoaderContextData = useContext(LoaderContext);
  const { catchErrors, setLoading } = LoaderContextData;

  const [order, setOrder] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await Api.getOrderByUserId(token);
      setOrder(response.data.data);
    } catch (error) {
      catchErrors(error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (orderId) => {
    router.push(`/page/user/order/${orderId}`);
  };

  return (
    <CommonLayout parent="home" title="my orders">
      <section className="dashboard-section section-b-space">
        <Container>
          <Row>
            <Col sm="12">
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ fontWeight: "700", color: "#333" }}>My Orders</h3>
              </div>
              <Card className="dashboard-table mt-0" style={{ border: "none" }}>
                <CardBody>
                  <div className="table-container" style={{ overflowX: "auto" }}>
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
                        <div style={{ textAlign: "center", marginTop: "20px" }}>
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
                      <div className="orders-list">
                        {order.map((d) => {
                          const firstItem = d.items[0]; // Show only first product for summary
                          return (
                            <div
                              key={d._id}
                              onClick={() => handleRowClick(d._id)}
                              style={{
                                border: "1px solid #eee",
                                borderRadius: "8px",
                                padding: "15px",
                                marginBottom: "15px",
                                cursor: "pointer",
                                backgroundColor: "#fff",
                                transition: "box-shadow 0.2s"
                              }}
                              className="order-card"
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                {/* Product Image */}
                                <div style={{ flexShrink: 0 }}>
                                  {firstItem.image && firstItem.image.length > 0 ? (
                                    <img
                                      src={firstItem.image[0]}
                                      alt={firstItem.title}
                                      style={{
                                        width: "80px",
                                        height: "100px",
                                        objectFit: "cover",
                                        borderRadius: "4px"
                                      }}
                                    />
                                  ) : (
                                    <div
                                      style={{
                                        width: "80px",
                                        height: "100px",
                                        backgroundColor: "#f0f0f0",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: "4px",
                                        fontSize: "12px",
                                        color: "#666"
                                      }}
                                    >
                                      No Image
                                    </div>
                                  )}
                                </div>

                                {/* Order Details */}
                                <div style={{ flex: 1 }}>
                                  <h5 style={{
                                    margin: "0 0 5px 0",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: "#333",
                                    lineHeight: "1.4"
                                  }}>
                                    {firstItem?.title || "Product details unavailable"}
                                  </h5>

                                  {/* Status Badge */}
                                  <div style={{ marginBottom: "5px" }}>
                                    <span style={{
                                      display: "inline-block",
                                      padding: "4px 8px",
                                      borderRadius: "4px",
                                      backgroundColor: d.orderStatus === "delivered" ? "#e8f5e9" : "#fff3e0",
                                      color: d.orderStatus === "delivered" ? "#2e7d32" : "#ef6c00",
                                      fontSize: "12px",
                                      fontWeight: "600",
                                      textTransform: "capitalize"
                                    }}>
                                      {d.orderStatus === "processing" ? "Confirmed" : d.orderStatus || "Confirmed"}
                                    </span>
                                  </div>


                                </div>

                                {/* Arrow Icon (Desktop mostly) */}
                                <div className="arrow-icon" style={{ color: "#ccc" }}>
                                  <i className="fa fa-angle-right" style={{ fontSize: "20px" }}></i>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
            <div className="extra_space"></div>
          </Row>
        </Container>
      </section>
    </CommonLayout>
  );
};

export default ProtectedRoute(MyOrders);
