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
        <div className="text-center mt-4">
          <Link href="/collections/new" passHref>
            <Button className="discount-btn">View More</Button>
          </Link>
        </div>
      </Container>

      {/* Stylish Black Button CSS */}
      <style jsx>{`
        .discount-btn {
          background: #000;
          color: #fff;
          font-weight: 600;
          font-size: 16px;
          padding: 12px 32px;
          border: none;
          border-radius: 40px;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .discount-btn:hover {
          background: linear-gradient(135deg, #000, #333);
          transform: translateY(-3px);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
        }
        .discount-btn:active {
          transform: scale(0.97);
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}
