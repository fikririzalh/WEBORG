/* =========================================================================
   RGB COLOR DETECTIVE — script.js
   Semua logika permainan: mixing warna, role A/B, ronde, scoring, AI
   sederhana, dan penyimpanan lokal (localStorage). Murni JavaScript,
   tanpa framework, tanpa dependensi eksternal — berjalan 100% offline.
   ========================================================================= */

(function () {
  'use strict';

  /* =======================================================================
     1. KONSTANTA PERMAINAN
  ======================================================================= */

  // Jumlah maksimum keping per warna yang tersedia di inventory tiap ronde.
  // Inventory diisi ulang setiap ronde baru (bukan akumulatif sepanjang game).
  const INVENTORY_MAX = { R: 6, G: 6, B: 6 };

  // Batas percobaan Player B (Color Detective) per ronde, mirip Mastermind.
  const MAX_ATTEMPTS = 8;

  // Tingkat kemiripan (%) yang dianggap "tepat"/solved. Karena mixing
  // bersifat deterministik terhadap kombinasi (R,G,B), 100% hanya tercapai
  // bila kombinasi persis sama dengan milik Creator.
  const SOLVED_THRESHOLD = 99.5;

  // Opasitas setiap keping transparan saat disimulasikan menumpuk (0-1).
  // Semakin kecil, semakin banyak keping dibutuhkan untuk warna pekat.
  const CHIP_ALPHA = 0.45;

  // Kunci localStorage.
  const LS_THEME = 'rgbcd_theme';
  const LS_LEADERBOARD = 'rgbcd_leaderboard';

  const COLOR_KEYS = ['R', 'G', 'B'];
  const COLOR_LABEL = { R: 'Merah', G: 'Hijau', B: 'Biru' };
  const COLOR_RGB = { R: { r: 255, g: 0, b: 0 }, G: { r: 0, g: 255, b: 0 }, B: { r: 0, g: 0, b: 255 } };

  /* =======================================================================
     2. STATE PERMAINAN
     Satu objek `state` menyimpan seluruh kondisi permainan saat ini.
     Tidak ada variabel global lain yang menyimpan data permainan.
  ======================================================================= */
  const state = {
    mode: 'local',          // 'local' (2 pemain 1 perangkat), 'multi' (2 pemain 2 perangkat), atau 'ai'
    humanRole: null,        // 'A' atau 'B' — peran yang dipilih pemain utama
    totalRounds: 5,
    currentRound: 0,

    // Peran BERSIFAT TETAP sepanjang permainan sesuai konsep game:
    // Player A SELALU Color Creator, Player B SELALU Color Detective.
    players: {
      A: { name: 'Pemain A', score: 0, isAI: false },
      B: { name: 'Pemain B', score: 0, isAI: false }
    },

    // Pilihan keping yang sedang disusun di mixing table (belum dikonfirmasi).
    creatorSelection: { R: 0, G: 0, B: 0 },
    detectiveSelection: { R: 0, G: 0, B: 0 },

    // Warna rahasia ronde berjalan: { counts:{R,G,B}, color:{r,g,b} }
    secret: null,

    // Semua percobaan Player B pada ronde berjalan.
    attempts: [],
    bestSimilarity: 0,
    bestGuess: null,

    // Riwayat hasil tiap ronde (untuk referensi / debugging, tidak wajib tampil semua).
    roundResults: [],

    aiStepTimer: null
  };

  /* =======================================================================
     3. REFERENSI DOM
  ======================================================================= */
  const $ = (id) => document.getElementById(id);

  const el = {
    themeToggle: $('themeToggle'),
    leaderboardBtn: $('leaderboardBtn'),
    leaderboardModal: $('leaderboardModal'),
    leaderboardList: $('leaderboardList'),
    closeLeaderboardBtn: $('closeLeaderboardBtn'),
    clearLeaderboardBtn: $('clearLeaderboardBtn'),
    toast: $('toast'),

    scoreboardBar: $('scoreboardBar'),
    scoreCardA: $('scoreCardA'),
    scoreCardB: $('scoreCardB'),
    scoreNameA: $('scoreNameA'),
    scoreNameB: $('scoreNameB'),
    scoreValueA: $('scoreValueA'),
    scoreValueB: $('scoreValueB'),
    scoreRoundLabel: $('scoreRoundLabel'),

    // Start screen
    modeLocalBtn: $('modeLocalBtn'),
    modeMultiBtn: $('modeMultiBtn'),
    modeAiBtn: $('modeAiBtn'),
    roleACard: $('roleACard'),
    roleBCard: $('roleBCard'),
    youNameLabel: $('youNameLabel'),
    youNameInput: $('youNameInput'),
    opponentNameRow: $('opponentNameRow'),
    opponentNameLabel: $('opponentNameLabel'),
    opponentNameInput: $('opponentNameInput'),
    startGameBtn: $('startGameBtn'),
    howToPlayToggle: $('howToPlayToggle'),
    howToPlayPanel: $('howToPlayPanel'),

    // Pass screen
    passTitle: $('passTitle'),
    passMessage: $('passMessage'),
    passRevealBtn: $('passRevealBtn'),

    // Creator screen
    creatorPlayerName: $('creatorPlayerName'),
    creatorMixTable: $('creatorMixTable'),
    creatorPreviewSwatch: $('creatorPreviewSwatch'),
    creatorCountsReadout: $('creatorCountsReadout'),
    creatorInventory: $('creatorInventory'),
    creatorResetBtn: $('creatorResetBtn'),
    creatorConfirmBtn: $('creatorConfirmBtn'),

    // Detective screen
    detectivePlayerName: $('detectivePlayerName'),
    detectiveSubtitle: $('detectiveSubtitle'),
    targetSwatch: $('targetSwatch'),
    attemptsRemaining: $('attemptsRemaining'),
    bestSimilarityValue: $('bestSimilarityValue'),
    similarityMeterFill: $('similarityMeterFill'),
    aiThinking: $('aiThinking'),
    detectiveMixingZone: $('detectiveMixingZone'),
    detectiveMixTable: $('detectiveMixTable'),
    detectivePreviewSwatch: $('detectivePreviewSwatch'),
    detectiveCountsReadout: $('detectiveCountsReadout'),
    detectiveInventory: $('detectiveInventory'),
    detectiveActionRow: $('detectiveActionRow'),
    detectiveResetBtn: $('detectiveResetBtn'),
    giveUpBtn: $('giveUpBtn'),
    submitAttemptBtn: $('submitAttemptBtn'),
    attemptsLog: $('attemptsLog'),

    // Summary screen
    summaryResultBadge: $('summaryResultBadge'),
    summaryRoundLabel: $('summaryRoundLabel'),
    summarySecretSwatch: $('summarySecretSwatch'),
    summaryCreatorName: $('summaryCreatorName'),
    summarySecretCounts: $('summarySecretCounts'),
    summaryBestSwatch: $('summaryBestSwatch'),
    summaryDetectiveName: $('summaryDetectiveName'),
    summaryBestCounts: $('summaryBestCounts'),
    summarySimilarity: $('summarySimilarity'),
    summaryAttemptsUsed: $('summaryAttemptsUsed'),
    summaryDetectiveScore: $('summaryDetectiveScore'),
    summaryCreatorScore: $('summaryCreatorScore'),
    nextRoundBtn: $('nextRoundBtn'),

    // Final screen
    winnerBanner: $('winnerBanner'),
    finalScoresList: $('finalScoresList'),
    playAgainBtn: $('playAgainBtn'),
    mainMenuBtn: $('mainMenuBtn'),

    // Mode 2 Perangkat — sisi Creator (A)
    codeDisplayRoundLabel: $('codeDisplayRoundLabel'),
    codeDisplaySwatch: $('codeDisplaySwatch'),
    codeDisplayValue: $('codeDisplayValue'),
    copyCodeBtn: $('copyCodeBtn'),
    goToResultEntryBtn: $('goToResultEntryBtn'),
    resultSimilarityInput: $('resultSimilarityInput'),
    resultAttemptsInput: $('resultAttemptsInput'),
    skipResultEntryBtn: $('skipResultEntryBtn'),
    submitResultEntryBtn: $('submitResultEntryBtn'),
    creatorResultBadge: $('creatorResultBadge'),
    creatorResultRoundLabel: $('creatorResultRoundLabel'),
    creatorResultSwatch: $('creatorResultSwatch'),
    creatorResultSimilarity: $('creatorResultSimilarity'),
    creatorResultAttempts: $('creatorResultAttempts'),
    creatorResultScore: $('creatorResultScore'),
    creatorResultTotal: $('creatorResultTotal'),
    creatorNextRoundBtn: $('creatorNextRoundBtn'),

    // Mode 2 Perangkat — sisi Detective (B)
    codeEntryRoundLabel: $('codeEntryRoundLabel'),
    codeEntryInput: $('codeEntryInput'),
    codeEntryError: $('codeEntryError'),
    openCodeBtn: $('openCodeBtn'),
    detectiveResultBadge: $('detectiveResultBadge'),
    detectiveResultRoundLabel: $('detectiveResultRoundLabel'),
    detectiveResultTargetSwatch: $('detectiveResultTargetSwatch'),
    detectiveResultBestSwatch: $('detectiveResultBestSwatch'),
    detectiveResultBestCounts: $('detectiveResultBestCounts'),
    detectiveResultCallout: $('detectiveResultCallout'),
    detectiveResultScore: $('detectiveResultScore'),
    detectiveResultTotal: $('detectiveResultTotal'),
    detectiveNextRoundBtn: $('detectiveNextRoundBtn')
  };

  /* =======================================================================
     4. ALGORITMA PENCAMPURAN WARNA (RGB MIXING)
     -----------------------------------------------------------------------
     Setiap keping dianggap sebagai lapisan warna transparan (alpha= CHIP_ALPHA)
     yang ditumpuk di atas "meja" berwarna putih. Untuk membuat hasil mixing
     deterministik terhadap KOMBINASI (bukan urutan klik pemain), keping
     ditumpuk dalam urutan kanonik: semua Red dulu, lalu Green, lalu Blue.

     Rumus yang dipakai adalah "source-over alpha compositing" (Porter-Duff):
         hasil = warna_keping * alpha + warna_bawah * (1 - alpha)
     diterapkan berulang, lapisan demi lapisan.
  ======================================================================= */
  function mixColors(counts) {
    // Bentuk daftar lapisan sesuai urutan kanonik R -> G -> B.
    const layers = [];
    for (let i = 0; i < counts.R; i++) layers.push(COLOR_RGB.R);
    for (let i = 0; i < counts.G; i++) layers.push(COLOR_RGB.G);
    for (let i = 0; i < counts.B; i++) layers.push(COLOR_RGB.B);

    // Meja mixing dimulai putih bersih (belum ada keping sama sekali).
    let result = { r: 255, g: 255, b: 255 };

    for (const layer of layers) {
      result = alphaComposite(layer, CHIP_ALPHA, result);
    }
    return result;
  }

  // Mencampur satu lapisan `src` (dengan transparansi srcAlpha) di atas `dst`.
  function alphaComposite(src, srcAlpha, dst) {
    return {
      r: Math.round(src.r * srcAlpha + dst.r * (1 - srcAlpha)),
      g: Math.round(src.g * srcAlpha + dst.g * (1 - srcAlpha)),
      b: Math.round(src.b * srcAlpha + dst.b * (1 - srcAlpha))
    };
  }

  function rgbToCss(c) {
    return `rgb(${c.r}, ${c.g}, ${c.b})`;
  }

  /* =======================================================================
     5. ALGORITMA JARAK WARNA & PERSENTASE KEMIRIPAN
     -----------------------------------------------------------------------
     Dua metrik dihitung setiap percobaan:
     a) Euclidean RGB distance — jarak lurus sederhana di ruang RGB 3D.
     b) "redmean" — pendekatan murah untuk Delta E (perceptual color
        distance) yang memberi bobot berbeda ke tiap kanal berdasarkan
        rata-rata kanal merah, supaya lebih dekat dengan persepsi mata
        manusia dibanding Euclidean biasa.
        Referensi rumus: https://www.compuphase.com/cmetric.htm
     Similarity % dihitung dari redmean, dinormalisasi terhadap jarak
     maksimum teoretis (hitam vs putih).
  ======================================================================= */
  function euclideanDistance(c1, c2) {
    const dr = c1.r - c2.r, dg = c1.g - c2.g, db = c1.b - c2.b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  function redmeanDistance(c1, c2) {
    const rMean = (c1.r + c2.r) / 2;
    const dr = c1.r - c2.r, dg = c1.g - c2.g, db = c1.b - c2.b;
    const weightR = 2 + rMean / 256;
    const weightG = 4.0;
    const weightB = 2 + (255 - rMean) / 256;
    return Math.sqrt(weightR * dr * dr + weightG * dg * dg + weightB * db * db);
  }

  // Jarak redmean maksimum yang mungkin terjadi (hitam murni vs putih murni),
  // dipakai sebagai pembagi normalisasi supaya similarity berada di 0-100%.
  const MAX_REDMEAN_DISTANCE = redmeanDistance({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 });

  function computeSimilarity(guessColor, targetColor) {
    const distance = redmeanDistance(guessColor, targetColor);
    const euclidean = euclideanDistance(guessColor, targetColor);
    const similarity = Math.max(0, 100 - (distance / MAX_REDMEAN_DISTANCE) * 100);
    return { distance, euclidean, similarity };
  }

  /* =======================================================================
     5b. KODE WARNA — untuk MODE 2 PERANGKAT
     -----------------------------------------------------------------------
     Karena permainan berjalan sepenuhnya offline tanpa server, warna target
     dipindahkan dari perangkat Creator ke perangkat Detective secara MANUAL:
     Creator membaca/menyalin kode 7 karakter, Detective mengetikkannya.
     Kode hanya merepresentasikan WARNA HASIL CAMPURAN (r,g,b) — bukan
     komposisi keping R/G/B rahasia — sehingga tetap tidak membocorkan
     jawaban. Format: 6 digit heksadesimal (RRGGBB) + 1 karakter checksum
     base-36 untuk menangkap salah ketik.
  ======================================================================= */
  function encodeColorCode(color) {
    const toHex2 = (n) => n.toString(16).padStart(2, '0').toUpperCase();
    const hex = toHex2(color.r) + toHex2(color.g) + toHex2(color.b);
    const checksum = ((color.r + color.g + color.b) % 36).toString(36).toUpperCase();
    return hex + checksum;
  }

  function decodeColorCode(rawInput) {
    const code = (rawInput || '').trim().toUpperCase().replace(/[\s-]/g, '');
    if (code.length !== 7) return null;
    const hexPart = code.slice(0, 6);
    const checkPart = code.slice(6, 7);
    if (!/^[0-9A-F]{6}$/.test(hexPart)) return null;
    if (!/^[0-9A-Z]$/.test(checkPart)) return null;

    const r = parseInt(hexPart.slice(0, 2), 16);
    const g = parseInt(hexPart.slice(2, 4), 16);
    const b = parseInt(hexPart.slice(4, 6), 16);
    const expectedCheck = ((r + g + b) % 36).toString(36).toUpperCase();
    if (expectedCheck !== checkPart) return null; // salah ketik terdeteksi

    return { r, g, b };
  }

  // Menyisipkan tanda pisah sebelum karakter checksum agar mudah dibaca, mis. "3F2A1B-Q".
  function formatCodeForDisplay(code) {
    return code.slice(0, 6) + '-' + code.slice(6);
  }

  function copyTextToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* diabaikan: clipboard tetap bisa disalin manual */ }
    document.body.removeChild(ta);
  }

  /* =======================================================================
     6. SISTEM SKOR
     -----------------------------------------------------------------------
     Skor Detective (Player B) per ronde:
        base    = pembulatan similarity terbaik (0-100)
        penalti = (jumlah_percobaan - 1) * 4   -> makin banyak coba, makin kecil skor
        bonus   = +15 jika berhasil tepat (similarity >= SOLVED_THRESHOLD)
        skor    = clamp(base - penalti + bonus, 0, 100)

     Skor Creator (Player A) per ronde adalah KEBALIKAN dari skor Detective:
        skorCreator = 100 - skorDetective
     Semakin sulit warna rahasia ditebak (skor Detective rendah), semakin
     besar skor yang didapat Creator. Ini membuat kedua peran punya insentif
     strategis meski tugasnya berbeda.
  ======================================================================= */
  // Versi umum: dipakai baik oleh alur normal (state.attempts) maupun oleh
  // mode 2 perangkat, di mana Creator memasukkan kemiripan & percobaan B
  // secara manual (karena tidak ada koneksi langsung antar perangkat).
  function computeDetectiveScoreFromStats(similarity, attemptsUsed, solved) {
    if (!attemptsUsed || attemptsUsed <= 0) return 0;
    const base = Math.round(similarity);
    const penalty = (attemptsUsed - 1) * 4;
    const bonus = solved ? 15 : 0;
    return Math.max(0, Math.min(100, base - penalty + bonus));
  }

  function computeDetectiveScore(solved) {
    return computeDetectiveScoreFromStats(state.bestSimilarity, state.attempts.length, solved);
  }

  function computeCreatorScore(detectiveScore) {
    return Math.max(0, Math.min(100, 100 - detectiveScore));
  }

  /* =======================================================================
     7. UTILITAS UMUM
  ======================================================================= */
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function totalChips(counts) { return counts.R + counts.G + counts.B; }

  let toastTimer = null;
  function showToast(msg) {
    el.toast.textContent = msg;
    el.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove('show'), 2200);
  }

  function formatCounts(counts) {
    return `R:${counts.R}  G:${counts.G}  B:${counts.B}  (${totalChips(counts)} keping)`;
  }

  /* =======================================================================
     8. TEMA TERANG / GELAP
  ======================================================================= */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    el.themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem(LS_THEME, theme);
  }

  function initTheme() {
    const saved = localStorage.getItem(LS_THEME);
    if (saved === 'dark' || saved === 'light') {
      applyTheme(saved);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }
  }

  el.themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* =======================================================================
     9. PENYIMPANAN LOKAL — PAPAN PERINGKAT (localStorage)
  ======================================================================= */
  function loadLeaderboard() {
    try {
      const raw = localStorage.getItem(LS_LEADERBOARD);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveLeaderboardEntry(name, score, roleLabel) {
    const list = loadLeaderboard();
    list.push({
      name: name || 'Pemain',
      score,
      role: roleLabel,
      rounds: state.totalRounds,
      mode: state.mode === 'ai' ? 'vs AI' : (state.mode === 'multi' ? '2 Perangkat' : '2 Pemain (1 HP)'),
      date: new Date().toISOString()
    });
    list.sort((a, b) => b.score - a.score);
    const trimmed = list.slice(0, 20);
    localStorage.setItem(LS_LEADERBOARD, JSON.stringify(trimmed));
    renderLeaderboard();
  }

  function renderLeaderboard() {
    const list = loadLeaderboard();
    el.leaderboardList.innerHTML = '';
    if (list.length === 0) {
      el.leaderboardList.innerHTML = '<p class="muted">Belum ada data. Selesaikan permainan untuk mengisi papan peringkat!</p>';
      return;
    }
    list.forEach((entry, idx) => {
      const li = document.createElement('li');
      li.className = 'leaderboard-row';
      const dateStr = new Date(entry.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
      li.innerHTML = `
        <span class="leaderboard-rank">#${idx + 1}</span>
        <span class="leaderboard-name">${escapeHtml(entry.name)}</span>
        <span class="leaderboard-meta">${escapeHtml(entry.role || '')} &middot; ${escapeHtml(entry.mode)} &middot; ${dateStr}</span>
        <span class="leaderboard-score">${entry.score}</span>
      `;
      el.leaderboardList.appendChild(li);
    });
  }

  function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str == null ? '' : String(str);
    return d.innerHTML;
  }

  el.leaderboardBtn.addEventListener('click', () => {
    renderLeaderboard();
    el.leaderboardModal.classList.remove('hidden');
  });
  el.closeLeaderboardBtn.addEventListener('click', () => el.leaderboardModal.classList.add('hidden'));
  el.leaderboardModal.addEventListener('click', (e) => { if (e.target === el.leaderboardModal) el.leaderboardModal.classList.add('hidden'); });
  el.clearLeaderboardBtn.addEventListener('click', () => {
    if (confirm('Hapus semua data papan peringkat lokal?')) {
      localStorage.removeItem(LS_LEADERBOARD);
      renderLeaderboard();
      showToast('Papan peringkat dikosongkan.');
    }
  });

  /* =======================================================================
     10. NAVIGASI ANTAR LAYAR (SCREEN)
  ======================================================================= */
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
    $(id).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* =======================================================================
     11. LAYAR AWAL — pemilihan mode, peran, nama, jumlah ronde
  ======================================================================= */
  function updateStartScreenLabels() {
    const roleChosen = state.humanRole;
    const opponentRole = roleChosen === 'A' ? 'B' : 'A';

    if (roleChosen) {
      el.youNameLabel.textContent = `Nama Anda (Peran ${roleChosen})`;
      el.youNameInput.disabled = false;
    } else {
      el.youNameLabel.textContent = 'Nama Anda';
    }

    if (state.mode === 'ai') {
      el.opponentNameRow.classList.add('hidden');
    } else {
      el.opponentNameRow.classList.remove('hidden');
      el.opponentNameLabel.textContent = roleChosen ? `Nama Lawan (Peran ${opponentRole})` : 'Nama Lawan';
    }

    el.startGameBtn.disabled = !roleChosen;
    el.startGameBtn.textContent = roleChosen ? 'Mulai Permainan' : 'Pilih peran dahulu';
  }

  el.modeLocalBtn.addEventListener('click', () => setMode('local'));
  el.modeMultiBtn.addEventListener('click', () => setMode('multi'));
  el.modeAiBtn.addEventListener('click', () => setMode('ai'));
  function setMode(mode) {
    state.mode = mode;
    el.modeLocalBtn.classList.toggle('is-selected', mode === 'local');
    el.modeLocalBtn.setAttribute('aria-pressed', mode === 'local');
    el.modeMultiBtn.classList.toggle('is-selected', mode === 'multi');
    el.modeMultiBtn.setAttribute('aria-pressed', mode === 'multi');
    el.modeAiBtn.classList.toggle('is-selected', mode === 'ai');
    el.modeAiBtn.setAttribute('aria-pressed', mode === 'ai');
    updateStartScreenLabels();
  }

  el.roleACard.addEventListener('click', () => setHumanRole('A'));
  el.roleBCard.addEventListener('click', () => setHumanRole('B'));
  function setHumanRole(role) {
    state.humanRole = role;
    el.roleACard.setAttribute('aria-pressed', role === 'A');
    el.roleBCard.setAttribute('aria-pressed', role === 'B');
    updateStartScreenLabels();
  }

  document.querySelectorAll('.rounds-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.rounds-btn').forEach((b) => { b.classList.remove('is-selected'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('is-selected');
      btn.setAttribute('aria-pressed', 'true');
      state.totalRounds = parseInt(btn.dataset.rounds, 10);
    });
  });

  el.howToPlayToggle.addEventListener('click', () => {
    const isHidden = el.howToPlayPanel.classList.toggle('hidden');
    el.howToPlayToggle.textContent = isHidden ? 'Bagaimana cara bermain? ▾' : 'Bagaimana cara bermain? ▴';
  });

  el.startGameBtn.addEventListener('click', beginGame);

  function beginGame() {
    if (!state.humanRole) return;

    const youName = (el.youNameInput.value || '').trim() || `Pemain ${state.humanRole}`;
    const opponentRole = state.humanRole === 'A' ? 'B' : 'A';

    // ---- SISTEM ROLE A/B ----
    // Player A selalu Color Creator, Player B selalu Color Detective.
    // `isAI` ditentukan dari kombinasi mode permainan & peran yang dipilih
    // pemain manusia utama (state.humanRole).
    state.players.A.isAI = state.mode === 'ai' && state.humanRole === 'B';
    state.players.B.isAI = state.mode === 'ai' && state.humanRole === 'A';

    state.players[state.humanRole].name = youName;
    if (state.mode === 'ai') {
      state.players[opponentRole].name = 'AI';
    } else {
      const oppName = (el.opponentNameInput.value || '').trim() || `Pemain ${opponentRole}`;
      state.players[opponentRole].name = oppName;
    }

    state.players.A.score = 0;
    state.players.B.score = 0;
    state.roundResults = [];

    el.scoreboardBar.classList.remove('hidden');
    el.scoreNameA.textContent = state.players.A.name + (state.players.A.isAI ? ' 🤖' : '');
    el.scoreNameB.textContent = state.players.B.name + (state.players.B.isAI ? ' 🤖' : '');

    goToRound(1);
  }

  /* =======================================================================
     12. SISTEM RONDE
     -----------------------------------------------------------------------
     Setiap ronde baru: reset inventory (via reset selection ke 0, karena
     INVENTORY_MAX konstan artinya kuota selalu penuh lagi), reset percobaan,
     lalu jalankan giliran Creator (manusia/AI) diikuti giliran Detective.
  ======================================================================= */
  function goToRound(n) {
    state.currentRound = n;
    state.secret = null;
    state.attempts = [];
    state.bestSimilarity = 0;
    state.bestGuess = null;
    state.creatorSelection = { R: 0, G: 0, B: 0 };
    state.detectiveSelection = { R: 0, G: 0, B: 0 };

    renderScoreboard();

    // ---- MODE 2 PERANGKAT ----
    // Tidak ada AI maupun serah-perangkat: setiap perangkat langsung masuk
    // ke tahapan sesuai satu-satunya peran yang dipilih di layar awal.
    if (state.mode === 'multi') {
      if (state.humanRole === 'A') {
        showCreatorPhase();
      } else {
        showCodeEntryScreen();
      }
      return;
    }

    if (state.players.A.isAI) {
      // AI langsung meracik warna rahasia tanpa perlu layar/pass-device.
      state.secret = aiGenerateSecret();
      showToast('🤖 AI telah meracik warna rahasia.');
      proceedToDetectivePhase();
    } else if (state.mode === 'local') {
      showPassScreen('A', () => showCreatorPhase());
    } else {
      showCreatorPhase();
    }
  }

  function renderScoreboard() {
    el.scoreValueA.textContent = state.players.A.score;
    el.scoreValueB.textContent = state.players.B.score;
    el.scoreRoundLabel.textContent = `Ronde ${state.currentRound} / ${state.totalRounds}`;

    // Di mode 2 perangkat, skor lawan tidak tersinkron otomatis (tidak ada
    // server), jadi kartu skor yang ditampilkan hanya milik peran aktif
    // di perangkat ini supaya tidak menampilkan angka yang menyesatkan.
    if (state.mode === 'multi') {
      el.scoreCardA.classList.toggle('hidden', state.humanRole !== 'A');
      el.scoreCardB.classList.toggle('hidden', state.humanRole !== 'B');
    } else {
      el.scoreCardA.classList.remove('hidden');
      el.scoreCardB.classList.remove('hidden');
    }
  }

  function showPassScreen(nextRole, onReady) {
    const player = state.players[nextRole];
    const roleLabel = nextRole === 'A' ? 'Color Creator' : 'Color Detective';
    el.passTitle.textContent = 'Serahkan Perangkat';
    el.passMessage.textContent = `Giliran ${player.name} sebagai ${roleLabel}. Pastikan pemain lain tidak melihat layar saat meracik warna.`;
    showScreen('screen-pass');
    el.passRevealBtn.onclick = () => onReady();
  }

  /* =======================================================================
     13. FASE CREATOR (Player A meracik warna rahasia)
  ======================================================================= */
  function showCreatorPhase() {
    state.creatorSelection = { R: 0, G: 0, B: 0 };
    el.creatorPlayerName.textContent = state.players.A.name;
    renderInventory(el.creatorInventory, state.creatorSelection, INVENTORY_MAX, renderCreatorMix);
    renderCreatorMix();
    showScreen('screen-creator');
  }

  function renderCreatorMix() {
    renderMixTable(el.creatorMixTable, state.creatorSelection);
    const mixed = mixColors(state.creatorSelection);
    el.creatorPreviewSwatch.style.backgroundColor = rgbToCss(mixed);
    el.creatorCountsReadout.textContent = totalChips(state.creatorSelection) > 0
      ? formatCounts(state.creatorSelection)
      : 'Belum ada keping';
    el.creatorConfirmBtn.disabled = totalChips(state.creatorSelection) === 0;
  }

  el.creatorResetBtn.addEventListener('click', () => {
    state.creatorSelection = { R: 0, G: 0, B: 0 };
    renderInventory(el.creatorInventory, state.creatorSelection, INVENTORY_MAX, renderCreatorMix);
    renderCreatorMix();
  });

  el.creatorConfirmBtn.addEventListener('click', () => {
    if (totalChips(state.creatorSelection) === 0) return;
    state.secret = {
      counts: { ...state.creatorSelection },
      color: mixColors(state.creatorSelection)
    };
    if (state.mode === 'multi') {
      showCodeDisplay();
    } else {
      proceedToDetectivePhase();
    }
  });

  /* =======================================================================
     14. TRANSISI CREATOR -> DETECTIVE
  ======================================================================= */
  function proceedToDetectivePhase() {
    const detective = state.players.B;
    if (detective.isAI) {
      showDetectivePhase(true);
      runAIDetective();
    } else if (state.mode === 'local' && !state.players.A.isAI) {
      // Kedua pemain manusia -> perlu serah-perangkat sebelum B melihat target.
      showPassScreen('B', () => showDetectivePhase(false));
    } else {
      showDetectivePhase(false);
    }
  }

  /* =======================================================================
     14b. MODE 2 PERANGKAT — sisi Creator (A): tampilkan kode, terima hasil
     -----------------------------------------------------------------------
     Creator TIDAK pernah tahu hasil tebakan B secara otomatis (tidak ada
     server). Setelah menunjukkan kode warna, Creator menunggu B membacakan
     kemiripan & jumlah percobaannya, lalu memasukkannya secara manual agar
     skor Creator (kebalikan dari skor Detective) tetap bisa dihitung.
  ======================================================================= */
  function showCodeDisplay() {
    el.codeDisplayRoundLabel.textContent = `Ronde ${state.currentRound} / ${state.totalRounds}`;
    el.codeDisplaySwatch.style.backgroundColor = rgbToCss(state.secret.color);
    el.codeDisplayValue.textContent = formatCodeForDisplay(encodeColorCode(state.secret.color));
    showScreen('screen-code-display');
  }

  el.copyCodeBtn.addEventListener('click', () => {
    copyTextToClipboard(el.codeDisplayValue.textContent);
    showToast('Kode disalin ke clipboard.');
  });

  el.goToResultEntryBtn.addEventListener('click', showResultEntryScreen);

  function showResultEntryScreen() {
    el.resultSimilarityInput.value = '';
    el.resultAttemptsInput.value = '';
    showScreen('screen-result-entry');
  }

  el.submitResultEntryBtn.addEventListener('click', () => {
    const similarity = parseFloat(el.resultSimilarityInput.value);
    const attemptsUsed = parseInt(el.resultAttemptsInput.value, 10);
    const validSimilarity = !isNaN(similarity) && similarity >= 0 && similarity <= 100;
    const validAttempts = !isNaN(attemptsUsed) && attemptsUsed >= 1 && attemptsUsed <= MAX_ATTEMPTS;
    if (!validSimilarity || !validAttempts) {
      showToast(`Isi kemiripan (0-100) & jumlah percobaan (1-${MAX_ATTEMPTS}) dengan benar.`);
      return;
    }
    const solved = similarity >= SOLVED_THRESHOLD;
    const detectiveScore = computeDetectiveScoreFromStats(similarity, attemptsUsed, solved);
    const creatorScore = computeCreatorScore(detectiveScore);
    state.players.A.score += creatorScore;
    showCreatorRoundResult({ similarity, attempts: attemptsUsed, solved }, creatorScore, false);
  });

  el.skipResultEntryBtn.addEventListener('click', () => {
    showCreatorRoundResult(null, 0, true);
  });

  function showCreatorRoundResult(stats, creatorScore, skipped) {
    renderScoreboard();
    el.creatorResultBadge.textContent = skipped
      ? 'Penilaian Dilewati'
      : (stats.solved ? '🎯 B Menebak Tepat!' : 'Ronde Dinilai');
    el.creatorResultRoundLabel.textContent = `Ronde ${state.currentRound} / ${state.totalRounds}`;
    el.creatorResultSwatch.style.backgroundColor = rgbToCss(state.secret.color);
    el.creatorResultSimilarity.textContent = skipped ? '—' : `${stats.similarity.toFixed(1)}%`;
    el.creatorResultAttempts.textContent = skipped ? '—' : `${stats.attempts}`;
    el.creatorResultScore.textContent = `+${creatorScore}`;
    el.creatorResultTotal.textContent = `${state.players.A.score}`;
    el.creatorNextRoundBtn.textContent = state.currentRound >= state.totalRounds ? 'Lihat Hasil Akhir' : 'Ronde Berikutnya';
    showScreen('screen-creator-round-result');
  }

  el.creatorNextRoundBtn.addEventListener('click', goNextRoundOrFinish);

  /* =======================================================================
     14c. MODE 2 PERANGKAT — sisi Detective (B): buka kode, tampilkan hasil
  ======================================================================= */
  function showCodeEntryScreen() {
    el.codeEntryRoundLabel.textContent = `Ronde ${state.currentRound} / ${state.totalRounds}`;
    el.codeEntryInput.value = '';
    el.codeEntryError.classList.add('hidden');
    showScreen('screen-code-entry');
  }

  el.openCodeBtn.addEventListener('click', () => {
    const decoded = decodeColorCode(el.codeEntryInput.value);
    if (!decoded) {
      el.codeEntryError.classList.remove('hidden');
      return;
    }
    el.codeEntryError.classList.add('hidden');
    // Komposisi keping (counts) sengaja TIDAK diketahui B — hanya warna
    // hasil campurannya, persis seperti mode lain, agar tetap harus ditebak.
    state.secret = { counts: null, color: decoded };
    showDetectivePhase(false);
  });

  function endRoundMultiDetective(solved) {
    const detectiveScore = computeDetectiveScore(solved);
    state.players.B.score += detectiveScore;
    showDetectiveRoundResult(solved, detectiveScore);
  }

  function showDetectiveRoundResult(solved, detectiveScore) {
    renderScoreboard();
    el.detectiveResultBadge.textContent = solved
      ? '🎯 Tepat Sekali!'
      : (state.attempts.length >= MAX_ATTEMPTS ? 'Kehabisan Percobaan' : 'Ronde Diselesaikan');
    el.detectiveResultRoundLabel.textContent = `Ronde ${state.currentRound} / ${state.totalRounds}`;
    el.detectiveResultTargetSwatch.style.backgroundColor = rgbToCss(state.secret.color);
    if (state.bestGuess) {
      el.detectiveResultBestSwatch.style.backgroundColor = rgbToCss(state.bestGuess.color);
      el.detectiveResultBestCounts.textContent = formatCounts(state.bestGuess.counts);
    } else {
      el.detectiveResultBestSwatch.style.backgroundColor = '#ffffff';
      el.detectiveResultBestCounts.textContent = 'Tidak ada percobaan';
    }
    el.detectiveResultCallout.textContent = `${state.bestSimilarity.toFixed(1)}% \u00b7 ${state.attempts.length} percobaan`;
    el.detectiveResultScore.textContent = `+${detectiveScore}`;
    el.detectiveResultTotal.textContent = `${state.players.B.score}`;
    el.detectiveNextRoundBtn.textContent = state.currentRound >= state.totalRounds ? 'Lihat Hasil Akhir' : 'Ronde Berikutnya';
    showScreen('screen-detective-round-result');
  }

  el.detectiveNextRoundBtn.addEventListener('click', goNextRoundOrFinish);

  // Dipakai bersama oleh layar ringkasan normal maupun mode 2 perangkat.
  function goNextRoundOrFinish() {
    if (state.currentRound >= state.totalRounds) {
      endGame();
    } else {
      goToRound(state.currentRound + 1);
    }
  }

  /* =======================================================================
     15. FASE DETECTIVE (Player B menebak warna)
  ======================================================================= */
  function showDetectivePhase(isAITurn) {
    state.detectiveSelection = { R: 0, G: 0, B: 0 };
    el.detectivePlayerName.textContent = state.players.B.name;
    el.detectiveSubtitle.textContent = isAITurn
      ? 'AI sedang mencoba menebak warna target berdasarkan hasil percobaan sebelumnya.'
      : 'Cocokkan warna target dengan racikan keping Anda sendiri.';

    el.targetSwatch.style.backgroundColor = rgbToCss(state.secret.color);
    el.attemptsLog.innerHTML = '';
    updateDetectiveStats();

    el.aiThinking.classList.toggle('hidden', !isAITurn);
    el.detectiveMixingZone.classList.toggle('hidden', isAITurn);
    el.detectiveInventory.classList.toggle('hidden', isAITurn);
    el.detectiveActionRow.classList.toggle('hidden', isAITurn);

    if (!isAITurn) {
      renderInventory(el.detectiveInventory, state.detectiveSelection, INVENTORY_MAX, renderDetectiveMix);
      renderDetectiveMix();
    }

    showScreen('screen-detective');
  }

  function renderDetectiveMix() {
    renderMixTable(el.detectiveMixTable, state.detectiveSelection);
    const mixed = mixColors(state.detectiveSelection);
    el.detectivePreviewSwatch.style.backgroundColor = rgbToCss(mixed);
    el.detectiveCountsReadout.textContent = totalChips(state.detectiveSelection) > 0
      ? formatCounts(state.detectiveSelection)
      : 'Belum ada keping';
  }

  function updateDetectiveStats() {
    el.attemptsRemaining.textContent = `${state.attempts.length} / ${MAX_ATTEMPTS}`;
    el.bestSimilarityValue.textContent = `${state.bestSimilarity.toFixed(1)}%`;
    el.similarityMeterFill.style.width = `${clamp(state.bestSimilarity, 0, 100)}%`;
  }

  el.detectiveResetBtn.addEventListener('click', () => {
    state.detectiveSelection = { R: 0, G: 0, B: 0 };
    renderInventory(el.detectiveInventory, state.detectiveSelection, INVENTORY_MAX, renderDetectiveMix);
    renderDetectiveMix();
  });

  el.submitAttemptBtn.addEventListener('click', () => {
    const guessCounts = { ...state.detectiveSelection };
    const result = recordAttempt(guessCounts);

    // Kembalikan keping ke inventory (racikan boleh dicoba ulang tiap percobaan).
    state.detectiveSelection = { R: 0, G: 0, B: 0 };
    renderInventory(el.detectiveInventory, state.detectiveSelection, INVENTORY_MAX, renderDetectiveMix);
    renderDetectiveMix();

    if (result.solved || result.exhausted) {
      if (state.mode === 'multi') endRoundMultiDetective(result.solved); else endRound(result.solved);
    }
  });

  el.giveUpBtn.addEventListener('click', () => {
    if (state.mode === 'multi') endRoundMultiDetective(false); else endRound(false);
  });

  // Mencatat satu percobaan Player B (dipakai baik oleh manusia maupun AI).
  function recordAttempt(counts) {
    const color = mixColors(counts);
    const { distance, euclidean, similarity } = computeSimilarity(color, state.secret.color);
    const attempt = {
      index: state.attempts.length + 1,
      counts,
      color,
      distance,
      euclidean,
      similarity
    };
    state.attempts.push(attempt);

    if (similarity > state.bestSimilarity) {
      state.bestSimilarity = similarity;
      state.bestGuess = attempt;
    }

    renderAttemptRow(attempt, attempt === state.bestGuess);
    updateDetectiveStats();

    const solved = state.bestSimilarity >= SOLVED_THRESHOLD;
    const exhausted = state.attempts.length >= MAX_ATTEMPTS;
    return { solved, exhausted, attempt };
  }

  function renderAttemptRow(attempt, isBest) {
    const li = document.createElement('li');
    li.className = 'attempt-item' + (isBest ? ' best' : '');
    li.innerHTML = `
      <span class="attempt-idx">#${attempt.index}</span>
      <span class="attempt-swatch" style="background-color:${rgbToCss(attempt.color)}"></span>
      <span class="attempt-formula">R:${attempt.counts.R} G:${attempt.counts.G} B:${attempt.counts.B} &middot; &Delta;E&asymp;${attempt.distance.toFixed(0)}</span>
      <span class="attempt-pct">${attempt.similarity.toFixed(1)}%</span>
    `;
    el.attemptsLog.prepend(li);
  }

  /* =======================================================================
     16. AI SEDERHANA
     -----------------------------------------------------------------------
     a) aiGenerateSecret() — AI sebagai Creator: memilih jumlah keping acak
        (tidak semuanya nol) untuk tiap warna, lalu mencampurnya.
     b) runAIDetective() — AI sebagai Detective: strategi hill-climbing
        sederhana. Tebakan pertama acak; tebakan berikutnya dibuat dengan
        memodifikasi tebakan TERBAIK sejauh ini sebesar +-1 pada satu kanal
        (kadang melompat acak untuk menghindari macet di titik lokal).
        Setiap langkah diberi jeda (setTimeout) agar terasa seperti giliran
        dalam boardgame, bukan komputasi instan.
  ======================================================================= */
  function aiGenerateSecret() {
    const counts = {
      R: randInt(0, INVENTORY_MAX.R),
      G: randInt(0, INVENTORY_MAX.G),
      B: randInt(0, INVENTORY_MAX.B)
    };
    // Pastikan tidak semua nol (warna putih polos kurang menarik untuk ditebak).
    if (totalChips(counts) === 0) counts.R = randInt(1, INVENTORY_MAX.R);
    return { counts, color: mixColors(counts) };
  }

  function randomCounts() {
    return { R: randInt(0, INVENTORY_MAX.R), G: randInt(0, INVENTORY_MAX.G), B: randInt(0, INVENTORY_MAX.B) };
  }

  function runAIDetective() {
    clearTimeout(state.aiStepTimer);
    aiStep();
  }

  function aiStep() {
    let guess;
    if (state.attempts.length === 0 || !state.bestGuess) {
      // Tebakan pertama: acak sepenuhnya untuk eksplorasi awal.
      guess = randomCounts();
    } else {
      // Tebakan berikutnya: coordinate ascent sederhana. Bandingkan warna
      // tebakan terbaik dengan target per-kanal (r,g,b), lalu perbesar/
      // perkecil jumlah keping yang kanal warnanya paling berpengaruh pada
      // selisih terbesar — bukan sekadar acak, agar AI konvergen lebih cepat
      // walau tetap sederhana (bukan pencarian optimal/global).
      guess = { ...state.bestGuess.counts };
      const g = state.bestGuess.color, t = state.secret.color;
      const diffs = { R: t.r - g.r, G: t.g - g.g, B: t.b - g.b };
      const bigJump = Math.random() < 0.15; // sesekali lompat besar agar tidak macet di titik lokal

      if (bigJump) {
        const channel = COLOR_KEYS[randInt(0, 2)];
        guess[channel] = randInt(0, INVENTORY_MAX[channel]);
      } else {
        // Kanal dengan selisih absolut terbesar dianggap paling perlu dikoreksi.
        const channel = COLOR_KEYS.reduce((a, b) => (Math.abs(diffs[a]) >= Math.abs(diffs[b]) ? a : b));
        const direction = diffs[channel] > 0 ? 1 : -1; // + berarti perlu keping warna ini lebih banyak
        guess[channel] = clamp(guess[channel] + direction, 0, INVENTORY_MAX[channel]);
      }
    }

    const result = recordAttempt(guess);
    renderDetectiveMix.call(null); // no-op guard (mixing zone tersembunyi saat giliran AI)

    if (result.solved || result.exhausted) {
      state.aiStepTimer = setTimeout(() => endRound(result.solved), 500);
    } else {
      state.aiStepTimer = setTimeout(aiStep, 650);
    }
  }

  /* =======================================================================
     17. AKHIR RONDE & RINGKASAN
  ======================================================================= */
  function endRound(solved) {
    const detectiveScore = computeDetectiveScore(solved);
    const creatorScore = computeCreatorScore(detectiveScore);

    state.players.B.score += detectiveScore;
    state.players.A.score += creatorScore;

    state.roundResults.push({
      round: state.currentRound,
      secret: state.secret,
      bestGuess: state.bestGuess,
      bestSimilarity: state.bestSimilarity,
      attemptsUsed: state.attempts.length,
      solved,
      detectiveScore,
      creatorScore
    });

    showSummaryScreen(solved, detectiveScore, creatorScore);
  }

  function showSummaryScreen(solved, detectiveScore, creatorScore) {
    renderScoreboard();

    el.summaryResultBadge.textContent = solved ? '🎯 Tepat Sekali!' : (state.attempts.length >= MAX_ATTEMPTS ? 'Kehabisan Percobaan' : 'Ronde Diselesaikan');
    el.summaryRoundLabel.textContent = `Ronde ${state.currentRound} / ${state.totalRounds}`;

    el.summarySecretSwatch.style.backgroundColor = rgbToCss(state.secret.color);
    el.summaryCreatorName.textContent = state.players.A.name;
    el.summarySecretCounts.textContent = formatCounts(state.secret.counts);

    el.summaryDetectiveName.textContent = state.players.B.name;
    if (state.bestGuess) {
      el.summaryBestSwatch.style.backgroundColor = rgbToCss(state.bestGuess.color);
      el.summaryBestCounts.textContent = formatCounts(state.bestGuess.counts);
    } else {
      el.summaryBestSwatch.style.backgroundColor = '#ffffff';
      el.summaryBestCounts.textContent = 'Tidak ada percobaan';
    }

    el.summarySimilarity.textContent = `${state.bestSimilarity.toFixed(1)}%`;
    el.summaryAttemptsUsed.textContent = `${state.attempts.length}`;
    el.summaryDetectiveScore.textContent = `+${detectiveScore}`;
    el.summaryCreatorScore.textContent = `+${creatorScore}`;

    el.nextRoundBtn.textContent = state.currentRound >= state.totalRounds ? 'Lihat Hasil Akhir' : 'Ronde Berikutnya';

    showScreen('screen-summary');
  }

  el.nextRoundBtn.addEventListener('click', goNextRoundOrFinish);

  /* =======================================================================
     18. HASIL AKHIR PERMAINAN
  ======================================================================= */
  function endGame() {
    if (state.mode === 'multi') { endGameMulti(); return; }

    const a = state.players.A, b = state.players.B;
    let winnerText;
    if (a.score === b.score) {
      winnerText = `🤝 Seri! ${a.name} & ${b.name} sama-sama meraih ${a.score} poin.`;
    } else {
      const winner = a.score > b.score ? a : b;
      const winnerRole = a.score > b.score ? 'Color Creator' : 'Color Detective';
      winnerText = `🏆 ${winner.name} menang sebagai ${winnerRole} dengan ${winner.score} poin!`;
    }
    el.winnerBanner.textContent = winnerText;

    el.finalScoresList.innerHTML = '';
    [
      { key: 'A', roleLabel: 'Color Creator' },
      { key: 'B', roleLabel: 'Color Detective' }
    ].forEach(({ key, roleLabel }) => {
      const player = state.players[key];
      const isWinner = (a.score === b.score) ? false : (player.score === Math.max(a.score, b.score));
      const card = document.createElement('div');
      card.className = 'final-score-card' + (isWinner ? ' is-winner' : '');
      card.innerHTML = `
        <span class="score-avatar ${key === 'A' ? 'avatar-a' : 'avatar-b'}">${key}</span>
        <span class="final-score-name">${escapeHtml(player.name)}${player.isAI ? ' 🤖' : ''}<span class="final-score-role">${roleLabel}</span></span>
        <span class="final-score-value">${player.score}</span>
      `;
      if (!player.isAI) {
        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn btn-ghost final-save-btn';
        saveBtn.type = 'button';
        saveBtn.textContent = 'Simpan Skor';
        saveBtn.addEventListener('click', () => {
          saveLeaderboardEntry(player.name, player.score, roleLabel);
          saveBtn.textContent = 'Tersimpan ✓';
          saveBtn.disabled = true;
          showToast('Skor disimpan ke papan peringkat lokal.');
        });
        card.appendChild(saveBtn);
      }
      el.finalScoresList.appendChild(card);
    });

    showScreen('screen-final');
  }

  // ---- MODE 2 PERANGKAT ----
  // Tidak ada cara mengetahui skor akhir sisi lawan tanpa server, jadi
  // layar akhir hanya menampilkan skor milik peran di perangkat ini.
  function endGameMulti() {
    const roleLabel = state.humanRole === 'A' ? 'Color Creator' : 'Color Detective';
    const player = state.players[state.humanRole];

    el.winnerBanner.textContent = `🏁 Permainan Selesai — Total skor Anda: ${player.score} poin`;

    el.finalScoresList.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'final-score-card is-winner';
    card.innerHTML = `
      <span class="score-avatar ${state.humanRole === 'A' ? 'avatar-a' : 'avatar-b'}">${state.humanRole}</span>
      <span class="final-score-name">${escapeHtml(player.name)}<span class="final-score-role">${roleLabel} &middot; 2 Perangkat</span></span>
      <span class="final-score-value">${player.score}</span>
    `;
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn btn-ghost final-save-btn';
    saveBtn.type = 'button';
    saveBtn.textContent = 'Simpan Skor';
    saveBtn.addEventListener('click', () => {
      saveLeaderboardEntry(player.name, player.score, roleLabel);
      saveBtn.textContent = 'Tersimpan ✓';
      saveBtn.disabled = true;
      showToast('Skor disimpan ke papan peringkat lokal.');
    });
    card.appendChild(saveBtn);
    el.finalScoresList.appendChild(card);

    const note = document.createElement('p');
    note.className = 'muted';
    note.style.textAlign = 'center';
    note.textContent = 'Skor pasangan Anda tersimpan di perangkat mereka sendiri.';
    el.finalScoresList.appendChild(note);

    showScreen('screen-final');
  }

  el.playAgainBtn.addEventListener('click', () => {
    state.players.A.score = 0;
    state.players.B.score = 0;
    goToRound(1);
  });

  el.mainMenuBtn.addEventListener('click', () => {
    el.scoreboardBar.classList.add('hidden');
    showScreen('screen-start');
  });

  /* =======================================================================
     19. RENDER INVENTORY KEPING (dipakai bersama oleh Creator & Detective)
     -----------------------------------------------------------------------
     `selection` adalah objek {R,G,B} yang sedang disusun pemain.
     `maxCounts` adalah kuota maksimum per warna (INVENTORY_MAX).
     `onChange` dipanggil setiap kali jumlah keping berubah, untuk
     memperbarui mixing table & pratinjau warna.
  ======================================================================= */
  function renderInventory(container, selection, maxCounts, onChange) {
    container.innerHTML = '';
    COLOR_KEYS.forEach((colorKey) => {
      const row = document.createElement('div');
      row.className = 'chip-row';

      const visual = document.createElement('div');
      visual.className = `chip-visual color-${colorKey.toLowerCase()}`;
      visual.innerHTML = `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17"></circle></svg>`;

      const info = document.createElement('div');
      info.innerHTML = `
        <span class="chip-name">${COLOR_LABEL[colorKey]} (${colorKey})</span>
        <span class="chip-count">Terpakai <strong data-used>${selection[colorKey]}</strong> / Stok ${maxCounts[colorKey]}</span>
      `;

      const controls = document.createElement('div');
      controls.className = 'chip-controls';

      const minusBtn = document.createElement('button');
      minusBtn.type = 'button';
      minusBtn.className = 'chip-btn';
      minusBtn.textContent = '–';
      minusBtn.setAttribute('aria-label', `Kurangi keping ${COLOR_LABEL[colorKey]}`);
      minusBtn.disabled = selection[colorKey] <= 0;
      minusBtn.addEventListener('click', () => {
        if (selection[colorKey] > 0) {
          selection[colorKey]--;
          renderInventory(container, selection, maxCounts, onChange);
          onChange();
        }
      });

      const currentSpan = document.createElement('span');
      currentSpan.className = 'chip-current';
      currentSpan.textContent = selection[colorKey];

      const plusBtn = document.createElement('button');
      plusBtn.type = 'button';
      plusBtn.className = 'chip-btn';
      plusBtn.textContent = '+';
      plusBtn.setAttribute('aria-label', `Tambah keping ${COLOR_LABEL[colorKey]}`);
      plusBtn.disabled = selection[colorKey] >= maxCounts[colorKey];
      plusBtn.addEventListener('click', () => {
        if (selection[colorKey] < maxCounts[colorKey]) {
          selection[colorKey]++;
          renderInventory(container, selection, maxCounts, onChange);
          onChange();
        }
      });

      controls.appendChild(minusBtn);
      controls.appendChild(currentSpan);
      controls.appendChild(plusBtn);

      row.appendChild(visual);
      row.appendChild(info);
      row.appendChild(controls);
      container.appendChild(row);
    });
  }

  /* =======================================================================
     20. RENDER MIXING TABLE (visual tumpukan keping transparan)
     -----------------------------------------------------------------------
     Setiap keping digambar sebagai lingkaran transparan yang saling
     tumpang-tindih (mensimulasikan efek "overlay" warna secara visual),
     dengan animasi jatuh (chipDrop, lihat style.css) tiap kali dirender
     ulang — memberi kesan keping baru "ditumpuk" ke meja.
  ======================================================================= */
  function renderMixTable(container, counts) {
    container.innerHTML = '';
    const order = [];
    for (let i = 0; i < counts.R; i++) order.push('r');
    for (let i = 0; i < counts.G; i++) order.push('g');
    for (let i = 0; i < counts.B; i++) order.push('b');

    order.forEach((colorClass, idx) => {
      const token = document.createElement('div');
      token.className = `chip-token tok-${colorClass}`;
      // Posisi pseudo-acak namun deterministik (seeded) supaya tiap
      // render ulang menghasilkan susunan yang sama & tidak "melompat".
      const seedX = Math.abs(Math.sin(idx * 12.9898) * 43758.5453) % 1;
      const seedY = Math.abs(Math.sin(idx * 78.233) * 12543.727) % 1;
      const left = 8 + seedX * 60;
      const top = 8 + seedY * 55;
      token.style.left = `${left}%`;
      token.style.top = `${top}%`;
      token.style.zIndex = String(idx);
      token.style.animationDelay = `${Math.min(idx * 25, 300)}ms`;
      container.appendChild(token);
    });
  }

  /* =======================================================================
     21. INISIALISASI
  ======================================================================= */
  function init() {
    initTheme();
    renderLeaderboard();
    updateStartScreenLabels();
    showScreen('screen-start');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
