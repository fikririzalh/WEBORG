"use strict";

const JOBS = {
  baker: {
    name: "Baker",
    icon: "🥐",
    color: "#EE8B58",
    color2: "#F5B26A",
    skill: "Bonus Shift",
    short: "Ambil & tempatkan 1 worker ekstra.",
    target: "Tidak membutuhkan target awal.",
    rule: "Ambil 1 Worker acak dari Worker Bag lalu tempatkan pada hex legal. Worker bonus tidak mengaktifkan skill baru.",
    example: "Baker masuk ke hex A. Bonus Shift menarik Courier. Courier boleh ditempatkan, tetapi Express Move tidak ikut aktif."
  },
  recruiter: {
    name: "Recruiter",
    icon: "🧶",
    color: "#9B72CF",
    color2: "#C499EA",
    skill: "Talent Search",
    short: "Lihat hingga 3 worker, pilih 1 untuk ditempatkan.",
    target: "Pilihan berasal dari Worker Bag.",
    rule: "Ambil hingga 3 Worker. Pilih 1 dan tempatkan pada hex legal; sisanya dikocok kembali ke bag. Worker pilihan tidak mengaktifkan skill.",
    example: "Recruiter melihat Baker, Mechanic, dan Manager. Pilih Mechanic untuk ditempatkan; dua lainnya kembali ke bag."
  },
  courier: {
    name: "Courier",
    icon: "📦",
    color: "#D95F61",
    color2: "#F28A72",
    skill: "Express Move",
    short: "Pindahkan 1 worker tetangga ke hex mana pun.",
    target: "1 top Worker pada hex yang adjacent dengan Courier.",
    rule: "Ambil Worker teratas dari satu hex tetangga lalu pindahkan ke hex lain yang kapasitas stack-nya masih tersedia.",
    example: "Courier berdampingan dengan Baker. Baker dapat dipindah ke sisi lain papan untuk menyelesaikan LINE Job."
  },
  mechanic: {
    name: "Mechanic",
    icon: "🔧",
    color: "#547EA8",
    color2: "#74A1C8",
    skill: "Fine Tune",
    short: "Geser hingga 2 worker tetangga sejauh 1 hex.",
    target: "Maks. 2 top Worker berbeda yang adjacent dengan Mechanic.",
    rule: "Pindahkan Worker pertama sejauh 1 hex. Jika masih ada target legal, Anda boleh memilih Worker kedua dan menggesernya 1 hex.",
    example: "Mechanic dapat menggeser Courier satu hex, lalu Recruiter satu hex untuk membentuk segitiga."
  },
  barista: {
    name: "Barista",
    icon: "☕",
    color: "#B77B4A",
    color2: "#D9A36E",
    skill: "Table Swap",
    short: "Tukar posisi 2 worker teratas di papan.",
    target: "2 top Worker pada dua hex berbeda di mana pun di papan.",
    rule: "Pilih dua Worker teratas lalu tukar posisi keduanya. Worker di bawah stack tidak berpindah.",
    example: "Barista menukar Manager di kiri dengan Baker di kanan tanpa memindahkan token yang berada di bawah keduanya."
  },
  manager: {
    name: "Manager",
    icon: "📣",
    color: "#4D9A79",
    color2: "#76BE91",
    skill: "Team Lead",
    short: "Aktifkan skill worker tetangga.",
    target: "1 top Worker pada hex adjacent dengan Manager.",
    rule: "Salin dan jalankan skill Worker target. Jika target Dual, pilih salah satu skill. Rantai Manager dibatasi agar tidak membentuk loop tanpa akhir.",
    example: "Manager adjacent dengan Barista dapat menyalin Table Swap. Jika target adalah Dual Baker + Mechanic, pilih salah satu skill saja."
  }
};

const JOB_IDS = Object.keys(JOBS);
const DIRECTIONS = [
  [1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]
];
const START_DIRS = DIRECTIONS.map(([q, r]) => `${q},${r}`);
const MAX_STACK = 3;

const els = {};
let toastTimer = null;
let state;

function cacheDom() {
  [
    "hexBoard", "bagCount", "deckCount", "shiftNo", "turnText", "turnPill",
    "p1Score", "p1Coins", "p1Tasks", "p1Done", "p1Scored",
    "p2Score", "p2Coins", "p2Tasks", "p2Done", "p2Scored",
    "playerOnePanel", "playerTwoPanel", "phaseLabel", "phaseTitle", "phaseHint",
    "currentWorker", "currentWorkerName", "mainActionBtn", "skipAbilityBtn", "abilityDoneBtn",
    "coinBtn", "abilityChoice", "toast", "legendRow", "passOverlay", "passIcon", "passTitle",
    "passText", "readyBtn", "howBtn", "howModal", "closeHowBtn", "skillBookBtn", "skillBookModal",
    "closeSkillBookBtn", "skillBookGrid", "choiceModal", "choiceEyebrow",
    "choiceTitle", "choiceText", "workerChoices", "resetBtn", "gameOverModal", "winnerTitle",
    "winnerText", "finalP1", "finalP2", "playAgainBtn"
  ].forEach(id => { els[id] = document.getElementById(id); });
}

