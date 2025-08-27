import React, { useState, useEffect, useContext } from "react";
import Context from "./index";
import toast, { Toaster } from "react-hot-toast";
import { LoaderContext } from "../loaderContext";
const CartProvider = (props) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const LoaderContextData = useContext(LoaderContext);
  const { catchErrors } = LoaderContextData;

  useEffect(() => {
    fetchCart();
  }, []);
  const fetchCart = async () => {
    try {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(cart);
      const totalPrice = cart.reduce(
        (total, item) => total + item.product.finalPrice * item.quantity,
        0
      );
      setCartTotal(totalPrice);
    } catch (error) {
      catchErrors(error);
    }
  };



  const updateQuantity = async (product,id, quantity) => {
    
    try {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingProductIndex = cart.findIndex(
        (item) => item.product._id === product._id
      );

      if (existingProductIndex >= 0) {
        cart[existingProductIndex].quantity += quantity;
      } 
      localStorage.setItem("cart", JSON.stringify(cart));
      fetchCart();
      return 
    } catch (error) {
      return toast.error("Error adding product to cart");
    }
  };

  const addToCart = async (product,id, quantity) => {
    try {
      const localPayLoad = { product, quantity };
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingProductIndex = cart.findIndex(
        (item) => item.product._id === product._id
      );

      if (existingProductIndex >= 0) {
        if (cart[existingProductIndex].quantity >= 10) {
          return;
        }

        cart[existingProductIndex].quantity += quantity;
      } else {
        cart.push(localPayLoad);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      fetchCart();
      return toast.success("Product Added  Successfully!");
    } catch (error) {
      return toast.error("Error adding product to cart");
    }
  };
  const removeFromCart = async (productId) => {
    try {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart = cart.filter((item) => item.product._id !== productId);
      localStorage.setItem("cart", JSON.stringify(cart));
      toast.success("Product Removed Successfully!");
      fetchCart();
    } catch (error) {
      toast.error("Error removing product from cart");
    }
  };

  const clearCart = async () => {
    setCartTotal(0);
    setCartItems([]);
    localStorage.removeItem("cart");

  };

  return (
    <Context.Provider
      value={{
        ...props,
        state: cartItems,
        cartTotal,
        addToCart: addToCart,
        removeFromCart: removeFromCart,
        fetchCart,
        clearCart,
        updateQuantity
      }}
    >
      {props.children}

      <Toaster position="top-center" />
    </Context.Provider>
  );
};

export default CartProvider;
