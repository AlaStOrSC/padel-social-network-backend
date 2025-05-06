const API_BASE_URL = 'http://localhost:3000/api';

export async function registerUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al registrar usuario');
    }
    return data;
  } catch (error) {
    throw new Error('Error al registrar usuario: ' + error.message);
  }
}

export async function loginUser(credentials) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión');
    }
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  } catch (error) {
    throw new Error('Error al iniciar sesión: ' + error.message);
  }
}

export function getToken() {
  return localStorage.getItem('token');
}

export async function createMatch(matchData) {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No se encontró un token de autenticación');
    }
    const response = await fetch(`${API_BASE_URL}/matches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(matchData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al crear partido');
    }
    return data;
  } catch (error) {
    throw new Error('Error al crear partido: ' + error.message);
  }
}

export async function getMatches() {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No se encontró un token de autenticación');
    }
    const response = await fetch(`${API_BASE_URL}/matches`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al listar partidos');
    }
    return data;
  } catch (error) {
    throw new Error('Error al listar partidos: ' + error.message);
  }
}

export async function updateMatch(matchId, updates) {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No se encontró un token de autenticación');
    }
    const response = await fetch(`${API_BASE_URL}/matches/${matchId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar partido');
    }
    return data;
  } catch (error) {
    throw new Error('Error al actualizar partido: ' + error.message);
  }
}
export async function saveMatch(matchId, updates) {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No se encontró un token de autenticación');
    }
    const response = await fetch(`${API_BASE_URL}/matches/savematches/${matchId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar partido');
    }
    return data;
  } catch (error) {
    throw new Error('Error al actualizar partido: ' + error.message);
  }
}

export async function deleteMatch(matchId) {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No se encontró un token de autenticación');
    }
    const response = await fetch(`${API_BASE_URL}/matches/${matchId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al eliminar partido');
    }
    return data;
  } catch (error) {
    throw new Error('Error al eliminar partido: ' + error.message);
  }
}

export async function updateProfilePicture(formData) {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No se encontró un token de autenticación');
    }
    const response = await fetch(`${API_BASE_URL}/files/upload-profile-picture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Error al subir la foto de perfil');
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export const fetchUserProfile = async (retries = 5, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const token = getToken();
      const response = await fetch('http://localhost:3000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          logout();
          window.location.href = 'login.html';
          return null;
        }
        throw new Error(`Error al obtener el perfil del usuario: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      return null;
    }
  }
}

export function logout() {
  localStorage.removeItem('token');
}

export async function sendFriendRequest(recipientId) {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No se encontró un token de autenticación');
    }
    const response = await fetch(`${API_BASE_URL}/users/friends/request/${recipientId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al enviar solicitud de amistad');
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function acceptFriendRequest(requesterId) {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No se encontró un token de autenticación');
    }
    const response = await fetch(`${API_BASE_URL}/users/friends/accept/${requesterId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al aceptar solicitud de amistad');
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function rejectFriendRequest(requesterId) {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No se encontró un token de autenticación');
    }
    const response = await fetch(`${API_BASE_URL}/users/friends/reject/${requesterId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al rechazar solicitud de amistad');
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function removeFriend(friendId) {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No se encontró un token de autenticación');
    }
    const response = await fetch(`${API_BASE_URL}/users/friends/${friendId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al eliminar amigo');
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getFriends() {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No se encontró un token de autenticación');
    }
    const response = await fetch(`${API_BASE_URL}/users/friends`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener amigos');
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getPendingRequests() {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No se encontró un token de autenticación');
    }
    const response = await fetch(`${API_BASE_URL}/users/friends/requests`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener solicitudes pendientes');
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}