function createInitialState() {
  const board = {};
  getBoardCoords().forEach(c => { board[c.key] = []; });

  const starters = shuffle(JOB_IDS.map(job => makeToken([job])));
  START_DIRS.forEach((key, index) => board[key].push(starters[index]));

  const bag = [];
  JOB_IDS.forEach(job => {
    for (let i = 0; i < 4; i++) bag.push(makeToken([job]));
  });

  const dualPairs = [
    ["baker", "recruiter"],
    ["recruiter", "mechanic"],
    ["mechanic", "barista"],
    ["barista", "manager"],
    ["manager", "courier"],
    ["courier", "baker"]
  ];
  dualPairs.forEach(pair => bag.push(makeToken(pair)));

  const taskDeck = shuffle(buildTaskDeck());
  const players = [
    { name: "Mochi", score: 0, coins: 3, hand: [], scored: [] },
    { name: "Yuki", score: 0, coins: 3, hand: [], scored: [] }
  ];

  players.forEach(player => {
    player.hand.push(taskDeck.pop(), taskDeck.pop());
  });

  return {
    board,
    bag: shuffle(bag),
    taskDeck,
    players,
    active: Math.random() < 0.5 ? 0 : 1,
    phase: "privacy",
    shift: 1,
    currentToken: null,
    placedCoord: null,
    coinUsed: false,
    abilityState: null,
    abilityDepth: 0,
    hidden: true,
    gameOver: false
  };
}

function makeToken(jobs) {
  return {
    uid: `t-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}`,
    jobs: [...jobs],
    dual: jobs.length > 1
  };
}

function buildTaskDeck() {
  const templates = [
    ["line", ["baker", "baker", "courier"], 2, "Breakfast Express"],
    ["triangle", ["baker", "recruiter", "barista"], 3, "Morning Briefing"],
    ["line", ["mechanic", "manager", "mechanic"], 3, "Workshop Audit"],
    ["triangle", ["courier", "barista", "manager"], 3, "Rush Hour"],
    ["line", ["recruiter", "recruiter", "manager"], 2, "Hiring Day"],
    ["triangle", ["mechanic", "baker", "courier"], 3, "Pop-up Bakery"],
    ["line", ["barista", "barista", "baker"], 2, "Café Queue"],
    ["triangle", ["manager", "manager", "recruiter"], 3, "Team Sync"],
    ["line", ["courier", "mechanic", "courier"], 3, "Delivery Repair"],
    ["triangle", ["baker", "baker", "manager"], 3, "Catering Crew"],
    ["line", ["recruiter", "barista", "recruiter"], 3, "Interview Latte"],
    ["triangle", ["mechanic", "mechanic", "courier"], 3, "Pit Stop"],
    ["line", ["manager", "courier", "barista"], 4, "City Launch"],
    ["triangle", ["recruiter", "baker", "mechanic"], 4, "Craft Fair"],
    ["line", ["baker", "manager", "baker"], 3, "Bakery Expansion"],
    ["triangle", ["barista", "courier", "barista"], 3, "Coffee Run"],
    ["line", ["mechanic", "recruiter", "manager"], 4, "New Workshop"],
    ["triangle", ["courier", "courier", "recruiter"], 3, "Parcel Team"],
    ["line", ["manager", "barista", "manager"], 3, "Service Review"],
    ["triangle", ["baker", "mechanic", "barista"], 4, "Night Market"],
    ["line", ["recruiter", "courier", "mechanic"], 4, "Onboarding Route"],
    ["triangle", ["manager", "baker", "recruiter"], 4, "Grand Opening"],
    ["line", ["barista", "mechanic", "barista"], 3, "Machine Tune-up"],
    ["triangle", ["courier", "manager", "mechanic"], 4, "Priority Shift"]
  ];

  return templates.map((t, index) => ({
    id: `order-${index + 1}`,
    shape: t[0],
    jobs: t[1],
    points: t[2],
    title: t[3]
  }));
}

function getBoardCoords() {
  const coords = [];
  for (let q = -2; q <= 2; q++) {
    for (let r = -2; r <= 2; r++) {
      const s = -q - r;
      if (Math.max(Math.abs(q), Math.abs(r), Math.abs(s)) <= 2) {
        coords.push({ q, r, key: `${q},${r}` });
      }
    }
  }
  return coords;
}

function init() {
  cacheDom();
  bindStaticEvents();
  buildLegend();
  buildSkillBook();
  resetGame();
}

function bindStaticEvents() {
  els.readyBtn.addEventListener("click", revealTurn);
  els.howBtn.addEventListener("click", () => els.howModal.classList.add("show"));
  els.closeHowBtn.addEventListener("click", () => els.howModal.classList.remove("show"));
  els.howModal.addEventListener("click", e => {
    if (e.target === els.howModal) els.howModal.classList.remove("show");
  });
  els.skillBookBtn.addEventListener("click", () => openSkillBook());
  els.closeSkillBookBtn.addEventListener("click", () => els.skillBookModal.classList.remove("show"));
  els.skillBookModal.addEventListener("click", e => {
    if (e.target === els.skillBookModal) els.skillBookModal.classList.remove("show");
  });
  els.resetBtn.addEventListener("click", () => {
    if (confirm("Mulai ulang permainan MIAW-CRAFT?")) resetGame();
  });
  els.playAgainBtn.addEventListener("click", resetGame);
  els.mainActionBtn.addEventListener("click", handleMainAction);
  els.skipAbilityBtn.addEventListener("click", enterScorePhase);
  els.abilityDoneBtn.addEventListener("click", finishCurrentAbility);
  els.coinBtn.addEventListener("click", spendCoin);
}

