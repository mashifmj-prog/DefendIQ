/* Main script to initialize DefendIQ and attach event listeners */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize state and UI
  loadQuestions();
  loadStats();
  restoreState();

  // Ensure buttons are clickable
  trainingBtn.addEventListener('click', () => {
    console.log('Training Mode button clicked');
    setMode('training');
    landing.classList.add('hidden');
    app.classList.remove('hidden');
    quizDropdown.classList.remove('hidden');
    statsArea.classList.remove('hidden');
    closeModule();
    saveState();
  });

  supportBtn.addEventListener('click', () => {
    console.log('Support Mode button clicked');
    setMode('support');
    landing.classList.add('hidden');
    app.classList.remove('hidden');
    quizDropdown.classList.add('hidden');
    statsArea.classList.add('hidden');
    document.querySelector('.module-title').textContent = 'Support Mode';
    renderSupportContent();
    saveState();
  });

  // Other event listeners
  homeBtn.addEventListener('click', () => {
    console.log('Home button clicked');
    app.classList.add('hidden');
    landing.classList.remove('hidden');
    setMode('landing');
    current = { key: null, idx: 0, mode: 'selection', certificate: null };
    saveState();
  });

  refreshBtn.addEventListener('click', () => {
    console.log('Refresh button clicked');
    if (getMode() === 'training') {
      if (current.mode === 'selection') renderModuleSelection();
      else if (current.mode === 'material') renderLearningMaterial();
      else if (current.mode === 'quiz') renderQuestion();
      else if (current.mode === 'certificate' && current.certificate) showCertificate(current.certificate.moduleName, current.certificate.timestamp, current.certificate.hash);
    } else if (getMode() === 'support') {
      renderSupportContent();
    }
  });

  closeModuleBtn.addEventListener('click', () => {
    console.log('Close module button clicked');
    if (getMode() === 'training') {
      moduleSelect.selectedIndex = 0;
      closeModule();
    } else {
      renderSupportContent();
    }
  });

  moduleSelect.addEventListener('change', () => {
    console.log('Module select changed:', moduleSelect.value);
    const v = moduleSelect.value;
    if (!v || v === "") return;
    if (v === 'exit') {
      moduleSelect.selectedIndex = 0;
      closeModule();
      return;
    }
    openModule(v);
  });
});
