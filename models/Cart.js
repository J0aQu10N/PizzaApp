const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  total: { 
    type: Number, 
    default: 0,
    get: v => parseFloat(v.toFixed(2))
  }
}, {
  timestamps: true,
  toJSON: { getters: true }
});

cartSchema.methods.calculateTotal = function() {
  this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

cartSchema.pre('save', function(next) {
  this.calculateTotal();
  next();
});

module.exports = mongoose.model('Cart', cartSchema);