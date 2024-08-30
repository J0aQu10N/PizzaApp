import React from 'react';
import ProductList from '../components/ProductList';
import '../products.css';

function Products() {
  return (
    <div className="products-container">
      <h1>Nuestros Productos</h1>
      <ProductList />
    </div>
  );
}

export default Products;