'use strict';

const STORAGE_KEY = 'miau-umm-party-v1';
const RULE_POINTS = [5, 10, 15];

const seedPlayers = [
  { id: crypto.randomUUID(), name: 'Oyen', team: 'A' },
  { id: crypto.randomUUID(), name: 'Milo', team: 'A' },
  { id: crypto.randomUUID(), name: 'Luna', team: 'B' },
  { id: crypto.randomUUID(), name: 'Tomo', team: 'B' }
];

const seedCards = [
  ['Payung','Kompas','Donat','Gunung Api','Kamera','Helikopter','Panda','Kulkas'],
  ['Astronaut','Sepeda','Popcorn','Mercusuar','Kaktus','Piano','Pelangi','Koper'],
  ['Pizza','Robot','Piramida','Teropong','Sandal','Gurita','Kembang Api','Kapal Selam'],
  ['Cokelat','Jerapah','Lift','Mahkota','Sikat Gigi','Bumerang','Bulan','Traktor'],
  ['Es Krim','Detektif','Semangka','Kastel','Mikrofon','Dinosaurus','Jam Pasir','Roket'],
  ['Sushi','Hujan','Penyihir','Bantal','Kapal Bajak Laut','Magnet','Kupu-kupu','Biola'],
  ['Lampu Lalu Lintas','Nanas','Vampir','Skateboard','Gunung Es','Kacamata','Kanguru','Gitar'],
  ['Bakso','Saturnus','Pemadam Kebakaran','Topi Koboi','Kipas Angin','Koala','Peta','Mesin Cuci'],
  ['Taksi','Lebah','Candi','Sendok','Peluit','Naga','Tenda','Kelereng'],
  ['Mie Goreng','Pinguin','Kunci','Jembatan','Drum','Bola Basket','Ubur-ubur','Senter'],
  ['Kereta Api','Jagung','Hantu','Papan Selancar','Air Terjun','Dompet','Flamingo','Trompet'],
  ['Martabak','Planet Mars','Polisi','Jas Hujan','Blender','Zebra','Buku Harian','Kapal Pesiar'],
  ['Bus Sekolah','Kepiting','Museum','Garpu','Pelampung','Unicorn','Hammock','Yo-yo'],
  ['Roti Bakar','Anjing Laut','Gembok','Terowongan','Saksofon','Bola Tenis','Bintang Laut','Lilin'],
  ['Pesawat','Stroberi','Mumi','Sepatu Roda','Gurun','Jam Tangan','Burung Hantu','Ukulele'],
  ['Sate','Bumi','Dokter','Sweater','Toaster','Badak','Surat','Perahu Karet'],
  ['Ambulans','Lobster','Perpustakaan','Pisau Mentega','Kacamata Renang','Putri Duyung','Kursi Goyang','Gasing'],
  ['Pancake','Beruang Kutub','Kartu ATM','Jalan Tol','Keyboard','Bola Voli','Terumbu Karang','Lentera'],
  ['Balon Udara','Blueberry','Zombi','Skuter','Hutan','Alarm','Elang','Harmonika'],
  ['Rendang','Matahari','Perawat','Jaket','Rice Cooker','Kuda Nil','Kartu Pos','Kano'],
  ['Becak','Udang','Akuarium','Sumpit','Ban Renang','Peri','Bean Bag','Layang-layang'],
  ['Croissant','Serigala','Kartu Kunci','Rel Kereta','Mixer Musik','Bola Golf','Kerang','Lampu Tidur'],
  ['Jet Tempur','Mangga','Monster','Roller Skate','Savana','Stopwatch','Merak','Seruling'],
  ['Nasi Uduk','Meteor','Guru','Sarung Tangan','Microwave','Rusa','Amplop','Speedboat'],
  ['Ojek','Cumi-cumi','Galeri Seni','Spatula','Jaket Pelampung','Raksasa','Sofa','Ketapel'],
  ['Wafel','Rubah','Password','Trotoar','Headphone','Bola Bowling','Mutiara','Obor'],
  ['Drone','Kiwi','Alien','Monopoli','Danau','Kalender','Burung Beo','Tamborin'],
  ['Gado-gado','Komet','Koki','Syal','Dispenser','Gajah','Stempel','Rakit'],
  ['Kereta Gantung','Siput','Kebun Binatang','Centong','Snorkel','Jin','Kasur','Frisbee'],
  ['Bagel','Harimau','Barcode','Bundaran','Speaker','Bola Biliar','Rumput Laut','Lampu Neon']
].map((words, i) => ({ id: crypto.randomUUID(), name: `Kartu ${String(i + 1).padStart(2,'0')}`, words }));

