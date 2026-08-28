const SETTINGS_KEY = "bunnyWordRushSettingsV1";
const PLAYERS_KEY = "bunnyWordRushPlayersV1";
const THEME_KEY = "bunnyWordRushTheme";

const COMMON_STARTS = "ABCDEFGHIJKLMNOPRSTUVWY".split("");
const COMMON_ENDS = "AIKLMNPRSTUGH".split("");
const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const PLAYER_COLORS = ["#7a5dc7", "#e96756", "#26795e", "#b48024", "#397bb8", "#ba5796", "#518348", "#a55b32"];

const DEFAULT_PLAYERS = [
  { id: "player-1", name: "Pemain 1", score: 0, color: PLAYER_COLORS[0] },
  { id: "player-2", name: "Pemain 2", score: 0, color: PLAYER_COLORS[1] },
];

const state = {
  players: [],
  duration: 15,
  mode: "common",
  sound: true,
  round: 0,
  startLetter: null,
  endLetter: null,
  timeLeft: 15,
  phase: "idle",
  selectedPlayerId: null,
  resultType: null,
  timerId: null,
  deadline: null,
  shuffleToken: 0,
  pausedForSettings: false,
};

const elements = {
  root: document.documentElement,
  themeToggle: document.querySelector("#themeToggle"),
  soundToggle: document.querySelector("#soundToggle"),
  openSettings: document.querySelector("#openSettings"),
  settingsDialog: document.querySelector("#settingsDialog"),
  closeSettings: document.querySelector("#closeSettings"),
  saveSettings: document.querySelector("#saveSettings"),
  durationInput: document.querySelector("#durationInput"),
  durationOutput: document.querySelector("#durationOutput"),
  playerEditor: document.querySelector("#playerEditor"),
  addPlayerButton: document.querySelector("#addPlayerButton"),
  resetGame: document.querySelector("#resetGame"),
  quickAddPlayer: document.querySelector("#quickAddPlayer"),
  roundNumber: document.querySelector("#roundNumber"),
  timer: document.querySelector("#timer"),
  timerValue: document.querySelector("#timerValue"),
  timerProgress: document.querySelector("#timerProgress"),
  instructionText: document.querySelector("#instructionText"),
  startLetter: document.querySelector("#startLetter"),
  endLetter: document.querySelector("#endLetter"),
  shuffleButton: document.querySelector("#shuffleButton"),
  promptText: document.querySelector("#promptText"),
  pickButton: document.querySelector("#pickButton"),
  skipButton: document.querySelector("#skipButton"),
  resultPanel: document.querySelector("#resultPanel"),
  resultIcon: document.querySelector("#resultIcon"),
  resultTitle: document.querySelector("#resultTitle"),
  resultText: document.querySelector("#resultText"),
  nextButton: document.querySelector("#nextButton"),
  playerList: document.querySelector("#playerList"),
  claimDialog: document.querySelector("#claimDialog"),
  cancelClaim: document.querySelector("#cancelClaim"),
  claimPlayers: document.querySelector("#claimPlayers"),
  answerInput: document.querySelector("#answerInput"),
  answerHint: document.querySelector("#answerHint"),
  wrongButton: document.querySelector("#wrongButton"),
  correctButton: document.querySelector("#correctButton"),
  toast: document.querySelector("#toast"),
};

function storageGet(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    showToast("Penyimpanan browser tidak tersedia.");
  }
}

function initializeState() {
  const settings = storageGet(SETTINGS_KEY, {});
  const players = storageGet(PLAYERS_KEY, DEFAULT_PLAYERS);
  state.duration = clamp(Number(settings.duration) || 15, 5, 60);
  state.mode = settings.mode === "all" ? "all" : "common";
  state.sound = settings.sound !== false;
  state.timeLeft = state.duration;
  state.players = Array.isArray(players) && players.length
    ? players.slice(0, 8).map((player, index) => ({
        id: String(player.id || `player-${Date.now()}-${index}`),
        name: String(player.name || `Pemain ${index + 1}`).slice(0, 24),
        score: Math.max(0, Number(player.score) || 0),
        color: PLAYER_COLORS[index % PLAYER_COLORS.length],
      }))
    : structuredClone(DEFAULT_PLAYERS);
}

function initializeTheme() {
  let savedTheme = "";
  try {
    savedTheme = localStorage.getItem(THEME_KEY) || "";
  } catch {
    savedTheme = "";
  }
  const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  applyTheme(savedTheme || preferred);
}

