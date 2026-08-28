'use strict';

const STORAGE_KEY = 'miau-25-less-v2';
const DEFAULT_TIMER = 60;
const DEFAULT_TARGET = 10;
const MIN_CARD_WORDS = 5;
const MAX_CARD_WORDS = 10;

const CARD_WORDS = [
 ['Payung','Kompas','Donat','Gunung Api','Kamera','Helikopter','Panda'],
 ['Astronaut','Sepeda','Popcorn','Mercusuar','Kaktus','Televisi','Mangga'],
 ['Piano','Pelangi','Koper','Pizza','Robot','Akuarium','Sepatu Roda'],
 ['Piramida','Teropong','Sandal','Gurita','Kembang Api','Kipas','Jerapah'],
 ['Kapal Selam','Cokelat','Jerapah','Lift','Mahkota','Kalkulator','Peluit'],
 ['Sikat Gigi','Bumerang','Bulan','Traktor','Es Krim','Kompor','Burung Merak'],
 ['Detektif','Semangka','Kastel','Mikrofon','Dinosaurus','Sapu Tangan','Koin'],
 ['Jam Pasir','Roket','Sushi','Hujan','Penyihir','Lemari','Bola Voli'],
 ['Bantal','Kapal Bajak Laut','Magnet','Kupu-kupu','Biola','Termos','Kuda Nil'],
 ['Lampu Lalu Lintas','Nanas','Vampir','Skateboard','Gunung Es','Parasut','Kemoceng'],
 ['Kacamata','Kanguru','Gitar','Peta','Kelinci','Obeng','Sosis'],
 ['Kapal Pesiar','Bawang','Badut','Air Terjun','Mesin Cuci','Timbangan','Burung Beo'],
 ['Senter','Unta','Stadion','Kue Ulang Tahun','Jangkar','Kabel','Pepaya'],
 ['Apotek','Burung Hantu','Kereta Api','Mie','Tenda','Kelereng','Topeng'],
 ['Penyu','Bioskop','Lilin','Koran','Jembatan','Keranjang','Lumba-lumba'],
 ['Topi','Singa','Laptop','Pantai','Teleskop','Ransel','Jagung'],
 ['Jas Hujan','Paus','Jam Tangan','Catur','Balon','Becak','Pancake'],
 ['Kopi','Kebun Binatang','Drone','Buku','Salju','Gembok','Kuda'],
 ['Sarung Tangan','Katak','Museum','Panci','Tornado','Kamera CCTV','Rambutan'],
 ['Kipas Angin','Lebah','Bola Basket','Sabun','Pulau','Spidol','Burung Elang'],
 ['Kunci','Bebek','Rumah Sakit','Pensil','Ombak','Koperasi','Permen'],
 ['Kapal Feri','Rusa','Kacamata Hitam','Roti','Menara','Penghapus','Kepiting'],
 ['Taksi','Koala','Teh','Gunting','Bintang','Setrika','Kelapa'],
 ['Kursi Roda','Zebra','Cermin','Laut','Palu','Kalender','Udang'],
 ['Kereta Gantung','Kucing','Pohon Kelapa','Dompet','Gelas','Stapler','Naga'],
 ['Bus Sekolah','Anjing','Bendera','Keju','Tangga','Kulkas','Durian'],
 ['Kapal Layar','Flamingo','Sapu','Gunung','Kado','Remote TV','Lobster'],
 ['Motor','Penguin','Sendok','Istana','Awan','Kaus Kaki','Martabak'],
 ['Ambulans','Landak','Bakso','Kincir Angin','Jam Alarm','Kardus','Burung Bangau'],
 ['Pesawat','Monyet','Jaket','Sungai','Mahkota Bunga','Payung Pantai','Wafel']
];

const seedCards = CARD_WORDS.map((words, i) => ({
  id: `C${String(i + 1).padStart(3, '0')}`,
  name: `Kartu ${String(i + 1).padStart(2, '0')}`,
  words
}));

const seedPlayers = [
  { id: 'P001', name: 'Oyen', team: 'A' },
  { id: 'P002', name: 'Milo', team: 'A' },
  { id: 'P003', name: 'Luna', team: 'B' },
  { id: 'P004', name: 'Tomo', team: 'B' }
];

function defaultData(){
  return {
    players: structuredClone(seedPlayers),
    cards: structuredClone(seedCards),
    counters: { player: 5, card: 31 },
    settings: { theme:'light', sound:true, timer:DEFAULT_TIMER, target:DEFAULT_TARGET }
  };
}

