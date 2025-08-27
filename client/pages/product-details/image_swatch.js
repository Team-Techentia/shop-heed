import React from "react";
import CommonLayout from "../../components/shop/common-layout";
import ImageSwatchPage from "./product/ImageSwatchPage";


const ImageSwatch = () => {
  return (
    <CommonLayout parent="home" title="product">
      <ImageSwatchPage />
    </CommonLayout>
  );
};

export default ImageSwatch;