const seedRules = [
  { id: crypto.randomUUID(), title: 'Mode Robot', description: 'Saat tim ini berbicara, gunakan gaya suara robot.' },
  { id: crypto.randomUUID(), title: 'Tanpa “Ini / Itu”', description: 'Tim ini tidak boleh mengucapkan kata “ini” atau “itu”.' },
  { id: crypto.randomUUID(), title: 'Awalan S Terlarang', description: 'Tim ini tidak boleh mengucapkan kata yang diawali huruf S.' },
  { id: crypto.randomUUID(), title: 'Suara Kecil', description: 'Describer harus berbicara dengan suara pelan. Jangan sampai tidak terdengar.' },
  { id: crypto.randomUUID(), title: 'Satu Tangan di Kepala', description: 'Selama menjelaskan, describer harus menjaga satu tangan tetap di atas kepala.' },
  { id: crypto.randomUUID(), title: 'Tanpa Menunjuk', description: 'Tim ini tidak boleh menunjuk benda, pemain, atau arah sebagai clue.' },
  { id: crypto.randomUUID(), title: 'Meong Setelah Benar', description: 'Setelah sebuah kata berhasil ditebak, describer harus mengatakan “meong” sebelum lanjut.' },
  { id: crypto.randomUUID(), title: 'Tanpa “Yang”', description: 'Tim ini tidak boleh mengucapkan kata “yang”.' },
  { id: crypto.randomUUID(), title: 'Kalimat Pendek', description: 'Setiap kalimat clue maksimal sekitar 5 kata. Lawan menjadi juri.' },
  { id: crypto.randomUUID(), title: 'Tanpa Gestur', description: 'Describer hanya boleh memakai kata-kata; jangan pakai gerakan tubuh sebagai clue.' },
  { id: crypto.randomUUID(), title: 'Awalan B Terlarang', description: 'Tim ini tidak boleh mengucapkan kata yang diawali huruf B.' },
  { id: crypto.randomUUID(), title: 'Suara Penyiar', description: 'Describer harus berbicara seperti pembawa berita sepanjang giliran.' },
  { id: crypto.randomUUID(), title: 'Tanpa “Dia / Mereka”', description: 'Tim ini tidak boleh memakai kata “dia” atau “mereka”.' },
  { id: crypto.randomUUID(), title: 'Muka Serius', description: 'Describer tidak boleh tertawa saat menjelaskan. Senyum masih boleh.' },
  { id: crypto.randomUUID(), title: 'Akhiri dengan Meong', description: 'Setiap clue baru harus diakhiri dengan kata “meong”.' }
];

function defaultData() {
  return {
    players: structuredClone(seedPlayers),
    cards: structuredClone(seedCards),
    rules: structuredClone(seedRules),
    settings: { theme: 'light', sound: true, timer: 45, target: 20 }
  };
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData();
    const parsed = JSON.parse(raw);
    return {
      players: Array.isArray(parsed.players) ? parsed.players : structuredClone(seedPlayers),
      cards: Array.isArray(parsed.cards) ? parsed.cards : structuredClone(seedCards),
      rules: Array.isArray(parsed.rules) ? parsed.rules : structuredClone(seedRules),
      settings: { ...defaultData().settings, ...(parsed.settings || {}) }
    };
  } catch {
    return defaultData();
  }
}

let db = loadData();
let game = null;
let timerHandle = null;
let lastTickSecond = null;
let pausedForRule = false;
let audioCtx = null;
let toastTimer = null;
let editing = null;

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

const els = {
  setupPanel: $('#setupPanel'), gamePanel: $('#gamePanel'),
  teamAPlayers: $('#teamAPlayers'), teamBPlayers: $('#teamBPlayers'),
  teamACount: $('#teamACount'), teamBCount: $('#teamBCount'),
  timerSelect: $('#timerSelect'), targetSelect: $('#targetSelect'),
  startGameBtn: $('#startGameBtn'), themeToggle: $('#themeToggle'), soundToggle: $('#soundToggle'),
  manageDialog: $('#manageDialog'), manageBtn: $('#manageBtn'),
  scoreA: $('#scoreA'), scoreB: $('#scoreB'), trackA: $('#trackA'), trackB: $('#trackB'), roundNo: $('#roundNo'),
  rulesMiniA: $('#rulesMiniA'), rulesMiniB: $('#rulesMiniB'),
  activeTeamBadge: $('#activeTeamBadge'), describerName: $('#describerName'), timerText: $('#timerText'),
  timerRing: $('#timerRing'), timerProgress: $('#timerProgress'), turnButton: $('#turnButton'), endTurnBtn: $('#endTurnBtn'),
  cardTitle: $('#cardTitle'), cardProgress: $('#cardProgress'), wordCard: $('#wordCard'), skipCardBtn: $('#skipCardBtn'),
  bellTarget: $('#bellTarget'), bellBtn: $('#bellBtn'), undoBtn: $('#undoBtn'), activeRulesList: $('#activeRulesList'),
  formDialog: $('#formDialog'), entityForm: $('#entityForm'), formEyebrow: $('#formEyebrow'), formTitle: $('#formTitle'), formFields: $('#formFields'),
  ruleDialog: $('#ruleDialog'), ruleRevealTitle: $('#ruleRevealTitle'), ruleRevealDescription: $('#ruleRevealDescription'), ruleRevealTeam: $('#ruleRevealTeam'), continueRuleBtn: $('#continueRuleBtn'),
  winnerDialog: $('#winnerDialog'), winnerTitle: $('#winnerTitle'), winnerSubtitle: $('#winnerSubtitle'), rematchBtn: $('#rematchBtn'), backSetupBtn: $('#backSetupBtn'),
  toast: $('#toast')
};

