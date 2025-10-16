/* ========== DefendIQ v2 script.js ========== */

/* DOM elements */
const startBtn = document.getElementById('startBtn');
const landing = document.getElementById('landing');
const app = document.getElementById('app');
const homeBtn = document.getElementById('homeBtn');
const moduleSelect = document.getElementById('moduleSelect');
const moduleTitle = document.getElementById('moduleTitle');
const moduleBody = document.getElementById('moduleBody');
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
  userId: crypto.randomUUID(),
  streak: 0,
  points: 0,
  badges: [],
  moduleProgress: {}
};

/* Helper: persist locally and send to server */
async function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  try {
    await fetch('http://localhost:3000/api/saveProgress', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ userId: state.userId, progress: state })
    });
  } catch(err){
    console.warn('Server save failed:', err);
  }
}

/* ========== Module Data ========= */
const MODULES = {
  keymessage:{ title:'Key Message', questions:[
    {q:"Why is cybersecurity awareness important?", opts:["Reduces risk","Slows employees","Costs more","Optional"], a:0},
    {q:"Unexpected attachments?", opts:["Open immediately","Scan & verify sender","Forward all","Ignore"], a:1}
  ]},
  deepfake:{ title:'Deepfake Awareness', questions:[
    {q:"What is a deepfake?", opts:["AI-generated fake media","Firewall","Password type","Switch"], a:0},
    {q:"Red flag?", opts:["Perfect lipsync","Unnatural facial","Crystal clear audio","Long length"], a:1}
  ]}
  // Add other modules similarly
};

/* ========== START / HOME ========= */
startBtn.addEventListener('click', ()=> {
  landing.classList.add('hidden');
  app.classList.remove('hidden');
  renderOverallChart();
});
homeBtn.addEventListener('click', ()=> {
  app.classList.add('hidden');
  landing.classList.remove('hidden');
});

/* ========== Tips rotation ========= */
const TIPS = [
  'Hover links to preview URLs before clicking.',
  'Use long passphrases & password manager.',
  'Never share credentials via email.',
  'Verify requests for funds via known number.',
  'Report suspicious emails quickly.'
];
let tipIdx = 0;
function rotateTips(){
  rotatingTip.textContent = TIPS[tipIdx % TIPS.length];
  tipIdx++;
}
setInterval(rotateTips, 6000);
rotateTips();

/* ========== Module Selection ========= */
moduleSelect.addEventListener('change', ()=>{
  const v = moduleSelect.value;
  if(!v || v==='') return;
  if(v==='exit'){ closeModule(); return; }
  openModule(v);
});

/* ========== Open/Close Module ========= */
function openModule(key){
  const mod = MODULES[key];
  if(!mod) return;
  moduleTitle.textContent = mod.title;
  state.currentModule = key;
  state.currentIndex = 0;
  state.moduleProgress[key] = state.moduleProgress[key] || { answered:[], completed:false };
  persist();
  renderQuestion();
  renderModuleChart(key);
  showModuleActions();
}
function closeModule(){
  moduleTitle.textContent = 'DefendIQ: Your trusted partner in training';
  state.currentModule = null;
  state.currentIndex = 0;
  moduleBody.innerHTML = `<div id="defaultWelcome" class="welcome-message">Welcome to DefendIQ</div>
    <div class="overall-panel"><canvas id="overallChart" width="400" height="120"></canvas>
    <div id="affirmation" class="affirmation">You're making progress — keep going! 💪</div></div>`;
  bindOverallChartToCanvas();
  hideModuleActions();
  persist();
}

