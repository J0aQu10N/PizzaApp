import React, { createContext, useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const fetchCart = async () => {
        const cartDoc = await getDoc(doc(db, 'carts', user.uid));
        if (cartDoc.exists()) {
          setCart(cartDoc.data().items);
        }
      };
      fetchCart();
    }
  }, [user]);

  const addToCart = (product, quantity) => {
    setCart(prevCart => {
      const updatedCart = [...prevCart];
      const existingItem = updatedCart.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        updatedCart.push({ ...product, quantity });
      }
      if (user) {
        setDoc(doc(db, 'carts', user.uid), { items: updatedCart });
      }
      return updatedCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter(item => item.id !== productId);
      if (user) {
        setDoc(doc(db, 'carts', user.uid), { items: updatedCart });
      }
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    if (user) {
      setDoc(doc(db, 'carts', user.uid), { items: [] });
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};