function resetGame() {
  state = createInitialState();
  els.gameOverModal.classList.remove("show");
  renderAll();
  showPassScreen(true);
}

function revealTurn() {
  state.hidden = false;
  els.passOverlay.classList.remove("show");
  state.phase = "draw";
  renderAll();
}

function showPassScreen(first = false) {
  state.hidden = true;
  state.phase = "privacy";
  const player = state.players[state.active];
  els.passIcon.textContent = state.active === 0 ? "🐱" : "😼";
  els.passTitle.textContent = first ? `${player.name} mulai lebih dulu` : `Giliran ${player.name}`;
  els.passText.textContent = `Berikan perangkat kepada Player ${state.active + 1}. Job Order ${player.name} akan dibuka setelah tombol di bawah ditekan.`;
  els.passOverlay.classList.add("show");
  renderAll();
}

function handleMainAction() {
  if (state.phase === "draw") drawWorker();
  else if (state.phase === "ability") requestAbility();
  else if (state.phase === "score") endTurn();
}

function drawWorker() {
  if (!state.bag.length) {
    endGame();
    return;
  }
  state.currentToken = drawRandomFromBag();
  state.phase = "place";
  state.placedCoord = null;
  showToast(`${tokenName(state.currentToken)} masuk shift! Pilih hex.`);
  renderAll();
}

function drawRandomFromBag() {
  if (!state.bag.length) return null;
  const i = Math.floor(Math.random() * state.bag.length);
  return state.bag.splice(i, 1)[0];
}

function handleHexClick(key) {
  if (state.hidden || state.gameOver) return;

  if (state.phase === "place" || state.phase === "bonus-place") {
    placeCurrentToken(key);
    return;
  }

  if (state.phase === "ability-action" && state.abilityState) {
    handleAbilityHexClick(key);
  }
}

function placeCurrentToken(key) {
  if (!state.currentToken || state.board[key].length >= MAX_STACK) return;
  state.board[key].push(state.currentToken);
  state.placedCoord = key;
  const wasBonus = state.phase === "bonus-place";
  const placed = state.currentToken;
  state.currentToken = null;

  if (wasBonus) {
    showToast(`${tokenName(placed)} ditempatkan sebagai worker ekstra.`);
    finishCurrentAbility();
  } else {
    state.phase = "ability";
    showToast(`${tokenName(placed)} siap memakai skill.`);
    renderAll();
  }
}

function requestAbility() {
  const token = topToken(state.placedCoord);
  if (!token) return enterScorePhase();

  if (token.dual) {
    showDualAbilityChoice(token);
  } else {
    beginAbility(token.jobs[0], state.placedCoord, 0);
  }
}

function showDualAbilityChoice(token) {
  els.abilityChoice.innerHTML = `<span class="micro-label">DUAL WORKER · PILIH 1 SKILL</span>` + token.jobs.map(job => {
    const j = JOBS[job];
    return `<button class="ability-option" data-job="${job}">${j.icon} ${j.skill}</button>`;
  }).join("");
  els.abilityChoice.classList.remove("hidden");
  els.abilityChoice.querySelectorAll("[data-job]").forEach(btn => {
    btn.addEventListener("click", () => {
      els.abilityChoice.classList.add("hidden");
      beginAbility(btn.dataset.job, state.placedCoord, 0);
    });
  });
}

function beginAbility(jobId, originKey, depth = 0) {
  state.abilityDepth = depth;
  const job = JOBS[jobId];
  showToast(`${job.icon} ${job.skill}`);

  if (jobId === "baker") {
    abilityBaker();
  } else if (jobId === "recruiter") {
    abilityRecruiter();
  } else if (jobId === "courier") {
    state.phase = "ability-action";
    state.abilityState = { type: "courier", origin: originKey, step: "source", source: null };
    renderAll();
  } else if (jobId === "mechanic") {
    state.phase = "ability-action";
    state.abilityState = { type: "mechanic", origin: originKey, step: "source", source: null, moves: 0, used: [] };
    renderAll();
  } else if (jobId === "barista") {
    state.phase = "ability-action";
    state.abilityState = { type: "barista", step: "first", first: null };
    renderAll();
  } else if (jobId === "manager") {
    state.phase = "ability-action";
    state.abilityState = { type: "manager", origin: originKey, step: "target", depth };
    renderAll();
  }
}

function abilityBaker() {
  if (!state.bag.length) {
    showToast("Tas kosong. Bonus Shift tidak dapat dipakai.");
    finishCurrentAbility();
    return;
  }
  state.currentToken = drawRandomFromBag();
  state.phase = "bonus-place";
  state.abilityState = { type: "baker" };
  renderAll();
}

function abilityRecruiter() {
  if (!state.bag.length) {
    showToast("Tas kosong. Talent Search tidak dapat dipakai.");
    finishCurrentAbility();
    return;
  }
  const options = [];
  for (let i = 0; i < 3 && state.bag.length; i++) options.push(drawRandomFromBag());
  state.abilityState = { type: "recruiter", options };
  renderRecruiterChoices(options);
}

