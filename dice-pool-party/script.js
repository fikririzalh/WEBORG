(function () {
  "use strict";

  /* ---------- Config ---------- */
  var COLORS = [
    { key: "pink",   label: "Pink"   },
    { key: "ungu",   label: "Ungu"   },
    { key: "kuning", label: "Kuning" },
    { key: "biru",   label: "Biru"   },
    { key: "hijau",  label: "Hijau"  },
    { key: "putih",  label: "Putih"  }
  ];
  var SHAKE_MS = 750;   // how long the "kocok" animation plays
  var REVEAL_MS = 3000; // exact viewing window, per game rules

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Elements ---------- */
  var pool       = document.getElementById("pool");
  var rollBtn    = document.getElementById("rollBtn");
  var rollLabel  = document.getElementById("rollBtnLabel");
  var statusEl   = document.getElementById("status");
  var barFill    = document.getElementById("poolBarFill");
  var poolBadge  = document.getElementById("poolBadge");
  var themeBtn   = document.getElementById("themeToggle");

  /* ---------- Build the 12 dice tiles once ---------- */
  var allDice = []; // flat list of die elements, in fixed color order

  COLORS.forEach(function (color) {
    var group = document.createElement("div");
    group.className = "color-group";

    var pair = document.createElement("div");
    pair.className = "dice-pair";

    for (var i = 0; i < 2; i++) {
      var die = document.createElement("div");
      die.className = "die";
      die.setAttribute("data-color", color.key);
      die.setAttribute("data-value", "1");
      for (var d = 0; d < 9; d++) {
        var dot = document.createElement("span");
        dot.className = "dot";
        die.appendChild(dot);
      }
      pair.appendChild(die);
      allDice.push(die);
    }

    var label = document.createElement("span");
    label.className = "color-label";
    label.textContent = color.label;

    group.appendChild(pair);
    group.appendChild(label);
    pool.appendChild(group);
  });

  /* ---------- Core sequence ----------
     kocok -> intip 3 detik -> tertutup otomatis
       -> (pemain diam-diam pilih kategori)
       -> tombol "Buka" (manual) -> dadu terbuka PERMANEN untuk dicek & dihitung
       -> tombol "Kocok lagi" -> ulangi
     Nilai dadu TIDAK berubah antara intip dan buka-cek: itu dadu yang sama,
     supaya skor yang dihitung selalu akurat sesuai dadu yang benar-benar jatuh.
  ------------------------------------------------------------------------- */
  var phase = "idle"; // idle -> shaking -> peek -> awaitingCheck -> checking -> (idle)

  function setStatus(text, live) {
    statusEl.textContent = text;
    statusEl.classList.toggle("status-live", !!live);
  }

  function randomValue() {
    return 1 + Math.floor(Math.random() * 6);
  }

  function setButton(label, enabled) {
    rollLabel.textContent = label;
    rollBtn.disabled = !enabled;
  }

  function startShakeAndPeek() {
    phase = "shaking";
    pool.setAttribute("data-state", "shaking");
    poolBadge.textContent = "MENGOCOK…";
    setStatus("Mengocok dadu…");
    setButton("Mengocok…", false);

    var shakeTime = reduceMotion ? 150 : SHAKE_MS;

    setTimeout(function () {
      // roll fresh values while still covered — nobody has seen these yet
      allDice.forEach(function (die) {
        die.setAttribute("data-value", String(randomValue()));
      });

      // timed peek — exactly REVEAL_MS, auto-closes at the end
      phase = "peek";
      pool.setAttribute("data-state", "open");
      poolBadge.textContent = "TERBUKA";
      setStatus("Lihat baik-baik! Ingat posisinya…", true);

      var start = performance.now();
      barFill.style.width = "100%";

      function tick(now) {
        var elapsed = now - start;
        var remain = Math.max(0, REVEAL_MS - elapsed);
        barFill.style.width = (remain / REVEAL_MS * 100) + "%";

        if (remain > 0 && phase === "peek") {
          requestAnimationFrame(tick);
        } else if (phase === "peek") {
          closeAfterPeek();
        }
      }
      requestAnimationFrame(tick);

    }, shakeTime);
  }

  function closeAfterPeek() {
    // auto-close after the 3-second glimpse — values are kept, just hidden
    phase = "awaitingCheck";
    pool.setAttribute("data-state", "closed");
    poolBadge.textContent = "TERTUTUP";
    barFill.style.width = "0%";
    setStatus("Tertutup. Pilih kategori kalian diam-diam. Sudah semua? Tekan tombolnya untuk membuka & mengecek dadu yang sebenarnya buat hitung skor.");
    setButton("👁️ Buka untuk Cek Skor", true);
  }

  function openForScoring() {
    // manual, stays open — no timer — so scores can be checked against the
    // real dice, not against memory
    phase = "checking";
    pool.setAttribute("data-state", "open");
    poolBadge.textContent = "TERBUKA — CEK SKOR";
    setStatus("Dadu terbuka. Cocokkan pilihan kategori kalian dengan dadu asli ini dan hitung skornya. Siap ronde berikutnya? Tekan tombolnya.");
    setButton("🎲 Kocok Dadu (Ronde Berikutnya)", true);
  }

  function handleClick() {
    if (phase === "idle" || phase === "checking") {
      startShakeAndPeek();
    } else if (phase === "awaitingCheck") {
      openForScoring();
    }
    // "shaking" and "peek" phases: button is disabled, click ignored
  }

  rollBtn.addEventListener("click", handleClick);

  /* ---------- Theme toggle (persisted locally, offline) ---------- */
  var root = document.documentElement;
  var STORAGE_KEY = "dice-pool-party-theme";

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* ignore */ }
  }

  (function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* ignore */ }
    if (saved === "light" || saved === "dark") {
      applyTheme(saved);
    }
    // otherwise CSS prefers-color-scheme handles the initial look
  })();

  themeBtn.addEventListener("click", function () {
    var current = root.getAttribute("data-theme");
    var isDark = current === "dark" ||
      (current !== "light" && window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    applyTheme(isDark ? "light" : "dark");
  });

})();
