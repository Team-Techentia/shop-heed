import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import CartContext from "../../../helpers/cart";
import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";
import Image from "next/image";
import { useRouter } from "next/router";
import { AiOutlineShoppingCart } from "react-icons/ai";

const ProductItem = ({ product, backImage, des, productDetail, title, onClick }) => {
  const router = useRouter();
  const cartContext = useContext(CartContext);
  const curContext = useContext(CurrencyContext);
  const currency = curContext.state;
  const [image, setImage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isMobile1, setIsMobile1] = useState(false);

  // detect mobile screen
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
      setIsMobile1(window.innerWidth <= 380) // mobile breakpoint
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // discount text
  const discountPercent = product?.discount ? `SAVE ${product.discount}%` : null;

  return (
    product && (
      <div
        style={{
          border: "1px solid #f1f1f1",
          borderRadius: "10px",
          padding: "10px",
          background: "#fff",
          position: "relative",
        }}
        className="product-box product-wrap"
        onClick={onClick}
      >
        {/* discount badge */}
        {discountPercent && (
          <div
            style={{
              position: "absolute",
              top: isMobile  ?isMobile1? "16px" :"15px": "20px",
              left: isMobile ? "15px" : "20px",
              background: "linear-gradient(90deg, #4AA184, #5ab195)",
              color: "#fff",
              padding: isMobile ? "2px 6px" : "3px 8px",
              borderRadius: "4px",
              fontSize: isMobile ?isMobile1? "6px":"8px" : "12px",
              fontWeight: "bold",
              zIndex: 2,
            }}
          >
            {discountPercent}
          </div>
        )}

        {/* product image */}
        <div
          className="img-wrapper"
          style={{ position: "relative", cursor: "pointer" }}
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
              style={{ maxHeight: "500px", borderRadius: "8px" }}
              width={600}
              height={500}
              // objectFit="cover"
              quality={100}
              placeholder="blur"
              blurDataURL={`${image || product.image[0]}?w=10&q=10`}
            />
          </Link>

          {/* Add to Cart Icon */}
          <div
            onClick={(e) => {
              e.stopPropagation(); // prevent redirect
              cartContext.addToCart(product,product.id,1);
            }}
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
              background: "#fff",
              color: "#000",
              padding: isMobile ? "3px":"8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "5px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              zIndex: 3,
            }}
          >
            <AiOutlineShoppingCart size={18} />
          </div>
        </div>

        {/* Product Brand */}
        {product.brand && (
          <p
            style={{
              marginTop:"7px",
              fontSize: isMobile ? "15px" : "20px",
              fontWeight: "600",
              color: "#000",
              marginBottom: "4px",
              textAlign: "center",
            }}
          >
            {product.brand}
          </p>
        )}

        {/* Product Title */}
        <h4
          style={{
            marginTop: "10px",
            color: "gray",
            fontSize: isMobile ? "13px" : "16px",
            textAlign: "center",
          }}
        >
          {product.title}
        </h4>

        {/* Price Section */}
        <div style={{ margin: "8px 0", textAlign: "center" }}>
          {product?.discount ? (
            <>
              {/* Original Price */}
              <span
                style={{
                  textDecoration: "line-through",
                  color: "#888",
                  marginRight: "8px",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                ₹{product.price}
              </span>

              {/* Discounted Price */}
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  background: "linear-gradient(90deg, #4AA184, #5ab195)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "inline-block",
                }}
              >
                ₹{product.finalPrice}
              </span>
            </>
          ) : (
            <span
              style={{
                fontWeight: "bold",
                fontSize: "16px",
                background: "linear-gradient(90deg, #4AA184, #5ab195)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
              }}
            >
              ₹{product.price}
            </span>
          )}
        </div>

        {/* Colors available */}
        {product.colors && (
          <p style={{ fontSize: "12px", color: "#555", textAlign: "center" }}>
            {product.colors.length} colors available
          </p>
        )}
      </div>
    )
  );
};

export default ProductItem;
