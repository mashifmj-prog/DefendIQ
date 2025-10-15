const companies = {
  openserve: {
    name: "Openserve",
    description: "Infrastructure wholesale company of Telkom SA SOC",
    primaryColor: "#004d40",
    secondaryColor: "#26a69a",
    logo: "logos/openserve-logo.png",
    tips: [
      "Secure all infrastructure devices with strong passwords.",
      "Verify any network change requests.",
      "Always report unusual system behavior.",
    ],
  },
  gyro: {
    name: "Gyro",
    description: "Manages all Telkom SA SOC buildings",
    primaryColor: "#6a1b9a",
    secondaryColor: "#ba68c8",
    logo: "logos/gyro-logo.png",
    tips: [
      "Always verify visitor identity.",
      "Report suspicious physical or digital activity.",
      "Do not leave sensitive access cards unattended.",
    ],
  },
  telkom: {
    name: "Telkom Mobile/Consumer",
    description: "Sells devices like phones and data services",
    primaryColor: "#f57c00",
    secondaryColor: "#ffb74d",
    logo: "logos/telkom-mobile-logo.png",
    tips: [
      "Protect customer data at all times.",
      "Beware of phishing attempts targeting mobile users.",
      "Encourage users to use strong passwords and MFA.",
    ],
  },
  default: {
    name: "DefendIQ",
    description: "Generic cybersecurity awareness platform",
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

// Global state
let currentCompany = companies.default;

// --- Get company from dropdown or URL ---
function changeCompany() {
  const select = document.getElementById("companySelect");
  const org = select.value;
  currentCompany = companies[org] || companies.default;
  applyCompanyTheme();
}

function applyCompanyTheme() {
  // Update CSS theme colors
  document.documentElement.style.setProperty("--primary-color", currentCompany.primaryColor);
  document.documentElement.style.setProperty("--secondary-color", currentCompany.secondaryColor);

  // Update logo and header
  const logo = document.getElementById("companyLogo");
  logo.src = currentCompany.logo;
  logo.alt = currentCompany.name + " Logo";

  // Update app title and description
  const appTitle = document.getElementById("appTitle");
  appTitle.innerHTML = `🛡️ DefendIQ — ${currentCompany.name}`;
  appTitle.title = currentCompany.description;

  // Update footer
  document.getElementById("footerText").innerText = `© 2025 DefendIQ — Customized for ${currentCompany.name}`;

  // Update tips and features
  loadTips();
  loadLeaderboard();
  loadQuiz();
}

// --- Leaderboard, Quiz, Tips (same as previous) ---
function showSection(id) {
  document.querySelectorAll("section").forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

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

function loadTips() {
  const list = document.getElementById("tipsList");
  list.innerHTML = "";
  currentCompany.tips.forEach(t=>{
    list.insertAdjacentHTML("beforeend", `<li>${t}</li>`);
  });
}

// --- Initialize ---
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const org = urlParams.get("org");
  if(org && companies[org]) {
    currentCompany = companies[org];
    document.getElementById("companySelect").value = org;
  }
  applyCompanyTheme();
});
