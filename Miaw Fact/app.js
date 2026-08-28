
const STORAGE_KEY='miau-fakta-mana-v1';
const $=s=>document.querySelector(s);
const E={
  app:$('#app'),themeBtn:$('#themeBtn'),soundBtn:$('#soundBtn'),manageBtn:$('#manageBtn'),
  manageDialog:$('#manageDialog'),manageContent:$('#manageContent'),
  formDialog:$('#formDialog'),crudForm:$('#crudForm'),formEyebrow:$('#formEyebrow'),
  formTitle:$('#formTitle'),formFields:$('#formFields'),
  formCloseBtn:$('#formCloseBtn'),formCancelBtn:$('#formCancelBtn'),toast:$('#toast')
};

let db=loadDB(),deck=[],deckIndex=0,revealed=false,manageTab='players',editing=null,audioCtx=null;

function clone(v){return JSON.parse(JSON.stringify(v))}
function esc(v=''){return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(db))}
function loadDB(){
  try{
    const x=JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(Array.isArray(x?.players)&&Array.isArray(x?.cards))return x
  }catch{}
  return {players:clone(SEED_PLAYERS),cards:clone(SEED_CARDS),theme:'light',sound:true,playerSeq:5,cardSeq:101}
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
function c(id){return db.cards.find(x=>x.id===id)}
function shuffle(a){
  const b=[...a];
  for(let i=b.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [b[i],b[j]]=[b[j],b[i]]
  }
  return b
}
function buildDeck(){
  deck=shuffle(db.cards.map(x=>x.id));deckIndex=0;revealed=false
}
function current(){
  if(!deck.length)buildDeck();
  return c(deck[deckIndex])||db.cards[0]
}
function animateRender(){
  const card=$('#gameCard');
  if(!card){render();return}
  card.classList.add('flip-out');
  setTimeout(()=>{
    render();
    const fresh=$('#gameCard');
    fresh?.classList.add('flip-in');
    setTimeout(()=>fresh?.classList.remove('flip-in'),190)
  },165)
}
function home(){
  return `<section class="hero">
    <div class="panel hero-main">
      <div class="eyebrow">PARTY TRIVIA • PAPER GUESSES</div>
      <div class="hero-title">Yang mana<br>fakta?</div>
      <p class="hero-copy">Semua pemain lihat tiga pernyataan yang sama. Tulis tebakan <b>1, 2, atau 3</b> di kertas. Setelah semua lock secara fisik, balik kartu. Hanya fakta yang benar berubah hijau.</p>
      <div class="button-row">
        <button class="primary-btn big" id="playBtn">🧠 Mulai Deck</button>
        <button class="secondary-btn big" id="homeManageBtn">⚙️ CRUD</button>
      </div>
      <div class="note">Scoring sengaja di luar web. Web cuma menjadi deck + reveal + database.</div>
    </div>
    <div class="panel">
      <div class="eyebrow">DATABASE</div>
      <div class="stat-grid">
        <div class="stat"><b>${db.cards.length}</b><span>Kartu fakta</span></div>
        <div class="stat"><b>${db.players.length}</b><span>Pemain tersimpan</span></div>
      </div>
      <div class="player-strip">${db.players.map(x=>`<span class="player-chip">😺 ${esc(x.name)}</span>`).join('')}</div>
      <p class="note">Seed awal punya 100 kartu dari tema Space, laut/hewan, sains Bumi, dan Indonesia/dunia.</p>
    </div>
  </section>`
}
function cardScreen(){
  const card=current();
  if(!card)return `<section class="panel"><div class="empty">Tidak ada kartu. Tambahkan lewat CRUD.</div></section>`;
  return `<div class="card-shell">
    <div class="card-meta">
      <span class="meta-pill">${esc(card.id)} • ${esc(card.category)}</span>
      <span class="meta-pill">${deckIndex+1} / ${deck.length}</span>
    </div>
    <section id="gameCard" class="game-card">
      <div class="card-title">
        <div class="eyebrow">${revealed?'REVEAL':'TEBAK DI KERTAS'}</div>
        <h2>${revealed?'Fakta yang benar ditandai hijau.':'Pilih 1, 2, atau 3.'}</h2>
      </div>
      <div class="statements">
        ${card.statements.map((s,i)=>`
          <div class="statement ${revealed&&i===card.truthIndex?'true':''}">
            <div class="statement-number">${i+1}</div>
            <div class="statement-text">${esc(s)}</div>
            <div class="truth-mark ${revealed&&i===card.truthIndex?'':'hidden'}">✓</div>
          </div>`).join('')}
      </div>
      <div class="source-box ${revealed?'show':''}">
        <b>Sumber fakta:</b> ${card.sourceUrl?`<a href="${esc(card.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(card.sourceName||'Sumber')}</a>`:esc(card.sourceName||'Sumber tidak dicantumkan')}
      </div>
    </section>
    <div class="controls">
      <button class="primary-btn big" id="flipBtn">${revealed?'🙈 Sembunyikan Jawaban':'🔄 BALIK KARTU'}</button>
      <button class="secondary-btn big" id="nextBtn">➡️ Kartu Berikut</button>
      <button class="secondary-btn" id="shuffleBtn">🔀 Kocok</button>
      <button class="secondary-btn" id="backHomeBtn">🏠 Beranda</button>
    </div>
    <p class="tip"><b>Space</b> = balik • <b>→</b> = kartu berikut. Semua pemain menulis skor sendiri di kertas.</p>
  </div>`
}
function render(){
  E.app.innerHTML=deck.length?cardScreen():home();
  bind()
}
function bind(){
  $('#playBtn')?.addEventListener('click',()=>{buildDeck();render()});
  $('#homeManageBtn')?.addEventListener('click',()=>{renderManage();E.manageDialog.showModal()});
  $('#flipBtn')?.addEventListener('click',toggleReveal);
  $('#nextBtn')?.addEventListener('click',nextCard);
  $('#shuffleBtn')?.addEventListener('click',()=>{buildDeck();beep(880,.07);toast('Deck dikocok ulang.');animateRender()});
  $('#backHomeBtn')?.addEventListener('click',()=>{deck=[];deckIndex=0;revealed=false;render()})
}
function toggleReveal(){
  revealed=!revealed;beep(revealed?820:480,.06);animateRender()
}
function nextCard(){
  if(!deck.length)return;
  deckIndex++;
  if(deckIndex>=deck.length){
    deck=shuffle(db.cards.map(x=>x.id));deckIndex=0;toast('Deck selesai — dikocok ulang!')
  }
  revealed=false;beep(620,.05);animateRender()
}

function renderManage(q=''){
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===manageTab));
  if(manageTab==='players')return managePlayers(q);
  if(manageTab==='cards')return manageCards(q);
  manageData()
}
function managePlayers(q=''){
  q=q.toLowerCase();
  const arr=db.players.filter(x=>(x.id+' '+x.name).toLowerCase().includes(q));
  E.manageContent.innerHTML=`
    <div class="manage-tools">
      <input id="manageSearch" class="search" value="${esc(q)}" placeholder="Cari P001 / nama...">
      <button id="addPlayerBtn" class="primary-btn">+ Pemain</button>
    </div>
    <div class="crud-list">
      ${arr.map(x=>`<div class="crud-row">
        <div><div class="crud-title">${esc(x.name)}</div><div class="crud-meta">${x.id}</div></div>
        <div class="crud-actions"><button data-ep="${x.id}">✏️</button><button data-dp="${x.id}">🗑️</button></div>
      </div>`).join('')||'<div class="empty">Tidak ada pemain.</div>'}
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
function manageCards(q=''){
  q=q.toLowerCase();
  const arr=db.cards.filter(x=>(`${x.id} ${x.category} ${x.statements.join(' ')} ${x.sourceName||''}`).toLowerCase().includes(q));
  E.manageContent.innerHTML=`
    <div class="manage-tools">
      <input id="manageSearch" class="search" value="${esc(q)}" placeholder="Cari Q001 / kategori / isi...">
      <button id="addCardBtn" class="primary-btn">+ Kartu</button>
    </div>
    <div class="crud-list">
      ${arr.map(x=>`<div class="crud-row">
        <div>
          <div class="crud-title">${esc(x.id)} • ${esc(x.category)}</div>
          <div class="crud-meta">Fakta: baris ${x.truthIndex+1} • ${esc(x.statements[x.truthIndex])}</div>
        </div>
        <div class="crud-actions"><button data-ec="${x.id}">✏️</button><button data-dc="${x.id}">🗑️</button></div>
      </div>`).join('')||'<div class="empty">Tidak ada kartu.</div>'}
    </div>`;
  $('#manageSearch').oninput=e=>manageCards(e.target.value);
  $('#addCardBtn').onclick=()=>openCard();
  document.querySelectorAll('[data-ec]').forEach(b=>b.onclick=()=>openCard(b.dataset.ec));
  document.querySelectorAll('[data-dc]').forEach(b=>b.onclick=()=>{
    if(confirm('Hapus kartu?')){
      db.cards=db.cards.filter(x=>x.id!==b.dataset.dc);deck=[];save();manageCards();render()
    }
  })
}
function manageData(){
  E.manageContent.innerHTML=`
    <div class="panel" style="box-shadow:none">
      <h3>Backup & Reset</h3>
      <p class="hero-copy">Seluruh CRUD tersimpan di localStorage browser ini.</p>
      <div class="button-row">
        <button id="exportBtn" class="primary-btn">⬇️ Export JSON</button>
        <label class="secondary-btn">⬆️ Import JSON<input id="importInput" type="file" accept=".json,application/json" hidden></label>
        <button id="resetDataBtn" class="danger-btn">♻️ Reset Seed</button>
      </div>
    </div>`;
  $('#exportBtn').onclick=exportData;
  $('#importInput').onchange=importData;
  $('#resetDataBtn').onclick=()=>{
    if(confirm('Reset semua pemain dan kartu ke seed awal?')){
      db={players:clone(SEED_PLAYERS),cards:clone(SEED_CARDS),theme:db.theme,sound:db.sound,playerSeq:5,cardSeq:101};
      deck=[];save();renderManage();render();toast('Seed dipulihkan.')
    }
  }
}
function openPlayer(id=null){
  editing={type:'player',id};const x=id?p(id):null;
  E.formEyebrow.textContent=x?x.id:'PEMAIN BARU';E.formTitle.textContent=x?'Edit Pemain':'Tambah Pemain';
  E.formFields.innerHTML=`<label>Nama pemain<input name="name" required maxlength="30" value="${esc(x?.name||'')}"></label>`;
  E.formDialog.showModal()
}
function openCard(id=null){
  editing={type:'card',id};const x=id?c(id):null;
  E.formEyebrow.textContent=x?x.id:'KARTU BARU';E.formTitle.textContent=x?'Edit Kartu':'Tambah Kartu';
  E.formFields.innerHTML=`
    <label>Kategori<input name="category" required maxlength="40" value="${esc(x?.category||'Random')}"></label>
    <label>Baris 1<input name="s1" required maxlength="180" value="${esc(x?.statements?.[0]||'')}"></label>
    <label>Baris 2<input name="s2" required maxlength="180" value="${esc(x?.statements?.[1]||'')}"></label>
    <label>Baris 3<input name="s3" required maxlength="180" value="${esc(x?.statements?.[2]||'')}"></label>
    <label>Baris fakta yang benar
      <select name="truthIndex">
        <option value="0" ${x?.truthIndex===0?'selected':''}>1</option>
        <option value="1" ${x?.truthIndex===1?'selected':''}>2</option>
        <option value="2" ${x?.truthIndex===2?'selected':''}>3</option>
      </select>
    </label>
    <label>Nama sumber<input name="sourceName" maxlength="80" value="${esc(x?.sourceName||'')}"></label>
    <label>URL sumber<input name="sourceUrl" type="url" maxlength="300" value="${esc(x?.sourceUrl||'')}"></label>`;
  E.formDialog.showModal()
}
E.crudForm.onsubmit=e=>{
  e.preventDefault();const f=new FormData(e.currentTarget);
  if(editing.type==='player'){
    const data={name:String(f.get('name')).trim()};
    if(editing.id)Object.assign(p(editing.id),data);
    else db.players.push({id:`P${String(db.playerSeq++).padStart(3,'0')}`,...data})
  }else{
    const data={
      category:String(f.get('category')).trim(),
      statements:[String(f.get('s1')).trim(),String(f.get('s2')).trim(),String(f.get('s3')).trim()],
      truthIndex:Number(f.get('truthIndex')),
      sourceName:String(f.get('sourceName')||'').trim(),
      sourceUrl:String(f.get('sourceUrl')||'').trim()
    };
    if(editing.id)Object.assign(c(editing.id),data);
    else db.cards.push({id:`Q${String(db.cardSeq++).padStart(3,'0')}`,...data});
    deck=[]
  }
  save();E.formDialog.close();renderManage();render();beep(720,.05);toast('Tersimpan.')
}
function exportData(){
  const b=new Blob([JSON.stringify(db,null,2)],{type:'application/json'}),a=document.createElement('a');
  a.href=URL.createObjectURL(b);a.download='miau-fakta-mana-data.json';a.click();URL.revokeObjectURL(a.href)
}
async function importData(e){
  try{
    const x=JSON.parse(await e.target.files[0].text());
    if(!Array.isArray(x.players)||!Array.isArray(x.cards))throw 0;
    if(!x.cards.every(k=>k.id&&Array.isArray(k.statements)&&k.statements.length===3&&[0,1,2].includes(Number(k.truthIndex))))throw 0;
    db=x;db.theme||='light';db.sound??=true;
    db.playerSeq||=Math.max(0,...db.players.map(y=>Number(String(y.id).replace(/\D/g,''))||0))+1;
    db.cardSeq||=Math.max(0,...db.cards.map(y=>Number(String(y.id).replace(/\D/g,''))||0))+1;
    deck=[];save();applyTheme();renderManage();render();toast('Import berhasil.')
  }catch{toast('JSON tidak valid.')}
  e.target.value=''
}

E.manageBtn.onclick=()=>{renderManage();E.manageDialog.showModal()};
document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{manageTab=t.dataset.tab;renderManage()});
E.formCloseBtn.onclick=E.formCancelBtn.onclick=()=>E.formDialog.close();
E.themeBtn.onclick=()=>{db.theme=db.theme==='dark'?'light':'dark';save();applyTheme()};
E.soundBtn.onclick=()=>{db.sound=!db.sound;save();applyTheme();beep(700,.05)};
document.addEventListener('keydown',e=>{
  if(['INPUT','SELECT','TEXTAREA'].includes(document.activeElement.tagName))return;
  if(!deck.length)return;
  if(e.code==='Space'){e.preventDefault();toggleReveal()}
  if(e.key==='ArrowRight'){e.preventDefault();nextCard()}
});
applyTheme();render();
