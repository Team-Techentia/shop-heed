import React, { useState, useContext } from "react";
import Link from "next/link";
import { Row, Col, Media, Modal, ModalBody } from "reactstrap";
import CartContext from "../../../helpers/cart";
const ProductItem = ({
  product,
  spanClass,
}) => {

  const cartContext = useContext(CartContext);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  let RatingStars = [];
  let rating = 5;
  for (var i = 0; i < rating; i++) {
    RatingStars.push(<i className="fa fa-star"  style={{color:"#ffa200"}} key={i}></i>);
  }
  return (
    <div className="product-box product-wrap">
      <div className="img-wrapper">
        <div className="lable-block">
          {product.new === "true" ? <span className="lable3">new</span> : ""}
          {product.sale === "true" ? (
            <span className="lable4">on sale</span>
          ) : (
            ""
          )}
        </div>
        <div className="front">
          <a href={null}>
            <Media
              alt=""
              src={product.image[0]}
              className="img-fluid blur-up lazyload bg-img"
            />
          </a>
        </div>
        <div className="cart-info cart-wrap">
          <button style={{height:"35px"}} onClick={()=>[
             cartContext.addToCart(product, product._id, 1)
          ]} title="Add to cart">
            <i className="fa fa-shopping-cart"></i>
            {spanClass ? <span>Add to cart</span> : ""}
          </button>
        </div>
      </div>
   <Link href={`/product-details/${encodeURIComponent(product.title
    .replaceAll(" ", "-")
    .replaceAll("/", "-")
  )}/${product._id}`}> 
   <div className="product-info">
        <div className="rating">{RatingStars}</div>
        <h2 >{product.title}</h2>
        <h4>
        ₹
          {product.finalPrice}
          <del>
            <span className="money">
           ₹
              {product.price }
            </span>
          </del>
        </h4>
      </div></Link>
      <Modal
        isOpen={modal}
        toggle={toggle}
        className="quickview-modal"
        size="lg"
        centered>
        <ModalBody>
          <Row>
            <Col lg="6" xs="12">
              <div className="quick-view-img">
                <Media
                  src={product.image[0]}
                  alt=""
                  className="img-fluid"
                />
              </div>
            </Col>
           
          </Row>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default ProductItem;
