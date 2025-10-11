import React, { useContext, Fragment, useState, useEffect } from "react";
import Link from "next/link";
import CartContext from "../../helpers/cart";
import { Media } from "reactstrap";
import { useRouter } from "next/router";

const CartContainer = ({ icon }) => {
  const context = useContext(CartContext);
  const cartList = context.state;
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  const goToCart = () => {
    router.push("/page/account/cart");
  };

  // Animate popup every second
  useEffect(() => {
    if (cartList.length > 0) {
      const interval = setInterval(() => {
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 900);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [cartList.length]);

  return (
    <Fragment>
      <style jsx>{`
        .cart-qty-cls {
          transition: all 0.3s ease;
        }
        
        .cart-popup {
          animation: cartPulse 0.9s cubic-bezier(0.36, 0.07, 0.19, 0.97);
        }
        
        @keyframes cartPulse {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            box-shadow: 0 0 0 rgba(255, 0, 0, 0.7);
          }
          15% {
            transform: scale(1.3) rotate(-5deg);
          }
          30% {
            transform: scale(1.5) rotate(5deg);
            box-shadow: 0 0 15px rgba(255, 0, 0, 0.8);
          }
          45% {
            transform: scale(1.3) rotate(-3deg);
          }
          60% {
            transform: scale(1.4) rotate(3deg);
            box-shadow: 0 0 10px rgba(255, 0, 0, 0.6);
          }
          75% {
            transform: scale(1.15) rotate(-2deg);
          }
        }
        
        .cart-icon-shake {
          animation: iconShake 0.9s ease;
        }
        
        @keyframes iconShake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70% {
            transform: translateX(-2px) rotate(-2deg);
          }
          20%, 40%, 60% {
            transform: translateX(2px) rotate(2deg);
          }
        }
      `}</style>
      
      <li style={{cursor:"pointer"}} className="onhover-div"> 
        <Link href={`/page/account/cart`}>
          <div 
            style={{display: cartList.length > 0 ? "" : "none"}} 
            className={`cart-qty-cls ${showPopup ? 'cart-popup' : ''}`}
          >
            {cartList.length}
          </div>
        
          <div href={null}>
            <Media 
              style={{height:"23px"}}  
              src={icon} 
              className={`img-fluid ${showPopup ? 'cart-icon-shake' : ''}`}
              alt=""
              onClick={goToCart}
            />
          </div>
        </Link>
      </li>
    </Fragment>
  );
};

export default CartContainer;