function loadData(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return defaultData();
    const p = JSON.parse(raw);
    return {
      players: Array.isArray(p.players) ? p.players : structuredClone(seedPlayers),
      cards: Array.isArray(p.cards) ? p.cards : structuredClone(seedCards),
      counters: { ...defaultData().counters, ...(p.counters||{}) },
      settings: { ...defaultData().settings, ...(p.settings||{}) }
    };
  }catch{ return defaultData(); }
}

let db = loadData();
let game = null;
let timerHandle = null;
let audioCtx = null;
let toastHandle = null;
let editing = null;

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const els = {
  setupPanel:$('#setupPanel'), gamePanel:$('#gamePanel'), phasePanel:$('#phasePanel'),
  teamAPlayers:$('#teamAPlayers'), teamBPlayers:$('#teamBPlayers'), teamACount:$('#teamACount'), teamBCount:$('#teamBCount'),
  timerSelect:$('#timerSelect'), targetSelect:$('#targetSelect'), startGameBtn:$('#startGameBtn'),
  scoreA:$('#scoreA'), scoreB:$('#scoreB'), trackA:$('#trackA'), trackB:$('#trackB'), roundNo:$('#roundNo'),
  themeToggle:$('#themeToggle'), soundToggle:$('#soundToggle'), manageBtn:$('#manageBtn'), homeBtn:$('#homeBtn'),
  manageDialog:$('#manageDialog'), formDialog:$('#formDialog'), entityForm:$('#entityForm'), formTitle:$('#formTitle'), formEyebrow:$('#formEyebrow'), formFields:$('#formFields'),
  winnerDialog:$('#winnerDialog'), winnerTitle:$('#winnerTitle'), winnerSubtitle:$('#winnerSubtitle'), rematchBtn:$('#rematchBtn'), backSetupBtn:$('#backSetupBtn'),
  toast:$('#toast')
};

function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); }
function escapeHTML(s=''){ return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function teamName(t){ return t==='A'?'Tim Oren':'Tim Tuxedo'; }
function teamEmoji(t){ return t==='A'?'🐈':'🐈‍⬛'; }
function otherTeam(t){ return t==='A'?'B':'A'; }
function shuffle(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function toast(msg){ els.toast.textContent=msg; els.toast.classList.add('show'); clearTimeout(toastHandle); toastHandle=setTimeout(()=>els.toast.classList.remove('show'),2200); }
function nextCode(kind){ const key=kind==='player'?'player':'card'; const prefix=kind==='player'?'P':'C'; const n=db.counters[key]++; save(); return `${prefix}${String(n).padStart(3,'0')}`; }
function ensureAudio(){ if(!db.settings.sound) return null; if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)(); if(audioCtx.state==='suspended') audioCtx.resume(); return audioCtx; }
function tone(freq,d=.1,type='sine',gain=.06,delay=0){ const c=ensureAudio(); if(!c)return; const o=c.createOscillator(), g=c.createGain(); o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.0001,c.currentTime+delay);g.gain.exponentialRampToValueAtTime(gain,c.currentTime+delay+.01);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+delay+d);o.connect(g).connect(c.destination);o.start(c.currentTime+delay);o.stop(c.currentTime+delay+d+.02); }
const snd={ bid(){tone(520,.07,'triangle');tone(680,.08,'triangle',.05,.05)}, correct(){tone(660,.08);tone(880,.11,'sine',.06,.06)}, word(){tone(300,.04,'square',.025)}, fail(){tone(220,.16,'sawtooth',.05);tone(160,.2,'sawtooth',.04,.1)}, win(){[523,659,784,1047].forEach((f,i)=>tone(f,.2,'triangle',.06,i*.1))}, tick(){tone(440,.035,'square',.02)} };

function applyTheme(){ document.documentElement.dataset.theme=db.settings.theme; els.themeToggle.textContent=db.settings.theme==='dark'?'☀️':'🌙'; els.soundToggle.textContent=db.settings.sound?'🔊':'🔇'; }
function renderSetup(){
  for(const t of ['A','B']){
    const ps=db.players.filter(p=>p.team===t);
    const box=t==='A'?els.teamAPlayers:els.teamBPlayers, count=t==='A'?els.teamACount:els.teamBCount;
    count.textContent=`${ps.length} pemain`;
    box.innerHTML=ps.length?ps.map(p=>`<span class="player-chip"><span class="crud-code">${escapeHTML(p.id)}</span> ${escapeHTML(p.name)}</span>`).join(''):'<span class="empty-state">Belum ada pemain.</span>';
  }
  els.timerSelect.value=String(db.settings.timer); els.targetSelect.value=String(db.settings.target);
}

