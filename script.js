// --- Companies ---
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

// --- Users & Quizzes ---
let users = [
  { name: "Alice Smith", dept: "Infra", completion: 100, points: 50 },
  { name: "Bob Moyo", dept: "Support", completion: 80, points: 30 },
  { name: "Carol Jones", dept: "Sales", completion: 60, points: 20 },
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

let currentQuiz = 0;
let currentCompany = companies.default;

// --- Company Selector ---
function changeCompany() {
  const select = document.getElementById("companySelect");
  const org = select.value;
  currentCompany = companies[org] || companies.default;
  applyCompanyTheme();
}

// --- Apply Theme ---
function applyCompanyTheme() {
  document.documentElement.style.setProperty("--primary-color", currentCompany.primaryColor);
  document.documentElement.style.setProperty("--secondary-color", currentCompany.secondaryColor);

  const logo = document.getElementById("companyLogo");
  logo.src = currentCompany.logo;
  logo.alt = currentCompany.name + " Logo";

  document.getElementById("footerText").innerText = `© 2025 DefendIQ — Used by ${currentCompany.name} (customized)`;

  loadTips();
  loadLeaderboard();
  loadQuiz();
}

// --- Navigation ---
function showSection(id) {
  document.querySelectorAll("section").forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// --- Leaderboard ---
function loadLeaderboard() {
  const container = document.getElementById("leaderboardCards");
  container.innerHTML = "";
  users.sort((a,b)=> b.completion + b.points - (a.completion + a.points))
       .forEach((u, i) => {
    container.insertAdjacentHTML(
      "beforeend",
      `<div class="card">
        <h3>${i+1}. ${u.name}</h3>
        <p><strong>Dept:</strong> ${u.dept}</p>
        <p><strong>Completion:</strong> ${u.completion}%</p>
        <p><strong>Points:</strong> ${u.points}</p>
      </div>`
    );
  });
}

// --- Quiz ---
function loadQuiz() {
  const container = document.getElementById("quizContainer");
  const q = quizzes[currentQuiz];
  if (!q) {
    container.innerHTML = "<div class='card'><p>🎉 You've completed all quizzes!</p></div>";
    return;
  }

  container.innerHTML = `<div class="card">
    <p><strong>${q.question}</strong></p>
    ${q.options.map((opt,i)=>`<div><input type='radio' name='answer' value='${i}' id='opt${i}'>
      <label for='opt${i}'>${opt}</label></div>`).join("")}
    <button onclick="submitQuiz(${q.correct})">Submit</button>
  </div>`;
}

function submitQuiz(correctIndex) {
  const selected = document.querySelector("input[name='answer']:checked");
  if (!selected) return alert("Please select an answer.");
  const answer = parseInt(selected.value);
  if (answer === correctIndex) {
    alert("✅ Correct! Well done.");
    users[0].points += 10;
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
  currentCompany.tips.forEach(t=>{
    list.insertAdjacentHTML("beforeend", `<li>${t}</li>`);
  });
}

// --- Init ---
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const org = urlParams.get("org");
  if(org && companies[org]) {
    currentCompany = companies[org];
    document.getElementById("companySelect").value = org;
  }
  applyCompanyTheme();
});
