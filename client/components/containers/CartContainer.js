import React, { useContext, Fragment } from "react";
import Link from "next/link";
import CartContext from "../../helpers/cart";
import { Media } from "reactstrap";
import { useRouter } from "next/router";

const CartContainer = ({ icon }) => {
  const context = useContext(CartContext);
  const cartList = context.state;
  const router = useRouter();

  const goToCart = () => {
    router.push("/page/account/cart");
  };


  return (
    <Fragment>
      <li style={{cursor:"pointer"}} className="onhover-div "> 
      <Link href={`/page/account/cart`}>
        <div style={{display:cartList.length > 0 ? "":"none"}} className="cart-qty-cls">{cartList.length }</div>
      
          <div href={null}>
            <Media style={{height:"23px"}}  src={icon} className="img-fluid" alt=""
             onClick={goToCart}
              />
          </div>
        </Link>
      </li>
    </Fragment>
  );
};

export default CartContainer;