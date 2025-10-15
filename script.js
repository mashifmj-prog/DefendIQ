// Data Model
const companies = {
    "Openserve": {
        name: "Openserve",
        primaryColor: "#004d40",
        secondaryColor: "#26a69a",
        logo: "logos/openserve-logo.png",
        tips: [
            "Always verify email senders before clicking links.",
            "Use strong, unique passwords for all accounts.",
            "Enable two-factor authentication where possible.",
            "Report suspicious activity immediately.",
            "Avoid public Wi-Fi for sensitive tasks."
        ],
        employees: [
            {name: "Alice Smith", dept: "IT", completion: 90, points: 200},
            {name: "Bob Johnson", dept: "HR", completion: 70, points: 150},
            {name: "Charlie Lee", dept: "Finance", completion: 50, points: 100},
            {name: "Dana Kim", dept: "IT", completion: 85, points: 180},
            {name: "Evan Patel", dept: "HR", completion: 60, points: 120}
        ],
        streak: 0
    },
    "FiberLink": {
        name: "FiberLink",
        primaryColor: "#1565c0",
        secondaryColor: "#64b5f6",
        logo: "logos/fiberlink-logo.png",
        tips: [
            "Check for HTTPS in URLs before entering data.",
            "Be wary of urgent requests for information.",
            "Regularly update software and antivirus.",
            "Backup important data frequently.",
            "Educate family on cyber threats."
        ],
        employees: [
            {name: "Fiona Green", dept: "Sales", completion: 95, points: 220},
            {name: "George Harris", dept: "Marketing", completion: 80, points: 160},
            {name: "Hannah Ivy", dept: "Sales", completion: 55, points: 110},
            {name: "Ian Jones", dept: "Marketing", completion: 75, points: 140},
            {name: "Jill King", dept: "Operations", completion: 65, points: 130}
        ],
        streak: 0
    },
    "Gyro": {
        name: "Gyro",
        primaryColor: "#4527a0",
        secondaryColor: "#7e57c2",
        logo: "logos/gyro-logo.png",
        tips: [
            "Avoid sharing personal info on social media.",
            "Use VPN for remote work.",
            "Scan attachments before opening.",
            "Monitor account activity regularly.",
            "Participate in regular training sessions."
        ],
        employees: [
            {name: "Kyle Lane", dept: "Engineering", completion: 88, points: 190},
            {name: "Laura Miles", dept: "Support", completion: 72, points: 155},
            {name: "Mike Nolan", dept: "Engineering", completion: 45, points: 90},
            {name: "Nina Olsen", dept: "Support", completion: 82, points: 170},
            {name: "Oscar Pike", dept: "Admin", completion: 68, points: 135}
        ],
        streak: 0
    }
};

const phishingEmails = [
    {subject: "Urgent: Account Suspension Notice", sender: "admin@yourbank.com", correct: false}, // Phishing
    {subject: "Team Meeting Agenda", sender: "manager@company.com", correct: true}, // Safe
    {subject: "Win a Free iPhone!", sender: "promotions@apple-giveaway.com", correct: false},
    {subject: "Expense Report Approval", sender: "finance@company.com", correct: true},
    {subject: "Reset Your Password Now", sender: "support@netflix.com", correct: false}
];

const questions = [
    {
        question: "What is phishing?",
        options: ["A type of fish", "An attempt to obtain sensitive info via email", "A programming language"],
        correct: 1
    },
    {
        question: "What should you do with suspicious emails?",
        options: ["Open attachments immediately", "Delete or report them", "Reply asking for more info"],
        correct: 1
    },
    {
        question: "What does HTTPS indicate?",
        options: ["Secure connection", "High-speed internet", "Hyper text"],
        correct: 0
    },
    {
        question: "Why use 2FA?",
        options: ["Adds extra security layer", "Makes login faster", "Reduces password length"],
        correct: 0
    },
    {
        question: "Best password practice?",
        options: ["Use 'password123'", "Short and simple", "Long, unique with symbols"],
        correct: 2
    }
];

let currentCompany = companies["Openserve"];
let phishingIndex = 0;
let quizIndex = 0;
let deptChart = null;
let pointsPie = null;

// Key Functions
function changeCompany(companyName) {
    currentCompany = companies[companyName];
    applyCompanyTheme();
}

function applyCompanyTheme() {
    document.documentElement.style.setProperty('--primary-color', currentCompany.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', currentCompany.secondaryColor);
    document.getElementById('logo').src = currentCompany.logo;
    document.getElementById('app-title').textContent = `🛡️ DefendIQ — ${currentCompany.name}`;
    document.getElementById('footer-text').textContent = `DefendIQ – Trusted by Openserve, FiberLink & Gyro`;
    loadDashboard();
    loadLeaderboard();
    loadTips();
    loadQuiz();
    loadPhishingQuiz();
}

function showSection(id) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => section.hidden = true);
    document.getElementById(id).hidden = false;
    if (id === 'dashboard') loadDashboard();
    if (id === 'leaderboard') loadLeaderboard();
    if (id === 'quiz') loadQuiz();
    if (id === 'phishing') loadPhishingQuiz();
    if (id === 'tips') loadTips();
}

