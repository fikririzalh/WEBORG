/* =========================================================
   CHILL COOK — game logic
   Vanilla JavaScript, tanpa backend, tanpa library eksternal.
   ========================================================= */

(() => {
  "use strict";

  const DATA = window.CHILL_COOK_DATA;
  if (!DATA) {
    document.body.innerHTML = "<p style='padding:24px'>Data game tidak ditemukan. Pastikan data.js berada di folder yang sama.</p>";
    return;
  }

  const STORAGE_KEY = "chillCookSave_v1";
  const MAX_LEVEL = DATA.restaurantLevels.length;
  const QUEUE_SIZE = 4;
  const FREE_MIX_SIZE = 5;
  const customerFaces = ["🧑", "👩", "👨", "🧒", "👵", "🧔", "👩‍🦱", "🧑‍🦰"];

  // Referensi elemen dikumpulkan sekali agar fungsi render tetap ringkas.
  const el = {
    coinCount: document.getElementById("coinCount"),
    levelCount: document.getElementById("levelCount"),
    comboCount: document.getElementById("comboCount"),
    soundToggle: document.getElementById("soundToggle"),
    themeToggle: document.getElementById("themeToggle"),
    orderQueue: document.getElementById("orderQueue"),
    customerAvatar: document.getElementById("customerAvatar"),
    customerMood: document.getElementById("customerMood"),
    customerMessage: document.getElementById("customerMessage"),
    activeDishEmoji: document.getElementById("activeDishEmoji"),
    activeDishName: document.getElementById("activeDishName"),
    activeReward: document.getElementById("activeReward"),
    progressCount: document.getElementById("progressCount"),
    ingredientGoal: document.getElementById("ingredientGoal"),
    requiredList: document.getElementById("requiredList"),
    progressTrack: document.getElementById("progressTrack"),
    progressFill: document.getElementById("progressFill"),
    progressSpark: document.getElementById("progressSpark"),
    plateEmpty: document.getElementById("plateEmpty"),
    plateItems: document.getElementById("plateItems"),
    undoButton: document.getElementById("undoButton"),
    orderModeTab: document.getElementById("orderModeTab"),
    freeModeTab: document.getElementById("freeModeTab"),
    orderMode: document.getElementById("orderMode"),
    freeMode: document.getElementById("freeMode"),
    freeItems: document.getElementById("freeItems"),
    freeCount: document.getElementById("freeCount"),
    clearFreeButton: document.getElementById("clearFreeButton"),
    pantryHint: document.getElementById("pantryHint"),
    ingredientGrid: document.getElementById("ingredientGrid"),
    successCard: document.getElementById("successCard"),
    successMessage: document.getElementById("successMessage"),
    restaurantName: document.getElementById("restaurantName"),
    levelCaption: document.getElementById("levelCaption"),
    xpText: document.getElementById("xpText"),
    xpFill: document.getElementById("xpFill"),
    xpTrack: document.querySelector(".xp-track"),
    levelBadge: document.querySelector(".level-badge"),
    nextUnlockCard: document.getElementById("nextUnlockCard"),
    nextUnlockEmoji: document.getElementById("nextUnlockEmoji"),
    nextUnlockName: document.getElementById("nextUnlockName"),
    nextUnlockLevel: document.getElementById("nextUnlockLevel"),
    collectionCount: document.getElementById("collectionCount"),
    collectionTotal: document.getElementById("collectionTotal"),
    collectionButton: document.getElementById("collectionButton"),
    statsButton: document.getElementById("statsButton"),
    helpButton: document.getElementById("helpButton"),
    collectionDialog: document.getElementById("collectionDialog"),
    statsDialog: document.getElementById("statsDialog"),
    helpDialog: document.getElementById("helpDialog"),
    collectionGrid: document.getElementById("collectionGrid"),
    statsGrid: document.getElementById("statsGrid"),
    resetButton: document.getElementById("resetButton"),
    toast: document.getElementById("toast"),
    confettiLayer: document.getElementById("confettiLayer")
  };

  const getPreferredTheme = () =>
    window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  const createDefaultState = () => ({
    coins: 0,
    level: 1,
    xp: 0,
    combo: 0,
    bestCombo: 0,
    collection: [],
    completedOrders: 0,
    totalCoinsEarned: 0,
    ingredientsTapped: 0,
    freeDishes: 0,
    queue: [],
    selectedIngredients: [],
    freeMix: [],
    mode: "order",
    theme: getPreferredTheme(),
    sound: true
  });

  const findOrder = (id) => DATA.orders.find((order) => order.id === id);
  const findIngredient = (id) => DATA.ingredients.find((ingredient) => ingredient.id === id);

  function loadState() {
    const defaults = createDefaultState();
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || typeof saved !== "object") return defaults;

      const merged = { ...defaults, ...saved };
      merged.coins = Math.max(0, Number(merged.coins) || 0);
      merged.level = Math.min(MAX_LEVEL, Math.max(1, Number(merged.level) || 1));
      merged.xp = Math.max(0, Number(merged.xp) || 0);
      merged.combo = Math.max(0, Number(merged.combo) || 0);
      merged.bestCombo = Math.max(0, Number(merged.bestCombo) || 0);
      merged.completedOrders = Math.max(0, Number(merged.completedOrders) || 0);
      merged.totalCoinsEarned = Math.max(0, Number(merged.totalCoinsEarned) || 0);
      merged.ingredientsTapped = Math.max(0, Number(merged.ingredientsTapped) || 0);
      merged.freeDishes = Math.max(0, Number(merged.freeDishes) || 0);
      merged.collection = Array.isArray(merged.collection)
        ? [...new Set(merged.collection)].filter((key) => DATA.dishes.some((dish) => dish.key === key))
        : [];
      merged.queue = Array.isArray(merged.queue)
        ? merged.queue
            .filter((id) => {
              const order = findOrder(id);
              return Boolean(order) && order.minimumLevel <= merged.level;
            })
            .slice(0, QUEUE_SIZE)
        : [];
      merged.selectedIngredients = Array.isArray(merged.selectedIngredients)
        ? merged.selectedIngredients.filter((id) => Boolean(findIngredient(id)))
        : [];
      merged.freeMix = Array.isArray(merged.freeMix)
        ? merged.freeMix
            .filter((id) => {
              const ingredient = findIngredient(id);
              return Boolean(ingredient) && ingredient.unlockLevel <= merged.level;
            })
            .slice(0, FREE_MIX_SIZE - 1)
        : [];
      merged.mode = merged.mode === "free" ? "free" : "order";
      merged.theme = merged.theme === "dark" ? "dark" : "light";
      merged.sound = merged.sound !== false;
      return merged;
    } catch (error) {
      return defaults;
    }
  }

  let state = loadState();
  let isTransitioning = false;
  let freeCompleting = false;
  let toastTimer = null;
  let successTimer = null;
  let audioContext = null;

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      // Game tetap dapat dimainkan jika penyimpanan browser tidak tersedia.
    }
  }

  function eligibleOrders() {
    return DATA.orders.filter((order) => order.minimumLevel <= state.level);
  }

  function randomItem(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function fillQueue() {
    const pool = eligibleOrders();
    while (state.queue.length < QUEUE_SIZE && pool.length) {
      const unused = pool.filter((order) => !state.queue.includes(order.id));
      const choice = randomItem(unused.length ? unused : pool);
      state.queue.push(choice.id);
    }
  }

  function ingredientCounts(list) {
    return list.reduce((counts, id) => {
      counts[id] = (counts[id] || 0) + 1;
      return counts;
    }, {});
  }

  function validateActiveSelection() {
    const activeOrder = findOrder(state.queue[0]);
    if (!activeOrder) {
      state.selectedIngredients = [];
      return;
    }
    const needs = ingredientCounts(activeOrder.daftarBahan);
    const accepted = [];
    state.selectedIngredients.forEach((id) => {
      const alreadyUsed = accepted.filter((item) => item === id).length;
      if (alreadyUsed < (needs[id] || 0)) accepted.push(id);
    });
    state.selectedIngredients = accepted;
  }

  function currentOrder() {
    return findOrder(state.queue[0]);
  }

  function xpNeeded(level = state.level) {
    return level >= MAX_LEVEL ? 1 : 3 + level * 2;
  }

  function renderTheme() {
    document.documentElement.dataset.theme = state.theme;
    document.querySelector('meta[name="theme-color"]').content = state.theme === "dark" ? "#171629" : "#fff7df";
    el.themeToggle.innerHTML = `<span aria-hidden="true">${state.theme === "dark" ? "☀️" : "🌙"}</span>`;
    el.themeToggle.setAttribute(
      "aria-label",
      state.theme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap"
    );
    el.soundToggle.innerHTML = `<span aria-hidden="true">${state.sound ? "🔊" : "🔇"}</span>`;
    el.soundToggle.setAttribute("aria-label", state.sound ? "Matikan suara" : "Nyalakan suara");
  }

  function renderStatus() {
    el.coinCount.textContent = Math.floor(state.coins).toLocaleString("id-ID");
    el.levelCount.textContent = state.level;
    el.comboCount.textContent = `x${state.combo}`;
    el.collectionCount.textContent = state.collection.length;
    el.collectionTotal.textContent = DATA.dishes.length;
  }

  function renderQueue() {
    el.orderQueue.innerHTML = state.queue
      .map((id, index) => {
        const order = findOrder(id);
        const status = index === 0 ? "active" : "locked";
        return `
          <article class="order-card ${status}" ${index === 0 ? 'aria-current="true"' : ""}>
            <span class="order-number">#${index + 1}</span>
            <div class="order-food" aria-hidden="true">${order.emoji}</div>
            <div class="order-info">
              <strong title="${order.namaMakanan}">${order.namaMakanan}</strong>
              <small>${order.jumlahBahan} bahan · ${order.reward} 🪙</small>
            </div>
            <span class="order-mood" aria-label="Mood pelanggan ${order.moodPelanggan}">${order.moodPelanggan}</span>
          </article>`;
      })
      .join("");
  }

  function renderActiveOrder() {
    const order = currentOrder();
    if (!order) return;

    const selectedCount = state.selectedIngredients.length;
    const percentage = Math.min(100, (selectedCount / order.jumlahBahan) * 100);
    const selectedCounts = ingredientCounts(state.selectedIngredients);
    const chipSeen = {};
    const faceIndex = Number(order.id.replace(/\D/g, "")) % customerFaces.length;

    el.customerAvatar.textContent = customerFaces[faceIndex];
    el.customerMood.textContent = selectedCount === order.jumlahBahan ? "🤩💛" : selectedCount ? "😋✨" : order.moodPelanggan;
    el.customerMessage.textContent = selectedCount
      ? selectedCount === order.jumlahBahan
        ? "Wah, kelihatannya sempurna!"
        : "Aromanya mulai terasa..."
      : "Aku siap memesan!";
    el.activeDishEmoji.textContent = order.emoji;
    el.activeDishName.textContent = order.namaMakanan;
    el.activeReward.textContent = order.reward;
    el.progressCount.textContent = selectedCount;
    el.ingredientGoal.textContent = order.jumlahBahan;

    el.requiredList.innerHTML = order.daftarBahan
      .map((ingredientId) => {
        const ingredient = findIngredient(ingredientId);
        chipSeen[ingredientId] = (chipSeen[ingredientId] || 0) + 1;
        const done = chipSeen[ingredientId] <= (selectedCounts[ingredientId] || 0);
        return `<span class="required-chip ${done ? "done" : ""}">
          <span aria-hidden="true">${done ? "✓" : ingredient.emoji}</span> ${ingredient.name}
        </span>`;
      })
      .join("");

    el.progressTrack.setAttribute("aria-valuemax", order.jumlahBahan);
    el.progressTrack.setAttribute("aria-valuenow", selectedCount);
    el.progressFill.style.width = `${percentage}%`;
    el.progressSpark.style.left = `${percentage}%`;
    el.progressSpark.style.opacity = selectedCount ? "1" : "0";
    el.plateEmpty.hidden = selectedCount > 0;
    el.plateItems.innerHTML = state.selectedIngredients
      .map((id) => `<span class="plate-item" aria-label="${findIngredient(id).name}">${findIngredient(id).emoji}</span>`)
      .join("");
    el.undoButton.disabled = selectedCount === 0 || isTransitioning;
  }

  function renderIngredients() {
    const order = currentOrder();
    const requiredCounts = ingredientCounts(order?.daftarBahan || []);
    const selectedCounts = ingredientCounts(state.selectedIngredients);
    const unlocked = DATA.ingredients.filter((ingredient) => ingredient.unlockLevel <= state.level);

    el.ingredientGrid.innerHTML = unlocked
      .map((ingredient) => {
        const stillNeeded =
          state.mode === "order" && (requiredCounts[ingredient.id] || 0) > (selectedCounts[ingredient.id] || 0);
        return `
          <button
            class="ingredient-button ${stillNeeded ? "match" : ""}"
            type="button"
            data-ingredient-id="${ingredient.id}"
            aria-label="Pilih ${ingredient.name}${stillNeeded ? ", cocok untuk resep" : ""}"
            ${isTransitioning || freeCompleting ? "disabled" : ""}
          >
            <span class="ingredient-emoji" aria-hidden="true">${ingredient.emoji}</span>
            <span class="ingredient-name">${ingredient.name}</span>
          </button>`;
      })
      .join("");
  }

  function renderMode() {
    const isFree = state.mode === "free";
    el.orderMode.hidden = isFree;
    el.freeMode.hidden = !isFree;
    el.orderModeTab.classList.toggle("active", !isFree);
    el.freeModeTab.classList.toggle("active", isFree);
    el.orderModeTab.setAttribute("aria-selected", String(!isFree));
    el.freeModeTab.setAttribute("aria-selected", String(isFree));
    el.orderModeTab.tabIndex = isFree ? -1 : 0;
    el.freeModeTab.tabIndex = isFree ? 0 : -1;
    el.pantryHint.textContent = isFree
      ? "Semua bahan boleh berteman 🌈"
      : "Bahan yang pas akan berkilau ✨";
  }

  function renderFreeMix() {
    el.freeCount.textContent = state.freeMix.length;
    el.freeItems.innerHTML = state.freeMix
      .map((id) => `<span class="plate-item" title="${findIngredient(id).name}">${findIngredient(id).emoji}</span>`)
      .join("");
    el.clearFreeButton.disabled = state.freeMix.length === 0 || freeCompleting;
  }

  function renderGrowth() {
    const profile = DATA.restaurantLevels[Math.min(state.level - 1, DATA.restaurantLevels.length - 1)];
    const needed = xpNeeded();
    const isMax = state.level >= MAX_LEVEL;
    const percentage = isMax ? 100 : Math.min(100, (state.xp / needed) * 100);
    const nextUnlock = DATA.unlockGroups.find((group) => group.level > state.level);

    el.restaurantName.textContent = profile.name;
    el.levelCaption.textContent = profile.caption;
    el.levelBadge.textContent = profile.icon;
    el.xpText.textContent = isMax ? "MAX" : `${state.xp}/${needed}`;
    el.xpFill.style.width = `${percentage}%`;
    el.xpTrack.setAttribute("aria-valuemax", isMax ? 1 : needed);
    el.xpTrack.setAttribute("aria-valuenow", isMax ? 1 : state.xp);

    if (nextUnlock) {
      el.nextUnlockEmoji.textContent = nextUnlock.emoji;
      el.nextUnlockName.textContent = nextUnlock.name;
      el.nextUnlockLevel.textContent = `Terbuka di level ${nextUnlock.level}`;
    } else {
      el.nextUnlockEmoji.textContent = "💛";
      el.nextUnlockName.textContent = "Semua menu terbuka";
      el.nextUnlockLevel.textContent = "Terus masak sesukamu";
    }
  }

  function renderCollection() {
    el.collectionGrid.innerHTML = DATA.dishes
      .map((dish) => {
        const found = state.collection.includes(dish.key);
        return `<div class="collection-item ${found ? "" : "locked"}">
          <span aria-hidden="true">${found ? dish.emoji : "❔"}</span>
          <small>${found ? dish.name : "Belum ditemukan"}</small>
        </div>`;
      })
      .join("");
  }

  function renderStats() {
    const stats = [
      ["Pesanan selesai", state.completedOrders.toLocaleString("id-ID")],
      ["Total koin didapat", `${state.totalCoinsEarned.toLocaleString("id-ID")} 🪙`],
      ["Combo terbaik", `x${state.bestCombo}`],
      ["Kreasi dapur bebas", state.freeDishes.toLocaleString("id-ID")],
      ["Bahan diklik", state.ingredientsTapped.toLocaleString("id-ID")],
      ["Koleksi ditemukan", `${state.collection.length}/${DATA.dishes.length}`]
    ];
    el.statsGrid.innerHTML = stats
      .map(([label, value]) => `<div class="stat-tile"><span>${label}</span><strong>${value}</strong></div>`)
      .join("");
  }

  function renderAll() {
    renderTheme();
    renderStatus();
    renderQueue();
    renderActiveOrder();
    renderMode();
    renderFreeMix();
    renderIngredients();
    renderGrowth();
    renderCollection();
    renderStats();
  }

  function showToast(message) {
    el.toast.textContent = message;
    el.toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => el.toast.classList.remove("show"), 1800);
  }

  function playTone(type = "tap") {
    if (!state.sound) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === "suspended") audioContext.resume();

      const notes = type === "success" ? [523.25, 659.25, 783.99] : type === "soft" ? [260] : [390];
      notes.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const start = audioContext.currentTime + index * 0.075;
        oscillator.type = type === "success" ? "sine" : "triangle";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(type === "success" ? 0.08 : 0.035, start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(start);
        oscillator.stop(start + 0.18);
      });
    } catch (error) {
      // Audio hanya bonus; browser lama tetap dapat menjalankan seluruh game.
    }
  }

  function animateButton(button, className = "pressed") {
    button.classList.remove(className);
    void button.offsetWidth;
    button.classList.add(className);
    window.setTimeout(() => button.classList.remove(className), 360);
  }

  function burstConfetti() {
    const colors = ["#7657d6", "#39b7a2", "#ffd45c", "#ff8b4a", "#ff6f91"];
    const amount = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? 8 : 28;
    for (let index = 0; index < amount; index += 1) {
      const particle = document.createElement("span");
      particle.className = "confetti";
      const angle = (Math.PI * 2 * index) / amount + Math.random() * 0.4;
      const distance = 120 + Math.random() * 260;
      particle.style.background = colors[index % colors.length];
      particle.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
      particle.style.setProperty("--y", `${Math.sin(angle) * distance + 90}px`);
      particle.style.setProperty("--r", `${Math.round(Math.random() * 680 - 340)}deg`);
      particle.style.animationDelay = `${Math.random() * 80}ms`;
      el.confettiLayer.appendChild(particle);
      window.setTimeout(() => particle.remove(), 1100);
    }
  }

  function showSuccess(message) {
    el.successMessage.textContent = message;
    el.successCard.setAttribute("aria-hidden", "false");
    el.successCard.classList.remove("show");
    void el.successCard.offsetWidth;
    el.successCard.classList.add("show");
    window.clearTimeout(successTimer);
    successTimer = window.setTimeout(() => {
      el.successCard.classList.remove("show");
      el.successCard.setAttribute("aria-hidden", "true");
    }, 1080);
  }

  function addXp(amount = 1) {
    if (state.level >= MAX_LEVEL) return null;
    state.xp += amount;
    let leveledUpTo = null;
    while (state.level < MAX_LEVEL && state.xp >= xpNeeded(state.level)) {
      state.xp -= xpNeeded(state.level);
      state.level += 1;
      leveledUpTo = state.level;
      const levelGift = 20 * state.level;
      state.coins += levelGift;
      state.totalCoinsEarned += levelGift;
    }
    if (state.level >= MAX_LEVEL) state.xp = 0;
    return leveledUpTo;
  }

  function addToCollection(dishKey) {
    if (state.collection.includes(dishKey)) return false;
    state.collection.push(dishKey);
    return true;
  }

  function handleOrderIngredient(ingredientId, button) {
    if (isTransitioning) return;
    const order = currentOrder();
    if (!order) return;

    state.ingredientsTapped += 1;
    const needed = ingredientCounts(order.daftarBahan);
    const selected = ingredientCounts(state.selectedIngredients);

    if ((selected[ingredientId] || 0) < (needed[ingredientId] || 0)) {
      state.selectedIngredients.push(ingredientId);
      animateButton(button);
      playTone("tap");
      saveState();
      renderActiveOrder();
      renderIngredients();

      if (state.selectedIngredients.length >= order.jumlahBahan) {
        completeOrder();
      }
      return;
    }

    animateButton(button, "wrong");
    playTone("soft");
    saveState();
    renderStats();
    showToast("Bahan ini tidak diperlukan—tenang, tidak ada penalti 💛");
  }

  function completeOrder() {
    const order = currentOrder();
    if (!order || isTransitioning) return;
    isTransitioning = true;

    state.combo += 1;
    state.bestCombo = Math.max(state.bestCombo, state.combo);
    const comboBonus = Math.min(10, Math.max(0, state.combo - 1)) * 3;
    const earned = order.reward + comboBonus;
    state.coins += earned;
    state.totalCoinsEarned += earned;
    state.completedOrders += 1;
    const isNewDish = addToCollection(order.dishKey);
    const leveledUpTo = addXp(1);

    el.customerAvatar.classList.add("happy");
    playTone("success");
    burstConfetti();
    const messages = [
      `+${earned} koin${comboBonus ? ` · bonus combo +${comboBonus}` : ""}`,
      isNewDish ? `${order.baseName} masuk koleksi baru!` : null,
      leveledUpTo ? `Level ${leveledUpTo} terbuka!` : null
    ].filter(Boolean);
    showSuccess(messages.join(" · "));
    saveState();
    renderAll();

    window.setTimeout(() => {
      state.queue.shift();
      state.selectedIngredients = [];
      fillQueue();
      isTransitioning = false;
      el.customerAvatar.classList.remove("happy");
      saveState();
      renderAll();
      if (leveledUpTo) showToast(`Naik level! Menu level ${leveledUpTo} kini tersedia 🎉`);
    }, 1120);
  }

  function handleFreeIngredient(ingredientId, button) {
    if (freeCompleting) return;
    state.ingredientsTapped += 1;
    state.freeMix.push(ingredientId);
    animateButton(button);
    playTone("tap");
    saveState();
    renderFreeMix();
    renderStats();

    if (state.freeMix.length >= FREE_MIX_SIZE) completeFreeDish();
  }

  function completeFreeDish() {
    if (freeCompleting) return;
    freeCompleting = true;
    const pool = DATA.dishes.filter((dish) =>
      dish.ingredients.every((ingredientId) => findIngredient(ingredientId).unlockLevel <= state.level)
    );
    const surprise = randomItem(pool);
    const uniqueIngredients = new Set(state.freeMix).size;
    const earned = 5 + uniqueIngredients;
    state.coins += earned;
    state.totalCoinsEarned += earned;
    state.freeDishes += 1;
    const isNewDish = addToCollection(surprise.key);
    saveState();
    playTone("success");
    burstConfetti();
    showSuccess(`${surprise.emoji} ${surprise.name}! +${earned} koin${isNewDish ? " · koleksi baru" : ""}`);
    renderAll();

    window.setTimeout(() => {
      state.freeMix = [];
      freeCompleting = false;
      saveState();
      renderAll();
    }, 1120);
  }

  function setMode(mode) {
    state.mode = mode === "free" ? "free" : "order";
    saveState();
    renderMode();
    renderIngredients();
    playTone("soft");
  }

  function openDialog(dialog) {
    renderCollection();
    renderStats();
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function closeDialog(dialog) {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  // Event delegation menjaga puluhan tombol bahan tetap ringan.
  el.ingredientGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-ingredient-id]");
    if (!button || button.disabled) return;
    const ingredientId = button.dataset.ingredientId;
    if (state.mode === "free") handleFreeIngredient(ingredientId, button);
    else handleOrderIngredient(ingredientId, button);
  });

  el.undoButton.addEventListener("click", () => {
    if (!state.selectedIngredients.length || isTransitioning) return;
    const removed = state.selectedIngredients.pop();
    saveState();
    renderActiveOrder();
    renderIngredients();
    playTone("soft");
    showToast(`${findIngredient(removed).emoji} ${findIngredient(removed).name} dikembalikan ke pantry`);
  });

  el.clearFreeButton.addEventListener("click", () => {
    if (!state.freeMix.length || freeCompleting) return;
    state.freeMix = [];
    saveState();
    renderFreeMix();
    playTone("soft");
  });

  el.orderModeTab.addEventListener("click", () => setMode("order"));
  el.freeModeTab.addEventListener("click", () => setMode("free"));

  el.themeToggle.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    saveState();
    renderTheme();
    playTone("soft");
  });

  el.soundToggle.addEventListener("click", () => {
    state.sound = !state.sound;
    saveState();
    renderTheme();
    if (state.sound) playTone("tap");
    showToast(state.sound ? "Suara lembut dinyalakan 🔊" : "Suara dimatikan 🔇");
  });

  el.collectionButton.addEventListener("click", () => openDialog(el.collectionDialog));
  el.statsButton.addEventListener("click", () => openDialog(el.statsDialog));
  el.helpButton.addEventListener("click", () => openDialog(el.helpDialog));

  document.querySelectorAll("[data-close-dialog]").forEach((button) => {
    button.addEventListener("click", () => closeDialog(button.closest("dialog")));
  });

  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeDialog(dialog);
    });
  });

  el.resetButton.addEventListener("click", () => {
    const confirmed = window.confirm("Mulai lagi dari awal? Koin, level, koleksi, combo, dan statistik akan dihapus.");
    if (!confirmed) return;
    const preferences = { theme: state.theme, sound: state.sound };
    state = { ...createDefaultState(), ...preferences };
    fillQueue();
    saveState();
    closeDialog(el.statsDialog);
    renderAll();
    showToast("Dapur baru siap. Selamat memasak! 🍳");
  });

  // Memulai antrean dan memperbaiki save lama bila diperlukan.
  fillQueue();
  validateActiveSelection();
  saveState();
  renderAll();
})();
