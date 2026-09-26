const STORAGE_V2='duel-tebak-angka-v2', STORAGE_V1='duel-tebak-angka-v1';
const $=s=>document.querySelector(s);
const E={app:$('#app'),theme:$('#themeBtn'),sound:$('#soundBtn'),reset:$('#resetBtn'),toast:$('#toast'),confetti:$('#confettiLayer')};

const PRESETS=[{label:'Mudah (1-50)',min:1,max:50},{label:'Normal (1-100)',min:1,max:100},{label:'Sulit (1-200)',min:1,max:200}];
const AVATARS=['😼','😻','😹','🙀','😾','🐱'];
const MATCH_MODES=[{id:'single',label:'Ronde Tunggal',desc:'Satu game, langsung ketahuan siapa juaranya.'},{id:'bo3',label:'Best of 3',desc:'Menang 2 dari 3 game buat jadi juara match.'}];
const TAUNTS={
 blaze:['🔥🔥🔥 PANAS MEMBARA! Dikit lagi ketangkep!','🔥🔥🔥 Nyaris kebakar, itu deket banget!','🔥🔥🔥 Kucingnya udah ngendus-ngendus, deket nih!'],
 hot:['🔥🔥 Panas nih, terus kejar!','🔥🔥 Makin deket, jangan lengah!','🔥🔥 Kerasa hangat-hangat gimana gitu.'],
 warm:['🔥 Hangat, masih di jalur yang benar.','🔥 Lumayan, ada progress.','🔥 Anget-anget kayak susu kucing.'],
 cold:['🧊 Dingin, coba arah lain.','🧊 Meleset lumayan jauh tuh.','🧊 Mulai kerasa dingin nih.'],
 freeze:['🧊🧊🧊 BEKU! Jauh banget itu.','🧊🧊🧊 Nyasar ke Antartika kayaknya.','🧊🧊🧊 Dingin ekstrem, atur ulang strategi!']
};

let prefs,game=null,input='',audio=null,turnTimerHandle=null,turnTimerVal=20;

function loadPrefs(){
 const base={theme:'light',sound:true,names:['Player A','Player B'],avatars:[AVATARS[0],AVATARS[1]],presetIdx:1,customMin:1,customMax:100,matchMode:'single',speedMode:false};
 try{
  const v2=JSON.parse(localStorage.getItem(STORAGE_V2)||'null');
  if(v2)return {...base,...v2};
  const v1=JSON.parse(localStorage.getItem(STORAGE_V1)||'null');
  if(v1)return {...base,...v1,avatars:base.avatars,matchMode:'single',speedMode:false};
 }catch{}
 return base;
}
function savePrefs(){try{localStorage.setItem(STORAGE_V2,JSON.stringify(prefs))}catch{}}
function esc(v=''){return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function toast(m){E.toast.textContent=m;E.toast.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>E.toast.classList.remove('show'),1600)}

function beep(f=650,d=.06,type='sine',delay=0){
 if(!prefs.sound)return;
 try{
  audio||=new (window.AudioContext||window.webkitAudioContext)();
  const t0=audio.currentTime+delay,o=audio.createOscillator(),g=audio.createGain();
  o.type=type;o.frequency.value=f;
  g.gain.setValueAtTime(.05,t0);
  g.gain.exponentialRampToValueAtTime(.001,t0+d);
  o.connect(g).connect(audio.destination);
  o.start(t0);o.stop(t0+d);
 }catch{}
}
function fanfare(){[[523,.12,0],[659,.12,.12],[784,.12,.24],[1046,.28,.36]].forEach(([f,d,t])=>beep(f,d,'triangle',t))}
function tierBeep(t){const map={blaze:900,hot:760,warm:620,cold:420,freeze:280};beep(map[t]||500,.09)}

