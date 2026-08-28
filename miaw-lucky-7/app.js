/* ============================================================
   LUCKY 7 CAT — app.js
   Cara menambah special card baru: lihat README.md bagian
   "Cara Membuat Special Card Baru". Ada 3 titik EXTENSION POINT
   yang ditandai di file ini (cari komentar "EXTENSION POINT").
   ============================================================ */

const STORAGE='lucky7cat-v1', $=s=>document.querySelector(s);
const E={app:$('#app'),theme:$('#themeBtn'),sound:$('#soundBtn'),reset:$('#resetBtn'),toast:$('#toast')};
let prefs=loadPrefs(), game=null, audio=null;

function loadPrefs(){try{return {...{theme:'light',sound:true,names:['Oyen','Mochi'],targetScore:100},...JSON.parse(localStorage.getItem(STORAGE)||'{}')}}catch{return{theme:'light',sound:true,names:['Oyen','Mochi'],targetScore:100}}}
function savePrefs(){localStorage.setItem(STORAGE,JSON.stringify(prefs))}
function esc(v=''){return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function toast(m){E.toast.textContent=m;E.toast.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>E.toast.classList.remove('show'),1600)}
function beep(f=650,d=.06){if(!prefs.sound)return;try{audio||=new(window.AudioContext||window.webkitAudioContext)();const o=audio.createOscillator(),g=audio.createGain();o.frequency.value=f;g.gain.setValueAtTime(.05,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+d);o.connect(g).connect(audio.destination);o.start();o.stop(audio.currentTime+d)}catch{}}
function chord(freqs,d=.09){if(!prefs.sound)return;freqs.forEach((f,i)=>setTimeout(()=>beep(f,d),i*70))}
function applyTheme(){document.documentElement.dataset.theme=prefs.theme;E.theme.textContent=prefs.theme==='dark'?'☀️':'🌙';E.sound.textContent=prefs.sound?'🔊':'🔇'}

/* ============================================================
   EXTENSION POINT 1 — CARD_INFO
   Tempat menyimpan nama, emoji dan deskripsi setiap kartu.
   Tambahkan entri baru di sini kalau bikin kartu baru.
   ============================================================ */
const ACTION_INFO={
  freeze:{emoji:'😴',label:'TIDUR KUCING',desc:'Target langsung Pass paksa & mengunci skornya ronde ini.'},
  flipThree:{emoji:'🐾',label:'CAKAR BERTUBI',desc:'Target wajib menarik 3 kartu berturut-turut.'},
  secondChance:{emoji:'👑',label:'NYAWA KESEMBILAN',desc:'Disimpan. Kalau nanti dapat kartu dobel, buang kartu ini supaya tetap hidup.'},
  kucingHitam:{emoji:'🐈‍⬛',label:'KUCING HITAM',desc:'Buang 1 kartu angka pilihan dari tableau target (tidak bikin bust).'},
  benangKusut:{emoji:'🧶',label:'BENANG KUSUT',desc:'Tukar total skor ronde kamu saat ini dengan target.'},
  curiIkan:{emoji:'🐟',label:'CURI IKAN',desc:'Curi 1 kartu angka pilihan dari tableau target ke tableau kamu.'},
  kotakMisteri:{emoji:'📦',label:'KOTAK MISTERI',desc:'Efek acak kecil: bonus poin, buang kartu acak, atau intip deck.'},
  radarTikus:{emoji:'🐭',label:'RADAR TIKUS',desc:'Intip diam-diam 3 kartu teratas deck.'}
};
function cardInfo(card){
  if(card.kind==='number')return{emoji:'🔢',label:String(card.value),desc:'Kartu angka.'};
  if(card.kind==='modFixed')return card.x2?{emoji:'✖️',label:'GANDA KEBERUNTUNGAN (x2)',desc:'Kalikan 2 total angka kamu ronde ini.'}:{emoji:'➕',label:'+'+card.value,desc:'Tambah '+card.value+' poin ke skormu ronde ini.'};
  if(card.kind==='modGift')return{emoji:card.value<0?'🐾':card.value>=25?'🍀':'🐟',label:(card.value>0?'+':'')+card.value,desc:'Pilih siapa yang menerima efek ini: dirimu sendiri atau pemain lain.'};
  if(card.kind==='action')return ACTION_INFO[card.type];
  return{emoji:'❓',label:'?',desc:''};
}

