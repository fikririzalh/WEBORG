"use strict";

const CARD_DATA = [
  {
    id: "CC-001",
    name: "Metro Courier",
    rarity: "common",
    type: "URBAN",
    symbol: "➤",
    description: "Selalu tiba satu langkah lebih cepat.",
  },
  {
    id: "CC-002",
    name: "Pocket Botanist",
    rarity: "common",
    type: "NATURE",
    symbol: "❋",
    description: "Menumbuhkan ide kecil setiap hari.",
  },
  {
    id: "CC-003",
    name: "Night Librarian",
    rarity: "common",
    type: "ARCANE",
    symbol: "⌘",
    description: "Menjaga cerita yang belum selesai.",
  },
  {
    id: "CC-004",
    name: "Signal Scout",
    rarity: "common",
    type: "TECH",
    symbol: "⌁",
    description: "Menemukan jalur ketika peta menghilang.",
  },
  {
    id: "CC-005",
    name: "Cloud Mechanic",
    rarity: "common",
    type: "SKY",
    symbol: "☁",
    description: "Memperbaiki cuaca dengan kunci kecil.",
  },
  {
    id: "CC-006",
    name: "Tiny Alchemist",
    rarity: "common",
    type: "ARCANE",
    symbol: "⚗",
    description: "Mencampur kebetulan menjadi kejutan.",
  },
  {
    id: "CC-007",
    name: "Harbor Listener",
    rarity: "common",
    type: "OCEAN",
    symbol: "≈",
    description: "Mendengar pesan dari ombak paling sunyi.",
  },
  {
    id: "CC-008",
    name: "Lantern Runner",
    rarity: "common",
    type: "EMBER",
    symbol: "♨",
    description: "Membawa cahaya melewati gang sempit.",
  },

  {
    id: "CC-009",
    name: "Neon Cartographer",
    rarity: "rare",
    type: "URBAN",
    symbol: "⌖",
    description: "Menggambar kota dari garis-garis cahaya.",
  },
  {
    id: "CC-010",
    name: "Tide Whisperer",
    rarity: "rare",
    type: "OCEAN",
    symbol: "◒",
    description: "Membujuk arus untuk mengubah arah.",
  },
  {
    id: "CC-011",
    name: "Prism Ranger",
    rarity: "rare",
    type: "LIGHT",
    symbol: "◇",
    description: "Membelah satu peluang menjadi tujuh.",
  },
  {
    id: "CC-012",
    name: "Clockwork Fox",
    rarity: "rare",
    type: "TECH",
    symbol: "⧖",
    description: "Melompat di antara detik yang terlewat.",
  },
  {
    id: "CC-013",
    name: "Moss Guardian",
    rarity: "rare",
    type: "NATURE",
    symbol: "♧",
    description: "Benteng lembut dari hutan yang sabar.",
  },
  {
    id: "CC-014",
    name: "Comet Chef",
    rarity: "rare",
    type: "COSMIC",
    symbol: "☄",
    description: "Memasak keberanian dengan api bintang.",
  },

  {
    id: "CC-015",
    name: "Velvet Oracle",
    rarity: "epic",
    type: "ARCANE",
    symbol: "◈",
    description: "Membaca masa depan pada lipatan bayangan.",
  },
  {
    id: "CC-016",
    name: "Solar Duelist",
    rarity: "epic",
    type: "LIGHT",
    symbol: "☀",
    description: "Satu tebasan seterang pagi pertama.",
  },
  {
    id: "CC-017",
    name: "Abyss Violinist",
    rarity: "epic",
    type: "OCEAN",
    symbol: "𝄞",
    description: "Nada terakhirnya membuat laut terdiam.",
  },
  {
    id: "CC-018",
    name: "Dream Architect",
    rarity: "epic",
    type: "MIND",
    symbol: "⌂",
    description: "Membangun pintu di dalam lamunan.",
  },
  {
    id: "CC-019",
    name: "Thunder Nomad",
    rarity: "epic",
    type: "STORM",
    symbol: "ϟ",
    description: "Berjalan mengikuti gema badai.",
  },

  {
    id: "CC-020",
    name: "Ember Empress",
    rarity: "legendary",
    type: "EMBER",
    symbol: "♕",
    description: "Mahkota apinya tidak pernah padam.",
  },
  {
    id: "CC-021",
    name: "Chrono Warden",
    rarity: "legendary",
    type: "TIME",
    symbol: "∞",
    description: "Menjaga satu detik yang menentukan segalanya.",
  },
  {
    id: "CC-022",
    name: "Aurora Leviathan",
    rarity: "legendary",
    type: "COSMIC",
    symbol: "〰",
    description: "Melayang di antara laut dan langit utara.",
  },
  {
    id: "CC-023",
    name: "Garden of Zero",
    rarity: "legendary",
    type: "NATURE",
    symbol: "✿",
    description: "Tempat segala akhir tumbuh kembali.",
  },

  {
    id: "CC-024",
    name: "Eclipse Paradox",
    rarity: "mythic",
    type: "VOID",
    symbol: "◐",
    description: "Ada dan tiada pada saat yang sama.",
  },
  {
    id: "CC-025",
    name: "Astra Sovereign",
    rarity: "mythic",
    type: "CELESTIAL",
    symbol: "♛",
    description: "Mengubah lintasan nasib menjadi peluang baru.",
  },
  {
    id: "CC-026",
    name: "Morning Star",
    rarity: "epic",
    type: "NATURE",
    symbol: "🌟",
    description: "Memanggil bintang astral ke medan.",
  },
  {
  id: "CC-027",
  name: "Lucky Clover",
  rarity: "common",
  type: "FORTUNE",
  symbol: "☘\uFE0E",
  description: "Membawa keberuntungan kecil pada setiap perjalanan.",
},
{
  id: "CC-028",
  name: "Harbor Captain",
  rarity: "common",
  type: "OCEAN",
  symbol: "⚓\uFE0E",
  description: "Menjaga kapalnya tetap teguh di tengah arus.",
},
{
  id: "CC-029",
  name: "Gear Apprentice",
  rarity: "common",
  type: "TECH",
  symbol: "⚙\uFE0E",
  description: "Menyusun mesin sederhana dari benda yang terlupakan.",
},
{
  id: "CC-030",
  name: "Midnight Rider",
  rarity: "common",
  type: "SHADOW",
  symbol: "♞",
  description: "Bergerak dalam pola yang sulit diperkirakan.",
},
{
  id: "CC-031",
  name: "Rain Merchant",
  rarity: "common",
  type: "WEATHER",
  symbol: "☂\uFE0E",
  description: "Menjual perlindungan ketika awan mulai berkumpul.",
},

{
  id: "CC-032",
  name: "Crescent Seer",
  rarity: "rare",
  type: "LUNAR",
  symbol: "☾",
  description: "Membaca pertanda pada lengkungan bulan muda.",
},
{
  id: "CC-033",
  name: "Silver Spark",
  rarity: "rare",
  type: "LIGHT",
  symbol: "✧",
  description: "Kilau kecilnya mampu membuka jalan tersembunyi.",
},
{
  id: "CC-034",
  name: "Sun Disc Keeper",
  rarity: "rare",
  type: "SOLAR",
  symbol: "⊙",
  description: "Menjaga inti cahaya dari pemburu kekuatan.",
},
{
  id: "CC-035",
  name: "Castle Strategist",
  rarity: "rare",
  type: "KINGDOM",
  symbol: "♜",
  description: "Menguasai wilayah melalui langkah yang terukur.",
},

{
  id: "CC-036",
  name: "Twinblade Wanderer",
  rarity: "epic",
  type: "COMBAT",
  symbol: "⚔\uFE0E",
  description: "Dua bilahnya bergerak sebelum lawan melihat serangan.",
},
{
  id: "CC-037",
  name: "Balance Monk",
  rarity: "epic",
  type: "SPIRIT",
  symbol: "☯\uFE0E",
  description: "Menemukan kekuatan pada keseimbangan dua kutub.",
},
{
  id: "CC-038",
  name: "Spade Dominion",
  rarity: "epic",
  type: "ROYAL",
  symbol: "♠",
  description: "Mengubah permainan biasa menjadi perebutan kekuasaan.",
},

{
  id: "CC-039",
  name: "Verdant Chancellor",
  rarity: "legendary",
  type: "NATURE",
  symbol: "♣",
  description: "Memerintah kerajaan hijau yang terus berkembang.",
},
{
  id: "CC-040",
  name: "Diamond Conqueror",
  rarity: "legendary",
  type: "FORTUNE",
  symbol: "♦",
  description: "Mengubah setiap aset menjadi jalan menuju kejayaan.",
},

{
  id: "CC-041",
  name: "Fleur de Eternity",
  rarity: "mythic",
  type: "CELESTIAL",
  symbol: "⚜\uFE0E",
  description: "Lambang abadi yang memilih pemilik takdir tertinggi.",
},
];

