let currentMode = 'landing';
let current = { key: null, idx: 0, mode: 'selection', certificate: null };
let keyProgressCache = {};
let stats = { points: 0, streak: 0, completion: 0, badges: [] };
let chartInstance;
let userProfile = JSON.parse(localStorage.getItem('defendiq_user')) || null;

function saveState() {
  localStorage.setItem('defendiqState', JSON.stringify({ currentMode, current, keyProgressCache, stats, userProfile }));
}

function restoreState() {
  const state = localStorage.getItem('defendiqState');
  if (state) {
    const parsed = JSON.parse(state);
    currentMode = parsed.currentMode || 'landing';
    current = parsed.current || { key: null, idx: 0, mode: 'selection', certificate: null };
    keyProgressCache = parsed.keyProgressCache || {};
    stats = parsed.stats || { points: 0, streak: 0, completion: 0, badges: [] };
    userProfile = parsed.userProfile || null;
    if (!userProfile && currentMode !== 'landing') {
      showSignupOverlay();
    } else if (currentMode === 'training' || currentMode === 'support') {
      document.getElementById('landing').classList.add('hidden');
      document.getElementById('app').classList.remove('hidden');
      if (currentMode === 'training') renderTrainingDashboard();
      else renderSupportMode();
    }
  } else {
    showSignupOverlay();
  }
}

function saveStats() {
  stats.streakDOM = document.getElementById('streak');
  stats.pointsDOM = document.getElementById('points');
  stats.completionDOM = document.getElementById('completion');
  stats.badgesDOM = document.getElementById('badges');
  if (stats.streakDOM) stats.streakDOM.textContent = stats.streak;
  if (stats.pointsDOM) stats.pointsDOM.textContent = stats.points;
  if (stats.completionDOM) stats.completionDOM.textContent = `${stats.completion}%`;
  if (stats.badgesDOM) stats.badgesDOM.textContent = stats.badges.length ? stats.badges.join(', ') : 'None';
  saveState();
}

function showSignupOverlay() {
  const overlay = document.getElementById('signupOverlay');
  if (overlay) overlay.classList.remove('hidden');
}

function saveUserProfile(username) {
  userProfile = { username, joined: new Date().toISOString() };
  localStorage.setItem('defendiq_user', JSON.stringify(userProfile));
  saveState();
  document.getElementById('signupOverlay').classList.add('hidden');
  if (currentMode === 'training') renderTrainingDashboard();
  else if (currentMode === 'support') renderSupportMode();
}