function saveData() { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); }
function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
function teamName(team) { return team === 'A' ? 'Tim Oren' : 'Tim Tuxedo'; }
function teamEmoji(team) { return team === 'A' ? '🐈' : '🐈‍⬛'; }
function otherTeam(team) { return team === 'A' ? 'B' : 'A'; }
function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function escapeHTML(s='') { return String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2200);
}

function ensureAudio() {
  if (!db.settings.sound) return null;
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone(freq, duration=.11, type='sine', gain=.08, delay=0) {
  const ctx = ensureAudio(); if (!ctx) return;
  const osc = ctx.createOscillator(); const g = ctx.createGain();
  osc.type = type; osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
  g.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + delay + .01);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);
  osc.connect(g).connect(ctx.destination);
  osc.start(ctx.currentTime + delay); osc.stop(ctx.currentTime + delay + duration + .02);
}
function soundCorrect() { tone(660,.09,'sine',.07); tone(880,.11,'sine',.06,.07); }
function soundBell() { tone(980,.18,'triangle',.13); tone(1320,.22,'triangle',.10,.05); }
function soundTick() { tone(430,.04,'square',.035); }
function soundRule() { tone(420,.12,'sine',.06); tone(630,.12,'sine',.06,.1); tone(860,.18,'sine',.06,.2); }
function soundWin() { [523,659,784,1047].forEach((f,i)=>tone(f,.22,'triangle',.07,i*.11)); }

function applyTheme() {
  document.documentElement.dataset.theme = db.settings.theme;
  els.themeToggle.textContent = db.settings.theme === 'dark' ? '☀️' : '🌙';
  els.soundToggle.textContent = db.settings.sound ? '🔊' : '🔇';
}

function renderSetup() {
  const renderPlayers = (team, container, countEl) => {
    const players = db.players.filter(p => p.team === team);
    countEl.textContent = `${players.length} pemain`;
    container.innerHTML = players.length
      ? players.map(p => `<span class="player-chip">${escapeHTML(p.name)}</span>`).join('')
      : '<span class="empty-state">Belum ada pemain.</span>';
  };
  renderPlayers('A', els.teamAPlayers, els.teamACount);
  renderPlayers('B', els.teamBPlayers, els.teamBCount);
  els.timerSelect.value = String(db.settings.timer);
  els.targetSelect.value = String(db.settings.target);
}

function makeGame() {
  return {
    score: { A: 0, B: 0 },
    activeTeam: 'A', round: 1,
    describerIndex: { A: 0, B: 0 },
    activeRules: { A: [], B: [] },
    triggeredRulePoints: { A: [], B: [] },
    cardDeck: shuffle(db.cards.map(c => c.id)), deckIndex: 0,
    currentCardId: null, guessed: new Set(),
    running: false, remaining: db.settings.timer, deadline: null,
    history: [], pendingRuleQueue: [],
    winner: null
  };
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i+1)); [a[i],a[j]] = [a[j],a[i]]; }
  return a;
}

function startGame() {
  const a = db.players.filter(p => p.team === 'A');
  const b = db.players.filter(p => p.team === 'B');
  if (!a.length || !b.length) return toast('Tambahkan minimal 1 pemain di setiap tim.');
  if (!db.cards.length) return toast('Tambahkan minimal 1 kartu kata.');
  db.settings.timer = Number(els.timerSelect.value);
  db.settings.target = Number(els.targetSelect.value);
  saveData();
  game = makeGame();
  els.setupPanel.classList.add('hidden');
  els.gamePanel.classList.remove('hidden');
  renderGame();
}

function resetGameToSetup() {
  stopTimer(); game = null;
  els.gamePanel.classList.add('hidden'); els.setupPanel.classList.remove('hidden');
  els.winnerDialog.close(); renderSetup();
}

