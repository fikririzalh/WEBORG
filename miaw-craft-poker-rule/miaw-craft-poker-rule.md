# MIAW-CRAFT POKER RULE

**Prototype Design v0.1**
**Format:** Physical Poker Deck + Hex Board
**Status:** Core Ability Kit, belum final balancing

---

## 1. Konsep Inti

MIAW-CRAFT Poker adalah eksperimen gameplay menggunakan kartu remi/poker sebagai unit yang ditempatkan pada papan hex. Agar permainan tidak berhenti pada aktivitas "ambil kartu lalu taruh kartu", setiap **rank** memiliki satu ability tetap.
Sistem ini sengaja menggunakan **rank = ability** dan **suit bukan ability**. Dengan demikian, 4 kartu dengan rank yang sama menggunakan aturan yang sama. Pemain tidak perlu menghafal 52 ability berbeda.
Struktur dasarnya:

- **A = Ability 0 / Neutral Card**
- **2–10 = Core Ability**
- **J, Q, K = Power Ability**
- **Joker = Chaos / Wild Ability**
- ♠ ♥ ♦ ♣ untuk saat ini hanya identitas suit. Suit dapat dipakai nanti untuk Job, Pattern, scoring, atau faction rule.

Deck poker standar memiliki 52 kartu dalam empat suit dan 13 rank. Banyak set permainan juga menyertakan satu atau dua Joker; kit ini dirancang agar dapat memakai **2 Joker** bila deck Anda memilikinya.

---

## 2. Filosofi Ability

Tujuan desain ability bukan membuat setiap kartu "lebih kuat" dari kartu sebelumnya. Tujuannya adalah membuat setiap rank menghasilkan keputusan berbeda.
Ability dibagi menjadi empat tingkat kompleksitas:

| TingkatRankFokus |       |                                                     |
| ---------------- | ----- | --------------------------------------------------- |
| 0                | A     | Tidak ada ability. Kartu paling mudah untuk pemula. |
| Basic            | 2–4   | Manipulasi satu kartu dan area dekat.               |
| Tactical         | 5–7   | Push, pull, stack, dan perubahan posisi.            |
| Advanced         | 8–10  | Manipulasi beberapa kartu atau tempo.               |
| Power            | J–K   | Ability fleksibel dan kontrol board.                |
| Chaos            | Joker | Ability liar yang dapat mengubah situasi besar.     |

Prinsip penting: **angka yang lebih tinggi tidak otomatis berarti lebih kuat**. Kartu 3 dapat lebih berguna daripada K jika posisi board mendukungnya.

---

# 3. Ability List A–K + Joker

