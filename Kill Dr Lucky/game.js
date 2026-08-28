'use strict';

/*
  Lucky Mansion — Browser Edition
  ------------------------------------------------------------
  Offline, local pass-and-play / bot board-game implementation.
  The rules are an original browser adaptation built around the
  numbered 1997-style mansion map supplied by the user.
*/

const STORAGE_KEY = 'luckyMansionBrowserSaveV3';
const VERSION = 3;

const ROOMS = [
  { id: 0,  name: 'Drawing Room',       x: 50.1, y: 57.0 },
  { id: 1,  name: 'Parlor',             x: 70.7, y: 65.1 },
  { id: 2,  name: 'Billiard Room',      x: 70.5, y: 29.7 },
  { id: 3,  name: 'Dining Hall',        x: 41.7, y: 23.6 },
  { id: 4,  name: 'Sitting Room',       x: 28.5, y: 23.7 },
  { id: 5,  name: 'Trophy Room',        x: 28.7, y: 64.8 },
  { id: 6,  name: 'Green House',        x: 28.5, y: 74.0 },
  { id: 7,  name: 'Winter Garden',      x: 5.6,  y: 84.1 },
  { id: 8,  name: 'Kitchen',            x: 5.3,  y: 65.0 },
  { id: 9,  name: 'Lancaster Room',     x: 10.1, y: 40.5 },
  { id: 10, name: 'Master Suite',       x: 5.5,  y: 6.1 },
  { id: 11, name: 'Nursery',            x: 28.7, y: 6.2 },
  { id: 12, name: 'Armory',             x: 41.5, y: 6.1 },
  { id: 13, name: 'Library',            x: 70.6, y: 6.1 },
  { id: 14, name: 'Tennessee Room',     x: 94.4, y: 6.1 },
  { id: 15, name: 'Lilac Room',         x: 89.6, y: 40.5 },
  { id: 16, name: "Servants' Quarters",x: 94.4, y: 64.8 },
  { id: 17, name: 'Hedge Maze',         x: 94.5, y: 84.1 },
  { id: 18, name: 'Carriage House',     x: 70.7, y: 74.0 },
  { id: 19, name: 'Piazza',             x: 41.4, y: 71.6 }
];

// Browser-friendly door graph, tuned to the supplied map.
const ADJ = {
  0:[1,3,5,19], 1:[0,2,16,18], 2:[1,3,13,15], 3:[0,2,4,12],
  4:[3,5,9,11], 5:[0,4,6,8], 6:[5,7,19], 7:[6,8], 8:[5,7,9],
  9:[4,8,10], 10:[9,11], 11:[10,4,12], 12:[11,3,13], 13:[12,2,14],
  14:[13,15], 15:[2,14,16], 16:[1,15,17], 17:[16,18], 18:[1,17,19],
  19:[0,6,18]
};

// Straight-ish sight corridors. Same-room visibility is always true.
const SIGHT_GROUPS = [
  [10,9,8,7],
  [11,4,5,6],
  [12,3,0,19],
  [13,2,1,18],
  [14,15,16,17],
  [10,11,12,13,14],
  [9,4,3,2,15],
  [8,5,0,1,16],
  [7,6,19,18,17]
];

const PLAYER_STYLES = [
  { color:'#9d4a43', short:'M' },
  { color:'#416d9b', short:'B' },
  { color:'#8a712a', short:'E' },
  { color:'#4f7d5b', short:'H' },
  { color:'#785c93', short:'U' },
  { color:'#a46231', short:'J' },
  { color:'#3d8786', short:'T' }
];

const DEFAULT_NAMES = ['Merah','Biru','Emas','Hijau','Ungu','Jingga','Toska'];

const SCHEME_NAMES = [
  'Rencana Diam-diam','Kesempatan Sempurna','Alibi Rapi','Langkah Terukur','Saat yang Tepat','Rencana Cadangan'
];
const FAILURE_NAMES = [
  'Kebetulan Aneh','Gangguan Mendadak','Salah Waktu','Suara dari Lorong','Pintu Terbuka','Nasib Baik'
];
const MOVE_NAMES = [
  'Jalan Pintas','Langkah Cepat','Lewat Lorong','Putar Balik','Menyelinap'
];

let state = null;
let attemptDraft = null;
let pendingAttempt = null;
let selectedBlockCards = new Set();
let toastTimer = null;
let aiTimer = null;
let tutorialIndex = 0;
let handVisible = false;
let soundEnabled = true;

const $ = (sel) => document.querySelector(sel);
const els = {
  board: $('#board'), roomLayer: $('#roomLayer'), tokenLayer: $('#tokenLayer'), sightLayer: $('#sightLayer'), boardToast: $('#boardToast'), boardHint: $('#boardHint'),
  turnLabel: $('#turnLabel'), phaseLabel: $('#phaseLabel'), roomLabel: $('#roomLabel'), spiteLabel: $('#spiteLabel'), handCountLabel: $('#handCountLabel'), deckLabel: $('#deckLabel'), doctorRoomLabel: $('#doctorRoomLabel'), activeTokenPreview: $('#activeTokenPreview'), roundLabel: $('#roundLabel'), actionPointText: $('#actionPointText'),
  stayBtn: $('#stayBtn'), drawBtn: $('#drawBtn'), attemptBtn: $('#attemptBtn'), endTurnBtn: $('#endTurnBtn'), eligibilityText: $('#eligibilityText'), hand: $('#hand'), handPrivacyBadge: $('#handPrivacyBadge'), playersList: $('#playersList'), log: $('#log'), clearLogBtn: $('#clearLogBtn'),
  soundBtn: $('#soundBtn'), rulesBtn: $('#rulesBtn'), newGameBtn: $('#newGameBtn'),
  setupDialog: $('#setupDialog'), setupForm: $('#setupForm'), playerCountSelect: $('#playerCountSelect'), seatEditor: $('#seatEditor'), tutorialToggle: $('#tutorialToggle'), resumeBtn: $('#resumeBtn'), startGameBtn: $('#startGameBtn'),
  handoffDialog: $('#handoffDialog'), handoffToken: $('#handoffToken'), handoffTitle: $('#handoffTitle'), handoffText: $('#handoffText'), revealTurnBtn: $('#revealTurnBtn'),
  attemptDialog: $('#attemptDialog'), attemptText: $('#attemptText'), attemptCards: $('#attemptCards'), attemptStrengthPreview: $('#attemptStrengthPreview'), cancelAttemptBtn: $('#cancelAttemptBtn'), confirmAttemptBtn: $('#confirmAttemptBtn'),
  responseHandoffDialog: $('#responseHandoffDialog'), responseHandoffToken: $('#responseHandoffToken'), responseHandoffTitle: $('#responseHandoffTitle'), responseHandoffText: $('#responseHandoffText'), revealResponseBtn: $('#revealResponseBtn'),
  blockDialog: $('#blockDialog'), blockTitle: $('#blockTitle'), blockText: $('#blockText'), blockCards: $('#blockCards'), blockMeterFill: $('#blockMeterFill'), blockMeterText: $('#blockMeterText'), passBlockBtn: $('#passBlockBtn'), playBlockBtn: $('#playBlockBtn'),
  winnerDialog: $('#winnerDialog'), winnerTitle: $('#winnerTitle'), winnerText: $('#winnerText'), winnerStats: $('#winnerStats'), winnerNewGameBtn: $('#winnerNewGameBtn'),
  rulesDialog: $('#rulesDialog'), closeRulesBtn: $('#closeRulesBtn'),
  tutorial: $('#tutorial'), tutorialStepText: $('#tutorialStepText'), tutorialNextBtn: $('#tutorialNextBtn'), tutorialSkipBtn: $('#tutorialSkipBtn')
};

