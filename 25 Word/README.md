# MIAU! 25 Kata atau Kurang

Prototype party game lokal satu-device yang mengambil inspirasi mekanik umum dari 25 Words or Less: dua tim, 5–10 target, bidding batas clue, timer, penghitung kata, dan satu poin per ronde.

## Jalankan
Buka `index.html` langsung di browser modern. Tidak perlu npm, server, framework, akun, atau database.

## Fitur
- Single-device, dua tim.
- CRUD pemain dengan ID manusiawi `P001`, `P002`, dst.
- CRUD kartu dengan ID manusiawi `C001`, `C002`, dst.
- Seed 82 kartu original (30 kartu awal + 52 kartu tambahan bertema lokal Indonesia: kuliner, kota, legenda rakyat, budaya daerah, dsb.), masing-masing 7 target; CRUD mendukung 5–10 target.
- Search CRUD berdasarkan ID, nama, dan isi kata.
- Bidding turun dari 25 dengan history.
- Fase challenge: timer, counter clue-word, mark 5–10 target, undo.
- Gagal karena waktu habis / clue melebihi bid -> poin otomatis ke lawan.
- Target skor default 10, configurable.
- Dark/light mode dan sound effect Web Audio API.
- localStorage + Export/Import JSON.
- Keyboard saat challenge: `1`–`9` menandai target 1–9, `0` untuk target ke-10; `Space` mencatat +1 clue word.

## Catatan penggunaan satu layar
Saat kartu rahasia tampil, anggota tim yang menebak sebaiknya tidak melihat layar. UI menyediakan tombol sembunyikan/tampilkan untuk membantu pergantian posisi perangkat.

## Konten
Daftar kata seed dibuat khusus untuk prototype ini dan bukan salinan deck komersial.


## Varian FIX v2
- Aturan fisik asli memakai 5 target; versi web ini sengaja mendukung 5–10 target per kartu.
- 82 seed bawaan memakai 7 target per kartu (30 set awal + 52 set tambahan bertema lokal).
- Jumlah target di UI, hasil ronde, validasi CRUD, import JSON, dan hotkey mengikuti panjang `words`.
- Hotkey target: 1–9, dan 0 untuk target ke-10.
- Storage key menjadi `miau-25-less-v2` agar seed baru tidak tertahan data v1 di browser.
- Tombol "Reset Kartu" di tab Data mengikuti jumlah seed saat ini secara otomatis (tidak hardcode).

## Set kartu tambahan (31–82)
52 kartu baru ditambahkan dengan nuansa Indonesia: jajanan & kuliner daerah, transportasi lokal, ikon kota/wisata, budaya & upacara adat, hari raya, sampai legenda rakyat (Malin Kundang, Sangkuriang, Roro Jonggrang, dll). Semua kata dibuat original untuk prototype ini, bukan salinan deck komersial manapun.
