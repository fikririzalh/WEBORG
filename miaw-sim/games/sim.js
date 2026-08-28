(function (global) {
  'use strict';

  const MATCH_TYPES = {
    quick: { id: 'quick', label: 'Quick Match', rounds: 1, detail: 'Satu ronde, langsung selesai.' },
    duel: { id: 'duel', label: 'IQ Duel', rounds: 2, detail: 'Dua ronde. Warna dan giliran pertama ditukar.' }
  };

  const VERTICES = [
    { id: 0, x: 50, y: 9 },
    { id: 1, x: 85, y: 29 },
    { id: 2, x: 85, y: 71 },
    { id: 3, x: 50, y: 91 },
    { id: 4, x: 15, y: 71 },
    { id: 5, x: 15, y: 29 }
  ];

  function edgeKey(a, b) {
    const low = Math.min(a, b);
    const high = Math.max(a, b);
    return `${low}-${high}`;
  }

  function allEdgePairs() {
    const result = [];
    for (let a = 0; a < 6; a += 1) {
      for (let b = a + 1; b < 6; b += 1) result.push([a, b]);
    }
    return result;
  }

  const EDGE_PAIRS = allEdgePairs();

  function colorForPlayer(state, playerIndex) {
    return state.bluePlayer === playerIndex ? 'blue' : 'red';
  }

  function playerForColor(state, color) {
    return color === 'blue' ? state.bluePlayer : 1 - state.bluePlayer;
  }

  function bluePlayerForRound(state, roundNumber) {
    return roundNumber === 1 ? state.initialBluePlayer : 1 - state.initialBluePlayer;
  }

  function findTriangle(edges, color) {
    for (let a = 0; a < 4; a += 1) {
      for (let b = a + 1; b < 5; b += 1) {
        for (let c = b + 1; c < 6; c += 1) {
          const keys = [edgeKey(a, b), edgeKey(a, c), edgeKey(b, c)];
          if (keys.every((key) => edges[key] === color)) {
            return { vertices: [a, b, c], edges: keys };
          }
        }
      }
    }
    return null;
  }

  function startRound(state, roundNumber) {
    const bluePlayer = bluePlayerForRound(state, roundNumber);
    state.roundNumber = roundNumber;
    state.bluePlayer = bluePlayer;
    state.turn = MIAWTurnEngine.createTurnState(2, { startPlayer: bluePlayer });
    state.edges = {};
    state.selectedVertex = null;
    state.lastEdge = null;
    state.losingTriangle = null;
    state.roundWinner = null;
    state.roundLoser = null;
    state.moveCount = 0;
    state.phase = 'playing';
    return state;
  }

  function createGameState({ players, matchTypeId, initialBluePlayer }) {
    const state = {
      phase: 'playing',
      players,
      matchType: MATCH_TYPES[matchTypeId],
      initialBluePlayer,
      bluePlayer: initialBluePlayer,
      roundNumber: 1,
      edges: {},
      selectedVertex: null,
      lastEdge: null,
      losingTriangle: null,
      roundWinner: null,
      roundLoser: null,
      scores: [0, 0],
      moveCount: 0,
      totalMoveCount: 0,
      turn: null
    };
    return startRound(state, 1);
  }

  function previewBoard() {
    return `
      <div class="sim-preview" aria-hidden="true">
        <svg viewBox="0 0 100 100">
          <line x1="50" y1="9" x2="85" y2="29" stroke="var(--blue)"/>
          <line x1="85" y1="29" x2="15" y2="71" stroke="var(--blue)"/>
          <line x1="15" y1="71" x2="50" y2="9" stroke="var(--blue)"/>
          <line x1="15" y1="29" x2="85" y2="71" stroke="var(--red)"/>
          <line x1="15" y1="29" x2="50" y2="91" stroke="var(--red)"/>
        </svg>
        ${VERTICES.map((v) => `<span class="preview-dot" style="left:${v.x}%;top:${v.y}%"></span>`).join('')}
      </div>
    `;
  }

  function home() {
    return `
      <section class="hero">
        <div class="panel hero-main">
          <div class="eyebrow">MIAW ABSTRACT STRATEGY</div>
          <div class="hero-title"><span class="sim-word">SIM.</span><br><span class="avoid-word">AVOID.</span></div>
          <p class="hero-copy">Hubungkan dua dari enam titik dengan warnamu. Setiap garis permanen. Siapa pun yang melengkapi segitiga tiga-sisi dengan warnanya sendiri langsung kalah.</p>
          <div class="button-row">
            <button class="primary-btn big" id="setupBtn" type="button">Mulai Duel</button>
          </div>
          <div class="mini-rules">
            <div class="mini-rule"><strong>6</strong><span>TITIK TETAP</span></div>
            <div class="mini-rule"><strong>15</strong><span>GARIS MAKSIMUM</span></div>
            <div class="mini-rule"><strong>0</strong><span>KEMUNGKINAN DRAW</span></div>
          </div>
        </div>
        <aside class="panel">
          ${previewBoard()}
          <div class="rule-stack">
            <div class="rule-card"><b>Pilih dua titik.</b><span>Hubungkan pasangan yang belum pernah dipakai. Garis itu menjadi milik warnamu.</span></div>
            <div class="rule-card red"><b>Segitiga sendiri = kalah.</b><span>Yang dihitung hanya segitiga dengan tiga sudut pada enam titik asli.</span></div>
            <div class="rule-card green"><b>Persilangan bukan titik.</b><span>Garis boleh saling silang. Titik perpotongan tidak pernah menjadi vertex baru.</span></div>
          </div>
          <div class="note">IQ Duel memakai dua ronde dan menukar warna/giliran pertama, sehingga kedua pemain merasakan posisi Blue dan Red.</div>
        </aside>
      </section>
    `;
  }

  function setup(ctx) {
    const savedNames = ctx.prefs.names || ['Player 1', 'Player 2'];
    const draft = ctx.state || { phase: 'setup', names: savedNames, matchTypeId: 'duel', initialBluePlayer: 0 };
    const names = draft.names || savedNames;
    return `
      <section class="panel narrow-panel">
        <div class="eyebrow">MATCH SETUP</div>
        <h2>Atur duel SIM.</h2>
        <p class="hero-copy">Blue bergerak pertama. Pada IQ Duel, kedua pemain bertukar warna pada ronde kedua.</p>

        <div class="setup-grid">
          <label class="field">Player 1<input id="nameA" maxlength="22" value="${ctx.escapeHTML(names[0] || 'Player 1')}"></label>
          <label class="field">Player 2<input id="nameB" maxlength="22" value="${ctx.escapeHTML(names[1] || 'Player 2')}"></label>
        </div>

        <div class="setup-section">
          <div class="setup-section-head"><h3>Format pertandingan</h3><span>Pilih satu atau dua ronde.</span></div>
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
          <div class="setup-section-head"><h3>Blue ronde pertama</h3><span>Blue selalu mengambil turn pertama.</span></div>
          <div class="choice-grid">
            <button class="choice ${draft.initialBluePlayer === 0 ? 'active' : ''}" data-blue-player="0" type="button">
              <span class="choice-kicker">BLUE · FIRST MOVE</span><b id="blueChoiceA">${ctx.escapeHTML(names[0] || 'Player 1')}</b><small>Player lain otomatis menjadi Red.</small>
            </button>
            <button class="choice ${draft.initialBluePlayer === 1 ? 'active' : ''}" data-blue-player="1" type="button">
              <span class="choice-kicker">BLUE · FIRST MOVE</span><b id="blueChoiceB">${ctx.escapeHTML(names[1] || 'Player 2')}</b><small>Player lain otomatis menjadi Red.</small>
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

  function edgeLines(state) {
    const losing = new Set(state.losingTriangle?.edges || []);
    return EDGE_PAIRS.map(([a, b]) => {
      const key = edgeKey(a, b);
      const owner = state.edges[key] || '';
      const classes = ['game-edge'];
      if (owner) classes.push('claimed', owner);
      if (losing.has(key)) classes.push('losing');
      return `<line class="${classes.join(' ')}" x1="${VERTICES[a].x}" y1="${VERTICES[a].y}" x2="${VERTICES[b].x}" y2="${VERTICES[b].y}"></line>`;
    }).join('');
  }

  function boardHTML(state) {
    const currentPlayer = state.turn.turn;
    const currentColor = colorForPlayer(state, currentPlayer);
    const losingVertices = new Set(state.losingTriangle?.vertices || []);
    return `
      <div class="graph-wrap">
        <div class="graph-board current-${currentColor}" role="group" aria-label="Papan SIM enam titik">
          <svg class="edge-layer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${edgeLines(state)}</svg>
          ${VERTICES.map((vertex) => {
            const classes = ['vertex'];
            if (state.selectedVertex === vertex.id) classes.push('selected');
            if (losingVertices.has(vertex.id)) classes.push('losing-vertex');
            return `
              <button class="${classes.join(' ')}" data-vertex="${vertex.id}" type="button" style="left:${vertex.x}%;top:${vertex.y}%" aria-label="Titik ${vertex.id + 1}" ${state.phase !== 'playing' ? 'disabled' : ''}>
                <span class="vertex-label">${vertex.id + 1}</span>
              </button>
            `;
          }).join('')}
        </div>
        <p class="board-hint">${state.selectedVertex === null ? 'Pilih titik pertama.' : `Titik ${state.selectedVertex + 1} dipilih · sekarang pilih titik kedua.`}</p>
      </div>
    `;
  }

  function playerCard(state, playerIndex) {
    const color = colorForPlayer(state, playerIndex);
    const active = state.phase === 'playing' && state.turn.turn === playerIndex;
    return `
      <div class="player-card ${active ? `active-${color}` : ''}">
        <div class="player-head">
          <span class="color-tag ${color}"><i class="color-dot"></i>${color.toUpperCase()}</span>
          <span class="pill">${active ? 'YOUR TURN' : 'WAIT'}</span>
        </div>
        <h3>${state.players[playerIndex]}</h3>
        <p>${color === 'blue' ? 'Bergerak pertama pada ronde ini.' : 'Bergerak kedua pada ronde ini.'}</p>
        <div class="score-line"><span>Round wins</span><strong>${state.scores[playerIndex]}</strong></div>
      </div>
    `;
  }

  function game(ctx) {
    const state = ctx.state;
    const currentPlayer = state.turn.turn;
    const currentColor = colorForPlayer(state, currentPlayer);
    const used = Object.keys(state.edges).length;
    return `
      <section class="game-layout">
        <div class="panel game-panel">
          <div class="game-toolbar">
            <div class="status-group">
              <span class="pill">Round ${state.roundNumber}/${state.matchType.rounds}</span>
              <span class="pill">${used}/15 lines</span>
            </div>
            <span class="pill ${currentColor}">${currentColor.toUpperCase()}</span>
          </div>

          <div class="turn-banner">
            <div><strong>${state.players[currentPlayer]}</strong><small>${state.selectedVertex === null ? 'Pilih titik pertama untuk memulai garis.' : 'Pilih titik kedua untuk menyelesaikan garis.'}</small></div>
            <span class="turn-color ${currentColor}">${currentColor} turn</span>
          </div>

          ${boardHTML(state)}
        </div>
        <aside class="side-panel">
          ${playerCard(state, 0)}
          ${playerCard(state, 1)}
          <div class="stats-card">
            <div class="eyebrow">BOARD STATE</div>
            <div class="stats-grid">
              <div class="stat"><b>${used}</b><span>Lines used</span></div>
              <div class="stat"><b>${15 - used}</b><span>Lines free</span></div>
              <div class="stat"><b>${state.moveCount}</b><span>Round moves</span></div>
              <div class="stat"><b>${state.totalMoveCount}</b><span>Total moves</span></div>
            </div>
            <div class="note">Tidak ada danger hint. Kamu harus membaca sendiri garis mana yang aman dan mana yang akan menutup segitiga warnamu.</div>
          </div>
        </aside>
      </section>
    `;
  }

  function scoreHTML(state) {
    return `
      <div class="duel-score">
        <div class="duel-player"><b>${state.scores[0]}</b><span>${state.players[0]}</span></div>
        <div class="duel-vs">VS</div>
        <div class="duel-player"><b>${state.scores[1]}</b><span>${state.players[1]}</span></div>
      </div>
    `;
  }

  function roundResult(ctx) {
    const state = ctx.state;
    const loser = state.roundLoser;
    const winner = state.roundWinner;
    const loserColor = colorForPlayer(state, loser);
    const hasNext = state.roundNumber < state.matchType.rounds;
    return `
      <section class="result-shell">
        <div class="panel result-card">
          <div class="result-icon">△</div>
          <div class="eyebrow">TRIANGLE FORMED</div>
          <h2 class="result-title">${state.players[loser]} kalah ronde.</h2>
          <p class="result-copy"><strong>${loserColor.toUpperCase()}</strong> melengkapi tiga sisi segitiga miliknya sendiri. Karena SIM adalah avoidance game, kemenangan ronde diberikan kepada ${state.players[winner]}.</p>
          ${scoreHTML(state)}
          <div class="button-row" style="justify-content:center">
            ${hasNext ? '<button class="primary-btn big" id="nextRoundBtn" type="button">Ronde 2 · Tukar Warna</button>' : '<button class="primary-btn big" id="finishBtn" type="button">Lihat Hasil</button>'}
            <button class="secondary-btn" id="homeBtn" type="button">Menu Utama</button>
          </div>
        </div>
      </section>
    `;
  }

  function matchResult(ctx) {
    const state = ctx.state;
    const [a, b] = state.scores;
    const winner = a === b ? null : (a > b ? 0 : 1);
    return `
      <section class="result-shell">
        <div class="panel result-card">
          <div class="result-icon">${winner === null ? '⚖️' : '🏆'}</div>
          <div class="eyebrow">MATCH COMPLETE</div>
          <h2 class="result-title">${winner === null ? 'Duel imbang.' : `${state.players[winner]} menang.`}</h2>
          <p class="result-copy">${winner === null ? 'Masing-masing mengambil satu ronde setelah bertukar warna. Tidak ada keuntungan warna yang menentukan hasil duel.' : `${state.players[winner]} memenangkan lebih banyak ronde tanpa terjebak membentuk segitiga sendiri.`}</p>
          ${scoreHTML(state)}
          <div class="button-row" style="justify-content:center">
            <button class="primary-btn big" id="rematchBtn" type="button">Rematch</button>
            <button class="secondary-btn" id="homeBtn" type="button">Menu Utama</button>
          </div>
        </div>
      </section>
    `;
  }

  function render(ctx) {
    if (!ctx.state) return home();
    if (ctx.state.phase === 'setup') return setup(ctx);
    if (ctx.state.phase === 'playing') return game(ctx);
    if (ctx.state.phase === 'roundResult') return roundResult(ctx);
    if (ctx.state.phase === 'matchResult') return matchResult(ctx);
    return home();
  }

  function bindHome(ctx) {
    ctx.$('#setupBtn')?.addEventListener('click', () => {
      ctx.setState({ phase: 'setup', names: ctx.prefs.names || ['Player 1', 'Player 2'], matchTypeId: 'duel', initialBluePlayer: 0 });
      ctx.beep(640, .05);
      ctx.render();
    });
  }

  function bindSetup(ctx) {
    const state = ctx.state;
    const nameA = ctx.$('#nameA');
    const nameB = ctx.$('#nameB');

    function syncNames() {
      state.names = [nameA.value, nameB.value];
      const a = ctx.$('#blueChoiceA');
      const b = ctx.$('#blueChoiceB');
      if (a) a.textContent = nameA.value.trim() || 'Player 1';
      if (b) b.textContent = nameB.value.trim() || 'Player 2';
    }

    nameA?.addEventListener('input', syncNames);
    nameB?.addEventListener('input', syncNames);

    ctx.$$('[data-match]').forEach((button) => button.addEventListener('click', () => {
      state.matchTypeId = button.dataset.match;
      ctx.render();
    }));
    ctx.$$('[data-blue-player]').forEach((button) => button.addEventListener('click', () => {
      state.initialBluePlayer = Number(button.dataset.bluePlayer);
      ctx.render();
    }));

    ctx.$('#cancelBtn')?.addEventListener('click', () => ctx.goHome());
    ctx.$('#beginBtn')?.addEventListener('click', () => {
      const players = [nameA.value.trim() || 'Player 1', nameB.value.trim() || 'Player 2'];
      ctx.updatePrefs({ names: players });
      ctx.setState(createGameState({ players, matchTypeId: state.matchTypeId, initialBluePlayer: state.initialBluePlayer }));
      ctx.beep(720, .06);
      ctx.render();
    });
  }

  function claimEdge(ctx, a, b) {
    const state = ctx.state;
    const key = edgeKey(a, b);
    if (state.edges[key]) {
      state.selectedVertex = b;
      ctx.toast('Garis itu sudah dipakai. Pilih titik lain.');
      ctx.beep(220, .05);
      ctx.render();
      return;
    }

    const player = state.turn.turn;
    const color = colorForPlayer(state, player);
    state.edges[key] = color;
    state.lastEdge = key;
    state.selectedVertex = null;
    state.moveCount += 1;
    state.totalMoveCount += 1;

    const triangle = findTriangle(state.edges, color);
    if (triangle) {
      state.losingTriangle = triangle;
      state.roundLoser = player;
      state.roundWinner = 1 - player;
      state.scores[1 - player] += 1;
      state.phase = 'roundResult';
      ctx.beep(175, .18);
      ctx.render();
      return;
    }

    // R(3,3)=6 guarantees a monochromatic triangle before/when all 15 edges are colored.
    // This guard catches an impossible state caused by future rule changes or a logic regression.
    if (Object.keys(state.edges).length >= 15) {
      throw new Error('Invalid SIM state: K6 was fully colored without a monochromatic triangle.');
    }

    state.turn = MIAWTurnEngine.advanceTurn(state.turn);
    ctx.beep(color === 'blue' ? 620 : 470, .045);
    ctx.render();
  }

  function bindGame(ctx) {
    ctx.$$('[data-vertex]').forEach((button) => button.addEventListener('click', () => {
      const vertex = Number(button.dataset.vertex);
      const state = ctx.state;
      if (state.phase !== 'playing') return;

      if (state.selectedVertex === null) {
        state.selectedVertex = vertex;
        ctx.beep(760, .035);
        ctx.render();
        return;
      }

      if (state.selectedVertex === vertex) {
        state.selectedVertex = null;
        ctx.beep(330, .035);
        ctx.render();
        return;
      }

      claimEdge(ctx, state.selectedVertex, vertex);
    }));
  }

  function bindRoundResult(ctx) {
    ctx.$('#nextRoundBtn')?.addEventListener('click', () => {
      startRound(ctx.state, ctx.state.roundNumber + 1);
      ctx.beep(690, .06);
      ctx.render();
    });
    ctx.$('#finishBtn')?.addEventListener('click', () => {
      ctx.state.phase = 'matchResult';
      ctx.render();
    });
    ctx.$('#homeBtn')?.addEventListener('click', () => ctx.goHome());
  }

  function bindMatchResult(ctx) {
    ctx.$('#rematchBtn')?.addEventListener('click', () => {
      const old = ctx.state;
      const nextInitialBlue = 1 - old.initialBluePlayer;
      ctx.setState(createGameState({ players: old.players.slice(), matchTypeId: old.matchType.id, initialBluePlayer: nextInitialBlue }));
      ctx.beep(720, .06);
      ctx.render();
    });
    ctx.$('#homeBtn')?.addEventListener('click', () => ctx.goHome());
  }

  function bind(ctx) {
    if (!ctx.state) return bindHome(ctx);
    if (ctx.state.phase === 'setup') return bindSetup(ctx);
    if (ctx.state.phase === 'playing') return bindGame(ctx);
    if (ctx.state.phase === 'roundResult') return bindRoundResult(ctx);
    if (ctx.state.phase === 'matchResult') return bindMatchResult(ctx);
  }

  global.MIAW_GAME = {
    meta: {
      id: 'sim',
      title: 'MIAW · SIM',
      subtitle: 'Hubungkan titik. Jangan bentuk segitiga milikmu.',
      eyebrow: '2 PLAYER · SINGLE DEVICE'
    },
    defaultPrefs: { names: ['Player 1', 'Player 2'] },
    render,
    bind
  };

  // Small deterministic surface for automated regression tests.
  global.MIAW_SIM_TEST = {
    VERTICES,
    EDGE_PAIRS,
    edgeKey,
    findTriangle,
    createGameState,
    startRound,
    colorForPlayer,
    playerForColor
  };
}(window));
