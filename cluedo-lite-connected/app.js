"use strict";

const STORAGE_KEY = "cluecat_cluedo_lite_v2";
const LEGACY_KEY = "cluecat_tracker_lite_v1";
const THEME_KEY = "cluecat_theme_v1";
const COLORS = { suspect: "#6674f4", weapon: "#ff9f5a", place: "#47c7de" };
const ROLE_META = {
  place: { name: "Place", icon: "⌖", singular: "place" },
  suspect: { name: "Suspect", icon: "👤", singular: "suspect" },
  weapon: { name: "Weapon", icon: "◆", singular: "weapon" }
};
const PLAYER_STATES = ["", "owned", "not_owned", "maybe", "mine"];
const CASE_STATES = ["", "candidate", "ruled_out"];
const SYMBOLS = { "": "", owned: "✓", not_owned: "✕", maybe: "?", mine: "●", candidate: "★", ruled_out: "✕" };

let state = loadState();
let selectedQuickTool = null;
let activeSuggestionId = null;
let confirmAction = null;
let toastTimer = null;

const el = {};

document.addEventListener("DOMContentLoaded", init);

function init() {
  cacheElements();
  applySavedTheme();
  bindGlobalEvents();
  navigateFromHash();
  renderAll();
}

function cacheElements() {
  const ids = [
    "themeToggle", "themeIcon", "exportBtn", "importInput", "newGameBtn", "toast",
    "trackerContainer", "playerCount", "knownStat", "candidateStat", "unknownStat", "filledStat",
    "progressBar", "progressPercent", "progressCaption", "notesEmpty", "notesContent", "noteCategory",
    "noteTitle", "noteStatus", "noteText", "deductionHint", "activeToolNotice", "closeNotesBtn",
    "markCandidateBtn", "clearRowBtn", "clearSelectionBtn",
    "placeSelect", "suspectSelect", "weaponSelect", "suggestionAsker", "createSuggestionBtn",
    "selectionPreview", "resultEmpty", "resultContent", "closeResultBtn", "activeSuggestionSummary",
    "refuterSelect", "shownCardField", "shownCardSelect", "passedPlayers", "saveResultBtn",
    "suggestionHistory", "clearHistoryBtn", "suggestionTotalStat", "suggestionRefutedStat",
    "suggestionNoneStat", "suggestionPendingStat", "cardManagerGrid", "cardsTotalCount",
    "restoreDefaultsBtn", "cardModal", "cardModalEyebrow", "cardModalTitle", "cardForm",
    "cardRoleInput", "cardIdInput", "cardNameInput", "confirmModal", "confirmIcon", "confirmTitle",
    "confirmMessage", "confirmActionBtn"
  ];
  ids.forEach(function (id) { el[id] = document.getElementById(id); });
}

function bindGlobalEvents() {
  window.addEventListener("hashchange", navigateFromHash);
  el.themeToggle.addEventListener("click", toggleTheme);
  el.exportBtn.addEventListener("click", exportData);
  el.importInput.addEventListener("change", importData);
  el.newGameBtn.addEventListener("click", requestNewGame);
  el.confirmActionBtn.addEventListener("click", runConfirmedAction);

  document.querySelectorAll("[data-close-modal]").forEach(function (button) {
    button.addEventListener("click", function () { closeModal(button.dataset.closeModal); });
  });
  document.querySelectorAll(".modal-backdrop").forEach(function (backdrop) {
    backdrop.addEventListener("click", function (event) {
      if (event.target === backdrop) closeModal(backdrop.id);
    });
  });
  document.querySelectorAll(".go-cards-btn").forEach(function (button) {
    button.addEventListener("click", function () { location.hash = "cards"; });
  });
  document.querySelectorAll(".go-suggestion-btn").forEach(function (button) {
    button.addEventListener("click", function () { location.hash = "suggestion"; });
  });

  el.playerCount.addEventListener("change", changePlayerCount);
  el.closeNotesBtn.addEventListener("click", closeNotes);
  el.noteText.addEventListener("input", saveNote);
  el.markCandidateBtn.addEventListener("click", markSelectedCandidate);
  el.clearRowBtn.addEventListener("click", clearSelectedRow);
  el.clearSelectionBtn.addEventListener("click", function () { setQuickTool(""); });
  document.querySelectorAll(".legend-item[data-legend-state]").forEach(function (button) {
    button.addEventListener("click", function () { setQuickTool(button.dataset.legendState); });
  });

  [el.placeSelect, el.suspectSelect, el.weaponSelect, el.suggestionAsker].forEach(function (select) {
    select.addEventListener("change", renderSelectionPreview);
  });
  el.createSuggestionBtn.addEventListener("click", createSuggestion);
  el.closeResultBtn.addEventListener("click", closeResultPanel);
  el.refuterSelect.addEventListener("change", handleRefuterChange);
  el.saveResultBtn.addEventListener("click", saveSuggestionResult);
  el.clearHistoryBtn.addEventListener("click", requestClearHistory);

  el.restoreDefaultsBtn.addEventListener("click", requestRestoreDefaults);
  el.cardForm.addEventListener("submit", saveCardFromModal);

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    closeModal("cardModal");
    closeModal("confirmModal");
    closeNotes();
    closeResultPanel();
  });
}

