// routes/userRoutes.js
const express = require('express');
const userRouter = express.Router();
require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

userRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  let user;
  try {
    user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('Invalid credentials');
    }
  } catch (err) {
    return res.status(500).send('Server error');
  }

  let isMatch;
  try {
    isMatch = await bcrypt.compare(password, user.password);
  } catch (error) {
    return res.status(500).send('Server error');
  }

  if (!isMatch) {
    return res.status(400).send('Invalid credentials');
  }

  const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
  res.json({ token });
});

module.exports = userRouter;
