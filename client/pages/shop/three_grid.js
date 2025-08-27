import React from "react";
import CommonLayout from "../../components/shop/common-layout";
import { Row, Container } from "reactstrap";
import ProductList from "./common/productList";


const ThreeGrid = () => {
  return (
    <CommonLayout title="collection" parent="home">
      <section className="section-b-space">
        <Container>
          <Row>
            <ProductList
              colClass="col-lg-4 col-sm-6 col-grid-box"
              layoutList=""
              noSidebar={true}
            />
          </Row>
        </Container>
      </section>
    </CommonLayout>
  );
};

export default ThreeGrid;
