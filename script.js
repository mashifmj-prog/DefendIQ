// === Data ===
const defendiq = {
    name: "DefendIQ",
    primaryColor: "#004d40",
    secondaryColor: "#26a69a",
    logo: "logos/defendiq-logo.png",
    tips: [
        "Verify email senders before clicking links.",
        "Use strong, unique passwords for all accounts.",
        "Enable two-factor authentication (2FA) where possible."
    ],
    employees: [
        {
            name: "Alice Smith",
            dept: "IT",
            completion: 90,
            points: 200,
            quizCompleted: { Deepfake: 0, Reporting: 0, Culture: 0 },
            phishingCompleted: 0,
            passwordCompleted: 0
        },
        {
            name: "Bob Johnson",
            dept: "HR",
            completion: 70,
            points: 150,
            quizCompleted: { Deepfake: 0, Reporting: 0, Culture: 0 },
            phishingCompleted: 0,
            passwordCompleted: 0
        },
        {
            name: "Fiona Green",
            dept: "Sales",
            completion: 85,
            points: 180,
            quizCompleted: { Deepfake: 0, Reporting: 0, Culture: 0 },
            phishingCompleted: 0,
            passwordCompleted: 0
        },
        {
            name: "Kyle Lane",
            dept: "Engineering",
            completion: 65,
            points: 140,
            quizCompleted: { Deepfake: 0, Reporting: 0, Culture: 0 },
            phishingCompleted: 0,
            passwordCompleted: 0
        },
        {
            name: "Emma Brown",
            dept: "IT",
            completion: 95,
            points: 220,
            quizCompleted: { Deepfake: 0, Reporting: 0, Culture: 0 },
            phishingCompleted: 0,
            passwordCompleted: 0
        },
        {
            name: "Liam Carter",
            dept: "Sales",
            completion: 75,
            points: 160,
            quizCompleted: { Deepfake: 0, Reporting: 0, Culture: 0 },
            phishingCompleted: 0,
            passwordCompleted: 0
        }
    ],
    streak: 0,
    streakHistory: [0, 1, 2, 0, 3]
};

const questions = {
    Deepfake: [
        {
            question: "What is a deepfake?",
            options: ["Encryption", "AI-generated fake media", "Malware", "Firewall"],
            correct: 1,
            explanation: "Deepfakes use AI to create realistic fake videos or audio."
        },
        {
            question: "How can you spot a deepfake?",
            options: ["Unnatural movements", "High-resolution graphics", "File size", "Fast loading"],
            correct: 0,
            explanation: "Look for unnatural blinks or lip-sync issues."
        },
        {
            question: "How are deepfakes used in cyberattacks?",
            options: ["Encrypt data", "Impersonate executives", "Speed up downloads", "Block ads"],
            correct: 1,
            explanation: "Deepfakes can impersonate leaders to trick employees."
        },
        {
            question: "What technology powers deepfakes?",
            options: ["Blockchain", "Machine learning", "Antivirus", "Compression"],
            correct: 1,
            explanation: "Machine learning, like neural networks, creates deepfakes."
        },
        {
            question: "Best defense against deepfakes?",
            options: ["Update software", "Verify identity", "Use VPN", "Clear cache"],
            correct: 1,
            explanation: "Verifying identity via trusted channels prevents deception."
        }
    ],
    Reporting: [
        {
            question: "What should you do if you suspect a breach?",
            options: ["Ignore it", "Report to IT immediately", "Share on social media", "Reboot system"],
            correct: 1,
            explanation: "Quick reporting mitigates risks."
        },
        {
            question: "Who should you contact about a phishing email?",
            options: ["Your manager", "IT team", "The sender", "HR"],
            correct: 1,
            explanation: "IT teams handle phishing investigations."
        },
        {
            question: "What’s considered a security incident?",
            options: ["A team meeting", "Unauthorized access", "Software update", "New hire"],
            correct: 1,
            explanation: "Unauthorized access compromises systems."
        },
        {
            question: "When should you report a suspicious email?",
            options: ["After replying", "Immediately", "Next day", "After clicking links"],
            correct: 1,
            explanation: "Immediate reporting prevents further damage."
        },
        {
            question: "What’s a key part of incident reporting?",
            options: ["Deleting emails", "Providing details", "Changing passwords", "Logging out"],
            correct: 1,
            explanation: "Detailed reports help IT investigate effectively."
        }
    ],
    Culture: [
        {
            question: "What builds a strong cybersecurity culture?",
            options: ["Ignoring policies", "Regular training", "Sharing passwords", "Using public Wi-Fi"],
            correct: 1,
            explanation: "Regular training fosters awareness."
        },
        {
            question: "How can employees contribute to security?",
            options: ["Bypass protocols", "Report suspicious activity", "Use personal devices", "Disable updates"],
            correct: 1,
            explanation: "Reporting strengthens security."
        },
        {
            question: "What’s a sign of a weak security culture?",
            options: ["Regular training", "Ignoring policies", "Strong passwords", "2FA use"],
            correct: 1,
            explanation: "Ignoring policies weakens security."
        },
        {
            question: "Why is a security culture important?",
            options: ["Reduces costs", "Prevents breaches", "Speeds up work", "Simplifies tasks"],
            correct: 1,
            explanation: "A strong culture helps prevent breaches."
        },
        {
            question: "What encourages a security culture?",
            options: ["Open communication", "Ignoring alerts", "Sharing logins", "Skipping training"],
            correct: 0,
            explanation: "Open communication promotes vigilance."
        }
    ]
};

