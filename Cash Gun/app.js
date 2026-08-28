
const STORAGE_KEY = 'miau-heist-tracker-v1';
const $ = s => document.querySelector(s);
const els = {
  app: $('#app'), themeBtn: $('#themeBtn'), soundBtn: $('#soundBtn'), manageBtn: $('#manageBtn'),
  manageDialog: $('#manageDialog'), manageContent: $('#manageContent'),
  formDialog: $('#formDialog'), crudForm: $('#crudForm'), formEyebrow: $('#formEyebrow'),
  formTitle: $('#formTitle'), formFields: $('#formFields'),
  formCloseBtn: $('#formCloseBtn'), formCancelBtn: $('#formCancelBtn'),
  confirmDialog: $('#confirmDialog'), confirmTitle: $('#confirmTitle'), confirmText: $('#confirmText'),
  confirmYes: $('#confirmYes'), confirmNo: $('#confirmNo'), toast: $('#toast')
};

const ART_VALUES = [0, 5000, 15000, 30000, 50000, 75000, 100000];

let db = loadData();
let game = null;
let manageTab = 'players';
let editing = null;
let confirmAction = null;
let audio = null;

function clone(v){ return JSON.parse(JSON.stringify(v)); }
function escapeHTML(v=''){ return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])); }
function toast(msg){
  els.toast.textContent = msg;
  els.toast.classList.add('show');
  clearTimeout(toast.t);
  toast.t = setTimeout(()=>els.toast.classList.remove('show'),1800);
}
function saveData(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); }
function loadData(){
  try{
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(parsed?.players && parsed?.loot) return parsed;
  }catch{}
  return { players: clone(SEED_PLAYERS), loot: clone(SEED_LOOT), theme:'light', sound:true, playerSeq:5, lootSeq:65 };
}
function applyTheme(){
  document.documentElement.dataset.theme = db.theme;
  els.themeBtn.textContent = db.theme === 'dark' ? '☀️' : '🌙';
}
function beep(freq=520,dur=.07){
  if(!db.sound) return;
  try{
    audio ||= new (window.AudioContext || window.webkitAudioContext)();
    const o=audio.createOscillator(), g=audio.createGain();
    o.frequency.value=freq; g.gain.setValueAtTime(.06,audio.currentTime);
    g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+dur);
    o.connect(g).connect(audio.destination); o.start(); o.stop(audio.currentTime+dur);
  }catch{}
}
function money(n){ return new Intl.NumberFormat('id-ID').format(n); }
function playerById(id){ return db.players.find(p=>p.id===id); }
function lootById(id){ return db.loot.find(x=>x.id===id); }

function scorePlayer(p){
  const inv = p.inventory || [];
  const cards = inv.map(lootById).filter(Boolean);
  const cash = cards.filter(x=>['cash','gem','bonus'].includes(x.type)).reduce((s,x)=>s+(x.value||0),0);
  const artCount = cards.filter(x=>x.type==='art').length;
  const art = ART_VALUES[Math.min(artCount, ART_VALUES.length-1)] || ART_VALUES.at(-1);
  return { cash, artCount, art, gems: cards.filter(x=>x.type==='gem').length, total: cash+art };
}
function gemMajorityBonus(){
  if(!game) return {};
  const alive = game.players.filter(p=>!p.eliminated);
  const counts = alive.map(p=>({id:p.id,n:scorePlayer(p).gems}));
  const max = Math.max(0,...counts.map(x=>x.n));
  if(max===0) return {};
  const leaders = counts.filter(x=>x.n===max);
  return leaders.length===1 ? {[leaders[0].id]:20000} : {};
}

