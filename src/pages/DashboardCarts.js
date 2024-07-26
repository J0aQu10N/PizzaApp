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