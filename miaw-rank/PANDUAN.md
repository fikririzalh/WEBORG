# Favorit Kita

Web boardgame offline dalam Bahasa Indonesia. Variasi tebak urutan berdasarkan brief pengguna, terinspirasi My Favourite Things. Bukan produk resmi atau salinan aturan resmi.

## Membuka aplikasi

1. Ekstrak seluruh ZIP ke satu folder.
2. Buka index.html dengan browser modern. style.css, categories.js dan app.js harus tetap berada di folder yang sama.
3. Tidak perlu npm, instalasi paket, login, CDN, maupun internet. Semua aset ada dalam ZIP.

Di komputer, buka index.html melalui Chrome, Edge, Firefox, atau Safari. Di Android, ekstrak dahulu dan buka index.html menggunakan browser yang mendukung berkas HTML lokal. Beberapa pengelola berkas hanya menampilkan pratinjau dan tidak menjalankan JavaScript. Di iPhone/iPad, pratinjau Files juga dapat membatasi JavaScript atau aset pendamping. Dalam kondisi tersebut, gunakan aplikasi pembuka HTML lokal yang mendukung JavaScript, atau sajikan folder dari komputer melalui server lokal dan buka alamat komputer dari HP pada Wi-Fi/hotspot yang sama. Aplikasi tetap tidak membutuhkan internet. Contoh server lokal jika Python sudah tersedia: `python -m http.server 8000 --bind 0.0.0.0`, dijalankan dari folder aplikasi; HP membuka `http://IP-KOMPUTER:8000`. Izinkan koneksi jaringan lokal pada firewall jika diperlukan. Matikan server setelah bermain.

## Ringkasan permainan

B memilih kategori untuk A. A mengisi enam hal berbeda sesuai kategori pada posisi 0–5. Posisi 0 paling tidak disukai dan posisi 5 paling disukai. A memeriksa urutan lalu menguncinya. Setiap B mendapatkan enam pilihan yang diacak dan menebak urutan A. Setelah semua tebakan dikunci, A membuka hasil. Pemain atau tim dengan urutan terdekat menang. Boleh seri.

Skor tiap B = 30 dikurangi jumlah selisih absolut antara peringkat tebakan dan peringkat asli untuk keenam pilihan. Urutan tepat bernilai 30, dua posisi bersebelahan tertukar bernilai 28, dan urutan sepenuhnya terbalik bernilai 12. Rentang skor yang mungkin 12–30, bukan 0–30. Jumlah posisi tepat ditampilkan sebagai informasi, bukan pemecah seri. A tidak mendapat skor pada ronde miliknya. A berganti otomatis menurut daftar nama. Selesaikan kelipatan jumlah pemain untuk perbandingan skor total yang adil.

## Mode satu perangkat

Masukkan 2–12 nama berbeda atau nama tim, satu per baris. Nama pertama menjadi A. B memilih kategori dari 120 kartu atau menulis kategori sendiri. Serahkan layar ke A. Setelah urutan dikunci, layar pelindung muncul sebelum giliran setiap B. Semua orang selain pemegang giliran melihat ke arah lain. Setiap B mengatur urutan dengan tombol naik/turun, memeriksa, lalu mengunci. Setelah seluruh B selesai, layar diserahkan ke A untuk reveal.

## Mode beberapa perangkat

Mode ini menggunakan pertukaran berkas/kode, bukan room real-time. Semua perangkat mempunyai salinan aplikasi. Tidak ada akun atau server pusat.

1. A memilih Beberapa perangkat → Saya A dan memasukkan namanya di baris pertama, lalu seluruh nama B/tim.
2. B menyepakati kategori secara lisan; A memilih kategori itu, mengisi urutan, memeriksa dan mengunci.
3. A mengunduh tantangan.fk atau menyalin kode. Kirim ke B melalui Bluetooth, AirDrop, USB, atau kanal lain yang tersedia. Jika menggunakan aplikasi pesan daring, kanal pengiriman itu membutuhkan internet, tetapi aplikasinya tidak.
4. Pada perangkat masing-masing, B memilih Beberapa perangkat → Saya B, membuka berkas tantangan atau menempel kode, lalu memilih namanya.
5. B mengurutkan pilihan, memeriksa, mengunci, dan mengirim jawaban.fk atau kode jawaban kembali ke A.
6. A memasukkan setiap jawaban. Sistem menolak ronde yang salah, nama tidak terdaftar, urutan tidak valid, dan kiriman kedua dari nama yang sama. Reveal tersedia setelah semua nama B mengirim.
7. Semua melihat hasil pada perangkat A. Ronde berikutnya mengubah peran A. Perangkat pengelola boleh tetap sama; serahkan kepada A baru saat pengisian rahasia.

Kode tantangan memuat enam pilihan acak, kategori, nama A, nama B, serta identitas ronde. Kode tidak memuat peringkat rahasia A. Kode bukan enkripsi dan tidak menyediakan autentikasi: pilih nama sendiri dan jangan mengedit berkas permainan. Ini permainan sosial dengan peserta tepercaya.

## Penyimpanan dan batasan

Tema terang/gelap tersimpan bila browser mengizinkan localStorage. Data ronde dan skor sesi hanya berada di memori halaman. Jangan tutup, refresh, atau pindahkan tab A ke halaman lain sebelum selesai; browser dapat pula membuang tab di latar belakang. Tidak ada pemulihan sesi. Layar pelindung mencegah terlihat secara tidak sengaja, bukan akses melalui developer tools. Tidak ada sinkronisasi otomatis atau koneksi langsung antarbrowser. Tampilan dirancang responsif untuk HP dan laptop; kompatibilitas semua perangkat fisik belum diuji.

## Perbedaan dengan My Favourite Things

Deskripsi pengguna cocok sebagai variasi tebak preferensi, bukan penjelasan lengkap permainan komersial. Ulasan aturan yang ditelusuri menjelaskan mekanisme trick-taking, angka 1 sebagai favorit tertinggi, dan kartu patah hati/0 yang memiliki interaksi khusus dengan angka 1. Implementasi ini sengaja mengikuti permintaan: 0 paling tidak suka, 5 paling suka, pemenang berdasarkan kedekatan urutan. Semua 120 kategori di aplikasi disusun untuk versi ini.

Sumber penjelasan aturan yang diperiksa:
- Dale Yu (24 Maret 2025), Review of My Favourite Things: https://opinionatedgamers.com/2025/03/24/dale-yu-review-of-my-favourite-things/
- Shut Up & Sit Down, My Favourite Things: https://www.shutupandsitdown.com/games/my-favourite-things/

## Isi paket

index.html — halaman utama; style.css — tema dan tata letak; categories.js — 120 kategori; app.js — alur permainan dan penilaian; PANDUAN.md — panduan ini.