function setupScreen(){
  if(db.players.length < 2){
    return `<section class="panel"><h2>Butuh pemain dulu 😼</h2><p>Tambahkan minimal 2 pemain lewat menu Kelola.</p><button class="primary-btn" onclick="els.manageDialog.showModal()">⚙️ Kelola Pemain</button></section>`;
  }
  return `
    <section class="hero">
      <div class="panel hero-card">
        <div class="eyebrow">HYBRID PARTY GAME</div>
        <div class="hero-title">Bluff di meja.<br>Hitung di web.</div>
        <p class="hero-copy">Web ini sengaja tidak mengatur fase bluff. Ia hanya menjadi banker: pemain, ronde, strike, loot draft, dan skor akhir.</p>
        <div class="button-row">
          <button class="primary-btn big-btn" id="startBtn">😼 Mulai Heist</button>
          <button class="secondary-btn big-btn" id="manageHomeBtn">⚙️ Kelola Database</button>
        </div>
        <div class="safety-note">Untuk fase meja, gunakan hanya kartu atau gesture tangan yang aman. Jangan gunakan benda nyata/proyektil sebagai properti permainan.</div>
      </div>
      <div class="panel">
        <div class="eyebrow">DATABASE</div>
        <div class="stat-grid">
          <div class="stat"><span>Pemain</span><b>${db.players.length}</b></div>
          <div class="stat"><span>Loot</span><b>${db.loot.length}</b></div>
          <div class="stat"><span>Ronde</span><b>8</b></div>
          <div class="stat"><span>Strike max</span><b>3</b></div>
        </div>
        <hr class="sep">
        <p class="subtitle">Seed bawaan: cash, permata, koleksi seni, Catnip Patch, dan Golden Fish.</p>
      </div>
    </section>`;
}

function newGame(){
  if(db.players.length < 2) return toast('Tambahkan minimal 2 pemain.');
  const order = [...db.loot.map(x=>x.id)].sort(()=>Math.random()-.5);
  game = {
    round:1, phase:'table', bossIndex:0, deck:order, roundLoot:[],
    players: db.players.map(p=>({id:p.id,strikes:0,eliminated:false,folded:false,inventory:[]})),
    draftQueue:[], draftIndex:0, finished:false
  };
  drawRoundLoot();
  beep(600,.1); render();
}
function drawRoundLoot(){
  game.roundLoot = game.deck.splice(0,8);
  if(game.roundLoot.length < 8){
    const used = new Set(game.roundLoot);
    game.deck = db.loot.map(x=>x.id).filter(id=>!used.has(id)).sort(()=>Math.random()-.5);
    while(game.roundLoot.length < 8 && game.deck.length) game.roundLoot.push(game.deck.shift());
  }
  game.players.forEach(p=>p.folded=p.eliminated);
}
function activeBoss(){
  const alive = game.players.filter(p=>!p.eliminated);
  if(!alive.length) return null;
  game.bossIndex %= alive.length;
  return alive[game.bossIndex];
}
function gamePlayer(id){ return game.players.find(p=>p.id===id); }
function alivePlayers(){ return game.players.filter(p=>!p.eliminated); }
function eligiblePlayers(){ return game.players.filter(p=>!p.eliminated && !p.folded); }

function phaseSteps(){
  const phases=[['table','1. Bluff Meja'],['resolve','2. Resolve'],['draft','3. Draft Loot'],['result','4. Next']];
  return `<div class="phase-steps">${phases.map(([id,l])=>`<div class="phase-step ${game.phase===id?'active':''}">${l}</div>`).join('')}</div>`;
}

