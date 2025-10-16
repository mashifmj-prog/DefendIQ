/* ========== DefendIQ full app script ========== */

/* DOM */
const startBtn = document.getElementById('startBtn');
const landing = document.getElementById('landing');
const app = document.getElementById('app');

const homeBtn = document.getElementById('homeBtn');
const moduleSelect = document.getElementById('moduleSelect');
const moduleTitle = document.getElementById('moduleTitle');
const moduleBody = document.getElementById('moduleBody');
const closeModuleBtn = document.getElementById('closeModuleBtn');

const streakDOM = document.getElementById('streak');
const pointsDOM = document.getElementById('points');
const completionDOM = document.getElementById('completion');
const badgesDOM = document.getElementById('badges');

const overallChartCanvas = document.getElementById('overallChart');
const rotatingTip = document.getElementById('rotatingTip');

/* libraries */
const confetti = window.confetti || null;

/* ========== Persistent state ========= */
const STORAGE_KEY = 'defendiq_v2_state';
let state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
  streak: 0,
  points: 0,
  badges: [],
  moduleProgress: {} // e.g. { deepfake: { answered: [0,2], completed: true } }
};

/* helper to persist locally and try server */
function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  saveToServer(state).catch(()=>{/* ignore server errors for now */});
}

/* server placeholder - replace /api/saveProgress with your real API */
async function saveToServer(payload){
  // Example: POST to /api/saveProgress
  // Replace URL with your server endpoint and implement auth as needed
  try {
    await fetch('/api/saveProgress', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
  } catch (err) {
    // server not configured — keep local
    console.warn('Server save failed (placeholder):', err);
  }
}

/* ========== MODULES DATA (realistic questions) ========== */
/* Same modules defined earlier but with full answers index 'a' */
const MODULES = {
  keymessage: {
    title:'Key Message',
    questions:[
      { q:"Why is cybersecurity awareness important in a company?", opts:["Reduces risk of breaches","Slows employees","Costs more","Is optional"], a:0 },
      { q:"What should you do when you receive unexpected attachments?", opts:["Open immediately","Scan and verify sender","Forward to all","Ignore permanently"], a:1 },
      { q:"Phone requests for credentials should be handled how?", opts:["Share immediately","Verify caller and escalate","Assume it's HR","Post online"], a:1 },
      { q:"What is multi-factor authentication (MFA)?", opts:["Single password","Two or more verification methods","Antivirus","Firewall only"], a:1 },
      { q:"When to change passwords?", opts:["Never","After breach or periodically","Every hour","When bored"], a:1 },
      { q:"What is a safe way to report a suspected incident?", opts:["Public social post","Notify IT/security via official channel","Delete evidence","Ignore"], a:1 },
      { q:"How should sensitive files be sent?", opts:["Open email","Use approved encrypted transfer","Share on messenger","Share via USB left on desk"], a:1 },
      { q:"Which behavior strengthens security culture?", opts:["Ignoring policies","Regular training and reporting","Using weak passwords","Sharing logins"], a:1 },
      { q:"What to do with suspicious links?", opts:["Click to see","Hover to inspect, verify sender","Forward blindly","Reply with credentials"], a:1 },
      { q:"Who is responsible for security?", opts:["Only IT","Every employee","Only executives","Only security team"], a:1 }
    ]
  },

  deepfake: {
    title: 'Deepfake Awareness',
    questions:[
      { q:"What is a deepfake?", opts:["AI-generated fake media","A firewall","A password type","A network switch"], a:0 },
      { q:"A red flag for deepfake video is:", opts:["Perfect lip sync","Unnatural facial movement","Crystal clear audio always","Very long length"], a:1 },
      { q:"Deepfakes can be used for:", opts:["Impersonation for fraud","Improving passwords","Faster internet","Reducing spam"], a:0 },
      { q:"If CEO voice asks urgent money transfer, you should:", opts:["Comply immediately","Verify using known contact method","Post on social","Ignore"], a:1 },
      { q:"A defense against deepfakes is:", opts:["Verify identity via multiple channels","Rely only on email","Trust all video","Give full access"], a:0 },
      { q:"Suspicious deepfake content often has:", opts:["Perfect background","Slight visual glitches or lip-sync issues","High reliability","Extra clarity"], a:1 },
      { q:"How to report suspected deepfake?", opts:["Share widely","Report to security and manager","Delete device","Edit and repost"], a:1 },
      { q:"Deepfakes are produced using:", opts:["Neural networks and machine learning","Manual drawings only","Antivirus engines","Routers"], a:0 },
      { q:"When asked to confirm money transfer in video call:", opts:["Transfer at once","Confirm via official phone number or email","Assume safe","Give credentials"], a:1 },
      { q:"Best prevention is:", opts:["Training to spot signs and verification procedures","Avoiding all calls","Turning off camera","Removing backups"], a:0 }
    ]
  },

  reporting: {
    title: 'Reporting Security Incidents',
    questions:[
      { q:"Why report quickly?", opts:["Speeds investigation and containment","Causes panic","Is not necessary","Annoys IT"], a:0 },
      { q:"What info helps an incident report?", opts:["Screenshots, timestamps, sender details","Only feelings","No details","Random data"], a:0 },
      { q:"Reporting channels should be:", opts:["Unofficial chat only","Official IT/security channels","Public forum","Email to attacker"], a:1 },
      { q:"If you clicked a malicious link, you should:", opts:["Wait and see","Report immediately and isolate device","Keep using","Share with colleagues"], a:1 },
      { q:"Who do you include in the initial report?", opts:["Only yourself","Your manager and IT/security as required","Social media","Only HR"], a:1 },
      { q:"Incident reporting helps to:", opts:["Prevent spread, preserve evidence, improve controls","Hide breaches","Make false claims","Reduce workload"], a:0 },
      { q:"Do not do after incident:", opts:["Turn off machine, disconnect, preserve evidence","Delete logs or hide evidence","Follow incident team guidance","Provide details"], a:1 },
      { q:"A clear incident report should be:", opts:["Concise, factual, timestamped","Long and emotional","Vague","Full of rumors"], a:0 },
      { q:"Who typically manages incident response?", opts:["Security/IT (with management)","Sales","Reception","Marketing"], a:0 },
      { q:"Practicing reporting procedures helps:", opts:["Speed real response","Confuse team","Ignore incidents","Hide information"], a:0 }
    ]
  },

  culture: {
    title: 'Culture Survey',
    questions:[
      { q:"What helps a strong security culture?", opts:["Open communication and training","Ignoring policy","Sharing passwords","Avoiding reporting"], a:0 },
      { q:"Employees contribute by:", opts:["Reporting suspicious activity","Avoiding training","Hiding issues","Sharing credentials"], a:0 },
      { q:"Frequent training results in:", opts:["Better awareness and fewer incidents","More breaches","Slower work","Confusion"], a:0 },
      { q:"Management role in culture is to:", opts:["Model good behavior and support security","Ignore it","Assign blame","Decrease budget"], a:0 },
      { q:"Trustworthy behavior includes:", opts:["Following policies and reporting","Bypassing procedures","Hoarding knowledge","Hiding incidents"], a:0 },
      { q:"Good feedback loops mean:", opts:["Employees get constructive responses when they report","Reports are ignored","Only managers are informed","Public shaming"], a:0 },
      { q:"A weak culture sign is:", opts:["Frequent unsafe shortcuts","Robust reporting","Regular training","Positive rewards"], a:0 },
      { q:"Encouraging questions leads to:", opts:["Better awareness","No change","More incidents","Fewer reports"], a:0 },
      { q:"Recognition for vigilance encourages:", opts:["More reporting and care","Less responsibility","Blocking tools","Isolation"], a:0 },
      { q:"Culture improvements require:", opts:["Time, resources, leadership support","Nothing","Only tech tools","Only policies"], a:0 }
    ]
  },

  social: {
    title: 'Social Engineering',
    questions:[
      { q:"What is social engineering?", opts:["Manipulating people to reveal secrets","A software update","A firewall rule","Antivirus"], a:0 },
      { q:"Red flags in phone social engineering:", opts:["Sense of urgency, pressure to act, odd caller ID","Perfect grammar","Long hold music","Friendly voice only"], a:0 },
      { q:"If asked for credentials by caller:", opts:["Verify identity via official channel","Share immediately","Hang up and reshare","Text credentials"], a:0 },
      { q:"Attackers may use:", opts:["Public info to build trust","Random numbers","Authorized badges","Software patches"], a:0 },
      { q:"To defend, we should:", opts:["Train employees and verify requests","Ignore all callers","Disable phones","Post credentials publicly"], a:0 },
      { q:"Phishing emails often include:", opts:["Urgency, spoofed domains, misspellings","Clear sender identity","Personal invite from CEO always","Encrypted attachments only"], a:0 },
      { q:"When partner requests sensitive data:", opts:["Verify via official channels before sharing","Share immediately","Put on social media","Assume safe"], a:0 },
      { q:"Social engineering uses:", opts:["Psychology and trust exploitation","Only technology","Only bots","Only spammers"], a:0 },
      { q:"Spotting social engineering requires:", opts:["Skepticism and verification","Blind trust","No training","Only IT knowledge"], a:0 },
      { q:"What to do when you suspect an attempt?", opts:["Report to security and preserve evidence","Share it with everyone","Delete evidence","Ignore it"], a:0 }
    ]
  },

  phishing: {
    title:'Phishing Simulation',
    questions:[
      { q:"'Urgent – update your password' from unknown domain. You:", opts:["Hover, inspect sender, do not click; report","Click and type password","Forward to all","Reply with credentials"], a:0 },
      { q:"Suspicious attachment from supplier, you:", opts:["Verify with sender using known contact, scan file","Open immediately","Send to HR only","Ignore the email permanently"], a:0 },
      { q:"A link that shortens domain should be:", opts:["Inspected via right tools or hover reveal","Trusted","Clicked only on mobile","Pasted in social"], a:0 },
      { q:"Unexpected invoice should be:", opts:["Confirmed with vendor via official channel","Paid immediately","Forwarded","Approved"], a:0 },
      { q:"Sender address slightly off (e.g., @rn instead of @m)", opts:["Flag as suspicious and report","Assume safe","Reply with credentials","Sign contract"], a:0 },
      { q:"Email asking for payroll change from manager:", opts:["Verify in person or via official process","Change immediately","Share bank details","Ignore"], a:0 },
      { q:"Attachments with odd file types should be:", opts:["Not opened until verified","Opened on phone","Uploaded publicly","Shared on chat"], a:0 },
      { q:"Link leads to login page but domain mismatch:", opts:["Do not enter credentials; report","Enter credentials","Share screenshot","Approve access"], a:0 },
      { q:"Phishing training helps by:", opts:["Teaching recognition and response","Making employees click more","Increasing risk","Reducing reporting"], a:0 },
      { q:"When in doubt:", opts:["Report to security and IT quickly","Ignore it","Assume safe","Delete the email only"], a:0 }
    ]
  },

  password: {
    title:'Password Training',
    questions:[
      { q:"Strong passwords should be:", opts:["Long, unique, with mixed characters","Your name","123456","Repeated across accounts"], a:0 },
      { q:"Using a password manager is:", opts:["Recommended for generating and storing strong passwords","Unsafe","Illegal","Only for admins"], a:0 },
      { q:"Reusing passwords across sites is:", opts:["Risky and should be avoided","Efficient","Secure","Required"], a:0 },
      { q:"Two-factor authentication does:", opts:["Add a second form of verification","Replace passwords entirely","Make logins slower","Is optional always"], a:0 },
      { q:"Storing passwords in plain text is:", opts:["Dangerous","Standard practice","OK if private","Recommended"], a:0 },
      { q:"A passphrase is:", opts:["A long memorable phrase used as a password","Short code","Password manager","Firewall rule"], a:0 },
      { q:"When password is compromised:", opts:["Change immediately and notify IT","Change next year","Ignore","Share with colleagues"], a:0 },
      { q:"Best practice for shared accounts is:", opts:["Use managed credentials and rotate them regularly","Share freely","Use sticky notes","Write in a public doc"], a:0 },
      { q:"Password complexity helps by:", opts:["Making brute-force attacks harder","Simplifying logins","Ensuring reuse","Removing MFA"], a:0 },
      { q:"If you must write a password temporarily:", opts:["Remove it securely and use manager","Leave it on desk","Publish it","Email it"], a:0 }
    ]
  }
};

/* ========== UI: start and home ========== */
startBtn.addEventListener('click', ()=> {
  landing.classList.add('hidden');
  app.classList.remove('hidden');
  renderOverallChart(); // show simulated chart
});

homeBtn.addEventListener('click', ()=> {
  // Home flicker handled by :active; return to landing
  app.classList.add('hidden');
  landing.classList.remove('hidden');
});

/* ========== rotating tips ========== */
const TIPS = [
  'Tip: Hover over links to preview URLs before clicking.',
  'Tip: Use long passphrases and a password manager.',
  'Tip: Never share your credentials via email.',
  'Tip: Verify requests for funds through a known phone number.',
  'Tip: Report suspicious emails to security quickly.'
];
let tipIdx = 0;
function rotateTips(){
  rotatingTip.textContent = TIPS[tipIdx % TIPS.length];
  tipIdx++;
}
setInterval(rotateTips, 6000);
rotateTips();

/* ========== Chart: overall progress (simulated data) ========== */
let overallChart = null;
function renderOverallChart(){
  const labels = ['KeyMessage','Deepfake','Reporting','Culture','Social','Phishing','Password'];
  // simulate completion per module using stored badges and other values
  const data = labels.map(l => {
    const key = l.toLowerCase().replace(/\s+/g,'');
    // crude mapping: if badge exists, show higher number; otherwise random-ish but encouraging
    const hasBadge = state.badges && state.badges.includes(l);
    return hasBadge ? 95 : Math.min(60 + (Math.random()*30), 90).toFixed(0);
  });

  const ctx = overallChartCanvas.getContext('2d');
  if(overallChart) overallChart.destroy();
  overallChart = new Chart(ctx, {
    type:'bar',
    data:{
      labels,
      datasets:[{
        label:'Module completion %',
        data:data,
        backgroundColor: labels.map((_,i)=> i%2? '#00bfff':'#7afcff')
      }]
    },
    options:{
      indexAxis:'y',
      responsive:true,
      plugins:{legend:{display:false}}
    }
  });

  // positive affirmation text change depending on average
  const avg = data.reduce((s,v)=>s+Number(v),0)/data.length;
  const affirm = document.getElementById('affirmation');
  if(avg > 80) affirm.textContent = "Excellent progress — you’re doing great!";
  else if(avg > 60) affirm.textContent = "Good progress — keep going!";
  else affirm.textContent = "You're on your way — small steps every day!";
}

/* ========== Selection & module open ========== */
moduleSelect.addEventListener('change', ()=> {
  const v = moduleSelect.value;
  if(!v || v === '') return;
  if(v === 'exit'){ closeModule(); return; }
  openModule(v);
});

/* open module and render first question and module-level chart */
function openModule(key){
  const mod = MODULES[key];
  if(!mod) return;
  moduleTitle.textContent = mod.title;
  state.currentModule = key;
  state.currentIndex = 0;
  // ensure moduleProgress record exists
  const mp = state.moduleProgress[key] || {answered:[], completed:false};
  state.moduleProgress[key] = mp;
  persist();
  renderQuestion();
  renderModuleChart(key);
  // show Learning Material and Take Quiz buttons above body
  showModuleActions();
}

/* close module resets */
function closeModule(){
  moduleTitle.textContent = 'DefendIQ: Your trusted partner in training';
  state.currentModule = null;
  state.currentIndex = 0;
  moduleBody.innerHTML = `<div id="defaultWelcome" class="welcome-message">DefendIQ: Your trusted partner in training</div>
    <div class="overall-panel"><canvas id="overallChart" width="400" height="120"></canvas><div id="affirmation" class="affirmation">You're making progress — keep going! 💪</div></div>`;
  bindOverallChartToCanvas(); // rebind
  hideModuleActions();
  persist();
}

/* show/hide module-level buttons */
function showModuleActions(){
  // create two buttons: Learning Material & Take a Quiz (Take a Quiz starts question flow from first unanswered)
  if(document.getElementById('moduleActionBar')) return; // already present
  const bar = document.createElement('div');
  bar.id = 'moduleActionBar';
  bar.className = 'module-action-bar';
  bar.innerHTML = `<button id="learningMaterialBtn" class="small-btn">Learning Material</button>
                   <button id="takeQuizBtn" class="small-btn">Take a Quiz</button>`;
  moduleHeader.appendChild(bar);

  document.getElementById('learningMaterialBtn').addEventListener('click', showLearningMaterial);
  document.getElementById('takeQuizBtn').addEventListener('click', ()=> {
    // jump to first unanswered question or start from 0
    const key = state.currentModule;
    state.currentIndex = (state.moduleProgress[key] && state.moduleProgress[key].answered && state.moduleProgress[key].answered.length) ?
                          state.moduleProgress[key].answered.length : 0;
    renderQuestion();
  });
}

function hideModuleActions(){
  const bar = document.getElementById('moduleActionBar');
  if(bar) bar.remove();
}

/* Learning Material: brief bullet points */
function showLearningMaterial(){
  const key = state.currentModule;
  if(!key) return;
  const info = {
    keymessage:['Security begins with you','Verify senders','Report suspicious items'],
    deepfake:['Check lip-sync','Confirm identity by other channels','Be skeptical of unsolicited media'],
    reporting:['Capture screenshots','Note timestamps','Contact IT immediately'],
    culture:['Be proactive','Support colleagues','Encourage reporting'],
    social:['Pause and verify','Do not share credentials','Use official channels'],
    phishing:['Hover links first','Check sender domain','Do not open unexpected attachments'],
    password:['Use a password manager','Enable MFA','Use long passphrases']
  };
  const bullets = (info[key] || ['Review the official learning pack.']).map(b=>`<li>${b}</li>`).join('');
  moduleBody.innerHTML = `<div class="learning-material"><h3>Learning Material</h3><ul>${bullets}</ul>
    <div style="margin-top:12px"><button class="small-btn" id="backToQuiz">Back to quiz</button></div></div>`;
  document.getElementById('backToQuiz').addEventListener('click', ()=> renderQuestion());
}

/* ========== Render question (with strict per-question awarding) ========== */
function renderQuestion(){
  const key = state.currentModule;
  if(!key) return;
  const mod = MODULES[key];
  const idx = state.currentIndex || 0;
  const q = mod.questions[idx];

  // progress percent module-level
  const moduleAnswered = state.moduleProgress[key]?.answered?.length || 0;
  const pct = Math.round(((idx+1)/mod.questions.length)*100);

  // build DOM
  moduleBody.innerHTML = `
    <div class="question-card" role="region" aria-live="polite">
      <div class="q-text">${escapeHtml(q.q)}</div>
      <div class="options">${q.opts.map((o,i)=>`<button class="opt-btn" data-i="${i}">${escapeHtml(o)}</button>`).join('')}</div>
      <div class="progress-wrap"><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div></div>
      <div class="controls"><button class="prev-btn" ${idx===0?'disabled':''}>Previous</button>
        <button class="next-btn" ${idx === mod.questions.length-1 ? '':'disabled'}>Next Question</button>
        <div style="flex:1"></div>
        <div class="badge-strip">${state.badges && state.badges.length ? state.badges.map(b=>`<span class="badge">${b}</span>`).join(' ') : ''}</div>
      </div>
    </div>
  `;

  // bind options
  moduleBody.querySelectorAll('.opt-btn').forEach(btn=>{
    btn.addEventListener('click', onOptionSelected);
  });

  // bind prev/next
  const prev = moduleBody.querySelector('.prev-btn');
  const next = moduleBody.querySelector('.next-btn');
  prev.addEventListener('click', ()=> {
    if(state.currentIndex > 0){ state.currentIndex--; slideTransition('left'); renderQuestion(); }
  });

  // next initially disabled until an answer chosen; Next could be Finish on last question
  if(state.currentIndex === mod.questions.length -1){
    next.textContent = 'Finish Module';
    next.disabled = true;
    next.addEventListener('click', finishModule);
  } else {
    next.textContent = 'Next Question';
    next.disabled = true;
    next.addEventListener('click', ()=> {
      if(state.currentIndex < mod.questions.length -1){ state.currentIndex++; slideTransition('right'); renderQuestion(); }
    });
  }

  // small module-specific dashboard on right (render)
  renderModuleChart(key);
}

/* option selected: check correctness, award points once, confetti on correct, show shake on incorrect */
function onOptionSelected(e){
  const btn = e.currentTarget;
  const chosenIndex = Number(btn.dataset.i);
  const key = state.currentModule;
  const mod = MODULES[key];
  const q = mod.questions[state.currentIndex];
  const correctIndex = q.a;

  // disable all options
  moduleBody.querySelectorAll('.opt-btn').forEach(b=> b.disabled = true);

  // visual marking
  moduleBody.querySelectorAll('.opt-btn').forEach(b=>{
    const i = Number(b.dataset.i);
    if(i === correctIndex) b.classList.add('correct');
    if(i === chosenIndex && i !== correctIndex) b.classList.add('incorrect');
  });

  // strict awarding: only award once per question
  const mp = state.moduleProgress[key] || {answered:[], completed:false};
  const alreadyAnswered = mp.answered.includes(state.currentIndex);

  if(chosenIndex === correctIndex){
    // award only if not already answered
    if(!alreadyAnswered){
      state.points += 10;
      mp.answered.push(state.currentIndex);
      // confetti burst - fun and celebratory
      launchConfetti();
      // flash next button for delight
      flashNext();
    }
    // small positive message
    showTempMessage('Correct! Well done.', 2200, 'positive');
  } else {
    // incorrect => reset streak and show shake + encouraging message
    state.streak = 0;
    showTempMessage('Not quite — the correct answer is highlighted. Keep going!', 3000, 'error');
    shakeModule();
    // mark answered (but not award) to avoid re-trying for points? We keep it so user can retry but not get points if they had previously answered correct.
    if(!alreadyAnswered){
      mp.answered.push(state.currentIndex); // mark as attempted so can't farm by switching answers
    }
  }

  // save module progress
  state.moduleProgress[key] = mp;
  // enable next/finish
  const nextBtn = moduleBody.querySelector('.next-btn');
  if(nextBtn) nextBtn.disabled = false;

  // update streak only if correct and not already answered
  if(chosenIndex === correctIndex && !alreadyAnswered){
    state.streak += 1;
  }

  updateGlobalCompletionAndBadges(key);
  persist();
  refreshUI();
}

/* show temp message under module header */
function showTempMessage(text, ms=2000, type='info'){
  const msg = document.createElement('div');
  msg.className = 'temp-msg ' + type;
  msg.textContent = text;
  moduleBody.prepend(msg);
  setTimeout(()=> {
    msg.style.opacity = 0;
    setTimeout(()=> msg.remove(), 400);
  }, ms);
}

/* small shake effect */
function shakeModule(){
  moduleBody.animate([{transform:'translateX(0)'},{transform:'translateX(-8px)'},{transform:'translateX(8px)'},{transform:'translateX(-6px)'},{transform:'translateX(0)'}],{duration:500});
}

/* flash next button */
function flashNext(){
  const btn = moduleBody.querySelector('.next-btn');
  if(!btn) return;
  btn.animate([{transform:'scale(1)'},{transform:'scale(1.06)'},{transform:'scale(1)'}],{duration:360});
}

/* confetti launcher (fun & celebratory) */
function launchConfetti(){
  if(typeof confetti === 'function'){
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.35 },
      colors: ['#ff7a7a','#ffd56b','#8affc1','#9fb4ff','#ff7a7a','#ffb6c1']
    });
  } else {
    // fallback: create small colored dots
    // omitted for brevity; canvas-confetti is included in index.html
  }
}

