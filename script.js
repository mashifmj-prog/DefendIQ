// --- Companies ---
const companies = {
  defendiq: {
    name: "DefendIQ",
    primaryColor: "#222",
    secondaryColor: "#555",
    logo: "logos/default-logo.png",
    tips: [
      "Stay aware of phishing threats.",
      "Use strong passwords.",
      "Think before you click!",
    ],
    employees: [
      { name: "John Doe", dept: "IT", completion: 80, points: 25 },
      { name: "Jane Roe", dept: "HR", completion: 70, points: 20 },
      { name: "Mark Smith", dept: "Ops", completion: 60, points: 15 },
    ],
  },
  openserve: {
    name: "Openserve",
    primaryColor: "#004d40",
    secondaryColor: "#26a69a",
    logo: "logos/openserve-logo.png",
    tips: [
      "Secure all infrastructure devices with strong passwords.",
      "Verify network change requests.",
      "Always report unusual system behavior.",
    ],
    employees: [
      { name: "Alice Smith", dept: "Infra", completion: 100, points: 50 },
      { name: "Bob Moyo", dept: "Support", completion: 80, points: 30 },
      { name: "Carol Jones", dept: "Network", completion: 60, points: 20 },
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
      "Keep software up-to-date.",
    ],
    employees: [
      { name: "David Green", dept: "Support", completion: 90, points: 45 },
      { name: "Eva Brown", dept: "Sales", completion: 75, points: 35 },
      { name: "Frank White", dept: "Ops", completion: 50, points: 10 },
    ],
  },
  gyro: {
    name: "Gyro",
    primaryColor: "#6a1b9a",
    secondaryColor: "#ba68c8",
    logo: "logos/gyro-logo.png",
    tips: [
      "Always verify visitor identity.",
      "Report suspicious physical or digital activity.",
      "Do not leave sensitive access cards unattended.",
    ],
    employees: [
      { name: "George King", dept: "Facilities", completion: 95, points: 40 },
      { name: "Hannah Lee", dept: "Security", completion: 85, points: 30 },
      { name: "Ian Scott", dept: "Ops", completion: 70, points: 25 },
    ],
  },
};

// Global state
let currentCompany = companies.defendiq;

// --- Get company from dropdown ---
function changeCompany() {
  const select = document.getElementById("companySelect");
  const org = select.value.toLowerCase();
  currentCompany = companies[org] || companies.defendiq;
  applyCompanyTheme();
}

// --- Apply Theme & Update UI ---
function applyCompanyTheme() {
  // Colors
  document.documentElement.style.setProperty("--primary-color", currentCompany.primaryColor);
  document.documentElement.style.setProperty("--secondary-color", currentCompany.secondaryColor);

  // Logo
  const logo = document.getElementById("companyLogo");
  logo.src = currentCompany.logo;
  logo.alt = currentCompany.name + " Logo";

  // App Title
  const appTitle = document.getElementById("appTitle");
  appTitle.innerHTML = `🛡️ DefendIQ — ${currentCompany.name}`;

  // Footer
  document.getElementById("footerText").innerText = "DefendIQ – Trusted by Openserve, FiberLink & Gyro";

  // Load tips, leaderboard, quiz
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
  const employees = currentCompany.employees.sort((a, b) => (b.completion + b.points) - (a.completion + a.points));
  employees.forEach((u, i) => {
    container.insertAdjacentHTML(
      "beforeend",
      `<div class="card">
        <h3>${i + 1}. ${u.name}</h3>
        <p><strong>Dept:</strong> ${u.dept}</p>
        <p><strong>Completion:</strong> <progress value="${u.completion}" max="100"></progress> ${u.completion}%</p>
        <p><strong>Points:</strong> ${u.points}</p>
      </div>`
    );
  });
}

// --- Quiz ---
const quizzes = [
  {
    question: "Which of the following is a phishing red flag?",
    options: ["Sender domain mismatch", "Unusual urgency", "Poor grammar", "All of the above"],
    correct: 3,
  },
  {
    question: "What should you do if you suspect a phishing email?",
    options: ["Click to see what it does", "Report it using the phishing button", "Forward to colleague", "Ignore it"],
    correct: 1,
  },
];

let currentQuiz = 0;

function loadQuiz() {
  const container = document.getElementById("quizContainer");
  const q = quizzes[currentQuiz];
  if (!q) {
    container.innerHTML = "<div class='card'><p>🎉 You've completed all quizzes!</p></div>";
    return;
  }
  container.innerHTML = `<div class="card">
    <p><strong>${q.question}</strong></p>
    ${q.options.map((opt,i)=>`<div><input type='radio' name='answer' value='${i}' id='opt${i}'><label for='opt${i}'>${opt}</label></div>`).join("")}
    <button onclick="submitQuiz(${q.correct})">Submit</button>
  </div>`;
}

function submitQuiz(correctIndex) {
  const selected = document.querySelector("input[name='answer']:checked");
  if (!selected) return alert("Please select an answer.");
  const answer = parseInt(selected.value);
  if (answer === correctIndex) {
    alert("✅ Correct! Well done.");
    currentCompany.employees[0].points += 10; // demo: reward first employee
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
  currentCompany.tips.forEach(t => {
    list.insertAdjacentHTML("beforeend", `<li>${t}</li>`);
  });
}

// --- Initialize ---
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const org = urlParams.get("org")?.toLowerCase();
  if (org && companies[org]) {
    currentCompany = companies[org];
    document.getElementById("companySelect").value = org;
  }
  applyCompanyTheme();
});
