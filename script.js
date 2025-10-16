const companies = {
  DefendIQ: {
    color: "#004d40",
    logo: "logos/default-logo.png",
    employees: [
      { name: "Alice Smith", dept: "Infra", completion: 100, points: 50 },
      { name: "Bob Moyo", dept: "Support", completion: 80, points: 30 },
      { name: "Carol Jones", dept: "Sales", completion: 60, points: 20 }
    ]
  },
  Openserve: {
    color: "#0d47a1",
    logo: "logos/openserve-logo.png",
    employees: [
      { name: "John Khumalo", dept: "Network Ops", completion: 90, points: 45 },
      { name: "Thandi Dlamini", dept: "Fiber", completion: 85, points: 40 },
      { name: "Peter Nkosi", dept: "Support", completion: 70, points: 25 }
    ]
  },
  FiberLink: {
    color: "#6a1b9a",
    logo: "logos/fiberlink-logo.png",
    employees: [
      { name: "Susan Lee", dept: "Engineering", completion: 95, points: 48 },
      { name: "Michael Adams", dept: "Installations", completion: 75, points: 32 },
      { name: "Karen Botha", dept: "Ops", completion: 60, points: 20 }
    ]
  },
  Gyro: {
    color: "#c62828",
    logo: "logos/gyro-logo.png",
    employees: [
      { name: "Teboho Molefe", dept: "Facilities", completion: 88, points: 42 },
      { name: "Linda Jacobs", dept: "Planning", completion: 77, points: 33 },
      { name: "Sipho Nkuna", dept: "Projects", completion: 66, points: 28 }
    ]
  }
};

document.addEventListener("DOMContentLoaded", () => {
  showSection("dashboard");
  applyCompanyTheme("DefendIQ");
});

function changeCompany(name) {
  const main = document.getElementById("mainContent");
  main.classList.add("fade-out");
  setTimeout(() => {
    applyCompanyTheme(name);
    main.classList.remove("fade-out");
  }, 500);
}

function applyCompanyTheme(name = "DefendIQ") {
  const company = companies[name];
  const header = document.getElementById("header");
  const footer = document.getElementById("footer");

  document.body.style.setProperty("--theme-color", company.color);
  header.style.background = company.color;
  footer.style.background = company.color;

  document.getElementById("appTitle").textContent = `🛡️ ${name}`;
  const logo = document.getElementById("companyLogo");
  logo.src = company.logo;
  logo.classList.add("animate");
  setTimeout(() => logo.classList.remove("animate"), 600);

  updateDashboard(name);
  updateLeaderboard(name);
  renderCharts(name);
}

function showSection(sectionId) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(sectionId).classList.add("active");
}

function updateDashboard(name) {
  const company = companies[name];
  const avg = (
    company.employees.reduce((a, b) => a + b.completion, 0) / company.employees.length
  ).toFixed(1);
  document.getElementById("dashboardContent").innerHTML = `
    <p><strong>${name}</strong> Average Training Completion: ${avg}%</p>
  `;
}

function updateLeaderboard(name) {
  const company = companies[name];
  const content = company.employees
    .map((emp, i) => `
      <div class="leader-item ${emp.completion < 70 ? "alert" : ""}">
        <strong>${i + 1}. ${emp.name}</strong> — ${emp.dept} |
        Completion: ${emp.completion}% | Points: ${emp.points}
      </div>
    `)
    .join("");
  const container = document.getElementById("leaderboardContent");
  container.style.opacity = 0;
  setTimeout(() => {
    container.innerHTML = content;
    container.style.opacity = 1;
  }, 200);
}

let deptChart, pointsChart;

function renderCharts(name) {
  const ctx1 = document.getElementById("deptChart").getContext("2d");
  const ctx2 = document.getElementById("pointsChart").getContext("2d");
  const company = companies[name];

  if (deptChart) deptChart.destroy();
  if (pointsChart) pointsChart.destroy();

  deptChart = new Chart(ctx1, {
    type: "bar",
    data: {
      labels: company.employees.map(e => e.dept),
      datasets: [{
        label: "Completion %",
        data: company.employees.map(e => e.completion),
        backgroundColor: company.color + "cc"
      }]
    },
    options: { animation: { duration: 1000 }, responsive: true, plugins: { legend: { display: false } } }
  });

  pointsChart = new Chart(ctx2, {
    type: "pie",
    data: {
      labels: company.employees.map(e => e.name),
      datasets: [{
        label: "Points",
        data: company.employees.map(e => e.points),
        backgroundColor: [
          company.color,
          lighten(company.color, 0.2),
          lighten(company.color, 0.4)
        ]
      }]
    },
    options: { animation: { duration: 1000 }, responsive: true }
  });
}

function lighten(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent * 100);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

function exportCSV() {
  const rows = [["Name", "Dept", "Completion", "Points"]];
  const name = document.getElementById("companySelect").value;
  companies[name].employees.forEach(e => {
    rows.push([e.name, e.dept, e.completion, e.points]);
  });
  const csv = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}_report.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}