function room(id) { return ROOMS[id]; }
function player(id) { return state.players.find(p => p.id === id); }
function currentPlayer() { return player(state.currentPlayerId); }
function isHuman(p = currentPlayer()) { return p.type === 'human'; }
function clamp(n,a,b){ return Math.max(a,Math.min(b,n)); }

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeCard(type, value, index) {
  const namePool = type === 'scheme' ? SCHEME_NAMES : type === 'failure' ? FAILURE_NAMES : MOVE_NAMES;
  const prefix = type === 'scheme' ? 'Rencana' : type === 'failure' ? 'Gagalkan' : 'Gerak';
  return {
    uid: `${type}-${Date.now()}-${index}-${Math.random().toString(36).slice(2,8)}`,
    type,
    value,
    name: namePool[index % namePool.length],
    label: `${prefix} +${value}`
  };
}

function buildDeck() {
  const specs = [];
  // 96 cards: large enough for 7 players and a long session.
  for (let i=0;i<12;i++) specs.push(['scheme',1]);
  for (let i=0;i<8;i++) specs.push(['scheme',2]);
  for (let i=0;i<6;i++) specs.push(['scheme',3]);
  for (let i=0;i<22;i++) specs.push(['failure',1]);
  for (let i=0;i<16;i++) specs.push(['failure',2]);
  for (let i=0;i<12;i++) specs.push(['failure',3]);
  for (let i=0;i<11;i++) specs.push(['move',1]);
  for (let i=0;i<9;i++) specs.push(['move',2]);
  return shuffle(specs.map(([t,v],i) => makeCard(t,v,i)));
}

function nowStamp() {
  return new Date().toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'});
}

function addLog(message) {
  if (!state) return;
  state.log.unshift({message, time: nowStamp()});
  state.log = state.log.slice(0, 90);
}

function beep(freq = 440, duration = .05) {
  if (!soundEnabled) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
    setTimeout(() => ctx.close(), 250);
  } catch (_) {}
}

function toast(message) {
  els.boardToast.textContent = message;
  els.boardToast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.boardToast.classList.remove('show'), 1700);
}

function canSee(a, b) {
  if (a === b) return true;
  return SIGHT_GROUPS.some(group => group.includes(a) && group.includes(b));
}

function witnessesAt(roomId, exceptPlayerId = null) {
  return state.players.filter(p => p.id !== exceptPlayerId && canSee(p.room, roomId));
}

function unseenFor(playerId) {
  const p = player(playerId);
  return witnessesAt(p.room, p.id).length === 0;
}

function canDraw(playerId = state.currentPlayerId) {
  const p = player(playerId);
  if (state.gameOver) return {ok:false, why:'Permainan sudah selesai.'};
  if (state.turn.drawn) return {ok:false, why:'Anda sudah mencari kartu pada giliran ini.'};
  const ws = witnessesAt(p.room, p.id);
  if (ws.length) return {ok:false, why:`Belum aman mencari kartu; terlihat oleh ${ws.map(x=>x.name).join(', ')}.`};
  if (state.deck.length === 0 && state.discard.length === 0) return {ok:false, why:'Tidak ada kartu tersisa.'};
  return {ok:true, why:'Ruangan tidak terlihat pemain lain — Anda boleh mencari 1 kartu.'};
}

function canAttempt(playerId = state.currentPlayerId) {
  const p = player(playerId);
  if (state.gameOver) return {ok:false, why:'Permainan sudah selesai.'};
  if (state.turn.attempted) return {ok:false, why:'Anda sudah melakukan percobaan pada giliran ini.'};
  if (p.room !== state.doctorRoom) return {ok:false, why:'Anda harus berada di ruangan yang sama dengan Dr. Lucky.'};
  const ws = witnessesAt(p.room, p.id);
  if (ws.length) return {ok:false, why:`Belum privat; ruangan terlihat oleh ${ws.map(x=>x.name).join(', ')}.`};
  return {ok:true, why:'Kondisi terpenuhi — ruangan privat dan Dr. Lucky ada di sini.'};
}

function phaseName() {
  if (state.gameOver) return 'Permainan selesai';
  if (pendingAttempt) return 'Menunggu respons lawan';
  if (!state.turn.movementResolved) return 'Fase bergerak';
  return 'Fase aksi';
}

function movementCredits() {
  return Math.max(0, (state.turn.freeMoveUsed ? 0 : 1) + (state.turn.extraMoves || 0));
}

function reachableRooms() {
  if (!state || state.gameOver || pendingAttempt || !isHuman() || !handVisible) return [];
  if (state.turn.movementResolved || movementCredits() <= 0) return [];
  return ADJ[currentPlayer().room] || [];
}

