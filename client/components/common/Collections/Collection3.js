import React, { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import ProductItems from "../product-box/ProductBox1";
import { Row, Col, Container } from "reactstrap";
import PostLoader from "../PostLoader";
import Api from "../../Api";
import { LoaderContext } from "../../../helpers/loaderContext"
import { useQuery } from "@tanstack/react-query";
// import ModalComponent from "../CommonModal";
import ModalComponentt from "../CommonModal";



const TopCollection = ({ dataContStart , dataContEnd, title, subtitle, designClass, noSlider, cartClass, productSlider, titleClass, noTitle, innerClass, inner, backImage }) => {
 
  const { catchErrors, setLoading , loading} = useContext(LoaderContext);
  const [product, setProduct] = useState([]);
  const [modal, setModal] = useState(false);
  const { data, isLoading, } = useQuery({
    queryKey: ['getNewProduct'],
    queryFn: async () => {
      const res = await Api.getNewProduct();
        const data =res.data.data.filter(item=>item)
      return data;
    },
    staleTime: 60000,
    cacheTime: 120000,
    refetchInterval: 60000,
    onError: (error) => {
      catchErrors(error);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  useEffect(() => {
    if (data) {
      setProduct(data);
    }
  }, [data]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  return (
    <>
      <section  style={{ padding:"30px 0px" }} className={`${designClass} bg-grey`}>
        {noSlider ? (
          <Container >
            <Row>
              <Col >
                {noTitle === "null" ? (
                  ""
                ) : (
                  <div className={innerClass}>
                    {subtitle ? <h4>{subtitle}</h4> : ""}
                    <h2 className={inner}>{title}</h2>
                    {titleClass ? (
                      <hr role="tournament6" />
                    ) : (
                      <div className="line">
                        <span></span>
                      </div>
                    )}
                  </div>
                )}

                {loading ? (
                  <div className="row mx-0 margin-default">
                    <div className="col-xl-3 col-lg-4 col-6">
                      <PostLoader />
                    </div>
                    <div className="col-xl-3 col-lg-4 col-6">
                      <PostLoader />
                    </div>
                    <div className="col-xl-3 col-lg-4 col-6">
                      <PostLoader />
                    </div>
                    <div className="col-xl-3 col-lg-4 col-6">
                      <PostLoader />
                    </div>
                  </div>
                ) : (
                 <><Slider {...productSlider} className="product-m no-arrow">
                    {product &&
                      product.slice(dataContStart ||0, dataContEnd||20).map((product, i) => (
                        <div key={i}>
                          <ProductItems product={product} title={title}  cartClass={cartClass} backImage={backImage}  />
                        </div>
                      ))}
                  </Slider>
                  <br></br>
                  {product.length > 39 && <Slider {...productSlider} className="product-m no-arrow">
                  {product &&
                    product.slice(dataContStart ||20, dataContEnd||40).map((product, i) => (
                      <div key={i}>
                        <ProductItems product={product} title={title}  cartClass={cartClass} backImage={backImage} />
                      </div>
                    ))}
                </Slider>
                }
                </> 
                )}
              </Col>
            </Row>
          </Container>
        ) : (
          <>
           
            <Container>
              <Row className="margin-default">
                { loading ? (
                  <div className="row margin-default">
                    <div className="col-xl-3 col-lg-4 col-6">
                      <PostLoader />
                    </div>
                    <div className="col-xl-3 col-lg-4 col-6">
                      <PostLoader />
                    </div>
                    <div className="col-xl-3 col-lg-4 col-6">
                      <PostLoader />
                    </div>
                    <div className="col-xl-3 col-lg-4 col-6">
                      <PostLoader />
                    </div>
                  </div>
                ) : (
                  product &&
                  product.slice(0, 20).map((product, index) => (
                    <Col xl="3" sm="6" xs="6" key={index}>
                      <div>
                        <ProductItems product={product} backImage={backImage}  title={title} cartClass={cartClass}  key={index} />
                      </div>
                    </Col>
                  ))
                )}
              </Row>
            </Container>
          </>
        )}
      </section>
      <ModalComponentt modal={modal} setModal={setModal} component={<h1>bdshd</h1>} />
    </>
  );
};

export default TopCollection;
