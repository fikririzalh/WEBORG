SIKAT & KABUR — Companion (dadu fisik + app, tema kucing Happy Prism)
=======================================================================

Cara pakai:
1. Ekstrak folder ini.
2. Buka "index.html" di browser mana pun (HP/tablet/laptop), tidak perlu
   internet setelah dibuka sekali (kecuali font judul, yang fallback ke
   font sistem kalau offline).
3. Dadu fisiknya kamu yang pegang — app cuma bantu skor & bagian rahasia.

RINGKASAN ATURAN (detail lengkap ada di rundown.md terpisah)
- Default: 12 warna dari palet resmi "Happy Prism" (Sky Blue, Emerald
  Green, Hot Pink, Deep Orange, Sunny Yellow, Snow White, Light Grey,
  Metallic Silver, Golden Bronze, Deep Magenta, Midnight Blue, dan
  Prismatic - kucing pelangi gradasi), masing-masing 1 dadu secara
  default. Semua bisa dikustomisasi: nama, kode warna, dan berapa
  dadu per warna (bisa 1, bisa lebih), lewat panel "Kustomisasi
  kucing" - sesuaikan sama dadu fisik yang beneran kamu punya.
- Tiap ronde, app diam-diam undi separuh dari warna yang aktif jadi
  "Warna Runtuh" (rahasia, gak ditampilin ke pemain sampai kejadian
  GAME OVER).
- Tiap langkah: kocok semua dadu tersisa, semua pemain lihat kebuka.
  Pilih ambil 1-4 dadu sekaligus (makin banyak, pengali makin gede tapi
  makin cepat abis stok dadu). Masukkan warna+angka tiap dadu yang
  diambil ke app.
- App diam-diam cek warna itu match salah satu dari 3 Warna Runtuh atau
  bukan, nambah hitungan rahasia di background (gak ada notifikasi).
- Kalau hitungan itu tembus 3 -> GAME OVER, semua pemain yang masih
  "IN" dapat 0 dari pot ronde ini, Warna Runtuh baru diumumin.
- Sebelum itu terjadi, tiap pemain yang masih IN boleh pilih KELUAR
  buat amanin bagian pot yang lagi ngambang (dibagi rata kalau
  beberapa orang keluar bareng di langkah yang sama).

FITUR APP
- Tiap warna digambar sebagai kucing lucu (bukan kotak warna polos) -
  termasuk 1 kucing pelangi gradasi khusus untuk warna "Prismatic".
- Tambah/hapus warna kucing, atur nama/kode warna/jumlah dadu per
  warna - tersimpan otomatis di perangkat, terkunci selagi ronde jalan.
- Tambah/hapus pemain, skor total tersimpan otomatis di perangkat
  (localStorage) - gak hilang walau ditutup browsernya.
- Tombol matahari/bulan buat ganti mode terang/gelap.
- Panel "Cara main singkat" bisa dibuka/tutup.
- Validasi otomatis: gak bisa ambil dadu warna yang stoknya udah habis.
- Reset semua skor tersedia di bagian bawah kalau mau main ulang dari 0.

Catatan: state ronde yang lagi jalan (langkah, pot, status IN/OUT)
TIDAK tersimpan kalau halaman di-refresh di tengah ronde - cuma skor
total antar-ronde yang tersimpan permanen. Jadi selesaikan 1 ronde dulu
sebelum menutup/refresh browser.

Isi folder:
- index.html  -> satu-satunya file yang perlu dibuka.
- README.txt  -> file ini.
