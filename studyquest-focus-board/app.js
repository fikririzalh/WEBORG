"use strict";

const SAVE_KEY = "studyQuestFocusBoardV1";
const BUILT_IN_MAPS = Array.isArray(window.STUDYQUEST_MAPS) ? window.STUDYQUEST_MAPS : [];
const TILE_ICONS = {
  start: "🚩",
  plain: "",
  xp: "⭐",
  coin: "🪙",
  checkpoint: "⚑",
  chest: "🎁",
  rest: "☕",
  finish: "🏆"
};
const VALID_TILE_TYPES = Object.keys(TILE_ICONS);

const DEFAULT_STATE = {
  currentMapId: BUILT_IN_MAPS[0]?.id || "forest-default",
  customMaps: [],
  mapProgress: {},
  xp: 0,
  coins: 0,
  rollTokens: 1,
  completedSessions: 0,
  soundEnabled: true,
  reducedMotion: false,
  task: "",
  durationMinutes: 10
};

const state = loadState();
let currentMap = null;
let isRolling = false;
let isMoving = false;
let audioContext = null;
let timerId = null;
let timerRemaining = state.durationMinutes * 60;
let timerRunning = false;
let editorMode = "new";

const $ = selector => document.querySelector(selector);
const elements = {
  xpTop: $("#xpTop"),
  coinTop: $("#coinTop"),
  lapTop: $("#lapTop"),
  soundButton: $("#soundButton"),
  motionButton: $("#motionButton"),
  mapTitle: $("#mapTitle"),
  mapSubtitle: $("#mapSubtitle"),
  mapSelect: $("#mapSelect"),
  newMapButton: $("#newMapButton"),
  editMapButton: $("#editMapButton"),
  exportMapButton: $("#exportMapButton"),
  importMapInput: $("#importMapInput"),
  mapStage: $("#mapStage"),
  tileLayer: $("#tileLayer"),
  mapPath: $("#mapPath"),
  mapPathShadow: $("#mapPathShadow"),
  player: $("#player"),
  positionBubble: $("#positionBubble"),
  eventText: $("#eventText"),
  diceCube: $("#diceCube"),
  rollButton: $("#rollButton"),
  diceResult: $("#diceResult"),
  rollTokenBadge: $("#rollTokenBadge"),
  taskInput: $("#taskInput"),
  durationSelect: $("#durationSelect"),
  timerDisplay: $("#timerDisplay"),
  timerStatus: $("#timerStatus"),
  startTimerButton: $("#startTimerButton"),
  completeFocusButton: $("#completeFocusButton"),
  targetTile: $("#targetTile"),
  levelValue: $("#levelValue"),
  positionValue: $("#positionValue"),
  nextReward: $("#nextReward"),
  mapProgressText: $("#mapProgressText"),
  mapProgressBar: $("#mapProgressBar"),
  levelProgressText: $("#levelProgressText"),
  levelProgressBar: $("#levelProgressBar"),
  mapEditorOverlay: $("#mapEditorOverlay"),
  editorTitle: $("#editorTitle"),
  closeEditorButton: $("#closeEditorButton"),
  mapJsonEditor: $("#mapJsonEditor"),
  editorError: $("#editorError"),
  formatJsonButton: $("#formatJsonButton"),
  saveMapButton: $("#saveMapButton"),
  toastContainer: $("#toastContainer")
};

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(DEFAULT_STATE),
      ...parsed,
      customMaps: Array.isArray(parsed.customMaps) ? parsed.customMaps : [],
      mapProgress: parsed.mapProgress && typeof parsed.mapProgress === "object" ? parsed.mapProgress : {}
    };
  } catch (error) {
    console.warn("Save gagal dibaca:", error);
    return structuredClone(DEFAULT_STATE);
  }
}

function saveState() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Save gagal ditulis:", error);
  }
}

function allMaps() {
  return [...BUILT_IN_MAPS, ...state.customMaps];
}

function getMapById(id) {
  return allMaps().find(map => map.id === id) || allMaps()[0] || null;
}

function ensureMapProgress(mapId) {
  if (!state.mapProgress[mapId]) state.mapProgress[mapId] = { position: 0, laps: 0 };
  const progress = state.mapProgress[mapId];
  progress.position = Number.isInteger(progress.position) ? progress.position : 0;
  progress.laps = Number.isInteger(progress.laps) ? progress.laps : 0;
  return progress;
}