/* ============================================================
   EXTENSION POINT 2 — buildDeck()
   Tempat menentukan berapa banyak kopi tiap kartu di deck.
   ============================================================ */
function buildDeck(){
  const d=[];
  for(let v=0;v<=12;v++){const count=v===0?1:v;for(let i=0;i<count;i++)d.push({kind:'number',value:v})}
  [2,4,6,8,10].forEach(v=>d.push({kind:'modFixed',value:v}));
  d.push({kind:'modFixed',x2:true});
  [-10,-10,15,15,25].forEach(v=>d.push({kind:'modGift',value:v}));
  const actions=[['freeze',3],['flipThree',3],['secondChance',3],['kucingHitam',2],['benangKusut',2],['curiIkan',2],['kotakMisteri',2],['radarTikus',2]];
  actions.forEach(([type,count])=>{for(let i=0;i<count;i++)d.push({kind:'action',type})});
  return shuffle(d);
}
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function drawCard(){if(game.deck.length===0){game.deck=shuffle(game.discard);game.discard=[];pushLog('🔄 Deck habis, kartu buangan dikocok ulang.')}return game.deck.pop()}

function pushLog(msg){game.log.unshift(msg);game.log=game.log.slice(0,6)}
function calcRoundScore(p){if(p.status==='busted')return 0;let base=p.tableau.reduce((a,b)=>a+b,0);if(p.x2)base*=2;return Math.max(0,base+p.modifierSum+(p.luckyWon?50:0))}
function newPlayerRoundState(p){p.tableau=[];p.modifierSum=0;p.x2=false;p.secondChance=false;p.status='active';p.luckyWon=false}
function activePlayers(){return game.players.filter(p=>p.status==='active')}
function eligibleTurnTargets(excludeIdx){return game.players.map((p,i)=>i).filter(i=>i!==excludeIdx&&game.players[i].status==='active')}

/* ---------- SCREENS ---------- */
function home(){return `<section class="hero"><div class="panel hero-main"><div class="eyebrow">PUSH YOUR LUCK</div><div class="hero-title">Tarik terus,<br>atau berhenti?</div><p class="hero-copy">Kumpulkan kartu angka 0-12 tanpa dobel. Ambil kartu terus buat skor makin tinggi, tapi kena angka yang sama = bust, skor ronde jadi 0. Ada juga kartu spesial yang bisa disabotasekan ke lawan!</p><div class="button-row"><button class="primary-btn big" id="setupBtn">🐾 Mulai Main</button></div><div class="note">Target skor bebas kamu tentukan sendiri di layar setup. Siapa lebih dulu capai target, dialah juara.</div></div><div class="panel"><div class="eyebrow">ATURAN SINGKAT</div><div class="rule-grid"><div class="rule"><b>Ambil / Pass</b><span>Ambil kartu terus, atau kunci skor sekarang dengan Pass.</span></div><div class="rule"><b>Kartu dobel = Bust</b><span>Dapat angka yang sama dua kali → skor ronde jadi 0.</span></div><div class="rule"><b>LUCKY 7!</b><span>7 kartu angka unik → ronde langsung selesai, bonus +50.</span></div><div class="rule"><b>Kartu spesial</b><span>Beberapa bisa kamu arahkan ke diri sendiri atau lawan.</span></div></div></div></section>`}

function setupScreen(){const names=prefs.names;return `<section class="panel"><div class="eyebrow">SETUP</div><h2>Siapa yang main?</h2><div class="player-list">${names.map((n,i)=>`<div class="player-row"><input data-pname="${i}" maxlength="20" value="${esc(n)}" placeholder="Nama pemain ${i+1}"><button class="icon-btn" data-removeplayer="${i}" ${names.length<=2?'disabled':''}>✕</button></div>`).join('')}</div><div class="button-row"><button class="secondary-btn" id="addPlayerBtn" ${names.length>=8?'disabled':''}>+ Tambah Pemain</button></div><label class="field">Target Skor Menang (custom)<input id="targetScoreInput" type="number" min="10" step="5" value="${prefs.targetScore}"></label><div class="button-row"><button class="primary-btn big" id="beginBtn" ${names.length<2?'disabled':''}>🎲 Mulai Permainan</button><button class="secondary-btn" id="cancelBtn">Batal</button></div></section>`}

