/* DefendIQ interactive script.js
   - Optimized for performance with debounced chart rendering, reduced confetti, cached data
   - Persists state for refresh to preserve selections and current view
   - Enhanced error handling for questions.json with retry and fallback
   - Handles landing -> dashboard with graphs, module selection, quizzes, certificates
   - Uses Web Share API, server-side persistence, random learning tips
*/

const startBtn = document.getElementById('startBtn');
const landing = document.getElementById('landing');
const app = document.getElementById('app');
const homeBtn = document.getElementById('homeBtn');
const refreshBtn = document.getElementById('refreshBtn');
const moduleSelect = document.getElementById('moduleSelect');
const moduleBody = document.getElementById('moduleBody');
const closeModuleBtn = document.getElementById('closeModuleBtn');
const streakDOM = document.getElementById('streak');
const pointsDOM = document.getElementById('points');
const completionDOM = document.getElementById('completion');
const badgesDOM = document.getElementById('badges');
const learningTipsDOM = document.getElementById('learningTips');
const globalAffirmationDOM = document.getElementById('globalAffirmation');

/* ---------- Persistent Stats (Server-Side) ---------- */
let stats = {
  streak: 0,
  points: 0,
  completion: 0,
  badges: []
};
let MODULES = {};
let keyProgressCache = {}; // Cache progress to reduce API/localStorage calls
let chartInstance = null; // Store chart instance to prevent multiple renders

/* API Endpoint (Hypothetical) */
const API_URL = 'https://api.defendiq.com';

/* Load stats from server */
async function loadStats() {
  try {
    const response = await fetch(`${API_URL}/stats`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
      stats = await response.json();
    }
  } catch (err) {
    console.error('Failed to load stats:', err);
    stats = JSON.parse(localStorage.getItem('defendiq_stats')) || stats;
  }
  refreshStatsUI();
}

/* Save stats to server */
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

/* Load module progress from server */
async function loadModuleProgress() {
  if (Object.keys(keyProgressCache).length) return keyProgressCache;
  try {
    const response = await fetch(`${API_URL}/progress`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
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

/* Save module progress to server */
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

/* Update UI */
function refreshStatsUI() {
  streakDOM.textContent = stats.streak;
  pointsDOM.textContent = stats.points;
  completionDOM.textContent = stats.completion + '%';
  badgesDOM.innerHTML = stats.badges.length ? stats.badges.map(b => `<span class="badge flash">${b}</span>`).join(' ') : 'None';
  debounceRenderGlobalProgressChart();
}

/* ---------- State Persistence for Refresh ---------- */
let current = {
  key: null,
  idx: 0,
  mode: 'selection', // 'selection', 'material', 'quiz', 'certificate'
  certificate: null // { moduleName, timestamp, hash }
};

function saveState() {
  localStorage.setItem('defendiq_state', JSON.stringify(current));
}

async function restoreState() {
  const savedState = JSON.parse(localStorage.getItem('defendiq_state') || '{}');
  if (savedState.key && MODULES[savedState.key]) {
    current = savedState;
    landing.classList.add('hidden');
    app.classList.remove('hidden');
    moduleSelect.value = current.key;
    document.querySelector('.module-title').textContent = MODULES[current.key].title;
    if (current.mode === 'selection') {
      renderModuleSelection();
    } else if (current.mode === 'material') {
      renderLearningMaterial();
    } else if (current.mode === 'quiz') {
      renderQuestion();
    } else if (current.mode === 'certificate' && current.certificate) {
      showCertificate(current.certificate.moduleName, current.certificate.timestamp, current.certificate.hash);
    }
  } else {
    // Fallback to safe state if MODULES not loaded or state invalid
    current = { key: null, idx: 0, mode: 'selection', certificate: null };
    saveState();
    closeModule();
  }
}

/* ---------- Load Questions from JSON with Retry ---------- */
async function loadQuestions(attempt = 1, maxAttempts = 3) {
  try {
    if (Object.keys(MODULES).length) return; // Cache questions
    const response = await fetch('questions.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}, URL: ${response.url}`);
    }
    const text = await response.text();
    try {
      MODULES = JSON.parse(text);
    } catch (parseErr) {
      throw new Error(`Invalid JSON in questions.json: ${parseErr.message}`);
    }
    await restoreState();
    debounceRenderGlobalProgressChart();
    startLearningTips();
  } catch (err) {
    console.error(`Attempt ${attempt} failed to load questions.json:`, err.message);
    if (attempt < maxAttempts) {
      console.log(`Retrying... (${attempt + 1}/${maxAttempts})`);
      return setTimeout(() => loadQuestions(attempt + 1, maxAttempts), 1000);
    }
    console.error('All attempts to load questions.json failed. Check file path, JSON validity, or network.');
    console.error('Expected file: https://mashifmj-prog.github.io/defendiq/questions.json');
    alert('Error loading questions. Please check your connection or try again later.');
    // Fallback UI
    MODULES = {};
    current = { key: null, idx: 0, mode: 'selection', certificate: null };
    saveState();
    moduleBody.innerHTML = '<p>Unable to load modules. Please check your connection or refresh the page.</p><button id="retryBtn" class="action-btn">Retry</button>';
    document.getElementById('retryBtn')?.addEventListener('click', () => loadQuestions());
    closeModule();
  }
}
loadQuestions();
loadStats();

/* ---------- Learning Tips (Optimized) ---------- */
const LEARNING_TIPS = [
  "Always verify email senders before clicking links.",
  "Use strong, unique passwords for every account.",
  "Enable multi-factor authentication for extra security.",
  "Report suspicious activity to IT immediately.",
  "Stay cautious of urgent or unusual requests.",
  "Regular training boosts your cybersecurity skills."
];

function startLearningTips() {
  let tipIndex = 0;
  learningTipsDOM.textContent = LEARNING_TIPS[tipIndex];
  setInterval(() => {
    tipIndex = (tipIndex + 1) % LEARNING_TIPS.length;
    learningTipsDOM.classList.add('fade-out');
    setTimeout(() => {
      learningTipsDOM.textContent = LEARNING_TIPS[tipIndex];
      learningTipsDOM.classList.remove('fade-out');
    }, 500);
  }, 5000);
}

/* ---------- Debounced Chart Rendering ---------- */
let chartRenderTimeout = null;
function debounceRenderGlobalProgressChart() {
  if (chartRenderTimeout) clearTimeout(chartRenderTimeout);
  chartRenderTimeout = setTimeout(() => {
    renderGlobalProgressChart();
  }, 100);
}

function renderGlobalProgressChart() {
  if (!Object.keys(MODULES).length) return;
  const ctx = document.getElementById('globalProgressChart').getContext('2d');
  if (chartInstance) chartInstance.destroy(); // Prevent multiple chart instances
  const data = Object.keys(MODULES).map(key => {
    const prog = keyProgressCache[key] || { answered: [] };
    return prog.answered.length / MODULES[key].questions.length * 100;
  });

  const affirmations = [
    stats.completion < 30 ? "You're just starting, but you're on the right path! Keep going!" :
    stats.completion < 60 ? "Great progress! You're becoming a cybersecurity pro!" :
    stats.completion < 100 ? "Almost there! Your skills are shining!" :
    "Congratulations! You're a cybersecurity champion!"
  ];
  globalAffirmationDOM.textContent = affirmations[0];

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(MODULES).map(key => MODULES[key].title),
      datasets: [{
        label: 'Module Completion (%)',
        data: data,
        backgroundColor: ['#ff7a7a', '#ffd56b', '#8affc1', '#9fb4ff', '#ff7a7a', '#ffd56b', '#8affc1'],
        borderColor: ['#ffffff'],
        borderWidth: 1
      }]
    },
    options: {
      animation: false, // Reduce animation overhead
      scales: { y: { beginAtZero: true, max: 100 } },
      plugins: { legend: { display: false }, title: { display: true, text: 'Your Overall Progress', color: '#ffffff' } }
    }
  });
}