function confettiBurst(count=50,big=false){
 const layer=E.confetti;if(!layer)return;
 const colors=['#ef7d43','#f5c35a','#4f9763','#3f7fc9','#c98a2e','#ff6b81'];
 for(let i=0;i<count;i++){
  const el=document.createElement('div');
  el.className='confetti-piece';
  el.style.left=Math.random()*100+'%';
  el.style.setProperty('--c',colors[Math.floor(Math.random()*colors.length)]);
  el.style.setProperty('--r',(Math.random()*360)+'deg');
  el.style.setProperty('--d',(2+Math.random()*1.6)+'s');
  el.style.setProperty('--x',(Math.random()*140-70)+'px');
  if(big)el.style.setProperty('--size',(8+Math.random()*8)+'px');
  el.style.animationDelay=(Math.random()*.35)+'s';
  layer.appendChild(el);
  setTimeout(()=>el.remove(),4200);
 }
}

function applyTheme(){document.documentElement.dataset.theme=prefs.theme;E.theme.textContent=prefs.theme==='dark'?'☀️':'🌙';E.sound.textContent=prefs.sound?'🔊':'🔇'}
function maxDigits(){return String(game.range.max).length}
function numberCells(str,masked=false){const len=maxDigits(),cells=[];for(let i=0;i<len;i++){const has=i<str.length;cells.push(`<div class="num-cell ${has?'':'empty'}">${has?(masked?'•':str[i]):'_'}</div>`)}return `<div class="number-display">${cells.join('')}</div>`}
function keypad(){const len=maxDigits();return `<div class="keypad">${[0,1,2,3,4,5,6,7,8,9].map(n=>`<button class="key" data-digit="${n}" ${input.length>=len?'disabled':''}>${n}</button>`).join('')}<button class="key action" data-back>⌫</button><button class="key action" data-clear>Clear</button></div>`}

function tier(dist,range){const span=(range.max-range.min)||1,pct=dist/span;if(pct<=0.05)return 'blaze';if(pct<=0.15)return 'hot';if(pct<=0.35)return 'warm';if(pct<=0.6)return 'cold';return 'freeze'}
function tierMeta(t){return {blaze:{icon:'🔥🔥🔥',label:'PANAS MEMBARA',cls:'blaze'},hot:{icon:'🔥🔥',label:'PANAS',cls:'hot'},warm:{icon:'🔥',label:'HANGAT',cls:'warm'},cold:{icon:'🧊',label:'DINGIN',cls:'cold'},freeze:{icon:'🧊🧊🧊',label:'BEKU',cls:'freeze'}}[t]}
function pickTaunt(t){const arr=TAUNTS[t];return arr[Math.floor(Math.random()*arr.length)]}

function avatarPicker(idx){return `<div class="avatar-row">${AVATARS.map(a=>`<button class="avatar-btn ${prefs.avatars[idx]===a?'active':''}" data-avatar="${idx}:${a}">${a}</button>`).join('')}</div>`}

function home(){
 return `<section class="hero">
  <div class="panel hero-main">
   <div class="eyebrow">NUMBER DUEL • V2</div>
   <div class="hero-title">1 angka.<br>1 lawan.<br>Makin panas.</div>
   <p class="hero-copy">Sekarang ada indikator panas-dingin, kartu spesial kucing, mode Best of 3, dan efek kemenangan yang meriah. Tebak angka rahasia lawan sebelum angkamu ketahuan!</p>
   <div class="button-row"><button class="primary-btn big" id="setupBtn">🔢 Mulai Duel</button></div>
   <div class="note">Satu game selalu memberi kedua pemain jumlah kesempatan yang sama. Kalau keduanya menebak tepat pada round yang sama, hasilnya seri.</div>
  </div>
  <div class="panel">
   <div class="eyebrow">FITUR BARU DI V2</div>
   <div class="rule-grid">
    <div class="rule"><b>🔥🧊 Panas-Dingin</b><span>Tiap tebakan kasih indikator seberapa deket, bukan cuma arah.</span></div>
    <div class="rule"><b>🐾 Kartu Spesial</b><span>Endus paritas & radar rentang bantu strategi, sekali pakai per game.</span></div>
    <div class="rule"><b>🏆 Best of 3</b><span>Mau lebih seru? Main 3 game, menang duluan yang nentuin juara.</span></div>
    <div class="rule"><b>🎉 Confetti & SFX</b><span>Animasi & suara meriah tiap kali ada yang menang.</span></div>
   </div>
  </div>
 </section>`;
}

