(function () {
  "use strict";

  const STORAGE_KEY = "sebutCepatStateV2";
  const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const DEFAULT_CATEGORIES = [
    { id: "makanan", name: "Makanan" },
    { id: "hewan", name: "Hewan" },
    { id: "buah", name: "Buah" },
    { id: "kota", name: "Kota" },
    { id: "pekerjaan", name: "Pekerjaan" },
    { id: "benda", name: "Benda" },

    // --- Gen Z & Pop Culture ---
    { id: "istilah_slang_genz", name: "Istilah Slang Gen Z" },
    { id: "alasan_ghosting", name: "Alasan Ghosting" },
    { id: "red_flag_gebetan", name: "Red Flag Gebetan" },
    { id: "green_flag_doi", name: "Green Flag Doi" },
    { id: "topik_deep_talk", name: "Topik Deep Talk Pas Nongkrong" },
    { id: "hal_bikin_ilfiel", name: "Hal yang Bikin Ilfil" },
    { id: "kategori_zodiak", name: "Zodiak / Sifat Zodiak" },
    { id: "tipe_anak_nongkrong", name: "Tipe Anak Nongkrong" },
    { id: "mbak_mbak_jaksel", name: "Kosakata Mbak-Mbak Jaksel" },
    { id: "sifat_fboy", name: "Ciri-Ciri Fboy/Fgirl" },

    // --- Food & Beverages (Anak Senja & WFC) ---
    { id: "menu_warkop", name: "Menu Warkop" },
    { id: "brand_kopi_kekinian", name: "Brand Kopi Kekinian" },
    { id: "jajanan_pasar", name: "Jajanan Pasar / SD" },
    { id: "makanan_tanggal_tua", name: "Makanan Tanggal Tua" },
    { id: "varian_indomie", name: "Varian Rasa Indomie" },
    { id: "topping_seblak", name: "Topping Seblak" },
    { id: "makanan_comfort_food", name: "Comfort Food Pas Hujan" },
    { id: "minuman_boba", name: "Brand Boba / Fast Food" },
    { id: "jenis_sambal", name: "Jenis Sambal Indonesia" },
    { id: "dessert_kekinian", name: "Dessert Kekinian" },

    // --- Media, Entertainment & Internet ---
    { id: "influencer_tiktok", name: "Selebgram / TikToker" },
    { id: "youtuber_indo", name: "YouTuber Indonesia" },
    { id: "lagu_galau_indo", name: "Judul Lagu Galau" },
    { id: "band_indie", name: "Band Indie Indonesia" },
    { id: "anime_populer", name: "Judul Anime" },
    { id: "film_horor_indo", name: "Film Horor Indonesia" },
    { id: "meme_viral", name: "Meme Viral" },
    { id: "game_mobile", name: "Game Mobile / PC" },
    { id: "rekomendasi_drakor", name: "Judul Drakor" },
    { id: "artis_kpop", name: "Grup K-Pop / Idol" },

    // --- Tempat & Gaya Hidup ---
    { id: "tempat_first_date", name: "Tempat Ideal First Date" },
    { id: "spot_nongkrong", name: "Spot Nongkrong Anak Muda" },
    { id: "destinasi_liburan", name: "Destinasi Liburan Impian" },
    { id: "brand_fashion_local", name: "Brand Clothing Local" },
    { id: "brand_sneakers", name: "Brand Sneakers / Sepatu" },
    { id: "skin_care_ingredient", name: "Skincare & Makeup Item" },
    { id: "aplikasi_di_hp", name: "Aplikasi Sering Dibuka" },
    { id: "fitur_instagram", name: "Fitur Media Sosial" },

    // --- Kehidupan Kampus & Kerja ---
    { id: "alasan_telat", name: "Alasan Telat Masuk" },
    { id: "jurusan_kuliah", name: "Jurusan Kuliah" },
    { id: "tipe_dosen", name: "Tipe Dosen / Bos" },
    { id: "pekerjaan_remote", name: "Pekerjaan Freelance / Remote" },
    { id: "penderitaan_skripsi", name: "Istilah Dunia Perkuliahan" },
    { id: "pengeluaran_bulanan", name: "Pengeluaran Bikin Kanker (Kantong Kering)" },

    // --- Kategori Lucu & Absurd ---
    { id: "benda_di_kamar_mandi", name: "Benda di Kamar Mandi" },
    { id: "suara_hewan", name: "Suara Hewan / Onomatope" },
    { id: "hal_bikin_panik", name: "Hal yang Bikin Panik" },
    { id: "isi_tas_cewek", name: "Isi Tas Cewek / Cowok" },
    { id: "bau_paling_aneh", name: "Aroma / Bau Spesifik" },
    { id: "kegiatan_pas_gabut", name: "Kegiatan Pas Gabut" },
    { id: "janji_manis_mantan", name: "Janji Manis Mantan" },
    { id: "cobaan_hidup", name: "Cobaan Hidup Sehari-hari" },

    // --- Populer & Umum ---
    { id: "nama_artis_indo", name: "Nama Artis Indonesia" },
    { id: "nama_pahlawan", name: "Nama Pahlawan Nasional" },
    { id: "negara_di_dunia", name: "Nama Negara" },
    { id: "bahasa_asing", name: "Bahasa di Dunia" },
    { id: "alat_musik", name: "Alat Musik" },
    { id: "genre_musik", name: "Genre Musik" },
    { id: "klub_bola", name: "Klub Sepak Bola" },
    { id: "cabang_olahraga", name: "Cabang Olahraga" },
    { id: "merek_mobil", name: "Merek Mobil" },
    { id: "merek_motor", name: "Merek Motor" },
    { id: "profesi_cita_cita", name: "Cita-cita Masa Kecil" },
    { id: "alat_elektronik", name: "Barang Elektronik" },
    { id: "karakter_disney", name: "Karakter Kartun / Disney" },
    { id: "superhero", name: "Karakter Superhero" },
    { id: "nama_sungai_gunung", name: "Nama Gunung / Sungai" },
    { id: "bumbu_dapur", name: "Bumbu Dapur" },
    { id: "sayuran", name: "Jenis Sayuran" },
    { id: "peralatan_rumah", name: "Perabot Rumah" },
    { id: "alat_tulis", name: "Alat Tulis Kantor" },
    { id: "organ_tubuh", name: "Organ Tubuh Manusia" },
    { id: "penyakit_ringan", name: "Nama Penyakit Ringan" },
    { id: "pakaian_aksesoris", name: "Pakaian & Aksesoris" },

    // --- Situasional & Nostalgia ---
    { id: "mainan_tradisional", name: "Mainan Masa Kecil / Jadul" },
    { id: "jajanan_jadul", name: "Jajanan Jadul 90s/2000s" },
    { id: "tontonan_hari_minggu", name: "Kartun Hari Minggu" },
    { id: "kegiatan_hari_minggu", name: "Kegiatan Hari Minggu" },
    { id: "alasan_menolak_cinta", name: "Alasan Nolak Penembak" },
    { id: "alasan_bolos", name: "Alasan Bolos Sekolah" },
    { id: "hadiah_ulang_tahun", name: "Kado Ulang Tahun Ideal" },
    { id: "barang_bawaan_camping", name: "Barang Bawaan Camping" },
    { id: "isi_dompet", name: "Isi Dompet Selain Uang" },
    { id: "suasana_hati", name: "Mood / Emosi Manusia" },
    { id: "genre_film", name: "Genre Film" },
    { id: "nama_planet", name: "Benda Langit / Astronomi" },
    { id: "mata_uang", name: "Mata Uang Negara" },
    { id: "provinsi_indo", name: "Provinsi di Indonesia" },
    { id: "suku_indo", name: "Suku di Indonesia" },
    { id: "lagu_daerah", name: "Lagu Daerah" },
    { id: "senjata_tradisional", name: "Senjata Tradisional" },
    { id: "rumah_adat", name: "Rumah Adat" },
    { id: "permainan_boardgame", name: "Board Game / Card Game" },
    { id: "peliharaan_populer", name: "Hewan Peliharaan" },
    { id: "tanaman_hias", name: "Tanaman Hias" },
    { id: "bunga", name: "Jenis Bunga" },
    { id: "unsur_kimia", name: "Unsur Kimia / Sains" },
    { id: "istilah_internet", name: "Istilah Komputer / Internet" },
    { id: "supermarket", name: "Nama Retail / Minimarket" },
    { id: "sepatu_lokal", name: "Brand Sepatu Lokal" },
    { id: "panggilan_sayang", name: "Panggilan Sayang Cringe" },
    { id: "tipe_mantan", name: "Tipe-Tipe Mantan" },
    { id: "tempat_wisata_alam", name: "Jenis Tempat Wisata Alam" },
    { id: "transportasi_umum", name: "Moda Transportasi Umum" }
];

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const elements = {
    themeToggle: $("#themeToggle"),
    categoryName: $("#categoryName"),
    categoryCard: $("#categoryCard"),
    categoryHint: $("#categoryHint"),
    letterGrid: $("#letterGrid"),
    letterHelp: $("#letterHelp"),
    roundStatus: $("#roundStatus"),
    roundMeter: $("#roundMeter"),
    meterLabel: $("#meterLabel"),
    meterFill: $("#meterFill"),
    timeRemaining: $("#timeRemaining"),
    shuffleButton: $("#shuffleButton"),
    cancelButton: $("#cancelButton"),
    durationInput: $("#durationInput"),
    durationPreview: $("#durationPreview"),
    randomCategoryToggle: $("#randomCategoryToggle"),
    manageCategories: $("#manageCategories"),
    categoryDialog: $("#categoryDialog"),
    categoryList: $("#categoryList"),
    categoryCount: $("#categoryCount"),
    addCategoryForm: $("#addCategoryForm"),
    newCategory: $("#newCategory"),
    timeUpOverlay: $("#timeUpOverlay"),
    nextRoundButton: $("#nextRoundButton"),
    backToBoardButton: $("#backToBoardButton"),
    toast: $("#toast"),
    themeMeta: $('meta[name="theme-color"]'),
  };

  let state = loadState();
  let timerFrame = null;
  let deadline = 0;
  let editingId = null;
  let toastTimer = null;

  function loadState() {
    const systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const fallback = {
      categories: DEFAULT_CATEGORIES.map((item) => ({ ...item })),
      selectedId: "makanan",
      duration: 30,
      theme: systemDark ? "dark" : "light",
      randomCategory: true,
      letters: ["A", "X", "R", "T", "W", "Y"],
      playing: false,
    };

    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || !Array.isArray(saved.categories) || saved.categories.length === 0) return fallback;

      const categories = saved.categories
        .filter((item) => item && typeof item.id === "string" && typeof item.name === "string")
        .map((item) => ({ id: item.id, name: item.name.trim().slice(0, 32) }))
        .filter((item) => item.name);

      if (!categories.length) return fallback;

      const selectedId = categories.some((item) => item.id === saved.selectedId)
        ? saved.selectedId
        : categories[0].id;

      return {
        categories,
        selectedId,
        duration: clampDuration(saved.duration),
        theme: saved.theme === "dark" ? "dark" : "light",
        randomCategory: saved.randomCategory !== false,
        letters: ["A", "X", "R", "T", "W", "Y"],
        playing: false,
      };
    } catch (error) {
      return fallback;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          categories: state.categories,
          selectedId: state.selectedId,
          duration: state.duration,
          theme: state.theme,
          randomCategory: state.randomCategory,
        }),
      );
    } catch (error) {
      showToast("Pengaturan tidak dapat disimpan pada browser ini.");
    }
  }

  function clampDuration(value) {
    const parsed = Math.round(Number(value));
    if (!Number.isFinite(parsed)) return 30;
    return Math.min(300, Math.max(5, parsed));
  }

  function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return `category-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function currentCategory() {
    return state.categories.find((item) => item.id === state.selectedId) || state.categories[0];
  }

  function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function generateLetters() {
    const pool = [...LETTERS];
    for (let index = pool.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [pool[index], pool[randomIndex]] = [pool[randomIndex], pool[index]];
    }
    return pool.slice(0, 6);
  }

  function renderTheme() {
    document.documentElement.dataset.theme = state.theme;
    elements.themeToggle.setAttribute(
      "aria-label",
      state.theme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap",
    );
    elements.themeMeta.setAttribute("content", state.theme === "dark" ? "#111318" : "#f4f1e9");
  }

  function renderLetters(animate) {
    elements.letterGrid.replaceChildren();
    state.letters.forEach((letter, index) => {
      const button = document.createElement("button");
      button.className = "letter-card";
      button.type = "button";
      button.dataset.number = String(index + 1).padStart(2, "0");
      button.dataset.index = String(index);
      button.textContent = letter;
      button.disabled = state.playing;
      button.setAttribute("aria-label", `Huruf ${letter}. Ketuk untuk mengacak ulang.`);
      if (animate) button.classList.add("shuffling");
      elements.letterGrid.appendChild(button);
    });

    if (animate) {
      window.setTimeout(() => {
        $$(".letter-card").forEach((card) => card.classList.remove("shuffling"));
      }, 360);
    }
  }

  function renderBoard() {
    const category = currentCategory();
    elements.categoryName.textContent = category.name;
    elements.durationInput.value = String(state.duration);
    elements.durationPreview.textContent = String(state.duration);
    elements.randomCategoryToggle.checked = state.randomCategory;

    $$("[data-time]").forEach((button) => {
      button.classList.toggle("active", Number(button.dataset.time) === state.duration);
      button.disabled = state.playing;
    });

    elements.durationInput.disabled = state.playing;
    elements.randomCategoryToggle.disabled = state.playing;
    elements.categoryCard.disabled = state.playing;
    elements.manageCategories.disabled = state.playing;
    elements.shuffleButton.classList.toggle("is-hidden", state.playing);
    elements.cancelButton.classList.toggle("is-hidden", !state.playing);
    elements.roundStatus.classList.toggle("playing", state.playing);
    elements.roundStatus.lastChild.textContent = state.playing ? "Ronde berlangsung" : "Siap bermain";
    elements.letterHelp.textContent = state.playing
      ? "Sebutkan jawaban sebelum waktu habis"
      : "Ketuk kartu untuk mengacak satu huruf";
    elements.meterLabel.textContent = state.playing ? "Waktu tersisa" : "Durasi ronde";

    if (!state.playing) updateTimerDisplay(state.duration, 1);
    renderLetters(false);
  }

  function updateTimerDisplay(seconds, ratio) {
    const safeRatio = Math.max(0, Math.min(1, ratio));
    elements.timeRemaining.textContent = String(Math.max(0, seconds));
    elements.meterFill.style.transform = `scaleX(${safeRatio})`;
    elements.roundMeter.classList.toggle("urgent", state.playing && safeRatio <= 0.25);
  }

  function startRound() {
    if (state.playing) return;

    elements.timeUpOverlay.hidden = true;

    if (state.randomCategory && state.categories.length > 1) {
      const alternatives = state.categories.filter((item) => item.id !== state.selectedId);
      state.selectedId = randomItem(alternatives).id;
    }

    state.letters = generateLetters();
    state.playing = true;
    deadline = performance.now() + state.duration * 1000;
    saveState();
    renderBoard();
    renderLetters(true);
    updateTimerDisplay(state.duration, 1);

    cancelAnimationFrame(timerFrame);
    timerFrame = requestAnimationFrame(tick);
  }

  function tick(now) {
    if (!state.playing) return;
    const remainingMilliseconds = Math.max(0, deadline - now);
    const seconds = Math.ceil(remainingMilliseconds / 1000);
    const ratio = remainingMilliseconds / (state.duration * 1000);
    updateTimerDisplay(seconds, ratio);

    if (remainingMilliseconds <= 0) {
      finishRound();
      return;
    }
    timerFrame = requestAnimationFrame(tick);
  }

  function finishRound() {
    cancelAnimationFrame(timerFrame);
    state.playing = false;
    renderBoard();
    updateTimerDisplay(0, 0);
    elements.timeUpOverlay.hidden = false;
    elements.nextRoundButton.focus();
  }

  function cancelRound(showMessage = true) {
    if (!state.playing) return;
    cancelAnimationFrame(timerFrame);
    state.playing = false;
    renderBoard();
    if (showMessage) showToast("Ronde dibatalkan.");
  }

  function cycleCategory() {
    if (state.playing) return;
    const index = state.categories.findIndex((item) => item.id === state.selectedId);
    state.selectedId = state.categories[(index + 1) % state.categories.length].id;
    saveState();
    renderBoard();
  }

  function rerollLetter(index) {
    if (state.playing) return;
    const used = new Set(state.letters.filter((_, letterIndex) => letterIndex !== index));
    const choices = LETTERS.filter((letter) => !used.has(letter) && letter !== state.letters[index]);
    state.letters[index] = randomItem(choices);
    renderLetters(false);
    const card = elements.letterGrid.querySelector(`[data-index="${index}"]`);
    if (card) {
      card.classList.add("shuffling");
      window.setTimeout(() => card.classList.remove("shuffling"), 360);
    }
  }

  function setDuration(value) {
    if (state.playing) return;
    state.duration = clampDuration(value);
    saveState();
    renderBoard();
  }

  function normalizeName(value) {
    return value.trim().replace(/\s+/g, " ").slice(0, 32);
  }

  function isDuplicateCategory(name, exceptId) {
    return state.categories.some(
      (item) => item.id !== exceptId && item.name.toLocaleLowerCase("id") === name.toLocaleLowerCase("id"),
    );
  }

  function icon(path) {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"></path></svg>`;
  }

  function renderCategoryList() {
    elements.categoryList.replaceChildren();
    elements.categoryCount.textContent = String(state.categories.length);

    state.categories.forEach((category) => {
      const row = document.createElement("div");
      row.className = `category-item${category.id === state.selectedId ? " selected" : ""}`;

      if (editingId === category.id) {
        const form = document.createElement("form");
        form.className = "edit-row";
        form.dataset.id = category.id;

        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 32;
        input.value = category.name;
        input.required = true;
        input.setAttribute("aria-label", "Ubah nama kategori");

        const save = document.createElement("button");
        save.type = "submit";
        save.textContent = "Simpan";

        const cancel = document.createElement("button");
        cancel.type = "button";
        cancel.className = "cancel-edit";
        cancel.textContent = "Batal";
        cancel.addEventListener("click", () => {
          editingId = null;
          renderCategoryList();
        });

        form.append(input, save, cancel);
        form.addEventListener("submit", (event) => {
          event.preventDefault();
          updateCategory(category.id, input.value);
        });
        row.appendChild(form);
        elements.categoryList.appendChild(row);
        window.setTimeout(() => input.select(), 0);
        return;
      }

      const select = document.createElement("button");
      select.type = "button";
      select.className = "category-select";
      select.textContent = category.name;
      select.addEventListener("click", () => {
        state.selectedId = category.id;
        saveState();
        renderBoard();
        elements.categoryDialog.close();
        showToast(`Kategori dipilih: ${category.name}`);
      });

      const actions = document.createElement("div");
      actions.className = "item-actions";

      const edit = document.createElement("button");
      edit.type = "button";
      edit.setAttribute("aria-label", `Ubah kategori ${category.name}`);
      edit.innerHTML = icon("M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z");
      edit.addEventListener("click", () => {
        editingId = category.id;
        renderCategoryList();
      });

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "delete";
      remove.setAttribute("aria-label", `Hapus kategori ${category.name}`);
      remove.innerHTML = icon("M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5");
      remove.addEventListener("click", () => deleteCategory(category.id));

      actions.append(edit, remove);
      row.append(select, actions);
      elements.categoryList.appendChild(row);
    });
  }

  function addCategory(rawName) {
    const name = normalizeName(rawName);
    if (!name) return;
    if (isDuplicateCategory(name)) {
      showToast("Kategori tersebut sudah ada.");
      return;
    }

    const category = { id: createId(), name };
    state.categories.push(category);
    state.selectedId = category.id;
    saveState();
    renderBoard();
    renderCategoryList();
    elements.newCategory.value = "";
    elements.newCategory.focus();
    showToast(`Kategori ${name} ditambahkan.`);
  }

  function updateCategory(id, rawName) {
    const name = normalizeName(rawName);
    if (!name) {
      showToast("Nama kategori tidak boleh kosong.");
      return;
    }
    if (isDuplicateCategory(name, id)) {
      showToast("Kategori tersebut sudah ada.");
      return;
    }

    const category = state.categories.find((item) => item.id === id);
    if (!category) return;
    category.name = name;
    editingId = null;
    saveState();
    renderBoard();
    renderCategoryList();
    showToast("Nama kategori diperbarui.");
  }

  function deleteCategory(id) {
    if (state.categories.length === 1) {
      showToast("Minimal satu kategori harus tersedia.");
      return;
    }

    const category = state.categories.find((item) => item.id === id);
    if (!category) return;
    const approved = window.confirm(`Hapus kategori “${category.name}”?`);
    if (!approved) return;

    state.categories = state.categories.filter((item) => item.id !== id);
    if (state.selectedId === id) state.selectedId = state.categories[0].id;
    saveState();
    renderBoard();
    renderCategoryList();
    showToast(`Kategori ${category.name} dihapus.`);
  }

  function openCategoryDialog() {
    if (state.playing) return;
    editingId = null;
    renderCategoryList();
    elements.categoryDialog.showModal();
    window.setTimeout(() => elements.newCategory.focus(), 0);
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    elements.toast.textContent = message;
    elements.toast.classList.add("show");
    toastTimer = window.setTimeout(() => elements.toast.classList.remove("show"), 2400);
  }

  elements.themeToggle.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    saveState();
    renderTheme();
  });

  elements.categoryCard.addEventListener("click", cycleCategory);
  elements.shuffleButton.addEventListener("click", startRound);
  elements.cancelButton.addEventListener("click", () => cancelRound(true));
  elements.manageCategories.addEventListener("click", openCategoryDialog);

  elements.letterGrid.addEventListener("click", (event) => {
    const card = event.target.closest(".letter-card");
    if (!card) return;
    rerollLetter(Number(card.dataset.index));
  });

  $$("[data-time]").forEach((button) => {
    button.addEventListener("click", () => setDuration(button.dataset.time));
  });

  elements.durationInput.addEventListener("change", () => setDuration(elements.durationInput.value));
  elements.durationInput.addEventListener("blur", () => {
    elements.durationInput.value = String(state.duration);
  });

  elements.randomCategoryToggle.addEventListener("change", () => {
    state.randomCategory = elements.randomCategoryToggle.checked;
    saveState();
  });

  elements.addCategoryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addCategory(elements.newCategory.value);
  });

  $$('[data-close-dialog]').forEach((button) => {
    button.addEventListener("click", () => elements.categoryDialog.close());
  });

  elements.categoryDialog.addEventListener("click", (event) => {
    if (event.target !== elements.categoryDialog) return;
    const card = elements.categoryDialog.querySelector(".dialog-card");
    const box = card.getBoundingClientRect();
    const inside =
      event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom;
    if (!inside) elements.categoryDialog.close();
  });

  elements.nextRoundButton.addEventListener("click", () => {
    elements.timeUpOverlay.hidden = true;
    startRound();
  });

  elements.backToBoardButton.addEventListener("click", () => {
    elements.timeUpOverlay.hidden = true;
    updateTimerDisplay(state.duration, 1);
    elements.shuffleButton.focus();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!elements.timeUpOverlay.hidden) {
        elements.timeUpOverlay.hidden = true;
        updateTimerDisplay(state.duration, 1);
      } else if (state.playing) {
        cancelRound(true);
      }
      return;
    }

    const target = event.target;
    const isInteractive = target.closest("button, input, dialog");
    if (event.code === "Space" && !isInteractive && elements.timeUpOverlay.hidden && !state.playing) {
      event.preventDefault();
      startRound();
    }
  });

  renderTheme();
  renderBoard();
})();
