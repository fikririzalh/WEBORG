(function (global) {
  'use strict';

  const TARGET = 10;

  function playerCards(state) {
    return state.players.map((name, index) => `
      <article class="player-card ${state.turn.turn === index && state.phase === 'turn' ? 'active' : ''}">
        <span class="player-index">P${index + 1}</span>
        <div>
          <b>${MIAWBase.escapeHTML(name)}</b>
          <small>${state.scores[index]} / ${TARGET} poin</small>
        </div>
        <div class="score-number">${state.scores[index]}</div>
      </article>
    `).join('');
  }

  function history(state) {
    if (!state.history.length) return '<div class="note">Belum ada aksi. Contoh ini sengaja sederhana agar struktur base mudah dibaca.</div>';
    return `
      <div class="activity-list">
        ${[...state.history].reverse().map((item) => `
          <div class="activity-row">
            <span>Round ${item.round}</span>
            <b>${MIAWBase.escapeHTML(item.player)}</b>
            <strong>+${item.gain}</strong>
          </div>
        `).join('')}
      </div>
    `;
  }

  function home() {
    return `
      <section class="hero">
        <div class="panel hero-main">
          <div class="eyebrow">STARTER KIT</div>
          <div class="hero-title">Build rules.<br>Reuse the shell.</div>
          <p class="hero-copy">MIAW BASE memisahkan platform web reusable dari aturan game. Contoh kecil di dalam repository ini hanya menunjukkan kontrak plugin, turn engine, local preferences, audio, tema, dan responsive UI.</p>
          <div class="button-row">
            <button class="primary-btn big" id="setupBtn" type="button">🎲 Jalankan Example Game</button>
          </div>
          <div class="note">Untuk membuat boardgame baru, AI seharusnya mempertahankan <code>/core</code> dan mengganti atau menambah plugin di <code>/games</code>.</div>
        </div>
        <div class="panel">
          <div class="eyebrow">BASE CAPABILITIES</div>
          <div class="feature-grid">
            <div class="feature"><b>State shell</b><span>Runtime, render loop, preferences.</span></div>
            <div class="feature"><b>Turn engine</b><span>Player order, round, turn number.</span></div>
            <div class="feature"><b>1-device flow</b><span>Pass-device screen siap dipakai.</span></div>
            <div class="feature"><b>UX layer</b><span>Theme, sound, toast, responsive UI.</span></div>
          </div>
        </div>
      </section>
    `;
  }

  function setup(ctx) {
    const names = ctx.prefs.names || ['Player A', 'Player B'];
    return `
      <section class="panel narrow-panel">
        <div class="eyebrow">EXAMPLE GAME SETUP</div>
        <h2>Race to ${TARGET}</h2>
        <p class="hero-copy">Demo ini bukan game utama. Fungsinya sebagai executable reference untuk AI yang akan membuat game baru.</p>
        <div class="setup-grid">
          <label class="field">Player A<input id="nameA" maxlength="24" value="${ctx.escapeHTML(names[0] || 'Player A')}"></label>
          <label class="field">Player B<input id="nameB" maxlength="24" value="${ctx.escapeHTML(names[1] || 'Player B')}"></label>
        </div>
        <div class="button-row">
          <button class="primary-btn big" id="beginBtn" type="button">Mulai Demo</button>
          <button class="secondary-btn" id="cancelBtn" type="button">Batal</button>
        </div>
      </section>
    `;
  }

  function passTurn(state) {
    const active = state.turn.turn;
    return `
      <section class="panel">
        <div class="center-screen">
          <div class="big-emoji">😼📱</div>
          <div class="round-pill">ROUND ${state.turn.round}</div>
          <div class="player-name">Giliran ${MIAWBase.escapeHTML(state.players[active])}</div>
          <p class="hero-copy">Template ini menyediakan layar pass-device agar hidden information dapat ditambahkan oleh game baru tanpa membangun ulang flow dasarnya.</p>
          <button class="primary-btn big" id="openTurnBtn" type="button">Saya ${MIAWBase.escapeHTML(state.players[active])} → lanjut</button>
        </div>
      </section>
    `;
  }

  function turn(state) {
    const active = state.turn.turn;
    return `
      <section class="panel">
        <div class="game-screen">
          <div class="round-pill">ROUND ${state.turn.round} • TURN ${state.turn.turnNumber}</div>
          <div class="player-grid">${playerCards(state)}</div>
          <div class="action-card">
            <div class="eyebrow">EXAMPLE ACTION</div>
            <h2>${MIAWBase.escapeHTML(state.players[active])}</h2>
            <p>Tekan tombol untuk memperoleh 1–3 poin acak. Player pertama mencapai ${TARGET} menang.</p>
            <button class="primary-btn big" id="actionBtn" type="button">🎲 Ambil Aksi</button>
          </div>
          <div class="history-wrap">
            <div class="section-heading"><b>Activity log</b><span class="eyebrow">DEMO</span></div>
            ${history(state)}
          </div>
        </div>
      </section>
    `;
  }

  function feedback(state) {
    const item = state.lastAction;
    return `
      <section class="panel">
        <div class="center-screen">
          <div class="big-emoji">🎲</div>
          <div class="eyebrow">ACTION RESULT</div>
          <div class="player-name">+${item.gain} poin</div>
          <p class="hero-copy">${MIAWBase.escapeHTML(item.player)} sekarang memiliki <b>${item.score}</b> dari ${TARGET} poin.</p>
          <button class="primary-btn big" id="continueBtn" type="button">${state.winner !== null ? '🏆 Lihat Hasil' : '📱 Pass Device'}</button>
        </div>
      </section>
    `;
  }

  function final(state) {
    const winner = state.players[state.winner];
    return `
      <section class="panel">
        <div class="center-screen">
          <div class="eyebrow">EXAMPLE COMPLETE</div>
          <div class="win-title">🏆 ${MIAWBase.escapeHTML(winner)}</div>
          <p class="hero-copy">Demo selesai. Core tidak memiliki pengetahuan tentang aturan Race to ${TARGET}; seluruh rule berada di <code>games/example-game.js</code>.</p>
          <div class="player-grid final-grid">${playerCards(state)}</div>
          <div class="button-row centered">
            <button class="primary-btn big" id="rematchBtn" type="button">🔁 Rematch</button>
            <button class="secondary-btn" id="homeBtn" type="button">🏠 Base Home</button>
          </div>
        </div>
      </section>
    `;
  }

  function newState(players) {
    return {
      phase: 'passTurn',
      players,
      scores: players.map(() => 0),
      history: [],
      lastAction: null,
      winner: null,
      turn: MIAWTurnEngine.createTurnState(players.length)
    };
  }

  const game = {
    meta: {
      id: 'miaw-example-race',
      title: 'MIAW BASE',
      subtitle: 'Reusable web boardgame foundation + executable example.',
      eyebrow: 'BOARDGAME WEB STARTER'
    },

    defaultPrefs: {
      names: ['Oyen', 'Mochi']
    },

    render(ctx) {
      if (!ctx.state) return home();
      if (ctx.state.phase === 'setup') return setup(ctx);
      if (ctx.state.phase === 'passTurn') return passTurn(ctx.state);
      if (ctx.state.phase === 'turn') return turn(ctx.state);
      if (ctx.state.phase === 'feedback') return feedback(ctx.state);
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
        const a = ctx.$('#nameA').value.trim() || 'Player A';
        const b = ctx.$('#nameB').value.trim() || 'Player B';
        ctx.updatePrefs({ names: [a, b] });
        ctx.setState(newState([a, b]));
        ctx.beep(760, 0.06);
        ctx.render();
      });

      ctx.$('#openTurnBtn')?.addEventListener('click', () => {
        ctx.state.phase = 'turn';
        ctx.render();
      });

      ctx.$('#actionBtn')?.addEventListener('click', () => {
        const active = ctx.state.turn.turn;
        const gain = Math.floor(Math.random() * 3) + 1;
        ctx.state.scores[active] += gain;
        ctx.state.lastAction = {
          player: ctx.state.players[active],
          playerIndex: active,
          gain,
          score: ctx.state.scores[active],
          round: ctx.state.turn.round,
          turnNumber: ctx.state.turn.turnNumber
        };
        ctx.state.history.push(ctx.state.lastAction);

        if (ctx.state.scores[active] >= TARGET) {
          ctx.state.winner = active;
        } else {
          ctx.state.turn = MIAWTurnEngine.advanceTurn(ctx.state.turn);
        }

        ctx.state.phase = 'feedback';
        ctx.beep(ctx.state.winner !== null ? 900 : 560, 0.07);
        ctx.render();
      });

      ctx.$('#continueBtn')?.addEventListener('click', () => {
        ctx.state.phase = ctx.state.winner !== null ? 'final' : 'passTurn';
        ctx.render();
      });

      ctx.$('#rematchBtn')?.addEventListener('click', () => {
        ctx.setState(newState([...ctx.state.players]));
        ctx.render();
      });

      ctx.$('#homeBtn')?.addEventListener('click', ctx.goHome);
    }
  };

  global.MIAW_GAME = game;
}(window));
