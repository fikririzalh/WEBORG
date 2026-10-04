# Rainbow Blvd. versi Kartu Remi — Prototipe v0.1

Lanjutan dari diskusi ChatGPT. Konsep tetap: **kartu dan kertas dipakai untuk membangun, web dipakai untuk informasi rahasia dan hitungan.**

## 1. Tanggapan atas pendapat Anda

| Pendapat Anda | Tanggapan |
|---|---|
| Perlu kertas supaya web menanggung BP dan Kontrak, karena web ada di HP masing-masing | **Setuju, dan ini penyederhanaan besar.** Semua yang publik (pasar, waktu, persediaan kartu) ada di kertas. Semua yang rahasia (BP, kontrak) ada di HP masing-masing. Web **tidak perlu sinkron antar pemain**, jadi tidak perlu server. |
| Pakai lambang, bukan warna | **Setuju.** ♥ ♦ ♣ ♠ dipakai sebagai "perusahaan". Warna merah/hitam kartu tidak punya arti. |
| Setup kertas, silakan diimajinasikan | Lihat bagian 3 dan 4. |
| Kartu ditumpuk di pinggiran | Lihat bagian 3. Tiap sisi papan = satu lambang. |
| Format `Keriting | [deck kecil: A-2] [deck besar: ]` | Lihat tabel bagian 3. Bagian "deck besar" yang kosong saya isi **5–10**. Pembagian A–2 saya ubah jadi A–4 (alasan di bagian 10). |
| Daftar kartu Kontrak dan Blueprint | Bagian 7 dan 8. |
| Simulasikan | Bagian 9, lalu temuannya di bagian 10. |

## 2. Pembagian tugas: kertas, kartu, web

| Hal | Tempat | Alasan |
|---|---|---|
| Nilai pasar tiap lambang | Kertas (4 koin di jalur 1–9) | Semua pemain harus melihatnya |
| Time track dan penanda hari | Kertas | Menentukan siapa jalan berikutnya |
| Persediaan kartu | Tumpukan di tepi kertas | Rebutan, harus publik |
| Segmen pelangi | Kartu remi di area pemain | Sensasi membangun |
| Blueprint dan Kontrak | **HP pemain** | Rahasia |
| Hitung skor akhir | **HP pemain** | Mudah salah kalau manual |

**Dihapus dari v0.1:** token, Rainbow Workshop, kartu J/Q/K, Joker, enam perusahaan, peta kota. Semuanya masuk v0.2 setelah inti terasa enak.

## 3. Komponen dan setup kertas

**Komponen:** 1 deck remi (pakai **A–10 saja = 40 kartu**; J, Q, K, Joker disimpan), 1 papan bersama (A3 atau 2×A4), 1 lembar Area Pemain per orang (A4), 4 koin pasar, 1 penanda per pemain (waktu), 1 penanda hari, HP tiap pemain.

### Papan bersama

```
                          ♠ SEKOP
                [Kecil A–4]    [Besar 5–10]
        ┌───────────────────────────────────────────┐
        │ PASAR (koin mulai di 5)                   │
        │         1   2   3   4   5   6   7   8   9 │
 ♣      │     ♠   ·   ·   ·   ·  (●)  ·   ·   ·   · │      ♥
KERITING│     ♥   ·   ·   ·   ·  (●)  ·   ·   ·   · │     HATI
[Kecil] │     ♦   ·   ·   ·   ·  (●)  ·   ·   ·   · │    [Kecil]
[Besar] │     ♣   ·   ·   ·   ·  (●)  ·   ·   ·   · │    [Besar]
        │                                           │
        │ HARI:  ①  ②  ③                            │
        │ TIME TRACK                                │
        │  0 ─── 1 ─── 2 ─── 3 ─── 4 ─── 5 (akhir)  │
        └───────────────────────────────────────────┘
                [Kecil A–4]    [Besar 5–10]
                          ♦ WAJIK
```

### Persediaan kartu di tepi papan

Tiap lambang punya dua tumpukan, **terbuka, kartu terendah di atas**. Pemain hanya boleh mengambil **kartu paling atas**.