const RARITIES = {
  common: { label: "COMMON", rate: 52, dust: 5, stars: 1, rank: 1 },
  rare: { label: "RARE", rate: 28, dust: 12, stars: 2, rank: 2 },
  epic: { label: "EPIC", rate: 14, dust: 30, stars: 3, rank: 3 },
  legendary: { label: "LEGENDARY", rate: 5, dust: 80, stars: 4, rank: 4 },
  mythic: { label: "MYTHIC", rate: 1, dust: 200, stars: 5, rank: 5 },
};

const SAVE_KEY = "cardCapsuleSaveV1";
const DEFAULT_STATE = {
  version: 1,
  crystals: 9999,
  stardust: 0,
  totalPulls: 0,
  pityLegendary: 0,
  pityEpic: 0,
  collection: {},
  history: [],
  soundEnabled: true,
  calmMode: false,
};

const state = loadState();
let revealQueue = [];
let revealIndex = 0;
let currentPullResults = [];
let audioContext = null;
let isPulling = false;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const numberFormat = new Intl.NumberFormat("id-ID");

const elements = {
  crystalCount: $("#crystalCount"),
  stardustCount: $("#stardustCount"),
  totalPulls: $("#totalPulls"),
  uniqueCards: $("#uniqueCards"),
  cardTotal: $("#cardTotal"),
  highRarityCount: $("#highRarityCount"),
  pityValue: $("#pityValue"),
  pityBar: $("#pityBar"),
  epicPityValue: $("#epicPityValue"),
  epicPityBar: $("#epicPityBar"),
  historyList: $("#historyList"),
  collectionGrid: $("#collectionGrid"),
  emptyCollection: $("#emptyCollection"),
  searchInput: $("#searchInput"),
  rarityFilter: $("#rarityFilter"),
  ownershipFilter: $("#ownershipFilter"),
  revealOverlay: $("#revealOverlay"),
  revealStage: $("#revealStage"),
  revealCounter: $("#revealCounter"),
  revealNextButton: $("#revealNextButton"),
  summaryOverlay: $("#summaryOverlay"),
  summaryGrid: $("#summaryGrid"),
  settingsOverlay: $("#settingsOverlay"),
  toastContainer: $("#toastContainer"),
};

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(DEFAULT_STATE),
      ...parsed,
      collection:
        parsed.collection && typeof parsed.collection === "object"
          ? parsed.collection
          : {},
      history: Array.isArray(parsed.history) ? parsed.history.slice(0, 30) : [],
    };
  } catch (error) {
    console.warn("Save tidak dapat dibaca:", error);
    return structuredClone(DEFAULT_STATE);
  }
}

