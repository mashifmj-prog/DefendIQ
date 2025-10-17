/* DefendIQ interactive script.js
   - Optimized for performance with debounced chart rendering, reduced confetti, cached data
   - Persists state for refresh to preserve selections and current view
   - Enhanced error handling for questions.json with retry and fallback
   - Handles landing -> training/support modes, quizzes, certificates
   - Support mode with signup and tailored emotional support
   - Feedback button made static (no popup, disabled)
*/

const trainingBtn = document.getElementById('trainingBtn');
const supportBtn = document.getElementById('supportBtn');
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
const quizDropdown = document.querySelector('.quiz-dropdown');
const statsArea = document.querySelector('.stats-area');

/* ---------- Persistent Stats (Server-Side) ---------- */
let stats = {
  streak: 0,
  points: 0,
  completion: 0,
  badges: []
};
let MODULES = {};
let keyProgressCache = {};
let chartInstance = null;
let userProfile = JSON.parse(localStorage.getItem('defendiq_user')) || null;
let currentMode = 'landing'; // 'landing', 'training', 'support'

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
  if (currentMode === 'training') debounceRenderGlobalProgressChart();
}

/* ---------- Support Mode ---------- */
const AFFIRMATIONS = {
  morning: [
    "Good morning, {name}! You're ready to conquer the day with confidence!",
    "Rise and shine, {name}! Your positivity is your shield today!",
    "Hello, {name}! Start your day strong with a clear mind and secure habits."
  ],
  afternoon: [
    "Good afternoon, {name}! Keep shining, you're doing great!",
    "Hey {name}, you're halfway through the day—stay strong and safe!",
    "{name}, your focus this afternoon is inspiring. Keep it up!"
  ],
  evening: [
    "Good evening, {name}! Reflect on your wins today—you're unstoppable!",
    "Hey {name}, unwind with pride in your progress!",
    "{name}, evening vibes are perfect for relaxing and staying secure."
  ],
  night: [
    "Good night, {name}! Rest well, knowing you're growing stronger every day.",
    "{name}, sleep tight and dream of crushing it tomorrow!",
    "Night, {name}! Your resilience is your superpower."
  ]
};

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  if (hour < 20) return 'evening';
  return 'night';
}

function getSeason() {
  const month = new Date().getMonth();
  return month >= 2 && month <= 4 ? 'Spring' :
         month >= 5 && month <= 7 ? 'Winter' :
         month >= 8 && month <= 10 ? 'Summer' :
         'Autumn';
}

function renderSupportContent() {
  console.log('Rendering Support Mode content');
  if (!userProfile) {
    moduleBody.innerHTML = `
      <div class="support-form">
        <h2>Welcome to Support Mode! 🛡️</h2>
        <p>Let's get to know you to provide personalized support.</p>
        <input type="text" id="userName" placeholder="Your Name" required>
        <input type="number" id="userAge" placeholder="Your Age" min="18" max="120">
        <select id="userMaritalStatus">
          <option value="" disabled selected>Marital Status</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Other">Other</option>
        </select>
        <select id="userGender">
          <option value="" disabled selected>Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input type="text" id="userRegion" placeholder="Your Region (e.g., Cape Town)">
        <button id="submitProfileBtn" class="action-btn">Submit</button>
      </div>`;
    document.getElementById('submitProfileBtn').addEventListener('click', () => {
      const name = document.getElementById('userName').value.trim();
      const age = document.getElementById('userAge').value;
      const maritalStatus = document.getElementById('userMaritalStatus').value;
      const gender = document.getElementById('userGender').value;
      const region = document.getElementById('userRegion').value.trim();
      if (name && age && maritalStatus && gender && region) {
        console.log('Support Mode profile submitted:', { name, age, maritalStatus, gender, region });
        userProfile = { name, age: Number(age), maritalStatus, gender, region };
        localStorage.setItem('defendiq_user', JSON.stringify(userProfile));
        renderSupportMessage();
      } else {
        alert('Please fill in all fields.');
      }
    });
  } else {
    renderSupportMessage();
  }
}

