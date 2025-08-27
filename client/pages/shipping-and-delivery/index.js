import React from "react";
import CommonLayout from "../../components/shop/common-layout";
import { Container } from "reactstrap";

const ShippingAndDelivery = () => {
  return (
    <CommonLayout title="Shipping and Delivery" parent="home">
      {/* <div className="extra-delivery-pages"> */}
      <br></br>
      <Container>
        <div
          style={{
            padding: "20px",
            backgroundColor: "#f9f9f9",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <h3 style={{ color: "#333" }}>Shipping and Delivery Terms</h3>

          <p>
            At HEED, we strive to provide a premium shopping experience, which
            includes free expedited shipping on all orders, with no hidden
            costs. We ensure that your order is delivered quickly and securely,
            right to your doorstep.
          </p>
          <h5 style={{ color: '#555' }}>Shipping Details</h5>
          <ul>
            <li>
              <strong>Free Expedited Shipping:</strong> Enjoy complimentary
              expedited shipping on all orders. No extra charges at checkout.
            </li>
            <li>
              <strong>Processing Time:</strong> Orders are processed within 1-2
              business days after confirmation. Orders placed after 5 PM or on
              weekends/holidays will be processed on the next business day.
            </li>
          </ul>
          <h5 style={{ color: '#555' }}>Delivery Timeframes</h5>

          <ul>
            <li>
              <strong>Within Major Cities:</strong> Expect delivery within 2-3
              business days.
            </li>
            <br></br>
            <li>
              <strong>Regional Areas:</strong> Delivery within 3-5 business
              days.
            </li>
            <br></br>
            <li>
              <strong>Remote Areas:</strong> Delivery within 5-7 business days.
            </li>
          </ul>
          <p>
            For more precise delivery estimates, please refer to your order
            tracking information.
          </p>
          <h5 style={{ color: '#555' }}>Order Tracking</h5>
          <ul>
            <li>
              Once your order is shipped, you will receive an email with a
              tracking number. Use this number to track your shipment online via
              the courier’s website or your{" "}
              <a href="https://www.shopheed.com" target="_blank">
                www.shopheed.com
              </a>{" "}
              account.
            </li>
            <li>
              Please allow 24-48 hours for tracking details to update after your
              order has been shipped.
            </li>
          </ul>
          <h5 style={{ color: '#555' }}>Delivery Locations</h5>
          <p>
            We currently offer free delivery throughout India. International
            shipping is also available, and we provide a custom delivery
            estimate for international orders.
          </p>
          <h5 style={{ color: '#555' }}>Additional Information</h5>
          {/* <h2></h2> */}
          <ul>
            <li>
              <strong>Address Accuracy:</strong> Please ensure that the shipping
              address provided is accurate. We are not responsible for delays or
              mis-deliveries due to incorrect or incomplete addresses.
            </li>
            <li>
              <strong>Delivery Delays:</strong> While we aim to meet our
              delivery timeframes, unforeseen circumstances such as weather
              conditions, public holidays, or logistical issues may cause
              delays. If this occurs, you can reach our customer support team.
            </li>
          </ul>

          <p>
            For any inquiries regarding shipping or delivery, feel free to email
            us at{" "}
            <a href="mailto:heed.brandsin@gmail.com">heed.brandsin@gmail.com</a>{" "}
            or call us at +91-7703933743.
          </p>
        </div>
      </Container>
      <br></br>
      {/* </div> */}
    </CommonLayout>
  );
};

export default ShippingAndDelivery;
