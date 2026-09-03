/* =========================================================
   CHILL COOK — database lokal
   Tidak ada request internet. Seluruh resep dan bahan tersedia
   dari file ini agar game tetap dapat dimainkan secara offline.
   ========================================================= */

// Bahan dibuka bertahap supaya perkembangan restoran terasa jelas.
const INGREDIENTS = [
  { id: "bread", name: "Roti", emoji: "🍞", unlockLevel: 1 },
  { id: "meat", name: "Daging", emoji: "🥩", unlockLevel: 1 },
  { id: "tomato", name: "Tomat", emoji: "🍅", unlockLevel: 1 },
  { id: "cheese", name: "Keju", emoji: "🧀", unlockLevel: 1 },
  { id: "potato", name: "Kentang", emoji: "🥔", unlockLevel: 1 },
  { id: "noodle", name: "Mie", emoji: "🍜", unlockLevel: 1 },
  { id: "rice", name: "Nasi", emoji: "🍚", unlockLevel: 1 },
  { id: "egg", name: "Telur", emoji: "🥚", unlockLevel: 1 },
  { id: "fish", name: "Ikan", emoji: "🐟", unlockLevel: 2 },
  { id: "lettuce", name: "Selada", emoji: "🥬", unlockLevel: 2 },
  { id: "vegetable", name: "Sayuran", emoji: "🥕", unlockLevel: 2 },
  { id: "chili", name: "Cabai", emoji: "🌶️", unlockLevel: 2 },
  { id: "flour", name: "Tepung", emoji: "🌾", unlockLevel: 3 },
  { id: "milk", name: "Susu", emoji: "🥛", unlockLevel: 3 },
  { id: "sugar", name: "Gula", emoji: "🧂", unlockLevel: 3 },
  { id: "fruit", name: "Buah", emoji: "🍓", unlockLevel: 3 },
  { id: "seaweed", name: "Rumput laut", emoji: "🌿", unlockLevel: 4 },
  { id: "scallion", name: "Daun bawang", emoji: "🧅", unlockLevel: 4 },
  { id: "peanut", name: "Kacang", emoji: "🥜", unlockLevel: 4 },
  { id: "coconut", name: "Santan", emoji: "🥥", unlockLevel: 4 },
  { id: "coffee", name: "Kopi", emoji: "☕", unlockLevel: 5 },
  { id: "tea", name: "Teh", emoji: "🍵", unlockLevel: 5 },
  { id: "butter", name: "Mentega", emoji: "🧈", unlockLevel: 5 },
  { id: "soy", name: "Tempe", emoji: "🫘", unlockLevel: 5 }
];

