# MIAW · SPLATTER

Browser boardgame 2 pemain, single device, dibangun di atas **MIAW BASE**.

## Core rules

- Setiap sel hidup berisi satu paint dot milik Blue atau Pink.
- Jumlah awal dot selalu seimbang.
- Pada giliranmu, pilih **dot milikmu sendiri**.
- Pilih salah satu aksi:
  - **Solo Splatter**: hanya sel yang dipilih dihancurkan.
  - **Full Splatter**: sel yang dipilih dan seluruh tetangga 8 arah dihancurkan.
- Friendly fire diperbolehkan.
- Sel yang sudah tersplatter mati permanen.
- Pass tidak tersedia.
- Player yang masih memiliki dot setelah lawannya habis menang.
- Jika kedua warna mencapai 0 pada splatter yang sama, hasilnya draw.

## Board modes

| Mode | Grid | Dot per player | Status |
|---|---:|---:|---|
| Quick | 4×4 | 8 | MIAW variant |
| Classic | 6×6 | 18 | Reference size |
| Long | 8×8 | 32 | MIAW variant |

## Setup modes

### Quick Random

Board langsung diacak dengan jumlah dot 50:50.

### Strategic Placement

Kedua pemain bergantian menaruh dot miliknya sendiri sampai board penuh. Player Blue menaruh dot pertama. Setelah setup selesai, Player Pink memulai fase Splatter sebagai kompensasi karena menjadi placer kedua.

## Run

Tidak ada npm atau build process. Buka `index.html` langsung di browser modern.

## Architecture

```text
index.html
styles.css
app.js
core/
  platform.js
  turn-engine.js
games/
  splatter.js
docs/
  ARCHITECTURE.md
  GAME_CONTRACT.md
  AI_HANDOFF.md
```

Semua mekanik Splatter berada di `games/splatter.js`. `/core` tetap reusable.
