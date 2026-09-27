# HAPPY PRISM — Pagi Cerdas 🌤️

Program rutinitas pagi untuk melatih otak sebelum memulai hari: 30 set latihan, masing-masing berisi **10 soal matematika pilihan ganda tingkat SMA** dan **1 cerita reflektif (5 paragraf)** dengan kotak isian kesimpulan.

Satu file, tanpa instalasi, tanpa server: `index.html`.

---

## 1. Fitur yang sudah dibuat

- ✅ **30 set latihan** (melebihi minimum yang diminta), masing-masing bisa dipilih dari tampilan grid utama.
- ✅ **10 soal matematika pilihan ganda per set** (300 soal total) — **latihan hitung cepat level menengah**: penjumlahan, pengurangan, perkalian, pembagian, dan soal campuran (urutan operasi hitung, misalnya `8 + 6 × 3`). Setiap set berisi 2 soal dari masing-masing jenis operasi. Tingkat kesulitan sengaja dijaga di level menengah — bukan sekadar hitungan satu digit yang terlalu mudah, tapi juga bukan soal aljabar/rumus yang berat — supaya cukup untuk "memanaskan" otak tanpa terasa membebani di pagi hari. Soal dibuat lewat skrip generator dengan jawaban dihitung otomatis, sehingga terjamin benar secara matematis dan variatif setiap set-nya.
- ✅ **Cerita pagi 5 paragraf** per set, dengan tema pembentukan karakter (kejujuran, kedisiplinan, kerja keras, empati, tanggung jawab, dll) yang cocok untuk pemanasan berpikir di pagi hari.
- ✅ **Kotak isian kesimpulan** + tombol **"Selesai"** yang menampilkan kesimpulan contoh (kunci jawaban terbuka) setelah diklik.
- ✅ **Penanda status per set**: Belum dikerjakan / Sedang dikerjakan / Selesai — otomatis berubah begitu soal matematika diperiksa dan cerita diselesaikan.
- ✅ **Progres tersimpan otomatis** di browser (localStorage), termasuk jawaban yang sudah dipilih dan draft kesimpulan yang sudah ditulis — tetap ada walau halaman ditutup dan dibuka lagi.
- ✅ **Mobile friendly**: grid dan tata letak menyesuaikan lebar layar (HP, tablet, desktop).
- ✅ **Bisa diperbarui berkala**: semua konten (soal & cerita) tersimpan sebagai data terstruktur di dalam file, mudah ditambah atau diedit tanpa mengubah tampilan/kode program (lihat bagian 4).
- ✅ Menggunakan palet warna resmi **HAPPY PRISM** (lihat bagian 5).

## 2. Cara pakai

1. Buka `index.html` langsung di browser (dobel klik / drag ke tab browser) — semua sudah berjalan lokal, tidak perlu internet kecuali untuk memuat font.
2. Pilih salah satu dari 30 set di halaman utama.
3. Kerjakan 10 soal matematika, lalu klik **"Periksa Jawaban"** untuk melihat skor dan pembahasan (jawaban benar ditandai hijau, pilihanmu yang salah ditandai pink).
4. Baca cerita pagi, tulis kesimpulanmu di kotak yang tersedia, lalu klik **"Selesai"** untuk melihat kesimpulan contoh.
5. Status set akan berubah otomatis di halaman utama, dan progres keseluruhan (misalnya "12/30") terlihat di bagian atas.

### Menghosting/membagikan program ini
Karena ini murni file HTML statis, kamu bisa:
- Membukanya langsung dari komputer/HP (cukup file `index.html` ini saja, tidak perlu file lain).
- Meng-upload ke hosting gratis apa pun (GitHub Pages, Netlify, Vercel, cPanel, dsb.) — cukup unggah `index.html` sebagai berkas utama (root), karena namanya sudah sesuai standar (`index.html`).

⚠️ Catatan: progres disimpan per **browser + perangkat** (localStorage), bukan di server. Artinya progres tidak otomatis tersinkron antar perangkat, dan akan hilang jika histori/data situs pada browser tersebut dibersihkan.

