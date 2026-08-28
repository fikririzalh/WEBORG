# Coding Bunny Eye Game

Game ketelitian kode berbasis HTML, CSS, dan JavaScript murni. Pemain membandingkan dua kartu yang hampir sama, memilih kode yang benar, lalu membuka jawaban beserta penjelasan pada masing-masing kartu.

## Fitur

- Soal HTML, CSS, dan JavaScript muncul secara acak.
- Posisi kartu benar dan salah selalu diacak.
- Tombol reveal menampilkan kartu benar, letak bug, dan penjelasan.
- Skor dan streak permainan.
- CRUD bank soal: tambah, baca, ubah, dan hapus.
- Pencarian bank soal, reset data bawaan, dan ekspor JSON.
- Tema terang dan gelap, tersimpan di browser.
- Responsif serta mendukung keyboard.
- Seluruh data tersimpan dengan `localStorage`, tanpa database.

## Menjalankan di VS Code

1. Salin `index.html`, `styles.css`, dan `app.js` ke satu folder.
2. Buka folder tersebut di VS Code.
3. Jalankan `index.html` menggunakan ekstensi Live Server, atau buka terminal pada folder lalu jalankan `npx serve .`.
4. Buka alamat lokal yang ditampilkan.

Catatan: gunakan server lokal agar perilaku penyimpanan `localStorage` konsisten. Membuka file langsung melalui protokol `file:` dapat menghasilkan perilaku yang berbeda antarbrowser.

## Struktur data soal

Setiap soal memiliki properti `id`, `title`, `language`, `difficulty`, `correctCode`, `wrongCode`, `correctExplanation`, dan `wrongExplanation`. Soal buatan pengguna disimpan di browser dengan kunci `codingBunnyQuestionsV1`.
