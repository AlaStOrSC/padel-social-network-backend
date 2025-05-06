const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const {jwtSecret} = require('../config/index')

const clients = new Map();

const initializeWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.type === 'auth') {
          const token = data.token;
          const decoded = jwt.verify(token, jwtSecret);
          const userId = decoded.userId;

          clients.set(userId, ws);
          ws.userId = userId; 

          ws.send(JSON.stringify({ type: 'auth_success', message: 'Conexión autenticada' }));
        }
        else if (data.type === 'message') {
          const { receiverId, content } = data;
          const senderId = ws.userId;

          const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            content,
            timestamp: new Date(),
            isRead: false,
          });
          await newMessage.save();

          const receiverSocket = clients.get(receiverId);
          if (receiverSocket) {
            receiverSocket.send(JSON.stringify({
              type: 'receiveMessage',
              senderId,
              content,
              timestamp: newMessage.timestamp,
            }));
          }
        }
        else if (data.type === 'markAsRead') {
          const { userId } = data;
          const receiverId = ws.userId;

          await Message.updateMany(
            { sender: userId, receiver: receiverId, isRead: false },
            { isRead: true }
          );

          const senderSocket = clients.get(userId);
          if (senderSocket) {
            senderSocket.send(JSON.stringify({
              type: 'messagesRead',
              userId: receiverId,
            }));
          }
        }
      } catch (error) {
        console.error('Error procesando mensaje:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Error procesando mensaje' }));
      }
    });

    ws.on('close', () => {
      for (const [userId, socket] of clients.entries()) {
        if (socket === ws) {
          clients.delete(userId);
          break;
        }
      }
    });

    ws.on('error', (error) => {
      console.error('Error en WebSocket:', error);
    });
  });
};

module.exports = { initializeWebSocket, clients };