function renderSupportMessage() {
  console.log('Rendering Support Mode message');
  const timeOfDay = getTimeOfDay();
  const season = getSeason();
  const affirmations = AFFIRMATIONS[timeOfDay];
  const affirmation = affirmations[Math.floor(Math.random() * affirmations.length)].replace('{name}', userProfile.name);
  const regionMessage = userProfile.region ? `Stay strong in ${userProfile.region} this ${season}!` : `Enjoy this ${season} season!`;
  const securityTip = LEARNING_TIPS[Math.floor(Math.random() * LEARNING_TIPS.length)];
  moduleBody.innerHTML = `
    <div class="support-message">
      <h2>${affirmation}</h2>
      <p>${regionMessage}</p>
      <p>Security Tip: ${securityTip}</p>
      <button id="refreshSupportBtn" class="action-btn">New Message</button>
    </div>`;
  document.getElementById('refreshSupportBtn').addEventListener('click', () => {
    console.log('Support Mode new message requested');
    renderSupportMessage();
  });
}

/* ---------- Mode Handlers ---------- */
trainingBtn.addEventListener('click', () => {
  console.log('Training Mode button clicked');
  currentMode = 'training';
  landing.classList.add('hidden');
  app.classList.remove('hidden');
  quizDropdown.classList.remove('hidden');
  statsArea.classList.remove('hidden');
  closeModule();
  saveState();
});

supportBtn.addEventListener('click', () => {
  console.log('Support Mode button clicked');
  currentMode = 'support';
  landing.classList.add('hidden');
  app.classList.remove('hidden');
  quizDropdown.classList.add('hidden');
  statsArea.classList.add('hidden');
  document.querySelector('.module-title').textContent = 'Support Mode';
  renderSupportContent();
  saveState();
});

/* ---------- State Persistence for Refresh ---------- */
let current = {
  key: null,
  idx: 0,
  mode: 'selection', // 'selection', 'material', 'quiz', 'certificate'
  certificate: null // { moduleName, timestamp, hash }
};

function saveState() {
  localStorage.setItem('defendiq_state', JSON.stringify({ current, currentMode }));
}

async function restoreState() {
  console.log('Restoring state');
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

/* ---------- Load Questions from JSON with Retry ---------- */
async function loadQuestions(attempt = 1, maxAttempts = 3) {
  try {
    if (Object.keys(MODULES).length) return;
    const response = await fetch('questions.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}, URL: ${response.url}`);
    }
    const text = await response.text();
    try {
      MODULES = JSON.parse(text);
      const options = Object.keys(MODULES).map(key => `<option value="${key}">${MODULES[key].title}</option>`).join('');
      moduleSelect.innerHTML = `<option value="" disabled selected>Select a module</option>${options}<option value="exit">Exit</option>`;
    } catch (parseErr) {
      throw new Error(`Invalid JSON in questions.json: ${parseErr.message}`);
    }
    await restoreState();
    if (currentMode === 'training') debounceRenderGlobalProgressChart();
    startLearningTips();
  } catch (err) {
    console.error(`Attempt ${attempt} failed to load questions.json:`, err.message);
    if (attempt < maxAttempts) {
      console.log(`Retrying... (${attempt + 1}/${maxAttempts})`);
      return setTimeout(() => loadQuestions(attempt + 1, maxAttempts), 1000);
    }
    console.error('All attempts to load questions.json failed. Check file path, JSON validity, or network.');
    console.error('Expected file: https://mashifmj-prog.github.io/DefendIQ/questions.json');
    alert('Error loading questions. Please check your connection or try again later.');
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
  if (!Object.keys(MODULES).length || currentMode !== 'training') return;
  const ctx = document.getElementById('globalProgressChart').getContext('2d');
  if (chartInstance) chartInstance.destroy();
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
      animation: false,
      scales: { y: { beginAtZero: true, max: 100 } },
      plugins: { legend: { display: false }, title: { display: true, text: 'Your Overall Progress', color: '#ffffff' } }
    }
  });
}

