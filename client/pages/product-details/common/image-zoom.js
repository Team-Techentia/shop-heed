import React from 'react';
import Image from 'next/image';

const ImageZoom = (props) => {
  const { image, maxHeight, onClick } = props;

  return (
    <div style={{ maxHeight: maxHeight ? maxHeight : "", overflow: "hidden" }} onClick={onClick}>
      <Image
        src={image}
        alt="Product Image"
        layout="responsive"
        width={500}
        height={maxHeight ? parseInt(maxHeight) : 650} 
        objectFit="cover"
        quality={75} 
        placeholder="blur"
        blurDataURL={`${image}?w=10&q=10`} 
      />
    </div>
  );
};

export default ImageZoom;