function movePlayerTo(playerId, targetRoom, {bot=false} = {}) {
  const p = player(playerId);
  if (!ADJ[p.room]?.includes(targetRoom)) return false;
  if (movementCredits() <= 0 || state.turn.movementResolved) return false;
  const from = p.room;
  p.room = targetRoom;
  if (!state.turn.freeMoveUsed) state.turn.freeMoveUsed = true;
  else state.turn.extraMoves = Math.max(0, (state.turn.extraMoves || 0) - 1);
  addLog(`${p.name} bergerak: ${room(from).name} → ${room(targetRoom).name}.`);
  beep(310, .035);
  if (movementCredits() <= 0) state.turn.movementResolved = true;
  if (!bot) toast(`${p.name} tiba di ${room(targetRoom).name}`);
  render();
  return true;
}

function stayPut() {
  if (state.gameOver || pendingAttempt || state.turn.movementResolved) return;
  state.turn.freeMoveUsed = true;
  state.turn.extraMoves = 0;
  state.turn.movementResolved = true;
  addLog(`${currentPlayer().name} memilih tetap di ${room(currentPlayer().room).name}.`);
  toast('Fase bergerak selesai');
  render();
}

function useMoveCard(uid) {
  if (state.gameOver || pendingAttempt || !handVisible || !isHuman()) return;
  if (state.turn.movementResolved && state.turn.moveCardsPlayed >= 1) return;
  const p = currentPlayer();
  const idx = p.hand.findIndex(c => c.uid === uid && c.type === 'move');
  if (idx < 0 || state.turn.moveCardsPlayed >= 1) return;
  const [card] = p.hand.splice(idx,1);
  state.discard.push(card);
  state.turn.extraMoves = (state.turn.extraMoves || 0) + card.value;
  state.turn.movementResolved = false;
  state.turn.moveCardsPlayed += 1;
  addLog(`${p.name} memainkan ${card.label} dan mendapat ${card.value} langkah tambahan.`);
  beep(520,.055);
  render();
}

function recycleDeckIfNeeded() {
  if (state.deck.length > 0) return;
  if (!state.discard.length) return;
  state.deck = shuffle(state.discard);
  state.discard = [];
  addLog('Tumpukan buangan dikocok kembali menjadi deck.');
}

function drawCard(playerId = state.currentPlayerId, {bot=false} = {}) {
  const allowed = canDraw(playerId);
  if (!allowed.ok) return false;
  recycleDeckIfNeeded();
  const card = state.deck.pop();
  if (!card) return false;
  player(playerId).hand.push(card);
  state.turn.drawn = true;
  addLog(`${player(playerId).name} mencari dan mengambil 1 kartu.`);
  if (!bot) toast('1 kartu ditambahkan ke tangan');
  beep(610,.05);
  render();
  return true;
}

function startAttemptDialog() {
  const allowed = canAttempt();
  if (!allowed.ok || !isHuman() || !handVisible) return;
  attemptDraft = {schemeUid:null};
  renderAttemptChoices();
  els.attemptDialog.showModal();
}

function renderAttemptChoices() {
  const p = currentPlayer();
  const schemes = p.hand.filter(c => c.type === 'scheme');
  els.attemptText.textContent = `Spite ${p.spite} memberi bonus tetap. Anda boleh memakai maksimal satu kartu Rencana.`;
  els.attemptCards.innerHTML = '';

  const bare = document.createElement('button');
  bare.type = 'button';
  bare.className = `choice-card ${attemptDraft?.schemeUid === null ? 'selected' : ''}`;
  bare.innerHTML = `<strong>Tanpa kartu</strong><small>Kekuatan dasar + Spite.</small><span class="choice-value">+0</span>`;
  bare.addEventListener('click', () => { attemptDraft.schemeUid = null; renderAttemptChoices(); });
  els.attemptCards.appendChild(bare);

  schemes.forEach(card => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `choice-card ${attemptDraft?.schemeUid === card.uid ? 'selected' : ''}`;
    btn.innerHTML = `<strong>${escapeHtml(card.name)}</strong><small>${escapeHtml(card.label)} · hanya untuk percobaan ini.</small><span class="choice-value">+${card.value}</span>`;
    btn.addEventListener('click', () => { attemptDraft.schemeUid = card.uid; renderAttemptChoices(); });
    els.attemptCards.appendChild(btn);
  });

  const chosen = attemptDraft.schemeUid ? p.hand.find(c => c.uid === attemptDraft.schemeUid) : null;
  els.attemptStrengthPreview.textContent = 1 + p.spite + (chosen?.value || 0);
}

function confirmAttempt() {
  if (!attemptDraft) return;
  els.attemptDialog.close();
  initiateAttempt(state.currentPlayerId, attemptDraft.schemeUid);
  attemptDraft = null;
}

function initiateAttempt(attackerId, schemeUid = null) {
  const allowed = canAttempt(attackerId);
  if (!allowed.ok) return false;
  const attacker = player(attackerId);
  let scheme = null;
  if (schemeUid) {
    const idx = attacker.hand.findIndex(c => c.uid === schemeUid && c.type === 'scheme');
    if (idx >= 0) {
      [scheme] = attacker.hand.splice(idx,1);
      state.discard.push(scheme);
    }
  }
  const strength = 1 + attacker.spite + (scheme?.value || 0);
  state.turn.attempted = true;
  pendingAttempt = {
    attackerId,
    strength,
    blocked:0,
    scheme,
    responderOrder: cyclicOtherPlayers(attackerId),
    responderIndex:0,
    playedBy:{}
  };
  addLog(`${attacker.name} memulai percobaan dengan kekuatan ${strength}${scheme ? ` menggunakan ${scheme.label}` : ''}.`);
  beep(180,.09);
  render();
  setTimeout(nextResponder, 280);
  return true;
}

function cyclicOtherPlayers(attackerId) {
  const ids = state.players.map(p=>p.id);
  const start = ids.indexOf(attackerId);
  const out = [];
  for (let i=1;i<ids.length;i++) out.push(ids[(start+i)%ids.length]);
  return out;
}