function scoreboardMarkup(highlightIdx){return `<div class="scoreboard">${game.players.map((p,i)=>`<div class="score-row ${i===highlightIdx?'me':''}"><div class="p-name">${esc(p.name)} <span class="status-badge ${p.status}">${p.status==='active'?'Aktif':p.status==='stayed'?'Pass':p.status==='frozen'?'Beku':'Bust'}</span>${p.secondChance?'<span class="icon-chip">👑 Nyawa</span>':''}</div><div class="p-total">Total: ${p.total}</div><div class="p-round">${calcRoundScore(p)}</div></div>`).join('')}</div>`}

function tableauChips(p){if(!p.tableau.length)return `<div class="note">Belum ada kartu angka.</div>`;return `<div class="chip-row">${p.tableau.map(v=>`<div class="num-chip">${v}</div>`).join('')}${p.x2?'<div class="icon-chip">✖️2</div>':''}${p.modifierSum?`<div class="icon-chip">${p.modifierSum>0?'+':''}${p.modifierSum}</div>`:''}</div>`}

function turnScreen(){const i=game.currentIndex,p=game.players[i];return `<section class="panel"><div class="turn-screen"><div class="round-pill">RONDE ${game.round} • Target ${game.targetScore}</div><div class="player-name" style="font-size:clamp(22px,6vw,36px)">${esc(p.name)}</div>${scoreboardMarkup(i)}<div class="known-label">TABLEAU ${esc(p.name).toUpperCase()}</div><div class="tableau-wrap">${tableauChips(p)}</div><div class="round-total">${calcRoundScore(p)} pts</div>${game.log.length?`<div class="log-feed">${game.log.map(l=>`<div class="log-item">${l}</div>`).join('')}</div>`:''}<div class="button-row"><button class="primary-btn big" id="ambilBtn">🃏 Ambil Kartu</button><button class="secondary-btn big" id="passBtn">✋ Pass</button></div></div></section>`}

function pickTargetScreen(){const pa=game.pendingAction,info=pa.type==='number'?null:cardInfo(pa.card);const targets=pa.targets;return `<section class="panel"><div class="pick-screen"><div class="effect-banner"><div class="effect-emoji">${info.emoji}</div><div class="effect-title">${info.label}</div><div class="effect-desc">${info.desc}</div></div><div class="eyebrow">${esc(game.players[pa.drawerIdx].name)}, pilih target</div><div class="target-grid">${targets.map(idx=>`<button class="target-btn" data-target="${idx}"><span>${esc(game.players[idx].name)} ${idx===pa.drawerIdx?'(Diri sendiri)':''}</span><span class="sub">Skor ronde: ${calcRoundScore(game.players[idx])}</span></button>`).join('')}</div></div></section>`}

function pickCardScreen(){const pa=game.pendingAction,info=cardInfo(pa.card),target=game.players[pa.targetIdx];return `<section class="panel"><div class="pick-screen"><div class="effect-banner"><div class="effect-emoji">${info.emoji}</div><div class="effect-title">${info.label}</div><div class="effect-desc">Pilih kartu angka milik ${esc(target.name)} yang ${pa.mode==='steal'?'mau dicuri':'mau dibuang'}.</div></div><div class="card-pick-grid">${target.tableau.map((v,ci)=>`<button class="card-pick-btn" data-cardidx="${ci}">${v}</button>`).join('')}</div></div></section>`}

function flipThreeStepScreen(){const idx=game.flipThreeTargetIdx,p=game.players[idx],done=3-game.flipThreeRemaining;return `<section class="panel"><div class="pick-screen"><div class="big-emoji">🐾</div><div class="round-pill">CAKAR BERTUBI • ${esc(p.name)}</div><p class="hero-copy">Kartu ke-${done+1} dari 3.</p>${scoreboardMarkup(idx)}${game.log.length?`<div class="log-feed">${game.log.map(l=>`<div class="log-item">${l}</div>`).join('')}</div>`:''}<button class="primary-btn big" id="forcedDrawBtn">🃏 Tarik Kartu</button></div></section>`}

function peekScreen(){return `<section class="panel"><div class="pick-screen"><div class="big-emoji">🐭</div><div class="eyebrow">RADAR TIKUS (RAHASIA)</div><p class="hero-copy">3 kartu teratas deck sekarang:</p><div class="peek-cards">${game.peekCards.map(c=>{const info=cardInfo(c);return `<div class="num-chip" style="width:70px;height:70px;font-size:16px">${info.emoji}<br>${info.label}</div>`}).join('')}</div><div class="note">Jangan sampai lawan lihat layar ini!</div><button class="primary-btn big" id="closePeekBtn">Tutup</button></div></section>`}

