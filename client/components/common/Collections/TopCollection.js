import React, { useContext } from "react";
import { LoaderContext } from "../../../helpers/loaderContext";
import { useQuery } from "@tanstack/react-query";
import Api from "../../Api";
import { Row, Col, Container } from "reactstrap";
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

        {/* View More Button */}
        {!showLoader && data?.length > 8 && (
          <div className="text-center mt-4">
            <Link href="/collections/new%20and%20trending" passHref legacyBehavior>
              <a className="view-more-button">View More</a>
            </Link>
          </div>
        )}
      </Container>

      {/* Inline CSS Styling */}
      <style jsx>{`
        .view-more-button {
          display: inline-block;
          padding: 12px 30px;
          background: linear-gradient(135deg, #ff7e5f, #feb47b);
          color: white;
          font-weight: 600;
          text-transform: uppercase;
          border-radius: 30px;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .view-more-button:hover {
          background: linear-gradient(135deg, #feb47b, #ff7e5f);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
