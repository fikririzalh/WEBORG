'use strict';

const STORAGE = {
  theme: 'cuttle-cat-theme-v2',
  learned: 'cuttle-cat-learned-v2',
  matches: 'cuttle-cat-matches-v2',
  kings: 'cuttle-cat-kings-v2'
};

const cards = [
  {
    rank: 'A', name: 'Ace — Tidal Reset', type: 'oneoff', typeLabel: 'One-Off + Point',
    summary: 'Sebagai One-Off, scrap semua kartu poin di kedua field.',
    effect: 'Semua Point Card milik Anda dan lawan masuk ke scrap pile. Jack yang menempel pada kartu poin tersebut ikut terscrap.',
    modes: 'Point 1 · Scuttle · One-Off', target: 'Tidak menarget satu kartu; efeknya mengenai seluruh Point Card.',
    counter: 'Dapat di-counter oleh 2. Queen tidak melindungi dari Ace karena ini board wipe.',
    pitfall: 'Jangan melihat Ace sebagai “pembersih lawan” saja—poin Anda sendiri juga hilang.',
    cat: 'wizard', colors: ['#3d8cf4', '#71c7ff']
  },
  {
    rank: '2', name: 'Two — Counter Guard', type: 'oneoff', typeLabel: 'Reactive One-Off',
    summary: 'Counter One-Off saat giliran siapa pun, atau scrap satu Royal/Glasses pada giliran Anda.',
    effect: 'Mode reaktif membatalkan One-Off target. Mode aktif menghilangkan satu 8/J/Q/K yang sah dari field.',
    modes: 'Point 2 · Scuttle · One-Off', target: 'One-Off yang baru dimainkan, atau satu Royal/Glasses di field.',
    counter: '2 dapat di-counter oleh 2 lain. Tidak dapat meng-counter Point, Scuttle, atau Royal saat dimainkan.',
    pitfall: 'Kesalahan paling umum adalah menganggap 2 sebagai universal counter. Itu salah.',
    cat: 'shield', colors: ['#16a8bd', '#59d5c4']
  },
  {
    rank: '3', name: 'Three — Scrap Archivist', type: 'oneoff', typeLabel: 'One-Off + Point',
    summary: 'Ambil satu kartu non-3 pilihan Anda dari scrap pile ke tangan.',
    effect: 'Cari di scrap pile, tunjukkan kartu pilihan kepada lawan, lalu masukkan ke tangan.',
    modes: 'Point 3 · Scuttle · One-Off', target: 'Satu kartu non-3 yang sudah berada di scrap pile.',
    counter: 'Dapat di-counter oleh 2.',
    pitfall: 'Anda tidak boleh mengambil 3, termasuk mencoba membentuk loop pengambilan 3.',
    cat: 'archivist', colors: ['#7467e8', '#b09cff']
  },
  {
    rank: '4', name: 'Four — Hand Raider', type: 'oneoff', typeLabel: 'One-Off + Point',
    summary: 'Lawan membuang dua kartu pilihannya sendiri dari tangan.',
    effect: 'Lawan memperlihatkan lalu membuang dua kartu yang ia pilih. Jika hanya memiliki satu kartu, kartu itu tetap dibuang.',
    modes: 'Point 4 · Scuttle · One-Off', target: 'Tangan lawan, bukan kartu tertentu yang Anda pilih.',
    counter: 'Dapat di-counter oleh 2.',
    pitfall: 'Anda tidak menentukan dua kartu yang dibuang dalam ruleset resmi modern.',
    cat: 'bandit', colors: ['#e95e79', '#ff9d78']
  },
  {
    rank: '5', name: 'Five — Supply Runner', type: 'oneoff', typeLabel: 'One-Off + Point',
    summary: 'Buang satu kartu lalu draw hingga tiga kartu, tanpa melewati batas tangan 8.',
    effect: 'Setelah 5 dimainkan, buang satu kartu lain dari tangan lalu ambil sampai tiga kartu. Jika tangan kosong, lewati discard.',
    modes: 'Point 5 · Scuttle · One-Off', target: 'Tangan dan draw pile.',
    counter: 'Dapat di-counter oleh 2 sebelum Anda memperoleh kartu.',
    pitfall: 'Bila di-counter saat 5 adalah kartu terakhir Anda, Anda dapat berakhir tanpa kartu.',
    cat: 'merchant', colors: ['#f0a316', '#ffd764']
  },
  {
    rank: '6', name: 'Six — Royal Storm', type: 'oneoff', typeLabel: 'One-Off + Point',
    summary: 'Scrap semua Royal dan Glasses Eight di kedua field.',
    effect: 'Semua 8 yang dipasang sebagai Glasses, seluruh Jack, Queen, dan King terscrap. Point Card tetap aman.',
    modes: 'Point 6 · Scuttle · One-Off', target: 'Tidak menarget satu kartu; mengenai seluruh permanent.',
    counter: 'Dapat di-counter oleh 2. Queen tidak melindungi dari Six.',
    pitfall: 'Royal milik Anda sendiri juga ikut hilang.',
    cat: 'storm', colors: ['#3977dc', '#5fe0ee']
  },
  {
    rank: '7', name: 'Seven — Oracle Draw', type: 'oneoff', typeLabel: 'One-Off + Point',
    summary: 'Buka dua kartu teratas, pilih satu untuk langsung dimainkan, dan kembalikan yang lain ke atas deck.',
    effect: 'Kedua kartu diperlihatkan. Pilih satu yang dapat dimainkan dan jalankan dalam mode sah; kartu lain kembali ke puncak deck.',
    modes: 'Point 7 · Scuttle · One-Off', target: 'Dua kartu teratas draw pile.',
    counter: 'Dapat di-counter oleh 2 sebelum kartu teratas dibuka.',
    pitfall: 'Bila kedua kartu tidak dapat dimainkan, scrap satu dan kembalikan satu ke atas deck.',
    cat: 'seer', colors: ['#8567e8', '#5ab8fa']
  },
  {
    rank: '8', name: 'Eight — Glasses Scout', type: 'royal', typeLabel: 'Glasses + Point',
    summary: 'Pasang menyamping agar lawan membuka tangannya selama 8 tetap berada di field.',
    effect: 'Sebagai Glasses, 8 diperlakukan seperti Royal dan memberi informasi tangan lawan secara terus-menerus.',
    modes: 'Point 8 · Scuttle · Permanent', target: 'Lawan yang harus membuka tangan.',
    counter: 'Dapat dihancurkan oleh 2 atau Six; tidak dapat di-counter saat dimainkan.',
    pitfall: '8 yang dimainkan tegak sebagai Point Card tidak menghasilkan efek Glasses.',
    cat: 'glasses', colors: ['#20a9d7', '#65d7c7']
  },
  {
    rank: '9', name: 'Nine — Tempo Portal', type: 'oneoff', typeLabel: 'One-Off + Point',
    summary: 'Kembalikan satu kartu dari field lawan ke tangannya; kartu itu tidak boleh dimainkan pada giliran berikutnya.',
    effect: 'Pilih kartu yang sah di field lawan. Kartu kembali ke tangan controller dan mendapat larangan bermain selama giliran berikutnya.',
    modes: 'Point 9 · Scuttle · One-Off', target: 'Satu kartu di field lawan yang tidak dilindungi Queen.',
    counter: 'Dapat di-counter oleh 2.',
    pitfall: 'Larangan hanya berlaku untuk giliran berikutnya, bukan selamanya.',
    cat: 'portal', colors: ['#8e65e6', '#e080da']
  },
  {
    rank: '10', name: 'Ten — Pure Power', type: 'point', typeLabel: 'Point / Scuttle',
    summary: 'Tidak memiliki efek spesial; 10 adalah Point Card terbesar dan Scuttle attacker terkuat.',
    effect: 'Mainkan sebagai 10 poin atau gunakan untuk men-Scuttle kartu poin rank lebih rendah, serta 10 dengan suit lebih lemah.',
    modes: 'Point 10 · Scuttle', target: 'Satu Point Card lawan saat digunakan untuk Scuttle.',
    counter: 'Tidak dapat di-counter oleh 2 karena bukan One-Off.',
    pitfall: 'Nilai besar membuatnya menarik sebagai poin, tetapi juga sangat kuat sebagai alat Scuttle.',
    cat: 'calm', colors: ['#37a8a7', '#9adfba']
  },
  {
    rank: 'J', name: 'Jack — Point Thief', type: 'royal', typeLabel: 'Royal',
    summary: 'Pasang di atas Point Card lawan untuk mencurinya; Jack dapat ditumpuk untuk mencuri balik.',
    effect: 'Jack melekat pada Point Card. Kontrol kartu poin berpindah selama Jack teratas mendukung kontrol tersebut.',
    modes: 'Permanent', target: 'Satu Point Card lawan yang tidak dilindungi Queen.',
    counter: 'Tidak dapat di-counter saat dimainkan; dapat dihancurkan oleh 2 atau Six.',
    pitfall: 'Jika Point Card terscrap, seluruh Jack yang menempel ikut terscrap.',
    cat: 'thief', colors: ['#ef6b75', '#8c73ed']
  },
  {
    rank: 'Q', name: 'Queen — Field Guardian', type: 'royal', typeLabel: 'Royal',
    summary: 'Melindungi kartu lain milik Anda dari 2, 9, dan Jack; tidak melindungi dari Ace, Six, atau Scuttle.',
    effect: 'Selama berada di field, kartu Anda yang lain tidak dapat menjadi target efek tunggal lawan.',
    modes: 'Permanent', target: 'Semua kartu Anda selain Queen itu sendiri.',
    counter: 'Dapat dihancurkan oleh 2 atau Six. Dua Queen atau lebih saling melindungi.',
    pitfall: 'Queen bukan perlindungan universal dan tidak menghentikan board wipe maupun Scuttle.',
    cat: 'queen', colors: ['#cf62a9', '#f3a8d6']
  },
  {
    rank: 'K', name: 'King — Victory Crown', type: 'royal', typeLabel: 'Royal',
    summary: 'Menurunkan target kemenangan: 21 → 14 → 10 → 5 → langsung menang.',
    effect: 'Target berdasarkan jumlah King: 0=21, 1=14, 2=10, 3=5, 4=0. Memenuhi target baru menghasilkan kemenangan segera.',
    modes: 'Permanent', target: 'Target kemenangan Anda sendiri.',
    counter: 'Tidak dapat di-counter saat dimainkan; dapat dihancurkan oleh 2 atau Six.',
    pitfall: 'King tidak memberi poin. Ia hanya menurunkan jumlah poin yang dibutuhkan.',
    cat: 'king', colors: ['#e5a51e', '#ffcf5b']
  }
];

