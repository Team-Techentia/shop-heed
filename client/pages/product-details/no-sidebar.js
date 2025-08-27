import React from 'react';
import CommonLayout from '../../components/shop/common-layout';
import ProductSection from './common/product_section';
import NoSidebarPage from './product/noSidebarPage';

const LeftSidebar = () => {
  return (
    <CommonLayout parent="home" title="product">
        <NoSidebarPage pathId="1" />
      <ProductSection />
    </CommonLayout>
  );
}


export default LeftSidebar;