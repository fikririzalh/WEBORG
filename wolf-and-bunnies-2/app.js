(() => {
  'use strict';

  const SIZE = 6;
  const MAX_ROUNDS = 14;
  const MAX_LIVES = 3;
  const COUNTER_HUNT_ROUNDS = 2;
  const DOORS = ['A3', 'F4'];
  const SPAWN_CAMPS = ['A1', 'F1', 'A6', 'F6'];
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
      wolf: {
        pos: null,
        pending: null,
        history: [],
        puffAvailable: true,
        puffPending: false
      },
      key: {
        pos: null,
        found: false,
        holder: null, // bunny id, 'wolf', or null
        dropped: false
      },
      counterHunt: {
        active: false,
        roundsRemaining: 0,
        startedAtRound: null
      },
      doors: { A3: false, F4: false },
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
        action: null,
        puffAvailable: true,
        puffPending: false
      })),
      setupBunnyIndex: 0,
      activeBunnyIndex: 0,
      lastPublicReveal: null,
      lastPublicRevealLabel: null,
      rollingReveals: [],
      events: [],
      winner: null
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
  function allCells() {
    const cells = [];
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) cells.push(coord(c,r));
    return cells;
  }
  function sample(list) { return list[Math.floor(Math.random() * list.length)]; }
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
    state.events = state.events.slice(0, 10);
  }

  function show(el) { el.classList.remove('hidden'); }
  function hide(el) { el.classList.add('hidden'); }

  function resetGame() {
    state = freshState();
    hide($('endModal'));
    hide($('privacyOverlay'));
    render();
  }

  function legalWolfSetupSpawn(c) {
    return !isDoor(c) && !isCamp(c);
  }

  function legalKeyCell(c) {
    return !isDoor(c) && !isCamp(c) && c !== state.wolf.pos && !doorAdjacent(c) && manhattan(c, state.wolf.pos) >= 3;
  }

  function legalWolfMoves() {
    if (!state.wolf.pos) return [];
    return adjacent(state.wolf.pos).filter(c => !(!state.key.found && c === state.key.pos));
  }

  function legalBunnyMoves(bunny) {
    if (!bunny.pos || bunny.escaped || bunny.respawnIn > 0) return [];
    const options = adjacent(bunny.pos);
    const isHolder = state.key.holder === bunny.id;
    if (isHolder && isDoor(bunny.pos) && !state.doors[bunny.pos]) options.push(bunny.pos);
    return options;
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
      state.wolf.puffPending = false;
      render();
      return;
    }

    if (state.phase === 'bunnyMove') {
      const bunny = currentActiveBunny();
      if (!bunny || !legalBunnyMoves(bunny).includes(c)) return;
      bunny.planned = c;
      bunny.puffPending = false;
      bunny.action = (c === bunny.pos && isDoor(c) && state.key.holder === bunny.id && !state.doors[c]) ? 'open' : 'move';
      render();
    }
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
    if (state.bunnies.every(b => b.escaped) || state.winner) return;
    $('privacySymbol').textContent = state.counterHunt.active ? '🌫️' : '🐺';
    $('privacyTitle').textContent = state.counterHunt.active ? 'Counter Hunt: Bunnies, look away.' : 'Bunnies, look away.';
    $('privacyText').textContent = state.counterHunt.active
      ? `Round ${state.round}: Wolf is carrying the key and fleeing. Only the Wolf player should see the next screen.`
      : `Round ${state.round}: only the Wolf player should see the next screen.`;
    $('privacyButton').textContent = 'Open Wolf view';
    $('privacyButton').onclick = () => {
      hide($('privacyOverlay'));
      state.phase = 'wolfMove';
      state.wolf.pending = null;
      state.wolf.puffPending = false;
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
    $('privacyText').textContent = state.counterHunt.active
      ? 'Pass the device to the Bunny squad. Hunt the Wolf and recover the key.'
      : 'Pass the device to the Bunny squad. The hidden Wolf position will be concealed.';
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

    state.bunnies.forEach(b => {
      b.planned = null;
      b.action = null;
      b.puffPending = false;
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
    bunny.pos = sample(pool) || SPAWN_CAMPS[bunny.id % SPAWN_CAMPS.length];
    addEvent(`${bunny.name} respawned`, `Returned at ${bunny.pos} after skipping one Bunny round.`);
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

  function wolfCanPuff() {
    return state.phase === 'wolfMove' && state.wolf.puffAvailable && state.key.holder !== 'wolf';
  }

  function bunnyCanPuff(bunny) {
    return state.phase === 'bunnyMove' && bunny && bunny.puffAvailable && state.key.holder !== bunny.id;
  }

  function randomWolfPuffDestination() {
    const occupiedBunnies = new Set(state.bunnies.filter(b => b.pos && !b.escaped).map(b => b.pos));
    let pool = allCells().filter(c => c !== state.wolf.pos && !isDoor(c) && !occupiedBunnies.has(c));
    if (!state.key.found) pool = pool.filter(c => c !== state.key.pos);
    return sample(pool) || sample(allCells().filter(c => c !== state.wolf.pos));
  }

  function randomBunnyPuffDestination(bunny) {
    const occupied = new Set(state.bunnies.filter(b => b.id !== bunny.id && b.pos && !b.escaped).map(b => b.pos));
    const pool = allCells().filter(c => c !== bunny.pos && !isDoor(c) && !occupied.has(c));
    return sample(pool) || sample(allCells().filter(c => c !== bunny.pos));
  }

  function useWolfPuff() {
    if (!wolfCanPuff()) return;
    const dest = randomWolfPuffDestination();
    if (!dest) return;
    state.wolf.pending = dest;
    state.wolf.puffAvailable = false;
    state.wolf.puffPending = true;
    addEvent('Wolf used Puff', 'The Wolf vanished into the forest. Its destination remains secret.');
    render();
  }

  function useBunnyPuff() {
    const bunny = currentActiveBunny();
    if (!bunnyCanPuff(bunny)) return;
    const dest = randomBunnyPuffDestination(bunny);
    if (!dest) return;
    bunny.planned = dest;
    bunny.action = 'puff';
    bunny.puffAvailable = false;
    bunny.puffPending = true;
    addEvent(`${bunny.name} used Puff`, 'One-time random relocation activated.');
    render();
  }

  function resolveRound() {
    state.phase = 'resolution';
    const wolfNew = state.wolf.pending || state.wolf.pos;

    state.bunnies.forEach(b => {
      b.oldPos = b.pos;
      if (!b.escaped && b.respawnIn === 0 && b.pos && b.planned && ['move','puff'].includes(b.action)) b.pos = b.planned;
    });

    state.wolf.pos = wolfNew;
    state.wolf.history.push({ round: state.round, pos: wolfNew, puff: state.wolf.puffPending });

    const movingHolder = state.bunnies.find(b => b.id === state.key.holder);
    if (movingHolder?.pos) state.key.pos = movingHolder.pos;

    let counterResolvedByHit = false;

    // Contact is resolved as an actual encounter, not only by comparing final positions.
    // Normal Hunt:
    //   1) Wolf enters a Bunny's occupied tile -> Bunny dies, even if that Bunny planned to move away.
    //   2) A surviving Bunny enters the Wolf's new tile -> Bunny dies.
    // Counter Hunt intentionally reverses the result: either kind of contact hits Wolf.
    const encounters = state.bunnies
      .filter(b => !b.escaped && b.respawnIn === 0 && b.oldPos)
      .map(b => {
        if (wolfNew === b.oldPos) return { bunny: b, at: wolfNew, type: 'wolf-entered-bunny' };
        if (b.pos === wolfNew) return { bunny: b, at: wolfNew, type: 'bunny-entered-wolf' };
        return null;
      })
      .filter(Boolean);

    if (state.counterHunt.active) {
      const encounter = encounters[0];
      if (encounter) {
        counterResolvedByHit = true;
        recoverKeyFromWolf(encounter.bunny, encounter.at);
      }
    } else if (encounters.length) {
      const seen = new Set();
      encounters.forEach(encounter => {
        if (seen.has(encounter.bunny.id)) return;
        seen.add(encounter.bunny.id);
        const detail = encounter.type === 'wolf-entered-bunny'
          ? `Wolf entered ${encounter.bunny.name}'s tile at ${encounter.at}.`
          : `${encounter.bunny.name} entered the Wolf's tile at ${encounter.at}.`;
        addEvent('Lethal contact', detail);
        captureBunny(encounter.bunny, encounter.at);
      });
      state.lastPublicReveal = wolfNew;
      state.lastPublicRevealLabel = `Wolf exposed at ${wolfNew}`;
      addEvent('Wolf exposed!', `Lethal contact revealed the Wolf at ${wolfNew}.`);
    }

    if (!state.counterHunt.active && state.key.holder !== 'wolf' && (!state.key.found || state.key.dropped)) {
      const finder = state.bunnies.find(b => !b.escaped && b.respawnIn === 0 && b.pos === state.key.pos);
      if (finder) {
        state.key.found = true;
        state.key.dropped = false;
        state.key.holder = finder.id;
        addEvent('Key found!', `${finder.name} picked up the shared key at ${state.key.pos}.`);
      }
    }

    if (!state.counterHunt.active && state.key.holder !== 'wolf') {
      state.bunnies.forEach(b => {
        if (b.escaped || b.respawnIn > 0 || !b.pos) return;
        if (b.action === 'open' && isDoor(b.pos) && state.key.holder === b.id && !state.doors[b.pos]) {
          state.doors[b.pos] = true;
          addEvent('Exit opened!', `${b.name} unlocked the ${b.pos === 'A3' ? 'west' : 'east'} gate.`);
          escapeBunny(b, b.pos);
          return;
        }
        if (isDoor(b.pos) && state.doors[b.pos] && ['move','puff'].includes(b.action)) {
          escapeBunny(b, b.pos);
        }
      });
    }

    applyRollingReveal();

    if (state.lives <= 0) {
      endGame('wolf', 'The Bunny team ran out of lives.');
      return;
    }
    if (state.bunnies.every(b => b.escaped)) {
      endGame('bunnies', 'Every Bunny made it through an open gate.');
      return;
    }

    if (state.counterHunt.active && !counterResolvedByHit && state.counterHunt.startedAtRound !== state.round) {
      state.counterHunt.roundsRemaining--;
      if (state.counterHunt.roundsRemaining <= 0) {
        endCounterHuntWithRandomDrop();
      } else {
        addEvent('Counter Hunt continues', `${state.counterHunt.roundsRemaining} chase round remains. Wolf still carries the key.`);
      }
    }

    if (state.round >= MAX_ROUNDS) {
      endGame('wolf', `Round ${MAX_ROUNDS} ended with at least one Bunny still in the forest.`);
      return;
    }

    state.round++;
    state.wolf.pending = null;
    state.wolf.puffPending = false;
    state.bunnies.forEach(b => {
      b.planned = null;
      b.action = null;
      b.puffPending = false;
    });
    state.phase = 'readyForWolf';
    render();
  }

  function applyRollingReveal() {
    if (state.wolf.history.length >= 3) {
      const clue = state.wolf.history[state.wolf.history.length - 3];
      if (!state.rollingReveals.some(x => x.round === clue.round)) {
        state.rollingReveals.push(clue);
        addEvent('Delayed trail revealed', `Wolf was at ${clue.pos} on round ${clue.round}${clue.puff ? ' after Puff' : ''}.`);
      }
    }
  }

  function captureBunny(bunny, at) {
    state.lives = Math.max(0, state.lives - 1);
    bunny.capturedThisRound = true;

    if (state.key.holder === bunny.id) {
      state.key.holder = 'wolf';
      state.key.pos = null;
      state.key.found = true;
      state.key.dropped = false;
      state.counterHunt.active = true;
      state.counterHunt.roundsRemaining = COUNTER_HUNT_ROUNDS;
      state.counterHunt.startedAtRound = state.round;
      state.lastPublicReveal = at;
      state.lastPublicRevealLabel = `Wolf stole the key at ${at}`;
      addEvent('THE HUNT HAS TURNED', `${bunny.name} fell at ${at}. Wolf stole the key. Counter Hunt begins for ${COUNTER_HUNT_ROUNDS} rounds.`);
    }

    bunny.pos = null;
    bunny.respawnIn = 2;
    addEvent(`${bunny.name} was caught`, `Team life lost. ${state.lives} ${state.lives === 1 ? 'life' : 'lives'} remain.`);
  }

  function recoverKeyFromWolf(hitter, encounterCell) {
    state.key.holder = hitter.id;
    state.key.pos = encounterCell;
    state.key.found = true;
    state.key.dropped = false;
    state.counterHunt.active = false;
    state.counterHunt.roundsRemaining = 0;
    state.counterHunt.startedAtRound = null;
    state.lastPublicReveal = encounterCell;
    state.lastPublicRevealLabel = `${hitter.name} hit Wolf at ${encounterCell}`;
    addEvent('WOLF HIT!', `${hitter.name} cornered the Wolf at ${encounterCell} and recovered the key.`);

    const retreat = chooseWolfRetreatCell(encounterCell);
    if (retreat) {
      state.wolf.pos = retreat;
      const last = state.wolf.history[state.wolf.history.length - 1];
      if (last) last.pos = retreat;
      addEvent('Wolf retreated', 'Wolf escaped to a new hidden random location. Normal hunting resumes.');
    }
  }

  function chooseWolfRetreatCell(encounterCell) {
    const bunnyPositions = state.bunnies.filter(b => b.pos && !b.escaped).map(b => b.pos);
    let pool = allCells().filter(c => !isDoor(c) && !isCamp(c) && !bunnyPositions.includes(c) && c !== encounterCell);
    let strong = pool.filter(c => bunnyPositions.every(b => manhattan(c,b) >= 2));
    if (strong.length) return sample(strong);
    if (pool.length) return sample(pool);
    return sample(allCells().filter(c => !bunnyPositions.includes(c) && c !== encounterCell));
  }

  function endCounterHuntWithRandomDrop() {
    const cell = chooseRandomKeyDrop();
    state.key.holder = null;
    state.key.pos = cell;
    state.key.found = true;
    state.key.dropped = true;
    state.counterHunt.active = false;
    state.counterHunt.roundsRemaining = 0;
    state.counterHunt.startedAtRound = null;
    addEvent('Wolf escaped the Counter Hunt', `The key was thrown back into the forest at ${cell}. Normal hunting resumes.`);
  }

  function chooseRandomKeyDrop() {
    const activeBunnies = state.bunnies.filter(b => b.pos && !b.escaped).map(b => b.pos);
    const base = allCells().filter(c => !isDoor(c) && !isCamp(c) && c !== state.wolf.pos && !activeBunnies.includes(c));
    const strict = base.filter(c => manhattan(c, state.wolf.pos) >= 3 && activeBunnies.every(b => manhattan(c,b) >= 2));
    if (strict.length) return sample(strict);
    const medium = base.filter(c => manhattan(c, state.wolf.pos) >= 2 && activeBunnies.every(b => manhattan(c,b) >= 1));
    if (medium.length) return sample(medium);
    return sample(base) || 'C3';
  }

  function escapeBunny(bunny, door) {
    if (state.key.holder === bunny.id) {
      const receiver = state.bunnies.find(b => b.id !== bunny.id && !b.escaped && b.respawnIn === 0 && b.pos);
      state.key.holder = receiver ? receiver.id : null;
      state.key.pos = receiver?.pos || null;
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
      case 'wolfSetupSpawn': return ['SECRET SETUP','Wolf, enter the larger forest.','Choose your private spawn, then hide the shared key.','WOLF VIEW'];
      case 'wolfSetupKey': return ['SECRET SETUP','Hide the shared key.','Choose a legal tile at least three steps from your spawn and away from exits.','WOLF VIEW'];
      case 'bunnySetup': return ['SQUAD DEPLOYMENT',`${state.bunnies[state.setupBunnyIndex]?.name || 'Bunnies'}, choose a spawn camp.`, 'Each Bunny must start at a different corner camp.','BUNNY VIEW'];
      case 'readyForWolf': return state.counterHunt.active
        ? ['COUNTER HUNT',`Round ${state.round}: hunt the Wolf.`, `${state.counterHunt.roundsRemaining} chase round${state.counterHunt.roundsRemaining === 1 ? '' : 's'} remain. Wolf carries the key.`,'PUBLIC']
        : ['ROUND READY',`Round ${state.round} is ready.`, 'Wolf moves first in private, then the Bunny squad plans together.','PUBLIC'];
      case 'wolfMove': return state.counterHunt.active
        ? ['COUNTER HUNT',`Wolf, escape move ${state.round}.`,'Move one orthogonal tile. Puff is disabled while you carry the key.','WOLF VIEW']
        : ['HIDDEN MOVEMENT',`Wolf, choose move ${state.round}.`,'Move one orthogonal tile, or spend your one-time Puff for a random relocation.','WOLF VIEW'];
      case 'wolfLocked': return ['MOVE LOCKED','Wolf move secured.', state.counterHunt.active ? 'Bunnies will now pursue the key-carrying Wolf.' : 'Pass the device to the Bunny squad.','PRIVATE'];
      case 'bunnyMove': {
        const b = currentActiveBunny();
        return [state.counterHunt.active ? 'COUNTER HUNT' : 'BUNNY TURN', b ? `${b.name}, choose your move.` : 'Resolving squad moves…', b ? bunnyHint(b) : 'All Bunny actions are locked.', 'BUNNY VIEW'];
      }
      case 'resolution': return ['ROUND RESOLUTION',`Round ${state.round} resolved.`, 'Checking movement, contact, key state, exits, Puff, and delayed clues.','PUBLIC'];
      default: return ['MATCH COMPLETE','The hunt is over.','Start a new match to play again.','PUBLIC'];
    }
  }

  function bunnyHint(b) {
    if (state.counterHunt.active) return "Counter Hunt: entering each other's occupied tile counts as contact. Contact hits Wolf and recovers the key.";
    if (state.key.holder === b.id && isDoor(b.pos) && !state.doors[b.pos]) return 'You hold the key. Click your current gate tile to spend this turn opening it.';
    if (!state.key.found && b.pos) {
      const d = manhattan(b.pos, state.key.pos);
      if (d === 1) return 'The key feels very close.';
      if (d === 2) return 'You hear a faint metallic jingle.';
    }
    if (b.puffAvailable && state.key.holder !== b.id) return 'Move one tile, or spend your one-time Puff for a random relocation.';
    return 'Move exactly one tile horizontally or vertically.';
  }

  function contextualTip() {
    if (state.phase === 'wolfSetupSpawn') return '6×6 gives both teams more space for deduction and flanking.';
    if (state.phase === 'wolfSetupKey') return 'The key cannot be beside an exit or within two steps of Wolf spawn.';
    if (state.phase === 'bunnySetup') return 'Choose three different corner camps.';
    if (state.counterHunt.active) return "Hunter becomes hunted: if Wolf enters a Bunny tile or a Bunny enters Wolf's tile, contact hits Wolf and recovers the key.";
    if (state.phase === 'wolfMove') return state.wolf.puffAvailable ? 'Wolf still has one Puff. Use it carefully because the destination is random.' : 'Wolf Puff has already been spent.';
    if (state.phase === 'bunnyMove') {
      const b = currentActiveBunny();
      return b ? bunnyHint(b) : 'All Bunny plans are ready.';
    }
    return 'The Wolf trail is revealed two rounds late, unless a capture exposes its current location.';
  }

  function visibleWolf() {
    return ['wolfSetupSpawn','wolfSetupKey','wolfMove'].includes(state.phase);
  }

  function visibleKey() {
    if (state.key.holder === 'wolf') return false;
    return state.key.found || state.key.dropped || ['wolfSetupKey','wolfMove'].includes(state.phase);
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
    $('modeChip').textContent = state.counterHunt.active ? 'COUNTER HUNT · 6×6' : 'HIDDEN HUNT · 6×6';
    $('modeChip').classList.toggle('counter', state.counterHunt.active);
  }

  function renderStatus() {
    $('roundValue').textContent = state.round;
    $('livesText').textContent = `${state.lives} / ${MAX_LIVES}`;
    $('livesRow').innerHTML = Array.from({length:MAX_LIVES},(_,i) => `<div class="life ${i >= state.lives ? 'lost' : ''}">♥</div>`).join('');

    if (state.key.holder === 'wolf') {
      $('keyStateText').textContent = 'STOLEN';
      $('keyHeadline').textContent = 'Wolf has the key';
      $('keyDetail').textContent = 'Counter Hunt is active. Hit the Wolf before the chase timer ends.';
    } else if (!state.key.found) {
      $('keyStateText').textContent = 'Hidden';
      $('keyHeadline').textContent = 'Find the key';
      $('keyDetail').textContent = 'Wolf hid it somewhere in the forest.';
    } else if (state.key.dropped) {
      $('keyStateText').textContent = `Dropped · ${state.key.pos}`;
      $('keyHeadline').textContent = 'Key thrown into the forest';
      $('keyDetail').textContent = `Any active Bunny can recover it at ${state.key.pos}.`;
    } else {
      const holder = state.bunnies.find(b => b.id === state.key.holder);
      $('keyStateText').textContent = holder ? holder.name : 'Shared';
      $('keyHeadline').textContent = holder ? `${holder.name} has the key` : 'Key recovered';
      $('keyDetail').textContent = 'Reach either exit and spend a turn opening it.';
    }

    $('wolfPuffText').textContent = state.wolf.puffAvailable ? (state.key.holder === 'wolf' ? 'LOCKED · KEY' : 'READY · 1×') : 'USED';

    if (state.counterHunt.active) {
      show($('counterCard'));
      $('counterRounds').textContent = `${state.counterHunt.roundsRemaining} ROUND${state.counterHunt.roundsRemaining === 1 ? '' : 'S'}`;
      $('counterHeadline').textContent = 'Bunnies hunt the Wolf';
    } else {
      hide($('counterCard'));
    }

    const openCount = Object.values(state.doors).filter(Boolean).length;
    $('doorStateText').textContent = `${openCount} / 2 open`;
    [['doorAState','A3'],['doorBState','F4']].forEach(([id,c]) => {
      const el = $(id), open = state.doors[c];
      el.classList.toggle('open', open);
      el.querySelector('strong').textContent = open ? 'OPEN' : 'LOCKED';
    });

    $('contextTip').textContent = contextualTip();
  }

  function renderBoard() {
    [...boardEl.children].forEach(tile => {
      const c = tile.dataset.coord;
      tile.className = 'tile';
      tile.innerHTML = `<span class="tile-label">${c}</span>`;

      if (isCamp(c)) tile.insertAdjacentHTML('beforeend','<span class="spawn-marker" title="Bunny spawn camp"></span>');
      if (isDoor(c)) tile.insertAdjacentHTML('beforeend', `<span class="door ${state.doors[c] ? 'open' : ''}"><span>${c === 'A3' ? 'WEST' : 'EAST'}</span></span>`);

      if (tileIsLegal(c)) tile.classList.add('legal','clickable');
      if (isSelectedTile(c)) tile.classList.add('selected');

      const currentBunny = currentActiveBunny();
      if ((state.wolf.puffPending && state.phase === 'wolfMove' && state.wolf.pending === c) ||
          (currentBunny?.puffPending && state.phase === 'bunnyMove' && currentBunny.planned === c)) {
        tile.classList.add('puff-selected');
      }

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
      if (visibleWolf() && state.wolf.pos === c) pieces.push('<span class="piece wolf">W</span>');
      if (state.phase === 'wolfMove' && state.wolf.pending === c) pieces.push(`<span class="piece wolf" style="opacity:.48">${state.wolf.puffPending ? 'P' : 'W'}</span>`);
      if (state.phase !== 'wolfMove' && state.phase !== 'wolfSetupSpawn' && state.phase !== 'wolfSetupKey') {
        state.bunnies.filter(b => b.pos === c && !b.escaped).forEach(b => pieces.push(`<span class="piece bunny">${b.letter}</span>`));
      }
      if (pieces.length) tile.insertAdjacentHTML('beforeend', `<span class="piece-stack">${pieces.join('')}</span>`);
    });
  }

  function renderDock() {
    const actions = $('dockActions');
    actions.innerHTML = '';
    let title = '', text = '';

    if (state.phase === 'wolfSetupSpawn') {
      title = 'Choose Wolf spawn';
      text = 'Click any legal forest tile. Corner Bunny camps and exit gates are unavailable.';
    } else if (state.phase === 'wolfSetupKey') {
      title = state.key.pos ? `Key selected: ${state.key.pos}` : 'Hide the key';
      text = 'At least 3 steps from Wolf spawn, not beside an exit, and not on a Bunny camp.';
      actions.appendChild(button('Confirm hidden setup', completeWolfSetup, 'primary-button', !state.key.pos));
    } else if (state.phase === 'bunnySetup') {
      const b = state.bunnies[state.setupBunnyIndex];
      title = `${b?.name || 'Bunny'} spawn`;
      text = 'Choose one unused corner camp.';
    } else if (state.phase === 'readyForWolf') {
      title = state.counterHunt.active ? `Counter Hunt · ${state.counterHunt.roundsRemaining} round${state.counterHunt.roundsRemaining === 1 ? '' : 's'} left` : `Round ${state.round} · ready`;
      text = state.counterHunt.active ? 'Wolf flees first in private. Then Bunnies predict and pursue.' : 'Start the private Wolf phase when the device is in the Wolf player’s hands.';
      actions.appendChild(button(state.counterHunt.active ? 'Start escape turn' : 'Start Wolf turn', startRoundWolfPrivacy, 'primary-button'));
    } else if (state.phase === 'wolfMove') {
      title = state.wolf.pending ? `${state.wolf.puffPending ? 'Puff destination' : 'Move selected'}: ${state.wolf.pending}` : 'Choose one hidden move';
      text = state.counterHunt.active ? 'You carry the key. Puff is locked during Counter Hunt.' : 'Move one tile or spend your one-time Puff. Bunny team will not see the destination.';
      if (wolfCanPuff()) actions.appendChild(button('Use Puff · 1×', useWolfPuff, 'secondary-button puff-button'));
      actions.appendChild(button('Lock Wolf move', lockWolfMove, 'primary-button', !state.wolf.pending));
    } else if (state.phase === 'bunnyMove') {
      const b = currentActiveBunny();
      title = b ? `${b.name}'s plan` : 'Squad plan complete';
      text = b?.planned
        ? (b.action === 'open' ? `Open the gate at ${b.pos}.` : `${b.action === 'puff' ? 'Puff' : 'Move'} from ${b.pos} to ${b.planned}.`)
        : (state.counterHunt.active ? 'Predict the Wolf or reposition to cut off escape routes.' : 'Select one legal destination or use Puff.');
      if (bunnyCanPuff(b)) actions.appendChild(button('Use Puff · 1×', useBunnyPuff, 'secondary-button puff-button'));
      actions.appendChild(button(b?.action === 'open' ? 'Confirm open action' : 'Confirm move', confirmBunnyMove, 'primary-button', !b?.planned));
    } else if (state.phase === 'resolution') {
      title = 'Resolving the hunt';
      text = 'Movement, contact, key state, exits, Puff, and clues are being checked.';
    } else {
      title = 'Match complete';
      text = 'Use Play again to reset every hidden state.';
    }

    $('dockTitle').textContent = title;
    $('dockText').textContent = text;
  }

  function button(label, fn, className, disabled=false) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = className;
    b.textContent = label;
    b.disabled = disabled;
    b.addEventListener('click', fn);
    return b;
  }

  function renderBunnies() {
    $('bunnyCards').innerHTML = state.bunnies.map(b => {
      let stateText = b.pos || 'WAIT';
      let stateClass = '';
      if (b.escaped) { stateText='ESCAPED'; stateClass='out'; }
      else if (b.respawnIn>0) { stateText='DOWN'; stateClass='down'; }
      else if (state.key.holder===b.id) { stateText='KEY'; stateClass='key'; }
      else if (b.puffAvailable) { stateText='PUFF'; stateClass='puff'; }
      const active = state.phase==='bunnyMove' && state.activeBunnyIndex===b.id;
      const sub = b.escaped ? 'Safe outside the forest'
        : b.respawnIn>0 ? 'Skips one Bunny round'
        : b.pos ? `Position ${b.pos} · Puff ${b.puffAvailable ? 'ready' : 'used'}`
        : 'Not deployed';
      return `<div class="bunny-card ${active ? 'active':''}"><div class="bunny-avatar">${b.letter}</div><div><strong>${b.name}</strong><small>${sub}</small></div><span class="bunny-state ${stateClass}">${stateText}</span></div>`;
    }).join('');
  }

  function renderTrail() {
    const list = $('trailList');
    if (!state.rollingReveals.length && !state.lastPublicReveal) {
      list.innerHTML = '<div class="empty-intel">No Wolf position has been revealed yet. After move 3, the position from move 1 appears here.</div>';
      return;
    }
    const entries = [];
    if (state.lastPublicReveal) entries.push(`<div class="trail-item reveal"><strong>Immediate reveal · ${state.lastPublicReveal}</strong><small>${state.lastPublicRevealLabel || 'Wolf exposed.'}</small></div>`);
    [...state.rollingReveals].reverse().slice(0,4).forEach(x => entries.push(`<div class="trail-item reveal"><strong>Round ${x.round} · ${x.pos}</strong><small>Delayed position revealed two rounds later${x.puff ? ' after Puff reset' : ''}.</small></div>`));
    list.innerHTML = entries.join('');
  }

  function renderEvents() {
    const list = $('eventLog');
    list.innerHTML = state.events.length
      ? state.events.map(e => `<div class="event-item"><strong>${e.title}</strong><small>${e.detail}</small></div>`).join('')
      : '<div class="empty-intel">The hunt log will record key discoveries, captures, Counter Hunt, Puff, gates, and delayed reveals.</div>';
  }

  $('rulesButton').addEventListener('click', () => show($('rulesModal')));
  $('closeRules').addEventListener('click', () => hide($('rulesModal')));
  $('rulesModal').addEventListener('click', e => { if (e.target === $('rulesModal')) hide($('rulesModal')); });
  $('resetButton').addEventListener('click', resetGame);
  $('playAgainButton').addEventListener('click', resetGame);

  buildBoard();
  resetGame();
})();
