# MIAU! ONE NIGHT TABLE — TWO DEVICE

Versi revisi yang memisahkan dua perangkat:

## HP 1 — Web ini
- Random/deal role
- Pembagian role rahasia P1 → Pn
- Night Table yang selalu menampilkan semua nama pemain
- Pemain yang dipanggil narrator menekan namanya sendiri
- Web menampilkan initial role milik nama tersebut
- Universal Free Move: PEEK 1 / PEEK 2 / SWAP
- Menyimpan current card state
- Discussion board + dropdown Dugaan
- Reveal All
- CRUD pemain dan role
- Export/import JSON, localStorage, dark/light

## HP 2 — Narrator
- Mengurus audio
- Mengurus urutan role
- Mengurus timer/jeda
- Web TIDAK berusaha mengetahui role apa yang sedang dipanggil

## State penting
- initialRoles: role yang dilihat pemain saat deal; tidak berubah.
- locations/current cards: posisi kartu aktual setelah swap; dapat berubah.

Jika Seer berada di Middle, narrator tetap memanggil Seer tetapi tidak ada pemain yang menekan nama di web. Ini memang disengaja.

Free Move tidak memvalidasi legalitas tindakan. Pemain bertanggung jawab mengikuti role dengan jujur.

Extract ZIP lalu buka index.html.
