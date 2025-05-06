import { Navbar } from './modules/navbar.js';
import { MatchDisplay } from './modules/matchdisplay.js';
import { MatchFilters } from './modules/matchfilters.js';
import { PlayedMatchesForm } from './modules/playedmatchesform.js';
import { setupTutorialModal } from './modules/tutorial.js';
import {
  createMatch,
  getMatches,
  updateMatch,
  deleteMatch,
  logout,
} from './api.js';
import { getWeather } from './api/weather.js';
import { checkAuth } from './utils.js';
import {fetchUserProfile} from './api.js'

document.addEventListener('DOMContentLoaded', async () => {
  moment.locale('es');
 

  if (!checkAuth()) {
    return;
  }


  const matchCardsContainer = document.getElementById('matchCardsContainer');
  const matchCardTemplate = document.getElementById('match-card-template');
  const filterDateInput = document.getElementById('filter-date');
  const filterResultSelect = document.getElementById('filter-result');
  const filterStatusSelect = document.getElementById('filter-status');
  const applyFiltersButton = document.getElementById('apply-filters');
  const clearFiltersButton = document.getElementById('clear-filters');

  const logoutButton = document.getElementById('logoutButton');
  const matchForm = document.getElementById('matchForm');
  const appSection = document.getElementById('appSection');

  let userRole = null
  const userProfile = await fetchUserProfile();
  if (userProfile) {
    userRole = userProfile.role; 
    console.log('Rol del usuario:', userRole);
  } else {
    console.log('No se pudo obtener el perfil del usuario');
  }
  if (appSection) {
    appSection.style.display = 'block';
    showMatches();
  }
  
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      logout();
      window.location.href = 'login.html';
    });
  }

  async function showMatches(filteredMatches = null) {
    try {
      let matches = filteredMatches || (await getMatches());
      console.log('Partidos obtenidos:', matches);
      matches = matches.sort((a, b) => {
        const dateA = moment(`${a.date} ${a.time}`, 'YYYY-MM-DD HH:mm');
        const dateB = moment(`${b.date} ${b.time}`, 'YYYY-MM-DD HH:mm');
        return dateB - dateA;
      });

      MatchDisplay.displayMatches(
        matchCardsContainer,
        matches,
        matchCardTemplate,
        async (id) => {
          try {
            await updateMatch(id, { isSaved: false });
            await showMatchById(id);
          } catch (error) {
            alert('Error al editar el partido: ' + error.message);
          }
        },
        async (id) => {
          try {
            await deleteMatch(id);
            showMatches();
          } catch (error) {
            alert('Error al eliminar el partido: ' + error.message);
          }
        },
        userRole
      );

      matchCardsContainer.querySelectorAll('.match-card').forEach((card, index) => {
        const match = matches[index];
        if (match && moment(`${match.date} ${match.time}`, 'YYYY-MM-DD HH:mm').isBefore(moment())) {
          PlayedMatchesForm.setupResultForm(card, match, showMatches);
        }
      });
    } catch (error) {
      alert('Error al cargar los partidos: ' + error.message);
    }
  }

  async function showMatchById(id) {
    try {
      const matches = await getMatches();
      const match = matches.find(m => m._id === id);
      if (!match) {
        alert('Partido no encontrado');
        return;
      }

      const matchesToShow = [match];
      matchCardsContainer.innerHTML = '';

      MatchDisplay.displayMatches(
        matchCardsContainer,
        matchesToShow,
        matchCardTemplate,
        async (id) => {
          try {
            await updateMatch(id, { isSaved: false });
            await showMatchById(id);
          } catch (error) {
            alert('Error al editar el partido: ' + error.message);
          }
        },
        async (id) => {
          try {
            await deleteMatch(id);
            showMatches();
          } catch (error) {
            alert('Error al eliminar el partido: ' + error.message);
          }
        },
        userRole
      );

      matchCardsContainer.querySelectorAll('.match-card').forEach((card) => {
        if (moment(`${match.date} ${match.time}`, 'YYYY-MM-DD HH:mm').isBefore(moment())) {
          PlayedMatchesForm.setupResultForm(card, match, showMatches);
        }
      });
    } catch (error) {
      alert('Error al cargar el partido: ' + error.message);
    }
  }

  if (matchForm) {
    matchForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const matchData = {
        player2Username: document.getElementById('player2').value,
        player3Username: document.getElementById('player3').value,
        player4Username: document.getElementById('player4').value,
        date: document.getElementById('matchDate').value,
        time: document.getElementById('matchTime').value,
        city: document.getElementById('matchCity').value,
      };

      try {
        const { weather, rainWarning } = await getWeather(matchData.city, matchData.date, matchData.time);
        matchData.weather = weather;
        matchData.rainWarning = rainWarning;

        const response = await createMatch(matchData);
        alert(response.message);
        matchForm.reset();
        showMatches();
      } catch (error) {
        alert('Error al crear el partido: ' + error.message);
      }
    });
  }

  if (applyFiltersButton) {
    applyFiltersButton.addEventListener('click', async () => {
      try {
        const allMatches = await getMatches();
        const filteredMatches = MatchFilters.findMatches(
          allMatches,
          filterDateInput.value,
          filterResultSelect.value,
          filterStatusSelect.value
        );
        showMatches(filteredMatches);
      } catch (error) {
        alert('Error al aplicar filtros: ' + error.message);
      }
    });
  }

  if (clearFiltersButton) {
    clearFiltersButton.addEventListener('click', () => {
      MatchFilters.clearFilters(filterDateInput, filterResultSelect, filterStatusSelect);
      showMatches();
    });
  }

  if (document.getElementById('tutorial-button')) {
    setupTutorialModal();
  }

  Navbar();
});