| RankNama AbilityLevelEfek Gameplay |                          |          |                                                                                                                                                                                                   |
| ---------------------------------- | ------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A**                              | **ZERO / Regular Shift** | 0        | Tidak memiliki active ability. Tempatkan kartu secara normal lalu lanjutkan turn.                                                                                                                 |
| **2**                              | **NUDGE**                | Basic    | Pilih 1 kartu yang adjacent dengan kartu 2. Geser kartu tersebut ke 1 hex kosong yang adjacent dengan posisi asalnya.                                                                             |
| **3**                              | **SCOUT**                | Basic    | Lihat 3 kartu teratas Draw Deck. Pilih 1 sebagai kartu berikutnya yang akan dimainkan. Dua kartu lainnya dikembalikan ke bawah deck dalam urutan bebas.                                           |
| **4**                              | **LOCAL SWAP**           | Basic    | Tukar posisi 2 kartu yang sama-sama adjacent dengan kartu 4. Hanya top card jika menggunakan stack.                                                                                               |
| **5**                              | **PUSH**                 | Tactical | Pilih satu garis kartu yang dimulai dari hex adjacent. Dorong seluruh garis 1 hex menjauh dari kartu 5 jika hex terakhir kosong dan seluruh perpindahan legal. Maksimum 3 kartu terdorong.        |
| **6**                              | **PULL**                 | Tactical | Pilih 1 kartu berjarak maksimum 2 hex dari kartu 6. Tarik kartu tersebut ke 1 hex kosong yang adjacent dengan kartu 6.                                                                            |
| **7**                              | **STACK SHIFT**          | Tactical | Pilih 1 kartu adjacent. Pindahkan top card tersebut ke atas kartu 7 atau ke atas 1 kartu adjacent lain. Batas stack tetap berlaku.                                                                |
| **8**                              | **ROTATE**               | Advanced | Pilih 3 kartu yang berada pada tiga hex adjacent mengelilingi kartu 8. Putar posisi ketiganya satu langkah searah atau berlawanan arah jarum jam.                                                 |
| **9**                              | **COPYCAT**              | Advanced | Salin ability dari 1 kartu adjacent dengan rank 2–8 dan jalankan ability tersebut seolah-olah kartu 9 memiliki rank itu. Tidak dapat menyalin 9, 10, J, Q, K, atau Joker.                         |
| **10**                             | **OVERTIME**             | Advanced | Setelah menyelesaikan placement kartu 10, ambil 1 kartu tambahan dan tempatkan segera. Kartu bonus **tidak mengaktifkan ability**. Setelah itu turn berakhir normal.                              |
| **J**                              | **JACK OF ALL TRADES**   | Power    | Pilih salah satu ability rank **2, 3, atau 4** dan jalankan efeknya.                                                                                                                              |
| **Q**                              | **QUEEN'S COMMAND**      | Power    | Pilih hingga 2 top card yang adjacent dengan Q. Masing-masing boleh dipindahkan 1 hex ke posisi legal. Kedua perpindahan diselesaikan satu per satu.                                              |
| **K**                              | **KING'S ORDER**         | Power    | Pilih 1 kartu adjacent. Kartu tersebut menjadi **LOCKED** sampai awal turn Anda berikutnya. Locked card tidak boleh dipindahkan, ditukar, didorong, ditarik, atau dijadikan target ability lawan. |
| **JOKER**                          | **CHAOS SHIFT**          | Chaos    | Pilih **satu ability rank 2–K yang saat ini terlihat sebagai top card di board**, lalu salin ability itu. Joker tidak boleh menyalin Joker lain.                                                  |

---

# 4. Penjelasan Ability Detail

## A — ZERO / Regular Shift

A adalah kartu paling sederhana dalam sistem.
**Efek:** tidak ada.
A sengaja dipertahankan tanpa ability agar pemain pemula memiliki kartu yang tidak menambah beban keputusan. A tetap penting untuk positioning, blocking, Job, Pattern, suit, atau scoring yang akan dikembangkan kemudian.

---

## 2 — NUDGE

**Efek:** gerakkan satu kartu adjacent sebanyak satu hex.
Contoh:

```
    [3]
 [A][2][ ]

2 menggunakan NUDGE pada A

    [3]
 [ ][2][A]
```

Target harus memiliki destination legal.

---

## 3 — SCOUT

**Efek:** lihat 3 kartu teratas deck, pilih 1.
Urutan:

1. Ambil tiga kartu teratas secara tertutup dari deck.
2. Pemain melihat ketiganya.
3. Pilih satu sebagai kartu berikutnya yang akan dimainkan.
4. Dua sisanya masuk ke bawah Draw Deck.

SCOUT mengurangi randomness tanpa menghasilkan extra placement.

---

## 4 — LOCAL SWAP

**Efek:** tukar dua kartu yang berada di sekitar kartu 4.
Tidak boleh memilih kartu 4 sendiri sebagai salah satu target.
Jika menggunakan stack, hanya **top card** yang berpindah.

---

## 5 — PUSH

PUSH adalah ability manipulasi garis.
Contoh:

```
[5] [A] [7] [ ]
```

5 dapat mendorong:

```
[5] [ ] [A] [7]
```

Syarat:

- target membentuk garis lurus dari kartu 5;
- maksimum 3 kartu;
- hex terakhir harus memiliki ruang;
- tidak boleh mendorong Locked card;
- tidak boleh membuat stack melewati batas.

---

## 6 — PULL

