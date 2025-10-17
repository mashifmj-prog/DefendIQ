/* Quiz and module logic */
async function loadQuestions(attempt = 1, maxAttempts = 3) {
  try {
    if (Object.keys(MODULES).length) return;
    const response = await fetch('questions.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const text = await response.text();
    MODULES = JSON.parse(text);
    const options = Object.keys(MODULES).map(key => `<option value="${key}">${MODULES[key].title}</option>`).join('');
    moduleSelect.innerHTML = `<option value="" disabled selected>Select a module</option>${options}<option value="exit">Exit</option>`;
    await restoreState();
    if (getMode() === 'training') debounceRenderGlobalProgressChart();
    startLearningTips();
  } catch (err) {
    console.error(`Attempt ${attempt} failed to load questions.json:`, err.message);
    if (attempt < maxAttempts) {
      console.log(`Retrying... (${attempt + 1}/${maxAttempts})`);
      return setTimeout(() => loadQuestions(attempt + 1, maxAttempts), 1000);
    }
    console.error('All attempts to load questions.json failed.');
    alert('Error loading questions. Please check your connection or try again later.');
    MODULES = {};
    current = { key: null, idx: 0, mode: 'selection', certificate: null };
    saveState();
    moduleBody.innerHTML = '<p>Unable to load modules. Please check your connection or refresh the page.</p><button id="retryBtn" class="action-btn">Retry</button>';
    document.getElementById('retryBtn')?.addEventListener('click', () => loadQuestions());
    closeModule();
  }
}

function closeModule() {
  current = { key: null, idx: 0, mode: 'selection', certificate: null };
  saveState();
  moduleBody.innerHTML = `
    <div class="module-selection">
      <p>Select a module from the dropdown to begin.</p>
      <canvas id="globalProgressChart" style="max-width: 400px; margin: 20px auto;"></canvas>
      <div class="affirmation" id="globalAffirmation"></div>
    </div>`;
  document.querySelector('.module-title').textContent = 'Select a module to begin';
  debounceRenderGlobalProgressChart();
}

function openModule(key) {
  current.key = key;
  current.idx = 0;
  current.mode = 'selection';
  current.certificate = null;
  saveState();
  renderModuleSelection();
  const title = MODULES[key] ? MODULES[key].title : key;
  document.querySelector('.module-title').textContent = title;
}

async function renderModuleSelection() {
  if (!Object.keys(MODULES).length) {
    moduleBody.innerHTML = '<p>Unable to load modules. Please check your connection or refresh the page.</p><button id="retryBtn" class="action-btn">Retry</button>';
    document.getElementById('retryBtn')?.addEventListener('click', () => loadQuestions());
    return;
  }
  current.mode = 'selection';
  saveState();
  const mod = MODULES[current.key];
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

async function onOptionClicked(e) {
  const idx = Number(e.target.dataset.i);
  const mod = MODULES[current.key];
  const qObj = mod.questions[current.idx];
  let prog = keyProgressCache[current.key] || { answered: [], correct: [] };

  if (!prog.answered.includes(current.idx)) {
    prog.answered.push(current.idx);
    if (qObj.opts[idx] === qObj.opts[qObj.a]) {
      prog.correct.push(current.idx);
      stats.points += 10;
      stats.streak++;
      confetti({ particleCount: 50, spread: 70 });
      e.target.classList.add('correct');
    } else {
      stats.streak = 0;
      e.target.classList.add('incorrect');
      moduleBody.querySelectorAll('.opt-btn').forEach(ob => {
        if (mod.questions[current.idx].opts[Number(ob.dataset.i)] === qObj.opts[qObj.a]) {
          ob.classList.add('correct');
        }
      });
    }
    moduleBody.querySelectorAll('.opt-btn').forEach(btn => btn.disabled = true);
    moduleBody.querySelector('.next-btn').disabled = false;

    stats.completion = Object.keys(MODULES).reduce((acc, key) => {
      const p = keyProgressCache[key] || { answered: [] };
      return acc + (p.answered.length / MODULES[key].questions.length) * 100;
    }, 0) / Object.keys(MODULES).length;

    await saveModuleProgress({ ...keyProgressCache, [current.key]: prog });
    await saveStats();
    refreshStatsUI();

    if (prog.answered.length === mod.questions.length && !stats.badges.includes(mod.title)) {
      stats.badges.push(mod.title);
      await saveStats();
      refreshStatsUI();
      if (current.idx === mod.questions.length - 1) {
        const timestamp = new Date().toISOString();
        const hash = btoa(timestamp + mod.title);
        current.certificate = { moduleName: mod.title, timestamp, hash };
        saveState();
      }
    }
  }
}

async function finishModule() {
  const mod = MODULES[current.key];
  const prog = keyProgressCache[current.key] || { answered: [], correct: [] };
  if (prog.answered.length === mod.questions.length) {
    const timestamp = new Date().toISOString();
    const hash = btoa(timestamp + mod.title);
    current.certificate = { moduleName: mod.title, timestamp, hash };
    saveState();
    showCertificate(mod.title, timestamp, hash);
  } else {
    current.idx++;
    saveState();
    slideTransition('right');
    renderQuestion();
  }
}

function showCertificate(moduleName, timestamp, hash) {
  current.mode = 'certificate';
  saveState();
  const certUrl = `https://mashifmj-prog.github.io/DefendIQ/certificate?module=${encodeURIComponent(moduleName)}&hash=${hash}`;
  moduleBody.innerHTML = `
    <div class="certificate-wrapper">
      <div class="certificate-card">
        <div class="cert-title">Certificate of Completion</div>
        <div class="cert-name">${sanitize(userProfile?.name || 'User')}</div>
        <div class="cert-body">
          Has successfully completed the <span class="module-name">${sanitize(moduleName)}</span> module on DefendIQ, demonstrating proficiency in cybersecurity awareness.
        </div>
        <div class="cert-meta">
          <div>Date: ${new Date(timestamp).toLocaleDateString()}</div>
          <div>Certificate ID: ${hash.slice(0, 8)}</div>
        </div>
        <div class="cert-signature">Signed: Jonas Mashifane</div>
        <canvas id="qrCode" class="cert-qr"></canvas>
        <div class="cert-logo">🛡️ DefendIQ</div>
        <div class="cert-actions">
          <button id="downloadCertBtn" class="action-btn">Download PDF</button>
          <button id="backToModuleBtn" class="action-btn">Back to Module</button>
        </div>
      </div>
    </div>`;

  QRCode.toCanvas(document.getElementById('qrCode'), certUrl, { width: 100, height: 100 }, err => {
    if (err) console.error('QR code generation failed:', err);
  });

  document.getElementById('downloadCertBtn').addEventListener('click', async () => {
    const certCard = document.querySelector('.certificate-card');
    const canvas = await html2canvas(certCard);
    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    pdf.save(`${moduleName}_Certificate.pdf`);
  });

  document.getElementById('backToModuleBtn').addEventListener('click', () => {
    current.mode = 'selection';
    saveState();
    renderModuleSelection();
  });
}

function slideTransition(direction) {
  moduleBody.style.transition = 'transform 0.3s ease';
  moduleBody.style.transform = `translateX(${direction === 'left' ? '100%' : '-100%'})`;
  setTimeout(() => {
    moduleBody.style.transition = 'none';
    moduleBody.style.transform = 'translateX(0)';
  }, 300);
}
