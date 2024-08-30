const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number
  }],
  address: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  total: { type: Number, required: true }
});

module.exports = mongoose.model('Order', orderSchema);