function saveState() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Save tidak dapat ditulis:", error);
    toast("Browser menolak penyimpanan lokal.");
  }
}

function secureRandom() {
  if (window.crypto?.getRandomValues) {
    const data = new Uint32Array(1);
    window.crypto.getRandomValues(data);
    return data[0] / 4294967296;
  }
  return Math.random();
}

function randomFrom(items) {
  return items[Math.floor(secureRandom() * items.length)];
}

function pickRarity(options = {}) {
  const { forceEpicPlus = false, forceLegendaryPlus = false } = options;

  if (forceLegendaryPlus || state.pityLegendary >= 49) {
    return secureRandom() <
      RARITIES.mythic.rate / (RARITIES.mythic.rate + RARITIES.legendary.rate)
      ? "mythic"
      : "legendary";
  }
  if (forceEpicPlus || state.pityEpic >= 9) {
    const roll =
      secureRandom() *
      (RARITIES.epic.rate + RARITIES.legendary.rate + RARITIES.mythic.rate);
    if (roll < RARITIES.mythic.rate) return "mythic";
    if (roll < RARITIES.mythic.rate + RARITIES.legendary.rate)
      return "legendary";
    return "epic";
  }

  const roll = secureRandom() * 100;
  let cumulative = 0;
  for (const rarity of ["mythic", "legendary", "epic", "rare", "common"]) {
    cumulative += RARITIES[rarity].rate;
    if (roll < cumulative) return rarity;
  }
  return "common";
}

