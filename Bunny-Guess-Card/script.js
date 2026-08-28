(() => {
  "use strict";

  const SUITS = [
    { key: "spades", symbol: "♠", name: "Sekop", color: "black" },
    { key: "hearts", symbol: "♥", name: "Hati", color: "red" },
    { key: "diamonds", symbol: "♦", name: "Wajik", color: "red" },
    { key: "clubs", symbol: "♣", name: "Keriting", color: "black" }
  ];
  const RANKS = [
    { label: "2", value: 2 }, { label: "3", value: 3 }, { label: "4", value: 4 },
    { label: "5", value: 5 }, { label: "6", value: 6 }, { label: "7", value: 7 },
    { label: "8", value: 8 }, { label: "9", value: 9 }, { label: "10", value: 10 },
    { label: "J", value: 11 }, { label: "Q", value: 12 }, { label: "K", value: 13 },
    { label: "A", value: 14 }
  ];
  const STEP_COPY = [
    {
      title: "Tebak warna",
      hint: "Tebak sebelum kartu pertama dibuka",
      question: "Apa warna kartu ini?"
    },
    {
      title: "Lebih besar?",
      hint: "Bandingkan dengan kartu pertama",
      question: "Apakah nilainya lebih besar?"
    },
    {
      title: "Di dalam rentang?",
      hint: "Batas tidak ikut dihitung",
      question: "Apakah nilainya berada di antara dua kartu?"
    },
    {
      title: "Tebak lambang",
      hint: "Tahap terakhir • peluang 1 dari 4",
      question: "Apa lambang kartu terakhir?"
    }
  ];

  const refs = {
    menuScreen: document.querySelector("#menuScreen"),
    gameScreen: document.querySelector("#gameScreen"),
    resultScreen: document.querySelector("#resultScreen"),
    playButton: document.querySelector("#playButton"),
    nextTurnButton: document.querySelector("#nextTurnButton"),
    menuButton: document.querySelector("#menuButton"),
    brandButton: document.querySelector("#brandButton"),
    themeButton: document.querySelector("#themeButton"),
    soundButton: document.querySelector("#soundButton"),
    stepTitle: document.querySelector("#stepTitle"),
    stepCounter: document.querySelector("#stepCounter"),
    progressBars: [...document.querySelectorAll(".progress-track i")],
    currentCard: document.querySelector("#currentCard"),
    cardFront: document.querySelector("#cardFront"),
    revealedRow: document.querySelector("#revealedRow"),
    deckCount: document.querySelector("#deckCount"),
    questionNumber: document.querySelector("#questionNumber"),
    questionHint: document.querySelector("#questionHint"),
    questionText: document.querySelector("#questionText"),
    answerGrid: document.querySelector("#answerGrid"),
    resultCard: document.querySelector("#resultCard"),
    resultIcon: document.querySelector("#resultIcon"),
    resultEyebrow: document.querySelector("#resultEyebrow"),
    resultTitle: document.querySelector("#resultTitle"),
    resultMessage: document.querySelector("#resultMessage"),
    resultReveal: document.querySelector("#resultReveal"),
    toast: document.querySelector("#toast"),
    themeMeta: document.querySelector('meta[name="theme-color"]')
  };

  let deck = [];
  let revealed = [];
  let currentCard = null;
  let step = 0;
  let locked = false;
  let toastTimer = null;
  let theme = localStorage.getItem("gamegabut.theme") === "dark" ? "dark" : "light";
  let sound = localStorage.getItem("gamegabut.sound") !== "off";

  function createDeck() {
    const cards = [];
    SUITS.forEach((suit) => {
      RANKS.forEach((rank) => cards.push({
        suit: suit.key,
        suitName: suit.name,
        symbol: suit.symbol,
        color: suit.color,
        rank: rank.label,
        value: rank.value
      }));
    });
    return shuffle(cards);
  }

  function shuffle(cards) {
    for (let index = cards.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [cards[index], cards[randomIndex]] = [cards[randomIndex], cards[index]];
    }
    return cards;
  }

  function setScreen(name) {
    refs.menuScreen.classList.toggle("active", name === "menu");
    refs.gameScreen.classList.toggle("active", name === "game");
    refs.resultScreen.classList.toggle("active", name === "result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startRound() {
    deck = createDeck();
    revealed = [];
    currentCard = null;
    step = 0;
    locked = false;
    setScreen("game");
    prepareStep();
    tone("start");
  }

  function prepareStep() {
    locked = false;
    currentCard = deck.pop();
    refs.currentCard.classList.add("face-down");
    refs.currentCard.classList.remove("reveal-bounce");
    refs.cardFront.className = `card-face card-front ${currentCard.color === "red" ? "red" : ""}`;
    refs.cardFront.innerHTML = cardFrontHTML(currentCard);
    renderStep();
  }

  function renderStep() {
    const copy = STEP_COPY[step];
    refs.stepTitle.textContent = copy.title;
    refs.stepCounter.textContent = `${step + 1} / 4`;
    refs.questionNumber.textContent = String(step + 1).padStart(2, "0");
    refs.questionHint.textContent = copy.hint;
    refs.questionText.textContent = copy.question;
    refs.deckCount.textContent = deck.length;
    refs.progressBars.forEach((bar, index) => bar.classList.toggle("active", index <= step));
    refs.revealedRow.innerHTML = revealed.map(miniCardHTML).join("");
    renderAnswers();
  }

  function renderAnswers() {
    refs.answerGrid.classList.toggle("four", step === 3);
    if (step === 0) {
      refs.answerGrid.innerHTML = [
        answerHTML("red", "♥", "Merah", "red-choice"),
        answerHTML("black", "♠", "Hitam", "black-choice")
      ].join("");
    } else if (step === 1) {
      refs.answerGrid.innerHTML = [
        answerHTML("yes", "↑", "Lebih besar"),
        answerHTML("no", "≤", "Tidak lebih besar")
      ].join("");
    } else if (step === 2) {
      const low = Math.min(revealed[0].value, revealed[1].value);
      const high = Math.max(revealed[0].value, revealed[1].value);
      refs.questionText.textContent = `Apakah nilainya di antara ${rankForValue(low)} dan ${rankForValue(high)}?`;
      refs.answerGrid.innerHTML = [
        answerHTML("yes", "↔", "Di dalam rentang"),
        answerHTML("no", "↯", "Di luar rentang")
      ].join("");
    } else {
      refs.answerGrid.innerHTML = SUITS.map((suit) =>
        answerHTML(suit.key, suit.symbol, suit.name, suit.color === "red" ? "red-choice" : "black-choice")
      ).join("");
    }
    refs.answerGrid.querySelectorAll("[data-answer]").forEach((button) => {
      button.addEventListener("click", () => handleAnswer(button.dataset.answer, button));
    });
  }

  function answerHTML(value, icon, label, extraClass = "") {
    return `<button class="answer-button ${extraClass}" type="button" data-answer="${value}"><span class="answer-icon">${icon}</span><span>${label}</span></button>`;
  }

  function handleAnswer(answer, selectedButton) {
    if (locked) return;
    locked = true;
    const correct = isCorrect(answer);
    refs.answerGrid.querySelectorAll(".answer-button").forEach((button) => { button.disabled = true; });
    selectedButton.classList.add(correct ? "correct" : "wrong");

    refs.currentCard.classList.remove("face-down");
    refs.currentCard.classList.add("reveal-bounce");
    tone(correct ? "correct" : "wrong");
    showToast(correct ? "Benar! Lanjut..." : `Salah. Kartunya ${cardLabel(currentCard)}.`, correct);

    if (!correct) {
      window.setTimeout(() => showResult(false, [...revealed, currentCard]), 1050);
      return;
    }

    if (step === 3) {
      window.setTimeout(() => showResult(true, [...revealed, currentCard]), 1100);
      return;
    }

    window.setTimeout(() => {
      revealed.push(currentCard);
      step += 1;
      prepareStep();
    }, 950);
  }

  function isCorrect(answer) {
    if (step === 0) return answer === currentCard.color;
    if (step === 1) {
      const isHigher = currentCard.value > revealed[0].value;
      return answer === (isHigher ? "yes" : "no");
    }
    if (step === 2) {
      const low = Math.min(revealed[0].value, revealed[1].value);
      const high = Math.max(revealed[0].value, revealed[1].value);
      const isBetween = currentCard.value > low && currentCard.value < high;
      return answer === (isBetween ? "yes" : "no");
    }
    return answer === currentCard.suit;
  }

  function showResult(win, cards) {
    refs.resultCard.classList.toggle("win", win);
    refs.resultIcon.textContent = win ? "✓" : "×";
    refs.resultEyebrow.textContent = win ? "Empat dari empat" : "Ronde berakhir";
    refs.resultTitle.textContent = win ? "Kamu menang!" : "Belum beruntung.";
    refs.resultMessage.textContent = win
      ? "Semua tebakan tepat. Nikmati kemenanganmu sebelum HP dioper."
      : "Satu jawaban salah sudah cukup. Sekarang waktunya oper HP.";
    refs.resultReveal.innerHTML = cards.map(miniCardHTML).join("");
    refs.nextTurnButton.querySelector("span").textContent = win ? "Oper HP & ronde baru" : "Oper HP";
    setScreen("result");
    tone(win ? "win" : "lose");
  }

  function cardFrontHTML(card) {
    return `
      <div class="corner"><b>${card.rank}</b><span>${card.symbol}</span></div>
      <div class="center-suit">${card.symbol}</div>
      <div class="corner bottom"><b>${card.rank}</b><span>${card.symbol}</span></div>`;
  }

  function miniCardHTML(card) {
    return `<div class="mini-card ${card.color === "red" ? "red" : ""}"><b>${card.rank}</b><span>${card.symbol}</span></div>`;
  }

  function cardLabel(card) {
    return `${card.rank} ${card.suitName}`;
  }

  function rankForValue(value) {
    return RANKS.find((rank) => rank.value === value)?.label || value;
  }

  function showToast(message, success = false) {
    window.clearTimeout(toastTimer);
    refs.toast.textContent = message;
    refs.toast.style.background = success ? "#20976c" : "#183653";
    refs.toast.classList.add("show");
    toastTimer = window.setTimeout(() => refs.toast.classList.remove("show"), 850);
  }

  function tone(type) {
    if (!sound) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const settings = {
        start: [430, 650, .09],
        correct: [620, 850, .1],
        wrong: [210, 130, .12],
        win: [540, 960, .22],
        lose: [270, 150, .16]
      }[type] || [420, 520, .08];
      oscillator.type = type === "wrong" || type === "lose" ? "sine" : "triangle";
      oscillator.frequency.setValueAtTime(settings[0], context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(settings[1], context.currentTime + settings[2]);
      gain.gain.setValueAtTime(.045, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + settings[2]);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + settings[2]);
    } catch {
      // Audio feedback is optional.
    }
  }

  function applyTheme() {
    document.querySelector("#app").classList.toggle("dark", theme === "dark");
    refs.themeButton.textContent = theme === "dark" ? "☀" : "☾";
    refs.soundButton.textContent = sound ? "♪" : "×";
    refs.themeMeta.setAttribute("content", theme === "dark" ? "#101d33" : "#edf8ff");
  }

  refs.playButton.addEventListener("click", startRound);
  refs.nextTurnButton.addEventListener("click", startRound);
  refs.menuButton.addEventListener("click", () => setScreen("menu"));
  refs.brandButton.addEventListener("click", (event) => {
    event.preventDefault();
    setScreen("menu");
  });
  refs.themeButton.addEventListener("click", () => {
    theme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("gamegabut.theme", theme);
    applyTheme();
  });
  refs.soundButton.addEventListener("click", () => {
    sound = !sound;
    localStorage.setItem("gamegabut.sound", sound ? "on" : "off");
    applyTheme();
  });

  applyTheme();
})();
