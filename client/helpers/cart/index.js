import React, { createContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // 🔥 LOAD CART FROM LOCALSTORAGE
  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // 🔥 SAVE CART TO LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ ADD TO CART
  const addToCart = (product, id, qty = 1) => {
    setCartItems((prev) => {
      const exist = prev.find((item) => item._id === id);

      if (exist) {
        return prev.map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }

      return [...prev, { ...product, quantity: qty }];
    });
  };

  // ✅ REMOVE FROM CART
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  // 🔥 CLEAR CART (FOR BUY NOW)
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart, // 👈 IMPORTANT
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
