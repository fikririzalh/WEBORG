const STORAGE_KEY = "codingBunnyQuestionsV1";
const THEME_KEY = "codingBunnyTheme";

const DEFAULT_QUESTIONS = [
  {
    id: "html-button-type",
    title: "Tombol yang aman di dalam form",
    language: "HTML",
    difficulty: "Mudah",
    correctCode: `<form>\n  <input type="email" required>\n  <button type="submit">Kirim</button>\n</form>`,
    wrongCode: `<form>\n  <input type="email" required>\n  <buton type="submit">Kirim</buton>\n</form>`,
    correctExplanation: "Elemen <button> ditulis lengkap dan memiliki type=\"submit\", sehingga tombol dikenali serta dapat mengirim form.",
    wrongExplanation: "Nama elemen <button> kehilangan satu huruf t dan berubah menjadi <buton>. Browser memperlakukannya sebagai elemen tak dikenal, bukan tombol.",
  },
  {
    id: "html-label-link",
    title: "Label yang terhubung ke input",
    language: "HTML",
    difficulty: "Sedang",
    correctCode: `<label for="email">Email</label>\n<input id="email" type="email">`,
    wrongCode: `<label for="emails">Email</label>\n<input id="email" type="email">`,
    correctExplanation: "Nilai atribut for pada label sama persis dengan id input, sehingga keduanya terhubung secara semantik.",
    wrongExplanation: "Nilai for adalah \"emails\", sedangkan id input adalah \"email\". Perbedaan satu huruf membuat label tidak terhubung.",
  },
  {
    id: "css-flex-value",
    title: "Mengaktifkan Flexbox",
    language: "CSS",
    difficulty: "Mudah",
    correctCode: `.toolbar {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}`,
    wrongCode: `.toolbar {\n  display: flexbox;\n  align-items: center;\n  gap: 12px;\n}`,
    correctExplanation: "Nilai valid untuk mengaktifkan konteks Flexbox adalah display: flex.",
    wrongExplanation: "flexbox bukan nilai valid untuk properti display. Kata yang benar adalah flex.",
  },
  {
    id: "css-hover-selector",
    title: "Selector hover pada tombol",
    language: "CSS",
    difficulty: "Sedang",
    correctCode: `.button:hover {\n  background: #7357c7;\n  transform: translateY(-1px);\n}`,
    wrongCode: `.button hover {\n  background: #7357c7;\n  transform: translateY(-1px);\n}`,
    correctExplanation: "Pseudo-class :hover menempel pada selector .button dengan tanda titik dua.",
    wrongExplanation: "Spasi menggantikan tanda titik dua. .button hover berarti mencari elemen <hover> di dalam .button, bukan keadaan hover tombol.",
  },
  {
    id: "js-strict-equality",
    title: "Perbandingan nilai JavaScript",
    language: "JavaScript",
    difficulty: "Mudah",
    correctCode: `let score = 10;\n\nif (score === 10) {\n  console.log("Perfect!");\n}`,
    wrongCode: `let score = 10;\n\nif (score = 10) {\n  console.log("Perfect!");\n}`,
    correctExplanation: "Operator === membandingkan nilai sekaligus tipe data tanpa mengubah variabel.",
    wrongExplanation: "Satu tanda = adalah operator assignment. Kondisi mengubah score menjadi 10, bukan membandingkannya.",
  },
  {
    id: "js-query-selector",
    title: "Memilih elemen dari DOM",
    language: "JavaScript",
    difficulty: "Sedang",
    correctCode: `const card = document.querySelector(".card");\ncard.classList.add("active");`,
    wrongCode: `const card = document.querySelect(".card");\ncard.classList.add("active");`,
    correctExplanation: "Nama metode DOM yang tersedia adalah querySelector(), dengan akhiran or.",
    wrongExplanation: "document.querySelect() tidak ada. Hilangnya akhiran or membuat pemanggilan metode gagal.",
  },
  {
    id: "js-map-return",
    title: "Nilai balik dari map",
    language: "JavaScript",
    difficulty: "Sulit",
    correctCode: `const prices = [10, 20, 30];\nconst doubled = prices.map((price) => {\n  return price * 2;\n});`,
    wrongCode: `const prices = [10, 20, 30];\nconst doubled = prices.map((price) => {\n  price * 2;\n});`,
    correctExplanation: "Callback dengan curly braces perlu return eksplisit agar map menerima nilai baru untuk setiap elemen.",
    wrongExplanation: "Ekspresi price * 2 dihitung tetapi tidak dikembalikan. Hasil doubled menjadi [undefined, undefined, undefined].",
  },
  {
    id: "html-image-alt",
    title: "Gambar yang lebih aksesibel",
    language: "HTML",
    difficulty: "Sedang",
    correctCode: `<img\n  src="bunny-coding.png"\n  alt="Kelinci sedang belajar JavaScript"\n>`,
    wrongCode: `<img\n  src="bunny-coding.png"\n  atl="Kelinci sedang belajar JavaScript"\n>`,
    correctExplanation: "Atribut alt menyediakan alternatif teks yang dapat digunakan pembaca layar ketika gambar tidak dapat dilihat.",
    wrongExplanation: "Atribut alt salah ketik menjadi atl. Browser tidak mengenalinya sebagai teks alternatif gambar.",
  },
];

