# Chaos Board v1.0

Web companion untuk permainan remi di meja: **satu perangkat, satu bidak bersama, papan 10×10**, tanpa ular, tangga, room, atau kode. Skor, giliran, kartu tangan, dan pemakaian skill dicatat/dijalankan di dunia nyata.

**Game web app ini masih bisa di-update berkala, terutama set map, jenis block, role, serta fungsi kartu.** Sepuluh set awal bukan batas akhir. Pembaruan adalah perubahan manual atau impor paket JSON; tidak ada jadwal atau pembaruan otomatis yang diaktifkan.

## Membuka versi offline

1. Ekstrak seluruh isi ZIP ke satu folder.
2. Buka `index.html` menggunakan browser yang mendukung JavaScript.
3. Seluruh fungsi utama berjalan tanpa internet, akun, instalasi, server permainan, dan layanan eksternal. Tidak ada font atau gambar dari CDN.
4. Di ponsel, pilih **buka dengan browser**. Sebagian file manager hanya menyediakan pratinjau HTML atau membatasi JavaScript. Jika itu terjadi, gunakan browser/file manager yang dapat membuka HTML atau tempatkan file di hosting statis. Versi tautan online memerlukan koneksi untuk membuka; gunakan ZIP untuk offline penuh.

Data disimpan otomatis melalui localStorage jika browser mengizinkan. Penyimpanan untuk `file://` dapat berbeda antarbrowser. Bila penyimpanan tidak tersedia, aplikasi tetap bisa dimainkan dan menampilkan pemberitahuan; ekspor JSON sebelum menutupnya. Mengganti browser, perangkat, atau lokasi file, mode privat, serta menghapus data browser dapat menghilangkan akses ke pengaturan/sesi lama.

## Persiapan di meja

- Rekomendasi awal 2–6 pemain.
- Satu dek remi standar dan 2 Joker, kertas skor, serta penanda penggunaan skill.
- Pilih set map. Bagikan 4 kartu kepada tiap pemain; sisa kartu menjadi tumpukan ambil.
- Bagikan satu role terbuka per pemain; role boleh sama. Default role mempunyai dua penggunaan skill per permainan, maksimal satu skill role per giliran.
- Semua pemain menggunakan **bidak yang sama**. Posisi awal 0, di luar papan.

## Alur giliran

1. Mainkan satu kartu fisik.
2. Jalankan efek kartu, lalu gerakkan bidak secara manual.
3. Tekan **STOP** untuk membuka/menampilkan isi petak tempat berhenti.
4. Jalankan efek petak dan role di meja. Catat skor di kertas; minimal skor default 0.
5. Ambil kartu pengganti dan lanjutkan ke pemain berikutnya. Bila tumpukan habis, kocok ulang kartu buangan.

**Hanya petak tempat berhenti yang aktif.** Petak yang dilewati tidak memberi efek. Perpindahan tambahan akibat efek petak (misalnya mundur 4 dari Terpental) tidak mengaktifkan petak tujuan lanjutan. Gerakkan manual tanpa menjalankan efek kedua.

STOP tidak memberi poin, menyerang, mengonsumsi petak, atau menandai giliran secara otomatis. Menekannya berulang kali hanya menampilkan efek; pemain memastikan setiap efek diselesaikan sekali di meja.

Posisi dibatasi 0–100. Ketika mencapai/melewati 100, berhenti di 100. Pemain aktif mendapat bonus 3 poin dan permainan selesai. Skor tertinggi di meja menang; seri berarti menang bersama. Karena ini free move, aplikasi tetap membolehkan memundurkan bidak dari 100 jika diperlukan untuk koreksi/aturan rumah.

## Kontrol gerak bebas

- **`<`**: mundur satu petak. Tahan untuk terus bergerak.
- **`STOP`**: hentikan gerakan dan tampilkan efek petak posisi bidak.
- **`>`**: maju satu petak. Tahan untuk terus bergerak.
- Melepas tombol arah juga menghentikan gerakan.
- Desktop: tombol panah kiri/kanan untuk satu langkah, spasi untuk STOP (saat tidak sedang mengisi formulir atau membuka dialog).
- Ketuk petak: lihat detailnya. Pilih **Pindahkan bidak ke sini** untuk perpindahan khusus seperti Lucky Jump.
- Posisi pada papan mengikuti jalur ular tangga berkelok: 1–10 dari kiri ke kanan di bawah, 11–20 berbalik di baris berikutnya, hingga 100 di kiri atas.

