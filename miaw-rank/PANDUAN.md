# Favorit Kita

Web boardgame offline dalam Bahasa Indonesia. Variasi tebak urutan berdasarkan brief pengguna, terinspirasi My Favourite Things. Bukan produk resmi atau salinan aturan resmi.

## Membuka aplikasi

1. Ekstrak seluruh ZIP ke satu folder.
2. Buka index.html dengan browser modern. style.css, categories.js dan app.js harus tetap berada di folder yang sama.
3. Tidak perlu npm, instalasi paket, login, CDN, maupun internet. Semua aset ada dalam ZIP.

Di komputer, buka index.html melalui Chrome, Edge, Firefox, atau Safari. Di Android, ekstrak dahulu dan buka index.html menggunakan browser yang mendukung berkas HTML lokal. Beberapa pengelola berkas hanya menampilkan pratinjau dan tidak menjalankan JavaScript. Di iPhone/iPad, pratinjau Files juga dapat membatasi JavaScript atau aset pendamping. Dalam kondisi tersebut, gunakan aplikasi pembuka HTML lokal yang mendukung JavaScript, atau sajikan folder dari komputer melalui server lokal dan buka alamat komputer dari HP pada Wi-Fi/hotspot yang sama. Aplikasi tetap tidak membutuhkan internet. Contoh server lokal jika Python sudah tersedia: `python -m http.server 8000 --bind 0.0.0.0`, dijalankan dari folder aplikasi; HP membuka `http://IP-KOMPUTER:8000`. Izinkan koneksi jaringan lokal pada firewall jika diperlukan. Matikan server setelah bermain.

## Ringkasan permainan

B memilih kategori untuk A. A mengisi enam hal berbeda sesuai kategori pada posisi 0–5. Posisi 0 paling tidak disukai dan posisi 5 paling disukai. A memeriksa urutan lalu menguncinya. Setiap B mendapatkan enam pilihan yang diacak dan menebak urutan A. Setelah semua tebakan dikunci, A membuka hasil. Pemain atau tim dengan urutan terdekat menang. Boleh seri.

Ada tiga cara main: **satu perangkat** (oper-oper HP/laptop, tiap B menebak sendiri-sendiri), **beberapa perangkat** (A membuat tantangan, tiap B menjawab lewat kode/berkas di perangkatnya sendiri), dan **Mode Tim** (satu tim vs satu tim, tim penebak menulis tebakan sendiri dari nol tanpa melihat pilihan asli, lalu dicocokkan manual bersama saat reveal — lihat bagian "Mode Tim" di bawah).

Skor tiap B = 30 dikurangi jumlah selisih absolut antara peringkat tebakan dan peringkat asli untuk keenam pilihan. Urutan tepat bernilai 30, dua posisi bersebelahan tertukar bernilai 28, dan urutan sepenuhnya terbalik bernilai 12. Rentang skor yang mungkin 12–30, bukan 0–30. Jumlah posisi tepat ditampilkan sebagai informasi, bukan pemecah seri. A tidak mendapat skor pada ronde miliknya. A berganti otomatis menurut daftar nama. Selesaikan kelipatan jumlah pemain untuk perbandingan skor total yang adil.

## Mode satu perangkat

Masukkan 2–12 nama berbeda atau nama tim, satu per baris. Nama pertama menjadi A. B memilih kategori dari 120 kartu atau menulis kategori sendiri. Serahkan layar ke A. Setelah urutan dikunci, layar pelindung muncul sebelum giliran setiap B. Semua orang selain pemegang giliran melihat ke arah lain. Setiap B mengatur urutan dengan tombol naik/turun, memeriksa, lalu mengunci. Setelah seluruh B selesai, layar diserahkan ke A untuk reveal.

## Kartu kategori buatan sendiri (tersimpan & bisa dibagikan)