function loadDashboard() {
    // Streak
    document.getElementById('streak').textContent = currentCompany.streak;

    // Alerts
    const lowPerformers = currentCompany.employees.filter(e => e.completion < 60);
    const lowList = document.getElementById('low-performers');
    lowList.innerHTML = '';
    if (lowPerformers.length === 0) {
        lowList.innerHTML = '<li>No low performers!</li>';
    } else {
        lowPerformers.forEach(e => {
            const li = document.createElement('li');
            li.textContent = `${e.name} (${e.dept}): ${e.completion}%`;
            lowList.appendChild(li);
        });
    }

    // Averages
    const totalCompletion = currentCompany.employees.reduce((sum, e) => sum + e.completion, 0);
    const avgCompletion = (totalCompletion / currentCompany.employees.length).toFixed(0);
    document.getElementById('avg-completion').textContent = `${avgCompletion}%`;

    const totalPoints = currentCompany.employees.reduce((sum, e) => sum + e.points, 0);
    const avgPoints = (totalPoints / currentCompany.employees.length).toFixed(0);
    document.getElementById('avg-points').textContent = avgPoints;

    // Top 3
    const sorted = [...currentCompany.employees].sort((a, b) => b.points - a.points);
    const top3List = document.getElementById('top3');
    top3List.innerHTML = '';
    sorted.slice(0, 3).forEach(e => {
        const li = document.createElement('li');
        li.textContent = `${e.name}: ${e.points} points`;
        top3List.appendChild(li);
    });

    // Charts
    loadCharts();
}

function loadCharts() {
    // Destroy old charts if exist
    if (deptChart) deptChart.destroy();
    if (pointsPie) pointsPie.destroy();

    // Group by dept
    const depts = {};
    currentCompany.employees.forEach(e => {
        if (!depts[e.dept]) depts[e.dept] = { completion: [], points: 0 };
        depts[e.dept].completion.push(e.completion);
        depts[e.dept].points += e.points;
    });

    const deptLabels = Object.keys(depts);
    const avgCompletions = deptLabels.map(d => {
        const comps = depts[d].completion;
        return comps.reduce((sum, c) => sum + c, 0) / comps.length;
    });
    const deptPoints = deptLabels.map(d => depts[d].points);

    // Bar Chart: Dept Completion
    const deptCtx = document.getElementById('dept-chart').getContext('2d');
    deptChart = new Chart(deptCtx, {
        type: 'bar',
        data: {
            labels: deptLabels,
            datasets: [{
                label: 'Avg Completion %',
                data: avgCompletions,
                backgroundColor: currentCompany.secondaryColor
            }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });

    // Pie Chart: Points Distribution
    const pieCtx = document.getElementById('points-pie').getContext('2d');
    pointsPie = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: deptLabels,
            datasets: [{
                data: deptPoints,
                backgroundColor: [currentCompany.primaryColor, currentCompany.secondaryColor, '#ccc'] // Extend if more depts
            }]
        }
    });
}

function loadLeaderboard() {
    const sorted = [...currentCompany.employees].sort((a, b) => (b.completion + b.points) - (a.completion + a.points));
    const list = document.getElementById('leaderboard-list');
    list.innerHTML = '';
    sorted.forEach((e, index) => {
        const li = document.createElement('li');
        li.textContent = `#${index + 1} ${e.name} (${e.dept}): ${e.completion}% completion, ${e.points} points`;
        if (index < 3) li.style.fontWeight = 'bold'; // Highlight top 3
        list.appendChild(li);
    });
}

function loadQuiz() {
    const q = questions[quizIndex % questions.length];
    document.getElementById('quiz-question').textContent = q.question;
    const optionsDiv = document.getElementById('quiz-options');
    optionsDiv.innerHTML = '';
    q.options.forEach((opt, i) => {
        const label = document.createElement('label');
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'quiz-answer';
        radio.value = i;
        label.appendChild(radio);
        label.appendChild(document.createTextNode(opt));
        optionsDiv.appendChild(label);
    });
}

function submitQuiz() {
    const selected = document.querySelector('input[name="quiz-answer"]:checked');
    if (!selected) return alert("Select an answer!");
    const q = questions[quizIndex % questions.length];
    const correct = parseInt(selected.value) === q.correct;
    if (correct) {
        alert("✅ Correct!");
        currentCompany.employees[0].points += 10; // Demo: update first employee
        currentCompany.streak += 1;
    } else {
        alert("❌ Incorrect. Streak reset.");
        currentCompany.streak = 0;
    }
    quizIndex++;
    loadQuiz();
    loadDashboard();
    loadLeaderboard();
}

function loadPhishingQuiz() {
    const email = phishingEmails[phishingIndex % phishingEmails.length];
    const container = document.getElementById("phishingContainer");
    container.innerHTML = `
        <p><strong>From:</strong> ${email.sender}</p>
        <p><strong>Subject:</strong> ${email.subject}</p>
        <p>Body: [Simulated email content here]</p>
    `;
}

function submitPhishing(isSafe) {
    const email = phishingEmails[phishingIndex % phishingEmails.length];
    const correct = email.correct === isSafe;
    if (correct) {
        alert("✅ Correct!");
        currentCompany.employees[0].points += 10; // Demo: update first employee
        currentCompany.streak += 1;
    } else {
        alert("❌ Incorrect. Streak reset.");
        currentCompany.streak = 0;
    }
    phishingIndex++;
    loadPhishingQuiz();
    loadDashboard();
    loadLeaderboard();
}

function loadTips() {
    const list = document.getElementById('tips-list');
    list.innerHTML = '';
    currentCompany.tips.forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        list.appendChild(li);
    });
}

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

// Initialize
window.onload = () => {
    changeCompany('Openserve');
    showSection('dashboard');
};
