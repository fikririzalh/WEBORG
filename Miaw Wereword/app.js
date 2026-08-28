
const STORAGE_KEY='miau-werewords-table-v1';
const $=s=>document.querySelector(s);
const E={
  app:$('#app'),themeBtn:$('#themeBtn'),soundBtn:$('#soundBtn'),guideBtn:$('#guideBtn'),manageBtn:$('#manageBtn'),
  manageDialog:$('#manageDialog'),manageContent:$('#manageContent'),
  formDialog:$('#formDialog'),crudForm:$('#crudForm'),formEyebrow:$('#formEyebrow'),
  formTitle:$('#formTitle'),formFields:$('#formFields'),formCloseBtn:$('#formCloseBtn'),formCancelBtn:$('#formCancelBtn'),
  guideDialog:$('#guideDialog'),guideContent:$('#guideContent'),
  tokenDialog:$('#tokenDialog'),tokenPlayer:$('#tokenPlayer'),tokenCloseBtn:$('#tokenCloseBtn'),
  toast:$('#toast')
};

let db=loadDB(),game=null,manageTab='players',editing=null,audioCtx=null,tokenTarget=null;

function clone(v){return JSON.parse(JSON.stringify(v))}
function esc(v=''){return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(db))}
function loadDB(){
  try{
    const x=JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(Array.isArray(x?.players)&&Array.isArray(x?.roles))return x
  }catch{}
  return {players:clone(SEED_PLAYERS),roles:clone(SEED_ROLES),theme:'light',sound:true,playerSeq:7,roleSeq:11}
}
function toast(m){
  E.toast.textContent=m;E.toast.classList.add('show');
  clearTimeout(toast.t);toast.t=setTimeout(()=>E.toast.classList.remove('show'),1800)
}
function beep(f=650,d=.06){
  if(!db.sound)return;
  try{
    audioCtx||=new(window.AudioContext||window.webkitAudioContext)();
    const o=audioCtx.createOscillator(),g=audioCtx.createGain();
    o.frequency.value=f;g.gain.setValueAtTime(.05,audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+d);
    o.connect(g).connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+d)
  }catch{}
}
function applyTheme(){
  document.documentElement.dataset.theme=db.theme;
  E.themeBtn.textContent=db.theme==='dark'?'☀️':'🌙';
  E.soundBtn.textContent=db.sound?'🔊':'🔇'
}
function p(id){return db.players.find(x=>x.id===id)}
function r(id){return db.roles.find(x=>x.id===id)}
function shuffle(a){
  const b=[...a];
  for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}
  return b
}
function standardCounts(n){
  const out={};
  db.roles.forEach(x=>out[x.id]=0);
  const vill=db.roles.find(x=>x.name==='Villager');
  const seer=db.roles.find(x=>x.name==='Seer');
  const wolf=db.roles.find(x=>x.name==='Werewolf');
  const wolves=n>=12?3:n>=7?2:1;
  if(seer)out[seer.id]=1;
  if(wolf)out[wolf.id]=Math.min(wolves,Math.max(0,n-1));
  if(vill)out[vill.id]=Math.max(0,n-1-(out[wolf?.id]||0));
  return out
}

