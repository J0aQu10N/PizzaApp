import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import '../DashboardProduct.css';
function DashboardProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsList);
    };
    fetchProducts();
  }, []);

  const handleEdit = async (id, newData) => {
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, newData);
    setProducts(products.map(product => product.id === id ? { ...product, ...newData } : product));
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'products', id));
    setProducts(products.filter(product => product.id !== id));
  };

  return (
    <div className="product-dash">
      <h2>Gestión de Productos</h2>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>Precio: ${product.price}</p>
          <button onClick={() => handleEdit(product.id, { price: product.price *1.01})}>
            Aumentar Precio
          </button>
          <button onClick={() => handleDelete(product.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
}

export default DashboardProducts;

