Tsum Party — Game Puzzle Sambung Karakter
==========================================

CARA MAIN
1. Buka file "tsum-party-game.html" langsung dua kali klik / buka di browser
   (Chrome, Safari, Edge, dll). Tidak perlu instalasi. Butuh koneksi internet
   sekali saat memuat font — setelah itu game jalan normal.
2. Pilih mode di layar awal:
   - Normal  : 60 detik, kejar skor setinggi mungkin.
   - Cozy    : santai, TANPA batas waktu (endless), tipe tsum lebih sedikit
               supaya lebih gampang menyambung.
3. Seret jari / mouse untuk menyambungkan 3 karakter sama atau lebih
   (atas/bawah/kiri/kanan), lalu lepas untuk memunculkannya.
4. Setiap tsum yang kamu sambungkan mengisi METERAN TSUM POWER miliknya
   sendiri (ikon bundar di bawah papan). Kalau meterannya sudah penuh
   (lingkaran menyala), ketuk ikonnya untuk mengaktifkan Tsum Power unik
   karakter itu — kapan saja kamu mau, tidak otomatis.
5. Waktu habis (Normal) atau kamu tekan Reset: tidak ada popup besar,
   papan langsung berhenti dan skor tetap kelihatan di atas. Tinggal
   tekan tombol kecil "↺ Reset" di pojok kanan atas kapan saja untuk
   main lagi / ganti mode.

TSUM POWER (beda-beda tiap karakter)
- Bundi (Waktu Kilat)     : +5 detik (Cozy: bonus skor)
- Bruno (Pukulan Beruang) : meledakkan area acak di papan
- Cip (Panggilan Telur)   : mengubah beberapa sel jadi sejenis Cip
- Kodi (Lompat Ganda)     : memicu ledakan rantai lain di papan
- Miko (Kocok Papan)      : mengocok ulang seluruh papan
- Foxy (Ekor Ajaib)       : skor x2 selama 8 detik

FITUR
- 6 karakter Tsum orisinal, masing-masing punya kekuatan unik yang bisa
  diaktifkan manual lewat meteran power sendiri.
- Mode Normal & Cozy, dengan skor tertinggi tersimpan terpisah di browser
  kamu (localStorage) untuk masing-masing mode.
- Mobile-friendly — enak dimainkan langsung dari HP.
- Struktur kode dibuat supaya gampang ditambah karakter baru.

MENAMBAHKAN TSUM BARU
Buka "tsum-party-game.html" dengan text editor apa saja, cari komentar:
    TAMBAH TSUM BARU DI SINI
di dalam bagian <script>. Tambahkan objek baru ke daftar MASCOTS mengikuti
contoh yang sudah ada, misalnya:

  { id:'panda', name:'Pandi', color:'#5B6B8C', ear:'bear',
    power:'shuffle', powerName:'Guling Panda', powerDesc:'Mengocok papan' }

Field "ear" bisa pakai bentuk yang sudah ada ('bunny','bear','chick','frog',
'cat','fox') atau kamu bisa menambah bentuk telinga baru di fungsi
earsMarkup(). Field "power" bisa memakai salah satu efek yang sudah ada di
objek POWERS ('time','bomb','convert','chain','shuffle','fever') atau kamu
bisa menambah efek power baru sendiri di situ. Tombol meteran power di
bawah papan otomatis ikut bertambah — tidak perlu ubah bagian lain.

Selamat bermain!
