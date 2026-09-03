# WASITRA CARD

Permainan kartu budaya Indonesia yang terinspirasi mekanisme kartu baca (*yomifuda*) dan kartu cari (*torifuda*) pada Karuta Jepang. Aplikasi dibuat dengan HTML, CSS, dan Vanilla JavaScript tanpa framework maupun backend.

## Menjalankan aplikasi

1. Ekstrak seluruh isi ZIP ke satu folder.
2. Buka `index.html` melalui Chrome, Edge, Firefox, atau Safari modern.
3. Pilih set, peran, mode, dan jumlah kartu.
4. Permainan dapat berjalan tanpa koneksi internet.

Fitur pembacaan otomatis memakai `SpeechSynthesis` bawaan browser. Ketersediaan suara bahasa Indonesia bergantung pada browser dan sistem operasi perangkat.

## Isi proyek

- `index.html` — struktur antarmuka dan dialog.
- `style.css` — tema light/dark, pola visual, animasi, dan responsivitas.
- `script.js` — alur permainan, pengacakan, skor, suara, serta `localStorage`.
- `data.js` — lima set lokal, masing-masing 100 kartu (total 500 kartu).

Pada Role A, nomor dan bacaan tampil pada sisi depan kartu sekaligus pada panel
“Teks yang Dibacakan”. Panel kedua disediakan agar teks tetap mudah dibaca pada
layar kecil dan pada browser dengan dukungan animasi 3D yang berbeda.

Khusus mode Cerita, Role A menampilkan teks cerita sebagai pengganti peribahasa.
Role B juga menampilkan teks cerita dan menyusun setiap kartu dalam satu baris
agar kisah lebih mudah dibaca. Tampilan mode Latihan dan Turnamen tetap memakai
teks kartu asli.

## Catatan materi budaya

Set peribahasa daerah dan filosofi menyertakan adaptasi edukatif berbahasa Indonesia. Materi tersebut dirancang untuk permainan dan diskusi umum, bukan sebagai dokumentasi adat verbatim. Verifikasi bersama sumber budaya setempat dianjurkan sebelum digunakan sebagai materi ajar formal.

Pantun dan kata bijak berlabel “karya editorial” merupakan teks orisinal yang disusun untuk proyek ini.

## Pengembangan data

Setiap kartu pada `data.js` menghasilkan struktur berikut:

```js
{
  id: "P01-001",
  nomor: 1,
  teks: "Air beriak tanda tak dalam",
  arti: "Orang yang banyak bicara sering kali kurang pengetahuan.",
  kategori: "Sikap",
  asalBudaya: "Indonesia",
  cerita: "Suatu sore di kampung, Rani akhirnya menyadari bahwa orang yang banyak bicara sering kali kurang pengetahuan."
}
```

Set baru dapat ditambahkan ke `window.WASITRA_SETS`. Jangan mengubah nama properti kartu agar tetap kompatibel dengan `script.js`.

## Rujukan konsep

- UNESCO, Indonesian Batik: https://ich.unesco.org/en/RL/indonesian-batik-00170
- UNESCO, Pantun: https://ich.unesco.org/en/RL/pantun-02274
- Garuda Kemdikbud, karakter masyarakat dalam peribahasa: https://download.garuda.kemdikbud.go.id/article.php?article=860370&title=Karakter+Masyarakat+Indonesia+Berdasarkan+Peribahasa&val=9449
- Lafayette College, Playing Karuta: https://exhibits.lafayette.edu/s/karuta/page/playkaruta