const phishingEmails = [
    {
        subject: "Urgent: Account Issue",
        sender: "admin@bank.com",
        body: "Verify your identity now or your account will be locked.",
        correct: false
    },
    {
        subject: "Team Meeting",
        sender: "manager@company.com",
        body: "Please review the agenda for tomorrow’s meeting.",
        correct: true
    },
    {
        subject: "Free iPhone!",
        sender: "promo@apple.com",
        body: "Claim your free iPhone now!",
        correct: false
    },
    {
        subject: "Expense Report",
        sender: "finance@company.com",
        body: "Please confirm approval of your expense report.",
        correct: true
    },
    {
        subject: "Password Reset",
        sender: "support@netflix.com",
        body: "Click to update your password immediately.",
        correct: false
    }
];

const passwordQuestions = [
    {
        question: "What makes a password strong?",
        options: ["Short and simple", "At least 12 characters, mixed case, numbers, symbols", "Your name", "Reused across sites"],
        correct: 1,
        explanation: "Strong passwords are long and complex, with diverse characters."
    },
    {
        question: "What’s a risky password practice?",
        options: ["Using a password manager", "Writing passwords down", "Using unique passwords", "Enabling 2FA"],
        correct: 1,
        explanation: "Writing passwords down risks exposure."
    },
    {
        question: "How often should you change passwords?",
        options: ["Never", "Every 3-6 months", "Daily", "Only if short"],
        correct: 1,
        explanation: "Change passwords periodically, especially after a breach."
    },
    {
        question: "Which is a secure password example?",
        options: ["password123", "MyDog2023", "X7$kPq9mW#2vL8", "123456"],
        correct: 2,
        explanation: "Secure passwords are random and complex, like X7$kPq9mW#2vL8."
    },
    {
        question: "What should you avoid in passwords?",
        options: ["Symbols", "Personal info like birthdays", "Numbers", "Mixed case"],
        correct: 1,
        explanation: "Avoid personal info to prevent easy guessing."
    }
];