function applyTheme(theme) {
  elements.root.dataset.theme = theme;
  const isDark = theme === "dark";
  elements.themeToggle.textContent = isDark ? "☀" : "☾";
  elements.themeToggle.setAttribute("aria-label", isDark ? "Aktifkan tema terang" : "Aktifkan tema gelap");
}

function toggleTheme() {
  const next = elements.root.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    showToast("Tema tidak dapat disimpan.");
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function getLetterPool() {
  if (state.mode === "all") return { starts: ALL_LETTERS, ends: ALL_LETTERS };
  return { starts: COMMON_STARTS, ends: COMMON_ENDS };
}

function generatePair() {
  const { starts, ends } = getLetterPool();
  const previous = `${state.startLetter || ""}${state.endLetter || ""}`;
  let start;
  let end;
  let attempts = 0;

  do {
    start = randomFrom(starts);
    end = randomFrom(ends);
    attempts += 1;
  } while ((start === end || `${start}${end}` === previous) && attempts < 30);

  return { start, end };
}

function shuffleRound() {
  stopTimer();
  if (elements.claimDialog.open) elements.claimDialog.close();

  const pair = generatePair();
  const token = ++state.shuffleToken;
  state.round += 1;
  state.phase = "shuffling";
  state.resultType = null;
  state.selectedPlayerId = null;
  state.timeLeft = state.duration;
  elements.startLetter.classList.add("shuffling");
  elements.endLetter.classList.add("shuffling");
  playTone(520, 0.06);

  let flickers = 0;
  const flickerTimer = setInterval(() => {
    if (token !== state.shuffleToken) {
      clearInterval(flickerTimer);
      return;
    }
    const pool = getLetterPool();
    elements.startLetter.textContent = randomFrom(pool.starts);
    elements.endLetter.textContent = randomFrom(pool.ends);
    flickers += 1;

    if (flickers >= 7) {
      clearInterval(flickerTimer);
      state.startLetter = pair.start;
      state.endLetter = pair.end;
      state.phase = "playing";
      elements.startLetter.classList.remove("shuffling");
      elements.endLetter.classList.remove("shuffling");
      render();
      playTone(760, 0.09);
      startTimer();
    }
  }, 48);

  render();
}

function startTimer() {
  stopTimer();
  if (state.phase !== "playing") return;
  state.deadline = Date.now() + state.timeLeft * 1000;
  state.timerId = window.setInterval(tickTimer, 100);
  tickTimer();
}

function tickTimer() {
  if (!state.deadline || state.phase !== "playing") return;
  state.timeLeft = Math.max(0, (state.deadline - Date.now()) / 1000);
  renderTimer();
  if (state.timeLeft <= 0) finishByTimeout();
}

function stopTimer() {
  if (state.timerId) clearInterval(state.timerId);
  state.timerId = null;
  state.deadline = null;
}

function pauseTimer() {
  if (state.phase !== "playing") return;
  if (state.deadline) state.timeLeft = Math.max(0, (state.deadline - Date.now()) / 1000);
  stopTimer();
}

function finishByTimeout() {
  stopTimer();
  state.phase = "finished";
  state.resultType = "timeout";
  state.timeLeft = 0;
  playSequence([220, 180], 0.12);
  render();
}

function skipRound() {
  if (state.phase !== "playing") return;
  stopTimer();
  state.phase = "finished";
  state.resultType = "skipped";
  render();
}

function pickMe() {
  if (state.phase !== "playing" || !state.players.length) return;
  pauseTimer();
  state.phase = "claimed";
  state.selectedPlayerId = null;
  elements.answerInput.value = "";
  updateAnswerHint();
  renderClaimPlayers();
  render();
  playSequence([650, 880], 0.07);
  elements.claimDialog.showModal();
}

function cancelClaim() {
  if (elements.claimDialog.open) elements.claimDialog.close();
  if (state.phase === "claimed") {
    state.phase = "playing";
    state.selectedPlayerId = null;
    render();
    startTimer();
  }
}

function selectPlayer(playerId) {
  state.selectedPlayerId = playerId;
  renderClaimPlayers();
  elements.wrongButton.disabled = false;
  elements.correctButton.disabled = false;
}

function judgeAnswer(correct) {
  const player = state.players.find((item) => item.id === state.selectedPlayerId);
  if (!player) return;

  if (correct) {
    player.score += 1;
    storageSet(PLAYERS_KEY, state.players);
    state.phase = "finished";
    state.resultType = "correct";
    elements.claimDialog.close();
    playSequence([660, 830, 1040], 0.09);
    showToast(`${player.name} mendapat 1 poin!`);
    render();
    return;
  }

  elements.claimDialog.close();
  state.phase = "playing";
  state.selectedPlayerId = null;
  showToast("Jawaban belum tepat. Pemain lain boleh mencoba.");
  playTone(190, 0.14);
  render();
  startTimer();
}

function normalizeWord(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
}

function updateAnswerHint() {
  const word = normalizeWord(elements.answerInput.value);
  elements.answerHint.classList.remove("match", "mismatch");

  if (!word) {
    elements.answerHint.textContent = "Moderator tetap menentukan valid atau tidaknya kata.";
    return;
  }

  const matches = word.startsWith(state.startLetter) && word.endsWith(state.endLetter);
  if (matches) {
    elements.answerHint.textContent = `✓ Polanya cocok: diawali ${state.startLetter} dan diakhiri ${state.endLetter}.`;
    elements.answerHint.classList.add("match");
  } else {
    elements.answerHint.textContent = `× Polanya belum cocok dengan ${state.startLetter} ... ${state.endLetter}.`;
    elements.answerHint.classList.add("mismatch");
  }
}

function render() {
  elements.roundNumber.textContent = String(state.round).padStart(2, "0");
  elements.startLetter.textContent = state.startLetter || elements.startLetter.textContent || "?";
  elements.endLetter.textContent = state.endLetter || elements.endLetter.textContent || "?";
  elements.soundToggle.classList.toggle("muted", !state.sound);
  elements.soundToggle.textContent = state.sound ? "♪" : "♩";
  elements.soundToggle.setAttribute("aria-label", state.sound ? "Matikan suara" : "Aktifkan suara");

  const canPlay = state.phase === "playing" && state.players.length > 0;
  elements.pickButton.disabled = !canPlay;
  elements.skipButton.disabled = state.phase !== "playing";
  elements.shuffleButton.disabled = state.phase === "shuffling";

  if (state.phase === "idle") {
    elements.instructionText.innerHTML = "Klik <strong>Shuffle</strong> untuk mendapatkan huruf awal dan akhir.";
    elements.promptText.textContent = "Siap menguji kecepatan berpikirmu?";
  } else if (state.phase === "shuffling") {
    elements.instructionText.textContent = "Kelinci sedang mengacak huruf...";
    elements.promptText.textContent = "Bersiap, ronde akan segera dimulai.";
  } else if (state.phase === "playing") {
    elements.instructionText.textContent = "Sebutkan satu kata secepat mungkin sebelum waktu habis.";
    const prefix = document.createTextNode("Cari kata yang diawali ");
    const first = document.createElement("strong");
    first.textContent = state.startLetter;
    const middle = document.createTextNode(" dan diakhiri ");
    const last = document.createElement("strong");
    last.textContent = state.endLetter;
    elements.promptText.replaceChildren(prefix, first, middle, last, document.createTextNode("."));
  } else if (state.phase === "claimed") {
    elements.instructionText.textContent = "Waktu dihentikan. Sebutkan jawabanmu dengan lantang!";
  } else {
    elements.instructionText.textContent = "Ronde selesai. Siap untuk kombinasi berikutnya?";
  }

  renderTimer();
  renderPlayers();
  renderResult();
}

function renderTimer() {
  const displayTime = Math.ceil(state.timeLeft);
  const ratio = state.duration ? clamp(state.timeLeft / state.duration, 0, 1) : 0;
  const active = state.phase === "playing";
  const danger = active && state.timeLeft <= 5;
  elements.timerValue.textContent = String(displayTime).padStart(2, "0");
  elements.timer.classList.toggle("active", active);
  elements.timer.classList.toggle("danger", danger);
  elements.timerProgress.classList.toggle("danger", danger);
  elements.timerProgress.style.width = `${ratio * 100}%`;
}

function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "P";
}

