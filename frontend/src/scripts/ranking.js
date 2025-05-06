import { Navbar } from './modules/navbar.js';
import { logout, getToken, sendFriendRequest, removeFriend, getFriends, getPendingRequests } from './api.js';
import { connectWebSocket, sendMessage, markAsRead, onMessageReceived } from './websocket.js';
import { generateAvatarUrl } from './utils.js';
import { checkAuth } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  if (!checkAuth()) {
    return;
  } 

  Navbar();

  connectWebSocket();

  const conversations = new Map();
const logoutButton = document.getElementById('logoutButton');
  const rankingTableBody = document.getElementById('rankingTableBody');
  const filterCityInput = document.getElementById('filter-city');
  const filterScoreFromInput = document.getElementById('filter-score-from');
  const filterScoreToInput = document.getElementById('filter-score-to');
  const applyFiltersButton = document.getElementById('apply-filters');
  const clearFiltersButton = document.getElementById('clear-filters');

  const chatWindow = document.getElementById('chatWindow');
  const chatWindowUsername = document.getElementById('chatWindowUsername');
  const chatWindowClose = document.getElementById('chatWindowClose');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSendButton = document.getElementById('chatSendButton');
  const conversationsList = document.getElementById('conversationsList');
  const chatConversationsToggle = document.getElementById('chatConversationsToggle');

  let currentChatUserId = null;
  let users = [];
  let currentUserId = null;
  let friends = [];
  let pendingSent = [];
  let pendingReceived = [];

  if(logoutButton) {
    logoutButton.addEventListener('click', () => {
      logout();
      window.location.href = 'login.html';
    });
  }

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) throw new Error('Error al obtener el perfil del usuario');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users', {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) throw new Error('Error al obtener usuarios');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      alert('No se pudieron cargar los usuarios');
      return [];
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/messages/${userId}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) throw new Error('Error al obtener mensajes');
      const messages = await response.json();
      return messages.map(msg => ({
        senderId: msg.sender,
        content: msg.content,
        timestamp: msg.timestamp,
      }));
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/messages/conversations', {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) throw new Error('Error al obtener conversaciones');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  };

  const renderUsers = (filteredUsers) => {
    rankingTableBody.innerHTML = '';
    filteredUsers
      .sort((a, b) => b.score - a.score)
      .forEach((user, index) => {
        const photoUrl = user.profilePicture || generateAvatarUrl(user.username);
        const isFriend = friends.some(friend => friend._id === user._id);
        const isPendingSent = pendingSent.some(request => request.recipientId === user._id);
        const isPendingReceived = pendingReceived.some(request => request.requesterId === user._id);
        const row = document.createElement('tr');
        let friendButton = '';
        if (isFriend) {
          friendButton = `<button class="action-button friend-remove" data-user-id="${user._id}" title="Eliminar amigo">👥 Eliminar</button>`;
        } else if (isPendingSent) {
          friendButton = `<span class="friend-status">Solicitud enviada</span>`;
        } else if (isPendingReceived) {
          friendButton = `<span class="friend-status">Solicitud pendiente (recibida)</span>`;
        } else {
          friendButton = `<button class="action-button friend-add" data-user-id="${user._id}" title="Agregar como amigo">👥 Agregar</button>`;
        }
        row.innerHTML = `
          <td>${index + 1}</td>
          <td class="user-info">
            <div class="user-profile">
              <div class="user-photo" style="background-image: url('${photoUrl}'); background-size: cover; background-position: center;"></div>
              <span>${user.username}</span>
            </div>
          </td>
          <td>${user.city || 'N/A'}</td>
          <td>${user.score.toFixed(2)}</td>
          <td>
            ${friendButton}
            <button class="action-button chat" data-user-id="${user._id}" data-username="${user.username}" title="Chatear">💬</button>
          </td>
        `;
        rankingTableBody.appendChild(row);
      });

    document.querySelectorAll('.action-button.friend-add').forEach(button => {
      button.addEventListener('click', async () => {
        const userId = button.dataset.userId;
        try {
          await sendFriendRequest(userId);
          pendingSent.push({ recipientId: userId });
          renderUsers(users);
        } catch (error) {
          alert(error.message);
        }
      });
    });

    document.querySelectorAll('.action-button.friend-remove').forEach(button => {
      button.addEventListener('click', async () => {
        const userId = button.dataset.userId;
        try {
          await removeFriend(userId);
          friends = friends.filter(friend => friend._id !== userId);
          renderUsers(users);
        } catch (error) {
          alert(error.message);
        }
      });
    });

    document.querySelectorAll('.action-button.chat').forEach(button => {
      button.addEventListener('click', async () => {
        const userId = button.dataset.userId;
        const username = button.dataset.username;
        openChatWindow(userId, username);
      });
    });
  };

  const renderMessages = (messages, append = false) => {
    if (!append) {
      chatMessages.innerHTML = '';
    }

    messages.forEach(message => {
      const existingMessages = Array.from(chatMessages.children);
      const messageExists = existingMessages.some(msg => {
        const content = msg.querySelector('.chat-message__content')?.textContent;
        const timestamp = msg.querySelector('.chat-message__timestamp')?.textContent;
        return content === message.content && timestamp === new Date(message.timestamp).toLocaleTimeString();
      });

      if (!messageExists) {
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${message.senderId === currentChatUserId ? 'received' : 'sent'}`;
        messageElement.innerHTML = `
          <span class="chat-message__content">${message.content}</span>
          <span class="chat-message__timestamp">${new Date(message.timestamp).toLocaleTimeString()}</span>
        `;
        chatMessages.appendChild(messageElement);
      }
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const openChatWindow = async (userId, username) => {
    currentChatUserId = userId;
    chatWindowUsername.textContent = username;
    chatWindow.style.display = 'block';

    const historicalMessages = await fetchMessages(userId);

    let conv = conversations.get(userId);
    if (!conv) {
      conv = { messages: historicalMessages, unread: false, username };
      conversations.set(userId, conv);
    } else {
      const localMessages = conv.messages;
      const allMessages = [...historicalMessages];
      localMessages.forEach(localMsg => {
        const exists = allMessages.some(msg =>
          msg.content === localMsg.content &&
          new Date(msg.timestamp).toISOString() === new Date(localMsg.timestamp).toISOString()
        );
        if (!exists) {
          allMessages.push(localMsg);
        }
      });
      allMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      conv.messages = allMessages;
      conv.unread = false; 
    }

    renderMessages(conv.messages);
    markAsRead(userId);
    updateConversationsList();
  };

  const closeChatWindow = () => {
    chatWindow.style.display = 'none';
    currentChatUserId = null;
  };

  const renderConversationItem = (userId, conv) => {
    const conversationItem = document.createElement('div');
    conversationItem.className = 'conversation-item';
    conversationItem.dataset.userId = userId;
    const lastMessage = conv.messages.length > 0 ? conv.messages[conv.messages.length - 1].content : 'No hay mensajes';
    conversationItem.innerHTML = `
      <span class="conversation-username">${conv.username}${conv.unread ? '<span class="unread-notification">!</span>' : ''}</span>
      <span class="conversation-last-message">${lastMessage}</span>
    `;
    conversationItem.addEventListener('click', () => {
      openChatWindow(userId, conv.username);
    });
    return conversationItem;
  };

  const updateConversationsList = () => {
    conversationsList.innerHTML = '';
    conversations.forEach((conv, userId) => {
      conversationsList.appendChild(renderConversationItem(userId, conv));
    });
  };

  const applyFilters = () => {
    const cityFilter = filterCityInput.value.trim().toLowerCase();
    const scoreFrom = parseFloat(filterScoreFromInput.value) || 0;
    const scoreTo = parseFloat(filterScoreToInput.value) || 10;

    const filteredUsers = users.filter(user => {
      const city = (user.city ||'N/A').toLowerCase();
      const score = user.score;

      const matchesCity = cityFilter ? city.includes(cityFilter) : true;
      const matchesScore = score >= scoreFrom && score <= scoreTo;

      return matchesCity && matchesScore;
    });

    renderUsers(filteredUsers);
  };

  const clearFilters = () => {
    filterCityInput.value = '';
    filterScoreFromInput.value = '';
    filterScoreToInput.value = '';
    renderUsers(users);
  };

  onMessageReceived((data) => {
    if (data.type === 'receiveMessage') {
      const { senderId, content, timestamp } = data;
      let conv = conversations.get(senderId);
      if (!conv) {
        const user = users.find(u => u._id === senderId);
        if (user) {
          conv = { messages: [], unread: false, username: user.username };
          conversations.set(senderId, conv);
        } else {
          return;
        }
      }
      const newMessage = { senderId, content, timestamp };
      conv.messages.push(newMessage);
      if (senderId !== currentChatUserId) {
        conv.unread = true;
        updateConversationsList();
      } else {
        renderMessages([newMessage], true);
        markAsRead(senderId);
      }
    } else if (data.type === 'messagesRead') {
      const { userId } = data;
      const conv = conversations.get(userId);
      if (conv) {
        conv.unread = false;
        updateConversationsList();
      }
    }
  });

  chatWindowClose.addEventListener('click', closeChatWindow);

  chatSendButton.addEventListener('click', () => {
    const content = chatInput.value.trim();
    if (content && currentChatUserId) {
      sendMessage(currentChatUserId, content);
      const conv = conversations.get(currentChatUserId);
      const newMessage = { senderId: currentUserId, content, timestamp: new Date() };
      conv.messages.push(newMessage);
      renderMessages([newMessage], true);
      chatInput.value = '';
      updateConversationsList();
    }
  });

  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      chatSendButton.click();
    }
  });

  let isConversationsOpen = true;
  chatConversationsToggle.addEventListener('click', () => {
    isConversationsOpen = !isConversationsOpen;
    conversationsList.style.display = isConversationsOpen ? 'block' : 'none';
    chatConversationsToggle.textContent = isConversationsOpen ? '⬆' : '⬇';
  });

  const userProfile = await fetchUserProfile();
  if (userProfile) {
    currentUserId = userProfile._id;
  }

  users = await fetchUsers();
  renderUsers(users);

  const initialConversations = await fetchConversations();
  initialConversations.forEach(conv => {
    conversations.set(conv.userId, {
      messages: conv.messages.map(msg => ({
        senderId: msg.sender,
        content: msg.content,
        timestamp: msg.timestamp,
      })) || [],
      unread: conv.hasUnread || false,
      username: conv.username,
    });
  });
  updateConversationsList();

  applyFiltersButton.addEventListener('click', applyFilters);
  clearFiltersButton.addEventListener('click', clearFilters);
});