// Elements
const startBtn = document.getElementById('start-training');
const landingPage = document.getElementById('landing-page');
const dashboard = document.getElementById('dashboard');
const homeBtn = document.getElementById('home-btn');
const moduleContent = document.getElementById('module-content');
const moduleSelect = document.getElementById('module-select');

// Stats
let streak = parseInt(localStorage.getItem('streak')) || 0;
let points = parseInt(localStorage.getItem('points')) || 0;
let completion = parseInt(localStorage.getItem('completion')) || 0;
let badges = JSON.parse(localStorage.getItem('badges')) || [];

// Update Stats
function updateStats(){
  document.getElementById('streak').textContent = streak;
  document.getElementById('points').textContent = points;
  document.getElementById('completion').textContent = completion + '%';
  document.getElementById('badges').textContent = badges.length ? badges.join(', ') : 'None';
}
updateStats();

// Start Training
startBtn.addEventListener('click', () => {
  landingPage.classList.add('hidden');
  dashboard.classList.remove('hidden');
});

// Home Button
homeBtn.addEventListener('click', () => {
  dashboard.classList.add('hidden');
  landingPage.classList.remove('hidden');
});

// Modules
const modules = {
  keymessage:[
    {question:"What is the company's key message?", options:["Security first","Profit first","Marketing focus","Customer first"], answer:"Security first"},
    {question:"Who is responsible for reporting threats?", options:["Only IT","All employees","Managers only","External contractors"], answer:"All employees"},
    {question:"How often should training be updated?", options:["Monthly","Quarterly","Yearly","Never"], answer:"Quarterly"},
    {question:"What is a phishing attempt?", options:["Email scam","Software bug","Network outage","HR memo"], answer:"Email scam"},
    {question:"Password complexity is important because?", options:["It improves memory","Reduces risk","Increases login speed","Reduces workload"], answer:"Reduces risk"},
    {question:"Multi-factor authentication helps?", options:["Confuse hackers","Increase security","Slow login","Track employees"], answer:"Increase security"},
    {question:"What is considered sensitive data?", options:["Public info","Customer data","Financial info","All of the above"], answer:"All of the above"},
    {question:"A strong password must include?", options:["Letters","Numbers","Special chars","All of the above"], answer:"All of the above"},
    {question:"Reporting incidents helps?", options:["Improve security","Reduce fines","Train hackers","Nothing"], answer:"Improve security"},
    {question:"Company security policy applies to?", options:["IT only","Everyone","Managers","Only interns"], answer:"Everyone"}
  ],
  deepfake:[
    {question:"What is a deepfake?", options:["Real video","Altered video","Text message","Email"], answer:"Altered video"},
    {question:"Deepfakes can be used for?", options:["Entertainment","Fraud","Education","All of the above"], answer:"All of the above"},
    {question:"How to verify media authenticity?", options:["Check sources","Ignore","Share","Guess"], answer:"Check sources"},
    {question:"A suspicious video should?", options:["Share immediately","Report it","Ignore it","Edit it"], answer:"Report it"},
    {question:"Deepfake detection is important because?", options:["Reduce trust issues","Increase entertainment","Annoy colleagues","None"], answer:"Reduce trust issues"},
    {question:"Deepfakes are created using?", options:["Photoshop","AI","Word","Excel"], answer:"AI"},
    {question:"Ethical use of AI requires?", options:["Consent","Ignore","Profit","Share publicly"], answer:"Consent"},
    {question:"Reporting fake content helps?", options:["Educate others","Confuse friends","Increase viral spread","None"], answer:"Educate others"},
    {question:"Recognizing deepfakes improves?", options:["Security","Marketing","HR tasks","Customer support"], answer:"Security"},
    {question:"Deepfake awareness prevents?", options:["Financial loss","Fame","Entertainment","Nothing"], answer:"Financial loss"}
  ],
  reporting:[
    {question:"Who should be notified of security incidents?", options:["Manager","IT","HR","All employees"], answer:"All employees"},
    {question:"What qualifies as a security incident?", options:["Lost device","Unauthorized access","Suspicious email","All of the above"], answer:"All of the above"},
    {question:"Immediate reporting reduces?", options:["Data breach impact","Workload","Fun","Meetings"], answer:"Data breach impact"},
    {question:"Reporting channels include?", options:["Email","Phone","Helpdesk","All of the above"], answer:"All of the above"},
    {question:"What info to include in a report?", options:["Time, date, details","Names only","Guess","None"], answer:"Time, date, details"},
    {question:"Follow-up is important to?", options:["Resolve issues","Ignore","Punish staff","Delay response"], answer:"Resolve issues"},
    {question:"Confidentiality during reporting is?", options:["Optional","Required","Never","Sometimes"], answer:"Required"},
    {question:"Security incident logs help?", options:["Audit & review","Entertainment","Delay response","Ignore"], answer:"Audit & review"},
    {question:"Reporting policy must be?", options:["Written","Verbal","Optional","Secret"], answer:"Written"},
    {question:"Training employees improves?", options:["Compliance","Workload","Fun","Confusion"], answer:"Compliance"}
  ],
  culture:[
    {question:"Company culture influences?", options:["Behavior","Values","Workplace atmosphere","All of the above"], answer:"All of the above"},
    {question:"Culture survey collects?", options:["Feedback","Passwords","Reports","None"], answer:"Feedback"},
    {question:"Surveys help to?", options:["Improve environment","Ignore","Annoy staff","Punish"], answer:"Improve environment"},
    {question:"Anonymous feedback ensures?", options:["Honesty","Fear","Confusion","Mistakes"], answer:"Honesty"},
    {question:"Survey participation improves?", options:["Engagement","Risk","Cost","Workload"], answer:"Engagement"},
    {question:"Culture assessment is for?", options:["HR","Everyone","IT","Security only"], answer:"Everyone"},
    {question:"Survey results are used for?", options:["Decision making","Punishment","Ignore","Fun"], answer:"Decision making"},
    {question:"Frequent surveys ensure?", options:["Updated feedback","Ignored feedback","Confused staff","Reduced risk"], answer:"Updated feedback"},
    {question:"Surveys must be?", options:["Voluntary","Mandatory","Secret","Optional"], answer:"Voluntary"},
    {question:"Employee suggestions improve?", options:["Processes","Nothing","Fun","Costs"], answer:"Processes"}
  ],
  social:[
    {question:"What is social engineering?", options:["Technical hacking","Psychological manipulation","Software bug","Spam email"], answer:"Psychological manipulation"},
    {question:"Phishing is?", options:["Email scam","Phone scam","Social engineering","All of the above"], answer:"All of the above"},
    {question:"Pretexting involves?", options:["False identity","True identity","Random guess","Ignore"], answer:"False identity"},
    {question:"Tailgating is?", options:["Following someone","Password guessing","Email spoofing","None"], answer:"Following someone"},
    {question:"Baiting is?", options:["Offering malware","Gift giving","Training","All"], answer:"Offering malware"},
    {question:"Quizzes help prevent?", options:["Attacks","Fun","Spam","Workload"], answer:"Attacks"},
    {question:"Awareness training reduces?", options:["Risk","Fun","Costs","Confusion"], answer:"Risk"},
    {question:"Reporting suspicious behavior helps?", options:["Security","Confusion","None","Marketing"], answer:"Security"},
    {question:"Social engineering targets?", options:["Humans","Systems","Devices","All"], answer:"Humans"},
    {question:"Education improves?", options:["Resistance","Confusion","Spam","Workload"], answer:"Resistance"}
  ]
};

