(() => {
  "use strict";

  /* ============ THEME ============ */
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = safeGet("srm_theme") || "dark";
  body.setAttribute("data-theme", savedTheme);
  themeToggle.addEventListener("click", () => {
    const cur = body.getAttribute("data-theme");
    const next = cur === "dark" ? "light" : "dark";
    body.setAttribute("data-theme", next);
    safeSet("srm_theme", next);
  });
  function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ============ SCREEN NAV ============ */
  const screens = {};
  document.querySelectorAll(".screen").forEach(s => screens[s.id] = s);
  function showScreen(id) {
    Object.values(screens).forEach(s => s.classList.remove("active"));
    screens[id].classList.add("active");
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  /* ============ GAME STATE ============ */
  const RABBIT = "🐰";
  const TRAP_EMOJI = "🕳️";
  const CARROT = "🥕";

  let state = {
    mode: null,        // 'coop' | 'versus'
    size: 5,
    trapsPerPlayer: 3,
    // coop
    playerATraps: [],
    playerBTraps: [],
    life: 3,
    maxLife: 3,
    opened: [],
    marks: {},
    currentTurn: "A",
    totalSafe: 0,
    safeOpened: 0,
    // versus
    boardA: [],         // traps placed by A (to be solved by B)
    boardB: [],
    versusOpenedByB: [], // B opening A's board
    versusOpenedByA: [],
    versusHitsA: 0,      // hits taken while B solves A's board
    versusHitsB: 0,
    versusStage: null,   // 'A-set' | 'B-set' | 'B-solves-A' | 'A-solves-B' | done
  };

  let tempTraps = []; // used during setup

  /* ============ MENU BUTTONS ============ */
  document.getElementById("btnStartCoop").addEventListener("click", () => {
    state.mode = "coop";
    showScreen("screen-difficulty");
  });
  document.getElementById("btnStartVersus").addEventListener("click", () => {
    state.mode = "versus";
    showScreen("screen-difficulty");
  });
  document.getElementById("btnHowTo").addEventListener("click", () => showScreen("screen-howto"));
  document.getElementById("btnHowToBack").addEventListener("click", () => showScreen("screen-menu"));
  document.getElementById("btnDifficultyBack").addEventListener("click", () => showScreen("screen-menu"));
  document.getElementById("btnQuitGame").addEventListener("click", () => {
    if (confirm("Keluar dari permainan yang sedang berjalan?")) showScreen("screen-menu");
  });
  document.getElementById("btnBackMenu").addEventListener("click", () => showScreen("screen-menu"));

  /* ============ DIFFICULTY SELECT ============ */
  document.querySelectorAll(".diff-card").forEach(card => {
    card.addEventListener("click", () => {
      state.size = parseInt(card.dataset.size, 10);
      state.trapsPerPlayer = parseInt(card.dataset.traps, 10);
      if (state.mode === "coop") startCoopSetup();
      else startVersusSetup();
    });
  });

  /* ================================================================
     CO-OP MODE
  ================================================================ */
  function startCoopSetup() {
    state.playerATraps = [];
    state.playerBTraps = [];
    state.opened = [];
    state.marks = {};
    state.life = state.trapsPerPlayer === 4 ? 4 : 3;
    state.maxLife = state.life;
    state.currentTurn = "A";
    const total = state.size * state.size;
    state.totalSafe = total - state.trapsPerPlayer * 2;
    state.safeOpened = 0;

    beginTrapSetup("A", () => {
      beginTrapSetup("B", () => {
        startCoopGame();
      });
    });
  }

  function beginTrapSetup(player, onDone) {
    tempTraps = [];
    showScreen("screen-setup");
    document.getElementById("passBanner").classList.remove("hidden");
    document.getElementById("setupBody").classList.add("hidden");
    document.getElementById("setupPlayerLabel").textContent = `Giliran Player ${player}`;
    document.getElementById("setupPlayerLabel2").textContent = `Player ${player}`;
    document.getElementById("trapsNeeded").textContent = state.trapsPerPlayer;

    const readyBtn = document.getElementById("btnPassReady");
    const newReadyBtn = readyBtn.cloneNode(true);
    readyBtn.parentNode.replaceChild(newReadyBtn, readyBtn);
    newReadyBtn.addEventListener("click", () => {
      document.getElementById("passBanner").classList.add("hidden");
      document.getElementById("setupBody").classList.remove("hidden");
      renderSetupBoard(player);
    });

    const confirmBtn = document.getElementById("btnConfirmTraps");
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    newConfirmBtn.disabled = true;
    newConfirmBtn.addEventListener("click", () => {
      if (player === "A") state.playerATraps = tempTraps.slice();
      else state.playerBTraps = tempTraps.slice();
      onDone();
    });
  }

  function renderSetupBoard(player) {
    const boardEl = document.getElementById("setupBoard");
    boardEl.style.gridTemplateColumns = `repeat(${state.size}, 1fr)`;
    boardEl.innerHTML = "";
    const opponentTraps = player === "A" ? state.playerBTraps : []; // B hasn't placed yet when A places; safe

    for (let i = 0; i < state.size * state.size; i++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.dataset.idx = i;
      tile.addEventListener("click", () => {
        const idx = i;
        if (tempTraps.includes(idx)) {
          tempTraps = tempTraps.filter(t => t !== idx);
          tile.classList.remove("tile-mine-own");
          tile.textContent = "";
        } else {
          if (tempTraps.length >= state.trapsPerPlayer) return;
          if (player === "B" && state.playerATraps.includes(idx)) return; // avoid stacking, optional
          tempTraps.push(idx);
          tile.classList.add("tile-mine-own");
          tile.textContent = TRAP_EMOJI;
        }
        updateTrapProgress();
      });
      boardEl.appendChild(tile);
    }
    updateTrapProgress();
  }

  function updateTrapProgress() {
    const progEl = document.getElementById("trapProgress");
    let s = "";
    for (let i = 0; i < state.trapsPerPlayer; i++) {
      s += i < tempTraps.length ? "🕳️" : "⬜";
    }
    progEl.textContent = s;
    document.getElementById("btnConfirmTraps").disabled = tempTraps.length !== state.trapsPerPlayer;
  }

  function startCoopGame() {
    showScreen("screen-game");
    document.getElementById("markTools").classList.remove("hidden");
    renderCoopBoard();
    updateHud();
    logMsg(`🐰 Misi dimulai! Selamatkan ${state.totalSafe} kotak aman bersama.`, "good");

    document.querySelectorAll(".mark-btn").forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll(".mark-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeMark = btn.dataset.mark;
      };
    });
  }

  let activeMark = "none";

  function renderCoopBoard() {
    const boardEl = document.getElementById("gameBoard");
    boardEl.style.gridTemplateColumns = `repeat(${state.size}, 1fr)`;
    boardEl.innerHTML = "";
    for (let i = 0; i < state.size * state.size; i++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.dataset.idx = i;

      if (state.opened.includes(i)) {
        tile.classList.add("tile-open");
        const isTrapA = state.playerATraps.includes(i);
        const isTrapB = state.playerBTraps.includes(i);
        if (isTrapA || isTrapB) {
          tile.classList.add("tile-trap-hit");
          tile.textContent = "💥";
        } else {
          tile.textContent = CARROT;
        }
      } else {
        const mark = state.marks[i];
        if (mark === "suspect") {
          const m = document.createElement("span");
          m.className = "tile-mark";
          m.textContent = "⚠️";
          tile.appendChild(m);
        } else if (mark === "safe") {
          const m = document.createElement("span");
          m.className = "tile-mark";
          m.textContent = "✅";
          tile.appendChild(m);
        }
        tile.addEventListener("click", () => handleCoopClick(i, tile));
      }
      boardEl.appendChild(tile);
    }
  }

  function handleCoopClick(idx, tile) {
    if (activeMark !== "none") {
      state.marks[idx] = activeMark;
      renderCoopBoard();
      return;
    }
    if (state.opened.includes(idx)) return;

    state.opened.push(idx);
    const isTrapA = state.playerATraps.includes(idx);
    const isTrapB = state.playerBTraps.includes(idx);

    if (isTrapA || isTrapB) {
      state.life--;
      const opener = state.currentTurn;
      const ownerLabel = isTrapA ? "A" : "B";
      logMsg(`💥 Player ${opener} membuka jebakan milik Player ${ownerLabel}! Nyawa tim berkurang.`, "bad");
    } else {
      state.safeOpened++;
      logMsg(`🥕 Kotak aman terbuka (${state.safeOpened}/${state.totalSafe}).`, "good");
    }

    renderCoopBoard();
    updateHud();

    if (state.life <= 0) {
      endCoop(false);
      return;
    }
    if (state.safeOpened >= state.totalSafe) {
      endCoop(true);
      return;
    }

    state.currentTurn = state.currentTurn === "A" ? "B" : "A";
    updateHud();
  }

  function updateHud() {
    document.getElementById("hudTurnValue").textContent = `Player ${state.currentTurn}`;
    document.getElementById("hudLifeValue").textContent = "❤️".repeat(Math.max(state.life, 0)) + "🖤".repeat(state.maxLife - Math.max(state.life, 0));
    document.getElementById("hudProgress").textContent = `${state.safeOpened}/${state.totalSafe}`;
  }

  function logMsg(text, kind) {
    const log = document.getElementById("gameLog");
    const div = document.createElement("div");
    if (kind) div.className = `log-${kind}`;
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  function endCoop(won) {
    showResult(
      won,
      won ? "TEAM WIN" : "TEAM FAILED",
      won ? "Semua kelinci berhasil diselamatkan! Kerja sama kalian luar biasa." : "Nyawa tim habis. Para kelinci belum berhasil diselamatkan kali ini.",
      [
        `Kotak aman dibuka: ${state.safeOpened}/${state.totalSafe}`,
        `Nyawa tersisa: ${Math.max(state.life, 0)}/${state.maxLife}`,
        `Ukuran papan: ${state.size}×${state.size}`,
      ]
    );
  }

  /* ================================================================
     VERSUS MODE
  ================================================================ */
  function startVersusSetup() {
    state.boardA = [];
    state.boardB = [];
    state.versusOpenedByB = [];
    state.versusOpenedByA = [];
    state.versusHitsA = 0;
    state.versusHitsB = 0;

    beginTrapSetupVersus("A", () => {
      showVersusPass("A", "B", () => {
        beginTrapSetupVersus("B", () => {
          showVersusPass("B", "B-solves-A", () => {
            startVersusSolve("B"); // B solves A's board
          });
        });
      });
    });
  }

  function beginTrapSetupVersus(player, onDone) {
    tempTraps = [];
    showScreen("screen-setup");
    document.getElementById("passBanner").classList.remove("hidden");
    document.getElementById("setupBody").classList.add("hidden");
    document.getElementById("setupPlayerLabel").textContent = `Giliran Player ${player}`;
    document.getElementById("setupPlayerLabel2").textContent = `Player ${player}`;
    document.getElementById("trapsNeeded").textContent = state.trapsPerPlayer;

    const readyBtn = document.getElementById("btnPassReady");
    const newReadyBtn = readyBtn.cloneNode(true);
    readyBtn.parentNode.replaceChild(newReadyBtn, readyBtn);
    newReadyBtn.addEventListener("click", () => {
      document.getElementById("passBanner").classList.add("hidden");
      document.getElementById("setupBody").classList.remove("hidden");
      renderSetupBoard(player);
    });

    const confirmBtn = document.getElementById("btnConfirmTraps");
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    newConfirmBtn.disabled = true;
    newConfirmBtn.addEventListener("click", () => {
      if (player === "A") state.boardA = tempTraps.slice();
      else state.boardB = tempTraps.slice();
      onDone();
    });
  }

  function showVersusPass(fromPlayer, toContext, onDone) {
    showScreen("screen-versus-pass");
    const title = document.getElementById("versusPassTitle");
    const text = document.getElementById("versusPassText");
    if (toContext === "B") {
      title.textContent = "Papan Player A Selesai";
      text.textContent = "Serahkan perangkat ke Player B untuk memasang jebakan.";
    } else if (toContext === "B-solves-A") {
      title.textContent = "Saatnya Menyerang!";
      text.textContent = "Serahkan perangkat ke Player B. Player B akan membuka papan milik Player A.";
    } else if (toContext === "A-solves-B") {
      title.textContent = "Giliran Player A Menyerang";
      text.textContent = "Serahkan perangkat ke Player A. Player A akan membuka papan milik Player B.";
    }
    const btn = document.getElementById("btnVersusPassReady");
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener("click", onDone);
  }

  function startVersusSolve(solver) {
    state.versusStage = solver === "B" ? "B-solves-A" : "A-solves-B";
    showScreen("screen-game");
    document.getElementById("markTools").classList.add("hidden");
    renderVersusBoard(solver);
    updateVersusHud(solver);
    logMsg(`⚔️ Player ${solver} mulai membongkar papan lawan. 3 kali kena jebakan = kalah.`, "good");
  }

  function renderVersusBoard(solver) {
    const targetTraps = solver === "B" ? state.boardA : state.boardB;
    const openedArr = solver === "B" ? state.versusOpenedByB : state.versusOpenedByA;
    const boardEl = document.getElementById("gameBoard");
    boardEl.style.gridTemplateColumns = `repeat(${state.size}, 1fr)`;
    boardEl.innerHTML = "";

    for (let i = 0; i < state.size * state.size; i++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      if (openedArr.includes(i)) {
        tile.classList.add("tile-open");
        if (targetTraps.includes(i)) {
          tile.classList.add("tile-trap-hit");
          tile.textContent = "💥";
        } else {
          tile.textContent = CARROT;
        }
      } else {
        tile.addEventListener("click", () => handleVersusClick(i, solver));
      }
      boardEl.appendChild(tile);
    }
  }

  function handleVersusClick(idx, solver) {
    const targetTraps = solver === "B" ? state.boardA : state.boardB;
    const openedArr = solver === "B" ? state.versusOpenedByB : state.versusOpenedByA;
    if (openedArr.includes(idx)) return;
    openedArr.push(idx);

    if (targetTraps.includes(idx)) {
      if (solver === "B") state.versusHitsA++; else state.versusHitsB++;
      logMsg(`💥 Player ${solver} kena jebakan!`, "bad");
    } else {
      logMsg(`🥕 Player ${solver} membuka kotak aman.`, "good");
    }

    renderVersusBoard(solver);
    updateVersusHud(solver);

    const hits = solver === "B" ? state.versusHitsA : state.versusHitsB;
    const totalSafeCells = state.size * state.size - state.trapsPerPlayer;
    const safeOpenedCount = openedArr.filter(i => !targetTraps.includes(i)).length;

    if (hits >= 3) {
      finishVersusSolve(solver, false);
      return;
    }
    if (safeOpenedCount >= totalSafeCells) {
      finishVersusSolve(solver, true);
      return;
    }
  }

  function updateVersusHud(solver) {
    const hits = solver === "B" ? state.versusHitsA : state.versusHitsB;
    document.getElementById("hudTurnValue").textContent = `Player ${solver}`;
    document.getElementById("hudLifeValue").textContent = "❤️".repeat(Math.max(3 - hits, 0)) + "🖤".repeat(Math.min(hits, 3));
    const openedArr = solver === "B" ? state.versusOpenedByB : state.versusOpenedByA;
    const targetTraps = solver === "B" ? state.boardA : state.boardB;
    const totalSafeCells = state.size * state.size - state.trapsPerPlayer;
    const safeOpenedCount = openedArr.filter(i => !targetTraps.includes(i)).length;
    document.getElementById("hudProgress").textContent = `${safeOpenedCount}/${totalSafeCells}`;
  }

  function finishVersusSolve(solver, cleared) {
    if (solver === "B") {
      logMsg(cleared ? "✅ Player B berhasil membersihkan papan Player A!" : "☠ Player B gagal — terlalu banyak jebakan.", cleared ? "good" : "bad");
      showVersusPass("B", "A-solves-B", () => startVersusSolve("A"));
    } else {
      logMsg(cleared ? "✅ Player A berhasil membersihkan papan Player B!" : "☠ Player A gagal — terlalu banyak jebakan.", cleared ? "good" : "bad");
      endVersus();
    }
  }

  function endVersus() {
    const aCleared = state.versusHitsA < 3;
    const bCleared = state.versusHitsB < 3;
    let title, text, won;

    if (aCleared && bCleared) {
      won = true; title = "SERI — KEDUANYA SELAMAT"; text = "Player A dan Player B sama-sama berhasil membersihkan papan lawan!";
    } else if (aCleared && !bCleared) {
      won = true; title = "PLAYER B MENANG"; text = "Player B membersihkan papan Player A, sementara Player A gagal.";
    } else if (!aCleared && bCleared) {
      won = true; title = "PLAYER A MENANG"; text = "Player A membersihkan papan Player B, sementara Player B gagal.";
    } else {
      won = false; title = "KEDUANYA GAGAL"; text = "Kedua pemain sama-sama kena terlalu banyak jebakan.";
    }

    showResult(won, title, text, [
      `Player A terkena jebakan: ${state.versusHitsA}/3`,
      `Player B terkena jebakan: ${state.versusHitsB}/3`,
      `Ukuran papan: ${state.size}×${state.size}`,
    ]);
  }

  /* ============ RESULT SCREEN ============ */
  let lastGameConfig = null;

  function showResult(won, title, text, statLines) {
    lastGameConfig = { mode: state.mode, size: state.size, trapsPerPlayer: state.trapsPerPlayer };
    document.getElementById("resultEmoji").textContent = won ? "🏆" : "☠";
    document.getElementById("resultTitle").textContent = title;
    document.getElementById("resultText").textContent = text;
    const statsEl = document.getElementById("resultStats");
    statsEl.innerHTML = "";
    statLines.forEach(line => {
      const d = document.createElement("div");
      d.textContent = line;
      statsEl.appendChild(d);
    });
    showScreen("screen-result");
  }

  document.getElementById("btnPlayAgain").addEventListener("click", () => {
    if (!lastGameConfig) { showScreen("screen-menu"); return; }
    state.mode = lastGameConfig.mode;
    state.size = lastGameConfig.size;
    state.trapsPerPlayer = lastGameConfig.trapsPerPlayer;
    if (state.mode === "coop") startCoopSetup();
    else startVersusSetup();
  });

})();
