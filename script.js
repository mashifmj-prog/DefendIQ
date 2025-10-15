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
            {name: "Alice Smith", dept: "IT", completion: 90, points: 200, quizCompleted: 0, phishingCompleted: 0},
            {name: "Bob Johnson", dept: "HR", completion: 70, points: 150, quizCompleted: 0, phishingCompleted: 0},
            {name: "Charlie Lee", dept: "Finance", completion: 50, points: 100, quizCompleted: 0, phishingCompleted: 0},
            {name: "Dana Kim", dept: "IT", completion: 85, points: 180, quizCompleted: 0, phishingCompleted: 0},
            {name: "Evan Patel", dept: "HR", completion: 60, points: 120, quizCompleted: 0, phishingCompleted: 0}
        ],
        streak: 0,
        streakHistory: [0, 1, 2] // Simulated for analytics
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
            {name: "Fiona Green", dept: "Sales", completion: 95, points: 220, quizCompleted: 0, phishingCompleted: 0},
            {name: "George Harris", dept: "Marketing", completion: 80, points: 160, quizCompleted: 0, phishingCompleted: 0},
            {name: "Hannah Ivy", dept: "Sales", completion: 55, points: 110, quizCompleted: 0, phishingCompleted: 0},
            {name: "Ian Jones", dept: "Marketing", completion: 75, points: 140, quizCompleted: 0, phishingCompleted: 0},
            {name: "Jill King", dept: "Operations", completion: 65, points: 130, quizCompleted: 0, phishingCompleted: 0}
        ],
        streak: 0,
        streakHistory: [0, 3, 5]
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
            {name: "Kyle Lane", dept: "Engineering", completion: 88, points: 190, quizCompleted: 0, phishingCompleted: 0},
            {name: "Laura Miles", dept: "Support", completion: 72, points: 155, quizCompleted: 0, phishingCompleted: 0},
            {name: "Mike Nolan", dept: "Engineering", completion: 45, points: 90, quizCompleted: 0, phishingCompleted: 0},
            {name: "Nina Olsen", dept: "Support", completion: 82, points: 170, quizCompleted: 0, phishingCompleted: 0},
            {name: "Oscar Pike", dept: "Admin", completion: 68, points: 135, quizCompleted: 0, phishingCompleted: 0}
        ],
        streak: 0,
        streakHistory: [0, 2, 4]
    }
};

const phishingEmails = [
    {
        subject: "Urgent: Account Suspension Notice",
        sender: "admin@yourbank.com",
        body: "Dear Customer, Your account will be suspended due to unusual activity. Click here to verify your identity immediately.",
        correct: false
    },
    {
        subject: "Team Meeting Agenda",
        sender: "manager@company.com",
        body: "Hi Team, Attached is the agenda for our weekly meeting. Please review before Thursday.",
        correct: true
    },
    {
        subject: "Win a Free iPhone!",
        sender: "promotions@apple-giveaway.com",
        body: "Congratulations! You've won a free iPhone. Claim your prize now by visiting our website!",
        correct: false
    },
    {
        subject: "Expense Report Approval",
        sender: "finance@company.com",
        body: "Hello, Your expense report for last month has been submitted. Please confirm approval by end of day.",
        correct: true
    },
    {
        subject: "Reset Your Password Now",
        sender: "support@netflix.com",
        body: "Your Netflix account password needs to be reset due to a security issue. Click here to update it now.",
        correct: false
    },
    {
        subject: "Your Invoice is Ready",
        sender: "billing@amazon.com",
        body: "Dear User, Your invoice for recent purchase is ready. Download it now to avoid late fees.",
        correct: false
    },
    {
        subject: "Weekly Newsletter",
        sender: "news@company.com",
        body: "Stay updated with our latest company news and events. Read more in this week's newsletter.",
        correct: true
    },
    {
        subject: "Security Alert: Unusual Activity",
        sender: "security@google.com",
        body: "We detected unusual activity on your account. Please login to secure it immediately.",
        correct: false
    },
    {
        subject: "Project Update",
        sender: "teamlead@company.com",
        body: "Team, the project timeline has been updated. Check the shared drive for details.",
        correct: true
    },
    {
        subject: "Claim Your Prize",
        sender: "winners@lottery.com",
        body: "You've been selected as a winner! Provide your details to claim your prize today!",
        correct: false
    }
];

