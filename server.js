require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');
const http = require('http');
const { initializeWebSocket } = require('./src/websocket/websocket');
const { port } = require('./src/config/index');

require('./src/config/emailing');

const server = http.createServer(app);

initializeWebSocket(server);

const startServer = async () => {
  try {
    await connectDB();
    server.listen(port, () => {
      console.log(`Servidor corriendo en el puerto ${port}`);
    });
  } catch (error) {
    console.error('Error iniciando el servidor:', error);
    process.exit(1);
  }
};

startServer();