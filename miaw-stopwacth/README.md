# 🐾 MIAW STOPWATCH — Premium Cat Timer

Stopwatch & timer kucing yang menggemaskan, jalan langsung di browser tanpa server/npm. Buka `index.html`.

## ✨ Fitur

- **Mode ganda**: Timer (hitung mundur) & Stopwatch (hitung maju).
- **Timer bisa diatur bebas**: tombol +/− Jam/Menit/Detik, atau preset cepat (1, 5, 10, 15, 25 🍅, 45 menit).
- **Angka lucu & animasi pop** setiap digit berubah, pakai font bulat "Baloo 2".
- **Kucing maskot** yang berekspresi sesuai kondisi: santai 😺 → semangat lari 😻 saat jalan → ngantuk 😽 saat dijeda → kaget 🙀 saat alarm.
- **Progress ring**: melingkar mengempis mengikuti sisa waktu (mode Timer), atau berputar pelan sebagai indikator "sedang jalan" (mode Stopwatch).
- **Sembunyikan Angka (🙈)** — khusus buat yang gampang kebawa terus-terusan lihat angka (ADHD-friendly): angka disembunyikan, cuma kucing & ring yang kelihatan. Ada tombol **"👀 Intip 3 Detik"** buat lihat sekilas tanpa harus mematikan mode sembunyi.
- **Alarm saat waktu habis**: layar berkedip, kucing kaget + gemetar, suara "meong" berulang, dengan pilihan **Matikan** atau **+1 Menit** (snooze).
- **Background bisa diganti-ganti**: 6 preset warna pastel + upload gambar sendiri. Gambar upload otomatis dikompres (resize + JPEG) sebelum disimpan supaya tidak membengkak, lalu tersimpan permanen di localStorage — tetap ada walau tab ditutup dan dibuka lagi.
- **Dark/Light mode** penuh, termasuk saat pakai background custom (ada lapisan gelap transparan otomatis di mode dark supaya teks tetap kebaca).
- Tampilan kaca (glassmorphism), responsive mobile.
- Preferensi (tema, suara, background, mode terakhir, durasi terakhir) tersimpan otomatis di localStorage.

## 🎮 Cara Pakai

1. Pilih mode **Timer** atau **Stopwatch** di tab atas.
2. Untuk Timer: atur durasi lewat tombol +/− atau klik salah satu preset cepat.
3. Tekan **▶** untuk mulai, **⏸** untuk jeda, **↻** untuk reset.
4. Tekan **🙈** kalau mau sembunyikan angka biar tidak kebawa terus mengecek — nanti berubah jadi 🙉, tekan lagi buat menampilkan kembali. Selama disembunyikan, ada tombol "👀 Intip 3 Detik" buat lihat sekilas.
5. Saat waktu di mode Timer habis, alarm otomatis muncul dengan pilihan **Matikan** atau **+1 Menit**.
6. Tekan **🎨** di pojok kanan atas buat ganti background (pilih preset atau upload gambar sendiri).
7. Tekan **🌙/☀️** buat ganti tema gelap/terang, dan **🔊/🔇** buat menyalakan/mematikan suara.

## 🔒 Soal Layar Terkunci (Wake Lock)

Selama timer/stopwatch **berjalan**, halaman ini otomatis meminta HP untuk **tidak ikut mengunci layar sendiri karena idle** (pakai Screen Wake Lock API bawaan browser) — jadi kamu bisa taruh HP begitu saja tanpa layar mati sendiri, dan alarm tetap kedengaran/kelihatan tepat waktu.

**Batasan yang perlu kamu tahu:**
- Wake Lock **tidak bisa mencegah kamu menekan tombol power secara manual** untuk mengunci HP — itu murni keputusan sistem operasi, tidak ada API web yang bisa mencegahnya. Kalau kamu kunci manual, browser mobile akan menghentikan total eksekusi JavaScript (termasuk suara alarm) selama layar terkunci.
- Begitu kamu buka kunci lagi, halaman **langsung menyinkronkan ulang** sisa waktu berdasarkan jam asli (bukan interval yang sempat berhenti) — jadi kalau durasi timer sudah lewat selagi terkunci, alarm akan langsung muncul saat itu juga (ini perilaku yang benar, bukan bug: waktu tetap berjalan walau layar mati, sama seperti timer oven/HP pada umumnya).
- Browser lama (terutama Safari iOS di bawah versi 16.4) belum mendukung Wake Lock API — kalau begitu, fitur ini otomatis nonaktif tanpa peringatan apa pun; cukup dihindari saja mengunci layar manual saat timer jalan di browser tersebut.

## 🗂️ Struktur File
```
index.html        struktur halaman
styles.css        semua tampilan (glassmorphism, animasi kucing, tema gelap/terang)
app.js            logika timer/stopwatch, alarm, background, penyimpanan
dev/test_headless.js   test otomatis (Node.js, tanpa dependency) untuk memastikan
                       logika inti (hitung waktu, alarm, adjust durasi, penyimpanan)
                       tidak rusak kalau ada perubahan di masa depan
```

Untuk menjalankan test setelah mengubah kode:
```
cd dev
node test_headless.js
```
