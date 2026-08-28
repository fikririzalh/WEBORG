(() => {
  'use strict';

  const SETTINGS_KEY = 'focus-bunny.settings.v1';
  const RECORDS_KEY = 'focus-bunny.records.v1';

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const difficultyConfig = {
    easy: { size: 104, life: 1850, gap: 260, distractors: 1, score: 100, missPenalty: 10, wrongPenalty: 25, moving: false },
    normal: { size: 76, life: 1250, gap: 185, distractors: 2, score: 140, missPenalty: 20, wrongPenalty: 40, moving: false },
    hard: { size: 52, life: 820, gap: 120, distractors: 4, score: 190, missPenalty: 30, wrongPenalty: 60, moving: true }
  };

  const colors = [
    { key: 'blue', name: 'BIRU', value: '#4a9cff' },
    { key: 'green', name: 'HIJAU', value: '#52cf94' },
    { key: 'yellow', name: 'KUNING', value: '#ffd45b' },
    { key: 'pink', name: 'PINK', value: '#ff81ad' },
    { key: 'purple', name: 'UNGU', value: '#9c79f2' }
  ];

  const directionSets = {
    arrows: [
      { key: 'ArrowUp', label: '↑', name: 'ATAS' },
      { key: 'ArrowRight', label: '→', name: 'KANAN' },
      { key: 'ArrowDown', label: '↓', name: 'BAWAH' },
      { key: 'ArrowLeft', label: '←', name: 'KIRI' }
    ],
    wasd: [
      { key: 'w', label: 'W', name: 'ATAS' },
      { key: 'd', label: 'D', name: 'KANAN' },
      { key: 's', label: 'S', name: 'BAWAH' },
      { key: 'a', label: 'A', name: 'KIRI' }
    ]
  };

  const keyboardModes = new Set(['arrows', 'wasd']);

  let settings = loadJSON(SETTINGS_KEY, { theme: 'light', sound: true, mode: 'classic', difficulty: 'easy', duration: 60 });
  let records = loadJSON(RECORDS_KEY, { score: 0, fastest: null, accuracy: 0, combo: 0 });

  const state = {
    running: false,
    score: 0,
    combo: 0,
    bestCombo: 0,
    hits: 0,
    missed: 0,
    wrong: 0,
    targetsShown: 0,
    reactionTimes: [],
    startedAt: 0,
    endsAt: 0,
    remainingMs: 0,
    spawnToken: 0,
    spawnTimeout: null,
    expireTimeout: null,
    timerInterval: null,
    activeTarget: null,
    activeDirection: null,
    activeSpawnTime: 0,
    currentColor: colors[0]
  };

  const refs = {
    menuScreen: $('#menuScreen'),
    gameScreen: $('#gameScreen'),
    resultScreen: $('#resultScreen'),
    gameStage: $('#gameStage'),
    countdownLayer: $('#countdownLayer'),
    countdownNumber: $('#countdownNumber'),
    feedbackLayer: $('#feedbackLayer'),
    scoreValue: $('#scoreValue'),
    comboValue: $('#comboValue'),
    timeValue: $('#timeValue'),
    focusInstruction: $('#focusInstruction'),
    instructionLabel: $('#instructionLabel'),
    focusColorDot: $('#focusColorDot'),
    focusColorName: $('#focusColorName'),
    bestScoreMini: $('#bestScoreMini'),
    recordScore: $('#recordScore'),
    recordFastest: $('#recordFastest'),
    recordAccuracy: $('#recordAccuracy'),
    recordCombo: $('#recordCombo')
  };

  let audioContext = null;

  function loadJSON(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value && typeof value === 'object' ? { ...fallback, ...value } : fallback;
    } catch {
      return fallback;
    }
  }

  function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  function saveRecords() {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  }

  function ensureAudio() {
    if (!settings.sound) return null;
    if (!audioContext) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      audioContext = new Ctx();
    }
    if (audioContext.state === 'suspended') audioContext.resume();
    return audioContext;
  }

  function tone(type = 'hit') {
    const ctx = ensureAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const map = {
      hit: [660, 0.055, 'sine', 0.06],
      combo: [880, 0.075, 'triangle', 0.07],
      miss: [180, 0.09, 'sine', 0.045],
      wrong: [130, 0.11, 'square', 0.035],
      start: [520, 0.09, 'triangle', 0.055],
      end: [420, 0.18, 'sine', 0.055]
    };
    const [freq, duration, wave, volume] = map[type] || map.hit;
    osc.frequency.setValueAtTime(freq, now);
    if (type === 'end') osc.frequency.exponentialRampToValueAtTime(760, now + duration);
    if (type === 'hit' || type === 'combo') osc.frequency.exponentialRampToValueAtTime(freq * 1.16, now + duration);
    osc.type = wave;
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  function applyTheme() {
    document.body.classList.toggle('dark', settings.theme === 'dark');
    $('#themeToggle').textContent = settings.theme === 'dark' ? '☀' : '☾';
    document.querySelector('meta[name="theme-color"]').setAttribute('content', settings.theme === 'dark' ? '#0d1830' : '#dff5ff');
  }

  function updateSoundButtons() {
    const icon = settings.sound ? '🔊' : '🔇';
    $('#soundToggle').textContent = icon;
    $('#gameSoundToggle').textContent = icon;
  }

  function updateMenuSelection() {
    $$('[data-mode]').forEach((button) => button.classList.toggle('active', button.dataset.mode === settings.mode));
    $$('[data-difficulty]').forEach((button) => button.classList.toggle('active', button.dataset.difficulty === settings.difficulty));
    $$('[data-duration]').forEach((button) => button.classList.toggle('active', Number(button.dataset.duration) === settings.duration));
    updateRecordUI();
  }

  function updateRecordUI() {
    refs.bestScoreMini.textContent = formatNumber(records.score || 0);
    refs.recordScore.textContent = formatNumber(records.score || 0);
    refs.recordFastest.textContent = records.fastest ? `${Math.round(records.fastest)} ms` : '-';
    refs.recordAccuracy.textContent = records.accuracy ? `${records.accuracy.toFixed(1)}%` : '-';
    refs.recordCombo.textContent = String(records.combo || 0);
  }

  function formatNumber(value) {
    return new Intl.NumberFormat('id-ID').format(Math.max(0, Math.round(value)));
  }

  function formatTime(ms) {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  function setScreen(screen) {
    refs.menuScreen.hidden = screen !== 'menu';
    refs.gameScreen.hidden = screen !== 'game';
    refs.resultScreen.hidden = screen !== 'result';
  }

  async function requestFullscreen() {
    const root = document.documentElement;
    if (document.fullscreenElement || !root.requestFullscreen) return;
    try { await root.requestFullscreen(); } catch { /* Browser may decline; game still runs. */ }
  }

  async function leaveFullscreen() {
    if (!document.fullscreenElement || !document.exitFullscreen) return;
    try { await document.exitFullscreen(); } catch { /* Ignore. */ }
  }

  async function startGame() {
    ensureAudio();
    await requestFullscreen();
    setScreen('game');
    resetSession();
    updateModeInstruction();
    await countdown();
    beginSession();
  }

  function resetSession() {
    clearSessionTimers();
    refs.gameStage.innerHTML = '';
    refs.feedbackLayer.innerHTML = '';
    Object.assign(state, {
      running: false,
      score: 0,
      combo: 0,
      bestCombo: 0,
      hits: 0,
      missed: 0,
      wrong: 0,
      targetsShown: 0,
      reactionTimes: [],
      startedAt: 0,
      endsAt: 0,
      remainingMs: settings.duration * 1000,
      spawnToken: state.spawnToken + 1,
      activeTarget: null,
      activeDirection: null,
      activeSpawnTime: 0,
      currentColor: colors[0]
    });
    updateHUD();
  }

  function countdown() {
    return new Promise((resolve) => {
      refs.countdownLayer.hidden = false;
      const steps = ['3', '2', '1', 'GO!'];
      let index = 0;
      refs.countdownNumber.textContent = steps[index];
      tone('start');
      const interval = setInterval(() => {
        index += 1;
        if (index >= steps.length) {
          clearInterval(interval);
          refs.countdownLayer.hidden = true;
          resolve();
          return;
        }
        refs.countdownNumber.textContent = steps[index];
        tone(index === steps.length - 1 ? 'combo' : 'start');
      }, 700);
    });
  }

  function beginSession() {
    state.running = true;
    state.startedAt = performance.now();
    state.endsAt = state.startedAt + settings.duration * 1000;
    refs.timeValue.textContent = formatTime(settings.duration * 1000);
    state.timerInterval = setInterval(tickTimer, 100);
    spawnRound();
  }

  function tickTimer() {
    if (!state.running) return;
    state.remainingMs = state.endsAt - performance.now();
    refs.timeValue.textContent = formatTime(state.remainingMs);
    if (state.remainingMs <= 0) finishGame();
  }

  function clearSessionTimers() {
    clearTimeout(state.spawnTimeout);
    clearTimeout(state.expireTimeout);
    clearInterval(state.timerInterval);
    state.spawnTimeout = null;
    state.expireTimeout = null;
    state.timerInterval = null;
  }

  function updateHUD() {
    refs.scoreValue.textContent = formatNumber(state.score);
    refs.comboValue.textContent = `x${state.combo}`;
    refs.timeValue.textContent = formatTime(state.remainingMs || settings.duration * 1000);
  }

  function chooseFocusColor() {
    const next = colors[Math.floor(Math.random() * colors.length)];
    state.currentColor = next;
    refs.focusColorDot.style.background = next.value;
    refs.focusColorName.textContent = next.name;
  }

  function isKeyboardMode() {
    return keyboardModes.has(settings.mode);
  }

  function updateModeInstruction() {
    refs.focusInstruction.classList.remove('keyboard');
    refs.focusColorDot.style.display = '';

    if (settings.mode === 'classic') {
      refs.focusInstruction.hidden = true;
      return;
    }

    refs.focusInstruction.hidden = false;
    if (settings.mode === 'focus') {
      refs.instructionLabel.textContent = 'KLIK WARNA';
      refs.focusColorName.textContent = state.currentColor.name;
      refs.focusColorDot.style.background = state.currentColor.value;
      return;
    }

    refs.focusInstruction.classList.add('keyboard');
    refs.focusColorDot.style.display = 'none';
    if (settings.mode === 'arrows') {
      refs.instructionLabel.textContent = 'TEKAN ARAH';
      refs.focusColorName.textContent = '↑  ↓  ←  →';
    } else {
      refs.instructionLabel.textContent = 'TEKAN TOMBOL';
      refs.focusColorName.textContent = 'W  A  S  D';
    }
  }

  function chooseDirection() {
    const pool = directionSets[settings.mode] || directionSets.arrows;
    state.activeDirection = pool[Math.floor(Math.random() * pool.length)];
    return state.activeDirection;
  }

  function spawnRound() {
    if (!state.running) return;
    const cfg = difficultyConfig[settings.difficulty];
    const token = ++state.spawnToken;
    refs.gameStage.innerHTML = '';
    state.activeTarget = null;
    state.activeDirection = null;
    if (settings.mode === 'focus') chooseFocusColor();
    if (isKeyboardMode()) chooseDirection();
    updateModeInstruction();

    const total = settings.mode === 'focus' ? cfg.distractors + 1 : 1;
    const positions = generatePositions(total, cfg.size);
    const correctIndex = Math.floor(Math.random() * total);
    const spawnTime = performance.now();
    state.activeSpawnTime = spawnTime;
    state.targetsShown += 1;

    for (let i = 0; i < total; i += 1) {
      const isCorrect = settings.mode === 'classic' || isKeyboardMode() || i === correctIndex;
      const color = isCorrect
        ? (settings.mode === 'focus' ? state.currentColor : colors[Math.floor(Math.random() * colors.length)])
        : randomDifferentColor(state.currentColor.key);
      const target = createTarget({
        position: positions[i], size: cfg.size, color, isCorrect, spawnTime, token,
        direction: isKeyboardMode() ? state.activeDirection : null
      });
      refs.gameStage.appendChild(target);
      if (isCorrect) state.activeTarget = target;
    }

    state.expireTimeout = setTimeout(() => {
      if (!state.running || token !== state.spawnToken) return;
      registerMiss();
      scheduleNext(cfg.gap);
    }, cfg.life);
  }

  function generatePositions(count, size) {
    const stageRect = refs.gameStage.getBoundingClientRect();
    const topSafe = window.innerWidth < 1050 ? 160 : 110;
    const margin = Math.max(34, size * 0.7);
    const positions = [];
    let guard = 0;
    while (positions.length < count && guard < 200) {
      guard += 1;
      const x = margin + Math.random() * Math.max(10, stageRect.width - margin * 2);
      const y = topSafe + margin + Math.random() * Math.max(10, stageRect.height - topSafe - margin * 2);
      const okay = positions.every((p) => Math.hypot(p.x - x, p.y - y) > size * 1.55);
      if (okay || guard > 160) positions.push({ x, y });
    }
    return positions;
  }

  function randomDifferentColor(key) {
    const pool = colors.filter((color) => color.key !== key);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function createTarget({ position, size, color, isCorrect, spawnTime, token, direction = null }) {
    const button = document.createElement('button');
    button.type = 'button';
    button.tabIndex = -1;
    button.className = `game-target${isCorrect ? '' : ' distractor'}${direction ? ' keyboard-target' : ''}${difficultyConfig[settings.difficulty].moving ? ' hard-move' : ''}`;
    const variation = settings.difficulty === 'hard' ? 0.82 + Math.random() * 0.3 : 0.92 + Math.random() * 0.16;
    const renderedSize = Math.max(34, Math.round(size * variation));
    button.style.width = `${renderedSize}px`;
    button.style.height = `${renderedSize}px`;
    button.style.left = `${position.x}px`;
    button.style.top = `${position.y}px`;
    button.style.background = color.value;
    button.setAttribute('aria-label', direction ? `${direction.name}: tekan ${direction.label}` : (isCorrect ? 'Target' : 'Distractor'));
    button.dataset.correct = isCorrect ? '1' : '0';

    if (direction) {
      button.innerHTML = `<span class="key-symbol">${direction.label}</span><small>${direction.name}</small>`;
    }

    button.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      if (!state.running || token !== state.spawnToken) return;
      if (direction) {
        feedback(event.clientX, event.clientY, `Tekan ${direction.label}`, 'hint');
        return;
      }
      if (isCorrect) registerHit(button, spawnTime, event.clientX, event.clientY);
      else registerWrong(button, event.clientX, event.clientY);
    }, { passive: false });
    return button;
  }

  function registerHit(target, spawnTime, x, y) {
    if (!state.running || target.classList.contains('hit')) return;
    clearTimeout(state.expireTimeout);
    const cfg = difficultyConfig[settings.difficulty];
    const reaction = performance.now() - spawnTime;
    state.reactionTimes.push(reaction);
    state.hits += 1;
    state.combo += 1;
    state.bestCombo = Math.max(state.bestCombo, state.combo);

    const speedBonus = Math.max(0, Math.round((cfg.life - reaction) / 10));
    const comboMultiplier = 1 + Math.min(state.combo, 20) * 0.025;
    const gained = Math.max(10, Math.round((cfg.score + speedBonus) * comboMultiplier));
    state.score += gained;
    target.classList.add('hit');
    tone(state.combo > 0 && state.combo % 10 === 0 ? 'combo' : 'hit');
    feedback(x, y, `+${gained}`, 'good');
    updateHUD();
    state.activeTarget = null;
    state.activeDirection = null;
    scheduleNext(cfg.gap);
  }

  function registerMiss() {
    if (!state.running) return;
    const cfg = difficultyConfig[settings.difficulty];
    state.missed += 1;
    state.combo = 0;
    state.score = Math.max(0, state.score - cfg.missPenalty);
    state.activeTarget = null;
    state.activeDirection = null;
    tone('miss');
    updateHUD();
  }

  function normalizeGameKey(event) {
    if (settings.mode === 'arrows') return event.key;
    if (settings.mode === 'wasd') return event.key.toLowerCase();
    return event.key;
  }

  function handleKeyboardTarget(event) {
    if (!state.running || !isKeyboardMode() || !state.activeTarget || !state.activeDirection) return false;
    const allowed = directionSets[settings.mode].map((item) => item.key);
    const pressed = normalizeGameKey(event);
    if (!allowed.includes(pressed)) return false;

    event.preventDefault();
    if (event.repeat) return true;

    const rect = state.activeTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    if (pressed === state.activeDirection.key) {
      registerHit(state.activeTarget, state.activeSpawnTime, x, y);
    } else {
      registerKeyboardWrong(state.activeTarget, x, y);
    }
    return true;
  }

  function registerKeyboardWrong(target, x, y) {
    if (!state.running || !target) return;
    const cfg = difficultyConfig[settings.difficulty];
    state.wrong += 1;
    state.combo = 0;
    state.score = Math.max(0, state.score - cfg.wrongPenalty);
    target.classList.remove('wrong');
    void target.offsetWidth;
    target.classList.add('wrong');
    tone('wrong');
    feedback(x, y, `-${cfg.wrongPenalty}`, 'bad');
    updateHUD();
  }

  function registerWrong(target, x, y) {
    if (!state.running) return;
    const cfg = difficultyConfig[settings.difficulty];
    state.wrong += 1;
    state.combo = 0;
    state.score = Math.max(0, state.score - cfg.wrongPenalty);
    target.classList.remove('wrong');
    void target.offsetWidth;
    target.classList.add('wrong');
    target.disabled = true;
    target.style.opacity = '.32';
    tone('wrong');
    feedback(x, y, `-${cfg.wrongPenalty}`, 'bad');
    updateHUD();
  }

  function scheduleNext(delay) {
    const token = ++state.spawnToken;
    clearTimeout(state.expireTimeout);
    state.spawnTimeout = setTimeout(() => {
      if (!state.running || token !== state.spawnToken) return;
      spawnRound();
    }, delay);
  }

  function feedback(x, y, text, kind) {
    const item = document.createElement('span');
    item.className = `float-feedback ${kind}`;
    item.textContent = text;
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    refs.feedbackLayer.appendChild(item);
    setTimeout(() => item.remove(), 680);
  }

  function calculateStats() {
    const attempts = state.hits + state.missed + state.wrong;
    const accuracy = attempts ? (state.hits / attempts) * 100 : 0;
    const times = state.reactionTimes;
    const average = times.length ? times.reduce((sum, value) => sum + value, 0) / times.length : null;
    const fastest = times.length ? Math.min(...times) : null;
    const slowest = times.length ? Math.max(...times) : null;
    return { accuracy, average, fastest, slowest };
  }

  function finishGame({ aborted = false } = {}) {
    if (!state.running && !aborted) return;
    state.running = false;
    clearSessionTimers();
    refs.gameStage.innerHTML = '';
    tone('end');

    if (aborted) {
      setScreen('menu');
      leaveFullscreen();
      return;
    }

    const stats = calculateStats();
    const oldRecordScore = records.score || 0;
    records.score = Math.max(records.score || 0, state.score);
    records.fastest = stats.fastest == null ? records.fastest : (records.fastest == null ? stats.fastest : Math.min(records.fastest, stats.fastest));
    records.accuracy = Math.max(records.accuracy || 0, stats.accuracy);
    records.combo = Math.max(records.combo || 0, state.bestCombo);
    saveRecords();
    renderResults(stats, state.score > oldRecordScore);
    setScreen('result');
    leaveFullscreen();
  }

  function renderResults(stats, newRecord) {
    $('#finalScore').textContent = formatNumber(state.score);
    $('#newRecordBadge').hidden = !newRecord;
    $('#statAccuracy').textContent = `${stats.accuracy.toFixed(1)}%`;
    $('#statHits').textContent = String(state.hits);
    $('#statMissed').textContent = String(state.missed);
    $('#statWrong').textContent = String(state.wrong);
    $('#statAverage').textContent = stats.average == null ? '-' : `${Math.round(stats.average)} ms`;
    $('#statFastest').textContent = stats.fastest == null ? '-' : `${Math.round(stats.fastest)} ms`;
    $('#statSlowest').textContent = stats.slowest == null ? '-' : `${Math.round(stats.slowest)} ms`;
    $('#statCombo').textContent = String(state.bestCombo);

    let title = 'Nice focus!';
    if (stats.accuracy >= 95 && state.hits >= 10) title = 'Sharp focus!';
    else if (stats.accuracy >= 85) title = 'Great rhythm!';
    else if (stats.accuracy < 60) title = 'Try another round.';
    $('#resultTitle').textContent = title;
    updateRecordUI();
  }

  function toggleTheme() {
    settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
    saveSettings();
    applyTheme();
  }

  function toggleSound() {
    settings.sound = !settings.sound;
    saveSettings();
    updateSoundButtons();
    if (settings.sound) tone('start');
  }

  function bindEvents() {
    $('#themeToggle').addEventListener('click', toggleTheme);
    $('#soundToggle').addEventListener('click', toggleSound);
    $('#gameSoundToggle').addEventListener('click', toggleSound);

    $$('[data-mode]').forEach((button) => button.addEventListener('click', () => {
      settings.mode = button.dataset.mode;
      saveSettings();
      updateMenuSelection();
      tone('hit');
    }));

    $$('[data-difficulty]').forEach((button) => button.addEventListener('click', () => {
      settings.difficulty = button.dataset.difficulty;
      saveSettings();
      updateMenuSelection();
      tone('hit');
    }));

    $$('[data-duration]').forEach((button) => button.addEventListener('click', () => {
      settings.duration = Number(button.dataset.duration);
      saveSettings();
      updateMenuSelection();
      tone('hit');
    }));

    $('#startButton').addEventListener('click', startGame);
    $('#playAgainButton').addEventListener('click', startGame);
    $('#exitGameButton').addEventListener('click', () => {
      if (window.confirm('Keluar dari sesi sekarang? Progress sesi ini tidak disimpan sebagai rekor.')) finishGame({ aborted: true });
    });
    $('#backMenuButton').addEventListener('click', () => {
      setScreen('menu');
      updateMenuSelection();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && state.running) {
        state.combo = 0;
        updateHUD();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (handleKeyboardTarget(event)) return;
      if (event.key === 'Escape' && state.running && !document.fullscreenElement) {
        // Native fullscreen Escape exits fullscreen; do not terminate the game automatically.
      }
    });
  }

  applyTheme();
  updateSoundButtons();
  updateMenuSelection();
  bindEvents();
  setScreen('menu');
})();
