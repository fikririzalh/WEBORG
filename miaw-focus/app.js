const STORAGE='miaw-focus-v1', APP_TITLE='MIAW FOCUS', $=s=>document.querySelector(s), $all=s=>document.querySelectorAll(s);
const E={
  body:document.body,
  coinCount:$('#coinCount'), treatCount:$('#treatCount'), petNameLabel:$('#petNameLabel'),
  menuBtn:$('#menuBtn'), progressFill:$('#progressFill'), timeDisplay:$('#timeDisplay'),
  timeToggleBtn:$('#timeToggleBtn'), timeToggleIcon:$('#timeToggleIcon'), timeToggleLabel:$('#timeToggleLabel'),
  natureBackdrop:$('#natureBackdrop'),
  setupPanel:$('#setupPanel'), startBtn:$('#startBtn'), sessionControls:$('#sessionControls'),
  customPresetBtn:$('#customPresetBtn'), customTimePanel:$('#customTimePanel'),
  customMinutesInput:$('#customMinutesInput'), customTimeError:$('#customTimeError'),
  pauseBtn:$('#pauseBtn'), stopBtn:$('#stopBtn'),
  menuOverlay:$('#menuOverlay'), closeMenuBtn:$('#closeMenuBtn'), petNameInput:$('#petNameInput'),
  sceneToggle:$('#sceneToggle'), soundToggle:$('#soundToggle'), resetProgressBtn:$('#resetProgressBtn'),
  completeOverlay:$('#completeOverlay'), completeSummary:$('#completeSummary'), completeCloseBtn:$('#completeCloseBtn'),
  toast:$('#toast'),
};

const COIN_INTERVAL_SEC = 20; // 1 coin per 20s focused
const TREAT_BONUS_ON_COMPLETE = 1;
const CUSTOM_MINUTES_MIN = 1;
const CUSTOM_MINUTES_MAX = 720;
const DEFAULT_PREFS={
  petName:'Miaw', scene:'night', sound:true, coins:0, treats:0,
  lastPresetSeconds:1500, lastCustomMinutes:30, timeVisible:true, nature:'forest'
};
const NATURE_SCENES={
  forest:{
    image:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=84',
    label:'Pemandangan hutan hijau yang menenangkan'
  },
  lake:{
    image:'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=84',
    label:'Pemandangan danau pegunungan yang tenang'
  },
  mountain:{
    image:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=84',
    label:'Pemandangan puncak pegunungan'
  },
  valley:{
    image:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=84',
    label:'Pemandangan lembah hijau dengan cahaya hangat'
  }
};

function loadPrefs(){
  try{ return {...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(STORAGE)||'{}')}; }
  catch{ return {...DEFAULT_PREFS}; }
}
function savePrefs(){ try{ localStorage.setItem(STORAGE, JSON.stringify(prefs)); }catch(e){ toast('Gagal menyimpan progres'); } }

let prefs=loadPrefs();
let state={
  running:false, paused:false,
  baseElapsedMs:0, runStartAt:0, intervalId:null,
  durationMs:prefs.lastPresetSeconds*1000,
  sessionEarnedCoins:0,
  audioCtx:null, wakeLock:null,
};

function toast(msg){ E.toast.textContent=msg; E.toast.classList.add('show'); clearTimeout(toast._t); toast._t=setTimeout(()=>E.toast.classList.remove('show'),1800); }
function pad(n){ return String(n).padStart(2,'0'); }
function formatMs(ms){ ms=Math.max(0,ms); const totalSec=Math.round(ms/1000); const s=totalSec%60, m=Math.floor(totalSec/60); return `${pad(m)}:${pad(s)}`; }

function beep(freq=700,dur=.09,type='sine'){
  if(!prefs.sound) return;
  try{
    state.audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();
    const ctx=state.audioCtx, o=ctx.createOscillator(), g=ctx.createGain();
    o.type=type; o.frequency.value=freq;
    g.gain.setValueAtTime(.06, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime+dur);
    o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime+dur);
  }catch(e){}
}
function playChime(){ beep(880,.1); setTimeout(()=>beep(1180,.14),110); }

