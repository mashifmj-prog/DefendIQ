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

function handleSupportInput() {
  const input = document.getElementById('supportInput').value.trim().toLowerCase();
  const output = document.getElementById('supportOutput');
  let response = "Thanks for your message! I'm here to help. Based on your progress, consider these modules.";

  // Incorporate progress analytics into responses
  const incompleteModules = Object.keys(stats.moduleProgress).filter(key => !stats.moduleProgress[key].completed);
  const suggestedModule = incompleteModules.length ? MODULES[incompleteModules[0]].title : "all completed modules for review";

  if (input.includes('phishing')) {
    response = `Great question! Phishing involves fake emails. You’re ${stats.moduleProgress['phishing']?.completionPercentage || 0}% done with 'Phishing Simulation'. Try it or move to '${suggestedModule}' next!`;
  } else if (input.includes('help') || input.includes('support')) {
    response = `I'm here for you! You’ve completed ${stats.completion}% overall. Try '${suggestedModule}' for your next step. Need tips?`;
  } else if (input.includes('confident') || input.includes('struggling')) {
    response = `You’re doing great! You’re at ${stats.completion}% completion. Start or revisit '${suggestedModule}' to build confidence.`;
  } else if (input.includes('progress')) {
    response = `Your progress: ${stats.completion}% complete, ${stats.points} points, ${stats.streak}-day streak. Focus on '${suggestedModule}'!`;
  } else {
    response = `Interesting! You’re at ${stats.completion}% completion. Try '${suggestedModule}' or ask about specific topics!`;
  }

  output.innerHTML += `<p><strong>AI:</strong> ${response}</p>`;
  document.getElementById('supportInput').value = '';
  updateAffirmation();
}