function performOnePull(options = {}) {
  const rarity = pickRarity(options);
  const pool = CARD_DATA.filter((card) => card.rarity === rarity);
  const card = randomFrom(pool);
  const existing = state.collection[card.id];
  const duplicate = Boolean(existing);
  const dust = duplicate ? RARITIES[rarity].dust : 0;

  if (duplicate) {
    existing.copies = (existing.copies || 1) + 1;
    state.stardust += dust;
  } else {
    state.collection[card.id] = { copies: 1, level: 1, obtainedAt: Date.now() };
  }

  state.totalPulls += 1;
  if (RARITIES[rarity].rank >= RARITIES.legendary.rank) state.pityLegendary = 0;
  else state.pityLegendary += 1;

  if (RARITIES[rarity].rank >= RARITIES.epic.rank) state.pityEpic = 0;
  else state.pityEpic += 1;

  const result = { ...card, duplicate, dust, pulledAt: Date.now() };
  state.history.unshift({ id: card.id, pulledAt: result.pulledAt, duplicate });
  state.history = state.history.slice(0, 30);
  return result;
}

function pull(count) {
  if (isPulling) return;
  const cost = count === 10 ? 900 : 100;
  if (state.crystals < cost) {
    toast("Kristal tidak cukup. Gunakan tombol +5.000.");
    playSound("error");
    return;
  }

  isPulling = true;
  state.crystals -= cost;
  const results = [];

  for (let index = 0; index < count; index += 1) {
    let forceEpicPlus = false;
    if (count === 10 && index === count - 1) {
      const alreadyHasEpic = results.some(
        (result) => RARITIES[result.rarity].rank >= RARITIES.epic.rank,
      );
      forceEpicPlus = !alreadyHasEpic;
    }
    results.push(performOnePull({ forceEpicPlus }));
  }

  currentPullResults = results;
  saveState();
  renderAll();
  startReveal(results);
}

function startReveal(results) {
  revealQueue = results;
  revealIndex = 0;
  elements.revealOverlay.hidden = false;
  document.body.style.overflow = "hidden";
  showRevealCard();
}

function showRevealCard() {
  const result = revealQueue[revealIndex];
  if (!result) return showSummary();

  elements.revealCounter.textContent = `HASIL ${revealIndex + 1}/${revealQueue.length}`;
  elements.revealNextButton.textContent =
    revealIndex === revealQueue.length - 1 ? "Lihat ringkasan" : "Lanjut";
  elements.revealStage.style.setProperty(
    "--reveal-rarity",
    `var(--${result.rarity})`,
  );
  elements.revealStage.innerHTML = "";

  const wrap = document.createElement("div");
  wrap.className = `reveal-card-wrap${result.duplicate ? " is-duplicate" : ""}`;
  if (result.duplicate)
    wrap.dataset.duplicate = `DUPLIKAT · +${result.dust} DEBU`;
  wrap.append(createCardElement(result));
  elements.revealStage.append(wrap);

  playSound(result.rarity);
}

function nextReveal() {
  revealIndex += 1;
  if (revealIndex >= revealQueue.length) showSummary();
  else showRevealCard();
}

function skipReveal() {
  showSummary();
}

function showSummary() {
  elements.revealOverlay.hidden = true;
  elements.summaryGrid.innerHTML = "";

  [...currentPullResults]
    .sort((a, b) => RARITIES[b.rarity].rank - RARITIES[a.rarity].rank)
    .forEach((result) => {
      const item = document.createElement("div");
      item.className = `summary-item rarity-${result.rarity}`;
      item.append(createCardElement(result));
      const badge = document.createElement("span");
      badge.className = "summary-badge";
      badge.textContent = result.duplicate ? `+${result.dust} debu` : "BARU";
      item.append(badge);
      elements.summaryGrid.append(item);
    });

  elements.summaryOverlay.hidden = false;
  playSound("summary");
}

function closeSummary() {
  elements.summaryOverlay.hidden = true;
  document.body.style.overflow = "";
  isPulling = false;
}

function createCardElement(card) {
  const fragment = $("#cardTemplate").content.cloneNode(true);
  const shell = fragment.querySelector(".card-shell");
  shell.classList.add(`rarity-${card.rarity}`);
  fragment.querySelector(".template-rarity").textContent =
    RARITIES[card.rarity].label;
  fragment.querySelector(".template-stars").textContent = "✦".repeat(
    RARITIES[card.rarity].stars,
  );
  fragment.querySelector(".template-type").textContent = card.type;
  fragment.querySelector(".template-name").textContent = card.name;
  fragment.querySelector(".template-description").textContent =
    card.description;
  fragment.querySelector(".art-symbol").textContent = card.symbol;
  fragment.querySelector(".card-number").textContent = card.id;
  return fragment;
}