function cryptoRandom() {
  if (window.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return values[0] / 4294967296;
  }
  return Math.random();
}

function randomInt(min, max) {
  return Math.floor(cryptoRandom() * (max - min + 1)) + min;
}

function wait(ms) {
  const duration = state.reducedMotion ? Math.min(ms, 40) : ms;
  return new Promise(resolve => window.setTimeout(resolve, duration));
}

function buildDice() {
  const faces = [
    ["front", 1], ["back", 6], ["right", 2],
    ["left", 5], ["top", 3], ["bottom", 4]
  ];
  const patterns = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8]
  };

  elements.diceCube.innerHTML = "";
  faces.forEach(([className, value]) => {
    const face = document.createElement("div");
    face.className = `die-face ${className}`;
    face.setAttribute("aria-label", String(value));
    for (let index = 0; index < 9; index += 1) {
      const pip = document.createElement("span");
      pip.className = `pip${patterns[value].includes(index) ? " is-on" : ""}`;
      face.append(pip);
    }
    elements.diceCube.append(face);
  });
}

function renderMapSelect() {
  elements.mapSelect.innerHTML = "";
  allMaps().forEach(map => {
    const option = document.createElement("option");
    option.value = map.id;
    option.textContent = state.customMaps.some(item => item.id === map.id) ? `${map.name} · Custom` : map.name;
    elements.mapSelect.append(option);
  });
  elements.mapSelect.value = currentMap?.id || state.currentMapId;
}

function selectMap(mapId) {
  currentMap = getMapById(mapId);
  if (!currentMap) return;
  state.currentMapId = currentMap.id;
  ensureMapProgress(currentMap.id);
  saveState();
  renderMapSelect();
  renderMap();
  updateUI();
  setEvent(`Map “${currentMap.name}” dipilih.`);
}

function applyTheme(theme = {}) {
  const root = document.documentElement;
  root.style.setProperty("--sky", theme.sky || "#dff6ff");
  root.style.setProperty("--ground", theme.ground || "#a9df83");
  root.style.setProperty("--ground-2", theme.ground2 || "#77c86a");
  root.style.setProperty("--path", theme.path || "#ffe6a8");
  root.style.setProperty("--map-accent", theme.accent || "#2e9df4");
  root.style.setProperty("--map-accent-2", theme.accent2 || "#35c7c9");
}

function pathFromTiles(tiles) {
  if (!tiles.length) return "";
  const points = tiles.map(tile => ({ x: tile.x * 10, y: tile.y * 6.2 }));
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const midX = (previous.x + current.x) / 2;
    const midY = (previous.y + current.y) / 2;
    path += ` Q ${previous.x} ${previous.y}, ${midX} ${midY}`;
  }
  const last = points.at(-1);
  path += ` T ${last.x} ${last.y}`;
  return path;
}

function renderMap() {
  if (!currentMap) return;
  applyTheme(currentMap.theme);
  elements.mapTitle.textContent = currentMap.name;
  elements.mapSubtitle.textContent = currentMap.subtitle || "Map fokus pribadi.";
  elements.mapPath.setAttribute("d", pathFromTiles(currentMap.tiles));
  elements.mapPathShadow.setAttribute("d", pathFromTiles(currentMap.tiles));
  elements.tileLayer.innerHTML = "";

  const progress = ensureMapProgress(currentMap.id);
  currentMap.tiles.forEach((tile, index) => {
    const node = document.createElement("div");
    node.className = `map-tile type-${tile.type || "plain"}`;
    if (index === progress.position) node.classList.add("is-current");
    if (index === (progress.position + 1) % currentMap.tiles.length) node.classList.add("is-next");
    node.style.left = `${tile.x}%`;
    node.style.top = `${tile.y}%`;
    node.dataset.icon = TILE_ICONS[tile.type] || "";
    node.textContent = tile.label || String(tile.id || index + 1);
    node.title = describeTile(tile);
    elements.tileLayer.append(node);
  });
  positionPlayer(false);
}