/* ---------- Home Button ---------- */
homeBtn.addEventListener('click', () => {
  console.log('Home button clicked');
  app.classList.add('hidden');
  landing.classList.remove('hidden');
  currentMode = 'landing';
  current = { key: null, idx: 0, mode: 'selection', certificate: null };
  saveState();
});

/* ---------- Refresh Button ---------- */
refreshBtn.addEventListener('click', () => {
  console.log('Refresh button clicked');
  if (currentMode === 'training') {
    if (current.mode === 'selection') {
      renderModuleSelection();
    } else if (current.mode === 'material') {
      renderLearningMaterial();
    } else if (current.mode === 'quiz') {
      renderQuestion();
    } else if (current.mode === 'certificate' && current.certificate) {
      showCertificate(current.certificate.moduleName, current.certificate.timestamp, current.certificate.hash);
    }
  } else if (currentMode === 'support') {
    renderSupportContent();
  }
});

/* ---------- Dropdown Interactions ---------- */
const watermark = document.querySelector('.select-wrap .watermark');
moduleSelect.addEventListener('focus', () => watermark.style.opacity = 0.2);
moduleSelect.addEventListener('blur', () => watermark.style.opacity = 1);

moduleSelect.addEventListener('change', () => {
  console.log('Module select changed:', moduleSelect.value);
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
  console.log('Close module button clicked');
  if (currentMode === 'training') {
    moduleSelect.selectedIndex = 0;
    closeModule();
  } else {
    renderSupportContent();
  }
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
  document.querySelector('.module-title').textContent = title;
}

/* Helper to create a title element */
function createModuleTitleElem(title) {
  const el = document.createElement('div');
  el.className = 'module-title';
  el.textContent = title;
  return el;
}

/* ---------- Render Module Selection ---------- */
async function renderModuleSelection() {
  if (!Object.keys(MODULES).length) {
    moduleBody.innerHTML = '<p>Unable to load modules. Please check your connection or refresh the page.</p><button id="retryBtn" class="action-btn">Retry</button>';
    document.getElementById('retryBtn')?.addEventListener('click', () => loadQuestions());
    return;
  }
  current.mode = 'selection';
  saveState();
  const mod = MODULES[current.key];
  const prog = keyProgressCache[current.key] || { answered: [], correct: [] };
  const completion = (prog.answered.length / mod.questions.length) * 100;

  moduleBody.innerHTML = `
    <div class="module-selection">
      <canvas id="moduleProgressChart" style="max-width: 300px; margin: 20px auto;"></canvas>
      <div class="affirmation" id="moduleAffirmation"></div>
      <button id="learningMaterialBtn" class="action-btn">Learning Material</button>
      <button id="takeQuizBtn" class="action-btn">Take a Quiz</button>
    </div>`;

  const ctx = document.getElementById('moduleProgressChart').getContext('2d');
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Module Progress'],
      datasets: [{
        label: 'Completion (%)',
        data: [completion],
        backgroundColor: '#8affc1',
        borderColor: '#ffffff',
        borderWidth: 1
      }]
    },
    options: {
      animation: false,
      scales: { y: { beginAtZero: true, max: 100 } },
      plugins: { legend: { display: false }, title: { display: true, text: `${mod.title} Progress`, color: '#ffffff' } }
    }
  });

  const affirmations = [
    completion < 30 ? "You're starting strong! Dive into this module!" :
    completion < 60 ? "You're making great progress! Keep it up!" :
    completion < 100 ? "Almost done! You're killing it!" :
    "Module complete! You're a cybersecurity star!"
  ];
  document.getElementById('moduleAffirmation').textContent = affirmations[0];

  document.getElementById('learningMaterialBtn').addEventListener('click', () => {
    current.mode = 'material';
    saveState();
    renderLearningMaterial();
  });
  document.getElementById('takeQuizBtn').addEventListener('click', () => {
    current.mode = 'quiz';
    saveState();
    renderQuestion();
  });
}