| Lambang | Deck Kecil | Deck Besar |
|---|---|---|
| Keriting ♣ | [A, 2, 3, 4] | [5, 6, 7, 8, 9, 10] |
| Wajik ♦ | [A, 2, 3, 4] | [5, 6, 7, 8, 9, 10] |
| Hati ♥ | [A, 2, 3, 4] | [5, 6, 7, 8, 9, 10] |
| Sekop ♠ | [A, 2, 3, 4] | [5, 6, 7, 8, 9, 10] |

Akibatnya, kartu yang tersedia di tiap lambang naik seiring permainan berjalan. Makin lama, makin banyak kartu besar yang jadi kartu teratas.

### Area Pemain: "Lengkung Pelangi"

```
  Tiang 1    Tiang 2    Tiang 3    Tiang 4    Tiang 5
 ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐
 │       │  │       │  │       │  │       │  │       │
 │       │  │       │  │       │  │       │  │       │
 └───────┘  └───────┘  └───────┘  └───────┘  └───────┘
```

Kartu baru diletakkan menutupi kartu sebelumnya, digeser sedikit supaya kartu di bawahnya masih terlihat. **Kartu terbaru (paling atas) = kartu aktif.**

## 4. Aturan inti

**Tujuan:** skor tertinggi setelah 3 hari.

**Persiapan:** semua koin pasar di 5. Setiap pemain menarik rahasia di HP: 3 Blueprint (simpan 1) dan 3 Kontrak (simpan 1). Penanda waktu semua di 0, pemain pertama ada di tumpukan paling atas.

**Giliran:** yang penanda waktunya **paling kecil** jalan. Kalau seri di satu angka, penanda yang **tiba paling akhir** (paling atas) jalan duluan. Pemain memilih satu aksi:

| Aksi | Jam | Efek |
|---|---:|---|
| **Bangun Kecil** (ambil teratas Deck Kecil) | 1 | Pasar lambang baru **+1** |
| **Bangun Besar** (ambil teratas Deck Besar) | 2 | Pasar lambang baru **+2** |
| **Bongkar** (buang kartu aktif satu tiang) | 1 | Pasar lambang yang dibuang **−1**, lambang yang terungkap (jika ada) **+1** |
| **Ambil Rahasia** (di HP: tarik 2, simpan 1) | 1 | Maksimal pegang 2 BP dan 3 Kontrak |

**Aturan membangun:**
- Letakkan di tiang kosong, atau di atas kartu aktif tiang itu.
- Kalau menutup kartu, **level kartu baru harus ≥ level kartu yang ditutup** (A=1, 10=10).
- Lambang kartu yang tertutup: pasar **−1**.
- Pasar dibatasi 1–9.

**Waktu:** satu hari = 5 jam. Aksi yang melewati 5 dipotong jadi 5. Hari berakhir saat semua penanda di 5.

**Akhir hari 1 dan 2:** "koreksi pasar", yaitu tiap lambang bergeser 1 langkah menuju 5. Setelah itu penanda waktu kembali ke 0 dan pemain pertama berputar. **Hari 3 tidak ada koreksi.**

## 5. Skor akhir (dihitung di HP)

1. **Nilai Kota:** tiap kartu aktif = `pasar lambangnya ÷ 2` (dibulatkan ke bawah). Maksimal 4 poin per tiang.
2. **Blueprint:** selesai = poin di kartu, gagal = **−3**.
3. **Kontrak:** terpenuhi = poin di kartu, gagal = **−2**.

Seri: yang jumlah level kartu aktifnya lebih tinggi menang.

## 6. Alur web (per HP, tanpa server)

1. **Setup:** pilih jumlah pemain, kursi, dan kode game. Kode + nomor kursi dipakai sebagai seed pengacakan, jadi **tiap pemain mendapat kartu rahasia berbeda tanpa saling terhubung**.
2. **Kartu Rahasia:** lihat BP dan Kontrak yang dipegang, tombol "Ambil Rahasia" (tarik 2, simpan 1).
3. **Hitung Skor:** di akhir game, isi 4 nilai pasar dan 5 tiang (lambang kartu aktif, level, jumlah kartu). Web menghitung semua poin.

## 7. Daftar Kontrak prototipe (17 kartu)

Dinilai pada **nilai pasar akhir game**. Gagal = −2. Notasi: `♥ > ♠` artinya nilai pasar Hati lebih besar dari Sekop.

