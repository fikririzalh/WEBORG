# Fishy Indo — 100 Kartu Bluff (Single Device)

Prototype web lokal yang terinspirasi oleh format trivia-bluff party game, tetapi **semua pertanyaan dan teks kartu di proyek ini ditulis ulang/original** dan bukan deck resmi Sounds Fishy.

## Cara main versi ini
1. Tentukan role merah/biru manual, misalnya memakai kartu remi.
2. Guesser membaca pertanyaan di sisi depan beberapa kali.
3. Guesser mengangkat / menaruh HP sehingga ia tidak dapat melihat layar.
4. Teman atau Guesser menekan **BALIK KARTU**.
5. Pemegang jawaban asli melihat sisi belakang; pemain lain mengarang jawaban palsu secara verbal.
6. Setelah ronde selesai tekan **KARTU BERIKUT**.

## File
- `index.html` — UI
- `styles.css` — tema dan animasi flip
- `cards.js` — **100 kartu; edit konten di sini**
- `app.js` — shuffle, flip, next, sound, theme

## Shortcut
- `Space` = balik kartu
- `→` = kartu berikut

## Catatan data
- ID kartu: `Q001` s.d. `Q100`
- Deck diacak tanpa pengulangan hingga seluruh 100 kartu habis.
- Sumber disimpan per kartu dan muncul kecil di sisi belakang agar fakta dapat dicek.
- Tema dan sound preference disimpan di `localStorage`.

Tidak perlu npm/server. Buka `index.html` langsung di browser modern.
