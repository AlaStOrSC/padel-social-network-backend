const express = require('express');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const matchRoutes = require('./routes/matchRoutes');
const messageRoutes = require('./routes/messageRoutes');
const fileRoutes = require('./routes/fileRoutes');

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'https://padel-social-frontend.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Habilitar CORS para todas las rutas
app.use(cors(corsOptions));

// Asegurarse de que las solicitudes preflight (OPTIONS) sean manejadas explícitamente
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request for:', req.url);
    res.header('Access-Control-Allow-Origin', 'https://padel-social-frontend.onrender.com');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.status(200).end();
  }
  next();
});

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use((req, res, next) => {
  console.log(`Configuring route: ${req.method} ${req.path}`);
  next();
});

console.log('Registering user routes...');
app.use('/api/users', userRoutes);

console.log('Registering match routes...');
app.use('/api/matches', matchRoutes);

console.log('Registering message routes...');
app.use('/api/messages', messageRoutes);

console.log('Registering file routes...');
app.use('/api/files', fileRoutes);

app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next();
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

module.exports = app;