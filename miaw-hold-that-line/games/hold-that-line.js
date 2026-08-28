(function (global) {
  'use strict';

  const MATCH_TYPES = {
    quick: {
      id: 'quick',
      label: 'Quick Match',
      rounds: 1,
      detail: 'Satu ronde. Pemain yang membuat extension terakhir kalah.'
    },
    duel: {
      id: 'duel',
      label: 'Fair Duel',
      rounds: 2,
      detail: 'Dua ronde. Pemain pertama ditukar pada ronde kedua.'
    }
  };

  const BOARD_MODES = {
    classic: {
      id: 'classic',
      label: 'Classic',
      rows: 4,
      cols: 4,
      badge: 'ORIGINAL',
      detail: '4 × 4 · 16 titik · aturan klasik Sid Sackson.'
    },
    long: {
      id: 'long',
      label: 'Long',
      rows: 5,
      cols: 5,
      badge: 'LONGER',
      detail: '5 × 5 · 25 titik · lebih banyak ruang untuk jebakan.'
    },
    expert: {
      id: 'expert',
      label: 'Expert',
      rows: 6,
      cols: 6,
      badge: 'MIAW EXT.',
      detail: '6 × 6 · 36 titik · variasi MIAW untuk duel panjang.'
    }
  };

  const PLAYER_COLORS = ['blue', 'coral'];
  const EPS = 1e-9;

  function key(row, col) {
    return `${row},${col}`;
  }

  function parseKey(value) {
    const [row, col] = String(value).split(',').map(Number);
    return { row, col };
  }

  function safe(value) {
    return global.MIAWBase?.escapeHTML ? global.MIAWBase.escapeHTML(value) : String(value);
  }

  function allDots(mode) {
    const dots = [];
    for (let row = 0; row < mode.rows; row += 1) {
      for (let col = 0; col < mode.cols; col += 1) {
        dots.push({ row, col, id: key(row, col) });
      }
    }
    return dots;
  }

  function lineCells(a, b) {
    const drRaw = b.row - a.row;
    const dcRaw = b.col - a.col;
    if (drRaw === 0 && dcRaw === 0) return null;

    const horizontal = drRaw === 0;
    const vertical = dcRaw === 0;
    const diagonal = Math.abs(drRaw) === Math.abs(dcRaw);
    if (!horizontal && !vertical && !diagonal) return null;

    const steps = Math.max(Math.abs(drRaw), Math.abs(dcRaw));
    const dr = Math.sign(drRaw);
    const dc = Math.sign(dcRaw);
    const cells = [];
    for (let step = 0; step <= steps; step += 1) {
      cells.push({ row: a.row + (dr * step), col: a.col + (dc * step) });
    }
    return cells;
  }

  function cross(a, b) {
    return (a.col * b.row) - (a.row * b.col);
  }

  function subtract(a, b) {
    return { col: a.col - b.col, row: a.row - b.row };
  }

  function addScaled(a, vector, scalar) {
    return { col: a.col + (vector.col * scalar), row: a.row + (vector.row * scalar) };
  }

  function dot(a, b) {
    return (a.col * b.col) + (a.row * b.row);
  }

  function intersectionInfo(a, b, c, d) {
    const p = { col: a.col, row: a.row };
    const q = { col: c.col, row: c.row };
    const r = subtract({ col: b.col, row: b.row }, p);
    const s = subtract({ col: d.col, row: d.row }, q);
    const rxs = cross(r, s);
    const qmp = subtract(q, p);
    const qmpxr = cross(qmp, r);

    if (Math.abs(rxs) < EPS && Math.abs(qmpxr) < EPS) {
      const rr = dot(r, r);
      if (rr < EPS) return { intersects: false };
      const t0 = dot(qmp, r) / rr;
      const t1 = t0 + (dot(s, r) / rr);
      const low = Math.max(0, Math.min(t0, t1));
      const high = Math.min(1, Math.max(t0, t1));
      if (high < low - EPS) return { intersects: false };
      if (Math.abs(high - low) <= EPS) {
        return { intersects: true, point: addScaled(p, r, low), overlap: false };
      }
      return { intersects: true, overlap: true };
    }

    if (Math.abs(rxs) < EPS) return { intersects: false };

    const t = cross(qmp, s) / rxs;
    const u = cross(qmp, r) / rxs;
    if (t < -EPS || t > 1 + EPS || u < -EPS || u > 1 + EPS) {
      return { intersects: false };
    }
    return { intersects: true, point: addScaled(p, r, t), overlap: false };
  }

  function forbiddenIntersection(a, b, oldA, oldB, permittedPoint) {
    const info = intersectionInfo(a, b, oldA, oldB);
    if (!info.intersects) return false;
    if (info.overlap) return true;
    if (!info.point || !permittedPoint) return true;
    return Math.abs(info.point.row - permittedPoint.row) > EPS ||
      Math.abs(info.point.col - permittedPoint.col) > EPS;
  }

  function isEndpoint(state, dotKey) {
    return state.endpoints.includes(dotKey);
  }

  function validateMove(state, startKey, destinationKey) {
    if (state.phase !== 'playing') return { ok: false, reason: 'Game tidak sedang berjalan.' };
    if (!startKey || !destinationKey || startKey === destinationKey) {
      return { ok: false, reason: 'Pilih dua titik yang berbeda.' };
    }

    const start = parseKey(startKey);
    const destination = parseKey(destinationKey);
    const mode = state.mode;
    const inside = (point) => point.row >= 0 && point.row < mode.rows && point.col >= 0 && point.col < mode.cols;
    if (!inside(start) || !inside(destination)) return { ok: false, reason: 'Titik berada di luar papan.' };

    if (state.segments.length === 0) {
      if (state.visited[startKey]) return { ok: false, reason: 'Titik awal sudah digunakan.' };
    } else if (!isEndpoint(state, startKey)) {
      return { ok: false, reason: 'Extension harus dimulai dari salah satu ujung bebas.' };
    }

    if (state.visited[destinationKey]) {
      return { ok: false, reason: 'Titik tujuan sudah pernah dikunjungi.' };
    }

    const cells = lineCells(start, destination);
    if (!cells) {
      return { ok: false, reason: 'Garis harus horizontal, vertikal, atau diagonal 45°.' };
    }

    const cellsToConsume = state.segments.length === 0 ? cells : cells.slice(1);
    for (const cell of cellsToConsume) {
      const cellKey = key(cell.row, cell.col);
      if (state.visited[cellKey]) {
        return { ok: false, reason: 'Garis tidak boleh melewati titik yang sudah digunakan.' };
      }
    }

    for (const segment of state.segments) {
      if (forbiddenIntersection(start, destination, segment.a, segment.b, start)) {
        return { ok: false, reason: 'Garis tidak boleh menyilang atau menimpa jalur yang sudah ada.' };
      }
    }

    return { ok: true, cells };
  }

  function legalMovesFrom(state, startKey) {
    const result = [];
    for (const dotItem of allDots(state.mode)) {
      const destinationKey = dotItem.id;
      if (destinationKey === startKey || state.visited[destinationKey]) continue;
      if (validateMove(state, startKey, destinationKey).ok) result.push(destinationKey);
    }
    return result;
  }

  function hasAnyLegalMove(state) {
    if (state.segments.length === 0) return true;
    return state.endpoints.some((endpoint) => legalMovesFrom(state, endpoint).length > 0);
  }

  function firstPlayerForRound(state, roundNumber) {
    if (roundNumber === 1 || state.matchType.rounds === 1) return state.initialFirstPlayer;
    return 1 - state.initialFirstPlayer;
  }

  function startRound(state, roundNumber) {
    const firstPlayer = firstPlayerForRound(state, roundNumber);
    state.phase = 'playing';
    state.roundNumber = roundNumber;
    state.firstPlayer = firstPlayer;
    state.turn = MIAWTurnEngine.createTurnState(2, { startPlayer: firstPlayer });
    state.segments = [];
    state.visited = {};
    state.endpoints = [];
    state.selectedStart = null;
    state.moveCount = 0;
    state.roundWinner = null;
    state.roundLoser = null;
    state.lastMove = null;
    return state;
  }

  function createGameState({ players, matchTypeId, boardModeId, initialFirstPlayer }) {
    const state = {
      phase: 'playing',
      players,
      matchType: MATCH_TYPES[matchTypeId],
      mode: BOARD_MODES[boardModeId],
      initialFirstPlayer,
      firstPlayer: initialFirstPlayer,
      roundNumber: 1,
      scores: [0, 0],
      totalMoves: 0,
      segments: [],
      visited: {},
      endpoints: [],
      selectedStart: null,
      moveCount: 0,
      roundWinner: null,
      roundLoser: null,
      lastMove: null,
      turn: null
    };
    return startRound(state, 1);
  }

  function applyMove(state, startKey, destinationKey) {
    const validation = validateMove(state, startKey, destinationKey);
    if (!validation.ok) return validation;

    const player = state.turn.turn;
    const start = parseKey(startKey);
    const destination = parseKey(destinationKey);
    const isFirstMove = state.segments.length === 0;

    validation.cells.forEach((cell, index) => {
      if (!isFirstMove && index === 0) return;
      state.visited[key(cell.row, cell.col)] = true;
    });

    state.segments.push({
      a: start,
      b: destination,
      owner: player,
      move: state.moveCount + 1,
      cells: validation.cells.map((cell) => key(cell.row, cell.col))
    });

    if (isFirstMove) {
      state.endpoints = [startKey, destinationKey];
    } else {
      state.endpoints = state.endpoints.map((endpoint) => endpoint === startKey ? destinationKey : endpoint);
    }

    state.moveCount += 1;
    state.totalMoves += 1;
    state.selectedStart = null;
    state.lastMove = { startKey, destinationKey, player, move: state.moveCount };

    if (!hasAnyLegalMove(state)) {
      state.roundLoser = player;
      state.roundWinner = 1 - player;
      state.scores[state.roundWinner] += 1;
      state.phase = 'roundResult';
      return { ok: true, ended: true };
    }

    state.turn = MIAWTurnEngine.advanceTurn(state.turn);
    return { ok: true, ended: false };
  }

  function dotPosition(mode, row, col) {
    const pad = mode.rows >= 6 ? 9 : 12;
    const x = mode.cols === 1 ? 50 : pad + ((100 - (2 * pad)) * (col / (mode.cols - 1)));
    const y = mode.rows === 1 ? 50 : pad + ((100 - (2 * pad)) * (row / (mode.rows - 1)));
    return { x, y };
  }

  function homePreview() {
    const positions = [
      [12, 12], [38, 12], [64, 12], [88, 12],
      [12, 38], [38, 38], [64, 38], [88, 38],
      [12, 64], [38, 64], [64, 64], [88, 64],
      [12, 88], [38, 88], [64, 88], [88, 88]
    ];
    return `
      <div class="preview-board" aria-hidden="true">
        <svg viewBox="0 0 100 100">
          <polyline points="12,88 38,64 64,64 88,38 64,12" class="preview-path"></polyline>
        </svg>
        ${positions.map(([x, y], index) => `<span class="preview-dot ${[12,9,10,7,2].includes(index) ? 'used' : ''}" style="left:${x}%;top:${y}%"></span>`).join('')}
      </div>
    `;
  }

  function home() {
    return `
      <section class="hero">
        <div class="panel hero-main">
          <div class="eyebrow">MIAW ABSTRACT STRATEGY</div>
          <div class="hero-title"><span>HOLD</span><br><em>THAT LINE.</em></div>
          <p class="hero-copy">Bangun satu jalur kontinu dari dua ujung bebas. Jangan menyilang, jangan mengulang titik, dan jangan menjadi pemain yang terpaksa membuat extension terakhir.</p>
          <div class="button-row">
            <button class="primary-btn big" id="setupBtn" type="button">Mulai Duel</button>
          </div>
          <div class="mini-rules">
            <div class="mini-rule"><strong>1</strong><span>JALUR KONTINU</span></div>
            <div class="mini-rule"><strong>2</strong><span>UJUNG BEBAS</span></div>
            <div class="mini-rule"><strong>LAST</strong><span>MOVE LOSES</span></div>
          </div>
        </div>
        <aside class="panel intro-panel">
          ${homePreview()}
          <div class="rule-stack">
            <div class="rule-card"><b>Mulai bebas.</b><span>Move pertama boleh dimulai dari titik mana pun dan memanjang lurus melewati beberapa titik.</span></div>
            <div class="rule-card blue"><b>Lanjut dari ujung.</b><span>Move berikutnya harus dimulai dari salah satu dari dua endpoint jalur.</span></div>
            <div class="rule-card coral"><b>Terakhir = kalah.</b><span>Jika extension-mu membuat tidak ada move legal tersisa, lawan langsung menang.</span></div>
          </div>
        </aside>
      </section>
    `;
  }

  function setup(ctx) {
    const savedNames = ctx.prefs.names || ['Player 1', 'Player 2'];
    const draft = ctx.state || {
      phase: 'setup',
      names: savedNames,
      matchTypeId: 'duel',
      boardModeId: 'classic',
      initialFirstPlayer: 0
    };
    const names = draft.names || savedNames;
    return `
      <section class="panel narrow-panel setup-panel">
        <div class="eyebrow">MATCH SETUP</div>
        <h2>Atur Hold That Line.</h2>
        <p class="hero-copy">Pemain pertama hanya menentukan opening. Pada Fair Duel, opening player ditukar di ronde kedua.</p>

        <div class="setup-grid">
          <label class="field">Player 1<input id="nameA" maxlength="22" value="${ctx.escapeHTML(names[0] || 'Player 1')}"></label>
          <label class="field">Player 2<input id="nameB" maxlength="22" value="${ctx.escapeHTML(names[1] || 'Player 2')}"></label>
        </div>

        <div class="setup-section">
          <div class="setup-section-head"><h3>Ukuran papan</h3><span>Semakin besar, semakin panjang duel.</span></div>
          <div class="choice-grid three">
            ${Object.values(BOARD_MODES).map((mode) => `
              <button class="choice ${draft.boardModeId === mode.id ? 'active' : ''}" data-board="${mode.id}" type="button">
                <span class="choice-kicker">${mode.badge}</span>
                <b>${mode.label}</b>
                <small>${mode.detail}</small>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="setup-section">
          <div class="setup-section-head"><h3>Format pertandingan</h3><span>Fair Duel menukar first player.</span></div>
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
          <div class="setup-section-head"><h3>Opening player</h3><span>Siapa yang membuat garis pertama ronde 1?</span></div>
          <div class="choice-grid">
            <button class="choice ${draft.initialFirstPlayer === 0 ? 'active' : ''}" data-first-player="0" type="button">
              <span class="choice-kicker">FIRST MOVE</span><b id="firstChoiceA">${ctx.escapeHTML(names[0] || 'Player 1')}</b><small>Player lain bergerak berikutnya.</small>
            </button>
            <button class="choice ${draft.initialFirstPlayer === 1 ? 'active' : ''}" data-first-player="1" type="button">
              <span class="choice-kicker">FIRST MOVE</span><b id="firstChoiceB">${ctx.escapeHTML(names[1] || 'Player 2')}</b><small>Player lain bergerak berikutnya.</small>
            </button>
          </div>
        </div>

        <div class="button-row setup-actions">
          <button class="primary-btn big" id="beginBtn" type="button">Mulai Pertandingan</button>
          <button class="secondary-btn" id="cancelBtn" type="button">Batal</button>
        </div>
      </section>
    `;
  }

  function segmentSVG(state) {
    return state.segments.map((segment, index) => {
      const a = dotPosition(state.mode, segment.a.row, segment.a.col);
      const b = dotPosition(state.mode, segment.b.row, segment.b.col);
      const ownerClass = PLAYER_COLORS[segment.owner];
      const last = index === state.segments.length - 1 ? ' last' : '';
      return `<line class="path-segment ${ownerClass}${last}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"></line>`;
    }).join('');
  }

  function boardHTML(state) {
    const dots = allDots(state.mode);
    const endpointSet = new Set(state.endpoints);
    const selected = state.selectedStart;
    const currentColor = PLAYER_COLORS[state.turn.turn];
    return `
      <div class="board-wrap current-${currentColor}">
        <div class="line-board size-${state.mode.rows}" role="group" aria-label="Papan Hold That Line ${state.mode.rows} kali ${state.mode.cols}">
          <svg class="path-layer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            ${segmentSVG(state)}
          </svg>
          ${dots.map((dotItem) => {
            const position = dotPosition(state.mode, dotItem.row, dotItem.col);
            const visited = Boolean(state.visited[dotItem.id]);
            const endpoint = endpointSet.has(dotItem.id);
            const isSelected = selected === dotItem.id;
            const classes = ['board-dot'];
            if (visited) classes.push('visited');
            if (endpoint) classes.push('endpoint');
            if (isSelected) classes.push('selected');
            const disabled = state.phase !== 'playing' || (visited && !endpoint);
            return `
              <button class="${classes.join(' ')}" data-dot="${dotItem.id}" type="button" style="left:${position.x}%;top:${position.y}%" aria-label="Titik baris ${dotItem.row + 1} kolom ${dotItem.col + 1}" ${disabled ? 'disabled' : ''}>
                <span class="dot-core"></span>
              </button>
            `;
          }).join('')}
        </div>
        <p class="board-hint">${instructionForState(state)}</p>
      </div>
    `;
  }

  function instructionForState(state) {
    if (state.phase !== 'playing') return 'Ronde selesai.';
    if (state.segments.length === 0 && !state.selectedStart) return 'Opening: pilih titik awal mana pun.';
    if (state.segments.length === 0 && state.selectedStart) return 'Sekarang pilih titik tujuan pada garis lurus.';
    if (!state.selectedStart) return 'Pilih salah satu dari dua ujung bebas.';
    return 'Pilih titik tujuan. Hindari crossing dan titik yang sudah digunakan.';
  }

  function playerCard(state, index) {
    const active = state.phase === 'playing' && state.turn.turn === index;
    const first = state.firstPlayer === index;
    const color = PLAYER_COLORS[index];
    return `
      <div class="player-card ${active ? `active-${color}` : ''}">
        <div class="player-head">
          <span class="color-tag ${color}"><i></i>PLAYER ${index + 1}</span>
          <span class="pill">${active ? 'YOUR TURN' : 'WAIT'}</span>
        </div>
        <h3>${safe(state.players[index])}</h3>
        <p>${first ? 'Opening player ronde ini.' : 'Menunggu extension lawan.'}</p>
        <div class="score-line"><span>Round wins</span><strong>${state.scores[index]}</strong></div>
      </div>
    `;
  }

  function gameScreen(state) {
    const current = state.turn.turn;
    const usedCount = Object.keys(state.visited).length;
    const totalDots = state.mode.rows * state.mode.cols;
    return `
      <section class="game-layout">
        <div class="panel game-panel">
          <div class="game-toolbar">
            <div class="status-group">
              <span class="pill">ROUND ${state.roundNumber}/${state.matchType.rounds}</span>
              <span class="pill">${state.mode.rows} × ${state.mode.cols}</span>
              <span class="pill danger-pill">LAST MOVE LOSES</span>
            </div>
            <button class="secondary-btn compact-btn" id="rulesBtn" type="button">? Rules</button>
          </div>
          <div class="turn-banner ${PLAYER_COLORS[current]}">
            <div>
              <small>SEKARANG</small>
              <strong>${safe(state.players[current])}</strong>
            </div>
            <div class="turn-copy">${state.segments.length === 0 ? 'Buat opening line.' : 'Extend dari salah satu endpoint.'}</div>
          </div>
          ${boardHTML(state)}
        </div>

        <aside class="side-panel">
          ${playerCard(state, 0)}
          ${playerCard(state, 1)}
          <div class="stats-card">
            <div class="stats-grid">
              <div class="stat"><b>${state.moveCount}</b><span>Moves</span></div>
              <div class="stat"><b>${usedCount}/${totalDots}</b><span>Dots used</span></div>
              <div class="stat"><b>${state.endpoints.length || '—'}</b><span>Free ends</span></div>
              <div class="stat"><b>${state.matchType.label}</b><span>Format</span></div>
            </div>
            <div class="micro-rule">Tidak ada hint move aman. Anda sendiri yang harus membaca jebakan.</div>
          </div>
        </aside>
      </section>
    `;
  }

  function rulesModal() {
    return `
      <div class="modal-backdrop" id="rulesModal">
        <div class="rules-modal" role="dialog" aria-modal="true" aria-labelledby="rulesTitle">
          <div class="modal-head"><div><span class="eyebrow">HOW TO PLAY</span><h2 id="rulesTitle">Hold That Line</h2></div><button class="icon-btn" id="closeRulesBtn" type="button" aria-label="Tutup">✕</button></div>
          <ol class="rules-list">
            <li><b>Move pertama bebas.</b><span>Pilih titik awal lalu titik tujuan. Satu move boleh melewati beberapa titik yang segaris.</span></li>
            <li><b>Setelah itu hanya dari endpoint.</b><span>Setiap extension harus dimulai dari salah satu dari dua ujung bebas jalur.</span></li>
            <li><b>Arah legal.</b><span>Horizontal, vertikal, atau diagonal 45°. Satu move tidak boleh berbelok.</span></li>
            <li><b>Jalur harus bersih.</b><span>Tidak boleh crossing, overlap, branching, atau melewati titik yang sudah dikunjungi.</span></li>
            <li><b>Misère ending.</b><span>Jika move-mu membuat tidak ada extension legal lagi, kamu kalah dan lawan menang.</span></li>
          </ol>
          <button class="primary-btn" id="closeRulesBottomBtn" type="button">Paham</button>
        </div>
      </div>
    `;
  }

  function roundResult(state) {
    const winner = state.roundWinner;
    const loser = state.roundLoser;
    const duelFinished = state.roundNumber >= state.matchType.rounds;
    const finalTie = duelFinished && state.matchType.rounds > 1 && state.scores[0] === state.scores[1];
    const finalWinner = duelFinished && !finalTie ? (state.scores[0] > state.scores[1] ? 0 : 1) : null;
    return `
      <section class="result-shell">
        <div class="panel result-card">
          <div class="result-icon">${duelFinished ? '🏁' : '⚡'}</div>
          <div class="eyebrow">${duelFinished ? 'MATCH COMPLETE' : `ROUND ${state.roundNumber} COMPLETE`}</div>
          <h2 class="result-title">${duelFinished ? (finalTie ? 'Duel Seri.' : `${safe(state.players[finalWinner])} menang.`) : `${safe(state.players[winner])} ambil ronde.`}</h2>
          <p class="result-copy"><strong>${safe(state.players[loser])}</strong> membuat extension legal terakhir. Karena tidak ada move legal tersisa setelah garis itu, <strong>${safe(state.players[winner])}</strong> memenangkan ronde.</p>

          <div class="final-board-shell">
            ${boardHTML({ ...state, selectedStart: null })}
          </div>

          <div class="duel-score">
            <div class="duel-player"><span>${safe(state.players[0])}</span><b>${state.scores[0]}</b></div>
            <div class="duel-vs">:</div>
            <div class="duel-player"><span>${safe(state.players[1])}</span><b>${state.scores[1]}</b></div>
          </div>

          <div class="button-row centered">
            ${!duelFinished ? '<button class="primary-btn big" id="nextRoundBtn" type="button">Ronde Berikutnya</button>' : '<button class="primary-btn big" id="rematchBtn" type="button">Rematch</button>'}
            <button class="secondary-btn" id="setupAgainBtn" type="button">Ubah Setup</button>
          </div>
        </div>
      </section>
    `;
  }

  function render(ctx) {
    if (!ctx.state) return home();
    if (ctx.state.phase === 'setup') return setup(ctx);
    if (ctx.state.phase === 'playing') return gameScreen(ctx.state) + (ctx.state.showRules ? rulesModal() : '');
    if (ctx.state.phase === 'roundResult') return roundResult(ctx.state);
    return home();
  }

  function updateSetupDraft(ctx, patch) {
    const current = ctx.state && ctx.state.phase === 'setup' ? ctx.state : {
      phase: 'setup',
      names: ctx.prefs.names || ['Player 1', 'Player 2'],
      matchTypeId: 'duel',
      boardModeId: 'classic',
      initialFirstPlayer: 0
    };
    ctx.setState({ ...current, ...patch });
    ctx.render();
  }

  function bindHome(ctx) {
    ctx.$('#setupBtn')?.addEventListener('click', () => {
      ctx.setState({
        phase: 'setup',
        names: ctx.prefs.names || ['Player 1', 'Player 2'],
        matchTypeId: 'duel',
        boardModeId: 'classic',
        initialFirstPlayer: 0
      });
      ctx.beep(620, 0.045);
      ctx.render();
    });
  }

  function bindSetup(ctx) {
    const nameA = ctx.$('#nameA');
    const nameB = ctx.$('#nameB');
    const syncNames = () => {
      const names = [nameA.value.trim() || 'Player 1', nameB.value.trim() || 'Player 2'];
      ctx.state.names = names;
      const a = ctx.$('#firstChoiceA');
      const b = ctx.$('#firstChoiceB');
      if (a) a.textContent = names[0];
      if (b) b.textContent = names[1];
    };
    nameA?.addEventListener('input', syncNames);
    nameB?.addEventListener('input', syncNames);

    ctx.$$('button[data-board]').forEach((button) => button.addEventListener('click', () => {
      syncNames();
      updateSetupDraft(ctx, { boardModeId: button.dataset.board, names: ctx.state.names });
    }));
    ctx.$$('button[data-match]').forEach((button) => button.addEventListener('click', () => {
      syncNames();
      updateSetupDraft(ctx, { matchTypeId: button.dataset.match, names: ctx.state.names });
    }));
    ctx.$$('button[data-first-player]').forEach((button) => button.addEventListener('click', () => {
      syncNames();
      updateSetupDraft(ctx, { initialFirstPlayer: Number(button.dataset.firstPlayer), names: ctx.state.names });
    }));

    ctx.$('#cancelBtn')?.addEventListener('click', () => ctx.goHome());
    ctx.$('#beginBtn')?.addEventListener('click', () => {
      syncNames();
      const names = ctx.state.names.map((name, index) => name || `Player ${index + 1}`);
      ctx.updatePrefs({ names });
      ctx.setState(createGameState({
        players: names,
        matchTypeId: ctx.state.matchTypeId,
        boardModeId: ctx.state.boardModeId,
        initialFirstPlayer: ctx.state.initialFirstPlayer
      }));
      ctx.beep(760, 0.05);
      ctx.render();
    });
  }

  function handleDotClick(ctx, dotKey) {
    const state = ctx.state;
    if (state.phase !== 'playing') return;

    const isFirstMove = state.segments.length === 0;
    const endpoint = isEndpoint(state, dotKey);
    const visited = Boolean(state.visited[dotKey]);

    if (!state.selectedStart) {
      if (!isFirstMove && !endpoint) {
        ctx.toast('Pilih salah satu dari dua ujung bebas.');
        ctx.beep(220, 0.05);
        return;
      }
      if (visited && !endpoint) return;
      state.selectedStart = dotKey;
      ctx.beep(520, 0.035);
      ctx.render();
      return;
    }

    if (dotKey === state.selectedStart) {
      state.selectedStart = null;
      ctx.beep(380, 0.03);
      ctx.render();
      return;
    }

    if (!isFirstMove && endpoint && visited) {
      state.selectedStart = dotKey;
      ctx.beep(500, 0.03);
      ctx.render();
      return;
    }

    const result = applyMove(state, state.selectedStart, dotKey);
    if (!result.ok) {
      ctx.toast(result.reason);
      ctx.beep(180, 0.06);
      return;
    }

    if (result.ended) {
      ctx.beep(170, 0.11);
      setTimeout(() => ctx.beep(620, 0.09), 90);
    } else {
      ctx.beep(660, 0.045);
    }
    ctx.render();
  }

  function bindPlaying(ctx) {
    ctx.$$('.board-dot').forEach((button) => button.addEventListener('click', () => handleDotClick(ctx, button.dataset.dot)));
    ctx.$('#rulesBtn')?.addEventListener('click', () => {
      ctx.state.showRules = true;
      ctx.render();
    });
    const closeRules = () => {
      ctx.state.showRules = false;
      ctx.render();
    };
    ctx.$('#closeRulesBtn')?.addEventListener('click', closeRules);
    ctx.$('#closeRulesBottomBtn')?.addEventListener('click', closeRules);
    ctx.$('#rulesModal')?.addEventListener('click', (event) => {
      if (event.target.id === 'rulesModal') closeRules();
    });
  }

  function rematchState(state) {
    const nextInitial = 1 - state.initialFirstPlayer;
    state.initialFirstPlayer = nextInitial;
    state.scores = [0, 0];
    state.roundNumber = 1;
    state.totalMoves = 0;
    return startRound(state, 1);
  }

  function bindResult(ctx) {
    ctx.$('#nextRoundBtn')?.addEventListener('click', () => {
      startRound(ctx.state, ctx.state.roundNumber + 1);
      ctx.beep(720, 0.05);
      ctx.render();
    });
    ctx.$('#rematchBtn')?.addEventListener('click', () => {
      rematchState(ctx.state);
      ctx.beep(760, 0.05);
      ctx.render();
    });
    ctx.$('#setupAgainBtn')?.addEventListener('click', () => {
      ctx.setState({
        phase: 'setup',
        names: [...ctx.state.players],
        matchTypeId: ctx.state.matchType.id,
        boardModeId: ctx.state.mode.id,
        initialFirstPlayer: 1 - ctx.state.initialFirstPlayer
      });
      ctx.render();
    });
  }

  function bind(ctx) {
    if (!ctx.state) return bindHome(ctx);
    if (ctx.state.phase === 'setup') return bindSetup(ctx);
    if (ctx.state.phase === 'playing') return bindPlaying(ctx);
    if (ctx.state.phase === 'roundResult') return bindResult(ctx);
  }

  const game = {
    meta: {
      id: 'hold-that-line',
      title: 'MIAW · HOLD THAT LINE',
      subtitle: 'Build one path. Never take the last move.',
      eyebrow: '2 PLAYER · SINGLE DEVICE'
    },
    defaultPrefs: {
      names: ['Player 1', 'Player 2']
    },
    render,
    bind,
    testing: {
      key,
      parseKey,
      lineCells,
      intersectionInfo,
      forbiddenIntersection,
      validateMove,
      legalMovesFrom,
      hasAnyLegalMove,
      createGameState,
      applyMove,
      BOARD_MODES,
      MATCH_TYPES
    }
  };

  global.MIAW_GAME = game;
}(window));
