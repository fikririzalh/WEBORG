# MIAW-CRAFT SOLO · Direct Mobile UI

Versi ini sengaja memakai satu layar langsung. Tidak ada pemilihan mode, setup screen, header besar, tombol kembali, legend profesi, panel Shift Goals, atau board screen terpisah.

Urutan layar ketika `index.html` dibuka:

```text
[ MISSION ] [ 36 WORKER ] [ SKILL EXPLAIN ]

              [ HEX BOARD ]

             [ AMBIL WORKER ]
```

## Alur

1. Buka `index.html` → langsung masuk Solo Easy dengan 36 Worker di bag.
2. Tekan `AMBIL WORKER`.
3. Kartu Skill di bagian atas langsung menjelaskan Worker yang diambil.
4. Hex legal menyala. Tap hex untuk placement.
5. Setelah placement, area tombol yang sama menawarkan penggunaan atau pelewatan skill.
6. Mission dapat dibuka dengan menekan kartu `MISSION` di kiri atas.

Board tetap 27 hex dan dihitung berdasarkan ruang nyata yang tersedia. Pada layar OPPO A12, seluruh board ditampilkan utuh tanpa transform scale. Lebar dan tinggi hasil perhitungan dikirim ke CSS melalui `--board-w` dan `--board-h` agar tidak dapat ditimpa aturan responsif lama. Area board dapat di-scroll secara internal hanya sebagai fallback ketika tinggi layar atau bilah browser terlalu sempit.

## File

- `index.html`
- `style.css`
- `script.js`