PULL melakukan kebalikan PUSH tetapi hanya pada satu kartu.
Target boleh berada hingga radius 2 dari kartu 6. Destination harus adjacent dengan kartu 6 dan legal.

---

## 7 — STACK SHIFT

Ability ini mulai memperkenalkan vertical play.
Pilih top card dari satu lokasi adjacent kemudian pindahkan ke:

- atas kartu 7; atau
- atas kartu lain yang adjacent dengan kartu 7.

Jika prototype tidak memakai stacking, ability 7 sementara dapat menggunakan fallback rule:

> Pindahkan satu kartu adjacent ke satu hex kosong lain yang adjacent dengan 7.

---

## 8 — ROTATE

ROTATE memanipulasi tiga kartu sekaligus tetapi hanya pada area lokal.
Pilih tiga kartu yang mengelilingi kartu 8. Pemain memilih arah:

- clockwise; atau
- counter-clockwise.

Semua posisi harus legal sebelum rotasi dilakukan.

---

## 9 — COPYCAT

9 dapat meniru ability sederhana dari kartu tetangganya.
Target copy yang sah:

- 2
- 3
- 4
- 5
- 6
- 7
- 8

9 **tidak boleh** menyalin:

- 9
- 10
- J
- Q
- K
- Joker

Pembatasan ini mencegah chain dan recursion yang terlalu sulit untuk pemula.

---

## 10 — OVERTIME

Setelah memainkan kartu 10:

1. selesaikan placement;
2. aktifkan OVERTIME;
3. ambil satu kartu dari Draw Deck;
4. tempatkan kartu bonus;
5. abaikan ability kartu bonus;
6. lanjut ke fase akhir turn.

Ini adalah mekanik extra-placement tetapi **tidak menghasilkan chain ability**.

---

## J — JACK OF ALL TRADES

J adalah kartu fleksibel untuk pemula dan intermediate.
Saat dimainkan, pilih salah satu:

- 2 — NUDGE
- 3 — SCOUT
- 4 — LOCAL SWAP

J tidak menyalin ability Tactical atau Power agar tidak terlalu dominan.

---

## Q — QUEEN'S COMMAND

Q dapat menggerakkan hingga dua kartu adjacent.
Urutan:

1. pilih kartu pertama;
2. pindahkan satu hex;
3. perbarui kondisi board;
4. pilih kartu kedua;
5. pindahkan satu hex.

Pemain boleh hanya memindahkan satu kartu.
Q tidak boleh menggerakkan Locked card.

---

## K — KING'S ORDER

K memberikan temporary board control.
Gunakan token kecil, coin, marker, atau benda lain untuk menandai kartu yang LOCKED.
Locked card:

- tetap dihitung untuk Pattern/Job;
- tetap berada pada board;
- tidak boleh menjadi target movement ability;
- tidak boleh ditukar;
- tidak boleh didorong atau ditarik;
- tidak boleh dipindahkan melalui ROTATE.

Lock berakhir **pada awal turn berikutnya dari pemain yang memainkan K**.
Satu pemain hanya boleh memiliki **1 LOCK aktif**. Menggunakan K baru memindahkan lock lama ke target baru.

---

## JOKER — CHAOS SHIFT

Joker tidak memiliki daftar ability sendiri yang permanen.
Saat Joker dimainkan:

1. lihat seluruh top card yang sedang terlihat di board;
2. pilih satu rank dari 2–K;
3. salin ability rank tersebut;
4. jalankan ability satu kali.

Joker tidak dapat menyalin Joker lain.
Jika tidak ada target ability yang legal, Joker tetap boleh ditempatkan tanpa ability.

### Dua Joker

Jika deck memiliki dua Joker, keduanya menggunakan aturan yang sama pada prototype v0.1.
Untuk versi lanjutan dapat dipisahkan menjadi:

- Red Joker = Copy
- Black Joker = Disrupt

Namun **belum digunakan pada v0.1**.

---

# 5. Core Turn Prototype

Gameplay paling sederhana menggunakan urutan:

```
DRAW
  ↓
PLACE
  ↓
ABILITY (optional)
  ↓
CHECK BOARD / JOB
  ↓
END TURN
```

