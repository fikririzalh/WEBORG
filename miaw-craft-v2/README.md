# MIAW-CRAFT V2 · Busy Day

Prototype web 3-player untuk **Cat Go to Work: MIAW-CRAFT**.

## Identitas V2

- 3 pemain pada satu layar.
- 27 hex shared board.
- 3 Job publik selalu terbuka.
- Semua pemain boleh mengejar ketiga Job tersebut.
- Maksimum 1 Job dapat diklaim oleh pemain aktif per turn.
- Pergantian pemain instan: P1 → P2 → P3 → P1.
- Tidak ada privacy screen atau prompt “pass device”.
- Poin Job tidak dihitung oleh web; catat secara fisik.

## Worker Pool

6 Starting Worker mengelilingi pusat, lalu 36 Worker berada di Worker Bag:

- 5 Baker
- 5 Recruiter
- 5 Courier
- 5 Mechanic
- 5 Barista
- 5 Manager
- 6 Dual Worker

Total Worker dalam permainan = 42.

## Turn

1. DRAW Worker.
2. PLACE pada hex legal, stack maksimal 3.
3. SKILL bersifat opsional.
4. SCORE: klaim maksimal 1 Job publik yang valid.
5. END TURN, langsung ke pemain berikutnya.

## Menjalankan

Buka `index.html` langsung di browser modern. Tidak memerlukan server, framework, database, atau koneksi internet.

## Catatan desain

MIAW-CRAFT adalah redesign/original theme. Mekanik pattern-building dan beberapa struktur kemampuan menggunakan Flamecraft Duals sebagai referensi desain, tetapi nama, UI, job titles, teks, dan identitas visual di sini dibuat untuk MIAW-CRAFT.
