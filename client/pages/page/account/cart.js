import React from 'react';
import CommonLayout from '../../../components/shop/common-layout';
import CartPage from './common/cart-page';
import ProtectedRoute from '../../../components/protectRoutes/ProtectedRoute';


const Wishliat = () => {
    return (
        <CommonLayout parent="home" title="cart">
            <CartPage />
        </CommonLayout>
    )
}

export default Wishliat;