const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const sidebarThemeButton = document.getElementById("sidebarThemeButton");
const themeIcon = themeToggle.querySelector(".theme-icon");
const themeLabel = themeToggle.querySelector(".theme-label");

function getPreferredTheme() {
  const saved = localStorage.getItem("ohHellTheme");
  if (saved === "light" || saved === "dark") return saved;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("ohHellTheme", theme);

  const isDark = theme === "dark";
  themeIcon.textContent = isDark ? "☀" : "☾";
  themeLabel.textContent = isDark ? "Light" : "Dark";
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"
  );
  sidebarThemeButton.innerHTML = `<span aria-hidden="true">${isDark ? "☀" : "☾"}</span>`;
  sidebarThemeButton.setAttribute(
    "aria-label",
    isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"
  );
}

function toggleTheme() {
  const current = root.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
}

applyTheme(getPreferredTheme());

themeToggle.addEventListener("click", toggleTheme);
sidebarThemeButton.addEventListener("click", toggleTheme);

// Accordion
const accordions = [...document.querySelectorAll(".accordion")];

accordions.forEach((item) => {
  const trigger = item.querySelector(".accordion-trigger");

  trigger.addEventListener("click", () => {
    const willOpen = !item.classList.contains("open");
    item.classList.toggle("open", willOpen);
    trigger.setAttribute("aria-expanded", String(willOpen));
  });
});

// Expand / collapse all
const expandAllButton = document.getElementById("expandAll");
let allExpanded = false;

expandAllButton.addEventListener("click", () => {
  allExpanded = !allExpanded;

  accordions.forEach((item) => {
    item.classList.toggle("open", allExpanded);
    item
      .querySelector(".accordion-trigger")
      .setAttribute("aria-expanded", String(allExpanded));
  });

  expandAllButton.textContent = allExpanded
    ? "Tutup semua aturan"
    : "Buka semua aturan";
});

// Score calculator
const scoreCalculator = document.getElementById("scoreCalculator");
const bidInput = document.getElementById("bidInput");
const wonInput = document.getElementById("wonInput");
const scoreResult = document.getElementById("scoreResult");

function calculateScore(bid, won) {
  const exact = bid === won;
  return {
    exact,
    score: exact ? 10 + won : won
  };
}

function renderScore() {
  const bid = Math.max(0, Number(bidInput.value) || 0);
  const won = Math.max(0, Number(wonInput.value) || 0);
  const result = calculateScore(bid, won);

  scoreResult.innerHTML = result.exact
    ? `
      <span>🎉</span>
      <div>
        <small>HASIL</small>
        <strong>${result.score} poin</strong>
        <p>Prediksi tepat! Kamu mendapat +10 bonus.</p>
      </div>
    `
    : `
      <span>😿</span>
      <div>
        <small>HASIL</small>
        <strong>${result.score} poin</strong>
        <p>Prediksi meleset. Skor hanya sebanyak trick yang dimenangkan.</p>
      </div>
    `;
}

scoreCalculator.addEventListener("submit", (event) => {
  event.preventDefault();
  renderScore();
});

bidInput.addEventListener("input", renderScore);
wonInput.addEventListener("input", renderScore);

// Reading progress
const readProgress = document.getElementById("readProgress");
const readPercent = document.getElementById("readPercent");

function updateReadingProgress() {
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - window.innerHeight;
  const progress =
    scrollable <= 0 ? 100 : Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100));

  readProgress.style.width = `${progress}%`;
  readPercent.textContent = `${Math.round(progress)}%`;
}

window.addEventListener("scroll", updateReadingProgress, { passive: true });
window.addEventListener("resize", updateReadingProgress);
updateReadingProgress();

// Active sidebar section
const observedSections = [...document.querySelectorAll(".section-anchor, #beranda")];
const sideLinks = [...document.querySelectorAll(".side-link")];

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    sideLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.dataset.section === visible.target.id
      );
    });
  },
  {
    rootMargin: "-30% 0px -55% 0px",
    threshold: [0, 0.15, 0.4, 0.7]
  }
);

observedSections.forEach((section) => observer.observe(section));

// Smooth navigation fallback with sticky topbar offset
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();

    const y =
      target.getBoundingClientRect().top +
      window.scrollY -
      (window.innerWidth <= 900 ? 92 : 116);

    window.scrollTo({ top: y, behavior: "smooth" });
  });
});
