/* DefendIQ full interactive script.js
   - Handles landing -> dashboard
   - Dropdown module selection with watermark
   - Questions loaded from questions.json
   - Next/Prev navigation, animations
   - Module progress, streak, badges, localStorage
   - Certificate with timestamp, hash, QR code, PDF export, and email sharing
   - Anti-farming with read-only questions
   - Enhanced confetti animations
   - Placeholder for leaderboard
*/

/* ---------- DOM ---------- */
const startBtn = document.getElementById('startBtn');
const landing = document.getElementById('landing');
const app = document.getElementById('app');
const homeBtn = document.getElementById('homeBtn');
const moduleSelect = document.getElementById('moduleSelect');
const moduleBody = document.getElementById('moduleBody');
const moduleHeader = document.getElementById('moduleHeader');
const closeModuleBtn = document.getElementById('closeModuleBtn');
const streakDOM = document.getElementById('streak');
const pointsDOM = document.getElementById('points');
const completionDOM = document.getElementById('completion');
const badgesDOM = document.getElementById('badges');

/* ---------- Persistent Stats ---------- */
let stats = JSON.parse(localStorage.getItem('defendiq_stats')) || {
  streak: 0,
  points: 0,
  completion: 0,
  badges: []
};

/* Helper to save stats */
function saveStats() {
  localStorage.setItem('defendiq_stats', JSON.stringify(stats));
}

/* Update UI */
function refreshStatsUI() {
  streakDOM.textContent = stats.streak;
  pointsDOM.textContent = stats.points;
  completionDOM.textContent = stats.completion + '%';
  badgesDOM.innerHTML = stats.badges.length ? stats.badges.map(b => `<span class="badge flash">${b}</span>`).join(' ') : 'None';
}
refreshStatsUI();

/* ---------- Load Questions from JSON ---------- */
let MODULES = {};
async function loadQuestions() {
  try {
    const response = await fetch('questions.json');
    MODULES = await response.json();
  } catch (err) {
    console.error('Failed to load questions:', err);
    alert('Error loading questions. Please try again later.');
  }
}
loadQuestions();

/* ---------- State for Current Module ---------- */
let current = {
  key: null,
  idx: 0
};

/* ---------- Landing -> App ---------- */
startBtn.addEventListener('click', () => {
  landing.classList.add('hidden');
  app.classList.remove('hidden');
});

/* ---------- Home Button ---------- */
homeBtn.addEventListener('click', () => {
  app.classList.add('hidden');
  landing.classList.remove('hidden');
});

/* ---------- Dropdown Interactions ---------- */
const watermark = document.querySelector('.select-wrap .watermark');
moduleSelect.addEventListener('focus', () => watermark.style.opacity = 0.2);
moduleSelect.addEventListener('blur', () => watermark.style.opacity = 1);

moduleSelect.addEventListener('change', () => {
  const v = moduleSelect.value;
  if (!v || v === "") return;
  if (v === 'exit') {
    moduleSelect.selectedIndex = 0;
    closeModule();
    return;
  }
  openModule(v);
});

/* Close module button */
closeModuleBtn.addEventListener('click', () => {
  moduleSelect.selectedIndex = 0;
  closeModule();
});

/* ---------- Open Module ---------- */
function openModule(key) {
  current.key = key;
  current.idx = 0;
  renderQuestion();
  const title = MODULES[key] ? MODULES[key].title : key;
  document.querySelector('.module-title')?.replaceWith(createModuleTitleElem(title));
}

/* Helper to create a title element */
function createModuleTitleElem(title) {
  const el = document.createElement('div');
  el.className = 'module-title';
  el.textContent = title;
  return el;
}

