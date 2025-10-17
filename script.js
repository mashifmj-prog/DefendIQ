```javascript
/* DefendIQ interactive script.js
   - Optimized for performance with debounced chart rendering, reduced confetti, cached data
   - Persists state for refresh to preserve selections and current view
   - Enhanced error handling for questions.json with retry and fallback
   - Handles landing -> training/support modes, quizzes, certificates
   - Support mode with canvas backgrounds, AI-driven chat, module recommendations
   - Feedback button static (no popup, disabled)
   - Knowledge assessment and module recommendation based on chat interactions
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
let chatHistory = JSON.parse(localStorage.getItem('defendiq_chat')) || [];
let knowledgeLevel = JSON.parse(localStorage.getItem('defendiq_knowledge')) || { score: 0, keywords: [] };

/* API Endpoint (Hypothetical) and API Keys */
const API_URL = 'https://api.defendiq.com';
const API_URLS = {
  grok: 'https://api.x.ai/v1/grok',
  openai: 'https://api.openai.com/v1/chat/completions',
  gemini: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'
};
let selectedAPI = localStorage.getItem('defendiq_api') || 'grok';
const API_KEYS = {
  grok: localStorage.getItem('grok_api_key') || '',
  openai: localStorage.getItem('openai_api_key') || '',
  gemini: localStorage.getItem('gemini_api_key') || ''
};

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
    "Good morning, {name}! At {age}, you're ready to conquer the day with confidence! As a {maritalStatus} {gender} in {region}, your positivity is your shield. Remember, strong passwords protect your online world.",
    "Rise and shine, {name}! Your {maritalStatus} life in {region} is inspiring—start the day strong with a clear mind and secure habits. Enable MFA for extra peace of mind.",
    "Hello, {name}! At {age}, you're building a bright future in {region}. Keep that {gender} energy high this morning! Report suspicious activity to stay safe.",
    "Good morning, {name}! Let's kick off this day in {region} with energy. As a {age}-year-old {gender}, your {maritalStatus} path is bright—stay vigilant with cybersecurity.",
    "Rise and shine, {name}! Good morning! Your journey at {age} in {region} is unique and powerful. Embrace it with positivity and secure online practices."
  ],
  afternoon: [
    "Good afternoon, {name}! Keep shining at {age} in {region}—you're doing great as a {maritalStatus} {gender}! Use unique passwords for added security.",
    "Hey {name}, halfway through the day in {region}—stay strong and safe with your {maritalStatus} resilience! Enable MFA today.",
    "{name}, your {age}-year-old focus this afternoon is inspiring. As a {gender} in {region}, keep it up! Report suspicious activity.",
    "Good afternoon, {name}! Your {maritalStatus} life in {region} is thriving—stay positive and secure from threats.",
    "Hey {name}, at {age}, you're midway through a fantastic day in {region}. Your {gender} strength is admirable! Stay cautious online."
  ],
  evening: [
    "Good evening, {name}! Reflect on your wins today at {age} in {region}—you're unstoppable as a {maritalStatus} {gender}! Secure your night with MFA.",
    "Hey {name}, unwind with pride in your {maritalStatus} progress in {region}! Use strong passwords for peace of mind.",
    "{name}, evening vibes are perfect for relaxing at {age}. As a {gender} in {region}, stay secure with regular checks.",
    "Good evening, {name}! Your {maritalStatus} journey in {region} is full of achievements—celebrate them safely.",
    "Hey {name}, reflect on the day at {age}. Your {gender} resilience in {region} is inspiring! Report any suspicious activity."
  ],
  night: [
    "Good night, {name}! Rest well at {age} in {region}, knowing you're growing stronger every day as a {maritalStatus} {gender}. Secure your devices before bed.",
    "{name}, sleep tight and dream of crushing it tomorrow in {region}! Use MFA for peaceful nights.",
    "Night, {name}! Your {maritalStatus} resilience at {age} in {region} is your superpower. Stay safe.",
    "Good night, {name}! Recharge for tomorrow's adventures in {region}—you're amazing as a {gender}. Report suspicious activity.",
    "{name}, rest easy at {age}. Your {maritalStatus} journey in {region} is filled with potential. Stay secure."
  ]
};

const CANVAS_OPTIONS = [
  { value: 'blue-sky', label: 'Blue Sky' },
  { value: 'cyber-grid', label: 'Cyber Grid' },
  { value: 'calm-ocean', label: 'Calm Ocean' },
  { value: 'starry-night', label: 'Starry Night' },
  { value: 'forest', label: 'Forest' },
  { value: 'sunset', label: 'Sunset' },
  { value: 'abstract-cyber', label: 'Abstract Cyber' },
  { value: 'mountain-view', label: 'Mountain View' },
  { value: 'urban-city', label: 'Urban City' }
];

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

function assessKnowledge(userInput) {
  const keywords = {
    'password': ['password', 'passphrase', 'authentication', 'login'],
    'phishing': ['phishing', 'email', 'scam', 'suspicious link'],
    'deepfake': ['deepfake', 'fake video', 'altered media'],
    'reporting': ['report', 'incident', 'security issue'],
    'social engineering': ['social engineering', 'manipulation', 'trust'],
    'mfa': ['mfa', 'multi-factor', 'two-factor', '2fa'],
    'culture': ['culture', 'security awareness', 'workplace security']
  };
  let score = knowledgeLevel.score;
  let newKeywords = [...knowledgeLevel.keywords];

  Object.keys(keywords).forEach(module => {
    if (keywords[module].some(kw => userInput.toLowerCase().includes(kw))) {
      score += 10;
      if (!newKeywords.includes(module)) newKeywords.push(module);
    }
  });

  if (userInput.toLowerCase().includes('not ready') || userInput.toLowerCase().includes('unsure')) {
    score -= 5; // Reflect hesitation but don't penalize heavily
  }

  knowledgeLevel = { score: Math.max(0, score), keywords: newKeywords };
  localStorage.setItem('defendiq_knowledge', JSON.stringify(knowledgeLevel));
  return knowledgeLevel;
}

function recommendModule() {
  const availableModules = [
    'Key Message',
    'Deepfake Awareness',
    'Reporting Security Incidents',
    'Culture Survey',
    'Social Engineering',
    'Phishing Simulation',
    'Password Training'
  ];
  const completed = stats.badges;
  const uncompleted = availableModules.filter(m => !completed.includes(m));

  if (!uncompleted.length) return { module: null, message: "Wow, you've completed all modules! Review your progress or revisit a module to stay sharp!" };

  // Module progression logic based on knowledge level
  const { score, keywords } = knowledgeLevel;
  let recommended = uncompleted[0]; // Default to first uncompleted
  let message = '';

  if (score < 30) {
    recommended = 'Key Message'; // Beginner module
    message = `Based on our chats, you're building a great foundation! I recommend starting with the "Key Message" module to get a solid overview of cybersecurity basics. It's perfect for you right now!`;
  } else if (score < 60) {
    recommended = keywords.includes('phishing') ? 'Phishing Simulation' : 'Password Training';
    message = `You're picking up key concepts, ${userProfile.name}! I think you're ready for the "${recommended}" module to ${recommended === 'Phishing Simulation' ? 'practice spotting phishing attempts' : 'strengthen your password habits'}. Let's keep growing!`;
  } else {
    recommended = uncompleted.find(m => ['Deepfake Awareness', 'Social Engineering', 'Reporting Security Incidents'].includes(m)) || uncompleted[0];
    message = `You're doing amazing, ${userProfile.name}! With your knowledge, the "${recommended}" module will challenge you to ${recommended === 'Deepfake Awareness' ? 'spot advanced threats' : recommended === 'Social Engineering' ? 'understand manipulation tactics' : 'master incident reporting'}. You're ready for this!`;
  }

  if (keywords.includes('not ready') || keywords.includes('unsure')) {
    message += ` I know you might feel a bit hesitant, but you've shown great progress in our chats! This module is designed to be approachable, and I'll be here to support you every step of the way. You’ve got this!`;
  }

  return { module: recommended, message };
}