function renderRecruiterChoices(options) {
  els.choiceEyebrow.textContent = "RECRUITER SKILL";
  els.choiceTitle.textContent = "Pilih satu worker";
  els.choiceText.textContent = "Worker lain kembali ke tas. Worker pilihan langsung Anda tempatkan.";
  els.workerChoices.innerHTML = options.map((token, idx) => {
    const bg = tokenBackground(token);
    return `<button class="worker-choice-btn" data-choice="${idx}">
      <div class="choice-token" style="background:${bg}">🐱</div>
      <strong>${tokenName(token)}</strong>
    </button>`;
  }).join("");
  els.choiceModal.classList.add("show");
  els.workerChoices.querySelectorAll("[data-choice]").forEach(btn => {
    btn.addEventListener("click", () => chooseRecruiterToken(Number(btn.dataset.choice)));
  });
}

function chooseRecruiterToken(index) {
  const options = state.abilityState?.options || [];
  const chosen = options[index];
  options.forEach((token, i) => { if (i !== index) state.bag.push(token); });
  state.bag = shuffle(state.bag);
  els.choiceModal.classList.remove("show");
  state.currentToken = chosen;
  state.phase = "bonus-place";
  renderAll();
}

function handleAbilityHexClick(key) {
  const a = state.abilityState;
  if (!a) return;

  if (a.type === "courier") handleCourierClick(key, a);
  if (a.type === "mechanic") handleMechanicClick(key, a);
  if (a.type === "barista") handleBaristaClick(key, a);
  if (a.type === "manager") handleManagerClick(key, a);
}

function handleCourierClick(key, a) {
  if (a.step === "source") {
    if (!isAdjacent(a.origin, key) || !topToken(key)) return;
    a.source = key;
    a.step = "destination";
    renderAll();
    return;
  }

  if (a.step === "destination") {
    if (key === a.source || state.board[key].length >= MAX_STACK) return;
    const token = state.board[a.source].pop();
    state.board[key].push(token);
    showToast("Courier memindahkan satu worker.");
    finishCurrentAbility();
  }
}

function handleMechanicClick(key, a) {
  if (a.step === "source") {
    if (!isAdjacent(a.origin, key) || !topToken(key) || a.used.includes(key)) return;
    a.source = key;
    a.step = "destination";
    renderAll();
    return;
  }

  if (a.step === "destination") {
    if (!isAdjacent(a.source, key) || key === a.source || state.board[key].length >= MAX_STACK) return;
    const source = a.source;
    const token = state.board[source].pop();
    state.board[key].push(token);
    a.used.push(source);
    a.moves += 1;
    a.source = null;
    a.step = "source";
    if (a.moves >= 2 || !availableMechanicSources(a).length) {
      showToast(`Mechanic menyelesaikan ${a.moves} pergeseran.`);
      finishCurrentAbility();
    } else {
      showToast("Mechanic boleh menggeser satu worker lagi atau selesai.");
      renderAll();
    }
  }
}

function availableMechanicSources(a) {
  return neighborKeys(a.origin).filter(key => topToken(key) && !a.used.includes(key));
}

function handleBaristaClick(key, a) {
  if (!topToken(key)) return;
  if (a.step === "first") {
    a.first = key;
    a.step = "second";
    renderAll();
    return;
  }
  if (a.step === "second") {
    if (key === a.first || !topToken(key)) return;
    const t1 = state.board[a.first].pop();
    const t2 = state.board[key].pop();
    state.board[a.first].push(t2);
    state.board[key].push(t1);
    showToast("Barista menukar dua worker teratas.");
    finishCurrentAbility();
  }
}

function handleManagerClick(key, a) {
  if (!isAdjacent(a.origin, key)) return;
  const token = topToken(key);
  if (!token) return;

  if (a.depth >= 2 && token.jobs.includes("manager")) {
    showToast("Rantai Manager dibatasi agar shift tetap terkendali.");
    return;
  }

  if (token.dual) {
    els.abilityChoice.innerHTML = `<span class="micro-label">TEAM LEAD · PILIH SKILL YANG DICONTOH</span>` + token.jobs.map(job => {
      const j = JOBS[job];
      return `<button class="ability-option" data-copy-job="${job}">${j.icon} ${j.skill}</button>`;
    }).join("");
    els.abilityChoice.classList.remove("hidden");
    els.abilityChoice.querySelectorAll("[data-copy-job]").forEach(btn => {
      btn.addEventListener("click", () => {
        els.abilityChoice.classList.add("hidden");
        beginAbility(btn.dataset.copyJob, key, a.depth + 1);
      });
    });
  } else {
    beginAbility(token.jobs[0], key, a.depth + 1);
  }
}

function finishCurrentAbility() {
  state.abilityState = null;
  state.currentToken = null;
  els.choiceModal.classList.remove("show");
  els.abilityChoice.classList.add("hidden");
  enterScorePhase();
}

function enterScorePhase() {
  state.abilityState = null;
  state.currentToken = null;
  els.choiceModal.classList.remove("show");
  els.abilityChoice.classList.add("hidden");
  state.phase = "score";
  renderAll();
  const ready = state.players[state.active].hand.filter(task => isTaskMatch(task));
  if (ready.length) showToast(`${ready.length} Job Order siap diselesaikan!`);
  else showToast("Belum ada Job Order yang cocok. Akhiri shift saat siap.");
}

