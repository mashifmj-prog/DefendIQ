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
            {name: "Alice Smith", dept: "IT", completion: 90, points: 200, quizCompleted: {"Deepfake Awareness": 0, "Reporting Security Incidents": 0, "Culture Survey": 0, "Social Engineering": 0, "General Cybersecurity": 0}, phishingCompleted: 0},
            {name: "Bob Johnson", dept: "HR", completion: 70, points: 150, quizCompleted: {"Deepfake Awareness": 0, "Reporting Security Incidents": 0, "Culture Survey": 0, "Social Engineering": 0, "General Cybersecurity": 0}, phishingCompleted: 0},
            {name: "Charlie Lee", dept: "Finance", completion: 50, points: 100, quizCompleted: {"Deepfake Awareness": 0, "Reporting Security Incidents": 0, "Culture Survey": 0, "Social Engineering": 0, "General Cybersecurity": 0}, phishingCompleted: 0},
            {name: "Dana Kim", dept: "IT", completion: 85, points: 180, quizCompleted: {"Deepfake Awareness": 0, "Reporting Security Incidents": 0, "Culture Survey": 0, "Social Engineering": 0, "General Cybersecurity": 0}, phishingCompleted: 0},
            {name: "Evan Patel", dept: "HR", completion: 60, points: 120, quizCompleted: {"Deepfake Awareness": 0, "Reporting Security Incidents": 0, "Culture Survey": 0, "Social Engineering": 0, "General Cybersecurity": 0}, phishingCompleted: 0}
        ],
        streak: 0,
        streakHistory: [0, 1, 2]
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
            {name: "Fiona Green", dept: "Sales", completion: 95, points: 220, quizCompleted: {"Deepfake Awareness": 0, "Reporting Security Incidents": 0, "Culture Survey": 0, "Social Engineering": 0, "General Cybersecurity": 0}, phishingCompleted: 0},
            {name: "George Harris", dept: "Marketing", completion: 80, points: 160, quizCompleted: {"Deepfake Awareness": 0, "Reporting Security Incidents": 0, "Culture Survey": 0, "Social Engineering": 0, "General Cybersecurity": 0}, phishingCompleted: 0},
            {name: "Hannah Ivy", dept: "Sales", completion: 55, points: 110, quizCompleted: {"Deepfake Awareness": 0, "Reporting Security Incidents": 0, "Culture Survey": 0, "Social Engineering": 0, "General Cybersecurity": 0}, phishingCompleted: 0},
            {name: "Ian Jones", dept: "Marketing", completion: 75, points: 140, quizCompleted: {"Deepfake Awareness": 0, "Reporting Security Incidents": 0, "Culture Survey": 0, "Social Engineering": 0, "General Cybersecurity": 0}, phishingCompleted: 0},
            {name: "Jill King", dept: "Operations", completion: 65, points: 130, quizCompleted: {"Deepfake Awareness": 0, "Reporting Security Incidents": 0, "Culture Survey": 0, "Social Engineering": 0, "General Cybersecurity": 0}, phishingCompleted: 0}
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
            {name: "Kyle Lane", dept: "Engineering", completion: 88, points: 190, quizCompleted: {"Deepfake Awareness": 0, "Reporting Security Incidents": 0, "Culture Survey": 0, "Social Engineering": 0, "General Cybersecurity": 0}, phishingCompleted: 0},
            {name: "Laura Miles", dept: "Support", completion: 72, points: 155, quizCompleted: {"Deepfake Awareness": 0, "Reporting Security Incidents": 0, "Culture Survey": 0, "Social Engineering": 0, "General Cybersecurity": 0}, phishingCompleted: 0},
            {name: "Mike Nolan", dept: "Engineering", completion: 45, points: 90, quizCompleted: {"Deepfake Awareness": 0, "Reporting Security Incidents": 0, "Culture Survey": 0, "Social Engineering": 0, "General Cybersecurity": 0}, phishingCompleted: 0},
            {name: "Nina Olsen", dept: "Support", completion: 82, points: 170, quizCompleted: {"Deepfake Awareness": 0, "Reporting Security Incidents": 0, "Culture Survey": 0, "Social Engineering": 0, "General Cybersecurity": 0}, phishingCompleted: 0},
            {name: "Oscar Pike", dept: "Admin", completion: 68, points: 135, quizCompleted: {"Deepfake Awareness": 0, "Reporting Security Incidents": 0, "Culture Survey": 0, "Social Engineering": 0, "General Cybersecurity": 0}, phishingCompleted: 0}
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

