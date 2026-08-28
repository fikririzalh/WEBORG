# MIAU! SECRET WORD DUEL

Game duel kata 2 pemain, 1 device.

## Mekanik original
- Web memilih satu pasangan kata yang berhubungan tetapi berbeda.
- Kata A dan B dibagikan privat, satu pemain satu kata.
- Setiap cycle kedua pemain memasukkan satu clue kata tentang kata mereka sendiri.
- Clue pemain pertama tidak ditampilkan sampai pemain kedua juga lock.
- Setelah kedua clue publik, kedua pemain memasukkan tebakan secara privat.
- Tebakan dibuka bersamaan supaya tidak ada first-player advantage.
- Satu pemain benar: +1 poin.
- Keduanya benar pada cycle yang sama: draw, 0 poin.
- Tidak ada yang benar sampai max cycle: stalemate, 0 poin.
- Match default first to 5.

## Aturan clue
- Tepat satu kata.
- Tidak boleh menggunakan kata rahasia atau salah satu kata penyusunnya.
- Tidak boleh mengulang clue sendiri dalam ronde yang sama.

## Fitur
- CRUD pemain P001...
- CRUD pasangan kata D001...
- 150 pasangan kata original, 10 kategori
- Filter kategori
- Target skor 3 / 5 / 7
- Max cycle 4 / 6 / 8
- Clue history
- Private role / clue / guess flow
- Dark/light
- Sound
- localStorage
- Export/import JSON
- Responsive mobile

Extract ZIP lalu buka `index.html`. Tidak perlu npm/server.
