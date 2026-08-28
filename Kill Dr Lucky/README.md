# Lucky Mansion — Browser Edition

Versi game browser offline berbasis peta mansion yang diberikan pengguna. Tidak memakai library eksternal dan dapat dijalankan langsung dari folder.

## Menjalankan

1. Ekstrak ZIP.
2. Buka `index.html` dengan Chrome, Edge, Firefox, atau Safari modern.
3. Pilih 3–7 pemain.
4. Setiap kursi dapat diatur sebagai **Manusia** atau **Bot**.
5. Tekan **Mulai permainan**.

Untuk bermain solo, buat 1 pemain Manusia dan 2 atau lebih Bot.

## Fitur

- 3–7 pemain lokal / bot.
- 20 ruangan bernomor pada peta.
- Pergerakan berdasarkan graf pintu/ruangan.
- Jalur pandang antarruangan.
- Dr. Lucky bergerak otomatis mengikuti nomor 0 → 19 → 0.
- Tangan kartu rahasia dengan layar hand-off.
- Kartu Rencana, Gagalkan, dan Gerak.
- Sistem Spite untuk memperkuat percobaan berikutnya.
- Bot yang dapat bergerak, mencari kartu, mencoba, dan merespons.
- Autosave via `localStorage` dan tombol lanjutkan.
- Tutorial singkat, log permainan, suara ringan, UI responsif.
- Offline; tidak membutuhkan server atau internet.

## Aturan versi browser

Ini adalah adaptasi mekanik untuk peta 1997, bukan salinan teks aturan resmi. Semua pemain mulai di Drawing Room. Dr. Lucky mulai di ruangan bernomor acak. Pada giliran, pemain dapat bergerak, mencari kartu ketika tidak terlihat, dan melakukan percobaan ketika berada satu ruangan dengan Dr. Lucky tanpa saksi. Pemain lain dapat menambah pertahanan menggunakan kartu Gagalkan. Percobaan yang gagal memberi +1 Spite. Setelah giliran berakhir, Dr. Lucky bergerak ke nomor berikutnya.

## File

- `index.html` — struktur UI
- `style.css` — tampilan responsif
- `game.js` — mesin permainan, bot, autosave, LOS, kartu
- `mansion.png` — papan yang diberikan pengguna

## Catatan

Fan-made browser adaptation untuk penggunaan pribadi/prototipe. Tidak berafiliasi dengan penerbit atau pemilik merek dagang terkait.