const els = {
  cardGrid: document.querySelector('#cardGrid'),
  emptyState: document.querySelector('#emptyState'),
  search: document.querySelector('#cardSearch'),
  filters: document.querySelectorAll('[data-filter]'),
  pages: document.querySelectorAll('[data-page]'),
  navs: document.querySelectorAll('[data-nav]'),
  themeToggle: document.querySelector('#themeToggle'),
  themeLabel: document.querySelector('#themeLabel'),
  focusButton: document.querySelector('#focusButton'),
  dialog: document.querySelector('#cardDialog'),
  dialogContent: document.querySelector('#dialogContent'),
  dialogClose: document.querySelector('#dialogClose'),
  toast: document.querySelector('#toast')
};

let activeFilter = 'all';
let learned = new Set(JSON.parse(localStorage.getItem(STORAGE.learned) || '[]'));
let matches = JSON.parse(localStorage.getItem(STORAGE.matches) || '[]');
let toastTimer;

function catSVG(style, primary, secondary) {
  const accessories = {
    wizard: '<path d="M61 46 88 11l28 36" fill="none" stroke="#ffd45b" stroke-width="8" stroke-linejoin="round"/><path d="m78 26 10-8 8 10 10-6" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>',
    shield: '<path d="M105 89v42c0 18 13 29 31 36 18-7 31-18 31-36V89l-31-12-31 12Z" fill="#fff" opacity=".8"/><path d="M136 93v56" stroke="'+primary+'" stroke-width="5"/>',
    archivist: '<rect x="101" y="103" width="64" height="48" rx="8" fill="#fff" opacity=".88"/><path d="M133 104v47M112 118h13m16 0h13" stroke="'+primary+'" stroke-width="4" stroke-linecap="round"/>',
    bandit: '<path d="M61 91c23-14 63-14 86 0l-8 27c-21-12-49-12-70 0L61 91Z" fill="#2c3158"/><path d="M77 101h18m18 0h18" stroke="#fff" stroke-width="6" stroke-linecap="round"/>',
    merchant: '<path d="M98 119h59l-5 39h-49l-5-39Z" fill="#fff" opacity=".85"/><path d="M111 119c0-16 33-16 33 0" fill="none" stroke="'+primary+'" stroke-width="5"/>',
    storm: '<path d="m130 82-19 35h22l-15 35 43-51h-24l14-19Z" fill="#ffe25c" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>',
    seer: '<circle cx="132" cy="126" r="31" fill="#fff" opacity=".78"/><circle cx="132" cy="126" r="18" fill="none" stroke="'+primary+'" stroke-width="5"/><circle cx="132" cy="126" r="5" fill="'+primary+'"/>',
    glasses: '<circle cx="85" cy="101" r="18" fill="none" stroke="#233052" stroke-width="7"/><circle cx="127" cy="101" r="18" fill="none" stroke="#233052" stroke-width="7"/><path d="M103 101h7m35-2 17-7M67 99l-17-7" stroke="#233052" stroke-width="7" stroke-linecap="round"/>',
    portal: '<circle cx="134" cy="125" r="38" fill="none" stroke="#fff" stroke-width="8" opacity=".85"/><path d="M134 91c20 12 23 35 7 51-12 12-33 9-42-5" fill="none" stroke="'+secondary+'" stroke-width="7" stroke-linecap="round"/>',
    calm: '<path d="M71 102c8-8 18-8 26 0m20 0c8-8 18-8 26 0" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/><path d="M151 60c16 0 25 9 25 20-12-2-22 0-29 8" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>',
    thief: '<path d="M55 52c28-35 76-35 105 0-33-9-71-9-105 0Z" fill="#263052"/><path d="M141 38c19-16 35-13 47-7-15 4-24 10-29 20" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>',
    queen: '<path d="M64 52 76 18l30 26 24-29 19 37" fill="#ffe06c" stroke="#fff" stroke-width="5" stroke-linejoin="round"/><circle cx="76" cy="18" r="6" fill="#ff7e9d"/><circle cx="130" cy="15" r="6" fill="#8d79f5"/>',
    king: '<path d="M59 52 70 15l31 28 25-33 25 42" fill="#ffd65d" stroke="#fff" stroke-width="5" stroke-linejoin="round"/><path d="M66 49h80" stroke="#fff" stroke-width="5"/><circle cx="70" cy="15" r="6" fill="#ff7a84"/><circle cx="126" cy="10" r="6" fill="#5dc8f5"/>'
  };
  return `
  <svg class="cat-art" viewBox="0 0 210 190" aria-hidden="true">
    <defs><linearGradient id="g-${style}" x1="0" x2="1"><stop stop-color="${primary}"/><stop offset="1" stop-color="${secondary}"/></linearGradient></defs>
    <path d="M53 70 42 30l35 24c17-9 40-9 56 0l35-24-10 40c16 15 23 37 18 58-7 31-35 50-71 50s-64-19-71-50c-5-21 2-43 19-58Z" fill="url(#g-${style})"/>
    <path d="M48 33 73 55M164 33l-27 22" stroke="#fff" stroke-width="5" opacity=".45" stroke-linecap="round"/>
    ${accessories[style] || ''}
    <circle cx="82" cy="94" r="5" fill="#fff"/><circle cx="128" cy="94" r="5" fill="#fff"/>
    ${style === 'calm' ? '' : '<circle cx="82" cy="94" r="2" fill="#233052"/><circle cx="128" cy="94" r="2" fill="#233052"/>'}
    <path d="m99 111 7 5 7-5m-7 5v9" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
    <path d="M62 113 38 106m25 18-25 5m110-16 24-7m-25 18 25 5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>
  </svg>`;
}

