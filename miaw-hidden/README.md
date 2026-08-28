# MIAW HIDDEN

Miaw Hidden adalah web game kartu kooperatif untuk dimainkan bergiliran pada satu perangkat. Setiap pemain memilih tiga rank rahasia, kemudian tim membuka kartu dari deck hingga semua pilihan ditemukan.

## Cara menjalankan

1. Ekstrak ZIP.
2. Buka folder `MIAW HIDDEN`.
3. Klik dua kali `index.html`, atau buka melalui Live Server di VS Code.

Game tidak memerlukan instalasi maupun server. Seluruh progres disimpan melalui `localStorage` pada browser.

## Aturan permainan

1. Tambahkan, ubah, atau hapus pemain di lobby. Permainan mendukung 1–8 pemain.
2. Setiap pemain menekan **Atur rahasia**, menerima perangkat, lalu memilih tepat tiga rank berbeda.
3. Pilihan menggunakan rank kartu: A = 1, J = 11, Q = 12, dan K = 13.
4. Setelah semua pemain siap, tekan **Mulai permainan**.
5. Klik deck atau tombol **Buka 1 kartu**. Pencocokan hanya berdasarkan rank, bukan simbol kartu.
6. Jika beberapa pemain memilih rank yang sama, satu kartu yang terbuka akan mengisi slot mereka secara bersamaan.
7. Tim menang setelah seluruh slot pemain ditemukan.

## Power-up

**Teropong Miaw** dapat digunakan satu kali per ronde. Fitur ini menampilkan tiga kartu teratas dan membiarkan tim memilih satu kartu untuk dibuka. Dua kartu lainnya tetap berada di deck.

## Fitur

- CRUD pemain.
- Pilihan rank rahasia untuk penggunaan satu perangkat.
- Deck standar 52 kartu yang dikocok setiap ronde.
- Kemenangan kooperatif dan progres per pemain.
- Mode terang dan gelap.
- Riwayat kartu, statistik ronde, dan penyimpanan otomatis.
- Desain responsif untuk ponsel maupun desktop.

## Struktur

```text
MIAW HIDDEN/
├── index.html
├── styles.css
├── app.js
├── README.md
└── assets/
    └── miaw-hidden-mascot.png
```