function scoreTask(taskId) {
  if (state.phase !== "score") return;
  const player = state.players[state.active];
  const index = player.hand.findIndex(t => t.id === taskId);
  if (index < 0) return;
  const task = player.hand[index];
  if (!isTaskMatch(task)) return;
  player.hand.splice(index, 1);
  player.scored.push(task);
  player.score += task.points;
  showToast(`+${task.points} reputasi · ${task.title}`);
  renderAll();
}

function spendCoin() {
  if (state.coinUsed || !["ability", "ability-action", "score"].includes(state.phase)) return;
  const player = state.players[state.active];
  if (player.coins <= 0 || state.taskDeck.length < 2) {
    showToast("Koin atau Job Order tidak cukup untuk diganti.");
    return;
  }

  player.coins -= 1;
  state.coinUsed = true;
  const old = player.hand.splice(0);
  old.forEach(card => state.taskDeck.unshift(card));
  player.hand.push(state.taskDeck.pop(), state.taskDeck.pop());
  showToast("Dua Job Order diganti.");
  renderAll();
}

function endTurn() {
  const player = state.players[state.active];
  while (player.hand.length < 2 && state.taskDeck.length) player.hand.push(state.taskDeck.pop());

  if (!state.bag.length || !state.taskDeck.length) {
    endGame();
    return;
  }

  state.active = 1 - state.active;
  state.shift += 1;
  state.coinUsed = false;
  state.currentToken = null;
  state.placedCoord = null;
  state.abilityState = null;
  showPassScreen(false);
}

function endGame() {
  state.gameOver = true;
  state.phase = "gameover";
  const p1 = state.players[0].score + state.players[0].coins;
  const p2 = state.players[1].score + state.players[1].coins;
  els.finalP1.textContent = p1;
  els.finalP2.textContent = p2;

  if (p1 > p2) els.winnerTitle.textContent = "Mochi menang!";
  else if (p2 > p1) els.winnerTitle.textContent = "Yuki menang!";
  else els.winnerTitle.textContent = "Shift berakhir seri!";

  els.winnerText.textContent = `Order + koin tersisa. Mochi ${state.players[0].score}+${state.players[0].coins}, Yuki ${state.players[1].score}+${state.players[1].coins}.`;
  els.gameOverModal.classList.add("show");
  renderAll();
}

function isTaskMatch(task) {
  const groups = task.shape === "line" ? getLineTriplets() : getTriangleTriplets();
  return groups.some(group => groupMatchesTask(group, task));
}

function groupMatchesTask(group, task) {
  const tokens = group.map(key => topToken(key));
  if (tokens.some(t => !t)) return false;

  if (task.shape === "line") {
    return sequenceMatches(tokens, task.jobs) || sequenceMatches([...tokens].reverse(), task.jobs);
  }

  return permutations([0,1,2]).some(order => {
    return task.jobs.every((job, idx) => tokenMatchesJob(tokens[order[idx]], job));
  });
}

function sequenceMatches(tokens, jobs) {
  return jobs.every((job, idx) => tokenMatchesJob(tokens[idx], job));
}

function tokenMatchesJob(token, job) {
  return Boolean(token && token.jobs.includes(job));
}

function getLineTriplets() {
  const boardKeys = new Set(Object.keys(state.board));
  const seen = new Set();
  const result = [];
  const dirs = [[1,0], [0,1], [1,-1]];

  Object.keys(state.board).forEach(key => {
    const [q, r] = parseKey(key);
    dirs.forEach(([dq, dr]) => {
      const group = [`${q},${r}`, `${q+dq},${r+dr}`, `${q+2*dq},${r+2*dr}`];
      if (group.every(k => boardKeys.has(k))) {
        const sig = [...group].sort().join("|");
        if (!seen.has(sig)) { seen.add(sig); result.push(group); }
      }
    });
  });
  return result;
}

function getTriangleTriplets() {
  const boardKeys = new Set(Object.keys(state.board));
  const seen = new Set();
  const result = [];

  Object.keys(state.board).forEach(key => {
    const [q, r] = parseKey(key);
    for (let i = 0; i < 6; i++) {
      const [d1q, d1r] = DIRECTIONS[i];
      const [d2q, d2r] = DIRECTIONS[(i + 1) % 6];
      const group = [key, `${q+d1q},${r+d1r}`, `${q+d2q},${r+d2r}`];
      if (group.every(k => boardKeys.has(k))) {
        const sig = [...group].sort().join("|");
        if (!seen.has(sig)) { seen.add(sig); result.push(group); }
      }
    }
  });
  return result;
}

function permutations(arr) {
  if (arr.length <= 1) return [arr];
  const out = [];
  arr.forEach((item, idx) => {
    const rest = [...arr.slice(0, idx), ...arr.slice(idx + 1)];
    permutations(rest).forEach(p => out.push([item, ...p]));
  });
  return out;
}

function topToken(key) {
  const stack = state.board[key];
  return stack && stack.length ? stack[stack.length - 1] : null;
}

function isAdjacent(a, b) {
  return neighborKeys(a).includes(b);
}

