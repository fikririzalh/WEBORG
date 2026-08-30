# MIAW-CRAFT Poker Rule

Rulebook interaktif berbasis HTML/CSS/JavaScript untuk prototype **MIAW-CRAFT Poker v0.1**.

## Menjalankan

Buka `index.html` langsung di browser modern. Tidak memerlukan build step, package manager, framework, atau koneksi internet untuk fungsi utama.

## Isi ZIP

- `index.html` — interface rulebook interaktif.
- `styles.css` — visual base yang diadaptasi dari file UI awal.
- `app.js` — data ability A–K + Joker, filter, detail dialog, mastery tracker, theme, dan checklist playtest.
- `miaw-craft-poker-rule.md` — rule lengkap berbentuk Markdown.

## Prinsip ruleset v0.1

- Rank menentukan ability.
- Suit belum memiliki ability.
- A netral; 2–10 core; J–K power; Joker chaos/wild.
- Hanya kartu yang baru ditempatkan yang memicu ability.
- Ability bersifat optional.
- Stack maksimum 3 kartu per hex.
- Kartu bonus dari 10 tidak mengaktifkan ability.
- Prototype belum mengunci scoring, Job system, winner condition, jumlah pemain final, atau ukuran board final.

Data mastery, theme, dan checklist playtest disimpan melalui `localStorage` browser.
