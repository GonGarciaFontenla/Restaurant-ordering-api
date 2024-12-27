const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors'); // Importa CORS
require('dotenv').config();

const app = express();

// Configuración de CORS
app.use(cors({ origin: 'http://localhost:3001' }));
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB', error);
});

// Opcional: Habilitar `useCreateIndex` para versiones anteriores de Mongoose
mongoose.set('useCreateIndex', true);

// Rutas para tu API
app.use('/api/users', require('./routes/UserRoutes'));
app.use('/api/menu', require('./routes/MenuRoutes'));
app.use('/api/orders', require('./routes/OrderRoutes'));

// Sirve los archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'restaurant-ordering-frontend', 'build')));

// Maneja cualquier ruta que no sea una API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'restaurant-ordering-frontend', 'build', 'index.html'));
});

// Inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
