# MIAW BASE

Reusable **web boardgame starter kit** yang diekstrak dari pola UI/UX proyek MIAU! CRACK 4, tetapi **tanpa mempertahankan rules codebreaking sebagai core**.

Base ini ditujukan untuk membuat boardgame web berikutnya lebih cepat dengan cara mempertahankan platform umum dan menaruh aturan game di plugin terpisah.

## Prinsip utama

- `/core` = infrastruktur reusable. Jangan masukkan aturan game spesifik ke sini.
- `/games` = seluruh aturan, fase, scoring, win condition, dan UI khusus game.
- `styles.css` = design system dan komponen visual umum.
- `app.js` = bootstrap tipis. Tidak boleh menjadi tempat rules.
- `games/example-game.js` = executable reference, bukan game yang wajib dipertahankan.

## Bisa jalan tanpa npm

Cukup buka `index.html` di browser. Semua script sengaja memakai browser globals biasa, bukan ES module, agar base tetap dapat berjalan melalui `file://`.

Untuk development yang lebih nyaman, local static server tetap disarankan, misalnya VS Code Live Server atau server HTTP sederhana.

## Struktur

```text
miaw-base/
├── index.html
├── styles.css
├── app.js
├── AGENTS.md
├── README.md
├── core/
│   ├── platform.js
│   └── turn-engine.js
├── games/
│   └── example-game.js
├── docs/
│   ├── ARCHITECTURE.md
│   ├── GAME_CONTRACT.md
│   └── AI_HANDOFF.md
└── .github/
    └── copilot-instructions.md
```

## Fitur reusable saat ini

- Responsive desktop/mobile shell.
- Light/dark theme.
- Sound toggle + lightweight procedural beep.
- Toast utility.
- Preference persistence menggunakan `localStorage`.
- Generic render/bind runtime.
- Generic turn state: current player, round, turn number.
- Pass-device flow dapat diimplementasikan di plugin.
- Shared visual primitives: panel, hero, setup form, player cards, action card, log, result screen.
- HTML escaping helper untuk data pemain/user-generated text.

## Membuat game baru

1. Baca `AGENTS.md`.
2. Baca `docs/ARCHITECTURE.md` dan `docs/GAME_CONTRACT.md`.
3. Copy `games/example-game.js` menjadi `games/<nama-game>.js`.
4. Ubah `meta`, state, render phase, event handler, rules, scoring, dan win condition di file game baru.
5. Di `index.html`, ganti script `games/example-game.js` menjadi file game baru.
6. Pertahankan `/core` jika kebutuhan dapat diselesaikan di plugin.
7. Jalankan syntax check dan smoke test semua flow utama.

## Kapan core boleh diubah?

Core boleh diperluas jika kapabilitas itu benar-benar reusable lintas game, misalnya timer umum, deck utility, seeded RNG, save/load game state, animation coordinator, atau multiplayer transport adapter.

Core **tidak** boleh diubah hanya karena satu game membutuhkan role Werewolf, kartu Uno, petak Monopoly, grid Chess, atau aturan kemenangan khusus.

## Prompt singkat untuk AI berikutnya

```text
Gunakan repository ini sebagai MIAW BASE untuk web boardgame baru.
Baca AGENTS.md, docs/ARCHITECTURE.md, dan docs/GAME_CONTRACT.md terlebih dahulu.
Pertahankan /core kecuali ada kebutuhan reusable yang jelas.
Seluruh rules spesifik game harus berada di /games/<nama-game>.js atau folder game terkait.
Gunakan games/example-game.js hanya sebagai referensi kontrak, bukan sebagai rules yang harus diwarisi.
Setelah implementasi, validasi desktop/mobile, reset, theme, sound, setup, seluruh phase game, dan win condition.
```

## Status

MIAW BASE v1.0.0.