function roundEndScreen(){const winnerIdx=game.players.reduce((best,p,i,arr)=>calcRoundScore(p)>calcRoundScore(arr[best])?i:best,0);return `<section class="panel"><div class="result-screen"><div class="eyebrow">RONDE ${game.round} SELESAI</div>${game.luckyWinnerIdx!=null?`<h2>🍀 LUCKY 7! ${esc(game.players[game.luckyWinnerIdx].name)}</h2>`:''}<div class="summary-table">${game.players.map((p,i)=>`<div class="summary-row ${i===winnerIdx?'winner':''}"><div class="s-name">${esc(p.name)} ${p.status==='busted'?'💥':''}</div><div class="s-round">+${calcRoundScore(p)}</div><div class="s-total">Total: ${p.total+calcRoundScore(p)}</div></div>`).join('')}</div><button class="primary-btn big" id="nextRoundBtn">${game.someoneWon?'🏆 Lihat Juara':'➡️ Ronde Berikutnya'}</button></div></section>`}

function gameEndScreen(){const winnerIdx=game.players.reduce((best,p,i,arr)=>p.total>arr[best].total?i:best,0);return `<section class="panel"><div class="result-screen"><div class="eyebrow">GAME SELESAI</div><div class="win-title">🏆 ${esc(game.players[winnerIdx].name)} MENANG!</div><div class="summary-table">${[...game.players].map((p,i)=>({p,i})).sort((a,b)=>b.p.total-a.p.total).map(({p,i})=>`<div class="summary-row ${i===winnerIdx?'winner':''}"><div class="s-name">${esc(p.name)}</div><div class="s-round">${p.total} pts</div></div>`).join('')}</div><div class="button-row"><button class="primary-btn big" id="rematchBtn">🔁 Main Lagi</button><button class="secondary-btn" id="homeBtn">🏠 Beranda</button></div></div></section>`}

function render(){
  E.app.innerHTML=!game?home():game.phase==='setup'?setupScreen():game.phase==='turn'?turnScreen():game.phase==='pickTarget'?pickTargetScreen():game.phase==='pickCard'?pickCardScreen():game.phase==='flipThreeStep'?flipThreeStepScreen():game.phase==='peek'?peekScreen():game.phase==='roundEnd'?roundEndScreen():gameEndScreen();
  bind();
}

/* ---------- GAME FLOW ---------- */
function startGame(names,targetScore){
  game={phase:'turn',round:1,targetScore,currentIndex:0,deck:buildDeck(),discard:[],log:[],pendingAction:null,flipThreeRemaining:0,flipThreeTargetIdx:null,nestedQueue:[],turnBeforeInterrupt:null,luckyTriggered:false,luckyWinnerIdx:null,someoneWon:false,peekCards:null,
    players:names.map(n=>({name:n,total:0,tableau:[],modifierSum:0,x2:false,secondChance:false,status:'active',luckyWon:false}))};
}
function startNewRound(){
  game.round++;game.log=[];game.luckyTriggered=false;game.luckyWinnerIdx=null;
  game.players.forEach(p=>newPlayerRoundState(p));
  game.currentIndex=game.players.findIndex(p=>p.status==='active');
  game.phase='turn';
}
function checkLucky7(idx){const p=game.players[idx];if(p.tableau.length>=7&&!p.luckyWon){p.luckyWon=true;game.luckyTriggered=true;game.luckyWinnerIdx=idx;pushLog(`🍀 <b>${esc(p.name)}</b> LUCKY 7! Bonus +50, ronde selesai.`);beep(1000,.12)}}

function endRoundIfNeeded(){
  const stillActive=activePlayers();
  if(game.luckyTriggered||stillActive.length===0){
    game.players.forEach(p=>{p.total+=calcRoundScore(p)});
    game.someoneWon=game.players.some(p=>p.total>=game.targetScore);
    game.phase='roundEnd';render();return true;
  }
  return false;
}

function advanceToNextActive(fromIdx){
  const n=game.players.length;
  for(let step=1;step<=n;step++){const idx=(fromIdx+step)%n;if(game.players[idx].status==='active'){game.currentIndex=idx;return idx}}
  return null;
}

function moveToNextTurn(){
  if(endRoundIfNeeded())return;
  const next=advanceToNextActive(game.currentIndex);
  if(next===null){endRoundIfNeeded();return}
  game.phase='turn';render();
}

