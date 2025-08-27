import React, { Fragment } from 'react';
import { Container ,Row ,Col ,Media} from 'reactstrap';
import Link from "next/link";

const CopyRight = ({layout, fluid}) => {
    return (
        <Fragment>
            <div className={`sub-footer ${layout}`}>
                <Container fluid={fluid}>
                    <Row>
                        <Col xl="6" md="6" sm="12">
                            <div className="footer-end">
                                <p><i className="fa fa-copyright" aria-hidden="true"></i> 2023-24 HEED
                                      POWERED BY   <span><Link style={{color:"inherit"}} href="https://thinkadigital.com/">ThinkADigital</Link></span></p>
                            </div>
                        </Col>
                        <Col xl="6" md="6" sm="12">
                            <div className="payment-card-bottom">
                                <ul>
                                    <li>
                                        <a href="#"><Media src={'/assets/images/icon/visa.png'} alt="" /></a>
                                    </li>
                                    <li>
                                        <a href="#"><Media src={'/assets/images/icon/mastercard.png'} alt="" /></a>
                                    </li>
                                    <li>
                                        <a href="#"><Media src={'/assets/images/icon/paypal.png'} alt="" /></a>
                                    </li>
                                    <li>
                                        <a href="#"><Media src={'/assets/images/icon/american-express.png'} alt="" /></a>
                                    </li>
                                    <li>
                                        <a href="#"><Media src={'/assets/images/icon/discover.png'} alt="" /></a>
                                    </li>
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Fragment>
    )
}

export default CopyRight;