function renderPlayers() {
  elements.playerList.replaceChildren();
  if (!state.players.length) {
    const empty = document.createElement("div");
    empty.className = "score-empty";
    empty.textContent = "Belum ada pemain. Tambahkan pemain untuk memulai.";
    elements.playerList.append(empty);
    return;
  }

  const highest = Math.max(...state.players.map((player) => player.score));
  const sorted = [...state.players].sort((a, b) => b.score - a.score);
  sorted.forEach((player, index) => {
    const row = document.createElement("div");
    row.className = `player-row${highest > 0 && player.score === highest ? " leading" : ""}`;
    row.style.setProperty("--player-color", player.color);

    const avatar = document.createElement("span");
    avatar.className = "player-avatar";
    avatar.textContent = initials(player.name);

    const info = document.createElement("div");
    info.className = "player-info";
    const name = document.createElement("strong");
    name.textContent = player.name;
    const rank = document.createElement("span");
    rank.textContent = index === 0 && player.score > 0 ? "Sedang memimpin" : `${player.score} jawaban benar`;
    info.append(name, rank);

    const score = document.createElement("span");
    score.className = "player-score";
    score.textContent = player.score;
    row.append(avatar, info, score);
    elements.playerList.append(row);
  });
}

function renderResult() {
  const finished = state.phase === "finished";
  elements.resultPanel.hidden = !finished;
  elements.resultPanel.classList.toggle("timeout", state.resultType === "timeout" || state.resultType === "skipped");
  if (!finished) return;

  if (state.resultType === "correct") {
    const player = state.players.find((item) => item.id === state.selectedPlayerId);
    elements.resultIcon.textContent = "✓";
    elements.resultTitle.textContent = "Jawaban diterima!";
    elements.resultText.textContent = `${player?.name || "Pemain"} mendapatkan satu poin.`;
  } else if (state.resultType === "skipped") {
    elements.resultIcon.textContent = "↝";
    elements.resultTitle.textContent = "Ronde dilewati.";
    elements.resultText.textContent = "Tidak ada poin pada kombinasi huruf ini.";
  } else {
    elements.resultIcon.textContent = "!";
    elements.resultTitle.textContent = "Waktu habis!";
    elements.resultText.textContent = "Tidak ada pemain yang berhasil mengunci jawaban.";
  }
}

