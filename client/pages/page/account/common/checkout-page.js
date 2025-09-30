import React, { useContext, useState, useEffect } from "react";
import { Container, Form, Row, Col } from "reactstrap";
import CartContext from "../../../../helpers/cart";
import { State, City } from "country-state-city";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Api from "../../../../components/Api";
import { getCookie } from "../../../../components/cookies";
import OpenModal from "../openModal";
import { LoaderContext } from "../../../../helpers/loaderContext";
import toast from "react-hot-toast";
import ProductCheckoutSection from "../../../../components/checkout/ProductCheckoutSection";
import { Edit2 } from "lucide-react";

const CheckoutPage = ({ isLogin }) => {
  const cartContext = useContext(CartContext);
  const cartItems = cartContext.state;
  const cartTotal = cartContext.cartTotal;
  const [mobileNumber, setMobileNumber] = useState();
  const [isOpenTOTP, setIsOpenTOTP] = useState(false);
  const [error, setError] = useState("");
  const token = getCookie("ectoken");

  const [payment, setPayment] = useState("online");

  const { register, handleSubmit, formState: { errors }, getValues, reset } = useForm();

  const LoaderContextData = useContext(LoaderContext);
  const { catchErrors, setLoading } = LoaderContextData;
  const router = useRouter();

  // ----------------- Saved addresses -----------------
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    if (isLogin) fetchAddresses();
  }, [isLogin]);

  const handleSaveAddress = async () => {
    const values = getValues();

    const newAddress = {
      firstName: values.first_name,
      lastName: values.last_name,
      phone: values.phone,
      email: values.email,
      country: "India",
      state: selectedState ? selectedState.name : "",
      city: selectedCity ? selectedCity.name : "",
      addressLine: values.address,
      pincode: values.pincode,
      label: values.label || "Other",
      isDefault: values.isDefault || false,
    };

    try {
      setLoading(true);
      const res = editingAddress
        ? await Api.updateAddress(editingAddress._id, newAddress, token)
        : await Api.addAddress(newAddress, token);
      
      if (res.data.success) {
        toast.success(editingAddress ? "Address updated successfully" : "Address saved successfully");
        await fetchAddresses();
        setSelectedAddress(res.data.data);
        setShowNewAddressForm(false);
        setEditingAddress(null);
        // Clear form
        reset();
        setSelectedState(null);
        setSelectedCity(null);
      } else {
        toast.error(res.data.message || "Failed to save address");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving address");
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await Api.getAddresses(token);
      if (res.data.success) {
        setAddresses(res.data.data);
        const defaultAddr = res.data.data.find((addr) => addr.isDefault);
        if (defaultAddr) setSelectedAddress(defaultAddr);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditAddress = (addr) => {
    setEditingAddress(addr);
    setShowNewAddressForm(true);
    
    // Pre-fill form
    reset({
      first_name: addr.firstName,
      last_name: addr.lastName,
      phone: addr.phone,
      email: addr.email,
      address: addr.addressLine,
      pincode: addr.pincode,
      label: addr.label,
      isDefault: addr.isDefault,
    });

    // Pre-select state and city
    const indiaCode = "IN";
    const states = State.getStatesOfCountry(indiaCode);
    const foundState = states.find(s => s.name === addr.state);
    if (foundState) {
      setSelectedState(foundState);
      const cities = City.getCitiesOfState(indiaCode, foundState.isoCode);
      const foundCity = cities.find(c => c.name === addr.city);
      if (foundCity) setSelectedCity(foundCity);
    }
  };

  const handleCancelForm = () => {
    setShowNewAddressForm(false);
    setEditingAddress(null);
    reset();
    setSelectedState(null);
    setSelectedCity(null);
  };

  useEffect(() => {
    if (selectedState) {
      setSelectedCity(null);
    }
  }, [selectedState]);

  // ----------------- Login via Mobile -----------------
  const handleMobileNumberLogin = async () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      setError("Enter a valid Number");
      setTimeout(() => setError(""), 2000);
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
      if (error?.response?.data?.message) {
        return toast.error(error.response.data.message);
      }
    }
  };

  // ----------------- Payment -----------------
  const handlePayment = async (orderId, customOrderId, finalTotal) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
      amount: Math.floor(finalTotal) * 100,
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
          toast.success(paymentVerification.data.message ?? "Order placed successfully");
          router.push(`/page/order-success?orderId=${customOrderId || orderId}`);
        } else {
          toast.error(paymentVerification.data.message ?? "Failed to verify payment");
        }
      },
      theme: { color: "#222222" },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  // ----------------- Submit Order -----------------
  const onSubmit = async (data) => {
    let customerDetails;
    if (selectedAddress && !showNewAddressForm) {
      // Using saved address - map fields properly
      customerDetails = {
        first_name: selectedAddress.firstName,
        last_name: selectedAddress.lastName,
        phone: selectedAddress.phone,
        email: selectedAddress.email,
        country: selectedAddress.country,
        state: selectedAddress.state,
        city: selectedAddress.city,
        address: selectedAddress.addressLine,
        pincode: selectedAddress.pincode,
        label: selectedAddress.label,
        isDefault: selectedAddress.isDefault,
      };
    } else {
      // Using form data
      customerDetails = {
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        email: data.email,
        country: "India",
        state: selectedState ? selectedState.name : "",
        city: selectedCity ? selectedCity.name : "",
        address: data.address,
        pincode: data.pincode,
        label: data.label || "Other",
        isDefault: data.isDefault || false,
      };
    }

    const orderData = {
      items: cartItems,
      orderTotal: Math.floor(cartTotal),
      originalTotal: Math.floor(cartTotal),
      paymentMethod: payment,
      customerDetails,
    };

    try {
      setLoading(true);
      const createOrder = await Api.createOrder(orderData, token);
      if (createOrder.data.success) {
        const customOrderId = createOrder.data.customOrderId || createOrder.data.orderId;
        if (payment === "cod") {
          cartContext.clearCart();
          toast.success(createOrder.data.message ?? "Order placed successfully");
          router.push(`/page/order-success?orderId=${customOrderId}`);
        } else {
          handlePayment(createOrder.data.orderId, customOrderId, cartTotal);
        }
      } else {
        toast.error(createOrder.data.message ?? "Order creation failed");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message ?? "Order creation failed");
      catchErrors(error);
    } finally {
      setLoading(false);
    }
  };

  const checkhandle = (value) => {
    setPayment(value);
  };

  return (
    <section className="section-b-space checkout-sec">
      <Container>
        <div className="checkout-page">
          <div className="checkout-form">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                {/* ----------------- Left: Login + Address ----------------- */}
                <Col lg="6" sm="12" xs="12">
                  {/* Login section */}
                  {!isLogin && (
                    <>
                      <div className="checkout-title"><h3>Login</h3></div>
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
                              if (value.length <= 10) setMobileNumber(value);
                            }}
                          />
                          <div className="mt-2" style={{ color: "red" }}>{error}</div>
                        </div>
                        <div className="form-group col-md-5 col-sm-5 col-xs-12 mt-4 pt-2">
                          <div className="text-end">
                            <button onClick={handleMobileNumberLogin} type="button" className="btn-solid btn">
                              Send OTP
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Address section */}
                  <div className="checkout-title"><h3>Address Details</h3></div>

                  {addresses.length === 0 && !showNewAddressForm ? (
                    <div style={{
                      textAlign: "center",
                      padding: "40px 20px",
                      backgroundColor: "#fafafa",
                      borderRadius: "4px",
                      border: "2px dashed #ddd"
                    }}>
                      <p style={{ color: "#666", marginBottom: "20px", fontSize: "14px" }}>No saved addresses found.</p>
                      <button
                        className="btn btn-solid"
                        type="button"
                        onClick={() => setShowNewAddressForm(true)}
                      >
                        + Add New Address
                      </button>
                    </div>
                  ) : addresses.length > 0 && !showNewAddressForm ? (
                    <>
                      <div style={{ marginBottom: "20px" }}>
                        {addresses.map((addr) => (
                          <div
                            key={addr._id}
                            style={{
                              border: selectedAddress?._id === addr._id ? "2px solid #222" : "1px solid #e5e5e5",
                              padding: "16px",
                              marginBottom: "12px",
                              borderRadius: "4px",
                              backgroundColor: selectedAddress?._id === addr._id ? "#f5f5f5" : "white",
                              position: "relative",
                              cursor: "pointer",
                              transition: "all 0.2s ease"
                            }}
                            onClick={() => setSelectedAddress(addr)}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                                  <input
                                    type="radio"
                                    checked={selectedAddress?._id === addr._id}
                                    onChange={() => setSelectedAddress(addr)}
                                    style={{ cursor: "pointer", accentColor: "#222" }}
                                  />
                                  <span style={{
                                    backgroundColor: "#222",
                                    color: "white",
                                    padding: "4px 12px",
                                    borderRadius: "3px",
                                    fontSize: "11px",
                                    fontWeight: "600",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px"
                                  }}>
                                    {addr.label}
                                  </span>
                                  {addr.isDefault && (
                                    <span style={{
                                      backgroundColor: "#f0f0f0",
                                      color: "#666",
                                      padding: "4px 12px",
                                      borderRadius: "3px",
                                      fontSize: "11px",
                                      fontWeight: "600",
                                      textTransform: "uppercase",
                                      letterSpacing: "0.5px"
                                    }}>
                                      Default
                                    </span>
                                  )}
                                </div>
                                <div style={{ marginLeft: "28px" }}>
                                  <p style={{ fontWeight: "600", marginBottom: "6px", fontSize: "15px", color: "#222" }}>
                                    {addr.firstName} {addr.lastName}
                                  </p>
                                  <p style={{ color: "#666", fontSize: "13px", marginBottom: "4px", lineHeight: "1.5" }}>
                                    {addr.addressLine}
                                  </p>
                                  <p style={{ color: "#666", fontSize: "13px", marginBottom: "4px" }}>
                                    {addr.city}, {addr.state} - {addr.pincode}
                                  </p>
                                  <p style={{ color: "#666", fontSize: "13px" }}>
                                    Phone: {addr.phone}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditAddress(addr);
                                }}
                                style={{
                                  background: "white",
                                  border: "1px solid #222",
                                  borderRadius: "50%",
                                  width: "36px",
                                  height: "36px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                  color: "#222",
                                  transition: "all 0.2s ease"
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.backgroundColor = "#222";
                                  e.currentTarget.style.color = "white";
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.backgroundColor = "white";
                                  e.currentTarget.style.color = "#222";
                                }}
                                title="Edit address"
                              >
                                <Edit2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        className="btn btn-solid"
                        type="button"
                        onClick={() => setShowNewAddressForm(true)}
                      >
                        + Add New Address
                      </button>
                    </>
                  ) : (
                    <>
                      <div style={{
                        backgroundColor: "#fafafa",
                        padding: "24px",
                        borderRadius: "4px",
                        marginBottom: "20px",
                        border: "1px solid #e5e5e5"
                      }}>
                        <h4 style={{ fontSize: "16px", marginBottom: "20px", fontWeight: "600", color: "#222" }}>
                          {editingAddress ? "Edit Address" : "Add New Address"}
                        </h4>
                        <div className="row check-out">
                          <div className="form-group col-md-6 col-sm-6 col-xs-12">
                            <h4 className="field-label">First Name</h4>
                            <input
                              type="text"
                              className={`${errors.first_name ? "error_border" : ""}`}
                              {...register("first_name", { required: true })}
                            />
                            <span className="error-message">{errors.first_name && "First name is required"}</span>
                          </div>

                          <div className="form-group col-md-6 col-sm-6 col-xs-12">
                            <h4 className="field-label">Last Name</h4>
                            <input
                              type="text"
                              className={`${errors.last_name ? "error_border" : ""}`}
                              {...register("last_name", { required: true })}
                            />
                            <span className="error-message">{errors.last_name && "Last name is required"}</span>
                          </div>

                          <div className="form-group col-md-6 col-sm-6 col-xs-12">
                            <h4 className="field-label">Phone</h4>
                            <input
                              type="text"
                              className={`${errors.phone ? "error_border" : ""}`}
                              {...register("phone", { pattern: /\d+/ })}
                            />
                            <span className="error-message">{errors.phone && "Please enter number for phone."}</span>
                          </div>

                          <div className="form-group col-md-6 col-sm-6 col-xs-12">
                            <h4 className="field-label">Email Address</h4>
                            <input
                              type="text"
                              className={`${errors.email ? "error_border" : ""}`}
                              {...register("email", {
                                required: true,
                                pattern: /^\S+@\S+$/i,
                              })}
                            />
                            <span className="error-message">
                              {errors.email && "Please enter a valid email address."}
                            </span>
                          </div>

                          <div className="form-group col-md-12">
                            <h4 className="field-label">State</h4>
                            <Select
                              options={State.getStatesOfCountry("IN")}
                              getOptionLabel={(o) => o.name}
                              getOptionValue={(o) => o.name}
                              value={selectedState}
                              onChange={setSelectedState}
                              placeholder="Select State"
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  borderColor: '#e5e5e5',
                                  '&:hover': { borderColor: '#222' }
                                })
                              }}
                            />
                          </div>

                          <div className="form-group col-md-12">
                            <h4 className="field-label">City</h4>
                            <Select
                              options={
                                selectedState ? City.getCitiesOfState("IN", selectedState.isoCode) : []
                              }
                              getOptionLabel={(o) => o.name}
                              getOptionValue={(o) => o.name}
                              value={selectedCity}
                              onChange={setSelectedCity}
                              placeholder="Select City"
                              isDisabled={!selectedState}
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  borderColor: '#e5e5e5',
                                  '&:hover': { borderColor: '#222' }
                                })
                              }}
                            />
                          </div>

                          <div className="form-group col-md-12">
                            <h4 className="field-label">Address</h4>
                            <input
                              type="text"
                              className={`${errors.address ? "error_border" : ""}`}
                              {...register("address", { required: true, minLength: 20, maxLength: 120 })}
                              placeholder="Street address"
                            />
                            <span className="error-message">{errors.address && "Please write your address."}</span>
                          </div>

                          <div className="form-group col-md-12">
                            <h4 className="field-label">Postal Code</h4>
                            <input
                              type="text"
                              className={`${errors.pincode ? "error_border" : ""}`}
                              {...register("pincode", { pattern: /\d+/ })}
                            />
                            <span className="error-message">{errors.pincode && "Required integer"}</span>
                          </div>

                          <div className="form-group col-md-6 col-sm-6 col-xs-12">
                            <h4 className="field-label">Label</h4>
                            <select className="form-control" {...register("label")} defaultValue="Home">
                              <option value="Home">Home</option>
                              <option value="Work">Work</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div className="form-group col-md-6 col-sm-6 col-xs-12 d-flex align-items-center" style={{ paddingTop: "30px" }}>
                            <input type="checkbox" {...register("isDefault")} style={{ accentColor: "#222" }} /> &nbsp; Make this my default address
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "12px", marginTop: "15px" }}>
                          <button
                            className="btn btn-solid"
                            type="button"
                            onClick={handleSaveAddress}
                            style={{ flex: 1 }}
                          >
                            {editingAddress ? "Update Address" : "Save Address"}
                          </button>
                          <button
                            className="btn btn-outline"
                            type="button"
                            onClick={handleCancelForm}
                            style={{ 
                              flex: 1,
                              backgroundColor: "white",
                              color: "#222",
                              border: "1px solid #222"
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </Col>

                {/* ----------------- Right: Product & Payment ----------------- */}
                <ProductCheckoutSection
                  isLogin={isLogin}
                  payment={payment}
                  checkhandle={checkhandle}
                  cartItems={cartItems}
                  cartTotal={cartTotal}
                />
              </Row>
            </Form>
          </div>
        </div>

        <OpenModal
          setIsOpenTOTP={setIsOpenTOTP}
          isOpenTOTP={isOpenTOTP}
          userData={{ phoneNumber: mobileNumber }}
          popUpFor={"checkoutPage"}
          useBox="login"
        />
      </Container>
    </section>
  );
};

export default CheckoutPage;