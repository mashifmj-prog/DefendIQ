let currentMode = 'landing';
let current = { key: null, idx: 0, mode: 'selection', certificate: null };
let keyProgressCache = {};
let stats = { points: 0, streak: 0, completion: 0, badges: [], moduleProgress: {} };
let chartInstance;
let userProfile = JSON.parse(localStorage.getItem('defendiq_user')) || null;

function saveState() {
  try {
    localStorage.setItem('defendiqState', JSON.stringify({ currentMode, current, keyProgressCache, stats, userProfile }));
    console.log('State saved successfully');
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

function restoreState() {
  try {
    const state = localStorage.getItem('defendiqState');
    if (state) {
      const parsed = JSON.parse(state);
      currentMode = parsed.currentMode || 'landing';
      current = parsed.current || { key: null, idx: 0, mode: 'selection', certificate: null };
      keyProgressCache = parsed.keyProgressCache || {};
      stats = parsed.stats || { points: 0, streak: 0, completion: 0, badges: [], moduleProgress: {} };
      userProfile = parsed.userProfile || null;
    }
    saveStats();
    console.log('State restored, mode:', currentMode, 'user:', userProfile ? userProfile.username : 'none');
  } catch (e) {
    console.error('Failed to restore state:', e);
    currentMode = 'landing';
    userProfile = null;
    saveState();
  }
}

function saveStats() {
  const streakDOM = document.getElementById('streak');
  const pointsDOM = document.getElementById('points');
  const completionDOM = document.getElementById('completion');
  const badgesDOM = document.getElementById('badges');
  if (streakDOM) streakDOM.textContent = stats.streak;
  if (pointsDOM) pointsDOM.textContent = stats.points;
  if (completionDOM) completionDOM.textContent = `${stats.completion}%`;
  if (badgesDOM) badgesDOM.textContent = stats.badges.length ? stats.badges.join(', ') : 'None';
  saveState();
}

function showSignupOverlay() {
  const overlay = document.getElementById('signupOverlay');
  if (overlay) {
    overlay.classList.remove('hidden');
    console.log('Signup overlay shown');
  }
}

function saveUserProfile(username) {
  userProfile = { username, joined: new Date().toISOString() };
  localStorage.setItem('defendiq_user', JSON.stringify(userProfile));
  saveState();
  const overlay = document.getElementById('signupOverlay');
  if (overlay) overlay.classList.add('hidden');
  console.log('User profile saved:', username);
}
