const express = require('express');
const MenuItem = require('../models/MenuItem');
const router = express.Router();

router.post('/menu', async (req, res) => {
  const { name, price, description, available } = req.body;

  if (typeof available !== 'boolean') {
    return res.status(400).json({ error: 'Available field must be a boolean' });
  }
  try {
    const newItem = new MenuItem({ name, price, description, available });
    await newItem.save();
    res.status(201).json({ message: 'Menu item created', item: newItem });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/menu', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const items = await MenuItem.find().skip(skip).limit(limit);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
