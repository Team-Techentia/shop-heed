import React from "react";
import CommonLayout from "../../components/shop/common-layout";
import { Container, Row } from "reactstrap";
import { Col, Media, } from "reactstrap";
import newsLetter from "../../public/assets/images/newletterimage.png";
import ReturnExchangeForm from "./returnExchangeForm";

const ReturnAndExchangePage = () => {
  return (
    <CommonLayout title="Contact Us" parent="home">
      <section style={{paddingTop:"30px"}} className="section-b-space ratio_asos mb-5  contact-us">
        <div className="collection-wrapper">
          <Container>
            <div>
              <div>
                <h3 style={{fontWeight:"600" , color:"#000000"}}>Contact Heed</h3>
                <p>
                  {/* Have a question or need assistance? We're here to help! Feel
                  free to reach out to us through any of the following channels */}
                  We'd love to hear from you! If you have any questions, concerns, or feedback, feel free to reach out to us.
                </p>
                {/* <h4 className="mt-4">Customer Support</h4>
                <p>
                  Our dedicated customer support team is available to assist you
                  with any inquiries or concerns you may have. Whether you need
                  help with product information, order tracking, or general
                  assistance, we're committed to providing you with prompt and
                  helpful service.
                </p> */}
              </div>
              <div className="mt-4" >
                <Row

                  style={{
                    border: "0.1px solid rgba(211, 198, 198, 0.4509803922)",
                    padding: "0px",
                    margin: "0px",
                    borderRadius: "10px",
                  }}
                >
                  <Col
                    xs="12"
                    sm="12"
                    md="6"
                    lg="6"
                    xl="6"
                    style={{ padding: "0px", margin: "0px" }}
                  >
                    <Media
                      style={{
                        maxHeight: "400px",
                        width: "100%",
                        borderRadius: "10px",
                      }}
                      src={newsLetter.src}
                      alt="show"
                    />
                  </Col>

                  <Col
                    xs="12"
                    sm="12"
                    md="6"
                    lg="6"
                    xl="6"
                   
                  >
                    <div style={{ }}>
                      <br />
                      <h3 style={{fontWeight:"600" , color:"#000000"}}> Return Exchange </h3>

                      <p>
                        {" "}
                        We would be happy to connect with you & Thank You for
                        Contact Us
                      </p>

                      <Col >
                      <ReturnExchangeForm />
                      </Col>
                    </div>
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

export default ReturnAndExchangePage;
