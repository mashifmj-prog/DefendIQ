document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, starting initialization...');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const errorFallback = document.getElementById('errorFallback');
  if (loadingIndicator) loadingIndicator.classList.remove('hidden');

  restoreState();
  loadQuestions().then(() => {
    if (loadingIndicator) loadingIndicator.classList.add('hidden');
    console.log('Questions loaded, setting mode...');
    if (currentMode === 'training') enterTrainingMode();
    else if (currentMode === 'support') enterSupportMode();
    else if (!userProfile) showSignupOverlay();
  }).catch(error => {
    console.error('Initialization failed:', error);
    if (loadingIndicator) loadingIndicator.classList.add('hidden');
    if (errorFallback) errorFallback.classList.remove('hidden');
  });

  // Landing page buttons
  const trainingBtn = document.getElementById('trainingBtn');
  const supportBtn = document.getElementById('supportBtn');
  if (trainingBtn) trainingBtn.addEventListener('click', () => {
    if (!userProfile) showSignupOverlay();
    else enterTrainingMode();
  });
  if (supportBtn) supportBtn.addEventListener('click', () => {
    if (!userProfile) showSignupOverlay();
    else enterSupportMode();
  });

  // Sign-up handling
  const signupBtn = document.getElementById('signupBtn');
  const closeSignupBtn = document.getElementById('closeSignupBtn');
  if (signupBtn) signupBtn.addEventListener('click', () => {
    const usernameInput = document.getElementById('username');
    const username = usernameInput ? usernameInput.value.trim() : '';
    if (username) {
      saveUserProfile(username);
      if (currentMode === 'training') enterTrainingMode();
      else if (currentMode === 'support') enterSupportMode();
      else enterSupportMode();
    } else {
      alert('Please enter a username.');
    }
  });
  if (closeSignupBtn) closeSignupBtn.addEventListener('click', () => {
    const overlay = document.getElementById('signupOverlay');
    if (overlay) overlay.classList.add('hidden');
  });

  // Navigation
  const homeBtn = document.getElementById('homeBtn');
  const refreshBtn = document.getElementById('refreshBtn');
  const feedbackBtn = document.getElementById('feedbackBtn');
  const closeModuleBtn = document.getElementById('closeModuleBtn');
  if (homeBtn) homeBtn.addEventListener('click', goHome);
  if (refreshBtn) refreshBtn.addEventListener('click', refreshCurrentView);
  if (feedbackBtn) feedbackBtn.addEventListener('click', showFeedback);
  if (closeModuleBtn) closeModuleBtn.addEventListener('click', closeModule);
});

/* ---------- Navigation Functions ---------- */
function goHome() {
  const app = document.getElementById('app');
  const landing = document.getElementById('landing');
  if (app && landing) {
    app.classList.add('hidden');
    landing.classList.remove('hidden');
  }
  currentMode = 'landing';
  saveState();
  console.log('Returned to home page');
}

function enterTrainingMode() {
  const app = document.getElementById('app');
  const landing = document.getElementById('landing');
  if (app && landing) {
    currentMode = 'training';
    landing.classList.add('hidden');
    app.classList.remove('hidden');
    const quizDropdown = document.querySelector('.quiz-dropdown');
    const statsArea = document.querySelector('.stats-area');
    if (quizDropdown) quizDropdown.classList.remove('hidden');
    if (statsArea) statsArea.classList.remove('hidden');
    renderTrainingDashboard();
    saveState();
    console.log('Entered Training Mode');
  }
}

function enterSupportMode() {
  const app = document.getElementById('app');
  const landing = document.getElementById('landing');
  if (app && landing) {
    currentMode = 'support';
    landing.classList.add('hidden');
    app.classList.remove('hidden');
    const quizDropdown = document.querySelector('.quiz-dropdown');
    const statsArea = document.querySelector('.stats-area');
    const moduleTitle = document.querySelector('.module-title');
    if (quizDropdown) quizDropdown.classList.add('hidden');
    if (statsArea) statsArea.classList.add('hidden');
    if (moduleTitle) moduleTitle.textContent = 'Support Mode';
    renderSupportMode();
    saveState();
    console.log('Entered Support Mode');
  }
}

function refreshCurrentView() {
  if (currentMode === 'training') {
    if (current.mode === 'selection') renderModuleSelection();
    else if (current.mode === 'material') renderLearningMaterial();
    else if (current.mode === 'quiz') renderQuestion();
    else if (current.mode === 'certificate') showCertificate(current.certificate?.moduleName, current.certificate?.timestamp, current.certificate?.hash);
  } else if (currentMode === 'support') {
    renderSupportMode();
  }
  console.log('Refreshed current view');
}

function showFeedback() {
  alert('Thank you for your feedback! Your input helps us improve DefendIQ.');
  console.log('Feedback submitted');
}

function sanitize(s) {
  return String(s).replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
