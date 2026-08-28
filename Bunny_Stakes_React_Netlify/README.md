# Bunny Stakes Online

Aplikasi React + Supabase untuk menggantikan chip poker fisik. Pemain bergabung melalui kode atau tautan tanpa akun, lalu saldo, taruhan, transfer, middle pot, dan riwayat disinkronkan secara real-time.

## Sebelum bermain

Jalankan isi `SUPABASE_FINAL_PATCH.sql` satu kali melalui Supabase SQL Editor. Skrip database utama harus sudah dijalankan dan Anonymous Sign-ins harus aktif.

## Menjalankan lokal

```bash
npm install
npm run dev
```

## Deployment Netlify

Konfigurasi sudah tersedia di `netlify.toml`.

- Build command: `npm run build`
- Publish directory: `dist`

Anda dapat menghubungkan folder ini ke repository Git, atau mengunggah isi folder `dist` ke Netlify Drop setelah menjalankan `npm run build`.

Publishable key Supabase memang ditujukan untuk aplikasi browser. Jangan pernah menambahkan service-role key atau password database ke proyek ini.
