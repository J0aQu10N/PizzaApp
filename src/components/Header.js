import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../Header.css'

const Header = () => {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="header">
      <nav className="nav-menu">
      <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/products">Menú de productos</Link></li>
        <li><Link to="/cart">Carrito de compras</Link></li>
        {isAdmin && <li><Link to="/dashboard">Dashboard</Link></li>}
        {user ? (
          <>
            <li><span>Bienvenido, {user.email}</span></li>
            <li><button onClick={logout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Iniciar Sesión</Link></li>
            <li><Link to="/register">Registrarse</Link></li>
          </>
        )}
      </ul>
      </nav>  
    </header>
  );
};

export default Header;