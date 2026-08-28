const cardData = [
  {
    rank: "2", name: "View", cat: "The Recruiter", type: "flip",
    accent: "#2fa8ef", soft: "#e1f6ff", fur: "#f5bf61", patch: "#fff1d6", accessory: "mail",
    short: "Ambil 1 kartu, lalu buang 1 kartu dari tangan.",
    rule: "Saat di-flip, ambil 1 kartu dari draw pile, lalu pilih 1 kartu dari tanganmu untuk dibuang. Kartu yang baru ditarik boleh langsung dimainkan bila action masih tersedia. Jika draw pile sudah kosong, power ini tidak melakukan apa pun.",
    tip: "Paling berguna di awal hingga pertengahan game untuk memperbaiki kualitas tangan dan mencari kartu yang sesuai dengan lane yang sedang kamu perebutkan.",
    extra: "On Flip • tidak menambah jumlah kartu bersih di tangan: draw 1 lalu discard 1."
  },
  {
    rank: "3", name: "Trap", cat: "Box Trickster", type: "killed",
    accent: "#f26f91", soft: "#ffe8ef", fur: "#8f7bea", patch: "#e9e3ff", accessory: "box",
    short: "Jika kalah saat face-down, kembali face-up dengan 2 HP.",
    rule: "Jika lawan membunuh kartu 3 ketika masih face-down, 3 tidak masuk discard pile. Sebaliknya, kartu dibalik face-up dan kembali sebagai kartu hidup dengan 2 HP penuh.",
    tip: "Bagus untuk bluff. Lawan yang menghabiskan dua serangan pada 3 tertutup bisa kehilangan banyak tempo ketika 3 justru hidup kembali dan siap menyerang di giliranmu.",
    extra: "When Killed • efek ini khusus saat 3 terbunuh dalam keadaan face-down."
  },
  {
    rank: "4", name: "Foresight", cat: "Crystal Seer", type: "flip",
    accent: "#8b65de", soft: "#f0e9ff", fur: "#6cc8d8", patch: "#e6fbff", accessory: "crystal",
    short: "Intip 1 kartu face-down mana pun di board.",
    rule: "Saat di-flip, lihat satu kartu face-down di board. Kamu boleh melihat kartu biasa atau Base Card milik siapa pun. Informasi yang kamu lihat tidak ditunjukkan kepada lawan.",
    tip: "Gunakan untuk menemukan ancaman sebelum aktif, mengecek apakah sebuah kartu tertutup adalah 3, atau membaca Base Card agar kamu tahu lane mana yang lebih aman untuk dikejar.",
    extra: "On Flip • informasi saja, tetapi bisa sangat menentukan keputusan lane."
  },
  {
    rank: "5", name: "Flip", cat: "Banner Captain", type: "flip",
    accent: "#ff9f36", soft: "#fff0d8", fur: "#d99355", patch: "#ffe6bd", accessory: "flag",
    short: "Flip semua kartu face-down milikmu di lane ini.",
    rule: "Saat 5 di-flip, balik semua kartu face-down milikmu di lane yang sama tanpa membayar action tambahan. Aktifkan power kartu-kartu tersebut dalam urutan yang kamu pilih. Jika draw pile sudah kosong, Base Card pada lane itu juga dapat ikut ter-flip.",
    tip: "Ini mesin tempo besar. Menyimpan beberapa kartu tertutup lalu membuka semuanya dengan 5 dapat menghemat banyak action, tetapi jangan terlalu menumpuk satu lane dan menyerahkan dua lane lainnya.",
    extra: "On Flip • kartu yang dibalik oleh 5 tetap membutuhkan action bila ingin menyerang."
  },
  {
    rank: "6", name: "Freeze", cat: "Frost Mage", type: "flip",
    accent: "#36a9d9", soft: "#def7ff", fur: "#a9d9f7", patch: "#f5fbff", accessory: "snow",
    short: "Bekukan kartu lawan di lane ini selama 1 turn.",
    rule: "Saat di-flip, semua kartu lawan yang saat itu berada di lane ini menjadi beku selama satu giliran: mereka tidak boleh menyerang atau membalik diri sendiri. 9 tidak dapat dibekukan. Kartu baru masih boleh dimainkan ke lane tersebut.",
    tip: "Gunakan untuk membeli waktu pada lane yang sangat diperebutkan, lalu pakai turn yang aman itu untuk memasang kartu tambahan atau menyiapkan serangan berikutnya.",
    extra: "Kartu beku masih dapat di-flip oleh 5, disembuhkan 7, dipindahkan Queen, atau diaktifkan kembali oleh King."
  },
  {
    rank: "7", name: "Heal All", cat: "Life Mage", type: "flip",
    accent: "#35b989", soft: "#e0f9f1", fur: "#70c8a0", patch: "#eafff4", accessory: "leaf",
    short: "Pulihkan semua kartu milikmu di seluruh lane.",
    rule: "Saat di-flip, semua kartu milikmu yang rusak dipulihkan ke HP penuh, baik face-up maupun face-down, di ketiga lane. Jack juga dipulihkan kembali sampai 3 HP.",
    tip: "Semakin banyak kartu rusak yang diselamatkan, semakin besar tempo yang kamu dapat. Nilainya sangat tinggi saat Jack atau beberapa lane sekaligus sedang terluka.",
    extra: "On Flip • jika tidak ada kartu yang rusak, power ini tidak memberi efek."
  },
  {
    rank: "8", name: "Retaliate", cat: "Spiked Soldier", type: "constant",
    accent: "#f06a7e", soft: "#ffe6ec", fur: "#6a6e9e", patch: "#e9eaff", accessory: "spikes",
    short: "Penyerang 8 menerima 1 damage balik, kecuali 9.",
    rule: "Selama 8 face-up dan hidup, setiap kartu yang menyerangnya menerima 1 damage balasan. Kartu 9 adalah pengecualian dan dapat menyerang 8 tanpa terkena Retaliate.",
    tip: "8 menciptakan kehadiran lane yang mahal untuk diserang. Bagus ditempatkan di lane yang ingin kamu pertahankan sambil memaksa lawan bertukar HP.",
    extra: "Constant • jika pair menyerang 8, kedua kartu penyerang menerima damage. Pada pair 8, masing-masing 8 tetap menerima damage secara terpisah."
  },
  {
    rank: "9", name: "Nimble", cat: "Ninja Cat", type: "constant",
    accent: "#4f66d8", soft: "#e8ebff", fur: "#4a4e69", patch: "#aeb4dd", accessory: "ninja",
    short: "Counter power Constant: tahan Freeze, 8, 10, dan kuat melawan Jack.",
    rule: "9 tidak bisa dibekukan oleh 6, tidak menerima damage ketika menyerang 8, tidak dapat menjadi target kedua dari Twinstrike 10, dan memberikan 2 damage ketika menyerang Jack.",
    tip: "Simpan 9 untuk menjawab kartu Constant lawan. Ia sangat efisien menghabisi Jack dan membuat 8 jauh lebih mudah ditembus.",
    extra: "Constant • pair 9 tetap mempertahankan seluruh kemampuan khususnya dan dapat memberi total 3 damage kepada Jack."
  },
  {
    rank: "10", name: "Twinstrike", cat: "Brawler", type: "constant",
    accent: "#e0604e", soft: "#ffebe5", fur: "#c46e55", patch: "#ffe0cd", accessory: "headband",
    short: "Satu attack dapat memberi 1 damage ke dua target.",
    rule: "Ketika 10 menyerang, ia dapat memberi 1 damage ke dua kartu lawan berbeda di lane yang sama. Efek tidak dapat melewati Jack. 10 juga tidak dapat mengenai 9 sekaligus kartu lain; 9 hanya dapat diserang sebagai target tunggal.",
    tip: "10 sangat berbahaya pada lane berisi banyak kartu yang sudah rusak karena satu action bisa menghabisi dua target sekaligus.",
    extra: "Constant • pair 10 memberi 2 damage ke target pertama dan 1 damage ke target kedua, bukan 2+2."
  },
  {
    rank: "J", name: "Taunt", cat: "The Protector", type: "constant",
    accent: "#4c9fef", soft: "#e5f3ff", fur: "#d6a15d", patch: "#fff0d0", accessory: "shield",
    short: "Harus diserang lebih dulu dan mempunyai 3 HP.",
    rule: "Selama Jack berada di lane, lawan harus membunuh Jack sebelum dapat menyerang kartu lain di lane tersebut. Jack mempunyai 3 HP: tandai damage pertama kira-kira 45°, damage kedua 90°, lalu buang setelah damage ketiga.",
    tip: "Letakkan di depan kartu bernilai tinggi untuk melindunginya. Jack sangat menyukai Heal dari 7, tetapi berhati-hatilah terhadap 9 yang memberikan 2 damage kepadanya.",
    extra: "Constant • dua Jack yang dipair tetap menerima damage secara individual."
  },
  {
    rank: "Q", name: "Move", cat: "Royal Queen", type: "flip",
    accent: "#d85fa7", soft: "#ffe7f4", fur: "#f1b7c7", patch: "#fff2f8", accessory: "queen",
    short: "Pindahkan 1 kartu sekutu dari lane lain ke lane Queen.",
    rule: "Saat Queen di-flip, kamu boleh memindahkan satu kartu milikmu dari lane lain ke lane Queen. Kartu boleh face-up atau face-down. Power On Flip kartu yang dipindahkan tidak aktif ulang, tetapi power Constant tetap bekerja. Jika draw pile kosong, Queen juga boleh memindahkan Base Card.",
    tip: "Queen adalah alat swing endgame yang sangat kuat: tarik kartu dari lane yang sudah aman atau kamu tinggalkan ke lane yang masih diperebutkan.",
    extra: "On Flip • kartu yang dipindahkan masih boleh menyerang pada turn itu bila memenuhi syarat dan action tersedia."
  },
  {
    rank: "K", name: "Empower", cat: "Inspiring King", type: "flip",
    accent: "#a264dd", soft: "#f2e7ff", fur: "#8d75c8", patch: "#eee9ff", accessory: "king",
    short: "Aktifkan ulang power On Flip milikmu di lane ini.",
    rule: "Saat King di-flip, semua kartu milikmu yang sudah face-up di lane yang sama mengaktifkan kembali power mereka. Kamu memilih urutan aktivasi. King lain dan kartu dengan power Constant tidak terpengaruh.",
    tip: "King bisa mengulang Freeze, Heal, Foresight, Move, atau bonus Ace. Menunggu timing yang tepat sering lebih bernilai daripada membalik King sesegera mungkin.",
    extra: "On Flip • memengaruhi 2, 4, 5, 6, 7, Queen, dan Ace."
  },
  {
    rank: "A", name: "Action", cat: "The Assassin", type: "flip",
    accent: "#ef526f", soft: "#ffe7ed", fur: "#414a72", patch: "#d4daf8", accessory: "hood",
    short: "Dapat +1 action dan boleh menyerang 2× pada turn pertamanya.",
    rule: "Saat Ace di-flip, kamu langsung memperoleh 1 action tambahan yang boleh digunakan untuk apa pun. Pada turn pertamanya sebagai kartu aktif, Ace boleh menyerang dua kali. Jika diaktifkan ulang oleh King, bonus action dan kemampuan menyerang dua kali tersedia lagi.",
    tip: "Urutan klasiknya adalah Play → Flip (+1 Action) → Attack → Attack. Itu membuat Ace mampu memberikan 2 damage langsung dari tangan dalam satu turn.",
    extra: "On Flip • kartu burst/tempo yang fleksibel dan salah satu finisher terbaik."
  }
];

