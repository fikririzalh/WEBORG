# StudyQuest Focus Board

Prototype board-game produktivitas berbasis HTML, CSS, dan JavaScript murni. Alurnya:

1. Tulis satu tugas kecil.
2. Jalankan timer atau tekan **Selesai & +1 Roll**.
3. Dapat satu token roll.
4. Lempar dadu.
5. Karakter bergerak tile demi tile dan menerima hadiah.
6. Ulangi tanpa penalti.

## Menjalankan di VS Code

Cara praktis:

- Buka folder ini di VS Code.
- Gunakan ekstensi **Live Server**, lalu buka `index.html`.

Atau melalui terminal:

```bash
python -m http.server 8000
```

Lalu buka `http://localhost:8000`.

## File utama

```text
studyquest-focus-board/
├── index.html       # Struktur dashboard
├── styles.css       # Tampilan, map, dadu 3D, karakter CSS
├── maps.js          # Map bawaan yang dapat diedit di VS Code
├── app.js           # Dice, gerakan, timer, reward, editor, save, suara
├── maps/
│   └── example-custom-map.json
└── README.md
```

## Membuat map lewat antarmuka

- Klik **+ Map Baru**.
- Edit JSON pada Map Editor.
- Klik **Simpan Map**.
- Map custom disimpan di `localStorage` browser.
- Gunakan tombol `⇩` untuk mengekspor JSON dan `⇧` untuk mengimpor.

## Membuat map langsung di VS Code

Tambahkan object baru ke array `window.STUDYQUEST_MAPS` pada `maps.js`:

```js
{
  id: "coding-map",
  name: "Jalur Coding",
  subtitle: "Map untuk sesi coding singkat.",
  theme: {
    sky: "#e7f5ff",
    ground: "#a8df91",
    ground2: "#74c36d",
    path: "#ffe7ae",
    accent: "#2e9df4",
    accent2: "#35c7c9"
  },
  tiles: [
    { id: 1, x: 10, y: 65, type: "start", label: "START" },
    { id: 2, x: 20, y: 55, type: "plain", label: "2" },
    { id: 3, x: 30, y: 45, type: "xp", label: "3", reward: 25 },
    { id: 4, x: 43, y: 35, type: "coin", label: "4", reward: 30 },
    { id: 5, x: 57, y: 40, type: "checkpoint", label: "5" },
    { id: 6, x: 70, y: 50, type: "chest", label: "6", reward: 75 },
    { id: 7, x: 77, y: 65, type: "rest", label: "7" },
    { id: 8, x: 64, y: 76, type: "xp", label: "8", reward: 50 },
    { id: 9, x: 46, y: 78, type: "coin", label: "9", reward: 60 },
    { id: 10, x: 28, y: 72, type: "finish", label: "FINISH", reward: 150 }
  ]
}
```

Koordinat `x` dan `y` memakai persen:

- `x`: posisi horizontal, disarankan 3–97.
- `y`: posisi vertikal, disarankan 10–90.

## Tipe tile

| Tipe | Efek |
|---|---|
| `start` | Titik mulai |
| `plain` | +5 XP momentum |
| `xp` | Memberi XP sesuai `reward` |
| `coin` | Memberi koin sesuai `reward` |
| `checkpoint` | +1 token roll |
| `chest` | Koin dan XP |
| `rest` | +1 token roll |
| `finish` | Putaran selesai, hadiah besar, +1 token roll |

## Penyimpanan

Progress, map custom, XP, koin, token roll, posisi karakter, tugas, dan pengaturan disimpan melalui `localStorage` dengan key:

```text
studyQuestFocusBoardV1
```

Menghapus data situs di browser akan menghapus progres lokal. Ekspor map custom yang penting sebagai JSON.

## Suara dan animasi

Sound effect dibuat langsung dengan Web Audio API, sehingga tidak memerlukan file MP3/WAV. Tombol `◐` mengurangi gerakan, dan CSS juga menghormati preferensi sistem `prefers-reduced-motion`.

## Catatan penggunaan

Prototype ini adalah alat produktivitas pribadi, bukan alat diagnosis atau pengganti perawatan profesional. Sistem sengaja tidak memberi penalti ketika timer dihentikan atau fokus terputus.
