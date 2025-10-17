/* DefendIQ - Main Application Script
   - Landing page with Training/Support Mode selection
   - Training Mode: Module selection, learning materials, quizzes, certificates
   - Support Mode: AI chat, affirmations, tips, module recommendations
   - Home button always returns to landing page
   - Modular structure with clean separation of concerns
*/

document.addEventListener('DOMContentLoaded', () => {
  // Initialize app state and load data
  loadQuestions();
  loadStats();
  restoreState();
  startLearningTips();

  // Landing page buttons
  document.getElementById('trainingBtn').addEventListener('click', () => enterTrainingMode());
  document.getElementById('supportBtn').addEventListener('click', () => enterSupportMode());

  // Navigation
  document.getElementById('homeBtn').addEventListener('click', goHome);
  document.getElementById('refreshBtn').addEventListener('click', refreshCurrentView);
  document.getElementById('feedbackBtn').addEventListener('click', showFeedback);
});

/* ---------- Navigation Functions ---------- */
function goHome() {
  document.getElementById('app').classList.add('hidden');
  document.getElementById('landing').classList.remove('hidden');
  currentMode = 'landing';
  saveState();
  console.log('Returned to home page');
}

function enterTrainingMode() {
  currentMode = 'training';
  document.getElementById('landing').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  document.querySelector('.quiz-dropdown').classList.remove('hidden');
  document.querySelector('.stats-area').classList.remove('hidden');
  renderTrainingDashboard();
  saveState();
  console.log('Entered Training Mode');
}

function enterSupportMode() {
  currentMode = 'support';
  document.getElementById('landing').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  document.querySelector('.quiz-dropdown').classList.add('hidden');
  document.querySelector('.stats-area').classList.add('hidden');
  document.querySelector('.module-title').textContent = 'Support Mode';
  renderSupportMode();
  saveState();
  console.log('Entered Support Mode');
}

function refreshCurrentView() {
  if (currentMode === 'training') {
    if (current.mode === 'selection') renderModuleSelection();
    else if (current.mode === 'material') renderLearningMaterial();
    else if (current.mode === 'quiz') renderQuestion();
    else if (current.mode === 'certificate') showCertificate(current.certificate.moduleName, current.certificate.timestamp, current.certificate.hash);
  } else if (currentMode === 'support') {
    renderSupportMode();
  }
  console.log('Refreshed current view');
}

function showFeedback() {
  alert('Thank you for your feedback! Your input helps us improve DefendIQ.');
  console.log('Feedback submitted');
}

/* ---------- Training Mode Functions ---------- */
function renderTrainingDashboard() {
  if (!Object.keys(MODULES).length) {
    moduleBody.innerHTML = '<p>Loading modules...</p>';
    return;
  }
  current.mode = 'selection';
  saveState();
  document.querySelector('.module-title').textContent = 'Select a module to begin';
  moduleBody.innerHTML = `
    <div class="training-dashboard">
      <canvas id="globalProgressChart" style="max-width: 400px; margin: 20px auto;"></canvas>
      <div class="affirmation" id="globalAffirmation"></div>
      <div class="module-selection">
        <p>Select a module from the dropdown above to view materials and quizzes.</p>
      </div>
    </div>`;
  renderGlobalProgressChart();
}

function renderModuleSelection() {
  if (!Object.keys(MODULES).length) {
    moduleBody.innerHTML = '<p>Unable to load modules. Please check your connection or refresh the page.</p><button id="retryBtn" class="action-btn">Retry</button>';
    document.getElementById('retryBtn')?.addEventListener('click', () => loadQuestions());
    return;
  }
  current.mode = 'selection';
  saveState();
  const mod = MODULES[current.key];
  if (!mod) {
    closeModule();
    return;
  }
  const prog = keyProgressCache[current.key] || { answered: [], correct: [] };
  const completion = (prog.answered.length / mod.questions.length) * 100;

  moduleBody.innerHTML = `
    <div class="module-selection">
      <canvas id="moduleProgressChart" style="max-width: 300px; margin: 20px auto;"></canvas>
      <div class="affirmation" id="moduleAffirmation"></div>
      <button id="learningMaterialBtn" class="action-btn">Learning Material</button>
      <button id="takeQuizBtn" class="action-btn">Take a Quiz</button>
    </div>`;

  const ctx = document.getElementById('moduleProgressChart').getContext('2d');
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Module Progress'],
      datasets: [{
        label: 'Completion (%)',
        data: [completion],
        backgroundColor: '#8affc1',
        borderColor: '#ffffff',
        borderWidth: 1
      }]
    },
    options: {
      animation: false,
      scales: { y: { beginAtZero: true, max: 100 } },
      plugins: { legend: { display: false }, title: { display: true, text: `${mod.title} Progress`, color: '#ffffff' } }
    }
  });

  const affirmations = [
    completion < 30 ? "You're starting strong! Dive into this module!" :
    completion < 60 ? "You're making great progress! Keep it up!" :
    completion < 100 ? "Almost done! You're killing it!" :
    "Module complete! You're a cybersecurity star!"
  ];
  document.getElementById('moduleAffirmation').textContent = affirmations[0];

  document.getElementById('learningMaterialBtn').addEventListener('click', () => {
    current.mode = 'material';
    saveState();
    renderLearningMaterial();
  });
  document.getElementById('takeQuizBtn').addEventListener('click', () => {
    current.mode = 'quiz';
    saveState();
    renderQuestion();
  });
}

