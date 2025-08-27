import React from "react";
import CommonLayout from "../../components/shop/common-layout";
import { Container } from "reactstrap";

const PrivacyPolicy = () => {
  return (
    <CommonLayout title="Privacy Policy" parent="home">
      <section
        style={{ marginBottom: "50px", paddingTop:"30px" }}
        className="section-b-space ratio_asos privacy-policy"
      >
        <div className="collection-wrapper">
        <Container>
            <p>
              {" "}
           
                Welcome to Heed . We value your privacy and are committed
                to protecting your data. This privacy policy explains how we
                coll ect, use, disclose, and safeguard your information when you
                visit our website www.shopheed.com or purchase our products.
           
            </p>

            <h3 style={{color:"#000000" , fontWeight:"600"}}>
             Information We Collect:
            </h3>

            <p>We may collect and process the following data about you:</p>
            <h4>
            
             Personal Information
            </h4>

            <ul className="privacy-list">
              <li><p>Name</p></li>
              <li><p>Email address</p></li>
              <li><p>Phone number</p></li>
              <li><p>Shipping and billing address</p></li>
              <li><p>Payment information</p></li>
            </ul>

            <h4>
            Non-Personal Information
            </h4>

            <ul className="privacy-list">
              <li><p>IP address</p></li>
              <li><p>Browser type</p></li>
              <li><p>Operating system</p></li>
              <li><p>Website usage data</p></li>
              <li><p>Cookies and tracking technologies</p></li>
            </ul>
            <br/>

            <h3 style={{color:"#000000" , fontWeight:"600"}}>
             
             How We Use Your Information
            </h3>
            <p>We use the information we collect in various ways, including:</p>

            <ul >
              <h4>
               Provide and Improve Our Services
              </h4>
              <ul className="privacy-list">
                {" "}
                <li>
            <p>      Fulfill Orders: Process and fulfill your orders, including
            shipping products and managing payments.</p>{" "}
                </li>
                <li>
                 <p> Customer Support: Respond to your inquiries, provide customer
                 support, and address any issues.</p>
                </li>
                <li>
                 <p> Personalization: Customize your experience by presenting
                 products and content tailored to your preferences.</p>
                </li>
              </ul>
              <h4>
             
              Communication
              </h4>

              <ul className="privacy-list">
                <li>
                 <p> Marketing: Send you promotional emails, newsletters, and
                 offers about our products, with your consent.</p>{" "}
                </li>
                <li>
                  {" "}
                <p>  Transactional: Send you order confirmations, invoices,
                technical notices, updates, and security alerts.</p>
                </li>
              </ul>
              <h4>
               Analytics and Research
              </h4>

              <ul className="privacy-list">
                <li>
               <p>   Performance Monitoring: Monitor and analyze usage and trends
                  to improve the user experience and functionality of our
                  website.</p>{" "}
                </li>
                <li>
                 <p> Product Development: Conduct research and development to
                 create new products and improve existing ones</p>{" "}
                </li>
              </ul>
              <h4>
              Legal and Compliance
              </h4>

              <ul className="privacy-list">
                <li>
               <p>   Regulatory Compliance: Comply with applicable laws,
               regulations, and legal processes.</p>{" "}
                </li>
                <li>
                 <p> Fraud Prevention: Detect, investigate, and prevent fraudulent
                 transactions and other illegal activities.</p>
                </li>
                <li>
                 <p> Enforcement of Policies: Enforce our terms and conditions and
                 other legal agreements.</p>
                </li>
              </ul>
              <h4>
               Website and Security
              </h4>

              <ul className="privacy-list">
                <li>
                 <p> Website Maintenance: Manage and maintain our website,
                 including troubleshooting, data analysis, and testing.</p>{" "}
                </li>
                <li>
              <p>    Security: Protect the security and integrity of our website,
              products, and business.</p>{" "}
                </li>
              </ul>
            </ul>

            <h4>
             Sharing Your Information
            </h4>
            <p>We may share your information in the following situations:</p>
            <ul className="privacy-list">
              <li>
               <p> With Service Providers: We may share your information with
                third-party vendors, service providers, and agents who perform
                services on our behalf.</p>{" "}
              </li>
              <li>
               <p> Business Transfers: In the event of a merger, acquisition, or
                sale of assets, your information may be transferred to the
                acquiring entity.</p>
              </li>
              <li>
              <p>  Legal Obligations: If required by law, we may disclose your
                information to comply with legal processes or governmental
                requests.</p>
              </li>
              <li>
               <p> Protection of Rights: We may disclose your information to
                enforce our policies, and protect our rights, privacy, safety,
                or property, and that of others.</p>{" "}
              </li>
            </ul>
            <br/>
            <h3 style={{color:"#000000" , fontWeight:"600"}}>  
             Your Rights
            </h3>
            <p>You have the right to:</p>
            <ul className="privacy-list">
              <li>
                {" "}
       <p>         Access: Request access to the personal data we hold about you.</p>
              </li>
              <li>
                {" "}
              <p>  Correction: Request corrections to any inaccurate or incomplete
              personal data.</p>
              </li>
              <li>
              <p>  Opt-Out: Opt-out of receiving marketing communications from us
              at any time.</p>
              </li>
            </ul>
          </Container>
        </div>
      </section>
    </CommonLayout>
  );
};

export default PrivacyPolicy;