### 1. DRAW

Ambil satu kartu dari Draw Deck.

### 2. PLACE

Tempatkan kartu pada satu hex legal.

### 3. ABILITY

Pemain boleh menggunakan ability kartu yang baru ditempatkan.
Ability bersifat **optional** kecuali sebuah variant secara eksplisit menyatakan sebaliknya.

### 4. CHECK BOARD / JOB

Periksa objective fisik atau Job yang digunakan dalam mode permainan tersebut.

### 5. END TURN

Lanjut ke pemain berikutnya.

---

# 6. Aturan Fundamental Board

## Adjacency

Dua kartu dianggap **adjacent** jika berada pada dua hex yang berbagi satu sisi.
Pada hex grid, satu hex normal memiliki maksimum enam tetangga.

## Top Card Rule

Jika stacking digunakan, hanya kartu paling atas yang dianggap **active/top card** untuk:

- ability target;
- rank yang terlihat;
- suit yang terlihat;
- Joker copy;
- movement.

Kartu di bawah stack tidak dapat menggunakan ability dan tidak dapat menjadi target langsung.

## Stack Limit

Prototype awal menggunakan:

> **maksimum 3 kartu per hex.**

Jika playtest menunjukkan board terlalu sulit dibaca, mode pemula dapat menggunakan **No Stack Mode**.

---

# 7. Beginner Mode

Untuk pemain baru, jangan langsung gunakan semua rank.
Gunakan deck terbatas:

```
A, 2, 3, 4, 5, 6
```

Ability aktif:

| RankAbility |            |
| ----------- | ---------- |
| A           | Zero       |
| 2           | Nudge      |
| 3           | Scout      |
| 4           | Local Swap |
| 5           | Push       |
| 6           | Pull       |

Joker, 7–K dikeluarkan.
Setelah pemain memahami movement dan adjacency, tambahkan:

```
7, 8, 9, 10
```

Kemudian tahap terakhir:

```
J, Q, K, Joker
```

Model ini membuat pemain mempelajari sistem secara bertahap daripada dipaksa menghafal seluruh ability sejak game pertama.

---

# 8. Full Chaos Mode

Setelah pemain memahami semua ability, gunakan seluruh deck:

```
52 cards
+
1–2 Joker
```

Semua rank aktif.
Mode ini adalah target pengalaman utama MIAW-CRAFT Poker:

- board berubah cepat;
- positioning tetap penting;
- kartu rendah tetap berguna;
- face card menghasilkan tempo swing;
- Joker menciptakan situasi tidak terduga;
- tetapi tidak ada 52 ability unik yang harus dihafal.

---

# 9. Status Suit

Pada **v0.1**, suit belum memiliki ability.

```
♠ Spade
♥ Heart
♦ Diamond
♣ Club
```

Semua kartu dengan rank sama menggunakan ability sama:

```
5♠ = PUSH
5♥ = PUSH
5♦ = PUSH
5♣ = PUSH
```

Keputusan ini disengaja untuk menekan cognitive load.
Suit disimpan sebagai design space untuk versi berikutnya, misalnya:

- Job membutuhkan kombinasi suit;
- bonus monochrome;
- flush pattern;
- suit faction;
- suit-specific passive;
- poker-hand objective.

Jangan menambahkan suit ability sebelum rank ability selesai di-playtest.

---

# 10. Prototype Balance Rules

Aturan berikut dipakai untuk mencegah ability menjadi terlalu liar.

1. **Hanya kartu yang baru ditempatkan yang memicu ability.**
2. Ability bersifat optional.
3. Extra card dari 10 tidak mengaktifkan ability.
4. 9 tidak dapat menyalin 9–K/Joker.
5. Joker hanya menyalin rank yang sedang terlihat di board.
6. Satu pemain maksimum memiliki satu King's Lock aktif.
7. Tidak boleh memindahkan Locked card.
8. Setiap efek diselesaikan sepenuhnya sebelum efek lain dimulai.
9. Jika ability tidak memiliki target legal, kartu tetap sah dimainkan tetapi ability hangus.
10. Jika terjadi konflik interpretasi, kondisi board sebelum ability dipakai menjadi titik rollback.