function setup(){
 const p=prefs;
 return `<section class="panel">
  <div class="eyebrow">SETUP</div>
  <h2>Siapa yang duel?</h2>
  <div class="setup-grid">
   <label class="field">Player A<input id="nameA" maxlength="24" value="${esc(p.names[0])}"></label>
   <label class="field">Player B<input id="nameB" maxlength="24" value="${esc(p.names[1])}"></label>
  </div>
  <div class="eyebrow">PILIH AVATAR</div>
  <div class="avatar-grid">
   <div class="avatar-col"><span class="avatar-label">${esc(p.names[0])}</span>${avatarPicker(0)}</div>
   <div class="avatar-col"><span class="avatar-label">${esc(p.names[1])}</span>${avatarPicker(1)}</div>
  </div>
  <div class="eyebrow">RENTANG ANGKA</div>
  <div class="preset-row">${PRESETS.map((pr,i)=>`<button class="preset-btn ${p.presetIdx===i?'active':''}" data-preset="${i}">${pr.label}</button>`).join('')}<button class="preset-btn ${p.presetIdx===-1?'active':''}" data-preset="-1">Custom</button></div>
  ${p.presetIdx===-1?`<div class="custom-range"><label class="field">Min<input id="customMin" type="number" value="${p.customMin}"></label><label class="field">Max<input id="customMax" type="number" value="${p.customMax}"></label></div>`:''}
  <div class="eyebrow">MODE PERTANDINGAN</div>
  <div class="preset-row">${MATCH_MODES.map(m=>`<button class="preset-btn ${p.matchMode===m.id?'active':''}" data-match="${m.id}">${m.label}</button>`).join('')}</div>
  <div class="note">${MATCH_MODES.find(m=>m.id===p.matchMode).desc}</div>
  <label class="toggle-row"><input type="checkbox" id="speedToggle" ${p.speedMode?'checked':''}><span>⚡ Mode Kilat — 20 detik per tebakan (opsional, cuma bikin deg-degan, gak ada hukuman kalau telat)</span></label>
  <div class="button-row"><button class="primary-btn big" id="beginBtn">🎲 Kunci Angka</button><button class="secondary-btn" id="cancelBtn">Batal</button></div>
 </section>`;
}

function passSecret(){
 const who=game.secretIndex;
 return `<section class="panel"><div class="pass-screen"><div class="big-emoji">${game.avatars[who]}🔒</div><div class="eyebrow">RAHASIA</div><div class="player-name">${esc(game.names[who])}</div><p class="hero-copy">Pastikan hanya ${esc(game.names[who])} yang melihat layar.</p><button class="primary-btn big" id="enterSecretBtn">Saya ${esc(game.names[who])} → masukkan angka</button></div></section>`;
}
function secretEntry(){
 const r=game.range;
 return `<section class="panel"><div class="secret-screen"><div class="eyebrow">BUAT ANGKA RAHASIA</div><div class="player-name">${game.avatars[game.secretIndex]} ${esc(game.names[game.secretIndex])}</div><p class="hero-copy">Pilih 1 angka rahasia antara ${r.min}–${r.max}.</p>${numberCells(input,true)}${keypad()}<div class="button-row"><button class="primary-btn big" id="lockSecretBtn" ${validSecretInput()?'':'disabled'}>🔒 LOCK ANGKA</button></div></div></section>`;
}
function validSecretInput(){if(!input.length)return false;const n=Number(input),r=game.range;if(n<r.min||n>r.max)return false;if(game.secretIndex===1&&game.secrets[0]===n)return false;return true}