Selain 120 kartu bawaan, kalian bisa menulis kategori sendiri di kolom "Atau kategori buatan kalian". Centang "Simpan sebagai kartu tetap di perangkat ini" agar kartu itu tersimpan permanen (memakai localStorage) dan muncul lagi di daftar kartu pada ronde maupun sesi berikutnya — tanpa perlu diketik ulang. Kartu tersimpan bisa dicari, difilter lewat kelompok "Kartu buatanmu", dan dihapus satu per satu lewat tombol ✕ pada bagian "Kelola kartu buatanmu".

Penyimpanan ini bersifat per perangkat/browser, bukan otomatis tersinkron ke semua orang — aplikasi ini sengaja tanpa server dan tanpa akun. Untuk memindahkan kartu buatan ke HP atau laptop lain, gunakan tombol "Bagikan daftar kartu" (menghasilkan kode/berkas, sama seperti kode tantangan) di perangkat asal, lalu "Impor kartu dari kode/berkas" di perangkat tujuan. Kartu yang sudah ada tidak akan digandakan.

## Mode Tim (mode ketiga)

Mode Tim adalah variasi untuk bermain berkelompok: satu tim membuat daftar rahasia, satu tim LAIN menebak bersama-sama sebagai satu kesatuan — bukan setiap orang menebak sendiri-sendiri seperti mode lain. Bedanya dengan mode biasa:

- Tim penebak **tidak diberi tahu enam pilihan asli**. Mereka menuliskan 6 tebakan mereka sendiri dari nol, langsung ke posisi 0 (menurut mereka paling tidak disukai) sampai 5 (paling disukai), lalu mengunci.
- Saat reveal, urutan asli dan urutan tebakan tim ditampilkan berdampingan. Karena tebakan ditulis bebas (kata-katanya bisa berbeda meski maksudnya sama), pencocokan dilakukan **manual bersama-sama**: bacakan keras-keras, sepakati mana yang cocok, lalu centang baris yang cocok. Skor = jumlah baris yang dicentang cocok (0–6). Di sinilah bagian serunya — reveal jadi obrolan langsung, bukan sekadar angka dari mesin.
- Hanya ada dua pihak per ronde (satu tim vs satu tim), dan peran bertukar otomatis tiap ronde: tim yang tadi menebak akan membuat daftar di ronde berikutnya.

Mode Tim tersedia dalam dua varian perangkat:

**Satu perangkat.** Masukkan nama kedua tim. Layar pelindung tetap muncul bergantian: tim pembuat daftar mengisi urutan lebih dulu, lalu perangkat diserahkan (tanpa dilihat tim lawan) ke tim penebak untuk menulis 6 tebakan mereka. Setelah dikunci, semua berkumpul untuk reveal dan mencocokkan bersama.

**Beberapa perangkat.** Sama prinsipnya dengan mode beberapa perangkat biasa (pertukaran kode/berkas, bukan room real-time):
1. Tim pembuat daftar memilih "Tim kami bikin daftar duluan", memasukkan nama timnya sendiri dan nama tim lawan, memilih kategori, mengisi, memeriksa, lalu mengunci.
2. Kode/berkas tantangan dibagikan ke tim penebak. Kode ini **hanya berisi nama kedua tim dan kategori — tidak memuat enam pilihan asli**, jadi tebakan tim penebak benar-benar buta.
3. Tim penebak membuka tantangan di perangkat mereka sendiri, menuliskan 6 tebakan dari nol, mengunci, lalu mengirim kode/berkas jawaban kembali.
4. Tim pembuat daftar memasukkan kode jawaban, lalu reveal dilakukan bersama saat semua sudah berkumpul — pencocokan tetap manual seperti di atas.
5. Ronde berikutnya menukar peran. Perangkat pengelola (yang memegang riwayat ronde dan skor) boleh tetap sama; serahkan ke tim yang baru menjadi pembuat daftar saat pengisian rahasia, sama seperti mode beberapa perangkat biasa.

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
