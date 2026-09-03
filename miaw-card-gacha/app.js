(() => {
  "use strict";

  const c = (id, name, rarity, role, element, accent, sigil, skill, skillDesc, passive, passiveDesc, fortune, control, power, defense, price = 0) => ({
    id, name, rarity, role, element, accent, sigil, skill, skillDesc, passive, passiveDesc,
    stats: { fortune, control, power, defense }, price
  });

  const CHARACTERS = [
    c("arka", "Arka Voltaris", "SSR+", "Route Breaker", "Petir", "#55e7ff", "ϟ", "Thunder Reroute", "Sesudah melempar dadu kembar, 55% peluang memindahkan lawan terdekat mundur 3 petak.", "Overcharge", "Kontrol dadu meningkat 18% saat diamond perjalanan berada di bawah 30%.", 92, 97, 96, 82, 18),
    c("veyra", "Veyra Noctis", "SSR+", "Toll Empress", "Bayangan", "#d86cff", "✦", "Midnight Claim", "Saat tiba di kota kosong, 48% peluang langsung membangun landmark tanpa biaya tahap awal.", "Velvet Tax", "Biaya sewa landmark meningkat 22% untuk lawan yang memiliki kartu lebih banyak.", 96, 89, 91, 86, 18),
    c("orion", "Orion Aster", "SSR+", "Dice Oracle", "Bintang", "#ffd166", "✧", "Astral Forecast", "Pilih salah satu dari dua hasil dadu yang diprediksi, aktif satu kali setiap 4 giliran.", "Lucky Orbit", "Peluang dadu kembar dan bonus koin meningkat 15%.", 99, 94, 84, 80, 22),
    c("mirel", "Mirel Tidesong", "SSR+", "Landmark Guardian", "Pasang", "#4fa8ff", "≋", "Tidal Sanctuary", "Memberi perisai pada 2 landmark bernilai tertinggi dari pengambilalihan selama 3 giliran.", "Calm Current", "Mengurangi sewa yang dibayar sebesar 20% satu kali setiap putaran papan.", 88, 90, 82, 99, 20),
    c("kael", "Kael Ignivar", "SSR+", "Asset Raider", "Api", "#ff6b55", "△", "Crimson Acquisition", "Saat mendarat di kota lawan, 42% peluang mengambil alih dengan diskon 45%.", "Heat Dividend", "Setiap akuisisi memberi kembali 12% biaya sebagai koin perjalanan.", 86, 87, 99, 84, 20),
    c("seraph", "Seraph Lumen", "SSR+", "Crisis Reverser", "Cahaya", "#7fffd4", "◇", "Second Sunrise", "Sekali per pertandingan, membatalkan kebangkrutan dan kembali dengan 28% modal awal.", "Radiant Route", "Setelah melewati START, hapus satu efek negatif dan dapatkan bonus 14%.", 94, 91, 88, 97, 24),

    c("nyx", "Nyx Halcyon", "SSR", "Ambush Runner", "Bayangan", "#ba6cff", "◐", "Silent Detour", "37% peluang melewati satu kota berbahaya dan berhenti pada petak berikutnya.", "Night Fare", "Sewa yang dibayar berkurang 14% pada dua putaran pertama.", 82, 88, 85, 72),
    c("aeron", "Aeron Flux", "SSR", "Dice Controller", "Angin", "#72e0c2", "⌁", "Vector Six", "Meningkatkan peluang hasil dadu 6–8 sebesar 31% selama dua giliran.", "Tailwind", "Sesudah melewati lawan, peroleh bonus gerak satu petak dengan peluang 18%.", 84, 94, 78, 75),
    c("eira", "Eira Solenne", "SSR", "Economy Builder", "Kristal", "#78b9ff", "❖", "Crystal Reserve", "Mengunci 20% koin agar tidak dapat dicuri atau terkena biaya kejutan.", "Compound Shine", "Pendapatan kota satu warna meningkat 16%.", 90, 82, 76, 91),
    c("brann", "Brann Forge", "SSR", "Landmark Buster", "Baja", "#ff9d5c", "⬡", "Siege Stamp", "Menonaktifkan efek landmark target selama satu giliran dengan peluang 40%.", "Heavy Steps", "Kebal terhadap dorongan mundur pertama di setiap putaran.", 74, 81, 96, 90),
    c("lyra", "Lyra Quill", "SSR", "Card Tactician", "Arkana", "#ef76c5", "⌘", "Wild Archive", "Salin satu efek kartu kesempatan terakhir dengan efektivitas 80%.", "Fine Print", "Efek penalti kartu kesempatan berkurang 17%.", 92, 89, 80, 78),
    c("toren", "Toren Atlas", "SSR", "Zone Keeper", "Tanah", "#d4a15a", "▰", "Continental Lock", "Pilih satu blok warna; lawan membayar biaya tambahan 18% di blok itu selama 2 giliran.", "Foundation", "Biaya pembangunan tingkat akhir berkurang 15%.", 79, 83, 88, 94),
    c("selene", "Selene Prism", "SSR", "Warp Navigator", "Spektrum", "#ff7dc8", "⬢", "Prism Gate", "Saat mendapat dadu kembar, 35% peluang berpindah ke gerbang terdekat pilihanmu.", "Refraction", "Efek blokir rute memiliki peluang 25% untuk dipantulkan.", 91, 92, 81, 82),
    c("kairo", "Kairo Zenith", "SSR", "Comeback Ace", "Surya", "#ffc857", "☼", "Zenith Rush", "Jika berada di posisi terakhir, bergerak 2 petak tambahan setelah lemparan berikutnya.", "High Noon", "Sewa kota meningkat 18% saat hanya tersisa dua pemain.", 88, 85, 92, 84),

    c("nara", "Nara Circuit", "SR", "Quick Builder", "Listrik", "#4bd6e7", "⌁", "Rapid Permit", "Peluang 28% membangun satu tingkat tambahan secara gratis.", "Clean Grid", "Biaya listrik kota berkurang 10%.", 76, 82, 75, 69),
    c("jett", "Jett Meridian", "SR", "Straight Runner", "Angin", "#78dfbd", "➤", "Meridian Dash", "Sesudah melewati START, 24% peluang maju dua petak.", "Light Luggage", "Denda pulau berkurang satu giliran.", 72, 86, 78, 67),
    c("cora", "Cora Ember", "SR", "Rent Booster", "Api", "#ff8068", "✺", "Ember Lease", "Sewa kota terbaru meningkat 25% sampai giliran berikutnya.", "Warm Market", "Bonus penjualan aset meningkat 9%.", 78, 73, 84, 66),
    c("dane", "Dane Bastion", "SR", "Shield Broker", "Baja", "#aab6cc", "⬟", "Bastion Bond", "Memberi perlindungan pengambilalihan pada satu kota selama dua giliran.", "Iron Ledger", "Kerugian akibat biaya acak berkurang 11%.", 68, 72, 75, 89),
    c("iris", "Iris Bloom", "SR", "Bonus Harvester", "Flora", "#71db83", "✤", "Prosper Bloom", "Kota lengkap satu warna memberi bonus koin 16% saat dilewati.", "Seed Fund", "Mulai pertandingan dengan tambahan 7% modal.", 86, 75, 69, 73),
    c("rook", "Rook Cipher", "SR", "Trap Analyst", "Data", "#8ca7ff", "⌗", "Risk Scan", "Mendeteksi satu petak penalti di depan dan memberi peluang 30% untuk menghindar.", "Cold Logic", "Efek acak negatif berlangsung maksimal satu giliran.", 80, 85, 74, 76),
    c("mika", "Mika Cascade", "SR", "Fee Reducer", "Air", "#65bfff", "≋", "Cascade Coupon", "Mengurangi satu pembayaran sewa sebesar 24%.", "Flow State", "Kontrol dadu naik 8% setelah membayar sewa.", 83, 77, 70, 80),
    c("zeph", "Zeph Alloy", "SR", "Takeover Expert", "Logam", "#a8ced8", "⟡", "Alloy Offer", "Diskon pengambilalihan 22% untuk kota tingkat menengah.", "Hard Bargain", "Menjual aset menghasilkan tambahan 8%.", 73, 74, 87, 81),
    c("talia", "Talia Nova", "SR", "Chance Specialist", "Kosmik", "#b68cff", "✷", "Nova Draw", "Ulangi satu kartu kesempatan dengan peluang 26%.", "Stardust", "Hadiah kartu positif meningkat 12%.", 89, 81, 72, 68),
    c("voss", "Voss Granite", "SR", "Toll Tank", "Batu", "#c09b75", "⬣", "Granite Clause", "Menunda pembayaran sewa besar hingga melewati START berikutnya.", "Stone Wallet", "Batas pembayaran yang memicu kebangkrutan meningkat 10%.", 66, 70, 80, 92),

    c("asha", "Asha Ray", "R", "Starter Runner", "Cahaya", "#f2cb67", "•", "Bright Step", "Peluang 14% bergerak satu petak tambahan.", "Morning Coin", "Bonus START meningkat 4%.", 65, 63, 58, 54),
    c("bimo", "Bimo Gear", "R", "Budget Builder", "Mesin", "#aeb7c8", "⚙", "Spare Parts", "Biaya bangunan pertama berkurang 10%.", "Workshop", "Penjualan aset meningkat 3%.", 54, 58, 65, 68),
    c("chiko", "Chiko Vale", "R", "Lucky Scout", "Angin", "#80d8bc", "⌁", "Vale Shortcut", "Peluang 12% melewati satu petak kosong.", "Pocket Map", "Kontrol dadu meningkat 4%.", 70, 64, 55, 51),
    c("dara", "Dara Flint", "R", "Rent Guard", "Api", "#ef7b62", "△", "Flint Guard", "Mengurangi pembayaran sewa pertama sebesar 12%.", "Spark", "Sewa kota merah meningkat 3%.", 58, 55, 66, 65),
    c("elio", "Elio Moss", "R", "Zone Grower", "Flora", "#7bcf78", "✤", "Moss Market", "Bonus 8% saat membeli kota termurah dalam satu blok.", "Green Pocket", "Modal awal meningkat 3%.", 62, 57, 56, 64),
    c("fara", "Fara Wink", "R", "Chance Reader", "Arkana", "#d68abb", "✦", "Second Look", "Peluang 10% mengabaikan kartu kesempatan negatif.", "Good Sign", "Hadiah acak meningkat 4%.", 67, 61, 53, 55),
    c("gani", "Gani Bolt", "R", "Fast Dealer", "Petir", "#52cde4", "ϟ", "Quick Sale", "Menjual satu aset tanpa penalti tambahan.", "Static Change", "Mendapat 2% koin setelah dadu kembar.", 55, 64, 63, 52),
    c("hana", "Hana Dew", "R", "Recovery Aid", "Air", "#6bb8ec", "≋", "Dew Refund", "Mengembalikan 7% dari sewa yang baru dibayar.", "Soft Landing", "Biaya perjalanan berkurang 3%.", 64, 56, 51, 68),
    c("ivo", "Ivo Slate", "R", "Block Keeper", "Batu", "#ad947d", "⬣", "Slate Wall", "Peluang 11% menahan efek dorong mundur.", "Firm Ground", "Pertahanan kota meningkat 4%.", 50, 54, 62, 72),
    c("juno", "Juno Peak", "R", "Comeback Runner", "Surya", "#efbd53", "☼", "Peak Pace", "Saat tertinggal, kontrol dadu meningkat 8% satu giliran.", "Warm Start", "Bonus START meningkat 3%.", 63, 68, 57, 56),
    c("kimi", "Kimi Echo", "R", "Copy Novice", "Suara", "#ad8fe5", "◌", "Minor Echo", "Peluang 9% mengulang bonus kartu positif terakhir.", "Resonance", "Efek stun berkurang 5%.", 69, 60, 54, 58),
    c("luno", "Luno Drift", "R", "Warp Rookie", "Kosmik", "#8998e8", "✧", "Small Drift", "Peluang 10% berpindah satu petak saat terkena penalti.", "Moon Pocket", "Biaya pulau berkurang 5%.", 61, 62, 55, 62)
  ];

  const STORAGE_KEY = "rift-route-save-v1";
  const FEATURED_IDS = ["arka", "veyra", "orion"];
  const RARITY_ORDER = { "R": 1, "SR": 2, "SSR": 3, "SSR+": 4 };
  const RARITY_CLASS = { "R": "r", "SR": "sr", "SSR": "ssr", "SSR+": "ssrp" };
  const DUPLICATE_REWARD = { "R": 0, "SR": 1, "SSR": 2, "SSR+": 4 };
  const COSTS = { 1: 100, 10: 900 };
  const numberFormat = new Intl.NumberFormat("id-ID");

  const defaultState = () => ({
    diamonds: 5000,
    premiumCards: 0,
    pity: 0,
    srPity: 0,
    inventory: {},
    history: [],
    theme: "dark",
    activeView: "gacha"
  });

  let state = loadState();
  let currentRarityFilter = "ALL";
  let lastPullCount = 10;
  let pendingConfirmAction = null;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const byId = id => document.getElementById(id);

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const saved = JSON.parse(raw);
      const clean = { ...defaultState(), ...saved };
      clean.diamonds = Math.max(0, Number(clean.diamonds) || 0);
      clean.premiumCards = Math.max(0, Number(clean.premiumCards) || 0);
      clean.pity = Math.min(79, Math.max(0, Number(clean.pity) || 0));
      clean.srPity = Math.min(9, Math.max(0, Number(clean.srPity) || 0));
      clean.inventory = clean.inventory && typeof clean.inventory === "object" ? clean.inventory : {};
      clean.history = Array.isArray(clean.history) ? clean.history.slice(0, 60) : [];
      return clean;
    } catch {
      return defaultState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      toast("Penyimpanan tidak tersedia", "Progres aktif selama halaman ini terbuka.", "!");
    }
  }

  function getCharacter(id) {
    return CHARACTERS.find(character => character.id === id);
  }

  function monogram(name) {
    const words = name.split(" ");
    return words.length > 1 ? `${words[0][0]}${words[1][0]}` : name.slice(0, 2).toUpperCase();
  }

  function rarityTag(rarity) {
    return `<span class="rarity-tag ${RARITY_CLASS[rarity]}">${rarity}</span>`;
  }

  function setTheme(theme) {
    state.theme = theme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = state.theme;
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = state.theme === "dark" ? "#0b0f18" : "#edf2fa";
    byId("themeToggle").setAttribute("aria-label", state.theme === "dark" ? "Aktifkan light mode" : "Aktifkan dark mode");
    saveState();
  }

  function setView(view) {
    const valid = ["gacha", "collection", "shop", "history"].includes(view) ? view : "gacha";
    state.activeView = valid;
    $$(".view").forEach(section => section.classList.toggle("active", section.id === `view-${valid}`));
    $$(".nav-item").forEach(button => {
      const active = button.dataset.view === valid;
      button.classList.toggle("active", active);
      if (active) button.setAttribute("aria-current", "page"); else button.removeAttribute("aria-current");
    });
    if (valid === "collection") renderCollection();
    if (valid === "shop") renderShop();
    if (valid === "history") renderHistory();
    saveState();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateBalances() {
    const diamonds = numberFormat.format(state.diamonds);
    const premium = numberFormat.format(state.premiumCards);
    byId("diamondBalance").textContent = diamonds;
    byId("premiumBalance").textContent = premium;
    byId("shopPremiumBalance").textContent = premium;
    const unique = Object.values(state.inventory).filter(count => count > 0).length;
    byId("collectionNavCount").textContent = unique;
    byId("collectionProgress").textContent = `${unique} / ${CHARACTERS.length}`;

    const percent = Math.min(100, (state.pity / 80) * 100);
    byId("pityValue").textContent = state.pity;
    byId("pityValueSide").textContent = `${state.pity} / 80`;
    byId("pityPercentSide").textContent = `${Math.round(percent)}%`;
    byId("pityBar").style.width = `${percent}%`;
    byId("pityBarSide").style.width = `${percent}%`;
    byId("pityMessage").textContent = `${80 - state.pity} tarikan lagi menuju jaminan SSR+.`;
  }

  function renderFeatured() {
    byId("featuredStack").innerHTML = FEATURED_IDS.map(id => {
      const character = getCharacter(id);
      const gradient = `linear-gradient(145deg, ${character.accent}b8, #17162d 68%)`;
      return `<button class="featured-mini-card" style="--card-gradient:${gradient}" data-character-id="${character.id}" type="button" aria-label="Lihat ${character.name}">
        <span class="visual">${monogram(character.name)}</span><span class="sigil">${character.sigil}</span>
        <span class="info"><small>${character.rarity} · ${character.element}</small><strong>${character.name}</strong></span>
      </button>`;
    }).join("");
  }

  function rollRarity(forceMinSR = false) {
    if (state.pity >= 79) return "SSR+";
    const roll = Math.random() * 100;
    let rarity = roll < 2 ? "SSR+" : roll < 8 ? "SSR" : roll < 30 ? "SR" : "R";
    if ((forceMinSR || state.srPity >= 9) && rarity === "R") {
      const bonusRoll = Math.random() * 100;
      rarity = bonusRoll < 6 ? "SSR+" : bonusRoll < 24 ? "SSR" : "SR";
    }
    return rarity;
  }

  function randomFrom(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function drawOne(forceMinSR = false) {
    const rarity = rollRarity(forceMinSR);
    let pool = CHARACTERS.filter(character => character.rarity === rarity);
    if (rarity === "SSR+" && Math.random() < 0.5) {
      pool = pool.filter(character => FEATURED_IDS.slice(0, 2).includes(character.id));
    }
    const character = randomFrom(pool);
    state.pity = rarity === "SSR+" ? 0 : state.pity + 1;
    state.srPity = RARITY_ORDER[rarity] >= RARITY_ORDER.SR ? 0 : state.srPity + 1;
    return character;
  }

  function addCharacter(character, source = "Gacha") {
    const previous = Number(state.inventory[character.id]) || 0;
    const isNew = previous === 0;
    state.inventory[character.id] = previous + 1;
    const reward = isNew ? 0 : DUPLICATE_REWARD[character.rarity];
    if (reward) state.premiumCards += reward;
    state.history.unshift({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      characterId: character.id,
      rarity: character.rarity,
      source,
      isNew,
      reward,
      timestamp: Date.now()
    });
    state.history = state.history.slice(0, 60);
    return { character, isNew, reward };
  }

  function performPull(count) {
    const cost = COSTS[count];
    if (state.diamonds < cost) {
      toast("Diamond belum cukup", `Tambahkan ${numberFormat.format(cost - state.diamonds)} diamond untuk melanjutkan.`, "◇");
      return;
    }
    state.diamonds -= cost;
    const results = [];
    for (let index = 0; index < count; index += 1) {
      const mustGuarantee = count === 10 && index === 9 && !results.some(result => RARITY_ORDER[result.character.rarity] >= RARITY_ORDER.SR);
      results.push(addCharacter(drawOne(mustGuarantee)));
    }
    if (count === 10) state.premiumCards += 1;
    lastPullCount = count;
    saveState();
    renderAll();
    showSummonResults(results, count === 10);
  }

  function showSummonResults(results, hasBonus) {
    const highest = [...results].sort((a, b) => RARITY_ORDER[b.character.rarity] - RARITY_ORDER[a.character.rarity])[0];
    byId("summonModalTitle").textContent = results.length === 1 ? "Traveler Baru" : `${results.length} Traveler Tiba`;
    byId("summonResults").innerHTML = results.map((result, index) => {
      const character = result.character;
      const label = result.isNew ? `<span class="new-label">BARU</span>` : `<span class="dupe-label">DUPLIKAT${result.reward ? ` +${result.reward} ◆` : ""}</span>`;
      return `<button class="result-card" style="--accent:${character.accent};--delay:${index}" data-monogram="${monogram(character.name)}" data-character-id="${character.id}" type="button" aria-label="Detail ${character.name}">
        ${rarityTag(character.rarity)}<span class="result-sigil">${character.sigil}</span>${label}<strong>${character.name}</strong><small>${character.role}</small>
      </button>`;
    }).join("");
    byId("rewardStrip").hidden = !hasBonus;
    byId("summonAgainButton").textContent = `Rekrut lagi ${lastPullCount}×`;
    byId("summonAgainButton").dataset.pullCount = lastPullCount;
    openModal("summonModal");
    if (highest.character.rarity === "SSR+") {
      setTimeout(() => toast("SSR+ diperoleh", `${highest.character.name} bergabung dengan koleksimu.`, "✦"), 360);
    }
  }

  function addDiamonds(amount) {
    state.diamonds += amount;
    saveState();
    updateBalances();
    toast("Diamond ditambahkan", `+${numberFormat.format(amount)} diamond masuk ke saldo.`, "◇");
  }

  function renderMiniResults() {
    const recent = state.history.filter(item => item.source === "Gacha").slice(0, 3);
    byId("miniResults").innerHTML = recent.length ? recent.map(item => {
      const character = getCharacter(item.characterId);
      if (!character) return "";
      return `<button class="mini-result" style="--accent:${character.accent}" data-character-id="${character.id}" type="button"><span class="mini-sigil">${character.sigil}</span><strong>${character.name.split(" ")[0]}</strong><small>${character.rarity}</small></button>`;
    }).join("") : `<div class="mini-placeholder">Belum ada hasil gacha</div>`;
  }

  function characterCard(character) {
    const count = Number(state.inventory[character.id]) || 0;
    const locked = count === 0;
    return `<button class="character-card${locked ? " locked" : ""}" style="--accent:${character.accent}" data-character-id="${character.id}" type="button" aria-label="${locked ? "Pratinjau" : "Detail"} ${character.name}">
      <span class="card-visual">
        <span class="card-rarity">${rarityTag(character.rarity)}</span><span class="card-sigil">${character.sigil}</span><span class="card-monogram">${monogram(character.name)}</span>
        ${locked ? `<span class="lock-mark">▣</span>` : `<span class="owned-count">×${count}</span>`}
      </span>
      <span class="card-info"><h3>${character.name}</h3><span class="card-role">${character.role}</span><span class="card-skill"><i>✦</i><span>${character.skill}</span></span></span>
    </button>`;
  }

  function renderCollection() {
    const query = byId("collectionSearch").value.trim().toLocaleLowerCase("id-ID");
    const sort = byId("collectionSort").value;
    let items = CHARACTERS.filter(character => {
      const matchesRarity = currentRarityFilter === "ALL" || character.rarity === currentRarityFilter;
      const haystack = `${character.name} ${character.role} ${character.element} ${character.skill} ${character.passive}`.toLocaleLowerCase("id-ID");
      return matchesRarity && (!query || haystack.includes(query));
    });

    items.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name, "id-ID");
      if (sort === "owned") {
        const ownedDifference = (state.inventory[b.id] || 0) - (state.inventory[a.id] || 0);
        return ownedDifference || RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity] || a.name.localeCompare(b.name, "id-ID");
      }
      return RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity] || a.name.localeCompare(b.name, "id-ID");
    });

    byId("collectionGrid").innerHTML = items.map(characterCard).join("");
    byId("collectionEmpty").hidden = items.length > 0;
  }

  function renderShop() {
    const premiumCharacters = CHARACTERS.filter(character => character.price > 0);
    byId("premiumShopGrid").innerHTML = premiumCharacters.map(character => {
      const owned = Number(state.inventory[character.id]) || 0;
      const affordable = state.premiumCards >= character.price;
      return `<article class="shop-card" style="--accent:${character.accent}" data-monogram="${monogram(character.name)}">
        ${rarityTag(character.rarity)}<span class="shop-sigil">${character.sigil}</span>
        ${owned ? `<span class="shop-owned">✓ Dimiliki ×${owned}</span>` : ""}
        <h3>${character.name}</h3><span class="shop-role">${character.role} · ${character.element}</span><p>${character.skill}: ${character.skillDesc}</p>
        <button class="shop-buy" data-shop-id="${character.id}" type="button" ${affordable ? "" : "disabled"}><span>${owned ? "Tukar lagi" : "Tukar karakter"}</span><strong>◆ ${character.price}</strong></button>
      </article>`;
    }).join("");
  }

  function purchasePremium(id) {
    const character = getCharacter(id);
    if (!character || !character.price) return;
    if (state.premiumCards < character.price) {
      toast("Kartu Premium belum cukup", `Butuh ${character.price - state.premiumCards} kartu lagi.`, "◆");
      return;
    }
    showConfirm({
      title: `Tukar ${character.name}?`,
      message: `${character.price} Kartu Premium akan digunakan. Karakter langsung masuk ke koleksi.`,
      icon: character.sigil,
      acceptLabel: `Tukar ◆ ${character.price}`,
      action: () => {
        state.premiumCards -= character.price;
        const result = addCharacter(character, "Premium Shop");
        saveState();
        renderAll();
        toast(result.isNew ? "Karakter diperoleh" : "Duplikat diperoleh", `${character.name} ditambahkan ke koleksi.`, character.sigil);
      }
    });
  }

  function renderHistory() {
    const total = state.history.length;
    const high = state.history.filter(item => item.rarity === "SSR+").length;
    const ssr = state.history.filter(item => item.rarity === "SSR").length;
    const newCount = state.history.filter(item => item.isNew).length;
    byId("historyStats").innerHTML = [
      ["TOTAL TERCATAT", total], ["SSR+", high], ["SSR", ssr], ["KARAKTER BARU", newCount]
    ].map(([label, value]) => `<div class="history-stat"><small>${label}</small><strong>${numberFormat.format(value)}</strong></div>`).join("");

    byId("historyList").innerHTML = state.history.map(item => {
      const character = getCharacter(item.characterId);
      if (!character) return "";
      const time = new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(item.timestamp));
      return `<button class="history-row" style="--accent:${character.accent}" data-character-id="${character.id}" type="button">
        <span class="history-symbol">${character.sigil}</span><span class="history-name"><strong>${character.name}</strong><small>${character.role}</small></span>
        <span class="history-meta">${item.source}</span><span class="history-time">${time}</span>
        <span>${item.isNew ? `<span class="new-label">BARU</span>` : `<span class="history-duplicate">Duplikat${item.reward ? ` +${item.reward} ◆` : ""}</span>`}</span>
      </button>`;
    }).join("");
    byId("historyList").hidden = total === 0;
    byId("historyEmpty").hidden = total > 0;
  }

  function showCharacterDetail(id) {
    const character = getCharacter(id);
    if (!character) return;
    const owned = Number(state.inventory[character.id]) || 0;
    byId("detailContent").innerHTML = `
      <div class="detail-hero" style="--accent:${character.accent}" data-monogram="${monogram(character.name)}">
        <div class="detail-hero-copy">${rarityTag(character.rarity)}<h2 id="detailName">${character.name}</h2><p>${character.role} · ${character.element}</p></div>
      </div>
      <div class="detail-body">
        <div class="stat-grid">
          <div class="stat-item"><small>FORTUNE</small><strong>${character.stats.fortune}</strong></div>
          <div class="stat-item"><small>CONTROL</small><strong>${character.stats.control}</strong></div>
          <div class="stat-item"><small>POWER</small><strong>${character.stats.power}</strong></div>
          <div class="stat-item"><small>DEFENSE</small><strong>${character.stats.defense}</strong></div>
        </div>
        <div class="skill-blocks">
          <article class="skill-block" style="--accent:${character.accent}"><span class="skill-label"><i>✦</i> SKILL AKTIF</span><h3>${character.skill}</h3><p>${character.skillDesc}</p></article>
          <article class="skill-block" style="--accent:${character.accent}"><span class="skill-label"><i>◈</i> SKILL PASIF</span><h3>${character.passive}</h3><p>${character.passiveDesc}</p></article>
        </div>
        <div class="owned-strip"><span>${owned ? "Tersimpan dalam koleksi" : "Belum dimiliki"}</span><strong>${owned ? `Jumlah ×${owned}` : character.price ? `Premium Shop ◆ ${character.price}` : "Dapat diperoleh dari gacha"}</strong></div>
      </div>`;
    openModal("detailModal");
  }

  function openModal(id) {
    const dialog = byId(id);
    if (dialog && !dialog.open) dialog.showModal();
  }

  function closeModal(id) {
    const dialog = byId(id);
    if (dialog?.open) dialog.close();
  }

  function showConfirm({ title, message, icon = "!", acceptLabel = "Lanjutkan", action }) {
    byId("confirmTitle").textContent = title;
    byId("confirmMessage").textContent = message;
    byId("confirmIcon").textContent = icon;
    byId("confirmAccept").textContent = acceptLabel;
    pendingConfirmAction = action;
    openModal("confirmModal");
  }

  function toast(title, message, icon = "✦") {
    const node = document.createElement("div");
    node.className = "toast";
    node.innerHTML = `<span class="toast-icon">${icon}</span><span><strong>${title}</strong><span>${message}</span></span>`;
    byId("toastRegion").appendChild(node);
    setTimeout(() => {
      node.classList.add("out");
      setTimeout(() => node.remove(), 230);
    }, 3200);
  }

  function renderTimer() {
    const cycle = 7 * 24 * 60 * 60;
    const seconds = cycle - (Math.floor(Date.now() / 1000) % cycle);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    byId("bannerTimer").textContent = `${String(days).padStart(2, "0")}H ${String(hours).padStart(2, "0")}J ${String(minutes).padStart(2, "0")}M`;
  }

  function renderAll() {
    updateBalances();
    renderMiniResults();
    renderCollection();
    renderShop();
    renderHistory();
  }

  function bindEvents() {
    $$(".nav-item").forEach(button => button.addEventListener("click", () => setView(button.dataset.view)));
    $$('[data-go-view]').forEach(button => button.addEventListener("click", () => setView(button.dataset.goView)));
    byId("themeToggle").addEventListener("click", () => setTheme(state.theme === "dark" ? "light" : "dark"));
    byId("addDiamondButton").addEventListener("click", () => addDiamonds(1000));
    $$('[data-add-diamonds]').forEach(button => button.addEventListener("click", () => addDiamonds(Number(button.dataset.addDiamonds))));
    byId("singlePullButton").addEventListener("click", () => performPull(1));
    byId("multiPullButton").addEventListener("click", () => performPull(10));
    byId("summonAgainButton").addEventListener("click", event => {
      closeModal("summonModal");
      performPull(Number(event.currentTarget.dataset.pullCount) || 1);
    });

    byId("collectionSearch").addEventListener("input", renderCollection);
    byId("collectionSort").addEventListener("change", renderCollection);
    byId("rarityFilters").addEventListener("click", event => {
      const button = event.target.closest("[data-rarity]");
      if (!button) return;
      currentRarityFilter = button.dataset.rarity;
      $$(".filter-button", byId("rarityFilters")).forEach(item => item.classList.toggle("active", item === button));
      renderCollection();
    });

    document.addEventListener("click", event => {
      const characterButton = event.target.closest("[data-character-id]");
      if (characterButton) showCharacterDetail(characterButton.dataset.characterId);
      const shopButton = event.target.closest("[data-shop-id]");
      if (shopButton && !shopButton.disabled) purchasePremium(shopButton.dataset.shopId);
      const closeButton = event.target.closest("[data-close-modal]");
      if (closeButton) closeModal(closeButton.dataset.closeModal);
    });

    $$(".modal-backdrop").forEach(backdrop => backdrop.addEventListener("click", () => closeModal(backdrop.parentElement.id)));
    byId("confirmCancel").addEventListener("click", () => {
      pendingConfirmAction = null;
      closeModal("confirmModal");
    });
    byId("confirmAccept").addEventListener("click", () => {
      const action = pendingConfirmAction;
      pendingConfirmAction = null;
      closeModal("confirmModal");
      if (typeof action === "function") action();
    });

    byId("resetDataButton").addEventListener("click", () => showConfirm({
      title: "Reset seluruh progres?",
      message: "Diamond, koleksi, Kartu Premium, pity, dan riwayat akan kembali ke kondisi awal.",
      icon: "↺",
      acceptLabel: "Reset progres",
      action: () => {
        const theme = state.theme;
        state = { ...defaultState(), theme };
        saveState();
        renderAll();
        setView("gacha");
        toast("Progres direset", "Permainan kembali ke kondisi awal.", "↺");
      }
    }));

    byId("clearHistoryButton").addEventListener("click", () => {
      if (!state.history.length) return;
      showConfirm({
        title: "Hapus riwayat gacha?",
        message: "Koleksi dan saldo tidak berubah. Catatan hasil rekrut saja yang dihapus.",
        icon: "↺",
        acceptLabel: "Hapus riwayat",
        action: () => {
          state.history = [];
          saveState();
          renderAll();
          toast("Riwayat dihapus", "Koleksi karakter tetap tersimpan.", "✓");
        }
      });
    });
  }

  function init() {
    document.documentElement.dataset.theme = state.theme;
    renderFeatured();
    bindEvents();
    renderAll();
    setView(state.activeView);
    renderTimer();
    setInterval(renderTimer, 30000);
  }

  init();
})();
