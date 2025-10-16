// Multi-company data
const companies = {
  DefendIQ: {
    name: "DefendIQ",
    primaryColor: "#1e90ff",
    secondaryColor: "#f0f0f0",
    logo: "logos/defendiq-logo.png",
    tips: ["Verify emails before clicking.", "Use strong passwords.", "Report suspicious activity."],
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
    tips: ["Always lock your workstation.", "Do not reuse passwords.", "Enable MFA."],
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
    tips: ["Be cautious with links.", "Report phishing quickly.", "Update passwords regularly."],
    streak: 0,
    points: 0,
    completion: 0,
    badges: []
  }
};

let currentCompany = "DefendIQ";

// Switch company
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

// Apply theme colors
function applyTheme() {
  const company = companies[currentCompany];
  document.documentElement.style.setProperty("--primary-color", company.primaryColor);
  document.documentElement.style.setProperty("--secondary-color", company.secondaryColor);
}

// Section navigation
function showSection(sectionId) {
  document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
  document.getElementById(sectionId).classList.remove("hidden");
  if (sectionId === "dashboard") updateDashboard();
}

// Dashboard update
function updateDashboard() {
  const company = companies[currentCompany];
  document.getElementById("streak").textContent = company.streak;
  document.getElementById("points").textContent = company.points;
  document.getElementById("completion").textContent = company.completion + "%";

  // Chart
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
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Badges & Certificates
function awardBadge(badgeName) {
  const company = companies[currentCompany];
  if (!company.badges.includes(badgeName)) {
    company.badges.push(badgeName);
    alert(`Badge earned: ${badgeName}`);
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

// Example: Increment points and streak (simulation)
function addPoints(points) {
  const company = companies[currentCompany];
  company.points += points;
  company.streak++;
  company.completion = Math.min(100, company.completion + points);
  updateDashboard();
}

// Initialize
applyTheme();
updateDashboard();
