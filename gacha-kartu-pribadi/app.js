(() => {
  "use strict";

  const c = (id, name, rarity, role, element, accent, sigil, skill, skillDesc, passive, passiveDesc, fortune, control, power, defense, price = 0) => ({
    id, name, rarity, role, element, accent, sigil, skill, skillDesc, passive, passiveDesc,
    stats: { fortune, control, power, defense }, price
  });

  const CHARACTERS = [
    c("arka", "Arka Voltaris", "SSR+", "Route Breaker", "Petir", "#55e7ff", "ϟ", "Thunder Reroute", "Sesudah melempar dadu kembar, 55% peluang memindahkan lawan terdekat mundur 3 petak.", "Overcharge", "Kontrol dadu meningkat 18% saat diamond perjalanan berada di bawah 30%.", 92, 97, 96, 82, 18),
    c("veyra", "Veyra Noctis", "SSR+", "Toll Empress", "Bayangan", "#d86cff", "✦", "Midnight Claim", "Saat tiba di kota kosong, 48% peluang langsung membangun landmark tanpa biaya tahap awal.", "Velvet Tax", "Biaya sewa landmark meningkat 22% untuk lawan yang memiliki kartu lebih banyak.", 96, 89, 91, 86, 18),
    c("orion", "Orion Aster", "SSR+", "Dice Oracle", "Bintang", "#ffd166", "✧", "Astral Forecast", "Pilih salah satu dari dua hasil dadu yang diprediksi, aktif satu kali setiap 4 giliran.", "Lucky Orbit", "Peluang dadu kembar dan bonus koin meningkat 15%.", 99, 94, 84, 80, 22),
    c("mirel", "Mirel Tidesong", "SSR+", "Landmark Guardian", "Pasang", "#4fa8ff", "≋", "Tidal Sanctuary", "Memberi perisai pada 2 landmark bernilai tertinggi dari pengambilalihan selama 3 giliran.", "Calm Current", "Mengurangi sewa yang dibayar sebesar 20% satu kali setiap putaran papan.", 88, 90, 82, 99, 20),
    c("kael", "Kael Ignivar", "SSR+", "Asset Raider", "Api", "#ff6b55", "△", "Crimson Acquisition", "Saat mendarat di kota lawan, 42% peluang mengambil alih dengan diskon 45%.", "Heat Dividend", "Setiap akuisisi memberi kembali 12% biaya sebagai koin perjalanan.", 86, 87, 99, 84, 20),
    c("seraph", "Seraph Lumen", "SSR+", "Crisis Reverser", "Cahaya", "#7fffd4", "◇", "Second Sunrise", "Sekali per pertandingan, membatalkan kebangkrutan dan kembali dengan 28% modal awal.", "Radiant Route", "Setelah melewati START, hapus satu efek negatif dan dapatkan bonus 14%.", 94, 91, 88, 97, 24),

    c("nyx", "Nyx Halcyon", "SSR", "Ambush Runner", "Bayangan", "#ba6cff", "◐", "Silent Detour", "37% peluang melewati satu kota berbahaya dan berhenti pada petak berikutnya.", "Night Fare", "Sewa yang dibayar berkurang 14% pada dua putaran pertama.", 82, 88, 85, 72),
    c("aeron", "Aeron Flux", "SSR", "Dice Controller", "Angin", "#72e0c2", "⌁", "Vector Six", "Meningkatkan peluang hasil dadu 6–8 sebesar 31% selama dua giliran.", "Tailwind", "Sesudah melewati lawan, peroleh bonus gerak satu petak dengan peluang 18%.", 84, 94, 78, 75),
    c("eira", "Eira Solenne", "SSR", "Economy Builder", "Kristal", "#78b9ff", "❖", "Crystal Reserve", "Mengunci 20% koin agar tidak dapat dicuri atau terkena biaya kejutan.", "Compound Shine", "Pendapatan kota satu warna meningkat 16%.", 90, 82, 76, 91),
    c("brann", "Brann Forge", "SSR", "Landmark Buster", "Baja", "#ff9d5c", "⬡", "Siege Stamp", "Menonaktifkan efek landmark target selama satu giliran dengan peluang 40%.", "Heavy Steps", "Kebal terhadap dorongan mundur pertama di setiap putaran.", 74, 81, 96, 90),
    c("lyra", "Lyra Quill", "SSR", "Card Tactician", "Arkana", "#ef76c5", "⌘", "Wild Archive", "Salin satu efek kartu kesempatan terakhir dengan efektivitas 80%.", "Fine Print", "Efek penalti kartu kesempatan berkurang 17%.", 92, 89, 80, 78),
    c("toren", "Toren Atlas", "SSR", "Zone Keeper", "Tanah", "#d4a15a", "▰", "Continental Lock", "Pilih satu blok warna; lawan membayar biaya tambahan 18% di blok itu selama 2 giliran.", "Foundation", "Biaya pembangunan tingkat akhir berkurang 15%.", 79, 83, 88, 94),
    c("selene", "Selene Prism", "SSR", "Warp Navigator", "Spektrum", "#ff7dc8", "⬢", "Prism Gate", "Saat mendapat dadu kembar, 35% peluang berpindah ke gerbang terdekat pilihanmu.", "Refraction", "Efek blokir rute memiliki peluang 25% untuk dipantulkan.", 91, 92, 81, 82),
    c("kairo", "Kairo Zenith", "SSR", "Comeback Ace", "Surya", "#ffc857", "☼", "Zenith Rush", "Jika berada di posisi terakhir, bergerak 2 petak tambahan setelah lemparan berikutnya.", "High Noon", "Sewa kota meningkat 18% saat hanya tersisa dua pemain.", 88, 85, 92, 84),

    c("nara", "Nara Circuit", "SR", "Quick Builder", "Listrik", "#4bd6e7", "⌁", "Rapid Permit", "Peluang 28% membangun satu tingkat tambahan secara gratis.", "Clean Grid", "Biaya listrik kota berkurang 10%.", 76, 82, 75, 69),
    c("jett", "Jett Meridian", "SR", "Straight Runner", "Angin", "#78dfbd", "➤", "Meridian Dash", "Sesudah melewati START, 24% peluang maju dua petak.", "Light Luggage", "Denda pulau berkurang satu giliran.", 72, 86, 78, 67),
    c("cora", "Cora Ember", "SR", "Rent Booster", "Api", "#ff8068", "✺", "Ember Lease", "Sewa kota terbaru meningkat 25% sampai giliran berikutnya.", "Warm Market", "Bonus penjualan aset meningkat 9%.", 78, 73, 84, 66),
    c("dane", "Dane Bastion", "SR", "Shield Broker", "Baja", "#aab6cc", "⬟", "Bastion Bond", "Memberi perlindungan pengambilalihan pada satu kota selama dua giliran.", "Iron Ledger", "Kerugian akibat biaya acak berkurang 11%.", 68, 72, 75, 89),
    c("iris", "Iris Bloom", "SR", "Bonus Harvester", "Flora", "#71db83", "✤", "Prosper Bloom", "Kota lengkap satu warna memberi bonus koin 16% saat dilewati.", "Seed Fund", "Mulai pertandingan dengan tambahan 7% modal.", 86, 75, 69, 73),
    c("rook", "Rook Cipher", "SR", "Trap Analyst", "Data", "#8ca7ff", "⌗", "Risk Scan", "Mendeteksi satu petak penalti di depan dan memberi peluang 30% untuk menghindar.", "Cold Logic", "Efek acak negatif berlangsung maksimal satu giliran.", 80, 85, 74, 76),
    c("mika", "Mika Cascade", "SR", "Fee Reducer", "Air", "#65bfff", "≋", "Cascade Coupon", "Mengurangi satu pembayaran sewa sebesar 24%.", "Flow State", "Kontrol dadu naik 8% setelah membayar sewa.", 83, 77, 70, 80),
    c("zeph", "Zeph Alloy", "SR", "Takeover Expert", "Logam", "#a8ced8", "⟡", "Alloy Offer", "Diskon pengambilalihan 22% untuk kota tingkat menengah.", "Hard Bargain", "Menjual aset menghasilkan tambahan 8%.", 73, 74, 87, 81),
    c("talia", "Talia Nova", "SR", "Chance Specialist", "Kosmik", "#b68cff", "✷", "Nova Draw", "Ulangi satu kartu kesempatan dengan peluang 26%.", "Stardust", "Hadiah kartu positif meningkat 12%.", 89, 81, 72, 68),
    c("voss", "Voss Granite", "SR", "Toll Tank", "Batu", "#c09b75", "⬣", "Granite Clause", "Menunda pembayaran sewa besar hingga melewati START berikutnya.", "Stone Wallet", "Batas pembayaran yang memicu kebangkrutan meningkat 10%.", 66, 70, 80, 92),

    c("asha", "Asha Ray", "R", "Starter Runner", "Cahaya", "#f2cb67", "•", "Bright Step", "Peluang 14% bergerak satu petak tambahan.", "Morning Coin", "Bonus START meningkat 4%.", 65, 63, 58, 54),
    c("bimo", "Bimo Gear", "R", "Budget Builder", "Mesin", "#aeb7c8", "⚙", "Spare Parts", "Biaya bangunan pertama berkurang 10%.", "Workshop", "Penjualan aset meningkat 3%.", 54, 58, 65, 68),
    c("chiko", "Chiko Vale", "R", "Lucky Scout", "Angin", "#80d8bc", "⌁", "Vale Shortcut", "Peluang 12% melewati satu petak kosong.", "Pocket Map", "Kontrol dadu meningkat 4%.", 70, 64, 55, 51),
    c("dara", "Dara Flint", "R", "Rent Guard", "Api", "#ef7b62", "△", "Flint Guard", "Mengurangi pembayaran sewa pertama sebesar 12%.", "Spark", "Sewa kota merah meningkat 3%.", 58, 55, 66, 65),
    c("elio", "Elio Moss", "R", "Zone Grower", "Flora", "#7bcf78", "✤", "Moss Market", "Bonus 8% saat membeli kota termurah dalam satu blok.", "Green Pocket", "Modal awal meningkat 3%.", 62, 57, 56, 64),
    c("fara", "Fara Wink", "R", "Chance Reader", "Arkana", "#d68abb", "✦", "Second Look", "Peluang 10% mengabaikan kartu kesempatan negatif.", "Good Sign", "Hadiah acak meningkat 4%.", 67, 61, 53, 55),
    c("gani", "Gani Bolt", "R", "Fast Dealer", "Petir", "#52cde4", "ϟ", "Quick Sale", "Menjual satu aset tanpa penalti tambahan.", "Static Change", "Mendapat 2% koin setelah dadu kembar.", 55, 64, 63, 52),
    c("hana", "Hana Dew", "R", "Recovery Aid", "Air", "#6bb8ec", "≋", "Dew Refund", "Mengembalikan 7% dari sewa yang baru dibayar.", "Soft Landing", "Biaya perjalanan berkurang 3%.", 64, 56, 51, 68),
    c("ivo", "Ivo Slate", "R", "Block Keeper", "Batu", "#ad947d", "⬣", "Slate Wall", "Peluang 11% menahan efek dorong mundur.", "Firm Ground", "Pertahanan kota meningkat 4%.", 50, 54, 62, 72),
    c("juno", "Juno Peak", "R", "Comeback Runner", "Surya", "#efbd53", "☼", "Peak Pace", "Saat tertinggal, kontrol dadu meningkat 8% satu giliran.", "Warm Start", "Bonus START meningkat 3%.", 63, 68, 57, 56),
    c("kimi", "Kimi Echo", "R", "Copy Novice", "Suara", "#ad8fe5", "◌", "Minor Echo", "Peluang 9% mengulang bonus kartu positif terakhir.", "Resonance", "Efek stun berkurang 5%.", 69, 60, 54, 58),
    c("luno", "Luno Drift", "R", "Warp Rookie", "Kosmik", "#8998e8", "✧", "Small Drift", "Peluang 10% berpindah satu petak saat terkena penalti.", "Moon Pocket", "Biaya pulau berkurang 5%.", 61, 62, 55, 62),

    c("thessa", "Thessalia Wyrm", "SSR+", "Storm Empress", "Badai", "#66a3ff", "☈", "Tempest Bond", "Saat giliranmu dimulai, 40% peluang menambah satu langkah dadu tambahan.", "Eye of Storm", "Efek badai acak tidak berlaku terhadapmu; lawan di sebelahmu -10% kontrol.", 93, 95, 90, 88, 20),
    c("ashka", "Ashka Pyrrhon", "SSR+", "Phoenix Vanguard", "Api Abadi", "#ff8f4d", "♆", "Rebirth Charge", "Ketika koin di bawah 15%, kembalikan 30% modal awal satu kali per pertandingan.", "Ember Wing", "Bonus gerak satu petak setiap melewati START tambahan.", 90, 88, 95, 85, 22),

    c("velia", "Velia Thorn", "SSR", "Trade Broker", "Racun", "#8fd15c", "☘", "Thorn Deal", "Setiap penjualan aset memberi bonus tambahan 15%.", "Slow Poison", "Lawan yang mengambil alih kotamu kehilangan 5% koin.", 85, 80, 79, 83, 12),
    c("dorian", "Dorian Wraith", "SSR", "Ghost Walker", "Hantu", "#9d8cff", "☠", "Phantom Step", "25% peluang melewati petak penalti tanpa terkena efek.", "Cold Presence", "Musuh membayar 8% lebih untuk mengambil alih kotamu.", 83, 86, 77, 79, 12),
    c("mireille", "Mireille Chord", "SSR", "Harmony Singer", "Suara", "#ff9ecb", "♪", "Harmonic Wave", "Menyamakan hasil dadu kedua pemain menjadi rata-rata, aktif sekali tiap 3 giliran.", "Resonant Field", "Semua efek stun berkurang 20%.", 87, 90, 75, 78, 12),
    c("garron", "Garron Depth", "SSR", "Deepwater Hauler", "Laut Dalam", "#4d8fdb", "≈", "Abyss Haul", "Mengambil satu kartu kesempatan ekstra saat mendarat di kota biru.", "Pressure Hull", "Kebal dari efek tenggelam/pulau pertama tiap pertandingan.", 80, 84, 88, 86, 12),

    c("suri", "Suri Petal", "SR", "Bloom Merchant", "Bunga", "#ffb3d9", "❀", "Petal Trade", "Bonus 10% saat menjual aset bertipe bunga.", "Soft Bloom", "Modal awal meningkat 4%.", 75, 70, 68, 71, 5),
    c("bastian", "Bastian Coil", "SR", "Circuit Runner", "Sirkuit", "#66e0ff", "⌇", "Coil Dash", "15% peluang melaju satu petak ekstra setelah hasil dadu genap.", "Static Guard", "Kebal terhadap kejutan listrik pertama tiap pertandingan.", 73, 84, 77, 70, 5),
    c("olwen", "Olwen Frost", "SR", "Frost Warden", "Es", "#a8e8ff", "❆", "Frost Wall", "Membekukan satu kota lawan agar tidak bisa disewa selama satu giliran, peluang 20%.", "Chill Aura", "Sewa yang dibayar ke kota beku berkurang 10%.", 77, 79, 74, 88, 5),
    c("kenji", "Kenji Ronin", "SR", "Blade Dancer", "Baja Tipis", "#d7d7d7", "⚔", "Iaido Strike", "20% peluang mengambil alih kota kosong tanpa menunggu giliran.", "Steel Focus", "Power meningkat 5% saat berada di posisi pertama.", 79, 76, 89, 72, 5),

    c("wynn", "Wynn Pebble", "R", "Path Finder", "Kerikil", "#c9c2a8", "•", "Pebble Toss", "10% peluang menemukan koin tersembunyi di petak kosong.", "Light Step", "Kecepatan gerak meningkat 2% saat modal rendah.", 60, 58, 52, 60),
    c("dahlia", "Dahlia Rune", "R", "Rune Novice", "Rune", "#c9a8ff", "ᛝ", "Minor Rune", "9% peluang efek kartu kesempatan digandakan secara ringan.", "Faint Glow", "Dapat melihat satu kartu kesempatan mendatang.", 62, 55, 54, 57),

    c("solara", "Solara Ignis", "SSR+", "Solar Vanguard", "Matahari", "#ffb347", "☀", "Solar Flare", "Membakar satu kartu kesempatan negatif milik lawan dan menggantinya dengan bonus 10% koin.", "Radiant Core", "Power meningkat 10% saat diamond perjalanan di atas 70%.", 91, 89, 97, 84, 20),
    c("nyxara", "Nyxara Umbra", "SSR+", "Void Stalker", "Kegelapan", "#7a5cff", "●", "Void Grasp", "38% peluang menarik lawan terdekat maju dua petak ke arahmu.", "Umbral Shroud", "Peluang lolos dari efek negatif meningkat 15%.", 90, 93, 88, 87, 20),
    c("kesari", "Kesari Bloom", "SSR+", "Verdant Sovereign", "Hutan", "#57c98a", "✿", "Overgrowth", "Kota hijau yang kamu miliki memberi bonus 20% koin saat dilewati siapa pun.", "Root Network", "Biaya pembangunan kota hijau berkurang 18%.", 89, 86, 90, 92, 20),
    c("draven", "Draven Cinder", "SSR+", "Ashborn Tyrant", "Abu", "#ff6f4d", "⚶", "Cinder Wake", "Saat kebangkrutan mengancam, 50% peluang membakar satu aset lawan sebagai ganti.", "Scorch Trail", "Setiap petak yang dilewati memberi 3% koin tambahan.", 92, 90, 93, 86, 22),

    c("amara", "Amara Silk", "SSR", "Diplomat Trader", "Sutra", "#e79bd1", "❦", "Silk Accord", "Menawarkan gencatan sewa pada satu lawan, mengurangi sewa 20% selama dua giliran.", "Fair Trade", "Transaksi pertukaran memberi bonus 6%.", 84, 79, 75, 81, 12),
    c("renji", "Renji Vault", "SSR", "Bank Sentinel", "Logam Berat", "#b0b4c4", "⛁", "Vault Lock", "Mengunci 25% koin tambahan dari pencurian atau biaya kejutan selama dua giliran.", "Compound Interest", "Koin bertambah otomatis 5% tiap empat giliran.", 86, 78, 74, 88, 12),
    c("sable", "Sable Wren", "SSR", "Sky Scout", "Awan", "#9fd3ff", "❁", "Cloud Step", "22% peluang melompati dua petak berbahaya berturut-turut.", "Tailfeather", "Kontrol dadu meningkat 6% di area udara.", 88, 91, 80, 76, 12),
    c("orinthal", "Orinthal Grey", "SSR", "War Historian", "Perkamen", "#c7b299", "✎", "Chronicle Edge", "Menyalin efek landmark musuh terkuat selama satu giliran.", "Old Records", "Kontrol meningkat 5% berkat info petak lawan yang lebih terlihat.", 82, 88, 78, 80, 12),
    c("ilvana", "Ilvana Reef", "SSR", "Coral Keeper", "Karang", "#4fd6c0", "☾", "Reef Barrier", "Memberi perisai pada landmark termurah, menahan pengambilalihan satu kali.", "Tidepool", "Pendapatan kota biru meningkat 12%.", 85, 82, 77, 84, 12),
    c("fenric", "Fenric Howl", "SSR", "Pack Leader", "Serigala", "#b8895c", "⚑", "Howl Rally", "Meningkatkan hasil dadu berikutnya sebesar 2 dengan peluang 30%.", "Pack Instinct", "Power meningkat 4% untuk tiap kota yang dimiliki berurutan.", 83, 85, 86, 77, 12),
    c("quilla", "Quilla Spindle", "SSR", "Fate Weaver", "Benang Takdir", "#d6a8ff", "✂", "Threadcut", "Membatalkan satu efek kartu kesempatan yang menargetkanmu, peluang 34%.", "Woven Luck", "Peluang dadu kembar meningkat 8%.", 89, 84, 76, 79, 12),
    c("brontes", "Brontes Iron", "SSR", "Foundry Master", "Besi Cor", "#a89478", "⚒", "Foundry Rush", "Membangun tingkat kedua dengan diskon 20% pada kota yang baru dibeli.", "Molten Core", "Pertahanan kota meningkat 10% saat baru dibangun.", 78, 80, 89, 85, 12),

    c("petra", "Petra Vine", "SR", "Growth Tender", "Anggur", "#9ed17c", "✤", "Vine Snare", "18% peluang menahan lawan satu giliran ekstra di kotamu.", "Harvest Timing", "Bonus panen kota hijau meningkat 8%.", 76, 74, 70, 78),
    c("orson", "Orson Flint", "SR", "Spark Trader", "Batu Api", "#e8935c", "✦", "Flint Spark", "20% peluang mengembalikan 10% biaya pembangunan terakhir.", "Quick Kindle", "Bonus penjualan aset meningkat 6%.", 74, 77, 80, 68, 5),
    c("wilhen", "Wilhen Marsh", "SR", "Swamp Trapper", "Rawa", "#7a9e6a", "☘", "Marsh Snag", "16% peluang membuat lawan kehilangan satu giliran gerak penuh.", "Bog Cover", "Efek pengejaran lawan berkurang 8%.", 72, 79, 75, 74),
    c("yuna", "Yuna Chime", "SR", "Bell Keeper", "Lonceng", "#ffd6a5", "♪", "Chime Call", "Memberi peringatan dini efek negatif mendatang, peluang menghindar 15%.", "Resonant Bell", "Bonus START meningkat 5%.", 78, 73, 68, 75, 5),
    c("harlo", "Harlo Grit", "SR", "Road Mechanic", "Aspal", "#9a9a9a", "⚙", "Quick Patch", "Memperbaiki satu landmark rusak tanpa biaya.", "Toolbelt", "Biaya perbaikan berkurang 10%.", 70, 72, 82, 76),
    c("sennah", "Sennah Glow", "SR", "Lantern Bearer", "Lentera", "#ffe08a", "✧", "Lantern Light", "Mengungkap efek satu petak misteri sebelum mendarat di sana.", "Warm Halo", "Bonus kartu kesempatan positif meningkat 6%.", 80, 71, 66, 72, 5),
    c("torval", "Torval Stonebeard", "SR", "Miner Boss", "Tambang", "#b98d5e", "⛏", "Deep Strike", "18% peluang menemukan diamond tersembunyi saat menambang petak batu.", "Iron Grip", "Pertahanan meningkat 6% di petak pegunungan.", 71, 68, 84, 80),
    c("reya", "Reya Windle", "SR", "Breeze Dancer", "Angin Lembut", "#a9e6d0", "⌁", "Windle Step", "14% peluang menghindari biaya tol sepenuhnya.", "Gentle Gust", "Kecepatan gerak meningkat 4% di petak terbuka.", 77, 80, 69, 70, 5),
    c("cassian", "Cassian Vale", "SR", "Contract Broker", "Tinta", "#8ea7ff", "✎", "Binding Clause", "Mengunci harga sewa kota musuh selama dua giliran.", "Fine Ink", "Biaya kontrak berkurang 8%.", 75, 78, 72, 77),
    c("milah", "Milah Ferro", "SR", "Rail Runner", "Rel Besi", "#cfd6de", "➤", "Rail Boost", "24% peluang melaju sesuai sisa langkah setelah melewati stasiun.", "Steel Track", "Kerusakan akibat efek dorong berkurang 10%.", 73, 81, 79, 71, 5),

    c("toma", "Toma Reed", "R", "River Guide", "Sungai", "#86c5e8", "≋", "Reed Float", "8% peluang menghindari biaya sungai.", "Steady Paddle", "Kontrol dadu meningkat 3% di dekat air.", 58, 60, 52, 56),
    c("nella", "Nella Spark", "R", "Junior Engineer", "Percikan", "#ffdd6b", "⚡", "Mini Boost", "9% peluang mendapat gerak tambahan satu petak.", "Spare Battery", "Bonus koin kecil meningkat 2%.", 56, 61, 55, 52),
    c("opal", "Opal Reed", "R", "Gem Novice", "Batu Mulia", "#d9a8f0", "◆", "Gem Glint", "7% peluang menemukan koin ekstra saat membeli kota.", "Polished Edge", "Nilai jual aset meningkat 3%.", 60, 54, 53, 58),
    c("birch", "Birch Hollow", "R", "Forest Scout", "Kayu", "#a3c586", "✤", "Hollow Path", "10% peluang melewati petak hutan tanpa efek.", "Bark Skin", "Pertahanan meningkat 3% di petak hutan.", 57, 55, 60, 63),
    c("coda", "Coda Rhyme", "R", "Street Performer", "Melodi", "#f2a6c8", "♪", "Busking Charm", "8% peluang mendapat donasi koin kecil dari lawan yang lewat.", "Catchy Tune", "Bonus kartu kesempatan positif meningkat 3%.", 62, 53, 50, 55),
    c("grover", "Grover Nash", "R", "Farm Hand", "Ladang", "#c8b06a", "⚘", "Field Work", "9% peluang panen bonus koin di kota kuning.", "Early Riser", "Bonus START meningkat 2%.", 55, 56, 58, 61),
    c("pim", "Pim Alder", "R", "Toll Apprentice", "Kayu Muda", "#b7a06e", "▰", "Toll Trainee", "8% peluang sewa yang dibayar berkurang sedikit.", "Learning Curve", "Biaya upgrade berkurang 3%.", 53, 57, 56, 59),
    c("senna", "Senna Vext", "R", "Cart Pusher", "Roda", "#cbb7e3", "⬤", "Push Forward", "9% peluang gerak tambahan setelah hasil dadu ganjil.", "Worn Wheels", "Biaya perjalanan berkurang 2%.", 59, 58, 51, 54),
    c("arlo", "Arlo Finch", "R", "Message Runner", "Kertas", "#f0c987", "✉", "Quick Note", "7% peluang mengetahui hasil dadu lawan berikutnya.", "Light Pack", "Denda beban berkurang 2%.", 61, 59, 50, 53),
    c("vess", "Vess Coral", "R", "Tidepool Kid", "Kerang", "#7fd4c1", "❖", "Shell Luck", "8% peluang mendapat kerang bertuah berisi bonus koin kecil di petak pantai.", "Sea Charm", "Bonus kesempatan di petak biru meningkat 2%.", 58, 54, 52, 60),

    c("zephyrine", "Zephyrine Gale", "SSR+", "Tempest Herald", "Angin Topan", "#5fd1e0", "✈", "Gale Herald", "Meningkatkan hasil dadu seluruh pemain sebesar 1 selama satu giliran, lalu mengambil gerak ekstra 2 petak untuk diri sendiri.", "Wind Reader", "Kontrol dadu meningkat 12% saat cuaca badai aktif.", 94, 96, 87, 83, 20),
    c("obsidia", "Obsidia Marrow", "SSR+", "Bone Sovereign", "Tulang", "#6b5b73", "☠", "Marrow Curse", "Mengutuk satu landmark musuh, mengurangi pendapatannya 30% selama dua giliran.", "Undying Will", "Tidak bisa kehilangan lebih dari 40% koin dalam satu efek negatif.", 88, 90, 95, 89, 22),
    c("aurelian", "Aurelian Crest", "SSR+", "Golden Magnate", "Emas", "#f5c563", "♛", "Golden Decree", "Semua kota yang kamu miliki memberi pendapatan tambahan 25% selama satu putaran penuh.", "Midas Touch", "Setiap pembelian kota memberi cashback 8%.", 90, 85, 92, 91, 24),
    c("lunaris", "Lunaris Veil", "SSR+", "Eclipse Warden", "Gerhana", "#8f7ee0", "☽", "Eclipse Veil", "Menyembunyikan posisimu dari efek target selama satu giliran, peluang 45%.", "Twin Phase", "Peluang dadu kembar meningkat 12% pada giliran ganjil.", 92, 94, 86, 88, 20),

    c("corwin", "Corwin Ashfall", "SSR", "Ember Scout", "Bara", "#ff9466", "✦", "Ashfall Rush", "26% peluang melaju satu petak tambahan setelah melewati kota terbakar.", "Heat Resistant", "Kebal dari efek panas pertama tiap giliran.", 84, 83, 87, 78, 12),
    c("vesna", "Vesna Thistle", "SSR", "Bloom Sentinel", "Duri", "#d38fb0", "✿", "Thorn Ward", "Memberi duri pelindung pada kotamu, mengurangi kerusakan pengambilalihan 25%.", "Bramble Growth", "Pertahanan meningkat 8% tiap giliran berturut tanpa diserang.", 82, 81, 79, 88, 12),
    c("kanto", "Kanto Reef", "SSR", "Current Rider", "Arus", "#4fb8e0", "≈", "Current Surge", "22% peluang mendapat gerak tambahan dua petak di jalur air.", "Undertow", "Lawan yang menyerangmu di air kehilangan 6% koin.", 85, 88, 80, 76, 12),
    c("esmee", "Esmee Larkspur", "SSR", "Garden Diplomat", "Larkspur", "#b3d68f", "❀", "Peace Bloom", "Menawarkan gencatan senjata satu giliran; kedua pemain tidak bisa saling menyerang.", "Fragrant Aura", "Bonus kartu kesempatan positif meningkat 8%.", 87, 79, 74, 82, 12),
    c("drax", "Drax Fenwick", "SSR", "Bounty Tracker", "Rantai", "#9c8060", "⛓", "Bounty Mark", "Menandai satu lawan; kamu mendapat 10% dari koin yang mereka hasilkan selama dua giliran.", "Iron Chain", "Efek terikat atau stun terhadapmu berkurang 15%.", 86, 82, 88, 77, 12),
    c("helia", "Helia Dawnstar", "SSR", "Morning Oracle", "Fajar", "#ffd89a", "☼", "Dawn Sight", "Melihat dua hasil dadu mendatang dan memilih salah satu, sekali per lima giliran.", "First Light", "Bonus START meningkat 8%.", 89, 86, 77, 80, 12),
    c("morrik", "Morrik Grave", "SSR", "Tomb Warden", "Batu Nisan", "#8a8a94", "▣", "Tomb Seal", "Menyegel satu kota lawan agar tidak bisa diupgrade selama dua giliran.", "Silent Guard", "Kebal terhadap efek pencurian pertama tiap pertandingan.", 81, 84, 83, 86, 12),
    c("peria", "Peria Songbird", "SSR", "Melody Trader", "Nada", "#f2b8d6", "♪", "Songbird Deal", "Menukar satu efek kartu kesempatan burukmu dengan milik lawan secara acak, peluang 28%.", "Sweet Harmony", "Semua transaksi memberi bonus tambahan 5%.", 83, 85, 76, 81, 12),

    c("denna", "Denna Wick", "SR", "Candle Keeper", "Lilin", "#ffcf8a", "✧", "Wick Light", "Menerangi satu petak tersembunyi di depan, mengungkap efeknya.", "Steady Flame", "Bonus kartu kesempatan meningkat 5%.", 78, 72, 68, 74),
    c("roswell", "Roswell Iron", "SR", "Track Layer", "Rel", "#b7bfc9", "➤", "Track Extend", "18% peluang menambah rute pintas menuju kota terdekat.", "Solid Frame", "Pertahanan meningkat 5% di kota industri.", 74, 76, 80, 75),
    c("ilene", "Ilene Marsh", "SR", "Bog Trader", "Lumpur", "#8a9a6e", "☘", "Bog Deal", "Diskon 15% saat membeli kota rawa.", "Sticky Grip", "Musuh yang mengambil alih kotamu kehilangan gerak satu petak.", 76, 74, 71, 79, 5),
    c("farrow", "Farrow Quill", "SR", "Ink Scribe", "Tinta Hitam", "#7d8ce0", "✎", "Scribe Note", "Menyalin efek satu kartu kesempatan yang baru diambil lawan.", "Steady Hand", "Penalti kartu buruk berkurang 8%.", 79, 77, 70, 73),
    c("ondine", "Ondine Pearl", "SR", "Pearl Diver", "Mutiara", "#8fd6e0", "❖", "Pearl Dive", "20% peluang menemukan mutiara bernilai sedang di kota biru.", "Deep Breath", "Kebal efek tenggelam pertama.", 80, 75, 69, 76, 5),
    c("brakus", "Brakus Stonefist", "SR", "Arena Brawler", "Tinju", "#c99a6e", "⛊", "Iron Fist", "18% peluang memaksa lawan membayar denda tambahan 10% saat kalah adu dadu.", "Thick Hide", "Pertahanan meningkat 6%.", 75, 73, 85, 78),
    c("wisp", "Wisp Ferren", "SR", "Spirit Guide", "Roh", "#c6b8f0", "☆", "Guiding Wisp", "16% peluang menuntun ke petak menguntungkan terdekat.", "Ethereal Step", "Biaya petak misteri berkurang 6%.", 81, 78, 67, 72, 5),
    c("corin", "Corin Vale", "SR", "Ledger Keeper", "Buku Besar", "#a0b8e0", "✎", "Ledger Check", "Mengungkap koin tersembunyi seluruh pemain selama satu giliran.", "Careful Count", "Kesalahan hitung sewa menguntungkanmu 4%.", 77, 76, 73, 75),
    c("tamsin", "Tamsin Ray", "SR", "Beacon Keeper", "Suar", "#ffdca0", "✦", "Beacon Call", "22% peluang memandu ke petak bonus terdekat.", "Steady Light", "Bonus visibilitas kartu kesempatan meningkat 5%.", 79, 74, 70, 73, 5),
    c("brier", "Brier Thorn", "SR", "Hedge Warden", "Semak", "#a3c98f", "✤", "Hedge Wall", "Membuat penghalang sementara di satu petak, menahan lawan satu giliran, peluang 15%.", "Thorny Grip", "Pertahanan meningkat 5% di petak hijau.", 74, 75, 72, 80),

    c("poppy", "Poppy Wren", "R", "Field Sprout", "Bunga Poppy", "#f0a8b8", "❀", "Sprout Charm", "7% peluang bonus koin kecil di kota bunga.", "Fresh Bloom", "Modal awal meningkat 2%.", 56, 52, 54, 57),
    c("digby", "Digby Cole", "R", "Coal Hauler", "Batu Bara", "#6e6e6e", "⚫", "Coal Push", "8% peluang gerak tambahan setelah melewati kota industri.", "Sooty Hands", "Biaya bahan bakar berkurang 2%.", 54, 58, 60, 55),
    c("wynne", "Wynne Ashby", "R", "Trail Marker", "Jejak", "#c9b48a", "▰", "Trail Mark", "8% peluang menandai petak aman berikutnya.", "Careful Steps", "Peluang terkena jebakan berkurang 2%.", 58, 56, 53, 57),
    c("flick", "Flick Ember", "R", "Spark Runner", "Percik Api", "#ff9d6e", "⚡", "Quick Spark", "9% peluang lari tambahan setelah dadu kembar gagal.", "Warm Hands", "Bonus koin meningkat 2% di kota api.", 57, 59, 55, 52),
    c("morna", "Morna Dell", "R", "Valley Keeper", "Lembah", "#9fc98a", "✤", "Valley Rest", "7% peluang memulihkan sedikit koin saat berhenti di lembah.", "Quiet Valley", "Bonus istirahat meningkat 2%.", 55, 54, 57, 60),
    c("tobin", "Tobin Reed", "R", "Fisher Boy", "Kail", "#7fc2d6", "≋", "Lucky Catch", "8% peluang menangkap bonus koin di petak air.", "Patient Wait", "Bonus menunggu giliran meningkat 2%.", 59, 55, 52, 58),
    c("shae", "Shae Linnet", "R", "Songbird Novice", "Kicau", "#f0c2d8", "♪", "Sweet Note", "7% peluang menghibur lawan sehingga efek negatif ringan berkurang.", "Gentle Tune", "Bonus kartu kesempatan ringan meningkat 2%.", 60, 53, 50, 56),
    c("bram", "Bram Holt", "R", "Yard Worker", "Halaman", "#c2a878", "⚒", "Odd Job", "8% peluang mendapat upah tambahan kecil.", "Hard Worker", "Biaya kerja berkurang 2%.", 54, 56, 59, 58),
    c("ivy", "Ivy Marrow", "R", "Bone Collector", "Tulang Kecil", "#b0a8b8", "☠", "Bone Charm", "7% peluang menemukan jimat kecil bernilai ringan.", "Quiet Steps", "Peluang terdeteksi berkurang 2%.", 56, 57, 53, 59),
    c("quen", "Quen Marlow", "R", "Path Sweeper", "Sapu", "#d6c48a", "▰", "Clean Sweep", "8% peluang membersihkan efek buruk ringan di petakmu.", "Tidy Trail", "Biaya kebersihan berkurang 2%.", 58, 55, 54, 57)
  ];

  const STORAGE_KEY = "rift-route-save-v1";
  const FEATURED_IDS = ["arka", "veyra", "orion"];
  const RARITY_ORDER = { "R": 1, "SR": 2, "SSR": 3, "SSR+": 4 };
  const RARITY_CLASS = { "R": "r", "SR": "sr", "SSR": "ssr", "SSR+": "ssrp" };
  const DUPLICATE_REWARD = { "R": 0, "SR": 1, "SSR": 2, "SSR+": 4 };
  const COSTS = { 1: 100, 10: 900 };
  const numberFormat = new Intl.NumberFormat("id-ID");

  const defaultState = () => ({
    diamonds: 5000,
    premiumCards: 0,
    pity: 0,
    srPity: 0,
    inventory: {},
    history: [],
    theme: "dark",
    activeView: "gacha"
  });

  let state = loadState();
  let currentRarityFilter = "ALL";
  let lastPullCount = 10;
  let pendingConfirmAction = null;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const byId = id => document.getElementById(id);

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const saved = JSON.parse(raw);
      const clean = { ...defaultState(), ...saved };
      clean.diamonds = Math.max(0, Number(clean.diamonds) || 0);
      clean.premiumCards = Math.max(0, Number(clean.premiumCards) || 0);
      clean.pity = Math.min(79, Math.max(0, Number(clean.pity) || 0));
      clean.srPity = Math.min(9, Math.max(0, Number(clean.srPity) || 0));
      clean.inventory = clean.inventory && typeof clean.inventory === "object" ? clean.inventory : {};
      clean.history = Array.isArray(clean.history) ? clean.history.slice(0, 60) : [];
      return clean;
    } catch {
      return defaultState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      toast("Penyimpanan tidak tersedia", "Progres aktif selama halaman ini terbuka.", "!");
    }
  }

  function getCharacter(id) {
    return CHARACTERS.find(character => character.id === id);
  }

  function monogram(name) {
    const words = name.split(" ");
    return words.length > 1 ? `${words[0][0]}${words[1][0]}` : name.slice(0, 2).toUpperCase();
  }

  function rarityTag(rarity) {
    return `<span class="rarity-tag ${RARITY_CLASS[rarity]}">${rarity}</span>`;
  }

  function setTheme(theme) {
    state.theme = theme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = state.theme;
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = state.theme === "dark" ? "#0b0f18" : "#edf2fa";
    byId("themeToggle").setAttribute("aria-label", state.theme === "dark" ? "Aktifkan light mode" : "Aktifkan dark mode");
    saveState();
  }

  function setView(view) {
    const valid = ["gacha", "collection", "shop", "history"].includes(view) ? view : "gacha";
    state.activeView = valid;
    $$(".view").forEach(section => section.classList.toggle("active", section.id === `view-${valid}`));
    $$(".nav-item").forEach(button => {
      const active = button.dataset.view === valid;
      button.classList.toggle("active", active);
      if (active) button.setAttribute("aria-current", "page"); else button.removeAttribute("aria-current");
    });
    if (valid === "collection") renderCollection();
    if (valid === "shop") renderShop();
    if (valid === "history") renderHistory();
    saveState();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateBalances() {
    const diamonds = numberFormat.format(state.diamonds);
    const premium = numberFormat.format(state.premiumCards);
    byId("diamondBalance").textContent = diamonds;
    byId("premiumBalance").textContent = premium;
    byId("shopPremiumBalance").textContent = premium;
    const unique = Object.values(state.inventory).filter(count => count > 0).length;
    byId("collectionNavCount").textContent = unique;
    byId("collectionProgress").textContent = `${unique} / ${CHARACTERS.length}`;

    const percent = Math.min(100, (state.pity / 80) * 100);
    byId("pityValue").textContent = state.pity;
    byId("pityValueSide").textContent = `${state.pity} / 80`;
    byId("pityPercentSide").textContent = `${Math.round(percent)}%`;
    byId("pityBar").style.width = `${percent}%`;
    byId("pityBarSide").style.width = `${percent}%`;
    byId("pityMessage").textContent = `${80 - state.pity} tarikan lagi menuju jaminan SSR+.`;
  }

  function renderFeatured() {
    byId("featuredStack").innerHTML = FEATURED_IDS.map(id => {
      const character = getCharacter(id);
      const gradient = `linear-gradient(145deg, ${character.accent}b8, #17162d 68%)`;
      return `<button class="featured-mini-card" style="--card-gradient:${gradient}" data-character-id="${character.id}" type="button" aria-label="Lihat ${character.name}">
        <span class="visual">${monogram(character.name)}</span><span class="sigil">${character.sigil}</span>
        <span class="info"><small>${character.rarity} · ${character.element}</small><strong>${character.name}</strong></span>
      </button>`;
    }).join("");
  }

  function rollRarity(forceMinSR = false) {
    if (state.pity >= 79) return "SSR+";
    const roll = Math.random() * 100;
    let rarity = roll < 2 ? "SSR+" : roll < 8 ? "SSR" : roll < 30 ? "SR" : "R";
    if ((forceMinSR || state.srPity >= 9) && rarity === "R") {
      const bonusRoll = Math.random() * 100;
      rarity = bonusRoll < 6 ? "SSR+" : bonusRoll < 24 ? "SSR" : "SR";
    }
    return rarity;
  }

  function randomFrom(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function drawOne(forceMinSR = false) {
    const rarity = rollRarity(forceMinSR);
    let pool = CHARACTERS.filter(character => character.rarity === rarity);
    if (rarity === "SSR+" && Math.random() < 0.5) {
      pool = pool.filter(character => FEATURED_IDS.slice(0, 2).includes(character.id));
    }
    const character = randomFrom(pool);
    state.pity = rarity === "SSR+" ? 0 : state.pity + 1;
    state.srPity = RARITY_ORDER[rarity] >= RARITY_ORDER.SR ? 0 : state.srPity + 1;
    return character;
  }

  function addCharacter(character, source = "Gacha") {
    const previous = Number(state.inventory[character.id]) || 0;
    const isNew = previous === 0;
    state.inventory[character.id] = previous + 1;
    const reward = isNew ? 0 : DUPLICATE_REWARD[character.rarity];
    if (reward) state.premiumCards += reward;
    state.history.unshift({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      characterId: character.id,
      rarity: character.rarity,
      source,
      isNew,
      reward,
      timestamp: Date.now()
    });
    state.history = state.history.slice(0, 60);
    return { character, isNew, reward };
  }

  function performPull(count) {
    const cost = COSTS[count];
    if (state.diamonds < cost) {
      toast("Diamond belum cukup", `Tambahkan ${numberFormat.format(cost - state.diamonds)} diamond untuk melanjutkan.`, "◇");
      return;
    }
    state.diamonds -= cost;
    const results = [];
    for (let index = 0; index < count; index += 1) {
      const mustGuarantee = count === 10 && index === 9 && !results.some(result => RARITY_ORDER[result.character.rarity] >= RARITY_ORDER.SR);
      results.push(addCharacter(drawOne(mustGuarantee)));
    }
    if (count === 10) state.premiumCards += 1;
    lastPullCount = count;
    saveState();
    renderAll();
    showSummonResults(results, count === 10);
  }

  function showSummonResults(results, hasBonus) {
    const highest = [...results].sort((a, b) => RARITY_ORDER[b.character.rarity] - RARITY_ORDER[a.character.rarity])[0];
    byId("summonModalTitle").textContent = results.length === 1 ? "Traveler Baru" : `${results.length} Traveler Tiba`;
    byId("summonResults").innerHTML = results.map((result, index) => {
      const character = result.character;
      const label = result.isNew ? `<span class="new-label">BARU</span>` : `<span class="dupe-label">DUPLIKAT${result.reward ? ` +${result.reward} ◆` : ""}</span>`;
      return `<button class="result-card" style="--accent:${character.accent};--delay:${index}" data-monogram="${monogram(character.name)}" data-character-id="${character.id}" type="button" aria-label="Detail ${character.name}">
        ${rarityTag(character.rarity)}<span class="result-sigil">${character.sigil}</span>${label}<strong>${character.name}</strong><small>${character.role}</small>
      </button>`;
    }).join("");
    byId("rewardStrip").hidden = !hasBonus;
    byId("summonAgainButton").textContent = `Rekrut lagi ${lastPullCount}×`;
    byId("summonAgainButton").dataset.pullCount = lastPullCount;
    openModal("summonModal");
    if (highest.character.rarity === "SSR+") {
      setTimeout(() => toast("SSR+ diperoleh", `${highest.character.name} bergabung dengan koleksimu.`, "✦"), 360);
    }
  }

  function addDiamonds(amount) {
    state.diamonds += amount;
    saveState();
    updateBalances();
    toast("Diamond ditambahkan", `+${numberFormat.format(amount)} diamond masuk ke saldo.`, "◇");
  }

  function renderMiniResults() {
    const recent = state.history.filter(item => item.source === "Gacha").slice(0, 3);
    byId("miniResults").innerHTML = recent.length ? recent.map(item => {
      const character = getCharacter(item.characterId);
      if (!character) return "";
      return `<button class="mini-result" style="--accent:${character.accent}" data-character-id="${character.id}" type="button"><span class="mini-sigil">${character.sigil}</span><strong>${character.name.split(" ")[0]}</strong><small>${character.rarity}</small></button>`;
    }).join("") : `<div class="mini-placeholder">Belum ada hasil gacha</div>`;
  }

  function characterCard(character) {
    const count = Number(state.inventory[character.id]) || 0;
    const locked = count === 0;
    return `<button class="character-card${locked ? " locked" : ""}" style="--accent:${character.accent}" data-character-id="${character.id}" type="button" aria-label="${locked ? "Pratinjau" : "Detail"} ${character.name}">
      <span class="card-visual">
        <span class="card-rarity">${rarityTag(character.rarity)}</span><span class="card-sigil">${character.sigil}</span><span class="card-monogram">${monogram(character.name)}</span>
        ${locked ? `<span class="lock-mark">▣</span>` : `<span class="owned-count">×${count}</span>`}
      </span>
      <span class="card-info"><h3>${character.name}</h3><span class="card-role">${character.role}</span><span class="card-skill"><i>✦</i><span>${character.skill}</span></span></span>
    </button>`;
  }

  function renderCollection() {
    const query = byId("collectionSearch").value.trim().toLocaleLowerCase("id-ID");
    const sort = byId("collectionSort").value;
    let items = CHARACTERS.filter(character => {
      const matchesRarity = currentRarityFilter === "ALL" || character.rarity === currentRarityFilter;
      const haystack = `${character.name} ${character.role} ${character.element} ${character.skill} ${character.passive}`.toLocaleLowerCase("id-ID");
      return matchesRarity && (!query || haystack.includes(query));
    });

    items.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name, "id-ID");
      if (sort === "owned") {
        const ownedDifference = (state.inventory[b.id] || 0) - (state.inventory[a.id] || 0);
        return ownedDifference || RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity] || a.name.localeCompare(b.name, "id-ID");
      }
      return RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity] || a.name.localeCompare(b.name, "id-ID");
    });

    byId("collectionGrid").innerHTML = items.map(characterCard).join("");
    byId("collectionEmpty").hidden = items.length > 0;
  }

  function renderShop() {
    const premiumCharacters = CHARACTERS.filter(character => character.price > 0);
    byId("premiumShopGrid").innerHTML = premiumCharacters.map(character => {
      const owned = Number(state.inventory[character.id]) || 0;
      const affordable = state.premiumCards >= character.price;
      return `<article class="shop-card" style="--accent:${character.accent}" data-monogram="${monogram(character.name)}">
        ${rarityTag(character.rarity)}<span class="shop-sigil">${character.sigil}</span>
        ${owned ? `<span class="shop-owned">✓ Dimiliki ×${owned}</span>` : ""}
        <h3>${character.name}</h3><span class="shop-role">${character.role} · ${character.element}</span><p>${character.skill}: ${character.skillDesc}</p>
        <button class="shop-buy" data-shop-id="${character.id}" type="button" ${affordable ? "" : "disabled"}><span>${owned ? "Tukar lagi" : "Tukar karakter"}</span><strong>◆ ${character.price}</strong></button>
      </article>`;
    }).join("");
  }

  function purchasePremium(id) {
    const character = getCharacter(id);
    if (!character || !character.price) return;
    if (state.premiumCards < character.price) {
      toast("Kartu Premium belum cukup", `Butuh ${character.price - state.premiumCards} kartu lagi.`, "◆");
      return;
    }
    showConfirm({
      title: `Tukar ${character.name}?`,
      message: `${character.price} Kartu Premium akan digunakan. Karakter langsung masuk ke koleksi.`,
      icon: character.sigil,
      acceptLabel: `Tukar ◆ ${character.price}`,
      action: () => {
        state.premiumCards -= character.price;
        const result = addCharacter(character, "Premium Shop");
        saveState();
        renderAll();
        toast(result.isNew ? "Karakter diperoleh" : "Duplikat diperoleh", `${character.name} ditambahkan ke koleksi.`, character.sigil);
      }
    });
  }

  function renderHistory() {
    const total = state.history.length;
    const high = state.history.filter(item => item.rarity === "SSR+").length;
    const ssr = state.history.filter(item => item.rarity === "SSR").length;
    const newCount = state.history.filter(item => item.isNew).length;
    byId("historyStats").innerHTML = [
      ["TOTAL TERCATAT", total], ["SSR+", high], ["SSR", ssr], ["KARAKTER BARU", newCount]
    ].map(([label, value]) => `<div class="history-stat"><small>${label}</small><strong>${numberFormat.format(value)}</strong></div>`).join("");

    byId("historyList").innerHTML = state.history.map(item => {
      const character = getCharacter(item.characterId);
      if (!character) return "";
      const time = new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(item.timestamp));
      return `<button class="history-row" style="--accent:${character.accent}" data-character-id="${character.id}" type="button">
        <span class="history-symbol">${character.sigil}</span><span class="history-name"><strong>${character.name}</strong><small>${character.role}</small></span>
        <span class="history-meta">${item.source}</span><span class="history-time">${time}</span>
        <span>${item.isNew ? `<span class="new-label">BARU</span>` : `<span class="history-duplicate">Duplikat${item.reward ? ` +${item.reward} ◆` : ""}</span>`}</span>
      </button>`;
    }).join("");
    byId("historyList").hidden = total === 0;
    byId("historyEmpty").hidden = total > 0;
  }

  function showCharacterDetail(id) {
    const character = getCharacter(id);
    if (!character) return;
    const owned = Number(state.inventory[character.id]) || 0;
    byId("detailContent").innerHTML = `
      <div class="detail-hero" style="--accent:${character.accent}" data-monogram="${monogram(character.name)}">
        <div class="detail-hero-copy">${rarityTag(character.rarity)}<h2 id="detailName">${character.name}</h2><p>${character.role} · ${character.element}</p></div>
      </div>
      <div class="detail-body">
        <div class="stat-grid">
          <div class="stat-item"><small>FORTUNE</small><strong>${character.stats.fortune}</strong></div>
          <div class="stat-item"><small>CONTROL</small><strong>${character.stats.control}</strong></div>
          <div class="stat-item"><small>POWER</small><strong>${character.stats.power}</strong></div>
          <div class="stat-item"><small>DEFENSE</small><strong>${character.stats.defense}</strong></div>
        </div>
        <div class="skill-blocks">
          <article class="skill-block" style="--accent:${character.accent}"><span class="skill-label"><i>✦</i> SKILL AKTIF</span><h3>${character.skill}</h3><p>${character.skillDesc}</p></article>
          <article class="skill-block" style="--accent:${character.accent}"><span class="skill-label"><i>◈</i> SKILL PASIF</span><h3>${character.passive}</h3><p>${character.passiveDesc}</p></article>
        </div>
        <div class="owned-strip"><span>${owned ? "Tersimpan dalam koleksi" : "Belum dimiliki"}</span><strong>${owned ? `Jumlah ×${owned}` : character.price ? `Premium Shop ◆ ${character.price}` : "Dapat diperoleh dari gacha"}</strong></div>
      </div>`;
    openModal("detailModal");
  }

  function openModal(id) {
    const dialog = byId(id);
    if (dialog && !dialog.open) dialog.showModal();
  }

  function closeModal(id) {
    const dialog = byId(id);
    if (dialog?.open) dialog.close();
  }

  function showConfirm({ title, message, icon = "!", acceptLabel = "Lanjutkan", action }) {
    byId("confirmTitle").textContent = title;
    byId("confirmMessage").textContent = message;
    byId("confirmIcon").textContent = icon;
    byId("confirmAccept").textContent = acceptLabel;
    pendingConfirmAction = action;
    openModal("confirmModal");
  }

  function toast(title, message, icon = "✦") {
    const node = document.createElement("div");
    node.className = "toast";
    node.innerHTML = `<span class="toast-icon">${icon}</span><span><strong>${title}</strong><span>${message}</span></span>`;
    byId("toastRegion").appendChild(node);
    setTimeout(() => {
      node.classList.add("out");
      setTimeout(() => node.remove(), 230);
    }, 3200);
  }

  function renderTimer() {
    const cycle = 7 * 24 * 60 * 60;
    const seconds = cycle - (Math.floor(Date.now() / 1000) % cycle);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    byId("bannerTimer").textContent = `${String(days).padStart(2, "0")}H ${String(hours).padStart(2, "0")}J ${String(minutes).padStart(2, "0")}M`;
  }

  function renderAll() {
    updateBalances();
    renderMiniResults();
    renderCollection();
    renderShop();
    renderHistory();
  }

  function bindEvents() {
    $$(".nav-item").forEach(button => button.addEventListener("click", () => setView(button.dataset.view)));
    $$('[data-go-view]').forEach(button => button.addEventListener("click", () => setView(button.dataset.goView)));
    byId("themeToggle").addEventListener("click", () => setTheme(state.theme === "dark" ? "light" : "dark"));
    byId("addDiamondButton").addEventListener("click", () => addDiamonds(1000));
    $$('[data-add-diamonds]').forEach(button => button.addEventListener("click", () => addDiamonds(Number(button.dataset.addDiamonds))));
    byId("singlePullButton").addEventListener("click", () => performPull(1));
    byId("multiPullButton").addEventListener("click", () => performPull(10));
    byId("summonAgainButton").addEventListener("click", event => {
      closeModal("summonModal");
      performPull(Number(event.currentTarget.dataset.pullCount) || 1);
    });

    byId("collectionSearch").addEventListener("input", renderCollection);
    byId("collectionSort").addEventListener("change", renderCollection);
    byId("rarityFilters").addEventListener("click", event => {
      const button = event.target.closest("[data-rarity]");
      if (!button) return;
      currentRarityFilter = button.dataset.rarity;
      $$(".filter-button", byId("rarityFilters")).forEach(item => item.classList.toggle("active", item === button));
      renderCollection();
    });

    document.addEventListener("click", event => {
      const characterButton = event.target.closest("[data-character-id]");
      if (characterButton) showCharacterDetail(characterButton.dataset.characterId);
      const shopButton = event.target.closest("[data-shop-id]");
      if (shopButton && !shopButton.disabled) purchasePremium(shopButton.dataset.shopId);
      const closeButton = event.target.closest("[data-close-modal]");
      if (closeButton) closeModal(closeButton.dataset.closeModal);
    });

    $$(".modal-backdrop").forEach(backdrop => backdrop.addEventListener("click", () => closeModal(backdrop.parentElement.id)));
    byId("confirmCancel").addEventListener("click", () => {
      pendingConfirmAction = null;
      closeModal("confirmModal");
    });
    byId("confirmAccept").addEventListener("click", () => {
      const action = pendingConfirmAction;
      pendingConfirmAction = null;
      closeModal("confirmModal");
      if (typeof action === "function") action();
    });

    byId("resetDataButton").addEventListener("click", () => showConfirm({
      title: "Reset seluruh progres?",
      message: "Diamond, koleksi, Kartu Premium, pity, dan riwayat akan kembali ke kondisi awal.",
      icon: "↺",
      acceptLabel: "Reset progres",
      action: () => {
        const theme = state.theme;
        state = { ...defaultState(), theme };
        saveState();
        renderAll();
        setView("gacha");
        toast("Progres direset", "Permainan kembali ke kondisi awal.", "↺");
      }
    }));

    byId("clearHistoryButton").addEventListener("click", () => {
      if (!state.history.length) return;
      showConfirm({
        title: "Hapus riwayat gacha?",
        message: "Koleksi dan saldo tidak berubah. Catatan hasil rekrut saja yang dihapus.",
        icon: "↺",
        acceptLabel: "Hapus riwayat",
        action: () => {
          state.history = [];
          saveState();
          renderAll();
          toast("Riwayat dihapus", "Koleksi karakter tetap tersimpan.", "✓");
        }
      });
    });
  }

  function init() {
    document.documentElement.dataset.theme = state.theme;
    renderFeatured();
    bindEvents();
    renderAll();
    setView(state.activeView);
    renderTimer();
    setInterval(renderTimer, 30000);
  }

  init();
})();
