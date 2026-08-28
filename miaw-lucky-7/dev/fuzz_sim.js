const fs = require('fs');
const vm = require('vm');

function makeElement(){
  return { _html:'', get innerHTML(){return this._html}, set innerHTML(v){this._html=v}, textContent:'', classList:{add(){},remove(){},contains(){return false}}, dataset:{}, addEventListener(){}, onclick:null };
}
const elementsById = {app: makeElement(), toast: makeElement(), themeBtn: makeElement(), soundBtn: makeElement(), resetBtn: makeElement()};
const documentStub = { querySelector(sel){ if(sel.startsWith('#')){return elementsById[sel.slice(1)]||null} return null; }, querySelectorAll(){return [];}, documentElement:{dataset:{}} };
const localStorageStub = { _d:{}, getItem(k){return this._d[k]??null}, setItem(k,v){this._d[k]=v} };

function freshContext(){
  const context = { document: documentStub, window: {}, localStorage: localStorageStub, confirm: () => true, console };
  vm.createContext(context);
  const code = fs.readFileSync('../app.js', 'utf8');
  const augmented = code + `
;this.__getGame = () => game;
this.__setGame = (v) => { game = v; };
this.Math = Math;
`;
  vm.runInContext(augmented, context);
  return context;
}

function rand(n){ return Math.floor(Math.random()*n); }
function pick(arr){ return arr[rand(arr.length)]; }

const TOTAL_CARDS = 109;
let trials = 500;
let crashes = 0, invariantFails = 0, maxStepsHit = 0;

for (let t=0; t<trials; t++){
  const context = freshContext();
  const numPlayers = 2 + rand(7); // 2..8
  const names = Array.from({length:numPlayers}, (_,i)=>'P'+i);
  const targetScore = 20 + rand(60); // keep games short-ish: 20..79
  context.startGame(names, targetScore);
  const g = () => context.__getGame();

  let steps = 0;
  const MAX_STEPS = 4000;
  let crashed = false, invariantBroken = false, errMsg = '';

  try {
    while (g().phase !== 'gameEnd' && steps < MAX_STEPS){
      steps++;
      const ph = g().phase;
      if (ph === 'turn'){
        // 65% ambil, 35% pass
        if (Math.random() < 0.65) context.performAmbil(); else context.performPass();
      } else if (ph === 'pickTarget'){
        const targets = g().pendingAction.targets;
        context.chooseTarget(pick(targets));
      } else if (ph === 'pickCard'){
        const pa = g().pendingAction;
        const len = g().players[pa.targetIdx].tableau.length;
        context.applyCardChoice(rand(len));
      } else if (ph === 'flipThreeStep'){
        context.performForcedDraw();
      } else if (ph === 'peek'){
        const pp = g().pendingPostPeek;
        g().pendingPostPeek = null; g().peekCards = null;
        if (pp.fromNestedQueue) context.processNestedQueue(); else context.postResolve(pp.drawerIdx);
      } else if (ph === 'roundEnd'){
        if (g().someoneWon) g().phase = 'gameEnd'; else context.startNewRound();
      } else {
        throw new Error('Unhandled phase encountered: ' + ph);
      }

      // Invariant check: every physical card is either in deck or discard at all times.
      const deckLen = g().deck.length, discardLen = g().discard.length;
      if (deckLen + discardLen !== TOTAL_CARDS){
        invariantBroken = true;
        errMsg = `Card conservation broken: deck(${deckLen}) + discard(${discardLen}) = ${deckLen+discardLen}, expected ${TOTAL_CARDS} [phase=${ph}, step=${steps}]`;
        break;
      }
      // Invariant: no active/stayed/frozen player should ever have duplicate values in tableau
      for (const p of g().players){
        const uniq = new Set(p.tableau);
        if (uniq.size !== p.tableau.length){
          invariantBroken = true;
          errMsg = `Duplicate values found in a tableau while not busted: [${p.tableau.join(',')}] status=${p.status} [phase=${ph}, step=${steps}]`;
          break;
        }
        if (p.tableau.length > 7){
          invariantBroken = true;
          errMsg = `Tableau exceeded 7 cards without ending round: [${p.tableau.join(',')}] [phase=${ph}, step=${steps}]`;
          break;
        }
      }
      if (invariantBroken) break;
    }
    if (steps >= MAX_STEPS){
      maxStepsHit++;
      console.log(`WARN trial ${t}: hit MAX_STEPS (${MAX_STEPS}) without reaching gameEnd — possible infinite loop. players=${numPlayers} target=${targetScore} phase=${g().phase}`);
    }
  } catch(e){
    crashed = true;
    errMsg = e.stack;
  }

  if (crashed){
    crashes++;
    console.log(`CRASH trial ${t} (players=${numPlayers}, target=${targetScore}, step=${steps}):\n  ${errMsg}`);
  } else if (invariantBroken){
    invariantFails++;
    console.log(`INVARIANT-FAIL trial ${t} (players=${numPlayers}, target=${targetScore}):\n  ${errMsg}`);
  }
}

console.log(`\n${trials} trials run.`);
console.log(`Crashes: ${crashes}`);
console.log(`Invariant failures: ${invariantFails}`);
console.log(`Trials that hit MAX_STEPS (possible infinite loop): ${maxStepsHit}`);
process.exit((crashes>0||invariantFails>0||maxStepsHit>0) ? 1 : 0);
