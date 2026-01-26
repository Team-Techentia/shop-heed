import React, { useEffect, useState } from "react";
import CommonLayout from "../../../../components/shop/common-layout";
import ProtectedRoute from "../../../../components/protectRoutes/ProtectedRoute";
import { Card, Col, Container, Row } from "reactstrap";
import { getCookie } from "../../../../components/cookies";
import Api from "../../../../components/Api";
import { useRouter } from "next/router";

const OrderDetails = () => {
  const token = getCookie("ectoken");
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      const fetchOrderDetails = async () => {
        try {
          const response = await Api.getOrderById(orderId, token);
          setOrder(response.data.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchOrderDetails();
    }
  }, [orderId]);

  return (
    <CommonLayout parent="home" title="Order Details">
      <section className="dashboard-section section-b-space">
        <Container>
          <Row>
            {/* Left Column: Products, Order Info, Address */}
            <Col lg="8">
              {/* 1. Product Details */}
              {order &&
                order.items.map((item) => (
                  <Card key={item._id} className="dashboard-table mt-0 mb-3" style={{ border: "1px solid #eee" }}>
                    <div style={{ display: "flex", gap: "20px", padding: "15px" }} className="flexDirection-orderDetail">
                      <div>
                        <img
                          style={{ width: "60px", height: "80px", objectFit: "cover", borderRadius: "5px" }}
                          src={item.image[0]}
                          alt={item.title}
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "5px", justifyContent: "center" }}>
                        <h5 className="text-capitalize" style={{ fontSize: "16px", fontWeight: "600", color: "#333", marginBottom: "5px" }}>
                          {item.title}
                        </h5>
                        <p className="text-capitalize" style={{ color: "#333", fontWeight: "600", fontSize: "14px", margin: 0 }}>
                          Size: {item.size}
                        </p>
                        <p className="text-capitalize" style={{ color: "#333", fontWeight: "600", fontSize: "14px", margin: 0 }}>
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-capitalize" style={{ color: "#333", fontWeight: "600", fontSize: "14px", margin: 0 }}>
                          Total Price: ₹{item.totalPrice}
                        </p>
                        <div style={{ marginTop: "5px" }}>
                          <span style={{
                            padding: "4px 8px",
                            backgroundColor: "#f0f0f0",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "500",
                            textTransform: "capitalize"
                          }}>
                            Order Status:{order.orderStatus === "processing" ? "Confirmed" : order.orderStatus || "Confirmed"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

              {/* 2. Order Info (Date, ID) */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "15px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "5px",
                  marginBottom: "20px",
                  flexWrap: "wrap",
                  gap: "10px"
                }}
              >
                <div>
                  <h6 style={{ fontSize: "12px", color: "#777", marginBottom: "2px", fontWeight: "600", textTransform: "uppercase" }}>Order ID</h6>
                  <p style={{ fontSize: "14px", fontWeight: "600", color: "#333", margin: 0 }}>{order && order.orderId}</p>
                </div>
                <div>
                  <h6 style={{ fontSize: "12px", color: "#777", marginBottom: "2px", fontWeight: "600", textTransform: "uppercase" }}>Order Date</h6>
                  <p style={{ fontSize: "14px", fontWeight: "600", color: "#333", margin: 0 }}>{order && order.createdAt.slice(0, 10)}</p>
                </div>
              </div>

              {/* 3. Shipping Address */}
              <Card className="dashboard-table mt-0" style={{ border: "1px solid #eee", marginBottom: "20px" }}>
                <div style={{ padding: "15px" }}>
                  <h5 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "15px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
                    Ship To
                  </h5>
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <p style={{ fontWeight: "600", color: "#333", margin: 0 }}>
                      {order && order.customerDetails && order.customerDetails.first_name}{" "}
                      {order && order.customerDetails && order.customerDetails.last_name}
                    </p>
                    <p style={{ color: "#555", margin: 0 }}>
                      {order && order.customerDetails && order.customerDetails.city},{" "}
                      {order && order.customerDetails && order.customerDetails.state}
                    </p>
                    <p style={{ color: "#555", margin: 0 }}>
                      {order && order.customerDetails && order.customerDetails.pincode},{" "}
                      {order && order.customerDetails && order.customerDetails.country}
                    </p>
                    <p style={{ color: "#555", margin: 0, marginTop: "5px" }}>
                      Phone: {order && order.customerDetails && order.customerDetails.phone}
                    </p>
                  </div>
                </div>
              </Card>
            </Col>

            {/* Right Column: Payment Summary, Help */}
            <Col lg="4">
              {/* 4. Payment Summary */}
              <Card className="dashboard-table mt-0" style={{ border: "1px solid #eee", marginBottom: "20px" }}>
                <div style={{ padding: "15px" }}>
                  <h5 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "15px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
                    Payment Summary
                  </h5>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <p style={{ color: "#555", margin: 0 }}>Item Total</p>
                      <p style={{ color: "#333", fontWeight: "500", margin: 0 }}>Rs. {order && order.totalAmount}</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <p style={{ color: "#555", margin: 0 }}>Shipping Fee</p>
                      <p style={{ color: "green", fontWeight: "500", margin: 0 }}>Free</p>
                    </div>
                    <hr style={{ margin: "10px 0" }} />
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <h6 style={{ fontSize: "15px", fontWeight: "700", margin: 0 }}>Grand Total</h6>
                      <h6 style={{ fontSize: "15px", fontWeight: "700", margin: 0, color: "#ff4c3b" }}>
                        Rs. {order && order.totalAmount}
                      </h6>
                    </div>
                  </div>
                </div>
              </Card>

              {/* 5. Help Section (Moved here for correct mobile stacking) */}
              <Card className="dashboard-table mt-0" style={{ border: "1px solid #eee", backgroundColor: "#fff5f5" }}>
                <div style={{ padding: "15px" }}>
                  <h6 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "10px", color: "#333" }}>
                    NEED HELP WITH YOUR ORDER?
                  </h6>
                  {/* <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontSize: "13px", color: "#555", margin: 0 }}>
                      Contact our customer support for assistance.
                    </p>
                  </div> */}
                  <div style={{ marginTop: "10px" }}>
                    <a href="/contact-us" style={{ fontSize: "13px", color: "#ff4c3b", fontWeight: "600", textDecoration: "underline" }}>
                      Contact Customer Support
                    </a>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </CommonLayout>
  );
};

export default ProtectedRoute(OrderDetails);