/* slide transition helper */
function slideTransition(dir='right'){
  moduleBody.style.transition = 'transform .28s ease, opacity .28s ease';
  moduleBody.style.opacity = 0;
  moduleBody.style.transform = dir === 'right'? 'translateX(12px)' : 'translateX(-12px)';
  setTimeout(()=> { moduleBody.style.opacity = 1; moduleBody.style.transform = 'translateX(0)'; }, 260);
}

/* finish module: mark completed, award badge & points, show certificate */
function finishModule(){
  const key = state.currentModule;
  if(!key) return;
  const mod = MODULES[key];
  // mark completed
  if(!state.badges.includes(mod.title)) {
    state.badges.push(mod.title);
    // award completion bonus
    state.points += 50;
  }
  state.moduleProgress[key].completed = true;
  updateGlobalCompletionAndBadges(key);
  persist();
  // show certificate
  showCertificate(mod.title, key);
}

/* update completion percent and badges display */
function updateGlobalCompletionAndBadges(){
  const total = Object.keys(MODULES).length;
  const completedCount = state.badges.length;
  const percent = Math.round((completedCount / total) * 100);
  state.completion = percent;
}

/* refresh UI numbers */
function refreshUI(){
  streakDOM.textContent = state.streak;
  pointsDOM.textContent = state.points;
  completionDOM.textContent = state.completion + '%';
  badgesDOM.innerHTML = state.badges.length ? state.badges.map(b=>`<span class="badge flash">${b}</span>`).join(' ') : 'None';
}

