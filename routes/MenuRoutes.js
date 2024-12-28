const express = require('express');
const MenuItem = require('../models/MenuItem');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Endpoint para crear un nuevo item del menú
router.post('/', async (req, res) => {
  // Verificar que el usuario esté autenticado y tenga el rol de admin
  // const token = req.headers.authorization?.split(' ')[1];
  // if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
  //   const decoded = jwt.verify(token, 'your_jwt_secret');
  //   if (decoded.role !== 'admin') {
  //     return res.status(403).json({ message: 'Permission denied' });
  //   }

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
router.get('/', async (req, res) => {
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

module.exports = router;