function suitCats() {
  return `<div class="suit-cats" aria-hidden="true">
    <span class="suit-cat black">♣</span><span class="suit-cat red">♦</span>
    <span class="suit-cat red">♥</span><span class="suit-cat black">♠</span>
  </div>`;
}

function renderCards() {
  const query = els.search.value.trim().toLowerCase();
  const shown = cards.filter(card => {
    const filterMatch = activeFilter === 'all' || card.type === activeFilter || (activeFilter === 'point' && card.type === 'point');
    const haystack = `${card.rank} ${card.name} ${card.summary} ${card.effect} ${card.modes}`.toLowerCase();
    return filterMatch && haystack.includes(query);
  });

  els.cardGrid.innerHTML = shown.map(card => {
    const isLearned = learned.has(card.rank);
    return `<article class="power-card ${isLearned ? 'learned' : ''}" data-rank="${card.rank}" tabindex="0" style="--accent:${card.colors[0]};--accent2:${card.colors[1]}">
      <div class="card-visual">
        <div class="rank-stack"><span class="rank">${card.rank}</span>${suitCats()}</div>
        ${catSVG(card.cat, card.colors[0], card.colors[1])}
      </div>
      <div class="card-meta">
        <div class="card-meta-top"><h3 class="card-name">${card.name}</h3><span class="type-badge">${card.typeLabel}</span></div>
        <p class="card-summary">${card.summary}</p>
        <div class="card-actions">
          <button class="learn-button" type="button" data-learn="${card.rank}" aria-pressed="${isLearned}"><span class="check-ring">${isLearned ? '✓' : ''}</span><span>${isLearned ? 'Sudah dikuasai' : 'Tandai dikuasai'}</span></button>
          <button class="details-link" type="button" data-detail="${card.rank}">Detail →</button>
        </div>
      </div>
    </article>`;
  }).join('');

  els.emptyState.hidden = shown.length !== 0;
  bindCardEvents();
}