function nextResponder() {
  if (!pendingAttempt) return;
  if (pendingAttempt.blocked >= pendingAttempt.strength) return finishAttempt(false);
  if (pendingAttempt.responderIndex >= pendingAttempt.responderOrder.length) return finishAttempt(true);

  const responder = player(pendingAttempt.responderOrder[pendingAttempt.responderIndex]);
  selectedBlockCards.clear();
  if (responder.type === 'bot') {
    setTimeout(() => botRespond(responder), 500);
  } else {
    showResponseHandoff(responder);
  }
}

function showResponseHandoff(responder) {
  els.responseHandoffToken.textContent = responder.style.short;
  els.responseHandoffToken.style.background = responder.style.color;
  els.responseHandoffTitle.textContent = `Respons: ${responder.name}`;
  els.responseHandoffText.textContent = `Percobaan membutuhkan ${Math.max(0,pendingAttempt.strength-pendingAttempt.blocked)} poin lagi untuk digagalkan. Hanya ${responder.name} yang boleh melihat kartu berikut.`;
  els.responseHandoffDialog.showModal();
}

function showBlockDialog(responder) {
  selectedBlockCards.clear();
  els.blockTitle.textContent = `Giliran ${responder.name}`;
  const needed = Math.max(0,pendingAttempt.strength-pendingAttempt.blocked);
  els.blockText.textContent = `Pilih satu atau beberapa kartu Gagalkan. Dibutuhkan ${needed} poin tambahan.`;
  renderBlockChoices(responder);
  els.blockDialog.showModal();
}

function renderBlockChoices(responder) {
  const failures = responder.hand.filter(c=>c.type==='failure');
  els.blockCards.innerHTML = '';
  if (!failures.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-hand';
    empty.textContent = 'Tidak ada kartu Gagalkan.';
    els.blockCards.appendChild(empty);
  } else {
    failures.forEach(card => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `choice-card ${selectedBlockCards.has(card.uid) ? 'selected' : ''}`;
      btn.innerHTML = `<strong>${escapeHtml(card.name)}</strong><small>${escapeHtml(card.label)}</small><span class="choice-value">+${card.value}</span>`;
      btn.addEventListener('click', () => {
        if (selectedBlockCards.has(card.uid)) selectedBlockCards.delete(card.uid); else selectedBlockCards.add(card.uid);
        renderBlockChoices(responder);
      });
      els.blockCards.appendChild(btn);
    });
  }
  const selectedValue = failures.filter(c=>selectedBlockCards.has(c.uid)).reduce((s,c)=>s+c.value,0);
  const future = pendingAttempt.blocked + selectedValue;
  const pct = clamp((future/pendingAttempt.strength)*100,0,100);
  els.blockMeterFill.style.width = `${pct}%`;
  els.blockMeterText.textContent = `${future} / ${pendingAttempt.strength}`;
  els.playBlockBtn.disabled = selectedBlockCards.size === 0;
}

function playSelectedBlocks() {
  if (!pendingAttempt) return;
  const responder = player(pendingAttempt.responderOrder[pendingAttempt.responderIndex]);
  const cards = responder.hand.filter(c=>selectedBlockCards.has(c.uid) && c.type==='failure');
  if (!cards.length) return;
  const total = cards.reduce((s,c)=>s+c.value,0);
  responder.hand = responder.hand.filter(c=>!selectedBlockCards.has(c.uid));
  state.discard.push(...cards);
  pendingAttempt.blocked += total;
  pendingAttempt.playedBy[responder.id] = total;
  addLog(`${responder.name} memainkan ${cards.length} kartu Gagalkan senilai ${total}. Total pertahanan ${pendingAttempt.blocked}/${pendingAttempt.strength}.`);
  els.blockDialog.close();
  pendingAttempt.responderIndex += 1;
  beep(260,.06);
  render();
  setTimeout(nextResponder, 260);
}

function passResponder() {
  if (!pendingAttempt) return;
  const responder = player(pendingAttempt.responderOrder[pendingAttempt.responderIndex]);
  addLog(`${responder.name} tidak menambah pertahanan.`);
  if (els.blockDialog.open) els.blockDialog.close();
  pendingAttempt.responderIndex += 1;
  render();
  setTimeout(nextResponder, 240);
}

function botRespond(responder) {
  if (!pendingAttempt || state.gameOver) return;
  const needed = Math.max(0,pendingAttempt.strength-pendingAttempt.blocked);
  const failures = responder.hand.filter(c=>c.type==='failure').sort((a,b)=>a.value-b.value);
  if (!failures.length) {
    addLog(`${responder.name} (Bot) tidak punya kartu Gagalkan.`);
    pendingAttempt.responderIndex += 1;
    render();
    return setTimeout(nextResponder, 260);
  }

  // Bot usually blocks when possible, but preserves cards if the attempt is hopeless to stop.
  const laterResponders = pendingAttempt.responderOrder.slice(pendingAttempt.responderIndex+1).map(player);
  const laterPotential = laterResponders.reduce((sum,p)=>sum+p.hand.filter(c=>c.type==='failure').reduce((s,c)=>s+c.value,0),0);
  const ownPotential = failures.reduce((s,c)=>s+c.value,0);
  const shouldTry = ownPotential + laterPotential >= needed || Math.random() < .28;
  if (!shouldTry) {
    addLog(`${responder.name} (Bot) menyimpan kartunya.`);
    pendingAttempt.responderIndex += 1;
    render();
    return setTimeout(nextResponder, 260);
  }

  const chosen = [];
  let value = 0;
  for (const c of failures) {
    if (value >= needed) break;
    chosen.push(c); value += c.value;
  }
  const ids = new Set(chosen.map(c=>c.uid));
  responder.hand = responder.hand.filter(c=>!ids.has(c.uid));
  state.discard.push(...chosen);
  pendingAttempt.blocked += value;
  pendingAttempt.playedBy[responder.id] = value;
  addLog(`${responder.name} (Bot) menambah pertahanan ${value}. Total ${pendingAttempt.blocked}/${pendingAttempt.strength}.`);
  pendingAttempt.responderIndex += 1;
  beep(250,.05);
  render();
  setTimeout(nextResponder, 350);
}