## Sepuluh set map bawaan

| Set | Pengalaman |
| --- | --- |
| Lucky Picnic | Banyak hadiah kecil, sedikit trap, untuk pemanasan. |
| Gold Rush | Banyak jackpot +5, diselingi denda dan copet. |
| Ladang Ranjau | Trap lebih padat; kartu pelindung penting. |
| Tarik Ulur | Banyak efek mundur sehingga posisi bolak-balik. |
| Pasar Copet | Rampasan dan transfer poin ramai di meja. |
| Kotak Misteri | Isi petak tertutup sampai bidak berhenti dan STOP ditekan. |
| Jackpot Zigzag | Hadiah mengelompok di sisi papan, menuntut pilihan langkah. |
| Istana Coup | Banyak duel, rampasan, dan perisai. |
| Drama Akhir | Awal tenang, area akhir padat hadiah dan trap. |
| Chaos Total | Campuran seluruh jenis efek dengan lebih banyak petak aktif. |

Set mempunyai pola lokasi dan komposisi berbeda, dibuat tetap agar bisa dimainkan ulang. Set tersimpan mempunyai 100 petak; petak 100 selalu Finis. Menambah jenis block tidak memperbesar ukuran papan.

Untuk Misteri: isi petak hanya terbuka saat bidak berhenti lalu STOP ditekan, atau memakai **Buka petak** pada posisi bidak. Petak yang sudah terbuka tetap terlihat. Editor set memperlihatkan isi lengkap, jadi hindari membukanya saat ingin mempertahankan kejutan.

## Kartu default

| Kartu | Fungsi |
| --- | --- |
| A–9 | Maju sesuai angka; A = 1. |
| 10 merah ♥ ♦ | Ke petak Lucky berikutnya di depan (kategori poin atau lucky) yang belum terpakai, lalu jalankan efek. Bila tidak ada, maju 1. Pada Misteri, buka petak berurutan sampai Lucky pertama ditemukan. |
| 10 hitam ♠ ♣ | Ubah satu petak kosong dalam 10 petak di depan bidak menjadi trap pilihan dari katalog, lalu maju 1. Finis tidak boleh dipilih. Bila tidak ada petak kosong, cukup maju 1. |
| J | Mundur 1–6 petak pilihan pemain, minimal sampai 0, lalu jalankan efek tujuan kecuali posisi 0. |
| Q | Maju 1–6 petak pilihan pemain dan abaikan trap pada giliran itu. |
| K | Maju 1–6 petak; jika mendapat poin dari petak tujuan, curi tambahan hingga 2 poin dari satu lawan. |
| Joker | Tukar isi dua petak belum terpakai, bukan petak bidak atau finis; lalu maju 1–6. |

Aplikasi tidak memvalidasi kartu tangan atau menerapkan ability otomatis. Buka **Panduan meja → Kartu** untuk aturan. Pindahkan bidak dan edit petak secara manual. Aturan kartu dapat diubah/ditambahkan/dihapus di Pengaturan.

## Role default

Nama Duke, Assassin, Captain, Ambassador, dan Contessa dipakai sebagai adaptasi untuk Chaos Board, **bukan aturan resmi Coup**. Masing-masing skill default bisa dipakai dua kali dan dicatat menggunakan penanda fisik.

- **Duke**: tambah 2 poin ketika mengambil petak poin.
- **Assassin**: kurangi skor satu lawan 3 poin.
- **Captain**: curi hingga 2 poin dari satu lawan.
- **Ambassador**: buang hingga dua kartu tangan dan ambil penggantinya.
- **Contessa**: batalkan satu trap atau serangan terhadap diri sendiri.

Role terbuka dan boleh sama. Efek dan keseimbangan bisa disesuaikan melalui CRUD setelah pengujian di meja.

## CRUD role, kartu, dan jenis block

Buka ikon pengaturan, kemudian pilih tab **Role**, **Kartu**, atau **Block**.

