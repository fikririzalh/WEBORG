# FRUIT FIVE V3

Game kartu refleks untuk dimainkan bersama kartu digital dan bel sungguhan. V3 dibangun ulang dengan alur yang lebih stabil, antarmuka baru, tiga mode permainan, tujuh jenis buah, dan ability yang dapat dipilih.

## Menjalankan game

1. Ekstrak ZIP.
2. Buka `index.html` di Chrome, Edge, Firefox, atau Safari.
3. Pilih mode dan ability.
4. Tekan **Main Sekarang**.

Game tidak memerlukan instalasi, internet, server, npm, atau akun.

## Mode permainan

- **Normal:** 4 buah dan 4 action original.
- **Fresh Mix:** 6 buah. Kiwi dan anggur ditambahkan.
- **Chaos:** 7 buah, semua ability, dan action card lebih sering muncul.

Mode Chaos menambahkan semangka sebagai buah ketujuh. Pilihan ability tetap dapat diubah sebelum permainan dimulai.

## Ability baru

- **Freeze:** semua pemain harus diam.
- **Reverse:** arah giliran berbalik.
- **Double Draw:** pemain berikutnya membuka dua kartu pada meja berbeda.

## Kontrol

- Klik **Buka Kartu** pada salah satu dari enam meja.
- Gunakan tombol angka `1` sampai `6` untuk membuka kartu lebih cepat.
- Tekan **Ulang Instan** untuk langsung mengacak dan memulai ulang mode terakhir tanpa dialog.
- Tekan **Atur Mode** untuk kembali ke pengaturan.

## Aturan fokus nyata

Aplikasi tidak menghitung jumlah buah yang terlihat dan tidak menampilkan peringatan saat jumlahnya tepat lima. Pemain harus mengamati kartu sendiri dan membunyikan bel sungguhan.

## Struktur utama

- `index.html`: halaman utama.
- `styles.css`: seluruh UI responsif.
- `games/fruit-five.js`: mode, buah, deck, ability, dan mekanik game.
- `core/platform.js`: tema, suara, penyimpanan preferensi, dan reset instan.

Versi: 3.0.0