function home(){
  return `<section class="hero">
    <div class="panel hero-main">
      <div class="eyebrow">TWO-DEVICE HYBRID</div>
      <div class="hero-title">Ask.<br>Point.<br>Suspect.</div>
      <p class="hero-copy">HP kedua menjalankan Werewords narrator dan Magic Word. Web ini menggantikan kartu role, Mayor card, serta tumpukan token jawaban.</p>
      <div class="button-row">
        <button class="primary-btn big" id="setupBtn">🧙 Mulai Ronde</button>
        <button class="secondary-btn big" id="homeManageBtn">⚙️ CRUD</button>
      </div>
      <div class="note"><b>Day Phase:</b> pertanyaan tetap verbal. Mayor tidak mengetik apa pun—cukup tap pemain yang bertanya lalu beri ✅ / ❌ / ❓.</div>
    </div>
    <div class="panel">
      <div class="eyebrow">WEB MENGGANTIKAN</div>
      <div class="rule-grid">
        <div class="rule"><b>🎩 Mayor</b><span>Satu pemain diberi status Mayor publik.</span></div>
        <div class="rule"><b>🃏 Secret Role</b><span>Semua pemain, termasuk Mayor, punya role rahasia.</span></div>
        <div class="rule"><b>✅ YES</b><span>Jawaban positif dari Mayor.</span></div>
        <div class="rule"><b>❌ NO</b><span>Jawaban negatif dari Mayor.</span></div>
        <div class="rule"><b>❓ MAYBE</b><span>Jawaban tidak pasti / tidak sederhana.</span></div>
        <div class="rule"><b>🔓 Role Reveal</b><span>Buka role individual saat endgame.</span></div>
      </div>
    </div>
  </section>`
}

