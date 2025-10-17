/* UI rendering and utilities */
const landing = document.getElementById('landing');
const app = document.getElementById('app');
const moduleSelect = document.getElementById('moduleSelect');
const moduleBody = document.getElementById('moduleBody');
const streakDOM = document.getElementById('streak');
const pointsDOM = document.getElementById('points');
const completionDOM = document.getElementById('completion');
const badgesDOM = document.getElementById('badges');
const learningTipsDOM = document.getElementById('learningTips');
const globalAffirmationDOM = document.getElementById('globalAffirmation');
const quizDropdown = document.querySelector('.quiz-dropdown');
const statsArea = document.querySelector('.stats-area');

function refreshStatsUI() {
  streakDOM.textContent = stats.streak;
  pointsDOM.textContent = stats.points;
  completionDOM.textContent = stats.completion + '%';
  badgesDOM.innerHTML = stats.badges.length ? stats.badges.map(b => `<span class="badge flash">${b}</span>`).join(' ') : 'None';
  if (getMode() === 'training') debounceRenderGlobalProgressChart();
}

function sanitize(htmlStr) {
  const div = document.createElement('div');
  div.textContent = htmlStr;
  return div.innerHTML;
}

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

let chartInstance = null;
let chartRenderTimeout = null;
function debounceRenderGlobalProgressChart() {
  if (chartRenderTimeout) clearTimeout(chartRenderTimeout);
  chartRenderTimeout = setTimeout(() => {
    renderGlobalProgressChart();
  }, 100);
}

function renderGlobalProgressChart() {
  if (!Object.keys(MODULES).length || getMode() !== 'training') return;
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