async function getAIAffirmation(userInput = '') {
  if (!API_KEYS[selectedAPI]) {
    const apiKey = prompt(`Enter your ${selectedAPI.toUpperCase()} API key:`);
    if (apiKey) {
      localStorage.setItem(`${selectedAPI}_api_key`, apiKey);
      API_KEYS[selectedAPI] = apiKey;
    } else {
      return 'Please provide an API key for AI support.';
    }
  }

  try {
    const knowledge = assessKnowledge(userInput);
    const recommendation = recommendModule();
    const prompt = `You are a positive, affirming digital friend. User profile: Name - ${userProfile.name}, Age - ${userProfile.age}, Marital Status - ${userProfile.maritalStatus}, Gender - ${userProfile.gender}, Region - ${userProfile.region}. Time: ${getTimeOfDay()}. Season: ${getSeason()}. User message: "${userInput}". Knowledge score: ${knowledge.score}, Keywords: ${knowledge.keywords.join(', ')}. Respond encouragingly, assess their knowledge, recommend a module (${recommendation.module || 'none'}) with positive reasoning if they're hesitant, and include a subtle cybersecurity tip. Keep it positive, never negative.`;
    const response = await fetch(API_URLS[selectedAPI], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEYS[selectedAPI]}`
      },
      body: JSON.stringify({
        model: selectedAPI === 'grok' ? 'grok-beta' : selectedAPI === 'openai' ? 'gpt-4o-mini' : 'gemini-1.5-flash-latest',
        messages: [{
          role: 'system',
          content: 'You are a positive, affirming digital friend.'
        }, {
          role: 'user',
          content: prompt
        }]
      })
    });
    if (!response.ok) throw new Error('AI API request failed');
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (err) {
    console.error('AI affirmation failed:', err);
    return 'AI support unavailable. Using standard affirmation.';
  }
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
        <select id="canvasSelector">
          <option value="" disabled selected>Choose Canvas</option>
          ${CANVAS_OPTIONS.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
        </select>
        <select id="apiSelector">
          <option value="grok">Grok (xAI)</option>
          <option value="openai">OpenAI GPT</option>
          <option value="gemini">Google Gemini</option>
        </select>
        <button id="submitProfileBtn" class="action-btn">Submit</button>
      </div>`;
    document.getElementById('submitProfileBtn').addEventListener('click', () => {
      const name = document.getElementById('userName').value.trim();
      const age = document.getElementById('userAge').value;
      const maritalStatus = document.getElementById('userMaritalStatus').value;
      const gender = document.getElementById('userGender').value;
      const region = document.getElementById('userRegion').value.trim();
      const canvas = document.getElementById('canvasSelector').value;
      selectedAPI = document.getElementById('apiSelector').value;
      if (name && age && maritalStatus && gender && region && canvas) {
        console.log('Support Mode profile submitted:', { name, age, maritalStatus, gender, region, canvas, selectedAPI });
        userProfile = { name, age: Number(age), maritalStatus, gender, region, canvas };
        localStorage.setItem('defendiq_user', JSON.stringify(userProfile));
        localStorage.setItem('defendiq_api', selectedAPI);
        chatHistory = [];
        knowledgeLevel = { score: 0, keywords: [] };
        localStorage.setItem('defendiq_chat', JSON.stringify(chatHistory));
        localStorage.setItem('defendiq_knowledge', JSON.stringify(knowledgeLevel));
        renderSupportMessage(true);
      } else {
        alert('Please fill in all fields.');
      }
    });
  } else {
    renderSupportMessage(true);
  }
}

