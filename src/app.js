const express = require('express');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const matchRoutes = require('./routes/matchRoutes');
const messageRoutes = require('./routes/messageRoutes');
const fileRoutes = require('./routes/fileRoutes');

const app = express();

// Middleware para manejar CORS manualmente
app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.url);
  console.log('Request Origin:', req.headers.origin);

  const allowedOrigins = ['http://localhost:5500', 'http://127.0.0.1:5500', 'https://padel-social-frontend.onrender.com'];
  const origin = req.headers.origin;

  if (!origin || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || 'https://padel-social-frontend.onrender.com');
    console.log('Origin allowed, setting Access-Control-Allow-Origin to:', origin || 'https://padel-social-frontend.onrender.com');
  } else {
    console.log('Origin not allowed:', origin);
    return res.status(403).json({ message: 'CORS policy: Origin not allowed' });
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request for:', req.url);
    return res.status(200).end();
  }

  next();
});

app.use(express.json());

// Servir archivos de uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Middleware para registrar todas las rutas que se están intentando configurar
app.use((req, res, next) => {
  console.log(`Configuring route: ${req.method} ${req.path}`);
  next();
});

// Rutas API
console.log('Registering user routes...');
app.use('/api/users', userRoutes);

console.log('Registering match routes...');
app.use('/api/matches', matchRoutes);

console.log('Registering message routes...');
app.use('/api/messages', messageRoutes);

console.log('Registering file routes...');
app.use('/api/files', fileRoutes);

// Middleware para registrar solicitudes
app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next();
});

// Manejar rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

module.exports = app;