function finishAttempt(success) {
  if (!pendingAttempt) return;
  const attacker = player(pendingAttempt.attackerId);
  if (els.blockDialog.open) els.blockDialog.close();
  if (els.responseHandoffDialog.open) els.responseHandoffDialog.close();

  if (success) {
    state.gameOver = true;
    state.winnerId = attacker.id;
    attacker.wins = (attacker.wins || 0) + 1;
    addLog(`★ ${attacker.name} memenangkan permainan dengan percobaan kekuatan ${pendingAttempt.strength}.`);
    beep(740,.18);
    const snapshot = {...pendingAttempt};
    pendingAttempt = null;
    saveGame();
    render();
    setTimeout(() => showWinner(attacker, snapshot), 360);
    return;
  }

  attacker.spite += 1;
  attacker.failedAttempts = (attacker.failedAttempts || 0) + 1;
  addLog(`Percobaan ${attacker.name} gagal. ${attacker.name} mendapat +1 Spite (sekarang ${attacker.spite}).`);
  toast(`${attacker.name} +1 Spite`);
  beep(135,.11);
  pendingAttempt = null;
  render();
}

function showWinner(winner, attempt) {
  els.winnerTitle.textContent = `${winner.name} menang!`;
  els.winnerText.textContent = `Percobaan terakhir berkekuatan ${attempt.strength}; pertahanan lawan berhenti di ${attempt.blocked}.`;
  els.winnerStats.innerHTML = state.players.map(p => `
    <div class="winner-stat-row">
      <span>${escapeHtml(p.name)}${p.type==='bot'?' · Bot':''}</span>
      <span>Spite ${p.spite} · ${p.hand.length} kartu</span>
    </div>`).join('');
  els.winnerDialog.showModal();
}

function determineNextPlayer() {
  const ids = state.players.map(p=>p.id);
  const currentIndex = ids.indexOf(state.currentPlayerId);
  const normal = ids[(currentIndex+1)%ids.length];
  if (!state.openingComplete) return normal;

  const occupants = state.players.filter(p=>p.room===state.doctorRoom && p.id!==state.currentPlayerId);
  if (!occupants.length) return normal;
  // Choose occupant closest to normal cyclic order.
  for (let i=1;i<=ids.length;i++) {
    const candidate = ids[(currentIndex+i)%ids.length];
    if (occupants.some(p=>p.id===candidate)) return candidate;
  }
  return normal;
}

function advanceDoctor() {
  const from = state.doctorRoom;
  state.doctorRoom = (state.doctorRoom + 1) % 20;
  addLog(`Dr. Lucky bergerak: ${room(from).name} → ${room(state.doctorRoom).name} (#${state.doctorRoom}).`);
  beep(390,.05);
}

function endTurn({bot=false}={}) {
  if (!state || state.gameOver || pendingAttempt) return;
  const p = currentPlayer();
  p.turnsTaken += 1;
  state.turnsTotal += 1;
  if (state.turnsTotal >= state.players.length) state.openingComplete = true;

  advanceDoctor();
  const nextId = determineNextPlayer();
  if (nextId !== state.players[(state.players.findIndex(x=>x.id===p.id)+1)%state.players.length].id) {
    addLog(`Dr. Lucky memasuki ruangan pemain; giliran berikutnya melompat ke ${player(nextId).name}.`);
  }

  state.currentPlayerId = nextId;
  state.round = Math.floor(state.turnsTotal / state.players.length) + 1;
  state.turn = freshTurnState();
  handVisible = false;
  saveGame();
  render();
  setTimeout(beginTurn, bot ? 300 : 180);
}

function freshTurnState() {
  return {freeMoveUsed:false, extraMoves:0, movementResolved:false, moveCardsPlayed:0, drawn:false, attempted:false};
}

function beginTurn() {
  if (!state || state.gameOver) return;
  clearTimeout(aiTimer);
  const p = currentPlayer();
  addLog(`Giliran ${p.name} dimulai di ${room(p.room).name}.`);
  saveGame();
  render();

  if (p.type === 'bot') {
    handVisible = false;
    render();
    aiTimer = setTimeout(botTakeTurn, 600);
  } else {
    showTurnHandoff(p);
  }
}

function showTurnHandoff(p) {
  els.handoffToken.textContent = p.style.short;
  els.handoffToken.style.background = p.style.color;
  els.handoffTitle.textContent = `Giliran ${p.name}`;
  els.handoffText.textContent = `Pastikan hanya ${p.name} yang melihat tangan kartu. Tekan tombol saat perangkat sudah berpindah.`;
  if (!els.handoffDialog.open) els.handoffDialog.showModal();
}

function revealHumanTurn() {
  els.handoffDialog.close();
  handVisible = true;
  render();
  toast('Tangan kartu dibuka');
  maybeShowTutorial();
}

function bfsPath(start, goal) {
  if (start === goal) return [start];
  const q = [start], prev = new Map([[start,null]]);
  while (q.length) {
    const cur = q.shift();
    for (const n of ADJ[cur] || []) {
      if (prev.has(n)) continue;
      prev.set(n,cur);
      if (n === goal) {
        const path = [goal];
        let x = cur;
        while (x !== null) { path.push(x); x = prev.get(x); }
        return path.reverse();
      }
      q.push(n);
    }
  }
  return [start];
}

function botBestMove(p) {
  // Prefer Doctor's room when a private attempt is plausible.
  const neighbors = ADJ[p.room] || [];
  const doctorPath = bfsPath(p.room, state.doctorRoom);
  if (doctorPath.length > 1 && neighbors.includes(doctorPath[1])) return doctorPath[1];

  // Otherwise prefer rooms with fewer witnesses.
  return [...neighbors].sort((a,b)=>witnessesAt(a,p.id).length-witnessesAt(b,p.id).length)[0] ?? p.room;
}

function botChooseScheme(p) {
  const schemes = p.hand.filter(c=>c.type==='scheme').sort((a,b)=>b.value-a.value);
  if (!schemes.length) return null;
  // Save the biggest card early unless spite is already high.
  if (p.spite >= 2 || state.round >= 3 || Math.random() < .55) return schemes[0].uid;
  return schemes[schemes.length-1].uid;
}