// Empat puluh resep dasar: campuran menu Indonesia dan internasional.
const DISH_LIBRARY = [
  { key: "burger", name: "Burger", emoji: "🍔", ingredients: ["bread", "meat", "cheese", "tomato"], baseReward: 44 },
  { key: "cheesy-fries", name: "Kentang Keju", emoji: "🍟", ingredients: ["potato", "cheese", "tomato"], baseReward: 36 },
  { key: "egg-noodle", name: "Mie Telur", emoji: "🍜", ingredients: ["noodle", "egg", "cheese"], baseReward: 38 },
  { key: "rice-omelet", name: "Nasi Omelet", emoji: "🍳", ingredients: ["rice", "egg", "tomato"], baseReward: 38 },
  { key: "pizza", name: "Pizza", emoji: "🍕", ingredients: ["bread", "cheese", "tomato"], baseReward: 40 },
  { key: "sandwich", name: "Sandwich", emoji: "🥪", ingredients: ["bread", "cheese", "tomato"], baseReward: 39 },
  { key: "meat-rice", name: "Nasi Daging", emoji: "🍱", ingredients: ["rice", "meat", "egg"], baseReward: 41 },
  { key: "pasta", name: "Pasta Tomat", emoji: "🍝", ingredients: ["noodle", "tomato", "cheese"], baseReward: 40 },
  { key: "hotdog", name: "Hotdog", emoji: "🌭", ingredients: ["bread", "meat", "tomato"], baseReward: 39 },
  { key: "omelet", name: "Omelet Keju", emoji: "🍳", ingredients: ["egg", "cheese", "tomato"], baseReward: 37 },
  { key: "nasi-goreng", name: "Nasi Goreng", emoji: "🍛", ingredients: ["rice", "egg", "chili", "vegetable"], baseReward: 50 },
  { key: "mie-goreng", name: "Mie Goreng", emoji: "🍜", ingredients: ["noodle", "egg", "chili", "vegetable"], baseReward: 50 },
  { key: "salad", name: "Salad Pelangi", emoji: "🥗", ingredients: ["lettuce", "tomato", "vegetable"], baseReward: 43 },
  { key: "taco", name: "Taco", emoji: "🌮", ingredients: ["bread", "meat", "cheese", "lettuce"], baseReward: 51 },
  { key: "bibimbap", name: "Bibimbap", emoji: "🍲", ingredients: ["rice", "egg", "vegetable", "meat"], baseReward: 52 },
  { key: "kebab", name: "Kebab", emoji: "🥙", ingredients: ["bread", "meat", "lettuce", "tomato"], baseReward: 51 },
  { key: "grilled-fish", name: "Ikan Panggang", emoji: "🐟", ingredients: ["fish", "chili", "tomato"], baseReward: 47 },
  { key: "fish-rice", name: "Nasi Ikan", emoji: "🍱", ingredients: ["rice", "fish", "vegetable"], baseReward: 46 },
  { key: "chili-fries", name: "Kentang Pedas", emoji: "🍟", ingredients: ["potato", "chili", "cheese"], baseReward: 43 },
  { key: "veggie-noodle", name: "Mie Sayur", emoji: "🍜", ingredients: ["noodle", "vegetable", "egg"], baseReward: 44 },
  { key: "cake", name: "Kue Lembut", emoji: "🍰", ingredients: ["flour", "sugar", "milk", "egg"], baseReward: 55 },
  { key: "donut", name: "Donat", emoji: "🍩", ingredients: ["flour", "sugar", "milk"], baseReward: 48 },
  { key: "pancake", name: "Pancake", emoji: "🥞", ingredients: ["flour", "milk", "egg", "sugar"], baseReward: 55 },
  { key: "ice-cream", name: "Es Krim Buah", emoji: "🍨", ingredients: ["milk", "sugar", "fruit"], baseReward: 49 },
  { key: "fruit-drink", name: "Jus Buah", emoji: "🥤", ingredients: ["fruit", "sugar", "milk"], baseReward: 47 },
  { key: "fruit-pie", name: "Pai Buah", emoji: "🥧", ingredients: ["flour", "fruit", "sugar", "butter"], baseReward: 62 },
  { key: "cupcake", name: "Cupcake", emoji: "🧁", ingredients: ["flour", "milk", "sugar", "egg"], baseReward: 55 },
  { key: "fruit-bowl", name: "Fruit Bowl", emoji: "🍓", ingredients: ["fruit", "milk", "sugar"], baseReward: 48 },
  { key: "waffle", name: "Wafel", emoji: "🧇", ingredients: ["flour", "milk", "egg", "sugar"], baseReward: 56 },
  { key: "sweet-bread", name: "Roti Manis", emoji: "🥐", ingredients: ["bread", "milk", "sugar"], baseReward: 46 },
  { key: "sushi", name: "Sushi", emoji: "🍣", ingredients: ["rice", "fish", "seaweed"], baseReward: 58 },
  { key: "onigiri", name: "Onigiri", emoji: "🍙", ingredients: ["rice", "seaweed", "fish"], baseReward: 57 },
  { key: "sate", name: "Sate Kacang", emoji: "🍢", ingredients: ["meat", "peanut", "chili"], baseReward: 58 },
  { key: "gado-gado", name: "Gado-Gado", emoji: "🥗", ingredients: ["vegetable", "peanut", "egg", "lettuce"], baseReward: 59 },
  { key: "rendang", name: "Nasi Rendang", emoji: "🍛", ingredients: ["rice", "meat", "coconut", "chili"], baseReward: 64 },
  { key: "nasi-uduk", name: "Nasi Uduk", emoji: "🍚", ingredients: ["rice", "coconut", "egg", "peanut"], baseReward: 61 },
  { key: "ramen", name: "Ramen", emoji: "🍜", ingredients: ["noodle", "egg", "fish", "scallion"], baseReward: 62 },
  { key: "dumpling", name: "Dumpling", emoji: "🥟", ingredients: ["flour", "meat", "scallion"], baseReward: 59 },
  { key: "tempe-bowl", name: "Tempe Bowl", emoji: "🍲", ingredients: ["rice", "soy", "vegetable", "chili"], baseReward: 66 },
  { key: "martabak", name: "Martabak", emoji: "🥞", ingredients: ["flour", "egg", "meat", "scallion"], baseReward: 63 },
  { key: "curry", name: "Kari Santan", emoji: "🍛", ingredients: ["rice", "meat", "coconut", "vegetable"], baseReward: 64 },
  { key: "poke-bowl", name: "Poke Bowl", emoji: "🍲", ingredients: ["rice", "fish", "vegetable", "seaweed"], baseReward: 65 },
  { key: "cookies", name: "Kukis Mentega", emoji: "🍪", ingredients: ["flour", "butter", "sugar"], baseReward: 59 },
  { key: "croissant", name: "Croissant", emoji: "🥐", ingredients: ["flour", "butter", "milk"], baseReward: 60 },
  { key: "boba", name: "Boba Milk Tea", emoji: "🧋", ingredients: ["tea", "milk", "sugar"], baseReward: 61 },
  { key: "latte", name: "Latte", emoji: "☕", ingredients: ["coffee", "milk", "sugar"], baseReward: 60 },
  { key: "soy-burger", name: "Burger Tempe", emoji: "🍔", ingredients: ["bread", "soy", "lettuce", "tomato"], baseReward: 65 },
  { key: "kimchi-rice", name: "Nasi Pedas", emoji: "🍚", ingredients: ["rice", "chili", "vegetable", "scallion"], baseReward: 61 },
  { key: "coconut-dessert", name: "Es Santan Buah", emoji: "🍧", ingredients: ["coconut", "fruit", "milk", "sugar"], baseReward: 64 },
  { key: "peanut-noodle", name: "Mie Kacang", emoji: "🍜", ingredients: ["noodle", "peanut", "chili", "scallion"], baseReward: 62 }
];