// Dropdown selection
let currentModule = null;
let currentQuestion = 0;

moduleSelect.addEventListener('change', ()=>{
  const val = moduleSelect.value;
  if(val === 'exit'){
    moduleContent.innerHTML = `<p>DefendIQ: Your trusted partner in training</p>`;
    moduleSelect.value="";
    return;
  }
  loadModule(val);
});

// Load Module
function loadModule(moduleName){
  currentModule = modules[moduleName];
  currentQuestion = 0;
  renderQuestion();
}

// Render Question
function renderQuestion(){
  if(!currentModule) return;
  const q = currentModule[currentQuestion];

  let html = `
    <div class="question-card">
      <h3>${q.question}</h3>
      <div class="options">
        ${q.options.map(opt=>`<button onclick="selectOption('${opt}')">${opt}</button>`).join('')}
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar" style="width:${((currentQuestion+1)/currentModule.length)*100}%"></div>
      </div>
    </div>
  `;
  if(currentQuestion < currentModule.length-1){
    html += `<button class="next-btn" onclick="nextQuestion()">Next Question</button>`;
  }else{
    html += `<button class="next-btn" onclick="finishModule()">Finish Module</button>`;
  }
  html += `<button style="margin-top:10px;" onclick="closeModule()">Close Module</button>`;
  moduleContent.style.opacity=0;
  setTimeout(()=>{moduleContent.innerHTML=html;moduleContent.style.opacity=1;},200);
}

// Option Selection
function selectOption(option){
  points += 10;
  streak += 1;
  updateCompletion();
  saveStats();
  updateStats();
}

// Next Question
function nextQuestion(){
  if(currentQuestion < currentModule.length-1){
    currentQuestion++;
    renderQuestion();
  }
}

// Finish Module
function finishModule(){
  badges.push(moduleSelect.value);
  alert(`🎄 Congratulations! You completed ${moduleSelect.value}! 🎄`);
  updateCompletion();
  saveStats();
  updateStats();
  moduleContent.innerHTML = `
    <div class="certificate">
      <h1>Certificate of Appreciation</h1>
      <h2>Name Surname</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. This certificate acknowledges your completion of the training module.</p>
      <p>Date: ${new Date().toLocaleDateString()} <br> Signature: ___________________</p>
      <div class="seal">GRAND AWARD</div>
      <button onclick="window.print()">Print Certificate</button>
    </div>
  `;
}

// Close Module
function closeModule(){
  moduleSelect.value="";
  moduleContent.innerHTML = `<p>DefendIQ: Your trusted partner in training</p>`;
}

// Completion Calculation
function updateCompletion(){
  const totalModules = Object.keys(modules).length;
  const completed = badges.length;
  completion = Math.round((completed/totalModules)*100);
}

// Save Stats
function saveStats(){
  localStorage.setItem('streak', streak);
  localStorage.setItem('points', points);
  localStorage.setItem('completion', completion);
  localStorage.setItem('badges', JSON.stringify(badges));
}
