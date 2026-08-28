(() => {
  "use strict";

  const BOARD_WIDTH = 980;
  const BOARD_HEIGHT = 650;
  const STEP_MS = 330;
  const AUTO_DELAY_MS = 1700;

  const tileLayer = document.getElementById("tileLayer");
  const board = document.getElementById("board");
  const boardViewport = document.getElementById("boardViewport");
  const boardScaler = document.getElementById("boardScaler");
  const catToken = document.getElementById("catToken");
  const sparkLayer = document.getElementById("sparkLayer");
  const rollBtn = document.getElementById("rollBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const autoToggle = document.getElementById("autoToggle");
  const dieOne = document.getElementById("dieOne");
  const dieTwo = document.getElementById("dieTwo");
  const diceTotal = document.getElementById("diceTotal");
  const zoomLabel = document.getElementById("zoomLabel");
  const toast = document.getElementById("toast");
  const missionText = document.getElementById("missionText");
  const missionTag = document.getElementById("missionTag");
  const missionProgress = document.getElementById("missionProgress");
  const missionHint = document.getElementById("missionHint");
  const centerTitle = document.getElementById("centerTitle");
  const centerMessage = document.getElementById("centerMessage");
  const starCount = document.getElementById("starCount");
  const energyCount = document.getElementById("energyCount");
  const focusTime = document.getElementById("focusTime");

  const tileDefinitions = [
    { type: "start", icon: "🚩", label: "Mulai" },
    { type: "focus", icon: "🎯", label: "Fokus 5 menit" },
    { type: "reward", icon: "🍩", label: "Hadiah kecil" },
    { type: "task", icon: "📝", label: "Pilih 1 tugas" },
    { type: "energy", icon: "⚡", label: "Energi +1" },
    { type: "focus", icon: "📘", label: "Baca 1 halaman" },
    { type: "mystery", icon: "❓", label: "Kartu misteri" },
    { type: "break", icon: "🌿", label: "Tarik napas" },
    { type: "reward", icon: "🌸", label: "Bintang +1" },
    { type: "focus", icon: "🧠", label: "Tutup distraksi" },
    { type: "task", icon: "🧺", label: "Rapikan 3 benda" },
    { type: "danger", icon: "📵", label: "Jauhkan ponsel" },
    { type: "energy", icon: "💧", label: "Minum air" },
    { type: "focus", icon: "⏳", label: "Sprint 10 menit" },
    { type: "reward", icon: "⭐", label: "Bintang +2" },
    { type: "break", icon: "🧘", label: "Regangkan badan" },
    { type: "task", icon: "✅", label: "Selesaikan mini-task" },
    { type: "mystery", icon: "🎁", label: "Kejutan" },
    { type: "focus", icon: "🎧", label: "Mode hening" },
    { type: "energy", icon: "🍎", label: "Isi energi" },
    { type: "reward", icon: "🐟", label: "Camilan Mochi" },
    { type: "break", icon: "☁️", label: "Istirahat 1 menit" },
    { type: "task", icon: "🧩", label: "Pecah jadi 3 langkah" },
    { type: "focus", icon: "🔵", label: "Kerjakan bagian mudah" },
    { type: "mystery", icon: "🔮", label: "Putar ulang" },
    { type: "reward", icon: "🎉", label: "Rayakan progres" },
    { type: "energy", icon: "🌞", label: "Energi +1" },
    { type: "break", icon: "🐚", label: "Jeda singkat" }
  ];

  const missions = [
    { tag: "Fokus", text: "Kerjakan satu tugas kecil selama 5 menit.", hint: "Tidak perlu sempurna. Cukup mulai.", progress: 24 },
    { tag: "Rapikan", text: "Pilih tiga benda dan kembalikan ke tempatnya.", hint: "Tiga benda. Bukan seluruh kerajaan.", progress: 38 },
    { tag: "Belajar", text: "Baca satu halaman lalu tulis satu kalimat inti.", hint: "Satu halaman lebih baik daripada tab yang dibuka 19.", progress: 18 },
    { tag: "Reset", text: "Minum air dan tarik napas perlahan empat kali.", hint: "Otak juga butuh servis kecil-kecilan.", progress: 60 },
    { tag: "Tugas", text: "Pecah pekerjaan terbesar menjadi tiga langkah pendek.", hint: "Nama langkahnya boleh sangat sederhana.", progress: 30 }
  ];

  const messagesByType = {
    start: ["Putaran baru dimulai.", "Mochi siap keliling lagi."],
    focus: ["Fokus kecil diaktifkan.", "Satu langkah tanpa distraksi.", "Kerjakan bagian termudah dulu."],
    break: ["Ambil jeda singkat.", "Bahu turun, napas pelan."],
    reward: ["Bintang terkumpul!", "Progres layak dirayakan."],
    task: ["Pilih satu tugas yang jelas.", "Ubah pekerjaan besar jadi langkah mini."],
    mystery: ["Kejutan kecil untuk otak yang mudah bosan.", "Petak misteri dipilih."],
    energy: ["Energi bertambah.", "Isi ulang tenaga sebelum lanjut."],
    danger: ["Distraksi diparkir sebentar.", "Mode bebas notifikasi."]
  };

  const state = {
    currentIndex: 0,
    zoom: 1,
    fitZoom: 1,
    rolling: false,
    auto: true,
    paused: false,
    muted: false,
    autoTimer: null,
    toastTimer: null,
    stars: 0,
    energy: 3,
    missionIndex: 0,
    focusSeconds: 25 * 60,
    audioContext: null
  };

  function buildPathPositions() {
    const positions = [];
    const left = 125;
    const right = BOARD_WIDTH - 125;
    const top = 88;
    const bottom = BOARD_HEIGHT - 88;

    const pushLine = (count, x1, y1, x2, y2, includeStart = true, includeEnd = false) => {
      for (let i = 0; i < count; i += 1) {
        const denominator = includeEnd ? count - 1 : count;
        const t = denominator === 0 ? 0 : i / denominator;
        if (!includeStart && i === 0) continue;
        positions.push({
          x: x1 + (x2 - x1) * t,
          y: y1 + (y2 - y1) * t
        });
      }
    };

    pushLine(8, left, bottom, right, bottom);
    pushLine(6, right, bottom, right, top);
    pushLine(8, right, top, left, top);
    pushLine(6, left, top, left, bottom);

    return positions.slice(0, tileDefinitions.length);
  }

  const positions = buildPathPositions();
  const tileElements = [];

  function createTiles() {
    tileDefinitions.forEach((tile, index) => {
      const el = document.createElement("div");
      el.className = `tile ${tile.type}`;
      el.dataset.index = String(index);
      el.style.left = `${positions[index].x}px`;
      el.style.top = `${positions[index].y}px`;
      el.innerHTML = `<span class="tile-icon">${tile.icon}</span><span class="tile-label">${tile.label}</span>`;
      tileLayer.appendChild(el);
      tileElements.push(el);
    });
  }

  const pipPositions = {
    1: [5],
    2: [1, 9],
    3: [1, 5, 9],
    4: [1, 3, 7, 9],
    5: [1, 3, 5, 7, 9],
    6: [1, 3, 4, 6, 7, 9]
  };

  function renderDie(el, value) {
    el.innerHTML = "";
    pipPositions[value].forEach((position) => {
      const pip = document.createElement("span");
      pip.className = "pip";
      pip.style.gridArea = `${Math.ceil(position / 3)} / ${((position - 1) % 3) + 1}`;
      el.appendChild(pip);
    });
    el.setAttribute("aria-label", `Dadu menunjukkan ${value}`);
  }

  function moveCatTo(index, instant = false) {
    const position = positions[index];
    if (instant) catToken.style.transition = "none";
    catToken.style.left = `${position.x}px`;
    catToken.style.top = `${position.y}px`;
    if (instant) {
      requestAnimationFrame(() => { catToken.style.transition = ""; });
    }
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function getAudioContext() {
    if (!state.audioContext) {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) return null;
      state.audioContext = new Context();
    }
    if (state.audioContext.state === "suspended") state.audioContext.resume();
    return state.audioContext;
  }

  function tone(frequency, duration = 0.08, type = "sine", volume = 0.04, delay = 0) {
    if (state.muted) return;
    const context = getAudioContext();
    if (!context) return;

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = context.currentTime + delay;
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  function playDiceSound() {
    [150, 210, 170, 260].forEach((f, i) => tone(f, 0.055, "square", 0.018, i * 0.055));
  }

  function playStepSound(step) {
    tone(420 + (step % 3) * 35, 0.05, "sine", 0.022);
  }

  function playRewardSound() {
    [523, 659, 784].forEach((f, i) => tone(f, 0.22, "triangle", 0.045, i * 0.09));
  }

  function playBreakSound() {
    tone(350, 0.18, "sine", 0.035);
    tone(285, 0.22, "sine", 0.025, 0.11);
  }

  function burst(x, y, symbols = ["✨", "⭐", "💫"]) {
    const amount = 9;
    for (let i = 0; i < amount; i += 1) {
      const spark = document.createElement("span");
      spark.className = "spark";
      spark.textContent = symbols[i % symbols.length];
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      spark.style.setProperty("--dx", `${Math.cos((Math.PI * 2 * i) / amount) * (55 + Math.random() * 45)}px`);
      spark.style.setProperty("--dy", `${Math.sin((Math.PI * 2 * i) / amount) * (45 + Math.random() * 50)}px`);
      sparkLayer.appendChild(spark);
      setTimeout(() => spark.remove(), 950);
    }
  }

  function applyTileEffect(index) {
    tileElements.forEach((tile) => tile.classList.remove("active-tile"));
    const tileEl = tileElements[index];
    const tile = tileDefinitions[index];
    tileEl.classList.add("active-tile");

    const message = randomItem(messagesByType[tile.type] || [tile.label]);
    centerTitle.textContent = tile.label;
    centerMessage.textContent = message;
    showToast(`${tile.icon} ${message}`);

    if (tile.type === "reward") {
      const gain = tile.label.includes("+2") ? 2 : 1;
      state.stars += gain;
      starCount.textContent = String(state.stars);
      burst(positions[index].x, positions[index].y - 25);
      playRewardSound();
    } else if (tile.type === "energy") {
      state.energy += 1;
      energyCount.textContent = String(state.energy);
      burst(positions[index].x, positions[index].y - 20, ["⚡", "✨", "💛"]);
      playRewardSound();
    } else if (tile.type === "break") {
      playBreakSound();
    } else if (tile.type === "danger") {
      state.energy = Math.max(0, state.energy - 1);
      energyCount.textContent = String(state.energy);
      tone(180, .18, "sawtooth", .025);
    } else {
      tone(540, .12, "triangle", .028);
    }
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function moveSteps(total) {
    catToken.classList.add("walking");
    for (let step = 0; step < total; step += 1) {
      state.currentIndex = (state.currentIndex + 1) % positions.length;
      moveCatTo(state.currentIndex);
      playStepSound(step);
      await wait(STEP_MS);
    }
    catToken.classList.remove("walking");
    applyTileEffect(state.currentIndex);
  }

  function randomDie() {
    return Math.floor(Math.random() * 6) + 1;
  }

  async function rollDice({ fromAuto = false } = {}) {
    if (state.rolling || (state.paused && fromAuto)) return;
    clearTimeout(state.autoTimer);
    state.rolling = true;
    rollBtn.disabled = true;
    dieOne.classList.add("rolling");
    dieTwo.classList.add("rolling");
    playDiceSound();

    let d1 = 1;
    let d2 = 1;
    for (let i = 0; i < 6; i += 1) {
      d1 = randomDie();
      d2 = randomDie();
      renderDie(dieOne, d1);
      renderDie(dieTwo, d2);
      await wait(70);
    }

    dieOne.classList.remove("rolling");
    dieTwo.classList.remove("rolling");
    const total = d1 + d2;
    diceTotal.textContent = String(total);
    await wait(140);
    await moveSteps(total);

    state.rolling = false;
    rollBtn.disabled = false;
    scheduleAutoRoll();
  }

  function scheduleAutoRoll() {
    clearTimeout(state.autoTimer);
    if (!state.auto || state.paused || state.rolling) return;
    state.autoTimer = setTimeout(() => rollDice({ fromAuto: true }), AUTO_DELAY_MS);
  }

  function updateAutoUI() {
    autoToggle.classList.toggle("active", state.auto);
    autoToggle.setAttribute("aria-pressed", String(state.auto));
    autoToggle.textContent = state.auto ? "Loop aktif" : "Loop mati";
    pauseBtn.textContent = state.paused ? "▶ Lanjutkan loop" : "⏸ Jeda loop";
  }

  function updateZoom() {
    boardScaler.style.transform = `scale(${state.zoom})`;
    zoomLabel.textContent = `${Math.round(state.zoom * 100)}%`;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function zoomBy(delta) {
    state.zoom = clamp(Number((state.zoom + delta).toFixed(2)), 0.42, 1.55);
    updateZoom();
  }

  function fitBoard() {
    const rect = boardViewport.getBoundingClientRect();
    const padding = 24;
    const availableWidth = Math.max(280, rect.width - padding * 2);
    const availableHeight = Math.max(360, rect.height - padding * 2);
    state.fitZoom = clamp(Math.min(availableWidth / BOARD_WIDTH, availableHeight / BOARD_HEIGHT), 0.42, 1.15);
    state.zoom = state.fitZoom;
    updateZoom();
  }

  function setMission(index) {
    const mission = missions[index];
    missionTag.textContent = mission.tag;
    missionText.textContent = mission.text;
    missionHint.textContent = mission.hint;
    missionProgress.style.width = `${mission.progress}%`;
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("cat-focus-theme", theme);
    document.getElementById("themeToggle").textContent = theme === "dark" ? "☀" : "☾";
  }

  function initializeTheme() {
    const saved = localStorage.getItem("cat-focus-theme");
    const systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(saved || (systemDark ? "dark" : "light"));
  }

  function updateMuteUI() {
    const btn = document.getElementById("muteToggle");
    btn.textContent = state.muted ? "🔇" : "🔊";
    btn.setAttribute("aria-label", state.muted ? "Nyalakan suara" : "Matikan suara");
  }

  function updateTimer() {
    const minutes = Math.floor(state.focusSeconds / 60);
    const seconds = state.focusSeconds % 60;
    focusTime.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    if (!state.paused) {
      state.focusSeconds -= 1;
      if (state.focusSeconds < 0) {
        state.focusSeconds = 25 * 60;
        state.stars += 1;
        starCount.textContent = String(state.stars);
        showToast("⭐ Satu siklus fokus selesai.");
        playRewardSound();
      }
    }
  }

  function bindEvents() {
    rollBtn.addEventListener("click", () => rollDice());
    document.getElementById("zoomInBtn").addEventListener("click", () => zoomBy(.1));
    document.getElementById("zoomOutBtn").addEventListener("click", () => zoomBy(-.1));
    document.getElementById("fitBtn").addEventListener("click", fitBoard);

    autoToggle.addEventListener("click", () => {
      state.auto = !state.auto;
      updateAutoUI();
      showToast(state.auto ? "Loop otomatis aktif." : "Loop otomatis dimatikan.");
      scheduleAutoRoll();
    });

    pauseBtn.addEventListener("click", () => {
      state.paused = !state.paused;
      updateAutoUI();
      showToast(state.paused ? "Loop dijeda." : "Loop dilanjutkan.");
      scheduleAutoRoll();
    });

    document.getElementById("themeToggle").addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      setTheme(next);
    });

    document.getElementById("muteToggle").addEventListener("click", () => {
      state.muted = !state.muted;
      updateMuteUI();
      if (!state.muted) tone(660, .12, "triangle", .035);
    });

    document.getElementById("fullscreenToggle").addEventListener("click", async () => {
      try {
        if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
        else await document.exitFullscreen();
      } catch {
        showToast("Fullscreen tidak didukung oleh browser ini.");
      }
    });

    document.getElementById("newMissionBtn").addEventListener("click", () => {
      state.missionIndex = (state.missionIndex + 1) % missions.length;
      setMission(state.missionIndex);
      showToast("Misi baru dipilih.");
      tone(580, .10, "triangle", .03);
    });

    window.addEventListener("resize", () => {
      window.clearTimeout(window.__fitTimer);
      window.__fitTimer = window.setTimeout(fitBoard, 130);
    });

    document.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();
      if (event.code === "Space") {
        event.preventDefault();
        rollDice();
      } else if (key === "+" || key === "=") {
        zoomBy(.1);
      } else if (key === "-") {
        zoomBy(-.1);
      } else if (key === "m") {
        state.muted = !state.muted;
        updateMuteUI();
      }
    });
  }

  function init() {
    createTiles();
    renderDie(dieOne, 1);
    renderDie(dieTwo, 1);
    moveCatTo(0, true);
    setMission(0);
    initializeTheme();
    updateMuteUI();
    updateAutoUI();
    bindEvents();
    requestAnimationFrame(() => {
      fitBoard();
      scheduleAutoRoll();
    });
    updateTimer();
    setInterval(updateTimer, 1000);
  }

  init();
})();
