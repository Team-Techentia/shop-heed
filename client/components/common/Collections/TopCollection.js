import React, { useContext } from "react";
import { LoaderContext } from "../../../helpers/loaderContext";
import { useQuery } from "@tanstack/react-query";
import Api from "../../Api";
import { Row, Col, Container, Button } from "reactstrap";
import Link from "next/link";
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

  // Show only 8 products initially
  const productsToShow = data?.slice(0, 8);

  return (
    <div className="premium-collection">
      <Container>
        <Row className="margin-default">
          {showLoader ? (
            [...Array(4)].map((_, i) => (
              <Col xl="3" lg="4" sm="6" xs="12" key={i}>
                <PostLoader />
              </Col>
            ))
          ) : (
            productsToShow?.map((product, index) => (
              <Col xl="3" lg="4" sm="6" xs="6" key={index}>
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

        {/* Link to full product page */}
        {data && data.length > 8 && (
          <div className="text-center mt-4">
            <Link href="/collections/new" passHref>
              <Button color="primary">View More</Button>
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
}
