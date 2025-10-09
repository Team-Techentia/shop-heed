// ProductItem.jsx
import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import CartContext from "../../../helpers/cart";
import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";
import styled from "styled-components";
import Image from "next/image";
import { useRouter } from "next/router";
import { AiOutlineShoppingCart } from "react-icons/ai";

// Styled Components
const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: ${({ isMobile }) => (isMobile ? "210px" : "400px")};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const ProductContainer = styled.div`
  // border: 1px solid #f1f1f1;
  border-radius: 15px;
  background: #fff;
  position: relative;

  // padding: ${({ isMobile }) => (isMobile ? "10px" : "15px")};
  
`;

const DiscountBadge = styled.div`
  position: absolute;
  top: ${({ isMobile, isMobile1 }) => (isMobile ? (isMobile1 ? "10px" : "12px") : "20px")};
  left: ${({ isMobile }) => (isMobile ? "10px" : "20px")};
  background: linear-gradient(90deg, #4aa184, #5ab195);
  color: #fff;
  padding: ${({ isMobile }) => (isMobile ? "2px 5px" : "3px 8px")};
  border-radius: 4px;
  font-size: ${({ isMobile, isMobile1 }) => (isMobile ? (isMobile1 ? "6px" : "8px") : "12px")};
  font-weight: bold;
  z-index: 2;
`;

const CartIcon = styled.div`
  position: absolute;
  bottom: ${({ isMobile }) => (isMobile ? "8px" : "10px")};
  right: ${({ isMobile }) => (isMobile ? "8px" : "10px")};
  background: #fff;
  color: #000;
  padding: ${({ isMobile }) => (isMobile ? "3px" : "8px")};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 3;
`;

const ProductItem = ({ product, onClick }) => {
  const router = useRouter();
  const cartContext = useContext(CartContext);
  const curContext = useContext(CurrencyContext);
  const currency = curContext.state;

  const [isMobile, setIsMobile] = useState(false);
  const [isMobile1, setIsMobile1] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
      setIsMobile1(window.innerWidth <= 380);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!product) return null;

  const discountPercent = product.discount ? `SAVE ${product.discount}%` : null;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    cartContext.addToCart(product, product.id, 1);
  };

  const navigateToProduct = () => {
    router.push(
      `/product-details/${encodeURIComponent(
        product.title.replaceAll(" ", "-").replaceAll("/", "-")
      )}/${product._id}`
    );
  };

  return (
    <ProductContainer isMobile={isMobile} onClick={onClick}>
      {discountPercent && (
        <DiscountBadge isMobile={isMobile} isMobile1={isMobile1}>
          {discountPercent}
        </DiscountBadge>
      )}

      <div
        className="img-wrapper"
        style={{ position: "relative", cursor: "pointer" }}
        onClick={navigateToProduct}
      >
        <Link
          href={`/product-details/${encodeURIComponent(
            product.title.replaceAll(" ", "-").replaceAll("/", "-")
          )}/${product._id}`}
          className="front"
        >
          <ImageWrapper isMobile={isMobile}>
            <Image
              src={product.image[0]}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              priority
            />
          </ImageWrapper>
        </Link>

        <CartIcon isMobile={isMobile} onClick={handleAddToCart}>
          <AiOutlineShoppingCart size={isMobile ? 16 : 18} />
        </CartIcon>
      </div>

      {/* Brand */}
      {product.brand && (
        <p
          style={{
            marginTop: "12px",
            fontSize: isMobile ? "14px" : "18px",
            fontWeight: "500",
            color: "#000",
            marginBottom: "4px",
            marginLeft: "5px",
            letterSpacing: "1px",
            // textTransform: "uppercase",
          }}
        >
          {product.brand}
        </p>
      )}

      {/* Title */}
      <h4
        style={{
          marginTop: "4px",
          color: "gray",
          fontSize: isMobile ? "12px" : "16px",
          marginLeft: "5px",
          lineHeight: "1.5",
          fontFamily: "'Roboto', sans-serif",
          fontWeight: "500",
          textTransform: "capitalize",
        }}
      >
        {product.title}
      </h4>

      {/* Price */}
      <div style={{ marginLeft: "5px", marginTop: "4px" }}>
        {product.discount ? (
          <>
          <span
              style={{
                fontWeight: "bold",
                fontSize: isMobile ? "14px" : "18px",
                color:"000",
                // background: "linear-gradient(90deg, #4AA184, #5ab195)",
                // WebkitBackgroundClip: "text",
                // WebkitTextFillColor: "transparent",
                display: "inline-block",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              ₹{product.finalPrice}
            </span>
            <span
              style={{
                textDecoration: "line-through",
                color: "#888",
                marginLeft: "7px",
                fontSize: isMobile ? "12px" : "16px",
                fontWeight: "bold",
                letterSpacing: "1px",
              }}
            >
              ₹{product.price}
            </span>
            
          </>
        ) : (
          <span
            style={{
              fontWeight: "bold",
              fontSize: isMobile ? "14px" : "16px",
              background: "linear-gradient(90deg, #4AA184, #5ab195)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            ₹{product.price}
          </span>
        )}
      </div>

      {/* Colors */}
      {product.colors && (
        <p
          style={{
            fontSize: isMobile ? "11px" : "12px",
            color: "#555",
            textAlign: "center",
            marginTop: "6px",
          }}
        >
          {product.colors.length} colors available
        </p>
      )}
    </ProductContainer>
  );
};

export default ProductItem;