function describeTile(tile) {
  const reward = Number(tile.reward || 0);
  switch (tile.type) {
    case "xp": return `Tile XP +${reward || 20}`;
    case "coin": return `Tile koin +${reward || 25}`;
    case "checkpoint": return "Checkpoint: bonus satu token roll";
    case "chest": return `Peti: koin dan XP +${reward || 60}`;
    case "rest": return "Tile istirahat: bonus satu token roll";
    case "finish": return `Finish: hadiah besar +${reward || 150} koin`;
    case "start": return "Mulai";
    default: return "Tile biasa";
  }
}

function positionPlayer(stepAnimation = true) {
  if (!currentMap) return;
  const progress = ensureMapProgress(currentMap.id);
  const tile = currentMap.tiles[progress.position] || currentMap.tiles[0];
  if (!tile) return;
  elements.player.style.left = `${tile.x}%`;
  elements.player.style.top = `${tile.y}%`;
  if (stepAnimation) {
    elements.player.classList.remove("is-stepping");
    void elements.player.offsetWidth;
    elements.player.classList.add("is-stepping");
  }
  elements.positionBubble.textContent = `${progress.position + 1}/${currentMap.tiles.length}`;
}

function levelInfo() {
  const perLevel = 200;
  const level = Math.floor(state.xp / perLevel) + 1;
  const within = state.xp % perLevel;
  return { level, within, perLevel };
}

function nextSpecialTile() {
  if (!currentMap) return null;
  const progress = ensureMapProgress(currentMap.id);
  for (let offset = 1; offset <= currentMap.tiles.length; offset += 1) {
    const index = (progress.position + offset) % currentMap.tiles.length;
    const tile = currentMap.tiles[index];
    if (tile && !["plain", "start"].includes(tile.type)) return tile;
  }
  return null;
}

function updateUI() {
  if (!currentMap) return;
  const progress = ensureMapProgress(currentMap.id);
  const { level, within, perLevel } = levelInfo();
  const mapPercent = currentMap.tiles.length > 1
    ? Math.round(progress.position / (currentMap.tiles.length - 1) * 100)
    : 0;
  const next = nextSpecialTile();

  elements.xpTop.textContent = `${state.xp.toLocaleString("id-ID")} XP`;
  elements.coinTop.textContent = state.coins.toLocaleString("id-ID");
  elements.lapTop.textContent = String(progress.laps);
  elements.rollTokenBadge.textContent = `${state.rollTokens} token`;
  elements.rollButton.disabled = state.rollTokens < 1 || isRolling || isMoving;
  elements.rollButton.textContent = state.rollTokens > 0 ? "🎲 Roll Dadu" : "Selesaikan fokus dahulu";
  elements.soundButton.textContent = state.soundEnabled ? "🔊" : "🔇";
  elements.soundButton.setAttribute("aria-pressed", String(state.soundEnabled));
  elements.motionButton.setAttribute("aria-pressed", String(state.reducedMotion));
  document.body.classList.toggle("reduce-motion", state.reducedMotion);

  elements.targetTile.textContent = String(currentMap.tiles.length);
  elements.levelValue.textContent = String(level);
  elements.positionValue.textContent = `${progress.position + 1} / ${currentMap.tiles.length}`;
  elements.nextReward.textContent = next ? `${TILE_ICONS[next.type] || "•"} Tile ${next.id}` : "—";
  elements.mapProgressText.textContent = `${mapPercent}%`;
  elements.mapProgressBar.style.width = `${mapPercent}%`;
  elements.levelProgressText.textContent = `${within}/${perLevel}`;
  elements.levelProgressBar.style.width = `${within / perLevel * 100}%`;
  elements.taskInput.value = state.task;
  elements.durationSelect.value = String(state.durationMinutes);
}

function diceOrientation(value, extraTurns = false) {
  const orientation = {
    1: [0, 0],
    2: [0, -90],
    3: [-90, 0],
    4: [90, 0],
    5: [0, 90],
    6: [180, 0]
  }[value] || [0, 0];
  const turnsX = extraTurns ? 720 + randomInt(0, 2) * 360 : 0;
  const turnsY = extraTurns ? 720 + randomInt(0, 2) * 360 : 0;
  return `rotateX(${orientation[0] + turnsX}deg) rotateY(${orientation[1] + turnsY}deg)`;
}