function neighborKeys(key) {
  const [q, r] = parseKey(key);
  return DIRECTIONS
    .map(([dq, dr]) => `${q+dq},${r+dr}`)
    .filter(k => Object.prototype.hasOwnProperty.call(state.board, k));
}

function parseKey(key) {
  return key.split(",").map(Number);
}

function renderAll() {
  renderBoard();
  renderPlayers();
  renderStatus();
  renderPhase();
}

function renderBoard() {
  const coords = getBoardCoords();
  const size = 56;
  const centerX = 295;
  const centerY = 245;

  els.hexBoard.innerHTML = "";
  coords.forEach(({q, r, key}) => {
    const x = size * Math.sqrt(3) * (q + r / 2);
    const y = size * 1.5 * r;
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "hex-cell";
    cell.dataset.key = key;
    cell.style.left = `${centerX + x - 54}px`;
    cell.style.top = `${centerY + y - 62}px`;
    cell.setAttribute("aria-label", `Hex ${key}`);

    const interaction = getCellInteraction(key);
    if (interaction) cell.classList.add(interaction);

    const stack = state.board[key];
    if (stack.length) cell.appendChild(renderTokenStack(stack));
    cell.addEventListener("click", () => handleHexClick(key));
    els.hexBoard.appendChild(cell);
  });
}

function getCellInteraction(key) {
  if (state.hidden) return null;
  if (state.phase === "place" || state.phase === "bonus-place") {
    return state.board[key].length < MAX_STACK ? "valid-target" : "invalid";
  }
  const a = state.abilityState;
  if (state.phase !== "ability-action" || !a) return null;

  if (a.type === "courier") {
    if (a.step === "source") return isAdjacent(a.origin, key) && topToken(key) ? "valid-source" : null;
    if (a.step === "destination") {
      if (key === a.source) return "selected-source";
      return state.board[key].length < MAX_STACK ? "valid-target" : null;
    }
  }

  if (a.type === "mechanic") {
    if (a.step === "source") return isAdjacent(a.origin,key) && topToken(key) && !a.used.includes(key) ? "valid-source" : null;
    if (a.step === "destination") {
      if (key === a.source) return "selected-source";
      return isAdjacent(a.source,key) && state.board[key].length < MAX_STACK ? "valid-target" : null;
    }
  }

  if (a.type === "barista") {
    if (a.step === "first") return topToken(key) ? "valid-source" : null;
    if (a.step === "second") {
      if (key === a.first) return "selected-source";
      return topToken(key) ? "valid-target" : null;
    }
  }

  if (a.type === "manager") return isAdjacent(a.origin,key) && topToken(key) ? "valid-source" : null;
  return null;
}

function renderTokenStack(stack) {
  const wrap = document.createElement("div");
  wrap.className = "token-stack";
  if (stack.length >= 2) {
    const sh = document.createElement("div"); sh.className = "stack-shadow one"; wrap.appendChild(sh);
  }
  if (stack.length >= 3) {
    const sh = document.createElement("div"); sh.className = "stack-shadow two"; wrap.appendChild(sh);
  }

  const token = stack[stack.length - 1];
  const disc = document.createElement("div");
  disc.className = "cat-token";
  disc.style.background = tokenBackground(token);
  disc.innerHTML = `<span class="cat-face">🐱</span><span class="job-icon-badge">${token.jobs.map(j => JOBS[j].icon).join("")}</span>`;
  wrap.appendChild(disc);

  if (stack.length > 1) {
    const count = document.createElement("span");
    count.className = "stack-count";
    count.textContent = stack.length;
    wrap.appendChild(count);
  }
  return wrap;
}

function tokenBackground(token) {
  if (!token) return "#211c2f";
  if (!token.dual) {
    const j = JOBS[token.jobs[0]];
    return `linear-gradient(145deg, ${j.color2}, ${j.color})`;
  }
  const a = JOBS[token.jobs[0]].color;
  const b = JOBS[token.jobs[1]].color;
  return `linear-gradient(135deg, ${a} 0 48%, ${b} 52% 100%)`;
}

function renderPlayers() {
  const p1 = state.players[0];
  const p2 = state.players[1];
  els.p1Score.textContent = p1.score;
  els.p1Coins.textContent = p1.coins;
  els.p2Score.textContent = p2.score;
  els.p2Coins.textContent = p2.coins;
  els.p1Done.textContent = `${p1.scored.length} order`;
  els.p2Done.textContent = `${p2.scored.length} order`;

  const hideP1 = state.hidden || state.active !== 0;
  const hideP2 = state.hidden || state.active !== 1;
  renderTaskHand(els.p1Tasks, p1.hand, hideP1);
  renderTaskHand(els.p2Tasks, p2.hand, hideP2);
  renderScored(els.p1Scored, p1.scored);
  renderScored(els.p2Scored, p2.scored);

  els.playerOnePanel.classList.toggle("active", !state.hidden && state.active === 0);
  els.playerOnePanel.classList.toggle("inactive", state.hidden || state.active !== 0);
  els.playerTwoPanel.classList.toggle("active", !state.hidden && state.active === 1);
  els.playerTwoPanel.classList.toggle("inactive", state.hidden || state.active !== 1);
}

