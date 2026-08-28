const STORAGE_KEY = 'miaw-hidden-v1';
const MAX_PLAYERS = 8;
const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const SUITS = [
  {name:'hearts', symbol:'♥', red:true},
  {name:'diamonds', symbol:'♦', red:true},
  {name:'clubs', symbol:'♣', red:false},
  {name:'spades', symbol:'♠', red:false},
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const E = {
  root: document.documentElement,
  themeBtn: $('#themeBtn'), themeIcon: $('#themeIcon'), rulesBtn: $('#rulesBtn'),
  setupScreen: $('#setupScreen'), gameScreen: $('#gameScreen'),
  playerCount: $('#playerCount'), playerList: $('#playerList'), addPlayerBtn: $('#addPlayerBtn'),
  readyNumber: $('#readyNumber'), readyTotal: $('#readyTotal'), readyTitle: $('#readyTitle'),
  readyDescription: $('#readyDescription'), setupChecklist: $('#setupChecklist'), startGameBtn: $('#startGameBtn'),
  roundNumber: $('#roundNumber'), deckCount: $('#deckCount'), foundCount: $('#foundCount'),
  teamProgressFill: $('#teamProgressFill'), deckButton: $('#deckButton'), drawCardBtn: $('#drawCardBtn'),
  currentCard: $('#currentCard'), drawMessage: $('#drawMessage'), peekBtn: $('#peekBtn'),
  restartDeckBtn: $('#restartDeckBtn'), endRoundBtn: $('#endRoundBtn'), playerBoard: $('#playerBoard'),
  historyList: $('#historyList'),
  playerModal: $('#playerModal'), playerModalTitle: $('#playerModalTitle'), playerForm: $('#playerForm'),
  playerNameInput: $('#playerNameInput'), playerFormError: $('#playerFormError'),
  pickModal: $('#pickModal'), handoffStep: $('#handoffStep'), selectionStep: $('#selectionStep'),
  handoffName: $('#handoffName'), readyToPickBtn: $('#readyToPickBtn'), rankGrid: $('#rankGrid'),
  selectedCount: $('#selectedCount'), savePicksBtn: $('#savePicksBtn'),
  rulesModal: $('#rulesModal'), peekModal: $('#peekModal'), peekChoices: $('#peekChoices'),
  winModal: $('#winModal'), winSummary: $('#winSummary'), winDraws: $('#winDraws'), winMisses: $('#winMisses'),
  newRoundBtn: $('#newRoundBtn'), backToLobbyBtn: $('#backToLobbyBtn'),
  confirmModal: $('#confirmModal'), confirmTitle: $('#confirmTitle'), confirmMessage: $('#confirmMessage'),
  confirmCancelBtn: $('#confirmCancelBtn'), confirmAcceptBtn: $('#confirmAcceptBtn'), toast: $('#toast'),
};

function uid(){
  if(window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `p-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function initialPlayers(){
  return [1,2,3].map(number=>({id:uid(), name:`Pemain ${number}`, picks:[], hits:{}}));
}

function createInitialState(){
  const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)').matches;
  return {
    theme: prefersLight ? 'light' : 'dark',
    players: initialPlayers(), phase:'setup', round:1,
    deck:[], history:[], currentCard:null, peekUsed:false, draws:0, misses:0,
  };
}

function normalizePlayer(player,index){
  const picks = [...new Set(Array.isArray(player?.picks) ? player.picks.filter(rank=>RANKS.includes(rank)).slice(0,3) : [])];
  const hits = {};
  if(player?.hits && typeof player.hits==='object'){
    picks.forEach(rank=>{
      const card=player.hits[rank];
      if(card && RANKS.includes(card.rank) && SUITS.some(suit=>suit.name===card.suit)) hits[rank]=card;
    });
  }
  return {
    id:String(player?.id || uid()),
    name:String(player?.name || `Pemain ${index+1}`).trim().slice(0,18) || `Pemain ${index+1}`,
    picks,
    hits,
  };
}

function loadState(){
  const fallback=createInitialState();
  try{
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
    if(!saved || !Array.isArray(saved.players)) return fallback;
    const players=saved.players.slice(0,MAX_PLAYERS).map(normalizePlayer);
    return {
      ...fallback,
      theme:saved.theme==='light' ? 'light' : 'dark',
      players:players.length ? players : fallback.players,
      phase:['setup','game','win'].includes(saved.phase) ? saved.phase : 'setup',
      round:Number.isInteger(saved.round) && saved.round>0 ? saved.round : 1,
      deck:Array.isArray(saved.deck) ? saved.deck : [],
      history:Array.isArray(saved.history) ? saved.history : [],
      currentCard:saved.currentCard || null,
      peekUsed:Boolean(saved.peekUsed),
      draws:Number(saved.draws)||0,
      misses:Number(saved.misses)||0,
    };
  }catch{
    return fallback;
  }
}

let state=loadState();
let editingPlayerId=null;
let pickingPlayerId=null;
let temporaryPicks=[];
let pendingConfirm=null;

function saveState(){
  try{ localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); }
  catch{ toast('Progres tidak dapat disimpan di perangkat ini.'); }
}

function escapeHTML(value){
  return String(value).replace(/[&<>'"]/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'
  })[char]);
}

function getInitial(name){
  return [...String(name).trim()][0]?.toUpperCase() || 'M';
}

function cardSuit(card){
  return SUITS.find(suit=>suit.name===card?.suit) || SUITS[2];
}

function totalTargets(){ return state.players.length*3; }
function totalFound(){ return state.players.reduce((sum,player)=>sum+Object.keys(player.hits||{}).length,0); }
function allPlayersReady(){ return state.players.length>0 && state.players.every(player=>player.picks.length===3); }

function toast(message){
  E.toast.textContent=message;
  E.toast.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer=setTimeout(()=>E.toast.classList.remove('show'),2200);
}

function applyTheme(){
  E.root.dataset.theme=state.theme;
  E.themeIcon.textContent=state.theme==='dark' ? '☀' : '☾';
  E.themeBtn.setAttribute('aria-label',state.theme==='dark' ? 'Ganti ke mode terang' : 'Ganti ke mode gelap');
  const themeMeta=$('meta[name="theme-color"]');
  if(themeMeta) themeMeta.content=state.theme==='dark' ? '#101426' : '#f2efe7';
}

function openModal(modal){
  modal.hidden=false;
  document.body.style.overflow='hidden';
}

function closeModal(modal){
  modal.hidden=true;
  if(!$$('.modal-backdrop').some(item=>!item.hidden)) document.body.style.overflow='';
}

function closeById(id){
  const modal=document.getElementById(id);
  if(modal) closeModal(modal);
  if(id==='pickModal'){
    pickingPlayerId=null;
    temporaryPicks=[];
  }
}

function askConfirm(title,message,acceptLabel,onAccept){
  E.confirmTitle.textContent=title;
  E.confirmMessage.textContent=message;
  E.confirmAcceptBtn.textContent=acceptLabel;
  pendingConfirm=onAccept;
  openModal(E.confirmModal);
}

function renderSetup(){
  const ready=state.players.filter(player=>player.picks.length===3).length;
  const total=state.players.length;
  E.playerCount.textContent=String(total);
  E.readyNumber.textContent=String(ready);
  E.readyTotal.textContent=`/${total}`;
  E.readyNumber.parentElement.style.setProperty('--ready-progress',`${total ? (ready/total)*100 : 0}%`);
  E.addPlayerBtn.disabled=total>=MAX_PLAYERS;
  E.startGameBtn.disabled=!allPlayersReady();
  E.readyTitle.textContent=ready===total ? 'Semua cakar siap!' : ready===0 ? 'Belum siap berburu' : `${total-ready} pemain belum memilih`;
  E.readyDescription.textContent=ready===total ? 'Semua pilihan telah terkunci dan tersembunyi.' : 'Setiap pemain harus memilih tepat tiga rank rahasia.';

  E.playerList.innerHTML=state.players.map((player,index)=>{
    const readyPlayer=player.picks.length===3;
    return `<div class="player-row ${readyPlayer?'player-ready':''}" data-player-id="${escapeHTML(player.id)}">
      <span class="player-avatar">${escapeHTML(getInitial(player.name))}</span>
      <div class="player-info"><strong>${escapeHTML(player.name)}</strong><small>${readyPlayer?'Pilihan tersimpan':'Belum memilih rank'}</small></div>
      <div class="secret-status" aria-label="${readyPlayer?'Tiga pilihan tersimpan':'Belum ada pilihan'}"><i>?</i><i>?</i><i>?</i></div>
      <div class="row-actions">
        <button class="mini-button pick-player" type="button" aria-label="Atur pilihan rahasia ${escapeHTML(player.name)}" title="Atur rahasia">${readyPlayer?'↻':'✦'}</button>
        <button class="mini-button edit-player" type="button" aria-label="Ubah nama ${escapeHTML(player.name)}" title="Ubah nama">✎</button>
        <button class="mini-button delete delete-player" type="button" aria-label="Hapus ${escapeHTML(player.name)}" title="Hapus pemain">×</button>
      </div>
    </div>`;
  }).join('');

  E.setupChecklist.innerHTML=state.players.map(player=>`<div class="check-item ${player.picks.length===3?'ready':''}"><span>${escapeHTML(player.name)}</span><span>${player.picks.length===3?'Siap ✓':'Menunggu'}</span></div>`).join('');
}

function renderCard(card,container,label='kartu terbuka'){
  if(!card){
    container.className='playing-card empty';
    container.innerHTML='<span class="card-rank">?</span><span class="card-suit">♣</span><span class="card-label">kartu berikutnya</span>';
    return;
  }
  const suit=cardSuit(card);
  container.className=`playing-card ${suit.red?'red':''}`;
  container.innerHTML=`<span class="card-rank">${escapeHTML(card.rank)}</span><span class="card-suit">${suit.symbol}</span><span class="card-label">${escapeHTML(label)}</span>`;
  container.classList.remove('just-drawn');
  void container.offsetWidth;
  container.classList.add('just-drawn');
}

function renderBoard(){
  E.playerBoard.innerHTML=state.players.map((player,index)=>{
    const found=Object.keys(player.hits||{}).length;
    const slots=player.picks.map(rank=>{
      const card=player.hits[rank];
      if(!card) return '<span class="secret-card" aria-label="Belum ditemukan">?</span>';
      const suit=cardSuit(card);
      return `<span class="secret-card found ${suit.red?'red':''}" aria-label="${escapeHTML(rank)} ${suit.name} ditemukan">${escapeHTML(rank)}<span class="tiny-suit">${suit.symbol}</span></span>`;
    }).join('');
    return `<div class="hunt-row ${found===3?'hunt-complete':''}">
      <div class="hunt-player"><span class="player-avatar">${escapeHTML(getInitial(player.name))}</span><span><strong>${escapeHTML(player.name)}</strong><small>${found===3?'Lengkap!':'Sedang berburu'}</small></span></div>
      <div class="secret-slots">${slots}</div>
      <span class="hunt-progress">${found}/3</span>
    </div>`;
  }).join('');
}

function renderHistory(){
  if(!state.history.length){
    E.historyList.innerHTML='<span class="history-empty">Belum ada kartu yang dibuka.</span>';
    return;
  }
  E.historyList.innerHTML=state.history.map(entry=>{
    const card=entry.card||entry;
    const suit=cardSuit(card);
    return `<div class="history-card ${suit.red?'red':''} ${entry.hit?'hit':''}" title="${escapeHTML(card.rank)} ${suit.name}${entry.hit?', cocok dengan pilihan pemain':''}"><b>${escapeHTML(card.rank)}</b><small>${suit.symbol}</small><span>${entry.hit?'HIT':'MISS'}</span></div>`;
  }).join('');
}

function renderGame(){
  const found=totalFound(), targets=totalTargets();
  E.roundNumber.textContent=String(state.round);
  E.deckCount.textContent=String(state.deck.length);
  E.foundCount.textContent=`${found}/${targets}`;
  E.teamProgressFill.style.width=`${targets ? (found/targets)*100 : 0}%`;
  E.drawCardBtn.disabled=!state.deck.length || state.phase!=='game';
  E.deckButton.disabled=E.drawCardBtn.disabled;
  E.peekBtn.disabled=state.peekUsed || !state.deck.length || state.phase!=='game';
  E.peekBtn.innerHTML=state.peekUsed ? '<span aria-hidden="true">◈</span> Teropong terpakai' : '<span aria-hidden="true">◈</span> Teropong Miaw <small>1×</small>';
  renderCard(state.currentCard,E.currentCard);
  renderBoard();
  renderHistory();
}

function renderScreens(){
  const inGame=state.phase==='game' || state.phase==='win';
  E.setupScreen.hidden=inGame;
  E.gameScreen.hidden=!inGame;
  if(inGame) renderGame(); else renderSetup();
}

function renderAll(){
  applyTheme();
  renderScreens();
}

function openPlayerEditor(playerId=null){
  editingPlayerId=playerId;
  const player=state.players.find(item=>item.id===playerId);
  E.playerModalTitle.textContent=player ? 'Ubah nama pemain' : 'Tambah pemain';
  E.playerNameInput.value=player?.name || '';
  E.playerFormError.textContent='';
  openModal(E.playerModal);
  setTimeout(()=>E.playerNameInput.focus(),50);
}

function deletePlayer(playerId){
  const player=state.players.find(item=>item.id===playerId);
  if(!player) return;
  askConfirm('Hapus pemain?',`${player.name} dan pilihan rahasianya akan dihapus.`,'Hapus',()=>{
    state.players=state.players.filter(item=>item.id!==playerId);
    if(!state.players.length) state.players=initialPlayers().slice(0,1);
    saveState();
    renderSetup();
    toast('Pemain dihapus.');
  });
}

function openPickFlow(playerId){
  const player=state.players.find(item=>item.id===playerId);
  if(!player) return;
  pickingPlayerId=playerId;
  temporaryPicks=[...player.picks];
  E.handoffName.textContent=player.name;
  E.handoffStep.hidden=false;
  E.selectionStep.hidden=true;
  openModal(E.pickModal);
}

function renderRankChoices(){
  E.rankGrid.innerHTML=RANKS.map(rank=>`<button class="rank-button ${temporaryPicks.includes(rank)?'selected':''}" type="button" data-rank="${rank}" aria-pressed="${temporaryPicks.includes(rank)}">${rank}</button>`).join('');
  E.selectedCount.textContent=String(temporaryPicks.length);
  E.savePicksBtn.disabled=temporaryPicks.length!==3;
}

function createDeck(){
  const deck=[];
  SUITS.forEach(suit=>RANKS.forEach(rank=>deck.push({id:`${rank}-${suit.name}`,rank,suit:suit.name})));
  for(let i=deck.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [deck[i],deck[j]]=[deck[j],deck[i]];
  }
  return deck;
}

function resetRoundData(keepPicks=true){
  state.deck=createDeck();
  state.history=[];
  state.currentCard=null;
  state.peekUsed=false;
  state.draws=0;
  state.misses=0;
  state.players.forEach(player=>{
    player.hits={};
    if(!keepPicks) player.picks=[];
  });
}

function startGame(){
  if(!allPlayersReady()) return;
  resetRoundData(true);
  state.phase='game';
  saveState();
  renderScreens();
  window.scrollTo({top:0,behavior:'smooth'});
}

function processCard(card){
  if(!card || state.phase!=='game') return;
  const matchedPlayers=[];
  state.players.forEach(player=>{
    if(player.picks.includes(card.rank) && !player.hits[card.rank]){
      player.hits[card.rank]={...card};
      matchedPlayers.push(player.name);
    }
  });
  const hit=matchedPlayers.length>0;
  state.currentCard=card;
  state.draws+=1;
  if(!hit) state.misses+=1;
  state.history.unshift({card:{...card},hit});
  E.drawMessage.classList.toggle('hit',hit);
  if(hit){
    const names=matchedPlayers.join(', ');
    E.drawMessage.textContent=`Cocok! Rank ${card.rank} ditemukan untuk ${names}.`;
  }else{
    E.drawMessage.textContent=`Rank ${card.rank} belum dibutuhkan, lanjutkan berburu.`;
  }
  saveState();
  renderGame();
  if(totalFound()===totalTargets()){
    state.phase='win';
    saveState();
    setTimeout(showWin,500);
  }
}

function drawNextCard(){
  if(state.phase!=='game' || !state.deck.length) return;
  const card=state.deck.shift();
  processCard(card);
}

function openPeek(){
  if(state.peekUsed || !state.deck.length || state.phase!=='game') return;
  const cards=state.deck.slice(0,Math.min(3,state.deck.length));
  E.peekChoices.innerHTML=cards.map((card,index)=>{
    const suit=cardSuit(card);
    return `<button class="peek-choice" type="button" data-peek-index="${index}" aria-label="Pilih ${escapeHTML(card.rank)} ${suit.name}"><span class="playing-card ${suit.red?'red':''}"><span class="card-rank">${escapeHTML(card.rank)}</span><span class="card-suit">${suit.symbol}</span><span class="card-label">pilih kartu ini</span></span></button>`;
  }).join('');
  openModal(E.peekModal);
}

function usePeek(index){
  const card=state.deck.splice(index,1)[0];
  if(!card) return;
  state.peekUsed=true;
  closeModal(E.peekModal);
  processCard(card);
}

function showWin(){
  const targets=totalTargets();
  E.winSummary.textContent=`${targets} kartu rahasia milik ${state.players.length} pemain berhasil ditemukan bersama.`;
  E.winDraws.textContent=String(state.draws);
  E.winMisses.textContent=String(state.misses);
  openModal(E.winModal);
}

function returnToSetup(incrementRound=true){
  closeModal(E.winModal);
  if(incrementRound) state.round+=1;
  state.phase='setup';
  resetRoundData(false);
  state.deck=[];
  saveState();
  renderScreens();
  window.scrollTo({top:0,behavior:'smooth'});
}

function bindEvents(){
  E.themeBtn.addEventListener('click',()=>{
    state.theme=state.theme==='dark'?'light':'dark';
    saveState();
    applyTheme();
  });
  E.rulesBtn.addEventListener('click',()=>openModal(E.rulesModal));
  E.addPlayerBtn.addEventListener('click',()=>{
    if(state.players.length>=MAX_PLAYERS) return toast('Maksimal delapan pemain.');
    openPlayerEditor();
  });
  E.playerList.addEventListener('click',event=>{
    const row=event.target.closest('.player-row');
    if(!row) return;
    const id=row.dataset.playerId;
    if(event.target.closest('.pick-player')) openPickFlow(id);
    if(event.target.closest('.edit-player')) openPlayerEditor(id);
    if(event.target.closest('.delete-player')) deletePlayer(id);
  });
  E.playerForm.addEventListener('submit',event=>{
    event.preventDefault();
    const name=E.playerNameInput.value.trim();
    if(!name){ E.playerFormError.textContent='Nama pemain wajib diisi.'; return; }
    const duplicate=state.players.some(player=>player.id!==editingPlayerId && player.name.toLowerCase()===name.toLowerCase());
    if(duplicate){ E.playerFormError.textContent='Nama tersebut sudah digunakan.'; return; }
    if(editingPlayerId){
      const player=state.players.find(item=>item.id===editingPlayerId);
      if(player) player.name=name;
      toast('Nama pemain diperbarui.');
    }else{
      state.players.push({id:uid(),name,picks:[],hits:{}});
      toast('Pemain ditambahkan.');
    }
    editingPlayerId=null;
    saveState();
    closeModal(E.playerModal);
    renderSetup();
  });
  E.readyToPickBtn.addEventListener('click',()=>{
    E.handoffStep.hidden=true;
    E.selectionStep.hidden=false;
    renderRankChoices();
  });
  E.rankGrid.addEventListener('click',event=>{
    const button=event.target.closest('[data-rank]');
    if(!button) return;
    const rank=button.dataset.rank;
    if(temporaryPicks.includes(rank)) temporaryPicks=temporaryPicks.filter(item=>item!==rank);
    else if(temporaryPicks.length<3) temporaryPicks.push(rank);
    else return toast('Maksimal tiga rank. Hapus satu pilihan terlebih dahulu.');
    renderRankChoices();
  });
  E.savePicksBtn.addEventListener('click',()=>{
    if(temporaryPicks.length!==3) return;
    const player=state.players.find(item=>item.id===pickingPlayerId);
    if(player){ player.picks=[...temporaryPicks]; player.hits={}; }
    saveState();
    closeModal(E.pickModal);
    pickingPlayerId=null;
    temporaryPicks=[];
    renderSetup();
    toast('Tiga pilihan dikunci dan disembunyikan.');
  });
  E.startGameBtn.addEventListener('click',startGame);
  E.deckButton.addEventListener('click',drawNextCard);
  E.drawCardBtn.addEventListener('click',drawNextCard);
  E.peekBtn.addEventListener('click',openPeek);
  E.peekChoices.addEventListener('click',event=>{
    const choice=event.target.closest('[data-peek-index]');
    if(choice) usePeek(Number(choice.dataset.peekIndex));
  });
  E.restartDeckBtn.addEventListener('click',()=>askConfirm('Ulangi deck?','Semua kartu yang sudah ditemukan pada ronde ini akan disembunyikan kembali.','Ulangi',()=>{
    resetRoundData(true);
    E.drawMessage.textContent='Deck baru sudah dikocok. Klik untuk membuka kartu.';
    E.drawMessage.classList.remove('hit');
    saveState();
    renderGame();
  }));
  E.endRoundBtn.addEventListener('click',()=>askConfirm('Akhiri ronde?','Progres ronde ini akan dihapus dan semua pemain memilih ulang.','Akhiri',()=>returnToSetup(true)));
  E.newRoundBtn.addEventListener('click',()=>returnToSetup(true));
  E.backToLobbyBtn.addEventListener('click',()=>returnToSetup(true));
  E.confirmCancelBtn.addEventListener('click',()=>{ pendingConfirm=null; closeModal(E.confirmModal); });
  E.confirmAcceptBtn.addEventListener('click',()=>{
    const action=pendingConfirm;
    pendingConfirm=null;
    closeModal(E.confirmModal);
    if(action) action();
  });
  $$('[data-close]').forEach(button=>button.addEventListener('click',()=>closeById(button.dataset.close)));
  $$('.modal-backdrop').forEach(backdrop=>backdrop.addEventListener('click',event=>{
    if(event.target!==backdrop || backdrop===E.pickModal || backdrop===E.winModal) return;
    if(backdrop===E.confirmModal) pendingConfirm=null;
    closeModal(backdrop);
  }));
  document.addEventListener('keydown',event=>{
    if(event.key!=='Escape') return;
    const open=$$('.modal-backdrop').reverse().find(modal=>!modal.hidden);
    if(open && open!==E.pickModal && open!==E.winModal){
      if(open===E.confirmModal) pendingConfirm=null;
      closeModal(open);
    }
  });
}

function init(){
  bindEvents();
  renderAll();
  if(state.phase==='win') showWin();
}

init();