function playersMarkup(){
  const bonus = game.finished ? gemMajorityBonus() : {};
  return `<div class="player-grid">${game.players.map(p=>{
    const base=playerById(p.id), s=scorePlayer(p), total=s.total+(bonus[p.id]||0);
    return `<div class="panel player-card ${p.eliminated?'eliminated':''}">
      <div class="eyebrow">${escapeHTML(base?.id||p.id)} ${p.id===activeBoss()?.id?'• BOSS CAT':''}</div>
      <div class="player-name">${escapeHTML(base?.name||'Pemain')}</div>
      <div class="strikes">${'❌'.repeat(p.strikes)}${'○'.repeat(Math.max(0,3-p.strikes))}</div>
      <div class="badges">
        <span class="badge">💎 ${s.gems}</span>
        <span class="badge">🖼️ ${s.artCount}</span>
        <span class="badge">🎒 ${p.inventory.length}</span>
      </div>
      <div class="money">Rp ${money(total)}</div>
      ${bonus[p.id]?'<div class="badge orange">💎 Majority +20K</div>':''}
      ${p.eliminated?'<div class="badge">OUT</div>':''}
    </div>`;
  }).join('')}</div>`;
}

function tablePhase(){
  return `<section class="panel phase-card">
    ${phaseSteps()}
    <div class="eyebrow">FASE MEJA</div>
    <h2>Lakukan bluff secara langsung 😼</h2>
    <p class="subtitle">Web berhenti di sini. Setelah kelompok selesai dengan fase meja yang aman, lanjutkan ke Resolve.</p>
    <div class="safety-note">Gunakan gesture tangan/kartu yang tidak berbahaya. Tidak perlu properti yang bisa melukai atau menembakkan proyektil.</div>
    <div class="button-row" style="margin-top:16px">
      <button class="primary-btn big-btn" id="toResolveBtn">Selesai → Resolve</button>
    </div>
  </section>`;
}

function resolvePhase(){
  return `<section class="panel phase-card">
    ${phaseSteps()}
    <div class="eyebrow">RESOLVE</div>
    <h2>Siapa mundur? Siapa dapat strike?</h2>
    <p class="subtitle">Atur hasil fase meja secara manual. Pemain yang Fold tidak ikut draft loot ronde ini.</p>
    <div class="toggle-row">
      ${game.players.map(p=>{
        const b=playerById(p.id);
        return `<button class="toggle-player ${p.folded?'off':''}" data-fold="${p.id}" ${p.eliminated?'disabled':''}>
          ${p.folded?'↩️ FOLD':'😼 IN'} • ${escapeHTML(b?.name||p.id)}
        </button>`;
      }).join('')}
    </div>
    <hr class="sep">
    <div class="crud-list">
      ${game.players.map(p=>{
        const b=playerById(p.id);
        return `<div class="crud-row">
          <div>
            <div class="crud-title">${escapeHTML(b?.name||p.id)} ${p.eliminated?'• OUT':''}</div>
            <div class="crud-meta">${p.strikes}/3 strike</div>
          </div>
          <div class="strike-editor">
            <button data-strike-minus="${p.id}" ${p.strikes<=0?'disabled':''}>−</button>
            <b>${p.strikes}</b>
            <button data-strike-plus="${p.id}" ${p.eliminated?'disabled':''}>+</button>
          </div>
        </div>`;
      }).join('')}
    </div>
    <div class="button-row" style="margin-top:16px">
      <button class="primary-btn big-btn" id="startDraftBtn" ${eligiblePlayers().length===0?'disabled':''}>💰 Mulai Draft Loot</button>
    </div>
  </section>`;
}

