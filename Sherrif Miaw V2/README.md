# MIAU! DUSTY MARKET

Single-device social bluff game original.

Flow: Sheriff tidur -> merchant secret shop -> bag terkunci -> Sheriff membuka maksimal satu bag atau pass -> resolve otomatis -> Sheriff berganti.

Payoff:
- Legal + pass: profit biasa.
- Legal + inspected: profit + compensation dari Sheriff.
- Moonstone + pass: jackpot.
- Moonstone + inspected: Moonstone disita, legal tetap profit, merchant bayar fine ke Sheriff.

Fitur: CRUD pemain/barang, ID P/L/X, setting modal/bag/kompensasi, dark/light, sound, localStorage, export/import JSON, responsive.

Moonstone adalah contraband fiksi; tidak ada barang berbahaya nyata.


## V3 — All-Bag Sheriff Decisions
- Sheriff menilai setiap Merchant satu per satu: PASS atau INSPECT.
- Tidak ada batas jumlah inspeksi: bisa 0, 1, beberapa, atau semua kantung.
- Keputusan langsung dikunci dan tidak membuka isi.
- Semua isi baru direveal bersama setelah semua keputusan selesai.
- Ini mencegah hasil Merchant awal memberi informasi untuk keputusan Merchant berikutnya.
