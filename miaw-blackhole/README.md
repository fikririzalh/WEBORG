# MIAW · BLACK HOLE

Web boardgame lokal 2–4 pemain yang dibangun di atas **MIAW BASE**.

## Aturan inti

- Pemain bergiliran menaruh angka miliknya ke satu lingkaran kosong.
- Angka wajib dimainkan berurutan naik mulai dari 1.
- Lokasi angka bebas dan tidak harus terhubung dengan angka sebelumnya.
- Setelah seluruh angka dimainkan, tepat satu lingkaran tetap kosong dan menjadi **Black Hole**.
- Hanya angka pada lingkaran yang bertetangga langsung dengan Black Hole yang dihitung.
- Pemain dengan total penalty paling rendah menang.
- Jika beberapa pemain berbagi skor minimum yang sama, implementasi MIAW menganggapnya shared win.

## Konfigurasi papan

| Mode | Pemain | Baris | Sel | Angka per pemain | Status |
|---|---:|---:|---:|---:|---|
| Classic | 2 | 6 | 21 | 1–10 | aturan asli |
| Trio | 3 | 7 | 28 | 1–9 | ekstensi 3-player terdokumentasi |
| Arena | 4 | 9 | 45 | 1–11 | ekstensi MIAW |
| Compact | 4 | 6 | 21 | 1–5 | ekstensi MIAW |

Semua konfigurasi memenuhi:

```text
Total cells = (players × numbers per player) + 1
```

sehingga selalu tersisa tepat satu Black Hole.

## Referensi aturan

Aturan 2-player mengikuti rulebook **BLACK HOLE** karya Wal Joris yang diterbitkan Néstor Games. Format 3-player 7 baris/1–9 mengikuti dokumentasi paper-and-pen game yang memakai mekanisme yang sama. Format 4-player adalah ekstensi proyek MIAW, bukan klaim sebagai aturan asli.

## Struktur

```text
miaw-blackhole/
├── index.html
├── styles.css
├── app.js
├── VERSION
├── core/
│   ├── platform.js
│   └── turn-engine.js
├── games/
│   └── blackhole.js
├── docs/
│   ├── ARCHITECTURE.md
│   ├── GAME_CONTRACT.md
│   └── AI_HANDOFF.md
├── README.md
├── AGENTS.md
└── .github/
    └── copilot-instructions.md
```

## Menjalankan

Tidak membutuhkan npm, framework, database, atau build process. Buka `index.html` langsung di browser atau gunakan static server lokal.

## Status validasi

- JavaScript syntax check: PASS.
- Konfigurasi 2P/3P/4P menghasilkan tepat satu Black Hole: PASS.
- Neighbor topology triangular lattice: PASS.
- Interior cell memiliki 6 tetangga: PASS.
- Corner/topology edge check: PASS.
- Penalty scoring dan shared-win tie: PASS.
- Local script/file references: diperiksa saat packaging.

Browser screenshot smoke-test di environment build tidak dapat diselesaikan karena Chromium headless hang pada dependency DBus sistem. Logic dan static validation tetap dijalankan.
