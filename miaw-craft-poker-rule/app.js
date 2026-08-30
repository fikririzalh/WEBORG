'use strict';

const STORAGE = {
  theme: 'miaw-craft-poker-theme-v01',
  learned: 'miaw-craft-poker-learned-v01',
  playtests: 'miaw-craft-poker-playtests-v01'
};

const cards = [
  { rank:'A', name:'ZERO / Regular Shift', level:'zero', levelLabel:'0', summary:'Tidak memiliki active ability. Tempatkan kartu secara normal lalu lanjutkan turn.', effect:'A sengaja netral agar menjadi kartu positioning, blocking, Job, Pattern, suit, atau scoring tanpa menambah beban keputusan.', target:'Tidak membutuhkan target ability.', limits:'Tidak ada active ability.', notes:'A adalah kartu paling sederhana untuk onboarding pemain baru.', colors:['#3d8cf4','#71c7ff'], glyph:'0' },
  { rank:'2', name:'NUDGE', level:'basic', levelLabel:'Basic', summary:'Geser 1 kartu adjacent ke 1 hex kosong yang adjacent dengan posisi asalnya.', effect:'Pilih satu kartu yang adjacent dengan kartu 2, lalu pindahkan satu hex ke destination legal.', target:'Satu kartu adjacent dengan kartu 2.', limits:'Destination harus legal. Locked card tidak boleh dipindahkan.', notes:'Basic movement satu kartu.', colors:['#16a8bd','#59d5c4'], glyph:'↔' },
  { rank:'3', name:'SCOUT', level:'basic', levelLabel:'Basic', summary:'Lihat 3 kartu teratas Draw Deck, pilih 1 sebagai kartu berikutnya, dua sisanya ke bawah deck.', effect:'Ambil tiga kartu teratas secara tertutup, lihat ketiganya, pilih satu sebagai kartu berikutnya yang akan dimainkan, lalu taruh dua sisanya ke bawah deck dalam urutan bebas.', target:'Tiga kartu teratas Draw Deck.', limits:'Tidak menghasilkan extra placement.', notes:'Mengurangi randomness tanpa menambah jumlah placement.', colors:['#7467e8','#b09cff'], glyph:'◉' },
  { rank:'4', name:'LOCAL SWAP', level:'basic', levelLabel:'Basic', summary:'Tukar posisi 2 kartu yang sama-sama adjacent dengan kartu 4.', effect:'Pilih dua kartu di sekitar 4 dan tukar posisinya.', target:'Dua kartu yang keduanya adjacent dengan kartu 4.', limits:'Kartu 4 sendiri tidak boleh menjadi target. Jika stacking aktif, hanya top card yang berpindah.', notes:'Swap lokal untuk membongkar atau membentuk posisi.', colors:['#e95e79','#ff9d78'], glyph:'⇄' },
  { rank:'5', name:'PUSH', level:'tactical', levelLabel:'Tactical', summary:'Dorong satu garis maksimal 3 kartu sejauh 1 hex menjauh dari kartu 5.', effect:'Pilih garis lurus yang dimulai dari hex adjacent. Seluruh garis bergeser satu hex menjauh dari 5.', target:'Garis lurus dari hex adjacent, maksimum tiga kartu.', limits:'Hex terakhir harus memiliki ruang; seluruh perpindahan harus legal; Locked card tidak boleh terdorong; stack limit tidak boleh terlewati.', notes:'Manipulasi garis dan kepadatan board.', colors:['#f0a316','#ffd764'], glyph:'➜' },
  { rank:'6', name:'PULL', level:'tactical', levelLabel:'Tactical', summary:'Tarik 1 kartu dari jarak maksimum 2 hex ke hex kosong adjacent dengan kartu 6.', effect:'Pilih satu kartu dalam radius maksimum 2, lalu tarik ke destination kosong yang adjacent dengan 6.', target:'Satu kartu dalam jarak maksimum 2 hex.', limits:'Destination harus legal. Locked card tidak boleh dipindahkan.', notes:'Kebalikan PUSH, tetapi hanya pada satu kartu.', colors:['#3977dc','#5fe0ee'], glyph:'←' },
  { rank:'7', name:'STACK SHIFT', level:'tactical', levelLabel:'Tactical', summary:'Pindahkan top card adjacent ke atas kartu 7 atau ke atas kartu adjacent lain.', effect:'Ambil top card dari satu lokasi adjacent lalu pindahkan ke atas 7 atau ke atas kartu lain yang adjacent dengan 7.', target:'Top card dari satu lokasi adjacent.', limits:'Stack limit tetap berlaku. Fallback No Stack: pindahkan satu kartu adjacent ke hex kosong lain yang adjacent dengan 7.', notes:'Ability pertama yang memperkenalkan vertical play.', colors:['#8567e8','#5ab8fa'], glyph:'▤' },
  { rank:'8', name:'ROTATE', level:'advanced', levelLabel:'Advanced', summary:'Putar posisi 3 kartu pada tiga hex adjacent mengelilingi kartu 8.', effect:'Pilih tiga kartu di sekitar 8, lalu rotasikan satu langkah clockwise atau counter-clockwise.', target:'Tiga kartu pada tiga hex adjacent mengelilingi 8.', limits:'Semua posisi harus legal sebelum rotasi. Locked card tidak boleh dipindahkan melalui ROTATE.', notes:'Manipulasi beberapa kartu tetapi tetap lokal.', colors:['#20a9d7','#65d7c7'], glyph:'⟳' },
  { rank:'9', name:'COPYCAT', level:'advanced', levelLabel:'Advanced', summary:'Salin ability kartu adjacent dengan rank 2–8 dan jalankan seolah-olah 9 memiliki rank tersebut.', effect:'Pilih satu top card adjacent dengan rank 2–8, lalu jalankan ability yang disalin.', target:'Satu top card adjacent dengan rank 2, 3, 4, 5, 6, 7, atau 8.', limits:'Tidak boleh menyalin 9, 10, J, Q, K, atau Joker. Pembatasan mencegah recursion dan chain kompleks.', notes:'Power 9 bergantung pada konteks board, bukan rank nominal.', colors:['#8e65e6','#e080da'], glyph:'⧉' },
  { rank:'10', name:'OVERTIME', level:'advanced', levelLabel:'Advanced', summary:'Ambil 1 kartu tambahan dan tempatkan segera; kartu bonus tidak mengaktifkan ability.', effect:'Setelah placement 10 selesai, ambil satu kartu dari Draw Deck lalu tempatkan segera.', target:'Draw Deck dan satu hex legal untuk kartu bonus.', limits:'Ability kartu bonus diabaikan. Extra placement tidak menghasilkan chain ability.', notes:'Tempo ekstra tanpa recursive trigger.', colors:['#37a8a7','#9adfba'], glyph:'＋' },
  { rank:'J', name:'JACK OF ALL TRADES', level:'power', levelLabel:'Power', summary:'Pilih dan jalankan salah satu ability rank 2, 3, atau 4.', effect:'Saat J ditempatkan, pilih NUDGE, SCOUT, atau LOCAL SWAP dan jalankan efeknya.', target:'Mengikuti target dari ability 2, 3, atau 4 yang dipilih.', limits:'Tidak menyalin Tactical atau Power ability.', notes:'Fleksibel untuk pemain pemula dan intermediate.', colors:['#ef6b75','#8c73ed'], glyph:'3×' },
  { rank:'Q', name:"QUEEN'S COMMAND", level:'power', levelLabel:'Power', summary:'Gerakkan hingga 2 top card adjacent, masing-masing maksimal 1 hex ke posisi legal.', effect:'Pindahkan kartu pertama satu hex, perbarui kondisi board, lalu bila diinginkan pindahkan kartu kedua satu hex.', target:'Hingga dua top card yang adjacent dengan Q.', limits:'Pemain boleh hanya memindahkan satu kartu. Q tidak boleh menggerakkan Locked card.', notes:'Kedua perpindahan diselesaikan satu per satu.', colors:['#cf62a9','#f3a8d6'], glyph:'Ⅱ' },
  { rank:'K', name:"KING'S ORDER", level:'power', levelLabel:'Power', summary:'LOCK satu kartu adjacent sampai awal turn Anda berikutnya.', effect:'Pilih satu kartu adjacent dan tandai LOCKED. Locked card tetap berada di board dan tetap dihitung untuk Pattern/Job.', target:'Satu kartu adjacent.', limits:'Locked card tidak boleh dipindahkan, ditukar, didorong, ditarik, atau di-ROTATE. Satu pemain hanya boleh memiliki satu LOCK aktif.', notes:'Memainkan K baru memindahkan lock lama ke target baru.', colors:['#e5a51e','#ffcf5b'], glyph:'▣' },
  { rank:'JOKER', name:'CHAOS SHIFT', level:'chaos', levelLabel:'Chaos', summary:'Salin satu ability rank 2–K yang sedang terlihat sebagai top card di board.', effect:'Lihat seluruh top card yang terlihat, pilih satu rank dari 2–K, lalu jalankan ability itu satu kali.', target:'Satu rank 2–K yang saat ini terlihat sebagai top card.', limits:'Tidak dapat menyalin Joker lain. Jika tidak ada target ability legal, Joker tetap boleh ditempatkan tanpa ability.', notes:'Jika deck memiliki dua Joker, keduanya memakai aturan yang sama pada v0.1.', colors:['#ff7b61','#8d66e8'], glyph:'★' }
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
let playtests = new Set(JSON.parse(localStorage.getItem(STORAGE.playtests) || '[]'));
let toastTimer;

function suitMarks() {
  return `<div class="suit-cats" aria-hidden="true"><span class="suit-cat black">♣</span><span class="suit-cat red">♦</span><span class="suit-cat red">♥</span><span class="suit-cat black">♠</span></div>`;
}

function abilityArt(card) {
  return `<svg class="cat-art" viewBox="0 0 220 180" aria-hidden="true">
    <defs><linearGradient id="g-${card.rank.replace(/\W/g,'x')}" x1="0" x2="1"><stop stop-color="${card.colors[0]}"/><stop offset="1" stop-color="${card.colors[1]}"/></linearGradient></defs>
    <path d="M55 62 44 24l35 23c18-9 42-9 59 0l34-23-10 38c17 14 25 34 20 55-7 30-36 49-73 49-36 0-65-19-72-49-5-21 2-41 18-55Z" fill="url(#g-${card.rank.replace(/\W/g,'x')})"/>
    <circle cx="84" cy="91" r="5" fill="#fff"/><circle cx="132" cy="91" r="5" fill="#fff"/>
    <path d="m100 108 8 6 8-6m-8 6v9" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
    <text x="109" y="60" text-anchor="middle" fill="#fff" font-size="30" font-weight="950">${card.glyph}</text>
    <path d="M65 111 38 105m28 18-27 5m112-17 27-6m-27 18 27 5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>
  </svg>`;
}

function renderCards() {
  const query = els.search.value.trim().toLowerCase();
  const shown = cards.filter(card => {
    const filterMatch = activeFilter === 'all' || card.level === activeFilter;
    const haystack = `${card.rank} ${card.name} ${card.levelLabel} ${card.summary} ${card.effect} ${card.target} ${card.limits}`.toLowerCase();
    return filterMatch && haystack.includes(query);
  });

  els.cardGrid.innerHTML = shown.map(card => {
    const isLearned = learned.has(card.rank);
    return `<article class="power-card ${isLearned ? 'learned' : ''}" data-rank="${card.rank}" tabindex="0" style="--accent:${card.colors[0]};--accent2:${card.colors[1]}">
      <div class="card-visual"><div class="rank-stack"><span class="rank">${card.rank}</span>${suitMarks()}</div>${abilityArt(card)}</div>
      <div class="card-meta"><div class="card-meta-top"><h3 class="card-name">${card.name}</h3><span class="type-badge">${card.levelLabel}</span></div><p class="card-summary">${card.summary}</p>
      <div class="card-actions"><button class="learn-button" type="button" data-learn="${card.rank}" aria-pressed="${isLearned}"><span class="check-ring">${isLearned ? '✓' : ''}</span><span>${isLearned ? 'Sudah dikuasai' : 'Tandai dikuasai'}</span></button><button class="details-link" type="button" data-detail="${card.rank}">Detail →</button></div></div>
    </article>`;
  }).join('');

  els.emptyState.hidden = shown.length !== 0;
  bindCardEvents();
}

function bindCardEvents() {
  document.querySelectorAll('[data-learn]').forEach(button => button.addEventListener('click', event => { event.stopPropagation(); toggleLearned(button.dataset.learn); }));
  document.querySelectorAll('[data-detail]').forEach(button => button.addEventListener('click', event => { event.stopPropagation(); openCard(button.dataset.detail); }));
  document.querySelectorAll('.power-card').forEach(card => {
    card.addEventListener('click', () => openCard(card.dataset.rank));
    card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openCard(card.dataset.rank); } });
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
  els.dialogContent.innerHTML = `<div class="dialog-inner" style="--accent:${card.colors[0]};--accent2:${card.colors[1]}"><div class="dialog-hero">${abilityArt(card)}<div><span class="dialog-rank">${card.rank}</span><h2>${card.name}</h2><p>${card.summary}</p></div></div><div class="dialog-grid"><section class="dialog-section dialog-wide"><h3>Efek lengkap</h3><p>${card.effect}</p></section><section class="dialog-section"><h3>Target</h3><p>${card.target}</p></section><section class="dialog-section"><h3>Batasan</h3><p>${card.limits}</p></section><section class="dialog-section dialog-wide"><h3>Catatan desain / interpretasi</h3><p>${card.notes}</p></section></div></div>`;
  els.dialog.showModal();
}

