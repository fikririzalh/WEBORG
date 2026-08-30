# CAT GO TO WORK: MIAW-CRAFT
## REMI EDITION — Worker Deck Rulebook v0.1

### 1. Tujuan modul

MIAW-CRAFT REMI Edition adalah prototipe fisik untuk menguji sistem Worker menggunakan kartu remi standar. Modul ini memindahkan identitas profesi, random draw, stacking, adjacency, dan kemampuan Worker ke kartu fisik.

Versi 0.1 **belum memuat Job Order dan scoring final**. Karena Job Order bergantung pada pola spasial dan informasi tersembunyi, modul tersebut direncanakan sebagai web companion terpisah. Dengan demikian, v0.1 digunakan terutama untuk playtest tempo, interaksi skill, kemudahan membaca board, dan keseimbangan Worker.

---

## 2. Komponen

Gunakan:

- 1 deck remi standar 52 kartu.
- 30 kartu sebagai Worker MIAW-CRAFT.
- 19 lokasi hex sebagai papan.
- 6 kartu Starting Worker.
- 24 kartu Worker Deck setelah setup.
- Sticky note/sleeve untuk memberi ikon profesi pada Dual Worker.

Sebanyak 22 kartu lain tidak dipakai pada Worker Deck v0.1.

---

## 3. Pemetaan kartu ke profesi

| Rank | Profesi | Ikon | Skill | Jumlah reguler |
|---|---|---|---|---:|
| Ace | Baker Cat | 🥐 | Bonus Shift | 4 |
| 2 | Recruiter Cat | 🧶 | Talent Search | 4 |
| 3 | Courier Cat | 📦 | Express Move | 4 |
| 4 | Mechanic Cat | 🔧 | Fine Tune | 4 |
| 5 | Barista Cat | ☕ | Table Swap | 4 |
| 6 | Manager Cat | 📣 | Team Lead | 4 |

Suit ♠ ♥ ♦ ♣ **tidak mengubah skill**. Suit hanya membedakan empat salinan dari profesi yang sama.

Contoh: 3♠, 3♥, 3♦, dan 3♣ semuanya adalah Courier Cat.

---

## 4. Dual Worker

Enam kartu berikut menjadi Dual Worker. Beri tanda dengan sticky note atau sleeve supaya dua profesinya mudah terlihat.

| Kartu | Profesi A | Profesi B | Aturan |
|---|---|---|---|
| 7♠ | 🥐 Baker | 🧶 Recruiter | Pilih salah satu profesi |
| 7♥ | 📦 Courier | 🔧 Mechanic | Pilih salah satu profesi |
| 7♦ | ☕ Barista | 📣 Manager | Pilih salah satu profesi |
| 7♣ | 🥐 Baker | 🔧 Mechanic | Pilih salah satu profesi |
| 8♠ | 🧶 Recruiter | ☕ Barista | Pilih salah satu profesi |
| 8♥ | 📦 Courier | 📣 Manager | Pilih salah satu profesi |

Dual Worker mempunyai dua identitas profesi, tetapi ketika skill diaktifkan pemain hanya boleh memilih **satu** dari kedua skill tersebut. Dual Worker tidak pernah menjalankan dua skill sekaligus.

Untuk Job Order di versi mendatang, Dual Worker dapat dihitung sebagai salah satu dari dua profesinya pada saat pola diperiksa, kecuali aturan Job Order tertentu menyatakan sebaliknya.

---

## 5. Daftar 30 kartu Worker

Worker reguler:

- A♠ A♥ A♦ A♣ = Baker.
- 2♠ 2♥ 2♦ 2♣ = Recruiter.
- 3♠ 3♥ 3♦ 3♣ = Courier.
- 4♠ 4♥ 4♦ 4♣ = Mechanic.
- 5♠ 5♥ 5♦ 5♣ = Barista.
- 6♠ 6♥ 6♦ 6♣ = Manager.

Dual Worker:

- 7♠, 7♥, 7♦, 7♣, 8♠, 8♥.

Total = 24 Worker reguler + 6 Dual Worker = **30 Worker**.

---

## 6. Starting Workers

Sebelum mengocok Worker Deck, keluarkan enam kartu berikut:

- A♠ = Baker.
- 2♠ = Recruiter.
- 3♠ = Courier.
- 4♠ = Mechanic.
- 5♠ = Barista.
- 6♠ = Manager.

Acak keenamnya, kemudian tempatkan masing-masing satu kartu pada enam hex yang mengelilingi hex pusat.

