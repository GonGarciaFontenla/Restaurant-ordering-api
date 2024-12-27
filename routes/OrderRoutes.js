const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

router.post('/orders', async (req, res) => {
  const { tableNumber, items } = req.body;
  try {
    const newOrder = new Order({ tableNumber, items });
    await newOrder.save();
    res.status(201).json({ message: 'Order created' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('items');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/orders/:id', async (req, res) => {
  const { status } = req.body;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json({ message: 'Order updated', order: updatedOrder });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