/* Called after any single card is fully resolved (normal draw or forced draw) */
function postResolve(drawerIdx){
  checkLucky7(drawerIdx);
  if(game.luckyTriggered){endRoundIfNeeded();return}
  const p=game.players[drawerIdx];
  if(game.flipThreeRemaining>0){
    // we're in the middle of a forced Flip Three sequence for this same drawer
    if(p.status!=='active'){ // busted mid-sequence -> stop early
      game.flipThreeRemaining=0;
    } else {
      game.flipThreeRemaining--;
    }
    if(game.flipThreeRemaining>0){game.phase='flipThreeStep';render();return}
    // sequence finished (or stopped) -> resolve any nested queued action cards
    if(game.nestedQueue.length){processNestedQueue();return}
    finishForcedSequence();return;
  }
  // normal flow — sesuai aturan asli Flip 7: 1 kartu = 1 giliran.
  // Baik berhasil (masih aktif) maupun bust, giliran WAJIB langsung
  // pindah ke pemain aktif berikutnya (device di-oper), tidak boleh
  // pemain yang sama lanjut ambil kartu lagi tanpa oper giliran dulu.
  moveToNextTurn();
}

function finishForcedSequence(){
  // return control to whoever's real ongoing turn is
  game.flipThreeTargetIdx=null;
  const realIdx=game.turnBeforeInterrupt!=null?game.turnBeforeInterrupt:game.currentIndex;
  game.turnBeforeInterrupt=null;
  game.currentIndex=realIdx;
  // Kartu Cakar Bertubi yang dimainkan TADI adalah kartu (giliran) milik
  // realIdx sendiri — begitu efeknya (termasuk semua kartu tertunda di
  // nestedQueue) selesai, giliran realIdx juga sudah habis. Jangan
  // kembalikan ke layar 'turn' realIdx (itu yang menyebabkan 1 pemain
  // bisa ambil kartu berkali-kali tanpa oper giliran) — langsung lanjut
  // ke pemain aktif berikutnya, sama seperti draw normal.
  moveToNextTurn();
}

function processNestedQueue(){
  if(!game.nestedQueue.length){finishForcedSequence();return}
  const {drawerIdx,card}=game.nestedQueue.shift();
  resolveCard(card,drawerIdx,true);
}

/* ---------- DRAW ACTIONS ---------- */
function performAmbil(){
  const idx=game.currentIndex,card=drawCard();
  resolveCard(card,idx,false);
}
function performForcedDraw(){
  const idx=game.flipThreeTargetIdx,card=drawCard();
  resolveCard(card,idx,false);
}
function performPass(){
  const idx=game.currentIndex;game.players[idx].status='stayed';pushLog(`✋ <b>${esc(game.players[idx].name)}</b> Pass dengan ${calcRoundScore(game.players[idx])} pts.`);beep(700,.08);moveToNextTurn();
}

/* ---------- CARD RESOLUTION ---------- */
/* EXTENSION POINT 3 — resolveCard()
   Tempat menentukan APA yang terjadi saat sebuah kartu ditarik.
   Tambahkan case baru di switch(card.type) untuk action card baru. */