async function renderSupportMessage(useAI = false, userInput = '') {
  console.log('Rendering Support Mode message', { useAI, userInput });
  const timeOfDay = getTimeOfDay();
  const season = getSeason();
  let affirmation = '';
  if (useAI) {
    affirmation = await getAIAffirmation(userInput);
    if (affirmation === 'AI support unavailable. Using standard affirmation.') {
      useAI = false;
    }
  }
  if (!useAI) {
    const affirmations = AFFIRMATIONS[timeOfDay];
    affirmation = affirmations[Math.floor(Math.random() * affirmations.length)].replace('{name}', userProfile.name).replace('{age}', userProfile.age).replace('{maritalStatus}', userProfile.maritalStatus).replace('{gender}', userProfile.gender).replace('{region}', userProfile.region);
    const recommendation = recommendModule();
    affirmation += ` ${recommendation.message}`;
  }
  const regionMessage = userProfile.region ? `Stay strong in ${userProfile.region} this ${season}!` : `Enjoy this ${season} season!`;
  const securityTip = LEARNING_TIPS[Math.floor(Math.random() * LEARNING_TIPS.length)];
  if (userInput) {
    chatHistory.push({ role: 'user', message: userInput });
    chatHistory.push({ role: 'ai', message: affirmation });
    localStorage.setItem('defendiq_chat', JSON.stringify(chatHistory));
  } else {
    affirmation = `Hello, ${userProfile.name}! ${affirmation}`; // Greeting on open
  }
  moduleBody.innerHTML = `
    <div class="support-message" style="background: var(--canvas-${userProfile.canvas});">
      <canvas class="support-canvas" id="supportCanvas"></canvas>
      <div class="support-chat-history">
        ${chatHistory.map(msg => `<div class="support-chat-message ${msg.role}">${sanitize(msg.message)}</div>`).join('')}
      </div>
      <div class="support-chat-input">
        <textarea id="supportInput" placeholder="Chat with your digital friend..."></textarea>
        <button id="sendSupportBtn" class="action-btn">Send</button>
      </div>
      <button id="refreshSupportBtn" class="action-btn">New Message</button>
      <button id="aiSupportBtn" class="action-btn">Get AI Support</button>
    </div>`;
  document.getElementById('sendSupportBtn').addEventListener('click', () => {
    const input = document.getElementById('supportInput').value.trim();
    if (input) {
      renderSupportMessage(true, input);
      document.getElementById('supportInput').value = '';
    }
  });
  document.getElementById('refreshSupportBtn').addEventListener('click', () => renderSupportMessage(false));
  document.getElementById('aiSupportBtn').addEventListener('click', () => renderSupportMessage(true));
  drawCanvas(userProfile.canvas);
}

