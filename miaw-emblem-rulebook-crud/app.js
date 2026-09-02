'use strict';

const STORAGE = {
  theme: 'cuttle-cat-theme-v2',
  learned: 'cuttle-cat-kingdom-learned-v1',
  matches: 'cuttle-cat-matches-v2',
  comparison: 'cuttle-cat-kingdom-comparison-v1',
  cards: 'cuttle-cat-kingdom-cards-v1'
};

const TYPE_LABELS = {
  reveal: 'Saat Reveal',
  passive: 'Pasif (Kontinu)',
  'before-ranking': 'Sebelum Ranking',
  round: 'Akhir Ronde'
};

const CARD_STYLES = new Set([
  'assassin', 'scout', 'thief', 'merchant', 'guard', 'knight', 'commander', 'wizard',
  'spy', 'general', 'duke', 'queen', 'king', 'shield', 'archivist', 'bandit', 'storm',
  'seer', 'glasses', 'portal', 'calm', 'custom'
]);

const DEFAULT_CARDS = [
  {
    rank: 'A', name: 'Assassin', power: 1, type: 'reveal', typeLabel: 'Saat Reveal', timing: 'Saat Reveal',
    summary: 'Jika menjadi kartu dengan Power terkecil di Line, hancurkan kartu dengan Power terbesar.',
    effect: 'Jika menjadi kartu dengan Power terkecil di Line, hancurkan kartu dengan Power terbesar.',
    modes: 'Saat Reveal · Hancurkan', target: 'Kartu dengan Power terbesar di Line.',
    counter: 'Dinetralkan oleh Guard (5) dan Queen (Q). Ability dibatalkan oleh Spy Master (9).',
    pitfall: 'Ability hanya aktif jika Assassin benar-benar menjadi kartu dengan Power terkecil di Line.',
    cat: 'assassin', colors: ['#e54868', '#ff9d78']
  },
  {
    rank: '2', name: 'Scout', power: 2, type: 'reveal', typeLabel: 'Saat Reveal', timing: 'Saat Reveal',
    summary: 'Lihat 1 kartu lawan secara rahasia yang belum dimainkan, di tangan atau tertutup.',
    effect: 'Lihat 1 kartu lawan secara rahasia yang belum dimainkan, baik yang berada di tangan maupun kartu tertutup.',
    modes: 'Saat Reveal · Informasi', target: '1 kartu lawan yang belum dimainkan.',
    counter: 'Memberi informasi taktis dan tidak memberi dampak damage di meja.',
    pitfall: 'Kartu yang dilihat tetap rahasia; jangan membukanya kepada pemain lain.',
    cat: 'scout', colors: ['#16a8bd', '#59d5c4']
  },
  {
    rank: '3', name: 'Thief', power: 3, type: 'round', typeLabel: 'Akhir Ronde', timing: 'Akhir Ronde',
    summary: 'Jika bertahan di Line dan tidak menjadi Juara 1, ambil +1 koin dari Bank.',
    effect: 'Jika kartu ini bertahan di Line dan tidak menjadi Juara 1, ambil +1 koin dari Bank.',
    modes: 'Akhir Ronde · Koin', target: 'Kartu ini dan statusnya di Line.',
    counter: 'Tetap untung meski kalah adu Power murni.',
    pitfall: 'Bonus hanya berlaku jika Thief masih bertahan dan bukan Juara 1.',
    cat: 'thief', colors: ['#7467e8', '#b09cff']
  },
  {
    rank: '4', name: 'Merchant', power: 4, type: 'round', typeLabel: 'Akhir Ronde', timing: 'Akhir Ronde',
    summary: 'Jika memenangkan Line sebagai Juara 1, dapatkan ekstra +1 koin dari Bank.',
    effect: 'Jika memenangkan Line (Juara 1), dapatkan ekstra +1 koin dari Bank.',
    modes: 'Akhir Ronde · Koin', target: 'Line yang dimenangkan oleh Merchant.',
    counter: 'Meningkatkan nilai koin reward dari lokasi Line.',
    pitfall: 'Bonus Merchant hanya muncul saat kartu ini menjadi Juara 1.',
    cat: 'merchant', colors: ['#f0a316', '#ffd764']
  },
  {
    rank: '5', name: 'Guard', power: 5, type: 'passive', typeLabel: 'Pasif', timing: 'Pasif (Kontinu)',
    summary: 'Tidak dapat dihancurkan oleh kartu dengan Power lebih kecil, termasuk Assassin.',
    effect: 'Kartu ini tidak dapat dihancurkan oleh kartu dengan Power lebih kecil, termasuk Assassin.',
    modes: 'Pasif (Kontinu) · Proteksi', target: 'Kartu Guard itu sendiri.',
    counter: 'Pelindung ideal untuk menahan serangan efek kartu kecil.',
    pitfall: 'Bandingkan Power kartu penyerang dengan Power Guard sebelum menyatakan penghancuran sah.',
    cat: 'guard', colors: ['#20a9a1', '#65d7c7']
  },
  {
    rank: '6', name: 'Knight', power: 6, type: 'round', typeLabel: 'Akhir Ronde', timing: 'Akhir Ronde',
    summary: 'Jika kalah adu Power, tetap bertahan di Line sebagai posisi terakhir dan tidak masuk Trash.',
    effect: 'Jika kalah adu Power, kartu ini tetap bertahan di Line sebagai posisi terakhir dan tidak dibuang ke Trash.',
    modes: 'Akhir Ronde · Bertahan', target: 'Kartu Knight itu sendiri.',
    counter: 'Efektif di lokasi yang memberikan reward atau efek untuk posisi terbawah.',
    pitfall: 'Knight tetap berada di posisi terakhir; ability ini tidak membuatnya menang ranking.',
    cat: 'knight', colors: ['#3977dc', '#5fe0ee']
  },
  {
    rank: '7', name: 'Commander', power: 7, type: 'reveal', typeLabel: 'Saat Reveal', timing: 'Saat Reveal',
    summary: 'Jika ada kartu lain dengan Suit sama di Line, Power Commander menjadi 9.',
    effect: 'Jika ada kartu lain dengan Suit yang sama (♠/♥/♦/♣) di Line yang sama, Power Commander +2.',
    modes: 'Saat Reveal · Sinergi Suit', target: 'Kartu lain dengan Suit sama di Line yang sama.',
    counter: 'Sinergi antar-pemain atau kombinasi kartu internal; Power menjadi 9.',
    pitfall: 'Bonus hanya muncul jika benar-benar ada kartu lain dengan Suit yang sama.',
    cat: 'commander', colors: ['#8567e8', '#5ab8fa']
  },
  {
    rank: '8', name: 'Wizard', power: 8, type: 'reveal', typeLabel: 'Saat Reveal', timing: 'Saat Reveal',
    summary: 'Tukar nilai Power murni kartu ini dengan 1 kartu lain pilihan Anda di Line.',
    effect: 'Tukar nilai Power murni kartu ini dengan 1 kartu lain pilihan Anda di Line tersebut.',
    modes: 'Saat Reveal · Manipulasi Power', target: '1 kartu lain pilihan Anda di Line.',
    counter: 'Manipulasi angka secara drastis, misalnya menukar Power 8 dengan King 13.',
    pitfall: 'Yang ditukar adalah nilai Power murni; hitung ulang Power akhir setelah efek selesai.',
    cat: 'wizard', colors: ['#20a9d7', '#65d7c7']
  },
  {
    rank: '9', name: 'Spy Master', power: 9, type: 'before-ranking', typeLabel: 'Sebelum Ranking', timing: 'Sebelum Ranking',
    summary: 'Batalkan seluruh ability dari 1 kartu pilihan di Line hingga ronde berakhir.',
    effect: 'Batalkan (nullify) seluruh ability dari 1 kartu pilihan di Line tersebut hingga ronde berakhir.',
    modes: 'Sebelum Ranking · Nullify', target: '1 kartu pilihan di Line.',
    counter: 'Mematikan efek eksekusi Assassin, Merchant, Wizard, dan ability kartu lainnya.',
    pitfall: 'Spy Master membatalkan ability, bukan otomatis mengubah Power tercetak kartu target.',
    cat: 'spy', colors: ['#8e65e6', '#e080da']
  },
  {
    rank: '10', name: 'General', power: 10, type: 'round', typeLabel: 'Akhir Ronde', timing: 'Akhir Ronde',
    summary: 'Jika memenangkan Line, seluruh kartu lawan yang kalah masuk Trash tanpa reward.',
    effect: 'Jika memenangkan Line, seluruh kartu lawan yang kalah langsung dibuang ke Trash tanpa reward.',
    modes: 'Akhir Ronde · Trash', target: 'Seluruh kartu lawan yang kalah di Line.',
    counter: 'Menghapus potensi reward posisi 2 atau 3 untuk lawan.',
    pitfall: 'Ability hanya berlaku jika General memenangkan Line.',
    cat: 'general', colors: ['#37a8a7', '#9adfba']
  },
  {
    rank: 'J', name: 'Duke', power: 11, type: 'round', typeLabel: 'Akhir Ronde', timing: 'Akhir Ronde',
    summary: 'Jika kalah, otomatis mengambil reward Juara 2 jika Juara 1 menang memakai ability penghancur.',
    effect: 'Jika kalah, otomatis mengambil reward Juara 2 apabila Juara 1 menang menggunakan ability penghancur.',
    modes: 'Akhir Ronde · Reward', target: 'Reward Juara 2 dan kondisi kemenangan Juara 1.',
    counter: 'Eksploitasi kekacauan pertarungan.',
    pitfall: 'Cek dulu apakah Juara 1 memang menang menggunakan ability penghancur.',
    cat: 'duke', colors: ['#ef6b75', '#8c73ed']
  },
  {
    rank: 'Q', name: 'Queen', power: 12, type: 'passive', typeLabel: 'Pasif', timing: 'Pasif (Kontinu)',
    summary: 'Kebal terhadap seluruh efek penghancuran atau penurunan Power dari kartu ber-Power lebih kecil.',
    effect: 'Kebal terhadap seluruh efek penghancuran atau penurunan Power dari kartu ber-Power lebih kecil.',
    modes: 'Pasif (Kontinu) · Proteksi', target: 'Kartu Queen itu sendiri.',
    counter: 'Pertahanan absolut terhadap kartu kecil (A–11).',
    pitfall: 'Bandingkan Power sumber efek sebelum menentukan apakah perlindungan Queen berlaku.',
    cat: 'queen', colors: ['#cf62a9', '#f3a8d6']
  },
  {
    rank: 'K', name: 'King', power: 13, type: 'round', typeLabel: 'Akhir Ronde', timing: 'Akhir Ronde',
    summary: 'Jika memenangkan Line, dapatkan bonus +2 koin tambahan dari Bank.',
    effect: 'Jika memenangkan Line (Juara 1), dapatkan bonus +2 koin tambahan dari Bank.',
    modes: 'Akhir Ronde · Koin', target: 'Line yang dimenangkan oleh King.',
    counter: 'Pengumpul koin tertinggi, namun target utama Assassin (A).',
    pitfall: 'Bonus King hanya diberikan saat King menjadi Juara 1.',
    cat: 'king', colors: ['#e5a51e', '#ffcf5b']
  }
];

