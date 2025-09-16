import React, { useContext, useState } from 'react'
import { LoaderContext } from "../../../helpers/loaderContext"
import { useQuery } from '@tanstack/react-query';
import Api from '../../Api';
import { Row, Col, Container } from "reactstrap";
import PostLoader from '../PostLoader';
import ProductItems from "../product-box/ProductBox1";

export default function TopCollection(dataContStart , dataContEnd, title, subtitle, designClass, noSlider, cartClass, productSlider, titleClass, noTitle, innerClass, inner, backImage) {
    const { catchErrors, setLoading, loading } = useContext(LoaderContext);
    const [product, setProduct] = useState([]);
    const [modal, setModal] = useState(false);
    const { data, isLoading, } = useQuery({
        queryKey: ['getNewProduct'],
        queryFn: async () => {
            const res = await Api.getNewProduct();
            const data = res.data.data.filter(item => item)
            console.log(data)
            return data;
        },
        staleTime: 60000,
        cacheTime: 120000,
        refetchInterval: 60000,
        onError: (error) => {
            catchErrors(error);
        },
        onSettled: () => {
            setLoading(false);
        },
    });

    return (
        <div>
            {/* {data?.map((product, idx) => (
                <div className=''>{product.brand} {product.type}</div>
            ))} */}
            <Container>
                <Row className="margin-default">
                    {loading ? (
                        <div className="row margin-default">
                            <div className="col-xl-3 col-lg-4 col-6">
                                <PostLoader />
                            </div>
                            <div className="col-xl-3 col-lg-4 col-6">
                                <PostLoader />
                            </div>
                            <div className="col-xl-3 col-lg-4 col-6">
                                <PostLoader />
                            </div>
                            <div className="col-xl-3 col-lg-4 col-6">
                                <PostLoader />
                            </div>
                        </div>
                    ) : (
                        data &&
                        data.slice(0, 20).map((product, index) => (
                            <Col xl="3" sm="6" xs="6" key={index}>
                                <div>
                                    <ProductItems product={product} backImage={backImage} title={title} cartClass={cartClass} key={index} />
                                </div>
                            </Col>
                        ))
                    )}
                </Row>
            </Container>
        </div>
    )
}
