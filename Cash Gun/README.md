# MIAU! HEIST

Single-device hybrid party tracker dengan tema kucing-heist.

## Tujuan desain
Web hanya mengurus:
- CRUD pemain
- CRUD loot
- 8 ronde
- strike / eliminasi
- siapa yang fold
- draft loot
- inventory
- skor otomatis
- dark/light
- sound
- localStorage
- export/import JSON

Fase bluff sengaja dilakukan di meja menggunakan kartu atau gesture tangan yang aman.

## Skor custom
Versi ini menggunakan scoring original:
- Cash: nilai kartu
- Permata: Rp8.000/kartu (editable) + bonus mayoritas Rp20.000 jika tidak seri
- Koleksi seni: 1=5K, 2=15K, 3=30K, 4=50K, 5+=75K/100K sesuai tabel engine
- Catnip Patch: saat diambil, mengurangi 1 strike
- Golden Fish: bonus nilai tetap

## File
- index.html
- styles.css
- seed.js
- app.js

Tidak perlu npm/server. Extract lalu buka `index.html`.