function currentCard() { return db.cards.find(c => c.id === game?.currentCardId) || null; }

function drawCard() {
  if (!game || !db.cards.length) return;
  if (game.deckIndex >= game.cardDeck.length) {
    game.cardDeck = shuffle(db.cards.map(c => c.id)); game.deckIndex = 0;
  }
  game.currentCardId = game.cardDeck[game.deckIndex++];
  game.guessed = new Set();
  renderCard();
}

function renderCard() {
  if (!game) return;
  const card = currentCard();
  if (!card) {
    els.cardTitle.textContent = 'Kartu akan muncul saat timer dimulai';
    els.cardProgress.textContent = '0 / 8';
    els.wordCard.innerHTML = '<div class="empty-state">Tekan tombol Mulai.</div>';
    els.wordCard.classList.add('disabled');
    return;
  }
  els.cardTitle.textContent = card.name;
  els.cardProgress.textContent = `${game.guessed.size} / ${card.words.length}`;
  els.wordCard.innerHTML = card.words.map((w, i) => {
    const guessed = game.guessed.has(i);
    return `<button class="word-tile ${guessed ? 'guessed' : ''}" data-word-index="${i}" ${game.running && !guessed ? '' : 'disabled'}><span>${escapeHTML(w)}</span><span class="num">${i+1}</span></button>`;
  }).join('');
  els.wordCard.classList.toggle('disabled', !game.running);
}

function renderScoreTrack(team, el) {
  const target = db.settings.target;
  const visibleRulePoints = RULE_POINTS.filter(p => p < target);
  el.style.gridTemplateColumns = `repeat(${Math.min(target, 20)}, 1fr)`;
  el.innerHTML = Array.from({length: target}, (_,i) => {
    const n = i+1;
    return `<span class="score-dot ${n <= game.score[team] ? `reached team-${team.toLowerCase()}` : ''} ${visibleRulePoints.includes(n) ? 'rule-point' : ''} ${n===target ? 'finish' : ''}" title="${visibleRulePoints.includes(n) ? `Poin ${n}: buka Rule Card` : `Poin ${n}`}"></span>`;
  }).join('');
}

function renderRulesMini(team, el) {
  const rules = game.activeRules[team].map(id => db.rules.find(r => r.id===id)).filter(Boolean);
  el.innerHTML = rules.map((r,i)=>`<span class="rule-mini-dot" title="${escapeHTML(r.title)}">${i+1}</span>`).join('');
}

function getDescriber(team) {
  const players = db.players.filter(p => p.team === team);
  if (!players.length) return null;
  return players[game.describerIndex[team] % players.length];
}

function renderGame() {
  if (!game) return;
  els.scoreA.textContent = game.score.A; els.scoreB.textContent = game.score.B;
  renderScoreTrack('A', els.trackA); renderScoreTrack('B', els.trackB);
  renderRulesMini('A', els.rulesMiniA); renderRulesMini('B', els.rulesMiniB);
  els.roundNo.textContent = game.round;
  const t = game.activeTeam; const opponent = otherTeam(t); const describer = getDescriber(t);
  els.activeTeamBadge.textContent = `${teamEmoji(t)} ${teamName(t)}`;
  els.describerName.textContent = describer ? describer.name : 'Belum ada pemain';
  els.bellTarget.textContent = `Bell → +1 ${teamName(opponent)}`;
  els.turnButton.textContent = game.running ? 'Timer Berjalan…' : `Mulai ${db.settings.timer} Detik`;
  els.turnButton.disabled = game.running;
  els.endTurnBtn.disabled = !game.running;
  els.skipCardBtn.disabled = !game.running;
  els.bellBtn.disabled = !game.running;
  els.undoBtn.disabled = game.history.length === 0;
  renderTimer(); renderCard(); renderActiveRules();
}

function renderActiveRules() {
  if (!game) return;
  const list = game.activeRules[game.activeTeam].map(id => db.rules.find(r=>r.id===id)).filter(Boolean);
  els.activeRulesList.innerHTML = list.length
    ? list.map(r=>`<div class="rule-chip"><strong>${escapeHTML(r.title)}</strong>${escapeHTML(r.description)}</div>`).join('')
    : '<div class="rule-chip">Belum ada rule tambahan. 🐾</div>';
}

function renderTimer() {
  const total = db.settings.timer;
  const remain = game ? Math.max(0, game.remaining) : total;
  els.timerText.textContent = Math.ceil(remain);
  const circumference = 326.73;
  const progress = total ? remain / total : 0;
  els.timerProgress.style.strokeDashoffset = String(circumference * (1-progress));
  els.timerRing.classList.toggle('danger', game?.running && remain <= 10);
}

