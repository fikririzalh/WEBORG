
const STORAGE_KEY='miau-fake-artist-v1';
const $=s=>document.querySelector(s);
const E={
  app:$('#app'),themeBtn:$('#themeBtn'),soundBtn:$('#soundBtn'),manageBtn:$('#manageBtn'),
  manageDialog:$('#manageDialog'),manageContent:$('#manageContent'),
  formDialog:$('#formDialog'),crudForm:$('#crudForm'),formEyebrow:$('#formEyebrow'),
  formTitle:$('#formTitle'),formFields:$('#formFields'),formCloseBtn:$('#formCloseBtn'),
  formCancelBtn:$('#formCancelBtn'),toast:$('#toast')
};

let db=loadDB(),game=null,manageTab='players',editing=null,audioCtx=null;
let promptDeck=[],lastFakeId=null,roleVisible=false,roleSeen=false;

function clone(v){return JSON.parse(JSON.stringify(v))}
function esc(v=''){return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(db))}
function loadDB(){
  try{
    const x=JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(Array.isArray(x?.players)&&Array.isArray(x?.prompts))return x
  }catch{}
  return {players:clone(SEED_PLAYERS),prompts:clone(SEED_PROMPTS),theme:'light',sound:true,playerSeq:6,promptSeq:151}
}
function toast(m){
  E.toast.textContent=m;E.toast.classList.add('show');
  clearTimeout(toast.t);toast.t=setTimeout(()=>E.toast.classList.remove('show'),1600)
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
function pr(id){return db.prompts.find(x=>x.id===id)}
function shuffle(a){
  const b=[...a];
  for(let i=b.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [b[i],b[j]]=[b[j],b[i]]
  }
  return b
}
function categories(){
  return [...new Set(db.prompts.map(x=>x.category))].sort((a,b)=>a.localeCompare(b,'id'))
}
function nextPrompt(filter='Semua'){
  const eligible=db.prompts.filter(x=>filter==='Semua'||x.category===filter).map(x=>x.id);
  if(!eligible.length)return null;
  const eligibleSet=new Set(eligible);
  promptDeck=promptDeck.filter(id=>eligibleSet.has(id));
  if(!promptDeck.length)promptDeck=shuffle(eligible);
  return promptDeck.shift()
}

function steps(){
  const a=[['roles','1. Role'],['draw1','2. Gambar 1'],['draw2','3. Gambar 2'],['vote','4. Voting'],['reveal','5. Reveal']];
  const phase=game.phase==='pass'||game.phase==='role'?'roles':game.phase;
  return `<div class="progress-steps">${a.map(([id,t])=>`<div class="progress-step ${phase===id?'active':''}">${t}</div>`).join('')}</div>`
}
function shell(content){
  const prompt=pr(game.promptId);
  return `<div class="game-head">
    <div><div class="eyebrow">MIAU! FAKE ARTIST</div><div class="round-pill">Round ${game.round}</div></div>
    <div class="category-pill">🎨 ${esc(prompt?.category||'—')}</div>
  </div>
  <section class="panel">${steps()}${content}</section>`
}

function home(){
  return `<section class="hero">
    <div class="panel hero-main">
      <div class="eyebrow">HYBRID SOCIAL DRAWING GAME</div>
      <div class="hero-title">Satu orang<br>nggak tahu.</div>
      <p class="hero-copy">Web memilih Fake dan kata secara rahasia. Setelah role dibagikan, taruh HP di tengah dan gambar bersama di kertas atau whiteboard sungguhan.</p>
      <div class="button-row">
        <button class="primary-btn big" id="setupBtn">🎨 Siapkan Round</button>
        <button class="secondary-btn big" id="homeManageBtn">⚙️ CRUD</button>
      </div>
      <div class="note">Semua orang aktif menggambar. Web menggantikan Question Master manusia.</div>
    </div>
    <div class="panel">
      <div class="eyebrow">DATABASE</div>
      <div class="feature-grid">
        <div class="feature"><b>${db.players.length}</b><span>Pemain tersimpan</span></div>
        <div class="feature"><b>${db.prompts.length}</b><span>Prompt original</span></div>
        <div class="feature"><b>2×</b><span>Satu garis / pemain / putaran</span></div>
        <div class="feature"><b>1 Fake</b><span>Tahu kategori, tidak tahu kata</span></div>
      </div>
    </div>
  </section>`
}
function setupScreen(){
  const cats=categories();
  return `<section class="panel">
    <div class="eyebrow">SETUP ROUND</div>
    <h2>Pilih siapa yang bermain.</h2>
    <p class="hero-copy">Varian web: 4–10 pemain aktif. Fake tidak dipilih dua ronde berturut-turut jika memungkinkan.</p>
    <div class="player-select">
      ${db.players.map((x,i)=>`<label class="player-check"><input type="checkbox" data-player="${x.id}" ${i<Math.min(db.players.length,6)?'checked':''}> <span>${esc(x.name)}</span></label>`).join('')}
    </div>
    <div class="setup-controls">
      <label class="field">Kategori deck
        <select id="categoryFilter"><option>Semua</option>${cats.map(c=>`<option>${esc(c)}</option>`).join('')}</select>
      </label>
      <label class="field">Pemain pertama
        <select id="starterMode"><option value="random">Random setiap ronde</option><option value="first">Urutan pertama</option></select>
      </label>
    </div>
    <div class="button-row">
      <button class="primary-btn big" id="beginRoundBtn">🔒 Bagi Role Rahasia</button>
      <button class="secondary-btn" id="cancelSetupBtn">Batal</button>
    </div>
  </section>`
}
function startRound(){
  const selected=[...document.querySelectorAll('[data-player]:checked')].map(x=>x.dataset.player);
  if(selected.length<4)return toast('Pilih minimal 4 pemain.');
  if(selected.length>10)return toast('Maksimal 10 pemain.');

  const filter=$('#categoryFilter').value;
  const promptId=nextPrompt(filter);
  if(!promptId)return toast('Tidak ada prompt pada kategori itu.');

  let candidates=selected.filter(id=>id!==lastFakeId);
  if(!candidates.length)candidates=selected;
  const fakeId=candidates[Math.floor(Math.random()*candidates.length)];

  const starterMode=$('#starterMode').value;
  const starterIndex=starterMode==='random'?Math.floor(Math.random()*selected.length):0;
  const nextRound=(game?.round||0)+1;

  game={
    round:nextRound,phase:'pass',players:selected,promptId,fakeId,roleIndex:0,
    starterIndex,caught:null
  };
  lastFakeId=fakeId;roleVisible=false;roleSeen=false;beep(730,.08);render()
}
function currentRolePlayer(){return game.players[game.roleIndex]}
function passScreen(){
  const id=currentRolePlayer();
  return shell(`<div class="pass-screen">
    <div class="big-emoji">🔒🎨</div>
    <div class="eyebrow">PRIVATE ROLE</div>
    <div class="private-name">${esc(p(id)?.name||id)}</div>
    <p class="hero-copy">Pastikan hanya pemain ini yang melihat layar.</p>
    <button class="primary-btn big" id="openRoleBtn">Saya ${esc(p(id)?.name||id)} → lanjut</button>
  </div>`)
}
function roleScreen(){
  const id=currentRolePlayer(),prompt=pr(game.promptId),isFake=id===game.fakeId;
  const roleTitle=roleVisible?(isFake?'😼 FAKE ARTIST':'😺 REAL ARTIST'):'🔒 ROLE TERSEMBUNYI';
  const category=roleVisible?prompt.category:'••••••••';
  const word=roleVisible?(isFake?'???':prompt.word):'••••••••';
  const hint=roleVisible
    ?(isFake?'Kamu hanya tahu kategori. Blend in dan baca gambar orang lain.':'Kamu tahu kata. Tunjukkan bahwa kamu tahu tanpa terlalu jelas.')
    :'Tahan tombol di bawah untuk melihat.';

  return shell(`<div class="pass-screen">
    <div class="role-box ${roleVisible?'':'hidden-role'}">
      <div class="role-label">ROLEMU</div>
      <div class="role-title">${roleTitle}</div>
      <div class="secret-grid">
        <div class="secret-line"><span>Kategori</span><b>${esc(category)}</b></div>
        <div class="secret-line"><span>Kata rahasia</span><b>${esc(word)}</b></div>
      </div>
      <p class="role-status">${esc(hint)}</p>
    </div>
    <button class="primary-btn big hold-btn" id="holdRoleBtn">👆 TAHAN UNTUK LIHAT</button>
    <button class="secondary-btn big" id="roleDoneBtn" ${roleSeen?'':'disabled'}>✅ Saya sudah lihat</button>
  </div>`)
}
function showRole(){
  if(roleVisible)return;
  roleVisible=true;roleSeen=true;beep(800,.04);render()
}
function hideRole(){
  if(!roleVisible)return;
  roleVisible=false;render()
}
function roleDone(){
  roleVisible=false;roleSeen=false;game.roleIndex++;
  if(game.roleIndex>=game.players.length)game.phase='draw1';
  else game.phase='pass';
  render()
}
function drawOrder(){
  const arr=[];
  for(let i=0;i<game.players.length;i++)arr.push(game.players[(game.starterIndex+i)%game.players.length]);
  return arr
}
function drawScreen(roundNo){
  const prompt=pr(game.promptId),order=drawOrder();
  return shell(`<div class="draw-screen">
    <div class="eyebrow">PUBLIC INFO</div>
    <div class="public-category">${esc(prompt.category)}</div>
    <div class="round-number">PUTARAN ${roundNo}</div>
    <p class="hero-copy">Satu pemain = <b>satu garis</b>. Real Artist harus membuktikan mereka tahu kata tanpa membuatnya terlalu mudah untuk Fake.</p>
    <div class="draw-order">
      ${order.map((id,i)=>`<span class="order-chip ${i===0?'start':''}">${i===0?'▶ ':''}${esc(p(id)?.name||id)}</span>`).join('')}
    </div>
    <div class="note">Gunakan satu kertas/whiteboard bersama. Setelah semua pemain mendapat giliran, lanjut.</div>
    <button class="primary-btn big" id="${roundNo===1?'draw1DoneBtn':'draw2DoneBtn'}">
      ${roundNo===1?'➡️ Putaran 1 Selesai':'🗳️ Selesai Menggambar'}
    </button>
  </div>`)
}
function voteScreen(){
  return shell(`<div class="vote-screen">
    <div class="big-emoji">👉😼</div>
    <div class="eyebrow">VOTING DI DUNIA NYATA</div>
    <h2>Siapa Fake Artist?</h2>
    <p class="hero-copy">Diskusi dulu kalau mau. Setelah siap, semua menunjuk tersangka secara bersamaan.</p>
    <div class="vote-count">3…2…1!</div>
    <button class="primary-btn big" id="revealFakeBtn">👀 REVEAL FAKE ARTIST</button>
  </div>`)
}
function revealFakeScreen(){
  return shell(`<div class="reveal-screen">
    <div class="eyebrow">FAKE ARTIST ADALAH</div>
    <div class="fake-name">😼 ${esc(p(game.fakeId)?.name||game.fakeId)}</div>
    <p class="hero-copy">Bagaimana hasil voting kalian?</p>
    <div class="button-row">
      <button class="danger-btn big" id="caughtBtn">🎯 Fake Tertangkap</button>
      <button class="primary-btn big" id="escapedBtn">😼 Fake Lolos Voting</button>
    </div>
  </div>`)
}
function caughtScreen(){
  return shell(`<div class="reveal-screen">
    <div class="big-emoji">🎯😼</div>
    <div class="eyebrow">SATU KESEMPATAN TERAKHIR</div>
    <h2>${esc(p(game.fakeId)?.name)} tertangkap.</h2>
    <p class="hero-copy">Sebelum kata dibuka, Fake boleh memberi <b>satu tebakan verbal</b> atas kata rahasia.</p>
    <button class="primary-btn big" id="showWordBtn">🔓 Sudah Menebak → Reveal Kata</button>
  </div>`)
}
function escapedScreen(){
  return shell(`<div class="reveal-screen">
    <div class="big-emoji">😼💨</div>
    <div class="eyebrow">FAKE ESCAPES</div>
    <h2>Fake tidak tertangkap voting.</h2>
    <p class="hero-copy">Round ini milik Fake. Buka kata untuk melihat seberapa dekat gambar kalian.</p>
    <button class="primary-btn big" id="showWordBtn">🔓 Reveal Kata</button>
  </div>`)
}
function wordScreen(){
  const prompt=pr(game.promptId);
  return shell(`<div class="reveal-screen">
    <div class="eyebrow">KATA RAHASIA • ${esc(prompt.id)}</div>
    <div class="word-reveal">${esc(prompt.word)}</div>
    <div class="category-pill">Kategori: ${esc(prompt.category)}</div>
    <p class="hero-copy" style="margin-top:14px">Jika Fake tadi tertangkap tetapi berhasil menebak kata ini, Fake mencuri kemenangan ronde.</p>
    <div class="button-row">
      <button class="primary-btn big" id="nextRoundBtn">🎨 Round Berikut</button>
      <button class="secondary-btn" id="endBtn">🏠 Selesai</button>
    </div>
  </div>`)
}
function render(){
  if(!game){E.app.innerHTML=home();bind();return}
  if(game.phase==='setup'){E.app.innerHTML=setupScreen();bind();return}

  E.app.innerHTML=
    game.phase==='pass'?passScreen():
    game.phase==='role'?roleScreen():
    game.phase==='draw1'?drawScreen(1):
    game.phase==='draw2'?drawScreen(2):
    game.phase==='vote'?voteScreen():
    game.phase==='reveal'?revealFakeScreen():
    game.phase==='caught'?caughtScreen():
    game.phase==='escaped'?escapedScreen():
    wordScreen();
  bind()
}
function bind(){
  $('#setupBtn')?.addEventListener('click',()=>{game={round:0,phase:'setup'};render()});
  $('#homeManageBtn')?.addEventListener('click',()=>{renderManage();E.manageDialog.showModal()});
  $('#beginRoundBtn')?.addEventListener('click',startRound);
  $('#cancelSetupBtn')?.addEventListener('click',()=>{game=null;render()});
  $('#openRoleBtn')?.addEventListener('click',()=>{game.phase='role';roleSeen=false;render()});

  const hold=$('#holdRoleBtn');
  if(hold){
    hold.addEventListener('pointerdown',e=>{e.preventDefault();showRole()});
    hold.addEventListener('pointerup',hideRole);
    hold.addEventListener('pointercancel',hideRole);
    hold.addEventListener('pointerleave',hideRole);
  }

  $('#roleDoneBtn')?.addEventListener('click',roleDone);
  $('#draw1DoneBtn')?.addEventListener('click',()=>{game.phase='draw2';beep(620,.06);render()});
  $('#draw2DoneBtn')?.addEventListener('click',()=>{game.phase='vote';beep(520,.06);render()});
  $('#revealFakeBtn')?.addEventListener('click',()=>{game.phase='reveal';beep(240,.1);render()});
  $('#caughtBtn')?.addEventListener('click',()=>{game.phase='caught';render()});
  $('#escapedBtn')?.addEventListener('click',()=>{game.phase='escaped';render()});
  $('#showWordBtn')?.addEventListener('click',()=>{game.phase='word';beep(850,.09);render()});
  $('#nextRoundBtn')?.addEventListener('click',()=>{
    const round=game.round;game={round,phase:'setup'};render()
  });
  $('#endBtn')?.addEventListener('click',()=>{game=null;render()})
}

function renderManage(q=''){
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===manageTab));
  if(manageTab==='players')return managePlayers(q);
  if(manageTab==='prompts')return managePrompts(q);
  manageData()
}
function managePlayers(q=''){
  q=q.toLowerCase();
  const arr=db.players.filter(x=>(x.id+' '+x.name).toLowerCase().includes(q));
  E.manageContent.innerHTML=`
    <div class="manage-tools">
      <input id="manageSearch" class="search" value="${esc(q)}" placeholder="Cari ID / nama...">
      <button id="addPlayerBtn" class="primary-btn">+ Pemain</button>
    </div>
    <div class="crud-list">
      ${arr.map(x=>`<div class="crud-row"><div><div class="crud-title">${esc(x.name)}</div><div class="crud-meta">${x.id}</div></div>
      <div class="crud-actions"><button data-ep="${x.id}">✏️</button><button data-dp="${x.id}">🗑️</button></div></div>`).join('')||'<div class="empty">Tidak ada pemain.</div>'}
    </div>`;
  $('#manageSearch').oninput=e=>managePlayers(e.target.value);
  $('#addPlayerBtn').onclick=()=>openPlayer();
  document.querySelectorAll('[data-ep]').forEach(b=>b.onclick=()=>openPlayer(b.dataset.ep));
  document.querySelectorAll('[data-dp]').forEach(b=>b.onclick=()=>{
    if(confirm('Hapus pemain?')){
      db.players=db.players.filter(x=>x.id!==b.dataset.dp);save();managePlayers();render()
    }
  })
}
function managePrompts(q=''){
  q=q.toLowerCase();
  const arr=db.prompts.filter(x=>(`${x.id} ${x.category} ${x.word}`).toLowerCase().includes(q));
  E.manageContent.innerHTML=`
    <div class="manage-tools">
      <input id="manageSearch" class="search" value="${esc(q)}" placeholder="Cari Q001 / kategori / kata...">
      <button id="addPromptBtn" class="primary-btn">+ Prompt</button>
    </div>
    <div class="crud-list">
      ${arr.map(x=>`<div class="crud-row"><div><div class="crud-title">${esc(x.id)} • ${esc(x.word)}</div><div class="crud-meta">${esc(x.category)}</div></div>
      <div class="crud-actions"><button data-eq="${x.id}">✏️</button><button data-dq="${x.id}">🗑️</button></div></div>`).join('')||'<div class="empty">Tidak ada prompt.</div>'}
    </div>`;
  $('#manageSearch').oninput=e=>managePrompts(e.target.value);
  $('#addPromptBtn').onclick=()=>openPrompt();
  document.querySelectorAll('[data-eq]').forEach(b=>b.onclick=()=>openPrompt(b.dataset.eq));
  document.querySelectorAll('[data-dq]').forEach(b=>b.onclick=()=>{
    if(confirm('Hapus prompt?')){
      db.prompts=db.prompts.filter(x=>x.id!==b.dataset.dq);promptDeck=[];save();managePrompts();render()
    }
  })
}
function manageData(){
  E.manageContent.innerHTML=`
    <div class="panel" style="box-shadow:none">
      <h3>Backup & Reset</h3>
      <p class="hero-copy">Pemain, prompt, dan setting tersimpan di localStorage browser.</p>
      <div class="button-row">
        <button id="exportBtn" class="primary-btn">⬇️ Export JSON</button>
        <label class="secondary-btn">⬆️ Import JSON<input id="importInput" type="file" accept=".json,application/json" hidden></label>
        <button id="resetBtn" class="danger-btn">♻️ Reset 150 Prompt</button>
      </div>
    </div>`;
  $('#exportBtn').onclick=exportData;
  $('#importInput').onchange=importData;
  $('#resetBtn').onclick=()=>{
    if(confirm('Reset semua pemain dan prompt ke seed bawaan?')){
      db={players:clone(SEED_PLAYERS),prompts:clone(SEED_PROMPTS),theme:db.theme,sound:db.sound,playerSeq:6,promptSeq:151};
      promptDeck=[];save();renderManage();render();toast('Seed dipulihkan.')
    }
  }
}
function openPlayer(id=null){
  editing={type:'player',id};const x=id?p(id):null;
  E.formEyebrow.textContent=x?x.id:'PEMAIN BARU';E.formTitle.textContent=x?'Edit Pemain':'Tambah Pemain';
  E.formFields.innerHTML=`<label>Nama<input name="name" required maxlength="30" value="${esc(x?.name||'')}"></label>`;
  E.formDialog.showModal()
}
function openPrompt(id=null){
  editing={type:'prompt',id};const x=id?pr(id):null;
  E.formEyebrow.textContent=x?x.id:'PROMPT BARU';E.formTitle.textContent=x?'Edit Prompt':'Tambah Prompt';
  E.formFields.innerHTML=`<label>Kategori<input name="category" required maxlength="40" value="${esc(x?.category||'')}"></label>
  <label>Kata / objek<input name="word" required maxlength="50" value="${esc(x?.word||'')}"></label>`;
  E.formDialog.showModal()
}
E.crudForm.onsubmit=e=>{
  e.preventDefault();const f=new FormData(e.currentTarget);
  if(editing.type==='player'){
    const x={name:String(f.get('name')).trim()};
    if(editing.id)Object.assign(p(editing.id),x);
    else db.players.push({id:`P${String(db.playerSeq++).padStart(3,'0')}`,...x})
  }else{
    const x={category:String(f.get('category')).trim(),word:String(f.get('word')).trim()};
    if(editing.id)Object.assign(pr(editing.id),x);
    else db.prompts.push({id:`Q${String(db.promptSeq++).padStart(3,'0')}`,...x});
    promptDeck=[]
  }
  save();E.formDialog.close();renderManage();render();toast('Tersimpan.');beep(720,.05)
}
function exportData(){
  const b=new Blob([JSON.stringify(db,null,2)],{type:'application/json'}),a=document.createElement('a');
  a.href=URL.createObjectURL(b);a.download='miau-fake-artist-data.json';a.click();URL.revokeObjectURL(a.href)
}
async function importData(e){
  try{
    const x=JSON.parse(await e.target.files[0].text());
    if(!Array.isArray(x.players)||!Array.isArray(x.prompts)||!x.prompts.every(y=>y.id&&y.category&&y.word))throw 0;
    db=x;db.theme||='light';db.sound??=true;
    db.playerSeq||=Math.max(0,...db.players.map(y=>Number(y.id.replace(/\D/g,''))||0))+1;
    db.promptSeq||=Math.max(0,...db.prompts.map(y=>Number(y.id.replace(/\D/g,''))||0))+1;
    promptDeck=[];save();applyTheme();renderManage();render();toast('Import berhasil.')
  }catch{toast('JSON tidak valid.')}
  e.target.value=''
}

E.manageBtn.onclick=()=>{renderManage();E.manageDialog.showModal()};
document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{manageTab=t.dataset.tab;renderManage()});
E.formCloseBtn.onclick=E.formCancelBtn.onclick=()=>E.formDialog.close();
E.themeBtn.onclick=()=>{db.theme=db.theme==='dark'?'light':'dark';save();applyTheme()};
E.soundBtn.onclick=()=>{db.sound=!db.sound;save();applyTheme();beep(700,.05)};
applyTheme();render();
