const fs = require('fs');
const vm = require('vm');

function makeEl(tag){
  return {
    tag, _html:'', textContent:'', value:'', checked:false, hidden:false, title:'',
    style:{ setProperty(){}, getPropertyValue(){return ''} },
    dataset:{},
    classList:{ _set:new Set(), add(...c){c.forEach(x=>this._set.add(x))}, remove(...c){c.forEach(x=>this._set.delete(x))}, toggle(c,v){ if(v===undefined){ if(this._set.has(c)){this._set.delete(c);return false} else {this._set.add(c);return true} } if(v){this._set.add(c)}else{this._set.delete(c)} return v }, contains(c){return this._set.has(c)} },
    get innerHTML(){return this._html}, set innerHTML(v){this._html=v},
    addEventListener(){}, appendChild(){}, closest(){return null},
    files:[],
  };
}

const byId = {};
['ringFg','catFace','timeDisplay','hiddenLabel','themeBtn','soundBtn','bgBtn','startBtn','resetBtn','hideBtn','peekBtn',
 'adjustRow','presetRow','hVal','mVal','sVal','bgPanel','closeBgBtn','presetBgGrid','bgUpload','resetBgBtn',
 'alarmOverlay','snoozeBtn','stopAlarmBtn','toast'
].forEach(id => byId[id] = makeEl('div'));
byId['msToggle'] = makeEl('input');
byId['msToggle'].parentElement = makeEl('label');

const modeTabTimer = makeEl('button'); modeTabTimer.dataset.mode='timer'; modeTabTimer.classList.add('mode-tab','active');
const modeTabStopwatch = makeEl('button'); modeTabStopwatch.dataset.mode='stopwatch'; modeTabStopwatch.classList.add('mode-tab');
const modeTabs = [modeTabTimer, modeTabStopwatch];

const adjBtns = [];
['h','m','s'].forEach(unit=>{
  ['-1','1'].forEach(delta=>{
    const b=makeEl('button'); b.dataset.adjust=unit; b.dataset.delta=delta; b.classList.add('adj-btn'); adjBtns.push(b);
  });
});

const presetChips = [60,300,600,900,1500,2700].map(sec=>{ const b=makeEl('button'); b.dataset.preset=String(sec); b.classList.add('preset-chip'); return b; });

const appShell = makeEl('div'); appShell.classList.add('app-shell');
const stageEl = makeEl('div'); stageEl.classList.add('stage');
const ringSvgEl = makeEl('svg'); ringSvgEl.classList.add('ring-svg');

const documentStub = {
  querySelector(sel){
    if(sel.startsWith('#')) return byId[sel.slice(1)] || null;
    if(sel==='.app-shell') return appShell;
    if(sel==='.stage') return stageEl;
    if(sel==='.ring-svg') return ringSvgEl;
    return null;
  },
  querySelectorAll(sel){
    if(sel==='.mode-tab') return modeTabs;
    if(sel==='.adj-btn') return adjBtns;
    if(sel==='.preset-chip') return presetChips;
    return [];
  },
  getElementById(id){ return null; }, // force the spin-keyframe style injection path to run once (harmless no-op env)
  createElement(){ return makeEl('style'); },
  head: { appendChild(){} },
  body: { style:{ setProperty(){}, getPropertyValue(){return ''} }, classList:{ add(){}, remove(){} } },
  documentElement: { dataset:{} },
  addEventListener(){},
  visibilityState:'visible',
};

const localStorageStub = { _d:{}, getItem(k){return this._d[k]??null}, setItem(k,v){this._d[k]=v} };

const context = { document: documentStub, window: {}, localStorage: localStorageStub, confirm: () => true, console,
  setInterval, clearInterval, setTimeout, clearTimeout, Date, navigator: {} };
vm.createContext(context);
const code = fs.readFileSync('../app.js', 'utf8');
const augmented = code + `
;this.__getState = () => state;
this.__getPrefs = () => prefs;
this.__getE = () => E;
`;
vm.runInContext(augmented, context);

let pass=0, fail=0;
async function log(label, fn){
  try{ await fn(); pass++; console.log('OK   -', label); }
  catch(e){ fail++; console.log('FAIL -', label, '\n     ', e.stack); }
}

