// Modules Navigation
const modules = document.querySelectorAll('.module');
const navButtons = document.querySelectorAll('.nav-btn');

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        modules.forEach(m => m.classList.remove('active'));
        document.getElementById(btn.dataset.module).classList.add('active');
    });
});

// Quiz Data
const quizzes = {
    keyMessage: [
        { question: "What is the key message of security training?", options: ["Be alert", "Ignore emails", "Share passwords"], answer: 0 },
        { question: "Why report incidents?", options: ["To get a reward", "To prevent damage", "It's optional"], answer: 1 },
        // Add 8 more questions...
    ],
    deepfake: [
        { question: "What is a deepfake?", options: ["A video manipulation", "A real video", "A password"], answer: 0 },
        // Add 9 more questions...
    ],
    reporting: [],
    culture: [],
    social: []
};

// Local Storage
let stats = JSON.parse(localStorage.getItem('defendiqStats')) || {
    streak: 0,
    points: 0,
    completion: 0,
    badges: []
};

// Update Stats UI
function updateStats() {
    document.getElementById('streak').innerText = stats.streak;
    document.getElementById('points').innerText = stats.points;
    document.getElementById('completion').innerText = stats.completion + '%';
    document.getElementById('badges').innerText = stats.badges.length ? stats.badges.join(', ') : 'None';
    localStorage.setItem('defendiqStats', JSON.stringify(stats));
}

updateStats();

// Quiz Handling
const quizButtons = document.querySelectorAll('.quiz-btn');
const quizContainer = document.getElementById('quiz-container');
const completionModal = document.getElementById('completion-modal');
const modalBadges = document.getElementById('modal-badges');
const closeModal = document.getElementById('close-modal');

let currentQuiz = [];
let currentIndex = 0;

quizButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const quizName = btn.dataset.quiz;
        currentQuiz = quizzes[quizName];
        currentIndex = 0;
        loadQuestion();
    });
});

function loadQuestion() {
    if (currentIndex >= currentQuiz.length) {
        // Quiz Complete
        stats.streak += 1;
        stats.points += 30;
        stats.completion = Math.min(stats.completion + 20, 100);
        stats.badges.push("Bronze"); // Simplified badge system
        updateStats();
        modalBadges.innerText = stats.badges.join(', ');
        completionModal.style.display = "flex";
        quizContainer.innerHTML = '';
        return;
    }

    const q = currentQuiz[currentIndex];
    quizContainer.innerHTML = `
        <h3>${q.question}</h3>
        ${q.options.map((opt,i) => `<button class="answer-btn" data-index="${i}">${opt}</button>`).join('')}
        <button id="next-question" style="display:none;">Next Question ➡️</button>
    `;

    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const selected = parseInt(btn.dataset.index);
            if(selected === q.answer) {
                btn.style.backgroundColor = '#00ffcc';
            } else {
                btn.style.backgroundColor = '#ff4444';
            }
            document.getElementById('next-question').style.display = 'block';
        });
    });

    document.getElementById('next-question').addEventListener('click', () => {
        currentIndex++;
        loadQuestion();
    });
});

closeModal.addEventListener('click', () => {
    completionModal.style.display = 'none';
});