function botUseMoveIfHelpful(p) {
  if (state.turn.moveCardsPlayed >= 1) return false;
  const path = bfsPath(p.room, state.doctorRoom);
  if (path.length <= 2) return false;
  const cards = p.hand.filter(c=>c.type==='move').sort((a,b)=>b.value-a.value);
  if (!cards.length) return false;
  const card = cards[0];
  const idx = p.hand.findIndex(c=>c.uid===card.uid);
  p.hand.splice(idx,1); state.discard.push(card);
  state.turn.extraMoves += card.value;
  state.turn.moveCardsPlayed += 1;
  state.turn.movementResolved = false;
  addLog(`${p.name} (Bot) memainkan ${card.label}.`);
  return true;
}

function botTakeTurn() {
  if (!state || state.gameOver || currentPlayer().type !== 'bot' || pendingAttempt) return;
  const p = currentPlayer();

  // Immediate private chance.
  if (canAttempt(p.id).ok && Math.random() < .88) {
    initiateAttempt(p.id, botChooseScheme(p));
    return;
  }

  botUseMoveIfHelpful(p);
  let steps = movementCredits();
  while (!state.turn.movementResolved && steps > 0) {
    const target = botBestMove(p);
    if (target === p.room) break;
    movePlayerTo(p.id,target,{bot:true});
    steps = movementCredits();
    if (canAttempt(p.id).ok) break;
  }
  if (!state.turn.movementResolved) {
    state.turn.freeMoveUsed = true;
    state.turn.extraMoves = 0;
    state.turn.movementResolved = true;
  }

  setTimeout(() => {
    if (canAttempt(p.id).ok && Math.random() < .82) {
      initiateAttempt(p.id, botChooseScheme(p));
      return;
    }
    if (canDraw(p.id).ok && Math.random() < .9) drawCard(p.id,{bot:true});
    setTimeout(() => endTurn({bot:true}), 650);
  }, 420);
}

function saveGame() {
  if (!state) return;
  const payload = {version:VERSION, state, soundEnabled};
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); } catch (_) {}
}

function loadGame() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (parsed.version !== VERSION || !parsed.state?.players?.length) return false;
    state = parsed.state;
    soundEnabled = parsed.soundEnabled !== false;
    pendingAttempt = null;
    attemptDraft = null;
    state.gameOver = !!state.gameOver;
    handVisible = false;
    return true;
  } catch (_) { return false; }
}

function clearSave() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
}

function newGameFromSetup() {
  const seatRows = [...els.seatEditor.querySelectorAll('.seat-row')];
  const players = seatRows.map((row,i) => {
    const name = row.querySelector('input').value.trim() || DEFAULT_NAMES[i];
    const type = row.querySelector('select').value;
    return {
      id:i, name, type, style:PLAYER_STYLES[i], room:0, spite:0, hand:[], turnsTaken:0, failedAttempts:0, wins:0
    };
  });
  if (players.filter(p=>p.type==='human').length === 0) players[0].type = 'human';

  const deck = buildDeck();
  players.forEach(p => p.hand = deck.splice(0,6));
  const doctorRoom = Math.floor(Math.random()*20);
  const firstId = Math.floor(Math.random()*players.length);

  state = {
    version:VERSION,
    players,
    currentPlayerId:firstId,
    doctorRoom,
    deck,
    discard:[],
    round:1,
    turnsTotal:0,
    openingComplete:false,
    turn:freshTurnState(),
    log:[],
    gameOver:false,
    winnerId:null,
    tutorial:els.tutorialToggle.checked
  };
  pendingAttempt = null;
  attemptDraft = null;
  handVisible = false;
  tutorialIndex = 0;
  addLog(`Permainan dimulai dengan ${players.length} pemain. Semua pemain mulai di Drawing Room.`);
  addLog(`Dr. Lucky mulai secara acak di ${room(doctorRoom).name} (#${doctorRoom}).`);
  addLog(`${player(firstId).name} mendapat giliran pertama.`);
  saveGame();
  render();
  setTimeout(beginTurn, 250);
}

function renderSeatEditor() {
  const count = Number(els.playerCountSelect.value);
  const old = [...els.seatEditor.querySelectorAll('.seat-row')].map(row => ({
    name:row.querySelector('input')?.value,
    type:row.querySelector('select')?.value
  }));
  els.seatEditor.innerHTML = '';
  for (let i=0;i<count;i++) {
    const row = document.createElement('div');
    row.className = 'seat-row';
    const style = PLAYER_STYLES[i];
    row.innerHTML = `
      <div class="seat-color" style="background:${style.color}"></div>
      <input maxlength="18" aria-label="Nama pemain ${i+1}" value="${escapeAttr(old[i]?.name || DEFAULT_NAMES[i])}" />
      <select aria-label="Tipe pemain ${i+1}">
        <option value="human" ${old[i]?.type==='human'||(!old[i]&&i===0)?'selected':''}>Manusia</option>
        <option value="bot" ${old[i]?.type==='bot'||(!old[i]&&i>0)?'selected':''}>Bot</option>
      </select>`;
    els.seatEditor.appendChild(row);
  }
}

function render() {
  if (!state) return;
  renderBoard();
  renderStatus();
  renderHand();
  renderPlayers();
  renderLog();
  renderControls();
  updateSoundButton();
  saveGame();
}

function renderBoard() {
  els.roomLayer.innerHTML = '';
  els.tokenLayer.innerHTML = '';
  els.sightLayer.innerHTML = '';
  const reachable = new Set(reachableRooms());
  const p = currentPlayer();

  ROOMS.forEach(r => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'room-hotspot';
    if (reachable.has(r.id)) btn.classList.add('reachable');
    if (r.id === p.room) btn.classList.add('current-room');
    if (r.id === state.doctorRoom) btn.classList.add('doctor-room');
    btn.style.left = `${r.x}%`;
    btn.style.top = `${r.y}%`;
    btn.textContent = r.id;
    btn.title = `${r.id} — ${r.name}`;
    btn.setAttribute('aria-label', `${r.id} ${r.name}${reachable.has(r.id)?', bisa dicapai':''}`);
    btn.disabled = !reachable.has(r.id);
    btn.addEventListener('click', () => movePlayerTo(state.currentPlayerId,r.id));
    btn.addEventListener('mouseenter', () => drawSightFrom(r.id));
    btn.addEventListener('mouseleave', clearSight);
    els.roomLayer.appendChild(btn);
  });

  const stacks = new Map();
  function placeToken(token, r, key) {
    const count = stacks.get(r.id) || 0;
    stacks.set(r.id,count+1);
    const offsets = [[0,0],[16,-13],[-16,-13],[17,15],[-17,15],[30,0],[-30,0],[0,26]];
    const [ox,oy] = offsets[count % offsets.length];
    token.style.left = `calc(${r.x}% + ${ox}px)`;
    token.style.top = `calc(${r.y}% + ${oy}px)`;
    token.dataset.key = key;
    els.tokenLayer.appendChild(token);
  }

  const doc = document.createElement('div');
  doc.className = 'token doctor';
  doc.textContent = 'DL';
  doc.title = `Dr. Lucky — ${room(state.doctorRoom).name}`;
  placeToken(doc,room(state.doctorRoom),'doctor');

  state.players.forEach(pl => {
    const token = document.createElement('div');
    token.className = `token${pl.id===state.currentPlayerId?' current':''}`;
    token.textContent = pl.style.short;
    token.style.background = pl.style.color;
    token.title = `${pl.name}${pl.type==='bot'?' (Bot)':''} — ${room(pl.room).name}`;
    placeToken(token,room(pl.room),`p${pl.id}`);
  });
}

