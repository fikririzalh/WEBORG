# Card Capsule

Sistem gacha kartu pribadi berbasis HTML, CSS, dan JavaScript murni.

## Menjalankan

Cara termudah: buka `index.html` dengan browser modern.

Untuk hasil penyimpanan paling konsisten, jalankan melalui server lokal:

```bash
python -m http.server 8000
```

Kemudian buka `http://localhost:8000`.

## Fitur

- Pull 1× dan 10×
- Rate rarity transparan
- Garansi Epic+ pada 10 pull
- Hard pity Legendary+ pada 50 pull
- Koleksi dan upgrade kartu
- Duplikat menjadi Debu Bintang
- Autosave dengan localStorage
- Ekspor/impor save JSON
- Sound effect sintetis via Web Audio API
- Mode tenang/reduced motion
- Tidak memakai server, akun, pembayaran, atau dependency JS

## Mengubah kartu atau rate

Edit `CARD_DATA` dan `RARITIES` di `app.js`.
