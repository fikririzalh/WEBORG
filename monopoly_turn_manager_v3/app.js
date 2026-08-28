const KEY='monopoly-turn-manager-v3';
const initial={
  masterCards:[
    {id:'black-card',name:'Black Card',effect:'Batalkan satu pembayaran sewa.'},
    {id:'magnetic-core',name:'Magnetic Core',effect:'Tarik lawan sesuai ruleset yang digunakan.'},
    {id:'golden-ticket',name:'Golden Ticket',effect:'Efek travel atau bonus movement sesuai ruleset.'},
    {id:'top-racer',name:"Top Racer's Helmet",effect:'Manipulasi hasil dadu sesuai ruleset.'},
    {id:'healing-ticket',name:'Healing Travel Ticket',effect:'Efek penyelamatan / travel setelah membayar sewa.'},
    {id:'drawing-equipment',name:'Drawing Equipment',effect:'Efek pembangunan atau pembelian properti.'}
  ],
  players:[
    {id:'a',name:'A',money:1500,cardIds:['black-card']},
    {id:'b',name:'B',money:1500,cardIds:['magnetic-core']}
  ],
  turn:0,log:[]
};
let state=load(),activeId=null,editPlayerId=null,editCardId=null,moneyAction=null,selectedHandIndex=null,pendingRandomCardId=null;
const $=s=>document.querySelector(s);const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));const cash=n=>`${Number(n).toLocaleString('id-ID')} G`;
function load(){try{const s=JSON.parse(localStorage.getItem(KEY));return s&&s.players&&s.masterCards?s:structuredClone(initial)}catch{return structuredClone(initial)}}
function save(){localStorage.setItem(KEY,JSON.stringify(state))}function player(id){return state.players.find(p=>p.id===id)}function card(id){return state.masterCards.find(c=>c.id===id)}function current(){if(!state.players.length)return null;if(state.turn>=state.players.length)state.turn=0;return state.players[state.turn]}function next(){return state.players.length?state.players[(state.turn+1)%state.players.length]:null}
function log(t){state.log.unshift({id:crypto.randomUUID(),text:t,time:new Date().toISOString()});state.log=state.log.slice(0,60)}
function screen(name){['playersScreen','libraryScreen','turnScreen'].forEach(id=>$('#'+id).classList.remove('active'));$('#'+name+'Screen').classList.add('active')}
function open(id){const d=$('#'+id);if(!d.open)d.showModal()}function close(id){const d=$('#'+id);if(d.open)d.close()}
function render(){renderPlayers();renderLibrary();if(activeId&&player(activeId))renderTurn(player(activeId));save()}
function renderPlayers(){const c=current();$('#turnName').textContent=c?c.name:'Belum ada player';$('#openTurnBtn').disabled=!c;$('#playersGrid').innerHTML=state.players.length?state.players.map((p,i)=>`<article class="playerCard ${c?.id===p.id?'current':''}">${c?.id===p.id?'<span class="pill">GILIRAN</span>':''}<small>PLAYER ${i+1}</small><h3>${esc(p.name)}</h3><div class="money">${cash(p.money)}</div><div class="sub">${p.cardIds.length} kartu</div><div class="rowBtns"><button data-open-player="${p.id}" class="${c?.id===p.id?'primary':''}">${c?.id===p.id?'Buka Giliran':'Lihat'}</button><button data-edit-player="${p.id}" class="ghost">Edit</button><button data-delete-player="${p.id}" class="danger ghost">Hapus</button></div></article>`).join(''):'<div class="empty">Belum ada pemain.</div>';$('#log').innerHTML=state.log.length?state.log.slice(0,14).map(x=>`<div class="logItem"><span>${esc(x.text)}</span><time>${new Date(x.time).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})}</time></div>`).join(''):'<div class="empty">Belum ada aktivitas.</div>'}
function renderLibrary(){const g=$('#libraryGrid');g.innerHTML=state.masterCards.length?state.masterCards.map((c,i)=>{const count=state.players.reduce((n,p)=>n+p.cardIds.filter(id=>id===c.id).length,0);return `<article class="masterCard"><small>CARD ${i+1}</small><h3>${esc(c.name)}</h3><p>${esc(c.effect||'Tidak ada efek.')}</p><p><b>${count}</b> ada di tangan player</p><div class="rowBtns"><button data-edit-card="${c.id}">Edit</button><button data-delete-card="${c.id}" class="danger ghost">Hapus</button></div></article>`}).join(''):'<div class="empty">Card Library kosong.</div>'}
function renderTurn(p){$('#activeName').textContent=p.name;$('#activeMoney').textContent=cash(p.money);$('#nextHint').textContent=next()?`Berikutnya: ${next().name}`:'Berikutnya: -';$('#endTurnBtn').disabled=current()?.id!==p.id;$('#endTurnBtn').textContent=current()?.id===p.id?'Giliran Selesai →':'Bukan Giliran Pemain Ini';const valid=p.cardIds.map((id,index)=>({c:card(id),index})).filter(x=>x.c);$('#hand').innerHTML=valid.length?valid.map(x=>`<button class="handCard" data-hand-index="${x.index}"><b>${esc(x.c.name)}</b><span>${esc(x.c.effect||'Tidak ada efek.')}</span></button>`).join(''):'<div class="empty">Belum punya kartu.</div>'}
function openPlayer(id){activeId=id;renderTurn(player(id));screen('turn')}
function playerDialog(id=null){editPlayerId=id;const p=id?player(id):null;$('#playerDialogTitle').textContent=p?'Edit Player':'Tambah Player';$('#playerName').value=p?.name||'';$('#playerMoney').value=p?.money??1500;open('playerDialog')}
function masterDialog(id=null){editCardId=id;const c=id?card(id):null;$('#cardDialogTitle').textContent=c?'Edit Kartu':'Buat Kartu';$('#cardName').value=c?.name||'';$('#cardEffect').value=c?.effect||'';open('cardDialog')}
function picker(){const p=player(activeId);$('#pickerPlayer').textContent=p.name;$('#pickerGrid').innerHTML=state.masterCards.length?state.masterCards.map(c=>`<button class="pickCard" data-pick-card="${c.id}"><b>${esc(c.name)}</b><span>${esc(c.effect||'Tidak ada efek.')}</span></button>`).join(''):'<div class="empty">Library kosong.</div>';open('pickerDialog')}
function addToHand(id){const p=player(activeId),c=card(id);if(!p||!c)return;p.cardIds.push(id);log(`${p.name} mendapat kartu "${c.name}".`);render();renderTurn(p)}
function handDetail(index){const p=player(activeId),c=card(p.cardIds[index]);if(!c)return;selectedHandIndex=index;$('#handCardName').textContent=c.name;$('#handCardEffect').textContent=c.effect||'Tidak ada efek.';open('handCardDialog')}
function removeHand(used){const p=player(activeId);if(!p||selectedHandIndex===null)return;const [id]=p.cardIds.splice(selectedHandIndex,1),c=card(id);log(used?`${p.name} menggunakan kartu "${c?.name||'Unknown'}".`:`Kartu "${c?.name||'Unknown'}" dikeluarkan dari tangan ${p.name}.`);selectedHandIndex=null;close('handCardDialog');render()}