function bindCardEvents() {
  document.querySelectorAll('[data-learn]').forEach(button => {
    button.addEventListener('click', event => {
      event.stopPropagation();
      toggleLearned(button.dataset.learn);
    });
  });
  document.querySelectorAll('[data-detail]').forEach(button => {
    button.addEventListener('click', event => {
      event.stopPropagation();
      openCard(button.dataset.detail);
    });
  });
  document.querySelectorAll('.power-card').forEach(card => {
    card.addEventListener('click', () => openCard(card.dataset.rank));
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openCard(card.dataset.rank); }
    });
  });
}

function toggleLearned(rank) {
  if (learned.has(rank)) learned.delete(rank); else learned.add(rank);
  localStorage.setItem(STORAGE.learned, JSON.stringify([...learned]));
  renderCards();
  updateMastery();
  showToast(learned.has(rank) ? `${rank} ditandai sudah dikuasai.` : `${rank} dikembalikan ke daftar belajar.`);
}

function updateMastery() {
  const count = learned.size;
  const percent = Math.round((count / cards.length) * 100);
  document.querySelector('#metricLearned').textContent = `${count} / ${cards.length}`;
  document.querySelector('#masteryPercent').textContent = `${percent}%`;
  document.querySelector('#masteryBar').style.width = `${percent}%`;
  document.querySelector('#masteryHint').textContent = count === cards.length ? 'Seluruh rank sudah ditandai dikuasai.' : `${cards.length - count} rank masih perlu ditinjau.`;
}