Setelah itu, 24 kartu Worker yang tersisa dikocok dan diletakkan tertutup sebagai **Worker Deck**.

Hex tengah dimulai kosong.

---

## 7. Anatomi papan

Papan menggunakan 19 lokasi hex dengan radius dua.

Satu lokasi dapat berisi:

- 0 Worker;
- 1 Worker;
- 2 Worker dalam satu stack;
- maksimum 3 Worker dalam satu stack.

Jika kartu ditumpuk, letakkan kartu sedikit bergeser agar jumlah kartu masih dapat dilihat.

### Top Worker

Hanya kartu yang berada paling atas pada sebuah stack yang disebut **Top Worker**.

Skill yang memindahkan, menukar, atau mengaktifkan Worker hanya menarget Top Worker, kecuali aturan tertentu secara eksplisit mengatakan lain.

Worker yang tertutup tetap berada pada board tetapi tidak dapat ditarget secara langsung.

---

## 8. Adjacent

Dua lokasi disebut **adjacent** bila kedua hex berbagi satu sisi.

Sudut yang hanya bersentuhan tidak dianggap adjacent.

Jika sebuah skill meminta "adjacent Worker", yang dimaksud adalah Top Worker pada hex adjacent.

---

# 9. Struktur giliran

Setiap giliran mengikuti urutan:

**DRAW → PLACE → WORK SKILL → CHECK ORDER → END SHIFT**

Pada v0.1, CHECK ORDER dilewati karena Job Order belum diimplementasikan.

### 9.1 DRAW

Ambil satu kartu paling atas dari Worker Deck.

### 9.2 PLACE

Tempatkan Worker yang baru diambil pada:

- hex kosong; atau
- di atas stack yang masih berisi kurang dari 3 Worker.

Tidak boleh membuat stack berisi lebih dari tiga kartu.

### 9.3 WORK SKILL

Setelah kartu ditempatkan, pemain boleh menggunakan skill Worker tersebut.

Menggunakan skill bersifat opsional kecuali sebuah mode permainan di masa mendatang menyatakan lain.

### 9.4 CHECK ORDER

Belum digunakan pada Remi Edition v0.1.

### 9.5 END SHIFT

Setelah semua efek selesai, giliran berpindah ke pemain berikutnya.

---

# 10. Skill Book

## 🥐 Baker Cat — BONUS SHIFT

**Efek:** ambil satu Worker tambahan dari Worker Deck dan langsung tempatkan pada hex legal.

**Batasan:** Worker bonus tidak mengaktifkan skill-nya pada v0.1. Tujuannya mencegah rantai skill yang terlalu panjang selama playtest awal.

**Contoh:** pemain memainkan A♥, mengaktifkan Bonus Shift, lalu menarik 4♣. 4♣ ditempatkan pada board, tetapi Fine Tune milik Mechanic tidak diaktifkan.

---

## 🧶 Recruiter Cat — TALENT SEARCH

**Efek:** lihat hingga tiga kartu teratas Worker Deck. Pilih satu untuk ditempatkan. Kartu yang tidak dipilih dikembalikan ke bawah Worker Deck dalam urutan bebas.

**Batasan:** Worker yang dipilih melalui Talent Search tidak mengaktifkan skill-nya pada v0.1.

Jika Worker Deck tersisa kurang dari tiga kartu, lihat semua kartu yang masih tersedia.

---

## 📦 Courier Cat — EXPRESS MOVE

**Efek:** pilih satu Top Worker pada hex yang adjacent dengan Courier. Pindahkan Worker tersebut ke lokasi legal mana pun pada board.

**Lokasi legal:** hex kosong atau stack dengan kurang dari tiga Worker.

Courier tidak boleh mengambil Worker yang tertutup di dalam stack.

---

## 🔧 Mechanic Cat — FINE TUNE

**Efek:** pilih hingga dua Top Worker yang masing-masing berada pada hex adjacent dengan Mechanic. Setiap Worker terpilih boleh dipindahkan tepat satu hex ke lokasi adjacent yang legal.

Kedua target boleh dipindahkan dalam urutan yang dipilih pemain.

Target kedua dievaluasi setelah perpindahan target pertama selesai.

---

## ☕ Barista Cat — TABLE SWAP

**Efek:** pilih dua Top Worker pada dua hex berbeda. Tukar posisi kedua kartu tersebut.

Hanya kartu paling atas yang ditukar. Kartu lain di bawahnya tetap berada di tempat.

Table Swap tidak boleh menghasilkan stack lebih dari tiga Worker.