function resolveCard(card,drawerIdx,fromNestedQueue){
  const drawer=game.players[drawerIdx];
  if(card.kind==='number'){
    if(drawer.tableau.includes(card.value)){
      if(drawer.secondChance){
        drawer.secondChance=false;game.discard.push(card);
        pushLog(`👑 <b>${esc(drawer.name)}</b> pakai Nyawa Kesembilan, selamat dari angka ${card.value} dobel!`);beep(850,.09);
      } else {
        drawer.status='busted';game.discard.push(card);
        pushLog(`💥 <b>${esc(drawer.name)}</b> BUST kena angka ${card.value} dobel!`);beep(220,.18);
      }
    } else {
      drawer.tableau.push(card.value);game.discard.push(card);
      pushLog(`🔢 <b>${esc(drawer.name)}</b> ambil kartu <b>${card.value}</b>.`);beep(560,.05);
    }
    postResolve(drawerIdx);return;
  }
  if(card.kind==='modFixed'){
    if(card.x2){drawer.x2=true;pushLog(`✖️ <b>${esc(drawer.name)}</b> dapat GANDA KEBERUNTUNGAN!`)}
    else{drawer.modifierSum+=card.value;pushLog(`➕ <b>${esc(drawer.name)}</b> dapat +${card.value} poin.`)}
    game.discard.push(card);beep(700,.06);postResolve(drawerIdx);return;
  }
  if(card.kind==='modGift'){
    const targets=game.players.map((p,i)=>i).filter(i=>game.players[i].status!=='busted');
    game.discard.push(card);
    openTargetPicker(card,drawerIdx,targets,drawerIdx,fromNestedQueue);return;
  }
  if(card.kind==='action'){
    // Discard the physical card exactly once — only on its FIRST resolution.
    // When a queued nested action is later reprocessed (fromNestedQueue=true)
    // it must NOT be discarded again (it was already discarded when queued).
    if(!fromNestedQueue){game.discard.push(card);}
    // If this action card is drawn as one of the forced draws inside an active
    // Cakar Bertubi (Flip Three) sequence, targetable actions are queued and
    // resolved AFTER the 3 forced draws finish (matches physical Flip 7 rules).
    const queueableDuringFlipThree=['freeze','flipThree','kucingHitam','curiIkan','benangKusut'];
    if(queueableDuringFlipThree.includes(card.type)&&game.flipThreeRemaining>0&&!fromNestedQueue){
      game.nestedQueue.push({drawerIdx,card});
      pushLog(`⏳ Kartu <b>${ACTION_INFO[card.type].label}</b> ditunda sampai Cakar Bertubi selesai.`);
      postResolve(drawerIdx);return;
    }
    switch(card.type){
      case 'freeze': case 'flipThree': {
        const targets=eligibleTurnTargets(-1).length?game.players.map((p,i)=>i).filter(i=>game.players[i].status==='active'):[drawerIdx];
        if(targets.length===1){applyTargetedAction(card,drawerIdx,targets[0],fromNestedQueue);return}
        openTargetPicker(card,drawerIdx,targets,drawerIdx,fromNestedQueue);return;
      }
      case 'secondChance': {
        if(!drawer.secondChance){
          drawer.secondChance=true;pushLog(`👑 <b>${esc(drawer.name)}</b> menyimpan Nyawa Kesembilan.`);beep(780,.08);
          if(fromNestedQueue){processNestedQueue()}else{postResolve(drawerIdx)}return;
        } else {
          const others=game.players.map((p,i)=>i).filter(i=>i!==drawerIdx&&game.players[i].status==='active'&&!game.players[i].secondChance);
          if(!others.length){pushLog(`👑 Nyawa Kesembilan ekstra hangus (tidak ada yang bisa menerima).`);if(fromNestedQueue){processNestedQueue()}else{postResolve(drawerIdx)}return}
          if(others.length===1){game.players[others[0]].secondChance=true;pushLog(`👑 <b>${esc(drawer.name)}</b> memberi Nyawa Kesembilan ke <b>${esc(game.players[others[0]].name)}</b>.`);if(fromNestedQueue){processNestedQueue()}else{postResolve(drawerIdx)}return}
          openTargetPicker(card,drawerIdx,others,drawerIdx,fromNestedQueue);return;
        }
      }
      case 'kucingHitam': {
        const targets=game.players.map((p,i)=>i).filter(i=>game.players[i].status!=='busted'&&game.players[i].tableau.length>0);
        if(!targets.length){pushLog(`🐈‍⬛ Kucing Hitam hangus, tidak ada kartu yang bisa dibuang.`);if(fromNestedQueue){processNestedQueue()}else{postResolve(drawerIdx)}return}
        openTargetPicker(card,drawerIdx,targets,drawerIdx,fromNestedQueue,'discard');return;
      }
      case 'curiIkan': {
        const targets=game.players.map((p,i)=>i).filter(i=>i!==drawerIdx&&game.players[i].status!=='busted'&&game.players[i].tableau.length>0);
        if(!targets.length){pushLog(`🐟 Curi Ikan hangus, tidak ada target dengan kartu.`);if(fromNestedQueue){processNestedQueue()}else{postResolve(drawerIdx)}return}
        openTargetPicker(card,drawerIdx,targets,drawerIdx,fromNestedQueue,'steal');return;
      }
      case 'benangKusut': {
        const targets=game.players.map((p,i)=>i).filter(i=>i!==drawerIdx&&game.players[i].status!=='busted');
        if(!targets.length){pushLog(`🧶 Benang Kusut hangus, tidak ada target valid.`);if(fromNestedQueue){processNestedQueue()}else{postResolve(drawerIdx)}return}
        openTargetPicker(card,drawerIdx,targets,drawerIdx,fromNestedQueue);return;
      }
      case 'kotakMisteri': {
        const roll=Math.floor(Math.random()*3);
        if(roll===0){drawer.modifierSum+=5;pushLog(`📦 Kotak Misteri: <b>${esc(drawer.name)}</b> dapat +5 poin!`)}
        else if(roll===1&&drawer.tableau.length){const ri=Math.floor(Math.random()*drawer.tableau.length),val=drawer.tableau[ri];drawer.tableau.splice(ri,1);pushLog(`📦 Kotak Misteri: kartu <b>${val}</b> milik ${esc(drawer.name)} hilang!`)}
        else if(roll===1){pushLog(`📦 Kotak Misteri: tableau kosong, tidak terjadi apa-apa.`)}
        else{game.peekCards=game.deck.slice(-3).reverse().map(c=>c);pushLog(`📦 Kotak Misteri: ${esc(drawer.name)} mengintip deck.`);game.pendingPostPeek={drawerIdx,fromNestedQueue};game.phase='peek';render();return}
        beep(650,.07);if(fromNestedQueue){processNestedQueue()}else{postResolve(drawerIdx)}return;
      }
      case 'radarTikus': {
        game.peekCards=game.deck.slice(-3).reverse().map(c=>c);
        pushLog(`🐭 <b>${esc(drawer.name)}</b> mengintip 3 kartu teratas deck.`);
        game.pendingPostPeek={drawerIdx,fromNestedQueue};game.phase='peek';render();return;
      }
    }
  }
}