const typeLabels = { flip: "On Flip", constant: "Constant", killed: "When Killed" };

function catSVG(card, size = 120) {
  const a = card.accent;
  const fur = card.fur;
  const patch = card.patch;

  const accessories = {
    mail: `<rect x="79" y="69" width="23" height="19" rx="4" fill="#f3c86b" stroke="${a}" stroke-width="3"/><path d="M82 73 L90.5 81 L99 73" fill="none" stroke="${a}" stroke-width="2.5"/>`,
    box: `<path d="M28 81 L50 73 L72 81 L50 91 Z" fill="#d69a62"/><path d="M28 81 V99 L50 108 V91 Z" fill="#bd7c49"/><path d="M72 81 V99 L50 108 V91 Z" fill="#e4ae74"/>`,
    crystal: `<circle cx="88" cy="83" r="13" fill="#bda7ff" opacity=".9" stroke="${a}" stroke-width="3"/><path d="M76 101 H100" stroke="${a}" stroke-width="5" stroke-linecap="round"/><path d="M84 70 L88 64 L92 70" fill="none" stroke="#fff" stroke-width="2"/>`,
    flag: `<path d="M83 47 V102" stroke="#7d604c" stroke-width="4"/><path d="M86 50 C102 44 105 54 113 50 V69 C103 73 99 62 86 69 Z" fill="${a}"/>`,
    snow: `<path d="M94 54 V81 M81 67 H107 M85 58 L103 76 M103 58 L85 76" stroke="#65c9f4" stroke-width="3" stroke-linecap="round"/>`,
    leaf: `<path d="M91 87 C110 70 113 92 94 101 C87 102 84 95 91 87 Z" fill="#5cc68e"/><path d="M89 103 C94 93 100 85 108 80" stroke="#398e67" stroke-width="2.4" fill="none"/>`,
    spikes: `<path d="M27 67 L15 61 L23 77 L12 84 L29 87 M73 67 L85 61 L77 77 L88 84 L71 87" fill="${a}" opacity=".9"/>`,
    ninja: `<path d="M24 55 C35 44 65 44 76 55 L72 70 C60 64 40 64 28 70 Z" fill="#25293f"/><rect x="29" y="58" width="42" height="13" rx="6" fill="#1d2134"/><path d="M35 64 H45 M55 64 H65" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`,
    headband: `<path d="M24 53 C39 48 61 48 76 53" stroke="${a}" stroke-width="7" stroke-linecap="round"/><path d="M76 53 L94 44 L88 61 Z" fill="${a}"/>`,
    shield: `<path d="M83 67 L105 73 V88 C105 101 94 108 94 108 C94 108 83 101 83 88 Z" fill="#5faaf4" stroke="#2b6fab" stroke-width="3"/><path d="M94 75 V101 M86 87 H102" stroke="#e9f7ff" stroke-width="3"/>`,
    queen: `<path d="M30 42 L38 26 L50 41 L62 26 L70 42 Z" fill="#ffd45f" stroke="#e7a93a" stroke-width="2"/><circle cx="38" cy="27" r="3" fill="#ef6a93"/><circle cx="62" cy="27" r="3" fill="#8c65e4"/>`,
    king: `<path d="M27 43 L33 24 L46 40 L57 23 L69 40 L76 24 L74 45 Z" fill="#ffd35a" stroke="#d9a235" stroke-width="2"/><circle cx="33" cy="24" r="3" fill="#67bfff"/><circle cx="57" cy="23" r="3" fill="#f16a83"/><circle cx="76" cy="24" r="3" fill="#8e6ae8"/>`,
    hood: `<path d="M18 57 C20 29 35 17 50 17 C65 17 80 29 82 57 C76 43 67 35 50 35 C33 35 24 43 18 57 Z" fill="#29324f"/><path d="M18 56 C14 73 18 95 31 108 L34 80 Z" fill="#29324f"/><path d="M82 56 C86 73 82 95 69 108 L66 80 Z" fill="#29324f"/>`
  };

  const expressions = {
    "2": `<path d="M39 62 q4 3 8 0 M54 62 q4 3 8 0" stroke="#243253" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
    "3": `<circle cx="42" cy="62" r="2.6" fill="#243253"/><circle cx="59" cy="62" r="2.6" fill="#243253"/><path d="M47 72 q3 -3 6 0" stroke="#243253" stroke-width="2" fill="none"/>`,
    "4": `<path d="M39 62 h7 M55 62 h7" stroke="#243253" stroke-width="2.4" stroke-linecap="round"/><circle cx="50" cy="72" r="2" fill="#e76b84"/>`,
    "5": `<path d="M38 62 q4 -4 8 0 M54 62 q4 -4 8 0" stroke="#243253" stroke-width="2.5" fill="none"/><path d="M45 72 q5 4 10 0" stroke="#243253" stroke-width="2" fill="none"/>`,
    "6": `<circle cx="42" cy="62" r="2.5" fill="#243253"/><circle cx="59" cy="62" r="2.5" fill="#243253"/><path d="M46 73 h8" stroke="#243253" stroke-width="2"/>`,
    "7": `<path d="M39 62 q4 4 8 0 M54 62 q4 4 8 0" stroke="#243253" stroke-width="2.5" fill="none"/><path d="M46 71 q4 5 8 0" stroke="#e76b84" stroke-width="2" fill="none"/>`,
    "8": `<path d="M38 60 l8 2 M62 60 l-8 2" stroke="#243253" stroke-width="2.6"/><circle cx="50" cy="72" r="2" fill="#243253"/>`,
    "9": `<path d="M36 61 h11 M54 61 h11" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>`,
    "10": `<path d="M36 58 l10 3 M64 58 l-10 3" stroke="#243253" stroke-width="2.8"/><path d="M45 72 q5 -4 10 0" stroke="#243253" stroke-width="2" fill="none"/>`,
    "J": `<circle cx="42" cy="62" r="2.5" fill="#243253"/><circle cx="59" cy="62" r="2.5" fill="#243253"/><path d="M45 72 q5 4 10 0" stroke="#243253" stroke-width="2" fill="none"/>`,
    "Q": `<path d="M39 62 q4 3 8 0 M54 62 q4 3 8 0" stroke="#243253" stroke-width="2.4" fill="none"/><path d="M46 72 q4 4 8 0" stroke="#e76b84" stroke-width="2" fill="none"/>`,
    "K": `<circle cx="42" cy="62" r="2.4" fill="#243253"/><circle cx="59" cy="62" r="2.4" fill="#243253"/><path d="M45 72 h10" stroke="#243253" stroke-width="2.2"/>`,
    "A": `<path d="M38 61 h9 M54 61 h9" stroke="#dbe2ff" stroke-width="2.5" stroke-linecap="round"/><path d="M45 72 q5 -3 10 0" stroke="#243253" stroke-width="2" fill="none"/>`
  };

  return `
  <svg width="${size}" height="${size}" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Kucing ${card.cat}">
    <ellipse cx="50" cy="105" rx="31" ry="7" fill="#57738f" opacity=".12"/>
    ${accessories[card.accessory] || ""}
    <path d="M28 50 L31 27 L45 42 C48 40 52 40 55 42 L69 27 L72 50" fill="${fur}" stroke="${a}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M27 52 C27 39 38 34 50 34 C62 34 73 39 73 52 V71 C73 85 64 94 50 94 C36 94 27 85 27 71 Z" fill="${fur}" stroke="${a}" stroke-width="3"/>
    <path d="M34 45 C41 40 59 40 66 45 C63 51 58 54 50 54 C42 54 37 51 34 45 Z" fill="${patch}" opacity=".78"/>
    <ellipse cx="50" cy="79" rx="18" ry="10" fill="${patch}" opacity=".92"/>
    ${expressions[card.rank] || expressions["J"]}
    <path d="M48 68 L52 68 L50 71 Z" fill="#e97d8d"/>
    <path d="M28 81 C18 86 15 95 18 103" stroke="${fur}" stroke-width="8" stroke-linecap="round" fill="none"/>
    <path d="M72 81 C81 85 85 92 83 100" stroke="${fur}" stroke-width="8" stroke-linecap="round" fill="none"/>
    <path d="M37 91 V108 M63 91 V108" stroke="${fur}" stroke-width="11" stroke-linecap="round"/>
    <circle cx="37" cy="108" r="7" fill="${patch}"/><circle cx="63" cy="108" r="7" fill="${patch}"/>
  </svg>`;
}

function renderCards() {
  const grid = document.getElementById("cardGrid");
  const search = document.getElementById("cardSearch").value.trim().toLowerCase();
  const filter = document.getElementById("powerFilter").value;

  const filtered = cardData.filter(card => {
    const haystack = `${card.rank} ${card.name} ${card.cat} ${card.short} ${card.rule}`.toLowerCase();
    return (!search || haystack.includes(search)) && (filter === "all" || card.type === filter);
  });

  if (!filtered.length) {
    grid.innerHTML = `<div class="empty-state">🐾 Tidak ada kartu yang cocok. Coba kata kunci lain.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(card => `
    <article class="power-card" tabindex="0" role="button" data-rank="${card.rank}" style="--card-accent:${card.accent};--card-soft:${card.soft}">
      <div class="topline">
        <span class="rank-box">${card.rank}</span>
        <span class="type-tag">${typeLabels[card.type]}</span>
      </div>
      <div class="cat-frame">${catSVG(card)}</div>
      <h3>${card.name}</h3>
      <p class="cat-title">${card.cat}</p>
      <p class="short-rule">${card.short}</p>
    </article>
  `).join("");

  grid.querySelectorAll(".power-card").forEach(el => {
    el.addEventListener("click", () => openCard(el.dataset.rank));
    el.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openCard(el.dataset.rank);
      }
    });
  });
}