/* ========== Module Actions ========= */
function showModuleActions(){
  if(document.getElementById('moduleActionBar')) return;
  const bar = document.createElement('div');
  bar.id='moduleActionBar';
  bar.className='module-action-bar';
  bar.innerHTML = `<button id="learningMaterialBtn">Learning Material</button>
                   <button id="takeQuizBtn">Take Quiz</button>`;
  moduleHeader.appendChild(bar);
  document.getElementById('learningMaterialBtn').addEventListener('click', showLearningMaterial);
  document.getElementById('takeQuizBtn').addEventListener('click', ()=>{
    const key = state.currentModule;
    state.currentIndex = (state.moduleProgress[key]?.answered?.length)||0;
    renderQuestion();
  });
}
function hideModuleActions(){ const bar=document.getElementById('moduleActionBar'); if(bar) bar.remove(); }

/* ========== Learning Material ========= */
function showLearningMaterial(){
  const key = state.currentModule;
  if(!key) return;
  const info = {
    keymessage:['Security starts with you','Verify senders','Report suspicious items'],
    deepfake:['Check lipsync','Confirm identity','Be skeptical of unsolicited media']
  };
  const bullets = (info[key]||['Review official pack']).map(b=>`<li>${b}</li>`).join('');
  moduleBody.innerHTML = `<h3>Learning Material</h3><ul>${bullets}</ul>
    <button id="backToQuiz">Back to quiz</button>`;
  document.getElementById('backToQuiz').addEventListener('click', ()=> renderQuestion());
}

/* ========== Render Question ========= */
function renderQuestion(){
  const key = state.currentModule;
  if(!key) return;
  const mod = MODULES[key];
  const idx = state.currentIndex || 0;
  const q = mod.questions[idx];
  const pct = Math.round(((idx+1)/mod.questions.length)*100);
  const answered = state.moduleProgress[key].answered || [];

  moduleBody.innerHTML = `
    <div class="question-card">
      <div class="q-text">${escapeHtml(q.q)}</div>
      <div class="options">${q.opts.map((o,i)=>`<button class="opt-btn" data-i="${i}" ${answered.includes(idx)?'disabled':''}>${escapeHtml(o)}</button>`).join('')}</div>
      <div class="progress-wrap"><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div></div>
      <div class="controls">
        <button class="prev-btn" ${idx===0?'disabled':''}>Previous</button>
        <button class="next-btn" ${idx===mod.questions.length-1?'':'disabled'}>${idx===mod.questions.length-1?'Finish':'Next'}</button>
      </div>
    </div>
  `;

  // bind events
  moduleBody.querySelectorAll('.opt-btn').forEach(btn=>btn.addEventListener('click', onOptionSelected));
  moduleBody.querySelector('.prev-btn')?.addEventListener('click', ()=>{
    if(state.currentIndex>0){ state.currentIndex--; renderQuestion(); }
  });
  moduleBody.querySelector('.next-btn')?.addEventListener('click', ()=>{
    if(state.currentIndex<mod.questions.length-1){ state.currentIndex++; renderQuestion(); }
    else finishModule();
  });
}

/* ========== Option Selection ========= */
function onOptionSelected(e){
  const btn = e.currentTarget;
  const chosen = Number(btn.dataset.i);
  const key = state.currentModule;
  const idx = state.currentIndex;
  const mod = MODULES[key];
  const correct = mod.questions[idx].a;

  // disable all options
  moduleBody.querySelectorAll('.opt-btn').forEach(b=>b.disabled=true);

  const mp = state.moduleProgress[key];
  const alreadyAnswered = mp.answered.includes(idx);

  if(chosen===correct){
    if(!alreadyAnswered){
      state.points+=10;
      mp.answered.push(idx);
      launchConfetti();
      flashNext();
      state.streak+=1;
    }
    showTempMessage('Correct! 🎉',2000,'positive');
  } else {
    state.streak=0;
    showTempMessage('Incorrect — correct answer highlighted',3000,'error');
    shakeModule();
    if(!alreadyAnswered) mp.answered.push(idx);
  }

  updateGlobalCompletionAndBadges();
  persist();
  refreshUI();
}

/* ========== Helper UI effects ========= */
function showTempMessage(text,ms=2000,type='
