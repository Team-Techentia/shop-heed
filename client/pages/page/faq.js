import React, { useState } from "react";
import CommonLayout from "../../components/shop/common-layout";
import {
  Collapse,
  Card,
  CardHeader,
  Container,
  Row,
  Col,
} from "reactstrap";

const faqData = [
  {
    qus: "IS CASH ON DELIVERY (COD) AVAILABLE?",
    ans:
      "Yes, COD is available for orders below INR 2000 on all serviceable pincodes.*",
  },
  {
    qus: "HOW TO PLACE AN RETURN / EXCHANGE REQUEST?",
    ans:
      " Visit the Place your Return / Exchange Request section on the website / app or click here to raise a return/exchange request for your order.",
  },
  {
    qus: "ARE THERE ANY ADDITIONAL CHARGES FOR RETURNS/EXCHANGE?",
    ans:
      "We levy a charge of INR 100 for any return orders as reverse shipment fee at the time of Refund.",
  },
  {
    qus: "HOW LONG WILL MY ORDER TAKE TO ARRIVE?",
    ans:
      "The order usually takes 2-5 working days to reach all the metros and tier I cities, however for some pin codes it might take a little more time. In case of delay please get in touch",
  },
  {
    qus: "HOW WOULD I KNOW IF MY ORDER IS PLACED?",
    ans:
      "You will get a confirmation of the placed order on your registered email ID and phone number. Besides, we will further notify you once it is dispatched from our warehouse.",
  },
  {
    qus: "WHAT HAPPENS IF MY SHIPMENT DOES NOT GET DELIVERED ON TIME?",
    ans:
      "In case the order does not get delivered within 7-10 working days, you can write to us at:",
  },
];

const FaqList = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  return (
    <Card>
      <CardHeader id="headingOne">
        <h5 className="mb-0">
          <button
            className="btn btn-link"
            type="button"
            onClick={toggle}
            aria-expanded="true"
            aria-controls="collapseOne"
          >
            {faq.qus}
          </button>
        </h5>
      </CardHeader>
      <Collapse
        isOpen={isOpen}
        id="collapseOne"
        className="collapse"
        aria-labelledby="headingOne"
        data-parent="#accordionExample"
      >
        <div className="card-body">
          <p>{faq.ans}</p>
        </div>
      </Collapse>
    </Card>
  );
};

const FaqPage = () => {
  return (
    <>
      <CommonLayout parent="home" title="faq">
        <section className="faq-section section-b-space">
          <Container>
            <Row>
              <Col sm="12">
                <div
                  className="accordion theme-accordion"
                  id="accordionExample"
                >
                  {faqData.map((faq, i) => (
                    <FaqList faq={faq} key={i} />
                  ))}
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </CommonLayout>
    </>
  );
};

export default FaqPage;