function renderStats() {
  const ownedIds = Object.keys(state.collection);
  const highRarity = ownedIds.filter((id) => {
    const card = CARD_DATA.find((item) => item.id === id);
    return card && RARITIES[card.rarity].rank >= RARITIES.legendary.rank;
  }).length;

  elements.crystalCount.textContent = numberFormat.format(state.crystals);
  elements.stardustCount.textContent = numberFormat.format(state.stardust);
  elements.totalPulls.textContent = numberFormat.format(state.totalPulls);
  elements.uniqueCards.textContent = ownedIds.length;
  elements.cardTotal.textContent = CARD_DATA.length;
  elements.highRarityCount.textContent = highRarity;
  elements.pityValue.textContent = state.pityLegendary;
  elements.epicPityValue.textContent = state.pityEpic;
  elements.pityBar.style.width = `${Math.min(100, (state.pityLegendary / 50) * 100)}%`;
  elements.epicPityBar.style.width = `${Math.min(100, (state.pityEpic / 10) * 100)}%`;
  elements.pityBar.parentElement.setAttribute(
    "aria-valuenow",
    state.pityLegendary,
  );
  elements.epicPityBar.parentElement.setAttribute(
    "aria-valuenow",
    state.pityEpic,
  );
}

function renderHistory() {
  elements.historyList.innerHTML = "";
  if (!state.history.length) {
    elements.historyList.innerHTML =
      '<div class="history-empty">Belum ada hasil.<br>Pull pertama akan muncul di sini.</div>';
    return;
  }

  state.history.forEach((entry) => {
    const card = CARD_DATA.find((item) => item.id === entry.id);
    if (!card) return;
    const item = document.createElement("article");
    item.className = `history-item rarity-${card.rarity}`;
    const time = new Date(entry.pulledAt || Date.now());
    item.innerHTML = `
      <div class="history-symbol">${escapeHTML(card.symbol)}</div>
      <div class="history-meta"><strong>${escapeHTML(card.name)}</strong><small>${RARITIES[card.rarity].label}${entry.duplicate ? " · DUPLIKAT" : " · BARU"}</small></div>
      <time datetime="${time.toISOString()}">${time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</time>
    `;
    elements.historyList.append(item);
  });
}

function renderCollection() {
  const query = elements.searchInput.value.trim().toLowerCase();
  const rarity = elements.rarityFilter.value;
  const ownership = elements.ownershipFilter.value;

  const filtered = [...CARD_DATA]
    .sort(
      (a, b) =>
        RARITIES[b.rarity].rank - RARITIES[a.rarity].rank ||
        a.id.localeCompare(b.id),
    )
    .filter(
      (card) =>
        !query ||
        card.name.toLowerCase().includes(query) ||
        card.type.toLowerCase().includes(query),
    )
    .filter((card) => rarity === "all" || card.rarity === rarity)
    .filter((card) => {
      const owned = Boolean(state.collection[card.id]);
      return (
        ownership === "all" ||
        (ownership === "owned" && owned) ||
        (ownership === "missing" && !owned)
      );
    });

  elements.collectionGrid.innerHTML = "";
  filtered.forEach((card) => {
    const record = state.collection[card.id];
    const owned = Boolean(record);
    const item = document.createElement("article");
    item.className = `collection-item rarity-${card.rarity}${owned ? "" : " is-locked"}`;
    item.append(createCardElement(card));

    if (!owned) {
      const lock = document.createElement("div");
      lock.className = "lock-layer";
      lock.textContent = "?";
      item.append(lock);
    }

    const footer = document.createElement("div");
    footer.className = "collection-footer";
    const cost = owned ? upgradeCost(record.level || 1) : 0;
    footer.innerHTML = `
      <div class="collection-level">
        <span>${owned ? `SALINAN ${record.copies || 1}` : "BELUM DIMILIKI"}</span>
        <strong>${owned ? `Level ${record.level || 1}` : "Terkunci"}</strong>
      </div>
    `;
    if (owned) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "upgrade-button";
      button.disabled = record.level >= 10 || state.stardust < cost;
      button.textContent = record.level >= 10 ? "MAX" : `Naikkan · ${cost}`;
      button.addEventListener("click", () => upgradeCard(card.id));
      footer.append(button);
    }
    item.append(footer);
    elements.collectionGrid.append(item);
  });

  elements.emptyCollection.hidden = filtered.length > 0;
}

