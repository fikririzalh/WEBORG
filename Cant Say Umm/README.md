# MIAU! Jangan Bilang Umm

Prototype party game lokal (single-device) berbasis HTML, CSS, dan JavaScript murni.

## Cara menjalankan
1. Ekstrak folder.
2. Buka `index.html` di browser modern (Chrome, Edge, Firefox, Safari).
3. Buka **Kelola** untuk CRUD pemain, kartu kata, dan rule card.
4. Mulai game dari halaman setup.

Tidak memerlukan server, akun, internet, npm, atau build step.

## Mekanik versi ini
- 2 tim, satu perangkat.
- 45 detik default per giliran (bisa 30/45/60/90).
- 1 kartu berisi 8 kata.
- Klik kata ketika berhasil ditebak: +1 untuk tim aktif.
- Jika semua 8 selesai, kartu berikutnya muncul otomatis selama waktu masih berjalan.
- Tim lawan menekan **Bell** jika mendengar filler atau pelanggaran rule: +1 untuk tim lawan.
- Titik rule khusus pada skor 5, 10, 15 (selama masih di bawah target skor).
- Saat titik rule tercapai, tim tersebut mendapat rule tambahan acak yang berlaku seterusnya.
- Target skor default 20.
- Undo poin terakhir tersedia untuk memperbaiki salah klik.

## CRUD dan penyimpanan
- Pemain: tambah, edit, hapus; pilih Tim Oren / Tim Tuxedo.
- Kartu: tambah, edit, hapus; tepat 8 kata per kartu.
- Rule card: tambah, edit, hapus.
- Seed: 30 kartu × 8 kata = 240 kata, dan 15 rule card original.
- Semua data disimpan di `localStorage` browser.
- Tab Data menyediakan export/import JSON dan reset ke seed awal.

## Kontrol cepat
- `Space`: Bell (ketika timer berjalan).
- Tombol angka `1` sampai `8`: tandai kata sesuai nomor sebagai berhasil ditebak.

## Sound
Sound effect dibuat langsung dengan Web Audio API, jadi tidak ada file audio eksternal.

## Catatan desain
Prototype ini mengambil inspirasi dari pola umum party word game: timer, tim lawan sebagai pengawas, bell penalty, dan rule yang bertambah seiring skor. Semua daftar kata dan rule bawaan di prototype ini dibuat khusus untuk prototype dan bukan salinan deck komersial.
