# Case Solve & Stories Time — MVP

Web app single-file (HTML + CSS + JS, tanpa dependensi build) berisi dua mode game misteri, mobile-first.

## Dua mode
- **Case Solve** — baca berkas kasus, kumpulkan petunjuk, ajukan kesimpulan (siapa/bagaimana/kenapa) yang diverifikasi otomatis oleh app. Cocok dimainkan sendiri.
- **Stories Time** — satu orang (game master) pegang HP dan tahu solusinya, pemain lain menebak lewat pertanyaan ya/tidak secara lisan. Wajib main berkelompok, offline, satu HP saja. (Ini versi orisinal terinspirasi genre "Black Stories" / lateral thinking puzzle — bukan reproduksi konten produk aslinya.)

## Cara pakai
1. Buka `case-solve.html` langsung di browser HP atau desktop — tidak perlu server atau instalasi apa pun.
2. Untuk hosting online, unggah file ini ke layanan static hosting apa saja (Netlify, Vercel, GitHub Pages, dll) atau taruh di server web biasa.
3. Halaman pertama adalah pemilihan mode — pilih Case Solve atau Stories Time.

## Progres pemain
Progres disimpan terpisah per mode di `localStorage` browser: `caseSolveProgress` dan `storiesTimeProgress`. Bersifat lokal per perangkat/browser, belum ada akun atau sinkronisasi lintas perangkat di versi MVP ini.

## Menambah Set baru (Set 2, 3, dst)
Semua konten ada di dua objek data di bagian atas tag `<script>` dalam `case-solve.html`:

**`DATA_CS`** (Case Solve) — duplikat struktur `set1`, isi array `cases` dengan objek berisi:
- `id`, `title`, `difficulty` (`mudah`/`menengah`/`sulit`), `time`
- `story`, `clues` (array petunjuk), `questions` (format who/how/why, tiap pertanyaan punya `options` dan index `correct`), `explanation`

**`DATA_ST`** (Stories Time) — duplikat struktur `stset1`, isi array `cases` dengan objek berisi:
- `id`, `title`, `difficulty`
- `riddle` — teka-teki yang dibacakan game master
- `keyPoints` — daftar fakta pendek untuk jawab cepat ya/tidak
- `hints` — 1–2 petunjuk tambahan kalau pemain buntu
- `fullSolution` — narasi solusi lengkap

Di kedua data, set `comingSoon: false` supaya Set tersebut muncul aktif di halaman awal masing-masing mode. Tidak perlu mengubah bagian logic/render — semua otomatis mengikuti isi data.

## Struktur kode
- Satu file `case-solve.html` berisi semuanya (CSS di `<style>`, JS di `<script>`) — sengaja dibuat portable, tinggal dibuka atau di-upload.
- Namespace kode: `App.cs.*` untuk logic Case Solve, `App.st.*` untuk logic Stories Time, `App.goLanding()` / `App.enterMode()` untuk navigasi halaman pemilihan mode.