function openCard(rank) {
  const card = cards.find(item => item.rank === rank);
  if (!card) return;
  els.dialogContent.innerHTML = `<div class="dialog-inner" style="--accent:${card.colors[0]};--accent2:${card.colors[1]}">
    <div class="dialog-hero">
      ${catSVG(card.cat, card.colors[0], card.colors[1])}
      <div><span class="dialog-rank">${card.rank}</span><h2>${card.name}</h2><p>${card.summary}</p></div>
    </div>
    <div class="dialog-grid">
      <section class="dialog-section dialog-wide"><h3>Efek lengkap</h3><p>${card.effect}</p></section>
      <section class="dialog-section"><h3>Mode yang tersedia</h3><p>${card.modes}</p></section>
      <section class="dialog-section"><h3>Target sah</h3><p>${card.target}</p></section>
      <section class="dialog-section"><h3>Counter dan proteksi</h3><p>${card.counter}</p></section>
      <section class="dialog-section"><h3>Kesalahan umum</h3><p>${card.pitfall}</p></section>
    </div>
  </div>`;
  els.dialog.showModal();
}

function navigate(page) {
  els.pages.forEach(section => section.classList.toggle('active', section.dataset.page === page));
  els.navs.forEach(button => {
    const active = button.dataset.nav === page;
    button.classList.toggle('active', active);
    if (active && button.classList.contains('nav-item')) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  history.replaceState(null, '', `#${page}`);
  document.querySelector('#mainContent').scrollTo({ top: 0 });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function applyTheme(theme) {
  const dark = theme === 'dark';
  document.body.classList.toggle('dark', dark);
  els.themeToggle.setAttribute('aria-pressed', String(dark));
  els.themeLabel.textContent = dark ? 'Light mode' : 'Dark mode';
  localStorage.setItem(STORAGE.theme, theme);
}

function showToast(message) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add('show');
  toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2300);
}

// Navigation and filters
els.navs.forEach(button => button.addEventListener('click', event => {
  event.preventDefault();
  navigate(button.dataset.nav);
}));
els.search.addEventListener('input', renderCards);
els.filters.forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  els.filters.forEach(item => item.classList.toggle('active', item === button));
  renderCards();
}));
document.querySelector('#reviewUnlearned').addEventListener('click', () => {
  activeFilter = 'all';
  els.filters.forEach(item => item.classList.toggle('active', item.dataset.filter === 'all'));
  els.search.value = '';
  renderCards();
  const first = [...document.querySelectorAll('.power-card')].find(card => !learned.has(card.dataset.rank));
  if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
  else showToast('Semua kartu sudah ditandai dikuasai.');
});
els.themeToggle.addEventListener('click', () => applyTheme(document.body.classList.contains('dark') ? 'light' : 'dark'));
els.focusButton.addEventListener('click', () => {
  document.body.classList.toggle('focus-mode');
  showToast(document.body.classList.contains('focus-mode') ? 'Mode fokus aktif.' : 'Mode fokus nonaktif.');
});
els.dialogClose.addEventListener('click', () => els.dialog.close());
els.dialog.addEventListener('click', event => { if (event.target === els.dialog) els.dialog.close(); });

