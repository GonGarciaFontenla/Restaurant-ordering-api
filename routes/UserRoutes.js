const express = require('express');
const userRouter = express.Router();
require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

userRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Received login request:', { username, password });  // Log de los datos entrantes
  
  let user;
  try {
    user = await User.findOne({ username });
    if (!user) {
      console.log('Invalid credentials: user not found');
      return res.status(400).send('Invalid credentials');
    }
  } catch (err) {
    console.error('Error during user lookup:', err);
    return res.status(500).send('Server error');
  }

  let isMatch;
  try {
    isMatch = await bcrypt.compare(password, user.password);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return res.status(500).send('Server error');
  }

  if (!isMatch) {
    console.log('Invalid credentials: password mismatch');
    return res.status(400).send('Invalid credentials');
  }

  const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
  res.json({ token });
});

module.exports = userRouter;