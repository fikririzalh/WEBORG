/*
 * WASITRA CARD — data lokal
 * Tidak memakai fetch agar aplikasi tetap bekerja saat index.html dibuka melalui file://.
 * Set daerah dan filosofi memuat adaptasi edukatif berbahasa Indonesia, bukan kutipan adat verbatim.
 */
(function () {
  "use strict";

  const toCards = (setId, entries) => entries.map((entry, index) => ({
    id: `${setId}-${String(index + 1).padStart(3, "0")}`,
    nomor: index + 1,
    teks: entry[0],
    arti: entry[1],
    kategori: entry[2],
    asalBudaya: entry[3]
  }));

  const popular = [
    ["Air beriak tanda tak dalam", "Orang yang banyak bicara sering kali kurang pengetahuan.", "Sikap", "Indonesia"],
    ["Air tenang menghanyutkan", "Orang yang pendiam dapat memiliki kemampuan besar.", "Karakter", "Indonesia"],
    ["Ada gula, ada semut", "Tempat yang memberi keuntungan akan menarik banyak orang.", "Kehidupan", "Indonesia"],
    ["Ada udang di balik batu", "Ada maksud tersembunyi di balik suatu tindakan.", "Kewaspadaan", "Indonesia"],
    ["Bagai air di daun talas", "Pendirian yang mudah berubah dan tidak tetap.", "Karakter", "Indonesia"],
    ["Bagai pinang dibelah dua", "Dua orang atau benda yang sangat mirip.", "Perbandingan", "Indonesia"],
    ["Berat sama dipikul, ringan sama dijinjing", "Kesulitan dan kemudahan dijalani bersama.", "Gotong royong", "Indonesia"],
    ["Berakit-rakit ke hulu, berenang-renang ke tepian", "Bersusah dahulu agar dapat menikmati hasil kemudian.", "Ketekunan", "Indonesia"],
    ["Bersatu kita teguh, bercerai kita runtuh", "Persatuan memberi kekuatan.", "Persatuan", "Indonesia"],
    ["Besar pasak daripada tiang", "Pengeluaran lebih besar daripada penghasilan.", "Keuangan", "Indonesia"],
    ["Biar lambat asal selamat", "Kehati-hatian lebih penting daripada tergesa-gesa.", "Kehati-hatian", "Indonesia"],
    ["Buah jatuh tidak jauh dari pohonnya", "Sifat anak sering menyerupai orang tuanya.", "Keluarga", "Indonesia"],
    ["Di mana bumi dipijak, di situ langit dijunjung", "Hormati adat dan aturan tempat kita berada.", "Tata krama", "Indonesia"],
    ["Diam-diam ubi berisi", "Orang pendiam dapat menyimpan banyak ilmu atau kemampuan.", "Karakter", "Indonesia"],
    ["Gajah di pelupuk mata tak tampak, semut di seberang lautan tampak", "Kesalahan sendiri diabaikan, kesalahan orang lain mudah terlihat.", "Introspeksi", "Indonesia"],
    ["Guru kencing berdiri, murid kencing berlari", "Teladan buruk dapat ditiru lebih buruk oleh orang lain.", "Keteladanan", "Indonesia"],
    ["Harimau mati meninggalkan belang, manusia mati meninggalkan nama", "Perbuatan menentukan nama yang dikenang.", "Reputasi", "Indonesia"],
    ["Hemat pangkal kaya", "Kebiasaan berhemat membantu membangun kecukupan.", "Keuangan", "Indonesia"],
    ["Karena nila setitik, rusak susu sebelanga", "Kesalahan kecil dapat merusak hasil yang besar.", "Kehati-hatian", "Indonesia"],
    ["Kecil-kecil cabai rawit", "Walau kecil atau muda, seseorang dapat sangat cakap.", "Kemampuan", "Indonesia"],
    ["Lain ladang lain belalang, lain lubuk lain ikannya", "Setiap tempat memiliki kebiasaan dan aturan berbeda.", "Keberagaman", "Indonesia"],
    ["Malu bertanya sesat di jalan", "Bertanya membantu menghindari kekeliruan.", "Belajar", "Indonesia"],
    ["Menang jadi arang, kalah jadi abu", "Pertikaian dapat merugikan semua pihak.", "Perdamaian", "Indonesia"],
    ["Nasi sudah menjadi bubur", "Sesuatu yang telanjur terjadi tidak dapat dikembalikan.", "Penerimaan", "Indonesia"],
    ["Rajin pangkal pandai", "Ketekunan belajar menumbuhkan kemampuan.", "Belajar", "Indonesia"],
    ["Sambil menyelam minum air", "Menyelesaikan beberapa tujuan dalam satu pekerjaan.", "Kecakapan", "Indonesia"],
    ["Sekali merengkuh dayung, dua tiga pulau terlampaui", "Satu tindakan yang tepat dapat mencapai beberapa hasil.", "Strategi", "Indonesia"],
    ["Sedikit demi sedikit, lama-lama menjadi bukit", "Hasil besar dapat terkumpul dari usaha kecil yang konsisten.", "Ketekunan", "Indonesia"],
    ["Seperti katak dalam tempurung", "Wawasan menjadi sempit karena kurang melihat dunia luar.", "Wawasan", "Indonesia"],
    ["Sedia payung sebelum hujan", "Persiapan dilakukan sebelum masalah datang.", "Kesiapan", "Indonesia"],
    ["Tak ada gading yang tak retak", "Tidak ada sesuatu yang sepenuhnya sempurna.", "Penerimaan", "Indonesia"],
    ["Tak kenal maka tak sayang", "Kedekatan tumbuh setelah saling mengenal.", "Hubungan", "Indonesia"],
    ["Tong kosong nyaring bunyinya", "Orang yang kurang ilmu kadang paling banyak bicara.", "Sikap", "Indonesia"],
    ["Sepandai-pandai tupai melompat, sekali waktu jatuh juga", "Orang yang sangat ahli pun dapat melakukan kesalahan.", "Kewaspadaan", "Indonesia"],
    ["Pucuk dicinta ulam tiba", "Mendapat sesuatu yang sudah lama diharapkan.", "Harapan", "Indonesia"],
    ["Musuh dalam selimut", "Orang dekat yang diam-diam berniat buruk.", "Kewaspadaan", "Indonesia"],
    ["Membagi sama adil, memotong sama panjang", "Berlaku adil kepada semua pihak.", "Keadilan", "Indonesia"],
    ["Kasih ibu sepanjang jalan, kasih anak sepanjang galah", "Kasih orang tua umumnya sangat luas dan panjang.", "Keluarga", "Indonesia"],
    ["Jauh di mata, dekat di hati", "Jarak tidak menghapus kedekatan batin.", "Hubungan", "Indonesia"],
    ["Jangan menilai buku dari sampulnya", "Jangan menilai sesuatu hanya dari penampilan.", "Kebijaksanaan", "Indonesia"],
    ["Habis gelap terbitlah terang", "Kesulitan dapat diikuti keadaan yang lebih baik.", "Harapan", "Indonesia"],
    ["Gali lubang tutup lubang", "Menyelesaikan satu masalah dengan membuat masalah baru.", "Keuangan", "Indonesia"],
    ["Duduk sama rendah, berdiri sama tinggi", "Setiap orang memiliki martabat yang setara.", "Kesetaraan", "Indonesia"],
    ["Diberi hati minta jantung", "Kebaikan yang diberikan dibalas dengan tuntutan berlebihan.", "Sikap", "Indonesia"],
    ["Datang tampak muka, pulang tampak punggung", "Kedatangan dan kepergian sebaiknya disampaikan dengan sopan.", "Tata krama", "Indonesia"],
    ["Cepat kaki ringan tangan", "Rajin bergerak dan suka menolong.", "Karakter", "Indonesia"],
    ["Cempedak berbuah nangka", "Memperoleh hasil yang tidak disangka-sangka.", "Kejutan", "Indonesia"],
    ["Bagai telur di ujung tanduk", "Berada dalam keadaan sangat genting.", "Risiko", "Indonesia"],
    ["Bagai pungguk merindukan bulan", "Mengharapkan sesuatu yang sangat sulit diraih.", "Harapan", "Indonesia"],
    ["Bagai kacang lupa kulitnya", "Melupakan asal-usul atau orang yang berjasa.", "Budi", "Indonesia"],
    ["Bagai makan buah simalakama", "Menghadapi dua pilihan yang sama-sama sulit.", "Dilema", "Indonesia"],
    ["Bagai menegakkan benang basah", "Mengerjakan sesuatu yang sangat sulit atau hampir sia-sia.", "Kesulitan", "Indonesia"],
    ["Bagai musang berbulu ayam", "Orang jahat yang berpura-pura baik.", "Kewaspadaan", "Indonesia"],
    ["Bagai pagar makan tanaman", "Orang yang seharusnya menjaga justru merusak.", "Tanggung jawab", "Indonesia"],
    ["Bagai anjing dengan kucing", "Dua pihak yang selalu bertengkar.", "Konflik", "Indonesia"],
    ["Bagai bumi dan langit", "Dua hal yang sangat berbeda.", "Perbandingan", "Indonesia"],
    ["Bagai mendapat durian runtuh", "Mendapat keuntungan besar yang tidak diduga.", "Keberuntungan", "Indonesia"],
    ["Bagai kerbau dicocok hidung", "Mengikuti kehendak orang lain tanpa pertimbangan sendiri.", "Kemandirian", "Indonesia"],
    ["Bagai api dalam sekam", "Masalah tersembunyi yang sewaktu-waktu dapat membesar.", "Konflik", "Indonesia"],
    ["Bagai mencari jarum dalam tumpukan jerami", "Mencari sesuatu yang sangat sulit ditemukan.", "Kesulitan", "Indonesia"],
    ["Bagai tikus jatuh ke lumbung", "Mendapat tempat yang penuh keuntungan.", "Keberuntungan", "Indonesia"],
    ["Bagaikan aur dengan tebing", "Saling membantu dan menguatkan.", "Gotong royong", "Indonesia"],
    ["Belum bertaji hendak berkokok", "Belum mampu tetapi sudah ingin menyombongkan diri.", "Sikap", "Indonesia"],
    ["Berani karena benar, takut karena salah", "Kebenaran menumbuhkan keberanian.", "Integritas", "Indonesia"],
    ["Berguru kepalang ajar, bagai bunga kembang tak jadi", "Belajar setengah hati membuat hasil tidak sempurna.", "Belajar", "Indonesia"],
    ["Berminyak air", "Berpura-pura rukun meski sebenarnya tidak.", "Hubungan", "Indonesia"],
    ["Bertepuk sebelah tangan", "Perasaan atau usaha yang tidak mendapat balasan.", "Hubungan", "Indonesia"],
    ["Biduk lalu kiambang bertaut", "Perselisihan keluarga akhirnya dapat berdamai kembali.", "Keluarga", "Indonesia"],
    ["Buruk muka cermin dibelah", "Menyalahkan pihak lain atas kekurangan sendiri.", "Introspeksi", "Indonesia"],
    ["Dari mata turun ke hati", "Rasa suka dapat tumbuh dari apa yang dilihat.", "Hubungan", "Indonesia"],
    ["Diberi betis hendak paha", "Sudah diberi sedikit lalu meminta lebih banyak.", "Sikap", "Indonesia"],
    ["Harapkan burung terbang tinggi, punai di tangan dilepaskan", "Mengejar yang belum pasti hingga kehilangan yang sudah dimiliki.", "Keputusan", "Indonesia"],
    ["Hancur badan dikandung tanah, budi baik dikenang juga", "Kebaikan seseorang akan tetap dikenang.", "Budi", "Indonesia"],
    ["Indah kabar dari rupa", "Kenyataan tidak sebaik kabar yang terdengar.", "Kenyataan", "Indonesia"],
    ["Kuman di seberang lautan tampak, gajah di pelupuk mata tak tampak", "Kekurangan orang lain terlihat, kekurangan sendiri terlupakan.", "Introspeksi", "Indonesia"],
    ["Lempar batu sembunyi tangan", "Berbuat salah lalu menghindari tanggung jawab.", "Tanggung jawab", "Indonesia"],
    ["Mati satu tumbuh seribu", "Kehilangan dapat diikuti banyak pengganti atau penerus.", "Regenerasi", "Indonesia"],
    ["Menggunting dalam lipatan", "Mencelakakan orang dari lingkungan dekat secara diam-diam.", "Kewaspadaan", "Indonesia"],
    ["Panas setahun dihapus hujan sehari", "Kebaikan lama dapat terlupakan karena satu kesalahan.", "Reputasi", "Indonesia"],
    ["Patah tumbuh hilang berganti", "Kehidupan terus berlanjut melalui pergantian.", "Regenerasi", "Indonesia"],
    ["Sekali lancung ke ujian, seumur hidup orang tak percaya", "Sekali berkhianat dapat merusak kepercayaan dalam waktu lama.", "Integritas", "Indonesia"],
    ["Tak lapuk oleh hujan, tak lekang oleh panas", "Nilai yang tetap bertahan sepanjang waktu.", "Keteguhan", "Indonesia"],
    ["Tangan mencencang, bahu memikul", "Pelaku harus menanggung akibat perbuatannya.", "Tanggung jawab", "Indonesia"],
    ["Tiada rotan, akar pun jadi", "Gunakan pengganti yang tersedia ketika pilihan utama tidak ada.", "Daya cipta", "Indonesia"],
    ["Utang emas dapat dibayar, utang budi dibawa mati", "Jasa dan kebaikan memiliki nilai yang mendalam.", "Budi", "Indonesia"],
    ["Zaman beralih, musim bertukar", "Keadaan berubah seiring waktu.", "Perubahan", "Indonesia"],
    ["Asam di gunung, garam di laut, bertemu dalam belanga", "Orang yang berjodoh dapat bertemu meski berasal dari tempat jauh.", "Pertemuan", "Indonesia"],
    ["Ayam bertelur di padi mati kelaparan", "Tidak mampu memanfaatkan sumber daya yang tersedia.", "Kecakapan", "Indonesia"],
    ["Bak ilmu padi, kian berisi kian merunduk", "Semakin berilmu sebaiknya semakin rendah hati.", "Rendah hati", "Indonesia"],
    ["Berjalan sampai ke batas, berlayar sampai ke pulau", "Pekerjaan sebaiknya diselesaikan sampai tuntas.", "Ketekunan", "Indonesia"],
    ["Dalam laut dapat diduga, dalam hati siapa tahu", "Isi hati seseorang sulit diketahui sepenuhnya.", "Kewaspadaan", "Indonesia"],
    ["Esa hilang dua terbilang", "Terus berusaha dengan keberanian dan kesiapan menghadapi risiko.", "Keberanian", "Indonesia"],
    ["Kalah membeli, menang memakai", "Barang bermutu dapat bernilai baik meski harganya lebih tinggi.", "Keputusan", "Indonesia"],
    ["Masuk kandang kambing mengembik, masuk kandang kerbau menguak", "Sesuaikan diri secara patut dengan lingkungan setempat.", "Adaptasi", "Indonesia"],
    ["Mulutmu harimaumu", "Ucapan dapat mendatangkan akibat bagi diri sendiri.", "Komunikasi", "Indonesia"],
    ["Tak ada akar, rotan pun jadi", "Manfaatkan alternatif yang tersedia.", "Daya cipta", "Indonesia"],
    ["Tak ada asap kalau tidak ada api", "Suatu kabar atau akibat biasanya memiliki sebab.", "Sebab akibat", "Indonesia"],
    ["Tua-tua keladi, makin tua makin menjadi", "Usia tidak selalu mengurangi semangat atau kebiasaan.", "Karakter", "Indonesia"],
    ["Yang dikejar tak dapat, yang dikandung berceceran", "Karena mengejar hal belum pasti, milik yang ada justru hilang.", "Keputusan", "Indonesia"],
    ["Ke bukit sama mendaki, ke lurah sama menurun", "Kebersamaan dijaga dalam keadaan apa pun.", "Persatuan", "Indonesia"]
  ];

  const regionalGroups = [
    ["Minangkabau", [
      ["Alam dibaca sebagai guru kehidupan", "Pengalaman dan lingkungan menjadi sumber pembelajaran."],
      ["Bulat air karena pembuluh, bulat kata karena mufakat", "Keputusan bersama memperoleh kekuatan dari musyawarah."],
      ["Duduk bersama membuka jalan, berdiri bersama menuntaskan kerja", "Kebersamaan membantu menyelesaikan urusan."],
      ["Adat dijaga, langkah pun terarah", "Nilai bersama memberi pedoman bertindak."],
      ["Rantau menguji diri, kampung menjaga akar", "Pengalaman baru dan asal-usul sama-sama penting."]
    ]],
    ["Jawa", [
      ["Alon-alon waton kelakon", "Ketelitian dan kesinambungan membantu tujuan tercapai."],
      ["Ajining diri saka lathi", "Martabat seseorang tampak dari ucapannya."],
      ["Sepi ing pamrih, rame ing gawe", "Bekerja sungguh-sungguh tanpa mengutamakan kepentingan pribadi."],
      ["Urip iku urup", "Hidup bermakna ketika memberi manfaat."],
      ["Memayu hayuning bawana", "Manusia ikut menjaga keselamatan dan keindahan dunia."]
    ]],
    ["Sunda", [
      ["Silih asah, silih asih, silih asuh", "Saling belajar, menyayangi, dan membimbing."],
      ["Cikaracak ninggang batu, laun-laun jadi legok", "Ketekunan kecil dapat menghasilkan perubahan."],
      ["Hade ku omong, goreng ku omong", "Ucapan dapat membawa kebaikan ataupun masalah."],
      ["Someah hade ka semah", "Keramahan kepada tamu mencerminkan budi baik."],
      ["Nyanghulu ka hukum, nunjang ka nagara", "Taat aturan dan berkontribusi pada kehidupan bersama."]
    ]],
    ["Bugis–Makassar", [
      ["Siri’ menjaga martabat, pacce menguatkan kepedulian", "Harga diri berjalan bersama empati."],
      ["Sekali layar terkembang, pantang surut ke pantai", "Tekad dijaga sampai tujuan tercapai."],
      ["Resopa temmangingngi namalomo naletei pammase dewata", "Kerja keras yang tekun membuka jalan bagi rahmat."],
      ["Tangan yang mendayung harus seirama", "Kerja bersama memerlukan arah yang selaras."],
      ["Janji diucap untuk dijaga", "Kepercayaan tumbuh dari kesetiaan pada janji."]
    ]],
    ["Bali", [
      ["Tat twam asi", "Menghormati orang lain seperti menghormati diri sendiri."],
      ["Tri hita karana menuntun keseimbangan", "Keharmonisan dibangun bersama Tuhan, manusia, dan alam."],
      ["Desa kala patra", "Tindakan perlu menyesuaikan tempat, waktu, dan keadaan."],
      ["Menyama braya", "Sesama diperlakukan sebagai saudara dalam kehidupan sosial."],
      ["Segilik seguluk salunglung sabayantaka", "Persatuan menguatkan masyarakat saat menghadapi tantangan."]
    ]],
    ["Batak", [
      ["Dalihan na tolu menjaga keseimbangan hubungan", "Setiap peran kekerabatan dihormati secara timbal balik."],
      ["Anakkon hi do hamoraon di au", "Pendidikan dan masa depan anak merupakan kekayaan berharga."],
      ["Jolo nidilat bibir asa nidok hata", "Pikirkan ucapan sebelum menyampaikannya."],
      ["Marsiadapari meringankan pekerjaan", "Saling membantu membuat beban lebih ringan."],
      ["Akar marga mengingatkan tanggung jawab", "Identitas keluarga membawa kewajiban menjaga nama baik."]
    ]],
    ["Aceh", [
      ["Adat bak poteumeureuhom, hukom bak syiah kuala", "Adat dan hukum agama ditempatkan dalam tatanan yang saling menjaga."],
      ["Panglima di laut, petuah di darat", "Keahlian dan kewenangan perlu dihormati sesuai bidangnya."],
      ["Meuseuraya membuat kerja berat terasa ringan", "Gotong royong memperkuat daya masyarakat."],
      ["Rumoh dijaga dengan mufakat", "Keluarga dan komunitas dirawat melalui kesepakatan."],
      ["Kopi boleh pahit, tutur tetap manis", "Keadaan sulit tidak membenarkan ucapan kasar."]
    ]],
    ["Melayu Riau", [
      ["Di mana ranting dipatah, di sana air disauk", "Hormati kebiasaan tempat kita hidup."],
      ["Hidup beradat, mati beriman", "Nilai sosial dan keyakinan menjadi tuntunan kehidupan."],
      ["Tuah hidup pada budi", "Kebaikan perilaku memberi kehormatan."],
      ["Laut luas tempat belajar, pantai teduh tempat pulang", "Pengalaman dan rumah sama-sama membentuk diri."],
      ["Kata bersusun menjaga perasaan", "Bahasa yang santun merawat hubungan."]
    ]],
    ["Banjar", [
      ["Kayuh baimbai", "Bergerak bersama membuat tujuan lebih mudah dicapai."],
      ["Gawi sabumi sampai manuntung", "Pekerjaan bersama dijalankan sampai selesai."],
      ["Waja sampai kaputing", "Tekad dipertahankan hingga akhir."],
      ["Sungai menghubungkan, bukan memisahkan", "Jalur kehidupan dapat mempererat pertukaran dan persaudaraan."],
      ["Baiman, bauntung, batuah", "Hidup diarahkan oleh iman, manfaat, dan kebajikan."]
    ]],
    ["Dayak", [
      ["Huma betang mengajarkan hidup berdampingan", "Perbedaan dapat tinggal dalam satu ruang yang saling menghormati."],
      ["Belom bahadat", "Kehidupan dijalani dengan menjunjung adat dan kesopanan."],
      ["Hutan dijaga, kehidupan terpelihara", "Kelestarian alam menopang keberlanjutan masyarakat."],
      ["Satu rumah, banyak suara, satu mufakat", "Keberagaman pandangan dapat dipertemukan."],
      ["Jejak leluhur menjadi pengingat, bukan batas langkah", "Warisan memberi arah sambil tetap membuka perubahan."]
    ]],
    ["Sasak", [
      ["Besiru menguatkan kerja kampung", "Saling membantu membangun ketahanan bersama."],
      ["Saling perasak menjaga rasa persaudaraan", "Kepekaan terhadap sesama merawat hubungan."],
      ["Air dari Rinjani dipakai dengan tanggung jawab", "Sumber alam perlu dibagi dan dijaga."],
      ["Tutur halus membuka pintu musyawarah", "Kesantunan memudahkan penyelesaian masalah."],
      ["Lumbung terisi karena kerja yang tertib", "Kesiapan masa depan dibangun melalui disiplin."]
    ]],
    ["Betawi", [
      ["Biar rumah sederhana, pintu ramah tetap terbuka", "Keramahan tidak ditentukan oleh kemewahan."],
      ["Palang pintu menguji kesiapan dan adab", "Keberanian perlu berjalan bersama kesopanan."],
      ["Kerak telor matang karena sabar menjaga bara", "Hasil baik memerlukan ketelatenan."],
      ["Jawara sejati menjaga, bukan mengganggu", "Kekuatan seharusnya dipakai untuk melindungi."],
      ["Ngumpul boleh ramai, hati jangan tercerai", "Kegembiraan bersama perlu menjaga kerukunan."]
    ]],
    ["Madura", [
      ["Tangan bekerja, harga diri terjaga", "Kerja sungguh-sungguh menopang martabat."],
      ["Laut keras mengajarkan keberanian", "Tantangan dapat membentuk ketangguhan."],
      ["Taretan dijaga dalam susah dan senang", "Persaudaraan memerlukan kesetiaan."],
      ["Garam sedikit memberi rasa pada banyak hidangan", "Kontribusi kecil dapat berdampak luas."],
      ["Keberanian tanpa kendali melukai kehormatan", "Ketegasan perlu disertai pertimbangan."]
    ]],
    ["Papua", [
      ["Satu tungku tiga batu", "Perbedaan dapat menopang satu kehidupan bersama."],
      ["Noken membawa hasil dan tanggung jawab", "Keterampilan, kerja, dan kepedulian diwariskan bersama."],
      ["Gunung tinggi dilalui dengan langkah sekawan", "Kebersamaan membantu melewati tantangan besar."],
      ["Hutan adalah dapur, apotek, dan sekolah", "Alam memenuhi kebutuhan sekaligus memberi pengetahuan."],
      ["Suara honai menghangatkan mufakat", "Ruang bersama penting untuk mendengar dan memutuskan."]
    ]],
    ["Maluku", [
      ["Pela gandong merawat persaudaraan", "Ikatan antarkomunitas dijaga melalui saling membantu."],
      ["Sagu salempeng dipatah dua", "Rezeki sederhana dapat dibagi dengan sesama."],
      ["Ale rasa beta rasa", "Apa yang dirasakan orang lain turut menjadi kepedulian kita."],
      ["Laut memberi jalan bagi saudara untuk bertemu", "Jarak dapat menjadi penghubung, bukan pemisah."],
      ["Cengkih harum karena dirawat bersama", "Warisan bernilai bertahan melalui kerja kolektif."]
    ]],
    ["Nusa Tenggara Timur", [
      ["Tiga batu tungku menjaga api kehidupan", "Peran yang berbeda saling menopang keluarga dan komunitas."],
      ["Tenun kuat karena benang saling mengikat", "Persatuan lahir dari hubungan yang dirawat."],
      ["Air sedikit dibagi dengan adil", "Kelangkaan menuntut tanggung jawab dan keadilan."],
      ["Lontar tumbuh sabar di tanah kering", "Ketahanan terbentuk melalui ketekunan menghadapi keadaan."],
      ["Sirih pinang membuka percakapan", "Penghormatan menciptakan ruang untuk bermusyawarah."]
    ]],
    ["Lampung", [
      ["Piil pesenggiri menjaga martabat melalui perilaku", "Harga diri dibangun lewat tanggung jawab sosial."],
      ["Sakai sambayan", "Gotong royong memperkuat kehidupan bersama."],
      ["Nemui nyimah", "Keramahan dan kemurahan hati merawat persaudaraan."],
      ["Nengah nyappur", "Aktif bergaul membantu membangun kepedulian sosial."],
      ["Juluk adek mengingatkan amanah nama", "Gelar dan kedudukan membawa tanggung jawab."]
    ]],
    ["Rejang", [
      ["Gunung dijaga, mata air tetap bicara", "Merawat hulu melindungi kehidupan di hilir."],
      ["Petulai kuat karena anggotanya saling menopang", "Kekerabatan bertahan melalui tanggung jawab bersama."],
      ["Kerja ladang dimulai dari membaca musim", "Keputusan yang baik memperhatikan tanda alam."],
      ["Musyawarah memberi tempat bagi suara yang kecil", "Keputusan adil mendengar semua pihak."],
      ["Warisan diterima untuk dirawat dan dikembangkan", "Tradisi hidup melalui pemeliharaan dan pembaruan."]
    ]],
    ["Gorontalo", [
      ["Adat bersendikan syarak, syarak bersendikan Kitabullah", "Adat dan nilai agama saling menjadi rujukan."],
      ["Huyula meringankan beban", "Gotong royong menjadi daya masyarakat."],
      ["Duluo limo lo pohalaa", "Persatuan wilayah dan kelompok memperkuat kebersamaan."],
      ["Danau dijaga dari tepi hingga hulu", "Kelestarian memerlukan tanggung jawab lintas tempat."],
      ["Tamu dihormati, rumah dimuliakan", "Keramahan mencerminkan kehormatan tuan rumah."]
    ]],
    ["Toraja", [
      ["Tongkonan menyimpan ingatan dan tanggung jawab keluarga", "Rumah adat mengikat sejarah, peran, dan kebersamaan."],
      ["Misa’ kada dipotuo, pantan kada dipomate", "Persatuan menghidupkan, perpecahan melemahkan."],
      ["Ukiran berbeda menyusun satu cerita", "Keragaman unsur membentuk identitas bersama."],
      ["Kerbau kuat pun perlu arah", "Kekuatan menjadi berguna ketika dipandu tujuan."],
      ["Jalan berbatu ditempuh dengan saling menunggu", "Kemajuan bersama memberi ruang bagi setiap orang."]
    ]]
  ];

  const regional = regionalGroups.flatMap(([culture, sayings]) => sayings.map((item) => [
    item[0], item[1], "Adaptasi edukatif", culture
  ]));

  const philosophyConcepts = [
    ["Gotong royong", "daya bersama untuk menyelesaikan kebutuhan bersama", "Nusantara"],
    ["Musyawarah", "mendengar pandangan sebelum mengambil keputusan", "Nusantara"],
    ["Bhinneka Tunggal Ika", "persatuan yang tetap mengakui perbedaan", "Indonesia"],
    ["Pancasila", "nilai dasar hidup berbangsa dan bermasyarakat", "Indonesia"],
    ["Tri Hita Karana", "keseimbangan hubungan dengan Tuhan, manusia, dan alam", "Bali"],
    ["Tat Twam Asi", "kesadaran bahwa diri dan sesama saling terhubung", "Bali"],
    ["Siri’ na pacce", "martabat yang disertai empati dan solidaritas", "Bugis–Makassar"],
    ["Dalihan Na Tolu", "keseimbangan peran dan penghormatan dalam kekerabatan", "Batak"],
    ["Alam takambang jadi guru", "alam dan pengalaman sebagai sumber pengetahuan", "Minangkabau"],
    ["Silih asah, silih asih, silih asuh", "saling belajar, menyayangi, dan membimbing", "Sunda"],
    ["Hamemayu hayuning bawana", "upaya menjaga keselamatan dan keindahan dunia", "Jawa"],
    ["Pela gandong", "persaudaraan lintas komunitas yang saling menjaga", "Maluku"],
    ["Satu tungku tiga batu", "perbedaan penopang yang menyatu dalam kehidupan", "Papua"],
    ["Huma betang", "hidup bersama dalam keberagaman dan kesetaraan", "Kalimantan"],
    ["Piil pesenggiri", "martabat yang diwujudkan melalui tanggung jawab sosial", "Lampung"],
    ["Sakai sambayan", "kerja bersama dan saling membantu", "Lampung"],
    ["Huyula", "gotong royong yang mengikat kehidupan komunitas", "Gorontalo"],
    ["Kayuh baimbai", "gerak serempak untuk mencapai tujuan", "Banjar"],
    ["Menyama braya", "memandang sesama sebagai saudara", "Bali"],
    ["Waja sampai kaputing", "keteguhan menyelesaikan perjuangan hingga akhir", "Banjar"]
  ];

  const contexts = [
    ["keluarga", "membagi peran secara adil dan merawat rasa aman"],
    ["komunitas", "mendahulukan kepentingan bersama tanpa menghapus suara pribadi"],
    ["kepemimpinan", "mengubah wewenang menjadi tanggung jawab dan teladan"],
    ["pekerjaan", "menyatukan ketekunan, kecakapan, dan kepercayaan"],
    ["lingkungan", "memakai sumber daya secukupnya sambil menjaga keberlanjutan"]
  ];

  const philosophy = philosophyConcepts.flatMap(([name, explanation, culture]) => contexts.map(([context, action]) => [
    `${name} dalam ${context}: ${action}.`,
    `${name} dimaknai sebagai ${explanation}; penerapannya pada ${context} menekankan cara untuk ${action}.`,
    `Penerapan nilai`,
    culture
  ]));

  const pantunOpenings = [
    ["Pagi cerah menanam melati", "Burung bernyanyi dekat halaman"],
    ["Pergi ke pasar membeli roti", "Singgah sebentar di tepi taman"],
    ["Naik perahu saat mentari", "Dayung disimpan dekat haluan"],
    ["Kain batik dijemur pagi", "Angin berembus dari pegunungan"],
    ["Anak rusa berlari-lari", "Teduh berteduh bawah rambutan"],
    ["Bunga kenanga harum sekali", "Tumbuh berbaris dekat jalanan"],
    ["Padi menguning siap dituai", "Petani pulang menjelang petang"],
    ["Ke sungai jernih mencuci kendi", "Air mengalir melewati jembatan"],
    ["Burung merpati terbang tinggi", "Hinggap sebentar di atas dahan"],
    ["Pohon kelapa melambai pagi", "Bayang memanjang ke arah lautan"]
  ];

  const pantunClosings = [
    ["Rajin belajar setiap hari", "Ilmu bertambah, luas wawasan", "Belajar", "Ketekunan belajar memperluas pengetahuan."],
    ["Jaga tutur sepenuh hati", "Agar damai tumbuh bertahan", "Tata krama", "Ucapan yang baik membantu menjaga kedamaian."],
    ["Bantu sesama setulus hati", "Beban terbagi, erat pertemanan", "Gotong royong", "Ketulusan menolong memperkuat persahabatan."],
    ["Berani jujur pada diri", "Kepercayaan datang perlahan", "Integritas", "Kejujuran membangun kepercayaan."],
    ["Rawat alam mulai hari ini", "Hijau terjaga bagi masa depan", "Lingkungan", "Kebiasaan merawat alam menjaga masa depan."],
    ["Hargai beda sepenuh hati", "Rukun terjalin dalam keragaman", "Persatuan", "Saling menghormati merawat kerukunan."],
    ["Susun rencana dengan teliti", "Langkah terarah menuju tujuan", "Kesiapan", "Perencanaan membantu tindakan lebih terarah."],
    ["Jika keliru, perbaiki diri", "Minta maaf membuka kedamaian", "Introspeksi", "Mengakui kesalahan membantu memulihkan hubungan."],
    ["Hemat dipupuk sejak dini", "Cukup terjaga saat diperlukan", "Keuangan", "Berhemat membantu kesiapan menghadapi kebutuhan."],
    ["Pegang janji sepenuh hati", "Nama terjaga dalam pergaulan", "Tanggung jawab", "Menepati janji menjaga kepercayaan."]
  ];

  const pantun = pantunOpenings.flatMap((opening) => pantunClosings.map((closing) => [
    `${opening[0]}\n${opening[1]}\n${closing[0]}\n${closing[1]}`,
    closing[3],
    closing[2],
    "Pantun Nusantara — karya editorial"
  ]));

  const wisdomValues = [
    ["Kejujuran", "menyampaikan yang benar meski tidak selalu nyaman", "Integritas", "Nusantara"],
    ["Ketekunan", "kembali mencoba setelah menghadapi kesulitan", "Daya juang", "Nusantara"],
    ["Kerendahan hati", "tetap mau belajar ketika kemampuan bertambah", "Karakter", "Nusantara"],
    ["Keberanian", "mengambil sikap setelah memahami risikonya", "Karakter", "Nusantara"],
    ["Kesabaran", "memberi waktu bagi proses yang memang memerlukannya", "Pengendalian diri", "Nusantara"],
    ["Keadilan", "menimbang kebutuhan dan hak setiap pihak", "Kehidupan sosial", "Nusantara"],
    ["Kepedulian", "peka pada beban yang tidak selalu diucapkan", "Empati", "Nusantara"],
    ["Tanggung jawab", "menuntaskan kewajiban dan menerima akibat pilihan", "Integritas", "Nusantara"],
    ["Kebersamaan", "menyatukan kemampuan tanpa menyeragamkan semua orang", "Persatuan", "Nusantara"],
    ["Kebijaksanaan", "memikirkan dampak sebelum menentukan tindakan", "Keputusan", "Nusantara"],
    ["Rasa syukur", "menghargai yang dimiliki sambil tetap bertumbuh", "Karakter", "Nusantara"],
    ["Disiplin", "menjaga kebiasaan baik saat tidak ada yang mengawasi", "Kebiasaan", "Nusantara"],
    ["Tenggang rasa", "memberi ruang bagi keadaan dan perasaan orang lain", "Empati", "Nusantara"],
    ["Kemandirian", "menggunakan kemampuan sendiri dan tahu kapan meminta bantuan", "Kecakapan", "Nusantara"],
    ["Keluwesan", "menyesuaikan cara tanpa kehilangan nilai utama", "Adaptasi", "Nusantara"],
    ["Kesetiaan", "menjaga komitmen dalam keadaan mudah maupun sulit", "Hubungan", "Nusantara"],
    ["Ketelitian", "memeriksa hal kecil sebelum menjadi persoalan besar", "Kecakapan", "Nusantara"],
    ["Kedermawanan", "membagi sesuai kemampuan dengan niat yang tulus", "Budi", "Nusantara"],
    ["Keseimbangan", "memberi porsi yang sehat bagi kerja, istirahat, dan relasi", "Kehidupan", "Nusantara"],
    ["Harapan", "melihat kemungkinan sambil tetap berpijak pada tindakan", "Daya juang", "Nusantara"]
  ];

  const wisdomFrames = [
    (value, action) => `${value} tampak saat kita ${action}.`,
    (value, action) => `Rawat ${value.toLowerCase()}; mulailah dengan ${action}.`,
    (value, action) => `${value} tumbuh dari kebiasaan untuk ${action}.`,
    (value, action) => `Ujian bagi ${value.toLowerCase()} adalah tetap ${action}.`,
    (value, action) => `Langkah kecil dalam ${value.toLowerCase()} berarti ${action}.`
  ];

  const wisdom = wisdomValues.flatMap(([value, action, category, culture]) => wisdomFrames.map((frame) => [
    frame(value, action),
    `${value} dipraktikkan melalui tindakan nyata: ${action}.`,
    category,
    `${culture} — karya editorial`
  ]));

  window.WASITRA_SETS = [
    {
      id: "set-1",
      kode: "P-01",
      judul: "Peribahasa Indonesia Populer",
      deskripsi: "Ungkapan yang umum digunakan untuk membaca sikap, pengalaman, dan hubungan sosial.",
      aksen: "merah",
      catatan: "Kumpulan peribahasa umum dalam bahasa Indonesia.",
      cards: toCards("P01", popular)
    },
    {
      id: "set-2",
      kode: "N-02",
      judul: "Pepatah Daerah Nusantara",
      deskripsi: "Nilai dari berbagai daerah, disajikan dalam bahasa Indonesia agar mudah dimainkan.",
      aksen: "nila",
      catatan: "Memuat ungkapan dan adaptasi edukatif; bukan dokumentasi adat verbatim.",
      cards: toCards("N02", regional)
    },
    {
      id: "set-3",
      kode: "F-03",
      judul: "Filosofi Budaya Indonesia",
      deskripsi: "Konsep budaya dan contoh penerapannya pada keluarga, komunitas, kerja, serta alam.",
      aksen: "emas",
      catatan: "Interpretasi edukatif untuk permainan dan diskusi.",
      cards: toCards("F03", philosophy)
    },
    {
      id: "set-4",
      kode: "T-04",
      judul: "Pantun Indonesia",
      deskripsi: "Seratus pantun empat baris bertema belajar, budi, persatuan, dan kehidupan.",
      aksen: "hijau",
      catatan: "Pantun orisinal yang disusun untuk WASITRA CARD.",
      cards: toCards("T04", pantun)
    },
    {
      id: "set-5",
      kode: "B-05",
      judul: "Kata Bijak Nusantara",
      deskripsi: "Refleksi singkat tentang karakter, tanggung jawab, hubungan, dan daya juang.",
      aksen: "biru",
      catatan: "Karya editorial orisinal, terinspirasi nilai kehidupan Nusantara.",
      cards: toCards("B05", wisdom)
    }
  ];
})();
