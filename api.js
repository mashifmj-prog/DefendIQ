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
  let response = "Thanks for your message! I'm here to help.";

  if (input.includes('phishing')) {
    response = "Great question! Phishing involves fake emails. Try the 'Phishing Simulation' module for practice. Tip: Look for spelling errors or odd links.";
  } else if (input.includes('help') || input.includes('support')) {
    response = "I'm here for you! Let me know what you need—e.g., module tips or encouragement. How about starting with 'Phishing Simulation'?";
  } else if (input.includes('confident') || input.includes('struggling')) {
    response = "You're doing great! It’s normal to feel that way. Start with an easy module like 'Phishing Simulation' to build confidence.";
  }

  output.innerHTML += `<p><strong>AI:</strong> ${response}</p>`;
  document.getElementById('supportInput').value = '';
  updateAffirmation();
}
