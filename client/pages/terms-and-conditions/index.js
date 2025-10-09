import React from "react";
import CommonLayout from "../../components/shop/common-layout";
import { Container } from "reactstrap";

const TermsAndConditions = () => {
  return (
    <CommonLayout title="Terms and Conditions" parent="home">
      <section
        style={{ marginBottom: "50px", paddingTop: "30px" }}
        className="section-b-space ratio_asos terms-and-conditions"
      >
        <div className="collection-wrapper">
          <Container>
            <p>
              Welcome to Heed . These Terms and Conditions govern your use of
              our website www.shopheed.com and the purchase of our products. By
              accessing our website or purchasing our products, you agree to
              these terms. Please read them carefully.
            </p>

            <h3 style={{ color: "#000000", fontWeight: "600" }}>
              Use of the Website
            </h3>

            <h4>Eligibility</h4>

            <ul className="privacy-list">
              <li>
                <p>
                  {" "}
                  You must be at least 18 years old to use our website and
                  purchase our products.
                </p>
              </li>
              <li>
                <p>
                  {" "}
                  By using our website, you represent and warrant that you have
                  the legal capacity to enter into these terms.
                </p>
              </li>
            </ul>

            <h3 style={{ color: "#000000", fontWeight: "600" }}>
              Account Registration
            </h3>

            <ul className="privacy-list">
              <li>
                <p>
                  {" "}
                  To access certain features of our website, you may need to
                  create an account.
                </p>
              </li>
              <li>
                <p>
                  {" "}
                  You are responsible for maintaining the confidentiality of
                  your account information and for all activities that occur
                  under your account
                </p>
              </li>
              <li>
                <p>
                  {" "}
                  You agree to provide accurate, current, and complete
                  information during the registration process.
                </p>
              </li>
            </ul>

            <h3 style={{ color: "#000000", fontWeight: "600" }}>
              Products and Orders
            </h3>

            <ul className="privacy-list">
              <h4>Product Information</h4>
              <ul className="privacy-list">
                {" "}
                <li>
                  <p>
                    {" "}
                    We strive to provide accurate information about our
                    products, including descriptions, pricing, and availability.
                    However, we do not warrant that the product descriptions or
                    other content on the website are accurate, complete,
                    reliable, current, or error-free.
                  </p>
                </li>
              </ul>
              <h4>Order Acceptance</h4>

              <ul className="privacy-list">
                <li>
                  <p>
                    {" "}
                    All orders are subject to acceptance by us. We reserve the
                    right to refuse or cancel any order for any reason.
                  </p>
                </li>
                <li>
                  {" "}
                  <p>
                    {" "}
                    If we cancel an order, we will notify you and provide a full
                    refund
                  </p>
                </li>
              </ul>
              <h4>Pricing and Payment</h4>

              <ul className="privacy-list">
                <li>
                  <p>
                    {" "}
                    All prices listed on our website are in Indian Rupees (INR)
                    and are inclusive of applicable taxes.
                  </p>
                </li>
                <li>
                  <p>
                    We accept various forms of payment as indicated on our
                    website. By providing payment information, you represent and
                    warrant that the information is accurate, and you are
                    authorized to use the payment method.
                  </p>
                </li>
              </ul>
              <h4> Shipping and Delivery</h4>

              <ul className="privacy-list">
                <li>
                  <p>
                    {" "}
                    We will make every effort to deliver your order within the
                    estimated delivery time. However, we are not responsible for
                    any delays caused by events outside our control.
                  </p>
                </li>
                <li>
                  <p>
                    {" "}
                    Shipping charges, if applicable, will be displayed at
                    checkout.
                  </p>
                </li>
                <li>
                  <p>
                    {" "}
                    Enforcement of Policies: Enforce our terms and conditions
                    and other legal agreements.
                  </p>
                </li>
              </ul>
            </ul>

            <h3 style={{ color: "#000000", fontWeight: "600" }}>
              Returns and Refunds
            </h3>

            <ul className="privacy-list">
              <h4>Return Policy</h4>
              <ul>
                <li>
                  <p>
                    {" "}
                    We accept returns of unopened and unused products within 30
                    days of delivery. To initiate a return, please contact our
                    customer service team.
                  </p>
                </li>
              </ul>

              <h4>Refund Policy</h4>

              <ul>
                <li>
                  <p>
                    {" "}
                    Refunds will be processed within 7 days of receiving the
                    returned product. Refunds will be issued to the original
                    payment method.
                  </p>
                </li>
              </ul>
            </ul>

            <h3 style={{ color: "#000000", fontWeight: "600" }}>
              Intellectual Property
            </h3>

            <ul className="privacy-list">
              <h4>Ownership</h4>
              <ul className="privacy-list">
                <li>
                  <p>
                    {" "}
                    All content on our website, including text, graphics, logos,
                    images, and software, is the property of Heed or its
                    licensors and is protected by intellectual property laws.
                  </p>
                </li>
              </ul>
              <h4>Limitation of Liability</h4>
              <ul className="privacy-list">
                <li>
                  <p>
                    To the fullest extent permitted by law, NHD shall not be
                    liable for any indirect, incidental, special, consequential,
                    or punitive damages, or any loss of profits or revenues,
                    whether incurred directly or indirectly, or any loss of
                    data, use, goodwill, or other intangible losses, resulting
                    from (a) your use or inability to use our website or
                    products; (b) any unauthorized access to or use of our
                    servers and/or any personal information stored therein; (c)
                    any interruption or ●cessation of transmission to or from
                    our website; (d) any bugs, viruses, trojan horses, or the
                    like that may be transmitted to or through our website by
                    any third party; or (e) any errors or omissions in any
                    content or for any loss or damage incurred as a result of
                    the use of any content posted, emailed, transmitted, or
                    otherwise made available through the website.
                  </p>{" "}
                </li>
              </ul>

              <h4>Governing Law</h4>
              <ul className="privacy-list">
                <li>
                  <p>
                    These terms are governed by and construed in accordance with
                    the laws of India. Any disputes arising from these terms or
                    your use of our website shall be subject to the exclusive
                    jurisdiction of the courts located in Delhi, India.
                  </p>{" "}
                </li>
              </ul>

              <h4>Changes to Terms</h4>
              <ul className="privacy-list">
                <li>
                  <p>
                    We reserve the right to modify these terms at any time. Any
                    changes will be effective immediately upon posting on our
                    website. Your continued use of the website after any changes
                    constitute your acceptance of the new terms.
                  </p>{" "}
                </li>
              </ul>
            </ul>

            <h3 style={{ color: "#000000", fontWeight: "600" }}>Contact Us</h3>

            <p>
              If you have any questions about these terms, please contact us at:
            </p>
            <h4>Heed Textile</h4>
            <ul className="privacy-list">
              <li>
                <strong>Address :</strong>A-39, WEST PATEL NAGAR, WEST PATEL
                NAGAR, NEW DELHI, Central Delhi, Delhi, 110008 ,
              </li>
              <li>
                <strong>Email :</strong> heed.brandsin@gmail.com ,{" "}
              </li>
              <li>
                <strong>Website :</strong> - www.shopheed.com
              </li>
            </ul>
          </Container>
        </div>
      </section>
    </CommonLayout>
  );
};

export default TermsAndConditions;