function startTurn() {
  if (!game || game.running) return;
  ensureAudio();
  if (!game.currentCardId) drawCard();
  game.running = true; game.remaining = db.settings.timer; game.deadline = Date.now() + game.remaining * 1000;
  lastTickSecond = null;
  timerHandle = setInterval(tick, 100);
  renderGame();
}

function tick() {
  if (!game?.running) return;
  game.remaining = Math.max(0, (game.deadline - Date.now()) / 1000);
  const sec = Math.ceil(game.remaining);
  if (sec <= 5 && sec > 0 && sec !== lastTickSecond) { soundTick(); lastTickSecond = sec; }
  renderTimer();
  if (game.remaining <= 0) endTurn(true);
}

function stopTimer() { clearInterval(timerHandle); timerHandle = null; }

function pauseTimerForRule() {
  if (!game?.running) return;
  game.remaining = Math.max(0, (game.deadline - Date.now()) / 1000);
  game.running = false; pausedForRule = true; stopTimer(); renderGame();
}

function resumeAfterRule() {
  if (!game || !pausedForRule || game.winner) return;
  const card = currentCard();
  if (card && game.guessed.size >= card.words.length) drawCard();
  pausedForRule = false; game.running = true; game.deadline = Date.now() + game.remaining*1000;
  timerHandle = setInterval(tick,100); renderGame();
}

function endTurn(byTimer=false) {
  if (!game) return;
  stopTimer(); game.running = false; game.remaining = 0; pausedForRule = false;
  if (!byTimer) soundTick();
  const oldTeam = game.activeTeam;
  game.describerIndex[oldTeam] += 1;
  game.activeTeam = otherTeam(oldTeam);
  game.round += 1;
  game.currentCardId = null; game.guessed = new Set();
  game.remaining = db.settings.timer;
  renderGame();
  toast(`Giliran ${teamName(game.activeTeam)}. ${teamEmoji(game.activeTeam)}`);
}

function addPoint(team, reason) {
  if (!game || game.winner) return;
  const before = game.score[team];
  game.score[team] = clamp(before + 1, 0, db.settings.target);
  game.history.push({ team, delta: 1, reason, triggeredRule: null });
  const entry = game.history.at(-1);

  for (const point of RULE_POINTS) {
    if (point < db.settings.target && before < point && game.score[team] >= point && !game.triggeredRulePoints[team].includes(point)) {
      game.triggeredRulePoints[team].push(point);
      const ruleId = drawRuleForTeam(team);
      if (ruleId) entry.triggeredRule = { team, point, ruleId };
      break;
    }
  }

  renderGame();
  if (game.score[team] >= db.settings.target) finishGame(team);
}

function drawRuleForTeam(team) {
  const used = new Set([...game.activeRules.A, ...game.activeRules.B]);
  let pool = db.rules.filter(r => !used.has(r.id));
  if (!pool.length) pool = db.rules.filter(r => !game.activeRules[team].includes(r.id));
  if (!pool.length) { toast('Semua rule card sudah terpakai.'); return null; }
  const rule = randomItem(pool);
  game.activeRules[team].push(rule.id);
  game.pendingRuleQueue.push({team, ruleId: rule.id});
  showNextRuleReveal();
  return rule.id;
}

function showNextRuleReveal() {
  if (!game?.pendingRuleQueue.length || els.ruleDialog.open) return;
  const pending = game.pendingRuleQueue.shift();
  const rule = db.rules.find(r=>r.id===pending.ruleId); if (!rule) return;
  const shouldPause = game.running;
  if (shouldPause) pauseTimerForRule(); else pausedForRule = false;
  els.ruleRevealTitle.textContent = rule.title;
  els.ruleRevealDescription.textContent = rule.description;
  els.ruleRevealTeam.textContent = `${teamEmoji(pending.team)} Berlaku untuk ${teamName(pending.team)}`;
  soundRule(); els.ruleDialog.showModal();
}

function undoPoint() {
  if (!game || !game.history.length) return;
  const last = game.history.pop();
  game.score[last.team] = Math.max(0, game.score[last.team] - last.delta);
  if (last.triggeredRule) {
    const {team, point, ruleId} = last.triggeredRule;
    game.triggeredRulePoints[team] = game.triggeredRulePoints[team].filter(p=>p!==point);
    game.activeRules[team] = game.activeRules[team].filter(id=>id!==ruleId);
  }
  renderGame(); toast('Poin terakhir dibatalkan.');
}

