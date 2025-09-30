import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Container, Row, Col, Media, Input } from "reactstrap";
import CartContext from "../../../../helpers/cart";
import cart from "../../../../public/assets/images/icon-empty-cart.png";
import bagg from "../../../../public/assets/images/bagg.png";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import useAuth from "../../../../components/protectRoutes/useAuth";
import { toast, Toaster } from "react-hot-toast";
import AuthModal from "../../../../components/headers/common/AuthModal";
import Api from "../../../../components/Api"; // make sure your API helper is correctly imported

const CartPage = () => {
  const router = useRouter();
  const context = useContext(CartContext);
  const cartItems = context.state;
  const total = context.cartTotal;
  const removeFromCart = context.removeFromCart;

  const isAuthenticated = useAuth(false);

  // User and modal states
  const [user, setUser] = useState({ emailOrPhone: "", name: "", email: "", phoneNumber: "" });
  const [error, setError] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);

  // Quantity handlers
  const decrementQuantity = (item, id, quantity) => {
    if (quantity === 1) return;
    context.updateQuantity(item, id, -1);
  };

  const incrementQuantity = (item, id, currentQuantity) => {
    if (currentQuantity >= item.quantity) return;
    context.updateQuantity(item, id, 1);
  };

  // Auth handlers
  const handleMobileNumberLogin = async () => {
    if (!user.emailOrPhone || user.emailOrPhone.length < 10) {
      setError("Enter a valid number");
      setTimeout(() => setError(""), 2000);
      return;
    }
    try {
      const res = await Api.checkMobile({ phoneNumber: user.emailOrPhone });
      if (res.data.message === "Phone number already exist") {
        setIsLoginModalOpen(false);
        setIsOTPModalOpen(true);
      } else {
        localStorage.setItem("phoneNumber", user.emailOrPhone);
        setIsLoginModalOpen(false);
        setIsRegisterModalOpen(true);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const handleRegister = async () => {
    if (!user.name || !user.email || !user.phoneNumber) {
      return toast.error("Please fill all required fields");
    }
    try {
      const response = await Api.checkUser({
        phoneNumber: user.phoneNumber,
        email: user.email,
      });
      if (response.data.message === "Successfully") {
        setIsRegisterModalOpen(false);
        setIsOTPModalOpen(true);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={{ marginBottom: "10px" }}>
      {cartItems && cartItems.length > 0 ? (
        <section>
          <Container>
            <Row>
              {cartItems.map((item, index) => {
                const product = item.product;
                const price = parseFloat(product.finalPrice) || parseFloat(product.price) || 0;
                const quantity = parseInt(item.quantity) || 0;
                const itemTotal = price * quantity;

                return (
                  <Col xl="3" lg="3" md="4" sm="6" xs="12" key={index}>
                    <div style={{ border: "1px solid #ddd", borderRadius: "8px", marginBottom: "20px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
                      <Link
                        href={`/product-details/${encodeURIComponent(
                          product.title.replaceAll(" ", "-").replaceAll("/", "-")
                        )}/${product._id}`}
                      >
                        <Media src={product.image[0]} alt={product.title} style={{ width: "100%", height: "auto" }} />
                      </Link>
                      <div style={{ padding: "10px" }}>
                        <Link
                          href={`/product-details/${encodeURIComponent(
                            product.title.replaceAll(" ", "-").replaceAll("/", "-")
                          )}/${product._id}`}
                        >
                          <span style={{ fontWeight: "bold", color: "#333" }}>{product.title}</span>
                        </Link>
                        <p>
                          Size: <span style={{ textTransform: "uppercase" }}>{product.size}</span>
                        </p>

                        <div className="qty-box my-1">
                          <div className="input-group">
                            <span className="input-group-prepend">
                              <button type="button" className="btn quantity-left-minus" onClick={() => decrementQuantity(item.product, product._id, item.quantity)}>
                                <RemoveIcon style={{ fontSize: "15px" }} />
                              </button>
                            </span>
                            <Input type="text" value={item.quantity} readOnly className="form-control input-number" />
                            <span className="input-group-prepend">
                              <button type="button" className="btn quantity-right-plus" onClick={() => incrementQuantity(item.product, product._id, item.quantity)}>
                                <AddIcon style={{ fontSize: "15px" }} />
                              </button>
                            </span>
                          </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                          <div>
                            <p style={{ fontWeight: "bold" }}>Price: ₹{Math.floor(price)}</p>
                            <p style={{ fontWeight: "bold" }}>Total: ₹{Math.floor(itemTotal)}</p>
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

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
              <h4><strong>Total Price: ₹{Math.floor(total)}</strong></h4>
              <button
                className="btn btn-solid"
                onClick={() => {
                  if (isAuthenticated) router.push("/page/account/checkout");
                  else setIsLoginModalOpen(true);
                }}
              >
                Check Out
              </button>
            </div>
          </Container>
        </section>
      ) : (
        <section className="cart-section section-b-space" style={{ display: "flex", justifyContent: "center" }}>
          <Container>
            <Row>
              <Col sm="12" className="text-center">
                <Media src={cart} className="img-fluid mb-4 mx-auto" alt="" />
                <h3><strong>Your Cart is Empty</strong></h3>
                <img src={bagg.src} style={{ width: "300px", height: "250px" }} alt="ordernotfound" />
                <Link href={"/"}>
                  <button className="btn btn-solid w-auto" style={{ backgroundColor: "white" }}>Continue Shopping</button>
                </Link>
              </Col>
            </Row>
          </Container>
        </section>
      )}

      <AuthModal
        isLoginModalOpen={isLoginModalOpen}
        isRegisterModalOpen={isRegisterModalOpen}
        isOTPModalOpen={isOTPModalOpen}
        setIsLoginModalOpen={setIsLoginModalOpen}
        setIsRegisterModalOpen={setIsRegisterModalOpen}
        setIsOTPModalOpen={setIsOTPModalOpen}
        closeAllModals={() => { setIsLoginModalOpen(false); setIsRegisterModalOpen(false); setIsOTPModalOpen(false); }}
        switchToRegister={() => { setIsLoginModalOpen(false); setIsRegisterModalOpen(true); }}
        switchToLogin={() => { setIsRegisterModalOpen(false); setIsLoginModalOpen(true); }}
        handleMobileNumberLogin={handleMobileNumberLogin}
        handleRegister={handleRegister}
        user={user}
        setUser={setUser}
        error={error}
      />

      <Toaster />
    </div>
  );
};

export default CartPage;
