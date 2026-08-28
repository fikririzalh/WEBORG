# 🐱🍀 LUCKY 7 CAT

Duel push-your-luck 2–8 pemain, 1 device. Terinspirasi dari Flip 7, direskin & dimodif dengan mekanik kartu spesial yang bisa diarahkan ke diri sendiri atau lawan.

Tidak perlu server/npm untuk main. Buka `index.html` di browser.

---

## 🎮 Cara Main

### 1. Setup
- Tambah/edit/hapus nama pemain (2–8 orang) langsung di layar setup.
- Tentukan **Target Skor Menang** sendiri (custom, bebas berapa saja — makin tinggi, makin panjang gamenya).

### 2. Giliran
Device di-pass bergantian. Saat giliranmu:
```
Tableau kamu: [1] [3] [6]     Total: 10
[ 🃏 Ambil Kartu ]   [ ✋ Pass ]
```
- **Ambil** → tarik 1 kartu teratas dari deck.
- **Pass** → kunci skor rondemu sekarang, kamu keluar dari ronde ini (tidak bisa ambil kartu lagi sampai ronde berikutnya).

### 3. Kartu Angka (0–12)
- Kalau kartu yang ditarik **belum ada** di tableaumu → ditambahkan, skor naik.
- Kalau **sudah ada** (dobel) → **BUST!** Skor rondemu jadi 0 (kecuali kamu punya Nyawa Kesembilan, lihat di bawah).
- Kalau tableaumu sampai **7 kartu unik** → **LUCKY 7!** Ronde langsung selesai untuk semua orang, kamu dapat bonus **+50**.

### 4. Kartu Spesial
Ada 2 kelompok:
- **Modifier Tetap** (`+2 +4 +6 +8 +10`, `✖️2`) → otomatis buat diri sendiri, tidak perlu pilih target.
- **Modifier Bisa-Dioper** (`-10`, `+15`, `+25`) & **Kartu Aksi** (lihat tabel di bawah) → kamu pilih siapa targetnya, bisa diri sendiri atau lawan manapun.

| Kartu | Emoji | Efek |
|---|---|---|
| Cakar Minus | 🐾 −10 | Kurangi 10 poin skor ronde siapa pun yang kamu pilih |
| Ikan Emas | 🐟 +15 | Tambah 15 poin ke skor ronde siapa pun yang kamu pilih |
| Jackpot Meong | 🍀 +25 | Bonus besar, langka (cuma 1 di deck) — arahkan ke siapa saja |
| Tidur Kucing | 😴 Freeze | Target langsung Pass paksa, skornya terkunci |
| Cakar Bertubi | 🐾 Flip Three | Target wajib tarik 3 kartu berturut-turut |
| Nyawa Kesembilan | 👑 Second Chance | Disimpan; kalau kamu dapat kartu dobel nanti, buang kartu ini untuk tetap hidup |
| Kucing Hitam | 🐈‍⬛ Sabotase | Buang 1 kartu angka pilihan dari tableau target (tidak bikin bust) |
| Benang Kusut | 🧶 Swap | Tukar total skor ronde kamu dengan target |
| Curi Ikan | 🐟 Steal | Curi 1 kartu angka pilihan dari tableau target ke tableau kamu (gagal & hangus kalau bikin kamu dobel) |
| Kotak Misteri | 📦 Random | Efek acak kecil: +5 poin, buang 1 kartu acak, atau intip 3 kartu teratas deck |
| Radar Tikus | 🐭 Peek | Intip diam-diam 3 kartu teratas deck (rahasiakan dari lawan!) |

**Kartu yang ditarik saat Cakar Bertubi (Flip Three) sedang berjalan:** kalau yang ditarik adalah kartu aksi bertarget lain (Freeze/Flip Three/Kucing Hitam/Curi Ikan/Benang Kusut), efeknya **ditunda** sampai 3 tarikan paksa selesai, baru diselesaikan.

### 5. Akhir Ronde & Menang
- Ronde selesai kalau semua pemain sudah Pass/Bust/Freeze, atau ada yang LUCKY 7.
- Skor ronde ditambahkan ke skor total tiap pemain.
- Ronde baru dimulai lagi sampai ada yang mencapai **Target Skor**. Yang totalnya tertinggi saat itu adalah juara.

---

## 🛠️ Cara Membuat Special Card Baru

Semua logika kartu ada di **`app.js`**, ditandai dengan 3 komentar `EXTENSION POINT` supaya gampang ditemukan. Ikuti 3 langkah ini:

### Langkah 1 — Daftarkan nama, emoji, dan deskripsi kartu
Cari **`EXTENSION POINT 1 — CARD_INFO`**, lalu tambahkan entri baru di objek `ACTION_INFO`:
```js
const ACTION_INFO={
  // ...kartu yang sudah ada...
  hairballBomb:{emoji:'🤮',label:'BOM BULU',desc:'Semua pemain aktif kehilangan 1 kartu angka acak dari tableaunya.'}
};
```
`label` dan `desc` ini yang akan muncul di layar (banner efek, target picker, dsb) — jadi tulis yang jelas.

