# MIAU! FAKE ARTIST

Single-device hybrid social drawing game.

## Varian web
Web menggantikan Question Master, sehingga semua 4–10 pemain aktif ikut menggambar.

## Flow
1. Pilih 4–10 pemain.
2. Web memilih 1 Fake Artist dan 1 prompt.
3. HP diberikan satu per satu.
4. Tahan tombol untuk melihat role:
   - Real Artist: kategori + kata.
   - Fake Artist: kategori saja.
5. Taruh HP di tengah.
6. Putaran 1: tiap pemain satu garis.
7. Putaran 2: tiap pemain satu garis lagi.
8. Voting dilakukan secara fisik dengan menunjuk.
9. Web reveal Fake.
10. Jika Fake tertangkap, beri satu tebakan verbal sebelum kata dibuka.
11. Reveal kata dan lanjut ronde.

## Fitur
- CRUD pemain P001...
- CRUD prompt Q001...
- 150 prompt original dalam 10 kategori
- Filter kategori
- Fake tidak dipilih dua ronde berturut-turut jika memungkinkan
- Prompt diacak tanpa pengulangan sampai pool kategori habis
- Hold-to-view role privacy
- Layout role Real/Fake dibuat sama agar tidak mudah bocor dari kejauhan
- Dark/light
- Sound
- localStorage
- Export/import JSON
- Responsive mobile
- Tidak ada scoring atau voting digital

## File
- index.html
- styles.css
- app.js
- seed.js

Tidak perlu npm/server. Extract ZIP lalu buka index.html.
