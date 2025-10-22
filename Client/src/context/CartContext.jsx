// src/context/CartContext.js

import React, { createContext, useState, useContext } from "react";

// 1. Create the Context
const CartContext = createContext();

// 2. Create a custom hook for easy access to the context
export const useCart = () => {
  return useContext(CartContext);
};

// 3. Create the Provider component which will hold the logic
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  /**
   * Adds a product to the cart.
   * If the product is already in the cart, it increases the quantity.
   * If not, it adds the product with a quantity of 1.
   */
  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      console.log("Item already exists",product.id)
      // If item already exists, map over the cart and update the quantity of the matching item
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      console.log("New Item Added")
      // If item is new, add it to the cart with an initial quantity of 1
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  /**
   * Removes a product from the cart completely, regardless of quantity.
   */
  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item.id !== productId));
  };

  /**
   * Calculates the total price of all items in the cart.
   */
  const getCartTotal = () => {
    const total = cartItems.reduce((sum, item) => {
      // Ensure item.price and item.quantity are numbers
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity, 10) || 0;
      return sum + price * quantity;
    }, 0);
    return total.toFixed(2); // Return total formatted to 2 decimal places
  };

  const clearCart = () => {
  setCartItems([]);
  };
  // The value provided to all consumer components
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    getCartTotal,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

