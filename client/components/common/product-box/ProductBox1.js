// ProductItem.jsx
import React, { useContext } from "react";
import Link from "next/link";
import CartContext from "../../../helpers/cart";
import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";
import styled from "styled-components";
import Image from "next/image";
import { useRouter } from "next/router";
import { AiOutlineShoppingCart } from "react-icons/ai";

/* ================= STYLES ================= */

const ProductContainer = styled.div`
  border: 1px solid #f1f1f1;
  border-radius: 15px;
  background: #fff;
  position: relative;
  margin-bottom: 15px;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;   /* 🔥 FIX: stable height */
  border-radius: 12px;
  overflow: hidden;
  background: #f3f3f3;

  @media (max-width: 640px) {
    aspect-ratio: 2 / 3;
  }
`;

const DiscountBadge = styled.div`
  position: absolute;
  top: 6px;
  left: 0;
  background: linear-gradient(90deg, #4aa184, #5ab195);
  color: #fff;
  padding: 3px 8px;
  font-size: 10px;
  font-weight: bold;
  opacity: 0.85;
  z-index: 2;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;

  @media (min-width: 768px) {
    font-size: 12px;
    top: 12px;
  }
`;

const CartIcon = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: #fff;
  color: #000;
  padding: 6px;
  cursor: pointer;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 3;
`;

/* ================= COMPONENT ================= */

const ProductItem = ({ product }) => {
  const router = useRouter();
  const cartContext = useContext(CartContext);
  useContext(CurrencyContext); // currency future use

  if (!product) return null;

  const discountPercent = product.discount
    ? `SAVE ${product.discount}%`
    : null;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    cartContext.addToCart(product, product.id, 1);
  };

  const productUrl = `/product-details/${encodeURIComponent(
    product.title.replaceAll(" ", "-").replaceAll("/", "-")
  )}/${product._id}`;

  return (
    <ProductContainer>
      {discountPercent && <DiscountBadge>{discountPercent}</DiscountBadge>}

      <div
        style={{ position: "relative", cursor: "pointer" }}
        onClick={() => router.push(productUrl)}
      >
        <Link href={productUrl}>
          <ImageWrapper>
            <Image
              src={product.image[0]}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              style={{ objectFit: "cover" }}
            />
          </ImageWrapper>
        </Link>

        <CartIcon onClick={handleAddToCart}>
          <AiOutlineShoppingCart size={18} />
        </CartIcon>
      </div>

      {/* BRAND */}
      {product.brand && (
        <p
          style={{
            marginTop: "10px",
            fontSize: "15px",
            fontWeight: 500,
            color: "#000",
            marginLeft: "6px",
            letterSpacing: "1px",
          }}
        >
          {product.brand}
        </p>
      )}

      {/* TITLE */}
      <h4
        style={{
          marginTop: "4px",
          color: "#666",
          fontSize: "13px",
          marginLeft: "6px",
          lineHeight: "1.4",
          fontWeight: 500,
          textTransform: "capitalize",
        }}
      >
        {product.title}
      </h4>

      {/* PRICE */}
      <div style={{ marginLeft: "6px", marginTop: "6px" }}>
        {product.discount ? (
          <>
            <span
              style={{
                fontWeight: "bold",
                fontSize: "15px",
                color: "#000",
              }}
            >
              ₹{product.finalPrice}
            </span>
            <span
              style={{
                textDecoration: "line-through",
                color: "#888",
                marginLeft: "8px",
                fontSize: "13px",
                fontWeight: "bold",
              }}
            >
              ₹{product.price}
            </span>
          </>
        ) : (
          <span
            style={{
              fontWeight: "bold",
              fontSize: "15px",
              color: "#000",
            }}
          >
            ₹{product.price}
          </span>
        )}
      </div>

      {/* COLORS */}
      {product.colors && (
        <p
          style={{
            fontSize: "11px",
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