async function rollDice() {
  if (isRolling || isMoving || state.rollTokens < 1 || !currentMap) return;
  isRolling = true;
  state.rollTokens -= 1;
  updateUI();
  sound("roll");
  elements.diceResult.textContent = "Dadu berputar…";

  const result = randomInt(1, 6);
  elements.diceCube.style.transform = diceOrientation(result, true);
  await wait(930);
  elements.diceCube.style.transition = "none";
  elements.diceCube.style.transform = diceOrientation(result, false);
  void elements.diceCube.offsetWidth;
  elements.diceCube.style.transition = "transform .9s cubic-bezier(.12,.7,.22,1)";
  elements.diceResult.textContent = `Hasil: ${result}`;
  sound("result", result);
  isRolling = false;
  await movePlayer(result);
}

async function movePlayer(steps) {
  if (!currentMap) return;
  isMoving = true;
  updateUI();
  const progress = ensureMapProgress(currentMap.id);

  for (let step = 0; step < steps; step += 1) {
    progress.position = (progress.position + 1) % currentMap.tiles.length;
    positionPlayer(true);
    renderTileHighlights();
    sound("step", step);
    await wait(430);
  }

  const tile = currentMap.tiles[progress.position];
  applyTileEffect(tile);
  saveState();
  isMoving = false;
  renderMap();
  updateUI();
}

function renderTileHighlights() {
  const progress = ensureMapProgress(currentMap.id);
  [...elements.tileLayer.children].forEach((node, index) => {
    node.classList.toggle("is-current", index === progress.position);
    node.classList.toggle("is-next", index === (progress.position + 1) % currentMap.tiles.length);
  });
  elements.positionBubble.textContent = `${progress.position + 1}/${currentMap.tiles.length}`;
  elements.positionValue.textContent = `${progress.position + 1} / ${currentMap.tiles.length}`;
}

function applyTileEffect(tile) {
  if (!tile) return;
  const reward = Math.max(0, Number(tile.reward || 0));
  const progress = ensureMapProgress(currentMap.id);
  let message = `Mendarat di tile ${tile.id}.`;

  switch (tile.type) {
    case "xp": {
      const amount = reward || 20;
      state.xp += amount;
      message = `⭐ Mendapat ${amount} XP.`;
      sound("xp");
      break;
    }
    case "coin": {
      const amount = reward || 25;
      state.coins += amount;
      message = `🪙 Mendapat ${amount} koin.`;
      sound("coin");
      break;
    }
    case "checkpoint":
      state.rollTokens += 1;
      message = "⚑ Checkpoint tercapai. Bonus 1 token roll.";
      sound("checkpoint");
      break;
    case "chest": {
      const amount = reward || 60;
      state.coins += amount;
      state.xp += Math.max(15, Math.round(amount / 2));
      message = `🎁 Peti terbuka: ${amount} koin dan ${Math.max(15, Math.round(amount / 2))} XP.`;
      sound("chest");
      break;
    }
    case "rest":
      state.rollTokens += 1;
      message = "☕ Tile istirahat. Anda mendapat 1 token roll tambahan.";
      sound("rest");
      break;
    case "finish": {
      const amount = reward || 150;
      progress.laps += 1;
      state.coins += amount;
      state.xp += 100;
      state.rollTokens += 1;
      message = `🏆 Map selesai! +${amount} koin, +100 XP, dan +1 token roll.`;
      sound("finish");
      break;
    }
    case "plain":
      state.xp += 5;
      message = "Langkah maju. Bonus momentum +5 XP.";
      sound("plain");
      break;
    default:
      message = tile.type === "start" ? "Kembali ke START. Perjalanan baru dimulai." : message;
  }

  setEvent(message);
  toast(message);
}

function completeFocusSession(origin = "manual") {
  if (timerRunning) stopTimer(false);
  state.task = elements.taskInput.value.trim();
  state.completedSessions += 1;
  state.rollTokens += 1;
  state.xp += 10;
  saveState();
  updateUI();
  sound("focus");
  const taskText = state.task ? ` “${state.task}”` : "";
  const message = origin === "timer"
    ? `⏱ Waktu fokus selesai${taskText}. +1 token roll dan +10 XP.`
    : `✓ Sesi fokus dicatat${taskText}. +1 token roll dan +10 XP.`;
  setEvent(message);
  toast(message);
  resetTimerDisplay();
}