const st = () => context.__getState();
const pf = () => context.__getPrefs();

(async () => {

await log('init() runs without throwing', () => {
  // init() already ran at module load (last line of app.js). Just sanity check state exists.
  if (!st()) throw new Error('state not initialized');
  if (st().mode !== 'timer') throw new Error('expected default mode timer, got ' + st().mode);
});

await log('formatMs basic cases', () => {
  const f = context.formatMs;
  if (f(0,false) !== '00:00') throw new Error('got ' + f(0,false));
  if (f(65000,false) !== '01:05') throw new Error('got ' + f(65000,false));
  if (f(3661000,false) !== '01:01:01') throw new Error('got ' + f(3661000,false));
  if (f(1234,true) !== '00:01.23') throw new Error('got ' + f(1234,true));
});

await log('adjustDuration increases/decreases minutes correctly', () => {
  context.__setStateDurationHelper && context.__setStateDurationHelper(); // no-op guard
  st().durationMs = 5*60*1000; // 5 min
  context.adjustDuration('m', 1);
  if (st().durationMs !== 6*60*1000) throw new Error('expected 6 min, got ' + st().durationMs/60000);
  context.adjustDuration('m', -2);
  if (st().durationMs !== 4*60*1000) throw new Error('expected 4 min, got ' + st().durationMs/60000);
});

await log('adjustDuration wraps minutes 0->59 going down, hours clamp 0..23', () => {
  st().durationMs = 0;
  context.adjustDuration('m', -1);
  const totalSec = Math.round(st().durationMs/1000);
  const m = Math.floor(totalSec/60)%60;
  if (m !== 59) throw new Error('expected minutes to wrap to 59, got ' + m);
  st().durationMs = 23*3600*1000;
  context.adjustDuration('h', 5); // should clamp at 23
  const h = Math.floor(st().durationMs/3600000);
  if (h !== 23) throw new Error('expected hour clamp at 23, got ' + h);
});

await log('adjustDuration refuses to change while running', () => {
  st().durationMs = 5*60*1000;
  st().running = true;
  context.adjustDuration('m', 5);
  if (st().durationMs !== 5*60*1000) throw new Error('duration should not change while running');
  st().running = false;
});

await log('setMode switches mode and resets timing', () => {
  st().baseElapsedMs = 5000;
  context.setMode('stopwatch');
  if (st().mode !== 'stopwatch') throw new Error('mode did not switch');
  if (st().baseElapsedMs !== 0) throw new Error('expected reset elapsed on mode switch');
  context.setMode('timer');
});

await log('startTicking / pauseTicking track elapsed correctly', () => {
  context.resetTiming();
  context.startTicking();
  if (!st().running) throw new Error('expected running true');
  // simulate 250ms having passed by rewinding runStartAt
  st().runStartAt = Date.now() - 250;
  context.pauseTicking();
  if (st().running) throw new Error('expected running false after pause');
  if (st().baseElapsedMs < 200) throw new Error('expected elapsed >= ~250ms, got ' + st().baseElapsedMs);
  context.resetTiming();
});

await log('timer countdown triggers alarm when remaining hits 0', () => {
  context.setMode('timer');
  st().durationMs = 1000; // 1 second timer
  context.resetTiming();
  context.startTicking();
  // simulate that 2 seconds have already elapsed (well past the 1s duration)
  st().runStartAt = Date.now() - 2000;
  context.tick();
  if (!st().alarmActive) throw new Error('expected alarmActive true after countdown expired');
  if (context.__getE().alarmOverlay.hidden !== false) throw new Error('expected alarm overlay visible');
  context.stopAlarm();
  context.resetTiming();
});

await log('snooze adds 60s and resumes running, clearing alarm', () => {
  context.setMode('timer');
  st().durationMs = 1000;
  context.resetTiming();
  context.startTicking();
  st().runStartAt = Date.now() - 2000;
  context.tick();
  if (!st().alarmActive) throw new Error('expected alarm active before snooze test');
  const beforeDuration = st().durationMs;
  // emulate clicking snooze button handler logic manually since we didn't wire real DOM events
  context.stopAlarm();
  st().durationMs += 60000;
  context.startTicking();
  if (st().alarmActive) throw new Error('expected alarm cleared after snooze');
  if (st().durationMs !== beforeDuration + 60000) throw new Error('expected +60000ms duration after snooze');
  if (!st().running) throw new Error('expected running true after snooze resumes');
  context.resetTiming();
});

await log('hide/peek does not throw and toggles stage class logic path', () => {
  st().hidden = true;
  context.render();
  context.doPeek();
  if (!st().peeking) throw new Error('expected peeking true immediately after doPeek');
  st().hidden = false;
  context.render();
});

await log('prefs persist through save/load round trip', () => {
  pf().theme = 'dark';
  pf().sound = false;
  context.savePrefs();
  const raw = localStorageStub.getItem('miaw-stopwatch-v1');
  if (!raw) throw new Error('expected something saved to localStorage');
  const parsed = JSON.parse(raw);
  if (parsed.theme !== 'dark' || parsed.sound !== false) throw new Error('persisted prefs mismatch: ' + raw);
});

await log('applyBackground does not throw for preset and custom', () => {
  pf().background = { type:'preset', value:'mint' };
  context.applyBackground();
  pf().background = { type:'custom', value:'data:image/jpeg;base64,AAAA' };
  context.applyBackground();
  pf().background = { type:'preset', value:'default' };
  context.applyBackground();
});

await log('renderBgGrid builds markup without throwing', () => {
  context.renderBgGrid();
  const html = context.__getE().presetBgGrid.innerHTML;
  if (!html.includes('data-bgpreset')) throw new Error('expected preset swatches markup');
});

await log('requestWakeLock degrades gracefully when navigator.wakeLock unsupported', async () => {
  await context.requestWakeLock();
  if (st().wakeLock !== null) throw new Error('expected wakeLock to stay null when unsupported');
});

await log('requestWakeLock succeeds when navigator.wakeLock is available (mocked)', async () => {
  const releaseListeners = [];
  context.navigator.wakeLock = {
    request: async (type) => {
      if (type !== 'screen') throw new Error('expected screen type');
      return { addEventListener: (evt, fn) => { if (evt==='release') releaseListeners.push(fn); }, release: async () => {} };
    }
  };
  await context.requestWakeLock();
  if (!st().wakeLock) throw new Error('expected wakeLock object to be set');
  context.releaseWakeLock();
  if (st().wakeLock !== null) throw new Error('expected wakeLock cleared after release');
  delete context.navigator.wakeLock;
});

await log('startTicking requests wake lock, pauseTicking releases it (mocked)', async () => {
  let requested = 0, released = 0;
  context.navigator.wakeLock = {
    request: async () => { requested++; return { addEventListener(){}, release: async () => { released++; } }; }
  };
  context.resetTiming();
  context.startTicking();
  await new Promise(r => setTimeout(r, 10)); // let the async wake-lock request settle
  if (requested !== 1) throw new Error('expected wake lock requested once, got ' + requested);
  context.pauseTicking();
  await new Promise(r => setTimeout(r, 10));
  if (released !== 1) throw new Error('expected wake lock released once, got ' + released);
  delete context.navigator.wakeLock;
  context.resetTiming();
});

await log('handleVisibilityChange resyncs immediately and does not throw when hidden/visible toggles', () => {
  context.setMode('timer');
  st().durationMs = 1000;
  context.resetTiming();
  context.startTicking();
  // simulate the phone being locked for 2 seconds (well past the 1s duration),
  // during which no ticks fired at all (this is exactly the reported bug scenario)
  st().runStartAt = Date.now() - 2000;
  documentStub.visibilityState = 'hidden';
  context.handleVisibilityChange(); // should no-op while hidden
  if (st().alarmActive) throw new Error('should not resolve anything while still hidden');
  documentStub.visibilityState = 'visible';
  context.handleVisibilityChange(); // should resync immediately now
  if (!st().alarmActive) throw new Error('expected alarm to trigger immediately upon becoming visible again, matching real elapsed time');
  context.stopAlarm();
  context.resetTiming();
});

console.log(`\n${pass} passed, ${fail} failed.`);
process.exit(fail ? 1 : 0);
})();