function navigateFromHash() {
  const allowed = ["tracker", "suggestion", "cards"];
  const route = allowed.includes(location.hash.slice(1)) ? location.hash.slice(1) : "tracker";
  if (location.hash !== `#${route}`) history.replaceState(null, "", `#${route}`);
  document.querySelectorAll(".route-view").forEach(function (view) {
    view.classList.toggle("hidden", view.dataset.view !== route);
  });
  document.querySelectorAll(".nav-btn[data-route]").forEach(function (button) {
    button.classList.toggle("active", button.dataset.route === route);
  });
  if (route === "tracker") renderTrackerModule();
  if (route === "suggestion") renderSuggestionModule();
  if (route === "cards") renderCardsModule();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function uid(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function defaultItems(role, count) {
  const title = ROLE_META[role].name;
  return Array.from({ length: count }, function (_, index) {
    return { id: uid(role), name: `${title} ${index + 1}` };
  });
}

function createDefaultState() {
  return {
    version: 2,
    playerCount: 4,
    players: Array.from({ length: 6 }, function (_, index) { return { id: `p${index + 1}`, name: `P${index + 1}` }; }),
    categories: [
      { id: "category_place", role: "place", name: "Place", icon: "⌖", color: COLORS.place, items: defaultItems("place", 9) },
      { id: "category_suspect", role: "suspect", name: "Suspect", icon: "👤", color: COLORS.suspect, items: defaultItems("suspect", 6) },
      { id: "category_weapon", role: "weapon", name: "Weapon", icon: "◆", color: COLORS.weapon, items: defaultItems("weapon", 6) }
    ],
    marks: {},
    notes: {},
    suggestions: [],
    selectedItemId: null
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return normalizeState(JSON.parse(raw));
    const legacyRaw = localStorage.getItem(LEGACY_KEY);
    if (legacyRaw) {
      const migrated = migrateLegacy(JSON.parse(legacyRaw));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
  } catch (error) {
    console.warn("Data lama tidak dapat dibaca.", error);
  }
  return createDefaultState();
}

function normalizeState(input) {
  const base = createDefaultState();
  const next = { ...base, ...input };
  next.playerCount = Math.min(6, Math.max(2, Number(next.playerCount) || 4));
  next.players = base.players;
  next.categories = ["place", "suspect", "weapon"].map(function (role) {
    const found = Array.isArray(input.categories) ? input.categories.find(function (category) { return category.role === role; }) : null;
    const fallback = base.categories.find(function (category) { return category.role === role; });
    if (!found) return fallback;
    const items = Array.isArray(found.items) && found.items.length ? found.items.map(function (item) {
      return { id: item.id || uid(role), name: String(item.name || ROLE_META[role].name).trim() || ROLE_META[role].name };
    }) : fallback.items;
    return { ...fallback, ...found, role: role, items: items };
  });
  next.marks = input.marks && typeof input.marks === "object" ? input.marks : {};
  next.notes = input.notes && typeof input.notes === "object" ? input.notes : {};
  next.suggestions = Array.isArray(input.suggestions) ? input.suggestions : [];
  return next;
}

function migrateLegacy(legacy) {
  const base = createDefaultState();
  const oldCategories = Array.isArray(legacy.categories) ? legacy.categories : [];
  const roles = ["suspect", "weapon", "place"];
  const mapped = roles.map(function (role, index) {
    const old = oldCategories[index];
    const fallback = base.categories.find(function (category) { return category.role === role; });
    if (!old || !Array.isArray(old.items) || !old.items.length) return fallback;
    return { ...fallback, items: old.items.map(function (item) { return { id: item.id || uid(role), name: item.name || ROLE_META[role].name }; }) };
  });
  return normalizeState({
    ...base,
    playerCount: legacy.playerCount,
    categories: mapped,
    marks: legacy.marks || {},
    notes: legacy.notes || {},
    selectedItemId: legacy.selectedItemId || null
  });
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function renderAll() {
  el.playerCount.value = String(state.playerCount);
  renderTrackerModule();
  renderSuggestionModule();
  renderCardsModule();
}

function getCategory(role) {
  return state.categories.find(function (category) { return category.role === role; });
}

function getAllItems() {
  return state.categories.flatMap(function (category) { return category.items; });
}

function findItem(itemId) {
  if (!itemId) return null;
  for (const category of state.categories) {
    const item = category.items.find(function (entry) { return entry.id === itemId; });
    if (item) return { category: category, item: item };
  }
  return null;
}

function getItemName(itemId, fallback) {
  const found = findItem(itemId);
  return found ? found.item.name : fallback || "Kartu dihapus";
}

function getMarks(itemId) {
  return state.marks[itemId] ? { ...state.marks[itemId] } : {};
}

function activePlayerIds() {
  return state.players.slice(0, state.playerCount).map(function (player) { return player.id; });
}

function renderTrackerModule() {
  if (!el.trackerContainer) return;
  el.playerCount.value = String(state.playerCount);
  el.trackerContainer.innerHTML = state.categories.map(renderCategoryTable).join("");
  el.trackerContainer.querySelectorAll(".state-button").forEach(function (button) {
    button.addEventListener("click", handleStateClick);
    button.addEventListener("contextmenu", function (event) {
      event.preventDefault();
      handleStateClick({ currentTarget: button, shiftKey: true });
    });
  });
  el.trackerContainer.querySelectorAll(".clue-name-btn, .note-mini-btn").forEach(function (button) {
    button.addEventListener("click", function () { selectItem(button.dataset.itemId); });
  });
  renderTrackerStats();
  renderNotes();
}

function renderCategoryTable(category) {
  return `<section class="category-block" style="--category-color:${escapeAttr(category.color)}">
    <div class="category-heading"><span>${escapeHTML(category.icon)}</span><strong>${escapeHTML(category.name)}</strong><small>${category.items.length} kartu</small></div>
    <table class="tracker-table"><thead><tr><th>Nama clue</th>${activePlayerIds().map(function (id) { return `<th>${id.toUpperCase()}</th>`; }).join("")}<th class="case-column">Case</th></tr></thead>
    <tbody>${category.items.map(function (item, index) { return renderTrackerRow(category, item, index); }).join("")}</tbody></table>
  </section>`;
}

function renderTrackerRow(category, item, index) {
  const marks = getMarks(item.id);
  const smartCandidate = isSmartCandidate(item.id);
  const playerCells = activePlayerIds().map(function (playerId) {
    const mark = marks[playerId] || "";
    return `<td class="state-cell"><button class="state-button ${mark}" type="button" data-item-id="${item.id}" data-column="${playerId}" aria-label="${escapeAttr(item.name)} ${playerId.toUpperCase()}: ${stateLabel(mark)}">${SYMBOLS[mark]}</button></td>`;
  }).join("");
  const caseMark = marks.case || "";
  const hasNote = Boolean((state.notes[item.id] || "").trim());
  return `<tr><td><div class="clue-cell"><span class="clue-index">${index + 1}</span><button class="clue-name-btn" type="button" data-item-id="${item.id}">${escapeHTML(item.name)}</button><button class="note-mini-btn ${hasNote ? "has-note" : ""}" type="button" data-item-id="${item.id}">✎</button></div></td>${playerCells}<td class="state-cell case-column ${smartCandidate ? "smart-candidate" : ""}"><button class="state-button ${caseMark}" type="button" data-item-id="${item.id}" data-column="case">${SYMBOLS[caseMark] || (smartCandidate ? "!" : "")}</button></td></tr>`;
}

function handleStateClick(event) {
  const button = event.currentTarget;
  const itemId = button.dataset.itemId;
  const column = button.dataset.column;
  const marks = getMarks(itemId);
  const list = column === "case" ? CASE_STATES : PLAYER_STATES;
  const current = marks[column] || "";
  let next;
  if (selectedQuickTool !== null) {
    const valid = column === "case" ? ["", "candidate", "ruled_out"] : ["", "owned", "not_owned", "maybe", "mine"];
    next = valid.includes(selectedQuickTool) ? selectedQuickTool : current;
    if (next === current) next = "";
  } else {
    const currentIndex = Math.max(0, list.indexOf(current));
    const direction = event.shiftKey ? -1 : 1;
    next = list[(currentIndex + direction + list.length) % list.length];
  }
  marks[column] = next;
  state.marks[itemId] = marks;
  persist();
  renderTrackerModule();
}

function changePlayerCount(event) {
  state.playerCount = Number(event.target.value);
  persist();
  renderAll();
  showToast(`Jumlah pemain diubah menjadi ${state.playerCount}.`);
}

function setQuickTool(tool) {
  selectedQuickTool = tool;
  document.querySelectorAll(".legend-item").forEach(function (item) { item.classList.remove("active"); });
  if (tool === "") {
    el.clearSelectionBtn.classList.add("active");
    el.activeToolNotice.innerHTML = "Mode cepat aktif: <strong>Kosongkan tanda</strong>.";
  } else {
    const button = document.querySelector(`.legend-item[data-legend-state="${tool}"]`);
    if (button) button.classList.add("active");
    el.activeToolNotice.innerHTML = `Mode cepat aktif: <strong>${stateLabel(tool)}</strong>.`;
  }
}

function selectItem(itemId) {
  state.selectedItemId = itemId;
  persist();
  renderNotes();
  if (window.innerWidth < 1180) document.querySelector(".notes-panel").scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeNotes() {
  state.selectedItemId = null;
  persist();
  renderNotes();
}

function renderNotes() {
  if (!el.notesEmpty) return;
  const found = findItem(state.selectedItemId);
  if (!found) {
    el.notesEmpty.classList.remove("hidden");
    el.notesContent.classList.add("hidden");
    return;
  }
  el.notesEmpty.classList.add("hidden");
  el.notesContent.classList.remove("hidden");
  el.noteCategory.textContent = found.category.name;
  el.noteTitle.textContent = found.item.name;
  el.noteText.value = state.notes[found.item.id] || "";
  const status = deriveStatus(found.item.id);
  el.noteStatus.textContent = status.label;
  el.noteStatus.style.color = status.color;
  el.noteStatus.style.background = status.background;
  el.deductionHint.textContent = buildDeductionHint(found.item.id);
  const marks = getMarks(found.item.id);
  el.markCandidateBtn.textContent = marks.case === "candidate" ? "★ Batalkan kandidat" : "★ Jadikan kandidat";
}

function saveNote() {
  if (!state.selectedItemId) return;
  state.notes[state.selectedItemId] = el.noteText.value;
  persist();
  const button = document.querySelector(`.note-mini-btn[data-item-id="${CSS.escape(state.selectedItemId)}"]`);
  if (button) button.classList.toggle("has-note", Boolean(el.noteText.value.trim()));
}

function markSelectedCandidate() {
  if (!state.selectedItemId) return;
  const marks = getMarks(state.selectedItemId);
  marks.case = marks.case === "candidate" ? "" : "candidate";
  state.marks[state.selectedItemId] = marks;
  persist();
  renderTrackerModule();
}

function clearSelectedRow() {
  if (!state.selectedItemId) return;
  state.marks[state.selectedItemId] = {};
  persist();
  renderTrackerModule();
  showToast("Tanda pada baris dikosongkan.");
}

function activePlayerMarks(marks) {
  return activePlayerIds().map(function (id) { return marks[id] || ""; });
}

function isSmartCandidate(itemId) {
  const marks = getMarks(itemId);
  const values = activePlayerMarks(marks);
  return values.length > 0 && values.every(function (value) { return value === "not_owned"; }) && !marks.case;
}

function deriveStatus(itemId) {
  const marks = getMarks(itemId);
  const players = activePlayerMarks(marks);
  if (marks.case === "candidate" || isSmartCandidate(itemId)) return { label: "★ Kandidat kasus", color: "#9b6500", background: "rgba(255,201,74,.2)" };
  if (marks.case === "ruled_out") return { label: "✕ Bukan solusi", color: "#69718a", background: "rgba(120,129,158,.16)" };
  if (players.includes("mine")) return { label: "● Kartu saya", color: "#4e5de1", background: "rgba(102,116,244,.16)" };
  if (players.includes("owned")) return { label: "✓ Pemilik diketahui", color: "#23865e", background: "rgba(79,202,148,.18)" };
  if (players.includes("maybe")) return { label: "? Mungkin dimiliki", color: "#8c6100", background: "rgba(255,201,74,.18)" };
  return { label: "Belum diberi tanda", color: "var(--muted)", background: "var(--surface-soft)" };
}

function buildDeductionHint(itemId) {
  const marks = getMarks(itemId);
  const players = activePlayerMarks(marks);
  if (marks.case === "candidate") return "Clue ini telah ditandai sebagai kandidat solusi.";
  if (marks.case === "ruled_out") return "Clue ini telah dieliminasi dari solusi.";
  const mineIndex = players.indexOf("mine");
  if (mineIndex >= 0) return `Clue ini merupakan kartu Anda di P${mineIndex + 1}.`;
  const ownerIndex = players.indexOf("owned");
  if (ownerIndex >= 0) return `P${ownerIndex + 1} dipastikan memiliki clue ini.`;
  if (players.every(function (value) { return value === "not_owned"; })) return "Semua pemain aktif ditandai tidak memiliki clue ini. Periksa kembali sebagai kandidat kasus.";
  const maybePlayers = players.map(function (value, index) { return value === "maybe" ? `P${index + 1}` : null; }).filter(Boolean);
  if (maybePlayers.length) return `Kepemilikan masih mungkin pada ${maybePlayers.join(", ")}.`;
  return "Belum cukup data. Gunakan tracker atau simpan hasil suggestion.";
}

function renderTrackerStats() {
  const items = getAllItems();
  const totalCells = items.length * (state.playerCount + 1);
  let filledCells = 0;
  let known = 0;
  let candidates = 0;
  let unknown = 0;
  items.forEach(function (item) {
    const marks = getMarks(item.id);
    const playerMarks = activePlayerMarks(marks);
    filledCells += playerMarks.filter(Boolean).length + (marks.case ? 1 : 0);
    if (playerMarks.some(function (value) { return value === "owned" || value === "mine"; })) known += 1;
    if (marks.case === "candidate" || isSmartCandidate(item.id)) candidates += 1;
    if (!playerMarks.some(Boolean) && !marks.case) unknown += 1;
  });
  const percent = totalCells ? Math.round((filledCells / totalCells) * 100) : 0;
  el.knownStat.textContent = known;
  el.candidateStat.textContent = candidates;
  el.unknownStat.textContent = unknown;
  el.filledStat.textContent = `${percent}%`;
  el.progressBar.style.width = `${percent}%`;
  el.progressPercent.textContent = `${percent}%`;
  el.progressCaption.textContent = percent === 0 ? "Mulai tandai clue yang diketahui." : percent < 50 ? "Deduksi mulai terbentuk." : percent < 100 ? "Sebagian besar matriks sudah terisi." : "Tracker penuh. Periksa kandidat kasus.";
}

function renderSuggestionModule() {
  if (!el.placeSelect) return;
  fillSuggestionSelects();
  renderSelectionPreview();
  renderSuggestionStats();
  renderSuggestionHistory();
  renderResultPanel();
}

function fillSuggestionSelects() {
  fillCardSelect(el.placeSelect, "place");
  fillCardSelect(el.suspectSelect, "suspect");
  fillCardSelect(el.weaponSelect, "weapon");
  const currentAsker = el.suggestionAsker.value;
  el.suggestionAsker.innerHTML = activePlayerIds().map(function (id) { return `<option value="${id}">${id.toUpperCase()}</option>`; }).join("");
  if (activePlayerIds().includes(currentAsker)) el.suggestionAsker.value = currentAsker;
}

function fillCardSelect(select, role) {
  const previous = select.value;
  const category = getCategory(role);
  select.innerHTML = category.items.map(function (item) { return `<option value="${item.id}">${escapeHTML(item.name)}</option>`; }).join("");
  if (category.items.some(function (item) { return item.id === previous; })) select.value = previous;
}

function renderSelectionPreview() {
  if (!el.selectionPreview) return;
  el.selectionPreview.innerHTML = `<span>Preview:</span><span class="preview-chip">⌖ ${escapeHTML(getItemName(el.placeSelect.value))}</span><span class="preview-chip">👤 ${escapeHTML(getItemName(el.suspectSelect.value))}</span><span class="preview-chip">◆ ${escapeHTML(getItemName(el.weaponSelect.value))}</span><span class="preview-chip">oleh ${escapeHTML((el.suggestionAsker.value || "p1").toUpperCase())}</span>`;
}

function createSuggestion() {
  const ids = { place: el.placeSelect.value, suspect: el.suspectSelect.value, weapon: el.weaponSelect.value };
  if (!ids.place || !ids.suspect || !ids.weapon) {
    showToast("Setiap kategori harus memiliki minimal satu kartu.");
    return;
  }
  const suggestion = {
    id: uid("suggestion"),
    number: nextSuggestionNumber(),
    createdAt: new Date().toISOString(),
    asker: el.suggestionAsker.value,
    placeId: ids.place,
    suspectId: ids.suspect,
    weaponId: ids.weapon,
    snapshots: {
      place: getItemName(ids.place), suspect: getItemName(ids.suspect), weapon: getItemName(ids.weapon)
    },
    status: "pending",
    refuter: "pending",
    shownCardId: "unknown",
    passedPlayers: []
  };
  state.suggestions.unshift(suggestion);
  activeSuggestionId = suggestion.id;
  persist();
  renderSuggestionModule();
  showToast("Suggestion dibuat. Catat hasil bantahannya.");
}

function nextSuggestionNumber() {
  const max = state.suggestions.reduce(function (value, suggestion) { return Math.max(value, Number(suggestion.number) || 0); }, 0);
  return max + 1;
}

function renderResultPanel() {
  const suggestion = state.suggestions.find(function (item) { return item.id === activeSuggestionId; });
  if (!suggestion) {
    el.resultEmpty.classList.remove("hidden");
    el.resultContent.classList.add("hidden");
    return;
  }
  el.resultEmpty.classList.add("hidden");
  el.resultContent.classList.remove("hidden");
  el.activeSuggestionSummary.innerHTML = `<strong>#${suggestion.number} ${escapeHTML(suggestion.snapshots.place)} + ${escapeHTML(suggestion.snapshots.suspect)} + ${escapeHTML(suggestion.snapshots.weapon)}</strong><span>Dibuat oleh ${suggestion.asker.toUpperCase()}</span>`;
  const refuterOptions = [`<option value="pending">Belum dicatat</option>`, `<option value="none">Tidak ada yang membantah</option>`].concat(activePlayerIds().filter(function (id) { return id !== suggestion.asker; }).map(function (id) { return `<option value="${id}">${id.toUpperCase()} membantah</option>`; }));
  el.refuterSelect.innerHTML = refuterOptions.join("");
  el.refuterSelect.value = suggestion.refuter || "pending";
  fillShownCardOptions(suggestion);
  renderPassedPlayers(suggestion);
  updateResultFields();
}

function fillShownCardOptions(suggestion) {
  const options = [
    { value: "unknown", label: "Tidak diketahui" },
    { value: suggestion.placeId, label: suggestion.snapshots.place },
    { value: suggestion.suspectId, label: suggestion.snapshots.suspect },
    { value: suggestion.weaponId, label: suggestion.snapshots.weapon }
  ];
  el.shownCardSelect.innerHTML = options.map(function (option) { return `<option value="${option.value}">${escapeHTML(option.label)}</option>`; }).join("");
  el.shownCardSelect.value = options.some(function (option) { return option.value === suggestion.shownCardId; }) ? suggestion.shownCardId : "unknown";
}

function renderPassedPlayers(suggestion) {
  el.passedPlayers.innerHTML = activePlayerIds().filter(function (id) { return id !== suggestion.asker; }).map(function (id) {
    const checked = suggestion.passedPlayers.includes(id) ? "checked" : "";
    return `<label class="player-check"><input type="checkbox" value="${id}" ${checked}> ${id.toUpperCase()}</label>`;
  }).join("");
}

function handleRefuterChange() {
  updateResultFields();
  const suggestion = state.suggestions.find(function (item) { return item.id === activeSuggestionId; });
  if (!suggestion) return;
  if (el.refuterSelect.value === "none") {
    el.passedPlayers.querySelectorAll("input").forEach(function (input) { input.checked = true; });
  }
  if (el.refuterSelect.value !== "pending" && el.refuterSelect.value !== "none") {
    const refuter = el.refuterSelect.value;
    const checkbox = el.passedPlayers.querySelector(`input[value="${refuter}"]`);
    if (checkbox) checkbox.checked = false;
  }
}

function updateResultFields() {
  const result = el.refuterSelect.value;
  el.shownCardField.classList.toggle("hidden", result === "pending" || result === "none");
  el.saveResultBtn.textContent = result === "pending" ? "… Simpan sebagai Belum Lengkap" : "✓ Simpan dan Perbarui Tracker";
}

function saveSuggestionResult() {
  const suggestion = state.suggestions.find(function (item) { return item.id === activeSuggestionId; });
  if (!suggestion) return;
  suggestion.refuter = el.refuterSelect.value;
  suggestion.shownCardId = suggestion.refuter === "pending" || suggestion.refuter === "none" ? "unknown" : el.shownCardSelect.value;
  suggestion.passedPlayers = Array.from(el.passedPlayers.querySelectorAll("input:checked")).map(function (input) { return input.value; }).filter(function (id) { return id !== suggestion.refuter; });
  suggestion.updatedAt = new Date().toISOString();
  suggestion.status = suggestion.refuter === "pending" ? "pending" : suggestion.refuter === "none" ? "none" : "refuted";
  if (suggestion.status !== "pending") applySuggestionToTracker(suggestion);
  persist();
  renderAll();
  showToast(suggestion.status === "pending" ? "Suggestion disimpan sebagai belum lengkap." : "Hasil disimpan dan tracker diperbarui.");
}

function applySuggestionToTracker(suggestion) {
  const clueIds = [suggestion.placeId, suggestion.suspectId, suggestion.weaponId];
  let passedPlayers = suggestion.passedPlayers.slice();
  if (suggestion.status === "none") passedPlayers = activePlayerIds().filter(function (id) { return id !== suggestion.asker; });
  passedPlayers.forEach(function (playerId) {
    clueIds.forEach(function (clueId) { setWeakMark(clueId, playerId, "not_owned"); });
  });
  if (suggestion.status === "refuted") {
    if (suggestion.shownCardId !== "unknown") {
      setStrongOwner(suggestion.shownCardId, suggestion.refuter);
    } else {
      clueIds.forEach(function (clueId) { setWeakMark(clueId, suggestion.refuter, "maybe"); });
    }
  }
}

function setWeakMark(itemId, playerId, value) {
  if (!findItem(itemId)) return;
  const marks = getMarks(itemId);
  const current = marks[playerId] || "";
  if (current === "owned" || current === "mine") return;
  if (value === "not_owned" || !current) marks[playerId] = value;
  state.marks[itemId] = marks;
}

function setStrongOwner(itemId, ownerId) {
  if (!findItem(itemId)) return;
  const marks = getMarks(itemId);
  activePlayerIds().forEach(function (playerId) {
    if (playerId === ownerId) marks[playerId] = "owned";
    else if (marks[playerId] !== "mine") marks[playerId] = "not_owned";
  });
  marks.case = "ruled_out";
  state.marks[itemId] = marks;
}

function closeResultPanel() {
  activeSuggestionId = null;
  renderResultPanel();
}

function renderSuggestionStats() {
  const total = state.suggestions.length;
  el.suggestionTotalStat.textContent = total;
  el.suggestionRefutedStat.textContent = state.suggestions.filter(function (item) { return item.status === "refuted"; }).length;
  el.suggestionNoneStat.textContent = state.suggestions.filter(function (item) { return item.status === "none"; }).length;
  el.suggestionPendingStat.textContent = state.suggestions.filter(function (item) { return item.status === "pending"; }).length;
}

function renderSuggestionHistory() {
  if (!state.suggestions.length) {
    el.suggestionHistory.innerHTML = `<div class="history-empty"><div class="empty-cat">✦</div><strong>Belum ada riwayat</strong><p>Buat suggestion pertama melalui form di atas.</p></div>`;
    return;
  }
  el.suggestionHistory.innerHTML = state.suggestions.map(function (suggestion) {
    const statusLabel = suggestion.status === "refuted" ? `${suggestion.refuter.toUpperCase()} membantah` : suggestion.status === "none" ? "Tidak dibantah" : "Belum lengkap";
    const shown = suggestion.status === "refuted" ? (suggestion.shownCardId === "unknown" ? "Kartu tidak diketahui" : `Menunjukkan ${getItemName(suggestion.shownCardId, "kartu lama")}`) : "";
    return `<article class="history-item"><div class="history-number">#${suggestion.number}</div><div class="history-copy"><strong>${escapeHTML(suggestion.snapshots.place)} + ${escapeHTML(suggestion.snapshots.suspect)} + ${escapeHTML(suggestion.snapshots.weapon)}</strong><small>${suggestion.asker.toUpperCase()} • ${formatDate(suggestion.createdAt)} ${shown ? `• ${escapeHTML(shown)}` : ""}</small><div class="history-badges"><span class="status-badge ${suggestion.status}">${escapeHTML(statusLabel)}</span>${suggestion.passedPlayers.length ? `<span class="status-badge pending">Lewat: ${suggestion.passedPlayers.map(function (id) { return id.toUpperCase(); }).join(", ")}</span>` : ""}</div></div><div class="history-actions"><button class="open-history" type="button" data-id="${suggestion.id}" title="Buka">✎</button><button class="delete-history" type="button" data-id="${suggestion.id}" title="Hapus">×</button></div></article>`;
  }).join("");
  el.suggestionHistory.querySelectorAll(".open-history").forEach(function (button) {
    button.addEventListener("click", function () { activeSuggestionId = button.dataset.id; renderResultPanel(); document.querySelector(".result-panel").scrollIntoView({ behavior: "smooth", block: "start" }); });
  });
  el.suggestionHistory.querySelectorAll(".delete-history").forEach(function (button) {
    button.addEventListener("click", function () { requestDeleteSuggestion(button.dataset.id); });
  });
}

function requestDeleteSuggestion(id) {
  requestConfirm("Hapus suggestion?", "Riwayat ini akan dihapus. Tanda tracker yang pernah dihasilkan tidak akan dibatalkan otomatis.", "Hapus", function () {
    state.suggestions = state.suggestions.filter(function (item) { return item.id !== id; });
    if (activeSuggestionId === id) activeSuggestionId = null;
    persist();
    renderSuggestionModule();
    showToast("Suggestion dihapus.");
  });
}

function requestClearHistory() {
  if (!state.suggestions.length) return showToast("Riwayat masih kosong.");
  requestConfirm("Hapus semua riwayat?", "Seluruh suggestion akan dihapus. Tanda tracker tetap dipertahankan.", "Hapus semua", function () {
    state.suggestions = [];
    activeSuggestionId = null;
    persist();
    renderSuggestionModule();
    showToast("Riwayat suggestion dikosongkan.");
  });
}

function renderCardsModule() {
  if (!el.cardManagerGrid) return;
  const total = getAllItems().length;
  el.cardsTotalCount.textContent = `${total} kartu`;
  el.cardManagerGrid.innerHTML = ["place", "suspect", "weapon"].map(renderCardCategory).join("");
  el.cardManagerGrid.querySelectorAll(".add-card-btn").forEach(function (button) {
    button.addEventListener("click", function () { openCardModal(button.dataset.role); });
  });
  el.cardManagerGrid.querySelectorAll(".edit-card").forEach(function (button) {
    button.addEventListener("click", function () { openCardModal(button.dataset.role, button.dataset.id); });
  });
  el.cardManagerGrid.querySelectorAll(".delete-card").forEach(function (button) {
    button.addEventListener("click", function () { requestDeleteCard(button.dataset.role, button.dataset.id); });
  });
}

function renderCardCategory(role) {
  const category = getCategory(role);
  return `<article class="card-category-panel" style="--category-color:${category.color}"><header class="card-category-head"><div class="card-category-title"><span class="card-category-icon">${category.icon}</span><div><h3>${category.name}</h3><small>${category.items.length} kartu</small></div></div><button class="add-card-btn" type="button" data-role="${role}" title="Tambah ${role}">＋</button></header><div class="card-list">${category.items.map(function (item, index) { return `<div class="card-list-row"><span class="card-list-index">${index + 1}</span><span class="card-list-name">${escapeHTML(item.name)}</span><div class="card-row-actions"><button class="edit-card" type="button" data-role="${role}" data-id="${item.id}" title="Edit">✎</button><button class="delete-card" type="button" data-role="${role}" data-id="${item.id}" title="Hapus">×</button></div></div>`; }).join("")}</div></article>`;
}

function openCardModal(role, itemId) {
  const category = getCategory(role);
  const item = itemId ? category.items.find(function (entry) { return entry.id === itemId; }) : null;
  el.cardRoleInput.value = role;
  el.cardIdInput.value = item ? item.id : "";
  el.cardNameInput.value = item ? item.name : "";
  el.cardModalEyebrow.textContent = item ? `Edit ${ROLE_META[role].name}` : `Tambah ${ROLE_META[role].name}`;
  el.cardModalTitle.textContent = item ? item.name : `${ROLE_META[role].name} baru`;
  openModal("cardModal");
  setTimeout(function () { el.cardNameInput.focus(); el.cardNameInput.select(); }, 50);
}

function saveCardFromModal(event) {
  event.preventDefault();
  const role = el.cardRoleInput.value;
  const id = el.cardIdInput.value;
  const name = el.cardNameInput.value.trim();
  const category = getCategory(role);
  if (!category || !name) return;
  const duplicate = category.items.some(function (item) { return item.name.toLowerCase() === name.toLowerCase() && item.id !== id; });
  if (duplicate) return showToast("Nama kartu sudah digunakan pada kategori ini.");
  if (id) {
    const item = category.items.find(function (entry) { return entry.id === id; });
    if (item) item.name = name;
  } else {
    category.items.push({ id: uid(role), name: name });
  }
  persist();
  closeModal("cardModal");
  renderAll();
  showToast(id ? "Nama kartu diperbarui." : "Kartu baru ditambahkan.");
}

function requestDeleteCard(role, itemId) {
  const category = getCategory(role);
  const item = category.items.find(function (entry) { return entry.id === itemId; });
  if (!item) return;
  if (category.items.length <= 1) return showToast("Setiap kategori minimal memiliki satu kartu.");
  requestConfirm(`Hapus ${item.name}?`, "Kartu akan hilang dari tracker dan dropdown. Riwayat lama tetap menyimpan nama snapshot.", "Hapus kartu", function () {
    category.items = category.items.filter(function (entry) { return entry.id !== itemId; });
    delete state.marks[itemId];
    delete state.notes[itemId];
    if (state.selectedItemId === itemId) state.selectedItemId = null;
    persist();
    renderAll();
    showToast("Kartu dihapus.");
  });
}

function requestRestoreDefaults() {
  requestConfirm("Isi daftar default?", "Kartu default yang belum ada akan ditambahkan. Kartu buatan Anda tetap dipertahankan.", "Tambahkan default", function () {
    const counts = { place: 9, suspect: 6, weapon: 6 };
    ["place", "suspect", "weapon"].forEach(function (role) {
      const category = getCategory(role);
      const existing = new Set(category.items.map(function (item) { return item.name.toLowerCase(); }));
      defaultItems(role, counts[role]).forEach(function (item) {
        if (!existing.has(item.name.toLowerCase())) category.items.push(item);
      });
    });
    persist();
    renderAll();
    showToast("Kartu default ditambahkan.");
  });
}

function requestNewGame() {
  requestConfirm("Mulai game baru?", "Semua tanda, catatan, dan riwayat suggestion akan dikosongkan. Daftar kartu tetap tersimpan.", "Ya, mulai baru", function () {
    state.marks = {};
    state.notes = {};
    state.suggestions = [];
    state.selectedItemId = null;
    activeSuggestionId = null;
    persist();
    renderAll();
    showToast("Game baru siap.");
  });
}

function requestConfirm(title, message, buttonLabel, action) {
  el.confirmTitle.textContent = title;
  el.confirmMessage.textContent = message;
  el.confirmActionBtn.textContent = buttonLabel;
  confirmAction = action;
  openModal("confirmModal");
}

function runConfirmedAction() {
  const action = confirmAction;
  confirmAction = null;
  closeModal("confirmModal");
  if (typeof action === "function") action();
}

function exportData() {
  const payload = { app: "ClueCat Cluedo Lite", version: 2, exportedAt: new Date().toISOString(), data: state };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `cluecat-cluedo-lite-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
  showToast("Data berhasil diekspor.");
}

async function importData(event) {
  const file = event.target.files && event.target.files[0];
  event.target.value = "";
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    const imported = parsed.data || parsed;
    if (!imported || !Array.isArray(imported.categories)) throw new Error("Format tidak sesuai");
    state = normalizeState(imported);
    activeSuggestionId = null;
    persist();
    renderAll();
    showToast("Data berhasil diimpor.");
  } catch (error) {
    console.error(error);
    showToast("File JSON tidak valid.");
  }
}

function applySavedTheme() {
  const saved = localStorage.getItem(THEME_KEY) || "light";
  document.documentElement.dataset.theme = saved;
  el.themeIcon.textContent = saved === "dark" ? "☀" : "☾";
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem(THEME_KEY, next);
  el.themeIcon.textContent = next === "dark" ? "☀" : "☾";
  showToast(next === "dark" ? "Tema gelap aktif." : "Tema terang aktif.");
}

function openModal(id) {
  document.getElementById(id).classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add("hidden");
  if (!document.querySelector(".modal-backdrop:not(.hidden)")) document.body.style.overflow = "";
}

function showToast(message) {
  clearTimeout(toastTimer);
  el.toast.textContent = message;
  el.toast.classList.add("show");
  toastTimer = setTimeout(function () { el.toast.classList.remove("show"); }, 2600);
}

function stateLabel(value) {
  return ({ "": "Kosong", owned: "Punya", not_owned: "Tidak punya", maybe: "Mungkin", mine: "Kartu saya", candidate: "Kandidat kasus", ruled_out: "Bukan solusi" })[value] || "Kosong";
}

function formatDate(value) {
  try {
    return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
  } catch (error) {
    return "";
  }
}

function escapeHTML(value) {
  return String(value || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHTML(value);
}
