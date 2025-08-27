import React from "react";
import CommonLayout from "../../components/shop/common-layout";
import { Container } from "reactstrap";
import ListItemBullet from "./listItemBullet";


const ReturnAndExchange = () => {
  return (
    <CommonLayout title="Cancellation and Refund" parent="home">
        <br></br>
        <Container>
   <div style={{ padding: '20px', backgroundColor: '#f9f9f9', fontFamily: 'Arial, sans-serif' }}>
      <h3 style={{ color: '#333' }}>Return and Exchange Policy</h3>
      <h5>We at HEED, are committed to deliver high-quality garments to ensure that our customers are satisfied with their purchase. If for any reason you are not, we are here to assist with a straightforward and clear refund and exchange process with no questions asked.</h5>
<br></br>
      <h5 style={{ color: '#555' }}>Eligibility for Return and Exchanges</h5>
      <ul>
        <ListItemBullet title={"To initiate a Return or Exchange, inform us within 4 days of delivery."} />
        <ListItemBullet title={"Garment must be in their original condition — unworn, unwashed, with all tags and packaging intact."} />
        <ListItemBullet title={"Items purchased under special sale offers are not eligible for Return or Exchanges unless defective."} />
        <ListItemBullet title={"Issues with defective, incorrect, and damaged product should be reported within 24 hours of delivery."} />
        <ListItemBullet title={"For hygiene, Inner Wear & Accessories are not eligible for Return or Exchanges."} />
      </ul>
      <br></br>
      <h5 style={{ color: '#555' }}>Return Process</h5>
      <ul>
      <ListItemBullet title={"Submit a Return Request with your Order ID and registered Email or Mobile Number."} />
      <ListItemBullet title={"Once we receive your Return Request, we will send you a confirmation and instructions on how to return the product."} />
      <ListItemBullet title={"Once the returned item is received and inspected, we will notify you of approval of your refund."} />
      <ListItemBullet title={"Upon approval, your refund will be processed within 3-5 business days to your original payment method."} />
      <ListItemBullet title={"Please note that we charge a flat fee of Rs. 109 for reverse pick-up, which will be deducted from the refund."} />
      </ul>
      <br></br>
      <h5 style={{ color: '#555' }}>Exchange Process</h5>
      <ul>
        <ListItemBullet title={"Submit an Exchange Request with your Order ID and registered Email or Mobile Number."} />
        <ListItemBullet title={"If you wish to Exchange a product for a different size, Rs. 109 reverse pick-up fee applies."} />
        <ListItemBullet title={"We will handle the forward shipment charges of the new size from our side."} />
        <ListItemBullet title={"Exchanges will be shipped once the returned item has been received and inspected."} />

      </ul>

      <p style={{ fontStyle: 'italic' }}>
        We reserve the right to refuse refunds or exchanges if the items returned do not meet our return policy eligibility.
      </p>

      <div className="contact-info" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#eee', borderLeft: '4px solid #333' }}>
        <p style={{marginTop: "12px"}}>For any queries regarding returns and exchanges, please email us at <a href="mailto:heed.brandsin@gmail.com">heed.brandsin@gmail.com</a> or call us at +91-7703933743.</p>
      </div>
    </div>
    </Container>
    <br></br>
    </CommonLayout>
  );
};

export default ReturnAndExchange;


