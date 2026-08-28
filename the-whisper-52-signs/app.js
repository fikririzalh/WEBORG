(function () {
  "use strict";

  const DATA = window.WHISPER_DATA;
  const app = document.getElementById("app");
  const referenceDialog = document.getElementById("referenceDialog");
  const rulesDialog = document.getElementById("rulesDialog");
  const referenceContent = document.getElementById("referenceContent");
  const offlineBadge = document.getElementById("offlineBadge");

  const state = {
    phase: "home",
    mode: "lite",
    difficulty: "medium",
    psychics: 3,
    round: 0,
    target: null,
    candidates: [],
    hand: [],
    selectedCards: [],
    guessId: null,
    history: [],
    shivers: 2,

    liteWins: 0,
    liteMisses: 0,
    liteTargetWins: 4,
    liteMaxMisses: 3,
    roundLog: [],

    memories: 0,
    dread: 0,
    memoryTarget: 5,
    dreadTarget: 3,
    traitorIndex: null,
    roleRevealIndex: 0,
    attuneIndex: 0,
    mediumIndex: 0,
    speakerStartIndex: 0,
    corruptions: 3,
    exorcisms: 2,
    exposed: false,
    distortion: null,
    distortionIndex: null,
    echoCard: null,
    exorcismVotes: [],
    exorcismVoterIndex: 0,
    chaosLog: []
  };

  const distortions = {
    veil: {
      name: "Veil",
      icon: "◒",
      text: "Satu suit disembunyikan dari clue."
    },
    silence: {
      name: "Silence",
      icon: "⌁",
      text: "Satu rank disembunyikan dari clue."
    },
    reverse: {
      name: "Reverse",
      icon: "⇄",
      text: "Urutan clue dibalik tanpa pemberitahuan."
    },
    echo: {
      name: "Echo",
      icon: "✦",
      text: "Satu kartu palsu masuk ke dalam clue."
    }
  };

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function shuffle(items) {
    const a = [...items];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function playerName(index) {
    return `Peramal ${index + 1}`;
  }

  function createDeck() {
    const cards = [];
    const rankOrder = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
    Object.keys(DATA.suits).forEach((suit) => {
      rankOrder.forEach((rank) => {
        cards.push({
          id: `${rank}-${suit}`,
          rank,
          suit,
          ...DATA.suits[suit],
          rankMeaning: DATA.ranks[rank]
        });
      });
    });
    return cards;
  }

  function drawThree() {
    return shuffle(createDeck()).slice(0, 3);
  }

  function candidateCount() {
    // Chaos is intentionally fixed at four public candidates so the clue
    // and the actual decision space are visible together during discussion.
    if (state.mode === "chaos") return 4;
    return state.difficulty === "easy" ? 4 : state.difficulty === "hard" ? 6 : 5;
  }

  function selectedCardObjects() {
    return state.selectedCards
      .map((id) => state.hand.find((card) => card.id === id))
      .filter(Boolean);
  }

  function pickRound() {
    const byCategory = DATA.mysteries.reduce((acc, item) => {
      (acc[item.category] ||= []).push(item);
      return acc;
    }, {});
    const categories = Object.keys(byCategory);
    const category = randomItem(categories);
    let pool = byCategory[category].filter((item) => !state.history.includes(item.id));
    if (pool.length < candidateCount()) pool = byCategory[category];

    const target = randomItem(pool);
    const distractors = shuffle(byCategory[category].filter((item) => item.id !== target.id))
      .slice(0, candidateCount() - 1);

    state.target = target;
    state.candidates = shuffle([target, ...distractors]);
    state.hand = drawThree();
    state.selectedCards = [];
    state.guessId = null;
    state.distortion = null;
    state.distortionIndex = null;
    state.echoCard = null;
    state.attuneIndex = 0;
    state.exorcismVotes = [];
    state.exorcismVoterIndex = 0;
    state.round += 1;
    state.history.push(target.id);
    if (state.history.length > 12) state.history.shift();
  }

  function saveSettings() {
    try {
      localStorage.setItem("whisper52-settings-v02", JSON.stringify({
        mode: state.mode,
        difficulty: state.difficulty,
        psychics: state.psychics
      }));
    } catch (_) {}
  }

  function loadSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem("whisper52-settings-v02"));
      if (!saved) return;
      if (["lite","chaos"].includes(saved.mode)) state.mode = saved.mode;
      if (["easy","medium","hard"].includes(saved.difficulty)) state.difficulty = saved.difficulty;
      if ([1,2,3,4,5,6].includes(Number(saved.psychics))) state.psychics = Number(saved.psychics);
    } catch (_) {}
  }

  function resetCommon() {
    state.round = 0;
    state.target = null;
    state.candidates = [];
    state.hand = [];
    state.selectedCards = [];
    state.guessId = null;
    state.history = [];
    state.shivers = 2;
    state.roundLog = [];
  }

  function resetLite() {
    resetCommon();
    state.liteWins = 0;
    state.liteMisses = 0;
  }

  function resetChaos() {
    resetCommon();
    state.memories = 0;
    state.dread = 0;
    state.traitorIndex = Math.floor(Math.random() * state.psychics);
    state.roleRevealIndex = 0;
    state.mediumIndex = Math.floor(Math.random() * state.psychics);
    state.speakerStartIndex = (state.mediumIndex + 1) % state.psychics;
    state.corruptions = 3;
    state.exorcisms = 2;
    state.exposed = false;
    state.distortion = null;
    state.distortionIndex = null;
    state.echoCard = null;
    state.exorcismVotes = [];
    state.exorcismVoterIndex = 0;
    state.chaosLog = [];
  }

  function cardHtml(card, options = {}) {
    const selectedIndex = state.selectedCards.findIndex((id) => id === card.id);
    const selected = selectedIndex !== -1;
    const tag = options.button ? "button" : "div";
    const buttonAttrs = options.button ? `type="button" data-card-id="${escapeHtml(card.id)}"` : "";
    const hiddenRank = Boolean(options.hiddenRank);
    const hiddenSuit = Boolean(options.hiddenSuit);
    const showHints = options.showHints !== false;
    const rank = hiddenRank ? "?" : card.rank;
    const symbol = hiddenSuit ? "?" : card.symbol;
    const redClass = !hiddenSuit && card.color === "red" ? "red" : "";
    const hint = showHints
      ? `<div class="card-hint"><strong>${escapeHtml(card.label)}</strong>: ${escapeHtml(card.meaning)}<br><strong>${escapeHtml(card.rank)}</strong>: ${escapeHtml(card.rankMeaning)}</div>`
      : "";
    const noise = options.noise ? `<span class="noise-mark" title="Salah satu kartu mungkin hanya gema">?</span>` : "";
    return `<${tag} ${buttonAttrs} class="playing-card ${redClass} ${selected ? "selected" : ""} ${options.noise ? "noise-card" : ""}">
      ${selected && options.button ? `<span class="selection-order">${selectedIndex + 1}</span>` : ""}
      ${noise}
      <div class="card-corner">${escapeHtml(rank)}<span>${escapeHtml(symbol)}</span></div>
      <div class="card-center">${escapeHtml(symbol)}</div>
      ${hint}
    </${tag}>`;
  }

  function contextualClueHtml(clue, options = {}) {
    const compact = Boolean(options.compact);
    return `<div class="context-clue-grid ${compact ? "compact-context-clue" : ""}">${clue.map((item) => {
      const suitGloss = item.hiddenSuit
        ? `<div class="semantic-row hidden-semantic"><strong>? Suit</strong><span>Arti suit disembunyikan oleh gangguan.</span></div>`
        : `<div class="semantic-row"><strong>${escapeHtml(item.card.symbol)} ${escapeHtml(item.card.label)}</strong><span>→ ${escapeHtml(item.card.meaning)}</span></div>`;
      const rankGloss = item.hiddenRank
        ? `<div class="semantic-row hidden-semantic"><strong>? Rank</strong><span>Arti rank disembunyikan oleh gangguan.</span></div>`
        : `<div class="semantic-row"><strong>${escapeHtml(item.card.rank)}</strong><span>→ ${escapeHtml(item.card.rankMeaning)}</span></div>`;
      return `<div class="context-clue-item">
        <div class="context-card">${cardHtml(item.card, { showHints: false, hiddenRank: item.hiddenRank, hiddenSuit: item.hiddenSuit, noise: item.noise })}</div>
        <div class="context-meaning">${suitGloss}${rankGloss}</div>
      </div>`;
    }).join("")}</div>`;
  }

  function liteStatsHtml() {
    return `<div class="round-stat">
      <span class="pill">Ronde <strong>${state.round}</strong></span>
      <span class="pill">Benar <strong>${state.liteWins}/${state.liteTargetWins}</strong></span>
      <span class="pill">Salah <strong>${state.liteMisses}/${state.liteMaxMisses}</strong></span>
      <span class="pill">Shiver <strong>${state.shivers}</strong></span>
    </div>`;
  }

  function chaosStatsHtml() {
    return `<div class="round-stat">
      <span class="pill memory-pill">Memory <strong>${state.memories}/${state.memoryTarget}</strong></span>
      <span class="pill dread-pill">Dread <strong>${state.dread}/${state.dreadTarget}</strong></span>
      <span class="pill">Ronde <strong>${state.round}</strong></span>
      ${state.exposed ? `<span class="pill exposed-pill">Poltergeist aktif</span>` : ""}
    </div>`;
  }

  function liteProgressHtml() {
    const nodes = state.roundLog.map((r) => `<span class="progress-node ${r.correct ? "good" : "bad"}"></span>`).join("");
    return `<div class="progress-track" aria-label="Riwayat ronde">${nodes}</div>`;
  }

  function chaosTrackHtml() {
    const memories = Array.from({ length: state.memoryTarget }, (_, i) => `<span class="track-orb ${i < state.memories ? "memory-on" : ""}">✦</span>`).join("");
    const dread = Array.from({ length: state.dreadTarget }, (_, i) => `<span class="track-orb ${i < state.dread ? "dread-on" : ""}">◉</span>`).join("");
    return `<div class="dual-track">
      <div><small>MEMORY</small><div class="track-row">${memories}</div></div>
      <div><small>DREAD</small><div class="track-row">${dread}</div></div>
    </div>`;
  }

  function renderHome() {
    state.phase = "home";
    app.innerHTML = `<section class="screen">
      <div class="hero">
        <div class="hero-symbol">♠</div>
        <p class="eyebrow">A SINGLE-DEVICE SÉANCE GAME</p>
        <h1>The Whisper:<br>52 Signs</h1>
        <p class="lede">Satu Hantu. Tiga kartu remi. Satu ingatan yang harus ditemukan. Dalam Chaos Mode, salah satu Peramal sudah mengetahui kebenaran dan ingin kalian salah membacanya.</p>
      </div>

      <div class="mode-grid">
        <button class="mode-card ${state.mode === "lite" ? "selected" : ""}" data-mode="lite" type="button">
          <span class="mode-icon">◌</span>
          <strong>Lite Mode</strong>
          <small>Asosiasi murni · 2–7 pemain total</small>
          <p>Ghost memberi clue. Para Peramal menebak. Cepat dan mudah dipelajari.</p>
        </button>
        <button class="mode-card chaos ${state.mode === "chaos" ? "selected" : ""}" data-mode="chaos" type="button">
          <span class="mode-icon">◉</span>
          <strong>Chaos Mode</strong>
          <small>Hidden role · 4–7 pemain total</small>
          <p>Satu Corrupted Seer tahu target, dapat merusak clue, dan harus berbohong tanpa tertangkap.</p>
        </button>
      </div>

      <div class="panel">
        <div class="setup-grid">
          <div class="field">
            <label for="psychicsSelect">Jumlah Peramal</label>
            <select id="psychicsSelect" class="select">
              ${[1,2,3,4,5,6].map(n => `<option value="${n}" ${state.psychics === n ? "selected" : ""}>${n} Peramal + 1 Hantu</option>`).join("")}
            </select>
            <small class="field-help" id="playerHelp"></small>
          </div>
          <div class="field">
            <label for="difficultySelect">${state.mode === "chaos" ? "Kandidat Chaos" : "Kesulitan kandidat"}</label>
            <select id="difficultySelect" class="select" ${state.mode === "chaos" ? "disabled" : ""}>
              ${state.mode === "chaos"
                ? `<option selected>Chaos · 4 kandidat publik</option>`
                : `<option value="easy" ${state.difficulty === "easy" ? "selected" : ""}>Easy · 4 kandidat</option>
                   <option value="medium" ${state.difficulty === "medium" ? "selected" : ""}>Medium · 5 kandidat</option>
                   <option value="hard" ${state.difficulty === "hard" ? "selected" : ""}>Hard · 6 kandidat</option>`}
            </select>
          </div>
        </div>
        <div class="btn-row">
          <button id="startBtn" class="btn btn-primary btn-large" type="button">Mulai ${state.mode === "chaos" ? "Chaos Séance" : "Séance"}</button>
          <button id="homeReferenceBtn" class="btn btn-ghost" type="button">Pelajari 52 Tanda</button>
        </div>
        <p class="mini-note" id="modeNote"></p>
      </div>
    </section>`;

    const playerHelp = document.getElementById("playerHelp");
    const modeNote = document.getElementById("modeNote");
    const startBtn = document.getElementById("startBtn");

    function refreshHomeText() {
      if (state.mode === "chaos") {
        playerHelp.textContent = state.psychics < 3 ? "Chaos Mode membutuhkan minimal 3 Peramal." : `${state.psychics - 1} Loyal + 1 Corrupted Seer.`;
        modeNote.textContent = "Chaos: selalu 4 kandidat. Keempat opsi tampil bersama clue selama Reading dan diskusi. 5 Memory menang; 3 Dread kalah.";
        startBtn.disabled = state.psychics < 3;
      } else {
        playerHelp.textContent = `${state.psychics + 1} pemain total.`;
        modeNote.textContent = "Lite: kumpulkan 4 jawaban benar sebelum membuat 3 kesalahan. Semua target dan kandidat dalam satu ronde berasal dari kategori yang sama.";
        startBtn.disabled = false;
      }
    }

    document.querySelectorAll("[data-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        state.mode = button.dataset.mode;
        saveSettings();
        renderHome();
      });
    });
    document.getElementById("psychicsSelect").addEventListener("change", (e) => {
      state.psychics = Number(e.target.value);
      saveSettings();
      refreshHomeText();
    });
    document.getElementById("difficultySelect").addEventListener("change", (e) => {
      state.difficulty = e.target.value;
      saveSettings();
    });
    startBtn.addEventListener("click", () => {
      if (state.mode === "chaos") startChaos();
      else startLite();
    });
    document.getElementById("homeReferenceBtn").addEventListener("click", () => referenceDialog.showModal());
    refreshHomeText();
  }

  // ---------------- LITE MODE ----------------

  function startLite() {
    state.mode = "lite";
    resetLite();
    pickRound();
    renderGhostLite();
  }

  function renderGhostLite() {
    state.phase = "lite-ghost";
    app.innerHTML = `<section class="screen">
      <div class="game-head">
        <div><p class="eyebrow">KHUSUS HANTU · LITE</p><h2>Baca ingatan ini diam-diam.</h2></div>
        ${liteStatsHtml()}
      </div>
      ${secretTargetHtml()}
      ${ghostHandHtml()}
      <div class="btn-row">
        <button id="confirmClueBtn" class="btn btn-primary" type="button" ${state.selectedCards.length === 0 ? "disabled" : ""}>Sembunyikan & Kirim Clue</button>
        <button id="rerollBtn" class="btn" type="button" ${state.shivers <= 0 ? "disabled" : ""}>Shiver · Tarik 3 Baru (${state.shivers})</button>
        <button id="openRefGhost" class="btn btn-ghost" type="button">Kamus Tanda</button>
      </div>
      ${liteProgressHtml()}
    </section>`;
    wireGhostHand(renderGhostLite);
    document.getElementById("confirmClueBtn").addEventListener("click", renderLitePass);
    document.getElementById("rerollBtn").addEventListener("click", () => rerollHand(renderGhostLite));
    document.getElementById("openRefGhost").addEventListener("click", () => referenceDialog.showModal());
  }

  function renderLitePass() {
    if (state.selectedCards.length === 0) return;
    renderPassScreen("RAHASIA TELAH DISEMBUNYIKAN", "Berikan perangkat kepada Peramal.", "Target rahasia sudah tidak terlihat.", "Saya Peramal · Tampilkan Clue", renderLitePsychic);
  }

  function renderLitePsychic() {
    state.phase = "lite-psychic";
    const clueCards = selectedCardObjects();
    app.innerHTML = `<section class="screen">
      <div class="game-head"><div><p class="eyebrow">UNTUK PARA PERAMAL · LITE</p><h2>Apa yang coba dikatakan Hantu?</h2></div>${liteStatsHtml()}</div>
      ${publicClueHtml(clueCards)}
      ${candidateGridHtml()}
      <div class="btn-row">
        <button id="confirmGuessBtn" class="btn btn-primary" type="button" ${!state.guessId ? "disabled" : ""}>Kunci Jawaban</button>
        <button id="psychicRefBtn" class="btn btn-ghost" type="button">Kamus Tanda</button>
      </div>
    </section>`;
    wireCandidates(renderLitePsychic);
    document.getElementById("confirmGuessBtn").addEventListener("click", resolveLiteGuess);
    document.getElementById("psychicRefBtn").addEventListener("click", () => referenceDialog.showModal());
  }

  function resolveLiteGuess() {
    if (!state.guessId) return;
    const correct = state.guessId === state.target.id;
    if (correct) state.liteWins += 1;
    else state.liteMisses += 1;
    state.roundLog.push({ correct, target: state.target.name, guessId: state.guessId });
    const isWin = state.liteWins >= state.liteTargetWins;
    const isLoss = state.liteMisses >= state.liteMaxMisses;
    const guessed = state.candidates.find((c) => c.id === state.guessId);
    app.innerHTML = `<section class="screen feedback">
      <div class="result-mark ${correct ? "good" : "bad"}">${correct ? "✓" : "×"}</div>
      <p class="eyebrow">${correct ? "RESONANSI DITEMUKAN" : "SINYAL TERPUTUS"}</p>
      <h2>${correct ? "Peramal membaca tanda dengan benar." : "Ingatan itu lolos dari jangkauan."}</h2>
      <p class="feedback-answer">Target: <strong>${escapeHtml(state.target.name)}</strong></p>
      ${!correct && guessed ? `<p class="lede">Pilihan Peramal: ${escapeHtml(guessed.name)}</p>` : ""}
      ${liteStatsHtml()}${liteProgressHtml()}
      <div class="btn-row center-row"><button id="nextLiteBtn" class="btn btn-primary btn-large" type="button">${isWin || isLoss ? "Lihat Hasil Séance" : "Ronde Berikutnya"}</button></div>
    </section>`;
    document.getElementById("nextLiteBtn").addEventListener("click", () => {
      if (isWin || isLoss) renderLiteEnd(isWin);
      else { pickRound(); renderGhostLite(); }
    });
  }

  function renderLiteEnd(victory) {
    app.innerHTML = `<section class="screen panel end-card">
      <div class="hero-symbol">${victory ? "✦" : "◌"}</div>
      <p class="eyebrow">LITE SÉANCE SELESAI</p>
      <h1>${victory ? "Ingatan terbuka." : "Arwah kembali diam."}</h1>
      <p class="lede">${victory ? `Kalian menemukan ${state.liteWins} resonansi dengan ${state.liteMisses} kesalahan.` : `Tiga sinyal terputus sebelum empat ingatan berhasil dibaca.`}</p>
      ${liteProgressHtml()}
      <div class="btn-row center-row"><button id="playLiteAgain" class="btn btn-primary btn-large" type="button">Main Lagi</button><button id="backHomeLite" class="btn btn-ghost" type="button">Pengaturan</button></div>
    </section>`;
    document.getElementById("playLiteAgain").addEventListener("click", startLite);
    document.getElementById("backHomeLite").addEventListener("click", renderHome);
  }

  // ---------------- CHAOS MODE ----------------

  function startChaos() {
    if (state.psychics < 3) return;
    state.mode = "chaos";
    resetChaos();
    renderChaosRolePass();
  }

  function renderChaosRolePass() {
    state.phase = "chaos-role-pass";
    const i = state.roleRevealIndex;
    app.innerHTML = `<section class="screen pass-screen">
      <div class="pass-orb chaos-orb">◉</div>
      <p class="eyebrow">ROLE ATTUNEMENT ${i + 1}/${state.psychics}</p>
      <h1>Berikan perangkat<br>kepada ${playerName(i)}.</h1>
      <p class="lede">Pemain lain melihat ke arah lain. Hanya ${playerName(i)} yang boleh membuka perannya.</p>
      <div class="btn-row center-row"><button id="revealRoleBtn" class="btn btn-primary btn-large" type="button">Saya ${playerName(i)} · Buka Peran</button></div>
    </section>`;
    document.getElementById("revealRoleBtn").addEventListener("click", renderChaosRoleReveal);
  }

  function renderChaosRoleReveal() {
    const i = state.roleRevealIndex;
    const traitor = i === state.traitorIndex;
    app.innerHTML = `<section class="screen role-reveal ${traitor ? "corrupted" : "loyal"}">
      <div class="role-sigil">${traitor ? "◉" : "✦"}</div>
      <p class="eyebrow">RAHASIA ${playerName(i).toUpperCase()}</p>
      <h1>${traitor ? "CORRUPTED SEER" : "LOYAL PSYCHIC"}</h1>
      <p class="role-copy">${traitor
        ? "Anda akan mengetahui target setiap ronde. Dorong kelompok menuju jawaban yang salah tanpa membuat mereka yakin bahwa Andalah sumber gangguan."
        : "Temukan target Hantu dan perhatikan siapa yang terus mendorong interpretasi yang terasa masuk akal tetapi salah arah."}</p>
      ${traitor ? `<div class="role-power"><strong>3 Corruption</strong><span>Veil · Silence · Reverse · Echo</span></div>` : `<div class="role-power"><strong>Trust no certainty.</strong><span>Corrupted Seer berada di antara para Peramal.</span></div>`}
      <div class="btn-row center-row"><button id="hideRoleBtn" class="btn btn-primary btn-large" type="button">Saya Ingat · Sembunyikan</button></div>
    </section>`;
    document.getElementById("hideRoleBtn").addEventListener("click", () => {
      state.roleRevealIndex += 1;
      if (state.roleRevealIndex >= state.psychics) {
        pickRound();
        renderGhostChaos();
      } else {
        renderChaosRolePass();
      }
    });
  }

  function renderGhostChaos() {
    state.phase = "chaos-ghost";
    app.innerHTML = `<section class="screen">
      <div class="game-head">
        <div><p class="eyebrow">KHUSUS HANTU · CHAOS</p><h2>Kirim pesan sebelum ia dirusak.</h2></div>
        ${chaosStatsHtml()}
      </div>
      ${chaosTrackHtml()}
      ${secretTargetHtml()}
      ${ghostHandHtml()}
      <div class="btn-row">
        <button id="confirmChaosClueBtn" class="btn btn-primary" type="button" ${state.selectedCards.length === 0 ? "disabled" : ""}>Kunci Clue & Sembunyikan Target</button>
        <button id="rerollChaosBtn" class="btn" type="button" ${state.shivers <= 0 ? "disabled" : ""}>Shiver · Tarik 3 Baru (${state.shivers})</button>
        <button id="openRefChaosGhost" class="btn btn-ghost" type="button">Kamus Tanda</button>
      </div>
      <p class="mini-note">Hantu tidak mengetahui siapa Corrupted Seer. Setelah clue dikunci, Hantu tidak boleh membantu diskusi.</p>
    </section>`;
    wireGhostHand(renderGhostChaos);
    document.getElementById("confirmChaosClueBtn").addEventListener("click", () => {
      if (state.selectedCards.length === 0) return;
      if (state.exposed) renderPoltergeistPass();
      else { state.attuneIndex = 0; renderAttunementPass(); }
    });
    document.getElementById("rerollChaosBtn").addEventListener("click", () => rerollHand(renderGhostChaos));
    document.getElementById("openRefChaosGhost").addEventListener("click", () => referenceDialog.showModal());
  }

  function renderAttunementPass() {
    state.phase = "chaos-attune-pass";
    const i = state.attuneIndex;
    app.innerHTML = `<section class="screen pass-screen">
      <div class="pass-orb">◌</div>
      <p class="eyebrow">PRIVATE ATTUNEMENT ${i + 1}/${state.psychics}</p>
      <h1>Berikan perangkat<br>kepada ${playerName(i)}.</h1>
      <p class="lede">Semua Peramal mendapat giliran privat. Jangan bereaksi terhadap apa pun yang Anda lihat.</p>
      <div class="btn-row center-row"><button id="attuneRevealBtn" class="btn btn-primary btn-large" type="button">Saya ${playerName(i)} · Attune</button></div>
    </section>`;
    document.getElementById("attuneRevealBtn").addEventListener("click", renderAttunementPrivate);
  }

  function renderAttunementPrivate() {
    const i = state.attuneIndex;
    const traitor = i === state.traitorIndex;
    if (!traitor) {
      app.innerHTML = `<section class="screen role-reveal loyal">
        <div class="role-sigil">✦</div>
        <p class="eyebrow">PRIVATE ATTUNEMENT</p>
        <h2>Tidak ada bisikan terlarang.</h2>
        <p class="lede">Anda tetap Loyal. Jangan beri reaksi yang dapat membantu Corrupted Seer membaca meja.</p>
        <div class="btn-row center-row"><button id="attuneDoneBtn" class="btn btn-primary btn-large" type="button">Sembunyikan & Lanjutkan</button></div>
      </section>`;
      document.getElementById("attuneDoneBtn").addEventListener("click", finishAttunementTurn);
      return;
    }

    const canCorrupt = state.corruptions > 0;
    app.innerHTML = `<section class="screen role-reveal corrupted">
      <div class="role-sigil">◉</div>
      <p class="eyebrow">CORRUPTED SEER · PRIVATE</p>
      <h2>Kebenaran terlarang:</h2>
      <div class="secret-card corrupted-secret"><div class="secret-label">TARGET HANTU</div><div class="secret-target">${escapeHtml(state.target.name)}</div></div>
      <p class="lede">Anda memiliki <strong>${state.corruptions} Corruption</strong> tersisa. Anda boleh mengganggu pesan atau tidak melakukan apa pun.</p>
      <div class="distortion-grid">
        ${Object.entries(distortions).map(([key, d]) => `<button type="button" class="distortion-card" data-distortion="${key}" ${!canCorrupt ? "disabled" : ""}><span>${d.icon}</span><strong>${d.name}</strong><small>${d.text}</small></button>`).join("")}
      </div>
      <div class="btn-row"><button id="noCorruptionBtn" class="btn btn-primary" type="button">Jangan Ganggu Ronde Ini</button></div>
      <p class="mini-note">Kelompok tidak diberi tahu apakah Anda menggunakan Corruption. Beberapa gangguan terlihat, beberapa hanya mengubah makna.</p>
    </section>`;

    document.querySelectorAll("[data-distortion]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!canCorrupt) return;
        applyDistortionChoice(button.dataset.distortion);
        state.corruptions -= 1;
        finishAttunementTurn();
      });
    });
    document.getElementById("noCorruptionBtn").addEventListener("click", finishAttunementTurn);
  }

  function finishAttunementTurn() {
    state.attuneIndex += 1;
    if (state.attuneIndex >= state.psychics) renderChaosPublicPass();
    else renderAttunementPass();
  }

  function renderPoltergeistPass() {
    app.innerHTML = `<section class="screen pass-screen">
      <div class="pass-orb chaos-orb">◉</div>
      <p class="eyebrow">POLTERGEIST PHASE</p>
      <h1>Serahkan perangkat<br>kepada Poltergeist.</h1>
      <p class="lede">Identitasnya sudah diketahui. Ia mendapatkan satu Distortion gratis setiap ronde.</p>
      <div class="btn-row center-row"><button id="poltergeistReadyBtn" class="btn btn-primary btn-large" type="button">Poltergeist Siap</button></div>
    </section>`;
    document.getElementById("poltergeistReadyBtn").addEventListener("click", renderPoltergeistChoice);
  }

  function renderPoltergeistChoice() {
    app.innerHTML = `<section class="screen role-reveal corrupted">
      <div class="role-sigil">◉</div>
      <p class="eyebrow">POLTERGEIST</p>
      <h2>Pilih satu Distortion.</h2>
      <p class="lede">Pemain lain melihat ke arah lain. Anda tetap mengetahui target, tetapi tidak lagi boleh memengaruhi diskusi sebagai Medium atau pembicara.</p>
      <div class="secret-card corrupted-secret"><div class="secret-label">TARGET HANTU</div><div class="secret-target">${escapeHtml(state.target.name)}</div></div>
      <div class="distortion-grid">
        ${Object.entries(distortions).map(([key, d]) => `<button type="button" class="distortion-card" data-distortion="${key}"><span>${d.icon}</span><strong>${d.name}</strong><small>${d.text}</small></button>`).join("")}
      </div>
    </section>`;
    document.querySelectorAll("[data-distortion]").forEach((button) => {
      button.addEventListener("click", () => {
        applyDistortionChoice(button.dataset.distortion);
        renderChaosPublicPass();
      });
    });
  }

  function applyDistortionChoice(key) {
    state.distortion = key;
    const clue = selectedCardObjects();
    if (["veil", "silence"].includes(key)) {
      state.distortionIndex = Math.floor(Math.random() * clue.length);
    }
    if (key === "echo") {
      const used = new Set(clue.map((c) => c.id));
      state.echoCard = randomItem(createDeck().filter((c) => !used.has(c.id)));
    }
  }

  function renderChaosPublicPass() {
    renderPassScreen("THE SPIRIT HAS SPOKEN", "Kumpulkan semua Peramal.", "Target sudah tersembunyi. Clue yang kalian lihat mungkin utuh, mungkin sudah tercemar.", "Tampilkan Clue Publik", renderChaosReading);
  }

  function transformedClue() {
    let clue = selectedCardObjects().map((card, index) => ({ card, originalIndex: index, hiddenRank: false, hiddenSuit: false, noise: false }));
    if (state.distortion === "reverse") clue = [...clue].reverse();
    if (state.distortion === "veil" && clue[state.distortionIndex]) clue[state.distortionIndex].hiddenSuit = true;
    if (state.distortion === "silence" && clue[state.distortionIndex]) clue[state.distortionIndex].hiddenRank = true;
    if (state.distortion === "echo" && state.echoCard) {
      clue.push({ card: state.echoCard, originalIndex: -1, hiddenRank: false, hiddenSuit: false, noise: false });
      clue = shuffle(clue);
    }
    return clue;
  }

  function getActivePsychicIndexes() {
    const indexes = Array.from({ length: state.psychics }, (_, i) => i);
    return state.exposed ? indexes.filter((i) => i !== state.traitorIndex) : indexes;
  }

  function normalizeMedium() {
    const active = getActivePsychicIndexes();
    if (!active.includes(state.mediumIndex)) {
      const next = active.find((i) => i > state.mediumIndex);
      state.mediumIndex = next !== undefined ? next : active[0];
    }
  }

  function readingOrder() {
    const active = getActivePsychicIndexes();
    if (!active.length) return [];
    const startPos = active.findIndex((i) => i >= state.speakerStartIndex);
    const p = startPos === -1 ? 0 : startPos;
    return [...active.slice(p), ...active.slice(0, p)];
  }

  function renderChaosReading() {
    state.phase = "chaos-reading";
    normalizeMedium();
    const clue = transformedClue();
    const order = readingOrder();
    app.innerHTML = `<section class="screen">
      <div class="game-head"><div><p class="eyebrow">PUBLIC READING · CHAOS</p><h2>Apa yang sebenarnya dikatakan Hantu?</h2></div>${chaosStatsHtml()}</div>
      ${chaosTrackHtml()}
      <div class="section-label"><h3>Clue publik</h3><span>Gangguan tidak pernah diumumkan.</span></div>
      ${contextualClueHtml(clue)}
      ${candidatePreviewGridHtml()}
      <div class="reading-panel">
        <div><small>READING ORDER</small><strong>${order.map(playerName).join(" → ")}</strong><span>Setiap pemain memberi tepat satu interpretasi singkat sebelum diskusi bebas.</span></div>
        <div class="medium-box"><small>MEDIUM RONDE INI</small><strong>${playerName(state.mediumIndex)}</strong><span>Hanya Medium yang mengunci jawaban final.</span></div>
      </div>
      ${state.exposed ? `<div class="public-warning"><strong>Poltergeist: ${playerName(state.traitorIndex)}</strong> sudah terbongkar dan tidak ikut Reading Order.</div>` : ""}
      <p class="mini-note discussion-note">Empat opsi di atas adalah satu-satunya jawaban yang mungkin. Gunakan clue untuk membandingkan semuanya sebelum Medium membuat final call.</p>
      <div class="btn-row"><button id="discussionBtn" class="btn btn-primary btn-large" type="button">Diskusi Selesai · Berikan ke Medium</button><button id="chaosRefBtn" class="btn btn-ghost" type="button">Kamus Tanda</button></div>
    </section>`;
    document.getElementById("discussionBtn").addEventListener("click", renderMediumPass);
    document.getElementById("chaosRefBtn").addEventListener("click", () => referenceDialog.showModal());
  }

  function renderMediumPass() {
    renderPassScreen("FINAL CALL", `Berikan perangkat kepada ${playerName(state.mediumIndex)}.`, "Diskusi boleh berlanjut, tetapi hanya Medium yang boleh mengunci jawaban.", `Saya ${playerName(state.mediumIndex)} · Pilih Jawaban`, renderChaosGuess);
  }

  function renderChaosGuess() {
    const clue = transformedClue();
    app.innerHTML = `<section class="screen">
      <div class="game-head"><div><p class="eyebrow">MEDIUM · FINAL CALL</p><h2>${playerName(state.mediumIndex)}, pilih satu ingatan.</h2></div>${chaosStatsHtml()}</div>
      ${contextualClueHtml(clue, { compact: true })}
      ${candidateGridHtml()}
      <div class="btn-row"><button id="lockChaosGuessBtn" class="btn btn-primary btn-large" type="button" ${!state.guessId ? "disabled" : ""}>Kunci Jawaban Medium</button></div>
      <p class="mini-note">Setelah dikunci, target asli akan terlihat. Tidak ada perubahan suara.</p>
    </section>`;
    wireCandidates(renderChaosGuess);
    document.getElementById("lockChaosGuessBtn").addEventListener("click", resolveChaosGuess);
  }

  function resolveChaosGuess() {
    if (!state.guessId) return;
    const correct = state.guessId === state.target.id;
    if (correct) state.memories += 1;
    else state.dread += 1;
    const guessed = state.candidates.find((c) => c.id === state.guessId);
    state.chaosLog.push({ round: state.round, correct, target: state.target.name, guess: guessed ? guessed.name : "?", distortion: state.distortion, mediumIndex: state.mediumIndex });
    renderChaosFeedback(correct, guessed);
  }

  function renderChaosFeedback(correct, guessed) {
    const ended = state.memories >= state.memoryTarget || state.dread >= state.dreadTarget;
    app.innerHTML = `<section class="screen feedback">
      <div class="result-mark ${correct ? "good" : "bad"}">${correct ? "✦" : "◉"}</div>
      <p class="eyebrow">${correct ? "MEMORY RECOVERED" : "DREAD DEEPENS"}</p>
      <h2>${correct ? "Pesan Hantu berhasil dibaca." : "Kebenaran dibelokkan."}</h2>
      <p class="feedback-answer">Target: <strong>${escapeHtml(state.target.name)}</strong></p>
      ${!correct && guessed ? `<p class="lede">Medium memilih: ${escapeHtml(guessed.name)}</p>` : ""}
      ${chaosTrackHtml()}
      <div class="round-stat center-stats"><span class="pill">Medium <strong>${playerName(state.mediumIndex)}</strong></span>${state.exposed ? `<span class="pill exposed-pill">Poltergeist ${playerName(state.traitorIndex)}</span>` : ""}</div>
      <div class="btn-row center-row">
        <button id="continueChaosBtn" class="btn btn-primary btn-large" type="button">${ended ? "Lihat Hasil Séance" : "Ronde Berikutnya"}</button>
        ${!ended && !state.exposed && state.exorcisms > 0 ? `<button id="exorcismBtn" class="btn btn-danger btn-large" type="button">Call Exorcism (${state.exorcisms})</button>` : ""}
      </div>
      ${!state.exposed && state.exorcisms > 0 && !ended ? `<p class="mini-note">Exorcism memulai voting rahasia. Salah menuduh Loyal menambah 1 Dread.</p>` : ""}
    </section>`;
    document.getElementById("continueChaosBtn").addEventListener("click", () => {
      if (ended) renderChaosEnd();
      else advanceChaosRound();
    });
    const ex = document.getElementById("exorcismBtn");
    if (ex) ex.addEventListener("click", startExorcism);
  }

  function startExorcism() {
    if (state.exorcisms <= 0 || state.exposed) return;
    state.exorcisms -= 1;
    state.exorcismVotes = [];
    state.exorcismVoterIndex = 0;
    renderExorcismPass();
  }

  function renderExorcismPass() {
    const i = state.exorcismVoterIndex;
    app.innerHTML = `<section class="screen pass-screen">
      <div class="pass-orb exorcism-orb">✧</div>
      <p class="eyebrow">SECRET EXORCISM VOTE ${i + 1}/${state.psychics}</p>
      <h1>Berikan perangkat<br>kepada ${playerName(i)}.</h1>
      <p class="lede">Pilih satu tersangka secara privat. Anda tidak boleh memilih diri sendiri.</p>
      <div class="btn-row center-row"><button id="voteReadyBtn" class="btn btn-primary btn-large" type="button">Saya ${playerName(i)} · Vote</button></div>
    </section>`;
    document.getElementById("voteReadyBtn").addEventListener("click", renderExorcismVote);
  }

  function renderExorcismVote() {
    const voter = state.exorcismVoterIndex;
    app.innerHTML = `<section class="screen">
      <p class="eyebrow">VOTE RAHASIA · ${playerName(voter).toUpperCase()}</p>
      <h2>Siapa yang paling mungkin Corrupted?</h2>
      <div class="suspect-grid">
        ${Array.from({ length: state.psychics }, (_, i) => `<button type="button" class="suspect-card" data-suspect="${i}" ${i === voter ? "disabled" : ""}><span>◌</span><strong>${playerName(i)}</strong>${i === voter ? "<small>Anda</small>" : "<small>Tuduh</small>"}</button>`).join("")}
      </div>
      <p class="mini-note">Pilihan langsung disembunyikan setelah ditekan.</p>
    </section>`;
    document.querySelectorAll("[data-suspect]").forEach((button) => {
      button.addEventListener("click", () => {
        state.exorcismVotes.push(Number(button.dataset.suspect));
        state.exorcismVoterIndex += 1;
        if (state.exorcismVoterIndex >= state.psychics) resolveExorcism();
        else renderExorcismPass();
      });
    });
  }

  function resolveExorcism() {
    const counts = state.exorcismVotes.reduce((acc, vote) => {
      acc[vote] = (acc[vote] || 0) + 1;
      return acc;
    }, {});
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const topVotes = sorted.length ? sorted[0][1] : 0;
    const leaders = sorted.filter(([, count]) => count === topVotes).map(([idx]) => Number(idx));
    const accused = leaders.length === 1 ? leaders[0] : null;
    let outcome;

    if (accused === null) {
      outcome = "tie";
    } else if (accused === state.traitorIndex) {
      outcome = "hit";
      state.exposed = true;
    } else {
      outcome = "miss";
      state.dread += 1;
    }

    const ended = state.dread >= state.dreadTarget;
    app.innerHTML = `<section class="screen feedback">
      <div class="result-mark ${outcome === "hit" ? "good" : outcome === "miss" ? "bad" : "neutral"}">${outcome === "hit" ? "✧" : outcome === "miss" ? "×" : "≈"}</div>
      <p class="eyebrow">EXORCISM RESULT</p>
      <h2>${outcome === "hit" ? "Corrupted Seer ditemukan." : outcome === "miss" ? "Kalian menuduh jiwa yang salah." : "Ritual pecah karena suara imbang."}</h2>
      <p class="lede">${outcome === "hit"
        ? `${playerName(accused)} terbongkar. Ia sekarang menjadi Poltergeist: tidak ikut diskusi atau menjadi Medium, tetapi mendapat satu Distortion setiap ronde.`
        : outcome === "miss"
          ? `${playerName(accused)} adalah Loyal. Dread +1.`
          : "Tidak ada pemain yang terbongkar. Token Exorcism tetap terpakai."}</p>
      ${chaosTrackHtml()}
      <div class="btn-row center-row"><button id="afterExorcismBtn" class="btn btn-primary btn-large" type="button">${ended ? "Lihat Hasil Séance" : "Lanjutkan"}</button></div>
    </section>`;
    document.getElementById("afterExorcismBtn").addEventListener("click", () => {
      if (ended) renderChaosEnd();
      else advanceChaosRound();
    });
  }

  function advanceChaosRound() {
    const active = getActivePsychicIndexes();
    if (active.length) {
      const currentPos = active.indexOf(state.mediumIndex);
      state.mediumIndex = active[(currentPos + 1 + active.length) % active.length];
      const currentSpeakerPos = active.findIndex((i) => i >= state.speakerStartIndex);
      const base = currentSpeakerPos === -1 ? 0 : currentSpeakerPos;
      state.speakerStartIndex = active[(base + 1) % active.length];
    }
    pickRound();
    renderGhostChaos();
  }

  function renderChaosEnd() {
    const loyalWin = state.memories >= state.memoryTarget;
    app.innerHTML = `<section class="screen panel end-card chaos-end">
      <div class="hero-symbol">${loyalWin ? "✦" : "◉"}</div>
      <p class="eyebrow">CHAOS SÉANCE SELESAI</p>
      <h1>${loyalWin ? "Kebenaran bertahan." : "Bisikan itu menang."}</h1>
      <p class="lede">${loyalWin ? "Loyal Psychics mencapai lima Memory sebelum Dread menelan séance." : "Dread mencapai batasnya sebelum lima Memory berhasil dipulihkan."}</p>
      ${chaosTrackHtml()}
      <div class="final-role"><small>CORRUPTED SEER</small><strong>${playerName(state.traitorIndex)}</strong><span>${state.exposed ? "Identitas terbongkar selama permainan." : "Berhasil tetap tersembunyi sampai akhir."}</span></div>
      <div class="btn-row center-row"><button id="playChaosAgain" class="btn btn-primary btn-large" type="button">Main Chaos Lagi</button><button id="backHomeChaos" class="btn btn-ghost" type="button">Pengaturan</button></div>
    </section>`;
    document.getElementById("playChaosAgain").addEventListener("click", startChaos);
    document.getElementById("backHomeChaos").addEventListener("click", renderHome);
  }

  // ---------------- SHARED UI ----------------

  function secretTargetHtml() {
    return `<div class="secret-card">
      <div class="secret-label">TARGET RAHASIA · ${escapeHtml(state.target.category.toUpperCase())}</div>
      <div class="secret-target">${escapeHtml(state.target.name)}</div>
      <div class="secret-meta">${state.candidates.length} kandidat dari kategori ${escapeHtml(state.target.category)}.</div>
    </div>`;
  }

  function ghostHandHtml() {
    return `<div class="section-label"><h3>Tiga tanda dari arwah</h3><span>Pilih 1–3. Urutan klik = urutan clue.</span></div>
      <div class="card-row">${state.hand.map(card => cardHtml(card, { button: true, showHints: true })).join("")}</div>`;
  }

  function wireGhostHand(rerender) {
    document.querySelectorAll("[data-card-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const cardId = button.dataset.cardId;
        const existing = state.selectedCards.indexOf(cardId);
        if (existing !== -1) state.selectedCards.splice(existing, 1);
        else if (state.selectedCards.length < 3) state.selectedCards.push(cardId);
        rerender();
      });
    });
  }

  function rerollHand(rerender) {
    if (state.shivers <= 0) return;
    state.shivers -= 1;
    state.hand = drawThree();
    state.selectedCards = [];
    rerender();
  }

  function renderPassScreen(eyebrow, title, copy, buttonLabel, next) {
    state.phase = "pass";
    app.innerHTML = `<section class="screen pass-screen">
      <div class="pass-orb">◉</div>
      <p class="eyebrow">${escapeHtml(eyebrow)}</p>
      <h1>${escapeHtml(title)}</h1>
      <p class="lede">${escapeHtml(copy)}</p>
      <div class="btn-row center-row"><button id="passNextBtn" class="btn btn-primary btn-large" type="button">${escapeHtml(buttonLabel)}</button></div>
    </section>`;
    document.getElementById("passNextBtn").addEventListener("click", next);
  }

  function publicClueHtml(cards) {
    return `<div class="section-label"><h3>Clue dari Hantu</h3><span>Urutan kartu disengaja.</span></div><div class="clue-strip">${cards.map(card => cardHtml(card, { showHints: false })).join("")}</div>`;
  }

  function candidatePreviewGridHtml() {
    const letters = ["A", "B", "C", "D"];
    return `<div class="section-label"><h3>4 kemungkinan jawaban</h3><span>Terbuka untuk seluruh meja.</span></div>
      <div class="candidate-grid candidate-preview-grid">${state.candidates.map((candidate, index) => `<div class="candidate candidate-preview"><span class="candidate-letter">${letters[index] || index + 1}</span><strong>${escapeHtml(candidate.name)}</strong><small>${escapeHtml(candidate.category)}</small></div>`).join("")}</div>`;
  }

  function candidateGridHtml() {
    return `<div class="section-label"><h3>Pilih satu ${escapeHtml(state.target.category)}</h3><span>${state.candidates.length} kemungkinan</span></div>
      <div class="candidate-grid">${state.candidates.map((candidate) => `<button type="button" class="candidate ${state.guessId === candidate.id ? "selected" : ""}" data-guess-id="${escapeHtml(candidate.id)}"><strong>${escapeHtml(candidate.name)}</strong><small>${escapeHtml(candidate.category)}</small></button>`).join("")}</div>`;
  }

  function wireCandidates(rerender) {
    document.querySelectorAll("[data-guess-id]").forEach((button) => {
      button.addEventListener("click", () => {
        state.guessId = button.dataset.guessId;
        rerender();
      });
    });
  }

  function buildReference() {
    const suitItems = Object.values(DATA.suits).map((suit) => `<div class="legend-item"><strong>${escapeHtml(suit.symbol)} ${escapeHtml(suit.label)}</strong><span>${escapeHtml(suit.meaning)}</span></div>`).join("");
    const rankItems = Object.entries(DATA.ranks).map(([rank, meaning]) => `<div class="rank-item"><div class="rank-key">${escapeHtml(rank)}</div><span>${escapeHtml(meaning)}</span></div>`).join("");
    referenceContent.innerHTML = `<p class="mini-note" style="margin-top:0">Suit menentukan <strong>domain</strong>. Rank memberi <strong>sifat, skala, atau pola</strong>. Tidak ada arti tunggal yang wajib.</p><div class="legend-grid">${suitItems}</div><div class="rank-grid">${rankItems}</div><div class="pattern-box"><strong>Pola antarkartu juga boleh berarti sesuatu.</strong><br>Suit berulang dapat menandakan domain dominan. Rank sama dapat berarti duplikasi. Urutan seperti 4–5–6 dapat dibaca sebagai proses. Merah dan hitam dapat dibaca sebagai konflik atau kontras.</div>`;
  }

  function updateConnectivity() {
    if (location.protocol === "file:") {
      offlineBadge.textContent = "LOCAL FILE";
      return;
    }
    offlineBadge.textContent = navigator.onLine ? "READY" : "OFFLINE";
  }

  document.getElementById("referenceBtn").addEventListener("click", () => referenceDialog.showModal());
  document.getElementById("rulesBtn").addEventListener("click", () => rulesDialog.showModal());
  document.getElementById("homeBtn").addEventListener("click", renderHome);
  window.addEventListener("online", updateConnectivity);
  window.addEventListener("offline", updateConnectivity);

  loadSettings();
  buildReference();
  updateConnectivity();
  renderHome();

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }
})();
