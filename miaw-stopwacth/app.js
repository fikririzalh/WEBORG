const STORAGE='miaw-stopwatch-v1', $=s=>document.querySelector(s), $all=s=>document.querySelectorAll(s);
const E={
  app:document.querySelector('.app-shell'), stage:$('.stage'), ring:$('#ringFg'), ringSvg:$('.ring-svg'),
  catFace:$('#catFace'), timeDisplay:$('#timeDisplay'), hiddenLabel:$('#hiddenLabel'),
  themeBtn:$('#themeBtn'), soundBtn:$('#soundBtn'), bgBtn:$('#bgBtn'),
  startBtn:$('#startBtn'), resetBtn:$('#resetBtn'), hideBtn:$('#hideBtn'), peekBtn:$('#peekBtn'),
  adjustRow:$('#adjustRow'), presetRow:$('#presetRow'), hVal:$('#hVal'), mVal:$('#mVal'), sVal:$('#sVal'),
  msToggle:$('#msToggle'),
  bgPanel:$('#bgPanel'), closeBgBtn:$('#closeBgBtn'), presetBgGrid:$('#presetBgGrid'), bgUpload:$('#bgUpload'), resetBgBtn:$('#resetBgBtn'),
  alarmOverlay:$('#alarmOverlay'), snoozeBtn:$('#snoozeBtn'), stopAlarmBtn:$('#stopAlarmBtn'),
  toast:$('#toast'),
};
const RING_CIRC = 2*Math.PI*98;

const BG_PRESETS=[
  {id:'default', name:'Default', css:null},
  {id:'peach', name:'Peach Cream', css:'radial-gradient(circle at 20% 15%,#ffd9c7 0%,transparent 45%),radial-gradient(circle at 85% 20%,#ffe9b0 0%,transparent 40%),radial-gradient(circle at 50% 100%,#ffc9d6 0%,transparent 55%),#fff3e9'},
  {id:'lavender', name:'Lavender Dream', css:'radial-gradient(circle at 15% 10%,#d9c9ff 0%,transparent 45%),radial-gradient(circle at 85% 20%,#c9e2ff 0%,transparent 40%),radial-gradient(circle at 50% 100%,#ffd6f0 0%,transparent 55%),#f3edff'},
  {id:'mint', name:'Mint Milk', css:'radial-gradient(circle at 20% 10%,#cdf5df 0%,transparent 45%),radial-gradient(circle at 85% 15%,#d6f0ff 0%,transparent 40%),radial-gradient(circle at 50% 100%,#fff6cf 0%,transparent 55%),#f2fff8'},
  {id:'sunset', name:'Sunset Paws', css:'radial-gradient(circle at 15% 15%,#ffb199 0%,transparent 45%),radial-gradient(circle at 85% 10%,#ffd977 0%,transparent 40%),radial-gradient(circle at 50% 100%,#ff8fb3 0%,transparent 55%),#fff0e5'},
  {id:'cotton', name:'Cotton Candy', css:'radial-gradient(circle at 20% 20%,#ffc9e8 0%,transparent 45%),radial-gradient(circle at 80% 15%,#c9f0ff 0%,transparent 40%),radial-gradient(circle at 50% 100%,#d9c9ff 0%,transparent 55%),#fff5fb'},
  {id:'night', name:'Night Sky', css:'radial-gradient(circle at 20% 15%,#3a2f66 0%,transparent 45%),radial-gradient(circle at 85% 10%,#2a4a66 0%,transparent 40%),radial-gradient(circle at 50% 100%,#4a2f55 0%,transparent 55%),#12101f'},
];

let prefs=loadPrefs();
let state={
  mode:prefs.lastMode||'timer',
  running:false,
  baseElapsedMs:0,
  runStartAt:0,
  intervalId:null,
  durationMs:(prefs.lastTimerSeconds||300)*1000,
  hidden:!!prefs.hideTimer,
  alarmActive:false,
  alarmIntervalId:null,
  peekTimeoutId:null,
  peeking:false,
  lastRenderedStr:'',
  audioCtx:null,
  wakeLock:null,
};