const questions = {
    "Deepfake Awareness": [
        {
            question: "What is a deepfake?",
            options: ["A secure encryption method", "AI-generated fake media", "A type of malware"],
            correct: 1,
            explanation: "Deepfakes use AI to create realistic but fake videos or audio, often for deception."
        },
        {
            question: "How can you spot a deepfake video?",
            options: ["Check for unnatural facial movements", "Look for high-resolution graphics", "Verify the file size"],
            correct: 0,
            explanation: "Deepfakes often have unnatural blinks or lip movements that can be spotted with close inspection."
        },
        {
            question: "What is a common use of deepfakes in cyberattacks?",
            options: ["Encrypting data", "Impersonating executives", "Speeding up downloads"],
            correct: 1,
            explanation: "Deepfakes can impersonate leaders to trick employees into sharing sensitive information."
        },
        {
            question: "How can you verify a suspicious video call?",
            options: ["Ask personal questions", "Record the call immediately", "Share your screen"],
            correct: 0,
            explanation: "Asking questions only the real person would know helps verify identity."
        },
        {
            question: "What tool can help detect deepfakes?",
            options: ["Antivirus software", "Deepfake detection software", "Web browser"],
            correct: 1,
            explanation: "Specialized software analyzes media for signs of AI manipulation."
        }
    ],
    "Reporting Security Incidents": [
        {
            question: "What should you do first if you suspect a security breach?",
            options: ["Ignore it", "Report to IT/security team", "Share on social media"],
            correct: 1,
            explanation: "Prompt reporting to IT/security ensures quick response to mitigate risks."
        },
        {
            question: "Who should you contact for a phishing email?",
            options: ["Your manager", "IT/security team", "The email sender"],
            correct: 1,
            explanation: "The IT/security team handles phishing reports to investigate and protect systems."
        },
        {
            question: "What is a security incident?",
            options: ["A team meeting", "Unauthorized access to systems", "A software update"],
            correct: 1,
            explanation: "Security incidents involve unauthorized actions that compromise data or systems."
        },
        {
            question: "Why is timely reporting important?",
            options: ["It delays response", "It limits damage", "It increases workload"],
            correct: 1,
            explanation: "Timely reporting allows quick action to contain and resolve incidents."
        },
        {
            question: "What should you include in an incident report?",
            options: ["Your favorite color", "Details of the event", "Your lunch order"],
            correct: 1,
            explanation: "Include specifics like time, nature of the incident, and evidence for clarity."
        }
    ],
    "Culture Survey": [
        {
            question: "What promotes a strong cybersecurity culture?",
            options: ["Ignoring policies", "Regular training", "Sharing passwords"],
            correct: 1,
            explanation: "Regular training educates employees to follow best practices."
        },
        {
            question: "How can employees contribute to security culture?",
            options: ["Bypass security protocols", "Report suspicious activity", "Use personal devices"],
            correct: 1,
            explanation: "Reporting suspicious activity strengthens organizational security."
        },
        {
            question: "What indicates a weak security culture?",
            options: ["Frequent training", "Ignoring security policies", "Strong passwords"],
            correct: 1,
            explanation: "Ignoring policies undermines security efforts."
        },
        {
            question: "Why is leadership important in security culture?",
            options: ["They set policies and tone", "They write code", "They avoid training"],
            correct: 0,
            explanation: "Leaders model behavior and enforce security policies."
        },
        {
            question: "What encourages employee vigilance?",
            options: ["Open communication", "Complex passwords", "Fewer meetings"],
            correct: 0,
            explanation: "Open communication fosters trust and encourages reporting."
        }
    ],
    "Social Engineering": [
        {
            question: "What is social engineering?",
            options: ["Manipulating people to divulge info", "Building social networks", "Engineering society"],
            correct: 0,
            explanation: "Social engineering manipulates users into revealing confidential data."
        },
        {
            question: "What is a common social engineering tactic?",
            options: ["Phishing emails", "Software updates", "Public Wi-Fi"],
            correct: 0,
            explanation: "Phishing emails trick users into sharing sensitive information."
        },
        {
            question: "How can you avoid social engineering?",
            options: ["Verify requests independently", "Click all links", "Share credentials"],
            correct: 0,
            explanation: "Independent verification prevents falling for deceptive requests."
        },
        {
            question: "What is pretexting?",
            options: ["Creating a fake scenario to gain trust", "Sending newsletters", "Encrypting data"],
            correct: 0,
            explanation: "Pretexting involves creating a false narrative to extract information."
        },
        {
            question: "What should you do if someone asks for your password?",
            options: ["Share it", "Report it", "Change it"],
            correct: 1,
            explanation: "Report requests for passwords as they are likely social engineering attempts."
        }
    ],
    "General Cybersecurity": [
        {
            question: "What does HTTPS indicate?",
            options: ["Secure connection", "High-speed internet", "Hyper text"],
            correct: 0,
            explanation: "HTTPS shows a secure, encrypted connection protecting your data."
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
            question: "What does VPN stand for?",
            options: ["Virtual Private Network", "Very Private Node", "Visual Protection Net"],
            correct: 0,
            explanation: "A VPN encrypts your internet traffic for privacy."
        },
        {
            question: "What is a firewall?",
            options: ["Network security system that monitors traffic", "A wall against fire", "A software for file sharing"],
            correct: 0,
            explanation: "Firewalls control network traffic based on security rules."
        }
    ]
};

