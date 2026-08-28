const FISHY_CARDS = [
  // 🇮🇩 INDONESIA & CULTURE
  {id:'Q001',category:'🇮🇩 Indonesia',question:'Indonesia itu negara kepulauan level "scroll-nya panjang". Lebih dari berapa ribu pulau yang menyusunnya?',answer:'Lebih dari 17.000 pulau',fact:'World Bank menyebut Indonesia terdiri dari lebih dari 17.000 pulau.',source:'World Bank — Indonesia',sourceUrl:'https://www.worldbank.org/ext/en/country/indonesia'},
  {id:'Q002',category:'🇮🇩 Indonesia',question:'Kalau semua kelompok etnis di Indonesia bikin grup chat, jumlahnya lebih dari berapa ratus?',answer:'Lebih dari 300 kelompok etnis',fact:'World Bank mencatat Indonesia memiliki lebih dari 300 kelompok etnis.',source:'World Bank — Indonesia',sourceUrl:'https://www.worldbank.org/ext/en/country/indonesia'},
  {id:'Q003',category:'🏛️ Budaya',question:'Borobudur dibangun kira-kira pada abad berapa? Jangan jawab "zaman dulu banget".',answer:'Abad ke-8 dan ke-9 Masehi',fact:'UNESCO menyebut Borobudur dibangun pada abad ke-8 dan ke-9 pada masa Dinasti Syailendra.',source:'UNESCO — Borobudur',sourceUrl:'https://whc.unesco.org/en/list/592/'},
  {id:'Q004',category:'🏛️ Budaya',question:'Borobudur berada di sebuah lembah di Jawa Tengah. Nama lembahnya apa?',answer:'Lembah Kedu',fact:'UNESCO menempatkan kompleks Borobudur di Kedu Valley, bagian selatan Jawa Tengah.',source:'UNESCO — Borobudur',sourceUrl:'https://whc.unesco.org/en/list/592/'},
  {id:'Q005',category:'🎨 Budaya',question:'Warisan tekstil Indonesia apa yang tercantum dalam daftar budaya takbenda UNESCO?',answer:'Batik Indonesia',fact:'Indonesian Batik tercantum sebagai warisan budaya takbenda UNESCO.',source:'UNESCO — Indonesia ICH',sourceUrl:'https://ich.unesco.org/en/state/indonesia-ID'},
  {id:'Q006',category:'🎵 Budaya',question:'Instrumen bambu Indonesia apa yang masuk daftar warisan budaya takbenda UNESCO?',answer:'Angklung',fact:'Indonesian Angklung tercantum dalam daftar warisan budaya takbenda UNESCO.',source:'UNESCO — Indonesia ICH',sourceUrl:'https://ich.unesco.org/en/state/indonesia-ID'},
  {id:'Q007',category:'🎵 Budaya',question:'Ansambel musik Indonesia apa yang UNESCO akui sebagai warisan budaya takbenda?',answer:'Gamelan',fact:'Gamelan termasuk elemen budaya Indonesia yang tercantum dalam daftar UNESCO.',source:'UNESCO — Indonesia ICH',sourceUrl:'https://ich.unesco.org/en/state/indonesia-ID'},
  {id:'Q008',category:'🗿 Budaya',question:'Benda pusaka berbilah khas Indonesia apa yang ada dalam daftar budaya takbenda UNESCO?',answer:'Keris / Kris',fact:'Indonesian Kris tercantum pada daftar budaya Indonesia UNESCO.',source:'UNESCO — Indonesia',sourceUrl:'https://www.unesco.org/en/countries/id/lists-and-nominations'},
  {id:'Q009',category:'🎭 Budaya',question:'Seni pertunjukan boneka Indonesia apa yang tercantum di UNESCO?',answer:'Wayang',fact:'Wayang puppet theatre tercantum dalam daftar budaya Indonesia UNESCO.',source:'UNESCO — Indonesia',sourceUrl:'https://www.unesco.org/en/countries/id/lists-and-nominations'},
  {id:'Q010',category:'🧶 Budaya',question:'Tas rajut atau anyam multifungsi tradisional dari Papua yang masuk UNESCO namanya apa?',answer:'Noken',fact:'UNESCO mencatat noken sebagai kerajinan tas multifungsi masyarakat Papua.',source:'UNESCO — Indonesia ICH',sourceUrl:'https://ich.unesco.org/en/state/indonesia-ID'},
  {id:'Q011',category:'💃 Budaya',question:'Tarian dari Aceh yang tercantum UNESCO dan terkenal dengan gerak serempak duduk berbaris adalah apa?',answer:'Tari Saman',fact:'Saman dance tercantum sebagai elemen budaya Indonesia di UNESCO.',source:'UNESCO — Indonesia ICH',sourceUrl:'https://ich.unesco.org/en/state/indonesia-ID'},
  {id:'Q012',category:'⛵ Budaya',question:'Tradisi pembuatan kapal dari Sulawesi Selatan yang diakui UNESCO namanya apa?',answer:'Pinisi',fact:'UNESCO mencatat Pinisi sebagai seni pembuatan kapal masyarakat Sulawesi Selatan.',source:'UNESCO — Indonesia',sourceUrl:'https://www.unesco.org/archives/multimedia/producer/indonesia'},
  {id:'Q013',category:'🥋 Budaya',question:'Seni bela diri Indonesia apa yang masuk daftar warisan budaya takbenda UNESCO?',answer:'Pencak Silat',fact:'Traditions of Pencak Silat tercantum sebagai warisan budaya takbenda Indonesia.',source:'UNESCO — Indonesia ICH',sourceUrl:'https://ich.unesco.org/en/state/indonesia-ID'},
  {id:'Q014',category:'🗣️ Budaya',question:'Tradisi lisan berima yang dimiliki Indonesia dan Malaysia serta tercantum UNESCO disebut apa?',answer:'Pantun',fact:'Pantun tercantum UNESCO sebagai tradisi lisan bersama di kawasan Melayu.',source:'UNESCO — Indonesia',sourceUrl:'https://www.unesco.org/archives/multimedia/producer/indonesia'},
  {id:'Q015',category:'🌿 Budaya',question:'Budaya kesehatan tradisional Indonesia berbahan ramuan yang masuk UNESCO disebut apa?',answer:'Jamu',fact:'Budaya jamu Indonesia telah tercantum dalam daftar warisan budaya takbenda UNESCO.',source:'UNESCO — Indonesia ICH',sourceUrl:'https://ich.unesco.org/en/state/indonesia-ID'},
  {id:'Q016',category:'🦎 Indonesia',question:'Taman nasional Indonesia yang namanya sama dengan kadal raksasa ikoniknya adalah apa?',answer:'Taman Nasional Komodo',fact:'Komodo National Park tercantum sebagai Situs Warisan Dunia UNESCO.',source:'UNESCO — Indonesia WH',sourceUrl:'https://whc.unesco.org/en/statesparties/id'},
  {id:'Q017',category:'🌿 Indonesia',question:'Taman nasional di ujung barat Pulau Jawa yang masuk Situs Warisan Dunia UNESCO adalah apa?',answer:'Taman Nasional Ujung Kulon',fact:'Ujung Kulon National Park tercantum dalam daftar nominasi dan warisan Indonesia UNESCO.',source:'UNESCO — Indonesia',sourceUrl:'https://www.unesco.org/en/countries/id/lists-and-nominations'},
  {id:'Q018',category:'🏛️ Indonesia',question:'Kompleks candi Hindu besar di dekat Yogyakarta yang masuk Warisan Dunia UNESCO bernama apa?',answer:'Prambanan',fact:'Prambanan Temple Compounds tercantum sebagai Situs Warisan Dunia Indonesia.',source:'UNESCO — Indonesia WH',sourceUrl:'https://whc.unesco.org/en/statesparties/id'},
  {id:'Q019',category:'🍳 Kuliner',question:'Makanan Betawi seperti omelet gurih yang sering muncul di festival Jakarta disebut apa?',answer:'Kerak Telor',fact:'Situs resmi pariwisata Indonesia menyebut Kerak Telor sebagai hidangan Betawi ikonik.',source:'Wonderful Indonesia — Jakarta',sourceUrl:'https://www.indonesia.travel/gb/en/destination/java/jakarta'},
  {id:'Q020',category:'🌾 Indonesia',question:'Daerah di Bali yang dikenal sebagai pusat budaya dan seni serta dekat terasering hijau terkenal adalah apa?',answer:'Ubud',fact:'Wonderful Indonesia menggambarkan Ubud sebagai jantung budaya dan seni Bali.',source:'Wonderful Indonesia — Bali',sourceUrl:'https://www.indonesia.travel/gb/en/destination/bali-nusa-tenggara/bali'},

  // 🚀 SPACE
  {id:'Q021',category:'🚀 Space',question:'Dua planet mana yang literally tidak punya bulan alami?',answer:'Merkurius dan Venus',fact:'NASA menyebut Merkurius dan Venus sebagai dua planet tanpa bulan.',source:'NASA — Solar System Facts',sourceUrl:'https://science.nasa.gov/solar-system/solar-system-facts/'},
  {id:'Q022',category:'🔥 Space',question:'Planet terpanas di Tata Surya ternyata bukan yang paling dekat ke Matahari. Planet apa?',answer:'Venus',fact:'Atmosfer Venus menjebak panas sehingga permukaannya menjadi yang terpanas di Tata Surya.',source:'NASA — Venus Facts',sourceUrl:'https://science.nasa.gov/venus/venus-facts/'},
  {id:'Q023',category:'🌀 Space',question:'Planet mana yang muternya berlawanan arah dibanding kebanyakan planet?',answer:'Venus',fact:'NASA mencatat Venus berotasi perlahan dengan arah berlawanan dari sebagian besar planet.',source:'NASA — Venus Facts',sourceUrl:'https://science.nasa.gov/venus/venus-facts/'},
  {id:'Q024',category:'🛌 Space',question:'Planet mana yang rotasinya hampir seperti rebahan menyamping?',answer:'Uranus',fact:'Sumbu Uranus miring hampir 90 derajat sehingga tampak berputar di sisinya.',source:'NASA — Uranus',sourceUrl:'https://science.nasa.gov/uranus/'},
  {id:'Q025',category:'🪐 Space',question:'Planet mana yang paling rendah densitasnya di Tata Surya?',answer:'Saturnus',fact:'NASA menyebut Saturnus sebagai planet dengan densitas paling rendah.',source:'NASA — Uranus Facts',sourceUrl:'https://science.nasa.gov/uranus/facts/'},
  {id:'Q026',category:'💨 Space',question:'Planet mana yang mendapat gelar dunia paling berangin di Tata Surya?',answer:'Neptunus',fact:'Angin Neptunus dapat melaju lebih dari 2.000 km/jam menurut NASA.',source:'NASA — Neptune Facts',sourceUrl:'https://science.nasa.gov/neptune/neptune-facts/'},
  {id:'Q027',category:'🚀 Space',question:'Ada berapa planet resmi di Tata Surya kita?',answer:'8 planet',fact:'NASA mencantumkan delapan planet: Merkurius sampai Neptunus.',source:'NASA — Planets',sourceUrl:'https://science.nasa.gov/solar-system/planets/'},
  {id:'Q028',category:'🧊 Space',question:'NASA mengakui berapa planet katai bernama resmi di Tata Surya?',answer:'5 planet katai',fact:'Ceres, Pluto, Haumea, Makemake, dan Eris adalah lima planet katai yang diakui resmi.',source:'NASA — Planets',sourceUrl:'https://science.nasa.gov/solar-system/planets/'},
  {id:'Q029',category:'🌌 Space',question:'Matahari kita tinggal di bagian kecil Bima Sakti yang disebut lengan apa?',answer:'Orion Arm / Orion Spur',fact:'NASA menempatkan Tata Surya di Orion Arm atau Orion Spur Bima Sakti.',source:'NASA — Solar System Facts',sourceUrl:'https://science.nasa.gov/solar-system/solar-system-facts/'},
  {id:'Q030',category:'🏎️ Space',question:'Tata Surya ternyata ikut ngebut mengitari pusat galaksi. Kira-kira kecepatannya berapa km/jam?',answer:'Sekitar 828.000 km/jam',fact:'NASA memperkirakan Tata Surya mengorbit pusat galaksi sekitar 515.000 mph atau 828.000 km/jam.',source:'NASA — Solar System Facts',sourceUrl:'https://science.nasa.gov/solar-system/solar-system-facts/'},
  {id:'Q031',category:'🌧️ Space',question:'Bulan Saturnus mana yang punya hujan, sungai, dan danau—tapi bukan dari air?',answer:'Titan',fact:'Titan memiliki hujan, sungai, dan danau yang terdiri terutama dari metana dan etana.',source:'NASA — Ocean Worlds',sourceUrl:'https://science.nasa.gov/universe/exoplanets/life-in-our-solar-system-meet-the-neighbors/'},
  {id:'Q032',category:'🌕 Space',question:'Apa nama dua bulan kecil yang mengorbit Mars?',answer:'Phobos dan Deimos',fact:'Mars memiliki dua bulan, Phobos dan Deimos.',source:'NASA Space Place — Moons',sourceUrl:'https://spaceplace.nasa.gov/how-many-moons/'},
  {id:'Q033',category:'🪐 Space',question:'Planet paling besar di Tata Surya adalah siapa si paling jumbo?',answer:'Jupiter',fact:'Jupiter adalah planet terbesar di Tata Surya.',source:'NASA — Planets',sourceUrl:'https://science.nasa.gov/solar-system/planets/'},
  {id:'Q034',category:'⏱️ Space',question:'Satu tahun di Merkurius cuma sekitar berapa hari Bumi?',answer:'88 hari',fact:'Merkurius menyelesaikan satu orbit Matahari dalam sekitar 88 hari Bumi.',source:'NASA — Solar System',sourceUrl:'https://science.nasa.gov/solar-system/'},
  {id:'Q035',category:'🕐 Space',question:'Di planet mana satu hari lebih lama daripada satu tahunnya?',answer:'Venus',fact:'Venus berotasi sangat lambat; satu rotasi penuh lebih lama daripada satu orbitnya mengelilingi Matahari.',source:'NASA — Venus Facts',sourceUrl:'https://science.nasa.gov/venus/venus-facts/'},
  {id:'Q036',category:'🌕 Space',question:'Bumi punya berapa bulan alami? Jangan overthinking.',answer:'1',fact:'Bumi memiliki satu bulan alami.',source:'NASA Space Place — Moons',sourceUrl:'https://spaceplace.nasa.gov/how-many-moons/'},
  {id:'Q037',category:'🪨 Space',question:'Benda kecil selain planet ternyata juga bisa punya bulan. Contohnya benda jenis apa?',answer:'Asteroid',fact:'NASA mencatat bahkan beberapa asteroid memiliki bulan.',source:'NASA — Moons',sourceUrl:'https://science.nasa.gov/solar-system/moons/'},
  {id:'Q038',category:'🧊 Space',question:'Mantan planet kesembilan yang kini masuk kategori planet katai adalah siapa?',answer:'Pluto',fact:'Pluto termasuk lima planet katai yang diakui resmi di Tata Surya.',source:'NASA — Planets',sourceUrl:'https://science.nasa.gov/solar-system/planets/'},
  {id:'Q039',category:'🪐 Space',question:'Planet mana yang medan magnetnya disebut NASA sekitar 578 kali lebih kuat dari Bumi?',answer:'Saturnus',fact:'NASA menyebut medan magnet Saturnus sekitar 578 kali lebih kuat dari Bumi.',source:'NASA — Saturn Facts',sourceUrl:'https://science.nasa.gov/saturn/facts/'},
  {id:'Q040',category:'🌙 Space',question:'Planet yang rebahan tadi—Uranus—punya jumlah bulan kecil lebih dari berapa lusin?',answer:'Lebih dari dua lusin',fact:'NASA menyebut Uranus dikelilingi lebih dari dua lusin bulan kecil.',source:'NASA — Uranus',sourceUrl:'https://science.nasa.gov/uranus/'},
  {id:'Q041',category:'🌌 Space',question:'Planet utama paling jauh dari Matahari saat ini adalah apa?',answer:'Neptunus',fact:'Neptunus adalah planet utama kedelapan dan terjauh dari Matahari.',source:'NASA — Neptune Facts',sourceUrl:'https://science.nasa.gov/neptune/neptune-facts/'},
  {id:'Q042',category:'🔥 Space',question:'Suhu permukaan planet mana cukup panas untuk melelehkan timbal?',answer:'Venus',fact:'NASA menyebut permukaan Venus sekitar 467°C, cukup panas untuk melelehkan timbal.',source:'NASA — Venus Facts',sourceUrl:'https://science.nasa.gov/venus/venus-facts/'},
  {id:'Q043',category:'🧱 Space',question:'Tekanan udara di permukaan Venus kira-kira berapa kali tekanan permukaan laut Bumi?',answer:'Sekitar 93 kali',fact:'Atmosfer Venus sangat tebal; tekanan permukaannya sekitar 93 kali tekanan laut Bumi.',source:'NASA — Venus Facts',sourceUrl:'https://science.nasa.gov/venus/venus-facts/'},
  {id:'Q044',category:'🌪️ Space',question:'Angin Neptunus bisa sekitar berapa kali lebih kuat daripada angin terkuat Bumi menurut NASA?',answer:'Sekitar 9 kali',fact:'NASA menyebut angin Neptunus dapat sembilan kali lebih kuat daripada angin Bumi.',source:'NASA — Neptune Facts',sourceUrl:'https://science.nasa.gov/neptune/neptune-facts/'},
  {id:'Q045',category:'🌀 Space',question:'Venus tidak punya bulan, tapi punya quasi-satellite bernama sangat meme-able. Namanya apa?',answer:'Zoozve',fact:'NASA menyebut quasi-satellite Venus yang telah diberi nama resmi: Zoozve.',source:'NASA — Solar System Facts',sourceUrl:'https://science.nasa.gov/solar-system/solar-system-facts/'},

  // 🐾 ANIMALS
  {id:'Q046',category:'🐀 Hewan',question:'Mamalia kecil botak yang bisa hidup sampai usia 30-an itu hewan apa?',answer:'Naked mole-rat / tikus mol telanjang',fact:'Smithsonian menyebut naked mole-rat dapat hidup hingga usia 30-an.',source:'Smithsonian — Fascinating Animals',sourceUrl:'https://www.si.edu/stories/peek-six-animals-smithsonian'},
  {id:'Q047',category:'🫁 Hewan',question:'Hewan mamalia mana yang bisa bertahan tanpa oksigen sampai sekitar 18 menit?',answer:'Naked mole-rat',fact:'Smithsonian mencatat naked mole-rat dapat bertahan sekitar 18 menit tanpa oksigen.',source:'Smithsonian — Fascinating Animals',sourceUrl:'https://www.si.edu/stories/peek-six-animals-smithsonian'},
  {id:'Q048',category:'🐜 Hewan',question:'Jauh sebelum manusia bertani, hewan apa yang sudah "bertani" jamur puluhan juta tahun?',answer:'Semut fungus-farming',fact:'Smithsonian melaporkan semut pembudidaya jamur telah mendomestikasi jamur sekitar 30 juta tahun.',source:'Smithsonian — Fascinating Animals',sourceUrl:'https://www.si.edu/stories/peek-six-animals-smithsonian'},
  {id:'Q049',category:'🦥 Hewan',question:'Hewan super santai apa yang justru turun dari pohon kira-kira seminggu sekali untuk buang air?',answer:'Sloth berjari tiga',fact:'Smithsonian membahas sloth berjari tiga yang turun ke lantai hutan sekitar mingguan untuk buang air.',source:'Smithsonian — Fascinating Animals',sourceUrl:'https://www.si.edu/stories/peek-six-animals-smithsonian'},
  {id:'Q050',category:'🐼 Hewan',question:'Panda punya "jempol palsu" yang sebenarnya berasal dari bagian tulang apa?',answer:'Tulang pergelangan tangan yang membesar',fact:'Pseudo-thumb panda terbentuk dari tulang pergelangan tangan yang memanjang dan membesar.',source:'Smithsonian — Panda Facts',sourceUrl:'https://nationalzoo.si.edu/animals/news/50-panda-facts-celebrate-50-years-giant-pandas-smithsonians-national-zoo'},
  {id:'Q051',category:'🐼 Hewan',question:'Selain mengembik dan menggonggong, panda juga bisa mengeluarkan suara aneh apa?',answer:'Misalnya chirp, honk, bleat, chomp, dan bark',fact:'Smithsonian mencatat panda memiliki beragam vokalisasi, bukan cuma satu jenis suara.',source:'Smithsonian — Panda Facts',sourceUrl:'https://nationalzoo.si.edu/animals/news/50-panda-facts-celebrate-50-years-giant-pandas-smithsonians-national-zoo'},
  {id:'Q052',category:'🪰 Hewan',question:'Lalat rumah mendeteksi rasa gula terutama menggunakan bagian tubuh apa?',answer:'Kakinya',fact:'Smithsonian menyebut housefly dapat menemukan gula menggunakan kakinya.',source:'Smithsonian — Bug Facts',sourceUrl:'https://www.si.edu/spotlight/buginfo/fun-facts-bugs'},
  {id:'Q053',category:'🐜 Hewan',question:'Semut bisa membawa beban lebih dari berapa kali berat tubuhnya?',answer:'Lebih dari 50 kali',fact:'Smithsonian mencatat semut dapat mengangkat dan membawa lebih dari 50 kali berat tubuhnya.',source:'Smithsonian — Bug Facts',sourceUrl:'https://www.si.edu/spotlight/buginfo/fun-facts-bugs'},
  {id:'Q054',category:'🫘 Hewan',question:'"Mexican jumping bean" bisa bergerak karena ternyata ada apa di dalamnya?',answer:'Ulat dari ngengat kacang',fact:'Gerak jumping bean berasal dari larva ngengat yang hidup di dalamnya.',source:'Smithsonian — Bug Facts',sourceUrl:'https://www.si.edu/spotlight/buginfo/fun-facts-bugs'},
  {id:'Q055',category:'🧵 Hewan',question:'Kira-kira berapa kepompong ulat sutra dibutuhkan untuk menghasilkan satu pon sutra?',answer:'Sekitar 2.000 kepompong',fact:'Smithsonian menyebut sekitar 2.000 kepompong ulat sutra diperlukan untuk satu pon sutra.',source:'Smithsonian — Bug Facts',sourceUrl:'https://www.si.edu/spotlight/buginfo/fun-facts-bugs'},
  {id:'Q056',category:'🐝 Hewan',question:'Saat mencari makan, seekor lebah bisa terbang sampai sekitar berapa mil dalam sehari?',answer:'Sekitar 60 mil',fact:'Smithsonian mencatat lebah dapat terbang hingga sekitar 60 mil dalam satu hari saat mencari makanan.',source:'Smithsonian — Bug Facts',sourceUrl:'https://www.si.edu/spotlight/buginfo/fun-facts-bugs'},
  {id:'Q057',category:'🦀 Hewan',question:'Darah horseshoe crab warnanya apa?',answer:'Biru',fact:'Darahnya menggunakan hemocyanin berbasis tembaga, sehingga berwarna biru.',source:'Smithsonian — Horseshoe Crab',sourceUrl:'https://nationalzoo.si.edu/animals/news/10-incredible-horseshoe-crab-facts'},
  {id:'Q058',category:'🦖 Hewan',question:'Horseshoe crab lebih tua dari dinosaurus. Fosil leluhurnya sudah ada sekitar berapa juta tahun lalu?',answer:'Sekitar 445 juta tahun lalu',fact:'Smithsonian menyebut leluhur horseshoe crab hidup sekitar 445 juta tahun lalu.',source:'Smithsonian — Horseshoe Crab',sourceUrl:'https://nationalzoo.si.edu/animals/news/10-incredible-horseshoe-crab-facts'},
  {id:'Q059',category:'🦊 Hewan',question:'Mamalia plasental dengan jumlah gigi luar biasa banyak—46 sampai 50—adalah hewan apa?',answer:'Bat-eared fox',fact:'Smithsonian menyebut bat-eared fox punya 46–50 gigi, terbanyak di antara mamalia plasental.',source:'Smithsonian — Bat-eared Fox',sourceUrl:'https://nationalzoo.si.edu/animals/news/meet-bat-eared-fox-unusual-animal-can-hear-insects-burrowing-underground'},
  {id:'Q060',category:'🐋 Hewan',question:'Paus apa yang dijuluki "canary of the sea" karena banyak suara yang dibuatnya?',answer:'Beluga',fact:'NOAA menyebut beluga mendapat julukan canary of the sea karena vokalisasinya.',source:'NOAA Fisheries — Beluga',sourceUrl:'https://www.fisheries.noaa.gov/species/beluga-whale'},
  {id:'Q061',category:'🐙 Hewan',question:'Apa yang biasanya terjadi pada induk gurita betina setelah telurnya menetas?',answer:'Induk betina mati',fact:'NOAA menjelaskan betina gurita menjaga telur di akhir hidupnya dan mati setelah telur menetas.',source:'NOAA — Octopus',sourceUrl:'https://floridakeys.noaa.gov/education/creature-feature.html'},
  {id:'Q062',category:'🧠 Hewan',question:'Hewan laut delapan lengan apa yang di akuarium sampai diberi puzzle dan mainan karena bisa belajar?',answer:'Gurita',fact:'NOAA mencatat gurita biasa dapat belajar dan diberi enrichment seperti feeding puzzle serta mainan.',source:'NOAA Fisheries — Aquarium',sourceUrl:'https://www.fisheries.noaa.gov/new-england-mid-atlantic/about-us/meet-residents-woods-hole-science-aquarium'},
  {id:'Q063',category:'🌊 Hewan',question:'Gurita yang namanya mirip karakter Disney dan hidup sangat dalam disebut apa?',answer:'Dumbo octopus',fact:'NOAA menyebut dumbo octopus hidup lebih dalam daripada jenis gurita lain, lebih dari 13.000 kaki.',source:'NOAA — Odd Ocean Critters',sourceUrl:'https://sanctuaries.noaa.gov/news/oct23/odd-ocean-critters.html'},
  {id:'Q064',category:'👻 Hewan',question:'Gurita pucat berjuluk "Casper" pertama kali ditemukan NOAA pada kedalaman sekitar berapa meter?',answer:'Sekitar 4.290 meter',fact:'Casper ditemukan pada 2016 di kedalaman sekitar 4.290 meter dekat Hawaii.',source:'NOAA — Casper Octopus',sourceUrl:'https://oceanexplorer.noaa.gov/exploration-extras/24-spooky-star/'},
  {id:'Q065',category:'🐸 Hewan',question:'Kenapa poison frog yang dipelihara manusia bisa kehilangan racunnya?',answer:'Karena makanannya tidak memasok senyawa racun seperti di alam',fact:'Smithsonian menjelaskan poison frog dalam perawatan manusia tidak beracun saat dietnya berupa serangga ringan seperti jangkrik dan lalat buah.',source:'Smithsonian — Poison Frog',sourceUrl:'https://nationalzoo.si.edu/animals/news?certfile=%27&page=12'},
  {id:'Q066',category:'🐜 Hewan',question:'Kalau semut "bertani", tanaman apa yang sebenarnya mereka budidayakan?',answer:'Jamur',fact:'Kelompok fungus-farming ants membudidayakan jamur di bawah tanah.',source:'Smithsonian — Fascinating Animals',sourceUrl:'https://www.si.edu/stories/peek-six-animals-smithsonian'},
  {id:'Q067',category:'🦥 Hewan',question:'Hal hijau bernutrisi apa yang bisa tumbuh pada bulu sloth dan ikut dimakannya?',answer:'Alga',fact:'Smithsonian membahas alga bernutrisi yang tumbuh di bulu sloth dan dapat dikonsumsi sloth.',source:'Smithsonian — Fascinating Animals',sourceUrl:'https://www.si.edu/stories/peek-six-animals-smithsonian'},
  {id:'Q068',category:'🐀 Hewan',question:'Walau namanya naked mole-rat, Smithsonian bilang hewan ini sebenarnya bukan apa?',answer:'Bukan tikus sejati (rat)',fact:'Smithsonian menyebut nama naked mole-rat adalah misnomer; hewan ini bukan rat sejati.',source:'Smithsonian — Fascinating Animals',sourceUrl:'https://www.si.edu/stories/peek-six-animals-smithsonian'},
  {id:'Q069',category:'🐼 Hewan',question:'Panda raksasa lebih suka hidup rame-rame atau solo?',answer:'Cenderung soliter / sendiri',fact:'Smithsonian menyebut giant panda adalah hewan soliter meski tetap berkomunikasi saat interaksi sosial.',source:'Smithsonian — Panda Facts',sourceUrl:'https://nationalzoo.si.edu/animals/news/50-panda-facts-celebrate-50-years-giant-pandas-smithsonians-national-zoo'},
  {id:'Q070',category:'🐼 Hewan',question:'Selain suara, panda banyak berkomunikasi dengan cara meninggalkan apa?',answer:'Tanda aroma / scent marking',fact:'Giant panda berkomunikasi melalui scent marking di habitat dan wilayahnya.',source:'Smithsonian — Panda Facts',sourceUrl:'https://nationalzoo.si.edu/animals/news/50-panda-facts-celebrate-50-years-giant-pandas-smithsonians-national-zoo'},
  {id:'Q071',category:'🐙 Hewan',question:'Dumbo octopus berenang dengan mengepakkan bagian tubuh apa yang bikin dia tampak punya telinga?',answer:'Sepasang sirip besar di atas mata',fact:'NOAA menjelaskan umbrella octopus berenang dengan mengepakkan sirip besar yang menonjol dari mantelnya.',source:'NOAA — Odd Ocean Critters',sourceUrl:'https://sanctuaries.noaa.gov/news/oct23/odd-ocean-critters.html'},
  {id:'Q072',category:'🕷️ Hewan',question:'Horseshoe crab ternyata lebih dekat kerabatnya ke hewan apa daripada kepiting sejati?',answer:'Laba-laba dan kalajengking',fact:'Smithsonian menyebut horseshoe crab lebih dekat dengan laba-laba dan kalajengking daripada crustacea.',source:'Smithsonian — Horseshoe Crab',sourceUrl:'https://nationalzoo.si.edu/animals/news/10-incredible-horseshoe-crab-facts'},
  {id:'Q073',category:'🐋 Hewan',question:'Beluga biasa bersifat antisosial atau justru membentuk kelompok untuk berburu dan bermigrasi?',answer:'Mereka sangat sosial dan membentuk kelompok',fact:'NOAA menggambarkan beluga sebagai hewan sosial yang berkelompok saat berburu, bermigrasi, dan berinteraksi.',source:'NOAA Fisheries — Beluga',sourceUrl:'https://www.fisheries.noaa.gov/species/beluga-whale'},
  {id:'Q074',category:'🦊 Hewan',question:'Kenapa bat-eared fox punya gigi seabrek?',answer:'Adaptasi untuk menghancurkan dan memakan serangga',fact:'Smithsonian menjelaskan banyaknya gigi bat-eared fox diduga membantu mereka mengunyah serangga.',source:'Smithsonian — Bat-eared Fox',sourceUrl:'https://nationalzoo.si.edu/animals/news/meet-bat-eared-fox-unusual-animal-can-hear-insects-burrowing-underground'},
  {id:'Q075',category:'🪰 Hewan',question:'Menurut Smithsonian, sensor rasa gula di kaki lalat rumah bisa seberapa sensitif dibanding lidah manusia?',answer:'Sekitar 10 juta kali lebih sensitif',fact:'Smithsonian menyebut kaki housefly sangat sensitif untuk mendeteksi gula.',source:'Smithsonian — Bug Facts',sourceUrl:'https://www.si.edu/spotlight/buginfo/fun-facts-bugs'},

  // 🌍 EARTH, OCEAN & WEIRD SCIENCE
  {id:'Q076',category:'🌎 Bumi',question:'Dalam gempa, gelombang mana yang lebih cepat tiba: P atau S?',answer:'Gelombang P',fact:'USGS menjelaskan P wave lebih cepat daripada S wave dan perbedaan ini membantu menentukan lokasi gempa.',source:'USGS — Science of Earthquakes',sourceUrl:'https://www.usgs.gov/programs/earthquake-hazards/science-earthquakes'},
  {id:'Q077',category:'🌎 Bumi',question:'Apakah aftershock secara teknis bisa lebih besar daripada gempa yang awalnya dianggap mainshock?',answer:'Bisa',fact:'USGS menyatakan aftershock dapat lebih besar; bila itu terjadi, klasifikasi rangkaian gempa dapat berubah.',source:'USGS — Earthquake Facts',sourceUrl:'https://www.usgs.gov/programs/earthquake-hazards/earthquake-facts-earthquake-fantasy'},
  {id:'Q078',category:'🌎 Bumi',question:'Gempa terbesar yang pernah direkam memiliki magnitudo berapa?',answer:'Magnitudo 9,5',fact:'USGS mencatat gempa Chile tahun 1960 sebagai gempa terbesar yang pernah direkam, M9,5.',source:'USGS — Cool Earthquake Facts',sourceUrl:'https://www.usgs.gov/programs/earthquake-hazards/cool-earthquake-facts'},
  {id:'Q079',category:'🔥 Bumi',question:'Zona panjang di sekitar Pasifik yang terkenal sering gempa dan erupsi disebut apa?',answer:'Ring of Fire / Cincin Api',fact:'USGS menjelaskan busur vulkanik dan palung di sekitar Pasifik membentuk Ring of Fire.',source:'USGS — Cool Earthquake Facts',sourceUrl:'https://www.usgs.gov/programs/earthquake-hazards/cool-earthquake-facts'},
  {id:'Q080',category:'🌎 Bumi',question:'Aktivitas manusia tertentu ternyata bisa memicu gempa kecil. Contohnya apa?',answer:'Injeksi cairan ke sumur dalam atau pengisian reservoir besar',fact:'USGS mendokumentasikan gempa terinduksi yang berkaitan dengan injeksi cairan dan pengisian reservoir.',source:'USGS — Earthquake Facts',sourceUrl:'https://www.usgs.gov/programs/earthquake-hazards/earthquake-facts-earthquake-fantasy'},
  {id:'Q081',category:'🌋 Bumi',question:'Apakah letusan satu gunung api terbukti bisa memicu gunung api lain yang ratusan kilometer jauhnya?',answer:'Belum ada bukti definitif',fact:'USGS menyatakan tidak ada bukti definitif bahwa erupsi satu gunung api memicu gunung lain yang sangat jauh.',source:'USGS — Volcano FAQ',sourceUrl:'https://www.usgs.gov/faqs/can-a-large-earthquake-trigger-earthquakes-distant-locations-or-other-faults'},
  {id:'Q082',category:'🌊 Laut',question:'"Bulu" merah pada cacing tabung laut dalam sebenarnya berfungsi sebagai apa?',answer:'Tentakel pernapasan',fact:'NOAA menjelaskan struktur merah itu adalah tentakel respirasi berisi darah dengan hemoglobin.',source:'NOAA — Wild Marine Life',sourceUrl:'https://oceanexplorer.noaa.gov/explainers/marine-life/'},
  {id:'Q083',category:'🦐 Laut',question:'Udang Rimicaris di ventilasi hidrotermal makan "kebun" apa yang tumbuh di tubuhnya?',answer:'Bakteri kemosintetik',fact:'NOAA mendokumentasikan udang Rimicaris memakan bakteri kemosintetik yang tumbuh pada tubuhnya.',source:'NOAA — Wild Marine Life',sourceUrl:'https://oceanexplorer.noaa.gov/explainers/marine-life/'},
  {id:'Q084',category:'🐌 Laut',question:'"Hairy snails" di laut dalam biasa ngemil apa dekat ventilasi hidrotermal?',answer:'Bakteri kemosintetik',fact:'NOAA menyebut hairy snails merumput bakteri yang menghasilkan makanan lewat kemosintesis.',source:'NOAA — Wild Marine Life',sourceUrl:'https://oceanexplorer.noaa.gov/explainers/marine-life/'},
  {id:'Q085',category:'🥒 Laut',question:'Sea cucumber bernapas lewat struktur internal yang namanya terdengar seperti tanaman. Apa?',answer:'Respiratory trees / "pohon pernapasan"',fact:'NOAA menjelaskan sea cucumber memompa air melalui dua respiratory trees di sisi saluran pencernaan.',source:'NOAA — Wild Marine Life',sourceUrl:'https://oceanexplorer.noaa.gov/explainers/marine-life/'},
  {id:'Q086',category:'🧹 Laut',question:'Hewan laut mana yang dijuluki "vacuum cleaner of the sea" karena memakan sedimen dasar laut?',answer:'Sea cucumber / teripang',fact:'NOAA menyebut sea cucumber memakan sedimen dan mengekstrak nutrisi, sehingga dijuluki vacuum cleaners of the sea.',source:'NOAA — Wild Marine Life',sourceUrl:'https://oceanexplorer.noaa.gov/explainers/marine-life/'},
  {id:'Q087',category:'🐔 Laut',question:'Hewan laut dalam berjuluk "headless chicken monster" sebenarnya jenis apa?',answer:'Sea cucumber yang bisa berenang',fact:'NOAA menyebut Enypniastes eximia sebagai swimming sea cucumber yang kadang dijuluki headless chicken monster.',source:'NOAA — Wild Marine Life',sourceUrl:'https://oceanexplorer.noaa.gov/explainers/marine-life/'},
  {id:'Q088',category:'🌑 Laut',question:'Ekosistem laut dalam tanpa cahaya Matahari bisa mendapat energi dari proses apa?',answer:'Kemosintesis',fact:'NOAA menjelaskan bakteri dapat memakai energi kimia dari sulfida, metana, dan senyawa lain untuk menghasilkan makanan.',source:'NOAA — Wild Marine Life',sourceUrl:'https://oceanexplorer.noaa.gov/explainers/marine-life/'},
  {id:'Q089',category:'🌑 Laut',question:'Manusia baru pertama kali mengamati komunitas hidup di ventilasi laut dalam tanpa cahaya pada tahun berapa?',answer:'1977',fact:'NOAA mencatat pengamatan komunitas ventilasi laut dalam tanpa cahaya pertama terjadi pada 1977.',source:'NOAA — Wild Marine Life',sourceUrl:'https://oceanexplorer.noaa.gov/explainers/marine-life/'},
  {id:'Q090',category:'🦀 Hewan',question:'Horseshoe crab memakai ekor runcingnya terutama untuk apa, bukan untuk menusuk musuh?',answer:'Membalikkan tubuh saat terbalik dan membantu mengarahkan gerak',fact:'Smithsonian menjelaskan telson membantu horseshoe crab membalik diri dan dapat berfungsi seperti kemudi.',source:'Smithsonian — Horseshoe Crab',sourceUrl:'https://nationalzoo.si.edu/animals/news/10-incredible-horseshoe-crab-facts'},
  {id:'Q091',category:'✨ Hewan',question:'Horseshoe crab ternyata melakukan apa saat disinari UV / blacklight?',answer:'Berpendar / fluoresen',fact:'Smithsonian mencatat horseshoe crab berfluoresensi di bawah cahaya ultraviolet.',source:'Smithsonian — Horseshoe Crab',sourceUrl:'https://nationalzoo.si.edu/animals/news/10-incredible-horseshoe-crab-facts'},
  {id:'Q092',category:'🥚 Hewan',question:'Seekor horseshoe crab betina dapat mengubur sekitar berapa telur dalam satu kelompok sarang?',answer:'Sekitar 4.000 telur',fact:'Smithsonian menyebut satu kelompok sarang dapat berisi sekitar 4.000 telur.',source:'Smithsonian — Horseshoe Crab',sourceUrl:'https://nationalzoo.si.edu/animals/news/10-incredible-horseshoe-crab-facts'},
  {id:'Q093',category:'🦀 Hewan',question:'Walau namanya horseshoe crab, hewan ini punya berapa pasang kaki?',answer:'6 pasang',fact:'Smithsonian mencatat horseshoe crab punya enam pasang kaki; lima pasangan digunakan untuk berjalan.',source:'Smithsonian — Horseshoe Crab',sourceUrl:'https://nationalzoo.si.edu/animals/news/10-incredible-horseshoe-crab-facts'},
  {id:'Q094',category:'🐒 Hewan',question:'Hewan kecil bernama southern lesser galago bisa memutar kepala sampai berapa derajat?',answer:'180 derajat',fact:'Smithsonian menyebut galago dapat memutar kepalanya sekitar 180 derajat.',source:'Smithsonian — Animal News',sourceUrl:'https://nationalzoo.si.edu/animals/news?certfile=%27&page=12'},
  {id:'Q095',category:'🧪 Hewan',question:'Lendir pada kulit amfibi bukan sekadar "ew". Secara umum, lendir itu membantu apa?',answer:'Membantu mereka bertahan hidup',fact:'Smithsonian menekankan slime pada amfibi punya fungsi biologis penting untuk kelangsungan hidup.',source:'Smithsonian — Animal News',sourceUrl:'https://nationalzoo.si.edu/animals/news?certfile=%27&page=12'},
  {id:'Q096',category:'🌌 Space',question:'Planet yang auroranya tidak sejajar dengan kutub karena medan magnetnya "miring banget" adalah apa?',answer:'Uranus',fact:'NASA menjelaskan aurora Uranus tidak sejajar dengan kutub karena medan magnetnya yang tidak simetris.',source:'NASA — Uranus Facts',sourceUrl:'https://science.nasa.gov/uranus/facts/'},
  {id:'Q097',category:'🌌 Space',question:'Ekor magnetosfer planet mana dipelintir rotasi menyamping menjadi bentuk seperti corkscrew?',answer:'Uranus',fact:'NASA menggambarkan garis medan magnet Uranus terpilin menjadi bentuk corkscrew akibat rotasi menyamping.',source:'NASA — Uranus Facts',sourceUrl:'https://science.nasa.gov/uranus/facts/'},
  {id:'Q098',category:'🌊 Laut',question:'Beberapa sea cucumber laut dalam ternyata tidak pernah menyentuh dasar laut sama sekali. Mereka hidup di mana?',answer:'Sepanjang hidup di kolom air',fact:'NOAA mencatat beberapa sea cucumber pelagik menghabiskan seluruh hidupnya berenang di kolom air.',source:'NOAA — Wild Marine Life',sourceUrl:'https://oceanexplorer.noaa.gov/explainers/marine-life/'},
  {id:'Q099',category:'🧬 Laut',question:'Sea cucumber Paroriza pallens punya organ reproduksi jantan dan betina sekaligus. Istilah biologinya apa?',answer:'Hermafrodit',fact:'NOAA menyebut Paroriza pallens hermaphroditic, artinya satu individu memiliki organ reproduksi jantan dan betina.',source:'NOAA — Wild Marine Life',sourceUrl:'https://oceanexplorer.noaa.gov/explainers/marine-life/'},
  {id:'Q100',category:'🌌 Space',question:'Dua planet raksasa mana yang memimpin jumlah bulan terbanyak menurut ringkasan NASA?',answer:'Jupiter dan Saturnus',fact:'NASA menyebut Jupiter dan Saturnus memimpin jumlah bulan di Tata Surya.',source:'NASA — Solar System Facts',sourceUrl:'https://science.nasa.gov/solar-system/solar-system-facts/'},
  {
    id: 'Q101',
    category: '🇮🇩 Indonesia',
    question: 'Indonesia memegang rekor sebagai negara produsen utama untuk rempah mahal yang bentuknya seperti benang merah halus. Rempah apa itu?',
    answer: 'Pala / Fuli (atau Bunga Pala)',
    fact: 'Kepulauan Banda di Indonesia pernah menjadi satu-satunya tempat di bumi yang menghasilkan buah pala dan fuli, yang harganya dulu lebih mahal dari emas.',
    source: 'Kementerian Luar Negeri RI — History of Spices',
    sourceUrl: 'https://kemlu.go.id/'
  },
  {
    id: 'Q102',
    category: '🍳 Kuliner',
    question: 'Tahu gak, warna hitam pekat yang khas pada kuah Rawon Jawa Timur itu berasal dari bahan alami apa?',
    answer: 'Kluwek / Keluwek',
    fact: 'Kluwek adalah biji dari pohon kepahiang. Jika dikonsumsi mentah biji ini beracun (mengandung asam sianida), namun aman dan gurih setelah difermentasi.',
    source: 'Kemenparekraf — Warisan Kuliner Nusantara',
    sourceUrl: 'https://kemenparekraf.go.id/'
  },
  {
    id: 'Q103',
    category: '🍳 Kuliner',
    question: 'Gudeg khas Yogyakarta biasanya dimasak selama berjam-jam. Bahan utama yang dipakai sebenarnya buah apa?',
    answer: 'Nangka muda (gori)',
    fact: 'Gudeg terbuat dari nangka muda yang dimasak berjam-jam dengan santan, gula merah, dan bumbu rempah hingga warnanya berubah kecokelatan.',
    source: 'Wonderful Indonesia — Kuliner Jogja',
    sourceUrl: 'https://www.indonesia.travel/'
  },
  {
    id: 'Q104',
    category: '🏛️ Budaya',
    question: 'Candi Jiwa yang terletak di Kompleks Percandian Batujaya, Jawa Barat, diperkirakan lebih tua dari Borobudur dan terbuat dari bahan apa?',
    answer: 'Bata merah',
    fact: 'Kompleks Percandian Batujaya dibangun dari struktur bata merah dan diperkirakan berasal dari abad ke-4 hingga ke-5 Masehi pada masa Kerajaan Tarumanagara.',
    source: 'Kemdikbud — Candi Batujaya',
    sourceUrl: 'https://kebudayaan.kemdikbud.go.id/'
  },
  {
    id: 'Q105',
    category: '🦎 Indonesia',
    question: 'Komodo yang legendaris itu hanya bisa ditemukan secara alami di habitat liar provinsi mana di Indonesia?',
    answer: 'Nusa Tenggara Timur (NTT)',
    fact: 'Habitat alami Komodo terbatas di beberapa pulau di Provinsi Nusa Tenggara Timur, seperti Pulau Komodo, Rinca, Flores, Gili Motang, dan Padar.',
    source: 'UNESCO — Komodo National Park',
    sourceUrl: 'https://whc.unesco.org/en/list/609/'
  },
  {
    id: 'Q106',
    category: '🎵 Budaya',
    question: 'Alat musik petik khas dari Pulau Rote, NTT, yang terbuat dari daun lontar bernama apa?',
    answer: 'Sasando',
    fact: 'Sasando adalah instrumen musik tradisional Rote yang menggunakan wadah resonansi dari daun pohon lontar yang dikeringkan.',
    source: 'UNESCO — Indonesia ICH',
    sourceUrl: 'https://ich.unesco.org/en/state/indonesia-ID'
  },
  {
    id: 'Q107',
    category: '☕ Kuliner',
    question: 'Kopi khas Aceh yang proses penyajiannya disaring berulang kali dengan kain berbentuk seperti kaus kaki dinamakan kopi apa?',
    answer: 'Kopi Tarik / Kopi Ulee Kareng',
    fact: 'Kopi saring Aceh ditarik menggunakan saringan kain panjang secara berulang-ulang untuk menghasilkan rasa kopi yang pekat dan berbusa halus.',
    source: 'Wonderful Indonesia — Aceh Coffee',
    sourceUrl: 'https://www.indonesia.travel/'
  },
  {
    id: 'Q108',
    category: '🌺 Indonesia',
    question: 'Bunga raksasa asli Sumatra yang terkenal karena aromanya yang membusuk memiliki nama ilmiah apa?',
    answer: 'Rafflesia arnoldii',
    fact: 'Rafflesia arnoldii adalah bunga tunggal terbesar di dunia yang memancarkan bau busuk untuk menarik perhatian lalat pembawa serbuk sari.',
    source: 'Kebun Raya Bogor — BRIN',
    sourceUrl: 'https://brin.go.id/'
  },

  // 🐾 ANIMALS & NATURE
  {
    id: 'Q109',
    category: '🐾 Hewan',
    question: 'Mamalia unik bertelur asal Australia dan Papua yang memiliki paruh seperti bebek tapi tubuh berbulu adalah apa?',
    answer: 'Platypus',
    fact: 'Platypus adalah salah satu dari sedikit mamalia monotremata (mamalia yang bertelur daripada melahirkan anak).',
    source: 'Smithsonian — Unique Mammals',
    sourceUrl: 'https://www.si.edu/'
  },
  {
    id: 'Q110',
    category: '🐾 Hewan',
    question: 'Selain Platypus, hewan bertelur lain yang menyusui anaknya dari permukaan kulit tanpa puting susu adalah apa?',
    answer: 'Ekidna / Echidna',
    fact: 'Echidna juga merupakan mamalia monotremata. Mereka menetas dari telur dan menyusu cairan susu yang keluar dari pori-pori kulit induknya.',
    source: 'Smithsonian — Echidna Facts',
    sourceUrl: 'https://www.si.edu/'
  },
  {
    id: 'Q111',
    category: '🦈 Hewan',
    question: 'Hiu paus (Whale Shark) yang merupakan ikan terbesar di dunia makanan utamanya sebenarnya apa?',
    answer: 'Plankton dan ikan-ikan kecil',
    fact: 'Meskipun bertubuh raksasa, hiu paus adalah pemakan penyaring (filter feeder) yang mengonsumsi plankton, udang kecil, dan telur ikan.',
    source: 'NOAA Fisheries — Whale Shark',
    sourceUrl: 'https://www.fisheries.noaa.gov/'
  },
  {
    id: 'Q112',
    category: '🦎 Hewan',
    question: 'Bunglon mengubah warna kulitnya terutama bukan untuk menyamar (kamuflase). Lalu untuk apa?',
    answer: 'Pengaturan suhu tubuh dan komunikasi / emosi',
    fact: 'Perubahan warna bunglon lebih sering dipicu oleh emosi, kondisi stres, persaingan wilayah, serta penyesuaian suhu tubuh terhadap lingkungan.',
    source: 'Smithsonian — Chameleon Facts',
    sourceUrl: 'https://www.si.edu/'
  },
  {
    id: 'Q113',
    category: '🦅 Hewan',
    question: 'Burung hantu tidak bisa memutar matanya sama sekali. Kenapa?',
    answer: 'Karena bola matanya tidak berbentuk bulat sempurna, melainkan berbentuk tabung yang tertancap kaku.',
    fact: 'Mata burung hantu ditahan oleh struktur tulang yang dinamakan ring sklerotik, sehingga matanya tidak bisa bergerak dalam rongganya.',
    source: 'Smithsonian — Owl Myths',
    sourceUrl: 'https://www.si.edu/'
  },
  {
    id: 'Q114',
    category: '🐬 Hewan',
    question: 'Lumba-lumba ternyata tidur dengan posisi sangat unik. Bagaimana cara tidur mereka?',
    answer: 'Tidur dengan mematikan setengah bagian otaknya dan satu mata tetap terbuka.',
    fact: 'Fenomena ini disebut unihemispheric slow-wave sleep, memungkinkan lumba-lumba tetap bernapas dan waspada terhadap predator saat beristirahat.',
    source: 'NOAA — How Dolphins Sleep',
    sourceUrl: 'https://sanctuaries.noaa.gov/'
  },
  {
    id: 'Q115',
    category: '🦩 Hewan',
    question: 'Warna bulu burung flamingo saat lahir sebenarnya bukan merah muda (pink). Warna aslinya apa?',
    answer: 'Abu-abu atau putih',
    fact: 'Flamingo lahir dengan bulu abu-abu. Warna pink didapat dari karotenoid dalam makanan mereka seperti udang brine dan alga.',
    source: 'Smithsonian — Flamingo Color',
    sourceUrl: 'https://nationalzoo.si.edu/'
  },

  // 🚀 SPACE & PHYSICS
  {
    id: 'Q116',
    category: '🚀 Space',
    question: 'Berapa lama waktu yang dibutuhkan oleh sinar Matahari untuk sampai ke permukaan Bumi?',
    answer: 'Sekitar 8 menit 20 detik',
    fact: 'Cahaya bergerak pada kecepatan ~300.000 km/detik. Dengan jarak Bumi-Matahari sekitar 150 juta km, butuh waktu sekitar 500 detik.',
    source: 'NASA — Sun Facts',
    sourceUrl: 'https://science.nasa.gov/'
  },
  {
    id: 'Q117',
    category: '🪐 Space',
    question: 'Bintik Merah Raksasa (Great Red Spot) yang terkenal di planet Jupiter sebenarnya adalah fenomena apa?',
    answer: 'Badai raksasa',
    fact: 'Great Red Spot adalah badai antisiklon raksasa yang ukurannya lebih besar dari Bumi dan telah berlangsung selama ratusan tahun.',
    source: 'NASA — Jupiter Great Red Spot',
    sourceUrl: 'https://science.nasa.gov/jupiter/'
  },
  {
    id: 'Q118',
    category: '🌕 Space',
    question: 'Jejak kaki para astronot Apollo di Bulan diperkirakan bisa bertahan berapa lama di sana?',
    answer: 'Jutaan tahun',
    fact: 'Karena Bulan tidak memiliki atmosfer, maka tidak ada angin atau air yang dapat mengikis dan menghapus jejak kaki tersebut.',
    source: 'NASA — Moon Facts',
    sourceUrl: 'https://spaceplace.nasa.gov/'
  },
  {
    id: 'Q119',
    category: '🌌 Space',
    question: 'Galaksi paling dekat dengan galaksi Bima Sakti kita bernama galaksi apa?',answer:'Andromeda',
    fact: 'Galaksi Andromeda adalah galaksi spiral terdekat dari Bima Sakti dan diperkirakan akan bertabrakan dengan galaksi kita dalam beberapa miliar tahun.',
    source: 'NASA — Galaxies',
    sourceUrl: 'https://science.nasa.gov/'
  },
  {
    id: 'Q120',
    category: '🚀 Space',
    question: 'Mengapa suara tidak dapat merambat sama sekali di ruang angkasa luar?',answer:'Karena tidak ada medium (seperti udara atau air) untuk merambatkan gelombang suara.',
    fact: 'Suara adalah gelombang mekanik yang membutuhkan atom atau molekul untuk merambat, sedangkan luar angkasa adalah kondisi hampa udara (vakum).',
    source: 'NASA Space Place — Sound in Space',
    sourceUrl: 'https://spaceplace.nasa.gov/'
  },

  // 🌎 EARTH & GEOGRAPHY
  {
    id: 'Q121',
    category: '🌎 Bumi',
    question: 'Titik terdalam di lautan Bumi yang terletak di Palung Mariana dinamakan apa?',answer:'Challenger Deep',
    fact: 'Challenger Deep berada pada kedalaman sekitar 10.900 hingga 11.000 meter di bawah permukaan laut.',
    source: 'NOAA — Ocean Depth',
    sourceUrl: 'https://oceanexplorer.noaa.gov/'
  },
  {
    id: 'Q122',
    category: '🌋 Bumi',
    question: 'Gunung berapi tertinggi di Tata Surya kita berada di planet Mars. Apa nama gunung tersebut?',answer:'Olympus Mons',
    fact: 'Olympus Mons di Mars tingginya hampir 2,5 kali lipat dari Gunung Everest di Bumi.',
    source: 'NASA — Mars Volcanoes',
    sourceUrl: 'https://science.nasa.gov/mars/'
  },
  {
    id: 'Q123',
    category: '❄️ Bumi',
    question: 'Benua mana di Bumi yang memegang rekor sebagai tempat terkering, terdingin, dan paling berangin?',answer:'Antartika',
    fact: 'Meskipun diselimuti es, Antartika diklasifikasikan sebagai gurun pasir karena curah hujannya sangat rendah secara tahunan.',
    source: 'USGS — Antarctica Facts',
    sourceUrl: 'https://www.usgs.gov/'
  },
  {
    id: 'Q124',
    category: '🌊 Laut',
    question: 'Segitiga Terumbu Karang (Coral Triangle) di Asia Tenggara menampung berapa persen spesies terumbu karang dunia?',answer:'Sekitar 75%',
    fact: 'Coral Triangle (termasuk Indonesia) adalah pusat keanekaragaman hayati laut dunia dengan lebih dari 500 spesies karang pembentuk terumbu.',
    source: 'WWF — Coral Triangle',
    sourceUrl: 'https://www.worldwildlife.org/'
  },
  {
    id: 'Q125',
    category: '🌎 Bumi',
    question: 'Gas apa yang mendominasi dan membentuk porsi terbesar dari atmosfer Bumi kita?',answer:'Gas Nitrogen',fact:'Atmosfer Bumi terdiri dari sekitar 78% Nitrogen, 21% Oksigen, dan 1% gas lainnya.',
    source: 'NASA — Earth Atmosphere',
    sourceUrl: 'https://science.nasa.gov/earth/'
  },

  // 🧠 TUBUH MANUSIA & ILMU UNIK
  {
    id: 'Q126',
    category: '🧠 Manusia',
    question: 'Berapa jumlah tulang pada tubuh manusia dewasa?',answer:'206 tulang',
    fact: 'Bayi lahir dengan sekitar 270 tulang, namun seiring pertumbuhan banyak tulang yang menyatu hingga tersisa 206 tulang pada orang dewasa.',
    source: 'Smithsonian — Human Body',
    sourceUrl: 'https://www.si.edu/'
  },
  {
    id: 'Q127',
    category: '🧠 Manusia',
    question: 'Organ terkecil di tubuh manusia terletak di dalam telinga. Nama tulangnya apa?',answer:'Tulang Sanggurdi / Stapes',
    fact: 'Stapes adalah tulang terkecil dalam tubuh manusia, berukuran hanya sekitar 3 x 2,5 milimeter.',
    source: 'Smithsonian — Human Skeleton',
    sourceUrl: 'https://www.si.edu/'
  },
  {
    id: 'Q128',
    category: '🧠 Manusia',
    question: 'Otot yang paling kuat di tubuh manusia berdasarkan daya tekan yang dihasilkannya adalah otot apa?',answer:'Otot Kunyah / Masseter',
    fact: 'Otot masseter berada di rahang dan bertanggung jawab untuk mengunyah, mampu menghasilkan gaya gigitan yang luar biasa kuat.',
    source: 'Smithsonian — Human Anatomy',
    sourceUrl: 'https://www.si.edu/'
  },
  {
    id: 'Q129',
    category: '🧪 Sains',
    question: 'Unsur kimia apa yang paling melimpah di jagat raya kita?',answer:'Hidrogen',
    fact: 'Hidrogen membentuk sekitar 75% dari seluruh massa zat di alam semesta.',
    source: 'NASA — Elements in Universe',
    sourceUrl: 'https://science.nasa.gov/'
  },
  {
    id: 'Q130',
    category: '🧪 Sains',
    question: 'Satu-satunya logam yang wujudnya tetap cair pada suhu ruangan (sekitar 25°C) adalah apa?',answer:'Raksasa / Mercurium (Hg)',
    fact: 'Raksa memiliki titik leleh -38,8°C sehingga tetap berwujud cair pada suhu kamar standar.',
    source: 'USGS — Mercury Element',
    sourceUrl: 'https://www.usgs.gov/'
  },

  // 🎭 POP CULTURE & HISTORICAL FUN FACTS
  {
    id: 'Q131',
    category: '🏛️ Budaya',
    question: 'Monumen Nasional (Monas) di Jakarta puncaknya dilapisi oleh bahan logam mulia apa?',answer:'Emas murni',
    fact: 'Lidah api Monas terbuat dari perunggu seberat 14,5 ton yang dilapisi lembaran emas puluhan kilogram.',
    source: 'Pemprov DKI Jakarta — Monas',
    sourceUrl: 'https://jakarta.go.id/'
  },
  {
    id: 'Q132',
    category: '🇮🇩 Indonesia',
    question: 'Danau vulkanik terbesar di dunia yang terbentuk akibat letusan supervolcano puluhan ribu tahun lalu ada di Indonesia. Nama danaunya apa?',answer:'Danau Toba',
    fact: 'Danau Toba adalah danau vulkanik terbesar di dunia dan terbentuk dari erupsi gunung berapi purba super masif sekitar 74.000 tahun lalu.',
    source: 'USGS — Toba Supereruption',
    sourceUrl: 'https://www.usgs.gov/'
  },
  {
    id: 'Q133',
    category: '🌾 Indonesia',
    question: 'Sistem irigasi terasering tradisional Bali yang berbasis kemasyarakatan dan diakui UNESCO dinamakan apa?',answer:'Subak',fact:'Subak adalah organisasi tata kelola air tradisional Bali yang mencerminkan filosofi Tri Hita Karana.',
    source: 'UNESCO — Cultural Landscape of Bali Province: the Subak System',
    sourceUrl: 'https://whc.unesco.org/en/list/1194/'
  },
  {
    id: 'Q134',
    category: '🐾 Hewan',
    question: 'Hewan khas Papua yang sepintas mirip kangguru kecil tapi bisa memanjat pohon adalah apa?',answer:'Kangguru Pohon (Dendrolagus)',
    fact: 'Kangguru pohon adaptif hidup di kanopi hutan hujan Papua dan Australia utara.',
    source: 'WWF — Tree Kangaroo',
    sourceUrl: 'https://www.worldwildlife.org/'
  },
  {
    id: 'Q135',
    category: '🐙 Hewan',
    question: 'Berapa jumlah jantung yang dimiliki oleh seekor gurita?',answer:'3 jantung',
    fact: 'Gurita punya dua jantung untuk memompa darah ke insang dan satu jantung utama untuk memompa darah ke seluruh tubuhnya.',
    source: 'NOAA — Octopus Facts',
    sourceUrl: 'https://sanctuaries.noaa.gov/'
  },

  // 🧩 RANDOM FUN TRIVIA
  {
    id: 'Q136',
    category: '🧪 Sains',
    question: 'Intan atau berlian yang super keras itu sebenarnya terbuat dari satu unsur kimia tunggal yang sama dengan isi pensil. Unsur apa?',answer:'Karbon',
    fact: 'Baik berlian maupun grafit (isi pensil) sama-sama terbuat dari Karbon murni, bedanya hanya pada susunan struktur kristalnya.',
    source: 'USGS — Diamond Minerals',
    sourceUrl: 'https://www.usgs.gov/'
  },
  {
    id: 'Q137',
    category: '🍳 Kuliner',
    question: 'Secara botani/ilmu tumbuhan, buah pisang itu sebenarnya termasuk kategori buah jenis apa?',answer:'Buah buni / Berry',
    fact: 'Dalam klasifikasi botani, pisang dipilah sebagai buah buni (berry) karena memiliki kulit luar lembut dan daging buah berair dengan biji terendam.',
    source: 'Smithsonian — Botany Facts',
    sourceUrl: 'https://www.si.edu/'
  },
  {
    id: 'Q138',
    category: '🐾 Hewan',
    question: 'Hewan mamalia darat paling cepat di dunia saat berlari jarak pendek adalah apa?',answer:'Cheetah',
    fact: 'Cheetah dapat berlari hingga kecepatan 100-120 km/jam dalam hitungan detik.',
    source: 'Smithsonian — Cheetah Facts',
    sourceUrl: 'https://nationalzoo.si.edu/'
  },
  {
    id: 'Q139',
    category: '🚀 Space',
    question: 'Bulan terbesar di Tata Surya kita yang bahkan lebih besar dari planet Merkurius bernama apa?',answer:'Ganymede',
    fact: 'Ganymede adalah bulan milik planet Jupiter dan merupakan bulan terbesar di Tata Surya.',
    source: 'NASA — Ganymede',
    sourceUrl: 'https://science.nasa.gov/jupiter/moons/ganymede/'
  },
  {
    id: 'Q140',
    category: '🌎 Bumi',
    question: 'Sungai terpanjang di Indonesia yang meliuk-liuk di Kalimantan Barat adalah Sungai apa?',answer:'Sungai Kapuas',
    fact: 'Sungai Kapuas memiliki panjang sekitar 1.143 km, menjadikannya sungai terpanjang di Indonesia.',
    source: 'Kementerian PUPR — Wilayah Sungai Indonesia',
    sourceUrl: 'https://pu.go.id/'
  },
  {
    id: 'Q141',
    category: '🎓 Budaya',
    question: 'Aksara tradisional Jawa yang terdiri dari 20 huruf dasar diawali dengan deret kata apa?',answer:'Ha Na Ca Ra Ka',
    fact: 'Aksara Jawa (Hanacaraka) disusun membentuk bait puisi legendaris tentang kisah dua abdi ksatria.',
    source: 'Kemdikbud — Aksara Nusantara',
    sourceUrl: 'https://kebudayaan.kemdikbud.go.id/'
  },
  {
    id: 'Q142',
    category: '🐾 Hewan',
    question: 'Anjing laut dan singa laut itu berbeda. Apa perbedaan fisik paling kentara pada bagian kepala mereka?',answer:'Singa laut punya daun telinga luar, anjing laut tidak punya daun telinga.',
    fact: 'Singa laut memiliki sepasang daun telinga kecil yang terlihat jelas (otariids), sedangkan anjing laut hanya memiliki lubang telinga (phocids).',
    source: 'NOAA — Seal vs Sea Lion',
    sourceUrl: 'https://www.fisheries.noaa.gov/'
  },
  {
    id: 'Q143',
    category: '🍳 Kuliner',
    question: 'Soto khas Makassar yang menggunakan kuah kaldu sapi kental berempah dan biasa disajikan dengan ketupat/buras dinamakan apa?',answer:'Coto Makassar',
    fact: 'Coto Makassar adalah hidangan tradisional Bugis-Makassar berbahan daging dan jeroan sapi yang direbus dalam bumbu kacang dan rempah khas.',
    source: 'Wonderful Indonesia — Culinary South Sulawesi',
    sourceUrl: 'https://www.indonesia.travel/'
  },
  {
    id: 'Q144',
    category: '🌺 Indonesia',
    question: 'Tanaman karnivora khas Indonesia yang daunnya membentuk piala penampung air untuk menjebak serangga disebut apa?',answer:'Kantong Semar (Nepenthes)',
    fact: 'Kantong Semar memerangkap serangga yang tergelincir masuk ke dalam kantongnya untuk dicerna guna mengambil nutrisi nitrogen.',
    source: 'BRIN — Konservasi Flora Indonesia',
    sourceUrl: 'https://brin.go.id/'
  },
  {
    id: 'Q145',
    category: '🧠 Manusia',
    question: 'Bagian mata manusia yang memberikan warna pada mata (seperti cokelat, biru, atau hijau) dinamakan apa?',answer:'Iris',
    fact: 'Iris mengatur jumlah cahaya yang masuk ke mata dengan memperbesar atau memperkecil pupil.',
    source: 'Smithsonian — Eye Anatomy',
    sourceUrl: 'https://www.si.edu/'
  },
  {
    id: 'Q146',
    category: '🌍 Laut',
    question: 'Spesies Mamalia terbesar yang pernah hidup di Bumi (bahkan lebih besar dari dinosaurus manapun) adalah apa?',answer:'Paus Biru (Blue Whale)',
    fact: 'Paus Biru bisa mencapai panjang lebih dari 30 meter dan berat hingga 180-200 ton.',
    source: 'NOAA Fisheries — Blue Whale',
    sourceUrl: 'https://www.fisheries.noaa.gov/'
  },
  {
    id: 'Q147',
    category: '🐍 Hewan',
    question: 'Ular terpanjang di dunia yang habitatnya banyak ditemukan di hutan hujan Indonesia adalah ular apa?',answer:'Ular Sanca Kembang / Piton Retikulasi (Malayopython reticulatus)',
    fact: 'Piton retikulasi diakui sebagai ular terpanjang di dunia yang bisa tumbuh melebihi 6 hingga 7 meter.',
    source: 'Smithsonian — Reptile Record',
    sourceUrl: 'https://nationalzoo.si.edu/'
  },
  {
    id: 'Q148',
    category: '🏛️ Budaya',
    question: 'Upacara adat pembakaran mayat khas masyarakat Hindu Bali dinamakan apa?',answer:'Ngaben',
    fact: 'Ngaben adalah ritual pemakaman berupa kremasi jenazah untuk mengembalikan unsur panca mahabhuta kembali ke alam semesta.',
    source: 'Wonderful Indonesia — Cultural Bali',
    sourceUrl: 'https://www.indonesia.travel/'
  },
  {
    id: 'Q149',
    category: '☕ Kuliner',
    question: 'Minuman khas Jawa Barat berbahan santan, gula merah, dan irisan kelapa muda/kolang-kaling yang disajikan hangat dinamakan apa?',answer:'Bandrek / Bajigur',
    fact: 'Bajigur berdasar santan dan gula jawa hangat, sedangkan Bandrek menonjolkan jahe murni dan rempah hangat.',
    source: 'Kemenparekraf — Minuman Tradisional',
    sourceUrl: 'https://kemenparekraf.go.id/'
  },
  {
    id: 'Q150',
    category: '🚀 Space',
    question: 'Peristiwa ketika Bulan melintas tepat di antara Bumi dan Matahari sehingga menutupi bayangan cahaya Matahari dinamakan apa?',answer:'Gerhana Matahari',
    fact: 'Gerhana matahari terjadi saat bayangan Bulan (umbra/penumbra) jatuh tepat di permukaan Bumi.',
    source: 'NASA — Eclipse Guide',
    sourceUrl: 'https://science.nasa.gov/'
  },
  // ======================================================
// SOUNDS FISHY — LOCAL INDONESIA EXPANSION
// Q151 - Q250
// Fokus: fun, aneh tapi nyata, dan enak untuk bluffing
// ======================================================


// ======================================================
// 🍜 1. KULINER INDONESIA YANG KEDENGARAN NGARANG
// ======================================================

{id:'Q151',category:'🍜 Kuliner Lokal',question:'Di Lembah Baliem ada hidangan yang namanya cocok buat bikin pasangan curiga. Udangnya disebut apa?',answer:'Udang Selingkuh',fact:'Udang Selingkuh merupakan salah satu kuliner khas kawasan Baliem di Papua Pegunungan.',source:'Wonderful Indonesia — 38 Destinations',sourceUrl:'https://www.indonesia.travel/id/id/travel-ideas/adventure/38-destinations-in-indonesia'},

{id:'Q152',category:'🍵 Kuliner Lokal',question:'Di Papua ada minuman yang namanya terdengar seperti kamu menyeduh rumah serangga. Namanya apa?',answer:'Teh Sarang Semut',fact:'Teh Sarang Semut dikenal sebagai salah satu produk khas Papua dan dibuat dari tanaman sarang semut.',source:'Wonderful Indonesia — 38 Destinations',sourceUrl:'https://www.indonesia.travel/id/id/travel-ideas/adventure/38-destinations-in-indonesia'},

{id:'Q153',category:'🌶️ Kuliner Lokal',question:'Bangka Belitung punya sambal yang namanya malah terdengar seperti lagi bikin lingkaran. Apa namanya?',answer:'Sambal Lingkung',fact:'Sambal Lingkung merupakan olahan berbentuk abon ikan berbumbu yang dikenal di Bangka Belitung.',source:'Wonderful Indonesia — 38 Destinations',sourceUrl:'https://www.indonesia.travel/id/id/travel-ideas/adventure/38-destinations-in-indonesia'},

{id:'Q154',category:'🥞 Kuliner Lokal',question:'Papua punya versi martabak yang tepung utamanya bukan terigu. Pakai apa?',answer:'Sagu',fact:'Sago Martabak merupakan salah satu variasi martabak khas Papua yang menggunakan sagu.',source:'Wonderful Indonesia — 38 Destinations',sourceUrl:'https://www.indonesia.travel/id/id/travel-ideas/adventure/38-destinations-in-indonesia'},

{id:'Q155',category:'🍚 Kuliner Lokal',question:'Nama makanan Papua yang terdengar seperti nama karakter anime tetapi sebenarnya nasi dengan ikan teri dan daun talas adalah apa?',answer:'Aunu Sanebre',fact:'Aunu Sanebre disajikan dengan nasi, ikan teri, dan irisan daun talas.',source:'Wonderful Indonesia — 38 Destinations',sourceUrl:'https://www.indonesia.travel/id/id/travel-ideas/adventure/38-destinations-in-indonesia'},

{id:'Q156',category:'🐟 Kuliner Lokal',question:'Di Papua ada makanan yang namanya sangat to the point: ikan diasapi lalu dibungkus daun talas. Disebut apa?',answer:'Ikan Bungkus',fact:'Ikan Bungkus merupakan ikan asap yang dibungkus dengan daun talas.',source:'Wonderful Indonesia — 38 Destinations',sourceUrl:'https://www.indonesia.travel/id/id/travel-ideas/adventure/38-destinations-in-indonesia'},

{id:'Q157',category:'🍰 Kuliner Lokal',question:'Aceh punya kue bernama seperti suara orang kaget ringan: "Bhoi!". Nama kuenya apa?',answer:'Bolu Bhoi',fact:'Bolu Bhoi merupakan salah satu kudapan tradisional Aceh.',source:'Wonderful Indonesia — 38 Destinations',sourceUrl:'https://www.indonesia.travel/id/id/travel-ideas/adventure/38-destinations-in-indonesia'},

{id:'Q158',category:'🍢 Kuliner Lokal',question:'Sate khas masyarakat Sasak yang namanya terdengar seperti jurus silat adalah apa?',answer:'Sate Bulayak',fact:'Sate Bulayak merupakan kuliner Sasak di Lombok yang disajikan bersama bulayak dan bumbu khas.',source:'Wonderful Indonesia — 38 Destinations',sourceUrl:'https://www.indonesia.travel/id/id/travel-ideas/adventure/38-destinations-in-indonesia'},

{id:'Q159',category:'🥧 Kuliner Lokal',question:'Di Merauke ada kue bernama seperti bahan daun, padahal bentuknya justru mirip custard pie. Apa?',answer:'Kue Lontar',fact:'Kue Lontar dikenal sebagai kue custard khas Papua dengan tekstur lembut.',source:'Wonderful Indonesia — 38 Destinations',sourceUrl:'https://www.indonesia.travel/id/id/travel-ideas/adventure/38-destinations-in-indonesia'},

{id:'Q160',category:'🥣 Kuliner Lokal',question:'Bubur khas Papua yang teksturnya bisa bikin sendok merasa sedang latihan angkat beban namanya apa?',answer:'Papeda',fact:'Papeda merupakan bubur berbahan sagu dengan tekstur kenyal dan lengket.',source:'Wonderful Indonesia — 38 Destinations',sourceUrl:'https://www.indonesia.travel/id/id/travel-ideas/adventure/38-destinations-in-indonesia'},


// ======================================================
// 🗺️ 2. TEMPAT INDONESIA YANG TERDENGAR TIDAK NYATA
// ======================================================

{id:'Q161',category:'🗺️ Tempat Lokal',question:'Di kota Indonesia mana ada momen ketika benda tegak nyaris kehilangan bayangannya karena Matahari tepat di sekitar khatulistiwa?',answer:'Pontianak',fact:'Tugu Khatulistiwa Pontianak dikenal dengan fenomena kulminasi Matahari ketika bayangan benda tegak dapat menghilang sesaat.',source:'Wonderful Indonesia — 38 Destinations',sourceUrl:'https://www.indonesia.travel/id/id/travel-ideas/adventure/38-destinations-in-indonesia'},

{id:'Q162',category:'🔥 Tempat Lokal',question:'Kalau ada orang bilang lihat api berwarna biru di gunung Indonesia tengah malam, dia belum tentu halu. Di mana?',answer:'Kawah Ijen',fact:'Kawah Ijen di Jawa Timur terkenal dengan fenomena yang populer disebut Blue Fire.',source:'Wonderful Indonesia — 38 Destinations',sourceUrl:'https://www.indonesia.travel/id/id/travel-ideas/adventure/38-destinations-in-indonesia'},

{id:'Q163',category:'🌋 Tempat Lokal',question:'Gunung mana di Indonesia punya tiga danau kawah yang warnanya dapat berubah sehingga kelihatan seperti map game fantasy?',answer:'Kelimutu',fact:'Kelimutu di Flores terkenal dengan tiga danau kawah yang dapat menunjukkan warna berbeda dan berubah seiring waktu.',source:'Wonderful Indonesia — 38 Destinations',sourceUrl:'https://www.indonesia.travel/id/id/travel-ideas/adventure/38-destinations-in-indonesia'},

{id:'Q164',category:'🚢 Tempat Lokal',question:'Di Aceh ada kapal pembangkit listrik yang sekarang malah menjadi monumen karena terseret tsunami ke daratan. Namanya apa?',answer:'PLTD Apung 1',fact:'PLTD Apung 1 terseret tsunami Aceh 2004 dan kini menjadi salah satu monumen pengingat bencana tersebut.',source:'Wonderful Indonesia — 38 Destinations',sourceUrl:'https://www.indonesia.travel/id/id/travel-ideas/adventure/38-destinations-in-indonesia'},

{id:'Q165',category:'🏠 Tempat Lokal',question:'Rumah adat super panjang di Kalimantan Barat yang namanya seperti nama boss terakhir RPG disebut apa?',answer:'Rumah Radakng',fact:'Rumah Radakng merupakan rumah panjang Dayak yang menjadi salah satu ikon Kalimantan Barat.',source:'Wonderful Indonesia — 38 Destinations',sourceUrl:'https://www.indonesia.travel/id/id/travel-ideas/adventure/38-destinations-in-indonesia'},

{id:'Q166',category:'🧭 Tempat Lokal',question:'Kalau mau berdiri dekat salah satu titik paling timur Indonesia yang bisa dikunjungi di perbatasan, taman apa yang terkenal di Merauke?',answer:'Taman Sota',fact:'Sota di Merauke dikenal sebagai kawasan perbatasan Indonesia dengan Papua Nugini dan salah satu titik timur Indonesia.',source:'Wonderful Indonesia — 38 Destinations',sourceUrl:'https://www.indonesia.travel/id/id/travel-ideas/adventure/38-destinations-in-indonesia'},

{id:'Q167',category:'❄️ Tempat Lokal',question:'Indonesia tropis, tetapi wilayah pegunungan mana yang secara historis terkenal memiliki salju abadi?',answer:'Pegunungan Jayawijaya',fact:'Pegunungan tinggi Papua merupakan lokasi Indonesia yang secara historis memiliki es dan salju di kawasan puncaknya.',source:'Wonderful Indonesia — 38 Destinations',sourceUrl:'https://www.indonesia.travel/id/id/travel-ideas/adventure/38-destinations-in-indonesia'},

{id:'Q168',category:'📚 Tempat Lokal',question:'Museum Kata milik penulis Andrea Hirata berada di pulau yang terkenal gara-gara Laskar Pelangi. Pulau apa?',answer:'Belitung',fact:'Museum Kata Andrea Hirata berada di Belitung, daerah yang menjadi latar kuat dalam karya Laskar Pelangi.',source:'Wonderful Indonesia — 38 Destinations',sourceUrl:'https://www.indonesia.travel/id/id/travel-ideas/adventure/38-destinations-in-indonesia'},

{id:'Q169',category:'🌉 Tempat Lokal',question:'Jembatan yang panjangnya sekitar 5,4 kilometer dan menghubungkan Surabaya dengan Madura bernama apa?',answer:'Jembatan Suramadu',fact:'Jembatan Suramadu memiliki panjang total sekitar 5.438 meter dan menghubungkan Surabaya dengan Pulau Madura.',source:'Kementerian PUPR — Konstruksi Indonesia',sourceUrl:'https://binakonstruksi.pu.go.id/storage/Buku-Konstruksi-Indonesia-2011.pdf'},

{id:'Q170',category:'🗼 Tempat Lokal',question:'Kalau Monas direbahkan seperti penggaris raksasa, panjangnya kira-kira berapa meter?',answer:'132 meter',fact:'Monumen Nasional memiliki ketinggian sekitar 132 meter.',source:'Pemprov DKI Jakarta — JaKita',sourceUrl:'https://jakita.jakarta.go.id/media/download/ind/edisi_9_2023.pdf'},


// ======================================================
// 💸 3. UANG RUPIAH TERNYATA PUNYA LORE
// ======================================================

{id:'Q171',category:'💸 Rupiah',question:'Seri uang kertas Rupiah 2022 punya berapa pecahan berbeda dari seribu sampai seratus ribu?',answer:'7 pecahan',fact:'Seri Rupiah 2022 terdiri atas Rp1.000, Rp2.000, Rp5.000, Rp10.000, Rp20.000, Rp50.000, dan Rp100.000.',source:'Bank Indonesia — Rupiah 2022',sourceUrl:'https://www.bi.go.id/en/publikasi/laporan/Documents/5_LPI2022_EN_CHAPTER_3.pdf'},

{id:'Q172',category:'💸 Rupiah',question:'Tanggal peluncuran uang Rupiah kertas seri 2022 sengaja dipilih bertepatan dengan tanggal nasional apa?',answer:'17 Agustus 2022',fact:'Bank Indonesia menerbitkan uang Rupiah kertas Tahun Emisi 2022 bertepatan dengan peringatan kemerdekaan Indonesia.',source:'Bank Indonesia — Rupiah 2022',sourceUrl:'https://www.bi.go.id/en/publikasi/laporan/Documents/5_LPI2022_EN_CHAPTER_3.pdf'},

{id:'Q173',category:'💸 Rupiah',question:'Uang kertas Rupiah secara umum bukan dibuat dari kertas printer. Bahan serat utamanya apa?',answer:'Serat kapas',fact:'Bank Indonesia menjelaskan bahan baku uang kertas Rupiah menggunakan kertas uang berbahan serat kapas.',source:'Bank Indonesia — Ciri Keaslian Rupiah',sourceUrl:'https://www.bi.go.id/id/edukasi/Documents/PanduanPerbankan.pdf'},

{id:'Q174',category:'💸 Rupiah',question:'Pada pecahan Rupiah tertentu, benang pengamannya bisa berubah warna ketika dilihat dari sudut berbeda. Dua pecahan besar apa?',answer:'Rp100.000 dan Rp50.000',fact:'Bank Indonesia menjelaskan benang pengaman pecahan Rp100.000 dan Rp50.000 memiliki efek perubahan warna dari sudut tertentu.',source:'Bank Indonesia — Ciri Keaslian Rupiah',sourceUrl:'https://www.bi.go.id/id/edukasi/Documents/PanduanPerbankan.pdf'},

{id:'Q175',category:'💸 Rupiah',question:'Kalau uang Rupiah asli disorot UV, salah satu fitur yang dapat menyala adalah bagian apa?',answer:'Benang pengaman pada pecahan tertentu',fact:'Beberapa pecahan Rupiah memiliki benang pengaman yang memendar ketika terkena sinar ultraviolet.',source:'Bank Indonesia — Ciri Keaslian Rupiah',sourceUrl:'https://www.bi.go.id/id/edukasi/Documents/PanduanPerbankan.pdf'},

{id:'Q176',category:'💸 Rupiah',question:'Fitur Rupiah berupa gambar depan-belakang yang baru terlihat utuh ketika diterawang disebut apa?',answer:'Rectoverso / gambar saling isi',fact:'Gambar saling isi atau rectoverso merupakan salah satu unsur pengaman uang Rupiah.',source:'Bank Indonesia — Ciri Keaslian Rupiah',sourceUrl:'https://www.bi.go.id/id/edukasi/Documents/FAQCiri2KeaslianUang.pdf'},

{id:'Q177',category:'💸 Rupiah',question:'Watermark pada seri Rupiah 2022 dibuat menyerupai gambar siapa?',answer:'Pahlawan nasional pada uang tersebut',fact:'Bank Indonesia menggunakan watermark yang mencerminkan gambar pahlawan nasional pada uang kertas seri 2022.',source:'Bank Indonesia — Rupiah 2022',sourceUrl:'https://www.bi.go.id/en/publikasi/laporan/Documents/5_LPI2022_EN_CHAPTER_3.pdf'},

{id:'Q178',category:'💸 Rupiah',question:'Supaya pecahan uang lebih mudah dibedakan termasuk oleh pengguna dengan gangguan penglihatan, selisih panjang antaruang seri 2022 diperbesar menjadi berapa?',answer:'5 milimeter',fact:'Perbedaan panjang antarpecahan Rupiah seri 2022 ditingkatkan menjadi 5 mm.',source:'Bank Indonesia — Rupiah 2022',sourceUrl:'https://www.bi.go.id/en/publikasi/laporan/Documents/5_LPI2022_EN_CHAPTER_3.pdf'},

{id:'Q179',category:'💸 Rupiah',question:'Dua tokoh yang nongkrong bareng di bagian depan uang Rp100.000 adalah siapa?',answer:'Soekarno dan Mohammad Hatta',fact:'Pecahan Rp100.000 menampilkan proklamator Soekarno dan Mohammad Hatta.',source:'Bank Indonesia — Annual Report',sourceUrl:'https://www.bi.go.id/en/publikasi/laporan/Documents/AR2016_20170622.pdf'},

{id:'Q180',category:'💸 Rupiah',question:'Pemandangan Indonesia apa yang muncul di bagian belakang uang Rp100.000 bersama Tari Topeng Betawi pada desain Rupiah?',answer:'Raja Ampat',fact:'Desain pecahan Rp100.000 menampilkan Tari Topeng Betawi serta panorama Raja Ampat pada sisi belakang.',source:'Bank Indonesia — Annual Report',sourceUrl:'https://www.bi.go.id/en/publikasi/laporan/Documents/AR2016_20170622.pdf'},


// ======================================================
// 🗣️ 4. BAHASA PROKEM INDONESIA
// ======================================================

{id:'Q181',category:'🗣️ Bahasa Lokal',question:'Sebelum internet penuh dengan "santuy", ada slang "woles". Maksudnya apa?',answer:'Santai',fact:'Kajian Badan Bahasa mencatat woles sebagai bahasa prokem dengan makna santai.',source:'Badan Bahasa — Bahasa Prokem Media Sosial',sourceUrl:'https://ojs.badanbahasa.kemdikbud.go.id/jurnal/index.php/batra/article/download/3695/1781'},

{id:'Q182',category:'🗣️ Bahasa Lokal',question:'Kalau teman menjawab "sabi", dia sebenarnya lagi bilang apa?',answer:'Bisa',fact:'Sabi digunakan sebagai bentuk bahasa prokem dari kata bisa.',source:'Badan Bahasa — Bahasa Prokem Media Sosial',sourceUrl:'https://ojs.badanbahasa.kemdikbud.go.id/jurnal/index.php/batra/article/download/3695/1781'},

{id:'Q183',category:'🗣️ Bahasa Lokal',question:'Dalam slang internet Indonesia, "sokin" bukan nama karakter Mortal Kombat. Artinya apa?',answer:'Sini',fact:'Sokin dicatat sebagai bahasa prokem yang bermakna sini.',source:'Badan Bahasa — Bahasa Prokem Media Sosial',sourceUrl:'https://ojs.badanbahasa.kemdikbud.go.id/jurnal/index.php/batra/article/download/3695/1781'},

{id:'Q184',category:'🗣️ Bahasa Lokal',question:'Kalau makanan disebut "kane", sebenarnya orang itu sedang bilang apa?',answer:'Enak',fact:'Kane merupakan pembalikan yang dipakai sebagai slang untuk enak.',source:'Badan Bahasa — Bahasa Prokem Media Sosial',sourceUrl:'https://ojs.badanbahasa.kemdikbud.go.id/jurnal/index.php/batra/article/download/3695/1781'},

{id:'Q185',category:'🗣️ Bahasa Lokal',question:'Kalau seseorang chat cuma satu kata "kuy", sebenarnya dia ngajak apa?',answer:'Yuk / ayo',fact:'Kuy umum digunakan sebagai bentuk slang dari yuk.',source:'Badan Bahasa — Bahasa Prokem Media Sosial',sourceUrl:'https://ojs.badanbahasa.kemdikbud.go.id/jurnal/index.php/batra/article/download/3695/1781'},

{id:'Q186',category:'🗣️ Bahasa Lokal',question:'Dalam bahasa tongkrongan, kondisi tidak ada kerjaan sampai buka kulkas tiga kali disebut apa?',answer:'Gabut',fact:'Gabut digunakan dalam bahasa prokem untuk menggambarkan keadaan bosan atau tidak ada kegiatan.',source:'Badan Bahasa — Bahasa Prokem Media Sosial',sourceUrl:'https://ojs.badanbahasa.kemdikbud.go.id/jurnal/index.php/batra/article/download/3695/1781'},

{id:'Q187',category:'🗣️ Bahasa Lokal',question:'Akronim sakti untuk kondisi ketika remote TV terlalu jauh dua meter dari tangan adalah apa?',answer:'Mager',fact:'Mager merupakan kependekan populer dari malas gerak.',source:'Badan Bahasa — Bahasa Prokem Media Sosial',sourceUrl:'https://ojs.badanbahasa.kemdikbud.go.id/jurnal/index.php/batra/article/download/3695/1781'},

{id:'Q188',category:'🗣️ Bahasa Lokal',question:'Orang yang terlalu memasukkan ucapan orang lain ke hati biasanya disebut sedang apa?',answer:'Baper',fact:'Baper merupakan kependekan dari bawa perasaan.',source:'Badan Bahasa — Bahasa Prokem Media Sosial',sourceUrl:'https://ojs.badanbahasa.kemdikbud.go.id/jurnal/index.php/batra/article/download/3695/1781'},

{id:'Q189',category:'🗣️ Bahasa Lokal',question:'Istilah tongkrongan untuk orang yang hidupnya mendadak berpusat 97 persen pada pasangan adalah apa?',answer:'Bucin',fact:'Bucin merupakan kependekan populer dari budak cinta.',source:'Badan Bahasa — Bahasa Prokem Media Sosial',sourceUrl:'https://ojs.badanbahasa.kemdikbud.go.id/jurnal/index.php/batra/article/download/3695/1781'},

{id:'Q190',category:'🗣️ Bahasa Lokal',question:'Kalau seseorang menjawab sesuatu yang sama sekali tidak nyambung, tiga huruf slang yang cocok apa?',answer:'Gaje',fact:'Gaje digunakan sebagai singkatan slang dari tidak jelas atau gak jelas.',source:'Badan Bahasa — Bahasa Prokem Media Sosial',sourceUrl:'https://ojs.badanbahasa.kemdikbud.go.id/jurnal/index.php/batra/article/download/3695/1781'},


// ======================================================
// 🐾 5. HEWAN NUSANTARA YANG TERDENGAR HASIL EDITAN
// ======================================================

{id:'Q191',category:'🐾 Satwa Lokal',question:'Telur burung Maleo bisa kira-kira berapa kali lebih besar daripada telur ayam?',answer:'Sekitar 5 kali lebih besar',fact:'BBKSDA Sulawesi Selatan menyebut telur Maleo dapat mencapai sekitar lima kali ukuran telur ayam.',source:'BBKSDA Sulawesi Selatan — Maleo',sourceUrl:'https://bbksdasulsel.ksdae.kehutanan.go.id/identifikasi-spesies-kunci-sulawesi-maleo-si-burung-anti-poligami'},

{id:'Q192',category:'🐾 Satwa Lokal',question:'Burung Maleo punya metode mengerami telur yang sangat hemat listrik. Telurnya dipanaskan pakai apa?',answer:'Panas alami tanah atau geothermal',fact:'Maleo mengubur telur pada pasir atau tanah panas dan memanfaatkan panas Matahari maupun geothermal.',source:'BBKSDA Sulawesi Selatan — Maleo',sourceUrl:'https://bbksdasulsel.ksdae.kehutanan.go.id/identifikasi-spesies-kunci-sulawesi-maleo-si-burung-anti-poligami'},

{id:'Q193',category:'🐾 Satwa Lokal',question:'Setelah anak Maleo berhasil menggali keluar dari tanah, siapa yang mengajari dia cari makan?',answer:'Tidak ada, anak Maleo langsung mandiri',fact:'Anak Maleo keluar dari sarang tanpa pengasuhan induk dan sudah mampu mencari makan sendiri.',source:'BBKSDA Sulawesi Selatan — Maleo',sourceUrl:'https://bbksdasulsel.ksdae.kehutanan.go.id/identifikasi-spesies-kunci-sulawesi-maleo-si-burung-anti-poligami'},

{id:'Q194',category:'👀 Satwa Lokal',question:'Primata mungil Sulawesi bermata superbesar ini bisa memutar kepalanya kira-kira sampai berapa derajat?',answer:'Sekitar 180 derajat',fact:'Manual bio-ekologi KSDAE menyebut kepala tarsius dapat berputar sekitar 180 derajat.',source:'Ditjen KSDAE — Spesies Kunci Sulawesi',sourceUrl:'https://ksdae.menlhk.go.id/assets/publikasi/Book_Manual%20Identifikasi%20dan%20Bio-Ekologi%20Spesies%20Kunci%20di%20Sulawesi.pdf'},

{id:'Q195',category:'🥩 Satwa Lokal',question:'Primata kecil Indonesia apa yang terkenal sangat berbeda karena menu makannya sepenuhnya hewani?',answer:'Tarsius',fact:'Publikasi BRIN menyebut tarsius sebagai primata yang sepenuhnya karnivor, memakan serangga dan vertebrata kecil.',source:'BRIN — Primata Indonesia',sourceUrl:'https://penerbit.brin.go.id/press/catalog/download/732/1013/24641?inline=1'},

{id:'Q196',category:'👃 Satwa Lokal',question:'Pada bekantan jantan, hidung besar ternyata bukan sekadar desain karakter. Salah satu fungsinya berhubungan dengan apa?',answer:'Status dan daya tarik pasangan',fact:'Ukuran hidung bekantan jantan berkaitan dengan ukuran tubuh, status, dan keberhasilan menarik pasangan.',source:'Smithsonian — Proboscis Monkey',sourceUrl:'https://www.si.edu/object/why-do-these-monkeys-have-such-outrageous-noses%3Ayt_WIO9mFovSS4'},

{id:'Q197',category:'🏊 Satwa Lokal',question:'Primata Kalimantan mana yang ternyata jago berenang dan memiliki jari yang sebagian berselaput?',answer:'Bekantan',fact:'Bekantan merupakan primata yang sangat akuatik dan memiliki adaptasi yang membantu mereka berenang.',source:'Smithsonian Magazine — Proboscis Monkey',sourceUrl:'https://www.smithsonianmag.com/science-nature/endangered-proboscis-monkey-easily-identifiable-by-one-physical-trait-supersized-schnoz-180988420/'},

{id:'Q198',category:'🐗 Satwa Lokal',question:'Taring atas babirusa jantan tumbuh ke arah yang sangat salah menurut standar gigi normal. Lewat mana?',answer:'Menembus kulit bagian atas moncong',fact:'Taring atas babirusa tumbuh ke atas, menembus kulit moncong, lalu melengkung ke arah dahi.',source:'Animal Diversity Web — Babirusa',sourceUrl:'https://animaldiversity.org/accounts/Babyrousa_babyrussa/'},

{id:'Q199',category:'🐗 Satwa Lokal',question:'Kalau taring babirusa terus tumbuh tanpa aus, bagian tubuhnya sendiri apa yang bahkan bisa tertusuk?',answer:'Kepalanya sendiri',fact:'Taring babirusa dapat terus melengkung ke belakang dan dalam kondisi tertentu dapat menembus kulit kepala.',source:'Smithsonian — Babirusa',sourceUrl:'https://www.si.edu/object/wild-pig-has-fangs-can-pierce-its-own-skull%3Ayt_2D-7zgw1Lq0'},

{id:'Q200',category:'🐦 Satwa Lokal',question:'Burung putih berjambul dengan kulit biru di sekitar mata yang menjadi fauna ikonik Bali bernama apa?',answer:'Jalak Bali',fact:'Jalak Bali atau Bali myna merupakan burung endemik Bali yang kini berstatus sangat terancam.',source:'Journal of Tropical Forest Management — Bali Myna',sourceUrl:'https://journal.ipb.ac.id/jmht/article/download/62951/32490/383747'},


// ======================================================
// 🎭 6. WARISAN BUDAYA INDONESIA
// ======================================================

{id:'Q201',category:'🎭 Budaya Lokal',question:'Warisan pertunjukan dari Jawa Timur yang masuk daftar UNESCO pada 2024 dan terkenal dengan topeng singa raksasa adalah apa?',answer:'Reog Ponorogo',fact:'UNESCO mencantumkan Reog Ponorogo performing art pada daftar warisan budaya takbenda pada 2024.',source:'UNESCO — Indonesia ICH',sourceUrl:'https://ich.unesco.org/en/state/indonesia-ID'},

{id:'Q202',category:'👗 Budaya Lokal',question:'Pakaian tradisional yang dipakai lintas negara Asia Tenggara dan masuk UNESCO pada 2024 adalah apa?',answer:'Kebaya',fact:'Pengetahuan, keterampilan, tradisi, dan praktik terkait kebaya dicantumkan UNESCO secara multinasional.',source:'UNESCO — Indonesia ICH',sourceUrl:'https://ich.unesco.org/en/state/indonesia-ID'},

{id:'Q203',category:'🎵 Budaya Lokal',question:'Instrumen pukul dari Sulawesi Utara yang ikut masuk warisan budaya UNESCO bersama tradisi balafon Afrika adalah apa?',answer:'Kolintang',fact:'Praktik budaya terkait balafon dan kolintang dicantumkan UNESCO pada 2024.',source:'UNESCO — Indonesia ICH',sourceUrl:'https://ich.unesco.org/en/state/indonesia-ID'},

{id:'Q204',category:'🗣️ Budaya Lokal',question:'Tradisi berbalas kalimat berima yang sering bikin orang mendadak jadi penyair kondangan masuk daftar UNESCO. Apa?',answer:'Pantun',fact:'Pantun tercantum sebagai warisan budaya takbenda multinasional yang melibatkan Indonesia.',source:'UNESCO — Indonesia ICH',sourceUrl:'https://ich.unesco.org/en/state/indonesia-ID'},

{id:'Q205',category:'🌿 Budaya Lokal',question:'Minuman rempah yang biasanya diminum ketika badan mulai terasa "kayaknya besok sakit" resmi masuk UNESCO pada 2023. Apa?',answer:'Jamu',fact:'Jamu wellness culture dicantumkan UNESCO pada Representative List tahun 2023.',source:'UNESCO — Indonesia ICH',sourceUrl:'https://ich.unesco.org/en/state/indonesia-ID'},

{id:'Q206',category:'⛵ Budaya Lokal',question:'UNESCO bukan cuma mengakui kapalnya, tapi seni membuat kapal tradisional Sulawesi Selatan. Namanya?',answer:'Pinisi',fact:'Pinisi, art of boatbuilding in South Sulawesi, masuk Representative List UNESCO pada 2017.',source:'UNESCO — Indonesia ICH',sourceUrl:'https://ich.unesco.org/en/state/indonesia-ID'},

{id:'Q207',category:'👜 Budaya Lokal',question:'Tas tradisional Papua yang bisa berfungsi untuk membawa barang, hasil kebun, bahkan bayi disebut apa?',answer:'Noken',fact:'Noken merupakan tas rajut atau anyam multifungsi masyarakat Papua dan tercantum UNESCO.',source:'UNESCO — Indonesia ICH',sourceUrl:'https://ich.unesco.org/en/state/indonesia-ID'},

{id:'Q208',category:'💃 Budaya Lokal',question:'Tarian Aceh yang identik dengan barisan penari duduk dan gerakan superkompak disebut apa?',answer:'Tari Saman',fact:'Saman dance tercantum dalam daftar warisan budaya takbenda UNESCO.',source:'UNESCO — Indonesia ICH',sourceUrl:'https://ich.unesco.org/en/state/indonesia-ID'},

{id:'Q209',category:'🧵 Budaya Lokal',question:'Kota Indonesia yang punya praktik pendidikan batik yang bahkan dicatat UNESCO sebagai contoh safeguarding adalah kota apa?',answer:'Pekalongan',fact:'UNESCO mencatat program pendidikan dan pelatihan batik bersama Batik Museum di Pekalongan sebagai praktik pelindungan warisan budaya.',source:'UNESCO — Indonesia ICH',sourceUrl:'https://ich.unesco.org/en/lists?country%5B%5D=00104&multinational=3&text='},

{id:'Q210',category:'🗡️ Budaya Lokal',question:'Dua warisan Indonesia yang sudah masuk daftar UNESCO sejak 2008 adalah Wayang dan benda berbilah apa?',answer:'Keris',fact:'Wayang puppet theatre dan Indonesian Kris termasuk elemen warisan budaya Indonesia dalam daftar UNESCO.',source:'UNESCO — Indonesia ICH',sourceUrl:'https://ich.unesco.org/en/lists?country%5B%5D=00104&multinational=3&text='},


// ======================================================
// 🌋 7. ALAM INDONESIA: BUMI SEDANG COOKING
// ======================================================

{id:'Q211',category:'🌦️ Alam Lokal',question:'Secara umum Indonesia dikenal punya berapa musim utama? Jangan jawab musim durian.',answer:'2 musim utama',fact:'BMKG menjelaskan Indonesia secara umum memiliki dua musim utama, yaitu musim hujan dan musim kemarau.',source:'BMKG — Musim',sourceUrl:'https://gaw-bariri.bmkg.go.id/publikasi/gawsarium/348-musim'},

{id:'Q212',category:'☀️ Alam Lokal',question:'Secara klimatologis, musim kemarau di banyak wilayah Indonesia umumnya berada sekitar bulan apa sampai apa?',answer:'April sampai Oktober',fact:'BMKG menjelaskan musim kemarau secara umum berlangsung sekitar April hingga Oktober, walau waktu aktual dapat berbeda antardaerah.',source:'BMKG — Musim',sourceUrl:'https://gaw-bariri.bmkg.go.id/publikasi/gawsarium/348-musim'},

{id:'Q213',category:'🌀 Alam Lokal',question:'Kenapa Indonesia relatif jarang dihantam langsung pusat siklon tropis dibanding wilayah yang lebih jauh dari khatulistiwa?',answer:'Karena Indonesia berada dekat khatulistiwa',fact:'BMKG menjelaskan lokasi Indonesia dekat ekuator membuat pembentukan dan lintasan langsung siklon tropis relatif jarang.',source:'BMKG — Siklon Tropis',sourceUrl:'https://gaw-bariri.bmkg.go.id/publikasi/gawsarium/388-siklon-tropis'},

{id:'Q214',category:'🌀 Alam Lokal',question:'Sejak 2008 lembaga Indonesia apa yang ditunjuk WMO menjadi Tropical Cyclone Warning Center Jakarta?',answer:'BMKG',fact:'BMKG ditunjuk WMO sebagai Tropical Cyclone Warning Center Jakarta sejak 2008.',source:'BMKG — Siklon Tropis',sourceUrl:'https://www.bmkg.go.id/siaran-pers/bagaimana-potensi-pertumbuhan-siklon-tropis-di-wilayah-indonesia-bgini-penjelasannya'},

{id:'Q215',category:'⚡ Alam Lokal',question:'Pada 2026, BMKG menyebut punya berapa lokasi pengamatan petir yang tersebar di Indonesia?',answer:'61 lokasi',fact:'BMKG menyebut memiliki 61 lokasi pengamatan petir di Indonesia pada laporan sambaran petir 2026.',source:'BMKG — Sambaran Petir Juli 2026',sourceUrl:'https://www.bmkg.go.id/geofisika-potensial/peta-sambaran-petir/informasi-sambaran-petir-bulan-juli-2026'},

{id:'Q216',category:'🌋 Alam Lokal',question:'Gunung Indonesia yang meletus pada 1815 dan dianggap salah satu letusan terbesar dalam sejarah tercatat adalah apa?',answer:'Gunung Tambora',fact:'Kajian Badan Geologi menyebut erupsi Tambora 1815 sebagai salah satu peristiwa vulkanik terbesar dan paling dahsyat dalam sejarah tercatat.',source:'Badan Geologi — Tambora 1815',sourceUrl:'https://ijog.geologi.esdm.go.id/index.php/IJOG/article/view/8'},

{id:'Q217',category:'🌋 Alam Lokal',question:'Tiang letusan Tambora 1815 diperkirakan menjulang sampai ketinggian sekitar berapa kilometer?',answer:'Sekitar 43 kilometer',fact:'Publikasi Badan Geologi menyebut kolom letusan Tambora mencapai sekitar 43 km.',source:'Badan Geologi — Gunung Tambora',sourceUrl:'https://geologi.esdm.go.id/storage/publikasi/drHWJorsgoX8EDmofhqw0OPkpNSXDlg22IOCXjBg.pdf'},

{id:'Q218',category:'🌋 Alam Lokal',question:'Kira-kira berapa kilometer kubik material yang dihembuskan dalam letusan besar Tambora 1815 menurut Badan Geologi?',answer:'Sekitar 150 km³',fact:'Badan Geologi mencatat volume material letusan Tambora sekitar 150 kilometer kubik.',source:'Badan Geologi — Gunung Tambora',sourceUrl:'https://geologi.esdm.go.id/storage/publikasi/drHWJorsgoX8EDmofhqw0OPkpNSXDlg22IOCXjBg.pdf'},

{id:'Q219',category:'🥶 Alam Lokal',question:'Letusan Tambora ikut berhubungan dengan anomali iklim yang membuat 1816 terkenal di Eropa dan Amerika Utara sebagai tahun tanpa apa?',answer:'Tanpa musim panas / Year Without a Summer',fact:'Material vulkanik Tambora menurunkan suhu global dan berhubungan dengan fenomena 1816 yang dikenal sebagai Year Without a Summer.',source:'Badan Geologi — Gunung Tambora',sourceUrl:'https://geologi.esdm.go.id/storage/publikasi/drHWJorsgoX8EDmofhqw0OPkpNSXDlg22IOCXjBg.pdf'},

{id:'Q220',category:'🌋 Alam Lokal',question:'Dua letusan gunung Indonesia yang sering dijadikan contoh letusan kolosal abad ke-19 adalah Tambora 1815 dan apa?',answer:'Krakatau 1883',fact:'Badan Geologi membahas Tambora 1815 dan Krakatau 1883 sebagai dua letusan skala sangat besar dalam sejarah Indonesia.',source:'Badan Geologi — Geo-Hazards',sourceUrl:'https://jgsm.geologi.esdm.go.id/index.php/JGSM/article/view/133'},


// ======================================================
// 🚇 8. TRANSPORTASI INDONESIA
// ======================================================

{id:'Q221',category:'🚌 Transport Lokal',question:'TransJakarta pertama kali mulai mengangkut penumpang pada tanggal berapa?',answer:'15 Januari 2004',fact:'TransJakarta memperingati awal operasional koridor pertamanya pada 15 Januari 2004.',source:'TransJakarta — 22 Tahun',sourceUrl:'https://transjakarta.co.id/berita/22-tahun-melangkah-lebih-jauh-pelanggan-adalah-penggerak-utama-transformasi-transjakarta-menuju-standar-dunia'},

{id:'Q222',category:'🚌 Transport Lokal',question:'Koridor nomor 1 TransJakarta menghubungkan dua kawasan Jakarta mana?',answer:'Blok M dan Kota',fact:'Koridor 1 TransJakarta melayani rute Blok M sampai Kota.',source:'TransJakarta — Routes',sourceUrl:'https://transjakarta.co.id/routes'},

{id:'Q223',category:'🚇 Transport Lokal',question:'Moda yang pada 2019 resmi menjadi sistem MRT pertama yang beroperasi di Indonesia adalah apa?',answer:'MRT Jakarta',fact:'MRT Jakarta resmi beroperasi pada 24 Maret 2019 dan menjadi sistem MRT pertama di Indonesia.',source:'MRT Jakarta — Satu Tahun Operasi',sourceUrl:'https://jakartamrt.co.id/id/siaran-pers/genap-satu-tahun-mrt-jakarta-hadir-melayani-masyarakat'},

{id:'Q224',category:'🚇 Transport Lokal',question:'Panjang jalur MRT Jakarta Fase 1 dari Lebak Bulus ke Bundaran HI kira-kira berapa kilometer?',answer:'Sekitar 16 kilometer',fact:'Fase 1 MRT Jakarta memiliki panjang kurang lebih 16 km.',source:'MRT Jakarta — Fase 1',sourceUrl:'https://www.jakartamrt.co.id/id/proyek/fase-1'},

{id:'Q225',category:'🚇 Transport Lokal',question:'Dari 13 stasiun MRT Jakarta Fase 1, berapa yang berada di bawah tanah?',answer:'6 stasiun',fact:'Fase 1 memiliki tujuh stasiun layang dan enam stasiun bawah tanah.',source:'MRT Jakarta — Fase 1',sourceUrl:'https://www.jakartamrt.co.id/id/proyek/fase-1'},

{id:'Q226',category:'🚇 Transport Lokal',question:'Satu rangkaian MRT Jakarta terdiri dari berapa kereta?',answer:'6 kereta',fact:'MRT Jakarta menyebut satu trainset terdiri atas enam kereta.',source:'MRT Jakarta — FAQ',sourceUrl:'https://jakartamrt.co.id/id/faq'},

{id:'Q227',category:'🚇 Transport Lokal',question:'MRT Jakarta menyiapkan 16 rangkaian. Berapa yang direncanakan beroperasi dan berapa yang jadi cadangan?',answer:'14 beroperasi dan 2 cadangan',fact:'MRT Jakarta menyiapkan 16 trainset dengan 14 untuk operasi dan dua sebagai cadangan.',source:'MRT Jakarta — FAQ',sourceUrl:'https://jakartamrt.co.id/id/faq'},

{id:'Q228',category:'🚇 Transport Lokal',question:'Perjalanan ujung ke ujung MRT Lebak Bulus sampai Bundaran HI dirancang sekitar berapa menit?',answer:'Sekitar 30 menit',fact:'MRT Jakarta mencantumkan total waktu perjalanan sekitar 30 menit pada Fase 1.',source:'MRT Jakarta — FAQ',sourceUrl:'https://jakartamrt.co.id/id/faq'},

{id:'Q229',category:'🚇 Transport Lokal',question:'Saat berhenti normal di stasiun, pintu MRT tidak dibuka buat nongkrong. Dwell time kira-kira berapa detik?',answer:'Sekitar 30 detik',fact:'MRT Jakarta mencantumkan waktu singgah kereta sekitar 30 detik di stasiun.',source:'MRT Jakarta — FAQ',sourceUrl:'https://jakartamrt.co.id/id/faq'},

{id:'Q230',category:'🚇 Transport Lokal',question:'Satu rangkaian MRT Jakarta dapat menampung kira-kira berapa penumpang?',answer:'Sekitar 1.200–1.800 penumpang',fact:'Menurut FAQ MRT Jakarta, satu rangkaian enam kereta dapat menampung sekitar 1.200 hingga 1.800 penumpang.',source:'MRT Jakarta — FAQ',sourceUrl:'https://jakartamrt.co.id/id/faq'},


// ======================================================
// 📍 9. TEBAK DAERAH DARI CLUE ANEH
// ======================================================

{id:'Q231',category:'📍 Tebak Daerah',question:'Kalau clue-nya Danau Kaolin, novel Laskar Pelangi, dan kerajinan timah, provinsi mana yang dicari?',answer:'Bangka Belitung',fact:'Bangka Belitung dikenal dengan Danau Kaolin, kaitan kuat dengan Laskar Pelangi, dan kerajinan timah.',source:'Wonderful Indonesia — 38 Destinations',sourceUrl:'https://www.indonesia.travel/id/id/travel-ideas/adventure/38-destinations-in-indonesia'},

{id:'Q232',category:'📍 Tebak Daerah',question:'Clue: Tugu Khatulistiwa, Rumah Radakng, dan Danau Sentarum. Provinsi mana?',answer:'Kalimantan Barat',fact:'Ketiga destinasi tersebut merupakan ikon yang dikaitkan dengan Kalimantan Barat.',source:'Wonderful Indonesia — 38 Destinations',sourceUrl:'https://www.indonesia.travel/id/id/travel-ideas/adventure/38-destinations-in-indonesia'},

{id:'Q233',category:'📍 Tebak Daerah',question:'Clue: Wae Rebo, Padar, Kelimutu, dan komodo. Semua mengarah ke provinsi mana?',answer:'Nusa Tenggara Timur',fact:'Wae Rebo, Padar, Kelimutu, dan kawasan Komodo berada di Nusa Tenggara Timur.',source:'Wonderful Indonesia — 38 Destinations',sourceUrl:'https://www.indonesia.travel/id/id/travel-ideas/adventure/38-destinations-in-indonesia'},

{id:'Q234',category:'📍 Tebak Daerah',question:'Clue: Sade Village, Gunung Rinjani, dan Ayam Taliwang. Provinsi mana?',answer:'Nusa Tenggara Barat',fact:'Sade, Rinjani, dan kuliner Taliwang merupakan ikon Nusa Tenggara Barat.',source:'Wonderful Indonesia — 38 Destinations',sourceUrl:'https://www.indonesia.travel/id/id/travel-ideas/adventure/38-destinations-in-indonesia'},

{id:'Q235',category:'📍 Tebak Daerah',question:'Clue: Masjid Baiturrahman, Museum Tsunami, dan PLTD Apung. Provinsi mana?',answer:'Aceh',fact:'Ketiga lokasi tersebut merupakan landmark penting di Aceh.',source:'Wonderful Indonesia — 38 Destinations',sourceUrl:'https://www.indonesia.travel/id/id/travel-ideas/adventure/38-destinations-in-indonesia'},

{id:'Q236',category:'📍 Tebak Daerah',question:'Clue: Danau Toba, Istana Maimun, dan Berastagi. Provinsi mana?',answer:'Sumatera Utara',fact:'Danau Toba, Istana Maimun, dan Berastagi merupakan destinasi utama Sumatera Utara.',source:'Wonderful Indonesia — 38 Destinations',sourceUrl:'https://www.indonesia.travel/id/id/travel-ideas/adventure/38-destinations-in-indonesia'},

{id:'Q237',category:'📍 Tebak Daerah',question:'Clue: Raja Ampat, Misool, Waigeo, dan ibu kota Sorong. Provinsi apa?',answer:'Papua Barat Daya',fact:'Raja Ampat, Misool, dan Waigeo berada dalam wilayah Papua Barat Daya.',source:'Wonderful Indonesia — 38 Destinations',sourceUrl:'https://www.indonesia.travel/id/id/travel-ideas/adventure/38-destinations-in-indonesia'},

{id:'Q238',category:'📍 Tebak Daerah',question:'Clue: Sota, Wasur, dan Kota Merauke. Provinsi mana?',answer:'Papua Selatan',fact:'Merauke, Sota, dan Taman Nasional Wasur berada di Papua Selatan.',source:'Wonderful Indonesia — 38 Destinations',sourceUrl:'https://www.indonesia.travel/id/id/travel-ideas/adventure/38-destinations-in-indonesia'},

{id:'Q239',category:'📍 Tebak Daerah',question:'Clue: Kawah Ijen, Bromo, Surabaya, dan jembatan superpanjang ke Madura. Provinsi mana?',answer:'Jawa Timur',fact:'Ijen, Bromo, Surabaya, dan Jembatan Suramadu berada di Jawa Timur.',source:'Wonderful Indonesia — 38 Destinations',sourceUrl:'https://www.indonesia.travel/id/id/travel-ideas/adventure/38-destinations-in-indonesia'},

{id:'Q240',category:'📍 Tebak Daerah',question:'Clue: Malioboro, Tamansari, Kotagede, gudeg, dan bakpia. Daerah mana?',answer:'Daerah Istimewa Yogyakarta',fact:'Malioboro, Tamansari, Kotagede, gudeg, dan bakpia merupakan ikon Yogyakarta.',source:'Wonderful Indonesia — 38 Destinations',sourceUrl:'https://www.indonesia.travel/id/id/travel-ideas/adventure/38-destinations-in-indonesia'},


// ======================================================
// 🐟 10. SUPER FISHY — JAWABANNYA KAYAK BOHONG
// ======================================================

{id:'Q241',category:'🐟 Super Fishy',question:'Anak burung Maleo yang baru menetas harus menggali sendiri dari dalam tanah. Perjuangannya bisa memakan waktu kira-kira berapa lama?',answer:'Sekitar 48 jam',fact:'BBKSDA Sulawesi Selatan menyebut proses anak Maleo mencapai permukaan dapat memakan waktu sekitar 48 jam tergantung kondisi tanah.',source:'BBKSDA Sulawesi Selatan — Maleo',sourceUrl:'https://bbksdasulsel.ksdae.kehutanan.go.id/identifikasi-spesies-kunci-sulawesi-maleo-si-burung-anti-poligami'},

{id:'Q242',category:'🐟 Super Fishy',question:'Satu telur Maleo bisa punya berat sekitar seperempat kilogram. Kisaran beratnya berapa?',answer:'Sekitar 240–270 gram',fact:'Telur Maleo dapat memiliki berat sekitar 240 hingga 270 gram per butir.',source:'BBKSDA Sulawesi Selatan — Maleo',sourceUrl:'https://bbksdasulsel.ksdae.kehutanan.go.id/identifikasi-spesies-kunci-sulawesi-maleo-si-burung-anti-poligami'},

{id:'Q243',category:'🐟 Super Fishy',question:'Tarsius kelihatannya seperti hasil gabungan monyet, alien, dan burung hantu. Bobot banyak tarsius dewasa cuma sekitar berapa gram?',answer:'Sekitar 80–100 gram',fact:'Manual KSDAE mencatat bobot tarsius umumnya sekitar 80 hingga 100 gram, tergantung spesies.',source:'Ditjen KSDAE — Spesies Kunci Sulawesi',sourceUrl:'https://ksdae.menlhk.go.id/assets/publikasi/Book_Manual%20Identifikasi%20dan%20Bio-Ekologi%20Spesies%20Kunci%20di%20Sulawesi.pdf'},

{id:'Q244',category:'🐟 Super Fishy',question:'Selain serangga, menu tarsius ternyata bisa mencakup hewan yang bikin manusia mundur dua langkah. Contohnya apa?',answer:'Ular kecil',fact:'Publikasi BRIN mencatat tarsius juga dapat memangsa vertebrata kecil seperti kadal, katak, burung, tikus, dan ular.',source:'BRIN — Primata Indonesia',sourceUrl:'https://penerbit.brin.go.id/press/catalog/download/732/1013/24641?inline=1'},

{id:'Q245',category:'🐟 Super Fishy',question:'Monas setinggi 132 meter ternyata tidak selesai dalam satu era presiden. Pembangunannya berlangsung kira-kira berapa tahun?',answer:'Sekitar 14 tahun',fact:'Pemprov DKI menyebut pembangunan dan penyelesaian Monas membutuhkan sekitar 14 tahun dan berlangsung pada era Soekarno hingga Soeharto.',source:'Pemprov DKI Jakarta — JaKita',sourceUrl:'https://jakita.jakarta.go.id/media/download/ind/edisi_9_2023.pdf'},

{id:'Q246',category:'🐟 Super Fishy',question:'Bagian paling atas Monas berbentuk lidah api. Permukaannya dilapisi logam apa?',answer:'Emas',fact:'Lidah api di puncak Monas dilapisi emas dan menjadi salah satu ciri paling dikenal dari monumen tersebut.',source:'Pemprov DKI Jakarta — JaKita',sourceUrl:'https://jakita.jakarta.go.id/media/download/ind/edisi_9_2023.pdf'},

{id:'Q247',category:'🐟 Super Fishy',question:'Kawasan Kota Tua Jakarta punya zona yang membatasi kendaraan bermotor demi menekan emisi. Namanya apa?',answer:'Low Emission Zone / Kawasan Rendah Emisi',fact:'Pemprov DKI menerapkan Low Emission Zone di kawasan Kota Tua Jakarta.',source:'Pemprov DKI Jakarta — Kota Tua',sourceUrl:'https://jakita.jakarta.go.id/media/download/ind/edisi_8_2022.pdf'},

{id:'Q248',category:'🐟 Super Fishy',question:'Jarak antarstasiun MRT Jakarta tidak selalu satu kilometer. Rentangnya kira-kira dari berapa sampai berapa?',answer:'Sekitar 0,8–2,2 kilometer',fact:'FAQ MRT Jakarta menyebut jarak antartitik stasiun bervariasi sekitar 0,8 hingga 2,2 km.',source:'MRT Jakarta — FAQ',sourceUrl:'https://jakartamrt.co.id/id/faq'},

{id:'Q249',category:'🐟 Super Fishy',question:'Di seri Rupiah 2022, bagian belakang uang bukan cuma angka dan ornamen. Secara umum menampilkan kombinasi apa?',answer:'Tarian, alam, flora, batik, dan budaya Indonesia',fact:'Bank Indonesia menjelaskan sisi belakang seri Rupiah menampilkan keragaman tari, pemandangan alam, flora, motif batik, dan unsur budaya Indonesia.',source:'Bank Indonesia — Rupiah 2022',sourceUrl:'https://www.bi.go.id/en/publikasi/laporan/Documents/5_LPI2022_EN_CHAPTER_3.pdf'},

{id:'Q250',category:'🐟 Super Fishy',question:'Kalau kamu pikir uang kertas asli seharusnya menyala seluruhnya saat disorot ultraviolet, justru bahan kertas Rupiah asli berbasis kapas punya sifat apa?',answer:'Tidak memendar seluruhnya di bawah UV',fact:'Bank Indonesia menjelaskan kertas uang Rupiah berbahan serat kapas tidak memendar secara keseluruhan ketika disinari ultraviolet; fitur tertentulah yang berpendar.',source:'Bank Indonesia — Ciri Keaslian Rupiah',sourceUrl:'https://www.bi.go.id/id/edukasi/Documents/PanduanPerbankan.pdf'},
];