function makeGame(){
  return {
    score:{A:0,B:0}, round:1, phase:'bidding', startingBidder:'A', currentBidder:'A',
    lastBidTeam:null, currentBid:26, proposal:25, bidHistory:[], playingTeam:null, judgeTeam:null, wordLimit:null,
    clueUsed:0, guessed:new Set(), remaining:db.settings.timer, deadline:null, running:false,
    playerIndex:{A:0,B:0}, deck:shuffle(db.cards.map(c=>c.id)), deckIndex:0, cardId:null,
    result:null, winner:null
  };
}
function playerFor(team){ const ps=db.players.filter(p=>p.team===team); if(!ps.length) return 'Clue-giver pilihan tim'; return ps[game.playerIndex[team]%ps.length].name; }
function drawCard(){ if(game.deckIndex>=game.deck.length){ game.deck=shuffle(db.cards.map(c=>c.id)); game.deckIndex=0; } game.cardId=game.deck[game.deckIndex++]; game.guessed=new Set(); }
function currentCard(){ return db.cards.find(c=>c.id===game?.cardId); }
function targetCount(){ return currentCard()?.words?.length || 0; }

function startGame(){
  if(db.cards.length<1) return toast('Tambahkan minimal 1 kartu.');
  if(db.players.filter(p=>p.team==='A').length<1 || db.players.filter(p=>p.team==='B').length<1) return toast('Sisakan minimal 1 pemain/placeholder per tim.');
  db.settings.timer=Number(els.timerSelect.value); db.settings.target=Number(els.targetSelect.value); save();
  game=makeGame(); drawCard(); els.setupPanel.classList.add('hidden'); els.gamePanel.classList.remove('hidden'); renderGame();
}
function backToSetup(){ stopTimer(); game=null; els.gamePanel.classList.add('hidden'); els.setupPanel.classList.remove('hidden'); if(els.winnerDialog.open) els.winnerDialog.close(); renderSetup(); }

function renderScore(){
  els.scoreA.textContent=game.score.A; els.scoreB.textContent=game.score.B; els.roundNo.textContent=game.round;
  for(const t of ['A','B']){
    const el=t==='A'?els.trackA:els.trackB; el.style.gridTemplateColumns=`repeat(${db.settings.target},1fr)`;
    el.innerHTML=Array.from({length:db.settings.target},(_,i)=>`<span class="score-dot ${i<game.score[t]?`reached-${t.toLowerCase()}`:''}" title="${i+1}"></span>`).join('');
  }
}
function cardMarkup({blurred=false, interactive=false}={}){
  const c=currentCard(); if(!c) return '';
  return `<div class="secret-card ${blurred?'blurred':''}" id="secretCard">
    <div class="secret-top"><div><span class="eyebrow">${escapeHTML(c.id)} • ${escapeHTML(c.name)}</span><h2>${c.words.length} Target Rahasia</h2></div><button class="secondary-btn" id="privacyBtn">${blurred?'👁 Tampilkan':'🙈 Sembunyikan'}</button></div>
    <div class="secret-words">${c.words.map((w,i)=> interactive ? `<button class="target-word ${game.guessed.has(i)?'guessed':''}" data-target="${i}" ${game.running?'':'disabled'}>${i+1}. ${escapeHTML(w)}</button>` : `<div class="secret-word">${i+1}. ${escapeHTML(w)}</div>`).join('')}</div>
  </div>`;
}

