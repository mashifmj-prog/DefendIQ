let MODULES = {};

async function loadQuestions() {
  try {
    const response = await fetch('questions.json');
    if (!response.ok) throw new Error('Network response was not ok');
    MODULES = await response.json();
    console.log('Modules loaded:', Object.keys(MODULES).length);
    return MODULES;
  } catch (error) {
    console.error('Failed to load questions:', error);
    moduleBody.innerHTML = '<p>Failed to load modules. Check your connection or try again later.</p>';
    return {};
  }
}

function triggerConfetti(isCorrect) {
  const confetti = window.JSConfetti ? new window.JSConfetti() : null;
  if (confetti && isCorrect) {
    confetti.addConfetti({
      confettiNumber: 100,
      confettiColors: ['#ff7a7a', '#ffd56b', '#8affc1', '#9fb4ff'],
      confettiRadius: 5,
      confettiSpeed: 5
    });
    setTimeout(() => confetti.clearCanvas(), 1000);
  } else if (confetti) {
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
  return new Promise((resolve) => {
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
  const isLateNight = now.getHours() >= 0 && now.getHours() < 6; // 01:42 AM SAST check
  let response = `Hi ${userName}! ${isLateNight ? 'Late night studying? ' : ''}Thanks for your message. I'm here to help. Based on your progress, consider these modules.`;

  const incompleteModules = Object.keys(stats.moduleProgress).filter(key => !stats.moduleProgress[key]?.completed);
  const suggestedModule = incompleteModules.length ? MODULES[incompleteModules[0]]?.title : "all completed modules for review";

  if (inputValue.includes('phishing')) {
    response = `Great question, ${userName}! ${isLateNight ? 'Stay sharp! ' : ''}Phishing involves fake emails. You’re ${stats.moduleProgress['phishing']?.completionPercentage || 0}% done with 'Phishing Simulation'. Try it or move to '${suggestedModule}' next!`;
  } else if (inputValue.includes('help') || inputValue.includes('support')) {
    response = `I'm here for you, ${userName}! ${isLateNight ? 'Burning the midnight oil? ' : ''}You’ve completed ${stats.completion}% overall. Try '${suggestedModule}' for your next step. Need tips?`;
  } else if (inputValue.includes('confident') || inputValue.includes('struggling')) {
    response = `You’re doing great, ${userName}! ${isLateNight ? 'Keep the momentum! ' : ''}You’re at ${stats.completion}% completion. Start or revisit '${suggestedModule}' to build confidence.`;
  } else if (inputValue.includes('progress')) {
    response = `Your progress, ${userName}: ${stats.completion}% complete, ${stats.points} points, ${stats.streak}-day streak. ${isLateNight ? 'Great effort tonight! ' : ''}Focus on '${suggestedModule}'!`;
  } else {
    response = `Interesting, ${userName}! ${isLateNight ? 'Late night curiosity? ' : ''}You’re at ${stats.completion}% completion. Try '${suggestedModule}' or ask about specific topics!`;
  }

  const aiMessage = document.createElement('div');
  aiMessage.className = 'support-chat-message ai';
  aiMessage.textContent = response;
  chatHistory.appendChild(aiMessage);
  chatHistory.scrollTop = chatHistory.scrollHeight;
  console.log('Response sent:', response);
}
