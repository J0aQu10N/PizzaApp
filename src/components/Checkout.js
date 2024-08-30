import React, { useContext, useState } from 'react';
import axios from 'axios';
import { CartContext } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../config';

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useAuth();
  const [address, setAddress] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Inicie sesión para completar su pedido');
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/orders`, {
        userId: user.id,
        items: cart,
        address,
        createdAt: new Date()
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.status === 201) {
        clearCart();
        alert('¡Pedido realizado con éxito!');
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('Error al agregar una orden: ', error);
      alert('Se ha producido un error al procesar el pedido. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Dirección de entrega"
          required
        />
        <button type="submit">Realizar pedido</button>
      </form>
    </div>
  );
};

export default Checkout;