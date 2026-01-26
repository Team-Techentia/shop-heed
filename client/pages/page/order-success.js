import React from 'react';
import CommonLayout from '../../components/shop/common-layout';
import { Container, Row, Col } from 'reactstrap';
import { useRouter, useSearchParams } from 'next/navigation';

const OrderSuccess = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    const handleClick = () => {
        router.push("/");
    }

    return (
        <CommonLayout parent="home" title="order success">
            <div className="white-1">
                <Container>
                    <Row style={{ height: "60vh", alignItems: "center", justifyContent: "center" }}>
                        <Col md="10" lg="8">
                            <div className="success-text text-center">
                                <i className="fa fa-check-circle text-success" style={{ fontSize: "4rem", marginBottom: "20px" }} aria-hidden="true"></i>
                                <h2 style={{ fontWeight: "700", color: "#333", marginBottom: "15px" }}>Payment Successful! 🎉</h2>
                                <p style={{ fontSize: "16px", color: "#555", marginBottom: "10px" }}>
                                    Thank you for your order. We’ve received your payment and your order has been placed successfully.
                                </p>
                                <p style={{ fontSize: "16px", color: "#555", marginBottom: "30px" }}>
                                    You’ll receive an order confirmation shortly with all the details.
                                </p>

                                {orderId && (
                                    <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px", display: "inline-block", marginBottom: "30px" }}>
                                        <span style={{ fontSize: "18px", fontWeight: "600", color: "#333" }}>Order ID: <span className="text-primary">#{orderId}</span></span>
                                    </div>
                                )}

                                <div>
                                    <button
                                        onClick={handleClick}
                                        className="btn btn-solid"
                                        style={{ cursor: "pointer" }}
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </CommonLayout>
    )
}

export default OrderSuccess;