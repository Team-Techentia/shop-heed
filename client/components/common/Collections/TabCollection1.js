import React, { useState, useContext, useEffect } from "react";
import {  Tabs, TabPanel } from "react-tabs";
import ProductItem from "../product-box/ProductBox1";
import CartContext from "../../../helpers/cart/index";
import { Container, Row } from "reactstrap";
import { WishlistContext } from "../../../helpers/wishlist/WishlistContext";
import { CompareContext } from "../../../helpers/Compare/CompareContext";
import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";
import Api from "../../Api";
import { LoaderContext } from "../../../helpers/loaderContext";


const TabContent = ({
  data,
  cartClass,
  backImage,
}) => {
  const context = useContext(CartContext);
  const wishListContext = useContext(WishlistContext);
  const compareContext = useContext(CompareContext);
  const curContext = useContext(CurrencyContext);
  const currency = curContext.state;
  const quantity = context.quantity;
  return (
    <Row className="no-slider">
    
      {
        (
          data && data.length>=1 &&
          data.map((product, i) => (
              <ProductItem
                key={i}
                product={product}
                symbol={currency.symbol}
                addCompare={() => compareContext.addToCompare(product)}
                addCart={() => context.addToCart(product, quantity)}
                addWishlist={() => wishListContext.addToWish(product)}
                cartClass={cartClass}
                backImage={backImage}
              />
            ))
        )
      }
    </Row>
  );
};

const SpecialProducts = ({
  
  fluid,
  designClass,
  cartClass,
  noTitle,
  title,
  inner,
  line,
  hrClass,
  backImage,
}) => {

  
  const [product,setProduct] = useState([])
  const LoaderContextData = useContext(LoaderContext)
  const { catchErrors , setLoading } = LoaderContextData


  const fetchData = async ()=>{
    try {
      setLoading(true)
      const res = await Api.getAllProduct()
      setProduct(res.data.data)
  
    } catch (error) {
      catchErrors(error)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, []);


  return (
    <div>
      <section className={designClass}>
        <Container fluid={fluid}>
          {noTitle ? (
            ""
          ) : (
            <div className={title}>
             
              <h2 className={inner}>Try our Combos</h2>
              {line ? (
                <div className="line"></div>
              ) : hrClass ? (
                <hr role="tournament6"></hr>
              ) : (
                ""
              )}
            </div>
          )}

          <Tabs className="theme-tab">
          
            <TabPanel>
              <TabContent
                data={product}
                startIndex={0}
                endIndex={8}
                cartClass={cartClass}
                backImage={backImage}
              />
            </TabPanel>
            <TabPanel>
              <TabContent
                data={product}
                startIndex={0}
                endIndex={8}
                cartClass={cartClass}
                backImage={backImage}
              />
            </TabPanel>
            <TabPanel>
              <TabContent
                data={product}
                startIndex={0}
                endIndex={8}
                cartClass={cartClass}
                backImage={backImage}
              />
            </TabPanel>
          </Tabs>
        </Container>
      </section>
    </div>
  );
};

export default SpecialProducts;