function renderLearningMaterial() {
  if (!Object.keys(MODULES).length || !MODULES[current.key]) {
    moduleBody.innerHTML = '<p>Unable to load modules. Please check your connection or refresh the page.</p><button id="retryBtn" class="action-btn">Retry</button>';
    document.getElementById('retryBtn')?.addEventListener('click', () => loadQuestions());
    return;
  }
  current.mode = 'material';
  saveState();
  const mod = MODULES[current.key];
  moduleBody.innerHTML = `
    <div class="learning-material">
      <h3>Learning Points for ${mod.title}</h3>
      <ul>
        ${mod.points.map(point => `<li>${sanitize(point)}</li>`).join('')}
      </ul>
      <button id="backToSelectionBtn" class="action-btn">Back to Module</button>
    </div>`;
  document.getElementById('backToSelectionBtn').addEventListener('click', () => {
    current.mode = 'selection';
    saveState();
    renderModuleSelection();
  });
}

async function renderQuestion() {
  if (!Object.keys(MODULES).length || !MODULES[current.key]) {
    moduleBody.innerHTML = '<p>Unable to load modules. Please check your connection or refresh the page.</p><button id="retryBtn" class="action-btn">Retry</button>';
    document.getElementById('retryBtn')?.addEventListener('click', () => loadQuestions());
    return;
  }
  current.mode = 'quiz';
  saveState();
  const mod = MODULES[current.key];
  const qObj = mod.questions[current.idx];
  const prog = keyProgressCache[current.key] || { answered: [], correct: [] };
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
      } else if (prog.correct.includes(current.idx) && idx !== qObj.a) {
        ob.classList.add('incorrect');
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
      saveState();
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
        saveState();
        slideTransition('right');
        renderQuestion();
      }
    });
  }
}

/* ---------- Sanitize Helper ---------- */
function sanitize(s) {
  return String(s).replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ---------- Option Click Handler ---------- */
async function onOptionClicked(ev) {
  const btn = ev.currentTarget;
  const chosenIndex = Number(btn.dataset.i);
  const mod = MODULES[current.key];
  const qObj = mod.questions[current.idx];
  const prog = keyProgressCache[current.key] || { answered: [], correct: [] };

  if (prog.answered.includes(current.idx)) return;

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
    prog.correct.push(current.idx);
    flashNextButton();
    triggerConfetti(true);
  } else {
    stats.streak = 0;
    triggerConfetti(false);
  }

  prog.answered.push(current.idx);
  keyProgressCache[current.key] = prog;
  await saveModuleProgress(keyProgressCache);

  const nextBtn = moduleBody.querySelector('.next-btn');
  if (nextBtn) nextBtn.disabled = false;

  await updateModuleCompletionStats();
  await saveStats();
  animatePoints();
}

/* ---------- Optimized Confetti Animation ---------- */
function triggerConfetti(isCorrect) {
  const confetti = new JSConfetti();
  if (isCorrect) {
    confetti.addConfetti({
      confettiNumber: 100,
      confettiColors: ['#ff7a7a', '#ffd56b', '#8affc1', '#9fb4ff'],
      confettiRadius: 5,
      confettiSpeed: 5
    });
    setTimeout(() => confetti.clearCanvas(), 1000);
  } else {
    confetti.addConfetti({
      confettiNumber: 30,
      confettiColors: ['#c62828'],
      confettiRadius: 3,
      confettiSpeed: 3
    });
    setTimeout(() => confetti.clearCanvas(), 1000);
  }
}

