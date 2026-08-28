# MIAU! THUMP THUMP

Single-device party-game prototype berbasis HTML/CSS/JavaScript tanpa framework, server, atau instalasi.

## Cara menjalankan
1. Extract ZIP.
2. Buka `index.html` di browser modern.
3. Pilih 3–8 pemain dan mode permainan.

## Fitur
- Competitive dan Co-op.
- Setup 3–8 pemain; 3 pemain otomatis mulai dengan 6 Action Card.
- Practice round pertama tanpa penalti.
- Action row dinamis, performer otomatis mengikuti urutan pemain aktif.
- Success → pilih 1 dari 3 kartu baru.
- Failure competitive → pilih pemain yang salah; 3 strike = eliminasi.
- Failure co-op → shared failure; 3 = kalah.
- Target co-op: 9 Action + 3 Modifier/Attack.
- Beat helper 80/100/120/140 BPM (opsional).
- Dark/light mode dan sound effect via Web Audio API.
- CRUD pemain, Action, Modifier, Attack.
- ID human-friendly: P001 / A001 / M001 / X001.
- Export/import JSON dan localStorage.
- Seed original: 30 Action, 15 Modifier, 10 Attack.

## Tentang desain
Prototype ini mengambil inspirasi dari struktur permainan ritme/memori Coyote, tetapi **tidak menyertakan artwork atau teks kartu Coyote/Exploding Kittens**. Semua phrase, action, modifier, attack, UI, dan visual di prototype adalah konten original untuk eksperimen pribadi.

## File
- `index.html` — struktur UI
- `styles.css` — tema dan layout
- `cards.js` — seluruh seed kartu/pemain; paling mudah diutak-atik
- `app.js` — game engine + CRUD + localStorage
