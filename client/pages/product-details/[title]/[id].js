import React, { useState } from 'react';
import { useRouter } from 'next/router'
import CommonLayout from '../../../components/shop/common-layout';
import LeftSidebarPage from '../product/leftSidebarPage';
import { Product4 } from "../../../services/script";
import Paragraph from '../../../components/common/Paragraph';
import TopCollection from "../../../components/common/Collections/Collection3";
const LeftSidebar = () => {
  
  const router = useRouter();
  const {id , title} = router.query;
  const [topTitle , setTopTitle] = useState(title)
  
  return (
    <CommonLayout parent="Home" title={topTitle}>
      <LeftSidebarPage pathId={id}  setTopTitle={setTopTitle}/>


<div >
<Paragraph title="title1 section-t-space" inner="title-inner1" hrClass={false} titleData="YOU MAY ALSO LIKE "  titleDisData="Try our most selling products and make your life health and better."/>
<TopCollection noTitle="null" backImage={true} type="fashion" title="Most Selling Products" subtitle="special offer" productSlider={Product4} designClass="section-b-space p-t-0 ratio_asos px-2" noSlider="false" cartClass="cart-info cart-wrap" />
</div>
    </CommonLayout>
  );
}


export default LeftSidebar;