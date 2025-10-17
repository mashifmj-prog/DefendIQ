/* State management for DefendIQ */
let stats = { streak: 0, points: 0, completion: 0, badges: [] };
let MODULES = {};
let keyProgressCache = {};
let userProfile = JSON.parse(localStorage.getItem('defendiq_user')) || null;
let currentMode = 'landing';
let chatHistory = JSON.parse(localStorage.getItem('defendiq_chat')) || [];
let knowledgeLevel = JSON.parse(localStorage.getItem('defendiq_knowledge')) || { score: 0, keywords: [] };
let current = { key: null, idx: 0, mode: 'selection', certificate: null };

const API_URL = 'https://api.defendiq.com';

async function loadStats() {
  try {
    const response = await fetch(`${API_URL}/stats`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    if (response.ok) stats = await response.json();
  } catch (err) {
    console.error('Failed to load stats:', err);
    stats = JSON.parse(localStorage.getItem('defendiq_stats')) || stats;
  }
  refreshStatsUI();
}

async function saveStats() {
  try {
    const response = await fetch(`${API_URL}/stats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stats)
    });
    if (!response.ok) throw new Error('Failed to save stats');
  } catch (err) {
    console.error('Failed to save stats:', err);
    localStorage.setItem('defendiq_stats', JSON.stringify(stats));
  }
}

async function loadModuleProgress() {
  if (Object.keys(keyProgressCache).length) return keyProgressCache;
  try {
    const response = await fetch(`${API_URL}/progress`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    if (response.ok) {
      keyProgressCache = await response.json();
      return keyProgressCache;
    }
  } catch (err) {
    console.error('Failed to load progress:', err);
    keyProgressCache = JSON.parse(localStorage.getItem('defendiq_module_progress') || '{}');
    return keyProgressCache;
  }
}

async function saveModuleProgress(keyProgress) {
  keyProgressCache = keyProgress;
  try {
    const response = await fetch(`${API_URL}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(keyProgress)
    });
    if (!response.ok) throw new Error('Failed to save progress');
  } catch (err) {
    console.error('Failed to save progress:', err);
    localStorage.setItem('defendiq_module_progress', JSON.stringify(keyProgress));
  }
}

function saveState() {
  localStorage.setItem('defendiq_state', JSON.stringify({ current, currentMode }));
}

async function restoreState() {
  const savedState = JSON.parse(localStorage.getItem('defendiq_state') || '{}');
  if (savedState.currentMode) {
    currentMode = savedState.currentMode;
    current = savedState.current || { key: null, idx: 0, mode: 'selection', certificate: null };
    landing.classList.add('hidden');
    app.classList.remove('hidden');
    if (currentMode === 'training') {
      quizDropdown.classList.remove('hidden');
      statsArea.classList.remove('hidden');
      if (current.key && MODULES[current.key]) {
        moduleSelect.value = current.key;
        document.querySelector('.module-title').textContent = MODULES[current.key].title;
        if (current.mode === 'selection') renderModuleSelection();
        else if (current.mode === 'material') renderLearningMaterial();
        else if (current.mode === 'quiz') renderQuestion();
        else if (current.mode === 'certificate' && current.certificate) showCertificate(current.certificate.moduleName, current.certificate.timestamp, current.certificate.hash);
      } else {
        closeModule();
      }
    } else if (currentMode === 'support') {
      quizDropdown.classList.add('hidden');
      statsArea.classList.add('hidden');
      document.querySelector('.module-title').textContent = 'Support Mode';
      renderSupportContent();
    }
  } else {
    current = { key: null, idx: 0, mode: 'selection', certificate: null };
    currentMode = 'landing';
    saveState();
  }
}

function setMode(mode) {
  currentMode = mode;
}

function getMode() {
  return currentMode;
}