function loadPrefs(){
  try{ return {...{theme:'light',sound:true,hideTimer:false,lastMode:'timer',lastTimerSeconds:300,showMs:false,background:{type:'preset',value:'default'}}, ...JSON.parse(localStorage.getItem(STORAGE)||'{}')}; }
  catch{ return {theme:'light',sound:true,hideTimer:false,lastMode:'timer',lastTimerSeconds:300,showMs:false,background:{type:'preset',value:'default'}}; }
}
function savePrefs(){ try{ localStorage.setItem(STORAGE, JSON.stringify(prefs)); }catch(e){ toast('Gagal menyimpan (penyimpanan penuh?)'); } }

function toast(msg){ E.toast.textContent=msg; E.toast.classList.add('show'); clearTimeout(toast._t); toast._t=setTimeout(()=>E.toast.classList.remove('show'),1800); }

function beep(freq=700,dur=.08,type='sine'){
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
function playMeow(){
  beep(880,.12,'sine');
  setTimeout(()=>beep(660,.16,'sine'),140);
}

/* ---------------- Theme ---------------- */
function applyTheme(){
  document.documentElement.dataset.theme = prefs.theme;
  E.themeBtn.textContent = prefs.theme==='dark' ? '☀️' : '🌙';
  E.soundBtn.textContent = prefs.sound ? '🔊' : '🔇';
}

/* ---------------- Background ---------------- */
function applyBackground(){
  const bg=prefs.background;
  if(bg.type==='custom' && bg.value){
    document.body.style.setProperty('--user-bg', `url(${bg.value})`);
  } else {
    const preset=BG_PRESETS.find(p=>p.id===bg.value) || BG_PRESETS[0];
    document.body.style.setProperty('--user-bg', preset.css || '');
  }
}
function renderBgGrid(){
  E.presetBgGrid.innerHTML = BG_PRESETS.map(p=>{
    const active = prefs.background.type==='preset' && prefs.background.value===p.id;
    const style = p.css ? `background:${p.css}` : 'background:var(--default-bg)';
    return `<button class="bg-swatch ${active?'active':''}" style="${style}" data-bgpreset="${p.id}"><span>${p.name}</span></button>`;
  }).join('');
}
function resizeImageFile(file){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>{
      const img=new Image();
      img.onload=()=>{
        const maxW=1280;
        const scale=Math.min(1, maxW/img.width);
        const w=Math.round(img.width*scale), h=Math.round(img.height*scale);
        const canvas=document.createElement('canvas');
        canvas.width=w; canvas.height=h;
        canvas.getContext('2d').drawImage(img,0,0,w,h);
        resolve(canvas.toDataURL('image/jpeg', .82));
      };
      img.onerror=reject;
      img.src=reader.result;
    };
    reader.onerror=reject;
    reader.readAsDataURL(file);
  });
}

/* ---------------- Wake Lock (keep screen on while running) ---------------- */
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

/* ---------------- Timing core ---------------- */
function getElapsedMs(){
  if(!state.running) return state.baseElapsedMs;
  return state.baseElapsedMs + (Date.now()-state.runStartAt);
}
function startTicking(){
  state.running=true; state.runStartAt=Date.now();
  clearInterval(state.intervalId);
  state.intervalId=setInterval(tick, 100);
  requestWakeLock();
  updateStartButton(); updateCatFace(); tick();
}
function pauseTicking(){
  state.baseElapsedMs=getElapsedMs(); state.running=false;
  clearInterval(state.intervalId); state.intervalId=null;
  releaseWakeLock();
  updateStartButton(); updateCatFace(); render();
}
function resetTiming(){
  clearInterval(state.intervalId); state.intervalId=null;
  state.running=false; state.baseElapsedMs=0; state.runStartAt=0;
  stopAlarm();
  releaseWakeLock();
  updateStartButton(); updateCatFace(); render();
}
function tick(){
  const elapsed=getElapsedMs();
  if(state.mode==='timer'){
    const remaining=state.durationMs-elapsed;
    if(remaining<=0 && !state.alarmActive){
      state.baseElapsedMs=state.durationMs; state.running=false;
      clearInterval(state.intervalId); state.intervalId=null;
      triggerAlarm();
      return;
    }
  }
  render();
}