function navigate(page) {
  els.pages.forEach(section => section.classList.toggle('active', section.dataset.page === page));
  els.navs.forEach(button => {
    const active = button.dataset.nav === page;
    button.classList.toggle('active', active);
    if (active && button.classList.contains('nav-item')) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current');
  });
  history.replaceState(null, '', `#${page}`);
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
  toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2200);
}

function renderPlaytests() {
  const all = ['basic','spatial','power','joker'];
  all.forEach(id => {
    const done = playtests.has(id);
    const card = document.querySelector(`[data-test="${id}"]`);
    const button = document.querySelector(`[data-test-toggle="${id}"]`);
    if (card) card.classList.toggle('test-complete', done);
    if (button) button.textContent = done ? '✓ Selesai' : 'Tandai selesai';
  });
  const count = playtests.size;
  document.querySelector('#playtestDone').textContent = `${count} / 4 selesai`;
  document.querySelector('#playtestBar').style.width = `${count * 25}%`;
  document.querySelector('#playtestHint').textContent = count === 4 ? 'Semua tahap playtest telah ditandai selesai.' : `Tahap berikutnya: Test ${String(count + 1).padStart(2,'0')}.`;
}

els.navs.forEach(button => button.addEventListener('click', event => { event.preventDefault(); navigate(button.dataset.nav); }));
els.search.addEventListener('input', renderCards);
els.filters.forEach(button => button.addEventListener('click', () => { activeFilter = button.dataset.filter; els.filters.forEach(item => item.classList.toggle('active', item === button)); renderCards(); }));
document.querySelector('#reviewUnlearned').addEventListener('click', () => {
  activeFilter = 'all';
  els.filters.forEach(item => item.classList.toggle('active', item.dataset.filter === 'all'));
  els.search.value = '';
  renderCards();
  const first = [...document.querySelectorAll('.power-card')].find(card => !learned.has(card.dataset.rank));
  if (first) first.scrollIntoView({ behavior:'smooth', block:'center' }); else showToast('Semua ability sudah ditandai dikuasai.');
});
els.themeToggle.addEventListener('click', () => applyTheme(document.body.classList.contains('dark') ? 'light' : 'dark'));
els.focusButton.addEventListener('click', () => { document.body.classList.toggle('focus-mode'); showToast(document.body.classList.contains('focus-mode') ? 'Mode fokus aktif.' : 'Mode fokus nonaktif.'); });
els.dialogClose.addEventListener('click', () => els.dialog.close());
els.dialog.addEventListener('click', event => { if (event.target === els.dialog) els.dialog.close(); });

document.querySelectorAll('[data-test-toggle]').forEach(button => button.addEventListener('click', () => {
  const id = button.dataset.testToggle;
  if (playtests.has(id)) playtests.delete(id); else playtests.add(id);
  localStorage.setItem(STORAGE.playtests, JSON.stringify([...playtests]));
  renderPlaytests();
}));
document.querySelector('#resetPlaytest').addEventListener('click', () => { playtests.clear(); localStorage.removeItem(STORAGE.playtests); renderPlaytests(); showToast('Checklist playtest direset.'); });

applyTheme(localStorage.getItem(STORAGE.theme) || 'light');
renderCards();
updateMastery();
renderPlaytests();

const initialPage = location.hash.replace('#','');
if (['abilities','rules','playtest'].includes(initialPage)) navigate(initialPage);