function renderBidding(){
  const maxAllowed=Math.max(1,game.currentBid-1);
  game.proposal=Math.min(game.proposal,maxAllowed);
  const noPrior=!game.lastBidTeam;
  els.phasePanel.innerHTML=`
    <div class="phase-head"><div><span class="eyebrow">FASE 1 • BIDDING</span><h2>Dua clue-giver lihat kartu, lalu tawar jumlah clue.</h2></div><div class="clue-givers"><span class="badge">🐈 ${escapeHTML(playerFor('A'))}</span><span class="badge">🐈‍⬛ ${escapeHTML(playerFor('B'))}</span></div></div>
    <div class="note">Hanya dua clue-giver yang boleh membaca ${targetCount()} target. Anggota tim penebak jangan melihat layar. Bidding resmi dimulai dari 25 dan harus makin rendah.</div>
    ${cardMarkup({blurred:false})}
    <div class="bidding-grid">
      <div class="bid-box">
        <span class="eyebrow">GILIRAN MENAWAR</span>
        <h2 class="${game.currentBidder==='A'?'team-a':'team-b'}">${teamEmoji(game.currentBidder)} ${teamName(game.currentBidder)}</h2>
        <div class="bid-number">${game.proposal}</div><div class="big-label">KATA CLUE</div>
        <div class="bid-controls"><button class="secondary-btn" id="bidMinus">−</button><input id="bidInput" type="number" min="1" max="${maxAllowed}" value="${game.proposal}"><button class="secondary-btn" id="bidPlus">+</button></div>
        <div class="bid-controls"><button class="primary-btn" id="placeBidBtn">Saya Bisa ${game.proposal} Kata</button><button class="danger-btn" id="passBidBtn" ${noPrior?'disabled':''}>PASS</button></div>
        ${noPrior?'<p class="muted">Belum boleh pass sebelum ada minimal satu bid.</p>':''}
      </div>
      <div class="history-box"><span class="eyebrow">BIDDING HISTORY</span><div class="history">${game.bidHistory.length?game.bidHistory.map(h=>`<div class="history-row"><span class="${h.team==='A'?'team-a':'team-b'}">${teamEmoji(h.team)} ${teamName(h.team)}</span><strong>${h.bid} kata</strong></div>`).join(''):'<span class="empty-state">Belum ada bid.</span>'}</div></div>
    </div>`;
  bindPrivacy();
  const input=$('#bidInput');
  const setProposal=v=>{ game.proposal=Math.max(1,Math.min(maxAllowed,Number(v)||1)); renderBidding(); };
  $('#bidMinus').onclick=()=>setProposal(game.proposal-1); $('#bidPlus').onclick=()=>setProposal(game.proposal+1); input.onchange=()=>setProposal(input.value);
  $('#placeBidBtn').onclick=placeBid; $('#passBidBtn').onclick=passBid;
}
function bindPrivacy(){ const b=$('#privacyBtn'); if(!b)return; b.onclick=()=>{ const card=$('#secretCard'); card.classList.toggle('blurred'); b.textContent=card.classList.contains('blurred')?'👁 Tampilkan':'🙈 Sembunyikan'; }; }
function placeBid(){
  const bid=Number($('#bidInput').value); if(!Number.isInteger(bid)||bid<1||bid>=game.currentBid) return toast(`Bid harus 1–${game.currentBid-1}.`);
  game.currentBid=bid; game.lastBidTeam=game.currentBidder; game.bidHistory.push({team:game.currentBidder,bid}); game.currentBidder=otherTeam(game.currentBidder); game.proposal=Math.max(1,bid-1); snd.bid(); renderGame();
}
function passBid(){
  if(!game.lastBidTeam) return;
  game.playingTeam=game.lastBidTeam; game.judgeTeam=otherTeam(game.playingTeam); game.wordLimit=game.currentBid; game.phase='ready'; renderGame();
}

function renderReady(){
  els.phasePanel.innerHTML=`<div class="phase-head"><div><span class="eyebrow">FASE 2 • CHALLENGE SIAP</span><h2>${teamEmoji(game.playingTeam)} ${teamName(game.playingTeam)} menang bid <strong>${game.wordLimit}</strong>.</h2></div><span class="badge">Juri: ${teamEmoji(game.judgeTeam)} ${teamName(game.judgeTeam)}</span></div>
  <div class="note"><strong>${escapeHTML(playerFor(game.playingTeam))}</strong> memberi clue. Juri lawan menekan <strong>+1 Kata Clue</strong> setiap kali clue-giver mengucapkan satu kata. “Benar/yes” sesudah tebakan benar tidak perlu dihitung bila kelompok Anda mengikuti aturan fisik yang umum dipakai.</div>
  ${cardMarkup({blurred:true})}
  <div class="result-actions" style="margin-top:18px"><button class="primary-btn" id="startChallengeBtn">Mulai ${db.settings.timer} Detik 🐾</button><button class="secondary-btn" id="backBidBtn">← Kembali ke Bidding</button></div>`;
  bindPrivacy(); $('#startChallengeBtn').onclick=startChallenge; $('#backBidBtn').onclick=()=>{game.phase='bidding';renderGame();};
}
function startChallenge(){ game.phase='playing'; game.clueUsed=0; game.guessed=new Set(); game.remaining=db.settings.timer; game.running=true; game.deadline=Date.now()+game.remaining*1000; snd.bid(); startTimer(); renderGame(); }
function startTimer(){ stopTimer(); timerHandle=setInterval(()=>{ if(!game?.running)return; const r=Math.max(0,Math.ceil((game.deadline-Date.now())/1000)); if(r!==game.remaining){ game.remaining=r; if(r<=5&&r>0)snd.tick(); renderPlayingDynamic(); } if(r<=0) failRound('Waktu habis.'); },150); }
function stopTimer(){ if(timerHandle){clearInterval(timerHandle);timerHandle=null;} }

