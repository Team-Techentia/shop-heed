import React, { useContext, useEffect, useState } from 'react';
import CommonLayout from '../../../components/shop/common-layout';
import CheckoutPage from './common/checkout-page';
import Login from '../../page/account/login'
import UserContext from '../../../helpers/user/UserContext';

const Checkout = () => {
    const userContext = useContext(UserContext);
    const isLogin = userContext.isLogin
    return (
        <>
            {isLogin !== null ?
                <CommonLayout parent="home" title="checkout">
                    <CheckoutPage isLogin={isLogin} />
                </CommonLayout>
                :
                <Login />
            }
        </>
    )
}

export default Checkout;