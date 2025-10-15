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
    tips: ["Secure all infrastructure devices with strong passwords.","Verify network change requests.","Report unusual system behavior."],
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
    tips: ["Use MFA everywhere.","Report suspicious emails.","Keep software up-to-date."],
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
  currentCompany.employees
    .sort((a,b)=> (b.completion + b.points) - (a.completion + a.points))
    .forEach((u,i)=>{
      container.insertAdjacentHTML("beforeend",
        `<div class="card">
          <h3>${i+1}. ${u.name}</h3>
          <p><strong>Dept:</strong> ${u.dept}</p>
          <p><strong>Completion:</strong> <progress value="${u.completion}" max="100"></progress> ${u.completion}%</p>
          <p><strong>Points:</strong> ${u.points}</p>
        </div>`);
    });
}

// --- Quiz ---
const quizzes = [
  { question:"Which of the following is a phishing red flag?", options:["Sender domain mismatch","Unusual urgency","Poor grammar","All of the above"], correct:3 },
  { question:"What should you do if you suspect a phishing email?", options:["Click to see what it does","Report it using the phishing button","Forward to colleague","Ignore it"], correct:1 }
];
let currentQuiz=0;

function loadQuiz(){
  const container=document.getElementById("quizContainer");
  const q=quizzes[currentQuiz];
  if(!q){container.innerHTML="<div class='card'><p>🎉 You've completed all quizzes!</p></div>"; return;}
  container.innerHTML=`<div class="card">
    <p><strong>${q.question}</strong></p>
    ${q.options.map((opt,i)=>`<div><input type='radio' name='answer' value='${i}' id='opt${i}'><label for='opt${i}'>${opt}</label></div>`).join("")}
    <button onclick="submitQuiz(${q.correct})">Submit</button>
  </div>`;
}

function submitQuiz(correctIndex){
  const selected=document.querySelector("input[name='answer']:checked");
  if(!selected) return alert("Please select an answer.");
  const answer=parseInt(selected.value);
  if(answer===correctIndex){alert("✅ Correct!"); currentCompany.employees[0].points+=10;}
  else{alert("❌ Incorrect.");}
  currentQuiz=(currentQuiz+1)%quizzes.length;
  loadLeaderboard();
  loadQuiz();
}

// --- Tips ---
function loadTips(){
  const list=document.getElementById("tipsList");
  list.innerHTML="";
  currentCompany.tips.forEach(t=>{list.insertAdjacentHTML("beforeend",`<li>${t}</li>`);});
}

// --- Init ---
document.addEventListener("DOMContentLoaded",()=>{
  const org=new URLSearchParams(window.location.search).get("org")?.toLowerCase();
  if(org && companies[org]){currentCompany=companies[org]; document.getElementById("companySelect").value=org;}
  applyCompanyTheme();
});
