export const setupTutorialModal = () => {
    const tutorialButton = document.getElementById('tutorial-button');
    const tutorialModal = document.getElementById('tutorial-modal');
    const closeButton = document.getElementById('close-tutorial-modal');
    if (!tutorialButton || !tutorialModal || !closeButton) {
        console.error('No se encontraron los elementos del modal de tutorial');
        return;
    }

    tutorialButton.addEventListener('click', () => {
        tutorialModal.style.display = 'flex';
    });

    closeButton.addEventListener('click', () => {
        tutorialModal.style.display = 'none';
    });
    tutorialModal.addEventListener('click', (e) => {
        if (e.target === tutorialModal) {
            tutorialModal.style.display = 'none';
        }
    });
}