function openCard(rank) {
  const card = cardData.find(c => c.rank === rank);
  if (!card) return;

  const modal = document.getElementById("cardModal");
  const visual = document.getElementById("modalCat");
  visual.innerHTML = catSVG(card, 220);
  visual.style.setProperty("--modal-soft", card.soft);
  visual.style.background = `linear-gradient(145deg, ${card.soft}, var(--panel-soft))`;

  document.getElementById("modalRank").textContent = card.rank;
  document.getElementById("modalType").textContent = typeLabels[card.type];
  document.getElementById("modalTitle").textContent = card.name;
  document.getElementById("modalTagline").textContent = card.cat;
  document.getElementById("modalRule").textContent = card.rule;
  document.getElementById("modalTip").textContent = card.tip;
  document.getElementById("modalExtra").textContent = card.extra;

  modal.style.setProperty("--modal-accent", card.accent);
  modal.style.setProperty("--modal-soft", card.soft);
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.getElementById("modalClose").focus();
}

function closeCard() {
  const modal = document.getElementById("cardModal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("duel52-theme", theme);
  document.querySelector(".theme-icon").textContent = theme === "dark" ? "☀️" : "🌙";
}

function setupTheme() {
  const saved = localStorage.getItem("duel52-theme");
  const preferred = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  setTheme(saved || preferred);
  document.getElementById("themeToggle").addEventListener("click", () => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  });
}

