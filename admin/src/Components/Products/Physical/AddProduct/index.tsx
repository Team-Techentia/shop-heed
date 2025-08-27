import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import { Fragment } from "react";
import {  Card, CardBody, Col, Container, Row } from "reactstrap";
import ProductCodePrice from "./ProductCodeAndPrice";


const AddProduct = () => {

  return (
    <Fragment>
      <CommonBreadcrumb title="Add Product" parent="Physical" />
      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              {/* <CommonCardHeader title="Add Product" /> */}
              <CardBody>
                <Row className="product-adding">
                  {/* <ProductImages /> */}
                  <Col xl="10">
                    <div className="needs-validation add-product-form" >
                      <ProductCodePrice />
                      
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default AddProduct;
