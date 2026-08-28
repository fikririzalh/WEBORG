(function (global) {
  'use strict';

  const PLAYER_STYLES = [
    { key: 'red', label: 'Red', dot: '🔴' },
    { key: 'blue', label: 'Blue', dot: '🔵' },
    { key: 'green', label: 'Green', dot: '🟢' },
    { key: 'purple', label: 'Purple', dot: '🟣' }
  ];

  const CONFIGS = {
    p2: {
      id: 'p2', playerCount: 2, rows: 6, maxNumber: 10,
      label: 'Classic', kicker: 'ORIGINAL 2P',
      description: '6 baris · 21 lingkaran · angka 1–10.'
    },
    p3: {
      id: 'p3', playerCount: 3, rows: 7, maxNumber: 9,
      label: 'Trio', kicker: '3 PLAYER',
      description: '7 baris · 28 lingkaran · angka 1–9.'
    },
    p4arena: {
      id: 'p4arena', playerCount: 4, rows: 9, maxNumber: 11,
      label: 'Arena', kicker: 'MIAW 4P · RECOMMENDED',
      description: '9 baris · 45 lingkaran · angka 1–11.'
    },
    p4compact: {
      id: 'p4compact', playerCount: 4, rows: 6, maxNumber: 5,
      label: 'Compact', kicker: 'MIAW 4P · QUICK',
      description: '6 baris · 21 lingkaran · angka 1–5.'
    }
  };

  function triangularNumber(rows) {
    return (rows * (rows + 1)) / 2;
  }

  function assertConfig(config) {
    const cells = triangularNumber(config.rows);
    if (cells !== (config.playerCount * config.maxNumber) + 1) {
      throw new Error(`Invalid Black Hole config: ${config.id}`);
    }
    return config;
  }

  Object.values(CONFIGS).forEach(assertConfig);

  function configFor(playerCount, fourMode = 'arena') {
    if (playerCount === 2) return CONFIGS.p2;
    if (playerCount === 3) return CONFIGS.p3;
    return fourMode === 'compact' ? CONFIGS.p4compact : CONFIGS.p4arena;
  }

  function buildCells(rows) {
    const cells = [];
    let id = 0;
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col <= row; col += 1) {
        cells.push({ id, row, col });
        id += 1;
      }
    }
    return cells;
  }

  function coordKey(row, col) {
    return `${row}:${col}`;
  }

  function neighborIds(cells, cellId) {
    const cell = cells[cellId];
    if (!cell) return [];
    const index = new Map(cells.map((item) => [coordKey(item.row, item.col), item.id]));
    const candidates = [
      [cell.row, cell.col - 1],
      [cell.row, cell.col + 1],
      [cell.row - 1, cell.col - 1],
      [cell.row - 1, cell.col],
      [cell.row + 1, cell.col],
      [cell.row + 1, cell.col + 1]
    ];
    return candidates
      .map(([row, col]) => index.get(coordKey(row, col)))
      .filter((id) => Number.isInteger(id));
  }

  function scoreBlackHole(cells, placements, holeId, playerCount) {
    const adjacent = neighborIds(cells, holeId);
    const penalties = Array(playerCount).fill(0);
    const breakdown = Array.from({ length: playerCount }, () => []);

    adjacent.forEach((id) => {
      const piece = placements[id];
      if (!piece) return;
      penalties[piece.player] += piece.number;
      breakdown[piece.player].push({ cellId: id, number: piece.number });
    });

    const lowest = Math.min(...penalties);
    const winners = penalties
      .map((score, index) => ({ score, index }))
      .filter((item) => item.score === lowest)
      .map((item) => item.index);

    return { adjacent, penalties, breakdown, lowest, winners };
  }

  function playerLabel(index) {
    return PLAYER_STYLES[index] || PLAYER_STYLES[0];
  }

  function defaultNames() {
    return ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
  }

  function homePreview() {
    const rows = 6;
    const sample = {
      0: ['red', 1], 2: ['blue', 1], 4: ['red', 2], 6: ['blue', 2],
      8: ['red', 4], 10: ['blue', 4], 12: ['red', 7], 14: ['blue', 6],
      16: ['blue', 9], 18: ['red', 9], 20: ['red', 10]
    };
    let index = 0;
    return `
      <div class="bh-preview" aria-hidden="true">
        ${Array.from({ length: rows }, (_, row) => `
          <div class="bh-preview-row">
            ${Array.from({ length: row + 1 }, () => {
              const value = sample[index];
              const current = index;
              index += 1;
              if (current === 17) return '<span class="preview-hole">⚫</span>';
              if (!value) return '<span class="preview-cell empty"></span>';
              return `<span class="preview-cell ${value[0]}">${value[1]}</span>`;
            }).join('')}
          </div>
        `).join('')}
      </div>
    `;
  }

  function home() {
    return `
      <section class="hero blackhole-hero">
        <div class="panel hero-main">
          <div class="eyebrow">MIAW NUMBER STRATEGY</div>
          <div class="hero-title"><span class="low-word">PLACE LOW.</span><br><span class="hole-word">FEAR THE HOLE.</span></div>
          <p class="hero-copy">Tempatkan angka milikmu secara berurutan ke sembarang lingkaran kosong. Satu lingkaran terakhir menjadi Black Hole dan hanya angka yang menyentuhnya yang dihitung. Skor terendah menang.</p>
          <div class="button-row">
            <button class="primary-btn big" id="setupBtn" type="button">⚫ Mulai Black Hole</button>
          </div>
          <div class="mini-rules">
            <div class="mini-rule"><strong>2–4</strong><span>PLAYERS</span></div>
            <div class="mini-rule"><strong>1</strong><span>FINAL HOLE</span></div>
            <div class="mini-rule"><strong>↓</strong><span>LOWEST WINS</span></div>
          </div>
        </div>
        <aside class="panel rules-panel">
          ${homePreview()}
          <div class="rule-stack">
            <div class="rule-card"><b>Urutan wajib naik.</b><span>Setiap pemain memasang 1, lalu 2, lalu 3, dan seterusnya. Lokasinya bebas.</span></div>
            <div class="rule-card dark-rule"><b>Satu sel tersisa.</b><span>Setelah seluruh angka habis, lingkaran kosong terakhir otomatis menjadi Black Hole.</span></div>
            <div class="rule-card green-rule"><b>Hanya tetangga langsung.</b><span>Jumlahkan angka warnamu yang bersentuhan langsung dengan Black Hole. Nilai terkecil menang.</span></div>
          </div>
        </aside>
      </section>
    `;
  }

  function setup(ctx) {
    const prefsCount = Number(ctx.prefs.blackHolePlayerCount) || 2;
    const draft = ctx.state || {
      phase: 'setup',
      playerCount: [2, 3, 4].includes(prefsCount) ? prefsCount : 2,
      fourMode: ctx.prefs.blackHoleFourMode === 'compact' ? 'compact' : 'arena',
      names: (ctx.prefs.names && ctx.prefs.names.length ? [...ctx.prefs.names] : defaultNames()).slice(0, 4)
    };
    while (draft.names.length < 4) draft.names.push(defaultNames()[draft.names.length]);
    const config = configFor(draft.playerCount, draft.fourMode);

    return `
      <section class="panel setup-panel">
        <div class="eyebrow">GAME SETUP</div>
        <h2>Pilih jumlah pemain.</h2>
        <p class="hero-copy">Papan menyesuaikan jumlah pemain agar setelah semua angka ditempatkan selalu tersisa tepat satu Black Hole.</p>

        <div class="setup-section">
          <div class="setup-section-head"><h3>Players</h3><span>Single device · open information</span></div>
          <div class="player-count-grid">
            ${[2, 3, 4].map((count) => `
              <button class="count-choice ${draft.playerCount === count ? 'active' : ''}" data-player-count="${count}" type="button">
                <strong>${count}</strong><span>PLAYERS</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="setup-section">
          <div class="setup-section-head"><h3>Player names</h3><span>Warna tetap selama match.</span></div>
          <div class="names-grid names-${draft.playerCount}">
            ${Array.from({ length: draft.playerCount }, (_, index) => {
              const style = playerLabel(index);
              return `
                <label class="field player-name-field ${style.key}">
                  <span><i class="color-dot"></i>${style.label}</span>
                  <input data-name-index="${index}" maxlength="22" value="${ctx.escapeHTML(draft.names[index] || defaultNames()[index])}">
                </label>
              `;
            }).join('')}
          </div>
        </div>

        ${draft.playerCount === 4 ? `
          <div class="setup-section">
            <div class="setup-section-head"><h3>4-player board</h3><span>Arena memberi lebih banyak keputusan.</span></div>
            <div class="choice-grid">
              <button class="choice ${draft.fourMode === 'arena' ? 'active' : ''}" data-four-mode="arena" type="button">
                <span class="choice-kicker">RECOMMENDED</span><b>Arena · 9 rows</b><small>45 sel, angka 1–11 per pemain.</small>
              </button>
              <button class="choice ${draft.fourMode === 'compact' ? 'active' : ''}" data-four-mode="compact" type="button">
                <span class="choice-kicker">QUICK MATCH</span><b>Compact · 6 rows</b><small>21 sel, angka 1–5 per pemain.</small>
              </button>
            </div>
          </div>
        ` : ''}

        <div class="board-config-card">
          <div><span class="eyebrow">${config.kicker}</span><b>${config.label}</b><small>${config.description}</small></div>
          <div class="config-math"><strong>${triangularNumber(config.rows)}</strong><span>CELLS</span></div>
          <div class="config-math"><strong>${config.maxNumber}</strong><span>MAX #</span></div>
        </div>

        <div class="note">Aturan 2-player adalah format klasik. Format 3-player memakai 7 baris/1–9. Format 4-player adalah ekstensi MIAW yang menjaga persamaan <b>jumlah sel = (pemain × angka per pemain) + 1</b>.</div>

        <div class="button-row setup-actions">
          <button class="primary-btn big" id="beginBtn" type="button">Mulai Game</button>
          <button class="secondary-btn" id="cancelBtn" type="button">Batal</button>
        </div>
      </section>
    `;
  }

  function createGameState(names, config) {
    const cells = buildCells(config.rows);
    return {
      phase: 'playing',
      players: names.map((name, index) => ({ name, style: playerLabel(index) })),
      config,
      cells,
      placements: Array(cells.length).fill(null),
      turn: MIAWTurnEngine.createTurnState(config.playerCount),
      nextNumbers: Array(config.playerCount).fill(1),
      history: [],
      moveCount: 0,
      blackHoleId: null,
      adjacentIds: [],
      penalties: null,
      breakdown: null,
      winners: [],
      lowestScore: null
    };
  }

  function playerCards(state) {
    return state.players.map((player, index) => {
      const active = state.phase === 'playing' && state.turn.turn === index;
      const score = state.penalties ? state.penalties[index] : null;
      const next = state.nextNumbers[index];
      return `
        <article class="bh-player-card ${player.style.key} ${active ? 'active' : ''}">
          <div class="bh-player-head">
            <span class="color-tag"><i class="color-dot"></i>${player.style.label.toUpperCase()}</span>
            ${active ? '<span class="turn-chip">YOUR TURN</span>' : ''}
          </div>
          <h3>${MIAWBase.escapeHTML(player.name)}</h3>
          ${state.phase === 'result'
            ? `<div class="score-display"><strong>${score}</strong><span>BLACK HOLE PENALTY</span></div>`
            : `<div class="score-display"><strong>${next <= state.config.maxNumber ? next : '✓'}</strong><span>${next <= state.config.maxNumber ? 'NEXT NUMBER' : 'ALL PLACED'}</span></div>`}
        </article>
      `;
    }).join('');
  }

  function boardRows(state) {
    const adjacent = new Set(state.adjacentIds || []);
    return Array.from({ length: state.config.rows }, (_, row) => {
      const rowCells = state.cells.filter((cell) => cell.row === row);
      return `
        <div class="bh-row">
          ${rowCells.map((cell) => {
            const piece = state.placements[cell.id];
            const isHole = state.blackHoleId === cell.id;
            const classes = ['bh-cell'];
            if (piece) classes.push('filled', state.players[piece.player].style.key);
            if (isHole) classes.push('black-hole');
            if (adjacent.has(cell.id)) classes.push('adjacent-hole');
            const label = isHole
              ? 'Black Hole'
              : piece
                ? `${state.players[piece.player].name}, angka ${piece.number}`
                : `Lingkaran kosong baris ${cell.row + 1}, posisi ${cell.col + 1}`;
            return `
              <button class="${classes.join(' ')}" data-cell="${cell.id}" type="button" aria-label="${MIAWBase.escapeHTML(label)}" ${state.phase !== 'playing' || piece ? 'disabled' : ''}>
                ${isHole ? '<span class="hole-core">⚫</span>' : piece ? `<strong>${piece.number}</strong>` : '<span class="empty-dot"></span>'}
              </button>
            `;
          }).join('')}
        </div>
      `;
    }).join('');
  }

  function historyList(state) {
    if (!state.history.length) return '<div class="empty-history">Belum ada angka ditempatkan.</div>';
    return [...state.history].reverse().slice(0, 10).map((move) => {
      const player = state.players[move.player];
      return `
        <div class="history-item">
          <span class="history-color ${player.style.key}"></span>
          <div><b>${MIAWBase.escapeHTML(player.name)}</b><small>Baris ${move.row + 1} · posisi ${move.col + 1}</small></div>
          <strong>${move.number}</strong>
        </div>
      `;
    }).join('');
  }

  function gameScreen(state) {
    const active = state.players[state.turn.turn];
    const placedTarget = state.placements.length - 1;
    return `
      <section class="game-layout blackhole-layout">
        <div class="panel board-panel">
          <div class="game-toolbar">
            <div class="status-group">
              <span class="pill">${state.config.playerCount} PLAYERS</span>
              <span class="pill">${state.config.rows} ROWS</span>
              <span class="pill">${state.moveCount}/${placedTarget} PLACED</span>
            </div>
            <span class="pill dark-pill">⚫ 1 HOLE LEFT</span>
          </div>

          <div class="turn-banner ${active.style.key}">
            <div>
              <span class="eyebrow">TURN ${state.turn.turnNumber}</span>
              <strong>${MIAWBase.escapeHTML(active.name)}</strong>
              <small>Tempatkan angka <b>${state.nextNumbers[state.turn.turn]}</b> ke lingkaran kosong mana saja.</small>
            </div>
            <div class="next-number">${state.nextNumbers[state.turn.turn]}</div>
          </div>

          <div class="pyramid-wrap rows-${state.config.rows}">
            <div class="pyramid-board" style="--row-count:${state.config.rows}">${boardRows(state)}</div>
          </div>
          <p class="board-hint">Tidak perlu terhubung dengan angka sebelumnya. Pilih satu lingkaran kosong.</p>
        </div>

        <aside class="side-panel blackhole-side">
          <div class="players-stack">${playerCards(state)}</div>
          <div class="stats-card">
            <div class="section-heading"><b>Recent moves</b><span class="eyebrow">LATEST 10</span></div>
            <div class="history-list">${historyList(state)}</div>
          </div>
        </aside>
      </section>
    `;
  }

  function equation(items) {
    if (!items.length) return '<span class="zero-score">0 · tidak ada angka yang menyentuh hole</span>';
    return `${items.map((item) => `<span>${item.number}</span>`).join('<i>+</i>')}`;
  }

  function resultScreen(state) {
    const winnerNames = state.winners.map((index) => MIAWBase.escapeHTML(state.players[index].name));
    const tied = state.winners.length > 1;
    return `
      <section class="result-shell">
        <div class="panel result-card blackhole-result">
          <div class="result-icon hole-result-icon">⚫</div>
          <div class="eyebrow">BLACK HOLE REVEALED</div>
          <h2 class="result-title">${tied ? 'Shared Win.' : `${winnerNames[0]} Wins.`}</h2>
          <p class="result-copy">${tied
            ? `${winnerNames.join(' & ')} berbagi skor terendah <b>${state.lowestScore}</b>.`
            : `${winnerNames[0]} memiliki Black Hole penalty paling rendah: <b>${state.lowestScore}</b>.`}</p>

          <div class="final-board-wrap">
            <div class="pyramid-board result-board" style="--row-count:${state.config.rows}">${boardRows(state)}</div>
          </div>
          <div class="adjacency-legend"><span class="legend-hole">⚫ Black Hole</span><span class="legend-touch">◎ Sel yang dihitung</span></div>

          <div class="score-table">
            ${state.players.map((player, index) => `
              <article class="score-row ${player.style.key} ${state.winners.includes(index) ? 'winner' : ''}">
                <div class="score-player"><span class="history-color ${player.style.key}"></span><div><b>${MIAWBase.escapeHTML(player.name)}</b><small>${state.winners.includes(index) ? 'LOWEST SCORE · WINNER' : 'FINAL PENALTY'}</small></div></div>
                <div class="score-equation">${equation(state.breakdown[index])}</div>
                <strong class="final-score">${state.penalties[index]}</strong>
              </article>
            `).join('')}
          </div>

          <div class="button-row centered result-actions">
            <button class="primary-btn big" id="rematchBtn" type="button">🔁 Rematch</button>
            <button class="secondary-btn" id="setupAgainBtn" type="button">⚙️ Ubah Setup</button>
            <button class="secondary-btn" id="homeBtn" type="button">🏠 Home</button>
          </div>
        </div>
      </section>
    `;
  }

  function finishGame(state) {
    const holeId = state.placements.findIndex((item) => item === null);
    const scored = scoreBlackHole(state.cells, state.placements, holeId, state.config.playerCount);
    state.blackHoleId = holeId;
    state.adjacentIds = scored.adjacent;
    state.penalties = scored.penalties;
    state.breakdown = scored.breakdown;
    state.lowestScore = scored.lowest;
    state.winners = scored.winners;
    state.phase = 'result';
  }

  function placeNumber(ctx, cellId) {
    const state = ctx.state;
    if (state.phase !== 'playing' || state.placements[cellId]) return;
    const player = state.turn.turn;
    const number = state.nextNumbers[player];
    if (number > state.config.maxNumber) return;

    const cell = state.cells[cellId];
    state.placements[cellId] = { player, number };
    state.nextNumbers[player] += 1;
    state.moveCount += 1;
    state.history.push({ player, number, cellId, row: cell.row, col: cell.col });

    if (state.moveCount === state.placements.length - 1) {
      finishGame(state);
      ctx.beep(180, 0.16);
    } else {
      state.turn = MIAWTurnEngine.advanceTurn(state.turn);
      ctx.beep(520 + (number * 18), 0.045);
    }
    ctx.render();
  }

  function rematchState(state) {
    return createGameState(state.players.map((player) => player.name), state.config);
  }

  const game = {
    meta: {
      id: 'miaw-blackhole',
      title: 'MIAW · BLACK HOLE',
      subtitle: 'Place low. Trap smart. Fear the final hole.',
      eyebrow: '2–4 PLAYER NUMBER STRATEGY'
    },

    defaultPrefs: {
      names: defaultNames(),
      blackHolePlayerCount: 2,
      blackHoleFourMode: 'arena'
    },

    render(ctx) {
      if (!ctx.state) return home();
      if (ctx.state.phase === 'setup') return setup(ctx);
      if (ctx.state.phase === 'playing') return gameScreen(ctx.state);
      if (ctx.state.phase === 'result') return resultScreen(ctx.state);
      return '<section class="panel"><h2>Unknown phase</h2></section>';
    },

    bind(ctx) {
      ctx.$('#setupBtn')?.addEventListener('click', () => {
        const prefsCount = Number(ctx.prefs.blackHolePlayerCount) || 2;
        ctx.setState({
          phase: 'setup',
          playerCount: [2, 3, 4].includes(prefsCount) ? prefsCount : 2,
          fourMode: ctx.prefs.blackHoleFourMode === 'compact' ? 'compact' : 'arena',
          names: (ctx.prefs.names && ctx.prefs.names.length ? [...ctx.prefs.names] : defaultNames()).slice(0, 4)
        });
        ctx.render();
      });

      ctx.$('#cancelBtn')?.addEventListener('click', ctx.goHome);

      ctx.$$('[data-name-index]').forEach((input) => {
        input.addEventListener('input', () => {
          const index = Number(input.dataset.nameIndex);
          ctx.state.names[index] = input.value;
        });
      });

      ctx.$$('[data-player-count]').forEach((button) => {
        button.addEventListener('click', () => {
          ctx.state.playerCount = Number(button.dataset.playerCount);
          ctx.render();
        });
      });

      ctx.$$('[data-four-mode]').forEach((button) => {
        button.addEventListener('click', () => {
          ctx.state.fourMode = button.dataset.fourMode;
          ctx.render();
        });
      });

      ctx.$('#beginBtn')?.addEventListener('click', () => {
        const count = ctx.state.playerCount;
        const names = ctx.state.names.slice(0, count).map((name, index) => name.trim() || defaultNames()[index]);
        const config = configFor(count, ctx.state.fourMode);
        const storedNames = [...names];
        while (storedNames.length < 4) storedNames.push(defaultNames()[storedNames.length]);
        ctx.updatePrefs({
          names: storedNames,
          blackHolePlayerCount: count,
          blackHoleFourMode: ctx.state.fourMode
        });
        ctx.setState(createGameState(names, config));
        ctx.beep(720, 0.07);
        ctx.render();
      });

      ctx.$$('[data-cell]').forEach((button) => {
        button.addEventListener('click', () => placeNumber(ctx, Number(button.dataset.cell)));
      });

      ctx.$('#rematchBtn')?.addEventListener('click', () => {
        ctx.setState(rematchState(ctx.state));
        ctx.beep(700, 0.06);
        ctx.render();
      });

      ctx.$('#setupAgainBtn')?.addEventListener('click', () => {
        ctx.setState({
          phase: 'setup',
          playerCount: ctx.state.config.playerCount,
          fourMode: ctx.state.config.id === 'p4compact' ? 'compact' : 'arena',
          names: Array.from({ length: 4 }, (_, index) => ctx.state.players[index]?.name || defaultNames()[index])
        });
        ctx.render();
      });

      ctx.$('#homeBtn')?.addEventListener('click', ctx.goHome);
    }
  };

  global.MIAWBlackHoleRules = {
    CONFIGS,
    triangularNumber,
    configFor,
    buildCells,
    neighborIds,
    scoreBlackHole
  };
  global.MIAW_GAME = game;
}(window));
