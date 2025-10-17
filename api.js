let MODULES = {};

async function loadQuestions() {
  try {
    const response = await fetch('questions.json');
    if (!response.ok) throw new Error('Network response was not ok');
    MODULES = await response.json();
    populateModuleDropdown();
    if (current.key && MODULES[current.key]) renderModuleSelection();
    else if (currentMode === 'training') renderTrainingDashboard();
  } catch (error) {
    console.error('Failed to load questions:', error);
    moduleBody.innerHTML = '<p>Failed to load modules. Check your connection or try again later.</p>';
  }
}

function triggerConfetti(isCorrect) {
  const confetti = new window.JSConfetti();
  if (isCorrect) {
    confetti.addConfetti({
      confettiNumber: 100,
      confettiColors: ['#ff7a7a', '#ffd56b', '#8affc1', '#9fb4ff'],
      confettiRadius: 5,
      confettiSpeed: 5
    });
    setTimeout(() => confetti.clearCanvas(), 1000);
  } else {
    confetti.addConfetti({
      confettiNumber: 30,
      confettiColors: ['#c62828'],
      confettiRadius: 3,
      confettiSpeed: 3
    });
    setTimeout(() => confetti.clearCanvas(), 1000);
  }
}

function saveModuleProgress(progress) {
  return new Promise((resolve) => setTimeout(() => {
    keyProgressCache = { ...keyProgressCache, ...progress };
    saveState();
    resolve();
  }, 100));
}