/* ---------------- Wake Lock ---------------- */
async function requestWakeLock(){
  if(!('wakeLock' in navigator)) return;
  try{
    state.wakeLock = await navigator.wakeLock.request('screen');
    state.wakeLock.addEventListener('release', ()=>{ state.wakeLock=null; });
  }catch(e){ state.wakeLock=null; }
}
function releaseWakeLock(){
  if(state.wakeLock){ state.wakeLock.release().catch(()=>{}); state.wakeLock=null; }
}

/* ---------------- Scene / theme ---------------- */
function applyScene(){
  E.body.dataset.scene = prefs.scene;
  E.sceneToggle.textContent = prefs.scene==='night' ? 'Malam' : 'Siang';
}
function applySound(){ E.soundToggle.textContent = prefs.sound ? 'Nyala' : 'Mati'; }
function applyPetName(){
  const name = prefs.petName || 'Miaw';
  E.petNameLabel.textContent = name;
  E.petNameInput.value = name;
}
function renderCurrency(){
  E.coinCount.textContent = prefs.coins + state.sessionEarnedCoins;
  E.treatCount.textContent = prefs.treats;
}
function applyNature(){
  if(!NATURE_SCENES[prefs.nature]) prefs.nature='forest';
  const selected=NATURE_SCENES[prefs.nature];
  E.body.dataset.nature=prefs.nature;
  E.body.style.setProperty('--nature-image', `url("${selected.image}")`);
  E.natureBackdrop.setAttribute('aria-label', selected.label);
  $all('.nature-choice').forEach(button=>{
    const active=button.dataset.nature===prefs.nature;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}
function applyTimeVisibility(){
  const hidden=prefs.timeVisible===false;
  E.body.classList.toggle('time-is-hidden', hidden);
  E.timeToggleBtn.setAttribute('aria-pressed', String(hidden));
  E.timeToggleIcon.textContent=hidden ? '👀' : '🙈';
  E.timeToggleLabel.textContent=hidden ? 'Tampilkan waktu' : 'Sembunyikan waktu';
  renderTime();
}
function renderTime(remainingMs=Math.max(0,state.durationMs-getElapsedMs())){
  if(prefs.timeVisible===false){
    E.timeDisplay.textContent='Fokus saja';
    E.timeDisplay.setAttribute('aria-label','Waktu disembunyikan');
    return;
  }
  E.timeDisplay.textContent=formatMs(remainingMs);
  E.timeDisplay.setAttribute('aria-label',`Sisa waktu ${formatMs(remainingMs)}`);
}

function setCustomPanel(open){
  E.customTimePanel.hidden=!open;
  E.customPresetBtn.setAttribute('aria-expanded', String(open));
  E.customTimeError.textContent='';
  E.customMinutesInput.removeAttribute('aria-invalid');
  if(open){
    E.customMinutesInput.value=String(prefs.lastCustomMinutes || 30);
    requestAnimationFrame(()=>{ E.customMinutesInput.focus(); E.customMinutesInput.select(); });
  }
}
function setDuration(seconds, customMinutes=null){
  state.durationMs=seconds*1000;
  prefs.lastPresetSeconds=seconds;
  if(customMinutes!==null) prefs.lastCustomMinutes=customMinutes;
  $all('.preset-chip').forEach(chip=>{
    const active = customMinutes!==null ? chip===E.customPresetBtn : Number(chip.dataset.preset)===seconds;
    chip.classList.toggle('active', active);
    chip.setAttribute('aria-pressed', String(active));
  });
  savePrefs();
  renderTime(state.durationMs);
}
function syncDurationControls(){
  const preset=$all('.preset-chip[data-preset]');
  const presetMatch=[...preset].some(chip=>Number(chip.dataset.preset)===prefs.lastPresetSeconds);
  const customMinutes=Number.isInteger(prefs.lastCustomMinutes) ? prefs.lastCustomMinutes : Math.round(prefs.lastPresetSeconds/60);
  E.customMinutesInput.value=String(Math.min(CUSTOM_MINUTES_MAX, Math.max(CUSTOM_MINUTES_MIN, customMinutes || 30)));
  $all('.preset-chip').forEach(chip=>{
    const active=presetMatch ? Number(chip.dataset.preset)===prefs.lastPresetSeconds : chip===E.customPresetBtn;
    chip.classList.toggle('active', active);
    chip.setAttribute('aria-pressed', String(active));
  });
}

/* ---------------- Timing core ---------------- */
function getElapsedMs(){
  if(!state.running) return state.baseElapsedMs;
  return state.baseElapsedMs + (Date.now()-state.runStartAt);
}
function commitEarnedCoins(){
  prefs.coins += state.sessionEarnedCoins;
  state.sessionEarnedCoins = 0;
  savePrefs();
}
function startTicking(){
  state.running=true; state.runStartAt=Date.now();
  E.body.classList.add('is-focusing');
  clearInterval(state.intervalId);
  state.intervalId=setInterval(tick, 200);
  requestWakeLock();
  updatePauseButton();
  tick();
}
function pauseTicking(){
  state.baseElapsedMs=getElapsedMs(); state.running=false;
  E.body.classList.remove('is-focusing');
  clearInterval(state.intervalId); state.intervalId=null;
  releaseWakeLock();
  updatePauseButton(); render();
}
function endSession(commit){
  clearInterval(state.intervalId); state.intervalId=null;
  state.running=false; state.paused=false;
  E.body.classList.remove('is-focusing');
  releaseWakeLock();
  if(commit) commitEarnedCoins();
}
function tick(){
  const elapsed=getElapsedMs();
  state.sessionEarnedCoins = Math.floor(elapsed/1000/COIN_INTERVAL_SEC);
  const remaining=state.durationMs-elapsed;
  if(remaining<=0){
    state.baseElapsedMs=state.durationMs;
    state.sessionEarnedCoins = Math.floor(state.durationMs/1000/COIN_INTERVAL_SEC);
    completeSession();
    return;
  }
  render();
}
function render(){
  const elapsed=getElapsedMs();
  const remaining=Math.max(0, state.durationMs-elapsed);
  renderTime(remaining);
  const pct = state.durationMs>0 ? Math.min(100, (elapsed/state.durationMs)*100) : 0;
  E.progressFill.style.width = pct+'%';
  renderCurrency();
}

/* ---------------- Session flow ---------------- */
function showSetup(){
  E.setupPanel.hidden=false; E.sessionControls.hidden=true;
  renderTime(state.durationMs);
  E.progressFill.style.width='0%';
}
function showSessionControls(){
  E.setupPanel.hidden=true; E.sessionControls.hidden=false;
}
function updatePauseButton(){ E.pauseBtn.textContent = state.running ? '⏸' : '▶'; }

function startSession(){
  state.baseElapsedMs=0; state.sessionEarnedCoins=0;
  showSessionControls();
  startTicking();
  beep(700,.06);
}
function togglePause(){
  if(state.running) pauseTicking(); else startTicking();
}
function stopSession(){
  endSession(true);
  render();
  showSetup();
  toast('Sesi dihentikan. Koin yang sudah didapat tetap tersimpan 🪙');
}
function completeSession(){
  endSession(false);
  prefs.coins += state.sessionEarnedCoins;
  prefs.treats += TREAT_BONUS_ON_COMPLETE;
  state.sessionEarnedCoins = 0;
  savePrefs();
  renderCurrency();
  E.completeSummary.textContent = `Kamu dapat ${Math.floor(state.durationMs/1000/COIN_INTERVAL_SEC)} 🪙 dan ${TREAT_BONUS_ON_COMPLETE} 🐟`;
  E.completeOverlay.hidden=false;
  playChime();
}
function closeComplete(){
  E.completeOverlay.hidden=true;
  showSetup();
}

/* ---------------- Visibility resync ---------------- */
function handleVisibilityChange(){
  if(document.visibilityState==='visible' && state.running){
    requestWakeLock();
    tick();
  }
}

/* ---------------- Bind ---------------- */
function bind(){
  $all('.preset-chip[data-preset]').forEach(chip=>chip.addEventListener('click',()=>{
    if(state.running) return;
    setCustomPanel(false);
    const sec=Number(chip.dataset.preset);
    setDuration(sec);
  }));
  E.customPresetBtn.addEventListener('click',()=>{
    if(state.running) return;
    setCustomPanel(E.customTimePanel.hidden);
  });
  E.customTimePanel.addEventListener('submit',(event)=>{
    event.preventDefault();
    const minutes=Number(E.customMinutesInput.value);
    if(!Number.isInteger(minutes) || minutes<CUSTOM_MINUTES_MIN || minutes>CUSTOM_MINUTES_MAX){
      E.customTimeError.textContent=`Masukkan angka bulat ${CUSTOM_MINUTES_MIN}–${CUSTOM_MINUTES_MAX} menit.`;
      E.customMinutesInput.setAttribute('aria-invalid','true');
      E.customMinutesInput.focus();
      return;
    }
    setDuration(minutes*60, minutes);
    setCustomPanel(false);
    toast(`Durasi custom ${minutes} menit dipilih 🐾`);
  });
  E.timeToggleBtn.addEventListener('click',()=>{
    prefs.timeVisible=!prefs.timeVisible;
    savePrefs(); applyTimeVisibility();
    toast(prefs.timeVisible ? 'Waktu ditampilkan kembali' : 'Waktu disembunyikan. Fokus pada langkahmu 🌿');
  });
  E.startBtn.addEventListener('click',()=>{
    if(!E.customTimePanel.hidden){
      E.customTimePanel.requestSubmit();
      if(!E.customTimePanel.hidden) return;
    }
    startSession();
  });
  E.pauseBtn.addEventListener('click', togglePause);
  E.stopBtn.addEventListener('click', stopSession);

  E.menuBtn.addEventListener('click',()=>{ applyPetName(); E.menuOverlay.hidden=false; });
  E.closeMenuBtn.addEventListener('click',()=>{
    const name = E.petNameInput.value.trim();
    prefs.petName = name || 'Miaw';
    savePrefs(); applyPetName();
    E.menuOverlay.hidden=true;
  });
  E.menuOverlay.addEventListener('click',(e)=>{ if(e.target===E.menuOverlay){ E.closeMenuBtn.click(); } });
  E.sceneToggle.addEventListener('click',()=>{
    prefs.scene = prefs.scene==='night' ? 'day' : 'night';
    savePrefs(); applyScene();
  });
  E.soundToggle.addEventListener('click',()=>{
    prefs.sound = !prefs.sound; savePrefs(); applySound(); beep(700,.05);
  });
  $all('.nature-choice').forEach(button=>button.addEventListener('click',()=>{
    prefs.nature=button.dataset.nature;
    savePrefs(); applyNature();
  }));
  E.resetProgressBtn.addEventListener('click',()=>{
    if(!confirm('Yakin reset koin & treat ke 0?')) return;
    prefs.coins=0; prefs.treats=0; savePrefs(); renderCurrency();
    toast('Progres direset.');
  });
  E.completeCloseBtn.addEventListener('click', closeComplete);

  document.addEventListener('visibilitychange', handleVisibilityChange);
}

/* ---------------- Init ---------------- */
function init(){
  document.title=APP_TITLE;
  applyScene(); applySound(); applyPetName(); applyNature(); applyTimeVisibility(); renderCurrency();
  syncDurationControls();
  showSetup();
  bind();
}
init();
