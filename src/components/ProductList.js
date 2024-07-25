import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ProductContext } from '../contexts/ProductContext';
import '../ProductsList.css';

const ProductList = () => {
  const { products } = useContext(ProductContext);

  return (
    <div>
      <h2>Nuestro menú de Pizzas</h2>
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <Link to={`/product/${product.id}`}> Ver detalle </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;