function openTargetPicker(card,drawerIdx,targets,defaultIdx,fromNestedQueue,mode){
  game.pendingAction={card,drawerIdx,targets,fromNestedQueue,mode};
  game.phase='pickTarget';render();
}

function chooseTarget(targetIdx){
  const pa=game.pendingAction,card=pa.card,drawerIdx=pa.drawerIdx,fromNestedQueue=pa.fromNestedQueue;
  game.pendingAction=null;
  if(card.kind==='modGift'){
    const t=game.players[targetIdx];t.modifierSum+=card.value;
    pushLog(`${card.value<0?'🐾':'🍀'} <b>${esc(game.players[drawerIdx].name)}</b> memberi ${card.value>0?'+':''}${card.value} ke <b>${esc(t.name)}</b>.`);
    beep(card.value<0?350:900,.09);
    if(fromNestedQueue){processNestedQueue()}else{postResolve(drawerIdx)}return;
  }
  if(card.kind==='action'&&card.type==='secondChance'){
    game.players[targetIdx].secondChance=true;
    pushLog(`👑 <b>${esc(game.players[drawerIdx].name)}</b> memberi Nyawa Kesembilan ke <b>${esc(game.players[targetIdx].name)}</b>.`);
    if(fromNestedQueue){processNestedQueue()}else{postResolve(drawerIdx)}return;
  }
  if(card.type==='kucingHitam'||card.type==='curiIkan'){
    game.pendingAction={card,drawerIdx,targetIdx,fromNestedQueue,mode:card.type==='curiIkan'?'steal':'discard'};
    game.phase='pickCard';render();return;
  }
  applyTargetedAction(card,drawerIdx,targetIdx,fromNestedQueue);
}

function applyTargetedAction(card,drawerIdx,targetIdx,fromNestedQueue){
  const drawer=game.players[drawerIdx],target=game.players[targetIdx];
  if(card.type==='freeze'){
    target.status='frozen';
    pushLog(`😴 <b>${esc(target.name)}</b> kena Tidur Kucing, skor dikunci di ${calcRoundScore(target)}.`);beep(400,.1);
    if(fromNestedQueue){processNestedQueue()}else{postResolve(drawerIdx)}return;
  }
  if(card.type==='flipThree'){
    pushLog(`🐾 <b>${esc(target.name)}</b> kena Cakar Bertubi, wajib tarik 3 kartu!`);beep(500,.09);
    game.flipThreeRemaining=3;game.flipThreeTargetIdx=targetIdx;
    if(game.turnBeforeInterrupt==null)game.turnBeforeInterrupt=game.currentIndex;
    if(fromNestedQueue){game.phase='flipThreeStep';render();return}
    game.phase='flipThreeStep';render();return;
  }
  if(card.type==='benangKusut'){
    const sa=calcRoundScore(drawer),sb=calcRoundScore(target);
    drawer.modifierSum+=(sb-sa);target.modifierSum+=(sa-sb);
    pushLog(`🧶 <b>${esc(drawer.name)}</b> menukar skor ronde dengan <b>${esc(target.name)}</b> (${sa} ⇄ ${sb}).`);beep(600,.08);
    if(fromNestedQueue){processNestedQueue()}else{postResolve(drawerIdx)}return;
  }
}

