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
    const [isTablet, setIsTablet] = useState(false);

  // detect mobile screen
  useEffect(() => {
    const handleResize = () => {
      setIsTablet(window.innerWidth <= 800);
      setIsMobile(window.innerWidth <= 640);
      setIsMobile1(window.innerWidth <= 380);
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
              top: isMobile  ?isMobile1?  "15px" :"18px": "20px",
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
      marginTop: "15px",
      fontSize: isMobile ? "15px" : "20px",
      fontWeight: "600",
      color: "#000",
      marginBottom: "4px",
      marginLeft: "7px",
      letterSpacing: "1px", // Increased character spacing for better readability
      textTransform: "uppercase", // Added text transformation for a more modern look
    }}
  >
    {product.brand}
  </p>
)}

{/* Product Title */}
<h4
  style={{
    marginTop: "6px",
    color: "gray",
    fontSize: isMobile ? "13px" : "16px",
    marginLeft: "7px",
    letterSpacing: "1.5px", // Increased character spacing for the title
    fontFamily: "'Roboto', sans-serif", // Added modern font
    fontWeight: "500", // Slightly reduced font weight for a balanced look
    textTransform: "capitalize", // Capitalizes the first letter of each word
  }}
>
  {product.title}
</h4>

{/* Price Section */}
<div style={{ marginLeft:"8px", marginTop: "0px" }}>
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
          letterSpacing: "1px", // Slight character spacing for original price
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
          letterSpacing: "1px", // Increased character spacing for the final price
          textTransform: "uppercase", // Added uppercase for the discounted price
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
        letterSpacing: "1px", // Added spacing to the price
        textTransform: "uppercase", // Uppercase for consistency
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
