import React from "react";
import CommonLayout from "../../components/shop/common-layout";
import { Container, Row, Col } from "reactstrap";
import ContactUsForm from "../../components/contactUS";
import { Phone, Mail, Clock } from "lucide-react"; // icons

const ContactUs = () => {
  return (
    <CommonLayout title="Contact Us" parent="home">
      <section style={{ paddingTop: "30px" }} className="section-b-space ratio_asos mb-5 contact-us">
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
                <Col xs="12" sm="12" md="6" lg="6" xl="6"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "40px",
                  }}
                >
                  <h3 style={{ fontWeight: "600", color: "#000000", marginBottom: "20px" }}>
                    CONTACT US
                  </h3>

                  <div style={{ lineHeight: "2.2", color: "#000000" }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" ,fontSize:"20px"}}>
                      <Phone color="#ff4d00" size={20} style={{ marginRight: "10px" }} />
                      <span>Customer Care -  ‪+91-7703933743</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", marginBottom: "10px",fontSize:"20px" }}>
                      <Mail color="#ff4d00" size={20} style={{ marginRight: "10px" }} />
                      <span>Heed.brandsin@gmail.com</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center",fontSize:"20px" }}>
                      <Clock color="#ff4d00" size={20} style={{ marginRight: "10px" }} />
                      <span>Sun-Sat | 10:30 AM - 06:00 PM (IST)</span>
                    </div>
                  </div>
                </Col>

                {/* RIGHT SIDE: CONTACT FORM */}
                <Col xs="12" sm="12" md="6" lg="6" xl="6" style={{ padding: "40px" }}>
                  <div>
                    <h3 style={{ fontWeight: "600", color: "#000000" }}>Get in Touch</h3>
                    <p style={{ color: "#555" }}>
                      We would be happy to connect with you. Thank you for reaching out to us!
                    </p>
                    <Col>
                      <ContactUsForm />
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

export default ContactUs;
