import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import '../DashboardProduct.css';

function DashboardProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log("Fetching products from:", `${API_URL}/products`);
      const response = await axios.get(`${API_URL}/products`);
      console.log("Products fetched:", response.data);
      setProducts(response.data);
      setError(null);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      setError("No se pudieron cargar los productos. Por favor, intente de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id, newData) => {
    try {
      const token = localStorage.getItem('token');
      console.log(`Editing product ${id} with data:`, newData);
      const response = await axios.put(`${API_URL}/products/${id}`, newData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Product updated:", response.data);
      setProducts(products.map(product => product.id === id ? response.data : product));
    } catch (error) {
      console.error("Error al editar el producto:", error);
      alert("No se pudo editar el producto. Por favor, intente de nuevo.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro de que desea eliminar este producto?")) return;

    try {
      const token = localStorage.getItem('token');
      console.log(`Deleting product ${id}`);
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`Product ${id} deleted successfully`);
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      alert("No se pudo eliminar el producto. Por favor, intente de nuevo.");
    }
  };

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="product-dash">
      <h2>Gestión de Productos</h2>
      {products.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        products.map(product => (
          <div key={product.id} className="product-item">
            <h3>{product.name}</h3>
            <p>Precio: ${product.price.toFixed(2)}</p>
            <img src={product.imageUrl} alt={product.name} style={{width: '100px', height: '100px'}} />
            <button onClick={() => handleEdit(product.id, { price: Math.round(product.price * 1.01 * 100) / 100 })}>
              Aumentar Precio (1%)
            </button>
            <button onClick={() => handleDelete(product.id)}>Eliminar</button>
          </div>
        ))
      )}
    </div>
  );
}

export default DashboardProducts;