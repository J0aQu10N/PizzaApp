import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import '../DashboardCart.css';

function DashboardCarts() {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCarts();
  }, []);

  const fetchCarts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/carts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Carritos obtenidos:", response.data);
      setCarts(response.data);
      setError(null);
    } catch (error) {
      console.error("Error al obtener los carritos:", error);
      setError("No se pudieron cargar los carritos. Por favor, intente de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCart = async (userId) => {
    if (!window.confirm("¿Está seguro de que desea eliminar este carrito?")) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/cart/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCarts(carts.filter(cart => cart.userId !== userId));
    } catch (error) {
      console.error("Error al eliminar el carrito:", error);
      alert("No se pudo eliminar el carrito. Por favor, intente de nuevo.");
    }
  };

  if (loading) return <div>Cargando carritos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="Cart-dash">
      <h2>Gestión de Carritos</h2>
      {carts.length === 0 ? (
        <p>No hay carritos activos.</p>
      ) : (
        carts.map(cart => (
          <div key={cart.userId} className="cart-item">
            <h3>Carrito de {cart.userEmail}</h3>
            <ul>
              {cart.items.map(item => (
                <li key={item.id}>
                  {item.name} - Cantidad: {item.quantity} - Precio: ${item.price.toFixed(2)}
                </li>
              ))}
            </ul>
            <p>Total: ${cart.total.toFixed(2)}</p>
            <button onClick={() => handleDeleteCart(cart.userId)}>Eliminar Carrito</button>
          </div>
        ))
      )}
    </div>
  );
}

export default DashboardCarts;