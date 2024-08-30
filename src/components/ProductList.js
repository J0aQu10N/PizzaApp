import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../ProductsList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Error al cargar los productos. Por favor, intente de nuevo más tarde.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Nuestro menú de Pizzas</h2>
      <div className="product-grid">
        {products.map(product => (
          <div key={product._id} className="product-card"> {}
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <Link to={`/product/${product._id}`}> Ver detalle </Link> {}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
