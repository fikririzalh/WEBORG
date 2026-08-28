(() => {
  'use strict';

  const SIZE = 5;
  const MAX_ROUNDS = 12;
  const MAX_LIVES = 3;
  const DOORS = ['A3', 'E3'];
  const SPAWN_CAMPS = ['A1', 'E1', 'A5', 'E5'];
  const BUNNY_NAMES = ['Mochi', 'Clover', 'Pip'];
  const BUNNY_LETTERS = ['M', 'C', 'P'];

  const $ = (id) => document.getElementById(id);
  const boardEl = $('board');

  let state;

  function freshState() {
    return {
      phase: 'wolfSetupSpawn',
      round: 1,
      lives: MAX_LIVES,
      wolf: { pos: null, pending: null, history: [] },
      key: { pos: null, found: false, holder: null, dropped: false },
      doors: { A3: false, E3: false },
      bunnies: BUNNY_NAMES.map((name, i) => ({
        id: i,
        name,
        letter: BUNNY_LETTERS[i],
        pos: null,
        oldPos: null,
        planned: null,
        escaped: false,
        respawnIn: 0,
        capturedThisRound: false,
        action: null
      })),
      setupBunnyIndex: 0,
      activeBunnyIndex: 0,
      lastPublicReveal: null,
      lastPublicRevealLabel: null,
      rollingReveals: [],
      events: [],
      winner: null,
      setupChoice: null,
      privateUnlocked: true
    };
  }

  function coord(col, row) { return `${String.fromCharCode(65 + col)}${row + 1}`; }
  function parse(c) { return { col: c.charCodeAt(0) - 65, row: Number(c.slice(1)) - 1 }; }
  function manhattan(a, b) {
    const A = parse(a), B = parse(b);
    return Math.abs(A.col - B.col) + Math.abs(A.row - B.row);
  }
  function adjacent(c) {
    const { col, row } = parse(c);
    const out = [];
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dc,dr]) => {
      const nc = col + dc, nr = row + dr;
      if (nc >= 0 && nc < SIZE && nr >= 0 && nr < SIZE) out.push(coord(nc,nr));
    });
    return out;
  }
  function isDoor(c) { return DOORS.includes(c); }
  function isCamp(c) { return SPAWN_CAMPS.includes(c); }
  function doorAdjacent(c) { return DOORS.some(d => manhattan(c,d) <= 1); }

  function buildBoard() {
    boardEl.innerHTML = '';
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const id = coord(c,r);
        const tile = document.createElement('button');
        tile.type = 'button';
        tile.className = 'tile';
        tile.dataset.coord = id;
        tile.setAttribute('aria-label', `Tile ${id}`);
        tile.innerHTML = `<span class="tile-label">${id}</span>`;
        tile.addEventListener('click', () => handleTileClick(id));
        boardEl.appendChild(tile);
      }
    }
  }

  function addEvent(title, detail = '') {
    state.events.unshift({ title, detail });
    state.events = state.events.slice(0, 8);
  }

  function resetGame() {
    state = freshState();
    hide($('endModal'));
    hide($('privacyOverlay'));
    render();
  }

  function show(el) { el.classList.remove('hidden'); }
  function hide(el) { el.classList.add('hidden'); }

  function legalWolfSetupSpawn(c) {
    return !isDoor(c) && !isCamp(c);
  }
  function legalKeyCell(c) {
    return !isDoor(c) && !isCamp(c) && c !== state.wolf.pos && !doorAdjacent(c) && manhattan(c, state.wolf.pos) >= 3;
  }
  function legalWolfMoves() {
    if (!state.wolf.pos) return [];
    return adjacent(state.wolf.pos).filter(c => !( !state.key.found && c === state.key.pos ));
  }
  function legalBunnyMoves(bunny) {
    if (!bunny.pos || bunny.escaped || bunny.respawnIn > 0) return [];
    const options = adjacent(bunny.pos);
    const isHolder = state.key.holder === bunny.id;
    if (isHolder && isDoor(bunny.pos) && !state.doors[bunny.pos]) options.push(bunny.pos);
    return options;
  }

  function handleTileClick(c) {
    if (state.winner) return;

    if (state.phase === 'wolfSetupSpawn') {
      if (!legalWolfSetupSpawn(c)) return;
      state.wolf.pos = c;
      state.phase = 'wolfSetupKey';
      addEvent('Wolf spawn locked', 'Private spawn selected. Now hide the key.');
      render();
      return;
    }

    if (state.phase === 'wolfSetupKey') {
      if (!legalKeyCell(c)) return;
      state.key.pos = c;
      render();
      return;
    }

    if (state.phase === 'bunnySetup') {
      const bunny = state.bunnies[state.setupBunnyIndex];
      const occupied = state.bunnies.some(b => b.pos === c);
      if (!isCamp(c) || occupied) return;
      bunny.pos = c;
      state.setupBunnyIndex++;
      if (state.setupBunnyIndex >= state.bunnies.length) {
        state.phase = 'readyForWolf';
        addEvent('Squad deployed', 'All Bunnies selected separate spawn camps.');
      }
      render();
      return;
    }

    if (state.phase === 'wolfMove') {
      if (!legalWolfMoves().includes(c)) return;
      state.wolf.pending = c;
      render();
      return;
    }

    if (state.phase === 'bunnyMove') {
      const bunny = currentActiveBunny();
      if (!bunny) return;
      if (!legalBunnyMoves(bunny).includes(c)) return;
      bunny.planned = c;
      bunny.action = (c === bunny.pos && isDoor(c) && state.key.holder === bunny.id && !state.doors[c]) ? 'open' : 'move';
      render();
    }
  }

  function currentActiveBunny() {
    return state.bunnies.find(b => b.id === state.activeBunnyIndex) || null;
  }

  function nextMovableBunny(afterId = -1) {
    for (let i = afterId + 1; i < state.bunnies.length; i++) {
      const b = state.bunnies[i];
      if (!b.escaped && b.respawnIn === 0 && b.pos) return b;
    }
    return null;
  }

  function completeWolfSetup() {
    if (!state.key.pos) return;
    addEvent('Key hidden', 'The Bunny team does not know its location.');
    $('privacySymbol').textContent = '🐰';
    $('privacyTitle').textContent = 'Secret setup complete.';
    $('privacyText').textContent = 'Pass the device to the Bunny squad. Wolf spawn and key location are now concealed.';
    $('privacyButton').textContent = 'Open Bunny setup';
    $('privacyButton').onclick = () => {
      hide($('privacyOverlay'));
      state.phase = 'bunnySetup';
      render();
    };
    show($('privacyOverlay'));
    render();
  }

  function startRoundWolfPrivacy() {
    state.phase = 'readyForWolf';
    const allEscaped = state.bunnies.every(b => b.escaped);
    if (allEscaped || state.winner) return;
    $('privacySymbol').textContent = '🐺';
    $('privacyTitle').textContent = 'Bunnies, look away.';
    $('privacyText').textContent = `Round ${state.round}: only the Wolf player should see the next screen.`;
    $('privacyButton').textContent = 'Open Wolf view';
    $('privacyButton').onclick = () => {
      hide($('privacyOverlay'));
      state.phase = 'wolfMove';
      state.wolf.pending = null;
      render();
    };
    show($('privacyOverlay'));
    render();
  }

  function lockWolfMove() {
    if (!state.wolf.pending) return;
    state.phase = 'wolfLocked';
    $('privacySymbol').textContent = '🐰';
    $('privacyTitle').textContent = 'Wolf move locked.';
    $('privacyText').textContent = 'Pass the device to the Bunny squad. The hidden Wolf position will be concealed.';
    $('privacyButton').textContent = 'Open Bunny view';
    $('privacyButton').onclick = () => {
      hide($('privacyOverlay'));
      prepareBunnyPhase();
    };
    show($('privacyOverlay'));
    render();
  }

  function prepareBunnyPhase() {
    state.phase = 'bunnyMove';
    state.lastPublicReveal = null;
    state.lastPublicRevealLabel = null;

    // A captured Bunny skips one Bunny phase, then respawns at the start of the next one.
    state.bunnies.forEach(b => {
      b.planned = null;
      b.action = null;
      b.capturedThisRound = false;
      if (b.respawnIn > 0) {
        b.respawnIn--;
        if (b.respawnIn === 0 && !b.escaped) respawnBunny(b);
      }
    });

    const first = nextMovableBunny(-1);
    state.activeBunnyIndex = first ? first.id : -1;
    if (!first) resolveRound();
    else render();
  }

  function respawnBunny(bunny) {
    const occupied = new Set(state.bunnies.filter(b => b.pos && !b.escaped).map(b => b.pos));
    const choices = SPAWN_CAMPS.filter(c => !occupied.has(c) && c !== state.wolf.pending && c !== state.wolf.pos);
    const fallback = SPAWN_CAMPS.filter(c => !occupied.has(c));
    const pool = choices.length ? choices : fallback;
    bunny.pos = pool[0] || SPAWN_CAMPS[bunny.id % SPAWN_CAMPS.length];
    addEvent(`${bunny.name} respawned`, `Returned at ${bunny.pos} after skipping one round.`);
  }

  function confirmBunnyMove() {
    const bunny = currentActiveBunny();
    if (!bunny || !bunny.planned) return;
    const next = nextMovableBunny(bunny.id);
    if (next) {
      state.activeBunnyIndex = next.id;
      render();
    } else {
      resolveRound();
    }
  }

  function resolveRound() {
    state.phase = 'resolution';
    const wolfOld = state.wolf.pos;
    const wolfNew = state.wolf.pending || state.wolf.pos;
    const bunnyOld = new Map();

    state.bunnies.forEach(b => {
      bunnyOld.set(b.id, b.pos);
      b.oldPos = b.pos;
      if (!b.escaped && b.respawnIn === 0 && b.pos && b.planned && b.action === 'move') b.pos = b.planned;
    });

    state.wolf.pos = wolfNew;
    state.wolf.history.push({ round: state.round, pos: wolfNew });

    // Captures occur only on matching final tiles. Round one is safe. Crossing swaps are therefore safe by construction.
    const captured = [];
    if (state.round > 1) {
      state.bunnies.forEach(b => {
        if (b.escaped || b.respawnIn > 0 || !b.pos) return;
        if (b.pos === wolfNew) {
          captured.push(b);
        }
      });
    }

    if (captured.length) {
      captured.forEach(b => captureBunny(b, wolfNew));
      state.lastPublicReveal = wolfNew;
      state.lastPublicRevealLabel = `Wolf exposed at ${wolfNew}`;
      addEvent('Wolf exposed!', `Capture revealed the Wolf at ${wolfNew}.`);
    }

    // Key pickup after capture resolution.
    if (!state.key.found || state.key.dropped) {
      const finder = state.bunnies.find(b => !b.escaped && b.respawnIn === 0 && b.pos === state.key.pos);
      if (finder) {
        state.key.found = true;
        state.key.dropped = false;
        state.key.holder = finder.id;
        addEvent('Key found!', `${finder.name} picked up the shared key at ${state.key.pos}.`);
      }
    }

    // Door opening and escaping. Captured Bunnies cannot complete actions.
    state.bunnies.forEach(b => {
      if (b.escaped || b.respawnIn > 0 || !b.pos) return;
      if (b.action === 'open' && isDoor(b.pos) && state.key.holder === b.id && !state.doors[b.pos]) {
        state.doors[b.pos] = true;
        addEvent('Exit opened!', `${b.name} unlocked the ${b.pos === 'A3' ? 'west' : 'east'} gate.`);
        escapeBunny(b, b.pos);
        return;
      }
      if (isDoor(b.pos) && state.doors[b.pos] && b.action === 'move') {
        escapeBunny(b, b.pos);
      }
    });

    // Rolling reveal: after move 3 reveal move 1, etc.
    if (state.wolf.history.length >= 3) {
      const clue = state.wolf.history[state.wolf.history.length - 3];
      if (!state.rollingReveals.some(x => x.round === clue.round)) {
        state.rollingReveals.push(clue);
        addEvent('Delayed trail revealed', `Wolf was at ${clue.pos} on round ${clue.round}.`);
      }
    }

    if (state.lives <= 0) {
      endGame('wolf', 'The Bunny team ran out of lives.');
      return;
    }
    if (state.bunnies.every(b => b.escaped)) {
      endGame('bunnies', 'Every Bunny made it through an open gate.');
      return;
    }
    if (state.round >= MAX_ROUNDS) {
      endGame('wolf', 'Round 12 ended with at least one Bunny still in the forest.');
      return;
    }

    state.round++;
    state.wolf.pending = null;
    state.bunnies.forEach(b => { b.planned = null; b.action = null; });
    state.phase = 'readyForWolf';
    render();
  }

  function captureBunny(bunny, at) {
    state.lives = Math.max(0, state.lives - 1);
    bunny.capturedThisRound = true;
    if (state.key.holder === bunny.id) {
      state.key.holder = null;
      state.key.dropped = true;
      state.key.pos = at;
      addEvent('Key dropped', `${bunny.name} dropped the key at ${at}.`);
    }
    bunny.pos = null;
    bunny.respawnIn = 2;
    addEvent(`${bunny.name} was caught`, `Team life lost. ${state.lives} ${state.lives === 1 ? 'life' : 'lives'} remain.`);
  }

  function escapeBunny(bunny, door) {
    if (state.key.holder === bunny.id) {
      // Once a gate is open, the shared key remains with the squad and transfers automatically.
      const receiver = state.bunnies.find(b => b.id !== bunny.id && !b.escaped && b.respawnIn === 0 && b.pos);
      state.key.holder = receiver ? receiver.id : null;
    }
    bunny.escaped = true;
    bunny.pos = null;
    addEvent(`${bunny.name} escaped`, `Exited through ${door === 'A3' ? 'west' : 'east'} gate.`);
  }

  function endGame(winner, reason) {
    state.winner = winner;
    state.phase = 'ended';
    render();
    $('resultIcon').textContent = winner === 'bunnies' ? '🐰' : '🐺';
    $('resultEyebrow').textContent = winner === 'bunnies' ? 'BUNNY VICTORY' : 'WOLF VICTORY';
    $('resultTitle').textContent = winner === 'bunnies' ? 'The Bunnies escaped!' : 'The Wolf owns the forest.';
    $('resultText').textContent = reason;
    show($('endModal'));
  }

  function phaseContent() {
    switch (state.phase) {
      case 'wolfSetupSpawn': return ['SECRET SETUP','Wolf, enter the forest.','Choose your private spawn, then hide the shared key.','WOLF VIEW'];
      case 'wolfSetupKey': return ['SECRET SETUP','Hide the shared key.','Choose a legal tile at least three steps from your spawn and away from exits.','WOLF VIEW'];
      case 'bunnySetup': return ['SQUAD DEPLOYMENT',`${state.bunnies[state.setupBunnyIndex]?.name || 'Bunnies'}, choose a spawn camp.`, 'Each Bunny must start at a different corner camp.','BUNNY VIEW'];
      case 'readyForWolf': return ['ROUND READY',`Round ${state.round} is ready.`, 'Wolf moves first in private, then the Bunny squad plans together.','PUBLIC'];
      case 'wolfMove': return ['HIDDEN MOVEMENT',`Wolf, choose move ${state.round}.`,'Move exactly one tile horizontally or vertically. You cannot stop on the hidden key.','WOLF VIEW'];
      case 'wolfLocked': return ['MOVE LOCKED','Wolf move secured.','Pass the device to the Bunny squad.','PRIVATE'];
      case 'bunnyMove': {
        const b = currentActiveBunny();
        return ['BUNNY TURN', b ? `${b.name}, choose your move.` : 'Resolving squad moves…', b ? bunnyHint(b) : 'All Bunny actions are locked.', 'BUNNY VIEW'];
      }
      case 'resolution': return ['ROUND RESOLUTION',`Round ${state.round} resolved.`, 'Checking captures, key, exits, and delayed Wolf clues.','PUBLIC'];
      default: return ['MATCH COMPLETE','The hunt is over.','Start a new match to play again.','PUBLIC'];
    }
  }

  function bunnyHint(b) {
    if (state.key.holder === b.id && isDoor(b.pos) && !state.doors[b.pos]) return 'You hold the key. Click your current gate tile to spend this turn opening it.';
    if (!state.key.found && b.pos) {
      const d = manhattan(b.pos, state.key.pos);
      if (d === 1) return 'The key feels very close.';
      if (d === 2) return 'You hear a faint metallic jingle.';
    }
    return 'Move exactly one tile horizontally or vertically.';
  }

  function render() {
    renderHeader();
    renderStatus();
    renderBoard();
    renderDock();
    renderBunnies();
    renderTrail();
    renderEvents();
  }

  function renderHeader() {
    const [eyebrow,title,subtitle,badge] = phaseContent();
    $('phaseEyebrow').textContent = eyebrow;
    $('phaseTitle').textContent = title;
    $('phaseSubtitle').textContent = subtitle;
    $('turnBadge').innerHTML = `<span>●</span> ${badge}`;
    $('turnBadge').classList.toggle('bunny', badge.includes('BUNNY'));
  }

  function renderStatus() {
    $('roundValue').textContent = state.round;
    $('livesText').textContent = `${state.lives} / ${MAX_LIVES}`;
    $('livesRow').innerHTML = Array.from({length:MAX_LIVES},(_,i) => `<div class="life ${i >= state.lives ? 'lost' : ''}">♥</div>`).join('');

    if (!state.key.found) {
      $('keyStateText').textContent = 'Hidden';
      $('keyHeadline').textContent = 'Find the key';
      $('keyDetail').textContent = 'Wolf hid it somewhere in the forest.';
    } else if (state.key.dropped) {
      $('keyStateText').textContent = `Dropped · ${state.key.pos}`;
      $('keyHeadline').textContent = 'Key on the ground';
      $('keyDetail').textContent = `Any active Bunny can recover it at ${state.key.pos}.`;
    } else {
      const holder = state.bunnies.find(b => b.id === state.key.holder);
      $('keyStateText').textContent = holder ? holder.name : 'Shared';
      $('keyHeadline').textContent = holder ? `${holder.name} has the key` : 'Key recovered';
      $('keyDetail').textContent = 'Reach either exit and spend a turn opening it.';
    }

    const openCount = Object.values(state.doors).filter(Boolean).length;
    $('doorStateText').textContent = `${openCount} / 2 open`;
    [['doorAState','A3'],['doorBState','E3']].forEach(([id,c]) => {
      const el = $(id), open = state.doors[c];
      el.classList.toggle('open', open);
      el.querySelector('strong').textContent = open ? 'OPEN' : 'LOCKED';
    });

    $('contextTip').textContent = contextualTip();
  }

  function contextualTip() {
    if (state.phase === 'wolfSetupSpawn') return 'Wolf chooses a private spawn point first.';
    if (state.phase === 'wolfSetupKey') return 'The key cannot be beside an exit or within two steps of Wolf spawn.';
    if (state.phase === 'bunnySetup') return 'Corner circles are the four fixed Bunny spawn camps.';
    if (state.phase === 'wolfMove') return 'Wolf must move every round. Its spawn is never revealed.';
    if (state.phase === 'bunnyMove') {
      const b = currentActiveBunny();
      return b ? bunnyHint(b) : 'All Bunny plans are ready.';
    }
    return 'After Wolf move 3, move 1 is revealed. The trail then advances every round.';
  }

  function visibleWolf() {
    return ['wolfSetupSpawn','wolfSetupKey','wolfMove'].includes(state.phase);
  }
  function visibleKey() {
    return state.key.found || state.key.dropped || ['wolfSetupKey','wolfMove'].includes(state.phase);
  }

  function renderBoard() {
    const tiles = [...boardEl.children];
    tiles.forEach(tile => {
      const c = tile.dataset.coord;
      tile.className = 'tile';
      tile.innerHTML = `<span class="tile-label">${c}</span>`;

      if (isCamp(c)) tile.insertAdjacentHTML('beforeend','<span class="spawn-marker" title="Bunny spawn camp"></span>');
      if (isDoor(c)) tile.insertAdjacentHTML('beforeend', `<span class="door ${state.doors[c] ? 'open' : ''}"><span>${c === 'A3' ? 'WEST' : 'EAST'}</span></span>`);

      const legal = tileIsLegal(c);
      if (legal) tile.classList.add('legal','clickable');
      if (isSelectedTile(c)) tile.classList.add('selected');

      const plannedBunnies = state.bunnies.filter(b => b.planned === c && state.phase === 'bunnyMove');
      if (plannedBunnies.length) {
        tile.classList.add('planned');
        tile.insertAdjacentHTML('beforeend', `<span class="planned-marker">→ ${plannedBunnies.map(b=>b.letter).join('+')}</span>`);
      }

      const latestRolling = state.rollingReveals[state.rollingReveals.length - 1];
      const clueVisible = state.phase !== 'wolfMove' && latestRolling && latestRolling.pos === c;
      const captureReveal = state.lastPublicReveal === c && state.phase !== 'wolfMove';
      if (clueVisible || captureReveal) {
        tile.classList.add('revealed');
        tile.insertAdjacentHTML('beforeend', `<span class="clue-marker">${captureReveal ? 'NOW' : `R${latestRolling.round}`}</span>`);
      }

      if (visibleKey() && state.key.pos === c) tile.insertAdjacentHTML('beforeend','<span class="key-token" title="Shared key">⌕</span>');

      const pieces = [];
      if (visibleWolf() && state.wolf.pos === c) pieces.push(`<span class="piece wolf">W</span>`);
      if (state.phase === 'wolfMove' && state.wolf.pending === c) pieces.push(`<span class="piece wolf" style="opacity:.48">W</span>`);
      if (state.phase !== 'wolfMove' && state.phase !== 'wolfSetupSpawn' && state.phase !== 'wolfSetupKey') {
        state.bunnies.filter(b => b.pos === c && !b.escaped).forEach(b => pieces.push(`<span class="piece bunny">${b.letter}</span>`));
      }
      if (pieces.length) tile.insertAdjacentHTML('beforeend', `<span class="piece-stack">${pieces.join('')}</span>`);
    });
  }

  function tileIsLegal(c) {
    if (state.phase === 'wolfSetupSpawn') return legalWolfSetupSpawn(c);
    if (state.phase === 'wolfSetupKey') return legalKeyCell(c);
    if (state.phase === 'bunnySetup') return isCamp(c) && !state.bunnies.some(b => b.pos === c);
    if (state.phase === 'wolfMove') return legalWolfMoves().includes(c);
    if (state.phase === 'bunnyMove') {
      const b = currentActiveBunny();
      return b ? legalBunnyMoves(b).includes(c) : false;
    }
    return false;
  }
  function isSelectedTile(c) {
    if (state.phase === 'wolfSetupKey') return state.key.pos === c;
    if (state.phase === 'wolfMove') return state.wolf.pending === c;
    if (state.phase === 'bunnyMove') return currentActiveBunny()?.planned === c;
    return false;
  }

  function renderDock() {
    const actions = $('dockActions');
    actions.innerHTML = '';
    let title = '', text = '';

    if (state.phase === 'wolfSetupSpawn') {
      title = 'Choose Wolf spawn'; text = 'Click any legal forest tile. Corner Bunny camps and exit gates are unavailable.';
    } else if (state.phase === 'wolfSetupKey') {
      title = state.key.pos ? `Key selected: ${state.key.pos}` : 'Hide the key';
      text = 'At least 3 steps from Wolf spawn, not beside an exit, and not on a Bunny camp.';
      actions.appendChild(button('Confirm hidden setup', completeWolfSetup, 'primary-button', !state.key.pos));
    } else if (state.phase === 'bunnySetup') {
      const b = state.bunnies[state.setupBunnyIndex]; title = `${b?.name || 'Bunny'} spawn`; text = 'Choose one unused corner camp.';
    } else if (state.phase === 'readyForWolf') {
      title = `Round ${state.round} · ready`; text = 'Start the private Wolf phase when the device is in the Wolf player’s hands.';
      actions.appendChild(button('Start Wolf turn', startRoundWolfPrivacy, 'primary-button'));
    } else if (state.phase === 'wolfMove') {
      title = state.wolf.pending ? `Move selected: ${state.wolf.pending}` : 'Choose one hidden move'; text = 'The Bunny team will not see this destination.';
      actions.appendChild(button('Lock Wolf move', lockWolfMove, 'primary-button', !state.wolf.pending));
    } else if (state.phase === 'bunnyMove') {
      const b = currentActiveBunny();
      title = b ? `${b.name}'s plan` : 'Squad plan complete';
      text = b?.planned ? (b.action === 'open' ? `Open the gate at ${b.pos}.` : `Move from ${b.pos} to ${b.planned}.`) : 'Select one legal destination on the board.';
      actions.appendChild(button(b?.action === 'open' ? 'Confirm open action' : 'Confirm move', confirmBunnyMove, 'primary-button', !b?.planned));
    } else if (state.phase === 'resolution') {
      title = 'Resolving the hunt'; text = 'Movement, captures, key state, exits, and clues are being checked.';
    } else {
      title = 'Match complete'; text = 'Use Play again to reset every hidden state.';
    }

    $('dockTitle').textContent = title;
    $('dockText').textContent = text;
  }

  function button(label, fn, className, disabled=false) {
    const b = document.createElement('button');
    b.type='button'; b.className=className; b.textContent=label; b.disabled=disabled; b.addEventListener('click',fn); return b;
  }

  function renderBunnies() {
    $('bunnyCards').innerHTML = state.bunnies.map(b => {
      let stateText = b.pos || 'WAIT'; let stateClass = '';
      if (b.escaped) { stateText='ESCAPED'; stateClass='out'; }
      else if (b.respawnIn>0) { stateText='DOWN'; stateClass='down'; }
      else if (state.key.holder===b.id) { stateText='KEY'; stateClass='key'; }
      const active = state.phase==='bunnyMove' && state.activeBunnyIndex===b.id;
      return `<div class="bunny-card ${active ? 'active':''}"><div class="bunny-avatar">${b.letter}</div><div><strong>${b.name}</strong><small>${b.escaped ? 'Safe outside the forest' : b.respawnIn>0 ? 'Skips one Bunny round' : b.pos ? `Position ${b.pos}` : 'Not deployed'}</small></div><span class="bunny-state ${stateClass}">${stateText}</span></div>`;
    }).join('');
  }

  function renderTrail() {
    const list = $('trailList');
    if (!state.rollingReveals.length && !state.lastPublicReveal) {
      list.innerHTML = '<div class="empty-intel">No Wolf position has been revealed yet. After move 3, the position from move 1 appears here.</div>';
      return;
    }
    const entries = [];
    if (state.lastPublicReveal) entries.push(`<div class="trail-item reveal"><strong>Immediate reveal · ${state.lastPublicReveal}</strong><small>${state.lastPublicRevealLabel || 'Capture exposed the Wolf.'}</small></div>`);
    [...state.rollingReveals].reverse().slice(0,4).forEach(x => entries.push(`<div class="trail-item reveal"><strong>Round ${x.round} · ${x.pos}</strong><small>Delayed position revealed two rounds later.</small></div>`));
    list.innerHTML = entries.join('');
  }

  function renderEvents() {
    const list = $('eventLog');
    list.innerHTML = state.events.length ? state.events.map(e => `<div class="event-item"><strong>${e.title}</strong><small>${e.detail}</small></div>`).join('') : '<div class="empty-intel">The hunt log will record key discoveries, captures, gates, and delayed reveals.</div>';
  }

  $('rulesButton').addEventListener('click', () => show($('rulesModal')));
  $('closeRules').addEventListener('click', () => hide($('rulesModal')));
  $('rulesModal').addEventListener('click', e => { if (e.target === $('rulesModal')) hide($('rulesModal')); });
  $('resetButton').addEventListener('click', resetGame);
  $('playAgainButton').addEventListener('click', resetGame);

  buildBoard();
  resetGame();
})();
