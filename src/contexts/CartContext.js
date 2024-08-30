import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const { user } = useAuth();

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
  });

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [], total: 0 });
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/cart`, {
        headers: getAuthHeaders()
      });
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart({ items: [], total: 0 });
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product, quantity) => {
    try {
      const response = await axios.post(`${API_URL}/cart`, { product, quantity }, {
        headers: getAuthHeaders()
      });
      setCart(response.data);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await axios.delete(`${API_URL}/cart/${productId}`, {
        headers: getAuthHeaders()
      });
      setCart(response.data);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`${API_URL}/cart`, {
        headers: getAuthHeaders()
      });
      setCart({ items: [], total: 0 });
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};