function startOrPauseTimer() {
  if (timerRunning) {
    stopTimer(true);
    return;
  }
  if (timerRemaining <= 0) timerRemaining = state.durationMinutes * 60;
  timerRunning = true;
  elements.startTimerButton.textContent = "Ⅱ Jeda";
  elements.timerStatus.textContent = "Berjalan";
  sound("click");
  timerId = window.setInterval(() => {
    timerRemaining -= 1;
    renderTimer();
    if (timerRemaining <= 0) {
      stopTimer(false);
      completeFocusSession("timer");
    }
  }, 1000);
}

function stopTimer(paused) {
  if (timerId) window.clearInterval(timerId);
  timerId = null;
  timerRunning = false;
  elements.startTimerButton.textContent = paused ? "▶ Lanjut" : "▶ Mulai";
  elements.timerStatus.textContent = paused ? "Dijeda" : "Siap";
}

function resetTimerDisplay() {
  timerRemaining = state.durationMinutes * 60;
  stopTimer(false);
  renderTimer();
}

function renderTimer() {
  const minutes = Math.floor(Math.max(0, timerRemaining) / 60);
  const seconds = Math.max(0, timerRemaining) % 60;
  elements.timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  document.title = timerRunning ? `${elements.timerDisplay.textContent} · StudyQuest` : "StudyQuest Focus Board";
}

