# MIAW · HOLD THAT LINE

Web boardgame lokal 2 pemain berbasis **MIAW BASE**, mengadaptasi permainan paper-and-pencil *Hold That Line* karya Sid Sackson.

## Aturan yang diimplementasikan

- 2 pemain, satu perangkat.
- Satu jalur kontinu.
- Move pertama boleh dimulai dari titik mana pun.
- Satu move adalah satu garis lurus horizontal, vertikal, atau diagonal 45°.
- Garis boleh melewati beberapa titik yang segaris dalam satu move.
- Setelah move pertama, extension harus dimulai dari salah satu dari dua endpoint jalur.
- Tidak boleh crossing, overlap, branching, atau mengunjungi titik yang sudah pernah dilewati.
- Pemain yang membuat extension legal terakhir **kalah**.

## Mode papan

- `Classic` — 4×4, 16 titik. Konfigurasi asli.
- `Long` — 5×5, 25 titik. Variasi untuk game lebih panjang.
- `Expert` — 6×6, 36 titik. Ekstensi MIAW.

## Format pertandingan

- `Quick Match` — 1 ronde.
- `Fair Duel` — 2 ronde. Opening player ditukar pada ronde kedua.

## Struktur

```text
miaw-hold-that-line/
├── index.html
├── styles.css
├── app.js
├── VERSION
├── AGENTS.md
├── README.md
├── core/
│   ├── platform.js
│   └── turn-engine.js
├── games/
│   └── hold-that-line.js
├── docs/
│   ├── ARCHITECTURE.md
│   ├── GAME_CONTRACT.md
│   └── AI_HANDOFF.md
└── .github/
    └── copilot-instructions.md
```

## Menjalankan

Tidak memerlukan npm atau build tool. Buka `index.html` langsung di browser atau gunakan static server lokal.

## Rule provenance

Konfigurasi 4×4 dan aturan inti mengikuti Sid Sackson, *A Gamut of Games*. Mode 5×5 didukung sebagai perluasan papan oleh Sackson. Mode 6×6 adalah variasi MIAW agar tersedia tiga tier permainan.

## Version

MIAW · HOLD THAT LINE v1.0.0.
