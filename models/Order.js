const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  quantity: { type: Number, required: true, min: 0 }
});

const orderSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true },
  items: [orderItemSchema],
  status: { type: String, enum: ['pending', 'in progress', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