/* ---------- Landing -> App ---------- */
startBtn.addEventListener('click', () => {
  landing.classList.add('hidden');
  app.classList.remove('hidden');
  saveState();
});

/* ---------- Home Button ---------- */
homeBtn.addEventListener('click', () => {
  app.classList.add('hidden');
  landing.classList.remove('hidden');
  current = { key: null, idx: 0, mode: 'selection', certificate: null };
  saveState();
});

/* ---------- Refresh Button ---------- */
refreshBtn.addEventListener('click', () => {
  if (current.mode === 'selection') {
    renderModuleSelection();
  } else if (current.mode === 'material') {
    renderLearningMaterial();
  } else if (current.mode === 'quiz') {
    renderQuestion();
  } else if (current.mode === 'certificate' && current.certificate) {
    showCertificate(current.certificate.moduleName, current.certificate.timestamp, current.certificate.hash);
  }
});

/* ---------- Dropdown Interactions ---------- */
const watermark = document.querySelector('.select-wrap .watermark');
moduleSelect.addEventListener('focus', () => watermark.style.opacity = 0.2);
moduleSelect.addEventListener('blur', () => watermark.style.opacity = 1);

moduleSelect.addEventListener('change', () => {
  const v = moduleSelect.value;
  if (!v || v === "") return;
  if (v === 'exit') {
    moduleSelect.selectedIndex = 0;
    closeModule();
    return;
  }
  openModule(v);
});

/* Close module button */
closeModuleBtn.addEventListener('click', () => {
  moduleSelect.selectedIndex = 0;
  closeModule();
});

/* ---------- Open Module ---------- */
function openModule(key) {
  current.key = key;
  current.idx = 0;
  current.mode = 'selection';
  current.certificate = null;
  saveState();
  renderModuleSelection();
  const title = MODULES[key] ? MODULES[key].title : key;
  document.querySelector('.module-title')?.replaceWith(createModuleTitleElem(title
