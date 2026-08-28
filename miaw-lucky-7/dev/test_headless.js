const fs = require('fs');
const vm = require('vm');

function makeElement(){
  return {
    _html:'',
    get innerHTML(){return this._html},
    set innerHTML(v){this._html=v},
    textContent:'',
    classList:{add(){},remove(){},contains(){return false}},
    dataset:{},
    addEventListener(){},
    onclick:null,
  };
}

const elementsById = {app: makeElement(), toast: makeElement(), themeBtn: makeElement(), soundBtn: makeElement(), resetBtn: makeElement()};

const documentStub = {
  querySelector(sel){
    if(sel.startsWith('#')){ const id=sel.slice(1); return elementsById[id]||null }
    return null;
  },
  querySelectorAll(){ return []; },
  documentElement: { dataset: {} },
};

const localStorageStub = {
  _d:{},
  getItem(k){ return this._d[k] ?? null },
  setItem(k,v){ this._d[k]=v },
};

const context = {
  document: documentStub,
  window: {},
  localStorage: localStorageStub,
  confirm: () => true,
  console,
};
vm.createContext(context);
const code = fs.readFileSync('../app.js', 'utf8');
// app.js declares `game`, `prefs`, `E` with let/const at top level, which (unlike
// `var`/function declarations) do NOT become properties of the vm context object.
// Append accessor shims in the SAME script so they can close over those bindings.
const augmented = code + `
;this.__getGame = () => game;
this.__setGame = (v) => { game = v; };
this.__getPrefs = () => prefs;
this.__getE = () => E;
this.Math = Math;
`;
vm.runInContext(augmented, context);

let passCount=0, failCount=0;
function log(label, fn){
  try{
    fn();
    passCount++;
    console.log('OK   -', label);
  }catch(e){
    failCount++;
    console.log('FAIL -', label, '\n     ', e.stack);
  }
}

const g = () => context.__getGame();
Object.defineProperty(context, 'E', { get: () => context.__getE() });

log('startGame with 3 players', () => {
  context.startGame(['Oyen','Mochi','Bulu'], 100);
  if (g().players.length !== 3) throw new Error('player count mismatch');
});

log('render() shows turn screen directly after startGame (no pass-device step)', () => {
  context.render();
  if (!context.E.app.innerHTML.includes('Ambil Kartu')) throw new Error('expected turn screen (Ambil Kartu) right away, got: ' + context.E.app.innerHTML.slice(0,200));
});

log('open turn screen renders', () => {
  g().phase = 'turn';
  context.render();
  if (!context.E.app.innerHTML.includes('Ambil Kartu')) throw new Error('turn screen missing Ambil button');
});

function setDeck(cards){ g().deck = [...cards].reverse(); }

log('simulate bust (duplicate number, no second chance)', () => {
  context.startGame(['A','B'], 100);
  setDeck([{kind:'number',value:5},{kind:'number',value:5}]);
  // 1 kartu = 1 giliran, jadi tiap draw A butuh gilirannya sendiri.
  // Di sini kita simulasikan "giliran sudah muter balik ke A lagi"
  // secara manual (fokus test ini pada mekanik bust, bukan rotasinya).
  g().currentIndex=0; g().phase='turn';
  context.performAmbil(); // A ambil 5
  g().currentIndex=0; g().phase='turn';
  context.performAmbil(); // giliran A lagi, ambil 5 lagi -> dobel
  if (g().players[0].status !== 'busted') throw new Error('expected bust, got ' + g().players[0].status);
});

log('simulate second chance saves from bust', () => {
  context.startGame(['A','B'], 100);
  setDeck([{kind:'action',type:'secondChance'},{kind:'number',value:5},{kind:'number',value:5}]);
  g().currentIndex=0; g().phase='turn';
  context.performAmbil(); // A simpan Nyawa Kesembilan
  g().currentIndex=0; g().phase='turn';
  context.performAmbil(); // giliran A lagi, ambil 5
  g().currentIndex=0; g().phase='turn';
  context.performAmbil(); // giliran A lagi, ambil 5 lagi -> dobel, tapi terselamatkan
  if (g().players[0].status === 'busted') throw new Error('should not have busted');
  if (g().players[0].secondChance !== false) throw new Error('second chance should be consumed');
});

