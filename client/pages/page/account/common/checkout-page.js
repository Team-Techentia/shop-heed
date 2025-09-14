import React, { useContext, useState, useEffect } from "react";
import { Container, Form, Row, Col } from "reactstrap";
import CartContext from "../../../../helpers/cart";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Api from "../../../../components/Api";
import { getCookie } from "../../../../components/cookies";
import OpenModal from "../openModal";
import { LoaderContext } from "../../../../helpers/loaderContext";

const CheckoutPage = ({ isLogin }) => {
  const cartContext = useContext(CartContext);
  const cartItems = cartContext.state;
  const cartTotal = cartContext.cartTotal;
  const [payment, setPayment] = useState("online");
  const [mobileNumber, setMobileNumber] = useState();
  const token = getCookie("ectoken");
  const [isOpenTOTP, setIsOpenTOTP] = useState(false);
  const [error, setError] = useState("");

  // Coupon/Promocode related states
  const [availablePromocodes, setAvailablePromocodes] = useState([]);
  const [enteredPromocode, setEnteredPromocode] = useState("");
  const [appliedPromocode, setAppliedPromocode] = useState(null);
  const [promocodeDiscount, setPromocodeDiscount] = useState(0);
  const [promocodeError, setPromocodeError] = useState("");
  const [promocodeLoading, setPromocodeLoading] = useState(false);
  const [showPromocodeList, setShowPromocodeList] = useState(false);
  const [promocodeSuccess, setPromocodeSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const LoaderContextData = useContext(LoaderContext);
  const { catchErrors, setLoading } = LoaderContextData;
  const router = useRouter();

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // Calculate final total after promocode discount
  const finalTotal = Math.max(0, cartTotal - promocodeDiscount); // Ensure total doesn't go negative

  // Fetch active promocodes on component mount
  useEffect(() => {
    const fetchActivePromocodes = async () => {
      try {
        const response = await Api.getAllPromocodes();
        if (response.data && response.data.success) {
          setAvailablePromocodes(response.data.promocodes || []);
        }
      } catch (error) {
        console.error("Error fetching promocodes:", error);
      }
    };

    fetchActivePromocodes();
  }, []);

  const checkhandle = (value) => {
    setPayment(value);
  };

  // Apply promocode functionality
  const handleApplyPromocode = async (codeFromList = null) => {
    const promocodeValue = codeFromList || enteredPromocode.trim();

    if (!promocodeValue) {
      setPromocodeError("Please enter a promocode");
      setTimeout(() => setPromocodeError(""), 3000);
      return;
    }

    setPromocodeLoading(true);
    setPromocodeError("");
    setPromocodeSuccess("");

    try {
      // Validate promocode first
      const validateResponse = await Api.validatePromocode({
        code: promocodeValue,
        orderTotal: cartTotal
      }, token);

      if (validateResponse.data && validateResponse.data.success) {
        // Apply promocode
        const applyResponse = await Api.applyPromocode({
          code: promocodeValue,
          orderTotal: cartTotal
        }, token);

        if (applyResponse.data && applyResponse.data.success) {
       
          setPromocodeDiscount(applyResponse.data.data.discountValue);
          console.log('Setting discount to:',);
          setEnteredPromocode(applyResponse.data.data.code);
          setShowPromocodeList(false);
          setPromocodeSuccess(`Promocode ${promocodeValue} applied successfully!`);
          setTimeout(() => setPromocodeSuccess(""), 5000);
        } else {
          setPromocodeError(applyResponse.data?.message || "Failed to apply promocode");
          setTimeout(() => setPromocodeError(""), 3000);
        }
      } else {
        setPromocodeError(validateResponse.data?.message || "Invalid promocode");
        setTimeout(() => setPromocodeError(""), 3000);
      }
    } catch (error) {
      setPromocodeError(
        error.response?.data?.message || "Error applying promocode"
      );
      setTimeout(() => setPromocodeError(""), 3000);
    } finally {
      setPromocodeLoading(false);
    }
  };

  // Remove applied promocode
  const handleRemovePromocode = () => {
    setAppliedPromocode(null);
    setPromocodeDiscount(0);
    setEnteredPromocode("");
    setPromocodeError("");
    setPromocodeSuccess("");
  };

  const handlePayment = async (orderId) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
      amount: Math.floor(finalTotal) * 100, // Use final total after discount - CORRECTED
      currency: "INR",
      name: "Heed Attentive",
      order_id: orderId,
      handler: async function (response) {
        const paymentVerification = await Api.verifyPayment(
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            payment: "online",
          },
          token
        );
        if (paymentVerification.data.success) {
          cartContext.clearCart();
          router.push("/page/order-success");
        } else {
          alert("Payment verification failed");
        }
      },
      theme: {
        color: "#3399cc",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const onSubmit = async (data) => {
    if (data !== "") {
      const orderData = {
        items: cartItems,
        orderTotal: Math.floor(finalTotal), // Use final total after discount - ALREADY CORRECT
        originalTotal: Math.floor(cartTotal), // Include original total for reference
        paymentMethod: payment,
        appliedPromocode: appliedPromocode, // Include promocode in order data
        promocodeDiscount: Math.floor(promocodeDiscount), // Include discount amount
        customerDetails: {
          ...data,
          country: selectedCountry ? selectedCountry.name : "",
          state: selectedState ? selectedState.name : "",
          city: selectedCity ? selectedCity.name : "",
        },
      };

      try {
        setLoading(true);
        const createOrder = await Api.createOrder(orderData, token);
        if (createOrder.data.success) {
          if (payment === "cod") {
            cartContext.clearCart();
            router.push("/page/order-success");
          } else {
            handlePayment(createOrder.data.orderId);
          }
        } else {
          alert("Order creation failed");
        }
      } catch (error) {
        catchErrors(error);
      } finally {
        setLoading(false);
      }
    } else {
      errors.showMessages();
    }
  };

  useEffect(() => {
    if (selectedCountry) {
      setSelectedState(null);
      setSelectedCity(null);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      setSelectedCity(null);
    }
  }, [selectedState]);

  const handleMobileNumberLogin = async () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      setError("Enter a valid Number");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }
    try {
      const res = await Api.checkMobile({ phoneNumber: mobileNumber });
      if (res.data.message === "Phone number already exist") {
        return setIsOpenTOTP(true);
      }
      localStorage.setItem("phoneNumber", mobileNumber);
      router.push("/page/account/register");
      return;
    } catch (error) {
      catchErrors(error);
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return toast.error(error.response.data.message);
      }
    }
  };

  return (
    <>
      <section className="section-b-space checkout-sec">
        <Container>
          <div className="checkout-page">
            <div className="checkout-form">
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col lg="6" sm="12" xs="12">
                    {isLogin ? (
                      ""
                    ) : (
                      <>
                        <div>
                          <div className="checkout-title">
                            <h3>Login</h3>
                          </div>
                        </div>
                        <br />
                        <div className="row check-out">
                          <div className="form-group col-md-7 col-sm-7 col-xs-12 mb-2">
                            <h4 className="field-label">Phone</h4>
                            <input
                              type="number"
                              name="phone"
                              value={mobileNumber}
                              onChange={(e) => {
                                const { value } = e.target;
                                if (value.length > 10) {
                                  return;
                                } else {
                                  setMobileNumber(value);
                                }
                              }}
                            />
                            <div className="mt-2" style={{ color: "red" }}>
                              {" "}
                              {error}
                            </div>
                          </div>
                          <div className="form-group col-md-5 col-sm-5 col-xs-12 mt-4 pt-2">
                            <div className="text-end">
                              <button
                                onClick={handleMobileNumberLogin}
                                type="button"
                                className="btn-solid btn"
                              >
                                Send OTP
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    <div className="checkout-title">
                      <h3>Address Details</h3>
                    </div>
                    {
                      <div className="row check-out mb-5">
                        <div className="form-group col-md-6 col-sm-6 col-xs-12">
                          <h4 className="field-label">First Name</h4>
                          <input
                            type="text"
                            className={`${errors.first_name ? "error_border" : ""
                              }`}
                            name="first_name"
                            {...register("first_name", { required: true })}
                          />
                          <span className="error-message">
                            {errors.first_name && "First name is required"}
                          </span>
                        </div>
                        <div className="form-group col-md-6 col-sm-6 col-xs-12">
                          <h4 className="field-label">Last Name</h4>
                          <input
                            type="text"
                            className={`${errors.last_name ? "error_border" : ""
                              }`}
                            name="last_name"
                            {...register("last_name", { required: true })}
                          />
                          <span className="error-message">
                            {errors.last_name && "Last name is required"}
                          </span>
                        </div>
                        <div className="form-group col-md-6 col-sm-6 col-xs-12">
                          <h4 className="field-label">Phone</h4>
                          <input
                            type="text"
                            name="phone"
                            className={`${errors.phone ? "error_border" : ""}`}
                            {...register("phone", { pattern: /\d+/ })}
                          />
                          <span className="error-message">
                            {errors.phone && "Please enter number for phone."}
                          </span>
                        </div>
                        <div className="form-group col-md-6 col-sm-6 col-xs-12">
                          <h4 className="field-label">Email Address</h4>
                          <input
                            className={`${errors.email ? "error_border" : ""}`}
                            type="text"
                            name="email"
                            {...register("email", {
                              required: true,
                              pattern: /^\S+@\S+$/i,
                            })}
                          />
                          <span className="error-message">
                            {errors.email &&
                              "Please enter a valid email address ."}
                          </span>
                        </div>
                        <div className="form-group col-md-12 col-sm-12 col-xs-12">
                          <h4 className="field-label">Country</h4>
                          <Select
                            options={Country.getAllCountries()}
                            getOptionLabel={(options) => options["name"]}
                            getOptionValue={(options) => options["name"]}
                            value={selectedCountry}
                            onChange={(item) => setSelectedCountry(item)}
                          />
                        </div>
                        <div className="form-group col-md-12 col-sm-12 col-xs-12">
                          <h4 className="field-label">State</h4>
                          <Select
                            options={
                              selectedCountry
                                ? State.getStatesOfCountry(
                                  selectedCountry.isoCode
                                )
                                : []
                            }
                            getOptionLabel={(options) => options["name"]}
                            getOptionValue={(options) => options["name"]}
                            value={selectedState}
                            onChange={(item) => setSelectedState(item)}
                          />
                        </div>
                        <div className="form-group col-md-12 col-sm-12 col-xs-12">
                          <h4 className="field-label">City</h4>
                          <Select
                            options={
                              selectedState
                                ? City.getCitiesOfState(
                                  selectedState.countryCode,
                                  selectedState.isoCode
                                )
                                : []
                            }
                            getOptionLabel={(options) => options["name"]}
                            getOptionValue={(options) => options["name"]}
                            value={selectedCity}
                            onChange={(item) => setSelectedCity(item)}
                          />
                        </div>
                        <div className="form-group col-md-12 col-sm-12 col-xs-12">
                          <h4 className="field-label">Address</h4>
                          <input
                            className={`${errors.address ? "error_border" : ""}`}
                            type="text"
                            name="address"
                            {...register("address", {
                              required: true,
                              min: 20,
                              max: 120,
                            })}
                            placeholder="Street address"
                          />
                          <span className="error-message">
                            {errors.address && "Please write your address."}
                          </span>
                        </div>
                        <div className="form-group col-md-12 col-sm-6 col-xs-12">
                          <h4 className="field-label">Postal Code</h4>
                          <input
                            type="text"
                            name="pincode"
                            className={`${errors.pincode ? "error_border" : ""}`}
                            {...register("pincode", { pattern: /\d+/ })}
                          />
                          <span className="error-message">
                            {errors.pincode && "Required integer"}
                          </span>
                        </div>
                      </div>
                    }
                  </Col>
                  <Col lg="6" sm="12" xs="12">
                    {cartItems && cartItems.length > 0 ? (
                      <div className="checkout-details">
                        <div>
                          <div
                            className="title-box"
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <h4
                              style={{ fontWeight: "700" }}
                              className="field-label"
                            >
                              {" "}
                              Product{" "}
                            </h4>
                            <h4
                              style={{ fontWeight: "700" }}
                              className="field-label"
                            >
                              {" "}
                              Total{" "}
                            </h4>
                          </div>
                          <hr />
                          <ul className="qty">
                            {cartItems.map((item, index) => {
                              const product = item.product;
                              const itemTotal = product.finalPrice * item.quantity;
                              return (
                                <>
                                  <li
                                    key={index}
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <div style={{ display: "flex", gap: "5px" }}>
                                      {" "}
                                      <p>{product.title}</p> ×{" "}
                                      <p>{item.quantity}</p>{" "}
                                    </div>
                                    <span>
                                      <p>₹ {Math.floor(itemTotal)}</p>
                                    </span>
                                  </li>
                                  <p>
                                    {" "}
                                    Size:
                                    <span style={{ textTransform: "uppercase" }}>
                                      {product.size}
                                    </span>{" "}
                                  </p>
                                </>
                              );
                            })}
                          </ul>
                          <hr />

                          {/* Coupon Code Section */}
                          <div className="coupon-section mb-3">
                            <h4 className="field-label mb-2">Coupon Code</h4>

                            {!appliedPromocode ? (
                              <>
                                <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                                  <input
                                    type="text"
                                    placeholder="Enter coupon code"
                                    value={enteredPromocode}
                                    onChange={(e) => setEnteredPromocode(e.target.value)}
                                    style={{
                                      flex: 1,
                                      padding: "8px 12px",
                                      border: "1px solid #ddd",
                                      borderRadius: "4px"
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleApplyPromocode()}
                                    disabled={promocodeLoading}
                                    className="btn-solid btn"
                                    style={{ padding: "8px 16px" }}
                                  >
                                    {promocodeLoading ? "Applying..." : "Apply"}
                                  </button>
                                </div>

                                {/* Show available promocodes */}
                                <div>
                                  <button
                                    type="button"
                                    onClick={() => setShowPromocodeList(!showPromocodeList)}
                                    style={{
                                      background: "none",
                                      border: "none",
                                      color: "#3399cc",
                                      textDecoration: "underline",
                                      cursor: "pointer"
                                    }}
                                  >
                                    
                                  </button>
                                </div>

                                {showPromocodeList && availablePromocodes.length > 0 && (
                                  <div style={{
                                    marginTop: "10px",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                    padding: "10px",
                                    backgroundColor: "#f9f9f9"
                                  }}>
                                    <h5 style={{ fontSize: "14px", marginBottom: "10px" }}>Available Coupons:</h5>
                                    {availablePromocodes.map((promo, index) => (
                                      <div key={index} style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "8px 0",
                                        borderBottom: index < availablePromocodes.length - 1 ? "1px solid #eee" : "none"
                                      }}>
                                        <div>
                                          <strong>{promo.code}</strong>
                                          <div style={{ fontSize: "12px", color: "#666" }}>
                                            {promo.description || `${promo.discountType === 'percentage' ? promo.discountValue + '%' : '₹' + promo.discountValue} off`}
                                          </div>
                                          {promo.minOrderAmount && (
                                            <div style={{ fontSize: "11px", color: "#999" }}>
                                              Min order: ₹{promo.minOrderAmount}
                                            </div>
                                          )}
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleApplyPromocode(promo.code)}
                                          disabled={promocodeLoading || (promo.minOrderAmount && cartTotal < promo.minOrderAmount)}
                                          style={{
                                            padding: "4px 8px",
                                            fontSize: "12px",
                                            backgroundColor: "#3399cc",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "3px",
                                            cursor: "pointer"
                                          }}
                                        >
                                          Apply
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </>
                            ) : (
                              <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "10px",
                                backgroundColor: "#e8f5e8",
                                borderRadius: "4px",
                                marginBottom: "10px"
                              }}>
                                <div>
                                  <span style={{ color: "#2e7d32", fontWeight: "bold" }}>
                                    {appliedPromocode.code} applied!
                                  </span>
                                  <div style={{ fontSize: "12px", color: "#666" }}>
                                    Discount: ₹{Math.floor(promocodeDiscount)}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={handleRemovePromocode}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    color: "#d32f2f",
                                    cursor: "pointer"
                                  }}
                                >
                                  Remove
                                </button>
                              </div>
                            )}
                            {promocodeSuccess && (
                              <div style={{ color: "#2e7d32", fontSize: "12px", marginTop: "5px", fontWeight: "bold" }}>
                                {promocodeSuccess}
                              </div>
                            )}
                            {promocodeError && (
                              <div style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                                {promocodeError}
                              </div>
                            )}
                          </div>

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <h4
                              style={{ fontWeight: "500" }}
                              className="field-label"
                            >
                              {" "}
                              Subtotal{" "}
                            </h4>
                            <h4
                              style={{ fontWeight: "500" }}
                              className="field-label"
                            >
                              {" "}
                              ₹ {Math.floor(cartTotal)}{" "}
                            </h4>
                          </div>

                          {promocodeDiscount > 0 && (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: "10px"
                              }}
                            >
                              <h4
                                style={{ fontWeight: "500", color: "#2e7d32" }}
                                className="field-label"
                              >
                                Discount ({enteredPromocode}) <span  style={{ fontWeight: "500", color: "red", cursor:"pointer" }}onClick={handleRemovePromocode}>X</span>
                              </h4>
                              <h4
                                style={{ fontWeight: "500", color: "#2e7d32" }}
                                className="field-label"
                              >
                                - ₹ {Math.floor(promocodeDiscount)}
                              </h4>
                            </div>
                          )}

                          <br />
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <h4
                              style={{ fontWeight: "500" }}
                              className="field-label"
                            >
                              {" "}
                              Shipping{" "}
                            </h4>
                            <h4
                              style={{ fontWeight: "500" }}
                              className="field-label"
                            >
                              {" "}
                              Free Shipping{" "}
                            </h4>
                          </div>
                          <hr />
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <h4
                              style={{ fontWeight: "500" }}
                              className="field-label"
                            >
                              {" "}
                              Total{" "}
                            </h4>
                            <h4
                              style={{ fontWeight: "500" }}
                              className="field-label"
                            >
                              {" "}
                              ₹ {Math.floor(finalTotal)}{" "}
                            </h4>
                          </div>
                        </div>
                        <div className="payment-box">
                          <div className="upper-box">
                            <div className="payment-options">
                              <ul>
                                <li>
                                  <div className="radio-option paypal">
                                    <input
                                      type="radio"
                                      name="payment-group"
                                      id="payment-1"
                                      defaultChecked={true}
                                      onClick={() => checkhandle("online")}
                                    />
                                    <label htmlFor="payment-1">
                                      {" "}
                                      Online Payment{" "}
                                    </label>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                          {finalTotal !== 0 ? (
                            <div className="text-end">
                              <button
                                disabled={!isLogin}
                                type="submit"
                                className="btn-solid btn"
                              >
                                Place Order
                              </button>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    ) : (
                      " "
                    )}
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
          <br />
          <br />
          <br />
        </Container>
        <OpenModal
          setIsOpenTOTP={setIsOpenTOTP}
          isOpenTOTP={isOpenTOTP}
          userData={{ phoneNumber: mobileNumber }}
          popUpFor={"checkoutPage"}
          useBox="login"
        />
      </section>
    </>
  );
};

export default CheckoutPage;