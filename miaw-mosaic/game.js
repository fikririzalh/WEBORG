(() => {
  "use strict";

  const COLORS = [
    { id: "rose", name: "Rosé", hex: "#d78985", ink: "#482c2c" },
    { id: "sage", name: "Sage", hex: "#8ea58e", ink: "#24362a" },
    { id: "honey", name: "Madu", hex: "#e9b869", ink: "#4c371b" },
    { id: "sky", name: "Langit", hex: "#8eb7c1", ink: "#253b42" },
    { id: "plum", name: "Prem", hex: "#9b82a6", ink: "#35283b" },
    { id: "cream", name: "Krim", hex: "#eadbc4", ink: "#493a2d" }
  ];
  const MOTIFS = [
    { id: "cushion", name: "Bantal", icon: "🧸" },
    { id: "fish", name: "Ikan", icon: "🐟" },
    { id: "yarn", name: "Benang", icon: "🧶" },
    { id: "plant", name: "Tanaman", icon: "🌿" },
    { id: "lantern", name: "Lampu", icon: "🏮" },
    { id: "pastry", name: "Pastry", icon: "🥐" }
  ];
  const CATS = [
    { name: "Mochi", icon: "🐱", kind: "motif", target: "cushion", shape: "group", size: 3, points: 8, description: "Satukan 3 Bantal yang bersambung." },
    { name: "Nori", icon: "😺", kind: "motif", target: "fish", shape: "line", size: 3, points: 9, description: "Susun 3 Ikan dalam satu garis." },
    { name: "Luna", icon: "😻", kind: "motif", target: "yarn", shape: "triangle", size: 3, points: 10, description: "Bentuk segitiga kecil dari 3 Benang." },
    { name: "Taro", icon: "🐈", kind: "motif", target: "plant", shape: "group", size: 3, points: 8, description: "Satukan 3 Tanaman yang bersambung." },
    { name: "Poppy", icon: "😸", kind: "color", target: "sage", shape: "group", size: 4, points: 11, description: "Buat area 4 patch Sage." },
    { name: "Sora", icon: "😽", kind: "color", target: "rose", shape: "group", size: 4, points: 11, description: "Buat area 4 patch Rosé." }
  ];
  const DIRECTIONS = [[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];
  const LINE_DIRECTIONS = [[1,0],[1,-1],[0,-1]];
  const MAX_TURNS = 22;
  const cornerKeys = new Set(["3,0","3,-3","0,-3","-3,0","-3,3","0,3"]);
  const coords = [];
  const keyOf = (q, r) => `${q},${r}`;
  for (let q = -3; q <= 3; q += 1) {
    for (let r = -3; r <= 3; r += 1) {
      const s = -q - r;
      const key = keyOf(q, r);
      if (Math.max(Math.abs(q), Math.abs(r), Math.abs(s)) <= 3 && !cornerKeys.has(key)) coords.push({ q, r, key });
    }
  }
  const coordSet = new Set(coords.map((coord) => coord.key));
  const LANDMARKS = {
    "0,0": { icon: "☕", name: "Meja Utama", note: "5 warna berbeda", points: 12 },
    "-2,1": { icon: "🪟", name: "Jendela", note: "4 motif berbeda", points: 9 },
    "2,-1": { icon: "🛋️", name: "Sudut Santai", note: "4 warna hangat", points: 8 }
  };
  const landmarkKeys = new Set(Object.keys(LANDMARKS));
  let game;
  let toastTimer;

  const $ = (id) => document.getElementById(id);
  const shuffle = (items) => {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };
  const neighbors = (key) => {
    const [q, r] = key.split(",").map(Number);
    return DIRECTIONS.map(([dq, dr]) => keyOf(q + dq, r + dr)).filter((next) => coordSet.has(next));
  };
  const matches = (tile, cat) => tile && (cat.kind === "color" ? tile.color.id === cat.target : tile.motif.id === cat.target);

  function newGame() {
    const tiles = shuffle(COLORS.flatMap((color) => MOTIFS.map((motif) => ({ id: `${color.id}-${motif.id}`, color, motif }))));
    game = {
      board: {}, market: tiles.slice(0, 3), deck: tiles.slice(3), guests: shuffle(CATS).slice(0, 3),
      selected: null, turn: 1, finished: false, shuffleUsed: false, undoUsed: false, lastMove: null
    };
    if ($("end-dialog").open) $("end-dialog").close();
    render();
  }

  function hasGroup(cat) {
    const visited = new Set();
    for (const coord of coords) {
      if (visited.has(coord.key) || !matches(game.board[coord.key], cat)) continue;
      const queue = [coord.key];
      visited.add(coord.key);
      let size = 0;
      while (queue.length) {
        const current = queue.shift();
        size += 1;
        neighbors(current).forEach((next) => {
          if (!visited.has(next) && matches(game.board[next], cat)) {
            visited.add(next);
            queue.push(next);
          }
        });
      }
      if (size >= cat.size) return true;
    }
    return false;
  }

  function hasLine(cat) {
    return coords.some(({ q, r, key }) => matches(game.board[key], cat) && LINE_DIRECTIONS.some(([dq, dr]) => {
      for (let i = 0; i < cat.size; i += 1) if (!matches(game.board[keyOf(q + dq * i, r + dr * i)], cat)) return false;
      return true;
    }));
  }

  function hasTriangle(cat) {
    return coords.some(({ q, r, key }) => matches(game.board[key], cat) && DIRECTIONS.some(([dq, dr], index) => {
      const [nq, nr] = DIRECTIONS[(index + 1) % DIRECTIONS.length];
      return matches(game.board[keyOf(q + dq, r + dr)], cat) && matches(game.board[keyOf(q + nq, r + nr)], cat);
    }));
  }

  function catDone(cat) {
    if (cat.shape === "line") return hasLine(cat);
    if (cat.shape === "triangle") return hasTriangle(cat);
    return hasGroup(cat);
  }

  function landmarkDone(key) {
    const nearby = neighbors(key).map((neighbor) => game.board[neighbor]).filter(Boolean);
    if (key === "0,0") return new Set(nearby.map((tile) => tile.color.id)).size >= 5;
    if (key === "-2,1") return nearby.length >= 5 && new Set(nearby.map((tile) => tile.motif.id)).size >= 4;
    const warm = new Set(["rose", "honey", "cream"]);
    return nearby.filter((tile) => warm.has(tile.color.id)).length >= 4;
  }

  function charmScore() {
    let points = 0;
    const visited = new Set();
    coords.forEach((coord) => {
      const tile = game.board[coord.key];
      if (!tile || visited.has(coord.key)) return;
      const queue = [coord.key];
      visited.add(coord.key);
      let size = 0;
      while (queue.length) {
        const current = queue.shift();
        size += 1;
        neighbors(current).forEach((next) => {
          if (!visited.has(next) && game.board[next] && game.board[next].color.id === tile.color.id) {
            visited.add(next);
            queue.push(next);
          }
        });
      }
      if (size >= 3) points += size;
    });
    return points;
  }

  function totalScore() {
    const cats = game.guests.reduce((sum, cat) => sum + (catDone(cat) ? cat.points : 0), 0);
    const landmarks = Object.keys(LANDMARKS).reduce((sum, key) => sum + (landmarkDone(key) ? LANDMARKS[key].points : 0), 0);
    return cats + landmarks + charmScore();
  }

  function rankFor(score) {
    if (score >= 65) return "Kafe Legendaris";
    if (score >= 45) return "Kafe Favorit";
    if (score >= 28) return "Kafe Hangat";
    return "Kafe Pemula";
  }

  function patchHtml(tile, withName = false) {
    return `<span class="patch" style="--patch:${tile.color.hex};--patch-ink:${tile.color.ink}"><span class="motif">${tile.motif.icon}</span>${withName ? `<span class="color-name">${tile.color.name}</span>` : ""}</span>`;
  }

  function renderBoard() {
    $("board").innerHTML = coords.map((coord) => {
      const tile = game.board[coord.key];
      const landmark = LANDMARKS[coord.key];
      const ready = game.selected !== null && !tile && !landmark && !game.finished;
      const x = coord.q * 1.58;
      const y = (coord.r + coord.q / 2) * 1.38;
      let content = `<span class="empty">·</span>`;
      if (tile) content = patchHtml(tile);
      if (landmark) content = `<span class="landmark-face"><i>${landmark.icon}</i><b>${landmark.name}</b><small>+${landmark.points}</small></span>`;
      return `<button class="hex${landmark ? " landmark" : ""}${ready ? " ready" : ""}" style="--x:${x};--y:${y}" data-key="${coord.key}" ${ready ? "" : "disabled"} aria-label="${landmark ? landmark.name : tile ? `${tile.color.name}, ${tile.motif.name}` : "Hex kosong"}">${content}</button>`;
    }).join("");
    $("board").querySelectorAll(".hex.ready").forEach((button) => button.addEventListener("click", () => placeTile(button.dataset.key)));
  }

  function renderGuests() {
    const doneCount = game.guests.filter(catDone).length;
    $("guest-count").textContent = `${doneCount}/3 senang`;
    $("guest-list").innerHTML = game.guests.map((cat) => `<article class="guest-card${catDone(cat) ? " done" : ""}"><span class="avatar">${cat.icon}</span><div><b>${cat.name}</b><p>${cat.description}</p></div><strong>${catDone(cat) ? "✓" : `+${cat.points}`}</strong></article>`).join("");
  }

  function renderMarket() {
    $("market").innerHTML = game.market.map((tile, index) => `<button class="market-choice${game.selected === index ? " selected" : ""}" data-index="${index}" ${game.finished ? "disabled" : ""}>${patchHtml(tile, true)}<small>${tile.motif.name}</small></button>`).join("");
    $("market").querySelectorAll(".market-choice").forEach((button) => button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      game.selected = game.selected === index ? null : index;
      render();
    }));
  }

  function renderLandmarks() {
    $("landmark-list").innerHTML = `<b>Bonus landmark</b>${Object.keys(LANDMARKS).map((key) => {
      const item = LANDMARKS[key];
      const done = landmarkDone(key);
      return `<p class="landmark-item${done ? " done" : ""}"><span>${item.icon} ${item.name}<small>${item.note}</small></span><strong>${done ? "✓" : `+${item.points}`}</strong></p>`;
    }).join("")}`;
  }

  function render() {
    const score = totalScore();
    const rank = rankFor(score);
    $("turn-stat").textContent = Math.min(game.turn, MAX_TURNS);
    $("score-stat").textContent = score;
    $("patch-stat").textContent = Object.keys(game.board).length;
    $("deck-count").textContent = game.deck.length;
    $("score-card-value").textContent = score;
    $("rank").textContent = rank;
    $("score-progress").style.width = `${Math.min(100, score / 65 * 100)}%`;
    $("selection-status").textContent = game.selected === null ? "Pilih patch dari rak" : `${game.market[game.selected].motif.icon} Pilih hex kosong`;
    $("selection-status").classList.toggle("active", game.selected !== null);
    $("shuffle-button").disabled = game.shuffleUsed || game.finished;
    $("undo-button").disabled = !game.lastMove || game.undoUsed || game.finished;
    $("shuffle-button").querySelector("small").textContent = game.shuffleUsed ? "Sudah dipakai" : "1× per game";
    $("undo-button").querySelector("small").textContent = game.undoUsed ? "Sudah dipakai" : "1× per game";
    renderGuests();
    renderMarket();
    renderBoard();
    renderLandmarks();
    if (game.finished && !$("end-dialog").open) {
      $("final-score").textContent = score;
      $("end-rank").textContent = `${rank}. Para kucing menikmati setiap sudut nyaman yang kamu buat.`;
      $("end-dialog").showModal();
    }
  }

  function placeTile(key) {
    if (game.selected === null || game.board[key] || landmarkKeys.has(key) || game.finished) return;
    const index = game.selected;
    const tile = game.market[index];
    game.lastMove = { key, market: [...game.market], deck: [...game.deck], turn: game.turn };
    game.board[key] = tile;
    if (game.deck.length) game.market[index] = game.deck.shift(); else game.market.splice(index, 1);
    game.selected = null;
    game.turn += 1;
    game.finished = game.turn > MAX_TURNS;
    render();
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    $("toast").textContent = message;
    $("toast").classList.add("show");
    toastTimer = setTimeout(() => $("toast").classList.remove("show"), 1900);
  }

  $("new-button").addEventListener("click", () => { newGame(); showToast("Meja baru sudah disiapkan."); });
  $("play-again").addEventListener("click", () => { newGame(); showToast("Meja baru sudah disiapkan."); });
  $("rules-button").addEventListener("click", () => $("rules-dialog").showModal());
  document.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", () => $(button.dataset.close).close()));
  $("shuffle-button").addEventListener("click", () => {
    if (game.shuffleUsed || game.finished) return;
    const mixed = shuffle([...game.market, ...game.deck]);
    game.market = mixed.slice(0, 3);
    game.deck = mixed.slice(3);
    game.selected = null;
    game.shuffleUsed = true;
    render();
    showToast("Pilihan patch disegarkan.");
  });
  $("undo-button").addEventListener("click", () => {
    if (!game.lastMove || game.undoUsed || game.finished) return;
    delete game.board[game.lastMove.key];
    game.market = game.lastMove.market;
    game.deck = game.lastMove.deck;
    game.turn = game.lastMove.turn;
    game.selected = null;
    game.lastMove = null;
    game.undoUsed = true;
    render();
    showToast("Langkah terakhir dibatalkan.");
  });

  newGame();
})();
