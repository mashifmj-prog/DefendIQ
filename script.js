// ----------------- Phishing Simulation Submission -----------------
function submitPhishing(isSafe) {
  const email = phishingEmails[phishingIndex % phishingEmails.length];
  const correct = email.correct === isSafe;
  if(correct) {
    alert("✅ Correct!");
    currentCompany.employees[0].points += 10; // Example scoring
    currentCompany.streak += 1;
  } else {
    alert("❌ Incorrect. Streak reset.");
    currentCompany.streak = 0;
  }
  phishingIndex++;
  loadLeaderboard();
  loadDashboard();
  loadPhishingQuiz();
}

function loadPhishingQuiz() {
  const email = phishingEmails[phishingIndex % phishingEmails.length];
  const container = document.getElementById("phishingContainer");
  container.innerHTML = `
    <div class="card">
      <p><strong>From:</strong> ${email.sender}</p>
      <p><strong>Subject:</strong> ${email.subject}</p>
      <button onclick="submitPhishing(true)">Mark as Safe</button>
      <button onclick="submitPhishing(false)">Mark as Phishing</button>
    </div>
  `;
}

// ----------------- CSV Export -----------------
function exportCSV() {
  let csvContent = "data:text/csv;charset=utf-8,Name,Dept,Completion,Points\n";
  currentCompany.employees.forEach(e => {
    csvContent += `${e.name},${e.dept},${e.completion},${e.points}\n`;
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${currentCompany.name}_report.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ----------------- Initialize App -----------------
applyCompanyTheme(); // Load default company on page load
