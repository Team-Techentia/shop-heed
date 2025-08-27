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
        <div style={{ height: "53px" }}>
          <h5 style={{ marginBottom: "0px"  }} className="pt-2">
            {product.title && product.title.slice(0,40)}
          </h5>
        </div>

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