/* bind overall chart canvas (redraw) */
function bindOverallChartToCanvas(){
  const canvas = document.getElementById('overallChart');
  if(canvas){
    renderOverallChart();
  }
}

/* render module-level chart (small) */
let moduleChart = null;
function renderModuleChart(key){
  // small chart showing progress within module (answers correct vs total)
  const mod = MODULES[key];
  const mp = state.moduleProgress[key] || {answered:[], completed:false};
  const answered = mp.answered ? mp.answered.length : 0;
  const correct = mp.answered ? mp.answered.filter(i=> {
    // if index i was answered earlier, check if it was correct by comparing options; however we marked answered regardless of correct in earlier storage
    // For module-level chart we simulate positivity: ratio = answered / total * random boost
    return true;
  }).length;

  // create a simple doughnut showing answered vs remaining
  const ctx = document.createElement('canvas');
  ctx.width = 300; ctx.height = 120;
  // remove old chart element and append new on top-right of moduleBody (or replace existing)
  const existing = document.getElementById('moduleMiniChart');
  if(existing) existing.remove();
  const wrap = document.createElement('div');
  wrap.id = 'moduleMiniChart';
  wrap.style.marginTop = '12px';
  wrap.appendChild(ctx);
  moduleBody.appendChild(wrap);

  if(moduleChart) moduleChart.destroy();
  moduleChart = new Chart(ctx.getContext('2d'),{
    type:'doughnut',
    data:{
      labels:['Answered','Remaining'],
      datasets:[{
        data:[answered, mod.questions.length - answered],
        backgroundColor:['#00bfff','#444']
      }]
    },
    options:{plugins:{legend:{display:false}}}
  });
}

