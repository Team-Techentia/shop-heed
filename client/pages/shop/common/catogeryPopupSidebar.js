import React, { useState, useContext, useEffect } from "react";
import { Col, Row, Button, Spinner } from "reactstrap";
import FilterContext from "../../../helpers/filter/FilterContext";
import ProductItem from "../../../components/common/product-box/ProductBox1";


const CatogeryPopupSidebar = ({ layoutList, product }) => {
  const filterContext = useContext(FilterContext);
  const selectedBrands = filterContext.selectedBrands;
  const selectedColor = filterContext.selectedColor;
  const selectedPrice = filterContext.selectedPrice;
  const selectedSize = filterContext.selectedSize;
  const [isLoading, setIsLoading] = useState(false);
  const [layout, setLayout] = useState(layoutList);

  useEffect(() => {}, [
    selectedBrands,
    selectedColor,
    selectedSize,
    selectedPrice,
  ]);

  return (
    <Col className="collection-content">
      <div className="page-main-content">
        <Row>
          <Col sm="12" >
            <div className="collection-product-wrapper">
              <div className={`product-wrapper-grid ${layout}`}>
                <Row>
                  {product &&
                    product.length >= 1 &&
                    product.map((product, index) => {
                      return (
                        <Col lg="3" md="4" sm="6" xs="6" key={index}>
                          <div className="product mt-2">
                            <div>
                              <ProductItem
                                des={true}
                                product={product}
                                cartClass="cart-info cart-wrap"
                              />
                            </div>
                          </div>
                        </Col>
                      );
                    })}
                </Row>
              </div>
              <div className="section-t-space">
                <div className="text-center">
                  <Row>
                    <Col xl="12" md="12" sm="12">
                      {product && product.hasMore && (
                        <Button className="load-more">
                          {isLoading && (
                            <Spinner animation="border" variant="light" />
                          )}
                          Load More
                        </Button>
                      )}
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Col>
  );
};

export default CatogeryPopupSidebar;
