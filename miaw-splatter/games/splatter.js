(function (global) {
  'use strict';

  const BOARD_MODES = {
    quick: { id: 'quick', label: 'Quick', size: 4, description: '4×4 · 8 dot per pemain' },
    classic: { id: 'classic', label: 'Classic', size: 6, description: '6×6 · 18 dot per pemain' },
    long: { id: 'long', label: 'Long', size: 8, description: '8×8 · 32 dot per pemain' }
  };

  const SETUP_MODES = {
    random: { id: 'random', label: 'Quick Random', description: 'Board seimbang dibuat otomatis.' },
    strategic: { id: 'strategic', label: 'Strategic Placement', description: 'Bergantian menaruh dot sendiri sampai board penuh.' }
  };

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function createBalancedBoard(size) {
    const total = size * size;
    const half = total / 2;
    return shuffle([
      ...Array(half).fill(0),
      ...Array(half).fill(1)
    ]);
  }

  function countAlive(board, player) {
    return board.reduce((sum, owner) => sum + (owner === player ? 1 : 0), 0);
  }

  function getAffectedIndices(index, size, pattern) {
    if (pattern === 'solo') return [index];

    const row = Math.floor(index / size);
    const col = index % size;
    const affected = [];

    for (let dr = -1; dr <= 1; dr += 1) {
      for (let dc = -1; dc <= 1; dc += 1) {
        const r = row + dr;
        const c = col + dc;
        if (r >= 0 && r < size && c >= 0 && c < size) affected.push(r * size + c);
      }
    }
    return affected;
  }

  function applySplatter(board, index, size, pattern) {
    const next = [...board];
    const affected = getAffectedIndices(index, size, pattern);
    affected.forEach((cellIndex) => { next[cellIndex] = null; });
    return { board: next, affected };
  }

  function determineOutcome(board, activePlayer) {
    const alive = [countAlive(board, 0), countAlive(board, 1)];
    if (alive[0] === 0 && alive[1] === 0) return { winner: null, draw: true, alive };
    if (alive[0] === 0) return { winner: 1, draw: false, alive };
    if (alive[1] === 0) return { winner: 0, draw: false, alive };
    return { winner: null, draw: false, alive, activePlayer };
  }

  function createState(players, boardMode, setupMode) {
    const mode = BOARD_MODES[boardMode] || BOARD_MODES.classic;
    const size = mode.size;
    const randomSetup = setupMode === 'random';
    return {
      phase: randomSetup ? 'play' : 'placement',
      players,
      boardMode: mode.id,
      setupMode,
      size,
      board: randomSetup ? createBalancedBoard(size) : Array(size * size).fill(null),
      turn: MIAWTurnEngine.createTurnState(2),
      placementTurn: 0,
      placementCounts: [0, 0],
      quota: (size * size) / 2,
      selected: null,
      moveNumber: 1,
      lastMove: null,
      winner: null,
      draw: false,
      startingPlayer: 0
    };
  }

  function ownerName(state, owner) {
    return state.players[owner] || `Player ${owner + 1}`;
  }

  function playerCards(state, activeIndex) {
    const alive = [countAlive(state.board, 0), countAlive(state.board, 1)];
    return state.players.map((name, index) => `
      <article class="player-card ${activeIndex === index ? 'active' : ''}">
        <span class="player-dot p${index + 1}" aria-hidden="true"></span>
        <div>
          <b>${MIAWBase.escapeHTML(name)}</b>
          <small>${index === 0 ? 'BLUE' : 'PINK'}</small>
        </div>
        <div class="score-number">${state.phase === 'placement' ? `${state.placementCounts[index]}/${state.quota}` : alive[index]}</div>
      </article>
    `).join('');
  }

  function boardHTML(state, options = {}) {
    const active = options.active ?? state.turn.turn;
    const placement = state.phase === 'placement';
    return `
      <div class="splatter-board" style="--size:${state.size}" role="grid" aria-label="Splatter ${state.size} kali ${state.size}">
        ${state.board.map((owner, index) => {
          const row = Math.floor(index / state.size) + 1;
          const col = (index % state.size) + 1;
          const dead = owner === null && !placement;
          const classes = [
            'cell',
            owner === 0 ? 'owner-0' : '',
            owner === 1 ? 'owner-1' : '',
            dead ? 'dead' : '',
            state.selected === index ? 'selected' : '',
            state.lastMove?.affected?.includes(index) ? 'blasted' : ''
          ].filter(Boolean).join(' ');
          const label = placement
            ? (owner === null ? `Baris ${row} kolom ${col}, kosong` : `Baris ${row} kolom ${col}, ${ownerName(state, owner)}`)
            : (dead ? `Baris ${row} kolom ${col}, sudah tersplatter` : `Baris ${row} kolom ${col}, dot ${ownerName(state, owner)}`);
          return `
            <button class="${classes}" data-cell="${index}" type="button" role="gridcell" aria-label="${MIAWBase.escapeHTML(label)}" ${dead ? 'disabled' : ''}>
              ${owner === 0 || owner === 1 ? '<span class="paint-dot" aria-hidden="true"></span>' : ''}
              ${dead ? '<span class="dead-mark" aria-hidden="true"></span>' : ''}
              <span class="cell-coordinate">${row},${col}</span>
            </button>
          `;
        }).join('')}
      </div>
    `;
  }

  function home() {
    return `
      <section class="hero">
        <div class="panel hero-main">
          <div class="eyebrow">TACTICAL ELIMINATION</div>
          <div class="hero-title">Paint.<br>Splatter.<br>Survive.</div>
          <p class="hero-copy">Pilih salah satu dot milikmu. Hancurkan hanya dot itu, atau ledakkan seluruh area 3×3. Friendly fire diperbolehkan. Warna terakhir yang masih punya dot menang.</p>
          <div class="button-row">
            <button class="primary-btn big" id="setupBtn" type="button">🎨 Mulai Splatter</button>
          </div>
          <div class="note"><b>Tanpa hint aman.</b> Game tidak akan memberi tahu apakah Full Splatter menghabiskan dot milikmu sendiri. Hitung trade-off-nya sendiri.</div>
        </div>
        <div class="panel">
          <div class="eyebrow">CORE RULES</div>
          <div class="feature-grid">
            <div class="feature"><b>2 pemain</b><span>Single device, bergantian.</span></div>
            <div class="feature"><b>Solo</b><span>Hanya sel yang dipilih mati.</span></div>
            <div class="feature"><b>Full</b><span>Sel + semua tetangga 8 arah.</span></div>
            <div class="feature"><b>Last color</b><span>Jika dua warna habis bersamaan: draw.</span></div>
          </div>
          <ul class="rules-list">
            <li>Hanya dot milik sendiri yang boleh dipilih sebagai pusat splatter.</li>
            <li>Dot lawan boleh ikut mati karena area ledakan.</li>
            <li>Sel yang tersplatter tidak pernah kembali.</li>
            <li>Pass tidak tersedia.</li>
          </ul>
        </div>
      </section>
    `;
  }

  function setup(ctx) {
    const names = ctx.prefs.names || ['Oyen', 'Mochi'];
    const boardMode = ctx.prefs.boardMode || 'classic';
    const setupMode = ctx.prefs.setupMode || 'random';
    return `
      <section class="panel narrow-panel">
        <div class="eyebrow">GAME SETUP</div>
        <h2>Siapkan arena cat</h2>
        <p class="hero-copy">Classic menggunakan 6×6. Quick dan Long adalah variasi MIAW untuk pertandingan lebih singkat atau lebih panjang.</p>

        <div class="setup-grid">
          <label class="field">Player Blue<input id="nameA" maxlength="24" value="${ctx.escapeHTML(names[0] || 'Player Blue')}"></label>
          <label class="field">Player Pink<input id="nameB" maxlength="24" value="${ctx.escapeHTML(names[1] || 'Player Pink')}"></label>
        </div>

        <div class="option-section">
          <h3>Ukuran board</h3>
          <div class="option-grid">
            ${Object.values(BOARD_MODES).map((mode) => `
              <label class="option-card">
                <input type="radio" name="boardMode" value="${mode.id}" ${boardMode === mode.id ? 'checked' : ''}>
                <span class="option-body"><b>${mode.label}</b><span>${mode.description}</span></span>
              </label>
            `).join('')}
          </div>
        </div>

        <div class="option-section">
          <h3>Setup dot</h3>
          <div class="option-grid two">
            ${Object.values(SETUP_MODES).map((mode) => `
              <label class="option-card">
                <input type="radio" name="setupMode" value="${mode.id}" ${setupMode === mode.id ? 'checked' : ''}>
                <span class="option-body"><b>${mode.label}</b><span>${mode.description}</span></span>
              </label>
            `).join('')}
          </div>
        </div>

        <div class="button-row">
          <button class="primary-btn big" id="beginBtn" type="button">Mulai Game</button>
          <button class="secondary-btn" id="cancelBtn" type="button">Batal</button>
        </div>
        <div class="note">Pada Strategic Placement, Player Blue menaruh dot pertama. Setelah board penuh, <b>Player Pink yang mulai fase Splatter</b> sebagai kompensasi karena menaruh dot kedua.</div>
      </section>
    `;
  }

  function placement(state) {
    const active = state.placementTurn;
    const remaining = state.quota - state.placementCounts[active];
    return `
      <section class="game-layout">
        <div class="panel board-panel">
          <div class="turn-banner">
            <div>
              <span class="phase-pill">STRATEGIC PLACEMENT</span>
              <strong>${MIAWBase.escapeHTML(ownerName(state, active))}</strong>
            </div>
            <span>${remaining} dot lagi</span>
          </div>
          <div class="player-grid">${playerCards(state, active)}</div>
          <p class="setup-hint">Pilih satu sel kosong untuk menaruh dot warna milikmu. Kedua pemain harus berakhir dengan jumlah dot yang sama.</p>
          ${boardHTML(state, { active })}
        </div>
        <aside class="panel side-panel">
          <div class="stat-card"><span>Board</span><b>${state.size}×${state.size}</b></div>
          <div class="stat-card"><span>Isi per pemain</span><b>${state.quota}</b></div>
          <div class="note">Setup ini sendiri bagian dari strategi. Hindari membuat cluster yang mudah dimakan Full Splatter.</div>
        </aside>
      </section>
    `;
  }

  function play(state) {
    const active = state.turn.turn;
    const selectedOwner = state.selected === null ? null : state.board[state.selected];
    const canAct = selectedOwner === active;
    const alive = [countAlive(state.board, 0), countAlive(state.board, 1)];
    return `
      <section class="game-layout">
        <div class="panel board-panel">
          <div class="turn-banner">
            <div>
              <span class="phase-pill">MOVE ${state.moveNumber}</span>
              <strong>${MIAWBase.escapeHTML(ownerName(state, active))}'s turn</strong>
            </div>
            <span>${state.selected === null ? 'Pilih dot milikmu' : 'Pilih jenis splatter'}</span>
          </div>
          <div class="player-grid">${playerCards(state, active)}</div>
          ${boardHTML(state)}
        </div>
        <aside class="panel side-panel">
          <div class="stat-card"><span>Blue tersisa</span><b>${alive[0]}</b></div>
          <div class="stat-card"><span>Pink tersisa</span><b>${alive[1]}</b></div>
          <div class="action-stack">
            <button class="action-btn primary-action" id="soloBtn" type="button" ${canAct ? '' : 'disabled'}>
              <strong>💧 Solo Splatter</strong><span>Hancurkan hanya dot yang dipilih.</span>
            </button>
            <button class="action-btn" id="fullBtn" type="button" ${canAct ? '' : 'disabled'}>
              <strong>💥 Full Splatter</strong><span>Dot + seluruh tetangga 8 arah.</span>
            </button>
          </div>
          <div class="note">Friendly fire aktif. Full Splatter dapat menghapus dot milikmu sendiri, termasuk dot terakhir.</div>
        </aside>
      </section>
    `;
  }

  function final(state) {
    const alive = [countAlive(state.board, 0), countAlive(state.board, 1)];
    const title = state.draw ? 'DRAW' : MIAWBase.escapeHTML(ownerName(state, state.winner));
    const subtitle = state.draw
      ? 'Kedua warna habis dalam splatter yang sama.'
      : `${MIAWBase.escapeHTML(ownerName(state, state.winner))} adalah warna terakhir yang masih bertahan.`;
    return `
      <section class="panel">
        <div class="result-screen">
          <div class="big-emoji">${state.draw ? '💥🤝' : '🏆🎨'}</div>
          <div class="eyebrow">GAME OVER</div>
          <div class="win-title">${title}</div>
          <p class="hero-copy">${subtitle}</p>
          <div class="player-grid final-grid">${playerCards(state, -1)}</div>
          <div class="note">Final survivor: Blue ${alive[0]} · Pink ${alive[1]} · Total move ${state.moveNumber - 1}</div>
          <div class="button-row centered" style="margin-top:14px">
            <button class="primary-btn big" id="rematchBtn" type="button">🔁 Rematch</button>
            <button class="secondary-btn" id="setupAgainBtn" type="button">⚙️ Ubah Setup</button>
            <button class="secondary-btn" id="homeBtn" type="button">🏠 Home</button>
          </div>
        </div>
      </section>
    `;
  }

  function chooseCell(ctx, index) {
    const state = ctx.state;

    if (state.phase === 'placement') {
      if (state.board[index] !== null) {
        ctx.toast('Sel itu sudah terisi.');
        return;
      }
      const active = state.placementTurn;
      state.board[index] = active;
      state.placementCounts[active] += 1;

      const full = state.placementCounts[0] === state.quota && state.placementCounts[1] === state.quota;
      if (full) {
        state.phase = 'play';
        state.turn = MIAWTurnEngine.createTurnState(2, { startPlayer: 1 });
        state.startingPlayer = 1;
        state.moveNumber = 1;
        ctx.beep(790, 0.08);
      } else {
        const other = 1 - active;
        if (state.placementCounts[other] < state.quota) state.placementTurn = other;
      }
      ctx.render();
      return;
    }

    if (state.phase !== 'play') return;
    const active = state.turn.turn;
    const owner = state.board[index];
    if (owner === null) return;
    if (owner !== active) {
      ctx.toast('Pilih paint dot milikmu sendiri.');
      ctx.beep(240, 0.04);
      return;
    }
    state.selected = state.selected === index ? null : index;
    ctx.beep(state.selected === null ? 390 : 620, 0.035);
    ctx.render();
  }

  function doSplatter(ctx, pattern) {
    const state = ctx.state;
    if (state.phase !== 'play' || state.selected === null) return;
    const active = state.turn.turn;
    if (state.board[state.selected] !== active) return;

    const selected = state.selected;
    const result = applySplatter(state.board, selected, state.size, pattern);
    const outcome = determineOutcome(result.board, active);

    state.board = result.board;
    state.lastMove = {
      player: active,
      index: selected,
      pattern,
      affected: result.affected
    };
    state.selected = null;
    state.moveNumber += 1;

    if (outcome.draw || outcome.winner !== null) {
      state.draw = outcome.draw;
      state.winner = outcome.winner;
      state.phase = 'final';
      ctx.beep(outcome.draw ? 440 : 920, 0.12);
    } else {
      state.turn = MIAWTurnEngine.advanceTurn(state.turn);
      ctx.beep(pattern === 'full' ? 280 : 540, pattern === 'full' ? 0.09 : 0.05);
    }
    ctx.render();
  }

  const game = {
    meta: {
      id: 'miaw-splatter',
      title: 'MIAW · SPLATTER',
      subtitle: 'Sacrifice paint. Erase the opponent. Be the last color standing.',
      eyebrow: '2 PLAYER TACTICAL BOARDGAME'
    },

    defaultPrefs: {
      names: ['Oyen', 'Mochi'],
      boardMode: 'classic',
      setupMode: 'random'
    },

    render(ctx) {
      if (!ctx.state) return home();
      if (ctx.state.phase === 'setup') return setup(ctx);
      if (ctx.state.phase === 'placement') return placement(ctx.state);
      if (ctx.state.phase === 'play') return play(ctx.state);
      if (ctx.state.phase === 'final') return final(ctx.state);
      return '<section class="panel"><h2>Unknown phase</h2></section>';
    },

    bind(ctx) {
      ctx.$('#setupBtn')?.addEventListener('click', () => {
        ctx.setState({ phase: 'setup' });
        ctx.render();
      });

      ctx.$('#cancelBtn')?.addEventListener('click', ctx.goHome);

      ctx.$('#beginBtn')?.addEventListener('click', () => {
        const a = ctx.$('#nameA').value.trim() || 'Player Blue';
        const b = ctx.$('#nameB').value.trim() || 'Player Pink';
        const boardMode = ctx.$('input[name="boardMode"]:checked')?.value || 'classic';
        const setupMode = ctx.$('input[name="setupMode"]:checked')?.value || 'random';
        ctx.updatePrefs({ names: [a, b], boardMode, setupMode });
        const state = createState([a, b], boardMode, setupMode);
        ctx.setState(state);
        ctx.beep(760, 0.06);
        ctx.render();
      });

      ctx.$$('.cell[data-cell]').forEach((button) => {
        button.addEventListener('click', () => chooseCell(ctx, Number(button.dataset.cell)));
      });

      ctx.$('#soloBtn')?.addEventListener('click', () => doSplatter(ctx, 'solo'));
      ctx.$('#fullBtn')?.addEventListener('click', () => doSplatter(ctx, 'full'));

      ctx.$('#rematchBtn')?.addEventListener('click', () => {
        const next = createState([...ctx.state.players], ctx.state.boardMode, ctx.state.setupMode);
        if (next.setupMode === 'random') {
          next.startingPlayer = 1 - (ctx.state.startingPlayer || 0);
          next.turn.turn = next.startingPlayer;
        }
        ctx.setState(next);
        ctx.render();
      });

      ctx.$('#setupAgainBtn')?.addEventListener('click', () => {
        ctx.setState({ phase: 'setup' });
        ctx.render();
      });

      ctx.$('#homeBtn')?.addEventListener('click', ctx.goHome);
    },

    _test: {
      BOARD_MODES,
      createBalancedBoard,
      countAlive,
      getAffectedIndices,
      applySplatter,
      determineOutcome,
      createState
    }
  };

  global.MIAW_GAME = game;
}(window));