function markWord(index) {
  if (!game?.running || game.guessed.has(index)) return;
  game.guessed.add(index); soundCorrect(); addPoint(game.activeTeam, 'correct');
  if (game.winner) return;
  const card = currentCard();
  if (card && game.guessed.size >= card.words.length) {
    toast('8/8! Kartu baru 😺');
    setTimeout(()=> { if (game?.running) drawCard(); }, 450);
  } else renderCard();
}

function ringBell() {
  if (!game?.running) return;
  soundBell();
  els.bellBtn.classList.remove('ring'); void els.bellBtn.offsetWidth; els.bellBtn.classList.add('ring');
  addPoint(otherTeam(game.activeTeam), 'bell');
}

function finishGame(team) {
  stopTimer(); game.running = false; game.winner = team;
  soundWin(); renderGame();
  els.winnerTitle.textContent = `${teamEmoji(team)} ${teamName(team)} MENANG!`;
  els.winnerSubtitle.textContent = `Skor akhir ${game.score.A} – ${game.score.B}. Kucing juri mengesahkan kemenangan ini.`;
  els.winnerDialog.showModal();
}

function rematch() {
  els.winnerDialog.close(); game = makeGame(); renderGame();
}

function renderManager(tab='players') {
  $$('.tab').forEach(btn=>btn.classList.toggle('active', btn.dataset.tab===tab));
  $$('.tab-content').forEach(el=>el.classList.toggle('active', el.id===`tab-${tab}`));
  renderPlayersManager(); renderCardsManager(); renderRulesManager(); renderDataManager();
}

function renderPlayersManager() {
  const el = $('#tab-players');
  el.innerHTML = `
    <div class="manager-toolbar"><p>${db.players.length} pemain tersimpan. Tetapkan setiap pemain ke salah satu tim.</p><button class="primary-btn" data-add="player">+ Pemain</button></div>
    <div class="manager-list">${db.players.map(p=>`
      <div class="manager-item"><div class="manager-main"><strong>${escapeHTML(p.name)} <span class="badge">${teamEmoji(p.team)} ${teamName(p.team)}</span></strong></div>
      <div class="manager-actions"><button class="mini-btn" data-edit-player="${p.id}">Edit</button><button class="mini-btn danger" data-delete-player="${p.id}">Hapus</button></div></div>`).join('') || '<div class="empty-state">Belum ada pemain.</div>'}
    </div>`;
}

function renderCardsManager() {
  const el = $('#tab-cards');
  el.innerHTML = `
    <div class="manager-toolbar"><p>${db.cards.length} kartu • ${db.cards.reduce((n,c)=>n+c.words.length,0)} kata. Setiap kartu sebaiknya tepat 8 kata.</p><button class="primary-btn" data-add="card">+ Kartu</button></div>
    <div class="manager-list">${db.cards.map(c=>`
      <div class="manager-item"><div class="manager-main"><strong>${escapeHTML(c.name)} <span class="badge">${c.words.length} kata</span></strong><small>${c.words.map(escapeHTML).join(' • ')}</small></div>
      <div class="manager-actions"><button class="mini-btn" data-edit-card="${c.id}">Edit</button><button class="mini-btn danger" data-delete-card="${c.id}">Hapus</button></div></div>`).join('') || '<div class="empty-state">Belum ada kartu.</div>'}
    </div>`;
}

function renderRulesManager() {
  const el = $('#tab-rules');
  el.innerHTML = `
    <div class="manager-toolbar"><p>${db.rules.length} rule card. Rule muncul ketika skor melewati titik 🐾 5, 10, dan 15.</p><button class="primary-btn" data-add="rule">+ Rule</button></div>
    <div class="manager-list">${db.rules.map(r=>`
      <div class="manager-item"><div class="manager-main"><strong>🐾 ${escapeHTML(r.title)}</strong><small>${escapeHTML(r.description)}</small></div>
      <div class="manager-actions"><button class="mini-btn" data-edit-rule="${r.id}">Edit</button><button class="mini-btn danger" data-delete-rule="${r.id}">Hapus</button></div></div>`).join('') || '<div class="empty-state">Belum ada rule card.</div>'}
    </div>`;
}

function renderDataManager() {
  const el = $('#tab-data');
  const json = JSON.stringify(db, null, 2);
  el.innerHTML = `
    <div class="data-grid">
      <div class="data-card"><h3>Export</h3><p>Salin backup JSON. Cocok sebelum mengubah banyak kartu.</p><textarea class="export-box" id="exportBox" readonly>${escapeHTML(json)}</textarea><button class="secondary-btn" id="copyExportBtn">Salin JSON</button></div>
      <div class="data-card"><h3>Import</h3><p>Tempel backup JSON, lalu import. Data saat ini akan diganti.</p><textarea class="export-box" id="importBox" placeholder="Tempel JSON di sini..."></textarea><button class="primary-btn" id="importBtn">Import JSON</button></div>
      <div class="data-card"><h3>Reset Konten</h3><p>Kembalikan 4 pemain contoh, 30 kartu × 8 kata, dan 15 rule card bawaan.</p><button class="secondary-btn" id="resetSeedBtn">Reset ke Data Awal</button></div>
      <div class="data-card"><h3>Catatan</h3><p>Data memakai localStorage. Tidak ada akun, server, database online, atau upload otomatis.</p></div>
    </div>`;
}

