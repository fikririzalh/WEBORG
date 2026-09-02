# Cuttle Cat Codex — Kingdom Ruleset

Dashboard interaktif HTML/CSS/JavaScript untuk mempelajari Rule Ability Kartu A–K bertema kerajaan, memeriksa ranking Power dan tie-breaker Suit, mengatur isi kartu, serta menyimpan riwayat playtest di `localStorage`.

## Menjalankan

Buka `index.html` langsung di browser modern. Tidak ada build step, package manager, framework, atau koneksi internet yang diperlukan untuk fungsi utama.

## Fitur

- Halaman awal: kartu ability lengkap A–K dengan Power, timing, efek, dan counter.
- Ilustrasi SVG kucing unik per rank; tidak memakai satu emoji kucing yang diulang.
- Alur resolusi Line: Reveal, efek sebelum ranking, ranking, lalu akhir ronde.
- Tie-breaker Suit: ♠ > ♥ > ♦ > ♣.
- Ringkasan tabel Rule Ability Kartu yang dapat dibaca cepat.
- Filter dan pencarian kartu.
- Checklist penguasaan dengan progres tersimpan.
- Dark mode tersimpan.
- Line ranking checker dengan Power dan tie-breaker Suit.
- Match tracker dan win rate lokal.
- Card CRUD: tambah kartu, baca detail, edit ability/Power/timing, hapus kartu, dan pulihkan default.
- Perubahan kartu tersimpan lokal dan otomatis dipakai oleh tabel aturan serta line checker.
- Section `Line random` dengan 30 set variasi tiga lokasi: Castle, Village, dan Port.
- Filter jumlah pemain 2–4; hanya slot reward/modifier yang sesuai yang ditampilkan.
- Layout responsif dengan sidebar desktop dan bottom navigation mobile.

## Ruleset

Konten mengikuti Rule Ability Kartu A–K untuk kebutuhan panduan dan playtest kartu remi fisik:

- Efek `Saat Reveal` diproses sesuai urutan kartu dimainkan.
- `Spy Master (9)` dapat membatalkan ability satu kartu sebelum ranking.
- Power akhir menentukan ranking; jika sama, gunakan urutan Suit `♠ > ♥ > ♦ > ♣`.
- Ability `Akhir Ronde` dijalankan setelah hasil ranking ditentukan.

## Emblems adaptation

Struktur Line random mengambil inspirasi dari alur tiga lokasi Emblems (Castle, Village, Port), pilihan kartu rahasia, reveal berurutan, ranking, dan reward akhir ronde. Karena proyek ini memakai deck remi satu Suit per pemain untuk 2–4 pemain, 30 layout di aplikasi adalah variasi playtest/fan adaptation, bukan data atau komponen resmi Emblems. Angka negatif ditampilkan sebagai penalti supaya efek pembalikan dan comeback bisa diuji.