function renderClaimPlayers() {
  elements.claimPlayers.replaceChildren();
  state.players.forEach((player) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `claim-player${state.selectedPlayerId === player.id ? " selected" : ""}`;
    button.style.setProperty("--player-color", player.color);
    const avatar = document.createElement("span");
    avatar.textContent = initials(player.name);
    const name = document.createElement("span");
    name.textContent = player.name;
    button.append(avatar, name);
    button.addEventListener("click", () => selectPlayer(player.id));
    elements.claimPlayers.append(button);
  });
  elements.wrongButton.disabled = !state.selectedPlayerId;
  elements.correctButton.disabled = !state.selectedPlayerId;
}

function openSettings(addPlayerImmediately = false) {
  state.pausedForSettings = state.phase === "playing";
  if (state.pausedForSettings) pauseTimer();
  elements.durationInput.value = state.duration;
  elements.durationOutput.textContent = `${state.duration} detik`;
  const selectedMode = document.querySelector(`input[name="letterMode"][value="${state.mode}"]`);
  if (selectedMode) selectedMode.checked = true;
  renderPlayerEditor();
  elements.settingsDialog.showModal();
  if (addPlayerImmediately) addPlayerEditorRow();
}

function closeSettingsDialog(resume = true) {
  if (elements.settingsDialog.open) elements.settingsDialog.close();
  if (resume && state.pausedForSettings && state.phase === "playing" && state.timeLeft > 0) startTimer();
  state.pausedForSettings = false;
}

function renderPlayerEditor() {
  elements.playerEditor.replaceChildren();
  state.players.forEach((player) => appendPlayerEditorRow(player));
}

function appendPlayerEditorRow(player) {
  const row = document.createElement("div");
  row.className = "player-edit-row";
  row.dataset.id = player.id;
  row.dataset.score = player.score;

  const drag = document.createElement("span");
  drag.className = "drag-mark";
  drag.textContent = "⋮⋮";
  const input = document.createElement("input");
  input.type = "text";
  input.maxLength = 24;
  input.value = player.name;
  input.setAttribute("aria-label", "Nama pemain");
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "remove-player";
  remove.textContent = "×";
  remove.setAttribute("aria-label", `Hapus ${player.name}`);
  remove.addEventListener("click", () => {
    if (elements.playerEditor.children.length <= 1) {
      showToast("Permainan membutuhkan minimal satu pemain.");
      return;
    }
    row.remove();
  });
  row.append(drag, input, remove);
  elements.playerEditor.append(row);
}

function addPlayerEditorRow() {
  const count = elements.playerEditor.children.length;
  if (count >= 8) {
    showToast("Maksimal delapan pemain.");
    return;
  }
  appendPlayerEditorRow({
    id: `player-${Date.now()}-${count}`,
    name: `Pemain ${count + 1}`,
    score: 0,
    color: PLAYER_COLORS[count % PLAYER_COLORS.length],
  });
  const input = elements.playerEditor.lastElementChild?.querySelector("input");
  input?.focus();
  input?.select();
}