function openEntityForm(type, id=null) {
  editing = {type, id};
  els.formEyebrow.textContent = id ? 'EDIT DATA' : 'TAMBAH DATA';
  if (type==='player') {
    const p = db.players.find(x=>x.id===id) || {name:'',team:'A'};
    els.formTitle.textContent = id ? 'Edit Pemain' : 'Tambah Pemain';
    els.formFields.innerHTML = `
      <div class="field"><label>Nama pemain</label><input name="name" maxlength="28" required value="${escapeHTML(p.name)}" placeholder="Contoh: Naya"></div>
      <div class="field"><label>Tim</label><select name="team"><option value="A" ${p.team==='A'?'selected':''}>🐈 Tim Oren</option><option value="B" ${p.team==='B'?'selected':''}>🐈‍⬛ Tim Tuxedo</option></select></div>`;
  } else if (type==='card') {
    const c = db.cards.find(x=>x.id===id) || {name:`Kartu ${String(db.cards.length+1).padStart(2,'0')}`,words:Array(8).fill('')};
    const words = [...c.words]; while(words.length<8) words.push('');
    els.formTitle.textContent = id ? 'Edit Kartu Kata' : 'Tambah Kartu Kata';
    els.formFields.innerHTML = `
      <div class="field"><label>Nama kartu</label><input name="name" maxlength="40" required value="${escapeHTML(c.name)}"></div>
      <div class="field"><label>8 kata</label><div class="words-editor">${words.slice(0,8).map((w,i)=>`<input name="word${i}" maxlength="40" required value="${escapeHTML(w)}" placeholder="Kata ${i+1}">`).join('')}</div><small>Gunakan kata/istilah yang bisa dijelaskan secara verbal.</small></div>`;
  } else {
    const r = db.rules.find(x=>x.id===id) || {title:'',description:''};
    els.formTitle.textContent = id ? 'Edit Rule Card' : 'Tambah Rule Card';
    els.formFields.innerHTML = `
      <div class="field"><label>Judul rule</label><input name="title" maxlength="45" required value="${escapeHTML(r.title)}" placeholder="Contoh: Mode Robot"></div>
      <div class="field"><label>Aturan</label><textarea name="description" maxlength="220" rows="4" required placeholder="Jelaskan pelanggaran yang bisa dinilai lawan.">${escapeHTML(r.description)}</textarea></div>`;
  }
  els.formDialog.showModal();
}

function saveEntity(form) {
  const fd = new FormData(form); const {type,id} = editing;
  if (type==='player') {
    const obj = { id: id || crypto.randomUUID(), name: String(fd.get('name')).trim(), team: fd.get('team') };
    if (id) db.players = db.players.map(p=>p.id===id?obj:p); else db.players.push(obj);
  } else if (type==='card') {
    const words = Array.from({length:8},(_,i)=>String(fd.get(`word${i}`)).trim()).filter(Boolean);
    if (words.length!==8) return toast('Kartu harus memiliki tepat 8 kata.');
    const obj = {id:id||crypto.randomUUID(), name:String(fd.get('name')).trim(), words};
    if(id) db.cards=db.cards.map(c=>c.id===id?obj:c); else db.cards.push(obj);
  } else {
    const obj = {id:id||crypto.randomUUID(), title:String(fd.get('title')).trim(), description:String(fd.get('description')).trim()};
    if(id) db.rules=db.rules.map(r=>r.id===id?obj:r); else db.rules.push(obj);
  }
  saveData(); renderSetup(); renderManager(type==='player'?'players':type==='card'?'cards':'rules'); els.formDialog.close(); toast('Data tersimpan.');
}

function deleteEntity(type,id) {
  const labels = {player:'pemain',card:'kartu',rule:'rule card'};
  if (!confirm(`Hapus ${labels[type]} ini?`)) return;
  if(type==='player') db.players=db.players.filter(x=>x.id!==id);
  if(type==='card') db.cards=db.cards.filter(x=>x.id!==id);
  if(type==='rule') db.rules=db.rules.filter(x=>x.id!==id);
  saveData(); renderSetup(); renderManager(type==='player'?'players':type==='card'?'cards':'rules'); toast('Data dihapus.');
}

