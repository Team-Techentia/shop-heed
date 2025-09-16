import React, { useContext, useState } from "react";
import Link from "next/link";
import CartContext from "../../../helpers/cart";
import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";
import MasterProductDetail from "./MasterProductDetail";
import Image from "next/image";
import { useRouter } from "next/router";

const ProductItem = ({
  product,
  backImage,
  des,
  productDetail,
  title,
  onClick
}) => {
  const router = useRouter();
  const cartContext = useContext(CartContext);
  const curContext = useContext(CurrencyContext);
  const currency = curContext.state;
  const [image, setImage] = useState("");
  const uniqueTags = [];

  // calculate discount percent
  const discountPercent = product?.discount
    ? `${product.discount}%`
    : null;

  return (
    product && (
      <div
        style={{
          // border: "0.2px solid #cfcdcd96",
          borderRadius: "10px",
          position: "relative",
          // overflow: "hidden"
        }}
        className="product-box product-wrap"
        onClick={onClick}
      >
        {/* discount badge */}
        {discountPercent && (
          <div
            style={{
              position: "absolute",
              top: "0px",
              left: "-2px",
              background: "#ff4d4d",
              color: "#fff",
              padding: "10px 8px",
              height:"70px",
              width:"70px",
              borderRadius: "6px",
              fontSize: "8px",
              fontWeight: "bold",
              zIndex: 2,
              clipPath: "polygon(0 0, 85% 0, 0 100%)",
              display:"flex",
              flexDirection:"column",
              // alignItems:"center",
              // justifyContent:"center"
            }}
          >
            <p style={{color:"#fff",margin:0}}>{discountPercent}</p>
            <span>OFF</span>
          </div>
        )}

        {/* product image */}
        <div
          className="img-wrapper"
          onClick={() =>
            router.push(
              `/product-details/${encodeURIComponent(
                product.title.replaceAll(" ", "-").replaceAll("/", "-")
              )}/${product._id}`
            )
          }
        >
          <Link
            href={`/product-details/${encodeURIComponent(
              product.title.replaceAll(" ", "-").replaceAll("/", "-")
            )}/${product._id}`}
            className="front"
          >
            <Image
              src={image || product.image[0]}
              alt={product.title}
              layout="responsive"
              style={{ maxHeight: "325px" }}
              width={500}
              height={400}
              objectFit="cover"
              quality={75}
              placeholder="blur"
              blurDataURL={`${image || product.image[0]}?w=10&q=10`}
            />
          </Link>
        </div>

        <MasterProductDetail
          product={product}
          productDetail={productDetail}
          currency={currency}
          uniqueTags={uniqueTags}
          title={title}
          des={des}
        />


      </div>
    )
  );
};

export default ProductItem;