/* ---------- Update Module Completion ---------- */
async function updateModuleCompletionStats() {
  const totalModules = Object.keys(MODULES).length;
  stats.completion = Math.round((stats.badges.length / totalModules) * 100);
  await saveStats();
  debounceRenderGlobalProgressChart();
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
async function finishModule() {
  if (!stats.badges.includes(MODULES[current.key].title)) {
    stats.badges.push(MODULES[current.key].title);
    triggerConfetti(true);
  }
  stats.points += 50;
  stats.streak += 1;
  await updateModuleCompletionStats();
  await saveStats();
  animatePoints();
  showCertificate(MODULES[current.key].title);
}

/* ---------- Close Module ---------- */
function closeModule() {
  current = { key: null, idx: 0, mode: 'selection', certificate: null };
  saveState();
  moduleSelect.selectedIndex = 0;
  moduleBody.innerHTML = `
    <div class="learning-tip" id="learningTips"></div>
    <canvas id="globalProgressChart" style="max-width: 400px; margin: 20px auto;"></canvas>
    <div class="affirmation" id="globalAffirmation"></div>`;
  document.querySelector('.module-title').textContent = 'Select a module to begin';
  startLearningTips();
  debounceRenderGlobalProgressChart();
}

/* ---------- Certificate Rendering & Actions ---------- */
function showCertificate(moduleName, timestamp = new Date().toISOString(), hash = generateHash(moduleName + timestamp)) {
  current.mode = 'certificate';
  current.certificate = { moduleName, timestamp, hash };
  saveState();
  const verifyUrl = `https://api.defendiq.com/verify?hash=${hash}`;
  const qrCodeId = 'qrcode-' + hash;

  moduleBody.innerHTML = `
    <div class="certificate-wrapper">
      <div class="certificate-card" id="certificateCard">
        <div class="cert-inner">
          <h1 class="cert-title">Certificate of Appreciation</h1>
          <div contenteditable="true" id="certName" class="cert-name" aria-label="Recipient name">${userProfile ? userProfile.name : 'Name Surname'}</div>
          <p class="cert-body">This certificate is presented to the recipient in recognition of successful completion of the <span class="module-name">${sanitize(moduleName)}</span> training module.</p>
          <div class="cert-meta">
            <div>Date: <span id="certDate">${new Date(timestamp).toLocaleDateString()}</span></div>
            <div>Certificate ID: <span id="certHash">${hash}</span></div>
          </div>
          <div class="cert-signature">Signature: Jonas Mashifane, Cybersecurity Lead</div>
          <div id="${qrCodeId}" class="cert-qr"></div>
          <div class="cert-logo">DefendIQ</div>
        </div>
      </div>
      <div class="cert-actions">
        <button id="printCert">Print</button>
        <button id="downloadPNG">Download PNG</button>
        <button id="downloadPDF">Download PDF</button>
        <button id="shareCert">Share</button>
        <button id="closeCert">Close Certificate</button>
      </div>
    </div>`;

  QRCode.toCanvas(document.getElementById(qrCodeId), verifyUrl, { width: 100, scale: 8 }, (err) => {
    if (err) console.error('QR Code generation failed:', err);
  });

  document.getElementById('printCert').addEventListener('click', () => window.print());
  document.getElementById('closeCert').addEventListener('click', () => closeModule());
  document.getElementById('downloadPNG').addEventListener('click', async () => await downloadCertificatePNG());
  document.getElementById('downloadPDF').addEventListener('click', async () => await downloadCertificatePDF());
  document.getElementById('shareCert').addEventListener('click', async () => await shareCertificate(verifyUrl, moduleName, hash));
}

/* ---------- Certificate Export Helpers ---------- */
async function downloadCertificatePNG() {
  const node = document.getElementById('certificateCard');
  if (!node) return alert('Certificate not ready');
  const canvas = await html2canvas(node, { scale: 4 });
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
  const canvas = await html2canvas(node, { scale: 4 });
  const imgData = canvas.toDataURL('image/png');
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: 'landscape' });
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight - 10);
  pdf.save('DefendIQ_Certificate.pdf');
}

async function shareCertificate(verifyUrl, moduleName, hash) {
  const node = document.getElementById('certificateCard');
  if (!node) return alert('Certificate not ready');
  const canvas = await html2canvas(node, { scale: 2 });
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  const file = new File([blob], 'DefendIQ_Certificate.png', { type: 'image/png' });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'DefendIQ Certificate',
        text: `I completed the ${moduleName} module on DefendIQ. Verify here: ${verifyUrl}\nCertificate ID: ${hash}`
      });
    } catch (err) {
      console.warn('Share canceled or failed:', err);
    }
  } else {
    try {
      await navigator.clipboard.writeText(verifyUrl);
      alert('Sharing not supported. Verification link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link:', err);
      alert('Sharing not supported. Please copy the link manually: ' + verifyUrl);
    }
  }
}

/* ---------- Hash Generation for Certificate ---------- */
function generateHash(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36).padStart(8, '0');
}

/* ---------- Initial Render State ---------- */
restoreState();
