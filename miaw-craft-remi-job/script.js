(() => {
  'use strict';

  const PROFESSIONS = {
    baker: { name: 'Baker', rank: 'A', icon: '🥐', color: '#E5A65B' },
    recruiter: { name: 'Recruiter', rank: '2', icon: '🧶', color: '#B97EB5' },
    courier: { name: 'Courier', rank: '3', icon: '📦', color: '#DD735D' },
    mechanic: { name: 'Mechanic', rank: '4', icon: '🔧', color: '#6D91B8' },
    barista: { name: 'Barista', rank: '5', icon: '☕', color: '#9C765E' },
    manager: { name: 'Manager', rank: '6', icon: '📣', color: '#6FAD79' }
  };

  // Job cards are original MIAW-CRAFT combinations. No point values are stored here.
  const JOBS = [
    ['J01','Morning Bakery Rush','🥯','line',['baker','courier','barista']],
    ['J02','New Hire Orientation','📎','triangle',['recruiter','manager','barista']],
    ['J03','Express Lunch Run','🛵','line',['courier','courier','baker']],
    ['J04','Workshop Tune-Up','⚙️','triangle',['mechanic','mechanic','manager']],
    ['J05','Coffee Break Meeting','🫖','line',['barista','manager','recruiter']],
    ['J06','Team Briefing','🗒️','triangle',['manager','manager','courier']],
    ['J07','Fresh Batch Dispatch','🥖','line',['baker','baker','courier']],
    ['J08','Talent Delivery','📬','triangle',['recruiter','courier','manager']],
    ['J09','Repair & Refresh','🧰','line',['mechanic','barista','mechanic']],
    ['J10','Café Recruitment Day','☕','triangle',['barista','recruiter','recruiter']],
    ['J11','Boss Needs Coffee','😼','line',['manager','barista','barista']],
    ['J12','Bakery Maintenance','🛠️','triangle',['baker','mechanic','mechanic']],
    ['J13','Parcel Sorting Shift','📦','line',['courier','manager','courier']],
    ['J14','Interview Snack Tray','🍪','triangle',['recruiter','baker','barista']],
    ['J15','Emergency Repair Crew','🚧','line',['manager','mechanic','courier']],
    ['J16','Office Breakfast','🥐','triangle',['baker','manager','recruiter']],
    ['J17','Recruitment Express','🏃','line',['recruiter','courier','recruiter']],
    ['J18','Machine Coffee Calibration','🧪','triangle',['mechanic','barista','manager']],
    ['J19','Bread Board Meeting','📋','line',['baker','manager','baker']],
    ['J20','Late-Night Delivery','🌙','triangle',['courier','barista','courier']],
    ['J21','Workshop Hiring','🪛','line',['mechanic','recruiter','manager']],
    ['J22','Café Supply Chain','🫘','triangle',['barista','courier','baker']],
    ['J23','Managerial Shuffle','🗂️','line',['manager','recruiter','mechanic']],
    ['J24','Perfect Morning Crew','🌤️','triangle',['baker','courier','manager']],
    ['J25','Double Espresso Shift','☕','line',['barista','barista','courier']],
    ['J26','Toolbox Delivery','🔩','triangle',['mechanic','courier','baker']],
    ['J27','Hiring Committee','🪪','line',['recruiter','manager','recruiter']],
    ['J28','Quality Control','✅','triangle',['manager','mechanic','barista']],
    ['J29','Bakery Interview','📝','line',['baker','recruiter','baker']],
    ['J30','Closing Shift','🔐','triangle',['barista','mechanic','courier']],
    ['J31','Supply Room Rescue','🧯','line',['courier','mechanic','manager']],
    ['J32','Team Snack Rotation','🍩','triangle',['manager','baker','barista']],
    ['J33','Courier Recruitment','📨','line',['courier','recruiter','manager']],
    ['J34','Machine Parts Pickup','🧲','triangle',['mechanic','courier','mechanic']],
    ['J35','Catering for HR','🥛','line',['barista','baker','recruiter']],
    ['J36','All-Hands Prep','📢','triangle',['manager','baker','mechanic']]
  ].map(([id,title,sticker,pattern,workers]) => ({id,title,sticker,pattern,workers}));

  const views = [...document.querySelectorAll('.view')];
  const els = Object.fromEntries([
    'homeView','singleSetupView','doubleSetupView','passView','jobView','singleModeBtn','doubleModeBtn',
    'startSingleBtn','startDoubleBtn','p1Name','p2Name','devicePlayerName','passPlayerName','readyPlayerName',
    'readyBtn','modeBadge','currentPlayerLabel','deviceBadge','jobSlots','endTurnBtn','brandBtn',
    'rulesBtn','rulesDialog','toast','soundBtn'
  ].map(id => [id, document.getElementById(id)]));

  const STORAGE = 'miawCraftJobStateV2';
  const OLD_STORAGE = 'miawCraftJobStateV1';
  let soundOn = true;
  let selectedIdentity = 'P1';
  let state = loadState();

  function defaultState() {
    return {
      mode: null,
      single: { names: ['Mochi','Yuki'], active: 0, jobs: [[null,null],[null,null]] },
      double: { name: 'Mochi', identity: 'P1', jobs: [null,null] }
    };
  }

  function isJobPair(value) {
    return Array.isArray(value) && value.length === 2 && value.every(Boolean);
  }

  function migrateOldState(old) {
    const fresh = defaultState();
    if (!old || !old.mode) return fresh;
    fresh.mode = old.mode;
    if (old.mode === 'single' && old.single) {
      const names = Array.isArray(old.single.names) ? old.single.names.slice(0,2) : ['Mochi','Yuki'];
      const active = old.single.active === 1 ? 1 : 0;
      const oldJobs = Array.isArray(old.single.jobs) ? old.single.jobs : [];
      const used = oldJobs.filter(Boolean);
      const p1a = oldJobs[0] && findJob(oldJobs[0]) ? oldJobs[0] : randomJob(used).id;
      used.push(p1a);
      const p1b = randomJob(used).id; used.push(p1b);
      const p2a = oldJobs[1] && findJob(oldJobs[1]) && !used.includes(oldJobs[1]) ? oldJobs[1] : randomJob(used).id;
      used.push(p2a);
      const p2b = randomJob(used).id;
      fresh.single = { names, active, jobs: [[p1a,p1b],[p2a,p2b]] };
    } else if (old.mode === 'double' && old.double) {
      const oldId = old.double.job && findJob(old.double.job) ? old.double.job : randomJob().id;
      const second = randomJob([oldId]).id;
      fresh.double = {
        name: old.double.name || 'Mochi',
        identity: old.double.identity || 'P1',
        jobs: [oldId, second]
      };
    }
    return fresh;
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE));
      if (saved) return { ...defaultState(), ...saved };
      const old = JSON.parse(localStorage.getItem(OLD_STORAGE));
      if (old) {
        const migrated = migrateOldState(old);
        localStorage.setItem(STORAGE, JSON.stringify(migrated));
        return migrated;
      }
    } catch (_) {}
    return defaultState();
  }

  function saveState() { localStorage.setItem(STORAGE, JSON.stringify(state)); }

  function showView(id) {
    views.forEach(v => v.classList.toggle('active', v.id === id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function randomJob(excludeIds = []) {
    const pool = JOBS.filter(j => !excludeIds.includes(j.id));
    return pool[Math.floor(Math.random() * pool.length)] || JOBS[Math.floor(Math.random() * JOBS.length)];
  }

  function findJob(id) { return JOBS.find(j => j.id === id) || null; }

  function drawUniqueJobs(count, seedIds = []) {
    const ids = [];
    const used = [...seedIds];
    for (let i = 0; i < count; i++) {
      const job = randomJob(used);
      ids.push(job.id);
      used.push(job.id);
    }
    return ids;
  }

  function startSingle() {
    const n1 = els.p1Name.value.trim() || 'Mochi';
    const n2 = els.p2Name.value.trim() || 'Yuki';
    const four = drawUniqueJobs(4);
    state.mode = 'single';
    state.single = { names: [n1,n2], active: 0, jobs: [[four[0],four[1]],[four[2],four[3]]] };
    saveState();
    showPass();
    ping(440);
  }

  function startDouble() {
    const name = els.devicePlayerName.value.trim() || (selectedIdentity === 'P1' ? 'Mochi' : 'Yuki');
    state.mode = 'double';
    state.double = { name, identity: selectedIdentity, jobs: drawUniqueJobs(2) };
    saveState();
    renderCurrentJobs();
    showView('jobView');
    ping(520);
  }

  function showPass() {
    const idx = state.single.active;
    const name = state.single.names[idx];
    els.passPlayerName.textContent = name;
    els.readyPlayerName.textContent = name;
    showView('passView');
  }

  function currentJobIds() {
    if (state.mode === 'single') return state.single.jobs[state.single.active];
    return state.double.jobs;
  }

  function allActiveJobIds() {
    if (state.mode === 'single') return state.single.jobs.flat().filter(Boolean);
    return state.double.jobs.filter(Boolean);
  }

  function renderCurrentJobs() {
    let ids;
    if (state.mode === 'single') {
      const s = state.single;
      ids = s.jobs[s.active];
      els.modeBadge.textContent = 'SINGLE DEVICE · 2 SECRET JOBS';
      els.currentPlayerLabel.textContent = `${s.names[s.active]}'s Job Choices`;
      els.deviceBadge.textContent = `P${s.active + 1}`;
      els.endTurnBtn.style.display = '';
    } else {
      ids = state.double.jobs;
      els.modeBadge.textContent = 'DOUBLE DEVICE · 2 PERSONAL JOBS';
      els.currentPlayerLabel.textContent = `${state.double.name}'s Job Choices`;
      els.deviceBadge.textContent = state.double.identity;
      els.endTurnBtn.style.display = 'none';
    }
    els.jobSlots.replaceChildren();
    ids.forEach((id, slot) => {
      const job = findJob(id);
      if (job) els.jobSlots.appendChild(createJobCard(job, slot));
    });
  }

  function createJobCard(job, slot) {
    const card = document.createElement('article');
    card.className = 'job-card';
    card.style.setProperty('--jobTint', PROFESSIONS[job.workers[0]].color);
    card.dataset.slot = String(slot);

    const top = document.createElement('div');
    top.className = 'job-card-top';
    top.innerHTML = `<span class="choice-label">PILIHAN ${slot === 0 ? 'A' : 'B'}</span><span class="job-code">JOB ${job.id.slice(1)}</span><span class="pattern-badge">${job.pattern.toUpperCase()}</span>`;

    const title = document.createElement('div');
    title.className = 'job-title-block';
    title.innerHTML = `<div class="job-sticker" style="--jobTint:${PROFESSIONS[job.workers[0]].color}">${job.sticker}</div><div><span class="job-label">JOB ORDER</span><h1>${job.title}</h1></div>`;

    const stage = document.createElement('div');
    stage.className = 'pattern-stage';
    stage.setAttribute('aria-label', `Pola ${job.title}`);
    stage.appendChild(buildPattern(job));

    const req = document.createElement('div');
    req.className = 'job-requirement';
    req.innerHTML = `<span>Susun TOP WORKER sesuai pola</span><strong>${job.workers.map(w => PROFESSIONS[w].name).join(' · ')}</strong>`;

    const note = document.createElement('div');
    note.className = 'job-note';
    note.textContent = job.pattern === 'line'
      ? 'Bentuk tiga TOP WORKER dalam satu garis. Garis boleh diputar mengikuti enam arah papan hex.'
      : 'Bentuk tiga TOP WORKER pada tiga hex yang saling bersebelahan membentuk segitiga. Pola boleh diputar.';

    const actions = document.createElement('div');
    actions.className = 'card-actions';
    actions.innerHTML = `<button class="secondary-btn success-btn" type="button" data-action="complete" data-slot="${slot}"><span>✓</span> Selesai</button><button class="secondary-btn" type="button" data-action="reroll" data-slot="${slot}"><span>↻</span> Ganti</button>`;

    card.append(top, title, stage, req, note, actions);
    return card;
  }

  function buildPattern(job) {
    const canvas = document.createElement('div');
    canvas.className = 'pattern-canvas';
    const positions = job.pattern === 'line'
      ? [{x:20,y:54},{x:99,y:54},{x:178,y:54}]
      : [{x:99,y:16},{x:42,y:105},{x:156,y:105}];
    const centers = positions.map(p => ({x:p.x+41,y:p.y+41}));
    const edges = job.pattern === 'line' ? [[0,1],[1,2]] : [[0,1],[1,2],[2,0]];
    edges.forEach(([a,b]) => {
      const dx = centers[b].x - centers[a].x;
      const dy = centers[b].y - centers[a].y;
      const length = Math.hypot(dx,dy);
      const angle = Math.atan2(dy,dx) * 180 / Math.PI;
      const line = document.createElement('div');
      line.className = 'pattern-line';
      line.style.left = `${centers[a].x}px`;
      line.style.top = `${centers[a].y}px`;
      line.style.width = `${length}px`;
      line.style.transform = `rotate(${angle}deg)`;
      canvas.appendChild(line);
    });
    job.workers.forEach((w,i) => {
      const p = PROFESSIONS[w];
      const node = document.createElement('div');
      node.className = 'pattern-node';
      node.style.left = `${positions[i].x}px`;
      node.style.top = `${positions[i].y}px`;
      node.style.setProperty('--nodeColor', p.color);
      node.innerHTML = `<div><span>${p.icon}</span><small>${p.rank} · ${p.name}</small></div>`;
      canvas.appendChild(node);
    });
    return canvas;
  }

  function replaceJob(slot, completed = false) {
    if (![0,1].includes(slot)) return;
    const exclude = allActiveJobIds();
    if (state.mode === 'single') {
      const s = state.single;
      s.jobs[s.active][slot] = randomJob(exclude).id;
    } else {
      state.double.jobs[slot] = randomJob(exclude).id;
    }
    saveState();
    renderCurrentJobs();
    toast(completed ? `Pilihan ${slot === 0 ? 'A' : 'B'} selesai. Job baru diberikan.` : `Pilihan ${slot === 0 ? 'A' : 'B'} diganti.`);
    ping(completed ? 660 : 560);
  }

  function endTurn() {
    if (state.mode !== 'single') return;
    state.single.active = 1 - state.single.active;
    saveState();
    showPass();
    ping(360);
  }

  function resetToHome() {
    if (state.mode && !confirm('Kembali ke menu? Dua Job aktif tetap tersimpan di perangkat ini.')) return;
    showView('homeView');
  }

  function toast(text) {
    els.toast.textContent = text;
    els.toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => els.toast.classList.remove('show'), 1800);
  }

  function ping(freq = 500) {
    if (!soundOn || !window.AudioContext) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .08);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + .08);
    } catch (_) {}
  }

  els.singleModeBtn.addEventListener('click', () => showView('singleSetupView'));
  els.doubleModeBtn.addEventListener('click', () => showView('doubleSetupView'));
  document.querySelectorAll('[data-back-home]').forEach(b => b.addEventListener('click', () => showView('homeView')));
  els.startSingleBtn.addEventListener('click', startSingle);
  els.startDoubleBtn.addEventListener('click', startDouble);
  els.readyBtn.addEventListener('click', () => { renderCurrentJobs(); showView('jobView'); ping(520); });
  els.jobSlots.addEventListener('click', event => {
    const button = event.target.closest('button[data-action][data-slot]');
    if (!button) return;
    const slot = Number(button.dataset.slot);
    replaceJob(slot, button.dataset.action === 'complete');
  });
  els.endTurnBtn.addEventListener('click', endTurn);
  els.brandBtn.addEventListener('click', resetToHome);
  els.rulesBtn.addEventListener('click', () => els.rulesDialog.showModal());
  els.soundBtn.addEventListener('click', () => { soundOn = !soundOn; els.soundBtn.textContent = soundOn ? '♪' : '×'; toast(soundOn ? 'Sound on' : 'Sound off'); });
  document.querySelectorAll('.identity-card').forEach(btn => btn.addEventListener('click', () => {
    selectedIdentity = btn.dataset.identity;
    document.querySelectorAll('.identity-card').forEach(b => b.classList.toggle('selected', b === btn));
    els.devicePlayerName.value = selectedIdentity === 'P1' ? 'Mochi' : 'Yuki';
  }));

  // Privacy-first restore. Single-device sessions always reopen on the pass screen.
  if (state.mode === 'single' && Array.isArray(state.single.jobs) && state.single.jobs.length === 2 && state.single.jobs.every(isJobPair)) {
    els.p1Name.value = state.single.names[0];
    els.p2Name.value = state.single.names[1];
    showPass();
  } else if (state.mode === 'double' && isJobPair(state.double.jobs)) {
    selectedIdentity = state.double.identity || 'P1';
    els.devicePlayerName.value = state.double.name || 'Mochi';
    document.querySelectorAll('.identity-card').forEach(b => b.classList.toggle('selected', b.dataset.identity === selectedIdentity));
    renderCurrentJobs();
    showView('jobView');
  } else {
    showView('homeView');
  }
})();
