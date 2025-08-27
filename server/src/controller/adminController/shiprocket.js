const axios = require("axios");
const { EmailSendComponent, htmlContentForMailTemplate } = require("../emailController");
require("dotenv").config();


const loginData = JSON.stringify({
  email: process.env.API_EMAIL,
  password: process.env.EMAIL_PASS,
});
 
const login = async function () {
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url:process.env.EMAIL_URL ,
    headers: {
      "Content-Type": "application/json",
    },
    data: loginData,
  };

  try {
    const response = await axios(config);

    return response.data.token;
  } catch (error) {
    throw error;
  }
};


const order = async function (data, token) {
  const {
    orderId,
    paymentMethod,
    phone,
    pincode,
    state,
    title,
    totalAmount,
    totalQuantity,
    weight,
    address,
    breadth,
    city,
    country,
    email,
    finalPrice,
    first_name,
    height,
    last_name,
    length,
  } = data;

  const sendData = JSON.stringify({
    order_id: orderId,
    order_date: new Date().toISOString(),
    pickup_location: "Primary",
    channel_id: "",
    comment: "",
    billing_customer_name: first_name,
    billing_last_name: last_name,
    billing_address: address,
    billing_address_2: "",
    billing_city: city,
    billing_pincode: pincode,
    billing_state: state,
    billing_country: country,
    billing_email: email,
    billing_phone: phone,
    shipping_is_billing: true,
    shipping_customer_name: first_name,
    shipping_last_name: last_name,
    shipping_address: address,
    shipping_address_2: "",
    shipping_city: city,
    shipping_pincode: pincode,
    shipping_country: country,
    shipping_state: state,
    shipping_email: email,
    shipping_phone: phone,
    order_items: [
      {
        name: title,
        sku: orderId,
        units: totalQuantity,
        selling_price: finalPrice,
        discount: "",
        tax: "",
        hsn: "",
      },
    ],
    payment_method: paymentMethod === "online" ? "Prepaid" : "COD",
    shipping_charges: "",
    giftwrap_charges: "",
    transaction_charges: "",
    total_discount: "",
    sub_total: totalAmount,
    length: length,
    breadth: breadth,
    height: height,
    weight: weight/1000,
  });



  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: process.env.CREATE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: sendData,
  };

  try {
    const response = await axios(config);
    EmailSendComponent(email,"Order Shipping", htmlContentForMailTemplate(first_name , "Your order is on it's way" , "Good news ! a shipment from deluxe is headed your way") )
   
    return response.data;
  } catch (error) {
    throw error;
  }
};


module.exports = { login, order };
