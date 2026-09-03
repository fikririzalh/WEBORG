/* WASITRA CARD — mesin permainan offline */
(function () {
  "use strict";

  const sets = Array.isArray(window.WASITRA_SETS) ? window.WASITRA_SETS : [];
  const storage = {
    get(key, fallback) {
      try { return localStorage.getItem(key) ?? fallback; } catch (_) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, String(value)); } catch (_) { /* mode privat dapat menolak penyimpanan */ }
    }
  };

  const state = {
    selectedSetId: sets[0]?.id || "",
    role: "A",
    mode: "practice",
    amount: 20,
    view: "grid",
    sound: storage.get("wasitra-sound", "on") === "on",
    deck: [],
    board: [],
    round: 0,
    score: 0,
    teamA: 0,
    teamB: 0,
    attempts: 0,
    roundStartedAt: Date.now(),
    markedIds: new Set(),
    pendingNext: false
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const setupScreen = $("#setup-screen");
  const gameScreen = $("#game-screen");
  const setGrid = $("#set-grid");
  const playSurface = $("#play-surface");
  const helpDialog = $("#help-dialog");
  const confirmDialog = $("#confirm-dialog");
  const toast = $("#toast");
  let toastTimer = 0;

  function escapeHTML(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function selectedSet() {
    return sets.find((set) => set.id === state.selectedSetId) || sets[0];
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  function openDialog(dialog) {
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function applyTheme(theme) {
    const nextTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    $("#theme-toggle").setAttribute("aria-pressed", String(nextTheme === "dark"));
    $("meta[name='theme-color']").setAttribute("content", nextTheme === "dark" ? "#111714" : "#f2eee6");
    storage.set("wasitra-theme", nextTheme);
  }

  function renderSets() {
    setGrid.innerHTML = sets.map((set) => `
      <button class="set-card ${set.id === state.selectedSetId ? "is-selected" : ""}" type="button"
        data-set-id="${escapeHTML(set.id)}" data-accent="${escapeHTML(set.aksen)}"
        aria-pressed="${set.id === state.selectedSetId}">
        <span class="set-art">
          <span class="set-code">${escapeHTML(set.kode)}</span>
          <span class="set-check" aria-hidden="true">✓</span>
        </span>
        <span class="set-card-body">
          <span class="set-title">${escapeHTML(set.judul)}</span>
          <span class="set-description">${escapeHTML(set.deskripsi)}</span>
          <span class="set-meta"><span><strong>${set.cards.length}</strong> kartu</span><span>${escapeHTML(set.cards[0]?.asalBudaya || "Indonesia")}</span></span>
        </span>
      </button>
    `).join("");

    $$(".set-card", setGrid).forEach((card) => {
      card.addEventListener("click", () => {
        state.selectedSetId = card.dataset.setId;
        $$(".set-card", setGrid).forEach((item) => {
          const active = item.dataset.setId === state.selectedSetId;
          item.classList.toggle("is-selected", active);
          item.setAttribute("aria-pressed", String(active));
        });
        $("#selected-summary").textContent = selectedSet().judul;
        showToast(`${selectedSet().judul} dipilih`);
      });
    });
  }

  function setSegment(groupSelector, dataName, value) {
    $$(`${groupSelector} button`).forEach((button) => {
      const active = button.dataset[dataName] === String(value);
      button.classList.toggle("is-selected", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function showScreen(name) {
    const isGame = name === "game";
    setupScreen.classList.toggle("is-active", !isGame);
    gameScreen.classList.toggle("is-active", isGame);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startGame() {
    const set = selectedSet();
    if (!set || set.cards.length === 0) {
      showToast("Data kartu belum tersedia.");
      return;
    }

    state.deck = shuffle(set.cards).slice(0, Math.min(state.amount, set.cards.length));
    state.board = shuffle(state.deck);
    state.round = 0;
    state.score = 0;
    state.teamA = 0;
    state.teamB = 0;
    state.attempts = 0;
    state.markedIds = new Set();
    state.roundStartedAt = Date.now();

    $("#game-set-code").textContent = set.kode;
    $("#game-title").textContent = set.judul;
    $("#game-role-label").textContent = state.mode === "story"
      ? state.role === "A" ? "Role A · Pembaca Cerita" : "Role B · Pencari Cerita"
      : state.role === "A" ? "Role A · Pembaca / Yomifuda" : "Role B · Pencari / Torifuda";
    $("#round-total").textContent = state.deck.length;
    $("#tournament-scores").hidden = state.mode !== "tournament";
    $("#score-main-label").textContent = state.mode === "tournament" ? "Kartu selesai" : state.mode === "story" ? "Skor cerita" : "Skor latihan";
    $("#score-main").textContent = "0";
    $("#team-a-score").textContent = "0";
    $("#team-b-score").textContent = "0";
    $("#session-note").innerHTML = state.mode === "tournament"
      ? `<span aria-hidden="true">旗</span><p><strong>Mode turnamen</strong>Catat poin Tim A atau Tim B setelah kelompok menentukan pemain tercepat.</p>`
      : state.mode === "story"
        ? `<span aria-hidden="true">話</span><p><strong>Mode cerita</strong>${state.role === "A" ? "Bacakan cerita pada kartu ini agar pemain lain dapat menemukan kartu cerita yang sama." : "Dengarkan cerita target sampai selesai, lalu pilih kartu cerita yang sama."}</p>`
        : `<span aria-hidden="true">✦</span><p><strong>Tip latihan</strong>${state.role === "A" ? "Balik kartu untuk melihat arti setelah selesai membacanya." : "Dengarkan bacaan sampai selesai sebelum memilih jawaban."}</p>`;

    updateBestScore();
    renderRound();
    showScreen("game");
  }

  function currentCard() {
    return state.deck[state.round];
  }

  function renderRound() {
    const card = currentCard();
    if (!card) {
      renderFinished();
      return;
    }

    state.roundStartedAt = Date.now();
    state.attempts = 0;
    $("#round-current").textContent = state.round + 1;
    $("#progress-bar").style.width = `${((state.round + 1) / state.deck.length) * 100}%`;

    if (state.role === "A") renderReader(card);
    else renderFinder(card);
  }

  function renderReader(card) {
    const set = selectedSet();
    const isStory = state.mode === "story";
    const frontText = isStory ? card.cerita : card.teks;
    const textClass = isStory ? "is-story" : card.teks.includes("\n") ? "is-pantun" : "";
    playSurface.innerHTML = `
      <div class="reader-layout">
        <div class="reader-stage">
          <button class="karuta-card-wrap" id="flip-card" type="button" aria-label="Balik kartu untuk melihat arti" aria-pressed="false">
            <span class="karuta-card">
              <span class="card-face front">
                <span class="card-crest" aria-hidden="true">${isStory ? "話" : "和"}</span>
                <span class="card-number">${String(card.nomor).padStart(2, "0")}</span>
                <span class="card-text ${textClass}">${escapeHTML(frontText)}</span>
                <span class="card-footer"><span>${escapeHTML(set.kode)}</span><span>${isStory ? "CERITA" : "YOMIFUDA"}</span></span>
              </span>
              <span class="card-face back">
                <span class="card-crest" aria-hidden="true">意</span>
                <span class="card-number">ARTI & KONTEKS</span>
                <span class="card-text">${escapeHTML(card.arti)}</span>
                <span class="card-footer"><span>${escapeHTML(card.kategori)}</span><span>${escapeHTML(card.asalBudaya)}</span></span>
              </span>
            </span>
          </button>
        </div>
        <div class="reader-info">
          <span class="round-label">${isStory ? "KISAH BACA" : "KARTU BACA"} · ${String(state.round + 1).padStart(2, "0")}</span>
          <h1>${isStory ? "Bacakan kisahnya dengan jelas." : "Bacakan kartu dengan jelas."}</h1>
          <p>${isStory
            ? "Baca cerita di bawah ini tanpa menyebut nomor kartu. Pemain pencari memilih kartu cerita dengan isi yang sama."
            : "Sebutkan nomor, lalu baca seluruh teks. Pemain pencari mengangkat tangan ketika menemukan pasangan yang sesuai."}</p>
          <div class="reader-transcript" aria-label="${isStory ? "Kisah yang harus dibacakan" : "Teks kartu yang harus dibacakan"}">
            <span>${isStory ? "KISAH YANG DIBACAKAN" : "TEKS YANG DIBACAKAN"}</span>
            <p>${isStory ? escapeHTML(card.cerita) : `<strong>[${card.nomor}]</strong> ${escapeHTML(card.teks)}`}</p>
          </div>
          <div class="reader-actions">
            <button class="primary-button" id="speak-card" type="button">
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M11 5 6.5 9H3v6h3.5l4.5 4V5Zm4.7 3.3a5.2 5.2 0 0 1 0 7.4M18.5 5.5a9 9 0 0 1 0 13"/></svg>
              Bacakan otomatis
            </button>
            <button class="outline-button" id="flip-card-alt" type="button">Lihat arti</button>
            <button class="outline-button" id="reader-next" type="button">${state.round === state.deck.length - 1 ? "Selesaikan sesi" : "Kartu berikutnya"}</button>
          </div>
          <div class="meta-strip">
            <span class="meta-chip">${escapeHTML(card.kategori)}</span>
            <span class="meta-chip">${escapeHTML(card.asalBudaya)}</span>
            <span class="meta-chip">Klik kartu untuk membalik</span>
          </div>
        </div>
      </div>
    `;

    const toggleFlip = () => {
      const inner = $(".karuta-card", playSurface);
      const pressed = !inner.classList.contains("is-flipped");
      inner.classList.toggle("is-flipped", pressed);
      $("#flip-card").setAttribute("aria-pressed", String(pressed));
      $("#flip-card-alt").textContent = pressed ? (isStory ? "Lihat cerita" : "Lihat bacaan") : "Lihat arti";
    };
    $("#flip-card").addEventListener("click", toggleFlip);
    $("#flip-card-alt").addEventListener("click", toggleFlip);
    $("#speak-card").addEventListener("click", () => speakCard(card, !isStory, isStory));
    $("#reader-next").addEventListener("click", () => {
      if (state.mode === "practice" || state.mode === "story") state.score += 10;
      advanceRound();
    });
  }

  function renderFinder(card) {
    const isStory = state.mode === "story";
    const guessMode = state.mode === "practice" || isStory;
    const headerTitle = isStory ? "Temukan kartu cerita yang dibacakan." : "Temukan kartu yang dibaca.";
    const headerCopy = isStory
      ? "Target disembunyikan. Dengarkan ceritanya sampai selesai, lalu pilih kartu cerita dengan isi yang sama."
      : guessMode
        ? "Target disembunyikan. Gunakan tombol dengarkan, lalu pilih kartu yang cocok."
        : "Dengarkan pembaca di kelompokmu. Ketuk kartu hanya untuk memberi tanda visual setelah ditemukan.";
    const statusLabel = isStory ? "Mode cerita" : guessMode ? "Latihan mandiri" : "Papan turnamen";
    playSurface.innerHTML = `
      <div class="finder-header">
        <div>
          <span class="round-label">PAPAN CARI · ${state.board.length} KARTU</span>
          <h1>${headerTitle}</h1>
          <p>${headerCopy}</p>
        </div>
        <div class="finder-tools">
          ${guessMode ? `<button class="primary-button" id="listen-target" type="button"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M11 5 6.5 9H3v6h3.5l4.5 4V5Zm4.7 3.3a5.2 5.2 0 0 1 0 7.4M18.5 5.5a9 9 0 0 1 0 13"/></svg>Dengarkan</button>` : ""}
          <button class="outline-button" id="shuffle-board" type="button">Acak susunan</button>
          ${guessMode ? "" : `<button class="outline-button" id="finder-next" type="button">Putaran berikutnya</button>`}
        </div>
      </div>
      <div class="board-status">
        <span><strong>${statusLabel}</strong> · urutan kartu telah diacak</span>
        <span>${state.markedIds.size} ditandai</span>
      </div>
      <div class="card-board ${isStory ? "is-story-list" : ""}" id="card-board" aria-label="Papan kartu pencari"></div>
    `;

    renderBoard(card);
    if (guessMode) $("#listen-target").addEventListener("click", () => speakCard(card, false, isStory));
    $("#shuffle-board").addEventListener("click", () => {
      state.board = shuffle(state.board);
      renderBoard(card);
      showToast("Susunan kartu diacak ulang.");
    });
    if (!guessMode) $("#finder-next").addEventListener("click", advanceRound);
  }

  function renderBoard(target) {
    const board = $("#card-board");
    if (!board) return;
    const isStory = state.mode === "story";
    board.innerHTML = state.board.map((card) => `
      <button class="search-card ${isStory ? "is-story" : card.teks.includes("\n") ? "is-pantun" : ""} ${state.markedIds.has(card.id) ? "is-marked" : ""}"
        type="button" data-card-id="${escapeHTML(card.id)}" aria-pressed="${state.markedIds.has(card.id)}">
        <span class="search-number"><span>${String(card.nomor).padStart(2, "0")}</span><small>${isStory ? "CERITA" : "TORIFUDA"}</small></span>
        <span class="search-text">${escapeHTML(isStory ? card.cerita : card.teks)}</span>
        <span class="search-origin">${escapeHTML(card.kategori)} · ${escapeHTML(card.asalBudaya)}</span>
      </button>
    `).join("");

    $$(".search-card", board).forEach((button) => button.addEventListener("click", () => {
      const selected = state.board.find((card) => card.id === button.dataset.cardId);
      if (!selected) return;
      if (state.mode === "practice" || state.mode === "story") checkAnswer(selected, target);
      else {
        if (state.markedIds.has(selected.id)) state.markedIds.delete(selected.id);
        else state.markedIds.add(selected.id);
        button.classList.toggle("is-marked");
        button.setAttribute("aria-pressed", String(state.markedIds.has(selected.id)));
        $(".board-status span:last-child").textContent = `${state.markedIds.size} ditandai`;
        showToast(state.markedIds.has(selected.id) ? `Kartu ${selected.nomor} ditandai.` : `Tanda kartu ${selected.nomor} dihapus.`);
      }
    }));
  }

  function checkAnswer(selected, target) {
    state.attempts += 1;
    const correct = selected.id === target.id;
    const symbol = $("#result-symbol");
    symbol.textContent = correct ? "✓" : "×";
    symbol.classList.toggle("is-wrong", !correct);
    $("#result-kicker").textContent = correct ? "KARTU TEPAT" : "BELUM TEPAT";
    $("#result-title").textContent = correct ? "Tepat, kamu menemukannya." : "Coba dengarkan sekali lagi.";
    $("#result-copy").textContent = correct
      ? `[${target.nomor}] ${state.mode === "story" ? target.cerita : target.teks.replaceAll("\n", " / ")}`
      : `Kartu ${selected.nomor} belum sesuai dengan bacaan.`;
    $("#result-next").hidden = !correct;
    $("#result-back").hidden = correct;
    state.pendingNext = correct;

    if (correct) {
      const elapsed = Math.floor((Date.now() - state.roundStartedAt) / 1000);
      const speedBonus = Math.max(0, 10 - Math.floor(elapsed / 3));
      const attemptPenalty = Math.max(0, (state.attempts - 1) * 2);
      state.score += Math.max(5, 10 + speedBonus - attemptPenalty);
      $("#score-main").textContent = state.score;
      persistBestScore();
    }
    openDialog(confirmDialog);
  }

  function speakCard(card, includeNumber = true, useStory = false) {
    if (!state.sound) {
      showToast("Suara sedang dinonaktifkan dari bagian atas layar.");
      return;
    }
    if (!("speechSynthesis" in window)) {
      showToast("Pembacaan otomatis tidak didukung browser ini.");
      return;
    }
    window.speechSynthesis.cancel();
    const body = useStory && card.cerita ? card.cerita : card.teks.replaceAll("\n", ". ");
    const intro = includeNumber ? `Kartu nomor ${card.nomor}. ` : "";
    const utterance = new SpeechSynthesisUtterance(`${intro}${body}`);
    utterance.lang = "id-ID";
    utterance.rate = .9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  function advanceRound() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    state.round += 1;
    $("#score-main").textContent = state.score;
    persistBestScore();
    renderRound();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderFinished() {
    $("#progress-bar").style.width = "100%";
    playSurface.innerHTML = `
      <div class="reader-stage" style="min-height:570px">
        <div class="reader-info" style="text-align:center;max-width:620px;position:relative;z-index:1">
          <span class="card-crest" aria-hidden="true" style="background:var(--red);color:white;border:0">終</span>
          <span class="round-label" style="justify-content:center">SESI SELESAI</span>
          <h1>${state.mode === "tournament" ? `${state.teamA} : ${state.teamB}` : `${state.score} poin`}</h1>
          <p>${state.mode === "tournament" ? `Tim ${state.teamA === state.teamB ? "A dan Tim B memperoleh skor seimbang" : state.teamA > state.teamB ? "A memimpin sesi ini" : "B memimpin sesi ini"}.` : state.mode === "story" ? "Kamu telah menyelesaikan seluruh kisah dalam sesi ini." : "Kamu telah menyelesaikan seluruh kartu dalam sesi ini."}</p>
          <div class="reader-actions" style="justify-content:center">
            <button class="primary-button" id="play-again" type="button">Mainkan lagi</button>
            <button class="outline-button" id="finish-home" type="button">Pilih set lain</button>
          </div>
        </div>
      </div>
    `;
    $("#round-current").textContent = state.deck.length;
    $("#play-again").addEventListener("click", startGame);
    $("#finish-home").addEventListener("click", () => showScreen("setup"));
  }

  function scoreKey() {
    const modeSuffix = state.mode === "story" ? "-cerita" : "";
    return `wasitra-best-${state.selectedSetId}-${state.role}${modeSuffix}`;
  }

  function updateBestScore() {
    $("#best-score").textContent = storage.get(scoreKey(), "0");
  }

  function persistBestScore() {
    if (state.mode === "tournament") return;
    const best = Number(storage.get(scoreKey(), "0"));
    if (state.score > best) storage.set(scoreKey(), state.score);
    updateBestScore();
  }

  function resetScore() {
    state.score = 0;
    state.teamA = 0;
    state.teamB = 0;
    $("#score-main").textContent = "0";
    $("#team-a-score").textContent = "0";
    $("#team-b-score").textContent = "0";
    showToast("Skor sesi diatur ulang.");
  }

  // Setup events
  $("#theme-toggle").addEventListener("click", () => applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
  $("#sound-toggle").addEventListener("click", () => {
    state.sound = !state.sound;
    storage.set("wasitra-sound", state.sound ? "on" : "off");
    $("#sound-toggle").setAttribute("aria-pressed", String(state.sound));
    $("#sound-toggle").style.opacity = state.sound ? "1" : ".45";
    if (!state.sound && "speechSynthesis" in window) window.speechSynthesis.cancel();
    showToast(state.sound ? "Suara diaktifkan." : "Suara dinonaktifkan.");
  });
  $("#help-button").addEventListener("click", () => openDialog(helpDialog));
  $$('[data-action="home"]').forEach((button) => button.addEventListener("click", () => showScreen("setup")));
  $("#back-button").addEventListener("click", () => showScreen("setup"));
  $("#start-button").addEventListener("click", startGame);
  $("#restart-button").addEventListener("click", startGame);
  $("#reset-score").addEventListener("click", resetScore);

  $$('input[name="role"]').forEach((input) => input.addEventListener("change", () => { state.role = input.value; }));
  $$("#mode-options button").forEach((button) => button.addEventListener("click", () => {
    state.mode = button.dataset.mode;
    setSegment("#mode-options", "mode", state.mode);
    $("#mode-help").textContent = state.mode === "practice"
      ? "Latihan memberi umpan balik dan menyimpan skor terbaik."
      : state.mode === "story"
        ? "Role A membacakan cerita, sedangkan Role B mencari kartu cerita yang ditampilkan satu per baris."
        : "Turnamen menyiapkan papan skor manual untuk dua tim.";
  }));
  $$("#amount-options button").forEach((button) => button.addEventListener("click", () => {
    state.amount = Number(button.dataset.amount);
    setSegment("#amount-options", "amount", state.amount);
  }));
  $$('[data-view]').forEach((button) => button.addEventListener("click", () => {
    state.view = button.dataset.view;
    setGrid.classList.toggle("is-list", state.view === "list");
    setSegment(".set-toolbar .segmented", "view", state.view);
  }));
  $$("[data-team]").forEach((button) => button.addEventListener("click", () => {
    const delta = Number(button.dataset.delta);
    if (button.dataset.team === "A") state.teamA = Math.max(0, state.teamA + delta);
    else state.teamB = Math.max(0, state.teamB + delta);
    $("#team-a-score").textContent = state.teamA;
    $("#team-b-score").textContent = state.teamB;
  }));

  $("#result-next").addEventListener("click", (event) => {
    event.preventDefault();
    const shouldAdvance = state.pendingNext;
    state.pendingNext = false;
    confirmDialog.close();
    if (shouldAdvance) advanceRound();
  });

  confirmDialog.addEventListener("cancel", (event) => {
    if (state.pendingNext) event.preventDefault();
  });

  confirmDialog.addEventListener("close", () => {
    // Tombol "Lihat papan" menutup dialog tanpa memajukan putaran.
    state.pendingNext = false;
  });

  // Inisialisasi
  applyTheme(storage.get("wasitra-theme", window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  $("#sound-toggle").setAttribute("aria-pressed", String(state.sound));
  $("#sound-toggle").style.opacity = state.sound ? "1" : ".45";
  $("#set-count").textContent = `${sets.length} koleksi`;
  renderSets();
})();