/* ---------- Render Learning Material ---------- */
function renderLearningMaterial() {
  if (!Object.keys(MODULES).length || !MODULES[current.key]) {
    moduleBody.innerHTML = '<p>Unable to load modules. Please check your connection or refresh the page.</p><button id="retryBtn" class="action-btn">Retry</button>';
    document.getElementById('retryBtn')?.addEventListener('click', () => loadQuestions());
    return;
  }
  current.mode = 'material';
  saveState();
  const mod = MODULES[current.key];
  moduleBody.innerHTML = `
    <div class="learning-material">
      <h3>Learning Points for ${mod.title}</h3>
      <ul>
        ${mod.points.map(point => `<li>${sanitize(point)}</li>`).join('')}
      </ul>
      <button id="backToSelectionBtn" class="action-btn">Back to Module</button>
    </div>`;
  document.getElementById('backToSelectionBtn').addEventListener('click', () => {
    current.mode = 'selection';
    saveState();
    renderModuleSelection();
  });
}

/* ---------- Render Question ---------- */
async function renderQuestion() {
  if (!Object.keys(MODULES).length || !MODULES[current.key]) {
    moduleBody.innerHTML = '<p>Unable to load modules. Please check your connection or refresh the page.</p><button id="retryBtn" class="action-btn">Retry</button>';
    document.getElementById('retryBtn')?.addEventListener('click', () => loadQuestions());
    return;
  }
  current.mode = 'quiz';
  saveState();
  const mod = MODULES[current.key];
  const qObj = mod.questions[current.idx];
  const prog = keyProgressCache[current.key] || { answered: [], correct: [] };
  const isAnswered = prog.answered.includes(current.idx);

  const pct = Math.round(((current.idx + 1) / mod.questions.length) * 100);

  moduleBody.innerHTML = `
    <div class="question-card" aria-live="polite">
      <div class="q-text">${sanitize(qObj.q)}</div>
      <div class="options">
        ${qObj.opts.map((o, i) => `<button class="opt-btn" data-i="${i}" ${isAnswered ? 'disabled' : ''}>${sanitize(o)}</button>`).join('')}
      </div>
      <div class="progress-wrap">
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%;"></div></div>
      </div>
      <div class="controls">
        <button class="prev-btn" ${current.idx === 0 ? 'disabled' : ''}>Previous</button>
        <button class="next-btn" ${current.idx === mod.questions.length - 1 ? '' : 'disabled'}>${current.idx === mod.questions.length - 1 ? 'Finish Module' : 'Next Question'}</button>
        <div style="flex:1"></div>
        <div class="badge-strip" aria-hidden="true">
          ${stats.badges && stats.badges.length ? stats.badges.map(b => `<span class="badge">${b}</span>`).join('') : ''}
        </div>
      </div>
    </div>`;

  if (isAnswered) {
    moduleBody.querySelectorAll('.opt-btn').forEach(ob => {
      const idx = Number(ob.dataset.i);
      if (mod.questions[current.idx].opts[idx] === qObj.opts[qObj.a]) {
        ob.classList.add('correct');
      } else if (prog.correct.includes(current.idx) && idx !== qObj.a) {
        ob.classList.add('incorrect');
      }
    });
    moduleBody.querySelector('.next-btn').disabled = false;
  }

  moduleBody.querySelectorAll('.opt-btn').forEach(btn => btn.addEventListener('click', onOptionClicked));
  const prev = moduleBody.querySelector('.prev-btn');
  const next = moduleBody.querySelector('.next-btn');

  prev?.addEventListener('click', () => {
    if (current.idx > 0) {
      current.idx--;
      saveState();
      slideTransition('left');
      renderQuestion();
    }
  });

  if (current.idx === mod.questions.length - 1) {
    next.addEventListener('click', finishModule);
  } else {
    next.addEventListener('click', () => {
      if (current.idx < mod.questions.length - 1) {
        current.idx++;
        saveState();
        slideTransition('right');
        renderQuestion();
      }
    });
  }
}