---

## 📣 Manager Cat — TEAM LEAD

**Efek:** pilih satu Top Worker yang adjacent dengan Manager. Gunakan skill milik Worker tersebut seolah-olah baru diaktifkan.

Jika target merupakan Dual Worker, pilih salah satu dari dua skill-nya.

### Anti-loop rule

Manager tidak boleh membuat rantai Team Lead tanpa batas. Pada v0.1, satu Team Lead tidak boleh menarget Manager lain untuk mengaktifkan Team Lead kedua.

Aturan ini dapat direvisi setelah playtest.

---

## 🎭 Dual Worker — MULTI-TALENT

Dual Worker memperlihatkan dua profesi.

Ketika Dual Worker dimainkan dan skill digunakan:

1. umumkan profesi yang dipilih;
2. jalankan hanya skill profesi tersebut;
3. abaikan skill profesi kedua untuk aktivasi itu.

Tidak boleh menggabungkan dua efek dalam satu aktivasi.

---

# 11. Aturan perpindahan umum

Setiap perpindahan harus mematuhi:

1. hanya Top Worker yang dapat dipindahkan;
2. tujuan tidak boleh menyebabkan stack melebihi 3;
3. kartu yang tertutup tidak ikut bergerak bersama Top Worker;
4. jika Top Worker dipindahkan, Worker tepat di bawahnya menjadi Top Worker baru;
5. bila sebuah skill tidak mempunyai target legal, skill tersebut tidak menghasilkan efek.

---

# 12. Mode playtest tanpa Job Order

Karena Job Order belum tersedia, gunakan **Skill Test Mode** untuk mengevaluasi mekanik.

### Durasi

Mainkan sampai Worker Deck habis. Dengan 24 kartu di deck setelah setup, permainan memiliki sekitar 24 draw utama, sebelum tambahan draw dari skill.

### Fokus evaluasi

Setelah permainan, kedua pemain mencatat:

- skill mana yang paling sering dipilih;
- skill mana yang terasa terlalu kuat;
- apakah board terlalu cepat penuh;
- apakah stack 3 menghasilkan keputusan menarik;
- apakah Dual Worker terlalu fleksibel;
- apakah Manager menciptakan kombinasi yang berlebihan;
- rata-rata panjang satu giliran;
- apakah pemain memahami profesi hanya dari rank kartu.

### Pemenang

Skill Test Mode **tidak menetapkan pemenang resmi**. Tujuannya adalah balancing. Sistem kemenangan akan datang dari Job Order + Reputation pada versi hybrid berikutnya.

---

# 13. Modul yang direncanakan

## MIAW-CRAFT Job Board Web Companion

Modul selanjutnya dirancang untuk menangani:

- dua Secret Job Order per pemain;
- hold-to-reveal hot-seat privacy;
- pattern LINE dan TRIANGLE;
- validasi profesi;
- Dual Worker wildcard terbatas;
- Reputation score;
- coin action untuk mengganti Job Order;
- refill Job Order;
- end-game scoring.

Worker tetap berupa remi fisik di meja. Web hanya mengelola informasi yang sulit atau tidak nyaman dikelola dengan kartu remi biasa.

---

# 14. Ringkasan meja

| Rank | Worker | Skill singkat |
|---|---|---|
| A | 🥐 Baker | Ambil + tempatkan 1 Worker tambahan |
| 2 | 🧶 Recruiter | Lihat 3, pilih 1 untuk ditempatkan |
| 3 | 📦 Courier | Pindahkan 1 Top Worker adjacent ke mana saja |
| 4 | 🔧 Mechanic | Geser hingga 2 Top Worker adjacent masing-masing 1 hex |
| 5 | ☕ Barista | Tukar 2 Top Worker |
| 6 | 📣 Manager | Aktifkan 1 Top Worker adjacent |
| 7/8 tertentu | 🎭 Dual | Pilih 1 dari 2 profesi/skill |

**Stack maksimum: 3.**  
**Target skill: Top Worker.**  
**Adjacent: hex berbagi sisi.**  
**Skill setelah PLACE bersifat opsional.**

---

# 15. Catatan desain

MIAW-CRAFT menggunakan ide umum abstract pattern-building, token stacking, dan asymmetric unit abilities sebagai referensi mekanik. Nama, profesi, ikon, aturan prototipe remi, struktur Dual Worker, dan identitas tematik pada dokumen ini disusun untuk MIAW-CRAFT.

Versi: **REMI Worker Deck v0.1**  
Status: **Prototype / playtest specification**