// === State Variables ===
let currentUser = 0; // Index of current employee (e.g., 0 = Alice Smith)
let phishingIndex = 0; // Current phishing email index
let questionIndex = 0; // Current quiz question index
let passwordIndex = 0; // Current password question index
let currentTest = "Deepfake"; // Current quiz test
let deptChart = null; // Chart.js instance for department completion
let pointsPie = null; // Chart.js instance for points pie chart
let streakChart = null; // Chart.js instance for streak trend
let deptPointsChart = null; // Chart.js instance for department points
const phrases = ["Great job! 🚀", "Awesome! 🌟", "Well done! 👏"]; // Feedback phrases

// === App Control ===
function startApp() {
    try {
        console.log("Starting app: DefendIQ");
        document.getElementById("landing").hidden = true;
        document.querySelector("header").hidden = false;
        document.querySelector("nav").hidden = false;
        document.querySelector("main").hidden = false;
        document.querySelector("footer").hidden = false;
        applyTheme();
        showSection("dashboard");
    } catch (error) {
        console.error("startApp error:", error);
        alert("Error starting app. Please refresh.");
    }
}

function logout() {
    try {
        currentUser = 0;
        phishingIndex = 0;
        questionIndex = 0;
        passwordIndex = 0;
        currentTest = "Deepfake";
        document.getElementById("landing").hidden = false;
        document.querySelector("header").hidden = true;
        document.querySelector("nav").hidden = true;
        document.querySelector("main").hidden = false;
        document.querySelector("footer").hidden = true;
        document.getElementById("landing-title").textContent = "🛡️ DefendIQ";
        console.log("Logged out");
    } catch (error) {
        console.error("logout error:", error);
    }
}

function applyTheme() {
    try {
        document.documentElement.style.setProperty("--primary-color", defendiq.primaryColor);
        document.documentElement.style.setProperty("--secondary-color", defendiq.secondaryColor);
        document.getElementById("logo").src = defendiq.logo;
        document.getElementById("app-title").textContent = "🛡️ DefendIQ";
        document.getElementById("footer-text").textContent = "DefendIQ – Cybersecurity Training";
        document.getElementById("test-select").value = currentTest;
        loadDashboard();
        loadLeaderboard();
        loadTips();
        loadQuiz();
        loadPhishing();
        loadPassword();
    } catch (error) {
        console.error("applyTheme error:", error);
    }
}

function showSection(sectionId) {
    try {
        document.querySelectorAll("main > section").forEach(section => section.hidden = true);
        document.getElementById(sectionId).hidden = false;
        if (sectionId === "dashboard") loadDashboard();
        if (sectionId === "leaderboard") loadLeaderboard();
        if (sectionId === "quiz") loadQuiz();
        if (sectionId === "phishing") loadPhishing();
        if (sectionId === "password") loadPassword();
        if (sectionId === "tips") loadTips();
        if (sectionId === "analytics") loadAnalytics();
        if (sectionId === "profile") loadProfile();
    } catch (error) {
        console.error("showSection error:", error);
    }
}

// === Dashboard ===
function loadDashboard() {
    try {
        document.getElementById("streak").textContent = defendiq.streak;
        const lowPerformers = defendiq.employees.filter(emp => emp.completion < 60);
        const lowList = document.getElementById("low-performers");
        lowList.innerHTML = lowPerformers.length === 0 ? "<li>No low performers!</li>" : "";
        lowPerformers.forEach(emp => {
            const li = document.createElement("li");
            li.textContent = `${emp.name} (${emp.dept}): ${emp.completion}%`;
            lowList.appendChild(li);
        });
        const totalCompletion = defendiq.employees.reduce((sum, emp) => sum + emp.completion, 0);
        const avgCompletion = (totalCompletion / defendiq.employees.length).toFixed(0);
        document.getElementById("avg-completion").textContent = `${avgCompletion}%`;
        const totalPoints = defendiq.employees.reduce((sum, emp) => sum + emp.points, 0);
        const avgPoints = (totalPoints / defendiq.employees.length).toFixed(0);
        document.getElementById("avg-points").textContent = avgPoints;
        const sortedEmployees = [...defendiq.employees].sort((a, b) => b.points - a.points);
        const top3List = document.getElementById("top3");
        top3List.innerHTML = "";
        sortedEmployees.slice(0, 3).forEach(emp => {
            const li = document.createElement("li");
            li.textContent = `${emp.name}: ${emp.points} points`;
            top3List.appendChild(li);
        });
        loadCharts();
    } catch (error) {
        console.error("loadDashboard error:", error);
    }
}