/* ---------------- Rendering ---------------- */
function formatMs(ms, withMs){
  ms=Math.max(0,ms);
  const totalCs=Math.floor(ms/10);
  const cs=totalCs%100;
  const totalSec=Math.floor(ms/1000);
  const s=totalSec%60, m=Math.floor(totalSec/60)%60, h=Math.floor(totalSec/3600);
  let str = h>0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  if(withMs) str += '.'+pad(cs);
  return str;
}
function pad(n){ return String(n).padStart(2,'0'); }

function renderDigits(str){
  const prev=state.lastRenderedStr;
  const chars=str.split('');
  E.timeDisplay.innerHTML = chars.map((c,i)=>{
    const changed = prev.length!==str.length || prev[i]!==c;
    return `<span class="digit${changed && c!==':' && c!=='.' ? ' pulse':''}">${c}</span>`;
  }).join('');
  state.lastRenderedStr=str;
}

function updateRing(){
  if(state.mode==='timer'){
    const elapsed=getElapsedMs();
    const remaining=Math.max(0, state.durationMs-elapsed);
    const pct = state.durationMs>0 ? remaining/state.durationMs : 0;
    E.ring.style.strokeDasharray = RING_CIRC;
    E.ring.style.strokeDashoffset = RING_CIRC*(1-pct);
    E.ring.style.stroke = pct<0.15 ? 'var(--danger)' : 'var(--ring-fg)';
    E.ringSvg.classList.remove('spin');
  } else {
    E.ring.style.strokeDasharray = RING_CIRC;
    E.ring.style.strokeDashoffset = 0;
    E.ringSvg.classList.toggle('spin', state.running);
  }
}
if(!document.getElementById('spinKeyframe')){
  const styleTag=document.createElement('style');
  styleTag.id='spinKeyframe';
  styleTag.textContent='.ring-svg.spin{animation:ringspin 2.2s linear infinite}@keyframes ringspin{to{transform:rotate(270deg)}}';
  document.head.appendChild(styleTag);
}

function updateCatFace(){
  E.catFace.classList.remove('state-running','state-paused','state-alarm');
  if(state.alarmActive){ E.catFace.textContent='🙀'; E.catFace.classList.add('state-alarm'); return; }
  if(state.running){ E.catFace.textContent='😻'; E.catFace.classList.add('state-running'); return; }
  const elapsed=getElapsedMs();
  if(elapsed>0){ E.catFace.textContent='😽'; E.catFace.classList.add('state-paused'); return; }
  E.catFace.textContent='😺';
}

function updateStartButton(){
  E.startBtn.textContent = state.running ? '⏸' : '▶';
  E.startBtn.classList.toggle('is-running', state.running);
  E.startBtn.title = state.running ? 'Jeda' : 'Mulai';
}

function render(){
  const elapsed=getElapsedMs();
  let displayMs;
  if(state.mode==='timer') displayMs = Math.max(0, state.durationMs-elapsed);
  else displayMs = elapsed;
  const withMs = state.mode==='stopwatch' && prefs.showMs;
  renderDigits(formatMs(displayMs, withMs));
  updateRing();
  updateCatFace();
  E.stage.classList.toggle('is-hidden', state.hidden && !state.peeking);
}

