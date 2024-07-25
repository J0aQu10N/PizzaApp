/*
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import '../DashboardCart.css';

function DashboardCarts() {
  const [carts, setCarts] = useState([]);

  useEffect(() => {
    const fetchCarts = async () => {
      const cartsCollection = collection(db, 'carts');
      const cartsSnapshot = await getDocs(cartsCollection);
      const cartsList = cartsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCarts(cartsList);
    };
    fetchCarts();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'carts', id));
    // Elimina el carrito del estado local
    setCarts(carts.filter(cart => cart.id !== id));
  };

  return (
    <div className="Cart-dash">
      <h2>Gestión de Carritos</h2>
      {carts.map(cart => (
        <div key={cart.id}>
          <h3>Carrito de {cart.userId}</h3>
          <p>Total: ${cart.total}</p>
          <ul>
            {cart.items.map(item => (
              <li key={item.productId}>
                {item.productName} - Cantidad: {item.quantity}
              </li>
            ))}
          </ul>
          <button onClick={() => handleDelete(cart.id)}>Eliminar Carrito</button>
        </div>
      ))}
    </div>
  );
}

export default DashboardCarts;
*/

import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, doc, deleteDoc, getDoc } from 'firebase/firestore';
import '../DashboardCart.css';

function DashboardCarts() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersCollection = collection(db, 'orders');
        const ordersSnapshot = await getDocs(ordersCollection);
        const ordersList = await Promise.all(ordersSnapshot.docs.map(async (orderDoc) => {
          const orderData = orderDoc.data();
          // Obtener la información del usuario
          const userDocRef = doc(db, 'users', orderData.userId);
          const userDocSnap = await getDoc(userDocRef);
          const userData = userDocSnap.data() || {};
          return { 
            id: orderDoc.id, 
            ...orderData,
            userEmail: userData.email || 'Email no disponible'
          };
        }));
        setOrders(ordersList);
      } catch (error) {
        console.error("Error al obtener los pedidos:", error);
      }
    };
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'orders', id));
      setOrders(orders.filter(order => order.id !== id));
    } catch (error) {
      console.error("Error al eliminar el pedido:", error);
    }
  };

  return (
    <div className="Cart-dash">
      <h2>Gestión de Pedidos</h2>
      {orders.map(order => (
        <div key={order.id}>
          <h3>Pedido de {order.userEmail}</h3>
          <p>Dirección de envío: {order.address || 'No especificada'}</p>
          <p>Total: ${order.total ? order.total.toFixed(2) : '0.00'}</p>
          <ul>
            {order.items && order.items.map(item => (
              <li key={item.id || item.productId}>
                {item.name || item.productName} - Cantidad: {item.quantity} - Precio: ${item.price ? item.price.toFixed(2) : '0.00'}
              </li>
            ))}
          </ul>
          <button onClick={() => handleDelete(order.id)}>Eliminar Pedido</button>
        </div>
      ))}
    </div>
  );
}

export default DashboardCarts;