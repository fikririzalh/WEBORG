# Focus Bunny

Focus Bunny adalah game fokus dan reaction-time berbasis HTML, CSS, dan JavaScript murni. Game berjalan langsung di browser tanpa framework dan tanpa aset audio eksternal.

## Mode permainan

- **Classic**: klik setiap bulatan sebelum menghilang.
- **Focus**: klik hanya bulatan dengan warna yang diperintahkan dan hindari distractor.
- **Arrow Keys**: bulatan menampilkan simbol ↑ ↓ ← →. Tekan tombol panah yang sama sebelum target menghilang.
- **WASD**: bulatan menampilkan W, A, S, atau D. Tekan tombol yang sama sebelum target menghilang.

Pada mode keyboard, klik mouse pada target tidak dihitung sebagai hit. Tombol yang salah mendapat penalti `Wrong Input`, sedangkan tombol yang benar menghitung reaction time, score, dan combo.

## Fitur

- Difficulty Easy, Normal, dan Hard.
- Durasi 30, 60, atau 120 detik.
- Fullscreen gameplay.
- Light dan dark mode.
- Sound on/off memakai Web Audio API.
- Score, combo, accuracy, hit, miss, wrong input, average reaction, fastest, slowest, dan best combo.
- Rekor lokal melalui `localStorage`.
- Hard mode memakai target lebih kecil, lebih cepat, dan bergerak.
- Responsive untuk desktop dan layar kecil, tetapi mode keyboard paling optimal dimainkan di desktop/laptop.

## Menjalankan

Buka `index.html` langsung di browser atau, untuk hasil paling konsisten, jalankan folder dengan Live Server di VS Code.

> Focus Bunny adalah permainan fokus dan reaksi. Bukan alat diagnosis atau terapi ADHD.
