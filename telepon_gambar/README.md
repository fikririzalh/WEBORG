# Telepon Gambar — offline, 2–8 pemain

Setiap HP adalah satu buku digital. Para pemain mengoper HP secara fisik setelah menulis atau menggambar. Tidak ada kode, akun, ruang, atau koneksi antarpiranti.

## Persiapan bersama

Buka `index.html` di setiap HP, pilih **jumlah pemain yang sama** dan mode yang sama. Pemain diberi huruf A, B, C, dan seterusnya. Setiap HP memilih huruf pemiliknya sendiri.

### Mode Original — oper berurutan

Semua duduk berurutan A → B → C → … → A. Sesudah satu giliran, oper HP ke pemain berikutnya di urutan tersebut. Ini cara bermain paling mudah; tidak perlu tabel atau kertas.

### Mode Acak — jadwal di kertas

Satu HP utama menekan **Acak jadwal**. Tabel muncul **di atas pilihan pemain utama**. Pemain utama menuliskan jadwal itu di kertas sebelum permainan dimulai. Kolom `HP A` berisi siapa yang memegang HP A pada tiap giliran, dan seterusnya. Setiap baris memasangkan semua HP dengan pemain yang berbeda. Semua pemain membaca kertas untuk mengoper HP. HP lainnya memilih **HP lain: langsung siap**, tanpa mengetik atau menyalin jadwal ke aplikasi. Jangan tekan acak ulang setelah tabel disalin.

## Bermain

1. Semua pemilik menulis deskripsi awal pada HP masing-masing.
2. Sesudah dikunci, layar hanya menyatakan **Lempar ke pemain selanjutnya**. Oper HP serentak sesuai urutan duduk (Original) atau jadwal di kertas (Acak).
3. Penerima menggambar deskripsi terakhir atau mendeskripsikan gambar terakhir. Riwayat sebelumnya tersembunyi.
4. Sesudah masing-masing pemain mengerjakan satu entri pada tiap HP, kembalikan HP ke pemiliknya dan lakukan reveal bersama.

Pada mode acak, nama pembuat entri setelah deskripsi awal tidak diketahui aplikasi dan tampil sebagai nomor giliran saat reveal. Pada mode Original, nama pemain dihitung dari urutan duduk. Untuk 2 pemain, rantainya hanya deskripsi → gambar. Mode santai tidak memakai timer.

## Menjalankan tanpa jaringan

Bagikan `index.html` ke setiap HP dan buka secara lokal. Sebagian browser HP membatasi berkas HTML lokal; alternatifnya sajikan lewat hosting statis untuk membuka halaman terlebih dahulu. Setelah termuat, permainan tidak membutuhkan komunikasi jaringan. Progres tersimpan di browser pada masing-masing HP; jangan hapus data browser saat bermain.

Kanvas menyediakan lima warna, penghapus, undo, dan hapus semua. Mode terang dan gelap tersedia. Aplikasi dapat dikembangkan lagi.
