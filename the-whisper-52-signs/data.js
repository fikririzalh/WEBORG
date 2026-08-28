(function () {
  const suits = {
    hearts: {
      symbol: "♥",
      label: "Hearts",
      color: "red",
      meaning: "manusia, emosi, hubungan, kehidupan, perawatan"
    },
    diamonds: {
      symbol: "♦",
      label: "Diamonds",
      color: "red",
      meaning: "benda, bangunan, nilai, teknologi, dunia buatan"
    },
    clubs: {
      symbol: "♣",
      label: "Clubs",
      color: "black",
      meaning: "aksi, kerja, alam, tenaga, aktivitas"
    },
    spades: {
      symbol: "♠",
      label: "Spades",
      color: "black",
      meaning: "bahaya, rahasia, kematian, waktu, hal tersembunyi"
    }
  };

  const ranks = {
    A: "asal, pertama, tunggal, awal",
    2: "pasangan, pilihan, dua sisi",
    3: "kelompok, pertumbuhan, kerja sama",
    4: "struktur, stabilitas, rumah, dasar",
    5: "konflik, gangguan, perubahan",
    6: "perjalanan, perpindahan, transisi",
    7: "rahasia, ketidakpastian, pencarian",
    8: "siklus, jebakan, pengulangan, keterikatan",
    9: "puncak, tekanan, hampir selesai",
    10: "besar, banyak, sistem, keseluruhan",
    J: "agen, pekerja, pembawa pesan, pelaksana",
    Q: "perawatan, pengaruh, intuisi, kontrol tidak langsung",
    K: "kekuasaan, pemimpin, otoritas, kontrol"
  };

  const mysteries = [
    { id: "person-doctor", name: "Dokter", category: "Orang", tags: ["care","science","illness","authority"] },
    { id: "person-police", name: "Polisi", category: "Orang", tags: ["authority","danger","law","action"] },
    { id: "person-teacher", name: "Guru", category: "Orang", tags: ["knowledge","care","group","structure"] },
    { id: "person-sailor", name: "Pelaut", category: "Orang", tags: ["travel","water","work","risk"] },
    { id: "person-gardener", name: "Tukang Kebun", category: "Orang", tags: ["nature","growth","work","care"] },
    { id: "person-judge", name: "Hakim", category: "Orang", tags: ["authority","law","decision","balance"] },
    { id: "person-musician", name: "Musisi", category: "Orang", tags: ["emotion","performance","rhythm","group"] },
    { id: "person-scientist", name: "Ilmuwan", category: "Orang", tags: ["science","secret","knowledge","experiment"] },
    { id: "person-chef", name: "Koki", category: "Orang", tags: ["work","heat","care","tool"] },
    { id: "person-guard", name: "Penjaga", category: "Orang", tags: ["protection","authority","night","danger"] },
    { id: "person-photographer", name: "Fotografer", category: "Orang", tags: ["image","memory","technology","observer"] },
    { id: "person-mechanic", name: "Montir", category: "Orang", tags: ["repair","machine","work","tool"] },
    { id: "person-nurse", name: "Perawat", category: "Orang", tags: ["care","illness","human","night"] },
    { id: "person-thief", name: "Pencuri", category: "Orang", tags: ["secret","crime","night","object"] },
    { id: "person-firefighter", name: "Pemadam", category: "Orang", tags: ["rescue","danger","heat","team"] },
    { id: "person-architect", name: "Arsitek", category: "Orang", tags: ["building","design","structure","plan"] },

    { id: "place-hospital", name: "Rumah Sakit", category: "Tempat", tags: ["building","care","illness","human"] },
    { id: "place-museum", name: "Museum", category: "Tempat", tags: ["memory","object","history","building"] },
    { id: "place-station", name: "Stasiun", category: "Tempat", tags: ["travel","system","crowd","time"] },
    { id: "place-school", name: "Sekolah", category: "Tempat", tags: ["knowledge","group","structure","youth"] },
    { id: "place-hotel", name: "Hotel", category: "Tempat", tags: ["building","travel","temporary","service"] },
    { id: "place-cemetery", name: "Pemakaman", category: "Tempat", tags: ["death","memory","silence","ground"] },
    { id: "place-harbor", name: "Pelabuhan", category: "Tempat", tags: ["travel","water","work","arrival"] },
    { id: "place-lab", name: "Laboratorium", category: "Tempat", tags: ["science","secret","experiment","technology"] },
    { id: "place-library", name: "Perpustakaan", category: "Tempat", tags: ["knowledge","silence","memory","system"] },
    { id: "place-market", name: "Pasar", category: "Tempat", tags: ["crowd","money","object","exchange"] },
    { id: "place-theater", name: "Teater", category: "Tempat", tags: ["performance","emotion","crowd","illusion"] },
    { id: "place-prison", name: "Penjara", category: "Tempat", tags: ["law","trap","danger","structure"] },
    { id: "place-factory", name: "Pabrik", category: "Tempat", tags: ["machine","work","system","production"] },
    { id: "place-forest", name: "Hutan", category: "Tempat", tags: ["nature","secret","growth","danger"] },
    { id: "place-tower", name: "Menara", category: "Tempat", tags: ["height","structure","watch","isolation"] },
    { id: "place-bank", name: "Bank", category: "Tempat", tags: ["money","security","system","authority"] },

    { id: "event-fire", name: "Kebakaran", category: "Kejadian", tags: ["heat","danger","destruction","rescue"] },
    { id: "event-theft", name: "Pencurian", category: "Kejadian", tags: ["crime","secret","object","loss"] },
    { id: "event-storm", name: "Badai", category: "Kejadian", tags: ["nature","danger","movement","chaos"] },
    { id: "event-wedding", name: "Pernikahan", category: "Kejadian", tags: ["relationship","pair","celebration","promise"] },
    { id: "event-blackout", name: "Pemadaman", category: "Kejadian", tags: ["dark","system","failure","sudden"] },
    { id: "event-escape", name: "Pelarian", category: "Kejadian", tags: ["movement","danger","secret","freedom"] },
    { id: "event-accident", name: "Kecelakaan", category: "Kejadian", tags: ["danger","change","damage","sudden"] },
    { id: "event-discovery", name: "Penemuan", category: "Kejadian", tags: ["secret","knowledge","first","reveal"] },
    { id: "event-argument", name: "Pertengkaran", category: "Kejadian", tags: ["conflict","relationship","pressure","two"] },
    { id: "event-party", name: "Pesta", category: "Kejadian", tags: ["crowd","emotion","celebration","night"] },
    { id: "event-burial", name: "Penguburan", category: "Kejadian", tags: ["death","memory","ending","ground"] },
    { id: "event-operation", name: "Operasi", category: "Kejadian", tags: ["care","danger","science","precision"] },
    { id: "event-journey", name: "Perjalanan", category: "Kejadian", tags: ["travel","transition","time","movement"] },
    { id: "event-show", name: "Pertunjukan", category: "Kejadian", tags: ["performance","crowd","emotion","illusion"] },
    { id: "event-rescue", name: "Penyelamatan", category: "Kejadian", tags: ["care","danger","action","human"] },
    { id: "event-betrayal", name: "Pengkhianatan", category: "Kejadian", tags: ["secret","relationship","conflict","loss"] },

    { id: "object-knife", name: "Pisau", category: "Benda", tags: ["danger","tool","sharp","crime"] },
    { id: "object-key", name: "Kunci", category: "Benda", tags: ["secret","access","object","control"] },
    { id: "object-clock", name: "Jam", category: "Benda", tags: ["time","cycle","system","pressure"] },
    { id: "object-medicine", name: "Obat", category: "Benda", tags: ["care","illness","science","small"] },
    { id: "object-letter", name: "Surat", category: "Benda", tags: ["message","relationship","secret","paper"] },
    { id: "object-mirror", name: "Cermin", category: "Benda", tags: ["reflection","two","image","identity"] },
    { id: "object-camera", name: "Kamera", category: "Benda", tags: ["image","memory","technology","observer"] },
    { id: "object-compass", name: "Kompas", category: "Benda", tags: ["travel","direction","tool","choice"] },
    { id: "object-umbrella", name: "Payung", category: "Benda", tags: ["protection","weather","tool","cover"] },
    { id: "object-chain", name: "Rantai", category: "Benda", tags: ["trap","link","strength","restriction"] },
    { id: "object-book", name: "Buku", category: "Benda", tags: ["knowledge","memory","paper","secret"] },
    { id: "object-mask", name: "Topeng", category: "Benda", tags: ["secret","identity","performance","cover"] },
    { id: "object-lamp", name: "Lampu", category: "Benda", tags: ["light","technology","reveal","night"] },
    { id: "object-ticket", name: "Tiket", category: "Benda", tags: ["travel","access","paper","event"] },
    { id: "object-bottle", name: "Botol", category: "Benda", tags: ["container","liquid","object","message"] },
    { id: "object-hammer", name: "Palu", category: "Benda", tags: ["tool","work","force","building"] }
  ];

  window.WHISPER_DATA = { suits, ranks, mysteries };
})();
