(() => {
  "use strict";

  const STORAGE_KEY = "bunny-stakes.static.v1";
  const COLORS = ["#4a9cff", "#9b78f2", "#ff83a4", "#55c995", "#ffb84d", "#5c7cfa"];
  const starterPlayers = [
    { id: "aria", name: "Aria", color: COLORS[0], balance: 1000 },
    { id: "bima", name: "Bima", color: COLORS[1], balance: 1000 },
    { id: "citra", name: "Citra", color: COLORS[2], balance: 1000 },
    { id: "danu", name: "Danu", color: COLORS[3], balance: 1000 }
  ];

  const freshState = () => ({
    players: starterPlayers.map((player) => ({ ...player })),
    pot: 0,
    contributions: {},
    history: []
  });

  const refs = {
    app: document.querySelector("#app"),
    themeMeta: document.querySelector('meta[name="theme-color"]'),
    totalChips: document.querySelector("#totalChips"),
    chipsInHands: document.querySelector("#chipsInHands"),
    potSummary: document.querySelector("#potSummary"),
    playerCount: document.querySelector("#playerCount"),
    potValue: document.querySelector("#potValue"),
    potContributors: document.querySelector("#potContributors"),
    playerGrid: document.querySelector("#playerGrid"),
    selectedPlayerCard: document.querySelector("#selectedPlayerCard"),
    selectedDot: document.querySelector("#selectedDot"),
    customAmount: document.querySelector("#customAmount"),
    betButtonCaption: document.querySelector("#betButtonCaption"),
    minusCaption: document.querySelector("#minusCaption"),
    plusCaption: document.querySelector("#plusCaption"),
    transferCaption: document.querySelector("#transferCaption"),
    noticeText: document.querySelector("#noticeText"),
    historyContent: document.querySelector("#historyContent"),
    modalRoot: document.querySelector("#modalRoot"),
    themeButton: document.querySelector("#themeButton"),
    soundButton: document.querySelector("#soundButton"),
    refundButton: document.querySelector("#refundButton"),
    settleButton: document.querySelector("#settleButton"),
    showHistoryButton: document.querySelector("#showHistoryButton"),
    undoButton: document.querySelector("#undoButton")
  };

  let state = loadState();
  let selectedId = state.players[0]?.id || "";
  let amount = 50;
  let theme = localStorage.getItem(`${STORAGE_KEY}.theme`) === "dark" ? "dark" : "light";
  let sound = localStorage.getItem(`${STORAGE_KEY}.sound`) !== "off";

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && Array.isArray(saved.players) && saved.players.length >= 2) {
        return {
          players: saved.players,
          pot: Number(saved.pot) || 0,
          contributions: saved.contributions || {},
          history: Array.isArray(saved.history) ? saved.history : []
        };
      }
    } catch {
      // Invalid local data is replaced with a fresh table.
    }
    return freshState();
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    localStorage.setItem(`${STORAGE_KEY}.theme`, theme);
    localStorage.setItem(`${STORAGE_KEY}.sound`, sound ? "on" : "off");
  }

  function snapshot() {
    return {
      players: state.players.map((player) => ({ ...player })),
      pot: state.pot,
      contributions: { ...state.contributions }
    };
  }

  function transact(title, detail, tone, update) {
    const before = snapshot();
    const next = update();
    state = {
      ...next,
      history: [{
        id: makeId(),
        at: Date.now(),
        title,
        detail,
        tone,
        before
      }, ...state.history].slice(0, 50)
    };
    saveState();
    render();
  }

  function makeId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function formatChips(value) {
    return new Intl.NumberFormat("id-ID").format(Math.max(0, Math.floor(Number(value) || 0)));
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[character]);
  }

  function selectedPlayer() {
    return state.players.find((player) => player.id === selectedId) || state.players[0];
  }

  function chipSound(kind = "bet") {
    if (!sound) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.value = kind === "plus" ? 690 : kind === "minus" ? 260 : 480;
      gain.gain.setValueAtTime(0.045, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.08);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.08);
    } catch {
      // Sound is optional.
    }
  }

  function showNotice(message) {
    refs.noticeText.textContent = message;
  }

  function render() {
    if (!state.players.some((player) => player.id === selectedId)) {
      selectedId = state.players[0]?.id || "";
    }
    const active = selectedPlayer();
    const chipsInHands = state.players.reduce((total, player) => total + player.balance, 0);
    const contributors = Object.values(state.contributions).filter((value) => value > 0).length;

    refs.totalChips.textContent = formatChips(chipsInHands + state.pot);
    refs.chipsInHands.textContent = formatChips(chipsInHands);
    refs.potSummary.textContent = formatChips(state.pot);
    refs.playerCount.textContent = state.players.length;
    refs.potValue.textContent = formatChips(state.pot);
    refs.potContributors.textContent = `${contributors} pemain berkontribusi`;
    refs.refundButton.disabled = state.pot <= 0;
    refs.settleButton.disabled = state.pot <= 0;

    refs.playerGrid.innerHTML = state.players.map((player) => {
      const selected = player.id === selectedId;
      return `
        <article class="player-card ${selected ? "selected" : ""}" data-player-id="${player.id}">
          <button class="edit-player" type="button" data-edit-player="${player.id}" aria-label="Edit ${escapeHTML(player.name)}">•••</button>
          <div class="player-head">
            <span class="avatar" style="background:${player.color}">${escapeHTML(player.name.slice(0, 1).toUpperCase())}</span>
            <div><h3>${escapeHTML(player.name)}</h3><p>${selected ? "Dipilih" : "Ketuk untuk pilih"}</p></div>
          </div>
          <div class="player-balance"><span>Saldo</span><strong>${formatChips(player.balance)}</strong></div>
          <div class="player-bet"><span>Taruhan ronde</span><b>${formatChips(state.contributions[player.id] || 0)}</b></div>
        </article>`;
    }).join("");

    if (active) {
      refs.selectedPlayerCard.innerHTML = `
        <span class="avatar" style="background:${active.color}">${escapeHTML(active.name.slice(0, 1).toUpperCase())}</span>
        <div><small>Pemain aktif</small><strong>${escapeHTML(active.name)}</strong></div>
        <b>${formatChips(active.balance)}</b>`;
      refs.selectedDot.style.background = active.color;
      refs.betButtonCaption.textContent = `${formatChips(amount)} chip dari ${active.name}`;
    }

    refs.minusCaption.textContent = `${formatChips(amount)} chip`;
    refs.plusCaption.textContent = `${formatChips(amount)} chip`;
    refs.transferCaption.textContent = `Penerima mendapat ${formatChips(amount)} chip`;
    refs.customAmount.value = String(amount);
    document.querySelectorAll("[data-amount]").forEach((button) => {
      button.classList.toggle("active", Number(button.dataset.amount) === amount);
    });

    renderHistory();
    applyTheme();
  }

  function renderHistory() {
    refs.showHistoryButton.disabled = !state.history.length;
    refs.undoButton.disabled = !state.history.length;
    if (!state.history.length) {
      refs.historyContent.innerHTML = `
        <div class="empty-history"><span>♧</span><p>Belum ada transaksi. Aktivitas taruhan dan perubahan saldo akan tercatat di sini.</p></div>`;
      return;
    }
    refs.historyContent.innerHTML = `
      <div class="history-list compact-history">
        ${state.history.slice(0, 4).map(historyItemHTML).join("")}
      </div>`;
  }

  function historyItemHTML(transaction) {
    const marker = transaction.tone === "plus" ? "+" :
      transaction.tone === "minus" ? "−" :
      transaction.tone === "bet" ? "♠" : "•";
    const time = new Date(transaction.at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    return `
      <article class="history-item ${transaction.tone}">
        <span class="history-marker">${marker}</span>
        <div><strong>${escapeHTML(transaction.title)}</strong><p>${escapeHTML(transaction.detail)}</p></div>
        <time>${time}</time>
      </article>`;
  }

  function applyTheme() {
    refs.app.classList.toggle("dark", theme === "dark");
    refs.app.classList.toggle("light", theme === "light");
    refs.themeButton.textContent = theme === "light" ? "☾" : "☀";
    refs.soundButton.textContent = sound ? "◕" : "○";
    refs.themeMeta.setAttribute("content", theme === "dark" ? "#101d33" : "#eef9ff");
  }

  function setAmount(value) {
    const parsed = Math.max(1, Math.floor(Number(value)));
    if (!Number.isFinite(parsed)) return;
    amount = parsed;
    render();
  }

  function betToPot() {
    const player = selectedPlayer();
    if (!player) return;
    if (amount > player.balance) {
      showNotice(`Chip ${player.name} tidak cukup untuk taruhan ${formatChips(amount)}.`);
      chipSound("minus");
      return;
    }
    transact(
      "Taruhan masuk",
      `${player.name} memasukkan ${formatChips(amount)} chip ke pot.`,
      "bet",
      () => ({
        players: state.players.map((item) => item.id === player.id ? { ...item, balance: item.balance - amount } : item),
        pot: state.pot + amount,
        contributions: { ...state.contributions, [player.id]: (state.contributions[player.id] || 0) + amount }
      })
    );
    showNotice(`${formatChips(amount)} chip dipindahkan dari ${player.name} ke pot.`);
    chipSound("bet");
  }

  function adjustPlayer(direction) {
    const player = selectedPlayer();
    if (!player) return;
    if (direction < 0 && amount > player.balance) {
      showNotice(`Saldo ${player.name} tidak boleh negatif.`);
      chipSound("minus");
      return;
    }
    const delta = direction * amount;
    transact(
      direction > 0 ? "Chip ditambahkan" : "Chip dikurangi",
      `${formatChips(amount)} chip ${direction > 0 ? "ditambahkan ke" : "dikurangi dari"} ${player.name}.`,
      direction > 0 ? "plus" : "minus",
      () => ({
        players: state.players.map((item) => item.id === player.id ? { ...item, balance: item.balance + delta } : item),
        pot: state.pot,
        contributions: { ...state.contributions }
      })
    );
    showNotice(`Saldo ${player.name} diperbarui.`);
    chipSound(direction > 0 ? "plus" : "minus");
  }

  function refundPot() {
    if (!state.pot) {
      showNotice("Pot masih kosong.");
      return;
    }
    const potBefore = state.pot;
    transact(
      "Pot dikembalikan",
      `${formatChips(potBefore)} chip dikembalikan sesuai kontribusi masing-masing pemain.`,
      "system",
      () => ({
        players: state.players.map((player) => ({
          ...player,
          balance: player.balance + (state.contributions[player.id] || 0)
        })),
        pot: 0,
        contributions: {}
      })
    );
    showNotice("Seluruh taruhan dikembalikan kepada pemiliknya.");
    chipSound("plus");
  }

  function undoLast() {
    const [latest, ...rest] = state.history;
    if (!latest) return;
    state = { ...latest.before, history: rest };
    selectedId = state.players.some((player) => player.id === selectedId) ? selectedId : state.players[0].id;
    saveState();
    render();
    showNotice("Transaksi terakhir dibatalkan.");
  }

  function resetTable() {
    if (!window.confirm("Mulai meja baru? Seluruh pemain, saldo, pot, dan riwayat akan direset.")) return;
    state = freshState();
    selectedId = state.players[0].id;
    saveState();
    render();
    showNotice("Meja baru dimulai dengan empat pemain contoh.");
  }

  function showModal(content) {
    refs.modalRoot.innerHTML = `<div class="modal-backdrop" data-backdrop="true">${content}</div>`;
    refs.modalRoot.querySelector("[data-backdrop]").addEventListener("mousedown", (event) => {
      if (event.target.dataset.backdrop) closeModal();
    });
    refs.modalRoot.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", closeModal));
  }

  function closeModal() {
    refs.modalRoot.innerHTML = "";
  }

  function openPlayerModal(mode, playerId = null) {
    if (mode === "add" && state.players.length >= 10) {
      showNotice("Maksimal 10 pemain pada satu meja.");
      return;
    }
    const target = mode === "edit" ? state.players.find((player) => player.id === playerId) : null;
    let chosenColor = target?.color || COLORS[state.players.length % COLORS.length];
    showModal(`
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="player-modal-title">
        <div class="modal-heading">
          <div><p class="eyebrow">Player setup</p><h2 id="player-modal-title">${mode === "add" ? "Tambah pemain" : "Edit pemain"}</h2></div>
          <button class="icon-button" type="button" data-close-modal>×</button>
        </div>
        <label class="field">Nama pemain<input id="modalPlayerName" maxlength="18" value="${escapeHTML(target?.name || "")}" placeholder="Contoh: Raka"></label>
        <label class="field">Saldo chip<input id="modalPlayerBalance" type="number" min="0" value="${target?.balance ?? 1000}"></label>
        <div class="field"><span>Warna pemain</span><div class="color-options" id="modalColors">
          ${COLORS.map((color) => `<button type="button" data-color="${color}" class="${chosenColor === color ? "active" : ""}" style="background:${color}" aria-label="Pilih warna ${color}"></button>`).join("")}
        </div></div>
        <button class="save-button" id="savePlayerButton" type="button">Simpan pemain</button>
        ${mode === "edit" ? '<button class="delete-button" id="deletePlayerButton" type="button">Hapus pemain dari meja</button>' : ""}
      </section>`);

    const nameInput = document.querySelector("#modalPlayerName");
    nameInput.focus();
    document.querySelector("#modalColors").addEventListener("click", (event) => {
      const button = event.target.closest("[data-color]");
      if (!button) return;
      chosenColor = button.dataset.color;
      document.querySelectorAll("[data-color]").forEach((item) => item.classList.toggle("active", item === button));
    });

    document.querySelector("#savePlayerButton").addEventListener("click", () => {
      const name = nameInput.value.trim();
      const balance = Math.max(0, Math.floor(Number(document.querySelector("#modalPlayerBalance").value)));
      if (!name || !Number.isFinite(balance)) return;
      if (mode === "add") {
        const player = { id: makeId(), name, color: chosenColor, balance };
        transact(
          "Pemain ditambahkan",
          `${name} bergabung dengan ${formatChips(balance)} chip.`,
          "system",
          () => ({
            players: [...state.players, player],
            pot: state.pot,
            contributions: { ...state.contributions }
          })
        );
        selectedId = player.id;
        showNotice(`${name} siap bermain.`);
      } else if (target) {
        const oldName = target.name;
        transact(
          "Pemain diperbarui",
          `${oldName} diubah menjadi ${name}.`,
          "system",
          () => ({
            players: state.players.map((player) => player.id === target.id ? { ...player, name, color: chosenColor, balance } : player),
            pot: state.pot,
            contributions: { ...state.contributions }
          })
        );
        showNotice(`Data ${name} diperbarui.`);
      }
      closeModal();
      render();
    });

    const deleteButton = document.querySelector("#deletePlayerButton");
    if (deleteButton && target) {
      deleteButton.addEventListener("click", () => {
        if (state.players.length <= 2) {
          closeModal();
          showNotice("Meja harus memiliki sedikitnya dua pemain.");
          return;
        }
        if ((state.contributions[target.id] || 0) > 0) {
          closeModal();
          showNotice("Selesaikan atau kembalikan pot sebelum menghapus pemain ini.");
          return;
        }
        if (!window.confirm(`Hapus ${target.name} dan keluarkan ${formatChips(target.balance)} chip miliknya dari meja?`)) return;
        transact(
          "Pemain dihapus",
          `${target.name} keluar. ${formatChips(target.balance)} chip miliknya dikeluarkan dari meja.`,
          "system",
          () => ({
            players: state.players.filter((player) => player.id !== target.id),
            pot: state.pot,
            contributions: { ...state.contributions }
          })
        );
        selectedId = state.players[0].id;
        closeModal();
        render();
        showNotice(`${target.name} dihapus dari meja.`);
      });
    }
  }

  function openTransferModal() {
    const sender = selectedPlayer();
    if (!sender) return;
    const recipients = state.players.filter((player) => player.id !== sender.id);
    let targetId = recipients[0]?.id;
    showModal(`
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="transfer-title">
        <div class="modal-heading">
          <div><p class="eyebrow">Direct transfer</p><h2 id="transfer-title">Kirim chip</h2></div>
          <button class="icon-button" type="button" data-close-modal>×</button>
        </div>
        <div class="transfer-summary">
          <div><small>Dari</small><strong>${escapeHTML(sender.name)}</strong><b>${formatChips(sender.balance)}</b></div>
          <span>→</span>
          <div><small>Jumlah</small><strong>${formatChips(amount)}</strong><b>chip</b></div>
        </div>
        <div class="field"><span>Pilih penerima</span><div class="choice-list" id="recipientList">
          ${recipients.map((player, index) => `
            <button type="button" data-target-id="${player.id}" class="${index === 0 ? "active" : ""}">
              <span class="avatar" style="background:${player.color}">${escapeHTML(player.name.slice(0, 1).toUpperCase())}</span>
              <div><strong>${escapeHTML(player.name)}</strong><small>Saldo ${formatChips(player.balance)}</small></div><b>✓</b>
            </button>`).join("")}
        </div></div>
        <button class="save-button" id="confirmTransferButton" type="button" ${amount > sender.balance ? "disabled" : ""}>Transfer ${formatChips(amount)} chip</button>
      </section>`);

    document.querySelector("#recipientList").addEventListener("click", (event) => {
      const button = event.target.closest("[data-target-id]");
      if (!button) return;
      targetId = button.dataset.targetId;
      document.querySelectorAll("[data-target-id]").forEach((item) => item.classList.toggle("active", item === button));
    });
    document.querySelector("#confirmTransferButton").addEventListener("click", () => {
      const recipient = state.players.find((player) => player.id === targetId);
      if (!recipient || amount > sender.balance) return;
      transact(
        "Transfer chip",
        `${sender.name} mengirim ${formatChips(amount)} chip kepada ${recipient.name}.`,
        "bet",
        () => ({
          players: state.players.map((player) => {
            if (player.id === sender.id) return { ...player, balance: player.balance - amount };
            if (player.id === recipient.id) return { ...player, balance: player.balance + amount };
            return player;
          }),
          pot: state.pot,
          contributions: { ...state.contributions }
        })
      );
      closeModal();
      showNotice(`${recipient.name} menerima ${formatChips(amount)} chip dari ${sender.name}.`);
      chipSound("bet");
    });
  }

  function openSettleModal(winners = new Set([selectedId])) {
    if (!state.pot) {
      showNotice("Pot masih kosong.");
      return;
    }
    const selectedNames = state.players.filter((player) => winners.has(player.id)).map((player) => player.name);
    showModal(`
      <section class="modal winner-modal" role="dialog" aria-modal="true" aria-labelledby="winner-title">
        <div class="modal-heading">
          <div><p class="eyebrow">Round result</p><h2 id="winner-title">Siapa pemenangnya?</h2></div>
          <button class="icon-button" type="button" data-close-modal>×</button>
        </div>
        <div class="pot-award"><span>Pot yang dibagikan</span><strong>${formatChips(state.pot)}</strong><small>Pilih satu atau beberapa pemenang untuk split pot.</small></div>
        <div class="winner-grid" id="winnerGrid">
          ${state.players.map((player) => `
            <button type="button" data-winner-id="${player.id}" class="${winners.has(player.id) ? "active" : ""}">
              <span class="avatar" style="background:${player.color}">${escapeHTML(player.name.slice(0, 1).toUpperCase())}</span>
              <strong>${escapeHTML(player.name)}</strong><small>${winners.has(player.id) ? "Terpilih" : "Pilih"}</small><b>✓</b>
            </button>`).join("")}
        </div>
        ${winners.size ? `<div class="split-note">Setiap pemenang menerima sekitar <strong>${formatChips(Math.floor(state.pot / winners.size))}</strong> chip.</div>` : ""}
        <button class="save-button award-button" id="confirmWinnerButton" type="button" ${winners.size ? "" : "disabled"}>🏆 Bagikan pot sekarang</button>
      </section>`);

    document.querySelector("#winnerGrid").addEventListener("click", (event) => {
      const button = event.target.closest("[data-winner-id]");
      if (!button) return;
      const next = new Set(winners);
      next.has(button.dataset.winnerId) ? next.delete(button.dataset.winnerId) : next.add(button.dataset.winnerId);
      openSettleModal(next);
    });
    document.querySelector("#confirmWinnerButton").addEventListener("click", () => {
      if (!winners.size) return;
      const potBefore = state.pot;
      const share = Math.floor(potBefore / winners.size);
      const remainder = potBefore - share * winners.size;
      const winnerIds = [...winners];
      transact(
        winners.size === 1 ? "Pot dimenangkan" : "Pot dibagi",
        `${formatChips(potBefore)} chip diberikan kepada ${selectedNames.join(", ")}.`,
        "plus",
        () => ({
          players: state.players.map((player) => {
            const index = winnerIds.indexOf(player.id);
            return index === -1 ? player : { ...player, balance: player.balance + share + (index === 0 ? remainder : 0) };
          }),
          pot: 0,
          contributions: {}
        })
      );
      closeModal();
      showNotice(winners.size === 1 ? `${selectedNames[0]} memenangkan pot.` : `Pot dibagi kepada ${winners.size} pemenang.`);
      chipSound("plus");
    });
  }

  function openHistoryModal() {
    if (!state.history.length) return;
    showModal(`
      <section class="modal history-modal" role="dialog" aria-modal="true" aria-labelledby="history-title">
        <div class="modal-heading">
          <div><p class="eyebrow">Audit trail</p><h2 id="history-title">Riwayat transaksi</h2></div>
          <button class="icon-button" type="button" data-close-modal>×</button>
        </div>
        <div class="history-list full-history">${state.history.map(historyItemHTML).join("")}</div>
        <button class="save-button" id="modalUndoButton" type="button">↶ Batalkan transaksi terakhir</button>
      </section>`);
    document.querySelector("#modalUndoButton").addEventListener("click", () => {
      closeModal();
      undoLast();
    });
  }

  refs.playerGrid.addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit-player]");
    if (editButton) {
      openPlayerModal("edit", editButton.dataset.editPlayer);
      return;
    }
    const card = event.target.closest("[data-player-id]");
    if (!card) return;
    selectedId = card.dataset.playerId;
    render();
  });

  document.querySelector("#denominationGrid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-amount]");
    if (button) setAmount(button.dataset.amount);
  });
  document.querySelector("#useCustomButton").addEventListener("click", () => setAmount(refs.customAmount.value));
  refs.customAmount.addEventListener("change", () => setAmount(refs.customAmount.value));
  document.querySelector("#addPlayerButton").addEventListener("click", () => openPlayerModal("add"));
  document.querySelector("#betButton").addEventListener("click", betToPot);
  document.querySelector("#minusButton").addEventListener("click", () => adjustPlayer(-1));
  document.querySelector("#plusButton").addEventListener("click", () => adjustPlayer(1));
  document.querySelector("#transferButton").addEventListener("click", openTransferModal);
  refs.refundButton.addEventListener("click", refundPot);
  refs.settleButton.addEventListener("click", () => openSettleModal());
  document.querySelector("#resetButton").addEventListener("click", resetTable);
  refs.showHistoryButton.addEventListener("click", openHistoryModal);
  refs.undoButton.addEventListener("click", undoLast);
  refs.themeButton.addEventListener("click", () => {
    theme = theme === "light" ? "dark" : "light";
    saveState();
    applyTheme();
  });
  refs.soundButton.addEventListener("click", () => {
    sound = !sound;
    saveState();
    applyTheme();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });

  render();
})();
