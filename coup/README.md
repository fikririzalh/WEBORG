# Kudeta Pocket — versi 1.0

Pocket game tatap muka yang dipakai **masing-masing pemain di HP-nya sendiri**. Web app hanya menggantikan kartu dan uang. Klaim role, bluff, challenge, giliran, dan kesepakatan aturan dilakukan langsung di meja. Tidak ada akun, room, server, koneksi antarpemain, atau internet yang diperlukan saat bermain.

## Cara membuka

1. Ekstrak ZIP ini di masing-masing HP. **Buka `index.html`** dari aplikasi Files/File Manager dengan browser yang mendukung berkas HTML lokal. Jangan hanya melihat pratinjau di dalam ZIP.
2. Setiap pemain memakai browser dan file miliknya sendiri. Pada pembukaan pertama, HP membuat 15 kartu lokal (3 masing-masing dari Duke, Assassin, Captain, Ambassador, Contessa), mengambil dua kartu tertutup secara acak, dan memberi 2 uang.
3. Setelah itu permainan tersimpan di browser pada HP tersebut. Untuk memindahkan permainan ke browser/HP lain, gunakan **Simpan cadangan**, lalu **Pulihkan** berkas JSON di perangkat tujuan.

**Kompatibilitas:** beberapa browser HP, khususnya saat membuka `file://` dari pengelola berkas atau dalam pratinjau, membatasi JavaScript, penyimpanan lokal, unduhan, atau pemilihan file. Buka berkas langsung di browser. Jika penyimpanan tidak bertahan, gunakan cadangan JSON sebelum menutup tab. Pembukaan file HTML lokal bergantung pada sistem operasi dan browser; aplikasi ini tidak memerlukan instalasi server.

## Cara main di HP

- **Kartu saya:** ketuk kartu tertutup atau tombol *Buka* untuk melihatnya. Ketuk lagi atau tekan *Tutup* sebelum meletakkan HP di meja. Kartu yang dibuka dapat terlihat oleh siapa pun yang melihat layar.
- **Aksi kartu:** kembalikan ke deck lokal, jadikan kartu **gugur** (terbuka kepada semua), atau hapus untuk koreksi. Kartu gugur dapat dipulihkan jika pemain sepakat membetulkan kesalahan.
- **Deck:** *Ambil acak* memindahkan satu kartu dari deck HP ini ke tangan, tertutup. *Kocok deck* mengacak urutan. *Tambah kartu* menambahkan role yang dipilih sebagai kartu baru, bukan menarik dari deck.
- **Tukar:** ambil satu atau beberapa kartu, buka untuk menentukan pilihan, lalu kembalikan kartu yang tidak dipakai ke deck. Tutup kartu yang tetap di tangan. Aplikasi tidak membatasi banyaknya kartu atau memaksakan urutan aksi.
- **Uang:** tombol `+1`, `+2`, `+3`, `−1`, `−2`, `−3`, serta jumlah khusus. Saldo tidak boleh negatif. Web tidak memeriksa apakah klaim aksi benar.
- **Mulai ulang HP ini:** mengatur ulang kartu dan uang perangkat ini saja. Buat cadangan dulu jika ingin mempertahankan state.
- **Tema:** tombol ⚙️ mengganti mode gelap dan terang. Palet mengikuti HAPPY PRISM.

## Batas yang disepakati

**Setiap HP memiliki deck terpisah.** Tidak ada deck global atau sinkronisasi. Karena itu jumlah salinan Duke dan role lain **di seluruh meja tidak dijamin** sama dengan komposisi satu set Coup fisik. Kartu dapat ditambah atau dihapus sesuai kesepakatan pemain. Saat pemain perlu menunjukkan role, putar HP dan buka kartunya. Pemain sendiri mengawasi klaim, uang, dan jumlah kartu di meja.

State disimpan memakai `localStorage` pada browser/perangkat ini. Menghapus data browser, memakai mode privat, atau mengganti browser dapat menghilangkan permainan. Cadangan JSON berisi identitas kartu dan sebaiknya disimpan pribadi selama permainan berlangsung.

## Struktur dan pembaruan

- `index.html` — seluruh tampilan, logika, dan warna; tidak memakai library eksternal.
- `README.md` — panduan ini.

Game **masih bisa diupdate**. Versi berikutnya dapat memperbaiki tampilan, menambah aksesibilitas, atau menyesuaikan aturan rumah tanpa membuat multiplayer. Simpan cadangan sebelum mengganti versi. Format cadangan versi 1 memakai `version: 1`; perubahan struktur data pada versi mendatang perlu migrasi agar simpanan lama tetap terbaca.

Nama role dipertahankan, tetapi gambar kartu resmi tidak dipakai. Emoji dan tampilan kartu dibuat khusus untuk proyek ini. Ini prototipe pendamping permainan tatap muka; distribusi publik sebagai adaptasi beridentitas Coup perlu memperhatikan hak terkait nama, aturan tertulis, dan aset aslinya.