## 3. Struktur teknis singkat

Semua ada dalam satu file `index.html`:
- `<style>` — desain tampilan (palet warna HAPPY PRISM, tipografi, layout responsif).
- `<script>` — berisi:
  - `DATA_SETS` — array data 30 set (soal matematika + cerita). Ini bagian yang perlu disentuh kalau ingin **menambah/mengedit konten**.
  - Logika render tampilan (grid set, halaman detail, pemeriksaan jawaban, dst).
  - Logika penyimpanan progres ke `localStorage`.

## 4. Cara memperbarui / menambah set (agar tetap "berkala")

Setiap set di `DATA_SETS` mengikuti bentuk berikut:

```json
{
  "id": 31,
  "setTitle": "Set 31: Judul Cerita Baru",
  "math": [
    { "q": "Teks soal...", "options": ["A ...", "B ...", "C ...", "D ..."], "correct": 2 },
    ... (harus tepat 10 soal)
  ],
  "story": {
    "title": "Judul Cerita Baru",
    "paragraphs": [
      "Paragraf 1...", "Paragraf 2...", "Paragraf 3...", "Paragraf 4...", "Paragraf 5..."
    ],
    "modelAnswer": "Kesimpulan contoh yang akan tampil saat tombol Selesai diklik."
  }
}
```

Langkah menambah set baru:
1. Buka `index.html` dengan editor teks (Notepad, VS Code, dll).
2. Cari baris `const DATA_SETS = [` di bagian `<script>`.
3. Tambahkan objek set baru (ikuti format di atas) sebelum tanda kurung siku penutup `];`.
4. Pastikan: `"correct"` berupa angka **0–3** (index pilihan, 0 = A, 1 = B, 2 = C, 3 = D), jumlah `options` selalu 4, jumlah soal `math` selalu 10, dan jumlah `paragraphs` selalu 5.
5. Simpan file. Tidak perlu mengubah bagian CSS/HTML/JS lainnya — tampilan akan otomatis menyesuaikan jumlah set yang ada (grid, progress bar "x/30" bisa disesuaikan manual jika total set berubah dari 30).

Untuk yang ingin membuat banyak soal secara otomatis (bukan tulis manual satu-satu), pola yang dipakai saat membangun 300 soal awal adalah: skrip generator per jenis operasi (tambah, kurang, kali, bagi, campuran urutan operasi) yang menghitung jawaban benar secara program, lalu didistribusikan rata ke 30 set (2 soal per jenis operasi per set). Pendekatan ini bisa dipakai lagi kalau suatu saat ingin menaikkan/menurunkan tingkat kesulitan atau menambah jenis soal baru.

## 5. Palet Warna Resmi — HAPPY PRISM

| Nama | HEX | Peran di aplikasi |
|---|---|---|
| Sky Blue | `#3CB4E6` | Aksen utama, nomor soal, kartu set |
| Emerald Green | `#32B18E` | Status "Selesai", jawaban benar |
| Hot Pink | `#F05696` | Kartu set, tanda jawaban salah |
| Deep Orange | `#FF8040` | Tombol aksi utama ("Periksa Jawaban", "Selesai") |
| Sunny Yellow | `#FFD730` | Status "Sedang dikerjakan" |
| Snow White | `#F0F0F0` | Latar belakang halaman |
| Light Grey | `#D0D0D0` | Border, status "Belum dikerjakan" |
| Metallic Silver | `#959595` | Teks sekunder |
| Golden Bronze | `#B89C57` | Aksen kartu set |
| Deep Magenta | `#9C208C` | Judul cerita, kotak kesimpulan contoh |
| Midnight Blue | `#001F4F` | Warna teks utama |
| Prismatic Gradient | multi | Garis dekoratif di bagian paling atas halaman |

## 6. Berkas dalam paket ini
- `index.html` — program utamanya, siap dibuka atau di-hosting.
- `README.md` — dokumen ini.

Selamat berlatih dan semoga harimu makin cerdas sejak pagi! 🌤️
