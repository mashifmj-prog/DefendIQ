// --- Companies & Themes ---
const companies = {
  defendiq: {
    name: "DefendIQ",
    primaryColor: "#222",
    secondaryColor: "#555",
    logo: "logos/default-logo.png",
    tips: ["Stay aware of phishing threats.","Use strong passwords.","Think before you click!"],
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
    tips: ["Secure infrastructure devices.","Verify network changes.","Report unusual activity."],
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
    tips: ["Use MFA.","Report suspicious emails.","Update software regularly."],
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
    tips: ["Verify visitor identity.","Report suspicious activity.","Do not leave access cards unattended."],
    employees: [
      { name: "George King", dept: "Facilities", completion: 95, points: 40 },
      { name: "Hannah Lee", dept: "Security", completion: 85, points: 30 },
      { name: "Ian Scott", dept: "Ops", completion: 70, points: 25 },
    ],
  },
};

// Global state
let currentCompany = companies.defendiq;
let currentQuiz = 0;
let deptChart, pointsChart;

// --- Dropdown Change ---
function changeCompany() {
  const org = document.getElementById("companySelect").value.toLowerCase();
  currentCompany = companies[org] || companies.defendiq;
  applyCompanyTheme();
}

// --- Apply Theme & Update UI ---
function applyCompanyTheme() {
  document.documentElement.style.setProperty("--primary-color", currentCompany.primaryColor);
  document.documentElement.style.setProperty("--secondary-color", currentCompany.secondaryColor);

  document.getElementById("companyLogo").src = currentCompany.logo;
  document.getElementById("companyLogo").alt = currentCompany.name + " Logo";

  document.getElementById("appTitle").innerHTML = `🛡️ DefendIQ — ${currentCompany.name}`;
  document.getElementById("footerText").innerText = "DefendIQ – Trusted by Openserve, FiberLink & Gyro";

  loadTips();
  loadLeaderboard();
  loadQuiz();
  loadDashboard();
  loadCharts();
}

// --- Navigation ---
function showSection(id) {
  document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// --- Leaderboard ---
function loadLeaderboard() {
  const container = document.getElementById("leaderboardCards");
  container.innerHTML = "";

  const employees = [...currentCompany.employees].sort((a,b)=> (b.completion + b.points) - (a.completion + a.points));

  employees.forEach((