// King calculator
const goalMap = [21, 14, 10, 5, 0];
let selectedKings = Number(localStorage.getItem(STORAGE.kings) || 0);
const kingButtons = document.querySelectorAll('[data-kings]');
const pointRange = document.querySelector('#pointRange');
function updateGoalCalculator() {
  const points = Number(pointRange.value);
  const goal = goalMap[selectedKings];
  const won = points >= goal;
  document.querySelector('#pointValue').textContent = points;
  document.querySelector('#metricGoal').textContent = goal === 0 ? 'Menang' : `${goal} poin`;
  const result = document.querySelector('#goalResult');
  result.classList.toggle('won', won);
  result.innerHTML = `<span>Target aktif</span><strong>${goal === 0 ? 'Langsung menang' : `${goal} poin`}</strong><small>${won ? 'Kondisi kemenangan terpenuhi.' : `Masih butuh ${goal - points} poin.`}</small>`;
  kingButtons.forEach(button => button.classList.toggle('active', Number(button.dataset.kings) === selectedKings));
}
kingButtons.forEach(button => button.addEventListener('click', () => {
  selectedKings = Number(button.dataset.kings);
  localStorage.setItem(STORAGE.kings, String(selectedKings));
  updateGoalCalculator();
}));
pointRange.addEventListener('input', updateGoalCalculator);

// Scuttle checker
const ranks = ['A','2','3','4','5','6','7','8','9','10'];
const suits = [
  { key:'clubs', label:'♣ Clubs', power:0 },
  { key:'diamonds', label:'♦ Diamonds', power:1 },
  { key:'hearts', label:'♥ Hearts', power:2 },
  { key:'spades', label:'♠ Spades', power:3 }
];
['attackerRank','targetRank'].forEach(id => {
  document.querySelector(`#${id}`).innerHTML = ranks.map(rank => `<option value="${rank}">${rank}</option>`).join('');
});
['attackerSuit','targetSuit'].forEach(id => {
  document.querySelector(`#${id}`).innerHTML = suits.map(suit => `<option value="${suit.power}">${suit.label}</option>`).join('');
});
document.querySelector('#attackerRank').value = '7';
document.querySelector('#attackerSuit').value = '1';
document.querySelector('#targetRank').value = '7';
document.querySelector('#targetSuit').value = '0';
function rankPower(rank) { return rank === 'A' ? 1 : Number(rank); }
function updateScuttleChecker() {
  const ar = rankPower(document.querySelector('#attackerRank').value);
  const as = Number(document.querySelector('#attackerSuit').value);
  const tr = rankPower(document.querySelector('#targetRank').value);
  const ts = Number(document.querySelector('#targetSuit').value);
  const valid = ar > tr || (ar === tr && as > ts);
  const result = document.querySelector('#scuttleResult');
  result.className = `scuttle-result ${valid ? 'valid' : 'invalid'}`;
  result.innerHTML = valid ? '<strong>Sah.</strong> Rank lebih tinggi, atau rank sama dengan suit lebih tinggi.' : '<strong>Tidak sah.</strong> Penyerang harus lebih kuat berdasarkan rank, lalu suit sebagai tie-breaker.';
}
['attackerRank','attackerSuit','targetRank','targetSuit'].forEach(id => document.querySelector(`#${id}`).addEventListener('change', updateScuttleChecker));

