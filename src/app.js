const express = require('express');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const matchRoutes = require('./routes/matchRoutes');
const messageRoutes = require('./routes/messageRoutes');
const fileRoutes = require('./routes/fileRoutes');

const app = express();

app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'https://padel-social-frontend.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());



app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://padel-social-frontend.onrender.com');
  res.header('Access-Control-Allow-Methods', 'GET');
  next();
}, express.static(path.join(__dirname, '../uploads')));


app.use('/api/users', userRoutes);

app.use('/api/matches', matchRoutes);

app.use('/api/messages', messageRoutes);

app.use('/api/files', fileRoutes);

app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next();
});
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});


module.exports = app;