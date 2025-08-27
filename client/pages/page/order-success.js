import React from 'react';
import CommonLayout from '../../components/shop/common-layout';
import { Container, Row, Col } from 'reactstrap';


const OrderSuccess = () => {
    return (
        <CommonLayout parent="home" title="order success">
            <div className=" white-1">
                <Container>
                    <Row style={{height:"50vh" , alignItems:"center"}}>
                        <Col md="12" >
                            <div className="success-text"><i className="fa fa-check-circle" aria-hidden="true"></i>
                                <h2>thank you</h2>
                                <p>Payment is successfully processsed and your order is on the way</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </CommonLayout>
    )
}

export default OrderSuccess;