/* ========== Certificate rendering & actions ========== */
async function showCertificate(moduleTitle, moduleKey){
  // build certificate from hidden template
  const certHtml = document.getElementById('certificateTemplate').innerHTML;
  // fill placeholders
  const frag = document.createRange().createContextualFragment(certHtml);
  const card = frag.querySelector('.certificate-card') || frag;
  // set module name and date
  card.querySelector('#certModule').textContent = moduleTitle;
  card.querySelector('#certDate').textContent = new Date().toLocaleDateString();
  // ensure brand on right
  card.querySelector('#certBrand')?.setAttribute('aria-hidden','true');

  // replace moduleBody with certificate (and action buttons outside certificate)
  moduleBody.innerHTML = '';
  moduleBody.appendChild(card);

  // actions area (outside certificate, will be hidden for printing)
  const actions = document.createElement('div');
  actions.className = 'cert-actions';
  actions.innerHTML = `
    <button id="printCert">Print</button>
    <button id="downloadPNG">Download PNG</button>
    <button id="downloadPDF">Download PDF</button>
    <button id="shareCert">Share</button>
    <button id="closeCert">Close Certificate</button>
  `;
  moduleBody.appendChild(actions);

  // wire events
  document.getElementById('printCert').addEventListener('click', ()=> window.print());
  document.getElementById('closeCert').addEventListener('click', ()=> closeModule());
  document.getElementById('downloadPNG').addEventListener('click', async ()=>{
    const node = moduleBody.querySelector('.certificate-card');
    if(!node) return alert('Certificate not ready');
    const canvas = await html2canvas(node, {scale:2});
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url; a.download = `DefendIQ_Certificate_${moduleKey}.png`; document.body.appendChild(a); a.click(); a.remove();
  });

  document.getElementById('downloadPDF').addEventListener('click', async ()=>{
    const node = moduleBody.querySelector('.certificate-card');
    if(!node) return alert('Certificate not ready');
    const canvas = await html2canvas(node, {scale:3});
    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({orientation:'landscape'});
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = (canvas.height * pdfW) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 10, pdfW, pdfH - 10);
    pdf.save(`DefendIQ_Certificate_${moduleKey}.pdf`);
  });

  document.getElementById('shareCert').addEventListener('click', async ()=>{
    if(!navigator.canShare){ alert('Sharing not supported on this browser. Please download the file.'); return; }
    const node = moduleBody.querySelector('.certificate-card');
    const canvas = await html2canvas(node, {scale:2});
    const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
    const file = new File([blob], `DefendIQ_Certificate_${moduleKey}.png`, {type:'image/png'});
    try { await navigator.share({files:[file], title:'DefendIQ Certificate', text:'Certificate of Appreciation'}); }
    catch(err){ console.warn('Share failed', err); alert('Share failed or canceled.'); }
  });

  // create QR code linking to a verification URL (demo)
  const qrWrap = document.createElement('div');
  qrWrap.style.marginTop='12px';
  moduleBody.appendChild(qrWrap);
  const verifyUrl = `${location.origin}/verify?cert=${encodeURIComponent(moduleKey+'-'+Date.now())}`;
  QRCode.toCanvas(verifyUrl, { width: 100 }, (err, canvas) => {
    if(!err) qrWrap.appendChild(canvas);
  });
}

/* ========== Utilities ========== */
function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* initial UI refresh */
refreshUI();
bindOverallChartToCanvas();

/* Helper: re-render overall chart and module chart on load changes */
function bindOverallChartToCanvas(){ setTimeout(()=> renderOverallChart(), 60); }

/* final persist wrapper */
persist();

/* ========== End of script ========== */
