import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DashboardProducts from './pages/DashboardProducts';
import DashboardUsers from './pages/DashboardUsers';
import DashboardCarts from './pages/DashboardCarts';


const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user || !isAdmin) {
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <div className="App">
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard/*" element={
                    <AdminRoute>
                    <Dashboard />
                  </AdminRoute>
                } />
                <Route path="./dashboard/products" element={
                  <AdminRoute>
                    <DashboardProducts />
                  </AdminRoute>
                } />
                <Route path="/dashboard/users" element={
                  <AdminRoute>
                    <DashboardUsers />
                  </AdminRoute>
                } />
                <Route path="/dashboard/carts" element={
                  <AdminRoute>
                    <DashboardCarts />
                  </AdminRoute>
                } />
              </Routes>
              <Footer />
            </div>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;