const state = {
  questions: [],
  currentId: null,
  options: [],
  selectedIndex: null,
  revealed: false,
  round: 1,
  score: 0,
  attempts: 0,
  streak: 0,
  editorId: null,
  pendingDeleteId: null,
};

const elements = {
  root: document.documentElement,
  themeToggle: document.querySelector("#themeToggle"),
  themeIcon: document.querySelector(".theme-icon"),
  openBank: document.querySelector("#openBank"),
  closeBank: document.querySelector("#closeBank"),
  bankDialog: document.querySelector("#bankDialog"),
  confirmDialog: document.querySelector("#confirmDialog"),
  confirmDelete: document.querySelector("#confirmDelete"),
  confirmText: document.querySelector("#confirmText"),
  cardsStack: document.querySelector("#cardsStack"),
  emptyState: document.querySelector("#emptyState"),
  gameActions: document.querySelector("#gameActions"),
  emptyAddButton: document.querySelector("#emptyAddButton"),
  challengeTitle: document.querySelector("#challengeTitle"),
  challengeSubtitle: document.querySelector("#challengeSubtitle"),
  languageBadge: document.querySelector("#languageBadge"),
  difficultyBadge: document.querySelector("#difficultyBadge"),
  roundNumber: document.querySelector("#roundNumber"),
  scoreValue: document.querySelector("#scoreValue"),
  streakValue: document.querySelector("#streakValue"),
  revealButton: document.querySelector("#revealButton"),
  revealLabel: document.querySelector("#revealLabel"),
  skipButton: document.querySelector("#skipButton"),
  feedback: document.querySelector("#feedback"),
  feedbackIcon: document.querySelector("#feedbackIcon"),
  feedbackTitle: document.querySelector("#feedbackTitle"),
  feedbackText: document.querySelector("#feedbackText"),
  questionCount: document.querySelector("#questionCount"),
  bankCount: document.querySelector("#bankCount"),
  questionSearch: document.querySelector("#questionSearch"),
  questionList: document.querySelector("#questionList"),
  addQuestion: document.querySelector("#addQuestion"),
  exportQuestions: document.querySelector("#exportQuestions"),
  resetQuestions: document.querySelector("#resetQuestions"),
  editorPlaceholder: document.querySelector("#editorPlaceholder"),
  questionForm: document.querySelector("#questionForm"),
  formTitle: document.querySelector("#formTitle"),
  cancelEdit: document.querySelector("#cancelEdit"),
  questionId: document.querySelector("#questionId"),
  titleInput: document.querySelector("#titleInput"),
  languageInput: document.querySelector("#languageInput"),
  difficultyInput: document.querySelector("#difficultyInput"),
  correctCodeInput: document.querySelector("#correctCodeInput"),
  wrongCodeInput: document.querySelector("#wrongCodeInput"),
  correctExplanationInput: document.querySelector("#correctExplanationInput"),
  wrongExplanationInput: document.querySelector("#wrongExplanationInput"),
  toast: document.querySelector("#toast"),
};