function renderPlaying(){
  const remainingWords=Math.max(0,game.wordLimit-game.clueUsed);
  els.phasePanel.innerHTML=`<div class="phase-head"><div><span class="eyebrow">FASE 3 • PLAY</span><h2>${teamEmoji(game.playingTeam)} ${teamName(game.playingTeam)} sedang bermain</h2></div><span class="badge">Juri: ${teamEmoji(game.judgeTeam)} ${teamName(game.judgeTeam)}</span></div>
  <div class="challenge-grid">
    <div class="timer-card"><div class="big-label">WAKTU</div><div class="big-number" id="timerBig">${game.remaining}</div><div class="timer-bar"><div class="timer-fill" id="timerFill" style="width:${(game.remaining/db.settings.timer)*100}%"></div></div><p class="muted">detik</p></div>
    <div class="challenge-box"><div class="secret-top"><div><span class="eyebrow">${escapeHTML(currentCard().id)} • TARGET</span><h2 id="guessCount">${game.guessed.size} / ${targetCount()} benar</h2></div><button class="secondary-btn" id="privacyBtn">🙈 Sembunyikan</button></div>
      <div class="targets">${currentCard().words.map((w,i)=>`<button class="target-word ${game.guessed.has(i)?'guessed':''}" data-target="${i}">${i+1}. ${escapeHTML(w)}</button>`).join('')}</div>
      <p class="muted">Klik target ketika tim berhasil menebaknya. <span class="hotkey">${targetCount() <= 9 ? `1–${targetCount()}` : '1–9, 0=10'}</span> juga bisa dipakai.</p>
      <div class="result-actions"><button class="secondary-btn" id="undoCorrectBtn" ${!game.guessed.size?'disabled':''}>↶ Batalkan target terakhir</button><button class="danger-btn" id="manualFailBtn">Akhiri sebagai Gagal</button></div>
    </div>
    <div class="budget-card"><div class="big-label">SISA KATA CLUE</div><div class="big-number" id="wordsBig">${remainingWords}</div><p class="muted"><span id="usedText">${game.clueUsed}</span> / ${game.wordLimit} terpakai</p><div class="judge-actions"><button class="primary-btn word-used-btn" id="wordUsedBtn">+1 Kata Clue</button><button class="secondary-btn" id="undoWordBtn" ${game.clueUsed===0?'disabled':''}>↶ Undo kata</button></div><p class="muted">Tekan sekali per kata yang diucapkan clue-giver. Tekanan berikutnya setelah limit = gagal.</p></div>
  </div>`;
  bindPlayControls();
}
function bindPlayControls(){
  $('#privacyBtn').onclick=()=>{ const box=$('.challenge-box'); const tg=$('.targets'); tg.style.filter=tg.style.filter?'':'blur(12px)'; $('#privacyBtn').textContent=tg.style.filter?'👁 Tampilkan':'🙈 Sembunyikan'; };
  $$('.target-word[data-target]').forEach(b=>b.onclick=()=>markTarget(Number(b.dataset.target)));
  $('#wordUsedBtn').onclick=useClueWord; $('#undoWordBtn').onclick=undoWord; $('#undoCorrectBtn').onclick=undoCorrect; $('#manualFailBtn').onclick=()=>failRound('Challenge dihentikan oleh juri.');
}
function renderPlayingDynamic(){
  const t=$('#timerBig'),f=$('#timerFill'),w=$('#wordsBig'),u=$('#usedText'),g=$('#guessCount');
  if(t)t.textContent=game.remaining; if(f)f.style.width=`${(game.remaining/db.settings.timer)*100}%`; if(w)w.textContent=Math.max(0,game.wordLimit-game.clueUsed); if(u)u.textContent=game.clueUsed; if(g)g.textContent=`${game.guessed.size} / ${targetCount()} benar`;
}
function markTarget(i){ if(!game.running||i<0||i>=targetCount()||game.guessed.has(i))return; game.guessed.add(i); snd.correct(); if(game.guessed.size===targetCount()) return winRound(); renderPlaying(); }
function undoCorrect(){ if(!game.guessed.size)return; const arr=[...game.guessed]; game.guessed.delete(arr[arr.length-1]); renderPlaying(); }
function useClueWord(){ if(!game.running)return; game.clueUsed++; snd.word(); if(game.clueUsed>game.wordLimit) return failRound('Batas kata clue terlewati.'); renderPlayingDynamic(); }
function undoWord(){ if(game.clueUsed>0){game.clueUsed--;renderPlayingDynamic();} }
function winRound(){ finishRound(game.playingTeam,`Semua ${targetCount()} target berhasil dengan ${game.clueUsed}/${game.wordLimit} kata clue.`); }
function failRound(reason){ if(!game?.running)return; finishRound(game.judgeTeam,`${reason} Poin jatuh ke ${teamName(game.judgeTeam)}.`); }
function finishRound(pointTeam,reason){ game.running=false; stopTimer(); game.score[pointTeam]++; game.result={pointTeam,reason,success:pointTeam===game.playingTeam}; snd[game.result.success?'correct':'fail'](); game.phase='result'; renderGame(); if(game.score[pointTeam]>=db.settings.target) setTimeout(()=>showWinner(pointTeam),250); }

