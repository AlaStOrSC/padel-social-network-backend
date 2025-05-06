import { fetchPadelNews } from './api/padelNews.js';
import { Navbar } from './modules/navbar.js';
import { logout } from './api.js';
import { checkAuth } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  if (!checkAuth()) {
    return;
  }

  Navbar();

  const logoutButton = document.createElement('button');
  logoutButton.id = 'logoutButton';
  logoutButton.className = 'logout-button';
  logoutButton.textContent = 'Cerrar Sesión';
  logoutButton.addEventListener('click', () => {
    logout();
    window.location.href = 'login.html';
  });

  const authActions = document.createElement('div');
  authActions.className = 'auth-actions';
  authActions.appendChild(logoutButton);

  const header = document.querySelector('.header');
  if (header) {
    header.insertAdjacentElement('afterend', authActions);
  }

  function createNewsLink(url, text) {
    const link = document.createElement('a');
    link.classList.add('news__item-link');
    link.href = url || '#';
    link.textContent = text || 'Leer más...';
    link.target = '_blank';
    return link;
  }

  const fillNewsDivs = async () => {
    const newsItems = document.querySelectorAll('.news__item');
    if (!newsItems.length) {
      console.error('No hay news');
      return;
    }

    try {
      const articles = await fetchPadelNews();
      articles.forEach((article, index) => {
        if (index < newsItems.length) {
          const titleElement = newsItems[index].querySelector('.news__item-title');
          const descriptionElement = newsItems[index].querySelector('.news__item-description');
          let imageElement = newsItems[index].querySelector('.news__item-image');

          titleElement.textContent = article.title || 'Sin título';
          descriptionElement.textContent = article.description || 'Sin descripción disponible';

          if (article.urlToImage) {
            if (!imageElement) {
              imageElement = document.createElement('img');
              imageElement.classList.add('news__item-image');
              newsItems[index].prepend(imageElement);
            }
            imageElement.src = article.urlToImage;
            imageElement.alt = article.title || 'Imagen de la noticia';
          } else if (imageElement) {
            imageElement.remove(); 
          }

          const existingLink = newsItems[index].querySelector('.news__item-link');
          if (existingLink) existingLink.remove();
          newsItems[index].appendChild(createNewsLink(article.url, 'Leer más...'));
        }
      });
    } catch (error) {
      newsItems.forEach(item => {
        item.querySelector('.news__item-title').textContent = 'Error';
        item.querySelector('.news__item-description').textContent = 'No se pudieron cargar las noticias.';
        const existingLink = item.querySelector('.news__item-link');
        if (existingLink) existingLink.remove();
        const imageElement = item.querySelector('.news__item-image');
        if (imageElement) imageElement.remove();
        item.appendChild(createNewsLink('#', 'Leer más...'));
      });
    }
  };

  fillNewsDivs();
});