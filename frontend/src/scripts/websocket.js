import { getToken } from './api.js';

let socket = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectInterval = 3000; 
let messageCallback = null;

const connectWebSocket = () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    return;
  }

  const token = getToken();
  if (!token) {
    console.error('No se encontró un token de autenticación. No se puede conectar al WebSocket.');
    return;
  }

  socket = new WebSocket('ws://localhost:3000');

  socket.onopen = () => {
    reconnectAttempts = 0; 

    socket.send(JSON.stringify({
      type: 'auth',
      token: token,
    }));
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      if (data.type === 'auth_success') {
        console.log('Autenticación WebSocket exitosa:', data.message);
      } else if (data.type === 'receiveMessage') {
        if (messageCallback) {
          messageCallback(data);
        }
      } else if (data.type === 'messagesRead') {
        console.log(`Mensajes leídos por el usuario ${data.userId}`);
        if (messageCallback) {
          messageCallback(data);
        }
      } else if (data.type === 'error') {
        console.error('Error del servidor WebSocket:', data.message);
      }
    } catch (error) {
      console.error('Error en WebSocket:', error);
    }
  };

  socket.onclose = () => {
    if (reconnectAttempts < maxReconnectAttempts) {
      setTimeout(() => {
        reconnectAttempts++;
        connectWebSocket();
      }, reconnectInterval);
    } else {
      console.error('Máximo número de intentos de reconexión alcanzado.');
    }
  };

  socket.onerror = (error) => {
    console.error('Error en WebSocket:', error);
  };
};

const sendMessage = (receiverId, content) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error('WebSocket no está conectado');
    return;
  }

  socket.send(JSON.stringify({
    type: 'message',
    receiverId,
    content,
  }));
};

const markAsRead = (userId) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error('WebSocket no está conectado');
    return;
  }

  socket.send(JSON.stringify({
    type: 'markAsRead',
    userId,
  }));
};

const onMessageReceived = (callback) => {
  messageCallback = callback;
};

export { connectWebSocket, sendMessage, markAsRead, onMessageReceived };