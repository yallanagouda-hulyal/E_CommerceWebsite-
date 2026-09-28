import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product === product._id);
      if (existing) {
        return prev.map((i) =>
          i.product === product._id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [
        ...prev,
        { product: product._id, name: product.name, price: product.price, image: product.image, qty },
      ];
    });
  };

  const removeFromCart = (id) => setItems((prev) => prev.filter((i) => i.product !== id));
  const updateQty = (id, qty) =>
    setItems((prev) => prev.map((i) => (i.product === id ? { ...i, qty: Math.max(1, qty) } : i)));
  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}