function renderResult(){
  const r=game.result;
  els.phasePanel.innerHTML=`<div class="round-result"><div class="result-cat">${r.success?'😸':'🙀'}</div><span class="eyebrow">RONDE ${game.round} SELESAI</span><h2>+1 ${teamEmoji(r.pointTeam)} ${teamName(r.pointTeam)}</h2><p class="muted">${escapeHTML(r.reason)}</p><p><strong>Bid:</strong> ${game.wordLimit} kata &nbsp;•&nbsp; <strong>Dipakai:</strong> ${game.clueUsed} &nbsp;•&nbsp; <strong>Benar:</strong> ${game.guessed.size}/${targetCount()}</p><div class="result-actions"><button class="secondary-btn" id="undoRoundBtn">↶ Batalkan hasil ronde</button><button class="primary-btn" id="nextRoundBtn">Ronde Berikutnya →</button></div></div>`;
  $('#undoRoundBtn').onclick=undoRoundResult; $('#nextRoundBtn').onclick=nextRound;
}
function undoRoundResult(){ const t=game.result.pointTeam; game.score[t]=Math.max(0,game.score[t]-1); game.phase='ready'; game.result=null; game.clueUsed=0; game.guessed=new Set(); game.remaining=db.settings.timer; renderGame(); }
function nextRound(){
  if(game.score.A>=db.settings.target||game.score.B>=db.settings.target) return;
  for(const t of ['A','B']){ const ps=db.players.filter(p=>p.team===t); if(ps.length) game.playerIndex[t]=(game.playerIndex[t]+1)%ps.length; }
  game.round++; game.startingBidder=otherTeam(game.startingBidder); game.currentBidder=game.startingBidder; game.lastBidTeam=null; game.currentBid=26; game.proposal=25; game.bidHistory=[]; game.playingTeam=null; game.judgeTeam=null; game.wordLimit=null; game.clueUsed=0; game.guessed=new Set(); game.remaining=db.settings.timer; game.result=null; game.phase='bidding'; drawCard(); renderGame();
}
function showWinner(team){ game.winner=team; snd.win(); els.winnerTitle.textContent=`${teamEmoji(team)} ${teamName(team)} menang!`; els.winnerSubtitle.textContent=`Skor akhir ${game.score.A}–${game.score.B}. Target ${db.settings.target} poin tercapai.`; els.winnerDialog.showModal(); }

function renderGame(){ if(!game)return; renderScore(); if(game.phase==='bidding')renderBidding(); else if(game.phase==='ready')renderReady(); else if(game.phase==='playing')renderPlaying(); else renderResult(); }

