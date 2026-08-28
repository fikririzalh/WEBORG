/* Fishy Indo — engine sengaja kecil. Edit konten di cards.js, bukan di sini. */
const $ = (sel) => document.querySelector(sel);
const cardEl = $('#card');
const frontQuestion = $('#frontQuestion');
const backQuestion = $('#backQuestion');
const answerEl = $('#answer');
const factEl = $('#fact');
const sourceLink = $('#sourceLink');
const counterEl = $('#counter');
const categoryEl = $('#category');
const backId = $('#backId');
const flipBtn = $('#flipBtn');
const nextBtn = $('#nextBtn');
const shuffleBtn = $('#shuffleBtn');
const themeBtn = $('#themeBtn');
const soundBtn = $('#soundBtn');
const toastEl = $('#toast');

const state = {
  order: [],
  cursor: 0,
  flipped: false,
  sound: localStorage.getItem('fishy-sound') !== 'off',
  theme: localStorage.getItem('fishy-theme') || 'light'
};

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function currentCard() {
  return FISHY_CARDS[state.order[state.cursor]];
}

function render() {
  const c = currentCard();
  state.flipped = false;
  cardEl.classList.remove('flipped');
  frontQuestion.textContent = c.question;
  backQuestion.textContent = c.question;
  answerEl.textContent = c.answer;
  factEl.textContent = c.fact;
  sourceLink.href = c.sourceUrl;
  sourceLink.textContent = `↗ ${c.source}`;
  counterEl.textContent = `${c.id} • ${state.cursor + 1} / ${FISHY_CARDS.length}`;
  categoryEl.textContent = c.category;
  backId.textContent = c.id;
  flipBtn.textContent = '🔄 BALIK KARTU';
}

function newDeck(showToast = true) {
  state.order = shuffle(FISHY_CARDS.map((_, i) => i));
  state.cursor = 0;
  render();
  if (showToast) toast('Deck dikocok. Tidak mengulang sampai habis. 🐟');
}

function flip() {
  state.flipped = !state.flipped;
  cardEl.classList.toggle('flipped', state.flipped);
  flipBtn.textContent = state.flipped ? '↩️ LIHAT PERTANYAAN' : '🔄 BALIK KARTU';
  beep(state.flipped ? 620 : 420, .07);
}

function next() {
  if (state.cursor >= state.order.length - 1) {
    newDeck(false);
    toast('100 kartu habis — deck otomatis dikocok ulang. 🔀');
    return;
  }
  state.cursor += 1;
  render();
  beep(330, .045);
}

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  themeBtn.textContent = state.theme === 'dark' ? '☀️' : '🌙';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', state.theme === 'dark' ? '#071923' : '#effcff');
}

function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  localStorage.setItem('fishy-theme', state.theme);
  applyTheme();
}

function toggleSound() {
  state.sound = !state.sound;
  localStorage.setItem('fishy-sound', state.sound ? 'on' : 'off');
  soundBtn.textContent = state.sound ? '🔊' : '🔇';
  if (state.sound) beep(700, .06);
}

let audioCtx;
function beep(freq = 440, duration = .06) {
  if (!state.sound) return;
  try {
    audioCtx ??= new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(.045, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, audioCtx.currentTime + duration);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (_) {}
}

let toastTimer;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1800);
}

flipBtn.addEventListener('click', flip);
cardEl.addEventListener('click', flip);
sourceLink.addEventListener('click', (e) => e.stopPropagation());
nextBtn.addEventListener('click', next);
shuffleBtn.addEventListener('click', () => newDeck(true));
themeBtn.addEventListener('click', toggleTheme);
soundBtn.addEventListener('click', toggleSound);

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') { e.preventDefault(); flip(); }
  if (e.key === 'ArrowRight') next();
});

applyTheme();
soundBtn.textContent = state.sound ? '🔊' : '🔇';
newDeck(false);