function passTurn(){
 const a=game.turn;
 return `<section class="panel"><div class="pass-screen">${matchScorePips()}<div class="big-emoji">${game.avatars[a]}📱</div><div class="round-pill">GAME ${game.gameNumber} • ROUND ${game.round}</div><div class="player-name">Giliran ${esc(game.names[a])}</div><p class="hero-copy">Berikan device ke ${esc(game.names[a])}. Jangan biarkan lawan melihat history tebakan.</p><button class="primary-btn big" id="openTurnBtn">Saya ${esc(game.names[a])} → mulai menebak</button></div></section>`;
}

function matchScorePips(){
 if(game.matchMode!=='bo3')return '';
 return `<div class="match-pips"><span class="pip-label">GAME ${game.gameNumber} • SKOR MATCH</span><div class="pip-row"><span class="pip">${game.avatars[0]} ${esc(game.names[0])}: ${game.matchScore[0]}</span><span class="pip">${game.avatars[1]} ${esc(game.names[1])}: ${game.matchScore[1]}</span></div></div>`;
}

function rangeHint(player){const hist=game.history[player],r=game.range;let lo=r.min,hi=r.max;for(const h of hist){if(h.result==='higher')lo=Math.max(lo,h.guess+1);if(h.result==='lower')hi=Math.min(hi,h.guess-1)}return `<div class="range-hint">Kemungkinan angka lawan (dari tebakanmu sendiri): <b>${lo} – ${hi}</b></div>`}

function revealedChips(player){
 const r=game.revealed[player],chips=[];
 if(r.parity)chips.push(`<span class="info-chip">🐾 Angka lawan: <b>${r.parity==='even'?'GENAP':'GANJIL'}</b></span>`);
 if(r.half)chips.push(`<span class="info-chip">🌡️ Ada di separuh: <b>${r.half==='upper'?'ATAS':'BAWAH'}</b></span>`);
 return chips.length?`<div class="chip-row">${chips.join('')}</div>`:'';
}
function powerButtons(player){
 const used=game.powerUsed[player];
 return `<div class="power-row"><button class="power-btn ${used.parity?'used':''}" data-power="parity" ${used.parity?'disabled':''}>🐾 Endus Paritas</button><button class="power-btn ${used.half?'used':''}" data-power="half" ${used.half?'disabled':''}>🌡️ Radar Rentang</button></div>${revealedChips(player)}`;
}

function historyMarkup(player){
 const hist=[...game.history[player]].reverse();
 if(!hist.length)return `<div class="note">Belum ada attempt.</div>`;
 return `<div class="history">${hist.map(h=>{
  const tinfo=h.tier?tierMeta(h.tier):null;
  return `<div class="history-row"><div class="history-num">${h.guess}</div><span class="badge ${h.result}">${h.result==='exact'?'🎯 TEPAT':h.result==='higher'?'🔼 Lebih tinggi':'🔽 Lebih rendah'}</span>${tinfo?`<span class="tier-chip ${tinfo.cls}">${tinfo.icon}</span>`:''}<div class="history-meta">Round ${h.round}</div></div>`;
 }).join('')}</div>`;
}

