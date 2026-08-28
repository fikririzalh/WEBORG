# Monopoly Turn Manager V3

Buka `index.html` langsung di browser.

## Fitur utama
- CRUD Player
- CRUD Card Library / Master Card
- Uang dari Bank / ke Bank
- Transfer uang antar-player
- Turn system
- Activity log
- LocalStorage
- Player A dan B tersedia sebagai data awal

## Sistem kartu
Di layar player ada dua cara mendapatkan kartu:

1. `+ Pilih Kartu`
   - Menampilkan Card Library.
   - Klik kartu untuk menambahkannya secara manual.

2. `🎲 Random Card`
   - Mengacak satu kartu dari Card Library dengan peluang yang sama.
   - Kartu yang sudah dimiliki player dikeluarkan dari kandidat agar tidak dobel.
   - Hasil random ditampilkan terlebih dahulu.
   - `↻ Acak Lagi` untuk mengulang sebelum kartu diambil.
   - `Ambil Kartu` memasukkan hasil ke tangan player.

Kartu di tangan:
- Klik untuk membaca efek.
- `Sudah Digunakan` menghapus kartu dari tangan dan mencatatnya di log.
- `Keluarkan` menghapus tanpa dianggap digunakan.

Catatan fairness:
Random memakai `Math.random()` browser. Untuk permainan kasual satu-device ini cukup,
tetapi ini bukan RNG kriptografis / sistem turnamen.