### Langkah 2 — Tambahkan ke deck
Cari **`EXTENSION POINT 2 — buildDeck()`**, lalu tambahkan kartu barumu ke array `actions` beserta jumlah kopinya:
```js
const actions=[
  ['freeze',3],['flipThree',3],['secondChance',3],
  ['kucingHitam',2],['benangKusut',2],['curiIkan',2],
  ['kotakMisteri',2],['radarTikus',2],
  ['hairballBomb',1]   // <-- kartu baru, 1 kopi di deck
];
```
> Kalau kartu barumu berjenis **Modifier Bisa-Dioper** (seperti −10/+15/+25, bukan kartu aksi), cukup tambahkan di array `[-10,-10,15,15,25]` sebelumnya — nilai positif = bonus, negatif = pengurangan, semuanya otomatis dapat layar pilih-target tanpa kode tambahan (lihat Langkah 3, kasus `modGift` sudah generic).

### Langkah 3 — Tulis efeknya
Cari **`EXTENSION POINT 3 — resolveCard()`**, di dalam `switch(card.type)`, tambahkan `case` baru:
```js
case 'hairballBomb': {
  game.players.forEach(p=>{
    if(p.status!=='busted' && p.tableau.length){
      const ri=Math.floor(Math.random()*p.tableau.length);
      p.tableau.splice(ri,1);
    }
  });
  pushLog(`🤮 BOM BULU! Semua pemain kehilangan 1 kartu acak.`);
  beep(320,.12);
  if(fromNestedQueue){processNestedQueue()}else{postResolve(drawerIdx)}
  return;
}
```
**Pola pentingnya:**
- Kalau kartu barumu **tidak butuh pilih target** (efeknya otomatis/acak/ke semua orang, seperti contoh di atas) → langsung eksekusi efeknya, lalu **wajib** tutup dengan:
  ```js
  if(fromNestedQueue){processNestedQueue()}else{postResolve(drawerIdx)}
  return;
  ```
  Ini yang melanjutkan giliran (baik giliran normal, maupun lanjutan Cakar Bertubi).
- Kalau kartu barumu **butuh pilih target** (seperti Freeze/Kucing Hitam) → panggil:
  ```js
  const targets = /* array index pemain yang valid jadi target */;
  openTargetPicker(card, drawerIdx, targets, drawerIdx, fromNestedQueue);
  return;
  ```
  Lalu tangani hasil pilihannya di fungsi `chooseTarget()` (tambahkan cabang `if(card.type==='hairballBomb'){...}` di sana), atau kalau efeknya sederhana (cuma +/- poin ke 1 target), bisa numpang ke pola `applyTargetedAction()` yang sudah ada.
- Kalau kartu barumu masuk kategori "harus ditunda kalau ditarik di tengah Cakar Bertubi" (seperti Freeze/Kucing Hitam/dst), tambahkan nama tipe kartunya ke array `queueableDuringFlipThree` di awal blok `if(card.kind==='action')`.

### Tips
- **Selalu** panggil `game.discard.push(card)` tepat satu kali per kartu (sudah otomatis untuk semua jenis kartu di kode yang ada — jangan duplikat manual, terutama untuk kartu yang lewat `nestedQueue`, supaya jumlah kartu di deck+discard tetap konsisten 109 total).
- Gunakan `pushLog('pesan...')` supaya event kartu barumu muncul di log ronde (max 6 log terakhir yang ditampilkan).
- Gunakan `beep(frekuensi, durasi)` untuk efek suara singkat sesuai mood kartunya (nada tinggi = bagus, nada rendah = buruk).
- Setelah menambah kartu, jalankan test dari dalam folder `dev/` (butuh Node.js, tanpa dependency tambahan):
  ```
  cd dev
  node test_headless.js   # 22 skenario dasar (bust, freeze, steal, swap, lucky7, dst)
  node fuzz_sim.js        # ratusan game acak penuh, cek deck+discard selalu 109
  ```
  Kalau kartu barumu bikin salah satu gagal, biasanya artinya ada state yang lupa di-reset atau kartu yang ke-discard dua kali/tidak ke-discard sama sekali.

---

## 📦 Komposisi Deck (default)
| Jenis | Jumlah |
|---|---|
| Angka 0 | 1 |
| Angka 1 | 1 |
| Angka 2 | 2 |
| ... | (jumlah = nilai angkanya) |
| Angka 12 | 12 |
| Modifier Tetap (+2,+4,+6,+8,+10,✖️2) | 6 |
| Modifier Bisa-Dioper (−10×2, +15×2, +25×1) | 5 |
| Kartu Aksi (8 jenis) | 19 |
| **Total** | **109** |

## ✨ Fitur
- 2–8 pemain, CRUD nama di setup
- Target skor menang custom
- Single-device privacy/pass screen
- 8 jenis kartu aksi + 3 modifier-bisa-dioper + 6 modifier tetap
- Nested action handling saat Cakar Bertubi (Flip Three)
- Dark/light mode
- Sound effect (bisa on/off)
- Responsive mobile
- Nama pemain & preferensi tersimpan di localStorage