// Match tracker
const matchForm = document.querySelector('#matchForm');
function persistMatches() { localStorage.setItem(STORAGE.matches, JSON.stringify(matches)); }
function renderMatches() {
  const history = document.querySelector('#historyList');
  if (!matches.length) {
    history.innerHTML = '<div class="history-empty">Belum ada pertandingan. Catat game pertama Anda di formulir di atas.</div>';
  } else {
    history.innerHTML = matches.map(match => {
      const resultLabel = match.result === 'win' ? 'Menang' : match.result === 'loss' ? 'Kalah' : 'Stalemate';
      return `<div class="history-item">
        <span class="result-dot ${match.result}" aria-label="${resultLabel}"></span>
        <div class="history-main"><strong>${escapeHTML(match.opponent)}</strong><small>${escapeHTML(match.notes || 'Tanpa catatan')}</small></div>
        <span class="history-meta">${resultLabel} · ${match.kings}K · ${match.duration}m</span>
        <button class="delete-match" type="button" data-delete-match="${match.id}" aria-label="Hapus pertandingan">×</button>
      </div>`;
    }).join('');
  }
  const wins = matches.filter(match => match.result === 'win').length;
  const durations = matches.reduce((sum, match) => sum + Number(match.duration || 0), 0);
  const winRelevant = matches.filter(match => match.result !== 'stalemate').length;
  const winRate = winRelevant ? Math.round((wins / winRelevant) * 100) : 0;
  document.querySelector('#statGames').textContent = matches.length;
  document.querySelector('#statWins').textContent = wins;
  document.querySelector('#statDuration').textContent = matches.length ? `${Math.round(durations / matches.length)}m` : '0m';
  document.querySelector('#metricWinRate').textContent = `${winRate}%`;
  document.querySelectorAll('[data-delete-match]').forEach(button => button.addEventListener('click', () => {
    matches = matches.filter(match => match.id !== button.dataset.deleteMatch);
    persistMatches(); renderMatches(); showToast('Pertandingan dihapus.');
  }));
}
function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}
matchForm.addEventListener('submit', event => {
  event.preventDefault();
  const opponent = document.querySelector('#opponentName').value.trim();
  if (!opponent) return;
  matches.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    opponent,
    result: document.querySelector('#matchResult').value,
    kings: Number(document.querySelector('#matchKings').value),
    duration: Number(document.querySelector('#matchDuration').value),
    notes: document.querySelector('#matchNotes').value.trim(),
    createdAt: new Date().toISOString()
  });
  persistMatches(); renderMatches(); matchForm.reset(); document.querySelector('#matchDuration').value = 10; showToast('Pertandingan tersimpan.');
});
document.querySelector('#clearAllData').addEventListener('click', () => {
  const confirmed = window.confirm('Hapus seluruh progres belajar, riwayat pertandingan, dan preferensi lokal?');
  if (!confirmed) return;
  Object.values(STORAGE).forEach(key => localStorage.removeItem(key));
  learned = new Set(); matches = []; selectedKings = 0; pointRange.value = 0;
  applyTheme('light'); renderCards(); renderMatches(); updateMastery(); updateGoalCalculator(); showToast('Seluruh data lokal telah direset.');
});

// Initial state
const savedTheme = localStorage.getItem(STORAGE.theme) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(savedTheme);
renderCards();
updateMastery();
updateGoalCalculator();
updateScuttleChecker();
renderMatches();
const initialPage = ['special','rules','tools'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'special';
navigate(initialPage);