function openMapEditor(mode) {
  editorMode = mode;
  elements.editorError.textContent = "";
  let map;
  if (mode === "new") {
    map = createMapTemplate();
    elements.editorTitle.textContent = "Buat Map Baru";
  } else {
    const isCustom = state.customMaps.some(item => item.id === currentMap.id);
    map = structuredClone(currentMap);
    if (!isCustom) {
      map.id = `custom-${slugify(map.name)}-${Date.now().toString().slice(-5)}`;
      map.name = `${map.name} Custom`;
    }
    elements.editorTitle.textContent = isCustom ? "Edit Map Custom" : "Clone Map Default";
  }
  elements.mapJsonEditor.value = JSON.stringify(map, null, 2);
  elements.mapEditorOverlay.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeMapEditor() {
  elements.mapEditorOverlay.hidden = true;
  document.body.style.overflow = "";
}

function createMapTemplate() {
  return {
    id: `custom-map-${Date.now().toString().slice(-6)}`,
    name: "Map Fokus Baru",
    subtitle: "Ubah jalur ini sesuai rutinitas Anda.",
    theme: {
      sky: "#e6f7ff",
      ground: "#b6e58b",
      ground2: "#79ca73",
      path: "#ffe5aa",
      accent: "#2e9df4",
      accent2: "#35c7c9"
    },
    tiles: [
      { id: 1, x: 10, y: 65, type: "start", label: "START" },
      { id: 2, x: 18, y: 58, type: "plain", label: "2" },
      { id: 3, x: 27, y: 50, type: "xp", label: "3", reward: 25 },
      { id: 4, x: 37, y: 42, type: "coin", label: "4", reward: 30 },
      { id: 5, x: 48, y: 36, type: "checkpoint", label: "5" },
      { id: 6, x: 59, y: 39, type: "plain", label: "6" },
      { id: 7, x: 70, y: 47, type: "chest", label: "7", reward: 75 },
      { id: 8, x: 80, y: 58, type: "rest", label: "8" },
      { id: 9, x: 72, y: 70, type: "xp", label: "9", reward: 50 },
      { id: 10, x: 60, y: 77, type: "coin", label: "10", reward: 55 },
      { id: 11, x: 46, y: 78, type: "plain", label: "11" },
      { id: 12, x: 32, y: 73, type: "finish", label: "FINISH", reward: 150 }
    ]
  };
}

function saveEditedMap() {
  try {
    const parsed = JSON.parse(elements.mapJsonEditor.value);
    const map = validateMap(parsed);
    const builtInConflict = BUILT_IN_MAPS.some(item => item.id === map.id);
    if (builtInConflict) throw new Error("ID map tidak boleh sama dengan map default. Gunakan ID yang diawali custom-.");

    const index = state.customMaps.findIndex(item => item.id === map.id);
    if (index >= 0) state.customMaps[index] = map;
    else state.customMaps.push(map);

    state.currentMapId = map.id;
    ensureMapProgress(map.id);
    saveState();
    closeMapEditor();
    currentMap = map;
    renderMapSelect();
    renderMap();
    updateUI();
    toast(`Map “${map.name}” disimpan.`);
  } catch (error) {
    elements.editorError.textContent = error.message || "JSON map tidak valid.";
  }
}

function validateMap(map) {
  if (!map || typeof map !== "object") throw new Error("Map harus berupa object JSON.");
  if (typeof map.id !== "string" || !map.id.trim()) throw new Error("Map membutuhkan id.");
  if (typeof map.name !== "string" || !map.name.trim()) throw new Error("Map membutuhkan name.");
  if (!Array.isArray(map.tiles) || map.tiles.length < 6) throw new Error("Map membutuhkan minimal 6 tile.");

  const normalizedTiles = map.tiles.map((tile, index) => {
    if (!tile || typeof tile !== "object") throw new Error(`Tile ${index + 1} tidak valid.`);
    const x = Number(tile.x);
    const y = Number(tile.y);
    const type = tile.type || "plain";
    if (!Number.isFinite(x) || x < 3 || x > 97) throw new Error(`x pada tile ${index + 1} harus antara 3–97.`);
    if (!Number.isFinite(y) || y < 10 || y > 90) throw new Error(`y pada tile ${index + 1} harus antara 10–90.`);
    if (!VALID_TILE_TYPES.includes(type)) throw new Error(`Tipe “${type}” pada tile ${index + 1} tidak dikenal.`);
    return {
      id: Number.isFinite(Number(tile.id)) ? Number(tile.id) : index + 1,
      x, y, type,
      label: String(tile.label ?? index + 1),
      ...(tile.reward !== undefined ? { reward: Math.max(0, Number(tile.reward) || 0) } : {})
    };
  });

  return {
    id: map.id.trim(),
    name: map.name.trim(),
    subtitle: String(map.subtitle || "Map fokus pribadi."),
    theme: {
      sky: String(map.theme?.sky || "#dff6ff"),
      ground: String(map.theme?.ground || "#a9df83"),
      ground2: String(map.theme?.ground2 || "#77c86a"),
      path: String(map.theme?.path || "#ffe6a8"),
      accent: String(map.theme?.accent || "#2e9df4"),
      accent2: String(map.theme?.accent2 || "#35c7c9")
    },
    tiles: normalizedTiles
  };
}

function formatEditorJson() {
  try {
    elements.mapJsonEditor.value = JSON.stringify(JSON.parse(elements.mapJsonEditor.value), null, 2);
    elements.editorError.textContent = "";
  } catch (error) {
    elements.editorError.textContent = "JSON belum valid sehingga tidak bisa dirapikan.";
  }
}

function exportCurrentMap() {
  if (!currentMap) return;
  const blob = new Blob([JSON.stringify(currentMap, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slugify(currentMap.name)}.json`;
  link.click();
  URL.revokeObjectURL(url);
  toast("Map diekspor sebagai JSON.");
}

async function importMap(file) {
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    const map = validateMap(parsed);
    if (BUILT_IN_MAPS.some(item => item.id === map.id)) map.id = `custom-${map.id}-${Date.now().toString().slice(-5)}`;
    const index = state.customMaps.findIndex(item => item.id === map.id);
    if (index >= 0) state.customMaps[index] = map;
    else state.customMaps.push(map);
    saveState();
    selectMap(map.id);
    toast(`Map “${map.name}” berhasil diimpor.`);
  } catch (error) {
    toast(error.message || "File map tidak valid.");
  } finally {
    elements.importMapInput.value = "";
  }
}

function slugify(value) {
  return String(value).toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "map";
}

function setEvent(message) {
  elements.eventText.textContent = message;
}

function toast(message) {
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = message;
  elements.toastContainer.append(node);
  window.setTimeout(() => node.remove(), 3600);
}

function ensureAudio() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioContext = new AudioContextClass();
  }
  if (audioContext.state === "suspended") audioContext.resume();
  return audioContext;
}

function tone(frequency, delay, duration, volume = .035, wave = "sine") {
  const context = ensureAudio();
  if (!context) return;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = wave;
  oscillator.frequency.setValueAtTime(frequency, context.currentTime + delay);
  gain.gain.setValueAtTime(.0001, context.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(volume, context.currentTime + delay + .012);
  gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + delay + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(context.currentTime + delay);
  oscillator.stop(context.currentTime + delay + duration + .03);
}

function sound(kind, value = 0) {
  if (!state.soundEnabled) return;
  const patterns = {
    click: [[480, 0, .07, .025]],
    roll: [[140, 0, .08, .025, "square"], [180, .1, .08, .025, "square"], [220, .2, .08, .025, "square"], [280, .32, .1, .03, "square"]],
    step: [[310 + value * 12, 0, .08, .025, "triangle"]],
    result: [[440, 0, .1, .03], [550 + value * 25, .08, .16, .035]],
    coin: [[660, 0, .12, .035], [990, .08, .18, .03]],
    xp: [[440, 0, .12, .03], [660, .08, .18, .03], [880, .17, .2, .025]],
    checkpoint: [[392, 0, .14, .03], [523, .09, .18, .03], [784, .18, .25, .03]],
    chest: [[330, 0, .15, .035], [494, .08, .2, .035], [659, .17, .25, .035], [988, .28, .3, .025]],
    rest: [[392, 0, .18, .025], [523, .12, .24, .02]],
    finish: [[262, 0, .2, .04], [392, .08, .24, .04], [523, .16, .3, .04], [784, .28, .4, .04], [1047, .42, .5, .03]],
    focus: [[523, 0, .12, .03], [659, .08, .16, .03], [784, .16, .22, .03]],
    plain: [[350, 0, .09, .02]]
  };
  (patterns[kind] || patterns.click).forEach(args => tone(...args));
}

function bindEvents() {
  elements.mapSelect.addEventListener("change", event => selectMap(event.target.value));
  elements.newMapButton.addEventListener("click", () => openMapEditor("new"));
  elements.editMapButton.addEventListener("click", () => openMapEditor("edit"));
  elements.exportMapButton.addEventListener("click", exportCurrentMap);
  elements.importMapInput.addEventListener("change", event => importMap(event.target.files[0]));
  elements.rollButton.addEventListener("click", rollDice);
  elements.taskInput.addEventListener("input", event => {
    state.task = event.target.value;
    saveState();
  });
  elements.durationSelect.addEventListener("change", event => {
    state.durationMinutes = Number(event.target.value) || 10;
    saveState();
    resetTimerDisplay();
  });
  elements.startTimerButton.addEventListener("click", startOrPauseTimer);
  elements.completeFocusButton.addEventListener("click", () => completeFocusSession("manual"));
  elements.soundButton.addEventListener("click", () => {
    state.soundEnabled = !state.soundEnabled;
    saveState();
    updateUI();
    if (state.soundEnabled) sound("click");
  });
  elements.motionButton.addEventListener("click", () => {
    state.reducedMotion = !state.reducedMotion;
    saveState();
    updateUI();
    toast(state.reducedMotion ? "Animasi dikurangi." : "Animasi penuh diaktifkan.");
  });
  elements.closeEditorButton.addEventListener("click", closeMapEditor);
  elements.mapEditorOverlay.addEventListener("click", event => {
    if (event.target === elements.mapEditorOverlay) closeMapEditor();
  });
  elements.formatJsonButton.addEventListener("click", formatEditorJson);
  elements.saveMapButton.addEventListener("click", saveEditedMap);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !elements.mapEditorOverlay.hidden) closeMapEditor();
  });
}

function init() {
  buildDice();
  currentMap = getMapById(state.currentMapId);
  if (!currentMap && BUILT_IN_MAPS.length) currentMap = BUILT_IN_MAPS[0];
  if (!currentMap) {
    setEvent("Tidak ada map. Tambahkan map melalui maps.js.");
    return;
  }
  state.currentMapId = currentMap.id;
  ensureMapProgress(currentMap.id);
  timerRemaining = state.durationMinutes * 60;
  bindEvents();
  renderMapSelect();
  renderMap();
  renderTimer();
  updateUI();
  saveState();
}

init();
