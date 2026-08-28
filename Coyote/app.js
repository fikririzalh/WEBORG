const STORAGE_KEY='miau-thump-chaos-v1';
const COLORS={orange:'#f56a2d',blue:'#4a90e2',green:'#96c83d',purple:'#8c62a7'};
const clone=o=>JSON.parse(JSON.stringify(o));
const seed=clone(window.MIAU_SEED);

let db=loadDB();
let view='home';
let manageTab='players';
let game=null;
let toastTimer=null;
let beatTimer=null;
let audioCtx=null;

const app=document.querySelector('#app');
const dialog=document.querySelector('#dialog');
const dialogForm=document.querySelector('#dialogForm');
const dialogEyebrow=document.querySelector('#dialogEyebrow');
const dialogTitle=document.querySelector('#dialogTitle');
const dialogBody=document.querySelector('#dialogBody');
const dialogActions=document.querySelector('#dialogActions');
const toastEl=document.querySelector('#toast');

function loadDB(){
  try{
    const x=JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(x?.players&&x?.actions&&x?.modifiers&&x?.attacks) return x;
  }catch{}
  const fresh={...clone(seed),settings:{theme:'light',sound:true,bpm:100}};
  localStorage.setItem(STORAGE_KEY,JSON.stringify(fresh));
  return fresh;
}
function saveDB(){localStorage.setItem(STORAGE_KEY,JSON.stringify(db));}
function esc(v=''){return String(v).replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[m]));}
function nextId(prefix,list){let max=0;for(const x of list){const n=Number(String(x.id).replace(/\D/g,''));if(n>max)max=n;}return prefix+String(max+1).padStart(3,'0');}
function toast(msg){clearTimeout(toastTimer);toastEl.textContent=msg;toastEl.classList.add('show');toastTimer=setTimeout(()=>toastEl.classList.remove('show'),1900);}
function shuffle(a){const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x;}
function applyTheme(){document.documentElement.dataset.theme=db.settings.theme;document.querySelector('#themeBtn').textContent=db.settings.theme==='dark'?'☀️':'🌙';document.querySelector('#soundBtn').textContent=db.settings.sound?'🔊':'🔇';}
function beep(freq=180,dur=.07,type='sine',gain=.05){if(!db.settings.sound)return;audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.value=gain;o.connect(g);g.connect(audioCtx.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+dur);o.stop(audioCtx.currentTime+dur);}

function render(){applyTheme();if(view==='home')renderHome();else if(view==='game')renderGame();else renderManager();}

function renderHome(){
  stopBeat();
  const checked=db.players.slice(0,8);
  app.innerHTML=`<section class="hero">
    <div class="panel poster"><div class="poster-content"><div class="poster-cat">😼🤠</div><div><span class="eyebrow">ORIGINAL SINGLE-DEVICE PARTY PROTOTYPE</span><h1>MIAU!<span>THUMP THUMP</span></h1><p>Jaga beat. Hafalkan urutan. Tambah kekacauan. Jangan jadi kucing pertama yang nge-blank.</p></div></div></div>
    <div class="panel"><div class="setup-grid">
      <div><span class="eyebrow">SETUP</span><h2>Siapa yang siap rusuh?</h2><p class="muted">Pilih 3–8 pemain. Untuk 3 pemain, board otomatis mulai dengan 6 Action Card.</p></div>
      <div class="mode-grid">
        <div class="mode-card active" data-mode="competitive"><strong>😼 Kompetitif</strong><small>3 salah = keluar. Last cat standing menang.</small></div>
        <div class="mode-card" data-mode="coop"><strong>🤝 Co-op</strong><small>Semua menang atau kalah bersama.</small></div>
      </div>
      <div><label class="field">Pemain<div class="players-check">${checked.map((p,i)=>`<label class="check-player"><input type="checkbox" class="player-check" value="${p.id}" ${i<Math.min(4,checked.length)?'checked':''}><span><strong>${esc(p.name)}</strong><small class="muted"> ${p.id}</small></span></label>`).join('')}</div></label></div>
      <label class="field">Tempo bantuan beat<select id="bpmSelect"><option value="80">🐢 80 BPM</option><option value="100" ${db.settings.bpm===100?'selected':''}>😺 100 BPM</option><option value="120" ${db.settings.bpm===120?'selected':''}>😼 120 BPM</option><option value="140" ${db.settings.bpm===140?'selected':''}>🔥 140 BPM</option></select></label>
      <button class="primary-btn wide" id="startBtn">🤠 MULAI GAME</button>
      <p class="tiny muted">Konten kartu di prototype ini original; pola gameplay mengambil inspirasi dari permainan ritme/memori fisik.</p>
    </div></div>
  </section>`;
  let selectedMode='competitive';
  document.querySelectorAll('.mode-card').forEach(el=>el.onclick=()=>{selectedMode=el.dataset.mode;document.querySelectorAll('.mode-card').forEach(x=>x.classList.toggle('active',x===el));});
  document.querySelector('#bpmSelect').onchange=e=>{db.settings.bpm=Number(e.target.value);saveDB();};
  document.querySelector('#startBtn').onclick=()=>{
    const ids=[...document.querySelectorAll('.player-check:checked')].map(x=>x.value);
    if(ids.length<3||ids.length>8)return toast('Pilih 3–8 pemain.');
    startGame(selectedMode,ids);
  };
}