/* ---------- Canvas Varieties ---------- */
function drawCanvas(canvasType) {
  const canvas = document.getElementById('supportCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = moduleBody.offsetWidth;
  canvas.height = moduleBody.offsetHeight;
  switch (canvasType) {
    case 'blue-sky':
      ctx.fillStyle = 'var(--canvas-blue-sky)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Add clouds
      ctx.fillStyle = '#FFFFFF';
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(100, 50, 30, 0, 2 * Math.PI);
      ctx.arc(130, 50, 40, 0, 2 * Math.PI);
      ctx.arc(160, 50, 30, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalAlpha = 1;
      break;
    case 'cyber-grid':
      ctx.fillStyle = 'var(--canvas-cyber-grid)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
      break;
    case 'calm-ocean':
      ctx.fillStyle = 'var(--canvas-calm-ocean)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Add waves
      ctx.strokeStyle = '#1E90FF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 10) {
        ctx.moveTo(x, canvas.height / 2 + Math.sin(x / 20) * 10);
        ctx.lineTo(x, canvas.height);
      }
      ctx.stroke();
      break;
    case 'starry-night':
      ctx.fillStyle = 'var(--canvas-starry-night)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FFFFFF';
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, Math.random() * 2, 0, 2 * Math.PI);
        ctx.fill();
      }
      break;
    case 'forest':
      ctx.fillStyle = 'var(--canvas-forest)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Add trees
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(100, canvas.height - 100, 20, 100);
      ctx.fillStyle = '#228B22';
      ctx.beginPath();
      ctx.arc(110, canvas.height - 100, 40, 0, 2 * Math.PI);
      ctx.fill();
      break;
    case 'sunset':
      ctx.fillStyle = 'var(--canvas-sunset)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Add sun
      ctx.fillStyle = '#FF4500';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height - 50, 50, 0, 2 * Math.PI);
      ctx.fill();
      break;
    case 'abstract-cyber':
      ctx.fillStyle = 'var(--canvas-abstract-cyber)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Add lines
      ctx.strokeStyle = '#FF00FF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(canvas.width, 0);
      ctx.lineTo(0, canvas.height);
      ctx.stroke();
      break;
    case 'mountain-view':
      ctx.fillStyle = 'var(--canvas-mountain-view)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Add mountains
      ctx.fillStyle = '#A9A9A9';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      ctx.lineTo(canvas.width / 2, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fill();
      break;
    case 'urban-city':
      ctx.fillStyle = 'var(--canvas-urban-city)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Add buildings
      ctx.fillStyle = '#808080';
      ctx.fillRect(50, canvas.height - 150, 50, 150);
      ctx.fillRect(120, canvas.height - 200, 50, 200);
      ctx.fillRect(190, canvas.height - 100, 50, 100);
      break;
  }
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
        current
