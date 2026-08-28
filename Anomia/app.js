(() => {
  'use strict';

  const STORAGE = {
    cards: 'meowmia.cards.v2',
    legacyCards: 'meowmia.cards.v1',
    theme: 'meowmia.theme.v1',
  };

  const CODES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  const LEGACY_SYMBOL_TO_CODE = {
    ring: 'A',
    plus: 'B',
    asterisk: 'C',
    hash: 'D',
    parallel: 'E',
    waves: 'F',
    fourdots: 'G',
    diamond: 'H',
  };

  const WILD_PAIRS = [
    ['E', 'F'],
    ['G', 'D'],
    ['C', 'D'],
    ['G', 'A'],
    ['E', 'H'],
    ['B', 'A'],
    ['B', 'H'],
    ['C', 'F'],
  ];

  const CATS = ['😺', '😸', '😼', '😹', '😻', '🙀'];
  const PAGE_SIZE = 18;

  const state = {
    cards: loadCards(),
    page: 1,
    route: 'home',
    playerInputCount: 3,
    game: null,
  };

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeCard(card, index = 0) {
    const legacyCode = LEGACY_SYMBOL_TO_CODE[card?.symbol];
    const code = CODES.includes(card?.code)
      ? card.code
      : (legacyCode || CODES[index % CODES.length]);
    return {
      id: String(card?.id || `card-${index + 1}`),
      text: String(card?.text || '').trim(),
      lang: ['ID', 'EN', 'MIX'].includes(card?.lang) ? card.lang : 'MIX',
      code,
      enabled: card?.enabled !== false,
    };
  }

  function loadCards() {
    for (const key of [STORAGE.cards, STORAGE.legacyCards]) {
      try {
        const saved = JSON.parse(localStorage.getItem(key));
        if (Array.isArray(saved) && saved.length) {
          const migrated = saved.map(normalizeCard).filter(card => card.text);
          if (migrated.length) return migrated;
        }
      } catch (_) {}
    }
    return deepClone(window.SEED_CARDS || []).map(normalizeCard);
  }

  function saveCards() {
    localStorage.setItem(STORAGE.cards, JSON.stringify(state.cards));
    updateGlobalStats();
  }

  function codeLabel(code) {
    return CODES.includes(code) ? code : CODES[0];
  }

  function escapeHTML(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function shuffle(array) {
    const a = [...array];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function uid() {
    if (crypto?.randomUUID) return crypto.randomUUID();
    return 'c_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  function setRoute(route) {
    state.route = route;
    $$('.view').forEach(v => v.classList.remove('active'));
    $(`#view-${route}`)?.classList.add('active');
    $$('.nav-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.route === route || (route === 'game' && btn.dataset.route === 'home')));
    if (route === 'cards') renderCardLab();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function initTheme() {
    const saved = localStorage.getItem(STORAGE.theme);
    const theme = saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(theme);
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    $('#themeToggle').textContent = theme === 'dark' ? '☀️' : '🌙';
    $('#themeToggle').setAttribute('aria-label', theme === 'dark' ? 'Aktifkan light mode' : 'Aktifkan dark mode');
    localStorage.setItem(STORAGE.theme, theme);
  }

  function toggleTheme() {
    applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  }

  function updateGlobalStats() {
    const enabled = state.cards.filter(c => c.enabled !== false).length;
    $('#enabledStat').textContent = enabled;
  }

  // ---------- Player setup ----------
  function renderPlayerInputs() {
    const wrap = $('#playerInputs');
    const oldValues = $$('.player-name-wrap input', wrap).map(input => input.value);
    wrap.innerHTML = '';

    for (let i = 0; i < state.playerInputCount; i++) {
      const row = document.createElement('label');
      row.className = 'player-name-wrap';
      row.innerHTML = `
        <span class="player-avatar">${CATS[i]}</span>
        <input aria-label="Nama pemain ${i + 1}" maxlength="18" placeholder="Pemain ${i + 1}" value="${escapeHTML(oldValues[i] || '')}" />
        ${state.playerInputCount > 2 ? `<button class="remove-player" type="button" data-remove-player="${i}" aria-label="Hapus pemain">×</button>` : ''}
      `;
      wrap.appendChild(row);
    }

    $('#addPlayerBtn').disabled = state.playerInputCount >= 6;
  }

  function getPlayerNames() {
    return $$('.player-name-wrap input').map((input, i) => input.value.trim() || `Pemain ${i + 1}`);
  }

  function quickStart() {
    const funny = ['Mochi', 'Oyen', 'Mimi', 'Boba', 'Ciko', 'Nori'];
    $$('.player-name-wrap input').forEach((input, i) => input.value = funny[i]);
    startGame();
  }

  // ---------- Card CRUD ----------
  function populateCodeSelects() {
    const optionHTML = CODES.map(code => `<option value="${code}">${code}</option>`).join('');
    $('#codeFilter').insertAdjacentHTML('beforeend', optionHTML);
    $('#cardCode').innerHTML = optionHTML;
  }

  function getFilteredCards() {
    const q = $('#searchCards').value.trim().toLowerCase();
    const lang = $('#langFilter').value;
    const code = $('#codeFilter').value;
    const status = $('#statusFilter').value;

    return state.cards.filter(card => {
      if (q && !card.text.toLowerCase().includes(q)) return false;
      if (lang !== 'all' && card.lang !== lang) return false;
      if (code !== 'all' && card.code !== code) return false;
      if (status === 'enabled' && card.enabled === false) return false;
      if (status === 'disabled' && card.enabled !== false) return false;
      return true;
    });
  }

  function renderCardLab() {
    const filtered = getFilteredCards();
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    state.page = Math.min(state.page, totalPages);
    const start = (state.page - 1) * PAGE_SIZE;
    const pageCards = filtered.slice(start, start + PAGE_SIZE);

    $('#cardCountLabel').textContent = `${filtered.length} tampil • ${state.cards.length} total`;
    $('#pageLabel').textContent = `${state.page} / ${totalPages}`;
    $('#prevPage').disabled = state.page <= 1;
    $('#nextPage').disabled = state.page >= totalPages;

    const grid = $('#cardGrid');
    if (!pageCards.length) {
      grid.innerHTML = `<div class="empty-state">😿 Nggak ada kartu yang cocok dengan filter ini.</div>`;
      return;
    }

    grid.innerHTML = pageCards.map(card => {
      const code = codeLabel(card.code);
      return `
        <article class="crud-card ${card.enabled === false ? 'disabled' : ''}" data-card-id="${card.id}">
          <div class="crud-card-preview">
            <span class="lang-badge">${escapeHTML(card.lang)}</span>
            <span class="card-code">${escapeHTML(code)}</span>
            <strong>${escapeHTML(card.text)}</strong>
          </div>
          <div class="crud-actions">
            <button type="button" data-action="edit">Edit</button>
            <button type="button" data-action="toggle">${card.enabled === false ? 'Aktifkan' : 'Nonaktif'}</button>
            <button type="button" class="delete" data-action="delete">×</button>
          </div>
        </article>
      `;
    }).join('');
  }

  function openCardDialog(card = null) {
    $('#cardDialogTitle').textContent = card ? 'Edit Kartu' : 'Kartu Baru';
    $('#cardId').value = card?.id || '';
    $('#cardText').value = card?.text || '';
    $('#cardLang').value = card?.lang || 'ID';
    $('#cardCode').value = card?.code || CODES[Math.floor(Math.random() * CODES.length)];
    $('#cardEnabled').checked = card ? card.enabled !== false : true;
    updateEditorPreview();
    $('#cardDialog').showModal();
    setTimeout(() => $('#cardText').focus(), 0);
  }

  function updateEditorPreview() {
    const text = $('#cardText').value.trim() || 'Kategori baru';
    const lang = $('#cardLang').value;
    const code = codeLabel($('#cardCode').value);
    $('#cardPreview').innerHTML = cardHTML({ text, lang, code });
  }

  function saveCardFromForm(event) {
    event.preventDefault();
    const id = $('#cardId').value;
    const text = $('#cardText').value.trim();
    if (!text) return;

    const payload = {
      text,
      lang: $('#cardLang').value,
      code: $('#cardCode').value,
      enabled: $('#cardEnabled').checked,
    };

    if (id) {
      const card = state.cards.find(c => c.id === id);
      if (card) Object.assign(card, payload);
      showToast('Kartu di-update 😺');
    } else {
      state.cards.unshift({ id: uid(), ...payload });
      showToast('Kartu baru masuk deck 🐾');
    }

    saveCards();
    $('#cardDialog').close();
    state.page = 1;
    renderCardLab();
  }

  function cardAction(cardId, action) {
    const card = state.cards.find(c => c.id === cardId);
    if (!card) return;

    if (action === 'edit') {
      openCardDialog(card);
    } else if (action === 'toggle') {
      card.enabled = card.enabled === false;
      saveCards();
      renderCardLab();
      showToast(card.enabled ? 'Kartu aktif lagi 😸' : 'Kartu dinonaktifkan 😴');
    } else if (action === 'delete') {
      if (!confirm(`Hapus kartu “${card.text}”?`)) return;
      state.cards = state.cards.filter(c => c.id !== cardId);
      saveCards();
      renderCardLab();
      showToast('Kartu dihapus. Poof. 🐈');
    }
  }

  function exportCards() {
    const blob = new Blob([JSON.stringify(state.cards, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meowmia-cards-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Deck JSON diekspor ✨');
  }

  async function importCards(file) {
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!Array.isArray(data)) throw new Error('JSON harus array.');

      const clean = data.map((item, i) => ({
        id: String(item.id || `import-${Date.now()}-${i}`),
        text: String(item.text || '').trim().slice(0,70),
        lang: ['ID','EN','MIX'].includes(item.lang) ? item.lang : 'MIX',
        code: CODES.includes(item.code) ? item.code : (LEGACY_SYMBOL_TO_CODE[item.symbol] || CODES[i % CODES.length]),
        enabled: item.enabled !== false,
      })).filter(c => c.text);

      if (!clean.length) throw new Error('Tidak ada kartu valid.');
      state.cards = clean;
      saveCards();
      state.page = 1;
      renderCardLab();
      showToast(`${clean.length} kartu berhasil diimpor 😺`);
    } catch (err) {
      alert(`Import gagal: ${err.message}`);
    } finally {
      $('#importInput').value = '';
    }
  }

  function resetCards() {
    if (!confirm('Reset semua kartu ke 150 seed bawaan? Perubahan lokal akan hilang.')) return;
    state.cards = deepClone(window.SEED_CARDS || []);
    saveCards();
    state.page = 1;
    renderCardLab();
    showToast('Balik ke 150 kartu seed 🐾');
  }

  // ---------- Game ----------
  function buildGameDeck() {
    const enabled = shuffle(state.cards.filter(c => c.enabled !== false));
    const categories = enabled.slice(0, Math.min(142, enabled.length)).map(c => ({ ...deepClone(c), type: 'category' }));
    const wilds = WILD_PAIRS.map((pair, i) => ({ id: `wild-${i + 1}-${Date.now()}`, type: 'wild', pair }));
    return shuffle([...categories, ...wilds]);
  }

  function startGame() {
    const enabledCount = state.cards.filter(c => c.enabled !== false).length;
    if (enabledCount < 2) {
      showToast('Butuh minimal 2 kartu kategori aktif.');
      setRoute('cards');
      return;
    }

    const names = getPlayerNames();
    const players = names.map((name, i) => ({
      id: `p${i}`,
      name,
      cat: CATS[i],
      pile: [],
      captured: [],
    }));

    state.game = {
      players,
      deck: buildGameDeck(),
      turn: 0,
      activeWild: null,
      faceoff: null,
      lock: false,
      startedAt: Date.now(),
    };

    setRoute('game');
    renderGame();
    setGameMessage(`Game dimulai! ${players[0].name} buka kartu pertama. 🐾`);
  }

  function renderGame() {
    const game = state.game;
    if (!game) return;
    $('#turnName').textContent = game.players[game.turn]?.name || '—';
    $('#turnCat').textContent = game.players[game.turn]?.cat || '🐱';
    $('#deckCount').textContent = game.deck.length;
    renderWild();
    renderScoreboard();
    renderPlayerBoard();
  }

  function renderWild() {
    const game = state.game;
    const zone = $('#wildZone');
    const symbols = $('#wildSymbols');
    if (!game?.activeWild) {
      zone.classList.add('inactive');
      symbols.innerHTML = '🐾';
      $('#wildText').textContent = 'Belum ada Wild Card';
      return;
    }
    const [a,b] = game.activeWild;
    zone.classList.remove('inactive');
    symbols.innerHTML = `
      <span class="wild-code">${escapeHTML(a)}</span>
      <span class="wild-x">×</span>
      <span class="wild-code">${escapeHTML(b)}</span>
    `;
    $('#wildText').textContent = `${a} ↔ ${b}`;
  }

  function renderScoreboard() {
    const game = state.game;
    $('#scoreboard').innerHTML = game.players.map(p => `
      <div class="score-row">
        <span class="avatar">${p.cat}</span>
        <div><strong>${escapeHTML(p.name)}</strong><span>${p.pile.length} di play pile</span></div>
        <span class="score-number">${p.captured.length}</span>
      </div>
    `).join('');
  }

  function cardHTML(card, emptyText = 'Belum buka kartu') {
    if (!card) {
      return `<div class="game-card empty"><span>🐾</span><strong>${escapeHTML(emptyText)}</strong></div>`;
    }
    const code = codeLabel(card.code);
    return `
      <div class="game-card">
        <span class="mini-label">${escapeHTML(card.lang || 'MIX')}</span>
        <span class="card-code">${escapeHTML(code)}</span>
        <strong>${escapeHTML(card.text)}</strong>
        <small>MEOWMIA • custom category</small>
      </div>
    `;
  }

  function renderPlayerBoard() {
    const game = state.game;
    $('#playerBoard').innerHTML = game.players.map((p, i) => {
      const top = p.pile[p.pile.length - 1];
      const inFaceoff = game.faceoff && (game.faceoff.a === i || game.faceoff.b === i);
      return `
        <article class="player-seat ${i === game.turn ? 'current' : ''} ${inFaceoff ? 'faceoff' : ''}">
          <div class="player-seat-head">
            <div class="player-seat-name"><span>${p.cat}</span><span>${escapeHTML(p.name)}</span></div>
            <span class="pile-depth">pile ${p.pile.length}</span>
          </div>
          ${cardHTML(top)}
        </article>
      `;
    }).join('');
  }

  function drawCard() {
    const game = state.game;
    if (!game || game.lock || game.faceoff) return;
    if (!game.deck.length) {
      finishGame();
      return;
    }

    game.lock = true;
    $('#drawPile').classList.add('draw-bump');
    setTimeout(() => $('#drawPile').classList.remove('draw-bump'), 320);

    const card = game.deck.pop();
    const drawer = game.players[game.turn];

    if (card.type === 'wild') {
      game.activeWild = card.pair;
      setGameMessage(`🌟 WILD! Kode ${card.pair[0]} sekarang match dengan kode ${card.pair[1]}.`);
    } else {
      drawer.pile.push(card);
      setGameMessage(`${drawer.cat} ${drawer.name} membuka “${card.text}”.`);
    }

    game.turn = (game.turn + 1) % game.players.length;
    game.lock = false;
    renderGame();

    setTimeout(() => {
      if (!checkForFaceoff() && !game.deck.length) finishGame();
    }, 180);
  }

  function topCard(player) {
    return player.pile[player.pile.length - 1] || null;
  }

  function codesMatch(ca, cb, activeWild) {
    if (!ca || !cb) return false;
    if (ca === cb) return true;
    if (!activeWild) return false;
    const [x,y] = activeWild;
    return (ca === x && cb === y) || (ca === y && cb === x);
  }

  function findFaceoff() {
    const game = state.game;
    for (let i = 0; i < game.players.length; i++) {
      const a = topCard(game.players[i]);
      if (!a) continue;
      for (let j = i + 1; j < game.players.length; j++) {
        const b = topCard(game.players[j]);
        if (!b) continue;
        if (codesMatch(a.code, b.code, game.activeWild)) return { a: i, b: j };
      }
    }
    return null;
  }

  function checkForFaceoff() {
    const game = state.game;
    if (!game || game.faceoff) return false;
    const match = findFaceoff();
    if (!match) return false;
    openFaceoff(match.a, match.b);
    return true;
  }

  function openFaceoff(aIndex, bIndex) {
    const game = state.game;
    game.faceoff = { a: aIndex, b: bIndex };
    const a = game.players[aIndex];
    const b = game.players[bIndex];
    const aCard = topCard(a);
    const bCard = topCard(b);

    $('#faceoffTitle').textContent = `${a.name} vs ${b.name}`;
    $('#faceoffCards').innerHTML = `
      <div class="faceoff-side">
        <h3>${a.cat} ${escapeHTML(a.name)}</h3>
        ${cardHTML(aCard)}
        <p class="microcopy">${escapeHTML(b.name)} harus menjawab kategori ini.</p>
      </div>
      <div class="faceoff-side">
        <h3>${b.cat} ${escapeHTML(b.name)}</h3>
        ${cardHTML(bCard)}
        <p class="microcopy">${escapeHTML(a.name)} harus menjawab kategori ini.</p>
      </div>
    `;
    $('#winnerButtons').innerHTML = `
      <button class="btn primary" type="button" data-winner="${aIndex}">${a.cat} ${escapeHTML(a.name)} menang</button>
      <button class="btn primary" type="button" data-winner="${bIndex}">${b.cat} ${escapeHTML(b.name)} menang</button>
    `;
    renderPlayerBoard();
    $('#faceoffDialog').showModal();
  }

  function resolveFaceoff(winnerIndex) {
    const game = state.game;
    if (!game?.faceoff) return;
    const { a, b } = game.faceoff;
    const loserIndex = winnerIndex === a ? b : a;
    const winner = game.players[winnerIndex];
    const loser = game.players[loserIndex];
    const captured = loser.pile.pop();
    if (captured) winner.captured.push(captured);

    game.faceoff = null;
    $('#faceoffDialog').close();
    setGameMessage(`${winner.cat} ${winner.name} menang face-off dan mengambil kartu ${loser.name}!`);
    renderGame();

    setTimeout(() => {
      const cascaded = checkForFaceoff();
      if (cascaded) setGameMessage('⚡ CASCADE! Kartu di bawahnya bikin match baru!');
      else if (!game.deck.length) finishGame();
    }, 240);
  }

  function setGameMessage(text) {
    $('#gameMessage').textContent = text;
  }

  function finishGame() {
    const game = state.game;
    if (!game) return;
    const ranked = [...game.players].sort((a,b) => b.captured.length - a.captured.length);
    const topScore = ranked[0]?.captured.length || 0;
    const winners = ranked.filter(p => p.captured.length === topScore);
    $('#resultTitle').textContent = winners.length > 1
      ? `Tie! ${winners.map(p => p.name).join(' & ')} 😸`
      : `${winners[0]?.name || 'Cat'} menang!`;
    $('#resultScores').innerHTML = ranked.map((p, i) => `
      <div class="result-score-row"><span>${i + 1}. ${p.cat} ${escapeHTML(p.name)}</span><strong>${p.captured.length} kartu</strong></div>
    `).join('');
    if (!$('#resultDialog').open) $('#resultDialog').showModal();
  }

  function endGame() {
    if (!state.game) return;
    if (!confirm('Akhiri game sekarang dan hitung skor saat ini?')) return;
    finishGame();
  }

  // ---------- Events ----------
  document.addEventListener('click', (e) => {
    const routeBtn = e.target.closest('[data-route]');
    if (routeBtn) {
      e.preventDefault();
      setRoute(routeBtn.dataset.route);
      return;
    }

    const removeBtn = e.target.closest('[data-remove-player]');
    if (removeBtn) {
      if (state.playerInputCount <= 2) return;
      const idx = Number(removeBtn.dataset.removePlayer);
      const values = getPlayerNames();
      values.splice(idx, 1);
      state.playerInputCount--;
      renderPlayerInputs();
      $$('.player-name-wrap input').forEach((input, i) => input.value = values[i] || '');
      return;
    }

    const crud = e.target.closest('.crud-card [data-action]');
    if (crud) {
      const cardEl = crud.closest('.crud-card');
      cardAction(cardEl.dataset.cardId, crud.dataset.action);
      return;
    }

    const winner = e.target.closest('[data-winner]');
    if (winner) resolveFaceoff(Number(winner.dataset.winner));
  });

  $('#themeToggle').addEventListener('click', toggleTheme);
  $('#addPlayerBtn').addEventListener('click', () => {
    if (state.playerInputCount < 6) state.playerInputCount++;
    renderPlayerInputs();
  });
  $('#startGameBtn').addEventListener('click', startGame);
  $('#quickStartBtn').addEventListener('click', quickStart);
  $('#drawPile').addEventListener('click', drawCard);
  $('#endGameBtn').addEventListener('click', endGame);

  $('#faceoffDialog').addEventListener('cancel', e => e.preventDefault());
  $('#resultDialog').addEventListener('cancel', e => e.preventDefault());

  $('#rulesBtn').addEventListener('click', () => $('#rulesDialog').showModal());
  $('#closeRulesBtn').addEventListener('click', () => $('#rulesDialog').close());
  $('#rulesOkayBtn').addEventListener('click', () => $('#rulesDialog').close());

  $('#resultHomeBtn').addEventListener('click', () => {
    $('#resultDialog').close();
    state.game = null;
    setRoute('home');
  });

  $('#addCardBtn').addEventListener('click', () => openCardDialog());
  $('#cardForm').addEventListener('submit', saveCardFromForm);
  $('#cancelCardBtn').addEventListener('click', () => $('#cardDialog').close());
  ['cardText','cardLang','cardCode'].forEach(id => {
    $(`#${id}`).addEventListener(id === 'cardText' ? 'input' : 'change', updateEditorPreview);
  });

  ['searchCards','langFilter','codeFilter','statusFilter'].forEach(id => {
    $(`#${id}`).addEventListener(id === 'searchCards' ? 'input' : 'change', () => {
      state.page = 1;
      renderCardLab();
    });
  });
  $('#prevPage').addEventListener('click', () => { state.page--; renderCardLab(); });
  $('#nextPage').addEventListener('click', () => { state.page++; renderCardLab(); });
  $('#exportBtn').addEventListener('click', exportCards);
  $('#importInput').addEventListener('change', e => importCards(e.target.files?.[0]));
  $('#resetCardsBtn').addEventListener('click', resetCards);

  // Click outside selected dialogs to close only non-game-critical ones.
  ['cardDialog','rulesDialog'].forEach(id => {
    const dialog = $(`#${id}`);
    dialog.addEventListener('click', e => {
      if (e.target === dialog) dialog.close();
    });
  });

  // ---------- Init ----------
  initTheme();
  populateCodeSelects();
  renderPlayerInputs();
  renderCardLab();
  updateGlobalStats();
})();