function upgradeCost(level) {
  return 20 + (level - 1) * 15;
}

function upgradeCard(cardId) {
  const record = state.collection[cardId];
  const card = CARD_DATA.find((item) => item.id === cardId);
  if (!record || !card || record.level >= 10) return;
  const cost = upgradeCost(record.level || 1);
  if (state.stardust < cost) {
    toast("Debu Bintang belum cukup.");
    return;
  }
  state.stardust -= cost;
  record.level = (record.level || 1) + 1;
  saveState();
  renderAll();
  playSound("upgrade");
  toast(`${card.name} naik ke Level ${record.level}.`);
}

function renderSettings() {
  document.body.classList.toggle("calm-mode", state.calmMode);
  $("#soundToggle").textContent = state.soundEnabled ? "🔊" : "🔇";
  $("#soundToggle").setAttribute("aria-pressed", String(state.soundEnabled));
  $("#motionToggle").setAttribute("aria-pressed", String(state.calmMode));
  $("#settingsSoundToggle").setAttribute(
    "aria-checked",
    String(state.soundEnabled),
  );
  $("#settingsMotionToggle").setAttribute(
    "aria-checked",
    String(state.calmMode),
  );
}

function renderAll() {
  renderStats();
  renderHistory();
  renderCollection();
  renderSettings();
}

function switchView(viewName) {
  $$(".view").forEach((view) =>
    view.classList.toggle("is-active", view.id === `${viewName}View`),
  );
  $$(".tab").forEach((tab) =>
    tab.classList.toggle("is-active", tab.dataset.view === viewName),
  );
  if (viewName === "collection") renderCollection();
  window.scrollTo({ top: 0, behavior: state.calmMode ? "auto" : "smooth" });
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  saveState();
  renderSettings();
  if (state.soundEnabled) playSound("click");
}

function toggleMotion() {
  state.calmMode = !state.calmMode;
  saveState();
  renderSettings();
  toast(state.calmMode ? "Mode tenang aktif." : "Animasi penuh aktif.");
}

function refill() {
  state.crystals += 5000;
  saveState();
  renderStats();
  playSound("refill");
  toast("5.000 kristal ditambahkan.");
}

function clearHistory() {
  state.history = [];
  saveState();
  renderHistory();
  toast("Riwayat pull dibersihkan.");
}

function resetSave() {
  const confirmed = window.confirm(
    "Hapus seluruh progres Card Capsule dari browser ini?",
  );
  if (!confirmed) return;
  Object.keys(state).forEach((key) => delete state[key]);
  Object.assign(state, structuredClone(DEFAULT_STATE));
  saveState();
  renderAll();
  elements.settingsOverlay.hidden = true;
  toast("Save telah direset.");
}