/* ---------------- Mode & adjust ---------------- */
function setMode(mode){
  if(state.running || getElapsedMs()>0){
    if(!confirm('Ganti mode akan mereset waktu sekarang. Lanjutkan?')) return;
  }
  state.mode=mode; prefs.lastMode=mode; savePrefs();
  resetTiming();
  $all('.mode-tab').forEach(b=>b.classList.toggle('active', b.dataset.mode===mode));
  E.adjustRow.style.display = mode==='timer' ? 'flex' : 'none';
  E.presetRow.style.display = mode==='timer' ? 'flex' : 'none';
  E.msToggle.parentElement.style.display = mode==='stopwatch' ? 'flex' : 'none';
  render();
}
function updateAdjustDisplay(){
  const totalSec=Math.round(state.durationMs/1000);
  const h=Math.floor(totalSec/3600), m=Math.floor(totalSec/60)%60, s=totalSec%60;
  E.hVal.textContent=pad(h); E.mVal.textContent=pad(m); E.sVal.textContent=pad(s);
  $all('.preset-chip').forEach(chip=>chip.classList.toggle('active', Number(chip.dataset.preset)===totalSec));
}
function adjustDuration(unit,delta){
  if(state.running){ toast('Jeda dulu untuk mengatur waktu'); return; }
  let totalSec=Math.round(state.durationMs/1000);
  let h=Math.floor(totalSec/3600), m=Math.floor(totalSec/60)%60, s=totalSec%60;
  if(unit==='h') h=Math.max(0,Math.min(23,h+delta));
  if(unit==='m') m=(m+delta+60)%60;
  if(unit==='s') s=(s+delta+60)%60;
  totalSec=h*3600+m*60+s;
  state.durationMs=Math.max(0,totalSec)*1000;
  prefs.lastTimerSeconds=Math.max(0,totalSec); savePrefs();
  state.baseElapsedMs=0;
  updateAdjustDisplay(); render();
}

/* ---------------- Alarm ---------------- */
function triggerAlarm(){
  state.alarmActive=true;
  E.alarmOverlay.hidden=false;
  updateCatFace(); render();
  playMeow();
  state.alarmIntervalId=setInterval(playMeow, 1100);
  document.body.classList.add('alarm-flash');
}
function stopAlarm(){
  state.alarmActive=false;
  E.alarmOverlay.hidden=true;
  clearInterval(state.alarmIntervalId); state.alarmIntervalId=null;
  document.body.classList.remove('alarm-flash');
  updateCatFace();
}

/* ---------------- Peek ---------------- */
function doPeek(){
  if(!state.hidden) return;
  state.peeking=true; render();
  clearTimeout(state.peekTimeoutId);
  state.peekTimeoutId=setTimeout(()=>{ state.peeking=false; render(); }, 3000);
}