function startDraft(){
  const alive = eligiblePlayers();
  if(!alive.length) return toast('Tidak ada pemain yang berhak draft.');
  const boss=activeBoss();
  const allAlive=alivePlayers();
  let start = allAlive.findIndex(p=>p.id===boss?.id);
  const ordered=[];
  for(let i=0;i<allAlive.length;i++){
    const p=allAlive[(start+i)%allAlive.length];
    if(!p.folded) ordered.push(p.id);
  }
  game.draftQueue=ordered;
  game.draftIndex=0;
  game.phase='draft';
  beep(760,.1); render();
}
function currentDrafter(){
  if(!game.draftQueue.length) return null;
  return game.draftQueue[game.draftIndex % game.draftQueue.length];
}
function draftPhase(){
  const id=currentDrafter(), p=playerById(id);
  return `<section class="panel phase-card">
    ${phaseSteps()}
    <div class="draft-banner">
      <div><div class="eyebrow">GILIRAN MEMILIH</div><h2 style="margin:0">😼 ${escapeHTML(p?.name||id)}</h2></div>
      <div><b>${game.roundLoot.length}</b> loot tersisa</div>
    </div>
    <div class="loot-grid">
      ${game.roundLoot.map(id=>{
        const l=lootById(id); if(!l) return '';
        return `<button class="loot-card" data-claim="${id}">
          <div class="loot-icon">${l.icon||'🎁'}</div>
          <div class="loot-name">${escapeHTML(l.name)}</div>
          <div class="loot-meta">${escapeHTML(typeLabel(l.type))}${l.value?` • Rp ${money(l.value)}`:''}</div>
        </button>`;
      }).join('')}
    </div>
    <div class="button-row" style="margin-top:16px">
      <button class="secondary-btn" id="endDraftBtn">Akhiri Draft</button>
    </div>
  </section>`;
}
function typeLabel(t){ return ({cash:'Cash',gem:'Permata',art:'Koleksi Seni',patch:'Catnip Patch',bonus:'Bonus'})[t]||t; }
function claimLoot(lootId){
  const pid=currentDrafter(), p=gamePlayer(pid), l=lootById(lootId);
  if(!p||!l) return;
  p.inventory.push(lootId);
  game.roundLoot = game.roundLoot.filter(x=>x!==lootId);
  if(l.type==='patch' && p.strikes>0){
    p.strikes--; p.eliminated=false; toast(`${playerById(pid)?.name} pulih 1 strike.`);
  } else toast(`${playerById(pid)?.name} mengambil ${l.name}.`);
  beep(820,.08);
  if(!game.roundLoot.length) return endDraft();
  game.draftIndex = (game.draftIndex+1)%game.draftQueue.length;
  render();
}
function endDraft(){ game.phase='result'; render(); }

function resultPhase(){
  const lastRound = game.round>=8 || alivePlayers().length<=1;
  return `<section class="panel phase-card">
    ${phaseSteps()}
    <div class="eyebrow">RONDE ${game.round} SELESAI</div>
    <h2>${lastRound?'Heist selesai!':'Loot sudah dibagi.'}</h2>
    ${playersMarkup()}
    <div class="button-row" style="margin-top:18px">
      <button class="primary-btn big-btn" id="${lastRound?'finishBtn':'nextRoundBtn'}">
        ${lastRound?'🏆 Hitung Skor Akhir':'➡️ Ronde Berikut'}
      </button>
    </div>
  </section>`;
}
function nextRound(){
  game.round++;
  game.bossIndex++;
  game.phase='table';
  game.players.forEach(p=>{p.folded=p.eliminated});
  drawRoundLoot();
  beep(620,.09); render();
}
function finishGame(){ game.finished=true; game.phase='finished'; render(); }