function randomEligibleCards(){
  const p=player(activeId);
  if(!p)return [];
  const owned=new Set(p.cardIds);
  return state.masterCards.filter(c=>!owned.has(c.id));
}

function rollRandomCard(){
  const p=player(activeId);
  if(!p)return;

  const eligible=randomEligibleCards();

  if(!state.masterCards.length){
    alert('Card Library masih kosong. Buat kartu terlebih dahulu.');
    return;
  }

  if(!eligible.length){
    alert(`${p.name} sudah memiliki semua kartu yang tersedia di Card Library.`);
    return;
  }

  const index=Math.floor(Math.random()*eligible.length);
  const chosen=eligible[index];
  pendingRandomCardId=chosen.id;

  $('#randomPlayer').textContent=p.name;
  $('#randomCardName').textContent=chosen.name;
  $('#randomCardEffect').textContent=chosen.effect||'Tidak ada efek.';
  open('randomCardDialog');
}

function takeRandomCard(){
  const p=player(activeId);
  const c=card(pendingRandomCardId);
  if(!p||!c)return;

  // Validasi lagi supaya kartu tidak bisa ditambahkan ganda dari dialog lama.
  if(p.cardIds.includes(c.id)){
    pendingRandomCardId=null;
    close('randomCardDialog');
    alert('Kartu tersebut sudah ada di tangan player. Silakan random lagi.');
    return;
  }

  p.cardIds.push(c.id);
  log(`${p.name} mendapat kartu random "${c.name}".`);
  pendingRandomCardId=null;
  close('randomCardDialog');
  render();
}


function startMoney(a){const p=player(activeId);moneyAction=a;$('#amount').value='';$('#note').value='';$('#moneyError').classList.add('hidden');$('#otherWrap').classList.add('hidden');const map={'bank-add':['Tambah dari Bank',`${p.name} menerima uang dari Bank.`],'bank-sub':['Bayar ke Bank',`${p.name} membayar Bank.`],'receive':['Terima dari Player',`Saldo player sumber berkurang dan saldo ${p.name} bertambah.`],'send':['Transfer ke Player',`Saldo ${p.name} berkurang dan saldo player tujuan bertambah.`]};$('#moneyTitle').textContent=map[a][0];$('#moneyHelp').textContent=map[a][1];if(['receive','send'].includes(a)){const others=state.players.filter(x=>x.id!==p.id);if(!others.length)return alert('Butuh minimal 2 player.');$('#otherPlayer').innerHTML=others.map(x=>`<option value="${x.id}">${esc(x.name)} — ${cash(x.money)}</option>`).join('');$('#otherWrap').classList.remove('hidden')}open('moneyDialog')}
function moneyError(t){$('#moneyError').textContent=t;$('#moneyError').classList.remove('hidden')}
function doMoney(){const p=player(activeId),amt=Number($('#amount').value),note=$('#note').value.trim();if(!Number.isFinite(amt)||amt<=0){moneyError('Jumlah harus lebih dari 0.');return false}if(moneyAction==='bank-add'){p.money+=amt;log(`Bank memberi ${cash(amt)} kepada ${p.name}${note?' — '+note:''}.`)}if(moneyAction==='bank-sub'){if(p.money<amt){moneyError(`${p.name} hanya punya ${cash(p.money)}.`);return false}p.money-=amt;log(`${p.name} membayar ${cash(amt)} ke Bank${note?' — '+note:''}.`)}if(moneyAction==='send'){const q=player($('#otherPlayer').value);if(p.money<amt){moneyError(`${p.name} hanya punya ${cash(p.money)}.`);return false}p.money-=amt;q.money+=amt;log(`${p.name} transfer ${cash(amt)} kepada ${q.name}${note?' — '+note:''}.`)}if(moneyAction==='receive'){const q=player($('#otherPlayer').value);if(q.money<amt){moneyError(`${q.name} hanya punya ${cash(q.money)}.`);return false}q.money-=amt;p.money+=amt;log(`${p.name} menerima ${cash(amt)} dari ${q.name}${note?' — '+note:''}.`)}render();return true}