function saveSettings() {
  const shouldResume = state.pausedForSettings;
  const rows = [...elements.playerEditor.querySelectorAll(".player-edit-row")];
  const players = rows
    .map((row, index) => ({
      id: row.dataset.id,
      name: row.querySelector("input").value.trim().slice(0, 24),
      score: Math.max(0, Number(row.dataset.score) || 0),
      color: PLAYER_COLORS[index % PLAYER_COLORS.length],
    }))
    .filter((player) => player.name);

  if (!players.length) {
    showToast("Masukkan minimal satu nama pemain.");
    return;
  }

  state.players = players;
  state.duration = clamp(Number(elements.durationInput.value), 5, 60);
  state.mode = document.querySelector('input[name="letterMode"]:checked')?.value === "all" ? "all" : "common";
  if (state.phase === "idle" || state.phase === "finished") state.timeLeft = state.duration;
  else state.timeLeft = Math.min(state.timeLeft, state.duration);

  storageSet(PLAYERS_KEY, state.players);
  storageSet(SETTINGS_KEY, { duration: state.duration, mode: state.mode, sound: state.sound });
  closeSettingsDialog(false);
  render();
  if (shouldResume && state.phase === "playing") startTimer();
  state.pausedForSettings = false;
  showToast("Pengaturan tersimpan.");
}

function resetScores() {
  if (!window.confirm("Reset seluruh skor pemain menjadi nol?")) return;
  state.players.forEach((player) => { player.score = 0; });
  storageSet(PLAYERS_KEY, state.players);
  renderPlayerEditor();
  renderPlayers();
  showToast("Semua skor telah direset.");
}

function toggleSound() {
  state.sound = !state.sound;
  storageSet(SETTINGS_KEY, { duration: state.duration, mode: state.mode, sound: state.sound });
  render();
  if (state.sound) playTone(720, 0.06);
}

let audioContext;
function playTone(frequency, duration = 0.08, delay = 0) {
  if (!state.sound) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const startAt = audioContext.currentTime + delay;
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(0.11, startAt + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + duration + 0.02);
  } catch {
    state.sound = false;
    render();
  }
}

function playSequence(frequencies, duration = 0.08) {
  frequencies.forEach((frequency, index) => playTone(frequency, duration, index * (duration + 0.025)));
}

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("visible");
  toastTimer = setTimeout(() => elements.toast.classList.remove("visible"), 2300);
}

elements.themeToggle.addEventListener("click", toggleTheme);
elements.soundToggle.addEventListener("click", toggleSound);
elements.shuffleButton.addEventListener("click", shuffleRound);
elements.pickButton.addEventListener("click", pickMe);
elements.skipButton.addEventListener("click", skipRound);
elements.nextButton.addEventListener("click", shuffleRound);
elements.cancelClaim.addEventListener("click", cancelClaim);
elements.wrongButton.addEventListener("click", () => judgeAnswer(false));
elements.correctButton.addEventListener("click", () => judgeAnswer(true));
elements.answerInput.addEventListener("input", updateAnswerHint);
elements.openSettings.addEventListener("click", () => openSettings(false));
elements.quickAddPlayer.addEventListener("click", () => openSettings(true));
elements.closeSettings.addEventListener("click", () => closeSettingsDialog(true));
elements.addPlayerButton.addEventListener("click", addPlayerEditorRow);
elements.saveSettings.addEventListener("click", saveSettings);
elements.resetGame.addEventListener("click", resetScores);
elements.durationInput.addEventListener("input", () => {
  elements.durationOutput.textContent = `${elements.durationInput.value} detik`;
});

elements.claimDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  cancelClaim();
});

elements.settingsDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeSettingsDialog(true);
});

elements.claimDialog.addEventListener("click", (event) => {
  if (event.target === elements.claimDialog) cancelClaim();
});

elements.settingsDialog.addEventListener("click", (event) => {
  if (event.target === elements.settingsDialog) closeSettingsDialog(true);
});

document.addEventListener("keydown", (event) => {
  const typing = event.target instanceof HTMLInputElement;
  if (typing || elements.claimDialog.open || elements.settingsDialog.open) return;
  if (event.code === "Space" && state.phase === "playing") {
    event.preventDefault();
    pickMe();
  }
  if (event.key.toLowerCase() === "s" && state.phase !== "shuffling") shuffleRound();
});

window.addEventListener("beforeunload", stopTimer);

initializeState();
initializeTheme();
render();