function renderTaskHand(container, hand, hidden) {
  if (hidden) {
    container.innerHTML = [0,1].map(() => `<div class="task-card locked"><div><span class="lock-mark">🔒</span><strong>Job Order Rahasia</strong></div></div>`).join("");
    return;
  }

  if (!hand.length) {
    container.innerHTML = `<div class="task-card locked"><div><span class="lock-mark">📭</span><strong>Order habis</strong></div></div>`;
    return;
  }

  container.innerHTML = hand.map(task => {
    const ready = state.phase === "score" && isTaskMatch(task);
    return `<article class="task-card ${ready ? "ready" : ""}">
      <div class="task-topline">
        <div><span class="task-shape">${task.shape === "line" ? "LINE JOB" : "TRIANGLE JOB"}</span><h4 class="task-title">${task.title}</h4></div>
        <span class="task-points">+${task.points}</span>
      </div>
      ${renderPattern(task)}
      ${ready ? `<button class="score-order-btn" data-score="${task.id}">✓ Selesaikan Order</button>` : ""}
    </article>`;
  }).join("");

  container.querySelectorAll("[data-score]").forEach(btn => {
    btn.addEventListener("click", () => scoreTask(btn.dataset.score));
  });
}

function renderPattern(task) {
  const nodes = task.jobs.map(job => `<span class="pattern-node" style="background:${JOBS[job].color}" title="${JOBS[job].name}">${JOBS[job].icon}</span>`).join("");
  return `<div class="pattern-line ${task.shape === "triangle" ? "triangle" : ""}">${nodes}</div>`;
}

function renderScored(container, scored) {
  if (!scored.length) {
    container.innerHTML = `<span class="empty-note">Belum ada</span>`;
    return;
  }
  container.innerHTML = scored.slice(-8).map(task => `<span class="scored-mini" title="${task.title}">+${task.points}</span>`).join("");
}

function renderStatus() {
  els.bagCount.textContent = state.bag.length;
  els.deckCount.textContent = state.taskDeck.length;
  els.shiftNo.textContent = state.shift;
  const p = state.players[state.active];
  els.turnText.textContent = state.gameOver ? "Shift selesai" : state.hidden ? `Menunggu ${p.name}` : `${p.name} · ${phaseName(state.phase)}`;
}

function phaseName(phase) {
  return ({ draw: "Draw", place: "Placement", "bonus-place": "Bonus Placement", ability: "Skill", "ability-action": "Skill", score: "Score" })[phase] || "Ready";
}

function renderPhase() {
  const p = state.players[state.active];
  const currentTop = state.placedCoord ? topToken(state.placedCoord) : null;

  els.mainActionBtn.classList.remove("hidden");
  els.skipAbilityBtn.classList.add("hidden");
  els.abilityDoneBtn.classList.add("hidden");
  els.coinBtn.classList.add("hidden");
  els.mainActionBtn.disabled = false;

  if (state.hidden) {
    els.phaseLabel.textContent = "HOT-SEAT";
    els.phaseTitle.textContent = "Job Order sedang dikunci";
    els.phaseHint.textContent = "Gunakan layar pergantian pemain untuk menjaga informasi rahasia.";
    els.mainActionBtn.classList.add("hidden");
  } else if (state.phase === "draw") {
    els.phaseLabel.textContent = "PLAY PHASE";
    els.phaseTitle.textContent = "Ambil pekerja dari tas";
    els.phaseHint.textContent = `${p.name} memulai shift dengan satu worker baru.`;
    els.mainActionBtn.textContent = "Ambil Worker";
  } else if (state.phase === "place") {
    els.phaseLabel.textContent = "PLAY · PLACEMENT";
    els.phaseTitle.textContent = "Pilih hex untuk worker";
    els.phaseHint.textContent = "Hex berwarna hangat valid. Maksimal tiga worker per hex.";
    els.mainActionBtn.classList.add("hidden");
  } else if (state.phase === "bonus-place") {
    els.phaseLabel.textContent = "SKILL · BONUS PLACEMENT";
    els.phaseTitle.textContent = "Tempatkan worker bonus";
    els.phaseHint.textContent = "Worker bonus tidak mengaktifkan skill kedua.";
    els.mainActionBtn.classList.add("hidden");
  } else if (state.phase === "ability") {
    els.phaseLabel.textContent = "SKILL PHASE";
    els.phaseTitle.textContent = currentTop ? `${tokenName(currentTop)} dapat bekerja ekstra` : "Aktifkan skill";
    els.phaseHint.textContent = currentTop ? tokenSkillText(currentTop) : "Skill bersifat opsional.";
    els.mainActionBtn.textContent = "Aktifkan Skill";
    els.skipAbilityBtn.classList.remove("hidden");
    if (!state.coinUsed && p.coins > 0 && state.taskDeck.length >= 2) els.coinBtn.classList.remove("hidden");
  } else if (state.phase === "ability-action") {
    renderAbilityInstruction();
    els.mainActionBtn.classList.add("hidden");
    const a = state.abilityState;
    if (a?.type === "mechanic" && a.moves > 0) els.abilityDoneBtn.classList.remove("hidden");
    if (!state.coinUsed && p.coins > 0 && state.taskDeck.length >= 2) els.coinBtn.classList.remove("hidden");
  } else if (state.phase === "score") {
    const ready = p.hand.filter(task => isTaskMatch(task)).length;
    els.phaseLabel.textContent = "SCORE PHASE";
    els.phaseTitle.textContent = ready ? `${ready} Job Order cocok` : "Periksa Job Order";
    els.phaseHint.textContent = ready ? "Klik Selesaikan Order pada kartu yang menyala hijau." : "Tidak ada pola yang cocok. Anda dapat mengakhiri shift.";
    els.mainActionBtn.textContent = "Akhiri Shift";
    if (!state.coinUsed && p.coins > 0 && state.taskDeck.length >= 2) els.coinBtn.classList.remove("hidden");
  } else if (state.phase === "gameover") {
    els.phaseLabel.textContent = "GAME OVER";
    els.phaseTitle.textContent = "Miaw City tutup untuk hari ini";
    els.phaseHint.textContent = "Lihat hasil akhir pada layar pemenang.";
    els.mainActionBtn.classList.add("hidden");
  }

  renderCurrentWorker();
}

