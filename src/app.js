const express = require('express');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const matchRoutes = require('./routes/matchRoutes');
const messageRoutes = require('./routes/messageRoutes');
const fileRoutes = require('./routes/fileRoutes');

const app = express();

// Configuración CORS más permisiva
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://padel-social-frontend.onrender.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Responder inmediatamente a las solicitudes OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Aplicar el middleware cors después de nuestro middleware personalizado
app.use(cors());

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Aplicar los mismos encabezados CORS a todas las rutas específicas
const applyCors = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://padel-social-frontend.onrender.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
};

// Aplicar CORS a cada grupo de rutas
app.use('/api/users', applyCors, userRoutes);
app.use('/api/matches', applyCors, matchRoutes);
app.use('/api/messages', applyCors, messageRoutes);
app.use('/api/files', applyCors, fileRoutes);

app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next();
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

module.exports = app;