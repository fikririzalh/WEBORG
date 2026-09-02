(function (global) {
  'use strict';

  const SLOT_LABELS = ['MEJA 1', 'MEJA 2', 'MEJA 3', 'MEJA 4', 'MEJA 5', 'MEJA 6'];
  const COUNT_DISTRIBUTION = [1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5];

  const FRUITS = [
    { id: 'banana', name: 'Pisang', emoji: '🍌', color: '#ffd44d' },
    { id: 'strawberry', name: 'Stroberi', emoji: '🍓', color: '#ff5374' },
    { id: 'lime', name: 'Jeruk Nipis', emoji: '🍋‍🟩', color: '#91d93c' },
    { id: 'plum', name: 'Plum', emoji: '🍑', color: '#b084ff' },
    { id: 'grape', name: 'Anggur', emoji: '🍇', color: '#8b6cff' },
    { id: 'kiwi', name: 'Kiwi', emoji: '🥝', color: '#72c957' },
    { id: 'watermelon', name: 'Semangka', emoji: '🍉', color: '#ff647c' }
  ];

  const MODES = {
    classic: {
      id: 'classic',
      label: 'Normal',
      badge: 'ORIGINAL',
      icon: '🍓',
      description: 'Empat buah dan ability original. Cepat dipahami, tetap menantang.',
      fruitIds: ['banana', 'strawberry', 'lime', 'plum'],
      defaultNewAbilities: []
    },
    fresh: {
      id: 'fresh',
      label: 'Fresh Mix',
      badge: '+2 BUAH',
      icon: '🥝',
      description: 'Kiwi dan anggur masuk. Variasi lebih ramai tanpa terlalu liar.',
      fruitIds: ['banana', 'strawberry', 'lime', 'plum', 'grape', 'kiwi'],
      defaultNewAbilities: ['freeze', 'reverse']
    },
    chaos: {
      id: 'chaos',
      label: 'Chaos',
      badge: 'SEMUA MASUK',
      icon: '⚡',
      description: 'Tujuh buah, semua ability, dan action card lebih sering muncul.',
      fruitIds: FRUITS.map((fruit) => fruit.id),
      defaultNewAbilities: ['freeze', 'reverse', 'double']
    }
  };

  const BASE_ACTIONS = [
    { type: 'joker', title: 'JOKER', emoji: '🃏', instruction: 'BUNYIKAN BEL!', detail: 'Siapa paling cepat mengambil ronde.', tone: 'violet' },
    { type: 'clap3', title: 'CLAP ×3', emoji: '👏', instruction: 'TEPUK 3×, LALU BEL', detail: 'Tepuk tiga kali sebelum menyentuh bel.', tone: 'amber' },
    { type: 'count10', title: 'COUNT RUSH', emoji: '🔟', instruction: '1 SAMPAI 10, LALU BEL', detail: 'Hitung bergantian. Salah hitung, ulang dari satu.', tone: 'orange' },
    { type: 'together', title: 'TOGETHER', emoji: '🤝', instruction: 'SEMUA KE BEL', detail: 'Pemain terakhir menerima hukuman meja.', tone: 'green' }
  ];

  const NEW_ACTIONS = [
    { type: 'freeze', title: 'FREEZE', emoji: '🧊', instruction: 'DIAM SEKARANG', detail: 'Yang bergerak pertama menerima hukuman meja.', tone: 'cyan' },
    { type: 'reverse', title: 'REVERSE', emoji: '🔄', instruction: 'BALIK ARAH', detail: 'Arah giliran membuka kartu langsung berbalik.', tone: 'pink' },
    { type: 'double', title: 'DOUBLE DRAW', emoji: '✌️', instruction: 'BUKA DUA KARTU', detail: 'Pemain berikutnya membuka dua meja berbeda.', tone: 'blue' }
  ];

  const BASE_ACTION_MIX = ['joker', 'joker', 'clap3', 'clap3', 'clap3', 'count10', 'count10', 'together', 'together', 'together'];
  let keyHandler = null;

  function shuffle(items) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const target = Math.floor(Math.random() * (index + 1));
      [result[index], result[target]] = [result[target], result[index]];
    }
    return result;
  }

  function fruitById(id) {
    return FRUITS.find((fruit) => fruit.id === id);
  }

  function actionByType(type) {
    return [...BASE_ACTIONS, ...NEW_ACTIONS].find((action) => action.type === type);
  }

  function enabledFruits(modeId) {
    return MODES[modeId].fruitIds.map(fruitById);
  }

  function buildDeck(modeId, newAbilities) {
    const cards = [];
    enabledFruits(modeId).forEach((fruit) => {
      COUNT_DISTRIBUTION.forEach((count) => cards.push({ kind: 'fruit', fruit: fruit.id, count }));
    });

    const actionTypes = [...BASE_ACTION_MIX];
    newAbilities.forEach((type) => {
      const copies = modeId === 'chaos' ? 3 : 2;
      for (let copy = 0; copy < copies; copy += 1) actionTypes.push(type);
    });
    if (modeId === 'chaos') actionTypes.push('joker', 'clap3', 'count10', 'together');
    actionTypes.forEach((type) => cards.push({ kind: 'action', action: type }));

    const shuffled = shuffle(cards);
    const openingIndex = shuffled.findIndex((card) => card.kind === 'fruit');
    if (openingIndex >= 0) [shuffled[openingIndex], shuffled[shuffled.length - 1]] = [shuffled[shuffled.length - 1], shuffled[openingIndex]];
    return shuffled;
  }

  function setupState(modeId = 'classic', abilities) {
    const safeMode = MODES[modeId] ? modeId : 'classic';
    const selected = Array.isArray(abilities) ? abilities.filter((type) => NEW_ACTIONS.some((action) => action.type === type)) : [...MODES[safeMode].defaultNewAbilities];
    return { phase: 'setup', modeId: safeMode, newAbilities: selected };
  }

  function playState(modeId, abilities) {
    const safeMode = MODES[modeId] ? modeId : 'classic';
    const selected = Array.isArray(abilities) ? [...abilities] : [...MODES[safeMode].defaultNewAbilities];
    return {
      phase: 'play',
      modeId: safeMode,
      newAbilities: selected,
      deck: buildDeck(safeMode, selected),
      slots: SLOT_LABELS.map(() => []),
      visible: SLOT_LABELS.map(() => null),
      draws: 0,
      lastSlot: null
    };
  }

  function fruitPreview(mode) {
    return mode.fruitIds.map((id) => `<span title="${fruitById(id).name}">${fruitById(id).emoji}</span>`).join('');
  }

  function renderSetup(state) {
    return `
      <section class="setup-screen">
        <div class="setup-hero">
          <div>
            <span class="version-pill">VERSION 3.0</span>
            <h2>Pilih ritme.<br><em>Mainkan nyata.</em></h2>
            <p>Aplikasi hanya membuka kartu. Tidak ada lagi peringatan saat jumlah buah mencapai lima. Mata, fokus, dan bel sungguhan menentukan pemenang.</p>
          </div>
          <div class="bell-visual" aria-hidden="true">
            <span>🔔</span>
            <i></i><i></i><i></i>
          </div>
        </div>

        <div class="section-title">
          <div><span>01</span><h3>Pilih mode</h3></div>
          <small>${MODES[state.modeId].label} aktif</small>
        </div>
        <div class="mode-grid">
          ${Object.values(MODES).map((mode) => `
            <button class="mode-card ${state.modeId === mode.id ? 'selected' : ''}" data-mode="${mode.id}" type="button" aria-pressed="${state.modeId === mode.id}">
              <span class="mode-top"><b>${mode.icon} ${mode.label}</b><i>${mode.badge}</i></span>
              <span class="mode-fruits">${fruitPreview(mode)}</span>
              <small>${mode.description}</small>
              <strong>${mode.fruitIds.length} JENIS BUAH</strong>
            </button>
          `).join('')}
        </div>

        <div class="section-title ability-heading">
          <div><span>02</span><h3>Ability baru</h3></div>
          <small>Bebas diaktifkan</small>
        </div>
        <div class="ability-grid">
          ${NEW_ACTIONS.map((action) => {
            const checked = state.newAbilities.includes(action.type);
            return `
              <label class="ability-toggle ${checked ? 'enabled' : ''}">
                <input type="checkbox" data-ability="${action.type}" ${checked ? 'checked' : ''}>
                <span class="ability-icon">${action.emoji}</span>
                <span class="ability-copy"><b>${action.title}</b><small>${action.detail}</small></span>
                <span class="switch" aria-hidden="true"><i></i></span>
              </label>
            `;
          }).join('')}
        </div>

        <div class="launch-panel">
          <div>
            <b>${MODES[state.modeId].icon} ${MODES[state.modeId].label}</b>
            <span>${enabledFruits(state.modeId).length} buah · ${BASE_ACTIONS.length + state.newAbilities.length} jenis action</span>
          </div>
          <button id="startBtn" class="launch-btn" type="button"><span>MAIN SEKARANG</span><i>→</i></button>
        </div>
      </section>
    `;
  }

  function cardHTML(card, isNew) {
    if (!card) {
      return `
        <div class="game-card empty-card">
          <div class="card-back"><span>F</span><b>5</b></div>
          <small>Tekan untuk membuka</small>
        </div>
      `;
    }

    if (card.kind === 'action') {
      const action = actionByType(card.action);
      return `
        <div class="game-card action-card tone-${action.tone} ${isNew ? 'card-enter' : ''}">
          <span class="corner-label">ACTION</span>
          <span class="action-icon">${action.emoji}</span>
          <strong>${action.title}</strong>
          <b>${action.instruction}</b>
          <small>${action.detail}</small>
        </div>
      `;
    }

    const fruit = fruitById(card.fruit);
    const icons = Array.from({ length: card.count }, () => `<span>${fruit.emoji}</span>`).join('');
    return `
      <div class="game-card fruit-card count-${card.count} ${isNew ? 'card-enter' : ''}" style="--fruit-color:${fruit.color}">
        <strong class="fruit-count">${card.count}</strong>
        <div class="fruit-icons" aria-label="${card.count} ${fruit.name}">${icons}</div>
        <small>${fruit.name}</small>
      </div>
    `;
  }

  function activeActions(state) {
    return [...BASE_ACTIONS, ...NEW_ACTIONS.filter((action) => state.newAbilities.includes(action.type))];
  }

  function renderPlay(state) {
    const mode = MODES[state.modeId];
    const isEmpty = state.deck.length === 0;
    return `
      <section class="play-screen">
        <div class="game-toolbar">
          <div class="mode-status">
            <span class="status-icon">${mode.icon}</span>
            <div><small>MODE AKTIF</small><b>${mode.label}</b></div>
          </div>
          <div class="fruit-roster" aria-label="Buah aktif">${fruitPreview(mode)}</div>
          <div class="deck-status">
            <div><small>SISA DECK</small><b>${state.deck.length}</b></div>
            <div><small>DIBUKA</small><b>${state.draws}</b></div>
          </div>
          <button id="modeBtn" class="compact-btn" type="button">⚙ Atur Mode</button>
        </div>

        ${isEmpty ? `
          <div class="deck-finished">
            <span>🏁</span>
            <div><b>Deck selesai</b><small>Hitung hasil permainan di meja. Mulai ulang jika ingin lanjut.</small></div>
            <button id="replayBtn" class="compact-btn strong" type="button">↻ Main Lagi</button>
          </div>
        ` : ''}

        <div class="fruit-board" id="gameBoard">
          ${SLOT_LABELS.map((label, index) => `
            <article class="fruit-slot ${state.visible[index] ? 'has-card' : ''} ${state.lastSlot === index ? 'latest' : ''}">
              <div class="slot-head">
                <span><i>${index + 1}</i><b>${label}</b></span>
                <small>${state.slots[index].length} kartu</small>
              </div>
              ${cardHTML(state.visible[index], state.lastSlot === index)}
              <button class="draw-btn" data-slot="${index}" type="button" ${isEmpty ? 'disabled' : ''}>
                <span>BUKA KARTU</span><kbd>${index + 1}</kbd>
              </button>
            </article>
          `).join('')}
        </div>

        <div class="focus-panel">
          <div class="manual-bell"><span>🔔</span><div><b>BEL MANUAL</b><small>Aplikasi tidak memberi tahu saat ada tepat lima buah.</small></div></div>
          <div class="action-list">
            ${activeActions(state).map((action) => `<span title="${action.instruction}">${action.emoji}<b>${action.title}</b></span>`).join('')}
          </div>
          <small class="key-hint">Tip: tekan angka 1–6 untuk membuka kartu lebih cepat.</small>
        </div>
      </section>
    `;
  }

  function drawCard(ctx, slotIndex) {
    if (ctx.state.phase !== 'play' || !ctx.state.deck.length) return;
    const card = ctx.state.deck.pop();
    ctx.state.slots[slotIndex].push(card);
    ctx.state.visible[slotIndex] = card;
    ctx.state.draws += 1;
    ctx.state.lastSlot = slotIndex;
    ctx.beep(card.kind === 'action' ? 760 : 420, card.kind === 'action' ? 0.09 : 0.035);
    ctx.render();
  }

  function removeKeyHandler() {
    if (!keyHandler) return;
    document.removeEventListener('keydown', keyHandler);
    keyHandler = null;
  }

  const game = {
    meta: {
      id: 'fruit-five-v3',
      title: 'FRUIT FIVE',
      subtitle: 'V3 · Lihat. Hitung. Bunyi.',
      eyebrow: 'REAL-LIFE REFLEX GAME'
    },

    defaultPrefs: {
      lastMode: 'classic',
      abilityPrefs: []
    },

    render(ctx) {
      if (!ctx.state) ctx.setState(setupState(ctx.prefs.lastMode, ctx.prefs.abilityPrefs));
      return ctx.state.phase === 'play' ? renderPlay(ctx.state) : renderSetup(ctx.state);
    },

    bind(ctx) {
      removeKeyHandler();

      if (ctx.state.phase === 'setup') {
        ctx.$$('.mode-card').forEach((button) => button.addEventListener('click', () => {
          const modeId = button.dataset.mode;
          ctx.setState(setupState(modeId, MODES[modeId].defaultNewAbilities));
          ctx.render();
        }));

        ctx.$$('.ability-toggle input').forEach((input) => input.addEventListener('change', () => {
          const ability = input.dataset.ability;
          const selected = new Set(ctx.state.newAbilities);
          if (input.checked) selected.add(ability);
          else selected.delete(ability);
          ctx.state.newAbilities = [...selected];
          ctx.render();
        }));

        ctx.$('#startBtn')?.addEventListener('click', () => {
          const modeId = ctx.state.modeId;
          const abilities = [...ctx.state.newAbilities];
          ctx.updatePrefs({ lastMode: modeId, abilityPrefs: abilities });
          ctx.setState(playState(modeId, abilities));
          ctx.beep(560, 0.06);
          ctx.render();
        }, { once: true });
        return;
      }

      ctx.$$('.draw-btn').forEach((button) => button.addEventListener('click', () => {
        drawCard(ctx, Number(button.dataset.slot));
      }, { once: true }));

      ctx.$('#modeBtn')?.addEventListener('click', () => {
        ctx.setState(setupState(ctx.state.modeId, ctx.state.newAbilities));
        ctx.render();
      });

      ctx.$('#replayBtn')?.addEventListener('click', () => {
        ctx.setState(playState(ctx.state.modeId, ctx.state.newAbilities));
        ctx.render();
      });

      keyHandler = (event) => {
        if (event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
        const slotIndex = Number(event.key) - 1;
        if (slotIndex >= 0 && slotIndex < SLOT_LABELS.length) drawCard(ctx, slotIndex);
      };
      document.addEventListener('keydown', keyHandler);
    },

    onReset(ctx) {
      removeKeyHandler();
      ctx.setState(playState(ctx.prefs.lastMode, ctx.prefs.abilityPrefs));
    }
  };

  global.MIAW_GAME = game;
}(window));