let currentCompany = null;
let currentUserIndex = 0;
let phishingIndex = 0;
let quizIndex = 0;
let currentTest = "Deepfake Awareness";
let deptChart = null;
let pointsPie = null;
let streakChart = null;
let deptPointsChart = null;

const encouragementPhrases = ['Great job! 🚀', 'Awesome! 🌟', 'Well done! 👏', 'Keep it up! 💪', 'Nice catch! 🕵️'];

function updateCompany(companyName) {
    if (companyName) {
        currentCompany = companies[companyName];
        applyCompanyTheme();
    }
}

function startApp() {
    if (!document.getElementById('company-select-landing').value) {
        return alert('Please select a company.');
    }
    document.getElementById('landing').hidden = true;
    document.querySelector('header').hidden = false;
    document.querySelector('nav').hidden = false;
    document.querySelector('main').hidden = false;
    document.querySelector('footer').hidden = false;
    applyCompanyTheme();
    showSection('dashboard');
}

function logout() {
    currentCompany = null;
    currentUserIndex = 0;
    phishingIndex = 0;
    quizIndex = 0;
    currentTest = "Deepfake Awareness";
    document.getElementById('landing').hidden = false;
    document.querySelector('header').hidden = true;
    document.querySelector('nav').hidden = true;
    document.querySelector('main').hidden = true;
    document.querySelector('footer').hidden = true;
    document.getElementById('company-select-landing').value = '';
    document.getElementById('landing-title').textContent = '🛡️ DefendIQ';
}

function changeCompany(companyName) {
    currentCompany = companies[companyName];
    currentUserIndex = 0;
    quizIndex = 0;
    currentTest = "Deepfake Awareness";
    applyCompanyTheme();
}