function finishedScreen(){
  const bonus=gemMajorityBonus();
  const rows=[...game.players].map(p=>{
    const b=playerById(p.id),s=scorePlayer(p),total=s.total+(bonus[p.id]||0);
    return {p,b,s,total};
  }).sort((a,b)=>b.total-a.total);
  return `<section class="panel">
    <div class="eyebrow">FINAL SCORE</div>
    <h2>🏆 ${escapeHTML(rows[0]?.b?.name||'Pemenang')} menang!</h2>
    <div class="score-scroll" role="region" aria-label="Tabel skor akhir" tabindex="0">
      <table class="score-table">
        <thead><tr><th>#</th><th>Pemain</th><th>Cash/Bonus</th><th>Art</th><th>Gem Bonus</th><th>Total</th></tr></thead>
        <tbody>${rows.map((r,i)=>`<tr>
          <td><b>${i+1}</b></td>
          <td>${escapeHTML(r.b?.name||r.p.id)}${r.p.eliminated?' <small>(OUT)</small>':''}</td>
          <td>Rp ${money(r.s.cash)}</td>
          <td>Rp ${money(r.s.art)}</td>
          <td>${bonus[r.p.id]?'Rp 20.000':'—'}</td>
          <td><b>Rp ${money(r.total)}</b></td>
        </tr>`).join('')}</tbody>
      </table>
    </div>
    <p class="subtitle" style="margin-top:14px">Skor custom MIAU! HEIST: permata bernilai 8K masing-masing + bonus mayoritas 20K (hanya jika tidak seri); koleksi seni naik nilainya berdasarkan jumlah set.</p>
    <div class="button-row" style="margin-top:16px">
      <button class="primary-btn" id="newGameBtn">🔁 Main Lagi</button>
      <button class="secondary-btn" id="homeBtn">🏠 Beranda</button>
    </div>
  </section>`;
}

function gameScreen(){
  return `<div class="game-head">
    <div><div class="eyebrow">MIAU! HEIST</div><div class="round-pill">Round ${game.round} / 8</div></div>
    <div class="badge orange">👑 Boss Cat: ${escapeHTML(playerById(activeBoss()?.id)?.name||'-')}</div>
  </div>
  ${game.phase!=='result' && game.phase!=='finished' ? playersMarkup() : ''}
  ${game.phase==='table'?tablePhase():game.phase==='resolve'?resolvePhase():game.phase==='draft'?draftPhase():game.phase==='result'?resultPhase():finishedScreen()}`;
}

function render(){
  els.app.innerHTML = game ? gameScreen() : setupScreen();
  bindGameUI();
}

function bindGameUI(){
  $('#startBtn')?.addEventListener('click',newGame);
  $('#manageHomeBtn')?.addEventListener('click',()=>{manageTab='players';renderManage();els.manageDialog.showModal()});
  $('#toResolveBtn')?.addEventListener('click',()=>{game.phase='resolve';render()});
  document.querySelectorAll('[data-fold]').forEach(b=>b.onclick=()=>{const p=gamePlayer(b.dataset.fold); if(!p.eliminated){p.folded=!p.folded;render()}});
  document.querySelectorAll('[data-strike-plus]').forEach(b=>b.onclick=()=>changeStrike(b.dataset.strikePlus,1));
  document.querySelectorAll('[data-strike-minus]').forEach(b=>b.onclick=()=>changeStrike(b.dataset.strikeMinus,-1));
  $('#startDraftBtn')?.addEventListener('click',startDraft);
  document.querySelectorAll('[data-claim]').forEach(b=>b.onclick=()=>claimLoot(b.dataset.claim));
  $('#endDraftBtn')?.addEventListener('click',endDraft);
  $('#nextRoundBtn')?.addEventListener('click',nextRound);
  $('#finishBtn')?.addEventListener('click',finishGame);
  $('#newGameBtn')?.addEventListener('click',()=>{game=null;render();newGame()});
  $('#homeBtn')?.addEventListener('click',()=>{game=null;render()});
}
function changeStrike(id,delta){
  const p=gamePlayer(id); if(!p) return;
  p.strikes=Math.max(0,Math.min(3,p.strikes+delta));
  p.eliminated=p.strikes>=3;
  if(p.eliminated) p.folded=true;
  beep(delta>0?180:540,.07);
  render();
}