| ID | Kondisi | Poin |
|---|---|---:|
| K01 | ♥ > ♠ | 3 |
| K02 | ♦ > ♣ | 3 |
| K03 | ♠ > ♦ | 3 |
| K04 | ♣ > ♥ | 3 |
| K05 | ♥ = ♦ (sama persis) | 4 |
| K06 | ♠ = ♣ (sama persis) | 4 |
| K07 | ♥ tertinggi sendiri | 4 |
| K08 | ♠ tertinggi sendiri | 4 |
| K09 | ♣ terendah sendiri | 4 |
| K10 | ♥ > ♦ > ♣ | 5 |
| K11 | ♠ > ♣ > ♦ | 5 |
| K12 | Keempat nilai pasar berbeda semua | 5 |
| K13 | Selisih nilai tertinggi dan terendah ≥ 5 | 5 |
| K14 | ♦ ≥ 8 | 6 |
| K15 | ♣ ≤ 2 | 6 |
| K16 | **Koleksi:** ≥ 3 kartu ♥ tertutup (bukan kartu aktif) di areamu | 4 |
| K17 | **Koleksi:** ≥ 3 kartu ♠ tertutup di areamu | 4 |

K16 dan K17 menggantikan "stamp" di game asli, supaya kartu yang tertutup tetap punya nilai.

## 8. Daftar Blueprint prototipe (11 kartu)

Dinilai pada **tata letak akhir game**. Gagal = −3. "Kartu aktif" = kartu paling atas di sebuah tiang.

| ID | Nama | Kondisi | Poin |
|---|---|---|---:|
| B01 | Empat Simbol | Keempat lambang muncul di kartu aktif (posisi bebas) | 3 |
| B02 | Ujung Kembar | Kartu aktif Tiang 1 dan Tiang 5 berlambang sama | 3 |
| B03 | Menara | Satu tiang berisi ≥ 4 kartu | 4 |
| B04 | Kota Penuh | Kelima tiang terisi | 4 |
| B05 | Anak Tangga | Level kartu aktif Tiang 1 < 2 < 3 < 4 | 4 |
| B06 | Atap Tinggi | Ada kartu aktif level 9 atau 10 | 4 |
| B07 | Dua Menara | Dua tiang masing-masing ≥ 3 kartu | 5 |
| B08 | Trio | ≥ 3 tiang berkartu aktif lambang sama | 5 |
| B09 | Cermin | Aktif T1 = T5 dan T2 = T4 (lambang), serta T1 ≠ T2 | 5 |
| B10 | Puncak 30 | Jumlah level kelima kartu aktif ≥ 30 | 6 |
| B11 | Empat Penjuru | Aktif T1–T4 berlambang beda semua, dan tiap tiang ≥ 2 kartu | 7 |

## 9. Simulasi di atas kertas (2 pemain, Hari 1)

> Dijalankan manual dari aturan di atas. Ini **bukan playtest sungguhan**, hanya uji logika aturan.

**Pemain:** Ayu dan Budi. **Kartu rahasia:** Ayu = B03 Menara + K01 (♥ > ♠). Budi = B04 Kota Penuh + K08 (♠ tertinggi sendiri). Pasar awal semua 5.

| # | Pemain | Aksi | Jam | Efek pasar | Waktu setelahnya |
|---:|---|---|---:|---|---|
| 1 | Ayu | Bangun ♥A (Kecil) di T1 | 1 | ♥ 5→6 | Ayu 1 |
| 2 | Budi | Bangun ♠A (Kecil) di T1 | 1 | ♠ 5→6 | Budi 1 |
| 3 | Budi | Bangun ♦A (Kecil) di T2 *(seri di jam 1, Budi tiba terakhir, jalan duluan)* | 1 | ♦ 5→6 | Budi 2 |
| 4 | Ayu | Bangun ♥2 (Kecil) di T1, menutup ♥A | 1 | ♥ +1 −1 = 6 | Ayu 2 |
| 5 | Ayu | Bangun ♥5 (Besar) di T1, menutup ♥2 *(seri di jam 2, Ayu tiba terakhir)* | 2 | ♥ +2 −1 → 7 | Ayu 4 |
| 6 | Budi | Bangun ♣A (Kecil) di T3 | 1 | ♣ 5→6 | Budi 3 |
| 7 | Budi | Bangun ♠5 (Besar) di T4 | 2 | ♠ 6→8 | Budi 5 |
| 8 | Ayu | Mau ♥3 (Kecil) tapi **ditolak** karena 3 < 5. Ambil ♥6 (Besar), menutup ♥5 | 2 | ♥ 7→8 | Ayu 4+2 → dipotong 5 |