function cloneDefaults() {
  return JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
}

function loadQuestions() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    state.questions = stored ? JSON.parse(stored) : cloneDefaults();
    if (!Array.isArray(state.questions)) throw new Error("Invalid data");
  } catch {
    state.questions = cloneDefaults();
    showToast("Data lokal bermasalah. Bank soal bawaan dipulihkan.");
  }
}

function saveQuestions(message = "Bank soal tersimpan.") {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.questions));
  elements.questionCount.textContent = state.questions.length;
  elements.bankCount.textContent = `${state.questions.length} soal`;
  if (message) showToast(message);
}

function applyTheme(theme) {
  elements.root.dataset.theme = theme;
  const dark = theme === "dark";
  elements.themeIcon.textContent = dark ? "☀" : "☾";
  elements.themeToggle.setAttribute("aria-label", dark ? "Aktifkan tema terang" : "Aktifkan tema gelap");
}

function initializeTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  applyTheme(saved || preferred);
}

function toggleTheme() {
  const next = elements.root.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
}

function randomQuestion(excludeId = null) {
  if (!state.questions.length) return null;
  const pool = state.questions.length > 1
    ? state.questions.filter((question) => question.id !== excludeId)
    : state.questions;
  return pool[Math.floor(Math.random() * pool.length)];
}

function startRound(increment = false) {
  const previousId = state.currentId;
  const question = randomQuestion(previousId);

  if (!question) {
    state.currentId = null;
    state.options = [];
    renderGame();
    return;
  }

  if (increment) state.round += 1;
  state.currentId = question.id;
  state.selectedIndex = null;
  state.revealed = false;
  state.options = [
    { code: question.correctCode, correct: true, explanation: question.correctExplanation },
    { code: question.wrongCode, correct: false, explanation: question.wrongExplanation },
  ].sort(() => Math.random() - 0.5);

  renderGame();
}

function currentQuestion() {
  return state.questions.find((question) => question.id === state.currentId) || null;
}

function codeLines(code) {
  return String(code).replace(/\r\n/g, "\n").split("\n");
}

function createCodeCard(option, index) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "code-card";
  card.dataset.index = index;
  card.setAttribute("aria-pressed", String(state.selectedIndex === index));
  card.setAttribute("aria-label", `Pilih kartu ${index + 1}`);

  if (state.selectedIndex === index) card.classList.add("selected");
  if (state.revealed) {
    card.classList.add("locked", option.correct ? "correct" : "wrong");
    card.disabled = true;
  }

  const top = document.createElement("div");
  top.className = "card-top";

  const label = document.createElement("div");
  label.className = "card-label";
  label.innerHTML = `<span class="card-number">${index + 1}</span><span>KARTU ${index + 1}</span>`;

  const status = document.createElement("span");
  status.className = "card-status";
  status.textContent = state.revealed
    ? (option.correct ? "KODE BENAR" : "ADA BUG")
    : (state.selectedIndex === index ? "PILIHANMU" : "PILIH");
  top.append(label, status);

  const wrap = document.createElement("div");
  wrap.className = "code-wrap";
  const lines = codeLines(option.code);

  const numbers = document.createElement("pre");
  numbers.className = "line-numbers";
  lines.forEach((_, lineIndex) => {
    const line = document.createElement("span");
    line.textContent = String(lineIndex + 1).padStart(2, "0");
    numbers.append(line);
  });

  const content = document.createElement("code");
  content.className = "code-content";
  lines.forEach((text) => {
    const line = document.createElement("span");
    line.textContent = text || " ";
    content.append(line);
  });
  wrap.append(numbers, content);

  const explanation = document.createElement("div");
  explanation.className = "card-explanation";
  const mark = document.createElement("span");
  mark.className = "explanation-mark";
  mark.textContent = option.correct ? "✓" : "!";
  const copy = document.createElement("div");
  const heading = document.createElement("strong");
  heading.textContent = option.correct ? "Mengapa ini benar?" : "Letak kesalahannya";
  const detail = document.createElement("span");
  detail.textContent = option.explanation;
  copy.append(heading, detail);
  explanation.append(mark, copy);

  card.append(top, wrap, explanation);
  card.addEventListener("click", () => selectCard(index));
  return card;
}

