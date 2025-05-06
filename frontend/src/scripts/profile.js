import { Navbar } from './modules/navbar.js';
import { logout, getToken, updateProfilePicture, fetchUserProfile, getFriends, getPendingRequests, acceptFriendRequest, rejectFriendRequest, removeFriend } from './api.js';
import { generateAvatarUrl, checkAuth } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  if (!checkAuth()) {
    return;
  }

    Navbar();

  const logoutButton = document.getElementById('logoutButton');
  const profilePhoto = document.querySelector('.profile__photo');
  const profilePictureUpload = document.getElementById('profile-picture-upload');
  const profilePhotoText = document.querySelector('.profile__photo-text');
  const friendsList = document.getElementById('friendsList');
  const pendingSentList = document.getElementById('pendingSentList');
  const pendingReceivedList = document.getElementById('pendingReceivedList');

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      logout();
      window.location.href = 'login.html';
    });
  }

  const fetchUsers = async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No se encontró un token de autenticación');
      }
      const response = await fetch('http://localhost:3000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          logout();
          window.location.href = 'login.html';
          return [];
        }
        throw new Error('Error al obtener usuarios');
      }
      return await response.json();
    } catch (error) {
      return [];
    }
  };

  const getUserRank = (user, allUsers) => {
    const sortedUsers = allUsers.sort((a, b) => b.score - a.score);
    const rank = sortedUsers.findIndex(u => u._id === user._id) + 1;
    return rank;
  };

  const renderUserProfile = (user, rank) => {
    if (!user) return;

    if (profilePhoto) {
      if (user.profilePicture) {
        const imageUrl = user.profilePicture.replace(/'/g, "\\'");
        profilePhoto.style.backgroundImage = `url('${imageUrl}')`;
        const img = new Image();
        img.src = user.profilePicture;
        img.onload = () => {
          if (profilePhotoText) {
            profilePhotoText.textContent = 'Cambiar foto';
          }
        };
        img.onerror = () => {
          const avatarUrl = generateAvatarUrl(user.username);
          profilePhoto.style.backgroundImage = `url('${avatarUrl}')`;
          if (profilePhotoText) {
            profilePhotoText.textContent = 'Subir foto';
          }
        };
      } else {
        const avatarUrl = generateAvatarUrl(user.username);
        profilePhoto.style.backgroundImage = `url('${avatarUrl}')`;
        if (profilePhotoText) {
          profilePhotoText.textContent = 'Subir foto';
        }
      }
      profilePhoto.style.backgroundSize = 'cover';
      profilePhoto.style.backgroundPosition = 'center';
    }

    document.getElementById('username').textContent = user.username;
    document.getElementById('ranking-position').textContent = `#${rank}`;
    document.getElementById('ranking-position').className = `ranking-position rank-${rank}`;
    document.getElementById('profile-username').value = user.username;
    document.getElementById('profile-phone').value = user.phone || 'No especificado';
    document.getElementById('profile-email').value = user.email;
    document.getElementById('profile-city').value = user.city || 'No especificado';

    document.getElementById('stats-score').textContent = user.score.toFixed(2);
    document.getElementById('stats-won').textContent = user.matchesWon || 0;
    document.getElementById('stats-lost').textContent = user.matchesLost || 0;
    document.getElementById('stats-drawn').textContent = user.matchesDrawn || 0;
    document.getElementById('stats-total').textContent = user.totalMatches || 0;
    const winPercentage = user.totalMatches > 0 ? (user.matchesWon / user.totalMatches) * 100 : 0;
    document.getElementById('stats-win-percentage').textContent = `${winPercentage.toFixed(2)}%`;
  };

  const renderFriends = (friends) => {
    if (!friendsList) return;
    friendsList.innerHTML = '';
    friends.forEach(friend => {
      const friendElement = document.createElement('div');
      friendElement.className = 'friend-item';
      const photoUrl = friend.profilePicture || generateAvatarUrl(friend.username);
      friendElement.innerHTML = `
        <div class="friend-photo" style="background-image: url('${photoUrl}'); background-size: cover; background-position: center;"></div>
        <span>${friend.username}</span>
        <button class="action-button friend-remove" data-user-id="${friend._id}" title="Eliminar amigo">🗑️ Eliminar</button>
      `;
      friendElement.querySelector('.friend-remove').addEventListener('click', async () => {
        try {
          await removeFriend(friend._id);
          friends = friends.filter(f => f._id !== friend._id);
          renderFriends(friends);
        } catch (error) {
          alert(error.message);
        }
      });
      friendsList.appendChild(friendElement);
    });
  };

  const renderPendingSent = (sentRequests) => {
    if (!pendingSentList) return;
    pendingSentList.innerHTML = '';
    sentRequests.forEach(request => {
      const requestElement = document.createElement('div');
      requestElement.className = 'friend-request-item';
      const photoUrl = request.profilePicture || generateAvatarUrl(request.username);
      requestElement.innerHTML = `
        <div class="friend-photo" style="background-image: url('${photoUrl}'); background-size: cover; background-position: center;"></div>
        <span>Solicitud enviada a ${request.username}</span>
      `;
      pendingSentList.appendChild(requestElement);
    });
  };

  const renderPendingReceived = (receivedRequests) => {
    if (!pendingReceivedList) return;
    pendingReceivedList.innerHTML = '';
    receivedRequests.forEach(request => {
      const requestElement = document.createElement('div');
      requestElement.className = 'friend-request-item';
      const photoUrl = request.profilePicture || generateAvatarUrl(request.username);
      requestElement.innerHTML = `
        <div class="friend-photo" style="background-image: url('${photoUrl}'); background-size: cover; background-position: center;"></div>
        <span>Solicitud de ${request.username}</span>
        <button class="action-button friend-accept" data-user-id="${request.requesterId}" title="Aceptar solicitud">✅ Aceptar</button>
        <button class="action-button friend-reject" data-user-id="${request.requesterId}" title="Rechazar solicitud">❌ Rechazar</button>
      `;
      requestElement.querySelector('.friend-accept').addEventListener('click', async () => {
        try {
          await acceptFriendRequest(request.requesterId);
          receivedRequests = receivedRequests.filter(r => r.requesterId !== request.requesterId);
          friends.push({ _id: request.requesterId, username: request.username, email: request.email, profilePicture: request.profilePicture });
          renderPendingReceived(receivedRequests);
          renderFriends(friends);
        } catch (error) {
          alert(error.message);
        }
      });
      requestElement.querySelector('.friend-reject').addEventListener('click', async () => {
        try {
          await rejectFriendRequest(request.requesterId);
          receivedRequests = receivedRequests.filter(r => r.requesterId !== request.requesterId);
          renderPendingReceived(receivedRequests);
        } catch (error) {
          alert(error.message);
        }
      });
      pendingReceivedList.appendChild(requestElement);
    });
  };

  let cachedUser = null;
  let friends = [];
  let receivedRequests = [];
  let sentRequests = [];

  const user = await fetchUserProfile();
  if (user) {
    cachedUser = user;
  }
  const allUsers = await fetchUsers();
  const rank = getUserRank(user, allUsers);
  const pendingRequests = await getPendingRequests();
  friends = await getFriends();
  receivedRequests = pendingRequests.received;
  sentRequests = pendingRequests.sent;

  renderUserProfile(user, rank);
  renderFriends(friends);
  renderPendingSent(sentRequests);
  renderPendingReceived(receivedRequests);

  if (profilePictureUpload) {
    profilePictureUpload.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('profilePicture', file);

      try {
        const response = await updateProfilePicture(formData);
        alert(response.message);
        const updatedUser = await fetchUserProfile();
        if (updatedUser) {
          cachedUser = updatedUser;
          renderUserProfile(updatedUser, rank);
        } else {
          renderUserProfile(cachedUser, rank);
        }
      } catch (error) {
        alert('Error al subir la foto de perfil: ' + error.message);
      }
    });
  }
});