function startGame(mode,ids){
  const players=ids.map(id=>{const p=db.players.find(x=>x.id===id);return{id:p.id,name:p.name,strikes:0,eliminated:false};});
  const count=players.length===3?6:players.length;
  const row=shuffle(db.actions).slice(0,count).map(x=>x.id);
  game={mode,players,row,modifiers:[],attacks:[],firstIndex:0,round:1,practice:true,sharedStrikes:0,status:'playing',candidate:null};
  view='game';render();
}
function activePlayers(){return game.players.filter(p=>!p.eliminated);}
function firstPlayer(){const act=activePlayers();if(!act.length)return null;game.firstIndex=((game.firstIndex%act.length)+act.length)%act.length;return act[game.firstIndex];}
function performerFor(cardIndex){const act=activePlayers();if(!act.length)return null;const idx=(game.firstIndex+cardIndex)%act.length;return act[idx];}
function getAction(id){return db.actions.find(x=>x.id===id);}
function actionEffects(actionId){
  const a=getAction(actionId);const out=[];
  for(const m of game.modifiers){const card=db.modifiers.find(x=>x.id===m.cardId);if(!card)continue;if(m.targetType==='all'||(m.targetType==='color'&&m.target===a.color)||(m.targetType==='action'&&m.target===actionId))out.push(card.tag+' '+card.title);}
  for(const at of game.attacks){const card=db.attacks.find(x=>x.id===at.cardId);if(at.targetType==='action'&&at.target===actionId&&card)out.push(card.tag+' '+card.title);}
  return out;
}
function playerEffects(playerId){return game.attacks.filter(x=>x.targetType==='player'&&x.target===playerId).map(x=>db.attacks.find(a=>a.id===x.cardId)).filter(Boolean);}