function drawSightFrom(roomId) {
  clearSight();
  const from = room(roomId);
  const visibleRoomIds = ROOMS.filter(r=>r.id!==roomId && canSee(roomId,r.id)).map(r=>r.id);
  visibleRoomIds.forEach(id => {
    const to = room(id);
    const dx = to.x-from.x, dy = to.y-from.y;
    const dist = Math.sqrt(dx*dx+dy*dy);
    const angle = Math.atan2(dy,dx)*180/Math.PI;
    const line = document.createElement('div');
    line.className = 'sight-line';
    line.style.left = `${from.x}%`;
    line.style.top = `${from.y}%`;
    line.style.width = `${dist}%`;
    line.style.transform = `rotate(${angle}deg)`;
    els.sightLayer.appendChild(line);
  });
}
function clearSight(){ els.sightLayer.innerHTML=''; }

function renderStatus() {
  const p = currentPlayer();
  els.turnLabel.textContent = `${p.name}${p.type==='bot'?' · Bot':''}`;
  els.phaseLabel.textContent = phaseName();
  els.roomLabel.textContent = `${room(p.room).name} · ruang #${p.room}`;
  els.spiteLabel.textContent = p.spite;
  els.handCountLabel.textContent = p.hand.length;
  els.deckLabel.textContent = state.deck.length;
  els.doctorRoomLabel.textContent = `#${state.doctorRoom}`;
  els.doctorRoomLabel.title = room(state.doctorRoom).name;
  els.roundLabel.textContent = `Ronde ${state.round}`;
  els.activeTokenPreview.textContent = p.style.short;
  els.activeTokenPreview.style.background = p.style.color;
  els.actionPointText.textContent = state.turn.movementResolved ? 'gerak selesai' : `${movementCredits()} langkah`;
}

function renderHand() {
  els.hand.innerHTML = '';
  const p = currentPlayer();
  const visible = p.type==='human' && handVisible && !pendingAttempt;
  els.handPrivacyBadge.textContent = visible ? 'terbuka' : p.type==='bot' ? 'Bot' : 'tersembunyi';
  if (!visible) {
    const back = document.createElement('div');
    back.className = 'empty-hand';
    back.textContent = p.type==='bot' ? `${p.hand.length} kartu dikelola Bot.` : 'Tangan kartu disembunyikan sampai pemain aktif membukanya.';
    els.hand.appendChild(back);
    return;
  }
  if (!p.hand.length) {
    const empty = document.createElement('div'); empty.className='empty-hand'; empty.textContent='Tangan kosong.'; els.hand.appendChild(empty); return;
  }
  const sorted = [...p.hand].sort((a,b)=>typeRank(a.type)-typeRank(b.type)||b.value-a.value);
  sorted.forEach(card => {
    const div = document.createElement('div');
    const playableMove = card.type==='move' && state.turn.moveCardsPlayed<1 && !pendingAttempt && !state.gameOver;
    div.className = `game-card ${card.type}${playableMove?' playable':''}`;
    div.innerHTML = `<strong>${escapeHtml(card.name)}</strong><small>${card.type==='scheme'?'Dipakai saat percobaan':card.type==='failure'?'Dipakai saat merespons':'Klik untuk langkah tambahan'} · +${card.value}</small><span class="value">${card.value}</span>`;
    if (playableMove) div.addEventListener('click',()=>useMoveCard(card.uid));
    els.hand.appendChild(div);
  });
}
function typeRank(t){ return t==='scheme'?0:t==='failure'?1:2; }

function renderPlayers() {
  els.playersList.innerHTML = '';
  state.players.forEach(p => {
    const row = document.createElement('div');
    row.className = `player-row${p.id===state.currentPlayerId?' active':''}`;
    row.innerHTML = `
      <div class="player-chip" style="background:${p.style.color}">${p.style.short}</div>
      <div><strong>${escapeHtml(p.name)}${p.type==='bot'?' · Bot':''}</strong><small>${escapeHtml(room(p.room).name)}</small></div>
      <div class="player-score">Spite ${p.spite}<br>${p.hand.length} kartu</div>`;
    row.addEventListener('mouseenter',()=>drawSightFrom(p.room));
    row.addEventListener('mouseleave',clearSight);
    els.playersList.appendChild(row);
  });
}

function renderLog() {
  els.log.innerHTML = state.log.map(entry => `<p><span class="time">${escapeHtml(entry.time)}</span>${escapeHtml(entry.message)}</p>`).join('');
}

