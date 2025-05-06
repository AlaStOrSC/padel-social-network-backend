export const MatchDisplay = {
  displayCard(match, clone, onEdit, onDelete, userRole) {
    try {
      const card = clone.querySelector('.match-card');
      if (!card) throw new Error('Elemento .match-card no encontrado');
      card.dataset.id = match._id;

      const player1El = clone.querySelector('.match-player1');
      if (player1El) player1El.textContent = `🏸 ${match.player1?.username || 'Desconocido'}`;

      const player2El = clone.querySelector('.match-player2');
      if (player2El) player2El.textContent = `🏸 ${match.player2?.username || 'Desconocido'}`;

      const player3El = clone.querySelector('.match-player3');
      if (player3El) player3El.textContent = `🏸 ${match.player3?.username || 'Desconocido'}`;

      const player4El = clone.querySelector('.match-player4');
      if (player4El) player4El.textContent = `🏸 ${match.player4?.username || 'Desconocido'}`;

      const cityEl = clone.querySelector('.match-city');
      if (cityEl) cityEl.innerHTML = `<img src="../assets/location.png" alt="Localización" style="width: 24px; height: 24px; vertical-align: middle;"> ${match.city || ''}`;

      const dateEl = clone.querySelector('.match-date');
      if (dateEl) dateEl.textContent = `📅 ${moment(match.date).format('LL')}`;

      const timeEl = clone.querySelector('.match-time');
      if (timeEl) timeEl.textContent = `🕒 ${match.time || ''}`;

      const weatherText = (match.weather || '').toLowerCase();
      let weatherIcon = '';
      if (weatherText.includes('lluvia')) {
        weatherIcon = `<img src="../assets/rainy.png" alt="Lluvia" class="weather-icons">`;
      } else if (weatherText.includes('nuboso')) {
        weatherIcon = `<img src="../assets/cloudy.png" alt="Nuboso" class="weather-icons">`;
      } else if (weatherText.includes('cielo')) {
        weatherIcon = `<img src="../assets/sun.png" alt="Soleado" class="weather-icons">`;
      } else if (weatherText.includes('nubes')) {
        weatherIcon = `<img src="../assets/clouds.png" alt="Nubes" class="weather-icons">`;
      } else if (weatherText.includes('tormenta')) {
        weatherIcon = `<img src="../assets/storm.png" alt="Tormenta" class="weather-icons">`;
      } else if (weatherText.includes('nieve')) {
        weatherIcon = `<img src="../assets/snow.png" alt="Nieve" class="weather-icons">`;
      } else {
        weatherIcon = `<img src="../assets/standardweather.png" alt="Clima" class="weather-icons">`;
      }
      const weatherEl = clone.querySelector('.match-weather');
      if (weatherEl) weatherEl.innerHTML = `${weatherIcon} ${match.weather || ''}`;

      const statusElement = clone.querySelector('.match-card__status');
      const isFinished = statusElement ? this.displayCardStatus(statusElement, match) : false;

      const rainWarningEl = clone.querySelector('.match-card__rain-warning');
      if (rainWarningEl && match.rainWarning) {
        rainWarningEl.style.display = 'block';
      }

      const deleteButton = clone.querySelector('.match-card__delete-button');
      const editButton = clone.querySelector('.match-card__edit-button');
      if (editButton) {
        editButton.style.display = (userRole === 'admin') ? 'block' : 'none';
      }
      if (deleteButton) deleteButton.style.display = 'block';

      if (editButton && onEdit) editButton.addEventListener('click', () => onEdit(match._id));
      if (deleteButton && onDelete) deleteButton.addEventListener('click', () => onDelete(match._id));

      this.displayCardStyle(card, match);

      return clone;
    } catch (error) {
      console.error(`Error mostrando partido ${match._id}:`, error);
      return null;
    }
  },

  displayCardStatus(statusElement, match) {
    const isFinished = moment(`${match.date} ${match.time}`, 'YYYY-MM-DD HH:mm').isBefore(moment());
    if (isFinished) {
      statusElement.innerText = 'Finalizado';
      statusElement.classList.remove('match-card__status--pending');
      statusElement.classList.add('match-card__status--finished');
    } else {
      statusElement.innerText = 'Pendiente';
      statusElement.classList.remove('match-card__status--finished');
      statusElement.classList.add('match-card__status--pending');
    }
    return isFinished;
  },

  displayCardStyle(card, match) {
    card.classList.remove('match-card--won', 'match-card--lost', 'match-card--draw');
    if (!match.isSaved) {
      return;
    }
    const result = match.result;
    if (result) {
      card.classList.add(`match-card--${result}`);
    }
  },

  displayMatches(container, matches, template, onEdit, onDelete, userRole) {
    container.innerHTML = '';
    matches.forEach((match) => {
      const cardNode = this.displayCard(match, template.content.cloneNode(true), onEdit, onDelete, userRole);
      if (cardNode) {
        container.appendChild(cardNode);
      }
    });
  },
};