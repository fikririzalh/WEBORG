(() => {
  'use strict';

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const STORAGE = 'knd-remi-companion-v1';
  const THEME = 'knd-remi-theme';
  const suits = ['♥', '♦', '♣', '♠'];
  const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  const defaultHouses = ['Rumah Maple', 'Rumah Cedar', 'Rumah Oak', 'Rumah Pine', 'Rumah Rose', 'Rumah Lake'];

  const CARD_TYPES = {
    gift: { label: 'Gift', icon: '🎁', desc: '+1 Gift pada rumah saat pile dibuka.' },
    grudge: { label: 'Grudge', icon: '🔪', desc: '+1 Grudge pada rumah saat pile dibuka.' },
    protection: { label: 'Protection', icon: '🛡️', desc: 'Menyerap 1 poin Grudge/Death pada rumah.' },
    investigation: { label: 'Investigation', icon: '🔎', desc: 'Dipakai segera untuk memeriksa 1 pemain secara privat.' },
    death: { label: 'Death', icon: '☠️', desc: 'Bernilai +2 Grudge saat pile dibuka.' }
  };

  const freshState = () => ({
    phase: 'welcome',
    view: 'board',
    setup: { playerCount: 4, houseCount: 6, safeTarget: 3, deadTarget: 3 },
    players: [],
    houses: [],
    roleRevealIndex: 0,
    roleVisible: false,
    turnIndex: 0,
    round: 1,
    usedCards: [],
    wrongVotes: [],
    log: [],
    winner: null,
    history: []
  });

  let state = load() || freshState();
  let setupNames = [];
  let selectedRank = '7';
  let selectedSuit = '♥';

  function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE)); } catch { return null; }
  }
  function save() { localStorage.setItem(STORAGE, JSON.stringify(state)); }
  function snapshot() {
    const clone = JSON.parse(JSON.stringify(state));
    clone.history = [];
    state.history = [...(state.history || []).slice(-14), clone];
  }
  function undo() {
    const previous = state.history?.pop();
    if (!previous) return toast('Belum ada aksi yang bisa dibatalkan.');
    const remaining = state.history;
    state = previous;
    state.history = remaining;
    save(); render(); toast('Aksi terakhir dibatalkan.');
  }
  function toast(message) {
    const el = document.createElement('div'); el.className = 'toast'; el.textContent = message;
    $('#toastRoot').appendChild(el); setTimeout(() => el.remove(), 2400);
  }
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function esc(str='') { return String(str).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function roleInfo(role) {
    if (role === 'killer') return { title:'KILLER', icon:'🔪', cls:'killer', text:'Buat lingkungan runtuh. Bantu mencapai target rumah DEAD dan hindari vote.' };
    if (role === 'snoop') return { title:'SNOOP', icon:'🕵️', cls:'snoop', text:'Berpihak pada warga. Anda punya 1 investigasi gratis sepanjang permainan.' };
    return { title:'NEIGHBOR', icon:'🏠', cls:'neighbor', text:'Selamatkan lingkungan, baca kebohongan pemain, dan temukan Killer.' };
  }
  function cardType(rank, suit) {
    if (rank === 'A') return 'death';
    if (rank === 'Q') return 'protection';
    if (rank === 'K') return 'investigation';
    return (suit === '♥' || suit === '♦') ? 'gift' : 'grudge';
  }
  function cardCode(rank, suit) { return `${rank}${suit}`; }
  function cardColor(suit) { return (suit === '♥' || suit === '♦') ? 'red' : 'black'; }
  function houseStatus(h) {
    if (h.status === 'safe' || h.status === 'dead') return h.status;
    const effective = Math.max(0, h.grudge - h.protection);
    if (h.gift >= 3) return 'safe';
    if (effective >= 3) return 'dead';
    return 'alive';
  }
  function updateHouseStatuses() {
    state.houses.forEach(h => { if (h.status === 'alive') h.status = houseStatus(h); });
    checkWin();
  }
  function counts() {
    return {
      safe: state.houses.filter(h => h.status === 'safe').length,
      dead: state.houses.filter(h => h.status === 'dead').length,
      alive: state.houses.filter(h => h.status === 'alive').length
    };
  }
  function checkWin() {
    if (state.winner) return;
    const c = counts();
    if (c.safe >= state.setup.safeTarget) state.winner = 'neighbors';
    if (c.dead >= state.setup.deadTarget) state.winner = 'killer';
    if (state.usedCards.length >= 52 && !state.winner) state.winner = 'killer';
  }
  function addLog(icon, text) {
    state.log.unshift({ icon, text, ts: new Date().toISOString() });
    state.log = state.log.slice(0, 30);
  }
  function currentPlayer() { return state.players[state.turnIndex] || state.players[0]; }

  function render() {
    document.documentElement.dataset.theme = localStorage.getItem(THEME) || 'light';
    $('#themeBtn').textContent = document.documentElement.dataset.theme === 'dark' ? '☀' : '☾';
    const inGame = ['game'].includes(state.phase);
    $('#bottomNav').classList.toggle('hidden', !inGame);
    if (state.phase === 'welcome') renderWelcome();
    else if (state.phase === 'setup') renderSetup();
    else if (state.phase === 'roles') renderRolePass();
    else renderGame();
    updateNav();
  }

  function renderWelcome() {
    $('#app').innerHTML = `
      <section class="screen">
        <div class="hero">
          <div class="kicker" style="color:#FFD730">SATU HP • SATU DECK REMI</div>
          <h1>Siapa pembunuh di sebelah?</h1>
          <p>Companion offline untuk permainan social deduction dengan 52 kartu remi. Kartu tetap fisik; HP mengurus role rahasia, decoder, papan lingkungan, investigasi, vote, dan status permainan.</p>
          <div class="hero-badges"><span class="badge">📱 Pass & Play</span><span class="badge">🃏 52 kartu</span><span class="badge">🌙 Dark / Light</span><span class="badge">📴 Offline</span></div>
          <div class="mapping-strip">
            <div class="mapping-pill"><span>🎁</span>Merah</div>
            <div class="mapping-pill"><span>🔪</span>Hitam</div>
            <div class="mapping-pill"><span>🛡️</span>Q</div>
            <div class="mapping-pill"><span>🔎</span>K</div>
            <div class="mapping-pill"><span>☠️</span>A</div>
          </div>
        </div>

        <div class="section stack">
          <button class="btn primary full" id="newGameBtn">Mulai Permainan Baru</button>
          ${hasPlayableSave() ? '<button class="btn secondary full" id="continueBtn">Lanjutkan Permainan Tersimpan</button>' : ''}
        </div>

        <div class="section card flat">
          <div class="section-head"><div><span class="kicker">DECK V1</span><h2>Aturan hafalan</h2></div></div>
          <div class="rules">
            <div class="rule"><div class="rule-icon">♥♦</div><div><h3>Merah = Gift</h3><p>Semua 2–J merah menjadi Gift.</p></div></div>
            <div class="rule"><div class="rule-icon">♣♠</div><div><h3>Hitam = Grudge</h3><p>Semua 2–J hitam menjadi Grudge.</p></div></div>
            <div class="rule"><div class="rule-icon">Q</div><div><h3>Semua Queen = Protection</h3><p>Empat Q menjadi kartu perlindungan.</p></div></div>
            <div class="rule"><div class="rule-icon">K</div><div><h3>Semua King = Investigation</h3><p>Empat K dapat memeriksa satu pemain secara privat.</p></div></div>
            <div class="rule"><div class="rule-icon">A</div><div><h3>Semua Ace = Death</h3><p>Empat A bernilai dua poin Grudge saat pile dibuka.</p></div></div>
          </div>
        </div>
      </section>`;
    $('#newGameBtn').onclick = () => { state = freshState(); state.phase = 'setup'; setupNames = []; save(); render(); };
    if ($('#continueBtn')) $('#continueBtn').onclick = () => { state.phase = 'game'; save(); render(); };
  }

  function hasPlayableSave() { return state.players?.length >= 3 && state.houses?.length >= 1; }

  function renderSetup() {
    if (!setupNames.length) setupNames = Array.from({length: state.setup.playerCount}, (_,i) => `Pemain ${i+1}`);
    while (setupNames.length < state.setup.playerCount) setupNames.push(`Pemain ${setupNames.length+1}`);
    setupNames = setupNames.slice(0, state.setup.playerCount);
    $('#app').innerHTML = `
      <section class="screen">
        <div class="section-head"><div><span class="kicker">SETUP</span><h2>Siapkan lingkungan</h2><p>Satu HP dipakai bersama. Tidak perlu akun atau room code.</p></div></div>
        <div class="card stack">
          <div class="form-grid two">
            ${stepper('Jumlah pemain', 'playerCount', state.setup.playerCount, 3, 8)}
            ${stepper('Jumlah rumah', 'houseCount', state.setup.houseCount, 4, 8)}
            ${stepper('Target SAFE', 'safeTarget', state.setup.safeTarget, 2, 5)}
            ${stepper('Target DEAD', 'deadTarget', state.setup.deadTarget, 2, 5)}
          </div>
          <div class="sep"></div>
          <div class="field"><label>NAMA PEMAIN</label><div class="player-inputs" id="playerInputs">${setupNames.map((n,i)=>`<div class="player-line"><span class="player-chip">${i+1}</span><input class="input player-name" data-i="${i}" maxlength="20" value="${esc(n)}" /></div>`).join('')}</div></div>
          <div class="note">Role otomatis: <strong>1 Killer</strong>, <strong>1 Snoop</strong>, sisanya Neighbor. Role dibuka satu per satu lewat pass-and-play.</div>
          <button class="btn primary full" id="dealRolesBtn">Acak Role & Mulai</button>
        </div>
      </section>`;

    $$('.step-btn').forEach(btn => btn.onclick = () => {
      const key = btn.dataset.key; const delta = Number(btn.dataset.delta); const min = Number(btn.dataset.min); const max = Number(btn.dataset.max);
      state.setup[key] = Math.max(min, Math.min(max, state.setup[key] + delta));
      if (key === 'playerCount') {
        while (setupNames.length < state.setup.playerCount) setupNames.push(`Pemain ${setupNames.length+1}`);
        setupNames = setupNames.slice(0, state.setup.playerCount);
      }
      if (key === 'houseCount') {
        state.setup.safeTarget = Math.min(state.setup.safeTarget, state.setup.houseCount);
        state.setup.deadTarget = Math.min(state.setup.deadTarget, state.setup.houseCount);
      }
      save(); renderSetup();
    });
    $$('.player-name').forEach(inp => inp.oninput = () => { setupNames[Number(inp.dataset.i)] = inp.value; });
    $('#dealRolesBtn').onclick = startGame;
  }

  function stepper(label, key, value, min, max) {
    return `<div class="field"><label>${label.toUpperCase()}</label><div class="number-stepper"><button class="btn secondary step-btn" data-key="${key}" data-delta="-1" data-min="${min}" data-max="${max}">−</button><strong>${value}</strong><button class="btn secondary step-btn" data-key="${key}" data-delta="1" data-min="${min}" data-max="${max}">+</button></div></div>`;
  }

  function startGame() {
    const names = setupNames.map((n,i) => n.trim() || `Pemain ${i+1}`);
    if (new Set(names.map(n=>n.toLowerCase())).size !== names.length) return toast('Nama pemain harus berbeda.');
    const roles = shuffle(['killer','snoop', ...Array(names.length-2).fill('neighbor')]);
    state.players = names.map((name,i)=>({ id: cryptoId(), name, role: roles[i], snoopUsed: false }));
    state.houses = Array.from({length: state.setup.houseCount}, (_,i)=>({ id: cryptoId(), name: defaultHouses[i] || `Rumah ${i+1}`, gift:0, grudge:0, protection:0, status:'alive', resolvedCards:[] }));
    state.roleRevealIndex = 0; state.roleVisible = false; state.phase = 'roles'; state.view = 'board'; state.turnIndex = 0; state.round = 1; state.usedCards = []; state.log = []; state.winner = null; state.wrongVotes = []; state.history=[];
    save(); render();
  }

  function renderRolePass() {
    const p = state.players[state.roleRevealIndex];
    if (!p) { state.phase='game'; save(); render(); return; }
    const info = roleInfo(p.role);
    $('#app').innerHTML = `
      <section class="screen role-pass">
        ${state.roleVisible ? `
          <div class="role-card ${info.cls}"><div class="role-icon">${info.icon}</div><div><span class="kicker" style="color:rgba(255,255,255,.7)">${esc(p.name)}</span><h2>${info.title}</h2></div><p>${info.text}</p></div>
          <div class="section"><button class="btn primary full" id="hideRoleBtn">Sembunyikan & Oper HP</button></div>
        ` : `
          <div class="card privacy"><div class="big">📱</div><span class="kicker">GILIRAN RAHASIA ${state.roleRevealIndex+1}/${state.players.length}</span><h2>${esc(p.name)}</h2><p>Pastikan pemain lain tidak melihat layar. Tekan tombol di bawah saat HP sudah ada di tangan ${esc(p.name)}.</p><button class="btn primary" id="showRoleBtn">Lihat Role Saya</button></div>
        `}
      </section>`;
    if ($('#showRoleBtn')) $('#showRoleBtn').onclick = () => { state.roleVisible = true; save(); renderRolePass(); };
    if ($('#hideRoleBtn')) $('#hideRoleBtn').onclick = () => {
      state.roleVisible = false; state.roleRevealIndex++;
      if (state.roleRevealIndex >= state.players.length) { state.phase='game'; addLog('🎬','Permainan dimulai. Role sudah dibagikan.'); }
      save(); render();
    };
  }

  function renderGame() {
    if (state.winner) return renderWinner();
    if (state.view === 'board') renderBoard();
    else if (state.view === 'turn') renderTurn();
    else if (state.view === 'deck') renderDeck();
    else if (state.view === 'vote') renderVote();
    else renderRules();
  }

  function renderBoard() {
    const c = counts(); const p = currentPlayer();
    $('#app').innerHTML = `
      <section class="screen">
        <div class="turn-banner"><div><small>Ronde ${state.round} • giliran</small><strong>${esc(p?.name || '-')}</strong></div><button class="btn secondary" id="quickTurnBtn">Mulai Giliran</button></div>
        <div class="section stats-grid"><div class="stat"><small>SAFE</small><strong>${c.safe}/${state.setup.safeTarget}</strong></div><div class="stat"><small>HIDUP</small><strong>${c.alive}</strong></div><div class="stat"><small>DEAD</small><strong>${c.dead}/${state.setup.deadTarget}</strong></div></div>

        <div class="section">
          <div class="section-head"><div><span class="kicker">NEIGHBORHOOD</span><h2>Papan Lingkungan</h2><p>Ketuk rumah saat pile fisiknya dibuka.</p></div><button class="btn secondary" id="undoBtn">↶ Undo</button></div>
          <div class="houses">${state.houses.map(h => houseHTML(h)).join('')}</div>
        </div>

        <div class="section card flat">
          <div class="section-head"><div><span class="kicker">DECK</span><h3>Kartu tersisa</h3></div><strong>${52-state.usedCards.length}/52</strong></div>
          ${deckSummaryHTML()}
        </div>

        ${state.log.length ? `<div class="section"><div class="section-head"><div><span class="kicker">LOG</span><h3>Kejadian terbaru</h3></div></div><div class="timeline">${state.log.slice(0,5).map(l=>`<div class="log-item"><div class="log-icon">${l.icon}</div><div><p>${esc(l.text)}</p><small>${new Date(l.ts).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})}</small></div></div>`).join('')}</div></div>` : ''}
      </section>`;
    $('#quickTurnBtn').onclick = () => { state.view='turn'; save(); render(); };
    $('#undoBtn').onclick = undo;
    $$('.house').forEach(btn => btn.onclick = () => openHouse(btn.dataset.id));
  }

  function houseHTML(h) {
    const effective = Math.max(0, h.grudge - h.protection);
    const statusLabel = h.status === 'safe' ? 'SAFE' : h.status === 'dead' ? 'DEAD' : 'ALIVE';
    const icon = h.status === 'safe' ? '🏡' : h.status === 'dead' ? '🏚️' : '🏠';
    return `<button class="house ${h.status}" data-id="${h.id}"><span class="house-status">${statusLabel}</span><div class="house-icon">${icon}</div><h3>${esc(h.name)}</h3><div class="meters">
      ${meter('🎁', h.gift, 3, 'gift')}
      ${meter('🔪', effective, 3, 'grudge')}
      ${h.protection ? `<div class="meter"><span>🛡️</span><div class="dots">${Array.from({length:Math.min(3,h.protection)},()=>'<span class="dot on protection"></span>').join('')}</div><small>${h.protection}</small></div>` : ''}
    </div></button>`;
  }
  function meter(icon, n, max, cls) {
    return `<div class="meter"><span>${icon}</span><div class="dots">${Array.from({length:max},(_,i)=>`<span class="dot ${i<n?'on '+cls:''}"></span>`).join('')}</div><small>${n}/${max}</small></div>`;
  }

  function openHouse(id) {
    const h = state.houses.find(x=>x.id===id); if (!h) return;
    if (h.status !== 'alive') {
      modal(`<h2>${esc(h.name)}</h2><div class="result-box"><div class="result-icon">${h.status==='safe'?'🏡':'🏚️'}</div><h2>${h.status.toUpperCase()}</h2><p>Rumah ini sudah selesai dan tidak menerima pile baru.</p></div>`, [{label:'Tutup'}]);
      return;
    }
    modal(`<span class="kicker">REVEAL PILE</span><h2>${esc(h.name)}</h2><p class="muted">Buka kartu fisik di rumah ini, lalu masukkan satu per satu. Kartu baru dianggap terpakai setelah Anda menekan <strong>Terapkan</strong>.</p>
      <div id="pileDraft" class="stack"></div>
      <button class="btn secondary full" id="addPileCardBtn">+ Tambah kartu dari pile</button>
      <div class="note">Efek: Gift +1 • Grudge +1 • Protection menyerap 1 poin Grudge • Death +2 Grudge. K seharusnya dipakai segera sebagai Investigation, bukan ditaruh di pile.</div>`, [
        {label:'Batal'}, {label:'Terapkan Pile', cls:'primary', id:'applyPileBtn'}
      ]);
    let draft=[];
    const drawDraft = () => {
      $('#pileDraft').innerHTML = draft.length ? draft.map((c,i)=>{ const t=cardType(c.rank,c.suit), info=CARD_TYPES[t]; return `<div class="log-item"><div class="log-icon">${c.rank}${c.suit}</div><div><p><strong>${info.icon} ${info.label}</strong></p><small>${c.rank}${c.suit}</small></div><button class="icon-btn remove-draft" data-i="${i}">×</button></div>`; }).join('') : '<p class="muted center">Belum ada kartu.</p>';
      $$('.remove-draft').forEach(b=>b.onclick=()=>{draft.splice(Number(b.dataset.i),1);drawDraft();});
    };
    drawDraft();
    $('#addPileCardBtn').onclick = () => openCardPicker(card => { if (state.usedCards.includes(cardCode(card.rank,card.suit)) || draft.some(c=>cardCode(c.rank,c.suit)===cardCode(card.rank,card.suit))) return toast('Kartu itu sudah dipakai.'); draft.push(card); drawDraft(); });
    $('#applyPileBtn').onclick = () => {
      if (!draft.length) return toast('Tambahkan minimal satu kartu.');
      if (draft.some(c=>cardType(c.rank,c.suit)==='investigation')) return toast('King/Investigation dipakai lewat menu Giliran, bukan pile rumah.');
      snapshot();
      let gifts=0, grudges=0, protection=0;
      draft.forEach(c=>{
        const t=cardType(c.rank,c.suit); const code=cardCode(c.rank,c.suit); state.usedCards.push(code); h.resolvedCards.push(code);
        if (t==='gift') gifts++;
        if (t==='grudge') grudges++;
        if (t==='protection') protection++;
        if (t==='death') grudges += 2;
      });
      h.gift += gifts; h.grudge += grudges; h.protection += protection;
      updateHouseStatuses(); addLog('🃏',`${h.name}: reveal ${draft.length} kartu → +${gifts} Gift, +${grudges} Grudge, +${protection} Protection.`);
      save(); closeModal(); render();
    };
  }

  function renderTurn() {
    const p = currentPlayer();
    $('#app').innerHTML = `<section class="screen"><div class="card privacy"><div class="big">🂠</div><span class="kicker">RONDE ${state.round}</span><h2>Giliran ${esc(p.name)}</h2><p>Ambil kartu dari deck fisik. Saat HP sudah di tangan ${esc(p.name)}, buka layar privat untuk melihat role reminder, decoder, dan aksi Investigation.</p><button class="btn primary" id="privateTurnBtn">Buka Layar Privat</button></div><div class="section note">Kartu Gift, Grudge, Protection, dan Death diletakkan <strong>face-down</strong> di rumah pilihan. King/Investigation dipakai segera lewat HP.</div></section>`;
    $('#privateTurnBtn').onclick = () => openPrivateTurn();
  }

  function openPrivateTurn() {
    const p = currentPlayer(); const info = roleInfo(p.role);
    modal(`<div class="center"><span class="kicker">KHUSUS ${esc(p.name)}</span><h2>${info.icon} ${info.title}</h2><p class="muted">${info.text}</p></div><div class="sep"></div><div class="section-head"><div><h3>Decoder kartu</h3><p>Pilih kartu yang baru Anda ambil.</p></div></div><div id="privateDecoder"></div>${p.role==='snoop' && !p.snoopUsed ? '<div class="sep"></div><button class="btn secondary full" id="snoopBtn">🕵️ Pakai Investigasi Gratis Snoop</button>' : ''}`,
      [{label:'Selesai & Oper HP', cls:'primary', id:'finishTurnBtn'}], 'center');
    renderDecoderInto('#privateDecoder', true);
    if ($('#snoopBtn')) $('#snoopBtn').onclick = () => investigatePlayer(p, true);
    $('#finishTurnBtn').onclick = () => { closeModal(); nextTurn(); };
  }

  function nextTurn() {
    state.turnIndex++;
    if (state.turnIndex >= state.players.length) { state.turnIndex=0; state.round++; addLog('🔁',`Ronde ${state.round} dimulai.`); }
    state.view='board'; save(); render();
  }

  function renderDecoderInto(selector, privateMode=false) {
    const root = $(selector); if (!root) return;
    const draw = () => {
      const type=cardType(selectedRank,selectedSuit), info=CARD_TYPES[type], used=state.usedCards.includes(cardCode(selectedRank,selectedSuit));
      root.innerHTML = `<div class="rank-grid">${ranks.map(r=>`<button class="pick ${r===selectedRank?'active':''}" data-rank="${r}">${r}</button>`).join('')}</div><div class="suit-grid section">${suits.map(s=>`<button class="pick ${cardColor(s)} ${s===selectedSuit?'active':''}" data-suit="${s}">${s}</button>`).join('')}</div>
        <div class="decoder-card ${cardColor(selectedSuit)}"><div class="card-corner">${selectedRank}<br>${selectedSuit}</div><div class="card-center">${selectedSuit}<small>${info.icon} ${info.label}</small></div><div class="card-corner bottom">${selectedRank}<br>${selectedSuit}</div></div>
        <div class="result-box"><div class="result-icon">${info.icon}</div><h2>${info.label}</h2><p>${info.desc}</p>${used?'<p style="color:#D33B48;margin-top:8px"><strong>Kartu ini sudah terpakai.</strong></p>':''}</div>
        ${privateMode && type==='investigation' ? `<div class="section"><button class="btn warning full" id="useKingBtn" ${used?'disabled':''}>🔎 Gunakan ${selectedRank}${selectedSuit} untuk Investigasi</button></div>` : ''}`;
      $$('.pick[data-rank]', root).forEach(b=>b.onclick=()=>{selectedRank=b.dataset.rank;draw();});
      $$('.pick[data-suit]', root).forEach(b=>b.onclick=()=>{selectedSuit=b.dataset.suit;draw();});
      if ($('#useKingBtn', root)) $('#useKingBtn', root).onclick = () => investigatePlayer(currentPlayer(), false, {rank:selectedRank,suit:selectedSuit});
    };
    draw();
  }

  function investigatePlayer(actor, isSnoopFree, card=null) {
    const candidates = state.players.filter(p=>p.id!==actor.id);
    modal(`<span class="kicker">INVESTIGATION</span><h2>Pilih pemain</h2><p class="muted">Hasil hanya boleh dilihat oleh ${esc(actor.name)}.</p><div class="choice-list">${candidates.map(p=>`<button class="choice-btn investigate-target" data-id="${p.id}">${esc(p.name)}</button>`).join('')}</div>`, [{label:'Batal'}], 'center');
    $$('.investigate-target').forEach(b=>b.onclick=()=>{
      const target=state.players.find(p=>p.id===b.dataset.id); if (!target) return;
      snapshot();
      if (isSnoopFree) actor.snoopUsed=true;
      if (card) state.usedCards.push(cardCode(card.rank,card.suit));
      addLog('🔎',`${actor.name} menggunakan Investigation.`);
      save();
      const killer=target.role==='killer';
      modal(`<div class="privacy"><div class="big">${killer?'🔪':'✅'}</div><span class="kicker">HASIL RAHASIA</span><h2>${esc(target.name)}</h2><p>${killer ? '<strong>ADALAH KILLER.</strong>' : '<strong>BUKAN KILLER.</strong>'}</p><p class="muted">Ingat hasilnya, lalu sembunyikan layar sebelum mengoper HP.</p></div>`, [{label:'Sembunyikan Hasil', cls:'primary'}], 'center');
    });
  }

  function renderDeck() {
    $('#app').innerHTML = `<section class="screen"><div class="section-head"><div><span class="kicker">52-CARD SYSTEM</span><h2>Deck Remi</h2><p>Mapping tetap — tidak diacak tiap game.</p></div><strong>${52-state.usedCards.length} tersisa</strong></div><div class="card">${deckSummaryHTML()}<div class="sep"></div><div id="deckDecoder"></div></div><div class="section"><div class="section-head"><div><h3>Tabel lengkap</h3><p>Q, K, dan A mengalahkan warna.</p></div></div><div class="deck-table-wrap">${deckTableHTML()}</div></div></section>`;
    renderDecoderInto('#deckDecoder', false);
  }

  function deckSummaryHTML() {
    const typeCounts = {gift:0,grudge:0,protection:0,investigation:0,death:0};
    ranks.forEach(r=>suits.forEach(s=>{ const code=cardCode(r,s); if (!state.usedCards.includes(code)) typeCounts[cardType(r,s)]++; }));
    return `<div class="deck-summary">${Object.entries(typeCounts).map(([k,n])=>`<div class="deck-stat"><span>${CARD_TYPES[k].icon}</span><strong>${n}</strong><small>${CARD_TYPES[k].label}</small></div>`).join('')}</div>`;
  }
  function deckTableHTML() {
    return `<table><thead><tr><th>Rank</th><th class="red-suit">♥ Hati</th><th class="red-suit">♦ Wajik</th><th>♣ Keriting</th><th>♠ Sekop</th></tr></thead><tbody>${ranks.map(r=>`<tr><td>${r}</td>${suits.map(s=>{const t=cardType(r,s),i=CARD_TYPES[t];return `<td class="${cardColor(s)==='red'?'red-suit':'black-suit'}">${i.icon} ${i.label}</td>`;}).join('')}</tr>`).join('')}</tbody></table>`;
  }

  function renderVote() {
    $('#app').innerHTML = `<section class="screen"><div class="section-head"><div><span class="kicker">ACCUSATION</span><h2>Vote Killer</h2><p>Diskusikan di meja, lalu pilih tersangka setelah kelompok sepakat.</p></div></div><div class="card stack"><div class="choice-list">${state.players.map(p=>`<button class="choice-btn vote-person" data-id="${p.id}">${esc(p.name)}${state.wrongVotes.includes(p.id)?' • sudah terbukti bukan Killer':''}</button>`).join('')}</div><div class="note danger-note">Vote membuka role target. Vote salah tidak langsung mengakhiri game, tetapi identitas pemain tersebut menjadi informasi publik.</div></div></section>`;
    $$('.vote-person').forEach(b=>b.onclick=()=>confirmVote(b.dataset.id));
  }

  function confirmVote(id) {
    const p=state.players.find(x=>x.id===id); if(!p)return;
    modal(`<div class="center"><div style="font-size:3rem">🗳️</div><h2>Tuduh ${esc(p.name)}?</h2><p class="muted">Setelah dibuka, hasil ini tidak dapat dirahasiakan lagi.</p></div>`, [{label:'Batal'},{label:'Buka Role',cls:'danger',id:'confirmVoteBtn'}], 'center');
    $('#confirmVoteBtn').onclick=()=>{
      snapshot();
      if(p.role==='killer') { state.winner='neighbors'; addLog('🎯',`${p.name} terungkap sebagai Killer.`); }
      else { if(!state.wrongVotes.includes(p.id))state.wrongVotes.push(p.id); addLog('❌',`${p.name} dituduh, tetapi bukan Killer.`); }
      save(); closeModal(); render();
      if(!state.winner) toast(`${p.name} bukan Killer.`);
    };
  }

  function renderRules() {
    $('#app').innerHTML = `<section class="screen"><div class="section-head"><div><span class="kicker">CARA MAIN</span><h2>Remi Companion Rules</h2><p>Versi companion ini mempertahankan bluffing fisik dan memindahkan bookkeeping ke HP.</p></div></div>
      <div class="card rules">
        ${rule('1','Setup & role','Masukkan 3–8 pemain. Web mengacak 1 Killer, 1 Snoop, sisanya Neighbor. Role dibuka pass-and-play.')}
        ${rule('2','Ambil kartu fisik','Pada giliran Anda, ambil 1 kartu remi. Buka Decoder secara privat untuk mengetahui fungsinya.')}
        ${rule('3','Mainkan face-down','Gift, Grudge, Protection, dan Death diletakkan tertutup pada satu rumah. King/Investigation dipakai segera lewat HP dan masuk discard.')}
        ${rule('4','Reveal pile','Saat pile rumah dibuka, masukkan kartu-kartunya ke web. Gift +1, Grudge +1, Q memberi 1 Protection, A memberi +2 Grudge.')}
        ${rule('5','Protection','Total Grudge efektif = Grudge − Protection. Protection tidak mengurangi Gift dan tidak bisa membuat Grudge negatif.')}
        ${rule('6','Status rumah','3 Gift membuat rumah SAFE. 3 Grudge efektif membuat rumah DEAD. Status permanen setelah tercapai.')}
        ${rule('7','Investigation','Semua K adalah Investigation. Pemain yang menarik K dapat memeriksa satu pemain secara privat: Killer atau bukan Killer.')}
        ${rule('8','Snoop','Snoop berpihak pada warga dan punya satu Investigation gratis tanpa membutuhkan King.')}
        ${rule('9','Vote','Kelompok boleh menuduh seorang pemain. Jika Killer terungkap, warga langsung menang. Vote salah membuka bahwa target bukan Killer.')}
        ${rule('10','Menang','Warga menang bila Killer ditemukan atau target SAFE tercapai. Killer menang bila target DEAD tercapai atau semua 52 kartu habis tanpa Killer ditemukan.')}
      </div>
      <div class="section card flat"><h3>Mapping deck</h3><p class="muted">Merah 2–J = Gift • Hitam 2–J = Grudge • semua Q = Protection • semua K = Investigation • semua A = Death.</p></div>
      <div class="section btn-row"><button class="btn secondary" id="undoRulesBtn">↶ Undo</button><button class="btn danger" id="resetBtn">Reset Permainan</button></div>
    </section>`;
    $('#undoRulesBtn').onclick=undo;
    $('#resetBtn').onclick=()=>confirmReset();
  }
  function rule(icon,title,text){return `<div class="rule"><div class="rule-icon">${icon}</div><div><h3>${title}</h3><p>${text}</p></div></div>`;}

  function renderWinner() {
    const neighbors = state.winner === 'neighbors';
    $('#bottomNav').classList.add('hidden');
    $('#app').innerHTML = `<section class="screen"><div class="hero center" style="background:${neighbors?'linear-gradient(135deg,#0d4c42,#32B18E)':'linear-gradient(135deg,#310913,#b51f38)'}"><div style="font-size:5rem">${neighbors?'🏡':'🔪'}</div><span class="kicker" style="color:#fff">GAME OVER</span><h1 style="max-width:none">${neighbors?'WARGA MENANG':'KILLER MENANG'}</h1><p style="margin:0 auto">${neighbors?'Lingkungan berhasil diselamatkan.':'Terlalu banyak rumah jatuh sebelum Killer dihentikan.'}</p></div><div class="section card"><h3>Role akhir</h3><div class="choice-list">${state.players.map(p=>{const r=roleInfo(p.role);return `<div class="choice-btn">${r.icon} ${esc(p.name)} — ${r.title}</div>`;}).join('')}</div><div class="sep"></div><div class="btn-row"><button class="btn secondary" id="backBoardBtn">Lihat Papan Akhir</button><button class="btn primary" id="newAfterWinBtn">Main Lagi</button></div></div></section>`;
    $('#backBoardBtn').onclick=()=>{const w=state.winner;state.winner=null;state.view='board';renderBoard();state.winner=w;};
    $('#newAfterWinBtn').onclick=()=>{state=freshState();state.phase='setup';setupNames=[];save();render();};
  }

  function openCardPicker(onPick) {
    let rank='7', suit='♥';
    modal(`<span class="kicker">TAMBAH KARTU</span><h2>Pilih kartu yang dibuka</h2><div id="picker"></div>`, [{label:'Batal'},{label:'Tambah',cls:'primary',id:'pickerAddBtn'}], 'center');
    const draw=()=>{
      const info=CARD_TYPES[cardType(rank,suit)], used=state.usedCards.includes(cardCode(rank,suit));
      $('#picker').innerHTML=`<div class="rank-grid">${ranks.map(r=>`<button class="pick ${r===rank?'active':''}" data-rank="${r}">${r}</button>`).join('')}</div><div class="suit-grid section">${suits.map(s=>`<button class="pick ${cardColor(s)} ${s===suit?'active':''}" data-suit="${s}">${s}</button>`).join('')}</div><div class="result-box section"><div class="result-icon">${info.icon}</div><h2>${rank}${suit} • ${info.label}</h2><p>${used?'Kartu ini sudah terpakai.':'Siap ditambahkan.'}</p></div>`;
      $$('.pick[data-rank]', $('#picker')).forEach(b=>b.onclick=()=>{rank=b.dataset.rank;draw();});
      $$('.pick[data-suit]', $('#picker')).forEach(b=>b.onclick=()=>{suit=b.dataset.suit;draw();});
    }; draw();
    $('#pickerAddBtn').onclick=()=>{ if(state.usedCards.includes(cardCode(rank,suit))) return toast('Kartu itu sudah dipakai.'); closeModal(); onPick({rank,suit}); };
  }

  function modal(content, actions=[{label:'Tutup'}], extra='') {
    $('#modalRoot').innerHTML = `<div class="modal-backdrop"><div class="modal ${extra}">${content}<div class="modal-actions">${actions.map((a,i)=>`<button class="btn ${a.cls||'secondary'}" id="${a.id||`modalAction${i}`}">${a.label}</button>`).join('')}</div></div></div>`;
    actions.forEach((a,i)=>{ const el=$(`#${a.id||`modalAction${i}`}`); if(el && !a.id) el.onclick=closeModal; });
    $('.modal-backdrop').addEventListener('click', e=>{ if(e.target.classList.contains('modal-backdrop')) closeModal(); });
  }
  function closeModal(){ $('#modalRoot').innerHTML=''; }
  function confirmReset(){
    modal(`<div class="center"><div style="font-size:3rem">⚠️</div><h2>Reset permainan?</h2><p class="muted">Semua role, papan, deck terpakai, dan log permainan akan dihapus.</p></div>`,[{label:'Batal'},{label:'Reset',cls:'danger',id:'doResetBtn'}],'center');
    $('#doResetBtn').onclick=()=>{state=freshState();setupNames=[];save();closeModal();render();};
  }

  function updateNav() {
    $$('.nav-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.view === state.view));
  }
  function cryptoId(){ return (crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`); }

  $('#themeBtn').onclick = () => {
    const next = (document.documentElement.dataset.theme === 'dark') ? 'light' : 'dark';
    localStorage.setItem(THEME, next); render();
  };
  $('#homeBtn').onclick = () => {
    if (state.phase === 'game') {
      modal(`<h2>Kembali ke beranda?</h2><p class="muted">Permainan tersimpan otomatis. Anda bisa melanjutkannya nanti.</p>`, [{label:'Batal'},{label:'Ke Beranda',cls:'primary',id:'goHomeBtn'}]);
      $('#goHomeBtn').onclick=()=>{state.phase='welcome';save();closeModal();render();};
    } else { state.phase='welcome'; save(); render(); }
  };
  $('#bottomNav').addEventListener('click', e => {
    const btn=e.target.closest('.nav-btn'); if(!btn)return; state.view=btn.dataset.view; save(); render();
  });

  render();
})();
