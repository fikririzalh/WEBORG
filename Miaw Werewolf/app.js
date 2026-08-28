
const STORAGE_KEY='miau-one-night-two-device-v2';
const $=s=>document.querySelector(s);
const E={
  app:$('#app'),themeBtn:$('#themeBtn'),soundBtn:$('#soundBtn'),guideBtn:$('#guideBtn'),manageBtn:$('#manageBtn'),
  manageDialog:$('#manageDialog'),manageContent:$('#manageContent'),formDialog:$('#formDialog'),crudForm:$('#crudForm'),
  formEyebrow:$('#formEyebrow'),formTitle:$('#formTitle'),formFields:$('#formFields'),formCloseBtn:$('#formCloseBtn'),
  formCancelBtn:$('#formCancelBtn'),guideDialog:$('#guideDialog'),guideContent:$('#guideContent'),
  peekDialog:$('#peekDialog'),peekTitle:$('#peekTitle'),peekContent:$('#peekContent'),closePeekBtn:$('#closePeekBtn'),toast:$('#toast')
};

let db=loadDB(),game=null,manageTab='players',editing=null,audioCtx=null;
let privateTurnLog=[],privateUndoStack=[];

function clone(v){return JSON.parse(JSON.stringify(v))}
function esc(v=''){return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(db))}
function loadDB(){
  try{const x=JSON.parse(localStorage.getItem(STORAGE_KEY));if(Array.isArray(x?.players)&&Array.isArray(x?.roles))return x}catch{}
  return {players:clone(SEED_PLAYERS),roles:clone(SEED_ROLES),theme:'light',sound:true,playerSeq:6,roleSeq:13}
}
function toast(m){E.toast.textContent=m;E.toast.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>E.toast.classList.remove('show'),1700)}
function beep(f=650,d=.06){if(!db.sound)return;try{audioCtx||=new(window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.frequency.value=f;g.gain.setValueAtTime(.05,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+d);o.connect(g).connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+d)}catch{}}
function applyTheme(){document.documentElement.dataset.theme=db.theme;E.themeBtn.textContent=db.theme==='dark'?'☀️':'🌙';E.soundBtn.textContent=db.sound?'🔊':'🔇'}
function p(id){return db.players.find(x=>x.id===id)}
function r(id){return db.roles.find(x=>x.id===id)}
function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}
function cardPool(){const out=[];db.roles.filter(x=>x.enabled!==false).forEach(role=>{for(let i=0;i<Math.max(0,Number(role.copies)||0);i++)out.push({instance:`${role.id}#${i+1}`,roleId:role.id})});return out}
function locationLabel(loc){return loc.startsWith('M')?`Middle ${loc.slice(1)}`:(p(loc)?.name||loc)}
function allLocs(){return game?[...game.playerIds,'M1','M2','M3']:[]}
function locOptions(){return allLocs().map(id=>`<option value="${id}">${esc(locationLabel(id))}</option>`).join('')}
function roleOptions(selected=''){return `<option value="">Belum tahu</option>`+db.roles.map(x=>`<option value="${x.id}" ${selected===x.id?'selected':''}>${esc(x.name)}</option>`).join('')}

