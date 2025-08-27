import React from 'react';
import CommonLayout from '../../../components/shop/common-layout';
import Dashboard from './common/dashboard';
import ProtectedRoute from '../../../components/protectRoutes/ProtectedRoute';
const VendorDashboard = () => {
    return (
        <CommonLayout parent="home" title="user profile">
            <Dashboard />
        </CommonLayout>
    )
}

export default ProtectedRoute(VendorDashboard);