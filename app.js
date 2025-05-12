const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const userRoutes = require('./src/routes/userRoutes');
const matchRoutes = require('./src/routes/matchRoutes');
const messageRoutes = require('./src/routes/messageRoutes');
const fileRoutes = require('./src/routes/fileRoutes');
const newsRoutes = require('./src/routes/newsRoutes');
const errorHandler = require('./src/middlewares/errorMiddleware');
const notFoundHandler = require('./src/middlewares/notFoundHandler');


const app = express();

app.use((req, res, next) => {
  console.log(`Solicitud entrante: ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

app.use((req, res, next) => {
  console.log('Petición recibida:', req.method, req.url);
  console.log('Origen:', req.headers.origin);

  const allowedOrigins = ['http://localhost:5500', 'http://127.0.0.1:5500', 'https://padel-social-frontend.onrender.com'];
  const origin = req.headers.origin;

  if (!origin || allowedOrigins.includes(origin)) {
    console.log('Origen permitido, poniendo Access-Control-Allow-Origin:', origin || 'https://padel-social-frontend.onrender.com');
    res.header('Access-Control-Allow-Origin', origin || 'https://padel-social-frontend.onrender.com');
  } else {
    console.log('Origen NO permitido:', origin);
    return res.status(403).json({ message: 'CORS: Origen no permitido' });
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    console.log('Respondiendo a OPTIONS para:', req.url);
    return res.status(200).end();
  }

  next();
});

app.use(cookieParser());

app.use(express.json());

const UPLOADS_BASE_PATH = process.env.NODE_ENV === 'production'
  ? '/opt/render/project/uploads'
  : path.join(__dirname, 'Uploads');
app.use('/uploads', express.static(UPLOADS_BASE_PATH));

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

console.log('Registering news routes...');
app.use('/api/news', newsRoutes);

app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next();
});

app.use('/api', notFoundHandler);

app.use(errorHandler);

module.exports = app;