function setupScreen(){
  const active=db.roles.filter(x=>x.enabled!==false);
  return `<section class="panel">
    <div class="eyebrow">SETUP ROUND</div><h2>Pilih pemain dan samakan role dengan HP narrator.</h2>
    <div class="player-select">${db.players.map((x,i)=>`<label class="player-check"><input type="checkbox" data-player="${x.id}" ${i<Math.min(6,db.players.length)?'checked':''}><span>${esc(x.name)}</span></label>`).join('')}</div>
    <div class="setup-grid">
      <label class="field">Mayor
        <select id="mayorMode"><option value="random">🎩 Random</option>${db.players.map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('')}</select>
      </label>
      <label class="field">Token YES/NO bersama<input id="yesNoStock" type="number" min="1" max="99" value="36"></label>
      <label class="field">Token MAYBE<input id="maybeStock" type="number" min="0" max="99" value="10"></label>
      <label class="field">Role aktif<input value="${active.length} role tersedia" disabled></label>
    </div>

    <div class="button-row"><button class="secondary-btn" id="autoRolesBtn">✨ Auto Standard</button></div>
    <div class="role-count-grid">
      ${active.map(role=>`<div class="role-count">
        <div class="role-count-top"><b>${role.emoji||'🃏'} ${esc(role.name)}</b><span>${esc(role.team)}</span></div>
        <input data-role-count="${role.id}" type="number" min="0" max="20" value="0">
      </div>`).join('')}
    </div>
    <div id="countNote" class="note">Tekan <b>Auto Standard</b> atau isi jumlah role manual. Total secret role harus sama dengan jumlah pemain terpilih.</div>
    <div class="button-row" style="margin-top:14px">
      <button class="primary-btn big" id="dealBtn">🎴 Deal Secret Roles</button>
      <button class="secondary-btn" id="cancelSetupBtn">Batal</button>
    </div>
  </section>`
}
function selectedPlayers(){return [...document.querySelectorAll('[data-player]:checked')].map(x=>x.dataset.player)}
function applyAutoRoleCounts(){
  const ids=selectedPlayers();
  if(ids.length<2)return toast('Pilih pemain dahulu.');
  const counts=standardCounts(ids.length);
  document.querySelectorAll('[data-role-count]').forEach(inp=>inp.value=counts[inp.dataset.roleCount]||0);
  updateCountNote()
}
function updateCountNote(){
  const n=selectedPlayers().length;
  const total=[...document.querySelectorAll('[data-role-count]')].reduce((s,x)=>s+(Number(x.value)||0),0);
  const note=$('#countNote');
  if(note)note.innerHTML=`Pemain terpilih: <b>${n}</b> • Secret role: <b>${total}</b> • ${n===total?'✅ siap deal':'⚠️ jumlah harus sama'}`;
}
function dealGame(){
  const ids=selectedPlayers();
  if(ids.length<4)return toast('Untuk mode utama, pilih minimal 4 pemain.');
  if(ids.length>20)return toast('Maksimal 20 pemain.');

  const roleCards=[];
  document.querySelectorAll('[data-role-count]').forEach(inp=>{
    const count=Math.max(0,Number(inp.value)||0);
    for(let i=0;i<count;i++)roleCards.push(inp.dataset.roleCount)
  });
  if(roleCards.length!==ids.length)return toast(`Secret role ${roleCards.length}; pemain ${ids.length}. Harus sama.`);

  let mayor=$('#mayorMode').value;
  if(mayor==='random')mayor=ids[Math.floor(Math.random()*ids.length)];
  if(!ids.includes(mayor))return toast('Mayor harus termasuk pemain yang dipilih.');

  const shuffled=shuffle(roleCards),assignments={};
  ids.forEach((id,i)=>assignments[id]=shuffled[i]);

  const yesNo=Number($('#yesNoStock').value),maybe=Number($('#maybeStock').value);
  if(!Number.isInteger(yesNo)||yesNo<1||!Number.isInteger(maybe)||maybe<0)return toast('Jumlah token tidak valid.');

  game={
    phase:'rolePass',playerIds:ids,mayorId:mayor,roles:assignments,roleIndex:0,
    answers:Object.fromEntries(ids.map(id=>[id,[]])),
    stock:{yesNoInitial:yesNo,yesNo,maybeInitial:maybe,maybe},
    tokenHistory:[],revealed:Object.fromEntries(ids.map(id=>[id,false]))
  };
  beep(720,.08);render()
}
function rolePass(){
  const id=game.playerIds[game.roleIndex];
  return `<section class="panel"><div class="pass-screen">
    <div class="big-emoji">📱🔒</div><div class="eyebrow">SECRET ROLE</div>
    ${id===game.mayorId?'<div class="mayor-badge">🎩 KAMU MAYOR</div>':''}
    <div class="player-name">${esc(p(id)?.name)}</div>
    <p class="hero-copy">Pastikan hanya pemain ini yang melihat layar.</p>
    <button class="primary-btn big" id="openRoleBtn">Saya ${esc(p(id)?.name)} → lihat role</button>
  </div></section>`
}
function roleReveal(){
  const id=game.playerIds[game.roleIndex],role=r(game.roles[id]);
  return `<section class="panel"><div class="private-screen">
    ${id===game.mayorId?'<div class="mayor-badge">🎩 MAYOR • STATUS PUBLIK</div>':''}
    <div class="role-card"><div class="role-emoji">${role?.emoji||'🃏'}</div><div class="eyebrow">SECRET ROLE</div>
      <h2>${esc(role?.name||'Unknown')}</h2><div class="team">${esc(role?.team||'')}</div>
      <p style="margin-top:12px">${esc(role?.job||'')}</p>
    </div>
    <div class="note">Set role yang sama di HP Werewords narrator. Jangan tunjukkan layar ke pemain lain.</div>
    <button class="primary-btn big" id="roleSeenBtn">✅ Sudah Hafal</button>
  </div></section>`
}
function readyScreen(){
  return `<section class="panel"><div class="private-screen ready-card">
    <div class="big-emoji">📱📱🧙</div><div class="eyebrow">ROLE SUDAH DIBAGI</div>
    <h2>Jalankan night phase di HP narrator.</h2>
    <p class="hero-copy">Mayor: <b>${esc(p(game.mayorId)?.name)}</b>. Web ini tidak perlu disentuh selama narrator membagikan Magic Word dan menjalankan night phase.</p>
    <div class="note">Setelah narrator mengatakan semua pemain bangun dan Day Timer dimulai, buka Answer Board di web ini.</div>
    <button class="primary-btn big" id="dayBoardBtn">☀️ Buka Answer Board</button>
  </div></section>`
}
function tokenEmoji(t){return t==='yes'?'✅':t==='no'?'❌':'❓'}
function dayBoard(){
  const low=game.stock.yesNo<=3;
  return `<div class="day-head">
    <div><div class="eyebrow">☀️ DAY PHASE</div><h2 style="margin-bottom:5px">Mayor: 🎩 ${esc(p(game.mayorId)?.name)}</h2><p class="muted">Pertanyaan verbal. Mayor hanya memberikan token.</p></div>
    <div class="stock-bar">
      <span class="stock ${low?'low':''}">✅/❌ ${game.stock.yesNo}/${game.stock.yesNoInitial}</span>
      <span class="stock">❓ ${game.stock.maybe}/${game.stock.maybeInitial}</span>
    </div>
  </div>
  <section class="panel">
    <div class="player-board">${game.playerIds.map(id=>{
      const isMayor=id===game.mayorId,ans=game.answers[id];
      return `<div class="answer-card ${isMayor?'mayor':''}">
        <div class="card-meta"><div class="card-name">${esc(p(id)?.name)}</div>${isMayor?'<span class="mini-badge">🎩 MAYOR</span>':''}</div>
        <div class="token-stream">${ans.length?ans.map(t=>`<span class="answer-token">${tokenEmoji(t)}</span>`).join(''):`<span class="empty-token">${isMayor?'Mayor menjawab, bukan bertanya.':'Belum mendapat token.'}</span>`}</div>
        ${isMayor?'<div class="mayor-note">Gunakan kartu pemain yang mengajukan pertanyaan.</div>':`<button class="primary-btn answer-btn" data-answer="${id}">+ Beri Token</button>`}
      </div>`
    }).join('')}</div>
    <div class="round-actions">
      <button class="secondary-btn" id="undoTokenBtn" ${game.tokenHistory.length?'':'disabled'}>↩ Undo Token Terakhir</button>
      <button class="secondary-btn" id="roleRevealModeBtn">🔐 Role Reveal / Endgame</button>
      <button class="danger-btn" id="endRoundBtn">✕ Selesai Ronde</button>
    </div>
    ${game.stock.yesNo===0?'<div class="note"><b>⚠️ YES/NO habis.</b> Gunakan opsi “No More Yes/No Tokens” pada HP Werewords narrator.</div>':''}
  </section>`
}
function addToken(id,type){
  if(type==='yes'||type==='no'){
    if(game.stock.yesNo<=0)return toast('Token YES/NO sudah habis.');
    game.stock.yesNo--
  }else{
    if(game.stock.maybe<=0)return toast('Token MAYBE sudah habis.');
    game.stock.maybe--
  }
  game.answers[id].push(type);
  game.tokenHistory.push({playerId:id,type});
  beep(type==='yes'?820:type==='no'?240:590,.05);
  E.tokenDialog.close();tokenTarget=null;render()
}
function undoToken(){
  const last=game.tokenHistory.pop();if(!last)return;
  const arr=game.answers[last.playerId];
  const idx=arr.lastIndexOf(last.type);if(idx>=0)arr.splice(idx,1);
  if(last.type==='maybe')game.stock.maybe++;else game.stock.yesNo++;
  beep(520,.05);render()
}
function roleRevealBoard(){
  return `<div class="day-head"><div><div class="eyebrow">🔐 ENDGAME ROLE BOARD</div><h2 style="margin-bottom:5px">Buka hanya saat narrator meminta.</h2><p class="muted">Klik kartu pemain untuk reveal individual. Tidak ada auto-winner di web.</p></div></div>
  <section class="panel">
    <div class="role-reveal-grid">${game.playerIds.map(id=>{
      const role=r(game.roles[id]),shown=game.revealed[id],wolf=role?.name==='Werewolf';
      return `<button class="hidden-role-card ${shown?'revealed':''} ${shown&&wolf?'wolf':''}" data-reveal="${id}" ${shown?'disabled':''}>
        ${shown?`<div class="role-emoji">${role?.emoji||'🃏'}</div><h3>${esc(p(id)?.name)}</h3><b>${esc(role?.name||'Unknown')}</b><span class="muted">${esc(role?.team||'')}</span>`:
        `<div class="lock">🔒</div><h3>${esc(p(id)?.name)}</h3>${id===game.mayorId?'<span class="mini-badge">🎩 MAYOR</span>':''}<span class="muted">Tap to reveal</span>`}
      </button>`
    }).join('')}</div>
    <div class="round-actions">
      <button class="secondary-btn" id="backDayBtn">← Answer Board</button>
      <button class="danger-btn" id="revealAllBtn">🔓 Reveal All</button>
      <button class="secondary-btn" id="newRoundBtn">↻ Ronde Baru</button>
    </div>
  </section>`
}
function render(){
  E.app.innerHTML=!game?home():
    game.phase==='setup'?setupScreen():
    game.phase==='rolePass'?rolePass():
    game.phase==='roleReveal'?roleReveal():
    game.phase==='ready'?readyScreen():
    game.phase==='roles'?roleRevealBoard():
    dayBoard();
  bind()
}
function bind(){
  $('#setupBtn')?.addEventListener('click',()=>{game={phase:'setup'};render();setTimeout(applyAutoRoleCounts,0)});
  $('#homeManageBtn')?.addEventListener('click',()=>{renderManage();E.manageDialog.showModal()});
  $('#cancelSetupBtn')?.addEventListener('click',()=>{game=null;render()});
  $('#autoRolesBtn')?.addEventListener('click',applyAutoRoleCounts);
  document.querySelectorAll('[data-player]').forEach(x=>x.addEventListener('change',updateCountNote));
  document.querySelectorAll('[data-role-count]').forEach(x=>x.addEventListener('input',updateCountNote));
  $('#dealBtn')?.addEventListener('click',dealGame);
  $('#openRoleBtn')?.addEventListener('click',()=>{game.phase='roleReveal';render()});
  $('#roleSeenBtn')?.addEventListener('click',()=>{
    game.roleIndex++;
    game.phase=game.roleIndex>=game.playerIds.length?'ready':'rolePass';render()
  });
  $('#dayBoardBtn')?.addEventListener('click',()=>{game.phase='day';render()});
  document.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{
    tokenTarget=b.dataset.answer;E.tokenPlayer.textContent=p(tokenTarget)?.name||tokenTarget;E.tokenDialog.showModal()
  });
  $('#undoTokenBtn')?.addEventListener('click',undoToken);
  $('#roleRevealModeBtn')?.addEventListener('click',()=>{game.phase='roles';render()});
  $('#endRoundBtn')?.addEventListener('click',()=>{if(confirm('Akhiri ronde dan kembali ke menu?')){game=null;render()}});
  document.querySelectorAll('[data-reveal]').forEach(b=>b.onclick=()=>{
    game.revealed[b.dataset.reveal]=true;beep(780,.07);render()
  });
  $('#backDayBtn')?.addEventListener('click',()=>{game.phase='day';render()});
  $('#revealAllBtn')?.addEventListener('click',()=>{
    if(confirm('Reveal semua secret role?')){game.playerIds.forEach(id=>game.revealed[id]=true);beep(900,.09);render()}
  });
  $('#newRoundBtn')?.addEventListener('click',()=>{game={phase:'setup'};render();setTimeout(applyAutoRoleCounts,0)})
}