function setupNavigation() {
  const navItems = [...document.querySelectorAll(".nav-item")];
  const sections = navItems.map(item => document.getElementById(item.dataset.target)).filter(Boolean);

  navItems.forEach(item => item.addEventListener("click", () => {
    document.getElementById(item.dataset.target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }));

  document.querySelectorAll("[data-scroll]").forEach(button => button.addEventListener("click", () => {
    document.getElementById(button.dataset.scroll)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }));

  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navItems.forEach(item => item.classList.toggle("active", item.dataset.target === visible.target.id));
  }, { rootMargin: "-20% 0px -65% 0px", threshold: [0.05, 0.25, 0.5] });

  sections.forEach(section => observer.observe(section));
}

function setupActionCounter() {
  let actions = 3;
  const label = document.getElementById("actionValue");
  const minus = document.getElementById("minusAction");
  const reset = document.getElementById("resetAction");

  minus.addEventListener("click", () => {
    if (actions > 0) actions -= 1;
    label.textContent = actions;
    minus.animate([{ transform: "scale(.9)" }, { transform: "scale(1)" }], { duration: 140 });
  });

  reset.addEventListener("click", () => {
    actions = 3;
    label.textContent = actions;
  });
}

function setupModal() {
  document.getElementById("modalClose").addEventListener("click", closeCard);
  document.getElementById("cardModal").addEventListener("click", event => {
    if (event.target.id === "cardModal") closeCard();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeCard();
  });
}

function init() {
  const ace = cardData.find(c => c.rank === "A");
  document.getElementById("heroCat").innerHTML = catSVG(ace, 150);
  setupTheme();
  setupNavigation();
  setupActionCounter();
  setupModal();
  document.getElementById("cardSearch").addEventListener("input", renderCards);
  document.getElementById("powerFilter").addEventListener("change", renderCards);
  renderCards();
}

document.addEventListener("DOMContentLoaded", init);