log('simulate modGift targeting via pickTarget flow', () => {
  context.startGame(['A','B'], 100);
  g().phase='turn';
  setDeck([{kind:'modGift',value:15}]);
  context.performAmbil();
  if (g().phase !== 'pickTarget') throw new Error('expected pickTarget phase, got ' + g().phase);
  const targetIdx = g().pendingAction.targets[0];
  context.chooseTarget(targetIdx);
  if (g().players[targetIdx].modifierSum !== 15) throw new Error('modifier not applied');
});

log('simulate freeze on other player', () => {
  context.startGame(['A','B','C'], 100);
  g().phase='turn';
  g().currentIndex = 0;
  setDeck([{kind:'action',type:'freeze'}]);
  context.performAmbil();
  if (g().phase !== 'pickTarget') throw new Error('expected pickTarget, got '+g().phase);
  context.chooseTarget(1);
  if (g().players[1].status !== 'frozen') throw new Error('player 1 should be frozen');
  // Flip 7 rule: 1 kartu = 1 giliran. Drawer sudah pakai giliran ini untuk
  // menarik & memainkan kartu freeze, jadi giliran WAJIB pindah ke pemain
  // aktif berikutnya (bukan balik ke drawer yang sama).
  if (g().phase !== 'turn') throw new Error('turn should end and pass to next active player, got '+g().phase);
  if (g().currentIndex !== 2) throw new Error('next active player should be C (index 2, B is frozen), got '+g().currentIndex);
});

log('simulate freeze on self (only active player left)', () => {
  context.startGame(['A','B'], 100);
  g().phase='turn';
  g().currentIndex = 0;
  g().players[1].status='stayed';
  setDeck([{kind:'action',type:'freeze'}]);
  context.performAmbil();
  if (g().players[0].status !== 'frozen') throw new Error('drawer should auto-target self');
});

log('simulate flipThree targeting another player (nested draws)', () => {
  context.startGame(['A','B'], 100);
  g().phase='turn';
  g().currentIndex = 0;
  setDeck([{kind:'action',type:'flipThree'}, {kind:'number',value:2},{kind:'number',value:4},{kind:'number',value:6}]);
  context.performAmbil();
  if (g().phase !== 'pickTarget') throw new Error('expected pickTarget for flipThree, got ' + g().phase);
  context.chooseTarget(1);
  if (g().phase !== 'flipThreeStep') throw new Error('expected flipThreeStep, got ' + g().phase);
  context.performForcedDraw();
  if (g().phase !== 'flipThreeStep') throw new Error('expected flipThreeStep after draw1, got ' + g().phase);
  context.performForcedDraw();
  context.performForcedDraw();
  if (g().players[1].tableau.join(',') !== '2,4,6') throw new Error('tableau mismatch: ' + g().players[1].tableau.join(','));
  // Kartu flipThree yang tadi ditarik ADALAH kartu (giliran) milik drawer A.
  // Begitu sekuens paksa 3-kartu B selesai, giliran A juga sudah habis —
  // harus lanjut ke pemain aktif berikutnya (B), bukan balik ke A lagi.
  if (g().phase !== 'turn') throw new Error('original drawer turn should end too (1 card = 1 turn), got ' + g().phase);
  if (g().currentIndex !== 1) throw new Error('should move to next active player (B, index 1), got ' + g().currentIndex);
});