function home(){
 return `<section class="hero">
  <div class="panel hero-main">
    <div class="eyebrow">TWO-DEVICE MODE</div>
    <div class="hero-title">Narrator bicara.<br>Web diam.</div>
    <p class="hero-copy">HP kedua menjalankan audio narrator. Web ini hanya membagi role, menyimpan posisi kartu, lalu menjadi meja untuk PEEK/SWAP. Saat narrator memanggil role-mu, bangun dan tekan namamu sendiri.</p>
    <div class="button-row"><button class="primary-btn big" id="setupBtn">🌙 Mulai Ronde</button><button class="secondary-btn big" id="homeManageBtn">⚙️ CRUD</button></div>
    <div class="note">Tidak ada timer, wake order, atau current-role di web ini. Jika sebuah role berada di Middle, tak ada pemain yang menekan nama—narrator HP kedua akan lanjut sendiri.</div>
  </div>
  <div class="panel">
   <div class="eyebrow">FLOW</div>
   <div class="rule-grid">
    <div class="rule"><b>1. Deal</b><span>Pemain + 3 Middle.</span></div>
    <div class="rule"><b>2. Hafal Role</b><span>P1 → Pn hanya untuk pembagian rahasia.</span></div>
    <div class="rule"><b>3. Night Table</b><span>Semua nama tampil terus.</span></div>
    <div class="rule"><b>4. Wake & Click</b><span>Dipanggil narrator → tekan namamu.</span></div>
    <div class="rule"><b>5. Free Move</b><span>PEEK 1 / PEEK 2 / SWAP.</span></div>
    <div class="rule"><b>6. Discussion</b><span>Dugaan → vote fisik → reveal.</span></div>
   </div>
  </div>
 </section>`
}
function setupScreen(){
 const pool=cardPool();
 return `<section class="panel"><div class="eyebrow">SETUP</div><h2>Pilih 3–10 pemain.</h2>
  <div class="player-select">${db.players.map((x,i)=>`<label class="player-check"><input type="checkbox" data-player="${x.id}" ${i<Math.min(4,db.players.length)?'checked':''}> <span>${esc(x.name)}</span></label>`).join('')}</div>
  <div class="setup-grid"><label class="field">Deal mode<select id="dealMode"><option value="random">Random dari semua role aktif</option><option value="wolf">Pastikan 2 Werewolf jika tersedia</option></select></label>
  <label class="field">Pool aktif<input value="${pool.length} kartu fisik" disabled></label></div>
  <div class="note">Web mengambil tepat <b>jumlah pemain + 3</b> kartu.</div>
  <div class="button-row" style="margin-top:14px"><button class="primary-btn big" id="dealBtn">🎲 Deal Role</button><button class="secondary-btn" id="cancelSetupBtn">Batal</button></div>
 </section>`
}
function dealGame(){
 const ids=[...document.querySelectorAll('[data-player]:checked')].map(x=>x.dataset.player);
 if(ids.length<3)return toast('Minimal 3 pemain.');
 if(ids.length>10)return toast('Maksimal 10 pemain.');
 const need=ids.length+3;let pool=cardPool(),chosen=[];
 if(pool.length<need)return toast(`Pool kurang: butuh ${need} kartu.`);
 if($('#dealMode').value==='wolf'){
   const wolves=pool.filter(x=>r(x.roleId)?.name==='Werewolf').slice(0,2);
   chosen.push(...wolves);const used=new Set(wolves.map(x=>x.instance));pool=pool.filter(x=>!used.has(x.instance))
 }
 chosen.push(...shuffle(pool).slice(0,need-chosen.length));chosen=shuffle(chosen).slice(0,need);
 const locations={},initialRoles={},locs=[...ids,'M1','M2','M3'];
 locs.forEach((loc,i)=>locations[loc]=chosen[i].roleId);ids.forEach(id=>initialRoles[id]=locations[id]);
 game={phase:'rolePass',playerIds:ids,locations,initialRoles,roleIndex:0,selectedIdentity:null,guesses:{},revealed:false};
 allLocs().forEach(loc=>game.guesses[loc]='');beep(720,.08);render()
}
function rolePass(){
 const id=game.playerIds[game.roleIndex];
 return `<section class="panel"><div class="pass-screen"><div class="big-emoji">📱🔒</div><div class="eyebrow">PEMBAGIAN ROLE</div><div class="player-name">${esc(p(id)?.name)}</div><p class="hero-copy">Berikan web hanya kepada pemain ini.</p><button class="primary-btn big" id="openRoleBtn">Saya ${esc(p(id)?.name)} → lihat role</button></div></section>`
}
function roleReveal(){
 const id=game.playerIds[game.roleIndex],role=r(game.initialRoles[id]);
 return `<section class="panel"><div class="private-screen"><div class="role-card"><div class="role-emoji">${role?.emoji||'🃏'}</div><div class="eyebrow">ROLE AWALMU</div><h2>${esc(role?.name||'Unknown')}</h2><div class="team">${esc(role?.team||'')}</div><p style="margin-top:12px">${esc(role?.job||'')}</p></div><div class="note">Hafalkan role ini. Saat HP narrator memanggil role-mu, bangun lalu tekan namamu di Night Table.</div><button class="primary-btn big" id="roleSeenBtn">✅ Sudah Hafal</button></div></section>`
}
function nightTable(){
 return `<section class="panel">
  <div class="night-head"><div class="eyebrow">🌙 NIGHT TABLE</div><h2>Dengarkan narrator di HP kedua.</h2><p class="hero-copy">Semua tutup mata. Saat role awalmu dipanggil, bangun dan tekan <b>namamu sendiri</b>.</p></div>
  <div class="night-players">${game.playerIds.map(id=>`<button class="night-player" data-identity="${id}"><div class="avatar">😺</div><b>${esc(p(id)?.name)}</b><span>Tekan jika narrator memanggil role-mu</span></button>`).join('')}</div>
  <div class="middle-closed"><span class="middle-chip">🔒 Middle 1</span><span class="middle-chip">🔒 Middle 2</span><span class="middle-chip">🔒 Middle 3</span></div>
  <div class="note">Role yang ada di Middle tidak membutuhkan apa pun dari web. Tidak ada pemain yang bangun/menekan nama untuk role itu.</div>
  <div class="button-row" style="justify-content:center;margin-top:14px"><button class="secondary-btn" id="discussionBtn">☀️ Narasi Selesai → Diskusi</button></div>
 </section>`
}
function identityConfirm(){
 const id=game.selectedIdentity;
 return `<section class="panel"><div class="private-screen"><div class="identity-confirm"><div class="big-emoji">🔒😺</div><div class="eyebrow">PRIVATE ACTION</div><h2>${esc(p(id)?.name)}</h2><p>Pastikan hanya kamu yang melihat layar.</p><div class="button-row" style="justify-content:center"><button class="primary-btn big" id="confirmIdentityBtn">Saya ${esc(p(id)?.name)}</button><button class="secondary-btn" id="cancelIdentityBtn">Kembali</button></div></div></div></section>`
}
function actionConsole(){
 const id=game.selectedIdentity,role=r(game.initialRoles[id]);
 return `<section class="panel">
  <div class="status-bar"><span class="pill">🌙 PRIVATE</span><span class="pill">😺 ${esc(p(id)?.name)}</span><span class="pill">${role?.emoji||'🃏'} ${esc(role?.name||'')}</span></div>
  <div class="role-card"><div class="role-emoji">${role?.emoji||'🃏'}</div><div class="eyebrow">ROLE AWAL</div><h2>${esc(role?.name||'Unknown')}</h2><div class="team">${esc(role?.team||'')}</div><p style="margin-top:12px">${esc(role?.job||'')}</p></div>
  <div class="note"><b>FREE MOVE:</b> web tidak memvalidasi aturan role. PEEK/SWAP sebanyak apa pun tetap bisa dilakukan. Ikuti job role dan narrator dengan jujur.</div>
  <div class="free-tools">
    <div class="tool-box"><h3>👁 PEEK 1</h3><p>Lihat satu kartu pada state saat ini.</p><label class="field">Lokasi<select id="peekOneLoc">${locOptions()}</select></label><button class="primary-btn" id="peekOneBtn">Lihat</button></div>
    <div class="tool-box"><h3>👁👁 PEEK 2</h3><p>Lihat dua kartu sekaligus.</p><label class="field">A<select id="peekTwoA">${locOptions()}</select></label><label class="field">B<select id="peekTwoB">${locOptions()}</select></label><button class="primary-btn" id="peekTwoBtn">Lihat 2</button></div>
    <div class="tool-box"><h3>🔄 SWAP</h3><p>Tukar kartu dua posisi mana pun.</p><label class="field">A<select id="swapA">${locOptions()}</select></label><label class="field">B<select id="swapB">${locOptions()}</select></label><button class="danger-btn" id="swapBtn">Swap</button></div>
  </div>
  <div class="action-log">${privateTurnLog.length?privateTurnLog.map(x=>`<div class="log-row">${esc(x)}</div>`).join(''):'<div class="log-row">Belum ada aksi pada sesi ini.</div>'}</div>
  <div class="button-row"><button class="secondary-btn" id="undoBtn" ${!privateUndoStack.length?'disabled':''}>↩ Undo swap terakhir</button><button class="primary-btn big" id="finishActionBtn">✅ Selesai → Tutup Mata</button></div>
 </section>`
}
function showPeek(locs){
 const cards=locs.map(loc=>({loc,role:r(game.locations[loc])}));
 E.peekTitle.textContent=locs.length===1?locationLabel(locs[0]):'Dua kartu';
 E.peekContent.innerHTML=`<div class="${locs.length===2?'two-peek':''}">${cards.map(x=>`<div class="peek-role"><div class="role-emoji">${x.role?.emoji||'🃏'}</div><div class="eyebrow">${esc(locationLabel(x.loc))}</div><h2>${esc(x.role?.name||'Unknown')}</h2><p>${esc(x.role?.team||'')}</p></div>`).join('')}</div><div class="note">Tutup sebelum pemain lain membuka mata.</div>`;
 E.peekDialog.showModal();beep(830,.05)
}
function discussion(){
 const card=(loc,middle)=>{
   const actual=r(game.locations[loc]),guess=game.guesses[loc],cls=game.revealed?(guess&&guess===game.locations[loc]?'correct':guess?'wrong':''):'';
   return `<div class="board-card ${middle?'middle':''} ${cls}"><div class="slot-title">${middle?'MIDDLE':'PLAYER'}</div><div class="slot-name">${esc(locationLabel(loc))}</div>
   ${game.revealed?`<div class="actual-card"><div class="role-emoji">${actual?.emoji||'🃏'}</div><b>${esc(actual?.name||'Unknown')}</b><span>${esc(actual?.team||'')}</span></div>`:`<div class="hidden-card"><div class="lock">🔒</div><span>ROLE TERTUTUP</span></div>`}
   <div class="guess-label">DUGAAN</div><select data-guess="${loc}" ${game.revealed?'disabled':''}>${roleOptions(guess)}</select></div>`
 };
 return `<div class="discussion-head"><div class="eyebrow">${game.revealed?'FINAL REVEAL':'☀️ DISCUSSION'}</div><h2>${game.revealed?'Posisi kartu final.':'Diskusi, bluff, dan isi Dugaan.'}</h2><p class="hero-copy">Dropdown Dugaan tidak pernah mengubah kartu asli.</p></div>
 <section class="panel"><h3 style="text-align:center">Middle</h3><div class="middle-grid">${['M1','M2','M3'].map(x=>card(x,true)).join('')}</div><h3 style="text-align:center">Players</h3><div class="board-grid">${game.playerIds.map(x=>card(x,false)).join('')}</div>
 <div class="button-row" style="justify-content:center;margin-top:16px">${game.revealed?`<button class="primary-btn big" id="newRoundBtn">🌙 Ronde Baru</button><button class="secondary-btn" id="endBtn">⌂ Menu</button>`:`<button class="secondary-btn" id="voteBtn">🗳 3…2…1… Tunjuk!</button><button class="primary-btn big" id="revealBtn">🔓 Reveal All</button><button class="secondary-btn" id="backNightBtn">🌙 Kembali ke Night Table</button>`}</div></section>`
}
function render(){
 E.app.innerHTML=!game?home():
 game.phase==='setup'?setupScreen():
 game.phase==='rolePass'?rolePass():
 game.phase==='roleReveal'?roleReveal():
 game.phase==='night'?nightTable():
 game.phase==='identity'?identityConfirm():
 game.phase==='action'?actionConsole():
 discussion();
 bind()
}
function bind(){
 $('#setupBtn')?.addEventListener('click',()=>{game={phase:'setup'};render()});
 $('#homeManageBtn')?.addEventListener('click',()=>{renderManage();E.manageDialog.showModal()});
 $('#cancelSetupBtn')?.addEventListener('click',()=>{game=null;render()});
 $('#dealBtn')?.addEventListener('click',dealGame);
 $('#openRoleBtn')?.addEventListener('click',()=>{game.phase='roleReveal';render()});
 $('#roleSeenBtn')?.addEventListener('click',()=>{game.roleIndex++;if(game.roleIndex>=game.playerIds.length){game.phase='night'}else game.phase='rolePass';render()});
 document.querySelectorAll('[data-identity]').forEach(b=>b.onclick=()=>{game.selectedIdentity=b.dataset.identity;privateTurnLog=[];privateUndoStack=[];game.phase='identity';render()});
 $('#confirmIdentityBtn')?.addEventListener('click',()=>{game.phase='action';render()});
 $('#cancelIdentityBtn')?.addEventListener('click',()=>{game.selectedIdentity=null;game.phase='night';render()});
 $('#peekOneBtn')?.addEventListener('click',()=>{const loc=$('#peekOneLoc').value;privateTurnLog.push(`👁 PEEK ${locationLabel(loc)}`);showPeek([loc])});
 $('#peekTwoBtn')?.addEventListener('click',()=>{const a=$('#peekTwoA').value,b=$('#peekTwoB').value;if(a===b)return toast('Pilih dua lokasi berbeda.');privateTurnLog.push(`👁👁 PEEK ${locationLabel(a)} + ${locationLabel(b)}`);showPeek([a,b])});
 $('#swapBtn')?.addEventListener('click',()=>{const a=$('#swapA').value,b=$('#swapB').value;if(a===b)return toast('Pilih dua lokasi berbeda.');privateUndoStack.push(clone(game.locations));const t=game.locations[a];game.locations[a]=game.locations[b];game.locations[b]=t;privateTurnLog.push(`🔄 ${locationLabel(a)} ↔ ${locationLabel(b)}`);beep(260,.07);render()});
 $('#undoBtn')?.addEventListener('click',()=>{if(!privateUndoStack.length)return;game.locations=privateUndoStack.pop();privateTurnLog.push('↩ Undo swap terakhir');render()});
 $('#finishActionBtn')?.addEventListener('click',()=>{privateTurnLog=[];privateUndoStack=[];game.selectedIdentity=null;game.phase='night';render()});
 $('#discussionBtn')?.addEventListener('click',()=>{if(confirm('Narasi malam di HP kedua sudah selesai?')){game.phase='discussion';render()}});
 document.querySelectorAll('[data-guess]').forEach(sel=>sel.onchange=()=>game.guesses[sel.dataset.guess]=sel.value);
 $('#voteBtn')?.addEventListener('click',()=>toast('3… 2… 1… 👉 TUNJUK!'));
 $('#revealBtn')?.addEventListener('click',()=>{game.revealed=true;beep(920,.1);render()});
 $('#backNightBtn')?.addEventListener('click',()=>{game.phase='night';render()});
 $('#newRoundBtn')?.addEventListener('click',()=>{game={phase:'setup'};render()});
 $('#endBtn')?.addEventListener('click',()=>{game=null;render()})
}
function renderGuide(){
 const list=[...db.roles].sort((a,b)=>a.name.localeCompare(b.name,'id'));
 E.guideContent.innerHTML=`<div class="note">Narrator HP kedua menentukan kapan role bangun. Guide ini hanya membantu pemain mengingat job sebelum memakai Free Move.</div><div class="guide-list" style="margin-top:12px">${list.map(x=>`<div class="guide-row"><div class="guide-emoji">${x.emoji||'🃏'}</div><div><div class="crud-title">${esc(x.name)}</div><div class="crud-meta">${esc(x.job)}</div></div><div class="guide-team">${esc(x.team)} • copies ${x.copies}</div></div>`).join('')}</div>`
}
function renderManage(q=''){
 document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===manageTab));
 if(manageTab==='players')return managePlayers(q);if(manageTab==='roles')return manageRoles(q);manageData()
}
function managePlayers(q=''){
 q=q.toLowerCase();const arr=db.players.filter(x=>(x.id+' '+x.name).toLowerCase().includes(q));
 E.manageContent.innerHTML=`<div class="manage-tools"><input id="manageSearch" class="search" value="${esc(q)}" placeholder="Cari P001 / nama..."><button id="addPlayerBtn" class="primary-btn">+ Pemain</button></div><div class="crud-list">${arr.map(x=>`<div class="crud-row"><div><div class="crud-title">${esc(x.name)}</div><div class="crud-meta">${x.id}</div></div><div class="crud-actions"><button data-ep="${x.id}">✏️</button><button data-dp="${x.id}">🗑️</button></div></div>`).join('')}</div>`;
 $('#manageSearch').oninput=e=>managePlayers(e.target.value);$('#addPlayerBtn').onclick=()=>openPlayer();document.querySelectorAll('[data-ep]').forEach(b=>b.onclick=()=>openPlayer(b.dataset.ep));document.querySelectorAll('[data-dp]').forEach(b=>b.onclick=()=>{if(confirm('Hapus pemain?')){db.players=db.players.filter(x=>x.id!==b.dataset.dp);save();managePlayers();render()}})
}
function manageRoles(q=''){
 q=q.toLowerCase();const arr=db.roles.filter(x=>(`${x.id} ${x.name} ${x.team} ${x.job}`).toLowerCase().includes(q));
 E.manageContent.innerHTML=`<div class="manage-tools"><input id="manageSearch" class="search" value="${esc(q)}" placeholder="Cari R001 / role / tim..."><button id="addRoleBtn" class="primary-btn">+ Role</button></div><div class="crud-list">${arr.map(x=>`<div class="crud-row"><div><div class="crud-title">${x.emoji||'🃏'} ${esc(x.name)} ${x.enabled===false?'(OFF)':''}</div><div class="crud-meta">${x.id} • ${esc(x.team)} • copies ${x.copies}</div></div><div class="crud-actions"><button data-er="${x.id}">✏️</button><button data-dr="${x.id}">🗑️</button></div></div>`).join('')}</div>`;
 $('#manageSearch').oninput=e=>manageRoles(e.target.value);$('#addRoleBtn').onclick=()=>openRole();document.querySelectorAll('[data-er]').forEach(b=>b.onclick=()=>openRole(b.dataset.er));document.querySelectorAll('[data-dr]').forEach(b=>b.onclick=()=>{if(confirm('Hapus role?')){db.roles=db.roles.filter(x=>x.id!==b.dataset.dr);save();manageRoles();renderGuide();render()}})
}
function manageData(){
 E.manageContent.innerHTML=`<div class="panel" style="box-shadow:none"><h3>Backup & Reset</h3><p class="hero-copy">Pemain dan role tersimpan di localStorage.</p><div class="button-row"><button id="exportBtn" class="primary-btn">⬇️ Export JSON</button><label class="secondary-btn">⬆️ Import JSON<input id="importInput" type="file" accept=".json" hidden></label><button id="resetDataBtn" class="danger-btn">♻️ Reset Seed</button></div></div>`;
 $('#exportBtn').onclick=exportData;$('#importInput').onchange=importData;$('#resetDataBtn').onclick=()=>{if(confirm('Reset CRUD ke seed?')){db={players:clone(SEED_PLAYERS),roles:clone(SEED_ROLES),theme:db.theme,sound:db.sound,playerSeq:6,roleSeq:13};save();renderManage();renderGuide();render()}}
}
function openPlayer(id=null){editing={type:'player',id};const x=id?p(id):null;E.formEyebrow.textContent=x?x.id:'PEMAIN BARU';E.formTitle.textContent=x?'Edit Pemain':'Tambah Pemain';E.formFields.innerHTML=`<label>Nama<input name="name" required maxlength="30" value="${esc(x?.name||'')}"></label>`;E.formDialog.showModal()}
function openRole(id=null){editing={type:'role',id};const x=id?r(id):null;E.formEyebrow.textContent=x?x.id:'ROLE BARU';E.formTitle.textContent=x?'Edit Role':'Tambah Role';E.formFields.innerHTML=`<label>Nama<input name="name" required maxlength="40" value="${esc(x?.name||'')}"></label><label>Emoji<input name="emoji" maxlength="4" value="${esc(x?.emoji||'🃏')}"></label><label>Tim<input name="team" required maxlength="40" value="${esc(x?.team||'Tim Warga')}"></label><label>Copies<input name="copies" type="number" min="1" max="10" value="${x?.copies||1}"></label><label class="check-row"><input name="enabled" type="checkbox" ${x?.enabled!==false?'checked':''}> Aktif di random pool</label><label>Job ringkas<textarea name="job" required maxlength="300">${esc(x?.job||'')}</textarea></label>`;E.formDialog.showModal()}
E.crudForm.onsubmit=e=>{e.preventDefault();const f=new FormData(e.currentTarget);if(editing.type==='player'){const data={name:String(f.get('name')).trim()};if(editing.id)Object.assign(p(editing.id),data);else db.players.push({id:`P${String(db.playerSeq++).padStart(3,'0')}`,...data})}else{const data={name:String(f.get('name')).trim(),emoji:String(f.get('emoji')||'🃏'),team:String(f.get('team')).trim(),copies:Number(f.get('copies')||1),enabled:f.get('enabled')==='on',job:String(f.get('job')).trim()};if(editing.id)Object.assign(r(editing.id),data);else db.roles.push({id:`R${String(db.roleSeq++).padStart(3,'0')}`,...data})}save();E.formDialog.close();renderManage();renderGuide();render();toast('Tersimpan.')}
function exportData(){const b=new Blob([JSON.stringify(db,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='miau-one-night-two-device-data.json';a.click();URL.revokeObjectURL(a.href)}
async function importData(e){try{const x=JSON.parse(await e.target.files[0].text());if(!Array.isArray(x.players)||!Array.isArray(x.roles))throw 0;db=x;db.theme||='light';db.sound??=true;db.playerSeq||=Math.max(0,...db.players.map(y=>Number(String(y.id).replace(/\D/g,''))||0))+1;db.roleSeq||=Math.max(0,...db.roles.map(y=>Number(String(y.id).replace(/\D/g,''))||0))+1;save();applyTheme();renderManage();renderGuide();render();toast('Import berhasil.')}catch{toast('JSON tidak valid.')}e.target.value=''}

E.manageBtn.onclick=()=>{renderManage();E.manageDialog.showModal()};
E.guideBtn.onclick=()=>{renderGuide();E.guideDialog.showModal()};
document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{manageTab=t.dataset.tab;renderManage()});
E.formCloseBtn.onclick=E.formCancelBtn.onclick=()=>E.formDialog.close();
E.closePeekBtn.onclick=()=>E.peekDialog.close();
E.themeBtn.onclick=()=>{db.theme=db.theme==='dark'?'light':'dark';save();applyTheme()};
E.soundBtn.onclick=()=>{db.sound=!db.sound;save();applyTheme();beep(700,.05)};
applyTheme();renderGuide();render();