// Variasi playtest berbasis tiga lokasi Emblems: Castle, Village, dan Port.
// Set 1 mengikuti contoh yang diminta; set 2–30 adalah variasi fan-made
// dengan empat slot reward/modifier (posisi 1–4) untuk adaptasi 2–4 pemain.
const LINE_LOCATIONS = [
  { name: 'Castle', symbol: '♜', descriptor: 'Hadiah utama · duel Power' },
  { name: 'Village', symbol: '⌂', descriptor: 'Ekonomi · pilihan aman atau rakus' },
  { name: 'Port', symbol: '⚓', descriptor: 'Risiko · comeback · penalti' }
];

const LINE_SET_VALUES = [
  [[4, 5, 2, 2], [6, -2, 1, 4], [3, 2, 4, 1]],
  [[5, 3, 2, 0], [2, 4, 1, 0], [6, 0, -1, 2]],
  [[4, 3, 1, 0], [1, 3, 2, 0], [5, 1, 0, -2]],
  [[6, 2, 1, 0], [3, 1, 4, 0], [2, 5, -1, 1]],
  [[3, 5, 2, 1], [4, 0, 2, 1], [6, 1, -2, 2]],
  [[4, 2, 3, 0], [6, -1, 1, 2], [2, 4, 1, 0]],
  [[5, 4, 0, 1], [2, 2, 3, -1], [4, 1, 5, 0]],
  [[6, 3, 1, 0], [1, 4, 2, 0], [3, 0, -2, 5]],
  [[4, 5, 1, -1], [2, 3, 4, 0], [6, 2, 0, -2]],
  [[5, 2, 2, 1], [4, 1, 3, 0], [3, 6, -1, 0]],
  [[4, 4, 2, 0], [3, 0, 2, 1], [5, 1, -2, 3]],
  [[6, 2, 0, 0], [1, 5, 2, -1], [4, 3, -2, 1]],
  [[3, 4, 3, 1], [5, 0, 1, -1], [2, 6, 0, 1]],
  [[5, 3, 1, 1], [2, 4, 0, 0], [6, -1, 2, 3]],
  [[4, 2, 2, 0], [6, 1, -1, 2], [3, 5, 0, 1]],
  [[6, 4, 1, -1], [2, 3, 2, 0], [4, 0, -2, 5]],
  [[3, 5, 1, 0], [4, 2, 0, 1], [6, -2, 1, 2]],
  [[5, 2, 3, 0], [1, 4, 2, -1], [3, 6, -1, 0]],
  [[4, 3, 2, 1], [6, 0, 1, -2], [2, 5, 0, 2]],
  [[6, 3, 0, 0], [3, 1, 4, -1], [5, 2, -2, 1]],
  [[4, 5, 0, 1], [2, 3, 3, 0], [6, -1, 1, 2]],
  [[5, 4, 2, -1], [1, 2, 4, 0], [3, 6, -2, 1]],
  [[3, 3, 2, 1], [6, 1, 0, -1], [4, 2, -2, 5]],
  [[6, 2, 2, 0], [4, 0, 3, 1], [2, 5, -1, 3]],
  [[4, 4, 1, 0], [2, 6, 0, -1], [5, 1, -2, 2]],
  [[5, 3, 2, 0], [3, 2, 4, -1], [6, -2, 1, 0]],
  [[6, 4, 0, -1], [1, 5, 2, 0], [4, 2, -2, 3]],
  [[3, 5, 2, 0], [4, 1, 3, -1], [6, 0, -2, 2]],
  [[5, 2, 1, 1], [2, 4, 0, -1], [3, 6, -2, 1]],
  [[4, 3, 3, 0], [6, 1, -1, 2], [2, 5, -2, 4]]
];

