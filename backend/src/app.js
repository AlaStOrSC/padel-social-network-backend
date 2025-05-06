const express = require('express');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const matchRoutes = require('./routes/matchRoutes');
const messageRoutes = require('./routes/messageRoutes');
const fileRoutes = require('./routes/fileRoutes');

const app = express();

app.use(cors({
  origin: 'http://127.0.0.1:5500',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5502');
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


module.exports = app;