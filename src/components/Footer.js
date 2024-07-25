import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Acerca de Nosotros</h3>
          <p>¡Entregamos las mejores pizzas de la ciudad, directamente a la puerta de tu casa!</p>
        </div>
        <div className="footer-section">
          <h3>Enlaces rápidos</h3>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/products">Menu de productos</Link></li>
            <li><Link to="/cart">Carrito</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contactenos</h3>
          <p>Email: mianonna@pizzadelivery.com</p>
          <p>Phone: (381) 415-7890</p>
        </div>
        <div className="footer-section">
          <h3>Siguenos</h3>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; Mia Nonna Pizza Delivery. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;