function applyCardChoice(cardIdx){
  const pa=game.pendingAction,drawerIdx=pa.drawerIdx,targetIdx=pa.targetIdx,fromNestedQueue=pa.fromNestedQueue;
  const drawer=game.players[drawerIdx],target=game.players[targetIdx];
  const val=target.tableau[cardIdx];
  target.tableau.splice(cardIdx,1);
  game.pendingAction=null;
  if(pa.mode==='discard'){
    pushLog(`🐈‍⬛ <b>${esc(drawer.name)}</b> membuang kartu <b>${val}</b> milik <b>${esc(target.name)}</b>.`);beep(380,.08);
  } else {
    if(drawer.tableau.includes(val)){
      pushLog(`🐟 <b>${esc(drawer.name)}</b> mencoba mencuri <b>${val}</b> dari ${esc(target.name)}, tapi gagal (sudah punya) — kartu hangus.`);beep(300,.09);
    } else {
      drawer.tableau.push(val);
      pushLog(`🐟 <b>${esc(drawer.name)}</b> berhasil mencuri kartu <b>${val}</b> dari <b>${esc(target.name)}</b>!`);beep(750,.09);
    }
  }
  if(fromNestedQueue){processNestedQueue()}else{postResolve(drawerIdx)}
}

/* ---------- BIND ---------- */
function bind(){
  $('#setupBtn')?.addEventListener('click',()=>{game={phase:'setup'};render()});
  $('#cancelBtn')?.addEventListener('click',()=>{game=null;render()});
  document.querySelectorAll('[data-pname]').forEach(inp=>inp.addEventListener('change',()=>{const i=Number(inp.dataset.pname);prefs.names[i]=inp.value.trim()||('Player '+(i+1));savePrefs()}));
  document.querySelectorAll('[data-removeplayer]').forEach(btn=>btn.addEventListener('click',()=>{const i=Number(btn.dataset.removeplayer);if(prefs.names.length>2){prefs.names.splice(i,1);savePrefs();render()}}));
  $('#addPlayerBtn')?.addEventListener('click',()=>{if(prefs.names.length<8){prefs.names.push('Player '+(prefs.names.length+1));savePrefs();render()}});
  $('#targetScoreInput')?.addEventListener('change',()=>{prefs.targetScore=Math.max(10,Number($('#targetScoreInput').value)||100);savePrefs()});
  $('#beginBtn')?.addEventListener('click',()=>{const names=prefs.names.map(n=>n.trim()||'Player');startGame(names,prefs.targetScore);beep(760,.08);render()});
  $('#ambilBtn')?.addEventListener('click',performAmbil);
  $('#passBtn')?.addEventListener('click',performPass);
  document.querySelectorAll('[data-target]').forEach(btn=>btn.addEventListener('click',()=>chooseTarget(Number(btn.dataset.target))));
  document.querySelectorAll('[data-cardidx]').forEach(btn=>btn.addEventListener('click',()=>applyCardChoice(Number(btn.dataset.cardidx))));
  $('#forcedDrawBtn')?.addEventListener('click',performForcedDraw);
  $('#closePeekBtn')?.addEventListener('click',()=>{const pp=game.pendingPostPeek;game.pendingPostPeek=null;game.peekCards=null;if(pp.fromNestedQueue){processNestedQueue()}else{postResolve(pp.drawerIdx)}});
  $('#nextRoundBtn')?.addEventListener('click',()=>{if(game.someoneWon){game.phase='gameEnd';render()}else{startNewRound();render()}});
  $('#rematchBtn')?.addEventListener('click',()=>{const names=game.players.map(p=>p.name);startGame(names,game.targetScore);render()});
  $('#homeBtn')?.addEventListener('click',()=>{game=null;render()});
}

E.theme.onclick=()=>{prefs.theme=prefs.theme==='dark'?'light':'dark';savePrefs();applyTheme()};
E.sound.onclick=()=>{prefs.sound=!prefs.sound;savePrefs();applyTheme();beep(700,.04)};
E.reset.onclick=()=>{if(confirm('Mulai game baru? Progress sekarang akan hilang.')){game=null;render()}};
applyTheme();render();
