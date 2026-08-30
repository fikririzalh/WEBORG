# Cat Go to Work: MIAW-CRAFT

MIAW-CRAFT adalah prototype board game digital dua pemain, single-device/hot-seat, menggunakan HTML, CSS, dan vanilla JavaScript.

## Versi 1.1

Pembaruan ini menambahkan dua referensi utama di header:

- **Rule Book**: tujuan, komponen, anatomi token, setup, urutan turn, stack/adjacency, Job Order, scoring, coin action, privacy, dan kondisi akhir permainan.
- **Skill Book**: referensi lengkap 6 profesi Worker, target legal, efek skill, contoh penggunaan, serta aturan Dual Worker.

Legend profesi di bawah papan kini dapat diklik untuk langsung membuka Skill Book pada profesi terkait.

## Komponen permainan

- 1 papan hex 19 lokasi.
- 36 Worker: 30 reguler + 6 Dual Worker.
- 6 Worker reguler digunakan sebagai starting Worker.
- Worker Bag dimulai dengan 30 token: 24 reguler + 6 Dual.
- 24 Job Order.
- 3 koin per pemain.
- 2 pemain: Mochi dan Yuki.

## Profesi dan skill

1. Baker — Bonus Shift.
2. Recruiter — Talent Search.
3. Courier — Express Move.
4. Mechanic — Fine Tune.
5. Barista — Table Swap.
6. Manager — Team Lead.
7. Dual Worker — dua profesi, tetapi hanya satu skill dipilih ketika diaktifkan.

## Menjalankan game

Tidak membutuhkan instalasi atau server. Ekstrak folder lalu buka `index.html` pada browser modern.

## File

- `index.html` — struktur UI, Rule Book, dan Skill Book.
- `style.css` — layout, board, token, modal, rulebook, dan responsive styling.
- `script.js` — state permainan, abilities, Job Order matching, hot-seat privacy, scoring, serta dynamic Skill Book.

## Catatan desain

MIAW-CRAFT menggunakan pola board game abstract pattern-building sebagai inspirasi mekanik, tetapi nama, tema, profesi, UI, teks aturan, Job Order, dan identitas visual prototype ini disusun untuk MIAW-CRAFT.