/* ---------- Render Question ---------- */
function renderQuestion() {
  if (!current.key) return;
  const mod = MODULES[current.key];
  const qObj = mod.questions[current.idx];
  const keyProgress = JSON.parse(localStorage.getItem('defendiq_module_progress') || '{}');
  const prog = keyProgress[current.key] || { answered: [] };
  const isAnswered = prog.answered.includes(current.idx);

  const pct = Math.round(((current.idx + 1) / mod.questions.length) * 100);

  moduleBody.innerHTML = `
    <div class="question-card" aria-live="polite">
      <div class="q-text">${sanitize(qObj.q)}</div>
      <div class="options">
        ${qObj.opts.map((o, i) => `<button class="opt-btn" data-i="${i}" ${isAnswered ? 'disabled' : ''}>${sanitize(o)}</button>`).join('')}
      </div>
      <div class="progress-wrap">
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%;"></div></div>
      </div>
      <div class="controls">
        <button class="prev-btn" ${current.idx === 0 ? 'disabled' : ''}>Previous</button>
        <button class="next-btn" ${current.idx === mod.questions.length - 1 ? '' : 'disabled'}>${current.idx === mod.questions.length - 1 ? 'Finish Module' : 'Next Question'}</button>
        <div style="flex:1"></div>
        <div class="badge-strip" aria-hidden="true">
          ${stats.badges && stats.badges.length ? stats.badges.map(b => `<span class="badge">${b}</span>`).join('') : ''}
        </div>
      </div>
    </div>`;

  if (isAnswered) {
    moduleBody.querySelectorAll('.opt-btn').forEach(ob => {
      const idx = Number(ob.dataset.i);
      if (mod.questions[current.idx].opts[idx] === qObj.opts[qObj.a]) {
        ob.classList.add('correct');
      }
    });
    moduleBody.querySelector('.next-btn').disabled = false;
  }

  moduleBody.querySelectorAll('.opt-btn').forEach(btn => btn.addEventListener('click', onOptionClicked));
  const prev = moduleBody.querySelector('.prev-btn');
  const next = moduleBody.querySelector('.next-btn');

  prev?.addEventListener('click', () => {
    if (current.idx > 0) {
      current.idx--;
      slideTransition('left');
      renderQuestion();
    }
  });

  if (current.idx === mod.questions.length - 1) {
    next.addEventListener('click', finishModule);
  } else {
    next.addEventListener('click', () => {
      if (current.idx < mod.questions.length - 1) {
        current.idx++;
        slideTransition('right');
        renderQuestion();
      }
    });
  }

  updateGlobalProgress();
}

/* ---------- Sanitize Helper ---------- */
function sanitize(s) {
  return String(s).replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ---------- Option Click Handler ---------- */
function onOptionClicked(ev) {
  const btn = ev.currentTarget;
  const chosenIndex = Number(btn.dataset.i);
  const mod = MODULES[current.key];
  const qObj = mod.questions[current.idx];

  moduleBody.querySelectorAll('.opt-btn').forEach(ob => {
    ob.disabled = true;
    const idx = Number(ob.dataset.i);
    if (mod.questions[current.idx].opts[idx] === qObj.opts[qObj.a]) {
      ob.classList.add('correct');
    }
    if (idx === chosenIndex && qObj.a !== idx) ob.classList.add('incorrect');
  });

  if (chosenIndex === qObj.a) {
    stats.points += 10;
    stats.streak += 1;
    flashNextButton();
    triggerConfetti();
  } else {
    stats.streak = 0;
  }

  const nextBtn = moduleBody.querySelector('.next-btn');
  if (nextBtn) nextBtn.disabled = false;

  const keyProgress = JSON.parse(localStorage.getItem('defendiq_module_progress') || '{}');
  const prog = keyProgress[current.key] || { answered: [] };
  if (!prog.answered.includes(current.idx)) {
    prog.answered.push(current.idx);
    keyProgress[current.key] = prog;
    localStorage.setItem('defendiq_module_progress', JSON.stringify(keyProgress));
  }

  updateModuleCompletionStats();
  saveAndRefresh();
  animatePoints();
}

/* ---------- Enhanced Confetti Animation ---------- */
function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#ff7a7a', '#ffd56b', '#8affc1', '#9fb4ff'],
    shapes: ['circle', 'square', 'triangle'],
    scalar: 1.2,
    drift: 0.5
  });
}

/* ---------- Update Module Completion and Global Completion ---------- */
function updateModuleCompletionStats() {
  const keyProgress = JSON.parse(localStorage.getItem('defendiq_module_progress') || '{}');
  const totalModules = Object.keys(MODULES).length;
  stats.completion = Math.round((stats.badges.length / totalModules) * 100);
}

/* ---------- Update Global Progress ---------- */
function updateGlobalProgress() {
  // Placeholder for global progress logic if needed
}

/* ---------- Flash Next Button Effect ---------- */
function flashNextButton() {
  const nextBtn = moduleBody.querySelector('.next-btn');
  if (!nextBtn) return;
  nextBtn.animate([
    { transform: 'scale(1)', boxShadow: '0 0 8px rgba(255,204,0,0.5)' },
    { transform: 'scale(1.06)', boxShadow: '0 0 24px rgba(255,204,0,0.95)' }
  ], { duration: 450, iterations: 1 });
}

