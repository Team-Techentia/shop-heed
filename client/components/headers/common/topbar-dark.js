import React from "react";
import { Container, Row, Col } from "reactstrap";
import styles from "../../../public/assets/scss/TopBarDark.module.css";

const TopBarDark = ({ topClass, fluid }) => {
  return (
    <div className={topClass}>
      <Container fluid={fluid}>
        <Row>
          <Col lg="12">
            <div className={`${styles.marquee} header-contact`}>
              <div className={styles.marqueeContent}>
                <ul>
                  <li>ENJOY FREE SHIPPING ACROSS INDIA!
                  NO-QUESTIONS-ASKED EXCHANGE &amp; RETURN POLICY</li>
                  {/* <li style={{marginLeft:"200px"}}>BUY 2 get FLAT 15% OFF. Use Code: HEEDTWO</li> */}
                </ul>
              </div>
              {/* <div  className={styles.marqueeContent}>
                <ul>
                  <li>Shop above Rs.3999. Get FREE DELIVERY & EXTRA 20% OFF</li>
                  <li style={{marginLeft:"200px"}}>Use Code: HEED20 on orders above Rs.3999</li>
                </ul>
              </div> */}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TopBarDark;