/* ---------- Sanitize Helper ---------- */
function sanitize(s) {
  return String(s).replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ---------- Option Click Handler ---------- */
async function onOptionClicked(ev) {
  const btn = ev.currentTarget;
  const chosenIndex = Number(btn.dataset.i);
  const mod = MODULES[current.key];
  const qObj = mod.questions[current.idx];
  const prog = keyProgressCache[current.key] || { answered: [], correct: [] };

  if (prog.answered.includes(current.idx)) return;

  moduleBody.querySelectorAll('.opt-btn').forEach(ob => {
    ob.disabled = true;
    const idx = Number(ob.dataset.i);
    if (mod.questions[current.idx].opts[idx] === qObj.opts[qObj.a]) {
      ob.classList.add('correct');
    }
    if (idx === chosenIndex && qObj.a !== idx) ob.classList.add('incorrect');
  });

  if (chosenIndex === qObj.a) {
    stats.points += 10;
    stats.streak += 1;
    prog.correct.push(current.idx);
    flashNextButton();
    triggerConfetti(true);
  } else {
    stats.streak = 0;
    triggerConfetti(false);
  }

  prog.answered.push(current.idx);
  keyProgressCache[current.key] = prog;
  await saveModuleProgress(keyProgressCache);

  const nextBtn = moduleBody.querySelector('.next-btn');
  if (nextBtn) nextBtn.disabled = false;

  await updateModuleCompletionStats();
  await saveStats();
  animatePoints();
}

/* ---------- Optimized Confetti Animation ---------- */
function triggerConfetti(isCorrect) {
  const confetti = new JSConfetti();
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

/* ---------- Update Module Completion ---------- */
async function updateModuleCompletionStats() {
  const totalModules = Object.keys(MODULES).length;
  stats.completion = Math.round((stats.badges.length / totalModules) * 100);
  await saveStats();
  debounceRenderGlobalProgressChart();
}

/* ---------- Flash Next Button Effect ---------- */
function flashNextButton() {
  const nextBtn = moduleBody.querySelector('.next-btn');
  if (!nextBtn) return;
  nextBtn.animate([
    { transform: 'scale(1)', boxShadow: '0 0 8px rgba(255,204,0,0.5)' },
    { transform: 'scale(1.06)', boxShadow: '0 0 24px rgba(255,204,0,0.95)' }
  ], { duration: 450, iterations: 1 });
}

/* ---------- Points Increment Animation ---------- */
function animatePoints() {
  const start = Number(pointsDOM.textContent);
  const end = stats.points;
  const duration = 500;
  const startTime = performance.now();

  function update() {
    const now = performance.now();
    const progress = Math.min((now - startTime) / duration, 1);
    const currentPoints = Math.round(start + (end - start) * progress);
    pointsDOM.textContent = currentPoints;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

/* ---------- Slide Transition ---------- */
function slideTransition(dir = 'right') {
  moduleBody.style.transition = 'transform .28s ease, opacity .28s ease';
  moduleBody.style.opacity = '0';
  moduleBody.style.transform = dir === 'right' ? 'translateX(12px)' : 'translateX(-12px)';
  setTimeout(() => {
    moduleBody.style.opacity = '1';
    moduleBody.style.transform = 'translateX(0)';
  }, 260);
}

/* ---------- Finish Module ---------- */
async function finishModule() {
  if (!stats.badges.includes(MODULES[current.key].title)) {
    stats.badges.push(MODULES[current.key].title);
    triggerConfetti(true);
  }
  stats.points += 50;
  stats.streak += 1;
  await updateModuleCompletionStats();
  await saveStats();
  animatePoints();
  showCertificate(MODULES[current.key].title);
}

/* ---------- Close Module ---------- */
function closeModule() {
  current = { key: null, idx: 0, mode: 'selection', certificate: null };
  saveState();
  moduleSelect.selectedIndex = 0;
  moduleBody.innerHTML = `
    <div class="learning-tips" id="learningTips"></div>
    <canvas id="globalProgressChart" style="max-width: 400px; margin: 20px auto;"></canvas>
    <div class="affirmation" id="globalAffirmation"></div>`;
  document.querySelector('.module-title').textContent = 'Select a module to begin';
  startLearningTips();
  debounceRenderGlobalProgressChart();
}

/* ---------- Certificate Rendering & Actions ---------- */
function showCertificate(moduleName, timestamp = new Date().toISOString(), hash = generateHash(moduleName + timestamp)) {
  current.mode = 'certificate';
  current.certificate = { moduleName, timestamp, hash };
  saveState();
  const verifyUrl = `https://api.defendiq.com/verify?hash=${hash}`;
  const qrCodeId = 'qrcode-' + hash;

  moduleBody.innerHTML = `
    <div class="certificate-wrapper">
      <div class="certificate-card" id="certificateCard">
        <div class="cert-inner">
          <h1 class="cert-title">Certificate of Appreciation</h1>
          <div contenteditable="true" id="certName" class="cert-name" aria-label="Recipient name">${userProfile ? userProfile.name : 'Name Surname'}</div>
          <p class="cert-body">This certificate is presented to the recipient in recognition of successful completion of the <span class="module-name">${sanitize(moduleName)}</span> training module.</p>
          <div class="cert-meta">
            <div>Date: <span id="certDate">${new Date(timestamp).toLocaleDateString()}</span></div>
            <div>Certificate ID: <span id="certHash">${hash}</span></div>
          </div>
          <div class="cert-signature">Signature: Jonas Mashifane, Cybersecurity Lead</div>
          <div id="${qrCodeId}" class="cert-qr"></div>
          <div class="cert-logo">DefendIQ</div>
        </div>
      </div>
      <div class="cert-actions">
        <button id="printCert">Print</button>
        <button id="downloadPNG">Download PNG</button>
        <button id="downloadPDF">Download PDF</button>
        <button id="shareCert">Share</button>
        <button id="closeCert">Close Certificate</button>
      </div>
    </div>`;

  QRCode.toCanvas(document.getElementById(qrCodeId), verifyUrl, { width: 100, scale: 8 }, (err) => {
    if (err) console.error('QR Code generation failed:', err);
  });

  document.getElementById('printCert').addEventListener('click', () => window.print());
  document.getElementById('closeCert').addEventListener('click', () => closeModule());
  document.getElementById('downloadPNG').addEventListener('click', async () => await downloadCertificatePNG());
  document.getElementById('downloadPDF').addEventListener('click', async () => await downloadCertificatePDF());
  document.getElementById('shareCert').addEventListener('click', async () => await shareCertificate(verifyUrl, moduleName, hash));
}

/* ---------- Certificate Export Helpers ---------- */
async function downloadCertificatePNG() {
  const node = document.getElementById('certificateCard');
  if (!node) return alert('Certificate not ready');
  const canvas = await html2canvas(node, { scale: 4 });
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = 'DefendIQ_Certificate.png';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

async function downloadCertificatePDF() {
  const node = document.getElementById('certificateCard');
  if (!node) return alert('Certificate not ready');
  const canvas = await html2canvas(node, { scale: 4 });
  const imgData = canvas.toDataURL('image/png');
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: 'landscape' });
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight - 10);
  pdf.save('DefendIQ_Certificate.pdf');
}

async function shareCertificate(verifyUrl, moduleName, hash) {
  const node = document.getElementById('certificateCard');
  if (!node) return alert('Certificate not ready');
  const canvas = await html2canvas(node, { scale: 2 });
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  const file = new File([blob], 'DefendIQ_Certificate.png', { type: 'image/png' });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'DefendIQ Certificate',
        text: `I completed the ${moduleName} module on DefendIQ. Verify here: ${verifyUrl}\nCertificate ID: ${hash}`
      });
    } catch (err) {
      console.warn('Share canceled or failed:', err);
    }
  } else {
    try {
      await navigator.clipboard.writeText(verifyUrl);
      alert('Sharing not supported. Verification link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link:', err);
      alert('Sharing not supported. Please copy the link manually: ' + verifyUrl);
    }
  }
}

/* ---------- Hash Generation for Certificate ---------- */
function generateHash(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36).padStart(8, '0');
}

/* ---------- Initial Render State ---------- */
restoreState();