const lineSets = LINE_SET_VALUES.map((values, setIndex) => ({
  id: setIndex + 1,
  label: `Set ${setIndex + 1}`,
  lines: values.map((rewards, lineIndex) => ({
    ...LINE_LOCATIONS[lineIndex],
    rewards
  }))
}));

function safeColor(value, fallback) {
  return /^#[0-9a-f]{6}$/i.test(String(value || '')) ? String(value) : fallback;
}

function normalizeCard(card, fallback = {}) {
  const source = { ...fallback, ...card };
  const type = Object.prototype.hasOwnProperty.call(TYPE_LABELS, source.type) ? source.type : 'round';
  const powerValue = Number(source.power);
  const fallbackPower = Number(fallback.power) || 1;
  const power = Number.isFinite(powerValue) ? Math.max(0, Math.min(99, Math.round(powerValue))) : fallbackPower;
  const fallbackPrimary = Array.isArray(fallback.colors) ? fallback.colors[0] : '#238fea';
  const fallbackSecondary = Array.isArray(fallback.colors) ? fallback.colors[1] : '#4f6df6';
  const effect = String(source.effect || source.summary || 'Belum ada efek.').trim();
  return {
    rank: String(source.rank || fallback.rank || 'X').trim().slice(0, 4),
    name: String(source.name || fallback.name || 'Kartu baru').trim(),
    power,
    type,
    typeLabel: TYPE_LABELS[type],
    timing: TYPE_LABELS[type],
    summary: String(source.summary || effect).trim(),
    effect,
    modes: String(source.modes || `${TYPE_LABELS[type]} · Custom`).trim(),
    target: String(source.target || 'Tentukan target atau kondisi ability.').trim(),
    counter: String(source.counter || 'Belum ditentukan; uji interaksinya saat playtest.').trim(),
    pitfall: String(source.pitfall || 'Catat edge case ini pada ronde berikutnya.').trim(),
    cat: CARD_STYLES.has(source.cat) ? source.cat : 'custom',
    colors: [safeColor(source.colors?.[0], fallbackPrimary), safeColor(source.colors?.[1], fallbackSecondary)]
  };
}

function loadCards() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE.cards) || 'null');
    if (Array.isArray(stored) && stored.length) return stored.map((card, index) => normalizeCard(card, DEFAULT_CARDS[index] || {}));
  } catch { /* kembali ke kartu bawaan jika data lokal rusak */ }
  return DEFAULT_CARDS.map(card => normalizeCard(card, card));
}