const questions = [
    {
        question: "What is phishing?",
        options: ["A type of fish", "An attempt to obtain sensitive info via email", "A programming language"],
        correct: 1,
        explanation: "Phishing tricks users into sharing sensitive information via deceptive emails."
    },
    {
        question: "What should you do with suspicious emails?",
        options: ["Open attachments immediately", "Delete or report them", "Reply asking for more info"],
        correct: 1,
        explanation: "Delete or report suspicious emails to avoid malware or data breaches."
    },
    {
        question: "What does HTTPS indicate?",
        options: ["Secure connection", "High-speed internet", "Hyper text"],
        correct: 0,
        explanation: "HTTPS shows a secure, encrypted connection protecting your data."
    },
    {
        question: "Why use 2FA?",
        options: ["Adds extra security layer", "Makes login faster", "Reduces password length"],
        correct: 0,
        explanation: "2FA requires a second verification step, enhancing security."
    },
    {
        question: "Best password practice?",
        options: ["Use 'password123'", "Short and simple", "Long, unique with symbols"],
        correct: 2,
        explanation: "Strong passwords are long and unique with mixed characters."
    },
    {
        question: "What is malware?",
        options: ["Malicious software", "A type of email", "A secure protocol"],
        correct: 0,
        explanation: "Malware is software designed to harm devices or networks."
    },
    {
        question: "How to spot a fake website?",
        options: ["Look for HTTPS and padlock", "Click all links", "Ignore URL"],
        correct: 0,
        explanation: "Fake websites often lack HTTPS or have suspicious URLs."
    },
    {
        question: "What is ransomware?",
        options: ["Software that encrypts files for ransom", "A free software", "A game"],
        correct: 0,
        explanation: "Ransomware locks files and demands payment for access."
    },
    {
        question: "Importance of software updates?",
        options: ["They fix security vulnerabilities", "They slow down the computer", "They are optional"],
        correct: 0,
        explanation: "Updates patch security holes to protect your system."
    },
    {
        question: "What is social engineering?",
        options: ["Manipulating people to divulge info", "Building social networks", "Engineering society"],
        correct: 0,
        explanation: "Social engineering manipulates users into revealing confidential data."
    },
    {
        question: "What is a zero-day exploit?",
        options: ["An attack on day zero", "A vulnerability unknown to the vendor", "A daily security check"],
        correct: 1,
        explanation: "Zero-day exploits target unknown software vulnerabilities."
    },
    {
        question: "What does VPN stand for?",
        options: ["Virtual Private Network", "Very Private Node", "Visual Protection Net"],
        correct: 0,
        explanation: "A VPN encrypts your internet traffic for privacy."
    },
    {
        question: "What is DDoS attack?",
        options: ["Distributed Denial of Service", "Direct Data Overload System", "Digital Defense Operation Service"],
        correct: 0,
        explanation: "DDoS floods servers with traffic to disrupt access."
    },
    {
        question: "What is encryption?",
        options: ["Converting data to code to prevent unauthorized access", "Compressing files", "Sending emails"],
        correct: 0,
        explanation: "Encryption scrambles data to ensure only authorized access."
    },
    {
        question: "What is a firewall?",
        options: ["Network security system that monitors traffic", "A wall against fire", "A software for file sharing"],
        correct: 0,
        explanation: "Firewalls control network traffic based on security rules."
    }
];

let currentCompany = companies["Openserve"];
let currentUserIndex = -1;
let phishingIndex = 0;
let quizIndex = 0;
let deptChart = null;
let pointsPie = null;
let streakChart = null;
let deptPointsChart = null;
let isDeveloperMode = false;

const encouragementPhrases = ['Great job! 🚀', 'Awesome! 🌟', 'Well done! 👏', 'Keep it up! 💪', 'Nice catch! 🕵️'];

function showLogin() {
    document.getElementById('landing').hidden = true;
    document.getElementById('login').hidden = false;
}

function updateCompany(companyName) {
    currentCompany = companies[companyName];
    applyCompanyTheme();
}