function exportSave() {
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `card-capsule-save-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
  toast("Save diekspor sebagai JSON.");
}

async function importSave(file) {
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    if (!parsed || typeof parsed !== "object" || !parsed.collection)
      throw new Error("Format tidak valid");
    Object.keys(state).forEach((key) => delete state[key]);
    Object.assign(state, structuredClone(DEFAULT_STATE), parsed);
    state.history = Array.isArray(state.history)
      ? state.history.slice(0, 30)
      : [];
    saveState();
    renderAll();
    toast("Save berhasil diimpor.");
  } catch (error) {
    console.warn(error);
    toast("File save tidak valid.");
  } finally {
    $("#importInput").value = "";
  }
}

function toast(message) {
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = message;
  elements.toastContainer.append(node);
  window.setTimeout(() => node.remove(), 3200);
}

function ensureAudioContext() {
  if (!audioContext) {
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return null;
    audioContext = new Context();
  }
  if (audioContext.state === "suspended") audioContext.resume();
  return audioContext;
}

function tone(frequency, start, duration, gainValue = 0.04, type = "sine") {
  const context = ensureAudioContext();
  if (!context) return;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, context.currentTime + start);
  gain.gain.setValueAtTime(0.0001, context.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(
    gainValue,
    context.currentTime + start + 0.015,
  );
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    context.currentTime + start + duration,
  );
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(context.currentTime + start);
  oscillator.stop(context.currentTime + start + duration + 0.02);
}

function playSound(kind) {
  if (!state.soundEnabled) return;
  const patterns = {
    click: [[440, 0, 0.08, 0.025]],
    error: [
      [180, 0, 0.13, 0.04, "square"],
      [130, 0.1, 0.15, 0.03, "square"],
    ],
    common: [
      [330, 0, 0.15, 0.025],
      [440, 0.08, 0.18, 0.025],
    ],
    rare: [
      [392, 0, 0.15, 0.03],
      [523, 0.08, 0.2, 0.035],
      [659, 0.17, 0.22, 0.025],
    ],
    epic: [
      [330, 0, 0.2, 0.035],
      [494, 0.08, 0.24, 0.04],
      [659, 0.17, 0.28, 0.04],
      [784, 0.26, 0.34, 0.03],
    ],
    legendary: [
      [262, 0, 0.25, 0.04],
      [392, 0.08, 0.28, 0.04],
      [523, 0.16, 0.32, 0.045],
      [659, 0.26, 0.4, 0.045],
      [1047, 0.38, 0.5, 0.03],
    ],
    mythic: [
      [220, 0, 0.35, 0.04],
      [330, 0.06, 0.4, 0.04],
      [440, 0.12, 0.45, 0.045],
      [659, 0.22, 0.52, 0.05],
      [880, 0.34, 0.62, 0.04],
      [1320, 0.48, 0.7, 0.025],
    ],
    summary: [
      [523, 0, 0.12, 0.025],
      [659, 0.07, 0.16, 0.025],
      [784, 0.14, 0.2, 0.025],
    ],
    refill: [
      [392, 0, 0.12, 0.03],
      [523, 0.07, 0.15, 0.03],
      [784, 0.14, 0.22, 0.03],
    ],
    upgrade: [
      [440, 0, 0.15, 0.03],
      [554, 0.08, 0.18, 0.035],
      [659, 0.16, 0.22, 0.035],
      [880, 0.25, 0.3, 0.03],
    ],
  };
  (patterns[kind] || patterns.click).forEach((args) => tone(...args));
}

function escapeHTML(value) {
  return String(value).replace(
    /[&<>'"]/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        char
      ],
  );
}

function bindEvents() {
  $$(".tab").forEach((tab) =>
    tab.addEventListener("click", () => switchView(tab.dataset.view)),
  );
  $("#singlePullButton").addEventListener("click", () => pull(1));
  $("#tenPullButton").addEventListener("click", () => pull(10));
  $("#refillButton").addEventListener("click", refill);
  $("#soundToggle").addEventListener("click", toggleSound);
  $("#motionToggle").addEventListener("click", toggleMotion);
  $("#clearHistoryButton").addEventListener("click", clearHistory);
  $("#exportButton").addEventListener("click", exportSave);
  $("#importInput").addEventListener("change", (event) =>
    importSave(event.target.files[0]),
  );
  elements.searchInput.addEventListener("input", renderCollection);
  elements.rarityFilter.addEventListener("change", renderCollection);
  elements.ownershipFilter.addEventListener("change", renderCollection);
  elements.revealNextButton.addEventListener("click", nextReveal);
  $("#skipRevealButton").addEventListener("click", skipReveal);
  $("#summaryDoneButton").addEventListener("click", closeSummary);
  $("#closeSummaryButton").addEventListener("click", closeSummary);
  $("#settingsButton").addEventListener("click", () => {
    elements.settingsOverlay.hidden = false;
  });
  $("#closeSettingsButton").addEventListener("click", () => {
    elements.settingsOverlay.hidden = true;
  });
  $("#settingsSoundToggle").addEventListener("click", toggleSound);
  $("#settingsMotionToggle").addEventListener("click", toggleMotion);
  $("#resetButton").addEventListener("click", resetSave);
  elements.summaryOverlay.addEventListener("click", (event) => {
    if (event.target === elements.summaryOverlay) closeSummary();
  });
  elements.settingsOverlay.addEventListener("click", (event) => {
    if (event.target === elements.settingsOverlay)
      elements.settingsOverlay.hidden = true;
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!elements.settingsOverlay.hidden)
        elements.settingsOverlay.hidden = true;
      else if (!elements.summaryOverlay.hidden) closeSummary();
    }
  });
}

bindEvents();
renderAll();