function applyCompanyTheme() {
    if (!currentCompany) return;
    document.documentElement.style.setProperty('--primary-color', currentCompany.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', currentCompany.secondaryColor);
    document.getElementById('logo').src = currentCompany.logo;
    document.getElementById('app-title').textContent = `🛡️ DefendIQ — ${currentCompany.name}`;
    document.getElementById('footer-text').textContent = `DefendIQ – Trusted by Openserve, FiberLink & Gyro`;
    document.getElementById('company-select').value = currentCompany.name;
    document.getElementById('test-select').value = currentTest;
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

function changeTest(testName) {
    currentTest = testName;
    quizIndex = 0;
    loadQuiz();
}

function loadQuiz() {
    const user = currentCompany.employees[currentUserIndex];
    if (user.quizCompleted[currentTest] >= questions[currentTest].length) {
        document.getElementById('quiz-question').textContent = `${currentTest} Completed!`;
        document.getElementById('quiz-options').innerHTML = '';
        document.getElementById('quiz-feedback').textContent = `🎉 Congratulations! You’ve completed the ${currentTest} quiz! Check your Profile for your certificate and badge.`;
        return;
    }
    const q = questions[currentTest][quizIndex % questions[currentTest].length];
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
    const user = currentCompany.employees[currentUserIndex];
    const progress = (user.quizCompleted[currentTest] / questions[currentTest].length) * 100;
    document.getElementById('quiz-progress-text').textContent = `${progress.toFixed(0)}% (${user.quizCompleted[currentTest]}/${questions[currentTest].length})`;
    document.getElementById('quiz-progress-bar').style.width = `${progress}%`;
}

function submitQuiz() {
    const user = currentCompany.employees[currentUserIndex];
    if (user.quizCompleted[currentTest] >= questions[currentTest].length) {
        showSection('profile');
        return;
    }
    const selected = document.querySelector('input[name="quiz-answer"]:checked');
    if (!selected) return alert("Select an answer!");
    const q = questions[currentTest][quizIndex % questions[currentTest].length];
    const correct = parseInt(selected.value) === q.correct;
    const feedback = document.getElementById('quiz-feedback');
    const yourAnswer = q.options[parseInt(selected.value)];
    const randomPhrase = encouragementPhrases[Math.floor(Math.random() * encouragementPhrases.length)];
    if (correct) {
        feedback.textContent = `${randomPhrase} Correct! "${yourAnswer}" is right. ${q.explanation} +10 points, +5% completion.`;
        user.points += 10;
        user.completion = Math.min(100, user.completion + 5);
        user.quizCompleted[currentTest] = Math.min(questions[currentTest].length, user.quizCompleted[currentTest] + 1);
        currentCompany.streak += 1;
        currentCompany.streakHistory.push(currentCompany.streak);
        if (user.quizCompleted[currentTest] >= questions[currentTest].length) {
            feedback.textContent = `🎉 Congratulations! You’ve completed the ${currentTest} quiz! Check your Profile for your certificate and badge.`;
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            showSection('profile');
            return;
        }
    } else {
        feedback.textContent = `Oops! Incorrect. You chose "${yourAnswer}", but it's "${q.options[q.correct]}". ${q.explanation} Streak reset. Try again!`;
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
        <p><strong>Body:</strong> ${email.body}</p>
    `;
    document.getElementById('phishing-feedback').textContent = '';
    updatePhishingProgress();
}

function updatePhishingProgress() {
    const user = currentCompany.employees[currentUserIndex];
    const progress = (user.phishingCompleted / phishingEmails.length) * 100;
    document.getElementById('phishing-progress-text').textContent = `${progress.toFixed(0)}% (${user.phishingCompleted}/${phishingEmails.length})`;
    document.getElementById('phishing-progress-bar').style.width = `${progress}%`;
}

function submitPhishing(isSafe) {
    const email = phishingEmails[phishingIndex % phishingEmails.length];
    const correct = email.correct === isSafe;
    const feedback = document.getElementById('phishing-feedback');
    const yourAction = isSafe ? "Safe" : "Phishing";
    const randomPhrase = encouragementPhrases[Math.floor(Math.random
