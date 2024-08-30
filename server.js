require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const connectDB = require('./db');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Cart = require('./models/Cart');

const app = express();

connectDB();

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(bodyParser.json());

// Rutas de autenticación
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuario ya existe' });
    }
    const newUser = new User({ email, password });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, 'your_jwt_secret');
    res.status(201).json({ token, id: newUser._id, isAdmin: newUser.isAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password });
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, 'your_jwt_secret');
      res.json({ token, id: user._id, isAdmin: user.isAdmin });
    } else {
      console.log('Password mismatch');
      res.status(400).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Rutas de productos
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.put('/api/products/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(id, { price }, { new: true });
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.delete('/api/products/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (deletedProduct) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Rutas de órdenes
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { items, address } = req.body;
    const user = await User.findById(req.user.id);
    const newOrder = new Order({
      userEmail: user.email,
      items: items.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      address,
      total: items.reduce((total, item) => total + item.price * item.quantity, 0)
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const orders = await Order.find();
      res.json(orders);
    } else {
      const user = await User.findById(req.user.id);
      const userOrders = await Order.find({ userEmail: user.email });
      res.json(userOrders);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.delete('/api/orders/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (deletedOrder) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Orden no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Rutas de usuarios
app.get('/api/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.put('/api/users/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { isAdmin } = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, { isAdmin }, { new: true }).select('-password');
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.delete('/api/users/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (deletedUser) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Obtener carrito del usuario
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
});

// Agregar producto al carrito
app.post('/api/cart', authenticateToken, async (req, res) => {
  try {
    const { product, quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === product.id);
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity
      });
    }

    cart.calculateTotal();
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
});

// Eliminar producto del carrito
app.delete('/api/cart', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (existingItemIndex > -1) {
      if (cart.items[existingItemIndex].quantity > quantity) {
        cart.items[existingItemIndex].quantity -= quantity;
      } else {
        cart.items.splice(existingItemIndex, 1);
      }
      cart.calculateTotal();
      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
});


// Limpiar carrito
app.delete('/api/cart', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (cart) {
      cart.items = [];
      cart.total = 0;
      await cart.save();
      res.json({ message: 'Carrito limpiado' });
    } else {
      res.status(404).json({ message: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Middleware para autenticar token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    console.log('Authenticated user:', req.user);
    next();
  });
}

// Middleware para verificar si es admin
function isAdmin(req, res, next) {
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Se requieren permisos de administrador' });
  }
}

app.get('/api/verify-token', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user, isAdmin: user.isAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));