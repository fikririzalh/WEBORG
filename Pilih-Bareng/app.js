const QUESTIONS = [
  ['Jika jerapah memakai pita, di mana ia mengikatnya?','Tepat di bawah kepala','Di tengah leher','Di pangkal leher','Di ekor'],
  ['Kalau awan membawa tas, apa isi tasnya?','Air hujan','Kapas cadangan','Pelangi lipat','Petir'],
  ['Jika ikan punya sepatu, dipakai di mana?','Sirip depan','Sirip belakang','Ekor','Dibawa saja'],
  ['Jika bulan mengirim pesan, kapan ia paling mungkin membalas?','Saat malam','Saat gerhana','Besok pagi','Setelah bintang membalas'],
  ['Jika pohon sedang berdandan, apa yang ia pakai terakhir?','Topi daun','Parfum bunga','Sepatu akar','Kacamata hitam'],
  ['Kalau sendok dan garpu bertengkar, siapa yang minta maaf duluan?','Sendok','Garpu','Piring','Tidak ada'],
  ['Jika sepatu bisa liburan, ia paling ingin ke mana?','Pantai','Pegunungan','Toko sepatu','Rumah saja'],
  ['Kalau robot belajar menari, gerakan pertamanya apa?','Putar kepala','Geser kaki','Angkat tangan','Diam mengikuti irama'],
  ['Jika dinosaurus punya ponsel, apa foto profilnya?','Selfie wajah','Foto telur','Foto jejak kaki','Gambar meteor'],
  ['Kalau hujan turun warna-warni, warna apa yang paling bikin orang panik?','Merah','Hijau','Hitam','Emas'],
  ['Jika kursi bisa memilih teman, siapa yang dipilih?','Meja','Bantal','Sofa','Orang yang duduk'],
  ['Kalau matahari memakai kacamata, lensanya warna apa?','Hitam','Kuning','Biru','Merah muda'],
  ['Jika kucing membuka restoran, menu andalannya apa?','Ikan bakar','Susu dingin','Ayam goreng','Apa pun yang ada di piringmu'],
  ['Jika semut jadi raja sehari, perintah pertamanya apa?','Tambah gula','Bangun istana','Libur kerja','Perbesar semua pintu'],
  ['Kalau jam dinding terlambat, alasannya apa?','Kehabisan baterai','Ketiduran','Macet','Menunggu jam lain'],
  ['Jika pensil punya rambut, modelnya seperti apa?','Mohawk runcing','Poni rata','Keriting','Botak setelah diraut'],
  ['Kalau sandal kiri menghilang, sandal kanan akan mencari ke mana dulu?','Bawah kasur','Depan pintu','Halaman','Di kaki orang lain'],
  ['Jika bantal bisa bicara, keluhan pertamanya apa?','Terlalu banyak mimpi','Suka ditindih','Jarang dicuci','Selalu ditinggal pagi'],
  ['Jika pelangi punya pintu masuk, letaknya di mana?','Warna merah','Warna ungu','Di tengah','Di ujung yang menyentuh tanah'],
  ['Kalau es krim bisa memilih cuaca, ia memilih apa?','Hujan','Berawan','Salju','Terik matahari'],
  ['Jika cicak memakai jas, untuk acara apa?','Rapat dinding','Pesta nyamuk','Wawancara kerja','Pernikahan tokek'],
  ['Kalau tas sekolah punya rahasia, di kantong mana ia sembunyikan?','Kantong depan','Kantong paling kecil','Bagian paling bawah','Di balik resleting'],
  ['Jika lampu tidur takut gelap, siapa yang ia hubungi?','Matahari','Lampu ruang tamu','Lilin','Senter'],
  ['Kalau pisang memakai jaket, warnanya apa?','Kuning','Hijau','Cokelat','Merah'],
  ['Jika burung punya lift, ia memakainya untuk apa?','Naik ke sarang','Turun mencari makan','Mengangkut ranting','Sekadar iseng'],
  ['Kalau cermin memberi komentar, apa yang paling sering ia katakan?','Rambutmu berantakan','Senyum dulu','Aku capek','Kamu lagi?'],
  ['Jika ombak menulis surat, kepada siapa?','Pantai','Bulan','Angin','Ikan'],
  ['Kalau donat punya nama tengah, apa namanya?','Lubang','Gula','Cokelat','Bulat'],
  ['Jika kulkas mengadakan pesta, siapa tamu kehormatannya?','Es batu','Susu','Kue','Lampu kulkas'],
  ['Kalau payung boleh memilih pekerjaan lain, ia jadi apa?','Tenda mini','Tongkat jalan','Penari','Penjaga pantai'],
  ['Jika gunung memakai topi, bentuknya apa?','Topi pesta','Topi koboi','Beanie','Mahkota'],
  ['Kalau awan duduk ujian, soal apa yang paling sulit baginya?','Matematika','Prakiraan cuaca','Geografi','Menggambar matahari'],
  ['Jika kaus kaki punya hari libur, di mana ia bersembunyi?','Bawah tempat tidur','Dalam mesin cuci','Dalam sepatu','Di balik lemari'],
  ['Kalau kepiting ikut lomba lari, jalurnya seperti apa?','Lurus','Zigzag','Menyamping','Memutar'],
  ['Jika kue ulang tahun punya permintaan, ia ingin apa?','Lilin lebih sedikit','Tidak dipotong','Krim lebih banyak','Ditiup lebih pelan'],
  ['Kalau terong jadi penyanyi, nama panggungnya apa?','Si Ungu','Terong Star','Raja Sayur','Aubergine'],
  ['Jika jamur membangun rumah, atapnya terbuat dari apa?','Daun','Topi jamur','Ranting','Payung'],
  ['Kalau laut mendapat hadiah, apa yang paling ia sukai?','Kerang baru','Perahu mainan','Pasir bersih','Selimut awan'],
  ['Jika kamera bisa berfoto sendiri, ia mengambil foto apa?','Cermin','Langit','Pemiliknya','Kamera lain'],
  ['Kalau huruf A mengadakan pesta, siapa datang paling awal?','B','Z','Angka 1','Tanda seru'],
  ['Jika monyet memakai dasi, di mana simpulnya?','Di bawah dagu','Di dada','Di atas kepala','Di ekor'],
  ['Kalau bakso bisa memilih kendaraan, ia naik apa?','Sepeda','Motor','Gerobak','Kereta'],
  ['Jika pintu punya hari ulang tahun, hadiah apa yang cocok?','Gagang baru','Kunci emas','Keset baru','Pelumas engsel'],
  ['Kalau bebek membuka salon, layanan utamanya apa?','Potong bulu','Pijat kaki','Cat paruh','Keramas anti air'],
  ['Jika gajah naik pesawat, kursi mana yang ia pilih?','Dekat jendela','Dekat lorong','Paling depan','Paling belakang'],
  ['Kalau roti tawar ikut lomba kostum, ia menyamar jadi apa?','Bantal','Buku','Spons','Kasur mini'],
  ['Jika sandal bisa memilih nama, nama apa yang ia suka?','Langkah','Jepit','Jalan','Kanan'],
  ['Kalau pohon kelapa ikut audisi, bakatnya apa?','Menari ditiup angin','Menyanyi','Melempar kelapa','Berdiri satu kaki'],
  ['Jika lampu lalu lintas libur, siapa yang menggantikannya?','Polisi','Pelangi','Senter','Jam dinding'],
  ['Kalau nyamuk punya band, instrumen apa yang ia mainkan?','Biola','Gitar listrik','Terompet','Drum'],
  ['Jika lemari sedang menyembunyikan sesuatu, apa itu?','Baju lama','Pintu rahasia','Camilan','Monster kecil'],
  ['Kalau bulan ikut piknik, ia membawa apa?','Senter','Selimut','Keju','Payung'],
  ['Jika cacing punya apartemen, lantainya ada di mana?','Bawah tanah','Permukaan tanah','Dalam pot','Di akar pohon'],
  ['Kalau pizza bisa menentukan potongannya, ia ingin jadi berapa bagian?','Empat','Enam','Delapan','Tidak dipotong'],
  ['Jika pensil dan penghapus bertukar pekerjaan, siapa paling panik?','Pensil','Penghapus','Kertas','Guru'],
  ['Kalau ayam berangkat kerja, apa yang paling mungkin tertinggal?','Bekal','Sepatu','Jam alarm','Telur'],
  ['Jika meja bisa jalan-jalan, kaki mana yang melangkah dulu?','Kanan depan','Kiri depan','Kanan belakang','Semua bersamaan'],
  ['Kalau bintang punya alamat, nama jalannya apa?','Jalan Langit','Jalan Malam','Jalan Galaksi','Jalan Cahaya'],
  ['Jika teko menyanyi, lagu pertama tentang apa?','Air panas','Hujan','Sarapan','Perpisahan dengan cangkir'],
  ['Kalau ubur-ubur memakai payung, untuk apa?','Menghindari hujan','Menghindari matahari','Gaya saja','Menutupi tentakel'],
  ['Jika semangka jadi rumah, pintunya dibuat di mana?','Atas','Samping','Bawah','Tepat di tengah'],
  ['Kalau sepeda merasa lelah, bagian mana yang paling mengeluh?','Roda','Pedal','Sadel','Bel'],
  ['Jika bintang laut punya pekerjaan, ia jadi apa?','Penjaga pantai','Artis','Pemandu wisata','Guru olahraga'],
  ['Kalau hujan boleh memilih musik masuk, apa bunyinya?','Drum','Piano','Gitar','Tepuk tangan'],
  ['Jika kura-kura memesan makanan cepat saji, apa yang ia bilang?','Cepat sedikit','Bungkus saja','Makan di tempat','Saya tunggu di rumah'],
  ['Kalau kunci rumah bisa protes, ia paling sebal disimpan di mana?','Bawah keset','Dalam saku','Atas meja','Dalam tas'],
  ['Jika balon punya mimpi, ia ingin terbang ke mana?','Bulan','Atap rumah','Pantai','Awan'],
  ['Kalau mangga menjadi detektif, petunjuk apa yang ia cari?','Jejak biji','Noda jus','Kulit buah','Aroma manis'],
  ['Jika kucing bisa mengirim emoji sendiri, emoji apa yang paling sering dipakai?','😼','🐟','💤','❤️'],
  ['Kalau kursi kantor mengajukan cuti, ia pergi ke mana?','Pantai','Ruang tamu','Gudang','Taman'],
  ['Jika nasi goreng punya lagu tema, genre apa yang cocok?','Pop','Dangdut','Rock','Jazz'],
  ['Kalau peta tersesat, ia bertanya kepada siapa?','Kompas','GPS','Rambu jalan','Orang lewat'],
  ['Jika payung terlambat membuka, alasan apa yang ia berikan?','Masih mengantuk','Macet di tas','Menunggu hujan deras','Engsel kaku'],
  ['Kalau jeruk ikut pemilihan ketua kelas, janji kampanyenya apa?','Jus gratis','Istirahat lebih lama','Kelas lebih segar','Libur tiap Jumat'],
  ['Jika kereta api punya hewan peliharaan, apa yang cocok?','Kuda','Ular','Anjing','Kucing'],
  ['Kalau sapu ingin berganti profesi, ia jadi apa?','Penyihir','Penari','Pelukis','Wasit'],
  ['Jika mie bisa memilih bentuk rambut, ia pilih apa?','Lurus panjang','Keriting','Cepak','Kuncir dua'],
  ['Kalau cicak takut jatuh, ia paling percaya apa?','Lem','Temannya','Ekor sendiri','Doa'],
  ['Jika baju punya pesta, bagian mana yang paling sibuk?','Kancing','Kerah','Saku','Lengan'],
  ['Kalau bulan dan matahari bertukar jadwal, siapa paling kaget?','Ayam','Burung hantu','Manusia','Bintang'],
  ['Jika botol minum mengirim kartu pos, dari mana asalnya?','Kulkas','Tas sekolah','Air terjun','Pabrik'],
  ['Kalau telur punya rahasia, kepada siapa ia bercerita?','Ayam','Wajan','Roti','Telur lain'],
  ['Jika kasur bisa memberi nilai tidur, apa yang paling diperhatikan?','Dengkuran','Mimpi','Lama tidur','Jumlah bantal'],
  ['Kalau jam tangan punya tangan, apa yang pertama ia lakukan?','Tepuk tangan','Menunjuk waktu','Melambai','Memeluk pemilik'],
  ['Jika angin memakai parfum, aromanya seperti apa?','Laut','Hujan','Rumput','Bunga'],
  ['Kalau guling menjadi selebritas, siapa penggemar terbesarnya?','Bantal','Selimut','Kasur','Orang mengantuk'],
  ['Jika bus sekolah dapat hari bebas, ia akan pergi ke mana?','Pantai','Museum','Garasi','Taman bermain'],
  ['Kalau kerupuk bisa memilih cara masuk ke piring, ia memilih apa?','Di atas nasi','Di samping','Di bawah lauk','Di tangan dulu'],
  ['Jika cabai memakai jas hujan, warnanya apa?','Merah','Hijau','Kuning','Bening'],
  ['Kalau bulan punya toko, apa yang dijual?','Cahaya malam','Bintang kecil','Keju','Mimpi'],
  ['Jika kamera memotret mimpi, hasil fotonya seperti apa?','Buram','Warna-warni','Hitam putih','Berubah-ubah'],
  ['Kalau kentang punya superhero, kekuatannya apa?','Terbang','Jadi keripik','Tahan panas','Berubah bentuk'],
  ['Jika permen punya rapat penting, tempatnya di mana?','Dalam toples','Di meja makan','Di kantong','Di toko'],
  ['Kalau pelangi tersesat, warna siapa yang memimpin jalan?','Merah','Kuning','Hijau','Ungu'],
  ['Jika kipas angin marah, apa yang pertama ia lakukan?','Berputar lebih cepat','Berhenti total','Bersuara keras','Menghadap tembok'],
  ['Kalau pohon pisang mengirim undangan, acaranya apa?','Panen buah','Pesta daun','Reuni kebun','Piknik monyet'],
  ['Jika cangkir punya nama panggilan, apa yang cocok?','Cupi','Muggy','Si Pegang','Kopi'],
  ['Kalau awan kehilangan bentuk, ia minta bantuan siapa?','Angin','Pelangi','Matahari','Awan lain'],
  ['Jika kaus kaki bertukar pasangan, siapa yang paling sadar?','Sepatu','Mesin cuci','Pemiliknya','Kaus kaki lain'],
  ['Kalau nasi putih punya superpower, apa yang ia pilih?','Tidak pernah dingin','Selalu pulen','Bisa mengenyangkan semua','Tidak lengket'],
  ['Kalau hujan deras dan kamu lupa bawa payung, langkah pertamamu apa?','Menerobos saja','Menunggu sampai reda','Beli jas hujan dadakan','Memesan ojek'],
  ['Jika hanya boleh makan satu camilan seumur hidup, mana yang dipilih?','Keripik kentang','Cokelat','Gorengan','Mi instan kering'],
  ['Kalau lagu favoritmu diputar di tempat umum, reaksimu apa?','Ikut bernyanyi pelan','Pura-pura tidak kenal','Menari kecil','Mengecek judul lagunya'],
  ['Kalau ada kecoak terbang di kamar, siapa yang kamu panggil?','Ayah','Ibu','Teman sekamar','Semprotan serangga'],
  ['Jika kamu jadi hantu selama sehari, siapa yang pertama ditakuti?','Sahabat sendiri','Bos atau guru','Tetangga','Diri sendiri di cermin'],
  ['Kalau sinyal hilang di tengah game online, apa yang kamu lakukan?','Pindah dekat jendela','Mengangkat ponsel tinggi-tinggi','Restart ponsel','Menyalahkan operator'],
  ['Jika kamu menemukan uang seratus ribu di jalan, apa yang pertama dilakukan?','Mengantongi diam-diam','Menoleh kiri dan kanan','Bertanya ke orang sekitar','Langsung jajan'],
  ['Kalau grup WhatsApp keluarga mendadak ramai, siapa biasanya penyebabnya?','Ibu','Om yang suka kirim video','Nenek dengan stiker','Sepupu iseng'],
  ['Jika kamu bisa teleportasi sekali saja, kamu pergi ke mana?','Pantai tropis','Kota di luar negeri','Dapur rumah saat lapar','Kasur sendiri'],
  ['Kalau kamu harus menginap semalam di tempat angker, apa yang kamu bawa?','Senter besar','Teman yang berani','Doa dan camilan','Speaker untuk memutar musik'],
  ['Jika ayam goreng dan nasi sedang berebut kursi, siapa yang menang?','Ayam goreng','Nasi','Sambal','Kerupuk'],
  ['Kalau kamu mendadak jadi artis, kamu paling takut apa?','Dikejar wartawan','Foto jelek tersebar','Tidak bisa jajan sembarangan','Tidak bisa tidur siang'],
  ['Jika kamu bisa membaca pikiran satu orang selama sehari, siapa orangnya?','Gebetan','Bos atau guru','Sahabat','Kucing peliharaan'],
  ['Kalau bakso tidak ada kuahnya, yang pertama kamu cari apa?','Sambal','Kecap','Mi kuning','Tukang bakso lain'],
  ['Jika kamu terjebak macet satu jam, apa yang paling mungkin kamu lakukan?','Mendengarkan musik','Melamun','Scroll media sosial','Mengomel pelan'],
  ['Kalau ada ulat jatuh di bajumu, bagaimana reaksimu?','Berteriak','Membeku','Mengibas panik','Memanggil orang lain'],
  ['Jika kamu bisa berbicara dengan satu hewan, hewan apa yang paling lucu ngobrolnya?','Kucing','Burung beo','Kambing','Ayam jago'],
  ['Kalau kamu harus mengganti nama jadi nama makanan, kamu memilih apa?','Cilok','Rendang','Klepon','Seblak'],
  ['Jika tiba-tiba listrik padam saat malam, siapa yang paling panik?','Yang takut gelap','Yang baterai ponselnya habis','Yang sedang mandi','Yang sedang main game'],
  ['Kalau kamu bisa menghentikan waktu selama satu menit, kamu melakukan apa?','Tidur sebentar','Mengambil makanan orang','Merapikan rambut','Membalas pesan yang tertunda'],
  ['Jika semua pintu di rumahmu berubah jadi pintu ajaib, ke mana pintu kamar mandi mengarah?','Pantai','Hutan','Luar angkasa','Dapur tetangga'],
  ['Kalau tukang parkir meniup peluit, apa yang paling mungkin terjadi?','Mobil mundur terlalu jauh','Ada yang minta duit receh','Parkir sudah penuh','Ia hanya iseng'],
  ['Jika kamu jadi kepala negara sehari, aturan pertamamu apa?','Libur nasional tiap Jumat','Camilan gratis','Macet dilarang','Tidur siang wajib'],
  ['Kalau kamu bertemu alien, kalimat pertama yang kamu ucapkan apa?','Halo, apa kabar?','Jangan culik saya!','Sudah makan belum?','Boleh foto bareng?'],
  ['Jika mesin cuci bisa bicara, apa keluhannya yang paling sering?','Isinya terlalu penuh','Ada koin yang tertinggal','Sabunnya kebanyakan','Kaus kaki selalu hilang'],
  ['Kalau kamu harus tampil di panggung tanpa persiapan, kamu akan apa?','Menyanyi','Melawak','Menari','Kabur ke belakang panggung'],
  ['Jika kamu ditantang makan sambal super pedas, hasilnya bagaimana?','Menangis tapi lanjut','Menyerah di suapan pertama','Minum segalon air','Pura-pura tidak pedas'],
  ['Kalau kamu bisa makan di restoran mana pun gratis seumur hidup, pilihanmu apa?','Warung padang','Sushi','Pizza','Warteg langganan'],
  ['Jika boneka di kamar tiba-tiba bergerak, apa yang kamu lakukan?','Lari keluar','Mengajaknya bicara','Membungkusnya dengan selimut','Merekamnya untuk dipamerkan'],
  ['Kalau kamu harus tinggal di pulau terpencil, satu benda yang dibawa apa?','Pisau serbaguna','Korek api','Ponsel dengan baterai abadi','Ayam goreng'],
  ['Jika kamu jadi superhero, kelemahanmu apa?','Takut kecoak','Mudah ngantuk','Alergi debu','Lapar terus'],
  ['Kalau kamu bisa mengubah warna langit, kamu memilih warna apa?','Merah muda','Hijau','Ungu','Oranye'],
  ['Jika kamu mendapat pesan salah kirim dari orang asing, kamu membalas apa?','Maaf, salah nomor','Stiker lucu','Mengabaikan saja','Mengajak kenalan'],
  ['Kalau kucing peliharaanmu bisa mengirim satu pesan, isinya apa?','Mana makananku?','Jangan ganggu tidurku','Elus aku sekarang','Pintu ditutup, bukakan'],
  ['Jika kamu harus berkencan dengan satu tokoh kartun, kamu memilih siapa?','Tokoh berani','Tokoh lucu','Tokoh pintar','Tokoh yang suka makan'],
  ['Kalau ada lomba makan kerupuk, siapa yang paling mungkin menang?','Yang paling sabar','Yang paling lapar','Yang paling tinggi','Yang tidak bisa berhenti tertawa'],
  ['Jika kamu bisa menyimpan satu hari agar terulang terus, hari apa yang dipilih?','Hari ulang tahun','Hari libur','Hari makan enak','Hari tanpa tugas'],
  ['Kalau kamu harus memberi nama pada awan di atas rumahmu, namanya apa?','Si Putih','Gumpalan Bahagia','Awan Galau','Kapas Langit'],
  ['Jika kamu tertidur di kendaraan umum, kamu terbangun di mana?','Di terminal akhir','Di rumah orang','Di tempat yang benar','Di tempat yang tidak dikenal'],
  ['Kalau kamu bisa menukar suara dengan hewan, suaramu jadi suara apa?','Kucing mengeong','Ayam berkokok','Burung berkicau','Katak berkoar'],
  ['Jika ponselmu hilang di rumah sendiri, tempat pertama yang dicek apa?','Bawah bantal','Dalam tas','Kamar mandi','Di tangan sendiri'],
  ['Kalau kamu harus memakai kostum badut seharian, kamu bertingkah bagaimana?','Menari terus','Membagikan permen','Bersembunyi di toilet','Berlagak profesional'],
  ['Jika sebuah kue datang dari langit, rasa apa yang paling kamu harapkan?','Cokelat','Stroberi','Keju','Vanila'],
  ['Kalau ada pesta kejutan untukmu, ekspresimu bagaimana?','Menangis haru','Tertawa canggung','Kaget lalu lari','Pura-pura sudah tahu'],
  ['Jika kamu bisa terbang, kamu terbang ke mana pertama kali?','Atap rumah tetangga','Atas awan','Puncak gunung','Warung terdekat'],
  ['Kalau kamu harus menamai band bersama teman, namanya apa?','Para Pelupa Nada','Geng Cemilan','Sandal Jepit Bersatu','Es Teh Manis'],
  ['Jika kamu bisa memanggil satu makanan setiap kali bertepuk tangan, makanan apa?','Nasi goreng','Bakso','Martabak','Es krim'],
  ['Kalau kamu bertemu penyihir baik hati, permintaan apa yang diajukan?','Libur seumur hidup','Uang tak habis','Bisa terbang','Makanan tak habis'],
  ['Jika kamu harus tinggal di rumah pohon, siapa yang kamu ajak tinggal bersama?','Sahabat','Keluarga','Kucing','Tidak ada, sendiri saja'],
  ['Kalau kamu salah masuk ke kelas atau ruang rapat orang lain, kamu bagaimana?','Berpura-pura ikut','Minta maaf lalu keluar','Duduk diam dulu','Melarikan diri'],
  ['Jika semua orang mendadak berbicara dalam bentuk lagu, lagu apa yang kamu mulai?','Lagu ulang tahun','Lagu pop','Lagu dangdut','Lagu anak-anak'],
  ['Kalau kamu menemukan peta harta karun, siapa yang kamu ajak?','Sahabat','Pacar','Keluarga','Siapa saja yang bawa bekal'],
  ['Jika roti bakar dan mi goreng bertengkar, siapa yang menang?','Roti bakar','Mi goreng','Telur','Sambal'],
  ['Kalau kamu bisa mengubah satu hal dari dunia, kamu memilih apa?','Hari Senin dihapus','Macet hilang','Hujan hanya malam','Listrik tak pernah padam'],
  ['Jika wajahmu muncul di baliho besar, apa tulisannya?','Calon pemimpin masa depan','Dicari: teman makan','Mie ayam enak di sini','Selamat ulang tahun'],
  ['Kalau seekor ayam masuk ke rumahmu, tindakanmu apa?','Menggiringnya keluar','Memberi makan','Berteriak','Memotret dulu'],
  ['Jika kamu harus tinggal di museum semalaman, kamu melakukan apa?','Bermain petak umpet','Menakuti penjaga','Tidur di bawah patung','Mencoba semua tombol'],
  ['Kalau kamu menjadi koki dadakan, kamu memasak apa?','Nasi goreng','Telur dadar','Mi instan spesial','Pesan lewat aplikasi'],
  ['Jika kamu terpilih jadi juri lomba lucu-lucuan, siapa yang paling mungkin menang?','Yang paling berisik','Yang paling konyol','Yang paling tidak sengaja lucu','Juri sendiri'],
  ['Kalau kamu bisa memberi satu pelukan ke siapa pun, kamu memeluk siapa?','Ibu','Sahabat','Hewan peliharaan','Bantal favorit'],
  ['Jika kamu harus hidup tanpa satu benda, kamu memilih tanpa apa?','Ponsel','Televisi','Kasur','Cermin'],
  ['Kalau kamu mendapat kesempatan hidup di satu serial kartun, kamu memilih dunia bagaimana?','Dunia petualangan','Dunia makanan','Dunia robot','Dunia hewan'],
  ['Jika semua orang di sekitarmu berubah jadi bebek, apa yang kamu lakukan?','Ikut kwek-kwek','Mencari kolam','Memberi roti','Foto selfie bersama'],
  ['Kalau kamu bisa menukar tubuh dengan orang lain sehari, siapa yang paling seru?','Sahabat','Orang tua','Guru atau bos','Hewan peliharaan'],
  ['Jika kamu harus menyanyikan lagu di depan umum, lagu apa yang paling mungkin dipilih?','Lagu cinta','Lagu ulang tahun','Lagu daerah','Lagu viral'],
  ['Kalau kamu menemukan lampu ajaib, permintaan pertamamu apa?','Liburan abadi','Rumah impian','Teman baru','Camilan tak terbatas'],
  ['Jika kamu harus tidur di tempat aneh, kamu memilih tempat mana?','Di atas perahu','Di rumah pohon','Di dalam tenda','Di sofa toko'],
  ['Kalau kamu harus bersembunyi dalam permainan petak umpet, kamu bersembunyi di mana?','Di balik pintu','Dalam lemari','Di bawah meja','Di tempat paling jauh'],
  ['Jika kamu jadi pelawak sehari, lelucon andalanmu tentang apa?','Makanan','Tingkah kucing','Macet','Diri sendiri'],
  ['Kalau kamu terjebak di dalam lift, yang pertama kamu lakukan apa?','Menekan semua tombol','Menelepon bantuan','Bernyanyi supaya tenang','Duduk diam menunggu'],
  ['Jika kamu bisa membuat satu hari libur baru, namanya apa?','Hari Rebahan Nasional','Hari Camilan','Hari Tanpa Alarm','Hari Peluk Kucing'],
  ['Kalau kamu menerima hadiah aneh, kamu berpura-pura bagaimana?','Sangat senang','Bingung tapi tersenyum','Bertanya fungsinya','Menukarnya diam-diam'],
  ['Jika kamu menemukan kotak misterius di depan rumah, apa yang kamu lakukan?','Membukanya langsung','Memotretnya dulu','Memanggil tetangga','Mengabaikannya'],
  ['Kalau kamu harus berlari dikejar angsa, kamu lari ke arah mana?','Ke arah rumah','Ke arah kolam','Ke arah keramaian','Berbalik melawan'],
  ['Jika kamu bisa menulis buku, judulnya apa?','Kisah Pemalas Sukses','Resep Rahasia Mi Instan','Petualangan Sandal Hilang','Catatan Harian Kucing'],
  ['Kalau kamu bisa membuka toko, kamu menjual apa?','Camilan','Pakaian lucu','Boneka','Barang aneh'],
  ['Jika kamu harus menyamar jadi tokoh terkenal, kamu menyamar sebagai siapa?','Koki terkenal','Penyanyi','Detektif','Pesulap'],
  ['Kalau kamu tinggal di kota terbuat dari makanan, rumahmu terbuat dari apa?','Roti tawar','Wafer','Kerupuk','Kue lapis'],
  ['Jika kamu bisa memelihara hewan raksasa, kamu memilih hewan apa?','Kucing raksasa','Kelinci raksasa','Bebek raksasa','Hamster raksasa'],
  ['Kalau kamu terbangun dengan rambut warna-warni, kamu bagaimana?','Menyukainya','Menutupnya dengan topi','Foto lalu pamer','Mencoba mengecat ulang'],
  ['Jika kamu menjadi penjaga pantai, apa yang paling kamu waspadai?','Ombak besar','Anak kecil berlari','Ubur-ubur','Turis berjemur lupa waktu'],
  ['Kalau kamu menjadi pemandu wisata, tempat yang paling kamu banggakan apa?','Pantai','Gunung','Kuliner','Pasar tradisional'],
  ['Jika ada robot pembersih rumah yang kabur, ia pergi ke mana?','Taman','Dapur tetangga','Tempat sampah','Toko listrik'],
  ['Kalau kamu bisa makan es krim rasa baru, rasa apa yang paling aneh tapi enak?','Sambal','Kopi','Keju asin','Bakso'],
  ['Jika kamu mengikuti acara masak, kamu paling sering salah apa?','Terlalu asin','Terlalu pedas','Gosong','Lupa bahan utama'],
  ['Kalau kamu memiliki mesin waktu, kamu pergi ke mana dulu?','Masa kecil','Masa depan','Zaman dinosaurus','Kemarin untuk tidur lagi'],
  ['Jika kamu bisa berteman dengan benda mati, siapa yang paling lucu diajak ngobrol?','Kipas angin','Lemari','Sandal jepit','Panci'],
  ['Kalau kamu disuruh menebak isi kado, tebakanmu apa?','Baju','Uang','Mainan','Kaus kaki'],
  ['Jika kamu mendadak jadi raksasa, hal pertama yang kamu lakukan apa?','Melangkah hati-hati','Mengintip atap rumah','Mengambil camilan di rak tinggi','Foto selfie dengan gedung'],
  ['Kalau kamu bertemu dua pilihan yang sama enak, kamu memilih bagaimana?','Suit','Melempar koin','Ambil dua-duanya','Bertanya ke orang lain'],
  ['Jika kamu bisa mengganti nama hari, Senin diganti apa?','Hari Malas','Hari Kopi','Hari Mulai Lagi','Hari Pura-pura Semangat'],
  ['Kalau kamu menjadi penyanyi dadakan di kamar mandi, lagu apa yang keluar?','Lagu galau','Lagu semangat','Lagu daerah','Lagu iklan'],
  ['Jika kamu harus menyembunyikan satu rahasia kecil, rahasia apa yang paling lucu?','Takut kecoak','Suka makan es krim tengah malam','Pernah salah masuk toilet','Masih punya boneka'],
  ['Kalau kamu memelihara dinosaurus, namanya siapa?','Rex','Bulat','Nasi','Si Gigi'],
  ['Jika kamu bisa mengatur suhu dunia, kamu memilih suhu apa?','Sejuk selalu','Hangat seperti pantai','Dingin seperti salju','Berubah sesuai suasana hati'],
  ['Kalau kamu menemukan kacamata ajaib, apa yang bisa kamu lihat?','Pikiran orang','Masa depan','Barang hilang','Makanan terenak di sekitar'],
  ['Jika semua orang memakai topi aneh, topimu berbentuk apa?','Mangkuk','Kubah','Roti besar','Piring terbang'],
  ['Kalau kamu menjadi penjaga kebun binatang, hewan mana yang paling merepotkan?','Monyet','Burung beo','Gajah','Ular'],
  ['Jika kamu bisa menyimpan makanan di saku, makanan apa yang selalu ada?','Biskuit','Permen','Roti','Kerupuk'],
  ['Kalau ada tikus lewat saat makan malam, siapa yang paling dulu berteriak?','Yang paling dekat','Yang paling tua','Yang paling muda','Tidak ada, semua membeku'],
  ['Jika kamu harus tidur di antara tiga bantal, kamu memilih urutan apa?','Besar, sedang, kecil','Kecil, sedang, besar','Semua besar','Tanpa bantal'],
  ['Kalau kamu bisa makan sambil mendengarkan satu suara, kamu memilih suara apa?','Hujan','Ombak','Musik','Obrolan teman'],
  ['Jika kamu bertemu burung yang bisa meniru suara, kalimat apa yang paling lucu ditirukan?','Ayo makan!','Jangan ganggu!','Halo, siapa itu?','Bangun, sudah pagi!'],
  ['Kalau kamu bisa menyiapkan pesta kejutan, tempatnya di mana?','Di rumah','Di taman','Di pantai','Di warung langganan'],
  ['Jika kamu harus berjalan mundur seharian, apa yang paling berbahaya?','Menabrak pintu','Menginjak sandal','Tersandung kucing','Menabrak orang yang sedang bawa kuah'],
  ['Kalau kamu diundang main di film, kamu mau jadi peran apa?','Pahlawan','Penjahat lucu','Sahabat konyol','Figuran yang makan terus'],
  ['Jika kamu bisa menukar rumah dengan teman, rumah siapa yang kamu pilih?','Rumah yang punya kolam','Rumah yang punya banyak camilan','Rumah yang tenang','Rumah yang punya kucing'],
  ['Kalau kamu diminta menebak rasa permen misterius, tebakanmu apa?','Stroberi','Jeruk','Mint','Kopi'],
  ['Jika kamu ditantang tidak memegang ponsel sehari, kamu bertahan berapa lama?','Satu jam','Setengah hari','Satu hari penuh','Langsung menyerah'],
  ['Kalau kamu menjadi pemeran utama dalam kartun, ciri khasmu apa?','Topi besar','Suara aneh','Selalu lapar','Sandal yang berbunyi'],
  ['Jika kamu bisa membuat aturan di rumah, aturan pertama apa?','Tidur siang wajib','Camilan tak boleh habis','Tidak boleh marah pagi hari','Remote televisi milikku'],
  ['Kalau kamu bertemu pesulap, trik apa yang kamu minta?','Menghilangkan tugas','Mengubah air jadi jus','Memunculkan kucing','Membuat uang bertambah'],
  ['Jika kamu bisa tinggal di dalam buku cerita, kamu memilih cerita apa?','Petualangan','Dongeng','Misteri','Komedi'],
  ['Kalau kamu bisa melawan satu monster lucu, kamu memilih yang mana?','Monster bulu','Monster gelembung','Monster tidur','Monster sendawa'],
  ['Jika kamu memimpin upacara untuk makanan, makanan apa yang diberi hormat?','Nasi','Tempe','Kerupuk','Sambal'],
  ['Kalau kamu bisa mengatur isi mimpi malam ini, mimpimu tentang apa?','Liburan','Terbang','Makanan enak','Bertemu artis'],
  ['Jika kamu harus memberi julukan pada teman di sebelahmu, julukannya apa?','Si Ceria','Si Pelupa','Si Lapar','Si Tukang Tidur'],
  ['Kalau kamu bisa memelihara satu hewan ajaib, kamu memilih yang mana?','Naga kecil','Kucing terbang','Kelinci menyala','Burung bisa bicara'],
  ['Jika kamu diminta menyanyikan lagu pengantar tidur, siapa yang paling cepat tertidur?','Yang paling lelah','Yang paling kenyang','Yang paling bosan','Kamu sendiri'],
  ['Kalau kamu memakai sandal beda sebelah ke luar rumah, kapan kamu menyadarinya?','Sebelum keluar pagar','Di tengah jalan','Saat sampai tujuan','Dikasih tahu orang lain'],
  ['Jika kamu harus menjadi penyanyi latar, kamu ingin menyanyi bersama siapa?','Penyanyi dangdut','Penyanyi pop','Grup rock','Grup paduan suara'],
  ['Kalau kamu bisa mendapat kekuatan memanjangkan tangan, kamu memakainya untuk apa?','Mengambil remote','Meraih camilan','Mencolek teman jauh','Menekan tombol lift'],
  ['Jika kamu bisa mengubah satu makanan menjadi sehat, makanan apa yang dipilih?','Gorengan','Mi instan','Cokelat','Es krim'],
  ['Kalau kamu menjadi penjaga warung malam, siapa pelanggan pertama yang datang?','Tukang ojek','Mahasiswa begadang','Tetangga lapar','Kucing liar'],
  ['Jika kamu bisa membuat festival di kotamu, apa temanya?','Makanan jalanan','Lampion warna-warni','Balap karung','Lomba tidur siang']
];
const KEY='pilih-bareng-game-v1', THEME='pilih-bareng-theme';
function storageGet(key){try{return window.localStorage.getItem(key)}catch{return null}}
function storageSet(key,value){try{window.localStorage.setItem(key,value)}catch{}}
const app=document.getElementById('app');
let state;
try{state=JSON.parse(storageGet(KEY))}catch{state=null}
if(!state || !Array.isArray(state.deck) || !['setup','handoff','voting','narrator','result','end'].includes(state.phase)) state=fresh();
state.completed ||= [];
state.tallyDraft ||= [0,0,0,0];
let draftMode=state.mode||'pass';
let draftNames=state.names.join(', ');
let draftCount=state.count;
let error='';
let counts=[...state.tallyDraft];
let theme=storageGet(THEME)||((window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light');

function fresh(){return {phase:'setup',mode:'pass',names:[],count:5,round:0,deck:[],votes:[],scores:[],results:null,completed:[],tallyDraft:[0,0,0,0]};}
function save(){storageSet(KEY,JSON.stringify(state));}
function shuffle(){const a=Array.from({length:QUESTIONS.length},(_,i)=>i);for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a.slice(0,10)}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function q(){return QUESTIONS[state.deck[state.round]]||QUESTIONS[0]}
function backButton(){return `<button class="back-button" id="back" type="button" aria-label="Kembali ke langkah sebelumnya">← Kembali</button>`}
function header(){return `${backButton()}<div class="game-meta"><span>RONDE ${state.round+1} / 10</span><span>${state.mode==='pass'?'📱 Pass and play':'✎ Narator + kertas'}</span></div><div class="progress-track" aria-label="Progres ronde"><div class="progress-fill" style="width:${(state.round+1)*10}%"></div></div>`}
function options(readOnly=false){return `<div class="choices">${q().slice(1).map((item,i)=>readOnly?`<div class="choice" aria-label="${'ABCD'[i]}: ${escapeHTML(item)}"><b>${'ABCD'[i]}</b><span>${escapeHTML(item)}</span></div>`:`<button class="choice" type="button" data-vote="${i}"><b>${'ABCD'[i]}</b><span>${escapeHTML(item)}</span></button>`).join('')}</div>`}
function question(){return `<section class="question-card"><div class="eyebrow">PILIH YANG MENURUTMU BAKAL DIPILIH ORANG LAIN</div><h2>${escapeHTML(q()[0])}</h2>${options(state.phase==='narrator')}</section>`}
function setup(){return `<section><div class="eyebrow">PARTY GAME SATU PONSEL</div><h1>Seberapa sama isi kepala kalian?</h1><p class="intro">Pilih jawaban diam-diam. Yang memilih jawaban terbanyak dapat poin. Setelah terbuka, baru boleh berdebat!</p><div class="card"><p class="section-title">Pilih cara main</p><div class="mode-grid"><button class="mode ${draftMode==='pass'?'selected':''}" type="button" data-mode="pass" aria-pressed="${draftMode==='pass'}"><span class="mode-icon">📱</span><strong>Pass and play</strong><small>Satu ponsel berputar. Pilihan dan skor dihitung otomatis.</small></button><button class="mode ${draftMode==='narrator'?'selected':''}" type="button" data-mode="narrator" aria-pressed="${draftMode==='narrator'}"><span class="mode-icon">✎</span><strong>Narator + kertas</strong><small>Narator baca soal. Semua pemain menulis pilihan sendiri.</small></button></div>${draftMode==='pass'?`<div class="field"><label for="names">Nama pemain (3–12 orang)</label><textarea id="names" placeholder="Contoh: Adit, Bela, Citra, Danu" spellcheck="false">${escapeHTML(draftNames)}</textarea><p class="hint">Pisahkan dengan koma atau baris baru. Semua pemain ikut menjawab.</p></div>`:`<div class="field"><label for="count">Jumlah pemain (3–20 orang)</label><input id="count" inputmode="numeric" type="number" min="3" max="20" value="${draftCount}"><p class="hint">Narator boleh ikut memilih. Tulis pilihan di kertas, lalu buka bersama.</p></div>`}${error?`<p class="error" role="alert">${escapeHTML(error)}</p>`:''}<div class="actions"><button class="primary" id="start" type="button">Mulai 10 ronde</button></div></div><details class="rules"><summary>Aturan singkat</summary><p>Pilihan paling banyak mendapat 1 poin per pemain yang memilihnya. Jika dua atau lebih pilihan berbagi suara tertinggi, ronde seri dan tidak ada poin. Dalam mode narator, catat skor pemain di kertas. Tidak ada jawaban objektif yang benar.</p></details></section>`}
function handoff(){const n=state.names[state.votes.length];return `<section class="card handoff center">${header()}<span class="handoff-bubble" aria-hidden="true">🔒</span><div class="eyebrow">GILIRAN ${state.votes.length+1} DARI ${state.names.length}</div><h2>Serahkan ponsel ke ${escapeHTML(n)}</h2><p class="subtext">Tekan tombol saat ponsel sudah di tanganmu. Pilihan pemain sebelumnya tersembunyi.</p><button class="primary" id="ready" type="button">Saya ${escapeHTML(n)}, lihat pertanyaan</button></section>`}
function voting(){return `${header()}<p class="eyebrow">${escapeHTML(state.names[state.votes.length])} SEDANG MEMILIH · JANGAN INTIP</p>${question()}<p class="muted-note">Ketuk satu pilihan. Pilihanmu langsung terkunci dan layar ditutup.</p>`}
function narrator(){const total=counts.reduce((a,b)=>a+b,0);return `${header()}${question()}<div class="card under-card"><h3>Buka jawaban serentak</h3><p class="subtext">Setelah semua menulis A/B/C/D, hitung suara tiap pilihan.</p><div class="vote-list">${q().slice(1).map((item,i)=>`<div class="vote-row"><div class="vote-label"><span class="result-letter">${'ABCD'[i]}</span><span>${escapeHTML(item)}</span></div><div class="stepper"><button type="button" data-step="${i}" data-delta="-1" aria-label="Kurangi suara ${'ABCD'[i]}">−</button><output aria-label="Suara ${'ABCD'[i]}">${counts[i]}</output><button type="button" data-step="${i}" data-delta="1" aria-label="Tambah suara ${'ABCD'[i]}">+</button></div></div>`).join('')}</div><p class="tally-status">${total} dari ${state.count} suara tercatat</p>${error?`<p class="error" role="alert">${escapeHTML(error)}</p>`:''}<div class="actions"><button class="primary" id="reveal" type="button" ${total!==state.count?'disabled':''}>Buka hasil</button></div></div>`}
function compute(votes){const tally=[0,0,0,0];votes.forEach(v=>tally[v]++);const max=Math.max(...tally);const winners=tally.map((n,i)=>n===max?i:-1).filter(i=>i>=0);return {tally,winner:winners.length===1?winners[0]:null}}
function result(){const r=state.results;if(!r)return setup();const top=r.winner===null?'Suara teratas seri!':`Pilihan ${'ABCD'[r.winner]} menang!`;const sub=r.winner===null?'Tidak ada poin pada ronde ini.':'Semua yang memilihnya mendapat 1 poin.';return `${header()}<section class="card"><div class="eyebrow">HASIL RONDE ${state.round+1}</div><h2>${top}</h2><p class="subtext">${sub}</p><p class="section-title">${escapeHTML(q()[0])}</p><div class="result-list">${q().slice(1).map((item,i)=>`<div class="result-row ${r.winner===i?'winner':''}"><div class="result-name"><span class="result-letter">${'ABCD'[i]}</span><span>${escapeHTML(item)}</span></div><strong>${r.tally[i]}</strong><div class="bar-track"><div class="bar" style="width:${r.tally[i]/state.count*100}%"></div></div></div>`).join('')}</div><div class="callout"><strong>Bela jawabanmu!</strong> Yang jawabannya paling berbeda, coba jelaskan alasannya.</div>${state.mode==='pass'?`<div class="scoreboard"><h3 style="margin:0">Skor sementara</h3>${state.names.map((n,i)=>({n,score:state.scores[i]})).sort((a,b)=>b.score-a.score).map(x=>`<div class="score-row"><span>${escapeHTML(x.n)}</span><strong>${x.score}</strong></div>`).join('')}</div>`:`<p class="muted-note">${r.winner===null?'Narator: ronde seri, tidak ada poin.':`Narator: beri 1 poin di kertas kepada setiap pemain yang memilih huruf ${'ABCD'[r.winner]}.`}</p>`}<div class="actions"><button class="primary" id="next" type="button">${state.round===9?'Lihat akhir permainan':'Ronde berikutnya'}</button></div></section>`}
function end(){let ranks=state.names.map((n,i)=>({n,score:state.scores[i]})).sort((a,b)=>b.score-a.score);return `${backButton()}<section class="card center"><span class="handoff-bubble" aria-hidden="true">🎉</span><div class="eyebrow">10 RONDE SELESAI</div><h1>Satu pikiran... atau beda planet?</h1>${state.mode==='pass'?`<p class="subtext">${ranks.length&&ranks[0].score===ranks[1]?.score?'Juara bersama: '+escapeHTML(ranks.filter(x=>x.score===ranks[0].score).map(x=>x.n).join(', ')):escapeHTML(ranks[0]?.n||'')} · ${ranks[0]?.score||0} poin</p><div class="scoreboard">${ranks.map((x,i)=>`<div class="score-row ${i===0?'leader':''}"><span>${i+1}. ${escapeHTML(x.n)}</span><strong>${x.score}</strong></div>`).join('')}</div>`:`<p class="subtext">Cek skor di kertas. Jika seri, kalian boleh berbagi gelar juara.</p>`}<div class="actions"><button class="primary" id="restart" type="button">Main lagi</button></div></section>`}
function render(){document.body.classList.toggle('dark',theme==='dark');document.getElementById('theme').innerHTML=theme==='dark'?'☀ <span>Terang</span>':'☾ <span>Gelap</span>';app.innerHTML=({setup,handoff,voting,narrator,result,end}[state.phase]||setup)();}
function begin(){if(draftMode==='pass'){const names=draftNames.split(/[,\n]+/).map(x=>x.trim()).filter(Boolean);if(names.length<3||names.length>12){error='Masukkan 3 sampai 12 nama pemain.';render();return}if(new Set(names.map(x=>x.toLocaleLowerCase('id'))).size!==names.length){error='Setiap pemain perlu nama yang berbeda.';render();return}state={phase:'handoff',mode:'pass',names,count:names.length,round:0,deck:shuffle(),votes:[],scores:names.map(()=>0),results:null,completed:[],tallyDraft:[0,0,0,0]}}else{const count=Number(draftCount);if(!Number.isInteger(count)||count<3||count>20){error='Jumlah pemain harus 3 sampai 20.';render();return}state={phase:'narrator',mode:'narrator',names:[],count,round:0,deck:shuffle(),votes:[],scores:[],results:null,completed:[],tallyDraft:[0,0,0,0]};counts=[0,0,0,0]}error='';save();render();}
function back(){
  if(state.phase==='voting') state.phase='handoff';
  else if(state.phase==='handoff' && state.votes.length){
    const name=state.names[state.votes.length-1];
    if(!window.confirm(`Batalkan pilihan ${name}? Serahkan ponsel kembali kepada ${name}.`))return;
    state.votes.pop();
  }else if(state.phase==='result'){
    if(state.mode==='pass'){
      if(!window.confirm('Hasil sudah dibuka. Batalkan pilihan pemain terakhir dan hitung ulang ronde ini?'))return;
      if(state.results.winner!==null)state.votes.forEach((v,i)=>{if(v===state.results.winner)state.scores[i]--});
      state.votes.pop();state.phase='handoff';
    }else{
      counts=[...state.results.tally];state.tallyDraft=[...counts];state.phase='narrator';
    }
    state.results=null;
  }else if(state.phase==='end')state.phase='result';
  else if(state.phase==='handoff' || state.phase==='narrator'){
    if(state.phase==='narrator' && counts.some(Boolean) && !window.confirm('Kembali akan membuang hitungan suara ronde ini. Lanjutkan?'))return;
    const previous=state.completed.pop();
    if(previous){state.round=previous.round;state.votes=previous.votes;state.results=previous.results;state.scores=previous.scores;state.phase='result';counts=state.mode==='narrator'?[...previous.results.tally]:[0,0,0,0];state.tallyDraft=[...counts]}
    else{draftMode=state.mode;draftNames=state.names.join(', ');draftCount=state.count;state=fresh();counts=[0,0,0,0]}
  }
  save();render();window.scrollTo(0,0);
}
app.addEventListener('input',e=>{if(e.target.id==='names')draftNames=e.target.value;if(e.target.id==='count')draftCount=e.target.value});
app.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.mode){draftMode=b.dataset.mode;error='';render();return}
 if(b.id==='back'){back();return}
 if(b.id==='start'){begin();return}
 if(b.id==='ready'){state.phase='voting';save();render();return}
 if(b.dataset.vote!==undefined && state.phase==='voting'){state.votes.push(Number(b.dataset.vote));if(state.votes.length===state.count){state.results=compute(state.votes);if(state.results.winner!==null)state.votes.forEach((v,i)=>{if(v===state.results.winner)state.scores[i]++});state.phase='result'}else state.phase='handoff';save();render();window.scrollTo(0,0);return}
 if(b.dataset.step!==undefined && state.phase==='narrator'){const i=Number(b.dataset.step),d=Number(b.dataset.delta),total=counts.reduce((a,c)=>a+c,0);if(counts[i]+d>=0 && total+d<=state.count){counts[i]+=d;state.tallyDraft=[...counts];error='';save();render()}return}
 if(b.id==='reveal' && state.phase==='narrator'){if(counts.reduce((a,c)=>a+c,0)!==state.count){error='Catat semua suara sebelum membuka hasil.';render();return}state.results=compute(counts.flatMap((n,i)=>Array(n).fill(i)));state.phase='result';save();render();window.scrollTo(0,0);return}
 if(b.id==='next' && state.phase==='result'){if(state.round===9)state.phase='end';else{state.completed.push({round:state.round,votes:[...state.votes],results:state.results,scores:[...state.scores]});state.round++;state.votes=[];state.results=null;counts=[0,0,0,0];state.tallyDraft=[...counts];state.phase=state.mode==='pass'?'handoff':'narrator'}save();render();window.scrollTo(0,0);return}
 if(b.id==='restart'){state=fresh();draftNames='';draftMode='pass';draftCount=5;counts=[0,0,0,0];error='';save();render();window.scrollTo(0,0)}
});
document.getElementById('theme').addEventListener('click',()=>{theme=theme==='dark'?'light':'dark';storageSet(THEME,theme);render()});
render();
