// Multi-company data
const companies = {
  DefendIQ: {
    name: "DefendIQ",
    primaryColor: "#1e90ff",
    secondaryColor: "#f0f0f0",
    logo: "logos/defendiq-logo.png",
    streak: 0,
    points: 0,
    completion: 0,
    badges: []
  },
  CyberSafeInc: {
    name: "CyberSafeInc",
    primaryColor: "#2a3eb1",
    secondaryColor: "#e0f7ff",
    logo: "logos/cybersafe-logo.png",
    streak: 0,
    points: 0,
    completion: 0,
    badges: []
  },
  SecureOps: {
    name: "SecureOps",
    primaryColor: "#28a745",
    secondaryColor: "#e6ffe6",
    logo: "logos/secureops-logo.png",
    streak: 0,
    points: 0,
    completion: 0,
    badges: []
  }
};

let currentCompany = "DefendIQ";

// ---------------------- Company Switch ----------------------
document.getElementById("company-select").addEventListener("change", e => {
  switchCompany(e.target.value);
});

function switchCompany(companyName) {
  currentCompany = companyName;
  const company = companies[companyName];
  document.getElementById("company-logo").src = company.logo;
  document.getElementById("company-name").textContent = company.name;
  applyTheme();
  showSection("dashboard");
  updateDashboard();
}

function applyTheme() {
  const company = companies[currentCompany];
  document.documentElement.style.setProperty("--primary-color", company.primaryColor);
  document.documentElement.style.setProperty("--secondary-color", company.secondaryColor);
}

// ---------------------- Section Navigation ----------------------
function showSection(sectionId) {
  document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
  document.getElementById(sectionId).classList.remove("hidden");
  if (sectionId === "dashboard") updateDashboard();
  if (sectionId === "quiz") startQuiz();
  if (sectionId === "phishing") startPhishing();
  if (sectionId === "password") startPassword();
}

// ---------------------- Dashboard ----------------------
function updateDashboard() {
  const company = companies[currentCompany];
  document.getElementById("streak").textContent = company.streak;
  document.getElementById("points").textContent = company.points;
  document.getElementById("completion").textContent = company.completion + "%";
  document.getElementById("profile-points").textContent = company.points;
  document.getElementById("profile-completion").textContent = company.completion;
  document.getElementById("profile-streak").textContent = company.streak;

  const badgesList = document.getElementById("profile-badges");
  badgesList.innerHTML = "";
  company.badges.forEach(b => {
    const li = document.createElement("li");
    li.textContent = b;
    badgesList.appendChild(li);
  });

  // Analytics chart
  const ctx = document.getElementById('analyticsChart').getContext('2d');
  if (window.analyticsChart) window.analyticsChart.destroy();
  window.analyticsChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Streak', 'Points', 'Completion'],
      datasets: [{
        label: 'Performance',
        data: [company.streak, company.points, company.completion],
        backgroundColor: [company.primaryColor, company.primaryColor, company.primaryColor]
      }]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } }
    }
  });
}

// ---------------------- Points, Streaks & Badges ----------------------
function addPoints(points, badgeName) {
  const company = companies[currentCompany];
  company.points += points;
  company.streak++;
  company.completion = Math.min(100, company.completion + points);
  if (badgeName) awardBadge(badgeName);
  updateDashboard();
}

function awardBadge(badgeName) {
  const company = companies[currentCompany];
  if (!company.badges.includes(badgeName)) {
    company.badges.push(badgeName);
    alert(`🏆 Badge earned: ${badgeName}`);
  }
}

