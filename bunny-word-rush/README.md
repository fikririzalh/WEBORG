# Bunny Word Rush

Game refleks kata berbasis HTML, CSS, dan JavaScript murni. `Shuffle` menghasilkan huruf awal dan akhir secara acak. Pemain harus menyebutkan kata yang sesuai, lalu menekan `Pick Me!` sebelum waktu habis.

## Alur permainan

1. Tekan `Shuffle` untuk mengacak huruf dan memulai timer.
2. Cari kata yang huruf pertamanya sama dengan Huruf Awal dan huruf terakhirnya sama dengan Huruf Akhir.
3. Pemain yang menemukan jawaban lebih dahulu mengucapkan katanya dan menekan `Pick Me!`.
4. Pilih nama pemain yang menjawab.
5. Moderator menekan `Benar, +1` atau `Salah, lanjut`.
6. Jawaban benar memberikan satu poin. Jawaban salah melanjutkan timer agar pemain lain dapat mencoba.

## Contoh

- Huruf awal: `A`
- Huruf akhir: `M`
- Salah satu jawaban: `AYAM`

## Fitur

- Pengacakan huruf awal dan akhir.
- Mode Huruf Umum dan Semua A-Z.
- Timer 5 sampai 60 detik.
- Tombol Pick Me yang menghentikan timer.
- Penilaian manual oleh moderator.
- Pemeriksaan otomatis pola huruf untuk kata yang diketik secara opsional.
- Papan skor untuk maksimal delapan pemain.
- Pengelolaan nama pemain dan reset skor.
- Efek suara yang dapat dinonaktifkan.
- Tema terang dan gelap.
- Penyimpanan pengaturan dan skor menggunakan `localStorage`.
- Tampilan responsif untuk komputer dan ponsel.
- Shortcut `Space` untuk Pick Me dan `S` untuk Shuffle.

## Menjalankan di VS Code

1. Letakkan `index.html`, `styles.css`, dan `app.js` di dalam satu folder.
2. Buka folder tersebut dengan VS Code.
3. Jalankan `index.html` menggunakan ekstensi Live Server.
4. Permainan dapat digunakan tanpa database maupun instalasi framework.