log('simulate flipThree with nested action card (freeze) drawn mid-sequence', () => {
  context.startGame(['A','B','C'], 100);
  g().phase='turn';
  g().currentIndex = 0;
  setDeck([
    {kind:'action',type:'flipThree'},
    {kind:'number',value:2},
    {kind:'action',type:'freeze'},
    {kind:'number',value:6}
  ]);
  context.performAmbil();
  context.chooseTarget(1);
  context.performForcedDraw();
  context.performForcedDraw();
  if (g().phase !== 'flipThreeStep') throw new Error('expected still in flipThreeStep (freeze queued), got ' + g().phase);
  context.performForcedDraw();
  if (g().phase !== 'pickTarget') throw new Error('expected pickTarget for nested freeze, got ' + g().phase);
  context.chooseTarget(2);
  if (g().players[2].status !== 'frozen') throw new Error('player C should be frozen from nested action');
  // Sama seperti di atas: giliran A (drawer flipThree) sudah habis begitu
  // seluruh sekuens + aksi tertunda selesai diproses.
  if (g().phase !== 'turn') throw new Error('original drawer A turn should also end, got ' + g().phase);
  if (g().currentIndex !== 1) throw new Error('should move to next active player (B, index 1), got ' + g().currentIndex);
});

log('simulate kucingHitam discard flow', () => {
  context.startGame(['A','B'], 100);
  g().phase='turn';
  g().currentIndex = 0;
  g().players[1].tableau = [3,9];
  setDeck([{kind:'action',type:'kucingHitam'}]);
  context.performAmbil();
  context.chooseTarget(1);
  if (g().phase !== 'pickCard') throw new Error('expected pickCard, got '+g().phase);
  context.applyCardChoice(0);
  if (g().players[1].tableau.length !== 1) throw new Error('expected 1 card left, got ' + g().players[1].tableau.length);
});

log('simulate curiIkan steal flow (success)', () => {
  context.startGame(['A','B'], 100);
  g().phase='turn';
  g().currentIndex = 0;
  g().players[0].tableau = [1];
  g().players[1].tableau = [3,9];
  setDeck([{kind:'action',type:'curiIkan'}]);
  context.performAmbil();
  context.chooseTarget(1);
  context.applyCardChoice(0);
  if (!g().players[0].tableau.includes(3)) throw new Error('drawer should now have 3');
  if (g().players[1].tableau.includes(3)) throw new Error('target should no longer have 3');
});

log('simulate curiIkan steal flow (fail - duplicate)', () => {
  context.startGame(['A','B'], 100);
  g().phase='turn';
  g().currentIndex = 0;
  g().players[0].tableau = [3];
  g().players[1].tableau = [3,9];
  setDeck([{kind:'action',type:'curiIkan'}]);
  context.performAmbil();
  context.chooseTarget(1);
  context.applyCardChoice(0);
  if (g().players[0].tableau.filter(v=>v===3).length !== 1) throw new Error('drawer should still only have one 3');
  if (g().players[1].tableau.includes(3)) throw new Error('target should have lost the 3 even on failed steal');
});

log('simulate benangKusut swap', () => {
  context.startGame(['A','B'], 100);
  g().phase='turn';
  g().currentIndex = 0;
  g().players[0].tableau = [1,2];
  g().players[1].tableau = [10];
  setDeck([{kind:'action',type:'benangKusut'}]);
  context.performAmbil();
  context.chooseTarget(1);
  const scoreA = context.calcRoundScore(g().players[0]);
  const scoreB = context.calcRoundScore(g().players[1]);
  if (scoreA !== 10) throw new Error('expected A to have B old score (10), got '+scoreA);
  if (scoreB !== 3) throw new Error('expected B to have A old score (3), got '+scoreB);
});

log('simulate kotakMisteri roll=0 (+5 bonus) deterministic via mocked Math.random', () => {
  context.startGame(['A','B'], 100);
  g().phase='turn';
  g().currentIndex = 0;
  // NOTE: app.js runs in its own vm context/realm, which has its own Math
  // distinct from this file's Math — must mock context.Math.random, not Math.random.
  const origRandom = context.Math.random;
  context.Math.random = () => 0.01;
  setDeck([{kind:'action',type:'kotakMisteri'}]);
  context.performAmbil();
  context.Math.random = origRandom;
  if (g().players[0].modifierSum !== 5) throw new Error('expected +5 modifierSum, got ' + g().players[0].modifierSum);
});