function loadCharts() {
    try {
        if (deptChart) deptChart.destroy();
        if (pointsPie) pointsPie.destroy();
        const depts = {};
        defendiq.employees.forEach(emp => {
            if (!depts[emp.dept]) depts[emp.dept] = { completion: [], points: 0 };
            depts[emp.dept].completion.push(emp.completion);
            depts[emp.dept].points += emp.points;
        });
        const labels = Object.keys(depts);
        const avgCompletions = labels.map(dept => 
            depts[dept].completion.reduce((sum, c) => sum + c, 0) / depts[dept].completion.length
        );
        const deptPoints = labels.map(dept => depts[dept].points);
        const ctx = document.getElementById("dept-chart").getContext("2d");
        deptChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{ label: "Avg Completion %", data: avgCompletions, backgroundColor: defendiq.secondaryColor }]
            },
            options: { scales: { y: { beginAtZero: true } }, responsive: true, maintainAspectRatio: false }
        });
        const pieCtx = document.getElementById("points-pie").getContext("2d");
        pointsPie = new Chart(pieCtx, {
            type: "pie",
            data: {
                labels: labels,
                datasets: [{ data: deptPoints, backgroundColor: [defendiq.primaryColor, defendiq.secondaryColor, "#ccc"] }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    } catch (error) {
        console.error("loadCharts error:", error);
    }
}

// === Leaderboard ===
function loadLeaderboard() {
    try {
        const sortedEmployees = [...defendiq.employees].sort(
            (a, b) => (b.completion + b.points) - (a.completion + a.points)
        );
        const leaderboardList = document.getElementById("leaderboard-list");
        leaderboardList.innerHTML = "";
        const badges = ["🥇", "🥈", "🥉"];
        sortedEmployees.forEach((emp, index) => {
            const li = document.createElement("li");
            const badge = index < 3 ? badges[index] + " " : "";
            li.textContent = `#${index + 1} ${badge}${emp.name} (${emp.dept}): ${emp.completion}% completion, ${emp.points} points`;
            if (index < 3) li.style.fontWeight = "bold";
            leaderboardList.appendChild(li);
        });
    } catch (error) {
        console.error("loadLeaderboard error:", error);
    }
}

// === Quiz ===
function changeTest(test) {
    try {
        currentTest = test;
        questionIndex = 0;
        loadQuiz();
    } catch (error) {
        console.error("changeTest error:", error);
    }
}

function loadQuiz() {
    try {
        const user = defendiq.employees[currentUser];
        if (user.quizCompleted[currentTest] >= questions[currentTest].length) {
            document.getElementById("quiz-question").textContent = `${currentTest} Completed!`;
            document.getElementById("quiz-options").innerHTML = "";
            document.getElementById("quiz-feedback").textContent = 
                `🎉 ${currentTest} done! Check Profile for certificate.`;
            return;
        }
        const question = questions[currentTest][questionIndex % questions[currentTest].length];
        document.getElementById("quiz-question").textContent = question.question;
        const optionsDiv = document.getElementById("quiz-options");
        optionsDiv.innerHTML = "";
        question.options.forEach((option, index) => {
            const label = document.createElement("label");
            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "quiz-answer";
            radio.value = index;
            label.appendChild(radio);
            label.appendChild(document.createTextNode(option));
            optionsDiv.appendChild(label);
        });
        document.getElementById("quiz-feedback").textContent = "";
        updateQuizProgress();
    } catch (error) {
        console.error("loadQuiz error:", error);
    }
}

function updateQuizProgress() {
    try {
        const user = defendiq.employees[currentUser];
        const progress = (user.quizCompleted[currentTest] / questions[currentTest].length) * 100;
        document.getElementById("quiz-progress-text").textContent = 
            `${progress.toFixed(0)}% (${user.quizCompleted[currentTest]}/${questions[currentTest].length})`;
        document.getElementById("quiz-progress-bar").style.width = `${progress}%`;
    } catch (error) {
        console.error("updateQuizProgress error:", error);
    }
}

function submitQuiz() {
    try {
        const user = defendiq.employees[currentUser];
        if (user.quizCompleted[currentTest] >= questions[currentTest].length) {
            showSection("profile");
            return;
        }
        const selected = document.querySelector('input[name="quiz-answer"]:checked');
        if (!selected) return alert("Please select an answer!");
        const question = questions[currentTest][questionIndex % questions[currentTest].length];
        const isCorrect = parseInt(selected.value) === question.correct;
        const feedback = document.getElementById("quiz-feedback");
        const selectedAnswer = question.options[parseInt(selected.value)];
        const phrase = phrases[Math.floor(Math.random() * phrases.length)];
        if (isCorrect) {
            feedback.textContent = 
                `${phrase} Correct! "${selectedAnswer}" is right. ${question.explanation} +10 pts, +5% comp.`;
            user.points += 10;
            user.completion = Math.min(100, user.completion + 5);
            user.quizCompleted[currentTest] = Math.min(
                questions[currentTest].length, 
                user.quizCompleted[currentTest] + 1
            );
            defendiq.streak += 1;
            defendiq.streakHistory.push(defendiq.streak);
            if (user.quizCompleted[currentTest] >= questions[currentTest].length) {
                feedback.textContent = `🎉 ${currentTest} done! Check Profile for certificate.`;
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                showSection("profile");
            }
        } else {
            feedback.textContent = 
                `Oops! Wrong. You chose "${selectedAnswer}", but it's "${question.options[question.correct]}". ${question.explanation} Streak reset.`;
            defendiq.streak = 0;
        }
        questionIndex++;
        loadQuiz();
        loadDashboard();
        loadLeaderboard();
    } catch (error) {
        console.error("submitQuiz error:", error);
    }
}

// === Phishing Simulation ===
function loadPhishing() {
    try {
        const email = phishingEmails[phishingIndex % phishingEmails.length];
        const container = document.getElementById("phishingContainer");
        container.innerHTML = `
            <p><strong>From:</strong> ${email.sender}</p>
            <p><strong>Subject:</strong> ${email.subject}</p>
            <p><strong>Body:</strong> ${email.body}</p>
        `;
        document.getElementById("phishing-feedback").textContent = "";
        updatePhishingProgress();
    } catch (error) {
        console.error("loadPhishing error:", error);
    }
}

function updatePhishingProgress() {
    try {
        const user = defendiq.employees[currentUser];
        const progress = (user.phishingCompleted / phishingEmails.length) * 100;
        document.getElementById("phishing-progress-text").textContent = 
            `${progress.toFixed(0)}% (${user.phishingCompleted}/${phishingEmails.length})`;
        document.getElementById("phishing-progress-bar").style.width = `${progress}%`;
    } catch (error) {
        console.error("updatePhishingProgress error:", error);
    }
}

function submitPhishing(isSafe) {
    try {
        const email = phishingEmails[phishingIndex % phishingEmails.length];
        const isCorrect = email.correct === isSafe;
        const feedback = document.getElementById("phishing-feedback");
        const action = isSafe ? "Safe" : "Phishing";
        const phrase = phrases[Math.floor(Math.random() * phrases.length)];
        const correctAction = email.correct ? "Safe" : "Phishing";
        if (isCorrect) {
            feedback.textContent = 
                `${phrase} Correct! Marked as ${action}. Tip: Always check sender domain. +10 pts, +5% comp.`;
            defendiq.employees[currentUser].points += 10;
            defendiq.employees[currentUser].completion = 
                Math.min(100, defendiq.employees[currentUser].completion + 5);
            defendiq.employees[currentUser].phishingCompleted = 
                Math.min(phishingEmails.length, defendiq.employees[currentUser].phishingCompleted + 1);
            defendiq.streak += 1;
            defendiq.streakHistory.push(defendiq.streak);
        } else {
            feedback.textContent = 
                `Wrong! Marked as ${action}, but it's ${correctAction}. Tip: Watch for urgent language. Streak reset.`;
            defendiq.streak = 0;
        }
        phishingIndex++;
        loadPhishing();
        loadDashboard();
        loadLeaderboard();
    } catch (error) {
        console.error("submitPhishing error:", error);
    }
}

// === Password Training ===
function loadPassword() {
    try {
        const user = defendiq.employees[currentUser];
        if (user.passwordCompleted >= passwordQuestions.length) {
            document.getElementById("password-question").textContent = "Password Training Completed!";
            document.getElementById("password-options").innerHTML = "";
            document.getElementById("password-feedback").textContent = 
                `🎉 Password Training done! Check Profile for certificate.`;
            return;
        }
        const question = passwordQuestions[passwordIndex % passwordQuestions.length];
        document.getElementById("password-question").textContent = question.question;
        const optionsDiv = document.getElementById("password-options");
        optionsDiv.innerHTML = "";
        question.options.forEach((option, index) => {
            const label = document.createElement("label");
            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "password-answer";
            radio.value = index;
            label.appendChild(radio);
            label.appendChild(document.createTextNode(option));
            optionsDiv.appendChild(label);
        });
        document.getElementById("password-feedback").textContent = "";
        updatePasswordProgress();
    } catch (error) {
        console.error("loadPassword error:", error);
    }
}

function updatePasswordProgress() {
    try {
        const user = defendiq.employees[currentUser];
        const progress = (user.passwordCompleted / passwordQuestions.length) * 100;
        document.getElementById("password-progress-text").textContent = 
            `${progress.toFixed(0)}% (${user.passwordCompleted}/${passwordQuestions.length})`;
        document.getElementById("password-progress-bar").style.width = `${progress}%`;
    } catch (error) {
        console.error("updatePasswordProgress error:", error);
    }
}

function submitPassword() {
    try {
        const user = defendiq.employees[currentUser];
        if (user.passwordCompleted >= passwordQuestions.length) {
            showSection("profile");
            return;
        }
        const selected = document.querySelector('input[name="password-answer"]:checked');
        if (!selected) return alert("Please select an answer!");
        const question = passwordQuestions[passwordIndex % passwordQuestions.length];
        const isCorrect = parseInt(selected.value) === question.correct;
        const feedback = document.getElementById("password-feedback");
        const selectedAnswer = question.options[parseInt(selected.value)];
        const phrase = phrases[Math.floor(Math.random() * phrases.length)];
        if (isCorrect) {
            feedback.textContent = 
                `${phrase} Correct! "${selectedAnswer}" is right. ${question.explanation} +10 pts, +5% comp.`;
            user.points += 10;
            user.completion = Math.min(100, user.completion + 5);
            user.passwordCompleted = Math.min(
                passwordQuestions.length, 
                user.passwordCompleted + 1
            );
            defendiq.streak += 1;
            defendiq.streakHistory.push(defendiq.streak);
            if (user.passwordCompleted >= passwordQuestions.length) {
                feedback.textContent = `🎉 Password Training done! Check Profile for certificate.`;
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                showSection("profile");
            }
        } else {
            feedback.textContent = 
                `Oops! Wrong. You chose "${selectedAnswer}", but it's "${question.options[question.correct]}". ${question.explanation} Streak reset.`;
            defendiq.streak = 0;
        }
        passwordIndex++;
        loadPassword();
        loadDashboard();
        loadLeaderboard();
    } catch (error) {
        console.error("submitPassword error:", error);
    }
}

// === Security Tips ===
function loadTips() {
    try {
        const tipsList = document.getElementById("tips-list");
        tipsList.innerHTML = "";
        defendiq.tips.forEach(tip => {
            const li = document.createElement("li");
            li.textContent = tip;
            tipsList.appendChild(li);
        });
    } catch (error) {
        console.error("loadTips error:", error);
    }
}

// === Analytics ===
function loadAnalytics() {
    try {
        const totalQuizzes = defendiq.employees.reduce(
            (sum, emp) => sum + Object.values(emp.quizCompleted).reduce((s, c) => s + c, 0), 0
        );
        document.getElementById("total-quizzes").textContent = totalQuizzes;
        const totalPhishing = defendiq.employees.reduce((sum, emp) => sum + emp.phishingCompleted, 0);
        document.getElementById("total-phishing").textContent = totalPhishing;
        const totalPassword = defendiq.employees.reduce((sum, emp) => sum + emp.passwordCompleted, 0);
        document.getElementById("total-password").textContent = totalPassword;
        if (streakChart) streakChart.destroy();
        const ctx = document.getElementById("streak-trend").getContext("2d");
        streakChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: defendiq.streakHistory.map((_, i) => `Session ${i + 1}`),
                datasets: [{ label: "Streak Trend", data: defendiq.streakHistory, borderColor: defendiq.primaryColor, fill: false }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
        if (deptPointsChart) deptPointsChart.destroy();
        const depts = {};
        defendiq.employees.forEach(emp => {
            if (!depts[emp.dept]) depts[emp.dept] = 0;
            depts[emp.dept] += emp.points / defendiq.employees.filter(e => e.dept === emp.dept).length;
        });
        const labels = Object.keys(depts);
        const avgPoints = labels.map(dept => depts[dept]);
        const ctx2 = document.getElementById("dept-points-bar").getContext("2d");
        deptPointsChart = new Chart(ctx2, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{ label: "Avg Points per Dept", data: avgPoints, backgroundColor: defendiq.secondaryColor }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    } catch (error) {
        console.error("loadAnalytics error:", error);
    }
}

// === Profile and Certificates ===
function loadProfile() {
    try {
        const user = defendiq.employees[currentUser];
        document.getElementById("profile-name").textContent = `Name: ${user.name}`;
        document.getElementById("profile-dept").textContent = `Department: ${user.dept}`;
        document.getElementById("profile-completion").textContent = `Completion: ${user.completion}%`;
        document.getElementById("profile-points").textContent = `Points: ${user.points}`;
        document.getElementById("profile-streak").textContent = `Current Streak: ${defendiq.streak}`;
        const badgesList = document.getElementById("badges-list");
        badgesList.innerHTML = "";
        const badges = getBadges(user);
        badges.length === 0 
            ? badgesList.innerHTML = "<li>No badges yet!</li>" 
            : badges.forEach(badge => {
                const li = document.createElement("li");
                li.textContent = badge;
                badgesList.appendChild(li);
            });
        const certButtons = document.getElementById("certificate-buttons");
        certButtons.innerHTML = "";
        const completedTests = Object.keys(user.quizCompleted).filter(
            test => user.quizCompleted[test] >= questions[test].length
        );
        if (user.passwordCompleted >= passwordQuestions.length) {
            completedTests.push("Password");
        }
        document.getElementById("certificate-card").hidden = completedTests.length === 0;
        completedTests.forEach(test => {
            const button = document.createElement("button");
            button.textContent = `Download ${test} Certificate`;
            button.onclick = () => downloadCertificate(test);
            certButtons.appendChild(button);
        });
    } catch (error) {
        console.error("loadProfile error:", error);
    }
}

function getBadges(user) {
    try {
        const badges = [];
        if (user.quizCompleted.Deepfake === questions.Deepfake.length) badges.push("🎥 Deepfake Defender");
        if (user.quizCompleted.Reporting === questions.Reporting.length) badges.push("🚨 Incident Reporter");
        if (user.quizCompleted.Culture === questions.Culture.length) badges.push("🏛️ Culture Champion");
        if (user.phishingCompleted === phishingEmails.length) badges.push("🎣 Phishing Pro");
        if (user.passwordCompleted === passwordQuestions.length) badges.push("🔒 Password Master");
        if (defendiq.streak >= 5) badges.push("🔥 Streak King");
        if (user.completion === 100) badges.push("🌟 Cyber Hero");
        return badges;
    } catch (error) {
        console.error("getBadges error:", error);
        return [];
    }
}

function downloadCertificate(test) {
    try {
        const user = defendiq.employees[currentUser];
        const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
        const safeUserName = user.name.replace(/([&%$#_{}])/g, "\\$1");
        const safeTest = test.replace(/([&%$#_{}])/g, "\\$1");
        const latex = `
\\documentclass[a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\usepackage{mathpazo}
\\usepackage{fancyhdr}
\\usepackage{tikz}
\\usepackage{xcolor}
\\geometry{margin=0.75in}
\\definecolor{primarycolor}{RGB}{0,77,64}
\\definecolor{secondarycolor}{RGB}{38,166,154}
\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[C]{\\color{primarycolor}\\textbf{DefendIQ Cybersecurity Training}}
\\fancyfoot[C]{\\color{primarycolor}\\small Issued by DefendIQ}
\\begin{document}
\\begin{center}
\\begin{tikzpicture}
\\draw[line width=2pt,primarycolor] (0,0) rectangle (\\paperwidth-1in,\\paperheight-1in);
\\draw[line width=1pt,secondarycolor] (0.2in,0.2in) rectangle (\\paperwidth-1.2in,\\paperheight-1.2in);
\\node at (0.5,0.5) {\\color{secondarycolor}\\large \\textbf{\\char"1F6E1}};
\\node at (\\paperwidth-1in,\\paperheight-1in) {\\color{secondarycolor}\\large \\textbf{\\char"1F6E1}};
\\node at (0.5,\\paperheight-1in) {\\color{secondarycolor}\\large \\textbf{\\char"1F6E1}};
\\node at (\\paperwidth-1in,0.5) {\\color{secondarycolor}\\large \\textbf{\\char"1F6E1}};
\\end{tikzpicture}
\\vspace{1cm}
{\\color{primarycolor}\\Huge \\textbf{Certificate of Completion}}\\\\
\\vspace{0.5cm}
{\\color{secondarycolor}\\Large ${safeTest} Training}\\\\
\\vspace{1cm}
This certifies that\\\\
{\\color{primarycolor}\\Huge \\textbf{${safeUserName}}}\\\\
has successfully completed the training at\\\\
{\\color{primarycolor}\\Large \\textbf{DefendIQ}}\\\\
on ${date}.\\\\
\\vspace{1cm}
{\\color{secondarycolor}\\large \\textbf{Congratulations on your achievement!}}\\\\
\\vspace{0.5cm}
\\begin{tikzpicture}
\\draw[line width=1pt,secondarycolor] (0,0) -- (5,0);
\\node at (2.5,0.3) {\\color{primarycolor}\\small Program Director};
\\end{tikzpicture}
\\end{center}
\\end{document}
        `.trim();
        const blob = new Blob([latex], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${user.name}_${test.replace(/\s+/g, "_")}_Certificate.tex`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("downloadCertificate error:", error);
        alert("Error generating certificate. Please try again.");
    }
}

// === Export ===
function exportCSV() {
    try {
        let csv = "data:text/csv;charset=utf-8,Name,Dept,Completion,Points\n";
        defendiq.employees.forEach(emp => {
            csv += `${emp.name},${emp.dept},${emp.completion},${emp.points}\n`;
        });
        const uri = encodeURI(csv);
        const link = document.createElement("a");
        link.setAttribute("href", uri);
        link.setAttribute("download", "DefendIQ_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("exportCSV error:", error);
    }
}
