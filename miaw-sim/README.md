# MIAW · SIM

Web boardgame 2-player single-device yang dibangun di atas **MIAW BASE**.

## Aturan

- Tepat 2 pemain.
- Papan memiliki 6 titik (`K6`) dan maksimum 15 garis unik.
- Blue bergerak pertama, lalu pemain bergantian.
- Setiap pemain memiliki warna tetap selama satu ronde: Blue atau Red.
- Pada giliran, pemain memilih dua titik yang belum terhubung lalu garis permanen dibuat dengan warna pemain tersebut.
- Garis yang sudah digunakan tidak boleh dipakai lagi.
- Pemain yang pertama melengkapi segitiga dengan tiga sisi seluruhnya berwarna miliknya sendiri langsung kalah.
- Hanya enam titik asli yang dihitung sebagai vertex. Persilangan garis bukan vertex.
- Secara teori tidak ada draw pada `K6`, karena `R(3,3)=6`.

## Format pertandingan

- **Quick Match:** 1 ronde.
- **IQ Duel:** 2 ronde. Pemain bertukar Blue/Red dan giliran pertama pada ronde 2.

## Kontrol

1. Tap/click titik pertama.
2. Tap/click titik kedua.
3. Jika pasangan belum terhubung, garis dibuat dan turn berpindah.
4. Tap titik terpilih sekali lagi untuk membatalkan pilihan.

Tidak ada danger hint karena membaca ancaman segitiga adalah inti permainan.

## Struktur

```text
miaw-smi/
├── index.html
├── styles.css
├── app.js
├── core/
│   ├── platform.js
│   └── turn-engine.js
├── games/
│   └── sim.js
├── docs/
│   ├── ARCHITECTURE.md
│   ├── GAME_CONTRACT.md
│   └── AI_HANDOFF.md
├── AGENTS.md
└── .github/
    └── copilot-instructions.md
```

## Menjalankan

Tidak memerlukan npm, framework, database, atau build process. Buka `index.html` pada browser modern atau serve folder ini sebagai static site.
