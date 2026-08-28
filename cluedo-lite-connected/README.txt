CLUECAT CLUEDO LITE V2
======================

Cara menjalankan:
1. Ekstrak ZIP.
2. Buka index.html dengan Chrome atau Edge.
3. Gunakan menu Tracker, Make Suggestion, dan Kartu di bagian atas.

Modul:
- Tracker: matriks P1 sampai P6 dengan tanda centang, silang, tanda tanya, kartu saya, dan kandidat.
- Make Suggestion: Place + Suspect + Weapon, pencatatan penjawab, kartu yang ditunjukkan, dan pemain yang tidak dapat membantah.
- Kartu: CRUD untuk Place, Suspect, dan Weapon.

Penyimpanan:
- Semua data tersimpan otomatis di localStorage browser.
- Export JSON untuk membuat cadangan.
- Import JSON untuk memulihkan data.
- Data tracker versi lama akan dimigrasikan otomatis saat tersedia pada browser yang sama.

Catatan deduksi otomatis:
- Kartu yang diketahui ditunjukkan akan ditandai dimiliki penjawab dan bukan solusi.
- Jika kartu yang ditunjukkan tidak diketahui, tiga clue ditandai mungkin dimiliki penjawab.
- Pemain yang dicatat tidak bisa membantah akan ditandai tidak memiliki ketiga clue.
