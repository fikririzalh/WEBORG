# Bunga & Duri — revisi medium kartu

Aplikasi ini menggantikan kartu fisik. Bet, penentuan siapa yang membuka, kapan berhenti, penalti, dan pemenang diputuskan langsung oleh orang-orang yang sedang berkumpul.

## Buka aplikasi

Ekstrak ZIP, kemudian buka **BUKA-OFFLINE.html** pada browser. Bagikan file HTML tersebut ke setiap HP sebelum bermain apabila memakai mode masing-masing perangkat. Seluruh CSS dan JavaScript sudah tertanam di file itu.

Tidak perlu Node.js, instalasi paket, login, Wi-Fi bersama, room, undangan, server, atau koneksi internet. Tidak ada sinkronisasi antar-HP; setiap HP bertindak seperti satu set kartu di meja.

Alternatif untuk menyunting kode: buka **index.html** dengan **style.css**, **cards.js**, dan **app.js** tetap pada folder yang sama.

## Satu perangkat: HP dioper

1. Pilih **HP dioper**, lalu masukkan 3–6 nama pemain.
2. Serahkan HP kepada pemain pertama. Ia menekan **Buka tangan**, lalu memilih satu bunga atau duri.
3. Kartu langsung dipasang tertutup. Layar tangan hilang dan menampilkan nama pemain berikutnya.
4. Oper HP ke pemain itu. Ulangi selama kalian masih memasang kartu.
5. Saat seseorang menyatakan bet secara langsung, tekan **Ada bet · buka meja**. Seluruh nama pemain dan tumpukannya muncul dalam keadaan tertutup.
6. Selesaikan bet secara lisan dan sepakati siapa yang membuka. Orang tersebut memegang HP dan mengetuk kartu teratas pada tumpukan yang dipilih.
7. Kartu terbuka satu per satu. Aplikasi tidak meminta angka bet atau memilih penantang.
8. Jika ronde selesai menurut kalian, tekan **Selesai ronde**. Pilih pemain pertama untuk ronde berikutnya.

Menu **Ubah giliran sesuai kesepakatan** tersedia bila urutan pemegang HP perlu diubah. Pemain tanpa kartu di tangan dilewati saat oper otomatis. Urutan tumpukan mengikuti penempatan yang sebenarnya.

## Masing-masing perangkat: HP saya

1. Setiap orang membuka **BUKA-OFFLINE.html** di HP sendiri dan memilih **HP saya**.
2. Isi nama sendiri saja. Setiap HP langsung mendapat tiga bunga dan satu duri.
3. Saat mendapat giliran nyata, tekan **Giliran saya · pilih kartu**, lalu pasang satu kartu. Setelah itu tangan kembali tertutup.
4. Tunggu giliran berikutnya secara langsung. Tidak ada giliran jaringan yang harus ditunggu oleh aplikasi.
5. Setelah bet selesai disepakati, masing-masing orang menekan **Taruh di tengah · mode buka**, lalu mengumpulkan HP di tengah meja.
6. Orang yang disepakati membuka kartu menyentuh kartu teratas di HP yang dipilih. Ia dapat berpindah dari satu HP ke HP lain sesuai permainan kalian.
7. Setiap HP hanya menampilkan tumpukan pemiliknya. Kartu HP lain tidak pernah disalin ke perangkat ini.
8. Setelah ronde selesai, masing-masing pemilik menekan **Selesai ronde**, lalu **Mulai ronde berikutnya**.

Setiap HP harus mempunyai aplikasi atau file HTML sendiri. Tidak ada penggabungan layar dan tidak ada kode koneksi. Jangan memilih mode HP dioper jika tujuannya satu set pribadi per HP.

## Membuka dan mengembalikan kartu

Kartu yang terakhir dipasang berada paling atas. Hanya kartu tertutup paling atas yang dapat diketuk. Cakram lain tetap tertutup, dan simbol bunga/duri tidak dimasukkan ke tampilan kartu tertutup.

Duri hanya memicu notifikasi kecil **“Duri terbuka.”** Tidak ada suara, getaran, dialog besar, perubahan layar merah, pemotongan kartu otomatis, atau penghentian ronde otomatis. Kalian menjalankan hasilnya langsung seperti permainan fisik.

Jika belum ada kartu yang dibuka, tombol **Kembali memasang kartu** tersedia untuk membatalkan perpindahan mode yang tidak sengaja. Sesudah ada kartu terbuka, selesaikan ronde terlebih dahulu.

## Penalti kartu bila diperlukan

Setelah **Selesai ronde**, pilih **Kelola kartu** untuk pemain yang kalian putuskan terkena penalti. Ini opsional, bukan keputusan aplikasi.

- **Saya … · pilih sendiri**: pemilik melihat kartunya secara rahasia dan memilih satu untuk dibuang.
- **Pemain lain pilih acak tertutup**: semua kartu tersisa diacak; pemain lain memilih satu bagian belakang kartu. Kartu dibuang tanpa diperlihatkan.

Pada kedua pilihan, pengurangan hanya terjadi setelah sebuah kartu dipilih. Jenis kartu yang hilang tidak diumumkan kepada meja. Pada giliran berikutnya, pemilik dapat melihat kartu yang masih dimilikinya.

Gunakan **Kembalikan set 4 kartu** jika ingin mengatur ulang set seorang pemain. Tidak ada penghitung kemenangan atau penetapan pemenang otomatis.

## Tema, simpanan, dan HP

Tema terang/gelap dapat diganti dari tombol ◐. Progres tersimpan pada browser perangkat yang sama jika penyimpanan lokal diizinkan. Buka **Lanjutkan kartu tersimpan** untuk melanjutkan. Tangan rahasia selalu tertutup kembali saat melanjutkan atau ketika halaman masuk latar belakang.

Sebagian aplikasi pratinjau file di Android/iOS tidak menjalankan JavaScript. Buka menggunakan browser atau pembuka HTML lokal yang mendukung JavaScript. File mandiri menghindari masalah aset pendamping, tetapi tidak dapat memaksa aplikasi pratinjau menjalankan JavaScript. Mode privat atau pembatasan browser juga dapat menonaktifkan penyimpanan. Belum diuji pada seluruh jenis HP.

Seperti saat memegang kartu fisik, jangan mengintip tangan pemain lain. Layar pelindung tidak melindungi dari orang yang sengaja memeriksa data browser.

## Acuan permainan fisik

Referensi resmi Skull ditelusuri kembali untuk bentuk set kartu dan urutan pembukaan. Aplikasi ini sengaja menyediakan medium kartu, bukan mesin yang menjalankan seluruh aturan Skull. Tengkorak diganti simbol duri; bunga dipertahankan sebagai simbol aman.

- Penerbit: https://www.spacecowboys-games.com/game/skull/
- Buku aturan resmi: https://cdn.svc.asmodee.net/production-spacecowboys/uploads/2025/11/SKULL_RULES_EN.pdf

Skull dirancang oleh Hervé Marly. Aplikasi ini merupakan adaptasi mandiri dengan tampilan tersendiri, bukan produk resmi penerbit.

## Pemeriksaan revisi

22 pemeriksaan otomatis lulus: satu pemilik pada mode HP saya, giliran oper, komposisi kartu, penempatan tertutup, pembukaan satu per satu dari atas, tidak adanya bet/pemilihan penantang otomatis, pengembalian kartu, penalti manual, validasi simpanan, dan tidak adanya panggilan jaringan. Pengujian dilakukan pada model data dan pemeriksaan kode; belum dilakukan pengujian visual browser maupun pengujian pada perangkat fisik.
