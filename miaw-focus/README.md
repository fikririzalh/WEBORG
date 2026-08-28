# 🐾 MIAW FOCUS — Cozy Cat Focus Timer

Timer fokus dengan kucing peliharaan virtual di teras malam — terinspirasi dari genre "cozy pet companion timer", tapi seluruh karakter, tata letak, dan artwork-nya **digambar ulang dari nol** (SVG orisinal, bukan jiplakan aplikasi manapun). Buka `index.html`, tidak perlu server/npm.

## ✨ Fitur

- **Timer fokus** dengan preset 10/25/45/60 menit dan durasi custom 1–720 menit.
- **Kucing peliharaan** duduk di ayunan teras sambil minum teh, lengkap dengan telinga, kumis, ekor, dan bantal-bantal empuk — semuanya SVG asli.
- **Animasi kucing lembut** pada gerak napas, ekor, telinga, dan uap minuman. Animasi otomatis diminimalkan jika perangkat mengaktifkan pengaturan reduced motion.
- **Progress bar** oranye di atas yang mengisi seiring sesi berjalan.
- **Mode bebas distraksi waktu** untuk menyembunyikan atau menampilkan kembali hitung mundur tanpa menghentikan sesi.
- **Empat latar alam** yang dapat dipilih dari menu: hutan, danau, pegunungan, dan lembah.
- **Mata uang ganda**: 🪙 koin (bertambah tiap 20 detik fokus) dan 🐟 treat (bonus kalau sesi selesai penuh, tidak didapat kalau di-stop di tengah jalan).
- **Nama kucing bisa diganti** lewat menu (☰).
- **Tema Malam/Siang** — bisa ganti kapan saja, seluruh palet warna scene ikut berubah.
- **Suara** bisa dimatikan.
- **Layar tidak ikut mati sendiri** selama sesi berjalan (Screen Wake Lock), dan otomatis sinkron ulang begitu layar menyala lagi kalau sempat terkunci manual.
- Progres (koin, treat, nama, tema) tersimpan otomatis di localStorage.
- Judul tab selalu **MIAW FOCUS**, tanpa angka hitung mundur.

## 🎮 Cara Pakai

1. Pilih durasi fokus (10/25/45/60 menit), atau tekan **Custom** untuk memasukkan durasi sendiri seperti 30 menit, lalu tekan **🐾 Mulai Fokus**.
2. Selama berjalan: **⏸** untuk jeda/lanjut, **⏹** untuk berhenti (koin yang sudah didapat tetap tersimpan, tapi tidak dapat treat bonus).
3. Kalau sesi selesai penuh, muncul rangkuman koin + treat yang didapat.
4. Gunakan tombol **Sembunyikan waktu** jika angka hitung mundur terasa mengganggu. Tekan lagi untuk menampilkannya kembali.
5. Tekan **☰** untuk ganti nama kucing, tema Malam/Siang, suara, latar alam, atau reset progres.

## 🗂️ Struktur File
```
index.html         struktur halaman + ilustrasi SVG kucing & scene (orisinal)
styles.css         tampilan, tema malam/siang, latar alam, dan animasi
app.js             logika timer, mata uang, wake lock, dan penyimpanan
package.json       perintah build ringan
scripts/build.mjs  proses build tanpa dependensi eksternal
```

Jalankan build setelah mengubah kode:
```
npm run build
```

## ⚠️ Catatan
Ini BUKAN kloning dari aplikasi manapun — konsep "kucing/hewan peliharaan virtual yang menemani sesi fokus" adalah genre umum yang dipakai banyak aplikasi produktivitas, tapi karakter, proporsi, pose, dan seluruh ilustrasi di sini dibuat orisinal untuk MIAW FOCUS.

Koneksi internet diperlukan untuk memuat font dan foto latar alam dari Unsplash.
