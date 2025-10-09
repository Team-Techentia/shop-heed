import React from "react";
import CommonLayout from "../../components/shop/common-layout";
import { Container, Row, Col } from "reactstrap";
import { Phone, Mail, Clock } from "lucide-react"; // icons
import ReturnExchangeForm from "./returnExchangeForm";

const ReturnAndExchangePage = () => {
  return (
    <CommonLayout title="Return & Exchange" parent="home">
      <section
        style={{ paddingTop: "30px" }}
        className="section-b-space ratio_asos mb-5 contact-us"
      >
        <div className="collection-wrapper">
          <Container>
            <div className="mt-4">
              <Row
                style={{
                  border: "0.1px solid rgba(211, 198, 198, 0.45)",
                  padding: "0px",
                  margin: "0px",
                  borderRadius: "10px",
                }}
              >
                {/* LEFT SIDE: CONTACT INFO */}
                <Col
                  xs="12"
                  sm="12"
                  md="6"
                  lg="6"
                  xl="6"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "40px",
                  }}
                >
                  <h3
                    style={{
                      fontWeight: "600",
                      color: "#000000",
                      marginBottom: "20px",
                    }}
                  >
                    CONTACT US
                  </h3>

                  <div style={{ lineHeight: "2.2", color: "#000000" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                        fontSize: "20px",
                      }}
                    >
                      <Phone color="#ff4d00" size={20} style={{ marginRight: "10px" }} />
                      <span>Customer Care - ‪+91-7703933743</span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                        fontSize: "20px",
                      }}
                    >
                      <Mail color="#ff4d00" size={20} style={{ marginRight: "10px" }} />
                      <span>Heed.brandsin@gmail.com</span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "20px",
                      }}
                    >
                      <Clock color="#ff4d00" size={20} style={{ marginRight: "10px" }} />
                      <span>Sun-Sat | 10:30 AM - 06:00 PM (IST)</span>
                    </div>
                  </div>
                </Col>

                {/* RIGHT SIDE: RETURN & EXCHANGE FORM */}
                <Col
                  xs="12"
                  sm="12"
                  md="6"
                  lg="6"
                  xl="6"
                  style={{ padding: "40px" }}
                >
                  <div>
                    <h3 style={{ fontWeight: "600", color: "#000000" }}>
                      Return & Exchange
                    </h3>
                    <p style={{ color: "#555" }}>
                      Please fill out the form below to initiate your return or
                      exchange request. We’ll get back to you shortly.
                    </p>
                    <Col>
                      <ReturnExchangeForm />
                    </Col>
                  </div>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
      </section>
    </CommonLayout>
  );
};

export default ReturnAndExchangePage;
