import React, { useEffect, useState, useContext } from "react";
import CommonLayout from "../../../../components/shop/common-layout";
import ProtectedRoute from "../../../../components/protectRoutes/ProtectedRoute";
import {
  Card,
  Col,
  Container,
  Row,
} from "reactstrap";
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
        }
      };

      fetchOrderDetails();
    }
  }, [orderId]);

  return (
    <CommonLayout parent="home" title="Order Details">
      <section className="dashboard-section section-b-space">
        <Container>
          <Col lg="8">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0px 10px",
              }}


              className="flexDirection-orderDetail"
            >
                <h7 style={{ fontSize: "15px", fontWeight: "500" }}>
                Order# {order && order.paymentDetails.orderId}
                </h7>
                <h7 style={{ fontSize: "15px", fontWeight: "500" }}>
                Order Placed {order && order.createdAt.slice(0, 10)}
                </h7>
            
            </div>
          </Col>
          <Row>
            <Col lg="8">
              <Card className="dashboard-table mt-0">
                <div
                  style={{ display: "flex", gap: "20px", padding: "10px" }}
                  className="flexDirection-orderDetail"
                >
                  <div>
                    <img
                      style={{ width: "180px", height: "180px" }}
                      src={order && order.product.image[0]}
                      className="widthOfPhoto-order"
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <h5 className="text-capitalize">{order && order.orderStatus}</h5>


                    <h7 style={{ fontSize: "15px", fontWeight: "500" }} className="text-capitalize">
                    {order && order.product.title}
                      </h7>

                  
                    <p   className="text-capitalize" >Size: {order && order.product.size}</p>
                    <p>Rs. {order && order.totalAmount}</p>
                  </div>
                </div>
              </Card>
              <br />
              <Card className="dashboard-table mt-0">
                <div style={{ padding: "10px" }}>
                  <div style={{ display: "flex", gap: "20px" }}>
                    <p>
                      {" "}
                      {order && order.customerDetails && order.customerDetails.first_name  } {order && order.customerDetails && order.customerDetails.last_name}
                       |{" "}
                       {order && order.customerDetails && order.customerDetails.phone }
                    </p>
                  </div>
                  <p>
                    {order && order.customerDetails.city} ,   {order && order.customerDetails.state} , {order && order.customerDetails.pincode} ,  {order && order.customerDetails.country}

                  </p>
                </div>
              </Card>
              <br />
              <Card className="dashboard-table mt-0">
                <div style={{ padding: "10px" }}>
                  <p>NEED HELP WITH YOUR ORDER?</p>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p>HELP AND SUPPORT</p>
                    <div>
                      <p></p>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>

<div style={{height:"20px" , display:"none"}} className="gapOfOrderDetailsPage"></div>

            <Col lg="4">
              <Card className="dashboard-table mt-0">
                <div style={{ padding: "10px" }}>
                  <h7 style={{ fontSize: "15px", fontWeight: "500" }}>Payment Summary</h7>
                  <br />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                       <br/>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                     
                      <p>Cart Total</p>
                      <p>Rs. {order && order.totalAmount}</p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p>Delivery Fee</p>
                      <p>Free</p> 
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p>Shipping</p>
                      <p>Free</p> 
                    </div>
                    <hr />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h7 style={{ fontSize: "15px", fontWeight: "500" }}>Amount To Be Paid</h7>
                      <h7 style={{ fontSize: "15px", fontWeight: "500" }}>Rs. {order && order.totalAmount}</h7>
                    </div>
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
