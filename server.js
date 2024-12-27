const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

//Conection to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1); // Detener la aplicación si no se puede conectar
  }
};

//Call the function to connect to MongoDB
connectDB();
mongoose.set('useCreateIndex', true);

// CORS configuration
const allowedOrigins = ['http://localhost:3001', 'https://your-production-domain.com'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Helmet to secure the Express app
app.use(helmet());

// JSON middleware
app.use(express.json());

// API paths
app.use('/api/users', require('./routes/UserRoutes'));
app.use('/api/menu', require('./routes/MenuRoutes'));
app.use('/api/orders', require('./routes/OrderRoutes'));


if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'restaurant-ordering-frontend', 'build')));
  
  // Enviar el archivo index.html para cualquier ruta que no sea API
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'restaurant-ordering-frontend', 'build', 'index.html'));
  });
}

//Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
