import React, { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import ProductItems from "../product-box/ProductBox1";
import { Row, Col, Container } from "reactstrap";
import PostLoader from "../PostLoader";
import Api from "../../Api";
import { LoaderContext } from "../../../helpers/loaderContext";
import { useQuery } from "@tanstack/react-query";

const TopShelfCollection = ({ 
  title, 
  subtitle, 
  designClass, 
  productSlider, 
  cartClass,
  showTitle = true,
  maxProducts = 20,
  backgroundImage = true 
}) => {
  const { catchErrors, setLoading, loading } = useContext(LoaderContext);
  const [products, setProducts] = useState([]);

  // Slider settings optimized for top shelf products
  const topShelfSliderSettings = {
    infinite: true,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    dots: false,
    arrows: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
          dots: true
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true
        }
      }
    ]
  };

  const { data, isLoading } = useQuery({
    queryKey: ['getTopShelfProducts'],
    queryFn: async () => {
      const res = await Api.getNewProduct();
      // Filter and sort for top shelf products - you can customize this logic
      const topProducts = res.data.data
        .filter(item => item && item.rating >= 4) // Only high-rated products
        .sort((a, b) => (b.rating || 0) - (a.rating || 0)) // Sort by rating
        .slice(0, maxProducts);
      return topProducts;
    },
    staleTime: 300000, // 5 minutes
    cacheTime: 600000, // 10 minutes
    refetchInterval: 300000, // Refetch every 5 minutes
    onError: (error) => {
      catchErrors(error);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  useEffect(() => {
    if (data) {
      setProducts(data);
    }
  }, [data]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  const LoadingGrid = () => (
    <div className="row mx-0">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="col-xl-3 col-lg-4 col-6">
          <PostLoader />
        </div>
      ))}
    </div>
  );

  return (
    <section 
      className={`top-shelf-collection ${designClass || 'section-b-space'}`}
      style={{ padding: "50px 0px", background: "#f8f9fa" }}
    >
      <Container>
        <Row>
          <Col>
            {showTitle && (
              <div className="section-title text-center mb-5">
                {subtitle && (
                  <h4 className="subtitle" style={{ 
                    color: "#666", 
                    fontSize: "14px", 
                    fontWeight: "500",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    marginBottom: "10px"
                  }}>
                    {subtitle}
                  </h4>
                )}
                <h2 className="main-title" style={{ 
                  color: "#222", 
                  fontSize: "36px", 
                  fontWeight: "700",
                  marginBottom: "20px"
                }}>
                  {title}
                </h2>
                <div className="title-divider" style={{
                  width: "60px",
                  height: "3px",
                  background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
                  margin: "0 auto",
                  borderRadius: "2px"
                }}></div>
              </div>
            )}

            {loading ? (
              <LoadingGrid />
            ) : products && products.length > 0 ? (
              <div className="top-shelf-slider-wrapper">
                <Slider 
                  {...(productSlider || topShelfSliderSettings)} 
                  className="top-shelf-slider product-slider"
                >
                  {products.map((product, index) => (
                    <div key={product.id || index} className="product-slide-item">
                      <div style={{ padding: "0 10px" }}>
                        <ProductItems 
                          product={product} 
                          title={title}
                          cartClass={cartClass || "cart-info cart-wrap"}
                          backImage={backgroundImage}
                        />
                      </div>
                    </div>
                  ))}
                </Slider>
                
                {/* Show featured badge for top products */}
                <div className="featured-badge text-center mt-4">
                  <span className="badge" style={{
                    background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
                    color: "white",
                    padding: "8px 20px",
                    borderRadius: "25px",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "1px"
                  }}>
                    ⭐ Premium Collection
                  </span>
                </div>
              </div>
            ) : (
              <div className="no-products text-center py-5">
                <h4>No top shelf products available at the moment</h4>
                <p>Please check back later for our premium collection.</p>
              </div>
            )}
          </Col>
        </Row>
      </Container>
      
      <style jsx>{`
        .top-shelf-collection .slick-arrow {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        
        .top-shelf-collection .slick-arrow:hover {
          background: white;
          transform: scale(1.1);
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        
        .top-shelf-collection .slick-prev {
          left: -50px;
        }
        
        .top-shelf-collection .slick-next {
          right: -50px;
        }
        
        .top-shelf-collection .slick-dots {
          bottom: -50px;
        }
        
        .top-shelf-collection .slick-dots li button:before {
          color: #ff6b6b;
          font-size: 12px;
        }
        
        .top-shelf-collection .slick-dots li.slick-active button:before {
          color: #4ecdc4;
        }
        
        @media (max-width: 768px) {
          .top-shelf-collection .slick-prev,
          .top-shelf-collection .slick-next {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default TopShelfCollection;