// Tiga suasana membuat setiap resep memiliki tiga Order Card berbeda.
// 50 resep × 3 varian = 150 Order Card unik (lebih dari minimum 100).
const ORDER_VARIANTS = [
  { label: "Ceria", rewardBonus: 0, mood: "😊😊" },
  { label: "Cozy", rewardBonus: 7, mood: "😌✨" },
  { label: "Spesial", rewardBonus: 14, mood: "🤩💛" }
];

const ingredientLevel = (ingredientId) =>
  INGREDIENTS.find((ingredient) => ingredient.id === ingredientId)?.unlockLevel || 1;

const ORDER_DATABASE = DISH_LIBRARY.flatMap((dish, dishIndex) =>
  ORDER_VARIANTS.map((variant, variantIndex) => {
    const orderNumber = dishIndex * ORDER_VARIANTS.length + variantIndex + 1;
    return {
      id: `cc-${String(orderNumber).padStart(3, "0")}`,
      namaMakanan: `${dish.name} ${variant.label}`,
      emoji: dish.emoji,
      jumlahBahan: dish.ingredients.length,
      daftarBahan: [...dish.ingredients],
      reward: dish.baseReward + variant.rewardBonus,
      moodPelanggan: variant.mood,
      minimumLevel: Math.max(...dish.ingredients.map(ingredientLevel)),
      dishKey: dish.key,
      baseName: dish.name
    };
  })
);

const RESTAURANT_LEVELS = [
  { level: 1, name: "Warung Mini", icon: "🏡", caption: "Tempat mungil dengan rasa besar." },
  { level: 2, name: "Dapur Ceria", icon: "🍽️", caption: "Warna baru, bahan baru, makin seru." },
  { level: 3, name: "Kedai Manis", icon: "🧁", caption: "Sudut dessert favorit mulai ramai." },
  { level: 4, name: "Bistro Santai", icon: "🌿", caption: "Menu dunia bertemu rasa Nusantara." },
  { level: 5, name: "Restoran Bintang", icon: "🌟", caption: "Semua bahan spesial sudah terbuka." },
  { level: 6, name: "CHILL Legend", icon: "👑", caption: "Dapur paling santai di seluruh kota." }
];

const UNLOCK_GROUPS = [
  { level: 2, emoji: "🌶️", name: "Ikan, cabai & sayuran" },
  { level: 3, emoji: "🍰", name: "Bahan kue & buah" },
  { level: 4, emoji: "🍣", name: "Sushi & bumbu Nusantara" },
  { level: 5, emoji: "☕", name: "Kopi, teh, mentega & tempe" },
  { level: 6, emoji: "👑", name: "Gelar CHILL Legend" }
];

// Diekspos ke window karena proyek sengaja tidak memakai bundler/module.
window.CHILL_COOK_DATA = {
  ingredients: INGREDIENTS,
  dishes: DISH_LIBRARY,
  orders: ORDER_DATABASE,
  restaurantLevels: RESTAURANT_LEVELS,
  unlockGroups: UNLOCK_GROUPS
};
