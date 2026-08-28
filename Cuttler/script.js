// ===== PAGE NAVIGATION =====
function showPage(page) {
  // Hide all sections
  document.querySelectorAll("main section").forEach(x => x.classList.add("hide"));

  // Show target section
  const target = document.getElementById(page);
  target.classList.remove("hide");

  // Animate the header emoji
  const headerEmoji = document.querySelector(".header-emoji");
  if (headerEmoji) {
    headerEmoji.style.animation = "none";
    void headerEmoji.offsetHeight; // trigger reflow
    headerEmoji.style.animation = "floatEmoji 3s ease-in-out infinite";

    // Change header emoji based on page
    const emojis = {
      cards: "😻",
      rules: "📜",
      tracker: "📊"
    };
    headerEmoji.textContent = emojis[page] || "😻";
  }

  // Animate section title
  const sectionTitle = target.querySelector("h2");
  if (sectionTitle) {
    sectionTitle.style.animation = "none";
    void sectionTitle.offsetHeight;
    sectionTitle.style.animation = "fadeIn 0.5s ease";
  }

  // Animate cards in the section
  const cards = target.querySelectorAll(".card");
  cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    setTimeout(() => {
      card.style.transition = "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, 80 * index);
  });
}

// ===== DARK MODE TOGGLE =====
document.getElementById("darkBtn").onclick = function () {
  document.body.classList.toggle("dark");

  // Update button emoji
  const isDark = document.body.classList.contains("dark");
  this.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";

  // Animate the toggle
  this.style.transform = "scale(0.95)";
  setTimeout(() => {
    this.style.transform = "scale(1)";
  }, 150);
};

// ===== CARD HOVER PARTICLE BURST =====
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("mouseenter", function (e) {
    const emoji = this.querySelector(".card-emoji");
    if (!emoji) return;

    // Create floating particles
    for (let i = 0; i < 6; i++) {
      const particle = document.createElement("span");
      particle.textContent = emoji.textContent;
      particle.style.position = "absolute";
      particle.style.fontSize = "1rem";
      particle.style.pointerEvents = "none";
      particle.style.opacity = "0.6";
      particle.style.zIndex = "10";
      particle.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";

      // Position relative to the card
      const rect = this.getBoundingClientRect();
      const startX = e.clientX - rect.left + (Math.random() - 0.5) * 20;
      const startY = e.clientY - rect.top + (Math.random() - 0.5) * 20;

      particle.style.left = startX + "px";
      particle.style.top = startY + "px";

      const angle = (Math.PI * 2 * i) / 6;
      const distance = 40 + Math.random() * 30;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;

      this.appendChild(particle);

      requestAnimationFrame(() => {
        particle.style.transform = `translate(${dx}px, ${dy}px) scale(0)`;
        particle.style.opacity = "0";
      });

      setTimeout(() => {
        particle.remove();
      }, 800);
    }
  });
});

// ===== AUTO-SHOW CARDS PAGE ON LOAD =====
window.addEventListener("DOMContentLoaded", () => {
  // Ensure cards page is visible
  const cardsSection = document.getElementById("cards");
  if (cardsSection) {
    cardsSection.classList.remove("hide");
  }

  // Animate cards on load with staggered delay
  const cards = document.querySelectorAll(".card");
  cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    setTimeout(() => {
      card.style.transition = "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, 100 * index);
  });
});