function renderGame() {
  const question = currentQuestion();
  const empty = !question;
  elements.cardsStack.replaceChildren();
  elements.emptyState.hidden = !empty;
  elements.cardsStack.hidden = empty;
  elements.gameActions.hidden = empty;
  elements.feedback.hidden = !state.revealed || empty;

  elements.questionCount.textContent = state.questions.length;
  elements.bankCount.textContent = `${state.questions.length} soal`;
  elements.roundNumber.textContent = String(state.round).padStart(2, "0");
  elements.scoreValue.textContent = `${state.score}/${state.attempts}`;
  elements.streakValue.textContent = state.streak;

  if (empty) {
    elements.challengeTitle.textContent = "Belum ada kode untuk dibandingkan.";
    elements.challengeSubtitle.textContent = "Buka Bank Soal dan tambahkan satu pasangan kode.";
    elements.languageBadge.textContent = "EMPTY";
    elements.difficultyBadge.textContent = "—";
    return;
  }

  elements.challengeTitle.textContent = question.title;
  elements.challengeSubtitle.textContent = "Satu kartu valid, kartu lainnya menyimpan perbedaan yang bisa sangat kecil.";
  elements.languageBadge.textContent = question.language.toUpperCase();
  elements.difficultyBadge.textContent = question.difficulty.toUpperCase();

  state.options.forEach((option, index) => {
    elements.cardsStack.append(createCodeCard(option, index));
  });

  elements.revealButton.disabled = state.selectedIndex === null && !state.revealed;
  elements.revealLabel.textContent = state.revealed ? "Soal Berikutnya" : "Buka Jawaban";
  elements.skipButton.hidden = state.revealed;

  if (state.revealed) {
    const chosen = state.options[state.selectedIndex];
    const correct = Boolean(chosen?.correct);
    elements.feedback.classList.toggle("incorrect", !correct);
    elements.feedbackIcon.textContent = correct ? "✓" : "↺";
    elements.feedbackTitle.textContent = correct ? "Tepat sekali, mata kelincimu tajam!" : "Hampir, bug-nya berhasil bersembunyi.";
    elements.feedbackText.textContent = correct
      ? "Pilihanmu valid. Baca penjelasan tiap kartu untuk menguatkan konsepnya."
      : "Bandingkan kembali kedua kartu dan perhatikan penjelasan kesalahannya.";
  }
}

function selectCard(index) {
  if (state.revealed) return;
  state.selectedIndex = index;
  renderGame();
}

function revealAnswer() {
  if (state.revealed) {
    startRound(true);
    return;
  }
  if (state.selectedIndex === null) return;

  state.revealed = true;
  state.attempts += 1;
  if (state.options[state.selectedIndex].correct) {
    state.score += 1;
    state.streak += 1;
  } else {
    state.streak = 0;
  }
  renderGame();
}

function skipQuestion() {
  state.streak = 0;
  startRound(true);
}

