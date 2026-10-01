# Killer Next Door — Remi Companion v1

Web companion **offline, satu HP, pass-and-play** untuk memainkan adaptasi social deduction menggunakan **1 deck remi standar 52 kartu**. Tidak memakai server, akun, room code, framework, atau dependency eksternal.

## Cara menjalankan

1. Ekstrak ZIP.
2. Buka `index.html` di browser modern (Chrome, Edge, Safari, Firefox).
3. Pilih jumlah pemain, nama pemain, jumlah rumah, serta target SAFE/DEAD.
4. Bagikan role dengan pass-and-play.
5. Gunakan deck remi fisik di meja dan web hanya sebagai companion.

State permainan tersimpan otomatis lewat `localStorage` browser.

## Mapping deck tetap

- **2–J merah (♥ ♦)** → 🎁 Gift
- **2–J hitam (♣ ♠)** → 🔪 Grudge
- **semua Q** → 🛡️ Protection
- **semua K** → 🔎 Investigation
- **semua A** → ☠️ Death

Komposisi: **20 Gift + 20 Grudge + 4 Protection + 4 Investigation + 4 Death = 52 kartu**.

## Aturan Remi Companion v1

Ini adalah adaptasi companion yang dibuat untuk deck remi, bukan reproduksi aturan resmi per kartu.

- 1 Killer, 1 Snoop, sisanya Neighbor.
- Pada giliran, pemain mengambil 1 kartu dari deck fisik dan melihat fungsi kartu lewat Decoder secara privat.
- Gift, Grudge, Protection, dan Death diletakkan face-down di bawah/di dekat rumah fisik pilihan.
- King (Investigation) dipakai segera melalui web untuk memeriksa apakah satu pemain adalah Killer atau bukan, lalu King dianggap terpakai.
- Saat pile sebuah rumah dibuka, masukkan kartu-kartunya ke web.
- Gift = +1 Gift.
- Grudge = +1 Grudge.
- Queen/Protection = menyerap 1 poin Grudge pada rumah.
- Ace/Death = +2 Grudge.
- 3 Gift → rumah SAFE.
- 3 Grudge efektif (Grudge dikurangi Protection) → rumah DEAD.
- Snoop memiliki 1 Investigation gratis sepanjang permainan.
- Neighbor side menang jika Killer terungkap melalui vote atau target SAFE tercapai.
- Killer menang jika target DEAD tercapai atau 52 kartu habis tanpa Killer ditemukan.

Target SAFE/DEAD dapat diubah saat setup.

## Fitur

- Mobile-first dan nyaman untuk satu HP bersama.
- Dark / Light mode.
- Secret role pass-and-play.
- Decoder 52 kartu.
- Papan lingkungan digital.
- Input/reveal pile rumah.
- Protection, Death, dan Investigation.
- Snoop investigation sekali per game.
- Vote / accusation.
- Deck tracker dan pencegahan kartu terpakai dua kali.
- Undo aksi terakhir.
- Auto-save lokal.
- Tidak memakai gambar atau aset resmi game.

## Catatan desain

Sumber publik untuk game asli menjelaskan inti Gift/Grudge: kartu dimainkan ke Neighbor, 3 Gifts menyelamatkan Neighbor, dan 3 Grudges membunuh Neighbor. Web companion ini mempertahankan inti itu tetapi menambahkan mapping remi dan aturan Q/K/A yang telah diputuskan untuk versi ini.

## Struktur file

- `index.html` — shell aplikasi.
- `styles.css` — desain responsive + dark/light.
- `app.js` — seluruh state dan mekanik permainan.
- `manifest.webmanifest` — metadata web app.

## Bisa diupdate

Versi ini sengaja dibuat tanpa build step supaya mudah dimodifikasi. Efek kartu, role, target kemenangan, dan flow reveal dapat direvisi langsung di `app.js`.
