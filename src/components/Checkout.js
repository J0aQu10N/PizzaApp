import React, { useContext, useState } from 'react';
import { CartContext } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

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
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        items: cart,
        address,
        createdAt: new Date()
      });
      clearCart();
      alert('¡Pedido realizado con éxito!');
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