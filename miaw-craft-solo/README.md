# MIAW-CRAFT SOLO · Cozy Shift

Standalone solo variant untuk MIAW-CRAFT.

## Filosofi

Solo bukan AI opponent. Pemain menghadapi spatial puzzle, Shift Goals, dan Cat Requests. Tidak ada timer, pass-device, atau skor lawan.

## Difficulty

| Mode | Worker Bag | Shift Goals | Requirement | Job Reroll | Undo |
|---|---:|---:|---:|---:|---|
| Lazy Morning · Easy | 36 | 3 | 2/3 | Unlimited | Unlimited selama turn |
| Regular Shift · Medium | 30 | 3 | 3/3 | 3 | 1 kali per turn |
| Rush Hour · Hard | 24 | 4 | 4/4 | 2 | Tidak ada |

Enam Starting Worker berada pada enam hex di sekitar pusat dan tidak dihitung sebagai Worker Bag.

## Turn

DRAW → PLACE → optional SKILL → SCORE → next shift.

Maksimal satu Job dapat diselesaikan setiap shift. Tiga Job selalu terbuka. Job dapat di-reroll sesuai difficulty tanpa mengakhiri shift.

## Shift Goals

Goal dipilih acak setiap game, misalnya:

- selesaikan sejumlah Job;
- selesaikan LINE dan TRIANGLE;
- gunakan beberapa profesi skill berbeda;
- buat stack 3 Worker;
- gunakan Manager untuk menyalin skill;
- tampilkan beberapa profesi sebagai TOP WORKER.

Goal yang pertama kali selesai memberi 1 Cozy Star.

## Cat Request

Satu side quest opsional selalu aktif. Setelah terpenuhi, tekan Collect untuk memperoleh 1 Cozy Star dan menerima request baru.

## Win / End

Easy tidak memiliki kegagalan keras. Medium dan Hard dinyatakan incomplete jika Worker Bag habis sebelum requirement Shift Goals terpenuhi. Jika requirement sudah tercapai, pemain boleh menyelesaikan shift lebih awal atau terus bermain.

## Files

- `index.html`
- `style.css`
- `script.js`
- `README.md`

Buka `index.html` langsung di browser. Tidak memerlukan server atau library eksternal.

## Responsive Layout Revision

Layout Solo Mode telah direvisi untuk desktop, laptop, tablet, dan ponsel.

- Ukuran hex tidak lagi fixed 92×104 px.
- Board menghitung ukuran hex dari lebar panel secara dinamis.
- Desktop/laptop mempertahankan board ringkas dengan panel kontrol tetap terlihat.
- Tablet menggunakan Job carousel horizontal dan layout board-first.
- Ponsel menggunakan Job carousel, legend horizontal ringkas, dan control panel sticky di bawah agar aksi tetap dekat dengan board.
- Tidak ada lagi `transform: scale()` untuk mengecilkan board. Tinggi container ikut dihitung sehingga tidak meninggalkan ruang kosong besar.
