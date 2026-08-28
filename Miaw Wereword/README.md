# MIAU! WEREWORDS TABLE

Prototype web dua-device untuk menggantikan komponen fisik Werewords.

## Pembagian perangkat

### HP 2 — Werewords narrator app
- Magic Word
- Night narration
- Role wake-up
- Day timer
- Correct / timeout / endgame instructions

### HP 1 — Web ini
- CRUD pemain
- CRUD role
- Pilih Mayor
- Deal secret role
- Secret role reveal bergantian
- Answer token board: YES / NO / MAYBE
- Token stock dan Undo
- Endgame role reveal individual atau semua
- Dark/light
- Sound UI
- localStorage
- Export/import JSON

## Setup digital
Mayor adalah status publik, tetapi tetap mempunyai secret role seperti pemain lain.
Web memilih Mayor dan membagikan tepat satu secret role kepada setiap pemain.

Auto Standard:
- 1 Seer
- 1 Werewolf untuk 4–6 pemain
- 2 Werewolves untuk 7–11 pemain
- 3 Werewolves untuk 12+ pemain
- sisa Villager

Role custom dapat dibuat via CRUD dan jumlahnya dipilih manual di setup agar sama dengan konfigurasi HP narrator.

## Day Phase
1. Pertanyaan dilakukan verbal.
2. Mayor tap kartu pemain yang baru bertanya.
3. Pilih:
   - ✅ YES
   - ❌ NO
   - ❓ MAYBE
4. Semua token pemain tetap terlihat sebagai history publik.
5. YES dan NO memakai satu stok bersama.
6. Jika stok YES/NO habis, web mengingatkan agar menggunakan "No More Yes/No Tokens" di narrator app.
7. Undo menghapus token terakhir dan mengembalikannya ke stok.

Web sengaja tidak menyimpan Magic Word dan tidak menjalankan timer/narration.

Extract ZIP lalu buka index.html. Tidak perlu npm/server.