function turnScreen(){
 const a=game.turn,b=1-a,r=game.range;
 return `<section class="panel"><div class="turn-screen">${matchScorePips()}<div class="round-pill">ROUND ${game.round} • ${game.avatars[a]} ${esc(game.names[a])} menebak ${esc(game.names[b])} ${game.avatars[b]}</div><div class="score-grid"><div class="score-card active"><b>${game.avatars[a]} ${esc(game.names[a])}</b><span>${game.history[a].length} attempts</span></div><div class="score-card"><b>${game.avatars[b]} ${esc(game.names[b])}</b><span>${game.history[b].length} attempts</span></div></div><div class="range-row"><span class="range-chip">Rentang: ${r.min} – ${r.max}</span>${prefs.speedMode?`<span class="range-chip timer-chip" id="timerChip">⏱️ 20</span>`:''}</div>${powerButtons(a)}<div class="known-label">TEBAKAN SEKARANG</div>${numberCells(input)}${keypad()}<div class="button-row"><button class="primary-btn big" id="guessBtn" ${validGuessInput()?'':'disabled'}>ENTER GUESS</button></div>${rangeHint(a)}<div class="history-wrap"><div class="history-title"><b>History ${esc(game.names[a])}</b><span class="eyebrow">PRIVAT</span></div>${historyMarkup(a)}</div></div></section>`;
}
function validGuessInput(){if(!input.length)return false;const n=Number(input),r=game.range;return n>=r.min&&n<=r.max}
function evaluate(guess,secret){if(guess===secret)return{result:'exact'};return{result:guess<secret?'higher':'lower'}}

function feedbackScreen(){
 const f=game.lastFeedback,a=f.player,b=1-a;
 const label=f.result==='exact'?'🎯 TEPAT!':f.result==='higher'?'🔼 LEBIH TINGGI':'🔽 LEBIH RENDAH';
 const tinfo=f.result==='exact'?null:tierMeta(f.tier);
 const nextLabel=(game.phaseAfterFeedback==='final'||game.phaseAfterFeedback==='matchFinal')?'🏆 Lihat Hasil':(game.phaseAfterFeedback==='gameResult'?'📋 Lihat Hasil Game':'📱 Pass Device');
 return `<section class="panel"><div class="result-screen">${matchScorePips()}<div class="round-pill">ROUND ${f.round}</div><div class="eyebrow">TEBAKAN ${esc(game.names[a])}: ${f.guess}</div><div class="big-result ${f.result}">${label}</div>${tinfo?`<div class="tier-gauge ${tinfo.cls}">${tinfo.icon} ${tinfo.label}</div><p class="taunt">${esc(f.taunt)}</p>`:''}${f.result==='exact'?`<h2>🔓 KETEBAK!</h2><p class="hero-copy">${game.pendingTieCheck?`${esc(game.names[b])} tetap mendapat kesempatan pada round yang sama.`:'Tunggu hasil akhir game.'}</p>`:`<p class="hero-copy">Angka lawan ${f.result==='higher'?'lebih tinggi':'lebih rendah'} dari ${f.guess}. Coba lagi giliran berikutnya.</p>`}<button class="primary-btn big" id="continueBtn">${nextLabel}</button></div></section>`;
}

function gameResult(){
 const w=game.winner;
 const title=w==='draw'?'🤝 SERI di game ini!':`${game.avatars[w]} ${esc(game.names[w])} menang Game ${game.gameNumber}!`;
 return `<section class="panel"><div class="result-screen"><div class="eyebrow">HASIL GAME ${game.gameNumber}</div><div class="win-title mini">${title}</div><div class="match-pips"><span class="pip-label">SKOR MATCH</span><div class="pip-row"><span class="pip">${game.avatars[0]} ${esc(game.names[0])}: ${game.matchScore[0]}</span><span class="pip">${game.avatars[1]} ${esc(game.names[1])}: ${game.matchScore[1]}</span></div></div><div class="secret-reveal">${[0,1].map(i=>`<div class="secret-card"><b>${game.avatars[i]} ${esc(game.names[i])}</b><div class="num-big">${game.secrets[i]}</div><span class="eyebrow">ANGKA RAHASIA</span></div>`).join('')}</div><div class="button-row"><button class="primary-btn big" id="nextGameBtn">▶️ Lanjut ke Game ${game.gameNumber+1}</button></div></div></section>`;
}

