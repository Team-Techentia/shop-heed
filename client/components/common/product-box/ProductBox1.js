import React, { useContext, useState } from "react";
import Link from "next/link";
import CartContext from "../../../helpers/cart";
import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";
import MasterProductDetail from "./MasterProductDetail";
import Image from "next/image";
import { useRouter  } from "next/router";

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
  console.log(product,Math.random())
  
  return ( product &&
    <div
      style={{ border: "0.2px solid #cfcdcd96", borderRadius: "10px" }}
      className="product-box product-wrap"
      onClick={onClick}
    >
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
        <div className="lable-block">
        </div>
        <Link
          href={`/product-details/${encodeURIComponent(product.title
    .replaceAll(" ", "-")
    .replaceAll("/", "-")
  )}/${product._id}`}
          className="front"
        >
          <Image
            src={image || product.image[0]}
            alt={product.title}
            layout="responsive"
            style={{maxHeight:"325px"}}
            width={500}
            height={400}
            objectFit="cover"
            quality={75} 
            placeholder="blur"
            blurDataURL={`${image || product.image[0]}?w=10&q=10`} 
          />
        </Link>
        {backImage && product.image[1] !== "undefined" && (
          <div className="back">
            <div
              style={{
                position: "absolute",
                height: "100%",
                width: "100%",
              }}
            ></div>

            <Image
              src={image || product.image[1]}
              alt={product.title}
              layout="responsive"
              width={500}
              height={400}
              objectFit="cover"
              quality={75}
              placeholder="blur"
              blurDataURL={`${image || product.image[1]}?w=10&q=10`}
            />
            <div
              style={{
                width: "100%",
                position: "relative",
                bottom: "40px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button
                className="btn btn-solid px-1 py-1"
                onClick={() => cartContext.addToCart(product, product._id, 1)}
              >
                <span>
                  <i className="fa fa-shopping-cart"></i>
                </span>{" "}
                add to cart
              </button>
            </div>
          </div>
        )}
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
  );
};

export default ProductItem;
