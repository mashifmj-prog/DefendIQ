// --- Fake data ---
const users = [
  { name: "Alice Smith", dept: "Infra", completion: 100, points: 50 },
  { name: "Bob Moyo", dept: "Support", completion: 80, points: 30 },
  { name: "Carol Jones", dept: "Sales", completion: 60, points: 20 },
  { name: "Dan Khumalo", dept: "Ops", completion: 40, points: 10 },
];

const quizzes = [
  {
    question: "Which of the following is a phishing red flag?",
    options: [
      "Sender domain mismatch",
      "Unusual urgency",
      "Poor grammar",
      "All of the above",
    ],
    correct: 3,
  },
  {
    question: "What should you do if you suspect a phishing email?",
    options: [
      "Click to see what it does",
      "Report it using the phishing button",
      "Forward to your colleague",
      "Ignore it",
    ],
    correct: 1,
  },
];

const tips = [
  "Always hover over links before clicking.",
  "Check sender addresses carefully.",
  "Never share your password — IT will never ask for it.",
  "Use multi-factor authentication (MFA) everywhere.",
];

// --- UI functions ---
function showSection(id) {
  document.querySelectorAll("section").forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// --- Leaderboard ---
function loadLeaderboard() {
  const tbody = document.querySelector("#leaderboardTable tbody");
  tbody.innerHTML = "";
  const sorted = users.sort((a, b) => b.completion + b.points - (a.completion + a.points));
  sorted.forEach((u, i) => {
    const row = `<tr>
      <td>${i + 1}</td>
      <td>${u.name}</td>
      <td>${u.dept}</td>
      <td>${u.completion}%</td>
      <td>${u.points}</td>
    </tr>`;
    tbody.insertAdjacentHTML("beforeend", row);
  });
}

// --- Quiz ---
let currentQuiz = 0;
function loadQuiz() {
  const q = quizzes[currentQuiz];
  const container = document.getElementById("quizContainer");
  if (!q) {
    container.innerHTML = "<p>🎉 You've completed all quizzes!</p>";
    return;
  }
  container.innerHTML = `
    <p><strong>${q.question}</strong></p>
    ${q.options
      .map(
        (opt, i) =>
          `<div><input type='radio' name='answer' value='${i}' id='opt${i}'>
           <label for='opt${i}'>${opt}</label></div>`
      )
      .join("")}
    <button onclick='submitQuiz(${q.correct})'>Submit</button>
  `;
}

function submitQuiz(correctIndex) {
  const selected = document.querySelector("input[name='answer']:checked");
  if (!selected) return alert("Please select an answer.");
  const answer = parseInt(selected.value);
  if (answer === correctIndex) {
    alert("✅ Correct! Well done.");
    users[0].points += 10; // demo: reward Alice
  } else {
    alert("❌ Incorrect. Keep learning!");
  }
  currentQuiz = (currentQuiz + 1) % quizzes.length;
  loadLeaderboard();
  loadQuiz();
}

// --- Tips ---
function loadTips() {
  const list = document.getElementById("tipsList");
  list.innerHTML = "";
  tips.forEach((t) => {
    list.insertAdjacentHTML("beforeend", `<li>${t}</li>`);
  });
}

// --- Initialize ---
document.addEventListener("DOMContentLoaded", () => {
  loadLeaderboard();
  loadQuiz();
  loadTips();
});
