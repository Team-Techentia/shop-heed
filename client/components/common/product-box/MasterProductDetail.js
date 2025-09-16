import React from "react";
import Link from "next/link";

const MasterProductDetail = ({
  product,
}) => {
  let RatingStars = [];
  let rating = 5;
  for (var i = 0; i < rating; i++) {
    RatingStars.push(
      <i className="fa fa-star" style={{ color: "#ffa200" }} key={i}></i>
    );
  }

  return (
    <div style={{ position: "relative" }} className={`product-detail `}>
      <Link
        href={`/product-details/${encodeURIComponent(product.title
          .replaceAll(" ", "-")
          .replaceAll("/", "-")
        )}/${product._id}`}
      >

        <div  className="bg-grey" style={{ display: "flex", justifyContent: "center",position:"relative" ,   }}>
         
          <h5 className="mt-2">
            ₹{product.finalPrice}
            <del>
              <span className="money">
                ₹<b> {product.price}</b>
              </span>
            </del>
          </h5>
        </div>
        <div style={{ height: "53px" }}>
          <h5 style={{ marginBottom: "0px"  }} className="pt-2">
            {product.title && product.title.slice(0,40)}
          </h5>
        </div>
        <button
          className="btn btn-solid w-100"
          onClick={(e) => {
            e.stopPropagation();
            cartContext.addToCart(product, product._id, 1);
            router.push(
              `/product-details/${encodeURIComponent(
                product.title.replaceAll(" ", "-").replaceAll("/", "-")
              )}/${product._id}`
            );
          }}
        >
          <i className="fa fa-shopping-cart" style={{ marginRight: "6px" }}></i>
          Add to Cart
        </button>

       
        {product.type === "jewellery" ||
        product.type === "nursery" ||
        product.type === "beauty" ||
        product.type === "electronics" ||
        product.type === "goggles" ||
        product.type === "watch" ||
        product.type === "pets" ? (
          ""
        ) : (
          <>
           
          </>
        )}
      </Link>
    </div>
  );
};

export default MasterProductDetail;
