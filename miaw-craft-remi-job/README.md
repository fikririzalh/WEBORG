# MIAW-CRAFT JOB

Companion web untuk prototipe fisik **Cat Go to Work: MIAW-CRAFT Remi Edition**.

## Fungsi
Web ini menjadi dealer **2 Job aktif** untuk setiap pemain. Papan, kartu Worker, validasi pola, koin, dan poin ditangani secara fisik.

## Mode

### Single Device
- 2 pemain berbagi 1 HP/laptop.
- Masing-masing memiliki 2 Job aktif rahasia yang persisten.
- Pemain bebas memilih Job A atau Job B yang ingin dikejar.
- Jika kedua pola terpenuhi, kedua Job boleh diselesaikan pada giliran yang sama.
- Setelah pemain mengakhiri giliran, muncul privacy screen sebelum dua Job pemain berikutnya ditampilkan.
- Tombol `Selesai` pada suatu slot hanya mengganti slot tersebut dengan Job acak baru.
- Tombol `Ganti` pada suatu slot hanya melakukan reroll pada slot tersebut tanpa mencatat biaya digital.

### Double Device
- Setiap pemain membuka aplikasi di HP masing-masing.
- Pilih identitas P1/P2 pada perangkat.
- Tidak ada turn dan tidak ada sinkronisasi antar-HP.
- Setiap HP menampilkan 2 Job aktif. Masing-masing slot dapat diselesaikan atau diganti secara mandiri.
- Karena perangkat tidak tersinkron, Job yang sama dapat muncul pada kedua HP. Jika aturan meja tidak mengizinkan duplikasi, cukup reroll salah satunya.

## Pola Job
- LINE: tiga Top Worker berada dalam satu garis pada papan hex.
- TRIANGLE: tiga Top Worker menempati tiga hex yang saling bersebelahan membentuk segitiga.
- Pola boleh diputar.
- Dual Worker boleh dihitung sebagai salah satu dari dua profesi yang tercetak pada kartu.

## Worker Key
| Rank | Worker |
|---|---|
| A | Baker 🥐 |
| 2 | Recruiter 🧶 |
| 3 | Courier 📦 |
| 4 | Mechanic 🔧 |
| 5 | Barista ☕ |
| 6 | Manager 📣 |

## Skor dan biaya
Aplikasi tidak menghitung poin, koin, atau kemenangan. Jika mengganti Job memiliki biaya dalam rule fisik, bayarkan secara fisik sebelum menekan tombol `Ganti Job`.

## Menjalankan
Buka `index.html` langsung di browser. Tidak memerlukan server, framework, database, atau internet.
