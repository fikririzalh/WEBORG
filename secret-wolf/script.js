(() => {
  'use strict';

  const STORAGE_KEY = 'secretWolfGameV1';
  const SETTINGS_KEY = 'secretWolfSettingsV1';

  const ROLE_DISTRIBUTIONS = {
    5: { lamb: 3, wolf: 1, alpha: 1 },
    6: { lamb: 4, wolf: 1, alpha: 1 },
    7: { lamb: 4, wolf: 2, alpha: 1 },
    8: { lamb: 5, wolf: 2, alpha: 1 },
    9: { lamb: 5, wolf: 3, alpha: 1 },
    10: { lamb: 6, wolf: 3, alpha: 1 }
  };

  const POWER_TRACKS = {
    small: { 3: 'peek', 4: 'execute', 5: 'execute' },
    medium: { 2: 'investigate', 3: 'special', 4: 'execute', 5: 'execute' },
    large: { 1: 'investigate', 2: 'investigate', 3: 'special', 4: 'execute', 5: 'execute' }
  };

  const POWER_META = {
    peek: { icon: '👀', short: 'Scout', title: 'Scout the Deck' },
    investigate: { icon: '🔎', short: 'Check', title: 'Check the Wool' },
    special: { icon: '🔔', short: 'Choose', title: 'Choose Next Leader' },
    execute: { icon: '🚪', short: 'Banish', title: 'Banish from the Flock' }
  };

  const ROLE_META = {
    lamb: {
      icon: '🐑',
      title: 'THE LAMB',
      team: 'THE FLOCK',
      className: 'lamb',
      summary: 'Temukan para Wolf dan lindungi padang rumput.'
    },
    wolf: {
      icon: '🐺',
      title: 'THE WOLF',
      team: 'THE PACK',
      className: 'wolf',
      summary: 'Sembunyikan identitasmu dan bantu The Pack mengambil alih.'
    },
    alpha: {
      icon: '🌑',
      title: 'THE ALPHA WOLF',
      team: 'THE PACK',
      className: 'alpha',
      summary: 'Tetap dipercaya. Jika kamu menjadi Deputy setelah tiga Pack Decrees, The Pack menang.'
    }
  };

  const DEFAULT_SETTINGS = {
    theme: 'light',
    music: false,
    sfx: true
  };

  const app = document.getElementById('app');
  const toastEl = document.getElementById('toast');
  const themeToggle = document.getElementById('themeToggle');
  const musicToggle = document.getElementById('musicToggle');
  const sfxToggle = document.getElementById('sfxToggle');
  const brandButton = document.getElementById('brandButton');

  let settings = loadSettings();
  let state = loadGame();
  let shellMode = 'home';
  let toastTimer = null;
  let audio = null;
  let ambienceTimer = null;
  let holdTimer = null;

  function uid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function freshGame() {
    return {
      version: 1,
      phase: 'players',
      players: [],
      roleCounts: { lamb: 0, wolf: 0, alpha: 1 },
      revealIndex: 0,
      revealStage: 'pass',
      revealVisible: false,
      deck: [],
      discard: [],
      pendingCards: [],
      lastEnactedPolicy: null,
      policyWasChaos: false,
      flockPolicies: 0,
      packPolicies: 0,
      electionTracker: 0,
      round: 1,
      leaderId: null,
      deputyId: null,
      lastElectedLeaderId: null,
      lastElectedDeputyId: null,
      specialPendingTargetId: null,
      specialReturnFromId: null,
      vetoDenied: false,
      executivePower: null,
      executiveStage: 'handoff',
      executiveTargetId: null,
      winner: null,
      winReason: '',
      history: []
    };
  }

  function loadSettings() {
    try {
      return { ...DEFAULT_SETTINGS, ...(JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}) };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    applySettings();
  }

  function loadGame() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== 1) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  function saveGame() {
    if (!state) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function clearGame() {
    localStorage.removeItem(STORAGE_KEY);
    state = null;
  }

  function applySettings() {
    document.documentElement.dataset.theme = settings.theme;
    themeToggle.textContent = settings.theme === 'light' ? '☾' : '☀';
    musicToggle.classList.toggle('off', !settings.music);
    sfxToggle.classList.toggle('off', !settings.sfx);
    if (settings.music) startAmbience(); else stopAmbience();
  }

  function toast(message) {
    clearTimeout(toastTimer);
    toastEl.textContent = message;
    toastEl.classList.add('show');
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
  }

  function ensureAudio() {
    if (audio) return audio;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    audio = new AudioCtx();
    return audio;
  }

  function tone(freq = 440, duration = 0.08, volume = 0.025, type = 'sine') {
    if (!settings.sfx) return;
    const ctx = ensureAudio();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  function startAmbience() {
    const ctx = ensureAudio();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    if (ambienceTimer) return;

    const pulse = () => {
      if (!settings.music) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const base = settings.theme === 'dark' ? 92 : 146;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(base + Math.random() * 18, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.012, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 3);

      if (settings.theme === 'light' && Math.random() > 0.55) {
        const chirp = ctx.createOscillator();
        const chirpGain = ctx.createGain();
        chirp.type = 'sine';
        chirp.frequency.setValueAtTime(1100 + Math.random() * 450, now + .7);
        chirp.frequency.exponentialRampToValueAtTime(1700 + Math.random() * 300, now + .82);
        chirpGain.gain.setValueAtTime(0.0001, now + .7);
        chirpGain.gain.exponentialRampToValueAtTime(0.009, now + .73);
        chirpGain.gain.exponentialRampToValueAtTime(0.0001, now + .9);
        chirp.connect(chirpGain).connect(ctx.destination);
        chirp.start(now + .7);
        chirp.stop(now + .95);
      }
    };

    pulse();
    ambienceTimer = setInterval(pulse, 3400);
  }

  function stopAmbience() {
    if (ambienceTimer) clearInterval(ambienceTimer);
    ambienceTimer = null;
  }

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function escapeHtml(value = '') {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function activePlayers() {
    return state.players.filter(p => p.alive !== false);
  }

  function getPlayer(id) {
    return state.players.find(p => p.id === id) || null;
  }

  function nextAliveAfter(id) {
    const list = state.players;
    if (!list.length) return null;
    let index = list.findIndex(p => p.id === id);
    if (index < 0) index = -1;
    for (let step = 1; step <= list.length; step++) {
      const candidate = list[(index + step) % list.length];
      if (candidate.alive !== false) return candidate;
    }
    return null;
  }

  function isRoleConfigValid() {
    const n = state.players.length;
    const standard = ROLE_DISTRIBUTIONS[n];
    if (!standard) return false;
    const c = state.roleCounts;
    return c.lamb === standard.lamb && c.wolf === standard.wolf && c.alpha === standard.alpha;
  }

  function syncRecommendedRoleCounts() {
    const standard = ROLE_DISTRIBUTIONS[state.players.length];
    if (standard) state.roleCounts = { ...standard };
    else state.roleCounts = { lamb: Math.max(0, state.players.length - 2), wolf: state.players.length >= 2 ? 1 : 0, alpha: 1 };
  }

  function trackKey() {
    const n = state.players.length;
    if (n <= 6) return 'small';
    if (n <= 8) return 'medium';
    return 'large';
  }

  function powerAt(position) {
    return POWER_TRACKS[trackKey()][position] || null;
  }

  function powerName(position) {
    const power = powerAt(position);
    return power ? POWER_META[power] : null;
  }

  function buildDeck() {
    state.deck = shuffle([
      ...Array(6).fill('flock'),
      ...Array(11).fill('pack')
    ]);
    state.discard = [];
  }

  function reshuffleIfNeeded(minimum = 3) {
    if (state.deck.length >= minimum) return;
    if (!state.discard.length) return;
    state.deck = shuffle([...state.deck, ...state.discard]);
    state.discard = [];
    addHistory('The decree pile was quietly reshuffled.');
  }

  function addHistory(text) {
    state.history.unshift({ id: uid(), round: state.round, text });
    state.history = state.history.slice(0, 30);
  }

  function eligibleDeputies() {
    const alive = activePlayers();
    return alive.filter(p => {
      if (p.id === state.leaderId) return false;
      if (alive.length === 5) {
        return p.id !== state.lastElectedDeputyId;
      }
      return p.id !== state.lastElectedLeaderId && p.id !== state.lastElectedDeputyId;
    });
  }

  function assignRolesAndStartReveal() {
    if (!isRoleConfigValid()) {
      toast('Distribusi role belum sesuai balance standar.');
      return;
    }
    const roles = shuffle([
      ...Array(state.roleCounts.lamb).fill('lamb'),
      ...Array(state.roleCounts.wolf).fill('wolf'),
      ...Array(state.roleCounts.alpha).fill('alpha')
    ]);
    state.players = state.players.map((p, i) => ({
      ...p,
      role: roles[i],
      alive: true,
      investigated: false
    }));
    state.revealIndex = 0;
    state.revealStage = 'pass';
    state.revealVisible = false;
    state.phase = 'reveal';
    saveGame();
    render();
    tone(520, .09, .035, 'triangle');
  }

  function finishRoleReveal() {
    buildDeck();
    state.flockPolicies = 0;
    state.packPolicies = 0;
    state.electionTracker = 0;
    state.round = 1;
    state.lastElectedLeaderId = null;
    state.lastElectedDeputyId = null;
    state.deputyId = null;
    state.specialPendingTargetId = null;
    state.specialReturnFromId = null;
    state.history = [];
    const first = shuffle(state.players)[0];
    state.leaderId = first.id;
    state.phase = 'board';
    addHistory(`${first.name} dipilih acak sebagai Flock Leader pertama.`);
    saveGame();
  }

  function advanceLeader() {
    let next = null;

    if (state.specialPendingTargetId) {
      state.specialReturnFromId = state.leaderId;
      next = getPlayer(state.specialPendingTargetId);
      state.specialPendingTargetId = null;
      addHistory(`Special round: ${next?.name || 'seorang pemain'} menjadi Flock Leader berikutnya.`);
    } else if (state.specialReturnFromId) {
      next = nextAliveAfter(state.specialReturnFromId);
      state.specialReturnFromId = null;
    } else {
      next = nextAliveAfter(state.leaderId);
    }

    if (next) state.leaderId = next.id;
    state.deputyId = null;
    state.pendingCards = [];
    state.vetoDenied = false;
    state.executivePower = null;
    state.executiveStage = 'handoff';
    state.executiveTargetId = null;
    state.round += 1;
    state.phase = 'board';
    saveGame();
  }

  function endByPolicies(team) {
    state.winner = team;
    state.winReason = team === 'flock'
      ? 'Lima Flock Decrees telah diberlakukan.'
      : 'Enam Pack Decrees telah diberlakukan.';
    state.phase = 'gameover';
    addHistory(`${team === 'flock' ? 'The Flock' : 'The Pack'} memenangkan permainan.`);
    saveGame();
  }

  function enactPolicy(policy, { chaos = false } = {}) {
    if (policy === 'flock') {
      state.flockPolicies += 1;
      addHistory(`Flock Decree diberlakukan${chaos ? ' melalui chaos' : ''}.`);
    } else {
      state.packPolicies += 1;
      addHistory(`Pack Decree diberlakukan${chaos ? ' melalui chaos' : ''}.`);
    }

    state.electionTracker = 0;
    state.pendingCards = [];
    state.vetoDenied = false;

    if (state.flockPolicies >= 5) {
      endByPolicies('flock');
      return;
    }
    if (state.packPolicies >= 6) {
      endByPolicies('pack');
      return;
    }

    reshuffleIfNeeded(3);

    state.lastEnactedPolicy = policy;
    state.policyWasChaos = chaos;
    state.executivePower = (!chaos && policy === 'pack') ? powerAt(state.packPolicies) : null;
    state.executiveStage = 'handoff';
    state.phase = 'policyResult';
    saveGame();
    render();
  }

  function continueAfterPolicyResult() {
    if (state.executivePower) {
      state.phase = 'executive';
      state.executiveStage = 'handoff';
      saveGame();
      render();
      return;
    }
    advanceLeader();
    render();
  }

  function triggerChaos() {
    reshuffleIfNeeded(1);
    if (!state.deck.length) {
      toast('Deck kosong. Tidak dapat menjalankan chaos.');
      return;
    }
    const policy = state.deck.shift();
    state.lastElectedLeaderId = null;
    state.lastElectedDeputyId = null;
    addHistory('Tiga pemerintahan gagal. Top decree diberlakukan otomatis dan term limit dihapus.');
    enactPolicy(policy, { chaos: true });
  }

  function voteNo() {
    state.electionTracker += 1;
    addHistory(`Pemerintahan ditolak. Election Tracker ${state.electionTracker}/3.`);
    tone(170, .12, .035, 'sawtooth');
    if (state.electionTracker >= 3) {
      state.phase = 'chaos';
      saveGame();
      render();
      return;
    }
    advanceLeader();
    render();
  }

  function voteYes() {
    const leader = getPlayer(state.leaderId);
    const deputy = getPlayer(state.deputyId);
    if (!leader || !deputy) {
      toast('Pilih Deputy terlebih dahulu.');
      return;
    }

    state.lastElectedLeaderId = leader.id;
    state.lastElectedDeputyId = deputy.id;
    addHistory(`${leader.name} + ${deputy.name} disetujui sebagai pemerintahan.`);

    if (state.packPolicies >= 3 && deputy.role === 'alpha') {
      state.winner = 'pack';
      state.winReason = `${deputy.name}, The Alpha Wolf, terpilih sebagai Deputy setelah tiga Pack Decrees.`;
      state.phase = 'gameover';
      addHistory('The Alpha Wolf berhasil menjadi Deputy.');
      saveGame();
      render();
      return;
    }

    reshuffleIfNeeded(3);
    if (state.deck.length < 3) {
      toast('Deck tidak memiliki cukup kartu untuk legislative session.');
      return;
    }
    state.pendingCards = state.deck.splice(0, 3);
    state.phase = 'leaderHand';
    state.vetoDenied = false;
    saveGame();
    render();
    tone(490, .08, .025, 'triangle');
  }

  function leaderDiscard(index) {
    if (state.pendingCards.length !== 3) return;
    const [discarded] = state.pendingCards.splice(index, 1);
    state.discard.push(discarded);
    state.phase = 'handoffDeputy';
    addHistory('Flock Leader membuang satu decree secara rahasia.');
    saveGame();
    render();
  }

  function deputyDiscard(index) {
    if (state.pendingCards.length !== 2) return;
    const [discarded] = state.pendingCards.splice(index, 1);
    state.discard.push(discarded);
    const enacted = state.pendingCards.shift();
    addHistory('Deputy membuang satu decree secara rahasia.');
    tone(enacted === 'flock' ? 620 : 210, .18, .04, enacted === 'flock' ? 'triangle' : 'sawtooth');
    enactPolicy(enacted);
  }

  function requestVeto() {
    if (state.packPolicies < 5 || state.pendingCards.length !== 2) return;
    state.phase = 'vetoLeader';
    saveGame();
    render();
  }

  function resolveVeto(accept) {
    if (!accept) {
      state.vetoDenied = true;
      state.phase = 'deputyHand';
      saveGame();
      render();
      toast('Veto ditolak. Deputy harus memilih decree.');
      return;
    }

    state.discard.push(...state.pendingCards);
    state.pendingCards = [];
    state.electionTracker += 1;
    addHistory(`Veto disetujui. Election Tracker ${state.electionTracker}/3.`);
    if (state.electionTracker >= 3) {
      state.phase = 'chaos';
      saveGame();
      render();
      return;
    }
    advanceLeader();
    render();
  }

  function finishExecutive() {
    advanceLeader();
    render();
  }

  function render() {
    applySettings();
    if (shellMode === 'home') {
      renderHome();
      return;
    }
    if (!state) {
      shellMode = 'home';
      renderHome();
      return;
    }

    switch (state.phase) {
      case 'players': renderPlayers(); break;
      case 'roles': renderRoleSetup(); break;
      case 'reveal': renderReveal(); break;
      case 'board': renderBoard(); break;
      case 'chaos': renderChaosResult(); break;
      case 'policyResult': renderPolicyResult(); break;
      case 'leaderHand': renderLeaderHand(); break;
      case 'handoffDeputy': renderDeputyHandoff(); break;
      case 'deputyHand': renderDeputyHand(); break;
      case 'vetoLeader': renderVetoLeader(); break;
      case 'executive': renderExecutive(); break;
      case 'gameover': renderGameOver(); break;
      default:
        state.phase = 'players';
        saveGame();
        renderPlayers();
    }
  }

  function renderHome() {
    const hasResume = !!state && state.phase !== 'gameover';
    app.innerHTML = `
      <section class="panel hero">
        <div>
          <span class="eyebrow">🌾 SINGLE DEVICE · SOCIAL DEDUCTION</span>
          <h1>SECRET<br><span>WOLF</span></h1>
          <p>Semua orang terlihat seperti Lamb. Namun sebagian adalah Wolf yang bersembunyi di antara kawanan. Web mengurus role, deck, board, tracker, dan informasi rahasia. Diskusi dan voting tetap terjadi di meja.</p>
          <div class="hero-actions">
            <button class="btn primary" data-action="new-game">New Game</button>
            ${hasResume ? '<button class="btn ghost" data-action="resume-game">Continue Game</button>' : ''}
          </div>
          <div class="grid-3" style="margin-top:26px;">
            <div class="info-card"><h3>🐑 The Lamb</h3><p>Mayoritas. Tidak mengetahui identitas pemain lain.</p></div>
            <div class="info-card"><h3>🐺 The Wolf</h3><p>Anggota The Pack yang mengetahui informasi tim.</p></div>
            <div class="info-card"><h3>🌑 Alpha Wolf</h3><p>Role utama The Pack dan kondisi kemenangan khusus.</p></div>
          </div>
        </div>
        <div class="hero-art" aria-hidden="true">
          <div class="sheep-cluster">
            <div class="sheep-face one">🐑</div>
            <div class="sheep-face two">🐑</div>
            <div class="wolf-shadow">🐺</div>
          </div>
        </div>
      </section>`;
  }

  function renderPlayers() {
    const canContinue = state.players.length >= 5 && state.players.length <= 10;
    app.innerHTML = `
      <section class="panel section-panel">
        <div class="section-head">
          <div>
            <span class="eyebrow">STEP 1 · GATHER THE FLOCK</span>
            <h2>Player Manager</h2>
            <p>Tambahkan 5–10 pemain. Urutan daftar juga menjadi urutan rotasi Flock Leader di meja.</p>
          </div>
          <span class="chip">${state.players.length}/10 players</span>
        </div>

        <div class="grid-2">
          <div class="stack">
            <div class="form-row">
              <input id="newPlayerName" class="text-input" maxlength="24" placeholder="Nama pemain..." autocomplete="off" />
              <button class="btn primary" data-action="add-player">+ Add</button>
            </div>
            <div class="player-list">
              ${state.players.length ? state.players.map((p, i) => `
                <div class="player-row">
                  <div class="player-avatar">🐑</div>
                  <div>
                    <strong>${escapeHtml(p.name)}</strong>
                    <small>Seat ${i + 1}</small>
                  </div>
                  <div class="row-actions">
                    <button class="mini-btn" data-action="edit-player" data-id="${p.id}" title="Edit">✎</button>
                    <button class="mini-btn" data-action="delete-player" data-id="${p.id}" title="Delete">×</button>
                  </div>
                </div>`).join('') : '<div class="info-card center"><p>Belum ada pemain. Tambahkan nama pertama di atas.</p></div>'}
            </div>
          </div>

          <div class="stack">
            <div class="info-card">
              <h3>🎴 Apa yang diurus web?</h3>
              <p>Role rahasia, policy deck, election tracker, special powers, rotasi pemimpin, status pemain, dan win condition.</p>
            </div>
            <div class="info-card">
              <h3>🗣️ Apa yang tetap real-life?</h3>
              <p>Diskusi, nominasi sosial, tuduhan, bluffing, serta voting YES/NO. Web hanya menerima hasil voting.</p>
            </div>
            <div class="info-card">
              <h3>📱 Satu perangkat</h3>
              <p>Ketika layar menampilkan informasi privat, perangkat harus diberikan hanya kepada pemain yang disebut.</p>
            </div>
            <button class="btn primary block" data-action="to-role-setup" ${canContinue ? '' : 'disabled'}>Continue to Role Setup</button>
            ${!canContinue ? '<p class="warning-text center">Jumlah pemain harus 5–10.</p>' : ''}
          </div>
        </div>
      </section>`;
  }

  function renderRoleSetup() {
    const n = state.players.length;
    const valid = isRoleConfigValid();
    const expected = ROLE_DISTRIBUTIONS[n];
    const total = state.roleCounts.lamb + state.roleCounts.wolf + state.roleCounts.alpha;
    app.innerHTML = `
      <section class="panel section-panel">
        <div class="section-head">
          <div>
            <span class="eyebrow">STEP 2 · HIDDEN IDENTITIES</span>
            <h2>Role Distribution</h2>
            <p>Nilai dapat di-adjust, tetapi pembagian role hanya dapat dimulai ketika konfigurasi kembali sesuai balance standar terverifikasi untuk jumlah pemain ini.</p>
          </div>
          <button class="btn ghost small" data-action="back-players">← Players</button>
        </div>

        <div class="grid-3">
          ${counterCard('lamb', '🐑', 'The Lamb', 'The Flock')}
          ${counterCard('wolf', '🐺', 'The Wolf', 'The Pack')}
          ${counterCard('alpha', '🌑', 'Alpha Wolf', 'The Pack leader')}
        </div>

        <div class="validation ${valid ? 'ok' : 'bad'}">
          <div>${valid ? '✓' : '!'}</div>
          <div>
            <strong>${valid ? 'Balanced setup' : 'Role distribution blocked'}</strong>
            <span>${valid
              ? `${n} pemain = ${expected.lamb} Lamb + ${expected.wolf} Wolf + ${expected.alpha} Alpha Wolf.`
              : `Total saat ini ${total}/${n}. Untuk ${n} pemain, konfigurasi standar adalah ${expected.lamb} Lamb + ${expected.wolf} Wolf + ${expected.alpha} Alpha Wolf.`}</span>
          </div>
        </div>

        <div class="form-row" style="justify-content:flex-end;margin-top:18px;">
          <button class="btn ghost" data-action="reset-role-counts">Reset Recommended</button>
          <button class="btn primary" data-action="shuffle-roles" ${valid ? '' : 'disabled'}>Shuffle & Assign Roles</button>
        </div>
      </section>`;
  }

  function counterCard(role, icon, title, subtitle) {
    return `
      <div class="counter-card">
        <div class="counter-icon">${icon}</div>
        <h3>${title}</h3>
        <p>${subtitle}</p>
        <div class="counter-controls">
          <button data-action="role-dec" data-role="${role}">−</button>
          <div class="counter-value">${state.roleCounts[role]}</div>
          <button data-action="role-inc" data-role="${role}">+</button>
        </div>
      </div>`;
  }

  function renderReveal() {
    const player = state.players[state.revealIndex];
    if (!player) {
      finishRoleReveal();
      render();
      return;
    }

    if (state.revealStage === 'pass') {
      app.innerHTML = `
        <section class="panel center-stage">
          <div class="pass-card">
            <div class="pass-icon">📱</div>
            <span class="eyebrow">PRIVATE HANDOFF · ${state.revealIndex + 1}/${state.players.length}</span>
            <h2>Pass to<br>${escapeHtml(player.name)}</h2>
            <p>Pastikan pemain lain tidak melihat layar. Informasi role berikut hanya untuk ${escapeHtml(player.name)}.</p>
            <div class="secret-warning">Jangan tekan tombol sebelum perangkat sudah berada di tangan pemain yang benar.</div>
            <button class="btn primary block" data-action="confirm-reveal-player">Saya ${escapeHtml(player.name)}</button>
          </div>
        </section>`;
      return;
    }

    if (!state.revealVisible) {
      app.innerHTML = `
        <section class="panel center-stage">
          <div class="pass-card">
            <div class="pass-icon">🔒</div>
            <span class="eyebrow">IDENTITY SEALED</span>
            <h2>${escapeHtml(player.name)}</h2>
            <p>Tahan tombol sampai penuh untuk membuka role. Lepaskan lebih awal untuk membatalkan.</p>
            <button id="holdReveal" class="btn danger block hold-button">
              <span class="hold-fill"></span>
              Hold to Reveal
            </button>
          </div>
        </section>`;
      bindHoldReveal();
      return;
    }

    const meta = ROLE_META[player.role];
    app.innerHTML = `
      <section class="panel center-stage">
        <div class="role-card ${meta.className}">
          <div class="role-emblem">${meta.icon}</div>
          <div class="role-label">YOUR SECRET ROLE</div>
          <div class="role-title">${meta.title}</div>
          <div class="role-team">You belong to ${meta.team}</div>
          <p>${meta.summary}</p>
          <div class="role-intel">${roleIntel(player)}</div>
          <div class="divider"></div>
          <button class="btn primary block" data-action="hide-finish-role">Hide Role & Done</button>
        </div>
      </section>`;
  }

  function roleIntel(player) {
    if (player.role === 'lamb') {
      return '<strong>Intel:</strong> Kamu tidak mengetahui role pemain lain. Gunakan diskusi, voting, dan pola decree untuk membaca meja.';
    }

    const wolves = state.players.filter(p => p.role === 'wolf');
    const alpha = state.players.find(p => p.role === 'alpha');

    if (state.players.length <= 6) {
      if (player.role === 'alpha') {
        return `<strong>Intel:</strong> Wolf kamu adalah <strong>${escapeHtml(wolves[0]?.name || '—')}</strong>. Kalian saling mengetahui.`;
      }
      return `<strong>Intel:</strong> Alpha Wolf adalah <strong>${escapeHtml(alpha?.name || '—')}</strong>. Kalian saling mengetahui.`;
    }

    if (player.role === 'alpha') {
      return '<strong>Intel:</strong> The Pack mengetahui identitasmu, tetapi kamu tidak diberi tahu siapa para Wolf. Tetaplah terlihat seperti Lamb.';
    }

    const packNames = state.players
      .filter(p => p.id !== player.id && (p.role === 'wolf' || p.role === 'alpha'))
      .map(p => `${p.role === 'alpha' ? 'Alpha Wolf' : 'Wolf'}: <strong>${escapeHtml(p.name)}</strong>`)
      .join('<br>');
    return `<strong>Intel The Pack:</strong><br>${packNames}`;
  }

  function renderBoard() {
    const leader = getPlayer(state.leaderId);
    const eligible = eligibleDeputies();
    if (state.deputyId && !eligible.some(p => p.id === state.deputyId)) state.deputyId = null;

    app.innerHTML = `
      <section class="board-layout">
        <div class="panel board-main">
          <div class="roundbar">
            <div><span class="eyebrow">THE PASTURE BOARD</span><br><strong>Round ${state.round}</strong></div>
            <div class="round-meta">
              <span class="chip">Deck ${state.deck.length}</span>
              <span class="chip">Discard ${state.discard.length}</span>
              ${state.packPolicies >= 5 ? '<span class="chip">Veto unlocked</span>' : ''}
            </div>
          </div>

          <div class="policy-board">
            ${renderFlockTrack()}
            ${renderPackTrack()}
          </div>
          ${renderElectionTracker()}
        </div>

        <aside class="panel board-side">
          <div class="government-box">
            <span class="eyebrow">CURRENT ELECTION</span>
            <div class="government-person">
              <small>Flock Leader</small>
              <strong>${escapeHtml(leader?.name || '—')}</strong>
            </div>
            <label>
              <span class="muted" style="font-size:12px;font-weight:800;">DEPUTY NOMINEE</span>
              <select id="deputySelect" class="select">
                <option value="">Choose eligible player...</option>
                ${eligible.map(p => `<option value="${p.id}" ${state.deputyId === p.id ? 'selected' : ''}>${escapeHtml(p.name)}</option>`).join('')}
              </select>
            </label>
            <p class="muted" style="font-size:12px;line-height:1.5;">Diskusikan dan lakukan voting YES/NO secara real-life. Setelah semua suara dibuka bersamaan, masukkan hasil mayoritas di bawah.</p>
            <div class="vote-buttons">
              <button class="btn primary" data-action="vote-yes" ${state.deputyId ? '' : 'disabled'}>YES · Approved</button>
              <button class="btn danger" data-action="vote-no">NO · Rejected</button>
            </div>
          </div>

          <div class="divider"></div>
          <span class="eyebrow">PLAYERS</span>
          <div class="player-status-list" style="margin-top:10px;">
            ${state.players.map(p => `
              <div class="status-player ${p.alive === false ? 'dead' : ''}">
                <span>${p.alive === false ? '🚫' : '🐑'} ${escapeHtml(p.name)}</span>
                <small>${p.id === state.leaderId ? 'Leader' : p.id === state.deputyId ? 'Deputy' : p.alive === false ? 'Banished' : 'Active'}</small>
              </div>`).join('')}
          </div>

          <div class="divider"></div>
          <span class="eyebrow">PUBLIC HISTORY</span>
          <div class="history">
            ${state.history.length ? state.history.map(h => `<div class="history-entry">R${h.round} · ${escapeHtml(h.text)}</div>`).join('') : '<div class="history-entry">Belum ada event.</div>'}
          </div>
        </aside>
      </section>`;
  }

  function renderFlockTrack() {
    let slots = '';
    for (let i = 1; i <= 5; i++) {
      slots += `<div class="slot ${i <= state.flockPolicies ? 'filled flock' : ''}">${i <= state.flockPolicies ? '🐑' : i === 5 ? '<small>FLOCK<br>WINS</small>' : i}</div>`;
    }
    return `
      <div class="track flock">
        <div class="track-head"><h3>🐑 The Flock</h3><span>${state.flockPolicies}/5</span></div>
        <div class="slots">${slots}</div>
      </div>`;
  }

  function renderPackTrack() {
    let slots = '';
    for (let i = 1; i <= 6; i++) {
      const meta = i <= 5 ? powerName(i) : null;
      const filled = i <= state.packPolicies;
      let content = `${i}`;
      if (filled) content = '🐾';
      else if (i === 6) content = '<small>PACK<br>WINS</small>';
      else if (meta) content = `<span><span class="power">${meta.icon}</span><small>${meta.short}</small></span>`;
      const vetoClass = i === 5 ? 'veto' : '';
      slots += `<div class="slot ${filled ? 'filled pack' : ''} ${vetoClass}">${content}</div>`;
    }
    return `
      <div class="track pack">
        <div class="track-head"><h3>🐺 The Pack</h3><span>${state.packPolicies}/6</span></div>
        <div class="slots">${slots}</div>
      </div>`;
  }

  function renderElectionTracker() {
    return `
      <div class="election-track">
        <div class="election-head">
          <div><strong>🪙 Flock's Patience</strong><div class="muted" style="font-size:12px;margin-top:2px;">3 kegagalan → top decree otomatis.</div></div>
          <span>${state.electionTracker}/3</span>
        </div>
        <div class="coins">
          ${[1,2,3].map(i => `<div class="coin ${i <= state.electionTracker ? 'on' : ''}">${i <= state.electionTracker ? '●' : '○'}</div>`).join('')}
        </div>
      </div>`;
  }

  function renderLeaderHand() {
    const leader = getPlayer(state.leaderId);
    app.innerHTML = `
      <section class="panel private-screen">
        <div class="privacy-curtain">
          <span class="eyebrow">PRIVATE · FLOCK LEADER ONLY</span>
          <div class="big">🌾</div>
          <h2 style="font:800 38px Georgia,serif;margin:10px 0;">${escapeHtml(leader?.name || '')}</h2>
          <p class="muted">Kamu menerima 3 Decrees. Pilih tepat satu kartu untuk dibuang secara rahasia. Dua sisanya akan diberikan kepada Deputy.</p>
          <div class="policy-hand">
            ${state.pendingCards.map((c, i) => policyCard(c, i, 'Discard this')).join('')}
          </div>
          <p class="muted" style="font-size:12px;">Jangan perlihatkan kartu kepada pemain lain dan jangan mengacak urutannya untuk menghindari pilihan.</p>
        </div>
      </section>`;
  }

  function policyCard(policy, index, hint) {
    const flock = policy === 'flock';
    return `
      <button class="policy-card ${policy}" data-action="discard-policy" data-index="${index}">
        <span class="symbol">${flock ? '🐑' : '🐾'}</span>
        <strong>${flock ? 'FLOCK' : 'PACK'} DECREE</strong>
        <small>${hint}</small>
      </button>`;
  }

  function renderDeputyHandoff() {
    const deputy = getPlayer(state.deputyId);
    app.innerHTML = `
      <section class="panel center-stage">
        <div class="pass-card">
          <div class="pass-icon">🔒</div>
          <span class="eyebrow">LEGISLATIVE HANDOFF</span>
          <h2>Pass to<br>${escapeHtml(deputy?.name || 'Deputy')}</h2>
          <p>Flock Leader sudah selesai. Kunci informasi sebelumnya dan berikan perangkat kepada Deputy.</p>
          <button class="btn primary block" data-action="confirm-deputy">Saya ${escapeHtml(deputy?.name || 'Deputy')}</button>
        </div>
      </section>`;
  }

  function renderDeputyHand() {
    const deputy = getPlayer(state.deputyId);
    app.innerHTML = `
      <section class="panel private-screen">
        <div class="privacy-curtain">
          <span class="eyebrow">PRIVATE · DEPUTY ONLY</span>
          <div class="big">📜</div>
          <h2 style="font:800 38px Georgia,serif;margin:10px 0;">${escapeHtml(deputy?.name || '')}</h2>
          <p class="muted">Pilih satu decree untuk dibuang. Kartu yang tersisa langsung diberlakukan.</p>
          <div class="policy-hand">
            ${state.pendingCards.map((c, i) => policyCard(c, i, 'Discard this')).join('')}
          </div>
          ${state.packPolicies >= 5 && !state.vetoDenied ? '<button class="btn gold block" data-action="request-veto">Request Veto Instead</button>' : ''}
          ${state.vetoDenied ? '<div class="secret-warning">Veto ditolak Flock Leader. Kamu harus memilih salah satu decree untuk dibuang.</div>' : ''}
        </div>
      </section>`;
  }

  function renderVetoLeader() {
    const leader = getPlayer(state.leaderId);
    app.innerHTML = `
      <section class="panel center-stage">
        <div class="pass-card">
          <div class="pass-icon">✋</div>
          <span class="eyebrow">VETO REQUEST</span>
          <h2>Pass back to<br>${escapeHtml(leader?.name || 'Flock Leader')}</h2>
          <p>Deputy ingin membuang kedua decree. Flock Leader harus menerima atau menolak veto tanpa melihat kembali kedua kartu.</p>
          <div class="vote-buttons">
            <button class="btn primary" data-action="veto-accept">Accept Veto</button>
            <button class="btn danger" data-action="veto-deny">Deny Veto</button>
          </div>
        </div>
      </section>`;
  }

  function renderChaosResult() {
    app.innerHTML = `
      <section class="panel public-result">
        <div class="result-card">
          <div class="result-icon">🪙🪙🪙</div>
          <span class="eyebrow">CHAOS IN THE PASTURE</span>
          <h2>The Flock<br>Lost Patience</h2>
          <p>Tiga pemerintahan gagal berturut-turut. Top decree akan diberlakukan otomatis. Executive power dari kartu ini diabaikan dan term limit lama dihapus.</p>
          <button class="btn danger" data-action="reveal-chaos-policy">Reveal Top Decree</button>
        </div>
      </section>`;
  }

  function renderPolicyResult() {
    const flock = state.lastEnactedPolicy === 'flock';
    const chaosNote = state.policyWasChaos
      ? 'Kartu ini diberlakukan otomatis karena Election Tracker mencapai batas. Executive power diabaikan.'
      : 'Decree yang tersisa dari legislative session sekarang resmi masuk ke board.';
    const power = state.executivePower ? POWER_META[state.executivePower] : null;
    app.innerHTML = `
      <section class="panel public-result">
        <div class="result-card">
          <div class="result-icon">${flock ? '🐑' : '🐾'}</div>
          <span class="eyebrow">DECREE ENACTED</span>
          <h2>${flock ? 'FLOCK' : 'PACK'}<br>DECREE</h2>
          <p>${chaosNote}</p>
          ${power ? `<div class="secret-warning">Executive power unlocked: ${power.icon} <strong>${power.title}</strong></div>` : ''}
          <button class="btn ${flock ? 'primary' : 'danger'}" data-action="continue-policy-result">Continue</button>
        </div>
      </section>`;
  }

  function renderExecutive() {
    const leader = getPlayer(state.leaderId);
    const meta = POWER_META[state.executivePower];

    if (state.executiveStage === 'handoff') {
      app.innerHTML = `
        <section class="panel center-stage">
          <div class="pass-card">
            <div class="pass-icon">${meta?.icon || '⚙️'}</div>
            <span class="eyebrow">EXECUTIVE ACTION</span>
            <h2>Pass to<br>${escapeHtml(leader?.name || 'Flock Leader')}</h2>
            <p><strong>${meta?.title || 'Executive Power'}</strong> harus dijalankan sebelum ronde berikutnya.</p>
            <button class="btn primary block" data-action="executive-confirm-leader">Saya ${escapeHtml(leader?.name || 'Leader')}</button>
          </div>
        </section>`;
      return;
    }

    if (state.executivePower === 'peek') {
      renderPeek();
    } else if (state.executivePower === 'investigate') {
      renderInvestigation();
    } else if (state.executivePower === 'special') {
      renderSpecialElection();
    } else if (state.executivePower === 'execute') {
      renderExecution();
    }
  }

  function renderPeek() {
    reshuffleIfNeeded(3);
    const cards = state.deck.slice(0, 3);
    app.innerHTML = `
      <section class="panel private-screen">
        <div class="privacy-curtain">
          <span class="eyebrow">PRIVATE · FLOCK LEADER ONLY</span>
          <div class="big">👀</div>
          <h2 style="font:800 38px Georgia,serif;margin:10px 0;">Scout the Deck</h2>
          <p class="muted">Lihat tiga decree teratas. Urutan tidak berubah dan kartu tetap berada di deck.</p>
          <div class="policy-hand">
            ${cards.map(c => `<div class="policy-card ${c}" style="cursor:default;"><span class="symbol">${c === 'flock' ? '🐑' : '🐾'}</span><strong>${c.toUpperCase()} DECREE</strong></div>`).join('')}
          </div>
          <button class="btn primary block" data-action="finish-executive">Hide & Continue</button>
        </div>
      </section>`;
  }

  function renderInvestigation() {
    const leader = getPlayer(state.leaderId);

    if (state.executiveStage === 'result' && state.executiveTargetId) {
      const target = getPlayer(state.executiveTargetId);
      const party = target.role === 'lamb' ? 'THE FLOCK' : 'THE PACK';
      app.innerHTML = `
        <section class="panel private-screen">
          <div class="privacy-curtain">
            <span class="eyebrow">PRIVATE INVESTIGATION RESULT</span>
            <div class="big">${target.role === 'lamb' ? '🐑' : '🐺'}</div>
            <h2 style="font:800 38px Georgia,serif;margin:10px 0;">${escapeHtml(target.name)}</h2>
            <p class="muted">Party Membership</p>
            <div class="role-title" style="font-size:42px;">${party}</div>
            <p class="muted">Catatan: investigasi hanya menunjukkan faction. Jika hasilnya The Pack, layar ini tidak membedakan Wolf biasa dan Alpha Wolf.</p>
            <button class="btn primary block" data-action="finish-executive">Hide Result & Continue</button>
          </div>
        </section>`;
      return;
    }

    const targets = state.players.filter(p => p.alive !== false && p.id !== leader.id && !p.investigated);
    app.innerHTML = `
      <section class="panel private-screen">
        <div class="privacy-curtain">
          <span class="eyebrow">PRIVATE · FLOCK LEADER ONLY</span>
          <div class="big">🔎</div>
          <h2 style="font:800 38px Georgia,serif;margin:10px 0;">Check the Wool</h2>
          <p class="muted">Pilih satu pemain yang belum pernah diinvestigasi. Kamu akan melihat faction-nya secara privat.</p>
          <div class="action-grid">
            ${targets.length ? targets.map(p => `<button class="target-button" data-action="investigate-target" data-id="${p.id}"><strong>${escapeHtml(p.name)}</strong><small>Check membership</small></button>`).join('') : '<div class="info-card"><p>Tidak ada target investigasi yang valid.</p></div>'}
          </div>
          ${!targets.length ? '<button class="btn primary block" style="margin-top:14px;" data-action="finish-executive">Continue</button>' : ''}
        </div>
      </section>`;
  }

  function renderSpecialElection() {
    const leader = getPlayer(state.leaderId);
    const targets = activePlayers().filter(p => p.id !== leader.id);
    app.innerHTML = `
      <section class="panel private-screen">
        <div class="privacy-curtain">
          <span class="eyebrow">FLOCK LEADER CHOOSES</span>
          <div class="big">🔔</div>
          <h2 style="font:800 38px Georgia,serif;margin:10px 0;">Choose Next Leader</h2>
          <p class="muted">Pilih pemain lain untuk menjadi Flock Leader pada election berikutnya. Setelah special election selesai, rotasi normal kembali ke pemain setelah leader saat ini.</p>
          <div class="action-grid">
            ${targets.map(p => `<button class="target-button" data-action="special-target" data-id="${p.id}"><strong>${escapeHtml(p.name)}</strong><small>Next Flock Leader</small></button>`).join('')}
          </div>
        </div>
      </section>`;
  }

  function renderExecution() {
    const leader = getPlayer(state.leaderId);
    const targets = activePlayers().filter(p => p.id !== leader.id);
    app.innerHTML = `
      <section class="panel private-screen">
        <div class="privacy-curtain">
          <span class="eyebrow">FLOCK LEADER CHOOSES</span>
          <div class="big">🚪</div>
          <h2 style="font:800 38px Georgia,serif;margin:10px 0;">Banish from the Flock</h2>
          <p class="muted">Pemain yang dibanish keluar dari permainan dan tidak lagi boleh berbicara, voting, atau memegang jabatan. Faction-nya tidak diumumkan kecuali ia Alpha Wolf.</p>
          <div class="action-grid">
            ${targets.map(p => `<button class="target-button" data-action="execute-target" data-id="${p.id}"><strong>${escapeHtml(p.name)}</strong><small>Banish player</small></button>`).join('')}
          </div>
        </div>
      </section>`;
  }

  function renderGameOver() {
    const flockWin = state.winner === 'flock';
    app.innerHTML = `
      <section class="panel gameover">
        <div class="gameover-card">
          <div class="gameover-icon">${flockWin ? '🐑' : '🐺'}</div>
          <span class="eyebrow">GAME OVER</span>
          <h1>${flockWin ? 'THE FLOCK' : 'THE PACK'}<br>WINS</h1>
          <p class="muted">${escapeHtml(state.winReason)}</p>
          <div class="role-recap">
            ${state.players.map(p => {
              const meta = ROLE_META[p.role];
              return `<div class="info-card"><h3>${meta.icon} ${escapeHtml(p.name)}</h3><p>${meta.title}${p.alive === false ? ' · Banished' : ''}</p></div>`;
            }).join('')}
          </div>
          <div class="hero-actions" style="justify-content:center;">
            <button class="btn primary" data-action="new-game">Play Again</button>
            <button class="btn ghost" data-action="go-home">Home</button>
          </div>
        </div>
      </section>`;
  }

  function bindHoldReveal() {
    const button = document.getElementById('holdReveal');
    if (!button) return;

    const start = (event) => {
      event.preventDefault();
      clearTimeout(holdTimer);
      button.classList.add('holding');
      holdTimer = setTimeout(() => {
        state.revealVisible = true;
        saveGame();
        tone(670, .11, .035, 'triangle');
        render();
      }, 850);
    };

    const cancel = () => {
      clearTimeout(holdTimer);
      button.classList.remove('holding');
    };

    button.addEventListener('pointerdown', start);
    button.addEventListener('pointerup', cancel);
    button.addEventListener('pointerleave', cancel);
    button.addEventListener('pointercancel', cancel);
  }

  app.addEventListener('change', (event) => {
    if (event.target.id === 'deputySelect') {
      state.deputyId = event.target.value || null;
      saveGame();
      renderBoard();
    }
  });

  app.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target.id === 'newPlayerName') {
      event.preventDefault();
      addPlayerFromInput();
    }
  });

  app.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;

    switch (action) {
      case 'new-game': {
        if (state && state.phase !== 'gameover' && !confirm('Mulai game baru? Progress game aktif akan dihapus.')) return;
        state = freshGame();
        shellMode = 'game';
        saveGame();
        render();
        tone(480, .09, .03, 'triangle');
        break;
      }
      case 'resume-game':
        shellMode = 'game';
        render();
        break;
      case 'go-home':
        shellMode = 'home';
        render();
        break;
      case 'add-player':
        addPlayerFromInput();
        break;
      case 'edit-player': {
        const player = getPlayer(target.dataset.id);
        if (!player) break;
        const next = prompt('Edit nama pemain:', player.name);
        if (next === null) break;
        const clean = next.trim().slice(0, 24);
        if (!clean) break;
        if (state.players.some(p => p.id !== player.id && p.name.toLowerCase() === clean.toLowerCase())) {
          toast('Nama pemain harus unik.');
          break;
        }
        player.name = clean;
        saveGame();
        renderPlayers();
        break;
      }
      case 'delete-player': {
        const player = getPlayer(target.dataset.id);
        if (!player) break;
        if (!confirm(`Hapus ${player.name}?`)) break;
        state.players = state.players.filter(p => p.id !== player.id);
        syncRecommendedRoleCounts();
        saveGame();
        renderPlayers();
        break;
      }
      case 'to-role-setup':
        syncRecommendedRoleCounts();
        state.phase = 'roles';
        saveGame();
        render();
        break;
      case 'back-players':
        state.phase = 'players';
        saveGame();
        render();
        break;
      case 'role-inc':
      case 'role-dec': {
        const role = target.dataset.role;
        const delta = action === 'role-inc' ? 1 : -1;
        state.roleCounts[role] = Math.max(0, state.roleCounts[role] + delta);
        saveGame();
        renderRoleSetup();
        break;
      }
      case 'reset-role-counts':
        syncRecommendedRoleCounts();
        saveGame();
        renderRoleSetup();
        break;
      case 'shuffle-roles':
        assignRolesAndStartReveal();
        break;
      case 'confirm-reveal-player':
        state.revealStage = 'role';
        state.revealVisible = false;
        saveGame();
        renderReveal();
        break;
      case 'hide-finish-role':
        state.revealVisible = false;
        state.revealStage = 'pass';
        state.revealIndex += 1;
        saveGame();
        renderReveal();
        break;
      case 'vote-yes':
        voteYes();
        break;
      case 'vote-no':
        voteNo();
        break;
      case 'discard-policy': {
        const index = Number(target.dataset.index);
        if (state.phase === 'leaderHand') leaderDiscard(index);
        else if (state.phase === 'deputyHand') deputyDiscard(index);
        break;
      }
      case 'confirm-deputy':
        state.phase = 'deputyHand';
        saveGame();
        render();
        break;
      case 'request-veto':
        requestVeto();
        break;
      case 'veto-accept':
        resolveVeto(true);
        break;
      case 'veto-deny':
        resolveVeto(false);
        break;
      case 'reveal-chaos-policy':
        triggerChaos();
        break;
      case 'continue-policy-result':
        continueAfterPolicyResult();
        break;
      case 'executive-confirm-leader':
        state.executiveStage = 'action';
        saveGame();
        renderExecutive();
        break;
      case 'finish-executive':
        finishExecutive();
        break;
      case 'investigate-target': {
        const player = getPlayer(target.dataset.id);
        if (!player || player.investigated) break;
        player.investigated = true;
        state.executiveTargetId = player.id;
        state.executiveStage = 'result';
        addHistory('Flock Leader melakukan investigasi privat.');
        saveGame();
        renderExecutive();
        break;
      }
      case 'special-target': {
        const player = getPlayer(target.dataset.id);
        if (!player || player.alive === false) break;
        state.specialPendingTargetId = player.id;
        addHistory(`${getPlayer(state.leaderId)?.name || 'Flock Leader'} memilih Special Election.`);
        advanceLeader();
        render();
        break;
      }
      case 'execute-target': {
        const player = getPlayer(target.dataset.id);
        if (!player || player.alive === false) break;
        if (!confirm(`Banish ${player.name}? Keputusan ini tidak dapat dibatalkan.`)) break;
        player.alive = false;
        addHistory(`${player.name} dibanish dari kawanan. Role tidak diumumkan.`);
        if (player.role === 'alpha') {
          state.winner = 'flock';
          state.winReason = `${player.name}, The Alpha Wolf, berhasil ditemukan dan dibanish.`;
          state.phase = 'gameover';
          addHistory('The Alpha Wolf ditemukan. The Flock menang.');
          saveGame();
          render();
          break;
        }
        saveGame();
        finishExecutive();
        break;
      }
      default:
        break;
    }
  });

  function addPlayerFromInput() {
    const input = document.getElementById('newPlayerName');
    if (!input) return;
    const name = input.value.trim().slice(0, 24);
    if (!name) {
      toast('Masukkan nama pemain.');
      return;
    }
    if (state.players.length >= 10) {
      toast('Maksimum 10 pemain.');
      return;
    }
    if (state.players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      toast('Nama pemain harus unik.');
      return;
    }
    state.players.push({ id: uid(), name, role: null, alive: true, investigated: false });
    syncRecommendedRoleCounts();
    saveGame();
    tone(560, .06, .025, 'triangle');
    renderPlayers();
  }

  themeToggle.addEventListener('click', () => {
    settings.theme = settings.theme === 'light' ? 'dark' : 'light';
    saveSettings();
    tone(settings.theme === 'dark' ? 240 : 620, .1, .025, 'triangle');
  });

  musicToggle.addEventListener('click', () => {
    settings.music = !settings.music;
    saveSettings();
    if (settings.music) toast('Backsound ON');
    else toast('Backsound OFF');
  });

  sfxToggle.addEventListener('click', () => {
    settings.sfx = !settings.sfx;
    saveSettings();
    if (settings.sfx) {
      tone(700, .07, .03, 'triangle');
      toast('SFX ON');
    } else {
      toast('SFX OFF');
    }
  });

  brandButton.addEventListener('click', () => {
    if (state && shellMode === 'game' && state.phase !== 'gameover') {
      const ok = confirm('Kembali ke home? Progress tersimpan dan dapat dilanjutkan.');
      if (!ok) return;
    }
    shellMode = 'home';
    render();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && settings.music) stopAmbience();
    if (!document.hidden && settings.music) startAmbience();
  });

  applySettings();
  render();
})();
