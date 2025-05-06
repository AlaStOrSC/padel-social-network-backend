import { getToken, logout } from './api.js';

const generateAvatarUrl = (username) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=05374d&color=ffff&rounded=true`;
  };



function decodeToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token JWT inválido');
    }
    return JSON.parse(atob(parts[1]));
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
}

function isTokenExpired(token) {
  const payload = decodeToken(token);
  if (!payload) {
    throw new Error('Token inválido: no se puede decodificar');
  }
  const expires = payload.exp;
  if (!expires) {
    return false;
  }
  const now = Math.floor(Date.now() / 1000);
  return now > expires;
}

 function checkAuth() {
  const token = getToken();
  if (!token) {
    window.location.href = 'login.html';
    return false;
  }
  try {
    if (isTokenExpired(token)) {
      logout(); 
      window.location.href = 'login.html';
      return false;
    }
  } catch (error) {
    console.error('Error al verificar el token:', error);
    logout(); 
    window.location.href = 'login.html';
    return false;
  }
  return true; 
}

  export { generateAvatarUrl, checkAuth };