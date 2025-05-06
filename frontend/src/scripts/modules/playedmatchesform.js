import { updateMatch, saveMatch } from '../api.js';
import { getPadelAdvice } from '../api/cohere.js';
import { MatchDisplay } from './matchdisplay.js';

const getResultMessage = (match) => {
  const result = match.result;
  if (result === 'won') {
    return 'Enhorabuena por tu victoria! Partido guardado';
  } else if (result === 'lost') {
    return 'No pasa nada, el próximo partido seguro que lo ganas! Partido guardado';
  } else {
    return 'Bueno, un empate no está mal, la próxima vez a ganar! Partido guardado';
  }
};

const disableFormIfSaved = (match, inputs, styleSelect, commentInput, saveButton) => {
  if (match.isSaved) {
    inputs.forEach(input => (input.disabled = true));
    styleSelect.disabled = true;
    commentInput.disabled = true;
    saveButton.remove();
  }
};

const showAdviceModal = async (styleSelect, commentInput) => {
  try {
    const advice = await getPadelAdvice(styleSelect.value, commentInput.value);
    const modal = document.getElementById('padel-advice-modal');
    const adviceText = document.getElementById('padel-advice-text');
    const closeModalButton = document.getElementById('close-modal');

    adviceText.textContent = advice;
    modal.style.display = 'block';

    closeModalButton.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    return advice;
  } catch (error) {
    throw new Error('Error al obtener consejos: ' + error.message);
  }
};

const startFormFields = (clone, match) => {
  const resultForm = clone.querySelector('.match-card__result-form');
  if (!resultForm) {
    console.error('Error con el form');
    return null;
  }
  resultForm.style.display = 'block';

  const inputs = resultForm.querySelectorAll('.match-card__result-input-left, .match-card__result-input-right');
  inputs.forEach(input => {
    const setNum = input.closest('.match-card__set-container').dataset.set;
    if (input.classList.contains('match-card__result-input-left')) {
      input.value = match.results?.[`set${setNum}`]?.left || 0;
    } else {
      input.value = match.results?.[`set${setNum}`]?.right || 0;
    }
  });

  const styleSelect = resultForm.querySelector('.match-card__style-select');
  styleSelect.value = match.rivalStyle || '';

  const commentInput = resultForm.querySelector('.match-card__comment-input');
  commentInput.value = match.comments || '';

  const saveButton = resultForm.querySelector('.match-card__save-comment');

  return { resultForm, inputs, styleSelect, commentInput, saveButton };
};

const saveMatchResults = async (matchId, inputs, styleSelect, commentInput) => {
  const results = {};
  inputs.forEach(input => {
    const setNum = input.closest('.match-card__set-container').dataset.set;
    if (!results[`set${setNum}`]) results[`set${setNum}`] = {};
    if (input.classList.contains('match-card__result-input-left')) {
      results[`set${setNum}`].left = Number(input.value) || 0;
    } else {
      results[`set${setNum}`].right = Number(input.value) || 0;
    }
  });

  const updates = {
    results,
    rivalStyle: styleSelect.value,
    comments: commentInput.value,
    isSaved: true,
  };

  const response = await saveMatch(matchId, updates);
  return response.match;
};

const renderMatchCard = (clone, match) => {
  const onEdit = async (id) => {
    try {
      await updateMatch(id, { isSaved: false });
    } catch (error) {
      alert('Error al editar el partido: ' + error.message);
    }
  };
  const onDelete = async (id) => {
    try {
      await deleteMatch(id);
    } catch (error) {
      alert('Error al eliminar el partido: ' + error.message);
    }
  };

  MatchDisplay.displayCard(match, { content: clone }, onEdit, onDelete);

  const resultContainer = clone.querySelector('.match-card__result-container');
  const sets = ['set1', 'set2', 'set3'];
  sets.forEach(set => {
    const setContainer = resultContainer.querySelector(`.match-card__set-container[data-set="${set.replace('set', '')}"]`);
    setContainer.querySelector('.match-card__result-input-left').value = match.results?.[set]?.left || 0;
    setContainer.querySelector('.match-card__result-input-right').value = match.results?.[set]?.right || 0;
  });
};

const setupResultForm = (clone, match, showMatches) => {
  const formElements = startFormFields(clone, match);
  if (!formElements) return;

  const { resultForm, inputs, styleSelect, commentInput, saveButton } = formElements;

  disableFormIfSaved(match, inputs, styleSelect, commentInput, saveButton);

  resultForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const updatedMatch = await saveMatchResults(match._id, inputs, styleSelect, commentInput);
      const matchCard = document.querySelector(`.match-card[data-id="${match._id}"]`);
      if (matchCard && updatedMatch) {
        const newCardFragment = document.getElementById('match-card-template').content.cloneNode(true);
        PlayedMatchesForm.renderMatchCard(newCardFragment, updatedMatch);
        const newCard = newCardFragment.querySelector('.match-card');
        if (moment(`${updatedMatch.date} ${updatedMatch.time}`, 'YYYY-MM-DD HH:mm').isBefore(moment())) {
          PlayedMatchesForm.setupResultForm(newCard, updatedMatch, showMatches);
        }
        matchCard.replaceWith(newCard);
      }

      alert(getResultMessage(updatedMatch));
      const adviceText = await showAdviceModal(styleSelect, commentInput);
      await showMatches();

      const modal = document.getElementById('padel-advice-modal');
      const adviceTextElement = document.getElementById('padel-advice-text');
      const closeModalButton = document.getElementById('close-modal');
      adviceTextElement.textContent = adviceText;
      modal.style.display = 'block';

      closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    } catch (error) {
      alert('Error al guardar los resultados: ' + error.message);
    }
  });
};

export const PlayedMatchesForm = {
  getResultMessage,
  disableFormIfSaved,
  showAdviceModal,
  startFormFields,
  saveMatchResults,
  renderMatchCard,
  setupResultForm,
};