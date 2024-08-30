import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import '../cart.css'

const Cart = () => {
  const { cart, removeFromCart, fetchCart } = useContext(CartContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        await fetchCart();
        setError(null);
      } catch (err) {
        setError('Error al cargar el carrito. Por favor, intente de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, [fetchCart]);

  const handleRemoveFromCart = async (productId) => {
    try {
      await removeFromCart(productId);
      await fetchCart();
    } catch (err) {
      setError('Error al eliminar el producto del carrito.');
    }
  };

  if (isLoading) return <p>Cargando carrito...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="product-cart">
      <h2>Su carrito</h2>
      {cart.items.length === 0 ? (
        <p>Su carrito está vacío</p>
      ) : (
        cart.items.map(item => (
          <div key={item.productId} className="product-cart-item">
            <h3>{item.name}</h3>
            <p>Cantidad: {item.quantity}</p>
            <p>Precio: ${(item.price * item.quantity).toFixed(2)}</p>
            <button onClick={() => handleRemoveFromCart(item.productId)}>Eliminar</button>
          </div>
        ))
      )}
      <p>Total: ${cart.total.toFixed(2)}</p>
      {cart.items.length > 0 && <Link to="/checkout">Proceder a la compra</Link>}
    </div>
  );
};

export default Cart;
