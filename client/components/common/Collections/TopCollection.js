import React, { useContext } from "react";
import { LoaderContext } from "../../../helpers/loaderContext";
import { useQuery } from "@tanstack/react-query";
import Api from "../../Api";
import { Row, Col, Container } from "reactstrap";
import PostLoader from "../PostLoader";
import ProductItems from "../product-box/ProductBox1";

export default function TopCollection({ dontRepeat, title, cartClass, backImage }) {
  const { loading } = useContext(LoaderContext);

  const { data, isLoading } = useQuery({
    queryKey: ["getNewProduct"],
    queryFn: async () => {
      const res = await Api.getNewProduct();
      const allData = res.data.data.filter((item) => item);
      return dontRepeat ? allData.filter((p) => p._id !== dontRepeat) : allData;
    },
    staleTime: 60000,
    cacheTime: 120000,
  });

  const showLoader = loading || isLoading;

  return (
    <div className="premium-collection">
      <Container>
        <Row className="margin-default">
          {showLoader ? (
            <div className="row margin-default">
              {[...Array(4)].map((_, i) => (
                <div className="col-xl-3 col-lg-4 col-6" key={i}>
                  <PostLoader />
                </div>
              ))}
            </div>
          ) : (
            data &&
            data.slice(0, 20).map((product, index) => (
              <Col xl="3" sm="6" xs="6" key={index}>
                <ProductItems
                  product={product}
                  backImage={backImage}
                  title={title}
                  cartClass={cartClass}
                />
              </Col>
            ))
          )}
        </Row>
      </Container>
    </div>
  );
}
