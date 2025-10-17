let MODULES = {};

async function loadQuestions() {
  const loadingIndicator = document.getElementById('loadingIndicator');
  if (loadingIndicator) loadingIndicator.classList.remove('hidden');
  try {
    const response = await fetch('questions.json');
    if (!response.ok) throw new Error('Network response was not ok');
    MODULES = await response.json();
    console.log('Modules loaded:', Object.keys(MODULES).length);
    return MODULES;
  } catch (error) {
    console.error('Failed to load questions:', error);
    const errorFallback = document.getElementById('errorFallback');
    if (errorFallback) errorFallback.classList.remove('hidden');
    return {};
  } finally {
    if (loadingIndicator) loadingIndicator.classList.add('hidden');
  }
}

function triggerConfetti(isCorrect) {
  if (window.JSConfetti) {
    const confetti = new window.JSConfetti();
    if (isCorrect) {
      confetti.addConfetti({ confettiNumber: 100, confettiColors: ['#ff7a7a', '#ffd56b', '#8affc1', '#9fb4ff'], confettiRadius: 5, confettiSpeed: 5 });
      setTimeout(() => confetti.clearCanvas(), 1000);
    } else {
      confetti.addConfetti({ confettiNumber: 30, confettiColors: ['#c62828'], confettiRadius: 3, confettiSpeed: 3 });
      setTimeout(() => confetti.clearCanvas(), 1000);
    }
  }
}

function saveModuleProgress(progress) {
  return new Promise(resolve => {
    setTimeout(() => {
      keyProgressCache = { ...keyProgressCache, ...progress };
      saveState();
      resolve();
    }, 100);
  });
}

function handleSupportInput(inputValue, chatHistory) {
  if (!chatHistory) return;
  const userName = userProfile ? userProfile.username : 'Guest';
  const now = new Date();
  const isLateNight = now.getHours() >= 0 && now.getHours() < 6;
  let response = `Hi ${userName}! ${isLateNight ? 'Late night? ' : ''}I'm here to help. Try these modules.`;

  const incompleteModules = Object.keys(stats.moduleProgress).filter(key => !stats.moduleProgress[key]?.completed);
  const suggestedModule = incompleteModules.length ? MODULES[incompleteModules[0]]?.title : "review completed ones";

  if (inputValue.toLowerCase().includes('phishing')) {
    response = `Hi ${userName}! ${isLateNight ? 'Stay alert! ' : ''}Phishing is about fake emails. You’re at ${stats.moduleProgress['phishing']?.completionPercentage || 0}% on 'Phishing Simulation'. Try '${suggestedModule}' next!`;
  } else if (inputValue.toLowerCase().includes('help')) {
    response = `Hi ${userName}! ${isLateNight ? 'Need a boost? ' : ''}You’re at ${stats.completion}% overall. Check '${suggestedModule}' next!`;
  }
  const aiMessage = document.createElement('div');
  aiMessage.className = 'support-chat-message ai';
  aiMessage.textContent = response;
  chatHistory.appendChild(aiMessage);
  chatHistory.scrollTop = chatHistory.scrollHeight;
  console.log('Response sent:', response);
}