function persistCards() {
  localStorage.setItem(STORAGE.cards, JSON.stringify(cards));
}

let cards = loadCards();

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
  editorDialog: document.querySelector('#cardEditorDialog'),
  editorForm: document.querySelector('#cardEditorForm'),
  editorTitle: document.querySelector('#editorTitle'),
  editorSubmit: document.querySelector('#editorSubmit'),
  editorOriginalRank: document.querySelector('#editorOriginalRank'),
  addCard: document.querySelector('#addCard'),
  restoreDefaults: document.querySelector('#restoreDefaults'),
  toast: document.querySelector('#toast')
};

let activeFilter = 'all';
let learned = new Set(JSON.parse(localStorage.getItem(STORAGE.learned) || '[]'));
let matches = JSON.parse(localStorage.getItem(STORAGE.matches) || '[]');
let toastTimer;

function catSVG(style, primary, secondary, seed = 'card') {
  style = CARD_STYLES.has(style) ? style : 'custom';
  primary = safeColor(primary, '#238fea');
  secondary = safeColor(secondary, '#4f6df6');
  const gradientSeed = String(seed || 'card').replace(/[^a-z0-9_-]/gi, '') || 'card';
  const gradientId = `g-${style}-${gradientSeed}`;
  const accessories = {
    assassin: '<path d="m151 72 22 22-38 38-13-13 38-38Z" fill="#253052" stroke="#fff" stroke-width="4" stroke-linejoin="round"/><path d="m119 119-17 17m29-4-10 10" stroke="#ffd45b" stroke-width="5" stroke-linecap="round"/>',
    scout: '<circle cx="87" cy="105" r="22" fill="none" stroke="#fff" stroke-width="7"/><circle cx="139" cy="105" r="22" fill="none" stroke="#fff" stroke-width="7"/><path d="M109 105h8m-52 0H49m128 0h-8" stroke="#253052" stroke-width="6" stroke-linecap="round"/>',
    wizard: '<path d="M61 46 88 11l28 36" fill="none" stroke="#ffd45b" stroke-width="8" stroke-linejoin="round"/><path d="m78 26 10-8 8 10 10-6" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>',
    guard: '<path d="M103 76v45c0 21 15 34 34 42 19-8 34-21 34-42V76l-34-13-34 13Z" fill="#fff" opacity=".86"/><path d="M137 82v61m-25-31h50" stroke="'+primary+'" stroke-width="6" stroke-linecap="round"/>',
    shield: '<path d="M105 89v42c0 18 13 29 31 36 18-7 31-18 31-36V89l-31-12-31 12Z" fill="#fff" opacity=".8"/><path d="M136 93v56" stroke="'+primary+'" stroke-width="5"/>',
    archivist: '<rect x="101" y="103" width="64" height="48" rx="8" fill="#fff" opacity=".88"/><path d="M133 104v47M112 118h13m16 0h13" stroke="'+primary+'" stroke-width="4" stroke-linecap="round"/>',
    bandit: '<path d="M61 91c23-14 63-14 86 0l-8 27c-21-12-49-12-70 0L61 91Z" fill="#2c3158"/><path d="M77 101h18m18 0h18" stroke="#fff" stroke-width="6" stroke-linecap="round"/>',
    merchant: '<path d="M98 119h59l-5 39h-49l-5-39Z" fill="#fff" opacity=".85"/><path d="M111 119c0-16 33-16 33 0" fill="none" stroke="'+primary+'" stroke-width="5"/>',
    knight: '<path d="m119 54 18-13 24 14-7 27-23 17-23-17-7-27 18-14Z" fill="#fff" opacity=".88"/><path d="m146 92 22 43m-32-26 21 22" stroke="#ffd45b" stroke-width="6" stroke-linecap="round"/>',
    storm: '<path d="m130 82-19 35h22l-15 35 43-51h-24l14-19Z" fill="#ffe25c" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>',
    seer: '<circle cx="132" cy="126" r="31" fill="#fff" opacity=".78"/><circle cx="132" cy="126" r="18" fill="none" stroke="'+primary+'" stroke-width="5"/><circle cx="132" cy="126" r="5" fill="'+primary+'"/>',
    commander: '<path d="M129 61v91M129 65h48l-20 20 20 20h-48Z" fill="#fff" opacity=".9" stroke="#ffd45b" stroke-width="4" stroke-linejoin="round"/>',
    glasses: '<circle cx="85" cy="101" r="18" fill="none" stroke="#233052" stroke-width="7"/><circle cx="127" cy="101" r="18" fill="none" stroke="#233052" stroke-width="7"/><path d="M103 101h7m35-2 17-7M67 99l-17-7" stroke="#233052" stroke-width="7" stroke-linecap="round"/>',
    portal: '<circle cx="134" cy="125" r="38" fill="none" stroke="#fff" stroke-width="8" opacity=".85"/><path d="M134 91c20 12 23 35 7 51-12 12-33 9-42-5" fill="none" stroke="'+secondary+'" stroke-width="7" stroke-linecap="round"/>',
    calm: '<path d="M71 102c8-8 18-8 26 0m20 0c8-8 18-8 26 0" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/><path d="M151 60c16 0 25 9 25 20-12-2-22 0-29 8" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>',
    thief: '<path d="M55 52c28-35 76-35 105 0-33-9-71-9-105 0Z" fill="#263052"/><path d="M141 38c19-16 35-13 47-7-15 4-24 10-29 20" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>',
    spy: '<path d="M56 111c24-28 75-28 105 0-30 28-81 28-105 0Z" fill="#fff" opacity=".88"/><circle cx="109" cy="111" r="16" fill="none" stroke="'+primary+'" stroke-width="6"/><circle cx="109" cy="111" r="5" fill="'+primary+'"/><path d="m129 90 17-17" stroke="#ffd45b" stroke-width="6" stroke-linecap="round"/>',
    general: '<circle cx="132" cy="113" r="34" fill="#fff" opacity=".88"/><path d="m132 82 9 20 22 2-17 14 6 22-20-11-20 11 6-22-17-14 22-2 9-20Z" fill="'+primary+'" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>',
    duke: '<path d="M75 137h107M88 137V98l22-18 22 18v39m-44-39h44m-22 39V99" fill="none" stroke="#fff" stroke-width="7" stroke-linejoin="round"/><path d="M151 65c17-18 31-17 43-11-15 6-24 15-27 27" fill="none" stroke="#ffd45b" stroke-width="6" stroke-linecap="round"/>',
    queen: '<path d="M64 52 76 18l30 26 24-29 19 37" fill="#ffe06c" stroke="#fff" stroke-width="5" stroke-linejoin="round"/><circle cx="76" cy="18" r="6" fill="#ff7e9d"/><circle cx="130" cy="15" r="6" fill="#8d79f5"/>',
    king: '<path d="M59 52 70 15l31 28 25-33 25 42" fill="#ffd65d" stroke="#fff" stroke-width="5" stroke-linejoin="round"/><path d="M66 49h80" stroke="#fff" stroke-width="5"/><circle cx="70" cy="15" r="6" fill="#ff7a84"/><circle cx="126" cy="10" r="6" fill="#5dc8f5"/>'
  };
  return `
  <svg class="cat-art" viewBox="0 0 210 190" aria-hidden="true">
    <defs><linearGradient id="${gradientId}" x1="0" x2="1"><stop stop-color="${primary}"/><stop offset="1" stop-color="${secondary}"/></linearGradient></defs>
    <path d="M53 70 42 30l35 24c17-9 40-9 56 0l35-24-10 40c16 15 23 37 18 58-7 31-35 50-71 50s-64-19-71-50c-5-21 2-43 19-58Z" fill="url(#${gradientId})"/>
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
    const filterMatch = activeFilter === 'all' || card.type === activeFilter;
    const haystack = `${card.rank} ${card.name} ${card.power} ${card.timing} ${card.summary} ${card.effect} ${card.modes} ${card.target} ${card.counter}`.toLowerCase();
    return filterMatch && haystack.includes(query);
  });

  els.cardGrid.innerHTML = shown.map(card => {
    const isLearned = learned.has(card.rank);
    const rank = escapeHTML(card.rank);
    const name = escapeHTML(card.name);
    const typeLabel = escapeHTML(card.typeLabel);
    return `<article class="power-card ${isLearned ? 'learned' : ''}" data-rank="${rank}" tabindex="0" style="--accent:${card.colors[0]};--accent2:${card.colors[1]}">
      <div class="card-visual">
        <div class="rank-stack"><span class="rank">${rank}</span>${suitCats()}</div>
        ${catSVG(card.cat, card.colors[0], card.colors[1], card.rank)}
      </div>
      <div class="card-meta">
        <div class="card-meta-top"><h3 class="card-name">${rank} · ${name}</h3><div class="card-badges"><span class="power-badge">Power ${card.power}</span><span class="type-badge">${typeLabel}</span></div></div>
        <p class="card-summary">${escapeHTML(card.summary)}</p>
        <div class="card-actions">
          <button class="learn-button" type="button" data-learn="${rank}" aria-pressed="${isLearned}"><span class="check-ring">${isLearned ? '✓' : ''}</span><span>${isLearned ? 'Sudah dikuasai' : 'Tandai dikuasai'}</span></button>
          <button class="details-link" type="button" data-detail="${rank}">Detail →</button>
        </div>
        <div class="card-admin-actions" aria-label="CRUD ${name}">
          <button class="admin-button edit" type="button" data-edit-card="${rank}">Edit kartu</button>
          <button class="admin-button delete" type="button" data-delete-card="${rank}">Hapus</button>
        </div>
      </div>
    </article>`;
  }).join('');

  els.emptyState.hidden = shown.length !== 0;
  const cardCount = document.querySelector('#cardCount');
  if (cardCount) cardCount.textContent = `${cards.length} kartu aktif`;
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
  document.querySelectorAll('[data-edit-card]').forEach(button => {
    button.addEventListener('click', event => {
      event.stopPropagation();
      openEditor(button.dataset.editCard);
    });
  });
  document.querySelectorAll('[data-delete-card]').forEach(button => {
    button.addEventListener('click', event => {
      event.stopPropagation();
      deleteCard(button.dataset.deleteCard);
    });
  });
  document.querySelectorAll('.power-card').forEach(card => {
    card.addEventListener('click', () => openCard(card.dataset.rank));
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openCard(card.dataset.rank); }
    });
  });
}

function syncLearned() {
  const validRanks = new Set(cards.map(card => card.rank));
  const cleaned = new Set([...learned].filter(rank => validRanks.has(rank)));
  if (cleaned.size !== learned.size) {
    learned = cleaned;
    localStorage.setItem(STORAGE.learned, JSON.stringify([...learned]));
  }
}

function paletteForPower(power) {
  const palettes = [
    ['#238fea', '#4f6df6'], ['#15b8c8', '#20bda7'], ['#8d66e8', '#c879e9'],
    ['#ff8b3d', '#ffbd4a'], ['#e64e68', '#ff8f78']
  ];
  return palettes[Math.abs(Number(power) || 0) % palettes.length];
}

function openEditor(rank = '') {
  const card = cards.find(item => item.rank === rank);
  if (rank && !card) return;
  const source = card || normalizeCard({ rank: '', name: '', power: 1, type: 'reveal' }, { colors: paletteForPower(1) });
  document.querySelector('#editorRank').value = source.rank;
  document.querySelector('#editorName').value = source.name;
  document.querySelector('#editorPower').value = source.power;
  document.querySelector('#editorType').value = source.type;
  document.querySelector('#editorSummary').value = source.summary;
  document.querySelector('#editorEffect').value = source.effect;
  document.querySelector('#editorTarget').value = source.target;
  document.querySelector('#editorCounter').value = source.counter;
  document.querySelector('#editorPitfall').value = source.pitfall;
  els.editorOriginalRank.value = card ? card.rank : '';
  els.editorTitle.textContent = card ? `Edit ${card.rank} · ${card.name}` : 'Tambah kartu baru';
  els.editorSubmit.textContent = card ? 'Simpan perubahan' : 'Tambah kartu';
  els.editorDialog.showModal();
}

function closeEditor() {
  if (els.editorDialog.open) els.editorDialog.close();
}

function saveCardFromEditor(event) {
  event.preventDefault();
  const originalRank = els.editorOriginalRank.value.trim();
  const rank = document.querySelector('#editorRank').value.trim();
  const name = document.querySelector('#editorName').value.trim();
  const power = Number(document.querySelector('#editorPower').value);
  if (!rank || !name || !Number.isFinite(power)) {
    showToast('Rank, nama peran, dan Power wajib diisi.');
    return;
  }
  const duplicate = cards.some(card => card.rank.toLowerCase() === rank.toLowerCase() && card.rank !== originalRank);
  if (duplicate) {
    showToast(`Rank ${rank} sudah dipakai kartu lain.`);
    return;
  }
  const existing = cards.find(card => card.rank === originalRank);
  const base = existing || { colors: paletteForPower(power), cat: 'custom' };
  const selectedType = document.querySelector('#editorType').value;
  const modeTail = existing?.modes?.split('·').slice(1).join('·').trim() || 'Custom';
  const nextCard = normalizeCard({
    ...base,
    rank,
    name,
    power,
    type: selectedType,
    modes: `${TYPE_LABELS[selectedType]} · ${modeTail}`,
    summary: document.querySelector('#editorSummary').value.trim(),
    effect: document.querySelector('#editorEffect').value.trim(),
    target: document.querySelector('#editorTarget').value.trim(),
    counter: document.querySelector('#editorCounter').value.trim(),
    pitfall: document.querySelector('#editorPitfall').value.trim()
  }, base);

  if (existing) {
    cards = cards.map(card => card.rank === originalRank ? nextCard : card);
    if (originalRank !== nextCard.rank && learned.has(originalRank)) {
      learned.delete(originalRank);
      learned.add(nextCard.rank);
    }
    showToast(`${nextCard.rank} · ${nextCard.name} diperbarui.`);
  } else {
    cards = [...cards, nextCard];
    showToast(`${nextCard.rank} · ${nextCard.name} ditambahkan.`);
  }
  persistCards();
  syncLearned();
  refreshRankOptions();
  renderCards();
  renderRuleTable();
  updateMastery();
  updateLineChecker();
  closeEditor();
}

function deleteCard(rank) {
  const card = cards.find(item => item.rank === rank);
  if (!card) return;
  const confirmed = window.confirm(`Hapus kartu ${card.rank} · ${card.name} dari library?`);
  if (!confirmed) return;
  cards = cards.filter(item => item.rank !== rank);
  learned.delete(rank);
  persistCards();
  localStorage.setItem(STORAGE.learned, JSON.stringify([...learned]));
  refreshRankOptions();
  renderCards();
  renderRuleTable();
  updateMastery();
  updateLineChecker();
  showToast(`${card.rank} · ${card.name} dihapus.`);
}

function restoreDefaultCards() {
  const confirmed = window.confirm('Pulihkan 13 kartu bawaan dan hapus penyesuaian library?');
  if (!confirmed) return;
  cards = DEFAULT_CARDS.map(card => normalizeCard(card, card));
  localStorage.removeItem(STORAGE.cards);
  syncLearned();
  refreshRankOptions();
  renderCards();
  renderRuleTable();
  updateMastery();
  updateLineChecker();
  showToast('13 kartu bawaan dipulihkan.');
}

function toggleLearned(rank) {
  if (learned.has(rank)) learned.delete(rank); else learned.add(rank);
  localStorage.setItem(STORAGE.learned, JSON.stringify([...learned]));
  renderCards();
  updateMastery();
  showToast(learned.has(rank) ? `${rank} ditandai sudah dikuasai.` : `${rank} dikembalikan ke daftar belajar.`);
}

function updateMastery() {
  syncLearned();
  const count = learned.size;
  const percent = cards.length ? Math.round((count / cards.length) * 100) : 0;
  document.querySelector('#metricLearned').textContent = `${count} / ${cards.length}`;
  document.querySelector('#metricGoal').textContent = cards.length ? Math.max(...cards.map(card => card.power)) : '—';
  document.querySelector('#masteryPercent').textContent = `${percent}%`;
  document.querySelector('#masteryBar').style.width = `${percent}%`;
  document.querySelector('#masteryHint').textContent = !cards.length ? 'Tambahkan minimal satu kartu untuk mulai belajar.' : count === cards.length ? 'Seluruh rank sudah ditandai dikuasai.' : `${cards.length - count} rank masih perlu ditinjau.`;
}

function renderRuleTable() {
  const tableBody = document.querySelector('#ruleTableBody');
  if (!tableBody) return;
  tableBody.innerHTML = cards.map(card => `<tr>
    <th scope="row">${escapeHTML(card.rank)}</th>
    <td><strong>${escapeHTML(card.name)}</strong></td>
    <td><span class="table-power">${card.power}</span></td>
    <td><span class="table-timing">${escapeHTML(card.timing)}</span></td>
    <td>${escapeHTML(card.effect)}</td>
    <td>${escapeHTML(card.counter)}</td>
  </tr>`).join('');
}

function openCard(rank) {
  const card = cards.find(item => item.rank === rank);
  if (!card) return;
  els.dialogContent.innerHTML = `<div class="dialog-inner" style="--accent:${card.colors[0]};--accent2:${card.colors[1]}">
    <div class="dialog-hero">
      ${catSVG(card.cat, card.colors[0], card.colors[1], `dialog-${card.rank}`)}
      <div><span class="dialog-rank">${escapeHTML(card.rank)}</span><h2>${escapeHTML(card.name)}</h2><div class="dialog-badges"><span class="power-badge">Power ${card.power}</span><span class="type-badge">${escapeHTML(card.timing)}</span></div><p>${escapeHTML(card.summary)}</p></div>
    </div>
    <div class="dialog-grid">
      <section class="dialog-section dialog-wide"><h3>Efek lengkap</h3><p>${escapeHTML(card.effect)}</p></section>
      <section class="dialog-section"><h3>Timing eksekusi</h3><p>${escapeHTML(card.timing)}</p></section>
      <section class="dialog-section"><h3>Target / kondisi</h3><p>${escapeHTML(card.target)}</p></section>
      <section class="dialog-section"><h3>Counter dan proteksi</h3><p>${escapeHTML(card.counter)}</p></section>
      <section class="dialog-section"><h3>Catatan playtest</h3><p>${escapeHTML(card.pitfall)}</p></section>
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
els.addCard.addEventListener('click', () => openEditor());
els.restoreDefaults.addEventListener('click', restoreDefaultCards);
els.editorForm.addEventListener('submit', saveCardFromEditor);
document.querySelector('#editorClose').addEventListener('click', closeEditor);
document.querySelector('#editorCancel').addEventListener('click', closeEditor);
els.editorDialog.addEventListener('click', event => { if (event.target === els.editorDialog) closeEditor(); });

// Line ranking checker
const suits = [
  { key:'clubs', label:'♣ Clubs', symbol:'♣', power:0 },
  { key:'diamonds', label:'♦ Diamonds', symbol:'♦', power:1 },
  { key:'hearts', label:'♥ Hearts', symbol:'♥', power:2 },
  { key:'spades', label:'♠ Spades', symbol:'♠', power:3 }
];
const comparisonDefaults = { cardOneRank: '7', cardOneSuit: '1', cardTwoRank: '7', cardTwoSuit: '0' };
let savedComparison = {};
try { savedComparison = JSON.parse(localStorage.getItem(STORAGE.comparison) || '{}') || {}; } catch { savedComparison = {}; }

function refreshRankOptions() {
  ['cardOneRank', 'cardTwoRank'].forEach(id => {
    const select = document.querySelector(`#${id}`);
    if (!select) return;
    const previous = select.value;
    select.innerHTML = cards.map(card => `<option value="${escapeHTML(card.rank)}">${escapeHTML(card.rank)} · ${escapeHTML(card.name)}</option>`).join('');
    if (cards.some(card => card.rank === previous)) select.value = previous;
    else if (cards[0]) select.value = cards[0].rank;
  });
  const keySelect = document.querySelector('#matchKeyCard');
  if (keySelect) {
    const previous = keySelect.value;
    keySelect.innerHTML = '<option value="">— Tidak ada —</option>' + cards.map(card => `<option value="${escapeHTML(card.rank)}">${escapeHTML(card.rank)} · ${escapeHTML(card.name)}</option>`).join('');
    if (cards.some(card => card.rank === previous)) keySelect.value = previous;
  }
}

refreshRankOptions();
['cardOneSuit','cardTwoSuit'].forEach(id => {
  document.querySelector(`#${id}`).innerHTML = suits.map(suit => `<option value="${suit.power}">${suit.label}</option>`).join('');
});
Object.entries(comparisonDefaults).forEach(([id, fallback]) => {
  const select = document.querySelector(`#${id}`);
  const savedValue = savedComparison[id] ?? fallback;
  if (id.includes('Rank') && !cards.some(card => card.rank === savedValue)) select.value = cards[0]?.rank || '';
  else select.value = savedValue;
});
function rankPower(rank) { return cards.find(card => card.rank === rank)?.power ?? 0; }
function suitByPower(power) { return suits.find(suit => suit.power === Number(power)) || suits[0]; }
function updateLineChecker() {
  const leftRank = document.querySelector('#cardOneRank').value;
  const leftSuit = suitByPower(document.querySelector('#cardOneSuit').value);
  const rightRank = document.querySelector('#cardTwoRank').value;
  const rightSuit = suitByPower(document.querySelector('#cardTwoSuit').value);
  const result = document.querySelector('#lineResult');
  if (!leftRank || !rightRank) {
    result.className = 'scuttle-result invalid';
    result.innerHTML = '<strong>Belum ada kartu untuk dibandingkan.</strong><small>Tambahkan minimal satu kartu lewat Card CRUD.</small>';
    return;
  }
  const leftPower = rankPower(leftRank);
  const rightPower = rankPower(rightRank);
  let resultClass = 'valid';
  let headline;
  if (leftPower === rightPower && leftSuit.power === rightSuit.power) {
    resultClass = '';
    headline = 'Seri.';
  } else if (leftPower > rightPower || (leftPower === rightPower && leftSuit.power > rightSuit.power)) {
    headline = `${leftRank}${leftSuit.symbol} unggul.`;
  } else {
    headline = `${rightRank}${rightSuit.symbol} unggul.`;
  }
  result.className = `scuttle-result ${resultClass}`;
  result.innerHTML = `<strong>${headline}</strong> ${leftRank}${leftSuit.symbol} = Power ${leftPower}; ${rightRank}${rightSuit.symbol} = Power ${rightPower}. <small>${leftPower === rightPower ? 'Karena Power sama, Suit menjadi tie-breaker: ♠ > ♥ > ♦ > ♣.' : 'Power akhir lebih tinggi menentukan posisi.'}</small>`;
  const snapshot = { cardOneRank:leftRank, cardOneSuit:String(leftSuit.power), cardTwoRank:rightRank, cardTwoSuit:String(rightSuit.power) };
  localStorage.setItem(STORAGE.comparison, JSON.stringify(snapshot));
}
['cardOneRank','cardOneSuit','cardTwoRank','cardTwoSuit'].forEach(id => document.querySelector(`#${id}`).addEventListener('change', updateLineChecker));

// Line random: tiga lokasi, empat slot reward/modifier, dan 30 variasi playtest.
let activeLineSet = 0;

function lineSetText(set = lineSets[activeLineSet], playerCount = 4) {
  if (!set) return '';
  return `${set.label}\n${set.lines.map((line, index) => `Line ${index + 1} · ${line.name} ${line.rewards.slice(0, playerCount).map(value => `[${value}]`).join('')}`).join('\n')}`;
}

function renderLineSet() {
  const output = document.querySelector('#lineRandomOutput');
  const select = document.querySelector('#lineSetSelect');
  const playerSelect = document.querySelector('#linePlayers');
  if (!output || !select || !playerSelect) return;
  const set = lineSets[activeLineSet] || lineSets[0];
  const playerCount = Number(playerSelect.value) || 4;
  select.value = String(set.id);
  output.innerHTML = `<div class="line-set-header"><div><span class="eyebrow">${escapeHTML(set.label.toUpperCase())} · 3 LOKASI</span><h2>Layout Line siap dimainkan</h2></div><span class="line-set-count">${lineSets.length} set tersedia</span></div>
    <div class="line-set-grid">${set.lines.map((line, lineIndex) => `<article class="line-layout-card">
      <div class="line-layout-title"><span class="line-number">${lineIndex + 1}</span><div><strong>${line.symbol} ${escapeHTML(line.name)}</strong><small>${escapeHTML(line.descriptor)}</small></div></div>
      <div class="line-values" aria-label="${escapeHTML(line.name)} untuk ${playerCount} pemain">${line.rewards.slice(0, playerCount).map((value, slot) => `<span class="line-value ${value < 0 ? 'negative' : value > 0 ? 'positive' : 'neutral'}" title="Posisi ${slot + 1}: ${value < 0 ? 'penalti' : value === 0 ? 'tidak ada reward' : 'reward'}">[${value}]</span>`).join('')}</div>
      <small class="line-slot-label">Posisi 1 → ${playerCount}</small>
    </article>`).join('')}</div>
    <div class="line-set-legend"><span><i class="legend-dot positive"></i> reward koin</span><span><i class="legend-dot negative"></i> penalti</span><span><i class="legend-dot neutral"></i> 0 / tidak ada reward</span></div>
    <p class="line-set-note">Set 1 mengikuti contoh Anda. Set 2–30 adalah variasi playtest buatan untuk struktur tiga lokasi ala Emblems; efek kartu dan nilai di sini tetap bisa Anda ubah lewat playtest.</p>`;
}

function randomizeLineSet() {
  const next = lineSets.length > 1 ? (activeLineSet + 1 + Math.floor(Math.random() * (lineSets.length - 1))) % lineSets.length : 0;
  activeLineSet = next;
  renderLineSet();
  showToast(`${lineSets[activeLineSet].label} dipilih secara acak.`);
}

async function copyLineSet() {
  const playerCount = Number(document.querySelector('#linePlayers').value) || 4;
  const text = lineSetText(lineSets[activeLineSet], playerCount);
  try {
    await navigator.clipboard.writeText(text);
    showToast('Layout Line disalin.');
  } catch {
    const helper = document.createElement('textarea');
    helper.value = text;
    helper.setAttribute('readonly', '');
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    document.body.appendChild(helper);
    helper.select();
    document.execCommand('copy');
    helper.remove();
    showToast('Layout Line disalin.');
  }
}

const lineSetSelect = document.querySelector('#lineSetSelect');
const linePlayers = document.querySelector('#linePlayers');
if (lineSetSelect && linePlayers) {
  lineSetSelect.innerHTML = lineSets.map(set => `<option value="${set.id}">${set.label}</option>`).join('');
  lineSetSelect.addEventListener('change', () => {
    activeLineSet = Math.max(0, Number(lineSetSelect.value) - 1);
    renderLineSet();
  });
  linePlayers.addEventListener('change', renderLineSet);
  document.querySelector('#randomLineSet').addEventListener('click', randomizeLineSet);
  document.querySelector('#copyLineSet').addEventListener('click', copyLineSet);
  renderLineSet();
}

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
        <span class="history-meta">${resultLabel} · ${match.keyCard ? escapeHTML(match.keyCard) : '—'} · ${match.duration}m</span>
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
    keyCard: document.querySelector('#matchKeyCard').value,
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
  cards = DEFAULT_CARDS.map(card => normalizeCard(card, card));
  learned = new Set(); matches = [];
  refreshRankOptions();
  Object.entries(comparisonDefaults).forEach(([id, fallback]) => { document.querySelector(`#${id}`).value = fallback; });
  activeLineSet = 0;
  if (lineSetSelect) lineSetSelect.value = '1';
  if (linePlayers) linePlayers.value = '4';
  applyTheme('light'); renderCards(); renderRuleTable(); renderLineSet(); renderMatches(); updateMastery(); updateLineChecker(); showToast('Seluruh data lokal telah direset.');
});

// Initial state
const savedTheme = localStorage.getItem(STORAGE.theme) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(savedTheme);
renderCards();
renderRuleTable();
updateMastery();
updateLineChecker();
renderMatches();
const initialPage = ['special','rules','tools','line-random'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'special';
navigate(initialPage);