function importData() {
  try {
    const parsed = JSON.parse($('#importBox').value);
    if (!Array.isArray(parsed.players)||!Array.isArray(parsed.cards)||!Array.isArray(parsed.rules)) throw new Error('Format tidak cocok');
    db = { ...defaultData(), ...parsed, settings:{...defaultData().settings,...(parsed.settings||{})} };
    saveData(); applyTheme(); renderSetup(); renderManager('data'); toast('Import berhasil.');
  } catch (e) { toast('JSON tidak valid atau format tidak cocok.'); }
}

function resetSeedData() {
  if (!confirm('Reset semua pemain, kartu, rule, dan setting ke data awal?')) return;
  db = defaultData(); saveData(); applyTheme(); renderSetup(); renderManager('data'); toast('Data awal dipulihkan.');
}

// Events
els.themeToggle.addEventListener('click',()=>{ db.settings.theme=db.settings.theme==='dark'?'light':'dark'; saveData(); applyTheme(); });
els.soundToggle.addEventListener('click',()=>{ db.settings.sound=!db.settings.sound; saveData(); applyTheme(); if(db.settings.sound) soundCorrect(); });
els.manageBtn.addEventListener('click',()=>{ renderManager('players'); els.manageDialog.showModal(); });
els.startGameBtn.addEventListener('click', startGame);
els.timerSelect.addEventListener('change',()=>{db.settings.timer=Number(els.timerSelect.value);saveData();});
els.targetSelect.addEventListener('change',()=>{db.settings.target=Number(els.targetSelect.value);saveData();});
els.turnButton.addEventListener('click', startTurn);
els.endTurnBtn.addEventListener('click',()=>endTurn(false));
els.skipCardBtn.addEventListener('click',()=>{ if(game?.running){drawCard(); toast('Kartu dilewati.');} });
els.bellBtn.addEventListener('click', ringBell);
els.undoBtn.addEventListener('click', undoPoint);
els.wordCard.addEventListener('click',(e)=>{ const btn=e.target.closest('[data-word-index]'); if(btn) markWord(Number(btn.dataset.wordIndex)); });
els.continueRuleBtn.addEventListener('click',()=>{ els.ruleDialog.close(); const shouldResume=pausedForRule; if (game?.pendingRuleQueue.length) { pausedForRule=shouldResume; showNextRuleReveal(); } else if (shouldResume) resumeAfterRule(); });
els.rematchBtn.addEventListener('click', rematch);
els.backSetupBtn.addEventListener('click', resetGameToSetup);
$('#homeBtn').addEventListener('click',()=>{ if(game && !confirm('Kembali ke setup? Game saat ini akan dihentikan.')) return; resetGameToSetup(); });

$$('[data-close-dialog]').forEach(btn=>btn.addEventListener('click',()=>document.getElementById(btn.dataset.closeDialog).close()));
$$('.tab').forEach(btn=>btn.addEventListener('click',()=>renderManager(btn.dataset.tab)));
els.entityForm.addEventListener('submit',(e)=>{e.preventDefault();saveEntity(e.currentTarget);});

els.manageDialog.addEventListener('click',(e)=>{
  const add=e.target.closest('[data-add]'); if(add) return openEntityForm(add.dataset.add);
  const ep=e.target.closest('[data-edit-player]'); if(ep) return openEntityForm('player',ep.dataset.editPlayer);
  const ec=e.target.closest('[data-edit-card]'); if(ec) return openEntityForm('card',ec.dataset.editCard);
  const er=e.target.closest('[data-edit-rule]'); if(er) return openEntityForm('rule',er.dataset.editRule);
  const dp=e.target.closest('[data-delete-player]'); if(dp) return deleteEntity('player',dp.dataset.deletePlayer);
  const dc=e.target.closest('[data-delete-card]'); if(dc) return deleteEntity('card',dc.dataset.deleteCard);
  const dr=e.target.closest('[data-delete-rule]'); if(dr) return deleteEntity('rule',dr.dataset.deleteRule);
  if(e.target.id==='copyExportBtn') { navigator.clipboard?.writeText($('#exportBox').value).then(()=>toast('JSON disalin.')).catch(()=>toast('Pilih teks lalu salin manual.')); }
  if(e.target.id==='importBtn') importData();
  if(e.target.id==='resetSeedBtn') resetSeedData();
});

document.addEventListener('keydown',(e)=>{
  if (!game?.running) return;
  if (e.code==='Space' && !['INPUT','TEXTAREA','SELECT','BUTTON'].includes(document.activeElement.tagName)) { e.preventDefault(); ringBell(); }
  if (/^Digit[1-8]$/.test(e.code) && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) markWord(Number(e.code.slice(-1))-1);
});

applyTheme(); renderSetup();
