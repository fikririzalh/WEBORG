# Secret Wolf

Single-device companion web game bertema peternakan untuk permainan social deduction. Dibuat dengan HTML, CSS, dan JavaScript murni. Tidak membutuhkan backend atau dependency eksternal.

## Menjalankan

Pilihan paling sederhana: buka `index.html` langsung di browser modern.

Untuk local server:

```bash
python -m http.server 8080
```

Lalu buka `http://localhost:8080`.

## Fitur MVP

- CRUD pemain 5–10 orang.
- Validasi distribusi role standar.
- Role privat pass-and-play.
- The Lamb, The Wolf, The Alpha Wolf.
- 6 Flock Decrees + 11 Pack Decrees.
- Pemilihan Flock Leader/Deputy dan pencatatan vote hasil real-life.
- Legislative session: 3 kartu → buang 1 → pass device → 2 kartu → buang 1.
- Election tracker dan automatic top-deck pada kegagalan ketiga.
- Executive-power track berbeda untuk 5–6, 7–8, dan 9–10 pemain.
- Investigation, Policy Peek, Special Election, Banish/Execution.
- Veto setelah lima Pack Decrees.
- Win condition policy track, Alpha Wolf menjadi Deputy setelah tiga Pack Decrees, dan Alpha Wolf dibanish.
- Light/dark mode.
- Procedural backsound dan SFX menggunakan Web Audio API, tanpa file audio eksternal.
- Penyimpanan state dengan `localStorage` untuk resume.

## Catatan lisensi

Secret Wolf adalah adaptasi nonkomersial tidak resmi dari Secret Hitler karya Mike Boxleiter, Tommy Maranges, dan Mac Schubert. Secret Hitler dilisensikan di bawah Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0). Karena proyek ini membangun di atas mekanik tersebut, proyek ini juga harus digunakan/distribusikan sesuai lisensi yang sama.

Sumber resmi:
- https://www.secrethitler.com/
- https://creativecommons.org/licenses/by-nc-sa/4.0/

Artwork, istilah, tema peternakan, layout, dan UI Secret Wolf dibuat ulang dan tidak menyalin artwork asli Secret Hitler.
