const express = require('express');
const MenuItem = require('../models/MenuItem');
const menuRouter = express.Router();

// Endpoint para crear un nuevo item del menú
menuRouter.post('/', async (req, res) => {
  try {
    const { name, price, description, available } = req.body;

    if (typeof available !== 'boolean') {
      return res.status(400).json({ error: 'The "available" field must be a boolean.' });
    }

    const newItem = new MenuItem({ name, price, description, available });
    await newItem.save();
    res.status(201).json({ message: 'Menu item created successfully', item: newItem });
  } catch (error) {
    res.status(400).json({ error: `Failed to create menu item: ${error.message}` });
  }
});

// Endpoint para obtener items del menú con paginación
menuRouter.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      MenuItem.find().skip(skip).limit(limit),
      MenuItem.countDocuments(),
    ]);

    res.status(200).json({
      totalItems: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      itemsPerPage: limit,
      items,
    });
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch menu items: ${error.message}` });
  }
});

// Endpoint para eliminar un item del menú
menuRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedItem = await MenuItem.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.status(200).json({ message: 'Menu item deleted successfully', item: deletedItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

module.exports = menuRouter;