function computeBadges(){
 const badges=[],isMatch=game.matchMode==='bo3',w=isMatch?game.matchWinner:game.winner;
 if(w!=='draw'&&w!=null){
  const attempts=game.history[w].length;
  if(attempts<=3)badges.push('⚡ Tebakan Kilat');
  const usedPower=game.powerUsed[w].parity||game.powerUsed[w].half;
  if(!usedPower)badges.push(isMatch?'🎯 Solo Otak (game penentu)':'🎯 Solo Otak');
  if(isMatch&&game.gamesLog&&game.gamesLog[0]===(1-w))badges.push('🔄 Comeback Sultan');
 }else if(w==='draw'){
  badges.push('🤝 Duel Sengit');
 }
 return badges;
}

function finalScreen(){
 const isMatch=game.matchMode==='bo3',w=isMatch?game.matchWinner:game.winner;
 const title=w==='draw'?'🤝 SERI!':`${game.avatars[w]} ${esc(game.names[w])} MENANG${isMatch?' MATCH':''}!`;
 const sub=isMatch
  ?(w==='draw'?`Match berakhir seri setelah ${game.gameNumber} game.`:`${esc(game.names[w])} jadi juara dengan skor ${game.matchScore[0]}-${game.matchScore[1]}.`)
  :(w==='draw'?`Keduanya menebak tepat pada Round ${game.round}.`:`${esc(game.names[w])} menebak tepat lebih dulu dalam round yang seimbang.`);
 const badges=computeBadges();
 return `<section class="panel"><div class="result-screen"><div class="eyebrow">${isMatch?'FINAL MATCH':'FINAL RESULT'}</div><div class="win-title">${title}</div><p class="hero-copy">${sub}</p>${badges.length?`<div class="badge-row">${badges.map(b=>`<span class="achievement">${b}</span>`).join('')}</div>`:''}<div class="secret-reveal">${[0,1].map(i=>`<div class="secret-card"><b>${game.avatars[i]} ${esc(game.names[i])}</b><div class="num-big">${game.secrets[i]}</div><span class="eyebrow">ANGKA RAHASIA</span></div>`).join('')}</div><div class="button-row"><button class="primary-btn big" id="rematchBtn">🔁 Rematch</button><button class="secondary-btn" id="homeBtn">🏠 Beranda</button></div></div></section>`;
}

function newGameState({names,avatars,range,matchMode,matchScore=[0,0],gameNumber=1,gamesLog=[]}){
 return {
  phase:'passSecret',names,avatars,range,matchMode,
  secrets:[null,null],secretIndex:0,history:[[],[]],
  turn:0,round:1,solvedRound:[null,null],winner:null,
  matchScore,gameNumber,gamesLog,
  powerUsed:[{parity:false,half:false},{parity:false,half:false}],
  revealed:[{parity:null,half:null},{parity:null,half:null}],
  pendingTieCheck:false,phaseAfterFeedback:null,lastFeedback:null,matchWinner:null
 };
}

function clearTurnTimer(){if(turnTimerHandle){clearInterval(turnTimerHandle);turnTimerHandle=null}}
function startTurnTimer(){
 turnTimerVal=20;
 const chip=$('#timerChip');if(chip)chip.textContent=`⏱️ ${turnTimerVal}`;
 turnTimerHandle=setInterval(()=>{
  turnTimerVal--;
  const c=$('#timerChip');
  if(!c){clearInterval(turnTimerHandle);turnTimerHandle=null;return}
  if(turnTimerVal>0){c.textContent=`⏱️ ${turnTimerVal}`}else{c.textContent='⏰ Waktu habis!'}
  c.classList.toggle('urgent',turnTimerVal<=5);
  if(turnTimerVal<=0){clearInterval(turnTimerHandle);turnTimerHandle=null;beep(220,.15,'sawtooth')}
  else if(turnTimerVal<=5){beep(880,.04)}
 },1000);
}

function render(){
 clearTurnTimer();
 E.app.innerHTML=!game?home()
  :game.phase==='setup'?setup()
  :game.phase==='passSecret'?passSecret()
  :game.phase==='secret'?secretEntry()
  :game.phase==='passTurn'?passTurn()
  :game.phase==='turn'?turnScreen()
  :game.phase==='feedback'?feedbackScreen()
  :game.phase==='gameResult'?gameResult()
  :finalScreen();
 bind();
 if(game&&game.phase==='turn'&&prefs.speedMode)startTurnTimer();
}