function openBankDialog() {
  renderQuestionList();
  elements.bankDialog.showModal();
}

function closeBankDialog() {
  elements.bankDialog.close();
  closeEditor();
}

function renderQuestionList() {
  const query = elements.questionSearch.value.trim().toLowerCase();
  const filtered = state.questions.filter((question) =>
    `${question.title} ${question.language} ${question.difficulty}`.toLowerCase().includes(query)
  );
  elements.questionList.replaceChildren();
  elements.bankCount.textContent = `${filtered.length} dari ${state.questions.length} soal`;

  if (!filtered.length) {
    const empty = document.createElement("div");
    empty.className = "list-empty";
    empty.textContent = query ? "Tidak ada soal yang cocok." : "Bank soal kosong. Tambahkan soal pertama.";
    elements.questionList.append(empty);
    return;
  }

  filtered.forEach((question) => {
    const item = document.createElement("article");
    item.className = `question-item${state.editorId === question.id ? " active" : ""}`;
    item.tabIndex = 0;
    item.dataset.id = question.id;

    const main = document.createElement("div");
    main.className = "question-item-main";
    const title = document.createElement("strong");
    title.textContent = question.title;
    const meta = document.createElement("div");
    meta.className = "question-item-meta";
    const language = document.createElement("span");
    language.className = "item-language";
    language.textContent = question.language;
    const difficulty = document.createElement("span");
    difficulty.textContent = question.difficulty;
    meta.append(language, difficulty);
    main.append(title, meta);

    const actions = document.createElement("div");
    actions.className = "item-actions";
    const edit = document.createElement("button");
    edit.type = "button";
    edit.title = "Edit soal";
    edit.setAttribute("aria-label", `Edit ${question.title}`);
    edit.textContent = "✎";
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "delete-item";
    remove.title = "Hapus soal";
    remove.setAttribute("aria-label", `Hapus ${question.title}`);
    remove.textContent = "×";

    edit.addEventListener("click", (event) => {
      event.stopPropagation();
      openEditor(question.id);
    });
    remove.addEventListener("click", (event) => {
      event.stopPropagation();
      requestDelete(question.id);
    });
    item.addEventListener("click", () => openEditor(question.id));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") openEditor(question.id);
    });
    actions.append(edit, remove);
    item.append(main, actions);
    elements.questionList.append(item);
  });
}

function openEditor(id = null) {
  state.editorId = id;
  elements.editorPlaceholder.hidden = true;
  elements.questionForm.hidden = false;
  elements.questionForm.reset();

  if (id) {
    const question = state.questions.find((item) => item.id === id);
    if (!question) return;
    elements.formTitle.textContent = "Edit Soal";
    elements.questionId.value = question.id;
    elements.titleInput.value = question.title;
    elements.languageInput.value = question.language;
    elements.difficultyInput.value = question.difficulty;
    elements.correctCodeInput.value = question.correctCode;
    elements.wrongCodeInput.value = question.wrongCode;
    elements.correctExplanationInput.value = question.correctExplanation;
    elements.wrongExplanationInput.value = question.wrongExplanation;
  } else {
    elements.formTitle.textContent = "Tambah Soal";
    elements.questionId.value = "";
    elements.languageInput.value = "HTML";
    elements.difficultyInput.value = "Mudah";
  }
  renderQuestionList();
  requestAnimationFrame(() => elements.titleInput.focus());
}

function closeEditor() {
  state.editorId = null;
  elements.questionForm.hidden = true;
  elements.editorPlaceholder.hidden = false;
  elements.questionForm.reset();
  renderQuestionList();
}

function questionFromForm() {
  return {
    id: elements.questionId.value || `question-${Date.now()}`,
    title: elements.titleInput.value.trim(),
    language: elements.languageInput.value,
    difficulty: elements.difficultyInput.value,
    correctCode: elements.correctCodeInput.value.trim(),
    wrongCode: elements.wrongCodeInput.value.trim(),
    correctExplanation: elements.correctExplanationInput.value.trim(),
    wrongExplanation: elements.wrongExplanationInput.value.trim(),
  };
}

