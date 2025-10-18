import React, { useContext } from "react";
import Link from "next/link";
import { Container, Row, Col, Media, Input } from "reactstrap";
import CartContext from "../../../../helpers/cart";
import cart from "../../../../public/assets/images/icon-empty-cart.png";
import bagg from "../../../../public/assets/images/bagg.png";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useRouter } from "next/router";

const CartPage = () => {
  const router = useRouter();
  const cartContext = useContext(CartContext);
  const cartItems = cartContext.state;
  const total = cartContext.cartTotal;
  const removeFromCart = cartContext.removeFromCart;

  // Quantity handlers
  const decrementQuantity = (item, id, quantity) => {
    if (quantity === 1) return;
    cartContext.updateQuantity(item, id, -1);
  };

  const incrementQuantity = (item, id, currentQuantity) => {
    if (currentQuantity >= item.quantity) return;
    cartContext.updateQuantity(item, id, 1);
  };

  // Checkout redirect
  const handleCheckout = () => {
    router.push("/page/account/checkout");
  };

  return (
    <div style={{ marginBottom: "10px" }}>
      {cartItems && cartItems.length > 0 ? (
        <section>
          <Container>
            <Row>
              {cartItems.map((item, index) => {
                const product = item.product;
                const price =
                  parseFloat(product.finalPrice) ||
                  parseFloat(product.price) ||
                  0;
                const quantity = parseInt(item.quantity) || 0;
                const itemTotal = price * quantity;

                return (
                  <Col
                    xl="3"
                    lg="3"
                    md="4"
                    sm="6"
                    xs="12"
                    key={index}
                    className="mb-4"
                  >
                    <div
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        overflow: "hidden",
                        backgroundColor: "#fff",
                      }}
                    >
                      <Link
                        href={`/product-details/${encodeURIComponent(
                          product.title.replaceAll(" ", "-").replaceAll("/", "-")
                        )}/${product._id}`}
                      >
                        <Media
                          src={product.image[0]}
                          alt={product.title}
                          style={{
                            width: "100%",
                            height: "auto",
                            objectFit: "cover",
                          }}
                        />
                      </Link>

                      <div style={{ padding: "10px" }}>
                        <Link
                          href={`/product-details/${encodeURIComponent(
                            product.title.replaceAll(" ", "-").replaceAll("/", "-")
                          )}/${product._id}`}
                        >
                          <span
                            style={{
                              fontWeight: "bold",
                              color: "#333",
                              display: "block",
                            }}
                          >
                            {product.title}
                          </span>
                        </Link>

                        <p className="mb-1">
                          Size:{" "}
                          <span style={{ textTransform: "uppercase" }}>
                            {product.size}
                          </span>
                        </p>

                        <div className="qty-box my-1">
                          <div className="input-group">
                            <span className="input-group-prepend">
                              <button
                                type="button"
                                className="btn quantity-left-minus"
                                onClick={() =>
                                  decrementQuantity(
                                    item.product,
                                    product._id,
                                    item.quantity
                                  )
                                }
                              >
                                <RemoveIcon style={{ fontSize: "15px" }} />
                              </button>
                            </span>

                            <Input
                              type="text"
                              value={item.quantity}
                              readOnly
                              className="form-control input-number text-center"
                              style={{ maxWidth: "50px" }}
                            />

                            <span className="input-group-prepend">
                              <button
                                type="button"
                                className="btn quantity-right-plus"
                                onClick={() =>
                                  incrementQuantity(
                                    item.product,
                                    product._id,
                                    item.quantity
                                  )
                                }
                              >
                                <AddIcon style={{ fontSize: "15px" }} />
                              </button>
                            </span>
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "10px",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <p style={{ fontWeight: "bold" }}>
                              Price: ₹{Math.floor(price)}
                            </p>
                            <p style={{ fontWeight: "bold" }}>
                              Total: ₹{Math.floor(itemTotal)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(product._id)}
                            style={{
                              padding: "4px 8px",
                              border: "1px solid black",
                              backgroundColor: "#fff",
                              color: "#000",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontWeight: "500",
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
                alignItems: "center",
              }}
            >
              <h4>
                <strong>Total Price: ₹{Math.floor(total)}</strong>
              </h4>
              <button
                className="btn btn-solid"
                style={{
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontWeight: "600",
                }}
                onClick={handleCheckout}
              >
                Place Order
              </button>
            </div>
          </Container>
        </section>
      ) : (
        <section
          className="cart-section section-b-space"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Container>
            <Row>
              <Col sm="12" className="text-center">
                <Media src={cart} className="img-fluid mb-4 mx-auto" alt="" />
                <h3>
                  <strong>Your Cart is Empty</strong>
                </h3>
                <img
                  src={bagg.src}
                  style={{ width: "300px", height: "250px" }}
                  alt="ordernotfound"
                />
                <Link href={"/"}>
                  <button
                    className="btn btn-solid w-auto"
                    style={{ backgroundColor: "white" }}
                  >
                    Continue Shopping
                  </button>
                </Link>
              </Col>
            </Row>
          </Container>
        </section>
      )}
    </div>
  );
};

export default CartPage;