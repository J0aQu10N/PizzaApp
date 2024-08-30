import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProductContext } from '../contexts/ProductContext';
import { CartContext } from '../contexts/CartContext';
import '../Productsdeta.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { products, loading, error } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  if (loading) return <div>Cargando detalles del producto...</div>;
  if (error) return <div>{error}</div>;

  const product = products.find(p => p._id === id);

  if (!product) return <div>Producto no encontrado</div>;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert('Producto añadido al carrito');
  };

  return (
    <div className="product-deta">
      <h2>{product.name}</h2>
      <img src={product.imageUrl} alt={product.name} />
      <p>{product.description}</p>
      <p>Precio: ${product.price}</p>
      <input 
        type="number" 
        value={quantity} 
        onChange={(e) => setQuantity(parseInt(e.target.value))} 
        min="1"
      />
      <button onClick={handleAddToCart}>Añadir al carrito</button>
    </div>
  );
};

export default ProductDetail;