function saveQuestion(event) {
  event.preventDefault();
  const question = questionFromForm();
  const index = state.questions.findIndex((item) => item.id === question.id);
  if (index >= 0) {
    state.questions[index] = question;
  } else {
    state.questions.unshift(question);
  }

  saveQuestions(index >= 0 ? "Perubahan soal tersimpan." : "Soal baru ditambahkan.");
  state.editorId = question.id;
  renderQuestionList();

  if (!state.currentId || state.currentId === question.id) {
    state.currentId = question.id;
    state.options = [
      { code: question.correctCode, correct: true, explanation: question.correctExplanation },
      { code: question.wrongCode, correct: false, explanation: question.wrongExplanation },
    ].sort(() => Math.random() - 0.5);
    state.selectedIndex = null;
    state.revealed = false;
    renderGame();
  }
}

function requestDelete(id) {
  const question = state.questions.find((item) => item.id === id);
  if (!question) return;
  state.pendingDeleteId = id;
  elements.confirmText.textContent = `“${question.title}” akan dihapus dari bank soal lokal.`;
  elements.confirmDialog.showModal();
}

function deleteQuestion() {
  const id = state.pendingDeleteId;
  if (!id) return;
  state.questions = state.questions.filter((question) => question.id !== id);
  if (state.editorId === id) closeEditor();
  saveQuestions("Soal dihapus.");
  renderQuestionList();

  if (state.currentId === id) {
    state.currentId = null;
    startRound(false);
  } else {
    renderGame();
  }
  state.pendingDeleteId = null;
}

function resetQuestions() {
  if (!window.confirm("Pulihkan delapan soal bawaan? Soal buatanmu akan diganti.")) return;
  state.questions = cloneDefaults();
  state.round = 1;
  state.score = 0;
  state.attempts = 0;
  state.streak = 0;
  closeEditor();
  saveQuestions("Bank soal bawaan dipulihkan.");
  renderQuestionList();
  startRound(false);
}

function exportQuestions() {
  const blob = new Blob([JSON.stringify(state.questions, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "coding-bunny-bank-soal.json";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  showToast("Bank soal diekspor sebagai JSON.");
}

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("visible");
  toastTimer = setTimeout(() => elements.toast.classList.remove("visible"), 2400);
}

elements.themeToggle.addEventListener("click", toggleTheme);
elements.openBank.addEventListener("click", openBankDialog);
elements.closeBank.addEventListener("click", closeBankDialog);
elements.emptyAddButton.addEventListener("click", () => {
  openBankDialog();
  openEditor();
});
elements.addQuestion.addEventListener("click", () => openEditor());
elements.cancelEdit.addEventListener("click", closeEditor);
elements.questionSearch.addEventListener("input", renderQuestionList);
elements.questionForm.addEventListener("submit", saveQuestion);
elements.exportQuestions.addEventListener("click", exportQuestions);
elements.resetQuestions.addEventListener("click", resetQuestions);
elements.confirmDelete.addEventListener("click", deleteQuestion);
elements.revealButton.addEventListener("click", revealAnswer);
elements.skipButton.addEventListener("click", skipQuestion);

elements.bankDialog.addEventListener("click", (event) => {
  if (event.target === elements.bankDialog) closeBankDialog();
});

document.addEventListener("keydown", (event) => {
  if (elements.bankDialog.open || elements.confirmDialog.open) return;
  if (event.key === "1") selectCard(0);
  if (event.key === "2") selectCard(1);
  if (event.key === "Enter" && !elements.revealButton.disabled) revealAnswer();
  if (event.key.toLowerCase() === "b") openBankDialog();
});

initializeTheme();
loadQuestions();
saveQuestions("");
startRound(false);
