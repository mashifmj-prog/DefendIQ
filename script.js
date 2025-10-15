// --- Company-specific settings ---
const companies = {
  openserve: {
    name: "Openserve",
    primaryColor: "#004d40",
    secondaryColor: "#26a69a",
    logo: "logos/openserve-logo.png",
    tips: [
      "Always hover over links before clicking.",
      "Check sender addresses carefully.",
      "Never share your password — IT will never ask for it.",
    ],
  },
  fiberlink: {
    name: "FiberLink",
    primaryColor: "#0d47a1",
    secondaryColor: "#42a5f5",
    logo: "logos/fiberlink-logo.png",
    tips: [
      "Use multi-factor authentication everywhere.",
      "Report suspicious emails immediately.",
      "Keep your software up-to-date.",
    ],
  },
  default: {
    name: "DefendIQ",
    primaryColor: "#222",
    secondaryColor: "#555",
    logo: "logos/default-logo.png",
    tips: [
      "Stay aware of phishing threats.",
      "Use strong passwords.",
      "Think before you click!",
    ],
  },
};

// --- User / quiz data ---
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

// --- Utility functions ---
function showSection(id) {
  document.querySelectorAll("section").forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function getCompanyFromURL() {
  const params = new URLSearchParams(window.location.search);
  const org = params.get("org");
  return companies[org] || companies.default;
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
function loadTips(tips) {
  const list = document.getElementById("tipsList");
  list.innerHTML = "";
  tips.forEach((t) => {
    list.insertAdjacentHTML("beforeend", `<li>${t}</li>`);
  });
}

// --- Initialize App ---
document.addEventListener("DOMContentLoaded", () => {
  const company = getCompanyFromURL();

  // Update header colors
  document.documentElement.style.setProperty("--primary-color", company.primaryColor);
  document.documentElement.style.setProperty("--secondary-color", company.secondaryColor);

  // Update header logo
  const header = document.querySelector("header");
  const logoImg = document.createElement("img");
  logoImg.src = company.logo;
  logoImg.alt = company.name + " Logo";
  header.prepend(logoImg);

  // Update footer
  document.getElementById("footerText").innerText = `© 2025 DefendIQ — Used by ${company.name} (customized)`;

  // Load company-specific tips
  loadTips(company.tips);

  // Load app features
  loadLeaderboard();
  loadQuiz();
});