- Tambah item baru, lihat daftarnya, edit nama/ikon/warna/deskripsi, atau hapus.
- Ikon atau teks pendek maksimal empat karakter.
- Jenis block mempunyai kategori Poin, Trap, Lucky ability, atau Event.
- Block **Kosong** dan **Finis** adalah struktur wajib dan tidak dapat dihapus atau diubah kategorinya; nama, warna, ikon, dan deskripsinya boleh diedit.
- Menghapus jenis block lain mengganti semua petak pemakaiannya pada set tersimpan dan sesi aktif menjadi Kosong.
- Poin/efek dalam deskripsi adalah instruksi manusia, tidak dijalankan program.

## Editor set map

Buka **Edit set** pada layar utama atau **Pengaturan → Set map**.

1. Buat set baru atau edit set yang ada.
2. Ubah nama, deskripsi, dan pilihan Misteri.
3. Pilih kuas jenis block, lalu ketuk petak 1–99 untuk memasangnya.
4. Simpan set.

Anda dapat menyalin dan menghapus set. Minimal satu set harus tersedia. **Mengedit set tidak langsung mengganti sesi aktif**; ulang sesi atau pilih set lagi untuk menggunakan versi terbaru.

## Perubahan sesi: trap, Joker, dan petak terpakai

Ketuk petak pada papan utama untuk membuka panel detail:

- **Ubah block di sesi ini** memasang/menghapus efek tanpa mengubah set tersimpan. Untuk 10 hitam, pemain memastikan petak yang dipilih kosong dan berada dalam 10 petak di depan.
- **Tukar isi dengan petak lain** membantu Joker. Aplikasi menolak petak bidak, finis, petak yang sudah terpakai, dan tujuan yang sama.
- **Tandai terpakai** untuk petak poin setelah hadiah diambil. Petak terpakai tampil pudar dengan centang; boleh dipulihkan jika perlu koreksi. Petak terpakai tidak memberi hadiah lagi menurut aturan default.
- Trap tetap aktif kecuali diubah manual.
- **Ulang sesi** mengembalikan posisi 0 dan map dari set tersimpan, menghapus perubahan sesi, penanda terpakai, dan informasi petak Misteri yang terbuka.

## Cadangan dan pembaruan

**Pengaturan → Ekspor JSON** menyimpan semua set, jenis block, role, kartu, tema, dan sesi ke file cadangan. Aplikasi menyimpan sesi otomatis untuk melanjutkan pada browser/lokasi yang sama.

**Impor JSON** memeriksa format versi v1, ID unik, referensi block, serta 100 petak valid. Setelah konfirmasi, seluruh pengaturan diganti dan sesi baru dimulai. Sesi dalam file cadangan tidak dilanjutkan saat impor; ini mencegah perubahan map lama ikut terbawa tanpa sengaja. Ekspor dulu jika ingin menjaga pengaturan lama.

`10-set-map.json` menyediakan paket awal lengkap agar dapat diimpor kembali. Paket ini mengganti role/kartu/block custom juga, jadi buat cadangan sebelum memakainya.

Tidak ada batas sepuluh set: batas praktis aplikasi 300 item per daftar dan 5 MB untuk file impor. Pembaruan set dapat dibagikan dalam JSON versi yang sama. Pembaruan kode membutuhkan penggantian file web; cadangkan data dahulu dan pertahankan kunci penyimpanan/migrasi versi bila mengembangkan aplikasi.

## Isi ZIP

- `index.html`: aplikasi lengkap, CSS dan JavaScript di dalamnya.
- `favicon.svg`: ikon lokal.
- `README.md`: panduan ini.
- `10-set-map.json`: paket awal lengkap untuk impor.

Tema mengikuti palet HAPPY PRISM. Tersedia mode terang/gelap dan layout responsif. Tidak ada dependency atau proses build untuk menjalankan versi ZIP.

## Pengembangan berikutnya

Set map, aturan, dan keseimbangan dapat diperbarui berkala berdasarkan hasil permainan. Tidak ada jadwal yang sudah aktif. Untuk update map cukup editor atau paket JSON. Kode sengaja memakai HTML/CSS/JavaScript biasa agar mudah dibuka offline dan diubah lagi.
