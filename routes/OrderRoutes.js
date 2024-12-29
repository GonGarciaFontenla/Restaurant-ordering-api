const express = require('express');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem'); // Importa el modelo de MenuItem
const OrderRouter = express.Router();

// Crear nueva orden
OrderRouter.post('/createOrder', async (req, res) => {
  const { tableNumber, items } = req.body;

  // Validar que items sea un array de ObjectIds
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Items must be an array of ObjectIds' });
  }

  try {
    // Validar que los IDs en items sean válidos
    const validItems = await MenuItem.find({ '_id': { $in: items } });
    if (validItems.length !== items.length) {
      return res.status(400).json({ error: 'Some items are invalid or do not exist' });
    }

    const newOrder = new Order({ tableNumber, items });
    await newOrder.save();
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

OrderRouter.get('/getOrder/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' }); // Manejo para cuando la orden no existe
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message }); // Cambiar a 500 si es un error del servidor
  }
});


// Obtener todas las órdenes
OrderRouter.get('/getOrders', async (req, res) => {
  try {
    const orders = await Order.find().populate('items'); // Popula los datos de los ítems
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar el estado de una orden
OrderRouter.put('/modifyOrder/:id', async (req, res) => {
  const { status } = req.body;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json({ message: 'Order updated', order: updatedOrder });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint para eliminar una orden
OrderRouter.delete('/deleteOrder/:id', async (req, res) => { // Agregar "/" al inicio de la ruta
  const { id } = req.params;

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully', order: deletedOrder });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
});



module.exports = OrderRouter;