function login() {
    isDeveloperMode = document.getElementById('developer-mode').checked;
    if (!isDeveloperMode) {
        const username = document.getElementById('username').value.trim();
        if (!username) return alert('Please enter your name.');
        
        const employeeIndex = currentCompany.employees.findIndex(e => e.name.toLowerCase() === username.toLowerCase());
        if (employeeIndex === -1) return alert('User not found. Please try again.');
        
        currentUserIndex = employeeIndex;
        localStorage.setItem('currentUser', JSON.stringify({company: currentCompany.name, index: currentUserIndex}));
    } else {
        currentUserIndex = 0; // Default to first employee for developer mode
        localStorage.setItem('currentUser', JSON.stringify({company: currentCompany.name, index: currentUserIndex, developer: true}));
    }
    
    document.getElementById('login').style.display = 'none';
    document.querySelector('header').hidden = false;
    document.querySelector('nav').hidden = false;
    document.querySelector('main').hidden = false;
    document.querySelector('footer').hidden = false;
    
    applyCompanyTheme();
    showSection('dashboard');
}

function changeCompany(companyName) {
    currentCompany = companies[companyName];
    if (!isDeveloperMode) {
        currentUserIndex = -1;
        localStorage.removeItem('currentUser');
        document.getElementById('login').style.display = 'block';
        document.querySelector('header').hidden = true;
        document.querySelector('nav').hidden = true;
        document.querySelector('main').hidden = true;
        document.querySelector('footer').hidden = true;
    } else {
        applyCompanyTheme();
        loadProfile();
    }
}