function renderGame(){
  if(!game){view='home';return render();}
  if(game.status==='over')return renderGameOver();
  if(game.status==='choose')return renderChoose();
  const fp=firstPlayer();const actions=game.row.map(getAction).filter(Boolean);
  app.innerHTML=`
    <div class="game-head"><div><span class="eyebrow">${game.mode==='competitive'?'KOMPETITIF':'CO-OP'} • ROUND ${game.round}</span><h2>${game.practice?'🧪 Practice Round':'🤠 '+esc(fp?.name||'')}</h2><p class="muted">${game.practice?'Tidak ada penalti. Ulang sampai semua paham.':'First Player: '+esc(fp?.name||'—')+' • Selalu mainkan kartu dari kiri ke kanan.'}</p></div><button class="secondary-btn" id="quitBtn">↩ Selesai</button></div>
    <div class="score-strip">${game.players.map(p=>`<div class="player-pill ${p.id===fp?.id?'current':''} ${p.eliminated?'eliminated':''}"><strong>${esc(p.name)}</strong><div class="strikes">${p.eliminated?'OUT':'❌'.repeat(p.strikes)+'○'.repeat(Math.max(0,3-p.strikes))}</div>${playerEffects(p.id).map(x=>`<div class="tiny">${x.tag} ${esc(x.title)}</div>`).join('')}</div>`).join('')}${game.mode==='coop'?`<div class="player-pill"><strong>Team Failure</strong><div class="strikes">${'❌'.repeat(game.sharedStrikes)}${'○'.repeat(3-game.sharedStrikes)}</div></div>`:''}</div>
    <section class="board-shell">
      <div class="status-banner ${game.practice?'practice':''}"><div><strong>${game.practice?'Latihan dulu':'THUMP • THUMP • ACTION!'}</strong><div class="tiny muted">${actions.length} Action • ${game.modifiers.length} Modifier • ${game.attacks.length} Attack</div></div><div class="row"><span class="chip">${db.settings.bpm} BPM</span></div></div>
      <div class="cards-row">${actions.map((a,i)=>`<article class="action-card" style="--card-color:${COLORS[a.color]||'#888'}"><div class="performer">#${i+1} • ${esc(performerFor(i)?.name||'—')}</div><div class="icon">${a.icon}</div><div class="phrase">${esc(a.phrase)}</div><div class="movement">${esc(a.action)}</div><div class="effect-chips">${actionEffects(a.id).map(x=>`<span class="chip">${esc(x)}</span>`).join('')}</div><div class="code">${a.id}</div></article>`).join('')}</div>
      <div class="modifier-section"><div class="mini-panel"><strong>🐺 Modifier Aktif</strong>${game.modifiers.length?game.modifiers.map(m=>{const c=db.modifiers.find(x=>x.id===m.cardId);return`<div class="effect-card"><strong>${c?.tag||''} ${esc(c?.title||m.cardId)}</strong><span class="tiny">${esc(c?.effect||'')}</span><div class="tiny muted">Target: ${esc(targetLabel(m))}</div></div>`}).join(''):'<p class="tiny muted">Belum ada. Nikmati ketenangan palsu ini.</p>'}</div><div class="mini-panel"><strong>😈 Attack Aktif</strong>${game.attacks.length?game.attacks.map(m=>{const c=db.attacks.find(x=>x.id===m.cardId);return`<div class="effect-card"><strong>${c?.tag||''} ${esc(c?.title||m.cardId)}</strong><span class="tiny">${esc(c?.effect||'')}</span><div class="tiny muted">Target: ${esc(targetLabel(m))}</div></div>`}).join(''):'<p class="tiny muted">Belum ada korban khusus.</p>'}</div></div>
      <div class="beat-panel"><button class="secondary-btn" id="beatBtn">🥁 Start Beat</button><div><strong>Beat Helper</strong><div class="tiny muted">Opsional. Semua pemain tetap boleh mengetuk meja sendiri.</div></div><div class="beat-lights"><span class="beat-dot" id="beat1"></span><span class="beat-dot" id="beat2"></span><span class="beat-dot" id="beat3"></span></div></div>
      <div class="game-controls"><button class="success-btn" id="successBtn">✅ SEMUA BERHASIL</button><button class="danger-btn" id="failBtn">❌ ADA YANG SALAH</button></div>
    </section>`;
  document.querySelector('#quitBtn').onclick=()=>confirmQuit();
  document.querySelector('#beatBtn').onclick=toggleBeat;
  document.querySelector('#successBtn').onclick=roundSuccess;
  document.querySelector('#failBtn').onclick=roundFail;
}
function targetLabel(m){if(m.targetType==='color')return `warna ${m.target}`;if(m.targetType==='all')return 'semua Action Card';if(m.targetType==='player')return game.players.find(x=>x.id===m.target)?.name||m.target;return m.target;}

function roundSuccess(){
  stopBeat();
  if(game.practice){game.practice=false;toast('Practice selesai. Sekarang beneran. 😼');return render();}
  if(game.mode==='coop' && checkCoopWin())return finishCoop(true);
  game.candidate=drawCandidates();game.status='choose';render();
}
function checkCoopWin(){return game.row.length>=9 && (game.modifiers.length+game.attacks.length)>=3;}
function drawCandidates(){
  const actionPool=db.actions.filter(x=>!game.row.includes(x.id));
  const modPool=db.modifiers.filter(x=>!game.modifiers.some(m=>m.cardId===x.id));
  const atkPool=db.attacks;
  let pool=[...actionPool.map(x=>({type:'action',id:x.id})),...modPool.map(x=>({type:'modifier',id:x.id})),...atkPool.map(x=>({type:'attack',id:x.id}))];
  return shuffle(pool).slice(0,3);
}
function renderChoose(){
  const cards=game.candidate||[];
  app.innerHTML=`<section class="panel"><span class="eyebrow">ROUND ${game.round} SELESAI</span><h2>🎴 Pilih 1 dari 3</h2><p class="muted">Dua sisanya balik ke bawah deck secara konseptual. Pilihan Anda menentukan seberapa cepat game berubah jadi bencana.</p><div class="candidate-grid">${cards.map((x,i)=>candidateMarkup(x,i)).join('')}</div></section>`;
  document.querySelectorAll('[data-candidate]').forEach(b=>b.onclick=()=>chooseCandidate(Number(b.dataset.candidate)));
}
function candidateMarkup(x,i){
  if(x.type==='action'){const c=getAction(x.id);return`<button class="candidate" data-candidate="${i}"><span class="eyebrow">ACTION • ${c.id}</span><div class="big">${c.icon}</div><strong>${esc(c.phrase)}</strong><span class="tiny muted">${esc(c.action)}</span></button>`;}
  if(x.type==='modifier'){const c=db.modifiers.find(a=>a.id===x.id);return`<button class="candidate" data-candidate="${i}"><span class="eyebrow">MODIFIER • ${c.id} • ${c.difficulty}</span><div class="big">🐺 ${c.tag}</div><strong>${esc(c.title)}</strong><span class="tiny muted">${esc(c.effect)}</span></button>`;}
  const c=db.attacks.find(a=>a.id===x.id);return`<button class="candidate" data-candidate="${i}"><span class="eyebrow">ATTACK • ${c.id} • ${c.difficulty}</span><div class="big">😈 ${c.tag}</div><strong>${esc(c.title)}</strong><span class="tiny muted">${esc(c.effect)}</span></button>`;
}
function chooseCandidate(i){const x=game.candidate[i];if(!x)return;if(x.type==='action')return chooseActionPlacement(x.id);if(x.type==='modifier')return chooseModifierTarget(x.id);return chooseAttackTarget(x.id);}
function chooseActionPlacement(id){
  openDialog('ACTION BARU','Sisipkan di mana?',`<label class="field">Posisi<select id="placement">${Array.from({length:game.row.length+1},(_,i)=>`<option value="${i}">${i+1}${i===0?' (paling kiri)':i===game.row.length?' (paling kanan)':''}</option>`).join('')}</select></label>`,[{label:'Tambah Kartu',class:'primary-btn',fn:()=>{const pos=Number(document.querySelector('#placement').value);game.row.splice(pos,0,id);afterAdd();}}]);
}
function chooseModifierTarget(id){const c=db.modifiers.find(x=>x.id===id);if(c.targetMode==='all'){game.modifiers.push({cardId:id,targetType:'all',target:'all'});return afterAdd();}
  let html='';if(c.targetMode==='color'){const colors=[...new Set(game.row.map(x=>getAction(x)?.color).filter(Boolean))];html=`<label class="field">Pilih warna<select id="targetPick">${colors.map(x=>`<option value="${x}">${x.toUpperCase()}</option>`).join('')}</select></label>`;}else{html=`<label class="field">Pilih Action Card<select id="targetPick">${game.row.map((x,i)=>{const a=getAction(x);return`<option value="${x}">#${i+1} ${x} — ${esc(a?.phrase)}</option>`}).join('')}</select></label>`;}
  openDialog('MODIFIER','Pilih target',html,[{label:'Pasang Modifier',class:'primary-btn',fn:()=>{game.modifiers.push({cardId:id,targetType:c.targetMode,target:document.querySelector('#targetPick').value});afterAdd();}}]);
}
function chooseAttackTarget(id){const c=db.attacks.find(x=>x.id===id);const options=[];if(c.targetMode==='player'||c.targetMode==='either')options.push(`<optgroup label="Pemain">${activePlayers().map(p=>`<option value="player:${p.id}">${esc(p.name)}</option>`).join('')}</optgroup>`);if(c.targetMode==='action'||c.targetMode==='either')options.push(`<optgroup label="Action Card">${game.row.map((x,i)=>`<option value="action:${x}">#${i+1} ${x} — ${esc(getAction(x)?.phrase)}</option>`).join('')}</optgroup>`);
  openDialog('ATTACK','Siapa yang mau diganggu?',`<label class="field">Target<select id="targetPick">${options.join('')}</select></label>`,[{label:'Pasang Attack',class:'danger-btn',fn:()=>{const [targetType,target]=document.querySelector('#targetPick').value.split(':');game.attacks.push({cardId:id,targetType,target});afterAdd();}}]);
}
function afterAdd(){dialog.close();game.candidate=null;const act=activePlayers();if(act.length)game.firstIndex=(game.firstIndex+1)%act.length;game.round++;game.status='playing';beep(440,.1,'triangle',.06);render();}

function roundFail(){
  stopBeat();if(game.practice){toast('Masih practice — coba lagi tanpa penalti.');return;}
  if(game.mode==='coop')return coopFail();
  const act=activePlayers();
  openDialog('UPS. ADA YANG NGACO','Pilih pemain yang melakukan kesalahan',`<div class="players-check">${act.map(p=>`<label class="check-player"><input type="checkbox" class="fail-check" value="${p.id}"><span><strong>${esc(p.name)}</strong><small class="muted"> ${p.strikes}/3 salah</small></span></label>`).join('')}</div><p class="tiny muted">Kalau beberapa orang salah bersamaan, boleh pilih lebih dari satu.</p>`,[{label:'Catat Penalti',class:'danger-btn',fn:applyCompetitiveFail}]);
}
function applyCompetitiveFail(){const ids=[...document.querySelectorAll('.fail-check:checked')].map(x=>x.value);if(!ids.length)return toast('Pilih minimal satu pemain.');const oldFirst=firstPlayer()?.id;ids.forEach(id=>{const p=game.players.find(x=>x.id===id);if(p){p.strikes++;if(p.strikes>=3)p.eliminated=true;}});dialog.close();beep(105,.18,'sawtooth',.06);const act=activePlayers();if(act.length<=1){game.status='over';return render();}if(oldFirst && game.players.find(x=>x.id===oldFirst)?.eliminated){const idx=act.findIndex(x=>x.id===oldFirst);game.firstIndex=Math.max(0,idx);}render();}
function coopFail(){game.sharedStrikes++;beep(105,.18,'sawtooth',.06);if(game.sharedStrikes>=3)return finishCoop(false);toast(`Team failure ${game.sharedStrikes}/3 — ulang ronde yang sama.`);render();}
function finishCoop(win){game.status='over';game.coopWin=win;render();}
function renderGameOver(){
  stopBeat();let title,desc,emoji;if(game.mode==='coop'){emoji=game.coopWin?'🏆😺':'💥🙀';title=game.coopWin?'TEAM MENANG!':'TEAM TUMBANG!';desc=game.coopWin?`Kalian menaklukkan ${game.row.length} Action Card dengan ${game.modifiers.length+game.attacks.length} modifier/attack.`:'Tiga kegagalan bersama. Kekacauan menang.';}else{const winner=activePlayers()[0];emoji='🏆🤠';title=`${winner?.name||'Kucing'} MENANG!`;desc='Last cat standing. Yang lain boleh menyalahkan memori masing-masing.';}
  app.innerHTML=`<section class="panel winner"><div class="emoji">${emoji}</div><span class="eyebrow">GAME OVER</span><h1>${esc(title)}</h1><p class="muted">${esc(desc)}</p><div class="row" style="justify-content:center"><button class="primary-btn" id="againBtn">Main Lagi</button><button class="secondary-btn" id="homeAgainBtn">Home</button></div></section>`;
  document.querySelector('#againBtn').onclick=()=>{view='home';game=null;render();};document.querySelector('#homeAgainBtn').onclick=()=>{view='home';game=null;render();};
}
function confirmQuit(){openDialog('SELESAI GAME?','Balik ke setup','Progress ronde ini akan hilang.',[{label:'Batal',class:'secondary-btn',fn:()=>dialog.close()},{label:'Selesai',class:'danger-btn',fn:()=>{dialog.close();game=null;view='home';render();}}]);}

function toggleBeat(){if(beatTimer){stopBeat();return render();}startBeat();document.querySelector('#beatBtn').textContent='⏹ Stop Beat';}
function startBeat(){stopBeat();let step=0;const interval=60000/db.settings.bpm;const tick=()=>{document.querySelectorAll('.beat-dot').forEach(x=>x.classList.remove('on','act'));const el=document.querySelector(`#beat${step+1}`);if(el){el.classList.add('on');if(step===2)el.classList.add('act');}if(step<2)beep(120,.06,'sine',.05);else beep(340,.06,'triangle',.035);step=(step+1)%3;};tick();beatTimer=setInterval(tick,interval);}
function stopBeat(){if(beatTimer){clearInterval(beatTimer);beatTimer=null;}document.querySelectorAll?.('.beat-dot').forEach?.(x=>x.classList.remove('on','act'));}

function openDialog(eyebrow,title,body,actions=[]){dialogEyebrow.textContent=eyebrow;dialogTitle.textContent=title;dialogBody.innerHTML=body;dialogActions.innerHTML='';for(const a of actions){const b=document.createElement('button');b.type='button';b.textContent=a.label;b.className=a.class||'secondary-btn';b.onclick=a.fn;dialogActions.appendChild(b);}dialog.showModal();}

function renderManager(){
  stopBeat();
  const tabs=[['players','👥 Pemain'],['actions','🎬 Action'],['modifiers','🐺 Modifier'],['attacks','😈 Attack'],['data','💾 Data']];
  app.innerHTML=`<section class="panel"><div class="row spread"><div><span class="eyebrow">KELOLA</span><h2>Workshop Kekacauan</h2></div><button class="secondary-btn" id="backGameBtn">← Kembali</button></div><div class="manager-tabs">${tabs.map(([id,label])=>`<button class="secondary-btn tab-btn ${manageTab===id?'active':''}" data-tab="${id}">${label}</button>`).join('')}</div><div id="managerBody"></div></section>`;
  document.querySelector('#backGameBtn').onclick=()=>{view=game?'game':'home';render();};document.querySelectorAll('[data-tab]').forEach(x=>x.onclick=()=>{manageTab=x.dataset.tab;renderManager();});renderManagerBody();
}
function renderManagerBody(){const root=document.querySelector('#managerBody');if(manageTab==='data')return renderData(root);const cfg={players:{list:db.players,label:'Pemain',prefix:'P'},actions:{list:db.actions,label:'Action Card',prefix:'A'},modifiers:{list:db.modifiers,label:'Modifier',prefix:'M'},attacks:{list:db.attacks,label:'Attack',prefix:'X'}}[manageTab];root.innerHTML=`<div class="manager-toolbar"><input id="searchCrud" placeholder="Cari ID, nama, phrase, efek..."><button class="primary-btn" id="addCrud">+ Tambah ${cfg.label}</button></div><div class="crud-list" id="crudList"></div>`;document.querySelector('#searchCrud').oninput=renderCrudList;document.querySelector('#addCrud').onclick=()=>openCrudForm(manageTab);renderCrudList();}
function renderCrudList(){const root=document.querySelector('#crudList');const q=(document.querySelector('#searchCrud')?.value||'').toLowerCase();const list=db[manageTab].filter(x=>JSON.stringify(x).toLowerCase().includes(q));root.innerHTML=list.length?list.map(x=>`<div class="crud-item"><div><strong>${esc(x.id)} — ${esc(x.name||x.phrase||x.title)}</strong><div class="crud-meta">${esc(x.action||x.effect||'')}</div></div><div class="crud-actions"><button class="secondary-btn" data-edit="${x.id}">Edit</button><button class="danger-btn" data-del="${x.id}">Hapus</button></div></div>`).join(''):'<div class="empty">Tidak ada data.</div>';root.querySelectorAll('[data-edit]').forEach(x=>x.onclick=()=>openCrudForm(manageTab,x.dataset.edit));root.querySelectorAll('[data-del]').forEach(x=>x.onclick=()=>deleteCrud(manageTab,x.dataset.del));}
function openCrudForm(type,id=null){const list=db[type];const item=id?list.find(x=>x.id===id):null;const prefix={players:'P',actions:'A',modifiers:'M',attacks:'X'}[type];const newId=item?.id||nextId(prefix,list);let body='';if(type==='players')body=`<div class="form-grid"><label class="field">ID<input value="${newId}" disabled></label><label class="field">Nama<input id="fName" value="${esc(item?.name||'')}" maxlength="30"></label></div>`;
  if(type==='actions')body=`<div class="form-grid"><label class="field">ID<input value="${newId}" disabled></label><label class="field">Phrase<input id="fPhrase" value="${esc(item?.phrase||'')}" maxlength="24"></label><label class="field">Gerakan<textarea id="fAction">${esc(item?.action||'')}</textarea></label><label class="field">Emoji/Icon<input id="fIcon" value="${esc(item?.icon||'🐱')}" maxlength="8"></label><label class="field">Warna<select id="fColor">${['orange','blue','green','purple'].map(x=>`<option ${item?.color===x?'selected':''}>${x}</option>`).join('')}</select></label><label class="field">Difficulty<select id="fDifficulty">${['easy','medium','hard'].map(x=>`<option ${item?.difficulty===x?'selected':''}>${x}</option>`).join('')}</select></label></div>`;
  if(type==='modifiers')body=`<div class="form-grid"><label class="field">ID<input value="${newId}" disabled></label><label class="field">Nama<input id="fTitle" value="${esc(item?.title||'')}"></label><label class="field">Efek<textarea id="fEffect">${esc(item?.effect||'')}</textarea></label><label class="field">Tag singkat<input id="fTag" value="${esc(item?.tag||'🐺')}" maxlength="8"></label><label class="field">Target<select id="fTargetMode">${['color','action','all'].map(x=>`<option ${item?.targetMode===x?'selected':''}>${x}</option>`).join('')}</select></label><label class="field">Difficulty<select id="fDifficulty">${['easy','medium','hard'].map(x=>`<option ${item?.difficulty===x?'selected':''}>${x}</option>`).join('')}</select></label></div>`;
  if(type==='attacks')body=`<div class="form-grid"><label class="field">ID<input value="${newId}" disabled></label><label class="field">Nama<input id="fTitle" value="${esc(item?.title||'')}"></label><label class="field">Efek<textarea id="fEffect">${esc(item?.effect||'')}</textarea></label><label class="field">Tag singkat<input id="fTag" value="${esc(item?.tag||'😈')}" maxlength="8"></label><label class="field">Target<select id="fTargetMode">${['player','action','either'].map(x=>`<option ${item?.targetMode===x?'selected':''}>${x}</option>`).join('')}</select></label><label class="field">Difficulty<select id="fDifficulty">${['easy','medium','hard'].map(x=>`<option ${item?.difficulty===x?'selected':''}>${x}</option>`).join('')}</select></label></div>`;
  openDialog(item?'EDIT':'BARU',`${item?'Edit':'Tambah'} ${type}`,body,[{label:'Simpan',class:'primary-btn',fn:()=>saveCrud(type,newId,item)}]);}
function saveCrud(type,id,item){let x;if(type==='players'){const name=document.querySelector('#fName').value.trim();if(!name)return toast('Nama wajib diisi.');x={id,name};}
  if(type==='actions'){const phrase=document.querySelector('#fPhrase').value.trim(),action=document.querySelector('#fAction').value.trim();if(!phrase||!action)return toast('Phrase dan gerakan wajib diisi.');x={id,phrase,action,icon:document.querySelector('#fIcon').value.trim()||'🐱',color:document.querySelector('#fColor').value,difficulty:document.querySelector('#fDifficulty').value};}
  if(type==='modifiers'||type==='attacks'){const title=document.querySelector('#fTitle').value.trim(),effect=document.querySelector('#fEffect').value.trim();if(!title||!effect)return toast('Nama dan efek wajib diisi.');x={id,title,effect,tag:document.querySelector('#fTag').value.trim()||(type==='modifiers'?'🐺':'😈'),targetMode:document.querySelector('#fTargetMode').value,difficulty:document.querySelector('#fDifficulty').value};}
  if(item)Object.assign(item,x);else db[type].push(x);saveDB();dialog.close();renderManagerBody();toast('Tersimpan.');}
function deleteCrud(type,id){if(type==='players'&&db.players.length<=3)return toast('Minimal simpan 3 pemain.');if(!confirm(`Hapus ${id}?`))return;db[type]=db[type].filter(x=>x.id!==id);saveDB();renderManagerBody();}
function renderData(root){root.innerHTML=`<div class="setup-grid"><div class="mini-panel"><strong>Isi database</strong><p class="muted">${db.players.length} pemain • ${db.actions.length} action • ${db.modifiers.length} modifier • ${db.attacks.length} attack</p></div><button class="secondary-btn" id="exportBtn">⬇️ Export JSON</button><label class="secondary-btn" style="text-align:center">⬆️ Import JSON<input type="file" id="importFile" accept="application/json" hidden></label><button class="danger-btn" id="resetBtn">♻️ Reset ke Seed</button></div>`;document.querySelector('#exportBtn').onclick=exportData;document.querySelector('#importFile').onchange=importData;document.querySelector('#resetBtn').onclick=()=>{if(!confirm('Reset semua kartu dan pemain ke data awal?'))return;db={...clone(seed),settings:db.settings};saveDB();toast('Database di-reset.');renderManagerBody();};}
function exportData(){const blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='miau-thump-data.json';a.click();URL.revokeObjectURL(a.href);}
function importData(e){const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const x=JSON.parse(r.result);if(!Array.isArray(x.players)||!Array.isArray(x.actions)||!Array.isArray(x.modifiers)||!Array.isArray(x.attacks))throw 0;db={...x,settings:{...db.settings,...x.settings}};saveDB();toast('Import berhasil.');renderManagerBody();}catch{toast('JSON tidak valid.');}};r.readAsText(f);}

// Global UI
document.querySelector('#homeBtn').onclick=()=>{view=game?'game':'home';render();};
document.querySelector('#manageBtn').onclick=()=>{view='manage';render();};
document.querySelector('#themeBtn').onclick=()=>{db.settings.theme=db.settings.theme==='dark'?'light':'dark';saveDB();render();};
document.querySelector('#soundBtn').onclick=()=>{db.settings.sound=!db.settings.sound;saveDB();applyTheme();beep(420,.08);};
dialogForm.addEventListener('submit',e=>e.preventDefault());
applyTheme();render();
