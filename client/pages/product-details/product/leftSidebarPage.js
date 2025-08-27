import React, { useState, useEffect, useContext, useRef } from "react";
import ImageZoom from "../common/image-zoom";
import DetailsWithPrice from "../common/detail-price";
import StickyBox from "react-sticky-box";
import { Container, Row, Col } from "reactstrap";
import Api from "../../../components/Api";
import { useRouter } from "next/router";
import { LoaderContext } from "../../../helpers/loaderContext";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import { getCookie } from "../../../components/cookies";
import Slider from "react-slick";
import { useMediaQuery } from "@mui/material";
import ModalComponentt from "../../../components/common/CommonModal";
import { Height } from "@mui/icons-material";
const LeftSidebarPage = ({ pathId, setTopTitle }) => {
  const isSmallScreen = useMediaQuery("(max-width: 995px)");
  const token = getCookie("ectoken");
  const router = useRouter();
  const [productData, setProductData] = useState({});
  const [sameProductData, setSameProductData] = useState([]);
  const [stock, setStock] = useState("In Stock");
  const [quantity, setQuantity] = useState(1);
  const [imageShow, setImageShow] = useState(0);
  const sliderRef = useRef(null);
  const [comments, setComments] = useState([]);
  const LoaderContextData = useContext(LoaderContext);
  const { catchErrors, setLoading } = LoaderContextData;
  const [showReviewSection, setShowReviewSection] = useState(true);
  const [reviewIdUser, setReviewIdUser] = useState("");
  const [show, setShow] = useState(false);
  const [images, setImages] = useState([]);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current) => setImageShow(current),
  };

  useEffect(() => {
    fetchData();
    setStock("In Stock");
    setQuantity(1);
  }, [router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await Api.getProductById(pathId);
      const response = await Api.getAllSameProductById(res.data.data.productId);
      if (res.data.data.quantity <= 0) {
        setStock("Out of Stock");
      } else {
        setStock("In Stock");
      }
      setSameProductData(response.data.data);
      setProductData(res.data.data);
      setTopTitle(res.data.data.title);
    } catch (error) {
      catchErrors(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      checkReviewInListing();
    }
  }, [token]);

  const checkReviewInListing = async () => {
    try {
      const res = await Api.checkReviewInListing(productData.productId, token);
      if (
        res.data.message === "You have already given a review for this listing"
      ) {
        setShowReviewSection(false);
        setReviewIdUser(res.data.reviewIdUser);
      }
    } catch (error) {}
  };

  const handleThumbnailClick = (index) => {
    setImageShow(index);
    sliderRef.current.slickGoTo(index);
  };

  useEffect(() => {
      console.log("images---->", images);
      
  }, [images])
  // const [modal, setModal] = useState(false);
  return (
    <section style={{ paddingTop: "20px" }} className="">
      <div className="collection-wrapper">
        <Container>
          <Row>
            <Col lg="12" sm="12" xs="12">
              <Container fluid={true}>
                <Row>
                  <Col xl="12" className="filter-col">
                    <div className="filter-main-btn mb-2"></div>
                  </Col>
                </Row>
                {!productData ? (
                  "loading"
                ) : (
                  <Row>
                    <Col lg="7" className="">
                      <StickyBox offsetTop={20} offsetBottom={10}>
                        <Row className="product-page-image">
                          {isSmallScreen ? (
                            ""
                          ) : (
                            <Col lg="2">
                              <div
                                style={{
                                  display: "flex",
                                  gap: "5px",
                                  flexWrap: "wrap",
                                }}
                              >
                                {productData &&
                                  productData.image &&
                                  productData.image
                                    .slice(0, 5)
                                    .map((image, i) => (
                                      <div
                                        key={i}
                                        style={{
                                          cursor: "pointer",
                                          border:
                                            imageShow === i
                                              ? "2px solid #000"
                                              : "none",
                                        }}
                                        onClick={() => {
                                          handleThumbnailClick(i);
                                          setImages((prevImages) => {
                                            let imageSet = new Set(prevImages); // Ensure uniqueness
                                            productData.image.forEach((img) => imageSet.add(img)); // Add new images
                                          
                                            let updatedImages = Array.from(imageSet); // Convert Set back to an array
                                          
                                            // Ensure the first image from productData.image is always at index 0
                                            if (productData.image.length > 0) {
                                              const firstImage = productData.image[0]; 
                                              updatedImages = [image, ...updatedImages.filter(img => img !== image)];
                                            }
                                          
                                            return updatedImages;
                                          });                                          
                                          
                                          setShow(!show);
                                        }}
                                        className="images-images"
                                      >
                                        <ImageZoom image={image} />
                                      </div>
                                    ))}
                              </div>
                            </Col>
                          )}

                          <Col
                            style={{
                              padding: "0px 20px 0px 0px ",
                              margin: "0px",
                            }}
                            lg="10"
                          >
                            <Slider ref={sliderRef} {...settings}>
                              {productData &&
                                productData.image &&
                                productData.image.map((image, i) => (
                                  <div key={i}>
                                    <ImageZoom
                                      onClick={() => {
                                      handleThumbnailClick(i);
                                      setImages((prevImages) => {
                                        prevImages.filter((prev) => image != prev);
                                        let imageSet = new Set(prevImages); // Ensure uniqueness
                                        productData.image.forEach((img) => imageSet.add(img)); // Add new images
                                      
                                        let updatedImages = Array.from(imageSet); // Convert Set back to an array
                                      
                                        // Ensure the first image from productData.image is always at index 0
                                        if (productData.image.length > 0) {
                                          const firstImage = productData.image[0]; 
                                          updatedImages = [image, ...updatedImages.filter(img => img !== image)];
                                        }
                                      
                                        return updatedImages;
                                      });                                          
                                      
                                      setShow(!show);
                                    }}
                                      // onClick={() => setModal(!modal)}
                                      maxHeight={"650px"}
                                      image={image}
                                    />
                                  </div>
                                ))}
                            </Slider>
                          </Col>
                        </Row>
                      </StickyBox>
                    </Col>

                    <Col
                      style={{ padding: "0px", margin: "0px" }}
                      lg="5"
                      className="rtl-text product-ps"
                    >
                      {productData && (
                        <DetailsWithPrice
                          item={productData}
                          sameProductData={sameProductData}
                          stock={stock}
                          setStock={setStock}
                          quantity={quantity}
                          setQuantity={setQuantity}
                        />
                      )}
                    </Col>
                  </Row>
                )}
              </Container>
            </Col>
          </Row>

          {productData && productData.productId && (
            <>
              <CommentList
                reviewIdUser={reviewIdUser}
                id={productData.productId}
                comments={comments}
                setComments={setComments}
              />{" "}
              {showReviewSection && (
                <CommentForm
                  productId={productData.productId}
                  comments={comments}
                  setComments={setComments}
                />
              )}
            </>
          )}
        </Container>
      </div>
    
      <ModalComponentt modal={show} setModal={setShow} images={images} />
        {/* /> */}
    </section>
  );
};

export default LeftSidebarPage;
