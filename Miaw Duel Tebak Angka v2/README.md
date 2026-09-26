# DUEL TEBAK ANGKA — v2

Duel tebak angka 2 pemain, 1 device — sekarang lebih seru dan menyenangkan 🎉

## Aturan Dasar (tetap sama)
- Tentukan rentang angka saat setup (preset Mudah 1-50 / Normal 1-100 / Sulit 1-200, atau Custom).
- Masing-masing pemain membuat 1 angka rahasia di rentang tsb (tidak boleh sama dengan lawan).
- Pemain bergantian menebak angka lawan.
- History tebakan privat per pemain, lengkap dengan estimasi kemungkinan angka lawan berdasarkan tebakan sendiri.
- Jika Player A menebak tepat lebih dulu dalam suatu round, Player B tetap mendapat attempt pada round yang sama.
- Jika keduanya berhasil pada round yang sama, hasil seri.

## 🆕 Apa yang Baru di v2

### 🔥🧊 Indikator Panas-Dingin
Setiap tebakan yang salah sekarang menampilkan seberapa dekat kamu (Panas Membara → Panas → Hangat → Dingin → Beku), lengkap dengan celetukan random bertema kucing. Petunjuk arah (lebih tinggi/rendah) tetap ada, cuma jadi lebih informatif dan seru.

### 🐾 Kartu Spesial
Tiap pemain punya 2 kartu bantuan sekali pakai **per game**:
- **🐾 Endus Paritas** — ungkap apakah angka lawan genap/ganjil.
- **🌡️ Radar Rentang** — ungkap apakah angka lawan ada di separuh atas/bawah rentang.

Info ini bersifat privat, cuma kelihatan buat pemain yang memakainya, dan tidak mengubah giliran/attempt.

### 🏆 Mode Best of 3
Selain Ronde Tunggal (seperti v1), sekarang ada mode **Best of 3**: main sampai 3 game, siapa yang menang 2 game duluan jadi juara match. Skor match ditampilkan terus di layar.

### 😼 Avatar Kucing
Pilih avatar buat masing-masing pemain saat setup, biar makin personal.

### 🎉 Confetti & Efek Suara
Confetti dan fanfare mini tiap ada yang menebak tepat, plus confetti gede + fanfare panjang pas ada juara match.

### 🏅 Badge Pencapaian
Di layar hasil akhir, bisa muncul badge kayak:
- ⚡ **Tebakan Kilat** — menang dengan ≤3 attempts.
- 🎯 **Solo Otak** — menang tanpa pakai kartu spesial.
- 🔄 **Comeback Sultan** — menang match Best of 3 setelah kalah di game pertama.
- 🤝 **Duel Sengit** — game berakhir seri.

### ⚡ Mode Kilat (opsional)
Toggle di setup buat nyalain timer 20 detik per tebakan — cuma bikin deg-degan, gak ada hukuman kalau telat.

## Fitur Lama yang Tetap Ada
- Single device privacy/pass screen
- History attempt privat per pemain + estimasi rentang tersisa
- Preset & custom range angka
- Dark/light mode
- Sound effect (bisa on/off)
- Responsive mobile
- Preferensi tersimpan di localStorage (otomatis migrasi dari save v1)

Tidak perlu server/npm. Buka index.html.
