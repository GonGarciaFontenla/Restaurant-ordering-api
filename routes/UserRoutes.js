const express = require('express');
const userRouter = express.Router();
require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Endpoint para registrar un nuevo usuario
userRouter.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'New user created successfully', user: newUser });
  } catch (error) {
    res.status(400).json({ error: `Failed to create user: ${error.message}` });
  }
}); 

// Endpoint para iniciar sesión
userRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Received login request:', { username, password }); // Log de los datos entrantes

  try {
    // Buscar al usuario en la base de datos
    const user = await User.findOne({ username });
    if (!user) {
      console.log('Invalid credentials: user not found');
      return res.status(400).send('Invalid credentials');
    }

    // Comparar las contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid credentials: password mismatch');
      return res.status(400).send('Invalid credentials');
    }

    // Generar un token JWT
    const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Server error');
  }
});

module.exports = userRouter;
