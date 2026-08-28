# 🏙️ Monopoly City Manager — Premium Rebuild

Tracker portofolio kota & properti pribadi (cocok buat companion tracker game seperti Monopoly GO, atau catatan properti fiksi/board game apapun). Dirombak total dari versi awal biar lebih rapi, lengkap, dan enak dipakai — **data lama yang sudah tersimpan di browser tetap kompatibel**, tidak akan hilang.

Buka `index.html`, tidak perlu server/npm.

## 🆕 Apa yang berubah dari versi lama

| Sebelumnya | Sekarang |
|---|---|
| Cuma bisa tambah & hapus (tidak bisa edit) | Edit kota & properti lengkap |
| Hapus langsung tanpa konfirmasi | Konfirmasi sebelum hapus (bisa dibatalkan) |
| Tidak ada pencarian/filter | Cari kota, cari & filter status properti |
| Tidak ada pengurutan | Sort by nama, jumlah properti, nilai, terbaru |
| Harga properti cuma teks bebas | Input angka + auto-format ribuan (500000 → 500.000) |
| Tidak ada ringkasan | Dashboard statistik (total kota, properti, owned, estimasi nilai) di halaman utama & per kota |
| Data cuma di 1 browser, tidak ada backup | Export/Import JSON buat backup & pindah device |
| Delete pakai index array (bisa salah target kalau sudah difilter/sort) | Semua operasi pakai ID unik, aman dari bug data ketuker |
| Desain polos | Desain premium: dark theme emas, kartu dengan hover, badge warna per status, animasi modal |
| Bendera negara manual | Bendera otomatis dari nama negara (~50 negara umum) |

## 🎮 Fitur

- Tambah/edit/hapus kota, masing-masing dengan negara (bendera otomatis).
- Tambah/edit/hapus properti per kota: nama, status (Available/Owned/Developing/Landmark), dan 4 tingkat harga (Rumah/Apartemen/Hotel/Landmark).
- Pencarian & pengurutan kota, pencarian & filter status properti.
- Statistik otomatis: total kota, total properti, jumlah Owned/Landmark, estimasi total nilai — baik secara global maupun per kota.
- Export data ke file `.json` (backup) dan Import kembali (dengan konfirmasi sebelum menimpa data).
- Konfirmasi sebelum menghapus apa pun.
- Toast notifikasi untuk setiap aksi (simpan, hapus, import, dst).
- Enter untuk submit form, Escape untuk menutup modal, klik di luar modal untuk menutup.
- Sepenuhnya responsive untuk HP.

## 🔒 Kompatibilitas Data Lama

Kalau sebelumnya sudah pernah pakai versi lama app ini di browser yang sama, semua kota & properti yang sudah tersimpan **otomatis termigrasi** saat pertama kali dibuka (ditambahkan ID unik di belakang layar) — tidak perlu input ulang manual.

## 🗂️ Struktur File
```
index.html    struktur halaman
style.css     tampilan premium (dark theme, kartu, modal, animasi)
app.js        semua logika: CRUD, search/sort, statistik, export/import
dev/test_playwright.py   test otomatis end-to-end (27 skenario) pakai browser asli
```

Jalankan test setelah mengubah kode (butuh `pip install playwright && playwright install chromium`):
```
cd dev
python3 test_playwright.py
```