function renderAbilityInstruction() {
  const a = state.abilityState;
  if (!a) return;
  const labels = {
    courier: ["COURIER · EXPRESS MOVE", a.step === "source" ? "Pilih worker tetangga" : "Pilih tujuan baru", a.step === "source" ? "Worker yang dipilih harus berada di sebelah Courier." : "Tujuan dapat berupa hex valid mana pun."],
    mechanic: ["MECHANIC · FINE TUNE", a.step === "source" ? `Pilih worker tetangga ${a.moves ? "kedua" : ""}` : "Geser satu hex", a.step === "source" ? "Anda boleh memindahkan hingga dua worker berbeda." : "Tujuan harus bersebelahan dengan posisi worker saat ini."],
    barista: ["BARISTA · TABLE SWAP", a.step === "first" ? "Pilih worker pertama" : "Pilih worker kedua", "Dua worker teratas akan bertukar posisi."],
    manager: ["MANAGER · TEAM LEAD", "Pilih worker tetangga", "Manager akan mencontoh skill worker yang dipilih."]
  };
  const [label, title, hint] = labels[a.type];
  els.phaseLabel.textContent = label;
  els.phaseTitle.textContent = title;
  els.phaseHint.textContent = hint;
}

function renderCurrentWorker() {
  let token = state.currentToken;
  if (!token && ["ability", "ability-action"].includes(state.phase) && state.placedCoord) token = topToken(state.placedCoord);

  if (!token) {
    els.currentWorker.innerHTML = `<div class="worker-placeholder">?</div><div><small>Worker berikutnya</small><strong id="currentWorkerName">Belum diambil</strong></div>`;
  } else {
    els.currentWorker.innerHTML = `<div class="mini-token" style="background:${tokenBackground(token)}">🐱</div><div><small>${token.dual ? "Dual Worker" : "Worker aktif"}</small><strong>${tokenName(token)}</strong></div>`;
  }
}

function buildLegend() {
  els.legendRow.innerHTML = JOB_IDS.map(id => {
    const j = JOBS[id];
    return `<button class="legend-item" type="button" data-skill-ref="${id}" title="Buka Skill Book: ${j.name}"><span class="legend-swatch" style="background:linear-gradient(145deg,${j.color2},${j.color})">${j.icon}</span><div><strong>${j.name}</strong><small>${j.skill}</small></div></button>`;
  }).join("");
  els.legendRow.querySelectorAll("[data-skill-ref]").forEach(btn => {
    btn.addEventListener("click", () => openSkillBook(btn.dataset.skillRef));
  });
}

function buildSkillBook() {
  els.skillBookGrid.innerHTML = JOB_IDS.map(id => {
    const j = JOBS[id];
    return `<article class="skill-card-full" id="skill-${id}" style="--skill-color:${j.color};--skill-soft:${hexToRgba(j.color2,.16)}">
      <div class="skill-card-head">
        <div class="skill-token-demo" style="background:linear-gradient(145deg,${j.color2},${j.color})"><span>🐱</span><em>${j.icon}</em></div>
        <div><small>${j.name.toUpperCase()} WORKER</small><h3>${j.name} Cat</h3><strong>${j.skill}</strong></div>
      </div>
      <div class="skill-card-body">
        <div class="skill-detail"><b>EFEK</b><span>${j.rule}</span></div>
        <div class="skill-detail"><b>TARGET LEGAL</b><span>${j.target}</span></div>
        <div class="skill-example"><b>Contoh:</b> ${j.example}</div>
      </div>
    </article>`;
  }).join("");
}

function openSkillBook(jobId = null) {
  els.skillBookModal.classList.add("show");
  if (!jobId) {
    els.skillBookModal.querySelector(".skillbook-card").scrollTop = 0;
    return;
  }
  requestAnimationFrame(() => {
    const target = document.getElementById(`skill-${jobId}`);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const value = parseInt(clean, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function tokenName(token) {
  if (!token) return "Unknown Worker";
  return token.jobs.map(j => JOBS[j].name).join(" + ");
}

function tokenSkillText(token) {
  if (token.dual) return `Dual Worker: pilih ${token.jobs.map(j => JOBS[j].skill).join(" atau ")}.`;
  return JOBS[token.jobs[0]].short;
}

function showToast(message) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("show");
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2200);
}

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

document.addEventListener("DOMContentLoaded", init);