function applyCompanyTheme() {
    document.documentElement.style.setProperty('--primary-color', currentCompany.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', currentCompany.secondaryColor);
    document.getElementById('logo').src = currentCompany.logo;
    document.getElementById('app-title').textContent = `🛡️ DefendIQ — ${currentCompany.name}${isDeveloperMode ? ' (Developer Mode)' : ''}`;
    document.getElementById('footer-text').textContent = `DefendIQ – Trusted by Openserve, FiberLink & Gyro`;
    loadDashboard();
    loadLeaderboard();
    loadTips();
    loadQuiz();
    loadPhishingQuiz();
}

function showSection(id) {
    const sections = document.querySelectorAll('main > section');
    sections.forEach(section => section.hidden = true);
    document.getElementById(id).hidden = false;
    if (id === 'dashboard') loadDashboard();
    if (id === 'leaderboard') loadLeaderboard();
    if (id === 'quiz') loadQuiz();
    if (id === 'phishing') loadPhishingQuiz();
    if (id === 'tips') loadTips();
    if (id === 'analytics') loadAnalytics();
    if (id === 'profile') loadProfile();
}

function loadDashboard() {
    document.getElementById('streak').textContent = currentCompany.streak;

    const lowPerformers = currentCompany.employees.filter(e => e.completion < 60);
    const lowList = document.getElementById('low-performers');
    lowList.innerHTML = lowPerformers.length === 0 ? '<li>No low performers!</li>' : '';
    lowPerformers.forEach(e => {
        const li = document.createElement('li');
        li.textContent = `${e.name} (${e.dept}): ${e.completion}%`;
        lowList.appendChild(li);
    });

    const totalCompletion = currentCompany.employees.reduce((sum, e) => sum + e.completion, 0);
    const avgCompletion = (totalCompletion / currentCompany.employees.length).toFixed(0);
    document.getElementById('avg-completion').textContent = `${avgCompletion}%`;

    const totalPoints = currentCompany.employees.reduce((sum, e) => sum + e.points, 0);
    const avgPoints = (totalPoints / currentCompany.employees.length).toFixed(0);
    document.getElementById('avg-points').textContent = avgPoints;

    const sorted = [...currentCompany.employees].sort((a, b) => b.points - a.points);
    const top3List = document.getElementById('top3');
    top3List.innerHTML = '';
    sorted.slice(0, 3).forEach(e => {
        const li = document.createElement('li');
        li.textContent = `${e.name}: ${e.points} points`;
        top3List.appendChild(li);
    });

    loadCharts();
}

function loadCharts() {
    if (deptChart) deptChart.destroy();
    if (pointsPie) pointsPie.destroy();

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
        options: { scales: { y: { beginAtZero: true } }, responsive: true, maintainAspectRatio: false }
    });

    const pieCtx = document.getElementById('points-pie').getContext('2d');
    pointsPie = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: deptLabels,
            datasets: [{
                data: deptPoints,
                backgroundColor: [currentCompany.primaryColor, currentCompany.secondaryColor, '#ccc']
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function loadLeaderboard() {
    const sorted = [...currentCompany.employees].sort((a, b) => (b.completion + b.points) - (a.completion + a.points));
    const list = document.getElementById('leaderboard-list');
    list.innerHTML = '';
    const badges = ['🥇', '🥈', '🥉'];
    sorted.forEach((e, index) => {
        const li = document.createElement('li');
        const badge = index < 3 ? badges[index] + ' ' : '';
        li.textContent = `#${index + 1} ${badge}${e.name} (${e.dept}): ${e.completion}% completion, ${e.points} points`;
        if (index < 3) li.style.fontWeight = 'bold';
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
    document.getElementById('quiz-feedback').textContent = '';
    updateQuizProgress();
}

function updateQuizProgress() {
    if (isDeveloperMode) {
        document.getElementById('quiz-progress').textContent = 'Progress: N/A (Developer Mode)';
        return;
    }
    const user = currentCompany.employees[currentUserIndex];
    const progress = (user.quizCompleted / questions.length) * 100;
    document.getElementById('quiz-progress').textContent = `Progress: ${progress.toFixed(0)}% (${user.quizCompleted}/${questions.length} completed)`;
}

function submitQuiz() {
    const selected = document.querySelector('input[name="quiz-answer"]:checked');
    if (!selected) return alert("Select an answer!");
    const q = questions[quizIndex % questions.length];
    const correct = parseInt(selected.value) === q.correct;
    const feedback = document.getElementById('quiz-feedback');
    const yourAnswer = q.options[parseInt(selected.value)];
    const randomPhrase = encouragementPhrases[Math.floor(Math.random() * encouragementPhrases.length)];
    if (correct) {
        feedback.textContent = `${randomPhrase} Correct! "${yourAnswer}" is right. ${q.explanation} +10 points, +5% completion.`;
        if (!isDeveloperMode) {
            currentCompany.employees[currentUserIndex].points += 10;
            currentCompany.employees[currentUserIndex].completion = Math.min(100, currentCompany.employees[currentUserIndex].completion + 5);
            currentCompany.employees[currentUserIndex].quizCompleted = Math.min(questions.length, currentCompany.employees[currentUserIndex].quizCompleted + 1);
            currentCompany.streak += 1;
            currentCompany.streakHistory.push(currentCompany.streak); // Update history for analytics
        }
    } else {
        feedback.textContent = `Oops! Incorrect. You chose "${yourAnswer}", but it's "${q.options[q.correct]}". ${q.explanation} Streak reset. Try again!`;
        if (!isDeveloperMode) currentCompany.streak = 0;
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
        <p><strong>Body:</strong> ${email.body}</p>
    `;
    document.getElementById('phishing-feedback').textContent = '';
    updatePhishingProgress();
}

function updatePhishingProgress() {
    if (isDeveloperMode) {
        document.getElementById('phishing-progress').textContent = 'Progress: N/A (Developer Mode)';
        return;
    }
    const user = currentCompany.employees[currentUserIndex];
    const progress = (user.phishingCompleted / phishingEmails.length) * 100;
    document.getElementById('phishing-progress').textContent = `Progress: ${progress.toFixed(0)}% (${user.phishingCompleted}/${phishingEmails.length} completed)`;
}

function submitPhishing(isSafe) {
    const email = phishingEmails[phishingIndex % phishingEmails.length];
    const correct = email.correct === isSafe;
    const feedback = document.getElementById('phishing-feedback');
    const yourAction = isSafe ? "Safe" : "Phishing";
    const correctAction = email.correct ? "Safe" : "Phishing";
    const randomPhrase = encouragementPhrases[Math.floor(Math.random() * encouragementPhrases.length)];
    if (correct) {
        feedback.textContent = `${randomPhrase} Correct! Marked as ${yourAction}. Tip: Check sender domain. +10 points, +5% completion.`;
        if (!isDeveloperMode) {
            currentCompany.employees[currentUserIndex].points += 10;
            currentCompany.employees[currentUserIndex].completion = Math.min(100, currentCompany.employees[currentUserIndex].completion + 5);
            currentCompany.employees[currentUserIndex].phishingCompleted = Math.min(phishingEmails.length, currentCompany.employees[currentUserIndex].phishingCompleted + 1);
            currentCompany.streak += 1;
            currentCompany.streakHistory.push(currentCompany.streak);
        }
    } else {
        feedback.textContent = `Whoops! Incorrect. Marked as ${yourAction}, but it's ${correctAction}. Tip: Watch for urgent language. Streak reset. Keep practicing!`;
        if (!isDeveloperMode) currentCompany.streak = 0;
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

function loadAnalytics() {
    const totalQuizzes = currentCompany.employees.reduce((sum, e) => sum + e.quizCompleted, 0);
    document.getElementById('total-quizzes').textContent = totalQuizzes;

    const totalPhishing = currentCompany.employees.reduce((sum, e) => sum + e.phishingCompleted, 0);
    document.getElementById('total-phishing').textContent = totalPhishing;

    // Streak Trend Line Chart
    if (streakChart) streakChart.destroy();
    const streakCtx = document.getElementById('streak-trend').getContext('2d');
    streakChart = new Chart(streakCtx, {
        type: 'line',
        data: {
            labels: currentCompany.streakHistory.map((_, i) => `Session ${i + 1}`),
            datasets: [{
                label: 'Streak Trend',
                data: currentCompany.streakHistory,
                borderColor: currentCompany.primaryColor,
                fill: false
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    // Dept Points Bar Chart
    if (deptPointsChart) deptPointsChart.destroy();
    const depts = {};
    currentCompany.employees.forEach(e => {
        if (!depts[e.dept]) depts[e.dept] = 0;
        depts[e.dept] += e.points / currentCompany.employees.filter(emp => emp.dept === e.dept).length;
    });
    const deptLabels = Object.keys(depts);
    const avgDeptPoints = deptLabels.map(d => depts[d]);
    const deptPointsCtx = document.getElementById('dept-points-bar').getContext('2d');
    deptPointsChart = new Chart(deptPointsCtx, {
        type: 'bar',
        data: {
            labels: deptLabels,
            datasets: [{
                label: 'Avg Points per Dept',
                data: avgDeptPoints,
                backgroundColor: currentCompany.secondaryColor
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function loadProfile() {
    if (isDeveloperMode) {
        document.getElementById('profile-name').textContent = 'Name: Developer Mode';
        document.getElementById('profile-dept').textContent = 'Department: N/A';
        document.getElementById('profile-completion').textContent = 'Completion: N/A';
        document.getElementById('profile-points').textContent = 'Points: N/A';
        document.getElementById('profile-streak').textContent = `Current Streak: ${currentCompany.streak}`;
        document.getElementById('badges-list').innerHTML = '<li>N/A in Developer Mode</li>';
    } else {
        const user = currentCompany.employees[currentUserIndex];
        document.getElementById('profile-name').textContent = `Name: ${user.name}`;
        document.getElementById('profile-dept').textContent = `Department: ${user.dept}`;
        document.getElementById('profile-completion').textContent = `Completion: ${user.completion}%`;
        document.getElementById('profile-points').textContent = `Points: ${user.points}`;
        document.getElementById('profile-streak').textContent = `Current Streak: ${currentCompany.streak}`;

        const badgesList = document.getElementById('badges-list');
        badgesList.innerHTML = '';
        const badges = getBadges(user);
        if (badges.length === 0) {
            badgesList.innerHTML = '<li>No badges yet—keep training!</li>';
        } else {
            badges.forEach(badge => {
                const li = document.createElement('li');
                li.textContent = badge;
                badgesList.appendChild(li);
            });
        }
    }
}

function getBadges(user) {
    const badges = [];
    if (user.quizCompleted === questions.length) badges.push('🏆 Quiz Master: Completed all quizzes!');
    if (user.phishingCompleted === phishingEmails.length) badges.push('🎣 Phishing Pro: Mastered all simulations!');
    if (currentCompany.streak >= 5) badges.push('🔥 Streak King: Achieved a streak of 5+!');
    if (user.completion === 100) badges.push('🌟 Cyber Hero: 100% completion!');
    return badges;
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

window.onload = () => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        const {company, index, developer} = JSON.parse(savedUser);
        currentCompany = companies[company];
        currentUserIndex = index;
        isDeveloperMode = developer || false;
        document.getElementById('landing').hidden = true;
        document.getElementById('login').style.display = 'none';
        document.querySelector('header').hidden = false;
        document.querySelector('nav').hidden = false;
        document.querySelector('main').hidden = false;
        document.querySelector('footer').hidden = false;
        applyCompanyTheme();
        showSection('dashboard');
    }
};