function renderManage(){ renderPlayersCrud(); renderCardsCrud(); renderDataTab(); }
function renderPlayersCrud(query=''){
  const q=query.trim().toLowerCase(); const rows=db.players.filter(p=>`${p.id} ${p.name} ${p.team}`.toLowerCase().includes(q));
  $('#tab-players').innerHTML=`<div class="crud-toolbar"><input id="playerSearch" placeholder="Cari P001, nama, atau tim…" value="${escapeHTML(query)}"><button class="primary-btn" id="addPlayerBtn">+ Pemain</button></div><div class="crud-list">${rows.length?rows.map(p=>`<div class="crud-row"><div class="crud-code">${escapeHTML(p.id)}</div><div><strong>${escapeHTML(p.name)}</strong><div class="crud-meta">${teamEmoji(p.team)} ${teamName(p.team)}</div></div><div class="row-actions"><button data-edit-player="${p.id}">Edit</button><button data-del-player="${p.id}">Hapus</button></div></div>`).join(''):'<div class="empty-state">Tidak ditemukan.</div>'}</div>`;
  $('#playerSearch').oninput=e=>renderPlayersCrud(e.target.value); $('#addPlayerBtn').onclick=()=>openPlayerForm(); $$('[data-edit-player]').forEach(b=>b.onclick=()=>openPlayerForm(b.dataset.editPlayer)); $$('[data-del-player]').forEach(b=>b.onclick=()=>deletePlayer(b.dataset.delPlayer));
}
function renderCardsCrud(query=''){
  const q=query.trim().toLowerCase(); const rows=db.cards.filter(c=>`${c.id} ${c.name} ${c.words.join(' ')}`.toLowerCase().includes(q));
  $('#tab-cards').innerHTML=`<div class="crud-toolbar"><input id="cardSearch" placeholder="Cari C007, nama, atau isi kata…" value="${escapeHTML(query)}"><button class="primary-btn" id="addCardBtn">+ Kartu</button></div><p class="muted">${db.cards.length} kartu • tiap kartu boleh ${MIN_CARD_WORDS}–${MAX_CARD_WORDS} target. ID manusiawi tidak didaur ulang setelah dihapus.</p><div class="crud-list">${rows.length?rows.map(c=>`<div class="crud-row"><div class="crud-code">${escapeHTML(c.id)}</div><div><strong>${escapeHTML(c.name)}</strong><div class="crud-meta">${c.words.length} target • ${c.words.map(escapeHTML).join(' • ')}</div></div><div class="row-actions"><button data-edit-card="${c.id}">Edit</button><button data-del-card="${c.id}">Hapus</button></div></div>`).join(''):'<div class="empty-state">Tidak ditemukan.</div>'}</div>`;
  $('#cardSearch').oninput=e=>renderCardsCrud(e.target.value); $('#addCardBtn').onclick=()=>openCardForm(); $$('[data-edit-card]').forEach(b=>b.onclick=()=>openCardForm(b.dataset.editCard)); $$('[data-del-card]').forEach(b=>b.onclick=()=>deleteCard(b.dataset.delCard));
}
function renderDataTab(){ $('#tab-data').innerHTML=`<div class="note">Data tersimpan di localStorage browser ini. Export JSON berguna untuk backup atau pindah perangkat.</div><div class="data-actions" style="margin-top:14px"><button class="primary-btn" id="exportBtn">Export JSON</button><label class="secondary-btn">Import JSON<input id="importFile" type="file" accept="application/json" hidden></label><button class="secondary-btn" id="resetCardsBtn">Reset 30 Kartu</button><button class="danger-btn" id="resetAllBtn">Reset Semua</button></div>`; $('#exportBtn').onclick=exportData; $('#importFile').onchange=importData; $('#resetCardsBtn').onclick=()=>{ if(confirm('Kembalikan kartu ke 30 seed original?')){db.cards=structuredClone(seedCards);db.counters.card=31;save();renderManage();toast('30 kartu dikembalikan.');}}; $('#resetAllBtn').onclick=()=>{if(confirm('Reset semua data lokal?')){db=defaultData();save();applyTheme();renderSetup();renderManage();toast('Semua data direset.');}}; }

function openPlayerForm(id=null){ const p=id?db.players.find(x=>x.id===id):null; editing={type:'player',id}; els.formEyebrow.textContent=p?escapeHTML(p.id):'PEMAIN BARU'; els.formTitle.textContent=p?'Edit Pemain':'Tambah Pemain'; els.formFields.innerHTML=`<label>Nama<input name="name" required maxlength="30" value="${escapeHTML(p?.name||'')}"></label><label>Tim<select name="team"><option value="A" ${p?.team==='A'?'selected':''}>🐈 Tim Oren</option><option value="B" ${p?.team==='B'?'selected':''}>🐈‍⬛ Tim Tuxedo</option></select></label>`; els.formDialog.showModal(); }
function openCardForm(id=null){ const c=id?db.cards.find(x=>x.id===id):null; editing={type:'card',id}; els.formEyebrow.textContent=c?escapeHTML(c.id):'KARTU BARU'; els.formTitle.textContent=c?'Edit Kartu':'Tambah Kartu'; els.formFields.innerHTML=`<label>Nama kartu<input name="name" required maxlength="50" value="${escapeHTML(c?.name||'')}"></label><label>Target (${MIN_CARD_WORDS}–${MAX_CARD_WORDS}) — satu per baris<textarea name="words" required>${escapeHTML(c?.words?.join('\n')||'')}</textarea></label>`; els.formDialog.showModal(); }
function deletePlayer(id){ if(db.players.length<=2)return toast('Sisakan minimal satu pemain/placeholder per tim.'); const p=db.players.find(x=>x.id===id); if(!p)return; if(db.players.filter(x=>x.team===p.team).length<=1)return toast(`Sisakan minimal 1 pemain di ${teamName(p.team)}.`); if(confirm(`Hapus ${id} — ${p.name}?`)){db.players=db.players.filter(x=>x.id!==id);save();renderSetup();renderPlayersCrud();} }
function deleteCard(id){ if(db.cards.length<=1)return toast('Sisakan minimal 1 kartu.'); if(confirm(`Hapus ${id}?`)){db.cards=db.cards.filter(x=>x.id!==id);save();renderCardsCrud();} }

