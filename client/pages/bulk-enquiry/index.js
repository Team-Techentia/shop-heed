import React from "react";
import CommonLayout from "../../components/shop/common-layout";
import { Container, Row, Col } from "reactstrap";
import BulkForm from "./bulkFrom";


const ContactUs = () => {
  return (
    <CommonLayout title="Bulk Enquiry" parent="home">
      <section style={{ paddingTop: "30px" }} className="section-b-space ratio_asos mb-5 contact-us">
        <div className="collection-wrapper">
          <Container>
            <div>
              <div className="mt-4" style={{ maxWidth: "800px", margin: "0 auto" }}>
                <Row
                  style={{
                    border: "0.1px solid rgba(211, 198, 198, 0.4509803922)",
                    padding: "20px",
                    borderRadius: "10px",
                    textAlign: "center"
                  }}
                >
                  <Col xs="12">
                    <h3 style={{ fontWeight: "600", color: "#000000" }}>Bulk Enquiry</h3>
                    <p>We would be happy to connect with you & Thank You for Contacting Us</p>
                    <BulkForm />
                  </Col>
                </Row>
              </div>
            </div>
          </Container>
        </div>
      </section>
    </CommonLayout>
  );
};

export default ContactUs;
