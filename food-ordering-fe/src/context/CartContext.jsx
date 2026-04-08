/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addItem = (food) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.foodId === food.id);
      if (existing) {
        return prev.map((i) =>
          i.foodId === food.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...prev,
        { foodId: food.id, name: food.name, price: food.price, quantity: 1 },
      ];
    });
  };

  const removeItem = (foodId) => {
    setCart((prev) => prev.filter((i) => i.foodId !== foodId));
  };

  const updateQty = (foodId, quantity) => {
    if (quantity <= 0) {
      removeItem(foodId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.foodId === foodId ? { ...i, quantity } : i)),
    );
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, updateQty, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