**Akhir Hari 1:**
- Ayu: T1 = [♥A, ♥2, ♥5, ♥6]. Tiang lain kosong.
- Budi: T1 ♠A, T2 ♦A, T3 ♣A, T4 ♠5, T5 kosong.
- Pasar: ♥8, ♦6, ♣6, ♠8. Setelah koreksi: **♥7, ♦5, ♣5, ♠7**.
- Persediaan: Kecil teratas ♥3, ♦2, ♣2, ♠2. Besar teratas ♥7, ♦5, ♣5, ♠6.

**Uji hitung skor** (anggap game selesai di sini, pasar sebelum koreksi: ♥8 ♦6 ♣6 ♠8):

| | Nilai Kota | Blueprint | Kontrak | **Total** |
|---|---|---|---|---:|
| Ayu | ♥6 aktif → ⌊8÷2⌋ = **4** | Menara ✓ **+4** | K01: ♥8 > ♠8? ✗ **−2** | **6** |
| Budi | ♠A 4 + ♦A 3 + ♣A 3 + ♠5 4 = **14** | Kota Penuh ✗ (T5 kosong) **−3** | K08: ♠8 tertinggi sendiri? ✗ (seri dengan ♥) **−2** | **9** |

## 10. Temuan simulasi dan usulan revisi v0.2

1. **Pasar naik lebih cepat daripada turun.** Dalam 8 bangunan, pasar naik bersih +8 (♥+3, ♠+3, ♦+1, ♣+1). Hanya aksi menutup yang memberi −1. Dengan 4 pemain dan ~40 bangunan, pasar akan menempel di 9.
   *Usulan:* koreksi akhir hari 2 langkah (bukan 1), atau Bangun Besar hanya +1.

2. **Seri sering terjadi.** Di langkah 7 ♠ dan ♥ sama-sama 8, sehingga dua kontrak ketat gagal sekaligus (K01 dan K08).
   *Usulan:* K07/K08/K09 diubah menjadi "tertinggi/terendah, **boleh seri**" dan diturunkan jadi 3 poin.

3. **Menara lemah dibanding membangun melebar.** Skor Kota Ayu hanya 4 (1 kartu aktif), Budi 14 (4 kartu aktif). Blueprint Menara 4 poin tidak menutup selisih itu.
   *Usulan:* Menara jadi **6 poin**, atau skor Kota ditambah bonus tinggi tiang.

4. **Deck Kecil habis terlalu cepat.** 6 dari 8 bangunan memakai Deck Kecil. Dengan 4 pemain, perkiraan ±12–16 bangunan di Hari 1, sehingga dari 16 kartu Kecil hampir semuanya terpakai di Hari 1–2. Pembagian A–2 yang Anda sebut tadi akan lebih parah lagi (hanya 8 kartu Kecil).
   *Usulan:* ubah ke **Kecil A–5 (20 kartu) dan Besar 6–10 (20 kartu)**.

5. **Aturan menutup (level ≥) berfungsi baik.** Ayu ditolak mengambil ♥3 dan terpaksa membayar 2 jam untuk Besar. Ini menciptakan dilema: tiang yang sudah tinggi "terkunci" dan hanya bisa dinaikkan dengan kartu mahal. Dipertahankan.

**Yang belum teruji:** 3–4 pemain, Hari 2–3, aksi Bongkar, kontrak koleksi (K16/K17), dan apakah deck 40 kartu cukup untuk 4 pemain.

## 11. Langkah berikutnya

- **A.** Terapkan 4 usulan revisi di atas jadi v0.2, lalu simulasikan ulang dengan 3–4 pemain sampai Hari 3.
- **B.** Rancang tampilan layar web (3 layar di bagian 6) dan buatkan prototipenya.
- **C.** Buat file cetak (papan A3 dan Area Pemain A4) berdasarkan bagian 3.