document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.screen)return screen(b.dataset.screen);if(b.dataset.close)return close(b.dataset.close);if(b.dataset.openPlayer)return openPlayer(b.dataset.openPlayer);if(b.dataset.editPlayer)return playerDialog(b.dataset.editPlayer);if(b.dataset.deletePlayer){const p=player(b.dataset.deletePlayer);if(!p||!confirm(`Hapus player ${p.name}?`))return;const i=state.players.findIndex(x=>x.id===p.id);state.players.splice(i,1);if(!state.players.length)state.turn=0;else if(i<state.turn)state.turn--;else if(state.turn>=state.players.length)state.turn=0;log(`Player ${p.name} dihapus.`);render();return}if(b.dataset.editCard)return masterDialog(b.dataset.editCard);if(b.dataset.deleteCard){const c=card(b.dataset.deleteCard);if(!c)return;const count=state.players.reduce((n,p)=>n+p.cardIds.filter(id=>id===c.id).length,0);if(!confirm(count?`Kartu ini ada ${count} kali di tangan player. Hapus dari library sekaligus dari semua tangan?`:`Hapus kartu "${c.name}"?`))return;state.masterCards=state.masterCards.filter(x=>x.id!==c.id);state.players.forEach(p=>p.cardIds=p.cardIds.filter(id=>id!==c.id));log(`Master card "${c.name}" dihapus.`);render();return}if(b.dataset.pickCard)return addToHand(b.dataset.pickCard);if(b.dataset.handIndex!==undefined)return handDetail(Number(b.dataset.handIndex));if(b.dataset.money)return startMoney(b.dataset.money)});
$('#openTurnBtn').onclick=()=>{const p=current();if(p)openPlayer(p.id)};$('#backBtn').onclick=()=>screen('players');$('#addPlayerBtn').onclick=()=>playerDialog();$('#addMasterCardBtn').onclick=()=>masterDialog();$('#pickCardBtn').onclick=picker;$('#randomCardBtn').onclick=rollRandomCard;$('#rerollRandomCardBtn').onclick=rollRandomCard;$('#takeRandomCardBtn').onclick=takeRandomCard;
$('#playerForm').onsubmit=e=>{e.preventDefault();const name=$('#playerName').value.trim(),money=Number($('#playerMoney').value);if(editPlayerId){const p=player(editPlayerId);const old=p.name;p.name=name;p.money=money;log(`Player ${old} diubah menjadi ${name}.`)}else{state.players.push({id:crypto.randomUUID(),name,money,cardIds:[]});log(`Player ${name} ditambahkan.`)}editPlayerId=null;close('playerDialog');render()};
$('#cardForm').onsubmit=e=>{e.preventDefault();const name=$('#cardName').value.trim(),effect=$('#cardEffect').value.trim();if(editCardId){const c=card(editCardId);c.name=name;c.effect=effect;log(`Master card "${name}" diperbarui.`)}else{state.masterCards.push({id:crypto.randomUUID(),name,effect});log(`Master card "${name}" ditambahkan.`)}editCardId=null;close('cardDialog');render()};
$('#moneyForm').onsubmit=e=>{e.preventDefault();if(doMoney())close('moneyDialog')};$('#useCardBtn').onclick=()=>removeHand(true);$('#removeCardBtn').onclick=()=>{if(confirm('Keluarkan kartu dari tangan tanpa dianggap digunakan?'))removeHand(false)};$('#endTurnBtn').onclick=()=>{const p=current();if(!p||p.id!==activeId)return;log(`Giliran ${p.name} selesai.`);state.turn=(state.turn+1)%state.players.length;activeId=null;screen('players');render()};$('#clearLogBtn').onclick=()=>{if(confirm('Hapus semua log?')){state.log=[];render()}};$('#resetBtn').onclick=()=>{if(confirm('Reset seluruh permainan dan Card Library?')){state=structuredClone(initial);activeId=null;screen('players');render()}};
render();