function renderGuide(){
  const roles=[...db.roles].sort((a,b)=>a.name.localeCompare(b.name,'id'));
  E.guideContent.innerHTML=`
    <div class="note"><b>HP 2:</b> Werewords narrator mengurus Magic Word, night narration, role wake-up, dan timer. <b>HP 1:</b> web ini mengurus pemain, secret role, Mayor, dan token.</div>
    <div class="guide-list" style="margin-top:12px">${roles.map(x=>`<div class="guide-row">
      <div class="guide-emoji">${x.emoji||'🃏'}</div>
      <div><div class="crud-title">${esc(x.name)} ${x.enabled===false?'(OFF)':''}</div><div class="crud-meta">${esc(x.job)}</div></div>
      <div class="guide-team">${esc(x.team)}</div>
    </div>`).join('')}</div>`
}
function renderManage(q=''){
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===manageTab));
  if(manageTab==='players')return managePlayers(q);
  if(manageTab==='roles')return manageRoles(q);
  manageData()
}
function managePlayers(q=''){
  q=q.toLowerCase();const arr=db.players.filter(x=>(x.id+' '+x.name).toLowerCase().includes(q));
  E.manageContent.innerHTML=`<div class="manage-tools"><input id="manageSearch" class="search" value="${esc(q)}" placeholder="Cari P001 / nama..."><button id="addPlayerBtn" class="primary-btn">+ Pemain</button></div>
  <div class="crud-list">${arr.map(x=>`<div class="crud-row"><div><div class="crud-title">${esc(x.name)}</div><div class="crud-meta">${x.id}</div></div>
  <div class="crud-actions"><button data-ep="${x.id}">✏️</button><button data-dp="${x.id}">🗑️</button></div></div>`).join('')||'<div class="note">Tidak ada pemain.</div>'}</div>`;
  $('#manageSearch').oninput=e=>managePlayers(e.target.value);$('#addPlayerBtn').onclick=()=>openPlayer();
  document.querySelectorAll('[data-ep]').forEach(b=>b.onclick=()=>openPlayer(b.dataset.ep));
  document.querySelectorAll('[data-dp]').forEach(b=>b.onclick=()=>{if(confirm('Hapus pemain?')){db.players=db.players.filter(x=>x.id!==b.dataset.dp);save();managePlayers();render()}})
}
function manageRoles(q=''){
  q=q.toLowerCase();const arr=db.roles.filter(x=>(`${x.id} ${x.name} ${x.team} ${x.job}`).toLowerCase().includes(q));
  E.manageContent.innerHTML=`<div class="manage-tools"><input id="manageSearch" class="search" value="${esc(q)}" placeholder="Cari R001 / role / tim..."><button id="addRoleBtn" class="primary-btn">+ Role</button></div>
  <div class="crud-list">${arr.map(x=>`<div class="crud-row"><div><div class="crud-title">${x.emoji||'🃏'} ${esc(x.name)} ${x.enabled===false?'(OFF)':''}</div><div class="crud-meta">${x.id} • ${esc(x.team)}</div></div>
  <div class="crud-actions"><button data-er="${x.id}">✏️</button><button data-dr="${x.id}">🗑️</button></div></div>`).join('')||'<div class="note">Tidak ada role.</div>'}</div>`;
  $('#manageSearch').oninput=e=>manageRoles(e.target.value);$('#addRoleBtn').onclick=()=>openRole();
  document.querySelectorAll('[data-er]').forEach(b=>b.onclick=()=>openRole(b.dataset.er));
  document.querySelectorAll('[data-dr]').forEach(b=>b.onclick=()=>{if(confirm('Hapus role?')){db.roles=db.roles.filter(x=>x.id!==b.dataset.dr);save();manageRoles();renderGuide();render()}})
}
function manageData(){
  E.manageContent.innerHTML=`<div class="panel" style="box-shadow:none"><h3>Backup & Reset</h3><p class="hero-copy">CRUD tersimpan di localStorage browser.</p>
  <div class="button-row"><button id="exportBtn" class="primary-btn">⬇️ Export JSON</button><label class="secondary-btn">⬆️ Import JSON<input id="importInput" type="file" accept=".json" hidden></label><button id="resetBtn" class="danger-btn">♻️ Reset Seed</button></div></div>`;
  $('#exportBtn').onclick=exportData;$('#importInput').onchange=importData;
  $('#resetBtn').onclick=()=>{if(confirm('Reset pemain dan role ke seed?')){db={players:clone(SEED_PLAYERS),roles:clone(SEED_ROLES),theme:db.theme,sound:db.sound,playerSeq:7,roleSeq:11};save();renderManage();renderGuide();render();toast('Seed dipulihkan.')}}
}
function openPlayer(id=null){
  editing={type:'player',id};const x=id?p(id):null;E.formEyebrow.textContent=x?x.id:'PEMAIN BARU';E.formTitle.textContent=x?'Edit Pemain':'Tambah Pemain';
  E.formFields.innerHTML=`<label>Nama<input name="name" required maxlength="30" value="${esc(x?.name||'')}"></label>`;E.formDialog.showModal()
}
function openRole(id=null){
  editing={type:'role',id};const x=id?r(id):null;E.formEyebrow.textContent=x?x.id:'ROLE BARU';E.formTitle.textContent=x?'Edit Role':'Tambah Role';
  E.formFields.innerHTML=`<label>Nama<input name="name" required maxlength="40" value="${esc(x?.name||'')}"></label>
  <label>Emoji<input name="emoji" maxlength="4" value="${esc(x?.emoji||'🃏')}"></label>
  <label>Tim<input name="team" required maxlength="40" value="${esc(x?.team||'Village')}"></label>
  <label class="check-row"><input name="enabled" type="checkbox" ${x?.enabled!==false?'checked':''}> Tampil di setup</label>
  <label>Job ringkas<textarea name="job" required maxlength="300">${esc(x?.job||'')}</textarea></label>`;E.formDialog.showModal()
}
E.crudForm.onsubmit=e=>{
  e.preventDefault();const f=new FormData(e.currentTarget);
  if(editing.type==='player'){
    const data={name:String(f.get('name')).trim()};if(editing.id)Object.assign(p(editing.id),data);else db.players.push({id:`P${String(db.playerSeq++).padStart(3,'0')}`,...data})
  }else{
    const data={name:String(f.get('name')).trim(),emoji:String(f.get('emoji')||'🃏'),team:String(f.get('team')).trim(),enabled:f.get('enabled')==='on',job:String(f.get('job')).trim()};
    if(editing.id)Object.assign(r(editing.id),data);else db.roles.push({id:`R${String(db.roleSeq++).padStart(3,'0')}`,...data})
  }
  save();E.formDialog.close();renderManage();renderGuide();render();beep(720,.05);toast('Tersimpan.')
}
function exportData(){
  const b=new Blob([JSON.stringify(db,null,2)],{type:'application/json'}),a=document.createElement('a');
  a.href=URL.createObjectURL(b);a.download='miau-werewords-data.json';a.click();URL.revokeObjectURL(a.href)
}
async function importData(e){
  try{
    const x=JSON.parse(await e.target.files[0].text());if(!Array.isArray(x.players)||!Array.isArray(x.roles))throw 0;
    db=x;db.theme||='light';db.sound??=true;
    db.playerSeq||=Math.max(0,...db.players.map(y=>Number(String(y.id).replace(/\D/g,''))||0))+1;
    db.roleSeq||=Math.max(0,...db.roles.map(y=>Number(String(y.id).replace(/\D/g,''))||0))+1;
    save();applyTheme();renderManage();renderGuide();render();toast('Import berhasil.')
  }catch{toast('JSON tidak valid.')}e.target.value=''
}

E.manageBtn.onclick=()=>{renderManage();E.manageDialog.showModal()};
E.guideBtn.onclick=()=>{renderGuide();E.guideDialog.showModal()};
document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{manageTab=t.dataset.tab;renderManage()});
E.formCloseBtn.onclick=E.formCancelBtn.onclick=()=>E.formDialog.close();
E.tokenCloseBtn.onclick=()=>{E.tokenDialog.close();tokenTarget=null};
document.querySelectorAll('[data-token]').forEach(b=>b.onclick=()=>{if(tokenTarget)addToken(tokenTarget,b.dataset.token)});
E.themeBtn.onclick=()=>{db.theme=db.theme==='dark'?'light':'dark';save();applyTheme()};
E.soundBtn.onclick=()=>{db.sound=!db.sound;save();applyTheme();beep(700,.05)};

applyTheme();renderGuide();render();
