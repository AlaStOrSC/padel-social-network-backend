const express = require('express');
const path = require('path');
const userRoutes = require('./src/routes/userRoutes');
const matchRoutes = require('./src/routes/matchRoutes');
const messageRoutes = require('./src/routes/messageRoutes');
const fileRoutes = require('./src/routes/fileRoutes');

const app = express();

// Middleware para registrar todas las solicitudes entrantes
app.use((req, res, next) => {
  console.log(`Solicitud entrante: ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Middleware para manejar CORS manualmente
app.use((req, res, next) => {
  console.log('Procesando CORS...');
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

// Servir archivos de uploads desde la nueva ruta
const UPLOADS_BASE_PATH = process.env.NODE_ENV === 'production'
  ? '/opt/render/project/uploads'
  : path.join(__dirname, 'uploads');
app.use('/uploads', express.static(UPLOADS_BASE_PATH));

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
  console.log('Ruta no encontrada:', req.method, req.url);
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware para manejar errores no capturados
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor', message: err.message });
});

module.exports = app;

// const express = require('express'); CORS FUNCIONAN AQUI
// const cors = require('cors');
// const path = require('path');
// const userRoutes = require('./src/routes/userRoutes');
// const matchRoutes = require('./src/routes/matchRoutes');
// const messageRoutes = require('./src/routes/messageRoutes');
// const fileRoutes = require('./src/routes/fileRoutes');

// const app = express();

// // Configuración de CORS
// const corsOptions = {
//   origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'https://padel-social-frontend.onrender.com'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
// };

// // Habilitar CORS para todas las rutas
// app.use(cors(corsOptions));

// // Manejar solicitudes preflight (OPTIONS) para rutas específicas
// app.options('/api/users', cors(corsOptions));
// app.options('/api/matches', cors(corsOptions));
// app.options('/api/messages', cors(corsOptions));
// app.options('/api/files', cors(corsOptions));
// app.options('/uploads', cors(corsOptions));

// app.use(express.json());

// // Servir archivos de uploads
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// // Middleware para registrar todas las rutas que se están intentando configurar
// app.use((req, res, next) => {
//   console.log(`Configuring route: ${req.method} ${req.path}`);
//   next();
// });

// // Rutas API
// console.log('Registering user routes...');
// app.use('/api/users', userRoutes);

// console.log('Registering match routes...');
// app.use('/api/matches', matchRoutes);

// console.log('Registering message routes...');
// app.use('/api/messages', messageRoutes);

// console.log('Registering file routes...');
// app.use('/api/files', fileRoutes);

// // Middleware para registrar solicitudes
// app.use((req, res, next) => {
//   console.log(`Solicitud recibida: ${req.method} ${req.url}`);
//   next();
// });

// // Manejar rutas no encontradas
// app.use((req, res, next) => {
//   res.status(404).json({ message: 'Ruta no encontrada' });
// });

// module.exports = app;