function renderControls() {
  const humanReady = isHuman() && handVisible && !state.gameOver && !pendingAttempt;
  const draw = canDraw();
  const attempt = canAttempt();
  els.stayBtn.disabled = !humanReady || state.turn.movementResolved;
  els.drawBtn.disabled = !humanReady || !state.turn.movementResolved || !draw.ok;
  els.attemptBtn.disabled = !humanReady || !state.turn.movementResolved || !attempt.ok;
  els.endTurnBtn.disabled = !humanReady;
  els.eligibilityText.className = 'muted rule-status';

  if (!humanReady) {
    els.eligibilityText.textContent = currentPlayer().type==='bot' ? 'Bot sedang menentukan langkah.' : pendingAttempt ? 'Menunggu respons terhadap percobaan.' : 'Buka tangan pemain untuk melanjutkan.';
    return;
  }
  if (!state.turn.movementResolved) {
    els.eligibilityText.textContent = 'Bergerak ke ruangan bercahaya atau pilih “Tetap di sini”. Kartu Gerak dapat menambah langkah.';
    return;
  }
  if (attempt.ok) {
    els.eligibilityText.textContent = attempt.why;
    els.eligibilityText.classList.add('ok');
  } else if (draw.ok) {
    els.eligibilityText.textContent = draw.why;
    els.eligibilityText.classList.add('ok');
  } else {
    els.eligibilityText.textContent = `${draw.why} ${attempt.why}`;
    els.eligibilityText.classList.add('warn');
  }
}

function updateSoundButton() {
  els.soundBtn.textContent = soundEnabled ? '🔊' : '🔇';
  els.soundBtn.setAttribute('aria-pressed', String(soundEnabled));
}

const TUTORIAL_STEPS = [
  'Ini giliran Anda. Pertama, bergerak satu langkah ke ruangan yang bercahaya, atau tekan “Tetap di sini”.',
  'Setelah bergerak, “Cari kartu” hanya aktif jika tidak ada pemain lain yang memiliki garis pandang ke ruangan Anda.',
  'Jika Anda satu ruangan dengan Dr. Lucky dan tidak terlihat pemain lain, tombol “Lakukan percobaan” akan aktif.',
  'Kartu Gerak bisa diklik dari tangan untuk menambah langkah. Spite bertambah setiap kali percobaan Anda digagalkan.',
  'Arahkan pointer ke nomor ruangan atau baris pemain untuk melihat jalur garis pandang yang dipakai versi browser.'
];
function maybeShowTutorial() {
  if (!state?.tutorial || tutorialIndex >= TUTORIAL_STEPS.length) return;
  els.tutorial.classList.remove('hidden');
  els.tutorialStepText.textContent = TUTORIAL_STEPS[tutorialIndex];
}
function tutorialNext() {
  tutorialIndex += 1;
  if (tutorialIndex >= TUTORIAL_STEPS.length) {
    els.tutorial.classList.add('hidden'); state.tutorial=false; saveGame();
  } else els.tutorialStepText.textContent = TUTORIAL_STEPS[tutorialIndex];
}
function tutorialSkip() { els.tutorial.classList.add('hidden'); if(state){state.tutorial=false;saveGame();} }

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}
function escapeAttr(value){ return escapeHtml(value); }

// Events
els.playerCountSelect.addEventListener('change',renderSeatEditor);
els.setupForm.addEventListener('submit',(e)=>{ e.preventDefault(); els.setupDialog.close(); newGameFromSetup(); });
els.resumeBtn.addEventListener('click',()=>{
  if (!loadGame()) return;
  els.setupDialog.close(); render();
  if (state.gameOver && state.winnerId!==null) showWinner(player(state.winnerId),{strength:0,blocked:0}); else setTimeout(beginTurn,200);
});
els.newGameBtn.addEventListener('click',()=>{
  if (state && !state.gameOver && !confirm('Mulai game baru? Simpanan permainan saat ini akan diganti.')) return;
  clearTimeout(aiTimer); clearSave(); state=null; pendingAttempt=null; handVisible=false; renderSeatEditor(); els.resumeBtn.classList.add('hidden'); els.setupDialog.showModal();
});
els.soundBtn.addEventListener('click',()=>{ soundEnabled=!soundEnabled; updateSoundButton(); saveGame(); if(soundEnabled) beep(520,.04); });
els.rulesBtn.addEventListener('click',()=>els.rulesDialog.showModal());
els.closeRulesBtn.addEventListener('click',()=>els.rulesDialog.close());
els.revealTurnBtn.addEventListener('click',revealHumanTurn);
els.stayBtn.addEventListener('click',stayPut);
els.drawBtn.addEventListener('click',()=>drawCard());
els.attemptBtn.addEventListener('click',startAttemptDialog);
els.endTurnBtn.addEventListener('click',()=>endTurn());
els.cancelAttemptBtn.addEventListener('click',()=>{attemptDraft=null;els.attemptDialog.close();});
els.confirmAttemptBtn.addEventListener('click',confirmAttempt);
els.revealResponseBtn.addEventListener('click',()=>{
  if (!pendingAttempt) return;
  const responder = player(pendingAttempt.responderOrder[pendingAttempt.responderIndex]);
  els.responseHandoffDialog.close(); showBlockDialog(responder);
});
els.passBlockBtn.addEventListener('click',passResponder);
els.playBlockBtn.addEventListener('click',playSelectedBlocks);
els.winnerNewGameBtn.addEventListener('click',()=>{els.winnerDialog.close();clearSave();state=null;renderSeatEditor();els.resumeBtn.classList.add('hidden');els.setupDialog.showModal();});
els.clearLogBtn.addEventListener('click',()=>{ if(state){ state.log=[]; renderLog(); saveGame(); } });
els.tutorialNextBtn.addEventListener('click',tutorialNext);
els.tutorialSkipBtn.addEventListener('click',tutorialSkip);

window.addEventListener('keydown',(e)=>{
  if (e.key==='Escape' && !els.setupDialog.open) clearSight();
  if (!state || !isHuman() || !handVisible || pendingAttempt) return;
  if (e.key.toLowerCase()==='d' && !els.drawBtn.disabled) drawCard();
  if (e.key.toLowerCase()==='e' && !els.endTurnBtn.disabled) endTurn();
});

// Minimal debug API for validation and future expansion.
window.__LuckyGameDebug = {
  getState:()=>JSON.parse(JSON.stringify(state)),
  rooms:ROOMS,
  adjacency:ADJ,
  sightGroups:SIGHT_GROUPS,
  canSee,
  bfsPath
};

function boot() {
  renderSeatEditor();
  const hasSave = !!localStorage.getItem(STORAGE_KEY);
  els.resumeBtn.classList.toggle('hidden',!hasSave);
  updateSoundButton();
  els.setupDialog.showModal();
}

boot();
