
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import '../cart.css'
const Cart = () => {
  const { cart, removeFromCart } = useContext(CartContext);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="product-cart">
      <h2>Su carrito</h2>
      {cart.map(item => (
        <div key={item.id}className="product-cart">
          <h3>{item.name}</h3>
          <p>Quantity: {item.quantity}</p>
          <p>Price: ${item.price * item.quantity}</p>
          <button onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      ))}
      <p>Total: ${total}</p>
      <Link to="/checkout">Proceder a la compra</Link>
    </div>
  );
};

export default Cart;

