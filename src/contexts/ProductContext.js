import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/products`, { withCredentials: true });
        setProducts(response.data);
      } catch (error) {
        setError('Error fetching products: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
};