/* ---------------- Bind ---------------- */
function bind(){
  $all('.mode-tab').forEach(btn=>btn.addEventListener('click',()=>setMode(btn.dataset.mode)));
  $all('.adj-btn').forEach(btn=>btn.addEventListener('click',()=>adjustDuration(btn.dataset.adjust, Number(btn.dataset.delta))));
  $all('.preset-chip').forEach(btn=>btn.addEventListener('click',()=>{
    if(state.running){ toast('Jeda dulu untuk mengatur waktu'); return; }
    const sec=Number(btn.dataset.preset);
    state.durationMs=sec*1000; state.baseElapsedMs=0;
    prefs.lastTimerSeconds=sec; savePrefs();
    updateAdjustDisplay(); render();
  }));
  E.startBtn.addEventListener('click',()=>{
    if(state.alarmActive) return;
    if(state.mode==='timer' && !state.running && state.durationMs<=0){ toast('Atur durasi timer dulu ya 🐾'); return; }
    if(state.mode==='timer' && !state.running && getElapsedMs()>=state.durationMs){ resetTiming(); }
    state.running ? pauseTicking() : startTicking();
  });
  E.resetBtn.addEventListener('click', resetTiming);
  E.hideBtn.addEventListener('click',()=>{
    state.hidden=!state.hidden; prefs.hideTimer=state.hidden; savePrefs();
    E.hideBtn.textContent = state.hidden ? '🙉' : '🙈';
    E.peekBtn.hidden=!state.hidden;
    state.peeking=false; render();
    toast(state.hidden ? 'Angka disembunyikan. Fokus, ya! 🐾' : 'Angka ditampilkan lagi.');
  });
  E.peekBtn.addEventListener('click', doPeek);
  E.msToggle.addEventListener('change',()=>{ prefs.showMs=E.msToggle.checked; savePrefs(); render(); });

  E.themeBtn.addEventListener('click',()=>{ prefs.theme = prefs.theme==='dark'?'light':'dark'; savePrefs(); applyTheme(); });
  E.soundBtn.addEventListener('click',()=>{ prefs.sound=!prefs.sound; savePrefs(); applyTheme(); beep(700,.05); });

  E.bgBtn.addEventListener('click',()=>{ renderBgGrid(); E.bgPanel.hidden=false; });
  E.closeBgBtn.addEventListener('click',()=>{ E.bgPanel.hidden=true; });
  E.bgPanel.addEventListener('click',(e)=>{ if(e.target===E.bgPanel) E.bgPanel.hidden=true; });
  E.presetBgGrid.addEventListener('click',(e)=>{
    const btn=e.target.closest('[data-bgpreset]'); if(!btn) return;
    prefs.background={type:'preset', value:btn.dataset.bgpreset}; savePrefs();
    applyBackground(); renderBgGrid();
  });
  E.bgUpload.addEventListener('change', async (e)=>{
    const file=e.target.files[0]; if(!file) return;
    if(!file.type.startsWith('image/')){ toast('File harus berupa gambar'); return; }
    try{
      const dataUrl = await resizeImageFile(file);
      prefs.background={type:'custom', value:dataUrl};
      savePrefs(); applyBackground(); renderBgGrid();
      toast('Background berhasil disimpan! 🐾');
    }catch(err){ toast('Gagal memuat gambar'); }
    e.target.value='';
  });
  E.resetBgBtn.addEventListener('click',()=>{
    prefs.background={type:'preset', value:'default'}; savePrefs();
    applyBackground(); renderBgGrid();
  });

  E.snoozeBtn.addEventListener('click',()=>{
    stopAlarm();
    state.durationMs += 60000;
    prefs.lastTimerSeconds = Math.round(state.durationMs/1000); savePrefs();
    startTicking(); updateAdjustDisplay();
    toast('+1 menit ditambahkan!');
  });
  E.stopAlarmBtn.addEventListener('click',()=>{ stopAlarm(); resetTiming(); });
}

/* ---------------- Init ---------------- */
function handleVisibilityChange(){
  if(document.visibilityState==='visible'){
    // Layar baru saja menyala lagi (unlock / kembali dari tab lain).
    // Browser mobile menghentikan total JS saat layar terkunci, jadi begitu
    // aktif lagi kita langsung sinkronkan waktu & cek alarm alih-alih
    // menunggu interval berikutnya (bisa telat sampai 100ms atau lebih
    // kalau sempat throttled), dan minta ulang wake lock (otomatis lepas
    // saat halaman disembunyikan, sesuai spesifikasi Wake Lock API).
    if(state.running){ requestWakeLock(); tick(); }
    else render();
  }
}
function init(){
  applyTheme();
  applyBackground();
  E.msToggle.checked=!!prefs.showMs;
  E.hideBtn.textContent = state.hidden ? '🙉' : '🙈';
  E.peekBtn.hidden = !state.hidden;
  updateAdjustDisplay();
  $all('.mode-tab').forEach(b=>b.classList.toggle('active', b.dataset.mode===state.mode));
  E.adjustRow.style.display = state.mode==='timer' ? 'flex' : 'none';
  E.presetRow.style.display = state.mode==='timer' ? 'flex' : 'none';
  E.msToggle.parentElement.style.display = state.mode==='stopwatch' ? 'flex' : 'none';
  bind();
  document.addEventListener('visibilitychange', handleVisibilityChange);
  render();
}
init();