/* ---------- Points Increment Animation ---------- */
function animatePoints() {
  const start = Number(pointsDOM.textContent);
  const end = stats.points;
  const duration = 500;
  const startTime = performance.now();

  function update() {
    const now = performance.now();
    const progress = Math.min((now - startTime) / duration, 1);
    const currentPoints = Math.round(start + (end - start) * progress);
    pointsDOM.textContent = currentPoints;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

/* ---------- Slide Transition ---------- */
function slideTransition(dir = 'right') {
  moduleBody.style.transition = 'transform .28s ease, opacity .28s ease';
  moduleBody.style.opacity = '0';
  moduleBody.style.transform = dir === 'right' ? 'translateX(12px)' : 'translateX(-12px)';
  setTimeout(() => {
    moduleBody.style.opacity = '1';
    moduleBody.style.transform = 'translateX(0)';
  }, 260);
}

/* ---------- Finish Module ---------- */
function finishModule() {
  if (!stats.badges.includes(MODULES[current.key].title)) {
    stats.badges.push(MODULES[current.key].title);
    triggerConfetti();
  }
  stats.points += 50;
  stats.streak += 1;
  updateModuleCompletionStats();
  saveAndRefresh();
  animatePoints();
  showCertificate(MODULES[current.key].title);
}

/* ---------- Close Module ---------- */
function closeModule() {
  current.key = null;
  current.idx = 0;
  moduleSelect.selectedIndex = 0;
  moduleBody.innerHTML = `<div class="welcome-message">Select a module to begin</div>`;
  const t = document.querySelector('.module-title');
  if (t) t.textContent = 'Select a module to begin';
  saveAndRefresh();
}

/* ---------- Save & Refresh ---------- */
function saveAndRefresh() {
  saveStats();
  refreshStatsUI();
}

/* ---------- Certificate Rendering & Actions ---------- */
function showCertificate(moduleName) {
  const timestamp = new Date().toISOString();
  const hash = generateHash(moduleName + timestamp);
  const verifyUrl = `https://defendiq.github.io/verify?hash=${hash}`;
  const qrCodeId = 'qrcode-' + hash;

  moduleBody.innerHTML = `
    <div class="certificate-card" id="certificateCard">
      <div class="cert-inner">
        <h1 class="cert-title">Certificate of Appreciation</h1>
        <div contenteditable="true" id="certName" class="cert-name" aria-label="Recipient name">Name Surname</div>
        <p class="cert-body">This certificate is presented to the recipient in recognition of successful completion of the ${escapeHtml(moduleName)} training module.</p>
        <div class="cert-meta">
          <div>Date: <span id="certDate">${new Date().toLocaleDateString()}</span></div>
          <div>Certificate ID: <span id="certHash">${hash}</span></div>
        </div>
        <div id="${qrCodeId}" class="cert-qr"></div>
        <div class="cert-seal">GRAND AWARD</div>
        <div class="cert-actions">
          <button id="printCert">Print</button>
          <button id="downloadPNG">Download PNG</button>
          <button id="downloadPDF">Download PDF</button>
          <button id="shareEmailCert">Send via Email</button>
          <button id="copyLinkCert">Copy Verification Link</button>
          <button id="closeCert">Close Certificate</button>
        </div>
      </div>
    </div>`;

  QRCode.toCanvas(document.getElementById(qrCodeId), verifyUrl, { width: 100 }, (err) => {
    if (err) console.error('QR Code generation failed:', err);
  });

  document.getElementById('printCert').addEventListener('click', () => window.print());
  document.getElementById('closeCert').addEventListener('click', () => closeModule());
  document.getElementById('downloadPNG').addEventListener('click', async () => await downloadCertificatePNG());
  document.getElementById('downloadPDF').addEventListener('click', async () => await downloadCertificatePDF());
  document.getElementById('shareEmailCert').addEventListener('click', async () => await shareCertificateEmail(verifyUrl, moduleName, hash));
  document.getElementById('copyLinkCert').addEventListener('click', async () => await copyVerificationLink(verifyUrl));
}

/* ---------- Certificate Export Helpers ---------- */
async function downloadCertificatePNG() {
  const node = document.getElementById('certificateCard');
  if (!node) return alert('Certificate not ready');
  const canvas = await html2canvas(node, { scale: 2 });
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = 'DefendIQ_Certificate.png';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

async function downloadCertificatePDF() {
  const node = document.getElementById('certificateCard');
  if (!node) return alert('Certificate not ready');
  const canvas = await html2canvas(node, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: 'landscape' });
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight - 10);
  pdf.save('DefendIQ_Certificate.pdf');
}

async function shareCertificateEmail(verifyUrl, moduleName, hash) {
  const subject = encodeURIComponent('DefendIQ Certificate of Completion');
  const body = encodeURIComponent(`I have completed the ${moduleName} module on DefendIQ. Verify my certificate here: ${verifyUrl}\nCertificate ID: ${hash}`);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

async function copyVerificationLink(verifyUrl) {
  try {
    await navigator.clipboard.writeText(verifyUrl);
    alert('Verification link copied to clipboard!');
  } catch (err) {
    console.error('Failed to copy link:', err);
    alert('Failed to copy link. Please try again.');
  }
}

/* ---------- Hash Generation for Certificate ---------- */
function generateHash(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36).padStart(8, '0');
}

/* ---------- Escape HTML Helper ---------- */
function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ---------- Placeholder for Leaderboard (GitHub Actions) ---------- */
function updateLeaderboard() {
  // Placeholder: In a real implementation, this would sync with a GitHub Pages backend via GitHub Actions
  console.log('Leaderboard update placeholder. Points:', stats.points);
}

/* ---------- Initial Render State ---------- */
closeModule();
saveAndRefresh();