---

# 11. Quick Reference

| CardAbilityKeyword |                    |                           |
| ------------------ | ------------------ | ------------------------- |
| **A**              | ZERO               | No ability                |
| **2**              | NUDGE              | Move 1 adjacent           |
| **3**              | SCOUT              | Look 3, choose 1          |
| **4**              | LOCAL SWAP         | Swap 2 nearby             |
| **5**              | PUSH               | Push line                 |
| **6**              | PULL               | Pull from range 2         |
| **7**              | STACK SHIFT        | Move onto stack           |
| **8**              | ROTATE             | Rotate 3 cards            |
| **9**              | COPYCAT            | Copy 2–8                  |
| **10**             | OVERTIME           | Extra placement, no chain |
| **J**              | JACK OF ALL TRADES | Choose 2 / 3 / 4          |
| **Q**              | QUEEN'S COMMAND    | Move up to 2 cards        |
| **K**              | KING'S ORDER       | Lock 1 card               |
| **Joker**          | CHAOS SHIFT        | Copy visible 2–K          |

---

# 12. Rekomendasi Playtest Pertama

Jangan mulai dengan Full Chaos Mode.

### Test 01 — Basic Manipulation

Gunakan:

```
A–6
No stacking
No Joker
```

Tujuan pengujian:

- apakah NUDGE terlalu lemah;
- apakah PUSH mudah dipahami;
- apakah PULL terlalu bebas;
- apakah board cukup padat untuk menghasilkan interaksi.

### Test 02 — Spatial Chaos

Tambahkan:

```
7–10
Stack max 3
```

Uji:

- Stack Shift;
- Rotate;
- Copycat;
- Overtime.

### Test 03 — Power Cards

Tambahkan:

```
J Q K
```

Uji apakah face cards benar-benar terasa spesial tetapi tidak menentukan kemenangan sendiri.

### Test 04 — Joker

Masukkan satu Joker terlebih dahulu.
Jika satu Joker tidak mendominasi permainan, baru coba dua Joker.

---

# 13. Hal yang Belum Dikunci

Prototype v0.1 **belum mengunci**:

- jumlah pemain final;
- ukuran board final;
- starting cards;
- scoring;
- Job system;
- penggunaan suit;
- poker-hand objective;
- jumlah Joker;
- end-game trigger;
- winner condition;
- rarity/balance antar-rank.

Hal-hal tersebut harus ditentukan setelah ability A–K + Joker terbukti menyenangkan dalam playtest.

---

# 14. Design Principle

Target desain MIAW-CRAFT Poker bukan:

> "setiap kartu harus mempunyai aturan unik."

Targetnya adalah:

> **setiap rank harus menghasilkan keputusan posisi yang berbeda tanpa membuat pemain membuka rulebook setiap kali kartu ditarik.**

Dengan struktur ini, deck 54 kartu dapat terasa sangat variatif tetapi pemain hanya mempelajari satu ability per rank.

---

# 15. Sumber Referensi Deck

Struktur fisik deck mengacu pada format kartu remi/poker standar. Bicycle mendokumentasikan penggunaan pack standar 52 kartu dan beberapa permainan yang menambahkan satu atau dua Joker. Referensi ini hanya digunakan untuk komposisi deck; seluruh sistem ability MIAW-CRAFT Poker di atas adalah desain prototype MIAW-CRAFT.

- [https://bicyclecards.com/how-to-play/spades/](https://bicyclecards.com/how-to-play/spades/)
- [https://bicyclecards.com/how-to-play/spades-with-jokers/](https://bicyclecards.com/how-to-play/spades-with-jokers/)
- [https://bicyclecards.com/how-to-play/page-one/](https://bicyclecards.com/how-to-play/page-one/)

---

**MIAW-CRAFT POKER RULE v0.1**
Prototype untuk playtest. Ability dan balance dapat berubah berdasarkan hasil permainan nyata.