function downloadCertificate() {
  const company = companies[currentCompany];
  const certificateText = `Certificate of Completion\nCompany: ${company.name}\nPoints: ${company.points}\nCompletion: ${company.completion}%\nCongratulations!`;
  const blob = new Blob([certificateText], {type: "text/plain"});
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${company.name}-Certificate.txt`;
  link.click();
}

// ---------------------- QUIZ MODULE ----------------------
const quizQuestions = [
  {
    question: "What is phishing?",
    options: ["A fishing trip", "Malicious email attack", "Password manager", "Firewall"],
    answer: 1
  },
  {
    question: "Strong passwords should include?",
    options: ["123456", "Your name", "Random letters & numbers", "Password"],
    answer: 2
  },
  {
    question: "MFA stands for?",
    options: ["Multi-Factor Authentication", "My Fancy App", "Multiple File Access", "Mail Filter Auth"],
    answer: 0
  }
];

let currentQuizIndex = 0;

function startQuiz() {
  currentQuizIndex = 0;
  showQuizQuestion();
}

function showQuizQuestion() {
  const questionObj = quizQuestions[currentQuizIndex];
  document.getElementById("quiz-question").textContent = questionObj.question;
  const optionsDiv = document.getElementById("quiz-options");
  optionsDiv.innerHTML = "";
  questionObj.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => checkQuizAnswer(i);
    optionsDiv.appendChild(btn);
  });
  updateProgressBar("quiz-progress", (currentQuizIndex / quizQuestions.length) * 100);
  document.getElementById("quiz-feedback").textContent = "";
}

function checkQuizAnswer(selected) {
  const correct = quizQuestions[currentQuizIndex].answer;
  if (selected === correct) {
    document.getElementById("quiz-feedback").textContent = "✅ Correct!";
    addPoints(10);
  } else {
    document.getElementById("quiz-feedback").textContent = "❌ Incorrect!";
  }
  currentQuizIndex++;
  if (currentQuizIndex < quizQuestions.length) {
    setTimeout(showQuizQuestion, 1000);
  } else {
    updateProgressBar("quiz-progress", 100);
    setTimeout(() => alert("🎉 Quiz Completed!"), 500);
  }
}

// ---------------------- PHISHING MODULE ----------------------
const phishingEmails = [
  {text: "Your account has been hacked! Click here to reset.", correct: "phish"},
  {text: "Reminder: Company meeting at 3 PM.", correct: "safe"},
  {text: "Urgent: Update your password now!", correct: "phish"},
  {text: "Team lunch scheduled for Friday.", correct: "safe"}
];

let currentPhishingIndex = 0;

function startPhishing() {
  currentPhishingIndex = 0;
  showPhishingEmail();
}

function showPhishingEmail() {
  const email = phishingEmails[currentPhishingIndex];
  document.getElementById("phishing-email").textContent = email.text;
  document.getElementById("phishing-feedback").textContent = "";
  updateProgressBar("phishing-progress", (currentPhishingIndex / phishingEmails.length) * 100);
}

document.getElementById("phishing-safe").onclick = () => checkPhishing("safe");
document.getElementById("phishing-phish").onclick = () => checkPhishing("phish");

function checkPhishing(answer) {
  const email = phishingEmails[currentPhishingIndex];
  if (answer === email.correct) {
    document.getElementById("phishing-feedback").textContent = "✅ Correct!";
    addPoints(5);
  } else {
    document.getElementById("phishing-feedback").textContent = "❌ Wrong!";
  }
  currentPhishingIndex++;
  if (currentPhishingIndex < phishingEmails.length) {
    setTimeout(showPhishingEmail, 1000);
  } else {
    updateProgressBar("phishing-progress", 100);
    setTimeout(() => alert("🎉 Phishing Simulation Completed!"), 500);
  }
}

// ---------------------- PASSWORD MODULE ----------------------
const passwordTasks = [
  {task: "Create a strong password with letters, numbers & symbols.", check: pw => pw.length>=8 && /\d/.test(pw) && /[A-Za-z]/.test(pw) && /[^A-Za-z0-9]/.test(pw)},
  {task: "Avoid using common passwords like '123456'.", check: pw => !["123456","password","qwerty"].includes(pw)}
];

let currentPasswordIndex = 0;

function startPassword() {
  currentPasswordIndex = 0;
  showPasswordTask();
}

function showPasswordTask() {
  const task = passwordTasks[currentPasswordIndex];
  document.getElementById("password-task").textContent = task.task;
  document.getElementById("password-feedback").textContent = "";
  document.getElementById("password-task-input")?.remove();
  const input = document.createElement("input");
  input.type = "text";
  input.id = "password-task-input";
  input.placeholder = "Type password here...";
  document.getElementById("password-task").after(input);
}

document.getElementById("submit-password").onclick = () => {
  const pw = document.getElementById("password-task-input").value;
  const task = passwordTasks[currentPasswordIndex];
  if (task.check(pw)) {
    document.getElementById("password-feedback").textContent = "✅ Good!";
    addPoints(10);
  } else {
    document.getElementById("password-feedback").textContent = "❌ Try Again!";
    return;
  }
  currentPasswordIndex++;
  if (currentPasswordIndex < passwordTasks.length) {
    setTimeout(showPasswordTask, 1000);
  } else {
    updateProgressBar("password-progress", 100);
    setTimeout(() => alert("🎉 Password Training Completed!"), 500);
  }
}

// ---------------------- Helper ----------------------
function updateProgressBar(barId, percent) {
  document.getElementById(barId).style.width = percent + "%";
}

// ---------------------- Initialize ----------------------
applyTheme();
updateDashboard();