function bind(){
 $('#setupBtn')?.addEventListener('click',()=>{game={phase:'setup'};render()});
 $('#cancelBtn')?.addEventListener('click',()=>{game=null;render()});
 document.querySelectorAll('[data-preset]').forEach(btn=>btn.onclick=()=>{prefs.presetIdx=Number(btn.dataset.preset);savePrefs();render()});
 document.querySelectorAll('[data-match]').forEach(btn=>btn.onclick=()=>{prefs.matchMode=btn.dataset.match;savePrefs();render()});
 document.querySelectorAll('[data-avatar]').forEach(btn=>btn.onclick=()=>{
  const [idxStr,emoji]=btn.dataset.avatar.split(':'),idx=Number(idxStr),other=1-idx;
  if(prefs.avatars[other]===emoji){toast('Avatar itu udah dipakai lawan 😼');return}
  prefs.avatars[idx]=emoji;savePrefs();render();
 });
 $('#speedToggle')?.addEventListener('change',()=>{prefs.speedMode=$('#speedToggle').checked;savePrefs()});
 $('#customMin')?.addEventListener('change',()=>{prefs.customMin=Number($('#customMin').value)||1;savePrefs()});
 $('#customMax')?.addEventListener('change',()=>{prefs.customMax=Number($('#customMax').value)||100;savePrefs()});
 $('#beginBtn')?.addEventListener('click',()=>{
  let a=$('#nameA').value.trim()||'Player A',b=$('#nameB').value.trim()||'Player B';
  prefs.names=[a,b];
  let range;
  if(prefs.presetIdx===-1){let mn=Number($('#customMin')?.value)||1,mx=Number($('#customMax')?.value)||100;if(mn>=mx){mn=1;mx=100}range={min:mn,max:mx}}
  else{const pr=PRESETS[prefs.presetIdx];range={min:pr.min,max:pr.max}}
  savePrefs();
  game=newGameState({names:[a,b],avatars:[...prefs.avatars],range,matchMode:prefs.matchMode});
  input='';render();
 });
 $('#enterSecretBtn')?.addEventListener('click',()=>{input='';game.phase='secret';render()});
 document.querySelectorAll('[data-digit]').forEach(btn=>btn.onclick=()=>{const len=maxDigits();if(input.length<len){input+=btn.dataset.digit;beep(560,.03);render()}});
 document.querySelector('[data-back]')?.addEventListener('click',()=>{input=input.slice(0,-1);render()});
 document.querySelector('[data-clear]')?.addEventListener('click',()=>{input='';render()});
 $('#lockSecretBtn')?.addEventListener('click',()=>{
  if(!validSecretInput())return;
  game.secrets[game.secretIndex]=Number(input);input='';
  if(game.secretIndex===0){game.secretIndex=1;game.phase='passSecret'}else{game.phase='passTurn';game.turn=0}
  beep(760,.07);render();
 });
 $('#openTurnBtn')?.addEventListener('click',()=>{input='';game.phase='turn';render()});
 document.querySelectorAll('[data-power]').forEach(btn=>btn.onclick=()=>{
  const type=btn.dataset.power,a=game.turn,b=1-a;
  if(game.powerUsed[a][type])return;
  game.powerUsed[a][type]=true;
  if(type==='parity')game.revealed[a].parity=game.secrets[b]%2===0?'even':'odd';
  else{const mid=(game.range.min+game.range.max)/2;game.revealed[a].half=game.secrets[b]>=mid?'upper':'lower'}
  beep(680,.05,'square');
  toast(type==='parity'?'🐾 Info paritas terungkap!':'🌡️ Info separuh rentang terungkap!');
  render();
 });
 $('#guessBtn')?.addEventListener('click',()=>{
  if(!validGuessInput())return;
  const a=game.turn,b=1-a,guessNum=Number(input),secret=game.secrets[b],r=evaluate(guessNum,secret);
  const dist=Math.abs(guessNum-secret),t=r.result==='exact'?null:tier(dist,game.range);
  const rec={guess:guessNum,result:r.result,round:game.round,tier:t};
  game.history[a].push(rec);
  if(r.result==='exact')game.solvedRound[a]=game.round;
  game.lastFeedback={...rec,player:a,taunt:r.result==='exact'?'':pickTaunt(t)};
  input='';
  if(a===0){
   game.pendingTieCheck=r.result==='exact';
   game.turn=1;game.phaseAfterFeedback='passTurn';
  }else{
   const aSolved=game.solvedRound[0]===game.round,bSolved=game.solvedRound[1]===game.round;
   if(aSolved||bSolved){
    game.winner=aSolved&&bSolved?'draw':(aSolved?0:1);
    if(game.matchMode==='bo3'){
     game.gamesLog.push(game.winner);
     if(game.winner!=='draw')game.matchScore[game.winner]++;
     if(game.matchScore[0]>=2||game.matchScore[1]>=2||game.gameNumber>=5){
      game.matchWinner=game.matchScore[0]===game.matchScore[1]?'draw':(game.matchScore[0]>game.matchScore[1]?0:1);
      game.phaseAfterFeedback='matchFinal';
     }else{game.phaseAfterFeedback='gameResult'}
    }else{game.phaseAfterFeedback='final'}
   }else{game.round++;game.turn=0;game.phaseAfterFeedback='passTurn'}
   game.pendingTieCheck=false;
  }
  game.phase='feedback';
  if(r.result==='exact'){fanfare();confettiBurst(36)}else{tierBeep(t)}
  render();
 });
 $('#continueBtn')?.addEventListener('click',()=>{
  game.phase=game.phaseAfterFeedback;
  if(game.phase==='final'||game.phase==='matchFinal'){
   const w=game.phase==='matchFinal'?game.matchWinner:game.winner;
   if(w!=='draw'){confettiBurst(90,true);fanfare()}
  }
  render();
 });
 $('#nextGameBtn')?.addEventListener('click',()=>{
  game=newGameState({names:game.names,avatars:game.avatars,range:game.range,matchMode:game.matchMode,matchScore:game.matchScore,gameNumber:game.gameNumber+1,gamesLog:game.gamesLog});
  input='';render();
 });
 $('#rematchBtn')?.addEventListener('click',()=>{
  game=newGameState({names:[...game.names],avatars:[...game.avatars],range:game.range,matchMode:game.matchMode});
  input='';render();
 });
 $('#homeBtn')?.addEventListener('click',()=>{game=null;render()});
}

E.theme.onclick=()=>{prefs.theme=prefs.theme==='dark'?'light':'dark';savePrefs();applyTheme()};
E.sound.onclick=()=>{prefs.sound=!prefs.sound;savePrefs();applyTheme();beep(700,.04)};

let resetArmed=false,resetArmTimer=null;
const resetLabelDefault=E.reset.textContent;
E.reset.onclick=()=>{
 if(!game){game=null;input='';render();return}
 if(!resetArmed){
  resetArmed=true;
  E.reset.textContent='⚠️ Yakin? Tap lagi';
  E.reset.classList.add('danger-btn');
  clearTimeout(resetArmTimer);
  resetArmTimer=setTimeout(()=>{resetArmed=false;E.reset.textContent=resetLabelDefault;E.reset.classList.remove('danger-btn')},3000);
  return;
 }
 clearTimeout(resetArmTimer);
 resetArmed=false;
 E.reset.textContent=resetLabelDefault;
 E.reset.classList.remove('danger-btn');
 game=null;input='';render();
};

prefs=loadPrefs();
applyTheme();render();