log('simulate radarTikus peek flow', () => {
  context.startGame(['A','B'], 100);
  g().phase='turn';
  g().currentIndex = 0;
  setDeck([{kind:'action',type:'radarTikus'}, {kind:'number',value:1},{kind:'number',value:2},{kind:'number',value:3}]);
  context.performAmbil();
  if (g().phase !== 'peek') throw new Error('expected peek phase, got ' + g().phase);
  if (!g().peekCards || g().peekCards.length === 0) throw new Error('expected peekCards populated');
  context.render();
  if (!context.E.app.innerHTML.includes('RADAR TIKUS')) throw new Error('peek screen missing title');
  const pp = g().pendingPostPeek;
  g().pendingPostPeek=null; g().peekCards=null;
  if(pp.fromNestedQueue){context.processNestedQueue()}else{context.postResolve(pp.drawerIdx)}
  // radarTikus adalah 1 kartu = giliran A selesai begitu peek ditutup.
  if (g().phase !== 'turn') throw new Error('turn should end after the single draw (peek card), got ' + g().phase);
  if (g().currentIndex !== 1) throw new Error('should move to next active player B (index 1), got ' + g().currentIndex);
});

log('simulate Lucky 7 (7 unique cards ends round for everyone)', () => {
  context.startGame(['A','B'], 100);
  g().phase='turn';
  g().currentIndex = 0;
  g().players[0].tableau = [1,2,3,4,5,6];
  setDeck([{kind:'number',value:7}]);
  context.performAmbil();
  if (g().phase !== 'roundEnd') throw new Error('expected roundEnd phase after Lucky7, got ' + g().phase);
  if (g().luckyWinnerIdx !== 0) throw new Error('expected luckyWinnerIdx 0');
  const roundScore = context.calcRoundScore(g().players[0]);
  if (roundScore < 50) throw new Error('expected lucky bonus (+50) reflected, got ' + roundScore);
});

log('simulate round end -> next round resets state', () => {
  context.startGame(['A','B'], 100);
  g().phase='turn';
  g().currentIndex = 0;
  g().players[0].tableau = [1,2,3];
  g().players[1].tableau = [4,5];
  g().players.forEach(p=>p.status='stayed');
  context.endRoundIfNeeded();
  if (g().phase !== 'roundEnd') throw new Error('expected roundEnd');
  context.render();
  context.startNewRound();
  if (g().players[0].tableau.length !== 0) throw new Error('tableau should reset');
  if (g().players[0].status !== 'active') throw new Error('status should reset to active');
});

log('simulate full game to gameEnd (someone reaches target)', () => {
  context.startGame(['A','B'], 20);
  g().players[0].total = 25;
  g().phase='turn';
  g().currentIndex = 0;
  g().players.forEach(p=>p.status='stayed');
  context.endRoundIfNeeded();
  if (!g().someoneWon) throw new Error('expected someoneWon true');
  context.render();
  g().phase='gameEnd';
  context.render();
  if (!context.E.app.innerHTML.includes('MENANG')) throw new Error('gameEnd screen missing MENANG title');
});

log('buildDeck total card count check (79+6+5+19=109)', () => {
  const deck = context.buildDeck();
  if (deck.length !== 109) throw new Error('expected 109 cards, got ' + deck.length);
  const numberCount = deck.filter(c=>c.kind==='number').length;
  if (numberCount !== 79) throw new Error('expected 79 number cards, got ' + numberCount);
});

log('render all phases without throwing', () => {
  context.startGame(['A','B','C'],100);
  const phases = ['setup','turn','roundEnd','gameEnd'];
  for (const ph of phases){
    g().phase = ph;
    g().someoneWon = false;
    context.render();
  }
});

log('setup screen CRUD renders with players', () => {
  context.__setGame({ phase: 'setup' });
  context.render();
  if (!context.E.app.innerHTML.includes('Tambah Pemain')) throw new Error('setup screen missing add player button');
});

console.log(`\n${passCount} passed, ${failCount} failed.`);
process.exit(failCount ? 1 : 0);
