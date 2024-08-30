import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/verify-token`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
      setIsAdmin(response.data.isAdmin);
    } catch (error) {
      console.error('Token verification error:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      localStorage.setItem('token', response.data.token);
      setUser({ id: response.data.id, email });
      setIsAdmin(response.data.isAdmin);
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  };
  
  const register = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/register`, { email, password });
      localStorage.setItem('token', response.data.token);
      setUser({ id: response.data.id, email });
      setIsAdmin(response.data.isAdmin);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      throw error;
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);