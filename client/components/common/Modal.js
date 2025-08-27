import React, { useState, useEffect } from "react";
import {
  Col,
  Media,
  Row,
  Modal,
  ModalBody,
  Input,
  Form,
  Button,
} from "reactstrap";
import offerBanner from "../../public/assets/images/Offer-banner.png";

const ModalComponent = () => {
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  useEffect(() => {


    setTimeout(()=>{
      const isModalShown = sessionStorage.getItem("isModalShown");
      if (!isModalShown) {
        setModal(true);
        sessionStorage.setItem("isModalShown", "true");
      }
    },9000)
  }, []);

  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
      className="theme-modal modal-lg"
      centered
    >
      <div>
        <ModalBody className="modal1">
          <Row className="compare-modal">
            <Col lg="12">
              <div className="modal-bg">
                <Button
                  type="button"
                  className="btn-close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={toggle}
                >
                </Button>
                <div className="offer-content">
                  <Media
                    src={offerBanner.src}
                    className="img-fluid blur-up lazyload"
                    alt=""
                  />
                  <h2>Newsletter</h2>
                  <Form
                    action=""
                    className="auth-form needs-validation"
                    method="post"
                    id="mc-embedded-subscribe-form"
                    name="mc-embedded-subscribe-form"
                    target="_blank"
                  >
                    <div className="form-group mx-sm-3">
                      <Input
                        type="text"
                        className="form-control"
                        name="EMAIL"
                        id="mce-EMAIL"
                        placeholder="Enter your email"
                        required="required"
                      />
                      <Button
                        type="submit"
                        className="btn btn-solid"
                        id="mc-submit"
                      >
                        Subscribe
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
            </Col>
          </Row>
        </ModalBody>
      </div>
    </Modal>
  );
};

export default ModalComponent;
