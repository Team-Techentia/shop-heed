import React, { useState, useContext, useEffect } from "react";
import { TabList, TabPanel, Tabs, Tab } from "react-tabs";
import { Button, Col, Container, Row } from "reactstrap";
import Slider from "react-slick";
import ProductItem from "../product-box/ProductBox12";
import { Product3 } from "../../../services/script";
import PostLoader from "../PostLoader";
import Background from "../../../public/assets/images/parallax/23.jpg";
import Api from "../../Api";
import { LoaderContext } from "../../../helpers/loaderContext";
import Link from "next/link";

const TabContent = ({
  cartClass,
  spanClass,
}) => {


  const [product , setProduct] = useState([])
  const LoaderContextData = useContext(LoaderContext)
  const { catchErrors  } = LoaderContextData

  const fetchData = async ()=>{
    try {
     
      const res = await Api.getAllProduct()

      setProduct(res.data.data)
    } catch (error) {
      catchErrors(error)
    }
    finally {
 
    }
  }

  useEffect(() => {
    fetchData()
  }, []);

  return (
    <div>
      {!product || product.length === 0 ? (
        <>
          <PostLoader />
          <PostLoader />
          <PostLoader />
        </>
      ) : (
        <Slider {...Product3} className="product-3 product-m no-arrow">
          {product &&
           product
              .slice(0, 4)
              .map((product, index) => (
                <ProductItem
                  product={product}
                  spanClass={spanClass}
                  key={index}
                  cartclassName={cartClass}
                />
              ))}
        </Slider>
      )}
    </div>
  );
};

const TabCollection9 = ({ type, cartClass, spanClass , midBox }) => {
  const [activeTab, setActiveTab] = useState(type);

const data = []
const loading = false

  return (
  
  midBox ?  <section
  className="full-banner parallax tools-parallax-product marijuana-mini-banner tab-left ratio_square tools-grey border-box bg-size blur-up lazyloaded"
  style={{ backgroundImage: "url(" + Background + ")" }}
>
<Container>
      <Row>
        <Col lg="12" md="12" sm="12" xs="12" >
          <Col lg="6" md="12" sm="12" xs="12" style={{background:"rgb(255 253 253 / 64%)" , borderRadius:"5px"}} className="text-center py-5 ">
            <h2>Exclusive-Product</h2>
            <h4 style={{lineHeight:"25px"}}>Uplift your clothing style to comfort luxury with HEED to make you look attentive and flexible in your everyday clothing choices</h4>
            <Link href="/collections/all"> </Link>
            <Button className="btn btn-solid py-2">EXPLORE NOW</Button>
           
          </Col>
        </Col>
      </Row>
    </Container>
</section> :
  <section
  className="full-banner parallax tools-parallax-product marijuana-mini-banner tab-left ratio_square tools-grey border-box bg-size blur-up lazyloaded"
  style={{ backgroundImage: "url(" + Background + ")" }}
>
  <Container>
    <Row>
      <Col>
        <Tabs className="theme-tab">
          <div className="left-side">
            <div className="left-tab-title">
              <h2  style={{color:"white"}}>our shop</h2>
             
            </div>
            <TabList className="tabs tab-title">
              <Tab
                className={activeTab == type ? "active" : ""}
                onClick={() => setActiveTab(type)}
              >
                <a href={null}>Check Shirts</a>
              </Tab>
              <Tab
                className={activeTab == "marijuana" ? "active" : ""}
                onClick={() => setActiveTab("marijuana")}
              >
                <a href={null}>Plain Shirts</a>
              </Tab>
              <Tab
                className={activeTab == "marijuana" ? "active" : ""}
                onClick={() => setActiveTab("marijuana")}
              >
                <a href={null}>Printed Shirts</a>
              </Tab>
              <Tab
                className={activeTab == "marijuana" ? "active" : ""}
                onClick={() => setActiveTab("marijuana")}
              >
                <a href={null}>Stripe Shirts</a>
              </Tab>
            </TabList>
          </div>
          <div className="tab-content-cls">
            <TabPanel className="tab-content active default">
              <TabContent
                data={data}
                loading={loading}
                cartClass={cartClass}
                spanClass={spanClass}
                startIndex={0}
                endIndex={5}
              />
            </TabPanel>
            <TabPanel className="tab-content">
              <TabContent
                data={data}
                loading={loading}
                cartClass={cartClass}
                spanClass={spanClass}
                startIndex={5}
                endIndex={10}
              />
            </TabPanel>
            <TabPanel className="tab-content">
              <TabContent
                data={data}
                loading={loading}
                cartClass={cartClass}
                spanClass={spanClass}
                startIndex={10}
                endIndex={15}
              />
            </TabPanel>
            <TabPanel className="tab-content ">
              <TabContent
                data={data}
                loading={loading}
                cartClass={cartClass}
                spanClass={spanClass}
                startIndex={15}
                endIndex={20}
              />
            </TabPanel>
            <TabPanel className="tab-content">
              <TabContent
                data={data}
                loading={loading}
                cartClass={cartClass}
                spanClass={spanClass}
                startIndex={20}
                endIndex={25}
              />
            </TabPanel>
            <TabPanel className="tab-content">
              <TabContent
                data={data}
                loading={loading}
                cartClass={cartClass}
                spanClass={spanClass}
                startIndex={0}
                endIndex={10}
              />
            </TabPanel>
          </div>
        </Tabs>
      </Col>
    </Row>
  </Container>
</section>
  );
};

export default TabCollection9;
