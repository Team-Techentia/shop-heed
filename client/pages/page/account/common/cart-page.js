import React, { useContext, useState } from "react";
import Link from "next/link";
import { Container, Row, Col, Media, Input } from "reactstrap";
import CartContext from "../../../../helpers/cart";
import cart from "../../../../public/assets/images/icon-empty-cart.png";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import bagg from "../../../../public/assets/images/bagg.png";
import useAuth from "../../../../components/protectRoutes/useAuth";

const CartPage = () => {
  const context = useContext(CartContext);
  const cartItems = context.state;
  console.log("Cart Items:", cartItems);
  const total = context.cartTotal;
  const removeFromCart = context.removeFromCart;

  const isAuthenticated = useAuth(false);
  console.log(isAuthenticated)
  
  const changeless = (item, id, quantity) => {
    if (quantity === 1) {
      return;
    }
    context.updateQuantity(item, id, -1);
  };
  
  const changeInc = (item, id, currentQuantity) => {
    // Check against the product's available stock, not current quantity
    if (currentQuantity >= item.quantity) {  // item.quantity is the available stock
      return;
    }
    context.updateQuantity(item, id, 1);
  };

  return (
    <div style={{ marginBottom: "10px" }}>
      {cartItems && cartItems.length > 0 ? (
        <section className="">
          <Container>
            <div>
              <Row>
                {cartItems.map((item, index) => {
                  const product = item.product;
                  const price = parseFloat(product.finalPrice) || parseFloat(product.price) || 0;
                  const quantity = parseInt(item.quantity) || 0;
                  const itemTotal = price * quantity;
                 
                  return (
                    <Col xl="3" lg="3" md="4" sm="6" xs="12" key={index}>
                      <div
                        style={{
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          marginBottom: "20px",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                          height: "auto",
                        }}
                      >
                        <Link
                          href={`/product-details/${encodeURIComponent(
                            product.title
                              .replaceAll(" ", "-")
                              .replaceAll("/", "-")
                          )}/${product._id}`}
                        >
                          <Media
                            src={product.image[0]}
                            alt={product.title}
                            style={{ width: "100%", height: "auto" }}
                          />
                        </Link>
                        <div style={{ padding: "10px" }}>
                          <Link
                            className="onelinediv1"
                            href={`/product-details/${encodeURIComponent(
                              product.title
                                .replaceAll(" ", "-")
                                .replaceAll("/", "-")
                            )}/${product._id}`}
                          >
                            <span
                              style={{
                                textDecoration: "none",
                                color: "#333",
                                fontWeight: "bold",
                              }}
                            >
                              {product.title}
                            </span>
                          </Link>
                          <p
                            style={{
                              textDecoration: "none",
                              color: "#333",
                              fontWeight: "bold",
                              margin: "5px 0px"
                            }}
                          >
                            Size: <span style={{textTransform:"uppercase"}}> {product.size}</span>
                          </p>

                          <div>
                            <div className="qty-box my-1">
                              <div className="input-group">
                                <span className="input-group-prepend">
                                  <button
                                    type="button"
                                    className="btn quantity-left-minus"
                                    onClick={() => {
                                      changeless(
                                        item.product,
                                        product._id,
                                        item.quantity
                                      );
                                    }}
                                    data-type="minus"
                                    data-field=""
                                  >
                                    <RemoveIcon style={{ fontSize: "15px" }} />
                                  </button>
                                </span>
                                <Input
                                  type="text"
                                  name="quantity"
                                  value={item.quantity}
                                  className="form-control input-number"
                                  readOnly
                                />
                                <span className="input-group-prepend">
                                  <button
                                    type="button"
                                    className="btn quantity-right-plus"
                                    onClick={() => {
                                      changeInc(
                                        item.product,
                                        product._id,
                                        item.quantity
                                      );
                                    }}
                                    data-type="plus"
                                    data-field=""
                                  >
                                    <AddIcon style={{ fontSize: "15px" }} />
                                  </button>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              marginTop: "10px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-end",
                            }}
                          >
                            <div>
                              <p
                                style={{
                                  textDecoration: "none",
                                  color: "#333",
                                  fontWeight: "bold",
                                  margin: "5px 0px",
                                }}
                              >
                                Price: ₹{Math.floor(price)}
                              </p>
                              <p
                                style={{
                                  textDecoration: "none",
                                  color: "#333",
                                  fontWeight: "bold",
                                  margin: "5px 0px",
                                  marginTop: "5px",
                                }}
                              >
                                Total: ₹{Math.floor(itemTotal)}
                              </p>
                            </div>

                            <div>
                              <button
                                onClick={() => removeFromCart(product._id)}
                                style={{
                                  marginTop: "10px",
                                  padding: "2px 4px",
                                  border: "1px solid black",
                                  backgroundColor: "#FFFFFF",
                                  color: "#000000",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>

              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h4 style={{ margin: "0", padding: "0" }}>
                  <strong> Total Price: ₹{Math.floor(total)}</strong>
                </h4>
                <Link href={isAuthenticated?`/page/account/checkout`:`/page/account/login`} className="btn btn-solid">
                  Check Out
                </Link>
              </div>
            </div>
          </Container>
        </section>
      ) : (
        <section
          className="cart-section section-b-space"
          style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Container>
            <Row>
              <Col sm="12">
                <div className="empty-cart-cls text-center">
                  <Media src={cart} className="img-fluid mb-4 mx-auto" alt="" />
                  <h3>
                    <strong>Your Cart is Empty</strong>
                  </h3>
                  <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <img
                      src={bagg.src}
                      style={{ width: "300px", height: "250px" }}
                      alt="ordernotfound"
                      className="bag-img-mobile"
                    />
                  </div>
                  <Link href={"/"}>
                    <button
                      style={{ backgroundColor: "white" }}
                      type="button"
                      className="btn btn-solid w-auto"
                    >
                      Continue Shopping
                    </button>
                  </Link>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      )}
      <div className="extra_space"></div>
    </div>
  );
};

export default CartPage;