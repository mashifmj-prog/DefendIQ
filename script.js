// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const startBtn = document.getElementById('start-btn');
const dashboard = document.getElementById('dashboard');
const moduleContent = document.getElementById('module-content');
const moduleTabs = document.querySelectorAll('.modules li');

// Stats
let points = 0;
let streak = 0;
let completedModules = [];
let badges = [];

// Welcome screen → Dashboard
startBtn.addEventListener('click', () => {
  welcomeScreen.classList.add('hidden');
  dashboard.classList.remove('hidden');
  loadModule('dashboard');
});

// Module tab click
moduleTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    moduleTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    loadModule(tab.dataset.module);
  });
});

// Load module content dynamically
function loadModule(module) {
  switch(module) {
    case 'dashboard':
      moduleContent.innerHTML = `
        <h2>Dashboard</h2>
        <p>Welcome! Select a module to start training.</p>
      `;
      break;

    case 'quiz':
      moduleContent.innerHTML = `
        <h2>Quiz Module</h2>
        <div class="module-question">
          <p>What is phishing?</p>
          <button onclick="answerQuestion(true)">A cyber attack tricking users</button>
          <button onclick="answerQuestion(false)">A new email service</button>
        </div>
      `;
      break;

    case 'phishing':
      moduleContent.innerHTML = `
        <h2>Phishing Simulation</h2>
        <p>Click the suspicious link below to test your awareness:</p>
        <button onclick="answerQuestion(false)">Safe link</button>
        <button onclick="answerQuestion(true)">Suspicious link</button>
      `;
      break;

    case 'password':
      moduleContent.innerHTML = `
        <h2>Password Training</h2>
        <p>Choose the strongest password:</p>
        <button onclick="answerQuestion(false)">123456</button>
        <button onclick="answerQuestion(true)">G!7vQ#9kLp</button>
      `;
      break;
  }
}

// Handle answers
function answerQuestion(correct) {
  if(correct) {
    points += 10;
    streak += 1;
    alert("Correct! +10 points");
  } else {
    streak = 0;
    alert("Incorrect!");
  }

  updateStats();
}

// Update dashboard stats
function updateStats() {
  document.getElementById('points').textContent = points;
  document.getElementById('streak').textContent = streak;

  // Completion %
  let totalModules = 3;
  let completed = Math.min(Math.floor(points / 10), totalModules);
  completedModules = Array(completed).fill(true);
  let completionPercent = Math.floor((completedModules.length / totalModules) * 100);
  document.getElementById('completion').textContent = `${completionPercent}%`;

  // Badges
  badges = [];
  if(completionPercent >= 33) badges.push("Bronze");
  if(completionPercent >= 66) badges.push("Silver");
  if(completionPercent === 100) badges.push("Gold");
  document.getElementById('badges').textContent = badges.length ? badges.join(", ") : "None";
}