els.entityForm.addEventListener('submit',e=>{
  e.preventDefault(); const fd=new FormData(e.currentTarget);
  if(editing.type==='player'){
    const obj=editing.id?db.players.find(x=>x.id===editing.id):null; const data={id:obj?.id||nextCode('player'),name:String(fd.get('name')).trim(),team:String(fd.get('team'))}; if(!data.name)return;
    if(obj)Object.assign(obj,data);else db.players.push(data); save(); renderSetup(); renderPlayersCrud();
  }else{
    const words=String(fd.get('words')).split(/\n/).map(x=>x.trim()).filter(Boolean); if(words.length<MIN_CARD_WORDS||words.length>MAX_CARD_WORDS)return toast(`Kartu harus berisi ${MIN_CARD_WORDS}–${MAX_CARD_WORDS} target.`);
    const obj=editing.id?db.cards.find(x=>x.id===editing.id):null; const data={id:obj?.id||nextCode('card'),name:String(fd.get('name')).trim()||'Kartu Baru',words}; if(obj)Object.assign(obj,data);else db.cards.push(data); save(); renderCardsCrud();
  }
  els.formDialog.close();
});

function exportData(){ const blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='miau-25-kata-data.json'; a.click(); URL.revokeObjectURL(a.href); }
function importData(e){ const file=e.target.files?.[0]; if(!file)return; const r=new FileReader(); r.onload=()=>{ try{ const p=JSON.parse(r.result); if(!Array.isArray(p.players)||!Array.isArray(p.cards))throw new Error(); if(p.cards.some(c=>!Array.isArray(c.words)||c.words.length<MIN_CARD_WORDS||c.words.length>MAX_CARD_WORDS))throw new Error(); db={...defaultData(),...p,settings:{...defaultData().settings,...(p.settings||{})},counters:{...defaultData().counters,...(p.counters||{})}}; save();applyTheme();renderSetup();renderManage();toast('Import berhasil.'); }catch{toast('JSON tidak valid untuk game ini.');} }; r.readAsText(file); }

els.startGameBtn.onclick=startGame;
els.themeToggle.onclick=()=>{db.settings.theme=db.settings.theme==='dark'?'light':'dark';save();applyTheme();};
els.soundToggle.onclick=()=>{db.settings.sound=!db.settings.sound;save();applyTheme();if(db.settings.sound)snd.bid();};
els.manageBtn.onclick=()=>{renderManage();els.manageDialog.showModal();};
els.homeBtn.onclick=()=>{if(game&&confirm('Kembali ke setup? Progress game saat ini akan hilang.'))backToSetup(); else if(!game)window.scrollTo({top:0,behavior:'smooth'});};
els.backSetupBtn.onclick=backToSetup;
els.rematchBtn.onclick=()=>{els.winnerDialog.close();game=makeGame();drawCard();renderGame();};
$$('[data-close-dialog]').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.closeDialog).close());
$$('.tab').forEach(b=>b.onclick=()=>{ $$('.tab').forEach(x=>x.classList.remove('active')); $$('.tab-content').forEach(x=>x.classList.remove('active')); b.classList.add('active'); $(`#tab-${b.dataset.tab}`).classList.add('active'); });

document.addEventListener('keydown',e=>{
  if(!game||game.phase!=='playing'||!game.running||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName))return;
  if(/^[1-9]$/.test(e.key)){
    const index=Number(e.key)-1;
    if(index<targetCount()){ e.preventDefault(); markTarget(index); }
  }
  if(e.key==='0'&&targetCount()>=10){ e.preventDefault(); markTarget(9); }
  if(e.code==='Space'){ e.preventDefault(); useClueWord(); }
});

applyTheme(); renderSetup();