function renderManage(query=''){
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===manageTab));
  if(manageTab==='players') return renderPlayersManage(query);
  if(manageTab==='loot') return renderLootManage(query);
  renderDataManage();
}
function renderPlayersManage(query=''){
  const q=query.toLowerCase();
  const list=db.players.filter(p=>(p.id+' '+p.name).toLowerCase().includes(q));
  els.manageContent.innerHTML=`
    <div class="manage-tools">
      <input class="search" id="manageSearch" placeholder="Cari ID / nama..." value="${escapeHTML(query)}">
      <button class="primary-btn" id="addPlayerBtn">+ Pemain</button>
    </div>
    <div class="crud-list">${list.map(p=>`<div class="crud-row">
      <div><div class="crud-title">${escapeHTML(p.name)}</div><div class="crud-meta">${p.id}</div></div>
      <div class="crud-actions"><button data-edit-player="${p.id}">✏️</button><button data-del-player="${p.id}">🗑️</button></div>
    </div>`).join('')||'<div class="empty">Tidak ada pemain.</div>'}</div>`;
  $('#manageSearch').oninput=e=>renderPlayersManage(e.target.value);
  $('#addPlayerBtn').onclick=()=>openPlayerForm();
  document.querySelectorAll('[data-edit-player]').forEach(b=>b.onclick=()=>openPlayerForm(b.dataset.editPlayer));
  document.querySelectorAll('[data-del-player]').forEach(b=>b.onclick=()=>askConfirm('Hapus pemain?',`Hapus ${playerById(b.dataset.delPlayer)?.name}?`,()=>{db.players=db.players.filter(x=>x.id!==b.dataset.delPlayer);saveData();renderPlayersManage();render()}));
}
function renderLootManage(query=''){
  const q=query.toLowerCase();
  const list=db.loot.filter(l=>(l.id+' '+l.name+' '+l.type).toLowerCase().includes(q));
  els.manageContent.innerHTML=`
    <div class="manage-tools">
      <input class="search" id="manageSearch" placeholder="Cari ID / nama / tipe..." value="${escapeHTML(query)}">
      <button class="primary-btn" id="addLootBtn">+ Loot</button>
    </div>
    <div class="crud-list">${list.map(l=>`<div class="crud-row">
      <div><div class="crud-title">${l.icon||'🎁'} ${escapeHTML(l.name)}</div><div class="crud-meta">${l.id} • ${typeLabel(l.type)}${l.value?` • Rp ${money(l.value)}`:''}</div></div>
      <div class="crud-actions"><button data-edit-loot="${l.id}">✏️</button><button data-del-loot="${l.id}">🗑️</button></div>
    </div>`).join('')||'<div class="empty">Tidak ada loot.</div>'}</div>`;
  $('#manageSearch').oninput=e=>renderLootManage(e.target.value);
  $('#addLootBtn').onclick=()=>openLootForm();
  document.querySelectorAll('[data-edit-loot]').forEach(b=>b.onclick=()=>openLootForm(b.dataset.editLoot));
  document.querySelectorAll('[data-del-loot]').forEach(b=>b.onclick=()=>askConfirm('Hapus loot?',`Hapus ${lootById(b.dataset.delLoot)?.name}?`,()=>{db.loot=db.loot.filter(x=>x.id!==b.dataset.delLoot);saveData();renderLootManage();render()}));
}
function renderDataManage(){
  els.manageContent.innerHTML=`
    <div class="panel" style="box-shadow:none">
      <h3>Backup data</h3>
      <p class="subtitle">Export / import pemain, loot, dan setting.</p>
      <div class="button-row">
        <button class="primary-btn" id="exportBtn">⬇️ Export JSON</button>
        <label class="secondary-btn">⬆️ Import JSON<input id="importInput" type="file" accept=".json,application/json" hidden></label>
        <button class="danger-btn" id="resetBtn">♻️ Reset Seed</button>
      </div>
    </div>`;
  $('#exportBtn').onclick=exportData;
  $('#importInput').onchange=importData;
  $('#resetBtn').onclick=()=>askConfirm('Reset database?','Semua pemain dan loot custom akan diganti seed bawaan.',()=>{db={players:clone(SEED_PLAYERS),loot:clone(SEED_LOOT),theme:db.theme,sound:db.sound,playerSeq:5,lootSeq:65};saveData();renderManage();render()});
}
function openPlayerForm(id=null){
  const p=id?playerById(id):null; editing={type:'player',id};
  els.formEyebrow.textContent=p?p.id:'PEMAIN BARU';
  els.formTitle.textContent=p?'Edit Pemain':'Tambah Pemain';
  els.formFields.innerHTML=`<label>Nama<input name="name" maxlength="30" required value="${escapeHTML(p?.name||'')}"></label>`;
  els.formDialog.showModal();
}
function openLootForm(id=null){
  const l=id?lootById(id):null; editing={type:'loot',id};
  els.formEyebrow.textContent=l?l.id:'LOOT BARU';
  els.formTitle.textContent=l?'Edit Loot':'Tambah Loot';
  els.formFields.innerHTML=`
    <label>Nama<input name="name" maxlength="40" required value="${escapeHTML(l?.name||'')}"></label>
    <label>Emoji / ikon<input name="icon" maxlength="4" value="${escapeHTML(l?.icon||'🎁')}"></label>
    <label>Tipe<select name="type">
      ${['cash','gem','art','patch','bonus'].map(t=>`<option value="${t}" ${l?.type===t?'selected':''}>${typeLabel(t)}</option>`).join('')}
    </select></label>
    <label>Nilai tetap (Rp)<input name="value" type="number" min="0" step="1000" value="${l?.value||0}"></label>`;
  els.formDialog.showModal();
}
els.crudForm.addEventListener('submit',e=>{
  e.preventDefault(); const fd=new FormData(e.currentTarget);
  if(editing.type==='player'){
    const name=String(fd.get('name')).trim(); if(!name)return;
    if(editing.id) playerById(editing.id).name=name;
    else db.players.push({id:`P${String(db.playerSeq++).padStart(3,'0')}`,name});
  }else{
    const item={name:String(fd.get('name')).trim(),icon:String(fd.get('icon')||'🎁'),type:String(fd.get('type')),value:Number(fd.get('value')||0)};
    if(editing.id) Object.assign(lootById(editing.id),item);
    else db.loot.push({id:`L${String(db.lootSeq++).padStart(3,'0')}`,...item});
  }
  saveData(); els.formDialog.close(); renderManage(); render(); beep(720,.06);
});
function askConfirm(title,text,fn){
  els.confirmTitle.textContent=title; els.confirmText.textContent=text; confirmAction=fn; els.confirmDialog.showModal();
}
els.confirmYes.onclick=()=>{els.confirmDialog.close();confirmAction?.();confirmAction=null};
els.confirmNo.onclick=()=>{els.confirmDialog.close();confirmAction=null};
function exportData(){
  const blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='miau-heist-data.json';a.click();URL.revokeObjectURL(a.href);
}
async function importData(e){
  try{
    const parsed=JSON.parse(await e.target.files[0].text());
    if(!Array.isArray(parsed.players)||!Array.isArray(parsed.loot)) throw new Error();
    db=parsed; db.playerSeq ||= db.players.length+1; db.lootSeq ||= db.loot.length+1; db.theme||='light'; db.sound ??= true;
    saveData();applyTheme();renderManage();render();toast('Data berhasil di-import.');
  }catch{toast('JSON tidak valid.')}
  e.target.value='';
}

els.manageBtn.onclick=()=>{renderManage();els.manageDialog.showModal()};
document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{manageTab=t.dataset.tab;renderManage()});
els.formCloseBtn.onclick=els.formCancelBtn.onclick=()=>els.formDialog.close();
els.themeBtn.onclick=()=>{db.theme=db.theme==='dark'?'light':'dark';saveData();applyTheme()};
els.soundBtn.onclick=()=>{db.sound=!db.sound;els.soundBtn.textContent=db.sound?'🔊':'🔇';saveData();beep(700,.06)};
els.soundBtn.textContent=db.sound?'🔊':'🔇';

applyTheme();
render();
