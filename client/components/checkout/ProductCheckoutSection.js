  import React, { useContext, useEffect, useState } from "react";
  import { Col } from "reactstrap";
  import CartContext from "../../helpers/cart";
  import Api from "../Api";
  import toast from "react-hot-toast";
  import { getCookie } from "../cookies";

  export default function ProductCheckoutSection({ isLogin, payment, checkhandle, cartItems, cartTotal }) {
    const token = getCookie("ectoken");
    const cartContext = useContext(CartContext);

    // 🔹 Promo states
    const [availablePromocodes, setAvailablePromocodes] = useState([]);
    const [enteredPromocode, setEnteredPromocode] = useState("");
    const [appliedPromocode, setAppliedPromocode] = useState(null);
    const [promocodeDiscount, setPromocodeDiscount] = useState(0);
    const [promocodeError, setPromocodeError] = useState("");
    const [promocodeSuccess, setPromocodeSuccess] = useState("");
    const [promocodeLoading, setPromocodeLoading] = useState(false);
    const [showPromocodeList, setShowPromocodeList] = useState(false);

    // 🔹 Fetch promocodes
    useEffect(() => {
      fetchActivePromocodes();
    }, []);

    const fetchActivePromocodes = async () => {
      try {
        const response = await Api.getAllPromocodes(token);
        if (response.data && response.data.success) {
          const now = new Date();
          const activePromos = response.data.data.filter(promo => {
            const endDate = new Date(promo.endDate);
            return promo.status && !promo.isDeleted && endDate > now;
          });
          setAvailablePromocodes(activePromos);
        }
      } catch (err) {
        console.error("Error fetching promocodes:", err);
      }
    };

    // 🔹 Helpers
    const isPromocodeEligible = (promo) => !promo.minimumSpend || cartTotal >= promo.minimumSpend;

    const formatDiscountDisplay = (promo) =>
      promo.discountType === "percent" ? `${promo.discountValue}% off` : `₹${promo.discountValue} off`;

    const calculateDiscountAmount = (promo, orderTotal) =>
      promo.discountType === "percent"
        ? Math.floor((orderTotal * promo.discountValue) / 100)
        : Math.floor(promo.discountValue);

    const finalTotal = Math.max(0, cartTotal - promocodeDiscount);

    // 🔹 Apply promocode
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
        const validateResponse = await Api.validatePromocode(
          { code: promocodeValue, orderTotal: cartTotal },
          token
        );

        if (validateResponse.data?.success) {
          const applyResponse = await Api.applyPromocode(
            { code: promocodeValue, orderTotal: cartTotal },
            token
          );

          if (applyResponse.data?.success) {
            const appliedPromo = availablePromocodes.find(p => p.code === promocodeValue);
            let discount = appliedPromo ? calculateDiscountAmount(appliedPromo, cartTotal) : 0;

            setPromocodeDiscount(discount);
            setAppliedPromocode(appliedPromo || { code: promocodeValue });
            setEnteredPromocode(promocodeValue);
            setPromocodeSuccess(`Promocode ${promocodeValue} applied successfully!`);
            toast.success("Promo applied successfully");
          } else {
            setPromocodeError(applyResponse.data?.message || "Failed to apply promocode");
          }
        } else {
          setPromocodeError(validateResponse.data?.message || "Invalid promocode");
        }
      } catch (err) {
        setPromocodeError(err.response?.data?.message || "Error applying promocode");
      } finally {
        setPromocodeLoading(false);
      }
    };

    // 🔹 Remove promocode
    const handleRemovePromocode = () => {
      setAppliedPromocode(null);
      setPromocodeDiscount(0);
      setEnteredPromocode("");
      setPromocodeError("");
      setPromocodeSuccess("");
    };

    return (
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
                    <React.Fragment key={index}>
                      <li
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
                    </React.Fragment>
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
                          cursor: "pointer",
                          fontSize: "14px"
                        }}
                      >
                        {showPromocodeList ? "Hide" : "View"} Available Coupons ({availablePromocodes.length})
                      </button>
                    </div>

                    {showPromocodeList && availablePromocodes.length > 0 && (
                      <div style={{
                        marginTop: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        padding: "10px",
                        backgroundColor: "#f9f9f9",
                        maxHeight: "300px",
                        overflowY: "auto"
                      }}>
                        <h5 style={{ fontSize: "14px", marginBottom: "10px", color: "#333" }}>
                          {/* Available Coupons: */}
                        </h5>
                        {availablePromocodes.map((promo, index) => {
                          const isEligible = isPromocodeEligible(promo);
                          const potentialDiscount = isEligible ? calculateDiscountAmount(promo, cartTotal) : 0;
                          return (
                            <div key={index} style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "12px 8px",
                              marginBottom: "8px",
                              backgroundColor: "white",
                              borderRadius: "4px",
                              border: isEligible ? "1px solid #e0e0e0" : "1px solid #ffcdd2",
                              opacity: isEligible ? 1 : 0.7
                            }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                  <strong style={{ color: "#333", fontSize: "13px" }}>
                                    {promo.code}
                                  </strong>
                                  <span style={{
                                    backgroundColor: "#e8f5e8",
                                    color: "#2e7d32",
                                    padding: "2px 6px",
                                    borderRadius: "12px",
                                    fontSize: "11px",
                                    fontWeight: "bold"
                                  }}>
                                    {formatDiscountDisplay(promo)}
                                  </span>
                                  {isEligible && potentialDiscount > 0 && (
                                    <span style={{
                                      backgroundColor: "#fff3cd",
                                      color: "#856404",
                                      padding: "2px 6px",
                                      borderRadius: "12px",
                                      fontSize: "10px",
                                      fontWeight: "bold"
                                    }}>
                                      Save ₹{potentialDiscount}
                                    </span>
                                  )}
                                </div>

                                {promo.name && (
                                  <div style={{ fontSize: "12px", color: "#555", marginBottom: "2px" }}>
                                    {promo.name}
                                  </div>
                                )}

                                <div style={{ fontSize: "11px", color: "#777" }}>
                                  {promo.minimumSpend && (
                                    <span>Min order: ₹{promo.minimumSpend}</span>
                                  )}
                                  {promo.freeShipping && (
                                    <span style={{ marginLeft: promo.minimumSpend ? "8px" : "0" }}>
                                      + Free Shipping
                                    </span>
                                  )}
                                </div>

                                {!isEligible && promo.minimumSpend && (
                                  <div style={{ fontSize: "10px", color: "#d32f2f", marginTop: "2px" }}>
                                    Add ₹{promo.minimumSpend - cartTotal} more to use this coupon
                                  </div>
                                )}

                                <div style={{ fontSize: "10px", color: "#999", marginTop: "4px" }}>
                                  Valid till: {new Date(promo.endDate).toLocaleDateString()}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleApplyPromocode(promo.code)}
                                disabled={promocodeLoading || !isEligible}
                                style={{
                                  padding: "6px 12px",
                                  fontSize: "11px",
                                  backgroundColor: isEligible ? "#3399cc" : "#ccc",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "3px",
                                  cursor: isEligible ? "pointer" : "not-allowed",
                                  minWidth: "60px"
                                }}
                              >
                                {promocodeLoading ? "..." : "Apply"}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {availablePromocodes.length === 0 && (
                      <div style={{ fontSize: "12px", color: "#999", marginTop: "10px" }}>
                        No active promocodes available at the moment.
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px",
                    backgroundColor: "#e8f5e8",
                    borderRadius: "4px",
                    marginBottom: "10px",
                    border: "1px solid #c8e6c9"
                  }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ color: "#2e7d32", fontWeight: "bold", fontSize: "14px" }}>
                          {appliedPromocode.code} Applied!
                        </span>
                        {appliedPromocode.name && (
                          <span style={{ fontSize: "12px", color: "#555" }}>
                            ({appliedPromocode.name})
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "12px", color: "#2e7d32", marginTop: "2px" }}>
                        You saved ₹{Math.floor(promocodeDiscount)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePromocode}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#d32f2f",
                        cursor: "pointer",
                        fontSize: "18px",
                        fontWeight: "bold"
                      }}
                      title="Remove coupon"
                    >
                      ×
                    </button>
                  </div>
                )}

                {promocodeSuccess && (
                  <div style={{
                    color: "#2e7d32",
                    fontSize: "12px",
                    marginTop: "5px",
                    fontWeight: "bold",
                    backgroundColor: "#e8f5e8",
                    padding: "8px",
                    borderRadius: "4px"
                  }}>
                    {promocodeSuccess}
                  </div>
                )}
                {promocodeError && (
                  <div style={{
                    color: "#d32f2f",
                    fontSize: "12px",
                    marginTop: "5px",
                    backgroundColor: "#ffebee",
                    padding: "8px",
                    borderRadius: "4px"
                  }}>
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
    );
  }
