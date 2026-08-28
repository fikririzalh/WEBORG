(function (global) {
  'use strict';

  const MODES = {
    easy: { id: 'easy', label: 'Easy', size: 5, target: 4, detail: '5×5 · 4 in a row' },
    medium: { id: 'medium', label: 'Medium', size: 6, target: 5, detail: '6×6 · 5 in a row' },
    hard: { id: 'hard', label: 'Hard', size: 7, target: 6, detail: '7×7 · 6 in a row' }
  };

  const MATCH_TYPES = {
    quick: { id: 'quick', label: 'Quick Match', rounds: 1, detail: 'Satu ronde. Cepat dan langsung.' },
    duel: { id: 'duel', label: 'IQ Duel', rounds: 2, detail: 'Dua ronde. Role ditukar agar lebih adil.' }
  };

  const DIRECTIONS = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1]
  ];

  function cellIndex(row, col, size) {
    return row * size + col;
  }

  function inBounds(row, col, size) {
    return row >= 0 && row < size && col >= 0 && col < size;
  }

  function checkWinningLine(board, size, target) {
    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        const mark = board[cellIndex(row, col, size)];
        if (!mark) continue;

        for (const [dr, dc] of DIRECTIONS) {
          const prevRow = row - dr;
          const prevCol = col - dc;
          if (inBounds(prevRow, prevCol, size) && board[cellIndex(prevRow, prevCol, size)] === mark) continue;

          const run = [];
          let r = row;
          let c = col;
          while (inBounds(r, c, size) && board[cellIndex(r, c, size)] === mark) {
            run.push(cellIndex(r, c, size));
            r += dr;
            c += dc;
          }

          if (run.length >= target) {
            return { mark, cells: run, length: run.length };
          }
        }
      }
    }
    return null;
  }

  function createRoles(orderPlayerIndex) {
    return orderPlayerIndex === 0 ? ['order', 'chaos'] : ['chaos', 'order'];
  }

  function orderPlayerIndexForRound(state, roundNumber) {
    if (roundNumber === 1) return state.initialOrderPlayer;
    return state.initialOrderPlayer === 0 ? 1 : 0;
  }

  function startRound(state, roundNumber) {
    const orderPlayer = orderPlayerIndexForRound(state, roundNumber);
    const roles = createRoles(orderPlayer);
    const size = state.mode.size;
    state.roundNumber = roundNumber;
    state.roles = roles;
    state.board = Array(size * size).fill('');
    state.selectedMark = 'X';
    state.winningLine = null;
    state.lastMove = null;
    state.roundWinnerRole = null;
    state.roundWinnerPlayer = null;
    state.moveCount = 0;
    state.turn = MIAWTurnEngine.createTurnState(2, { startPlayer: orderPlayer });
    state.phase = 'playing';
    return state;
  }

  function createGameState({ players, modeId, matchTypeId, initialOrderPlayer }) {
    const state = {
      phase: 'playing',
      players,
      mode: MODES[modeId],
      matchType: MATCH_TYPES[matchTypeId],
      initialOrderPlayer,
      roundNumber: 1,
      roles: [],
      board: [],
      selectedMark: 'X',
      winningLine: null,
      lastMove: null,
      roundWinnerRole: null,
      roundWinnerPlayer: null,
      scores: [0, 0],
      moveCount: 0,
      totalMoveCount: 0,
      turn: null
    };
    return startRound(state, 1);
  }

  function roleLabel(role) {
    return role === 'order' ? 'ORDER' : 'CHAOS';
  }

  function home() {
    return `
      <section class="hero">
        <div class="panel hero-main">
          <div class="eyebrow">MIAW ABSTRACT STRATEGY</div>
          <div class="hero-title"><span class="order-word">ORDER</span><br><span class="chaos-word">CHAOS</span></div>
          <p class="hero-copy">Dua pemain. Satu papan. Kedua pihak boleh memainkan X atau O. Order membangun pola; Chaos memastikan pola itu tidak pernah selesai.</p>
          <div class="button-row">
            <button class="primary-btn big" id="setupBtn" type="button">Mulai Duel</button>
          </div>
          <div class="mini-rules">
            <div class="mini-rule"><strong>X / O</strong><span>KEDUANYA BOLEH MEMILIH</span></div>
            <div class="mini-rule"><strong>4 · 5 · 6</strong><span>TIGA TARGET GARIS</span></div>
            <div class="mini-rule"><strong>2P</strong><span>SINGLE DEVICE</span></div>
          </div>
        </div>
        <aside class="panel">
          <div class="eyebrow">CORE CONFLICT</div>
          <div class="rule-stack">
            <div class="rule-card">
              <b>ORDER membangun.</b>
              <span>Bentuk minimal N simbol identik dalam garis horizontal, vertikal, atau diagonal.</span>
            </div>
            <div class="rule-card chaos">
              <b>CHAOS mengacaukan.</b>
              <span>Penuhi papan tanpa pernah membiarkan garis kemenangan Order muncul.</span>
            </div>
            <div class="rule-card">
              <b>Tidak ada pemilik X/O.</b>
              <span>Di setiap giliran, Order maupun Chaos bebas memilih simbol yang akan ditempatkan.</span>
            </div>
          </div>
          <div class="note">Mode IQ Duel memainkan dua ronde dengan pertukaran role. Dengan demikian kedua pemain mendapat kesempatan menjadi Order dan Chaos.</div>
        </aside>
      </section>
    `;
  }

  function setup(ctx) {
    const savedNames = ctx.prefs.names || ['Player 1', 'Player 2'];
    const draft = ctx.state || { modeId: 'medium', matchTypeId: 'duel', initialOrderPlayer: 0, names: savedNames };
    const names = draft.names || savedNames;
    return `
      <section class="panel narrow-panel">
        <div class="eyebrow">MATCH SETUP</div>
        <h2>Atur duel.</h2>
        <p class="hero-copy">Order selalu memulai ronde. Dalam IQ Duel, role otomatis ditukar pada ronde kedua.</p>

        <div class="setup-grid">
          <label class="field">Player 1<input id="nameA" maxlength="22" value="${ctx.escapeHTML(names[0] || 'Player 1')}"></label>
          <label class="field">Player 2<input id="nameB" maxlength="22" value="${ctx.escapeHTML(names[1] || 'Player 2')}"></label>
        </div>

        <div class="setup-section">
          <div class="setup-section-head"><h3>Format pertandingan</h3><span>Pilih ritme permainan.</span></div>
          <div class="choice-grid">
            ${Object.values(MATCH_TYPES).map((item) => `
              <button class="choice ${draft.matchTypeId === item.id ? 'active' : ''}" data-match="${item.id}" type="button">
                <span class="choice-kicker">${item.rounds} ${item.rounds === 1 ? 'ROUND' : 'ROUNDS'}</span>
                <b>${item.label}</b><small>${item.detail}</small>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="setup-section">
          <div class="setup-section-head"><h3>Victory target</h3><span>Difficulty mengacu pada tantangan Order.</span></div>
          <div class="choice-grid three">
            ${Object.values(MODES).map((item) => `
              <button class="choice ${draft.modeId === item.id ? 'active' : ''}" data-mode="${item.id}" type="button">
                <span class="choice-kicker">${item.label}</span>
                <b>${item.target} in a row</b><small>${item.detail}</small>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="setup-section">
          <div class="setup-section-head"><h3>Order ronde pertama</h3><span>Chaos otomatis diberikan ke pemain lainnya.</span></div>
          <div class="choice-grid">
            <button class="choice ${draft.initialOrderPlayer === 0 ? 'active' : ''}" data-order-player="0" type="button">
              <span class="choice-kicker">ORDER</span><b id="orderChoiceA">${ctx.escapeHTML(names[0] || 'Player 1')}</b><small>Bergerak pertama pada ronde 1.</small>
            </button>
            <button class="choice ${draft.initialOrderPlayer === 1 ? 'active' : ''}" data-order-player="1" type="button">
              <span class="choice-kicker">ORDER</span><b id="orderChoiceB">${ctx.escapeHTML(names[1] || 'Player 2')}</b><small>Bergerak pertama pada ronde 1.</small>
            </button>
          </div>
        </div>

        <div class="button-row" style="margin-top:22px">
          <button class="primary-btn big" id="beginBtn" type="button">Mulai Pertandingan</button>
          <button class="secondary-btn" id="cancelBtn" type="button">Batal</button>
        </div>
      </section>
    `;
  }

  function boardHTML(state) {
    const winning = new Set(state.winningLine?.cells || []);
    return `
      <div class="board-wrap">
        <div class="board" style="--board-size:${state.mode.size}" role="grid" aria-label="Papan ${state.mode.size} kali ${state.mode.size}">
          ${state.board.map((mark, index) => {
            const classes = ['board-cell'];
            if (mark) classes.push(mark.toLowerCase());
            if (winning.has(index)) classes.push('winning');
            if (state.lastMove?.index === index) classes.push('last-move');
            const row = Math.floor(index / state.mode.size) + 1;
            const col = (index % state.mode.size) + 1;
            return `<button class="${classes.join(' ')}" data-cell="${index}" type="button" role="gridcell" aria-label="Baris ${row}, kolom ${col}${mark ? `, ${mark}` : ', kosong'}" ${mark || state.phase !== 'playing' ? 'disabled' : ''}></button>`;
          }).join('')}
        </div>
      </div>
    `;
  }

  function roleCard(state, playerIndex) {
    const role = state.roles[playerIndex];
    const isActive = state.turn.turn === playerIndex && state.phase === 'playing';
    return `
      <article class="role-card ${isActive ? `active-${role}` : ''}">
        <div class="role-head">
          <span class="${role === 'order' ? 'order-label' : 'chaos-label'}">${roleLabel(role)}</span>
          <span>P${playerIndex + 1}</span>
        </div>
        <h3>${MIAWBase.escapeHTML(state.players[playerIndex])}</h3>
        <p>${role === 'order' ? `Buat ${state.mode.target} simbol identik dalam satu garis.` : 'Cegah semua garis sampai papan penuh.'}</p>
        <div class="score-line"><span class="eyebrow">DUEL SCORE</span><strong>${state.scores[playerIndex]}</strong></div>
      </article>
    `;
  }

  function playing(state) {
    const active = state.turn.turn;
    const activeRole = state.roles[active];
    const occupied = state.board.filter(Boolean).length;
    return `
      <section class="game-layout">
        <div class="panel game-panel">
          <div class="game-toolbar">
            <div class="status-group">
              <span class="pill">${state.matchType.label}</span>
              <span class="pill">Round ${state.roundNumber}/${state.matchType.rounds}</span>
              <span class="pill">${state.mode.label} · ${state.mode.detail}</span>
            </div>
            <span class="pill">Move ${occupied + 1}</span>
          </div>

          <div class="turn-banner">
            <div>
              <small>Giliran sekarang</small>
              <strong>${MIAWBase.escapeHTML(state.players[active])}</strong>
            </div>
            <div class="turn-role ${activeRole}">${roleLabel(activeRole)}</div>
          </div>

          ${boardHTML(state)}

          <div class="mark-picker" aria-label="Pilih simbol">
            <button class="mark-btn ${state.selectedMark === 'X' ? 'active' : ''}" data-mark="X" type="button" aria-pressed="${state.selectedMark === 'X'}">X</button>
            <button class="mark-btn ${state.selectedMark === 'O' ? 'active' : ''}" data-mark="O" type="button" aria-pressed="${state.selectedMark === 'O'}">O</button>
          </div>
          <p class="mark-hint">Pilih X atau O, lalu tekan satu kotak kosong. Kedua role bebas memakai kedua simbol.</p>
        </div>

        <aside class="side-panel">
          ${roleCard(state, 0)}
          ${roleCard(state, 1)}
          <div class="stats-card">
            <div class="eyebrow">BOARD STATE</div>
            <div class="stats-grid" style="margin-top:10px">
              <div class="stat"><span>Board</span><b>${state.mode.size}×${state.mode.size}</b></div>
              <div class="stat"><span>Target</span><b>${state.mode.target}</b></div>
              <div class="stat"><span>Filled</span><b>${occupied}/${state.board.length}</b></div>
              <div class="stat"><span>Symbol</span><b>${state.selectedMark}</b></div>
            </div>
            <div class="note">Order menang segera setelah garis valid muncul, termasuk jika simbol terakhir justru dipasang oleh Chaos.</div>
          </div>
        </aside>
      </section>
    `;
  }

  function roundResult(state) {
    const winner = state.players[state.roundWinnerPlayer];
    const role = state.roundWinnerRole;
    const hasNextRound = state.roundNumber < state.matchType.rounds;
    const nextOrder = hasNextRound ? orderPlayerIndexForRound(state, state.roundNumber + 1) : null;
    return `
      <section class="result-shell">
        <div class="panel result-card">
          <div class="result-icon">${role === 'order' ? '◉' : '✦'}</div>
          <div class="eyebrow">ROUND ${state.roundNumber} COMPLETE</div>
          <h2 class="result-title">${MIAWBase.escapeHTML(winner)} menang.</h2>
          <p class="result-copy">${role === 'order' ? `${winner} sebagai Order berhasil membentuk ${state.mode.target}+ simbol ${state.winningLine?.mark || ''} dalam satu garis.` : `${winner} sebagai Chaos berhasil memenuhi seluruh papan tanpa memberikan garis kemenangan kepada Order.`}</p>
          <div class="duel-score">
            <div class="duel-player"><span>${MIAWBase.escapeHTML(state.players[0])}</span><b>${state.scores[0]}</b></div>
            <div class="duel-vs">VS</div>
            <div class="duel-player"><span>${MIAWBase.escapeHTML(state.players[1])}</span><b>${state.scores[1]}</b></div>
          </div>
          ${hasNextRound ? `<div class="note">Ronde berikutnya: <b>${MIAWBase.escapeHTML(state.players[nextOrder])}</b> menjadi Order. Kedua pemain bertukar role.</div>` : ''}
          <div class="button-row" style="justify-content:center;margin-top:18px">
            <button class="primary-btn big" id="continueRoundBtn" type="button">${hasNextRound ? 'Lanjut Ronde 2' : 'Lihat Hasil Akhir'}</button>
          </div>
        </div>
      </section>
    `;
  }

  function final(state) {
    const p0 = state.scores[0];
    const p1 = state.scores[1];
    const draw = p0 === p1;
    const winnerIndex = draw ? null : (p0 > p1 ? 0 : 1);
    return `
      <section class="result-shell">
        <div class="panel result-card">
          <div class="result-icon">${draw ? '⚖' : '♛'}</div>
          <div class="eyebrow">MATCH COMPLETE</div>
          <h2 class="result-title">${draw ? 'Duel berakhir imbang.' : `${MIAWBase.escapeHTML(state.players[winnerIndex])} menang.`}</h2>
          <p class="result-copy">${draw ? 'Kedua pemain memenangkan jumlah ronde yang sama setelah kesempatan role yang seimbang.' : `${MIAWBase.escapeHTML(state.players[winnerIndex])} mengungguli lawan pada format ${state.matchType.label}.`}</p>
          <div class="duel-score">
            <div class="duel-player"><span>${MIAWBase.escapeHTML(state.players[0])}</span><b>${p0}</b></div>
            <div class="duel-vs">VS</div>
            <div class="duel-player"><span>${MIAWBase.escapeHTML(state.players[1])}</span><b>${p1}</b></div>
          </div>
          <div class="button-row" style="justify-content:center">
            <button class="primary-btn big" id="rematchBtn" type="button">Rematch</button>
            <button class="secondary-btn" id="homeBtn" type="button">Home</button>
          </div>
        </div>
      </section>
    `;
  }

  function evaluateAfterMove(ctx, playerIndex) {
    const state = ctx.state;
    const win = checkWinningLine(state.board, state.mode.size, state.mode.target);
    if (win) {
      state.winningLine = win;
      state.roundWinnerRole = 'order';
      state.roundWinnerPlayer = state.roles.indexOf('order');
      state.scores[state.roundWinnerPlayer] += 1;
      state.phase = 'roundResult';
      ctx.beep(940, 0.11);
      return;
    }

    if (state.board.every(Boolean)) {
      state.roundWinnerRole = 'chaos';
      state.roundWinnerPlayer = state.roles.indexOf('chaos');
      state.scores[state.roundWinnerPlayer] += 1;
      state.phase = 'roundResult';
      ctx.beep(760, 0.11);
      return;
    }

    state.turn = MIAWTurnEngine.advanceTurn(state.turn);
    ctx.beep(playerIndex === 0 ? 520 : 600, 0.045);
  }

  const game = {
    meta: {
      id: 'miaw-order-chaos',
      title: 'ORDER & CHAOS',
      subtitle: 'Build the line. Break the pattern.',
      eyebrow: 'MIAW · 2 PLAYER ABSTRACT STRATEGY'
    },

    defaultPrefs: {
      names: ['Player 1', 'Player 2']
    },

    rules: {
      MODES,
      MATCH_TYPES,
      checkWinningLine,
      createGameState,
      startRound,
      orderPlayerIndexForRound
    },

    render(ctx) {
      if (!ctx.state) return home();
      if (ctx.state.phase === 'setup') return setup(ctx);
      if (ctx.state.phase === 'playing') return playing(ctx.state);
      if (ctx.state.phase === 'roundResult') return roundResult(ctx.state);
      if (ctx.state.phase === 'final') return final(ctx.state);
      return '<section class="panel"><h2>Unknown state.</h2></section>';
    },

    bind(ctx) {
      ctx.$('#setupBtn')?.addEventListener('click', () => {
        ctx.setState({ phase: 'setup', modeId: 'medium', matchTypeId: 'duel', initialOrderPlayer: 0, names: [...(ctx.prefs.names || ['Player 1', 'Player 2'])] });
        ctx.render();
      });

      ctx.$('#cancelBtn')?.addEventListener('click', ctx.goHome);

      ctx.$$('#nameA, #nameB').forEach((input) => {
        input.addEventListener('input', () => {
          const a = ctx.$('#nameA')?.value.trim() || 'Player 1';
          const b = ctx.$('#nameB')?.value.trim() || 'Player 2';
          ctx.state.names = [a, b];
          const labelA = ctx.$('#orderChoiceA');
          const labelB = ctx.$('#orderChoiceB');
          if (labelA) labelA.textContent = a;
          if (labelB) labelB.textContent = b;
        });
      });

      ctx.$$('[data-match]').forEach((button) => {
        button.addEventListener('click', () => {
          ctx.state.matchTypeId = button.dataset.match;
          ctx.render();
        });
      });

      ctx.$$('[data-mode]').forEach((button) => {
        button.addEventListener('click', () => {
          ctx.state.modeId = button.dataset.mode;
          ctx.render();
        });
      });

      ctx.$$('[data-order-player]').forEach((button) => {
        button.addEventListener('click', () => {
          ctx.state.initialOrderPlayer = Number(button.dataset.orderPlayer);
          ctx.render();
        });
      });

      ctx.$('#beginBtn')?.addEventListener('click', () => {
        const a = ctx.$('#nameA').value.trim() || 'Player 1';
        const b = ctx.$('#nameB').value.trim() || 'Player 2';
        ctx.state.names = [a, b];
        ctx.updatePrefs({ names: [a, b] });
        ctx.setState(createGameState({
          players: [a, b],
          modeId: ctx.state.modeId,
          matchTypeId: ctx.state.matchTypeId,
          initialOrderPlayer: ctx.state.initialOrderPlayer
        }));
        ctx.beep(720, 0.07);
        ctx.render();
      });

      ctx.$$('[data-mark]').forEach((button) => {
        button.addEventListener('click', () => {
          ctx.state.selectedMark = button.dataset.mark;
          ctx.beep(button.dataset.mark === 'X' ? 470 : 560, 0.035);
          ctx.render();
        });
      });

      ctx.$$('[data-cell]').forEach((button) => {
        button.addEventListener('click', () => {
          if (ctx.state.phase !== 'playing') return;
          const index = Number(button.dataset.cell);
          if (!Number.isInteger(index) || ctx.state.board[index]) return;

          const active = ctx.state.turn.turn;
          ctx.state.board[index] = ctx.state.selectedMark;
          ctx.state.lastMove = { index, mark: ctx.state.selectedMark, playerIndex: active };
          ctx.state.moveCount += 1;
          ctx.state.totalMoveCount += 1;
          evaluateAfterMove(ctx, active);
          ctx.render();
        });
      });

      ctx.$('#continueRoundBtn')?.addEventListener('click', () => {
        if (ctx.state.roundNumber < ctx.state.matchType.rounds) {
          startRound(ctx.state, ctx.state.roundNumber + 1);
        } else {
          ctx.state.phase = 'final';
        }
        ctx.render();
      });

      ctx.$('#rematchBtn')?.addEventListener('click', () => {
        const players = [...ctx.state.players];
        const modeId = ctx.state.mode.id;
        const matchTypeId = ctx.state.matchType.id;
        const initialOrderPlayer = ctx.state.initialOrderPlayer === 0 ? 1 : 0;
        ctx.setState(createGameState({ players, modeId, matchTypeId, initialOrderPlayer }));
        ctx.toast('Rematch dimulai. Order ronde pertama ditukar.');
        ctx.render();
      });

      ctx.$('#homeBtn')?.addEventListener('click', ctx.goHome);
    }
  };

  global.MIAW_GAME = game;
}(window));
