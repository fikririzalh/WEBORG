const STORAGE_KEY = "codingBunnyQuestionsV2";
const THEME_KEY = "codingBunnyTheme";

const DEFAULT_QUESTIONS = [
  {
    id: "html-button-type",
    title: "Tombol yang aman di dalam form",
    language: "HTML",
    difficulty: "Mudah",
    correctCode: `<form>\n  <input type="email" required>\n  <button type="submit">Kirim</button>\n</form>`,
    wrongCode: `<form>\n  <input type="email" required>\n  <buton type="submit">Kirim</buton>\n</form>`,
    correctExplanation: "Elemen <button> ditulis lengkap dan memiliki type=\"submit\", sehingga tombol dikenali serta dapat mengirim form.",
    wrongExplanation: "Nama elemen <button> kehilangan satu huruf t dan berubah menjadi <buton>. Browser memperlakukannya sebagai elemen tak dikenal, bukan tombol.",
  },
  {
    id: "html-label-link",
    title: "Label yang terhubung ke input",
    language: "HTML",
    difficulty: "Sedang",
    correctCode: `<label for="email">Email</label>\n<input id="email" type="email">`,
    wrongCode: `<label for="emails">Email</label>\n<input id="email" type="email">`,
    correctExplanation: "Nilai atribut for pada label sama persis dengan id input, sehingga keduanya terhubung secara semantik.",
    wrongExplanation: "Nilai for adalah \"emails\", sedangkan id input adalah \"email\". Perbedaan satu huruf membuat label tidak terhubung.",
  },
  {
    id: "css-flex-value",
    title: "Mengaktifkan Flexbox",
    language: "CSS",
    difficulty: "Mudah",
    correctCode: `.toolbar {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}`,
    wrongCode: `.toolbar {\n  display: flexbox;\n  align-items: center;\n  gap: 12px;\n}`,
    correctExplanation: "Nilai valid untuk mengaktifkan konteks Flexbox adalah display: flex.",
    wrongExplanation: "flexbox bukan nilai valid untuk properti display. Kata yang benar adalah flex.",
  },
  {
    id: "css-hover-selector",
    title: "Selector hover pada tombol",
    language: "CSS",
    difficulty: "Sedang",
    correctCode: `.button:hover {\n  background: #7357c7;\n  transform: translateY(-1px);\n}`,
    wrongCode: `.button hover {\n  background: #7357c7;\n  transform: translateY(-1px);\n}`,
    correctExplanation: "Pseudo-class :hover menempel pada selector .button dengan tanda titik dua.",
    wrongExplanation: "Spasi menggantikan tanda titik dua. .button hover berarti mencari elemen <hover> di dalam .button, bukan keadaan hover tombol.",
  },
  {
    id: "js-strict-equality",
    title: "Perbandingan nilai JavaScript",
    language: "JavaScript",
    difficulty: "Mudah",
    correctCode: `let score = 10;\n\nif (score === 10) {\n  console.log("Perfect!");\n}`,
    wrongCode: `let score = 10;\n\nif (score = 10) {\n  console.log("Perfect!");\n}`,
    correctExplanation: "Operator === membandingkan nilai sekaligus tipe data tanpa mengubah variabel.",
    wrongExplanation: "Satu tanda = adalah operator assignment. Kondisi mengubah score menjadi 10, bukan membandingkannya.",
  },
  {
    id: "js-query-selector",
    title: "Memilih elemen dari DOM",
    language: "JavaScript",
    difficulty: "Sedang",
    correctCode: `const card = document.querySelector(".card");\ncard.classList.add("active");`,
    wrongCode: `const card = document.querySelect(".card");\ncard.classList.add("active");`,
    correctExplanation: "Nama metode DOM yang tersedia adalah querySelector(), dengan akhiran or.",
    wrongExplanation: "document.querySelect() tidak ada. Hilangnya akhiran or membuat pemanggilan metode gagal.",
  },
  {
    id: "js-map-return",
    title: "Nilai balik dari map",
    language: "JavaScript",
    difficulty: "Sulit",
    correctCode: `const prices = [10, 20, 30];\nconst doubled = prices.map((price) => {\n  return price * 2;\n});`,
    wrongCode: `const prices = [10, 20, 30];\nconst doubled = prices.map((price) => {\n  price * 2;\n});`,
    correctExplanation: "Callback dengan curly braces perlu return eksplisit agar map menerima nilai baru untuk setiap elemen.",
    wrongExplanation: "Ekspresi price * 2 dihitung tetapi tidak dikembalikan. Hasil doubled menjadi [undefined, undefined, undefined].",
  },
  {
    id: "html-image-alt",
    title: "Gambar yang lebih aksesibel",
    language: "HTML",
    difficulty: "Sedang",
    correctCode: `<img\n  src="bunny-coding.png"\n  alt="Kelinci sedang belajar JavaScript"\n>`,
    wrongCode: `<img\n  src="bunny-coding.png"\n  atl="Kelinci sedang belajar JavaScript"\n>`,
    correctExplanation: "Atribut alt menyediakan alternatif teks yang dapat digunakan pembaca layar ketika gambar tidak dapat dilihat.",
    wrongExplanation: "Atribut alt salah ketik menjadi atl. Browser tidak mengenalinya sebagai teks alternatif gambar.",
  },
  {
    id: "html-doctype",
    title: "Deklarasi doctype HTML5",
    language: "HTML",
    difficulty: "Mudah",
    correctCode: `<!DOCTYPE html>\n<html lang="id">\n<head>\n  <title>Bunny</title>\n</head>\n</html>`,
    wrongCode: `<!DOCTYP html>\n<html lang="id">\n<head>\n  <title>Bunny</title>\n</head>\n</html>`,
    correctExplanation: "Deklarasi <!DOCTYPE html> ditulis lengkap sehingga browser merender halaman dalam standards mode.",
    wrongExplanation: "Kata DOCTYPE kehilangan huruf E dan menjadi DOCTYP. Browser tidak mengenali deklarasi ini sebagai doctype yang valid.",
  },
  {
    id: "html-closing-tag",
    title: "Menutup tag paragraf",
    language: "HTML",
    difficulty: "Mudah",
    correctCode: `<article>\n  <p>Kelinci suka belajar kode.</p>\n</article>`,
    wrongCode: `<article>\n  <p>Kelinci suka belajar kode.<p>\n</article>`,
    correctExplanation: "Tag penutup </p> ditulis dengan garis miring sehingga paragraf tertutup dengan benar.",
    wrongExplanation: "Tag penutup kehilangan garis miring dan menjadi <p> lagi, sehingga browser mencoba membuka paragraf baru, bukan menutupnya.",
  },
  {
    id: "html-anchor-href",
    title: "Tautan yang mengarah dengan benar",
    language: "HTML",
    difficulty: "Mudah",
    correctCode: `<a href="https://example.com">Kunjungi situs</a>`,
    wrongCode: `<a herf="https://example.com">Kunjungi situs</a>`,
    correctExplanation: "Atribut href ditulis dengan benar sehingga tautan mengarah ke alamat yang dituju.",
    wrongExplanation: "Atribut href salah ketik menjadi herf. Browser tidak mengenalinya sehingga tautan tidak berfungsi.",
  },
  {
    id: "html-list-structure",
    title: "Struktur daftar tidak berurutan",
    language: "HTML",
    difficulty: "Sedang",
    correctCode: `<ul>\n  <li>Wortel</li>\n  <li>Selada</li>\n</ul>`,
    wrongCode: `<ul>\n  <li>Wortel<li>\n  <li>Selada</li>\n</ul>`,
    correctExplanation: "Setiap elemen <li> ditutup dengan </li> sehingga struktur daftar valid.",
    wrongExplanation: "Item pertama ditutup dengan <li> alih-alih </li>, sehingga browser membuka item baru di dalam item lama.",
  },
  {
    id: "html-table-header",
    title: "Header tabel yang tepat",
    language: "HTML",
    difficulty: "Sedang",
    correctCode: `<table>\n  <tr>\n    <th>Nama</th>\n    <th>Skor</th>\n  </tr>\n</table>`,
    wrongCode: `<table>\n  <tr>\n    <td>Nama</td>\n    <td>Skor</td>\n  </tr>\n</table>`,
    correctExplanation: "Sel header ditulis dengan <th> sehingga dikenali sebagai judul kolom, termasuk oleh pembaca layar.",
    wrongExplanation: "Sel header ditulis dengan <td> biasa, sehingga tabel kehilangan informasi semantik tentang kolom header.",
  },
  {
    id: "html-input-name",
    title: "Atribut name pada input form",
    language: "HTML",
    difficulty: "Sedang",
    correctCode: `<form action="/submit">\n  <input type="text" name="username">\n</form>`,
    wrongCode: `<form action="/submit">\n  <input type="text" nam="username">\n</form>`,
    correctExplanation: "Atribut name ditulis lengkap sehingga nilai input ikut terkirim saat form disubmit.",
    wrongExplanation: "Atribut name kehilangan huruf e dan menjadi nam. Data input tidak akan ikut terkirim ke server.",
  },
  {
    id: "html-meta-viewport",
    title: "Meta viewport untuk responsif",
    language: "HTML",
    difficulty: "Sulit",
    correctCode: `<meta name="viewport" content="width=device-width, initial-scale=1">`,
    wrongCode: `<meta name="viewport" content="width=device-width, initial-scale=1.0.0">`,
    correctExplanation: "Nilai initial-scale ditulis sebagai angka desimal valid, yaitu 1.",
    wrongExplanation: "Nilai initial-scale ditulis 1.0.0 yang bukan angka desimal valid, sehingga sebagian browser mengabaikan aturan skala ini.",
  },
  {
    id: "html-semantic-nav",
    title: "Elemen semantik navigasi",
    language: "HTML",
    difficulty: "Sedang",
    correctCode: `<nav>\n  <a href="/">Beranda</a>\n  <a href="/about">Tentang</a>\n</nav>`,
    wrongCode: `<nva>\n  <a href="/">Beranda</a>\n  <a href="/about">Tentang</a>\n</nva>`,
    correctExplanation: "Elemen semantik <nav> ditulis dengan benar sehingga browser dan pembaca layar mengenalinya sebagai navigasi.",
    wrongExplanation: "Nama elemen <nav> tertukar hurufnya menjadi <nva>, sehingga dianggap elemen tak dikenal, bukan elemen navigasi semantik.",
  },
  {
    id: "css-class-selector",
    title: "Selector class yang benar",
    language: "CSS",
    difficulty: "Mudah",
    correctCode: `.card {\n  border-radius: 12px;\n  padding: 16px;\n}`,
    wrongCode: `#card {\n  border-radius: 12px;\n  padding: 16px;\n}`,
    correctExplanation: "Titik di depan nama menandakan selector class, cocok untuk elemen dengan atribut class=\"card\".",
    wrongExplanation: "Tanda pagar menjadikannya selector id, sehingga hanya cocok untuk elemen dengan id=\"card\", bukan class.",
  },
  {
    id: "css-color-hex",
    title: "Nilai warna heksadesimal",
    language: "CSS",
    difficulty: "Mudah",
    correctCode: `.title {\n  color: #7357c7;\n}`,
    wrongCode: `.title {\n  color: #7357cz;\n}`,
    correctExplanation: "Kode warna hanya berisi karakter heksadesimal valid, yaitu 0-9 dan a-f.",
    wrongExplanation: "Karakter terakhir adalah huruf z, yang bukan digit heksadesimal valid, sehingga warna tidak dikenali browser.",
  },
  {
    id: "css-margin-shorthand",
    title: "Shorthand margin empat sisi",
    language: "CSS",
    difficulty: "Sedang",
    correctCode: `.box {\n  margin: 8px 16px 8px 16px;\n}`,
    wrongCode: `.box {\n  margin: 8px 16px 8px 16px 8px;\n}`,
    correctExplanation: "Shorthand margin menerima maksimal empat nilai untuk atas, kanan, bawah, dan kiri.",
    wrongExplanation: "Ditulis lima nilai, padahal shorthand margin hanya menerima satu sampai empat nilai sehingga aturan menjadi tidak valid.",
  },
  {
    id: "css-grid-template",
    title: "Kolom grid dengan fr unit",
    language: "CSS",
    difficulty: "Sulit",
    correctCode: `.grid {\n  display: grid;\n  grid-template-columns: 1fr 2fr;\n}`,
    wrongCode: `.grid {\n  display: grid;\n  grid-template-columns: 1fr 2f;\n}`,
    correctExplanation: "Satuan fraksi ditulis lengkap sebagai fr, membagi ruang grid secara proporsional.",
    wrongExplanation: "Satuan kedua ditulis 2f, bukan 2fr, sehingga browser tidak mengenali satuan tersebut dan kolom kedua gagal terbentuk.",
  },
  {
    id: "css-font-weight",
    title: "Ketebalan teks judul",
    language: "CSS",
    difficulty: "Mudah",
    correctCode: `.heading {\n  font-weight: bold;\n  font-size: 24px;\n}`,
    wrongCode: `.heading {\n  font-weigth: bold;\n  font-size: 24px;\n}`,
    correctExplanation: "Properti font-weight dieja dengan benar sehingga teks tampil tebal.",
    wrongExplanation: "Properti salah eja menjadi font-weigth, huruf t dan h tertukar, sehingga browser mengabaikan aturan ini.",
  },
  {
    id: "css-media-query",
    title: "Media query untuk layar kecil",
    language: "CSS",
    difficulty: "Sedang",
    correctCode: `@media (max-width: 600px) {\n  .card {\n    padding: 8px;\n  }\n}`,
    wrongCode: `@media (max-width: 600px} {\n  .card {\n    padding: 8px;\n  }\n}`,
    correctExplanation: "Kondisi media query ditutup dengan tanda kurung tutup yang sesuai sebelum kurung kurawal pembuka.",
    wrongExplanation: "Kurung kondisi ditutup dengan kurung kurawal, bukan kurung biasa, sehingga sintaks media query menjadi tidak valid.",
  },
  {
    id: "css-transition-property",
    title: "Transisi warna latar tombol",
    language: "CSS",
    difficulty: "Sedang",
    correctCode: `.button {\n  transition: background-color 0.2s ease;\n}`,
    wrongCode: `.button {\n  transtion: background-color 0.2s ease;\n}`,
    correctExplanation: "Properti transition dieja lengkap sehingga perubahan warna latar berlangsung mulus.",
    wrongExplanation: "Properti salah eja menjadi transtion, kehilangan huruf i, sehingga efek transisi tidak diterapkan.",
  },
  {
    id: "css-nth-child",
    title: "Menata baris genap pada tabel",
    language: "CSS",
    difficulty: "Sulit",
    correctCode: `tr:nth-child(even) {\n  background: #f4f2fb;\n}`,
    wrongCode: `tr:nth-child(evan) {\n  background: #f4f2fb;\n}`,
    correctExplanation: "Kata kunci even ditulis benar sehingga baris bernomor genap mendapat warna latar berbeda.",
    wrongExplanation: "Kata kunci salah ketik menjadi evan, yang bukan nilai valid untuk nth-child, sehingga aturan diabaikan browser.",
  },
  {
    id: "css-position-sticky",
    title: "Header yang menempel saat scroll",
    language: "CSS",
    difficulty: "Sulit",
    correctCode: `.header {\n  position: sticky;\n  top: 0;\n}`,
    wrongCode: `.header {\n  position: stick;\n  top: 0;\n}`,
    correctExplanation: "Nilai sticky ditulis lengkap sehingga header menempel di bagian atas saat halaman digulir.",
    wrongExplanation: "Nilai stick bukan nilai valid untuk position. Browser mengabaikannya sehingga header tidak menempel.",
  },
  {
    id: "js-const-declaration",
    title: "Mendeklarasikan konstanta",
    language: "JavaScript",
    difficulty: "Mudah",
    correctCode: `const maxScore = 100;\nconsole.log(maxScore);`,
    wrongCode: `cons maxScore = 100;\nconsole.log(maxScore);`,
    correctExplanation: "Kata kunci const ditulis lengkap sehingga variabel maxScore terdeklarasi sebagai konstanta.",
    wrongExplanation: "Kata kunci const kehilangan huruf t dan menjadi cons, yang tidak dikenali JavaScript sebagai kata kunci.",
  },
  {
    id: "js-array-push",
    title: "Menambah elemen ke array",
    language: "JavaScript",
    difficulty: "Mudah",
    correctCode: `const fruits = ["apel"];\nfruits.push("jeruk");`,
    wrongCode: `const fruits = ["apel"];\nfruits.psh("jeruk");`,
    correctExplanation: "Metode push() dieja lengkap sehingga elemen baru berhasil ditambahkan ke akhir array.",
    wrongExplanation: "Metode push() dieja psh, kehilangan huruf u, sehingga JavaScript melempar error karena metode tidak ditemukan.",
  },
  {
    id: "js-template-literal",
    title: "Menyisipkan variabel ke string",
    language: "JavaScript",
    difficulty: "Sedang",
    correctCode: `const name = "Bunny";\nconsole.log(\`Halo, \${name}!\`);`,
    wrongCode: `const name = "Bunny";\nconsole.log(\`Halo, {name}!\`);`,
    correctExplanation: "Sintaks interpolasi template literal menggunakan tanda dolar sebelum kurung kurawal, yaitu \${name}.",
    wrongExplanation: "Tanda dolar sebelum kurung kurawal hilang, sehingga {name} dianggap teks biasa, bukan variabel yang disisipkan.",
  },
  {
    id: "js-function-declaration",
    title: "Mendeklarasikan fungsi biasa",
    language: "JavaScript",
    difficulty: "Mudah",
    correctCode: `function greet(name) {\n  return "Halo " + name;\n}`,
    wrongCode: `functio greet(name) {\n  return "Halo " + name;\n}`,
    correctExplanation: "Kata kunci function ditulis lengkap sehingga fungsi greet terdeklarasi dengan benar.",
    wrongExplanation: "Kata kunci function kehilangan huruf n dan menjadi functio, sehingga menimbulkan kesalahan sintaks.",
  },
  {
    id: "js-array-length",
    title: "Membaca panjang array",
    language: "JavaScript",
    difficulty: "Mudah",
    correctCode: `const items = ["a", "b", "c"];\nconsole.log(items.length);`,
    wrongCode: `const items = ["a", "b", "c"];\nconsole.log(items.lenght);`,
    correctExplanation: "Properti length dieja dengan benar sehingga mengembalikan jumlah elemen array.",
    wrongExplanation: "Properti length dieja lenght, huruf g dan t tertukar, sehingga hasilnya undefined karena properti tidak ditemukan.",
  },
  {
    id: "js-addeventlistener",
    title: "Menambahkan event listener klik",
    language: "JavaScript",
    difficulty: "Sedang",
    correctCode: `button.addEventListener("click", handleClick);`,
    wrongCode: `button.addEventListner("click", handleClick);`,
    correctExplanation: "Metode addEventListener dieja lengkap sehingga event klik terpasang dengan benar pada tombol.",
    wrongExplanation: "Metode dieja addEventListner, kehilangan huruf e, sehingga JavaScript melempar error karena metode tidak dikenali.",
  },
  {
    id: "js-json-parse",
    title: "Mengubah string JSON menjadi objek",
    language: "JavaScript",
    difficulty: "Sedang",
    correctCode: `const data = JSON.parse('{"score": 10}');\nconsole.log(data.score);`,
    wrongCode: `const data = JSON.parse('{score: 10}');\nconsole.log(data.score);`,
    correctExplanation: "Kunci pada string JSON diberi tanda kutip ganda, sesuai format JSON yang valid.",
    wrongExplanation: "Kunci score tidak diberi tanda kutip pada string JSON, sehingga JSON.parse gagal karena format tidak valid.",
  },
  {
    id: "js-array-filter",
    title: "Menyaring array dengan filter",
    language: "JavaScript",
    difficulty: "Sedang",
    correctCode: `const nums = [1, 2, 3, 4];\nconst even = nums.filter((n) => n % 2 === 0);`,
    wrongCode: `const nums = [1, 2, 3, 4];\nconst even = nums.filter((n) => n % 2 = 0);`,
    correctExplanation: "Operator === digunakan untuk membandingkan sisa bagi dengan 0 tanpa mengubah nilai n.",
    wrongExplanation: "Satu tanda = adalah assignment, sehingga baris ini mencoba mengubah hasil n % 2 dan menimbulkan error sintaks.",
  },
  {
    id: "js-arrow-function",
    title: "Menulis arrow function ringkas",
    language: "JavaScript",
    difficulty: "Sedang",
    correctCode: `const double = (n) => n * 2;\nconsole.log(double(5));`,
    wrongCode: `const double = (n) = n * 2;\nconsole.log(double(5));`,
    correctExplanation: "Tanda panah arrow function ditulis dengan benar sebagai => setelah parameter.",
    wrongExplanation: "Tanda kurang dari hilang sehingga hanya tersisa tanda sama dengan, yang dibaca sebagai assignment biasa dan menimbulkan error.",
  },
  {
    id: "js-settimeout",
    title: "Menunda eksekusi dengan setTimeout",
    language: "JavaScript",
    difficulty: "Sulit",
    correctCode: `setTimeout(() => {\n  console.log("Selesai");\n}, 1000);`,
    wrongCode: `setTimeout(() => {\n  console.log("Selesai");\n}, "1000");`,
    correctExplanation: "Argumen kedua setTimeout adalah angka 1000 dalam milidetik, sesuai tipe data yang diharapkan.",
    wrongExplanation: "Argumen kedua ditulis sebagai string \"1000\". Meski sering berjalan, ini bukan praktik yang benar karena parameter delay seharusnya bertipe number.",
  },
  {
    id: "js-array-includes",
    title: "Memeriksa keberadaan elemen",
    language: "JavaScript",
    difficulty: "Sedang",
    correctCode: `const roles = ["admin", "editor"];\nconsole.log(roles.includes("admin"));`,
    wrongCode: `const roles = ["admin", "editor"];\nconsole.log(roles.include("admin"));`,
    correctExplanation: "Metode includes() dieja lengkap dengan akhiran s, sesuai nama metode array bawaan JavaScript.",
    wrongExplanation: "Metode dieja include tanpa akhiran s, sehingga JavaScript melempar error karena metode tersebut tidak ada.",
  },
  {
    id: "js-object-destructuring",
    title: "Destructuring properti objek",
    language: "JavaScript",
    difficulty: "Sulit",
    correctCode: `const user = { name: "Bunny", score: 90 };\nconst { name, score } = user;`,
    wrongCode: `const user = { name: "Bunny", score: 90 };\nconst { name, score } = user();`,
    correctExplanation: "Objek user diakses langsung tanpa tanda kurung panggil, karena user adalah objek, bukan fungsi.",
    wrongExplanation: "Ditambahkan tanda kurung setelah user, seolah memanggilnya sebagai fungsi, padahal user adalah objek biasa sehingga menimbulkan error.",
  },
  {
    id: "html-comment-syntax",
    title: "Menulis komentar HTML",
    language: "HTML",
    difficulty: "Mudah",
    correctCode: `<!-- Bagian header -->\n<header>Bunny Eye</header>`,
    wrongCode: `<!- Bagian header -->\n<header>Bunny Eye</header>`,
    correctExplanation: "Komentar HTML dibuka dengan dua tanda hubung setelah tanda seru, yaitu <!--.",
    wrongExplanation: "Pembuka komentar hanya memiliki satu tanda hubung, <!-, sehingga browser tidak mengenalinya sebagai komentar yang valid.",
  },
  {
    id: "html-select-option",
    title: "Opsi dalam elemen select",
    language: "HTML",
    difficulty: "Sedang",
    correctCode: `<select name="level">\n  <option value="easy">Mudah</option>\n</select>`,
    wrongCode: `<select name="level">\n  <optoin value="easy">Mudah</optoin>\n</select>`,
    correctExplanation: "Elemen <option> dieja dengan benar sehingga dikenali sebagai pilihan di dalam dropdown select.",
    wrongExplanation: "Nama elemen tertukar hurufnya menjadi <optoin>, sehingga browser memperlakukannya sebagai elemen tak dikenal.",
  },
  {
    id: "html-textarea-tag",
    title: "Area teks pada form",
    language: "HTML",
    difficulty: "Mudah",
    correctCode: `<textarea name="message" rows="4"></textarea>`,
    wrongCode: `<textarea name="message" rows="4">`,
    correctExplanation: "Elemen textarea memiliki tag penutup </textarea> karena bukan elemen kosong seperti <input>.",
    wrongExplanation: "Tag penutup </textarea> tidak ada. Browser dapat salah menafsirkan sisa halaman sebagai isi textarea.",
  },
  {
    id: "html-script-src",
    title: "Memuat file JavaScript eksternal",
    language: "HTML",
    difficulty: "Sedang",
    correctCode: `<script src="app.js" defer></script>`,
    wrongCode: `<script scr="app.js" defer></script>`,
    correctExplanation: "Atribut src ditulis dengan benar sehingga browser tahu file JavaScript mana yang harus dimuat.",
    wrongExplanation: "Atribut src salah ketik menjadi scr, sehingga browser tidak memuat file app.js sama sekali.",
  },
  {
    id: "html-checkbox-checked",
    title: "Checkbox dengan status tercentang",
    language: "HTML",
    difficulty: "Sedang",
    correctCode: `<input type="checkbox" name="agree" checked>`,
    wrongCode: `<input type="checkbox" name="agree" cheked>`,
    correctExplanation: "Atribut checked dieja lengkap sehingga checkbox tampil tercentang saat halaman dimuat.",
    wrongExplanation: "Atribut checked salah ketik menjadi cheked, sehingga browser tidak mengenalinya dan checkbox tidak tercentang.",
  },
  {
    id: "html-figure-figcaption",
    title: "Gambar dengan keterangan",
    language: "HTML",
    difficulty: "Sulit",
    correctCode: `<figure>\n  <img src="bunny.png" alt="Kelinci">\n  <figcaption>Kelinci sedang ngoding</figcaption>\n</figure>`,
    wrongCode: `<figure>\n  <img src="bunny.png" alt="Kelinci">\n  <figcaption>Kelinci sedang ngoding<figcaption>\n</figure>`,
    correctExplanation: "Elemen figcaption ditutup dengan </figcaption> menggunakan garis miring.",
    wrongExplanation: "Tag penutup figcaption kehilangan garis miring, sehingga browser membuka figcaption baru alih-alih menutupnya.",
  },
  {
    id: "css-important-syntax",
    title: "Menulis aturan !important",
    language: "CSS",
    difficulty: "Sedang",
    correctCode: `.banner {\n  color: red !important;\n}`,
    wrongCode: `.banner {\n  color: red !importent;\n}`,
    correctExplanation: "Kata kunci !important dieja dengan benar sehingga aturan ini menimpa aturan CSS lain dengan spesifisitas lebih rendah.",
    wrongExplanation: "Kata kunci salah eja menjadi !importent, sehingga browser mengabaikan seluruh deklarasi ini sebagai tidak valid.",
  },
  {
    id: "css-box-shadow",
    title: "Bayangan kotak pada kartu",
    language: "CSS",
    difficulty: "Sedang",
    correctCode: `.card {\n  box-shadow: 0 4px 12px rgba(0,0,0,0.15);\n}`,
    wrongCode: `.card {\n  box-shdow: 0 4px 12px rgba(0,0,0,0.15);\n}`,
    correctExplanation: "Properti box-shadow dieja lengkap sehingga bayangan kartu diterapkan browser.",
    wrongExplanation: "Properti salah eja menjadi box-shdow, kehilangan huruf a, sehingga aturan ini diabaikan browser.",
  },
  {
    id: "css-z-index",
    title: "Mengatur urutan tumpukan elemen",
    language: "CSS",
    difficulty: "Sedang",
    correctCode: `.modal {\n  position: fixed;\n  z-index: 100;\n}`,
    wrongCode: `.modal {\n  position: fixed;\n  z-index: hundred;\n}`,
    correctExplanation: "Nilai z-index berupa bilangan bulat, seperti 100, sesuai spesifikasi CSS.",
    wrongExplanation: "Nilai z-index ditulis sebagai kata hundred, bukan angka, sehingga browser menganggap nilainya tidak valid.",
  },
  {
    id: "css-custom-property",
    title: "Menggunakan variabel CSS",
    language: "CSS",
    difficulty: "Sulit",
    correctCode: `:root {\n  --main-color: #7357c7;\n}\n.title {\n  color: var(--main-color);\n}`,
    wrongCode: `:root {\n  --main-color: #7357c7;\n}\n.title {\n  color: var(-main-color);\n}`,
    correctExplanation: "Nama custom property dipanggil dengan dua tanda hubung di dalam var(), sesuai cara mendeklarasikannya.",
    wrongExplanation: "Pemanggilan var() hanya memakai satu tanda hubung, -main-color, sehingga tidak cocok dengan nama variabel yang dideklarasikan.",
  },
  {
    id: "css-overflow-scroll",
    title: "Membuat area yang dapat digulir",
    language: "CSS",
    difficulty: "Sedang",
    correctCode: `.list {\n  max-height: 200px;\n  overflow-y: auto;\n}`,
    wrongCode: `.list {\n  max-height: 200px;\n  overflow-y: outo;\n}`,
    correctExplanation: "Nilai auto ditulis dengan benar sehingga scrollbar vertikal muncul hanya saat konten melebihi tinggi maksimum.",
    wrongExplanation: "Nilai auto salah ketik menjadi outo, yang bukan nilai valid untuk overflow-y, sehingga aturan diabaikan browser.",
  },
  {
    id: "css-animation-name",
    title: "Menjalankan animasi keyframes",
    language: "CSS",
    difficulty: "Sulit",
    correctCode: `@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n.card {\n  animation: fadeIn 0.3s;\n}`,
    wrongCode: `@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n.card {\n  animation: fadein 0.3s;\n}`,
    correctExplanation: "Nama animasi pada properti animation sama persis dengan nama pada @keyframes, yaitu fadeIn.",
    wrongExplanation: "Nama animasi ditulis fadein huruf kecil semua, tidak sama persis dengan fadeIn pada @keyframes, sehingga animasi tidak berjalan karena CSS sensitif huruf besar-kecil pada nama ini.",
  },
  {
    id: "css-border-radius",
    title: "Membulatkan sudut tombol",
    language: "CSS",
    difficulty: "Mudah",
    correctCode: `.button {\n  border-radius: 8px;\n}`,
    wrongCode: `.button {\n  border-raduis: 8px;\n}`,
    correctExplanation: "Properti border-radius dieja lengkap sehingga sudut tombol tampil membulat.",
    wrongExplanation: "Properti salah eja menjadi border-raduis, huruf d dan i tertukar, sehingga aturan ini diabaikan browser.",
  },
  {
    id: "js-array-splice",
    title: "Menghapus elemen dengan splice",
    language: "JavaScript",
    difficulty: "Sulit",
    correctCode: `const list = ["a", "b", "c"];\nlist.splice(1, 1);`,
    wrongCode: `const list = ["a", "b", "c"];\nlist.slice(1, 1);`,
    correctExplanation: "Metode splice() mengubah array asli, menghapus satu elemen mulai indeks 1 sesuai kebutuhan.",
    wrongExplanation: "Metode yang dipakai adalah slice(), yang hanya mengembalikan potongan array baru tanpa mengubah array asli, bukan menghapus elemen.",
  },
  {
    id: "js-for-loop",
    title: "Perulangan for standar",
    language: "JavaScript",
    difficulty: "Mudah",
    correctCode: `for (let i = 0; i < 5; i++) {\n  console.log(i);\n}`,
    wrongCode: `for (let i = 0; i < 5; i++ {\n  console.log(i);\n}`,
    correctExplanation: "Header perulangan for ditutup dengan tanda kurung sebelum kurung kurawal blok kode.",
    wrongExplanation: "Tanda kurung tutup pada header for hilang sebelum kurung kurawal, sehingga menimbulkan kesalahan sintaks.",
  },
  {
    id: "js-typeof-operator",
    title: "Memeriksa tipe data dengan typeof",
    language: "JavaScript",
    difficulty: "Sedang",
    correctCode: `let score = 10;\nconsole.log(typeof score);`,
    wrongCode: `let score = 10;\nconsole.log(typeOf score);`,
    correctExplanation: "Operator typeof ditulis huruf kecil semua, sesuai kata kunci baku JavaScript.",
    wrongExplanation: "Ditulis typeOf dengan huruf O kapital, sehingga JavaScript tidak mengenalinya sebagai operator typeof dan melempar error.",
  },
  {
    id: "js-promise-then",
    title: "Menangani hasil Promise",
    language: "JavaScript",
    difficulty: "Sulit",
    correctCode: `fetchData().then((data) => {\n  console.log(data);\n});`,
    wrongCode: `fetchData().than((data) => {\n  console.log(data);\n});`,
    correctExplanation: "Metode then() dieja dengan benar sehingga callback dijalankan setelah Promise berhasil diselesaikan.",
    wrongExplanation: "Metode salah eja menjadi than, sehingga JavaScript melempar error karena metode tersebut tidak ada pada objek Promise.",
  },
  {
    id: "js-array-join",
    title: "Menggabungkan array menjadi string",
    language: "JavaScript",
    difficulty: "Sedang",
    correctCode: `const words = ["Halo", "Bunny"];\nconsole.log(words.join(" "));`,
    wrongCode: `const words = ["Halo", "Bunny"];\nconsole.log(words.joins(" "));`,
    correctExplanation: "Metode join() dieja tanpa akhiran s, sesuai nama metode array bawaan JavaScript.",
    wrongExplanation: "Metode ditulis joins dengan tambahan huruf s, sehingga JavaScript melempar error karena metode tersebut tidak ditemukan.",
  },
  {
    id: "js-array-foreach",
    title: "Mengulang array dengan forEach",
    language: "JavaScript",
    difficulty: "Sedang",
    correctCode: `const nums = [1, 2, 3];\nnums.forEach((n) => console.log(n));`,
    wrongCode: `const nums = [1, 2, 3];\nnums.foreach((n) => console.log(n));`,
    correctExplanation: "Metode forEach ditulis dengan huruf E kapital di tengah, sesuai penamaan camelCase aslinya.",
    wrongExplanation: "Metode ditulis foreach seluruhnya huruf kecil, tidak sama dengan nama asli forEach yang sensitif huruf besar-kecil, sehingga error.",
  },
  {
    id: "js-string-trim",
    title: "Menghapus spasi di ujung string",
    language: "JavaScript",
    difficulty: "Mudah",
    correctCode: `const input = "  bunny  ";\nconsole.log(input.trim());`,
    wrongCode: `const input = "  bunny  ";\nconsole.log(input.trime());`,
    correctExplanation: "Metode trim() dieja dengan benar sehingga spasi di awal dan akhir string dihapus.",
    wrongExplanation: "Metode salah eja menjadi trime, dengan tambahan huruf e, sehingga JavaScript melempar error karena metode tidak ditemukan.",
  },
  {
    id: "js-default-parameter",
    title: "Parameter default pada fungsi",
    language: "JavaScript",
    difficulty: "Sedang",
    correctCode: `function greet(name = "Tamu") {\n  return "Halo " + name;\n}`,
    wrongCode: `function greet(name == "Tamu") {\n  return "Halo " + name;\n}`,
    correctExplanation: "Nilai default parameter ditetapkan dengan satu tanda sama dengan di dalam deklarasi parameter.",
    wrongExplanation: "Digunakan operator perbandingan == alih-alih tanda sama dengan tunggal, sehingga sintaks parameter default menjadi tidak valid.",
  },
  {
    id: "js-spread-operator",
    title: "Menyalin array dengan spread operator",
    language: "JavaScript",
    difficulty: "Sulit",
    correctCode: `const original = [1, 2, 3];\nconst copy = [...original, 4];`,
    wrongCode: `const original = [1, 2, 3];\nconst copy = [..original, 4];`,
    correctExplanation: "Spread operator ditulis dengan tiga titik berurutan sebelum nama array.",
    wrongExplanation: "Hanya ditulis dua titik, ..original, bukan tiga titik, sehingga bukan sintaks spread operator yang valid dan menimbulkan error.",
  },
  {
    id: "js-console-log",
    title: "Mencetak nilai ke konsol",
    language: "JavaScript",
    difficulty: "Mudah",
    correctCode: `console.log("Skor:", 90);`,
    wrongCode: `console.lg("Skor:", 90);`,
    correctExplanation: "Metode log() dieja lengkap sehingga pesan tampil di konsol browser.",
    wrongExplanation: "Metode ditulis lg, kehilangan huruf o, sehingga JavaScript melempar error karena metode tersebut tidak ada pada objek console.",
  },
];

const state = {
  questions: [],
  currentId: null,
  options: [],
  selectedIndex: null,
  revealed: false,
  round: 1,
  score: 0,
  attempts: 0,
  streak: 0,
  editorId: null,
  pendingDeleteId: null,
};

const elements = {
  root: document.documentElement,
  themeToggle: document.querySelector("#themeToggle"),
  themeIcon: document.querySelector(".theme-icon"),
  openBank: document.querySelector("#openBank"),
  closeBank: document.querySelector("#closeBank"),
  bankDialog: document.querySelector("#bankDialog"),
  confirmDialog: document.querySelector("#confirmDialog"),
  confirmDelete: document.querySelector("#confirmDelete"),
  confirmText: document.querySelector("#confirmText"),
  cardsStack: document.querySelector("#cardsStack"),
  emptyState: document.querySelector("#emptyState"),
  gameActions: document.querySelector("#gameActions"),
  emptyAddButton: document.querySelector("#emptyAddButton"),
  challengeTitle: document.querySelector("#challengeTitle"),
  challengeSubtitle: document.querySelector("#challengeSubtitle"),
  languageBadge: document.querySelector("#languageBadge"),
  difficultyBadge: document.querySelector("#difficultyBadge"),
  roundNumber: document.querySelector("#roundNumber"),
  scoreValue: document.querySelector("#scoreValue"),
  streakValue: document.querySelector("#streakValue"),
  revealButton: document.querySelector("#revealButton"),
  revealLabel: document.querySelector("#revealLabel"),
  skipButton: document.querySelector("#skipButton"),
  feedback: document.querySelector("#feedback"),
  feedbackIcon: document.querySelector("#feedbackIcon"),
  feedbackTitle: document.querySelector("#feedbackTitle"),
  feedbackText: document.querySelector("#feedbackText"),
  questionCount: document.querySelector("#questionCount"),
  bankCount: document.querySelector("#bankCount"),
  questionSearch: document.querySelector("#questionSearch"),
  questionList: document.querySelector("#questionList"),
  addQuestion: document.querySelector("#addQuestion"),
  exportQuestions: document.querySelector("#exportQuestions"),
  resetQuestions: document.querySelector("#resetQuestions"),
  editorPlaceholder: document.querySelector("#editorPlaceholder"),
  questionForm: document.querySelector("#questionForm"),
  formTitle: document.querySelector("#formTitle"),
  cancelEdit: document.querySelector("#cancelEdit"),
  questionId: document.querySelector("#questionId"),
  titleInput: document.querySelector("#titleInput"),
  languageInput: document.querySelector("#languageInput"),
  difficultyInput: document.querySelector("#difficultyInput"),
  correctCodeInput: document.querySelector("#correctCodeInput"),
  wrongCodeInput: document.querySelector("#wrongCodeInput"),
  correctExplanationInput: document.querySelector("#correctExplanationInput"),
  wrongExplanationInput: document.querySelector("#wrongExplanationInput"),
  toast: document.querySelector("#toast"),
};

function cloneDefaults() {
  return JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
}

function loadQuestions() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    state.questions = stored ? JSON.parse(stored) : cloneDefaults();
    if (!Array.isArray(state.questions)) throw new Error("Invalid data");
  } catch {
    state.questions = cloneDefaults();
    showToast("Data lokal bermasalah. Bank soal bawaan dipulihkan.");
  }
}

function saveQuestions(message = "Bank soal tersimpan.") {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.questions));
  elements.questionCount.textContent = state.questions.length;
  elements.bankCount.textContent = `${state.questions.length} soal`;
  if (message) showToast(message);
}

function applyTheme(theme) {
  elements.root.dataset.theme = theme;
  const dark = theme === "dark";
  elements.themeIcon.textContent = dark ? "☀" : "☾";
  elements.themeToggle.setAttribute("aria-label", dark ? "Aktifkan tema terang" : "Aktifkan tema gelap");
}

function initializeTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  applyTheme(saved || preferred);
}

function toggleTheme() {
  const next = elements.root.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
}

function randomQuestion(excludeId = null) {
  if (!state.questions.length) return null;
  const pool = state.questions.length > 1
    ? state.questions.filter((question) => question.id !== excludeId)
    : state.questions;
  return pool[Math.floor(Math.random() * pool.length)];
}

function startRound(increment = false) {
  const previousId = state.currentId;
  const question = randomQuestion(previousId);

  if (!question) {
    state.currentId = null;
    state.options = [];
    renderGame();
    return;
  }

  if (increment) state.round += 1;
  state.currentId = question.id;
  state.selectedIndex = null;
  state.revealed = false;
  state.options = [
    { code: question.correctCode, correct: true, explanation: question.correctExplanation },
    { code: question.wrongCode, correct: false, explanation: question.wrongExplanation },
  ].sort(() => Math.random() - 0.5);

  renderGame();
}

function currentQuestion() {
  return state.questions.find((question) => question.id === state.currentId) || null;
}

function codeLines(code) {
  return String(code).replace(/\r\n/g, "\n").split("\n");
}

function createCodeCard(option, index) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "code-card";
  card.dataset.index = index;
  card.setAttribute("aria-pressed", String(state.selectedIndex === index));
  card.setAttribute("aria-label", `Pilih kartu ${index + 1}`);

  if (state.selectedIndex === index) card.classList.add("selected");
  if (state.revealed) {
    card.classList.add("locked", option.correct ? "correct" : "wrong");
    card.disabled = true;
  }

  const top = document.createElement("div");
  top.className = "card-top";

  const label = document.createElement("div");
  label.className = "card-label";
  label.innerHTML = `<span class="card-number">${index + 1}</span><span>KARTU ${index + 1}</span>`;

  const status = document.createElement("span");
  status.className = "card-status";
  status.textContent = state.revealed
    ? (option.correct ? "KODE BENAR" : "ADA BUG")
    : (state.selectedIndex === index ? "PILIHANMU" : "PILIH");
  top.append(label, status);

  const wrap = document.createElement("div");
  wrap.className = "code-wrap";
  const lines = codeLines(option.code);

  const numbers = document.createElement("pre");
  numbers.className = "line-numbers";
  lines.forEach((_, lineIndex) => {
    const line = document.createElement("span");
    line.textContent = String(lineIndex + 1).padStart(2, "0");
    numbers.append(line);
  });

  const content = document.createElement("code");
  content.className = "code-content";
  lines.forEach((text) => {
    const line = document.createElement("span");
    line.textContent = text || " ";
    content.append(line);
  });
  wrap.append(numbers, content);

  const explanation = document.createElement("div");
  explanation.className = "card-explanation";
  const mark = document.createElement("span");
  mark.className = "explanation-mark";
  mark.textContent = option.correct ? "✓" : "!";
  const copy = document.createElement("div");
  const heading = document.createElement("strong");
  heading.textContent = option.correct ? "Mengapa ini benar?" : "Letak kesalahannya";
  const detail = document.createElement("span");
  detail.textContent = option.explanation;
  copy.append(heading, detail);
  explanation.append(mark, copy);

  card.append(top, wrap, explanation);
  card.addEventListener("click", () => selectCard(index));
  return card;
}

function renderGame() {
  const question = currentQuestion();
  const empty = !question;
  elements.cardsStack.replaceChildren();
  elements.emptyState.hidden = !empty;
  elements.cardsStack.hidden = empty;
  elements.gameActions.hidden = empty;
  elements.feedback.hidden = !state.revealed || empty;

  elements.questionCount.textContent = state.questions.length;
  elements.bankCount.textContent = `${state.questions.length} soal`;
  elements.roundNumber.textContent = String(state.round).padStart(2, "0");
  elements.scoreValue.textContent = `${state.score}/${state.attempts}`;
  elements.streakValue.textContent = state.streak;

  if (empty) {
    elements.challengeTitle.textContent = "Belum ada kode untuk dibandingkan.";
    elements.challengeSubtitle.textContent = "Buka Bank Soal dan tambahkan satu pasangan kode.";
    elements.languageBadge.textContent = "EMPTY";
    elements.difficultyBadge.textContent = "—";
    return;
  }

  elements.challengeTitle.textContent = question.title;
  elements.challengeSubtitle.textContent = "Satu kartu valid, kartu lainnya menyimpan perbedaan yang bisa sangat kecil.";
  elements.languageBadge.textContent = question.language.toUpperCase();
  elements.difficultyBadge.textContent = question.difficulty.toUpperCase();

  state.options.forEach((option, index) => {
    elements.cardsStack.append(createCodeCard(option, index));
  });

  elements.revealButton.disabled = state.selectedIndex === null && !state.revealed;
  elements.revealLabel.textContent = state.revealed ? "Soal Berikutnya" : "Buka Jawaban";
  elements.skipButton.hidden = state.revealed;

  if (state.revealed) {
    const chosen = state.options[state.selectedIndex];
    const correct = Boolean(chosen?.correct);
    elements.feedback.classList.toggle("incorrect", !correct);
    elements.feedbackIcon.textContent = correct ? "✓" : "↺";
    elements.feedbackTitle.textContent = correct ? "Tepat sekali, mata kelincimu tajam!" : "Hampir, bug-nya berhasil bersembunyi.";
    elements.feedbackText.textContent = correct
      ? "Pilihanmu valid. Baca penjelasan tiap kartu untuk menguatkan konsepnya."
      : "Bandingkan kembali kedua kartu dan perhatikan penjelasan kesalahannya.";
  }
}

function selectCard(index) {
  if (state.revealed) return;
  state.selectedIndex = index;
  renderGame();
}

function revealAnswer() {
  if (state.revealed) {
    startRound(true);
    return;
  }
  if (state.selectedIndex === null) return;

  state.revealed = true;
  state.attempts += 1;
  if (state.options[state.selectedIndex].correct) {
    state.score += 1;
    state.streak += 1;
  } else {
    state.streak = 0;
  }
  renderGame();
}

function skipQuestion() {
  state.streak = 0;
  startRound(true);
}

function openBankDialog() {
  renderQuestionList();
  elements.bankDialog.showModal();
}

function closeBankDialog() {
  elements.bankDialog.close();
  closeEditor();
}

function renderQuestionList() {
  const query = elements.questionSearch.value.trim().toLowerCase();
  const filtered = state.questions.filter((question) =>
    `${question.title} ${question.language} ${question.difficulty}`.toLowerCase().includes(query)
  );
  elements.questionList.replaceChildren();
  elements.bankCount.textContent = `${filtered.length} dari ${state.questions.length} soal`;

  if (!filtered.length) {
    const empty = document.createElement("div");
    empty.className = "list-empty";
    empty.textContent = query ? "Tidak ada soal yang cocok." : "Bank soal kosong. Tambahkan soal pertama.";
    elements.questionList.append(empty);
    return;
  }

  filtered.forEach((question) => {
    const item = document.createElement("article");
    item.className = `question-item${state.editorId === question.id ? " active" : ""}`;
    item.tabIndex = 0;
    item.dataset.id = question.id;

    const main = document.createElement("div");
    main.className = "question-item-main";
    const title = document.createElement("strong");
    title.textContent = question.title;
    const meta = document.createElement("div");
    meta.className = "question-item-meta";
    const language = document.createElement("span");
    language.className = "item-language";
    language.textContent = question.language;
    const difficulty = document.createElement("span");
    difficulty.textContent = question.difficulty;
    meta.append(language, difficulty);
    main.append(title, meta);

    const actions = document.createElement("div");
    actions.className = "item-actions";
    const edit = document.createElement("button");
    edit.type = "button";
    edit.title = "Edit soal";
    edit.setAttribute("aria-label", `Edit ${question.title}`);
    edit.textContent = "✎";
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "delete-item";
    remove.title = "Hapus soal";
    remove.setAttribute("aria-label", `Hapus ${question.title}`);
    remove.textContent = "×";

    edit.addEventListener("click", (event) => {
      event.stopPropagation();
      openEditor(question.id);
    });
    remove.addEventListener("click", (event) => {
      event.stopPropagation();
      requestDelete(question.id);
    });
    item.addEventListener("click", () => openEditor(question.id));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") openEditor(question.id);
    });
    actions.append(edit, remove);
    item.append(main, actions);
    elements.questionList.append(item);
  });
}

function openEditor(id = null) {
  state.editorId = id;
  elements.editorPlaceholder.hidden = true;
  elements.questionForm.hidden = false;
  elements.questionForm.reset();

  if (id) {
    const question = state.questions.find((item) => item.id === id);
    if (!question) return;
    elements.formTitle.textContent = "Edit Soal";
    elements.questionId.value = question.id;
    elements.titleInput.value = question.title;
    elements.languageInput.value = question.language;
    elements.difficultyInput.value = question.difficulty;
    elements.correctCodeInput.value = question.correctCode;
    elements.wrongCodeInput.value = question.wrongCode;
    elements.correctExplanationInput.value = question.correctExplanation;
    elements.wrongExplanationInput.value = question.wrongExplanation;
  } else {
    elements.formTitle.textContent = "Tambah Soal";
    elements.questionId.value = "";
    elements.languageInput.value = "HTML";
    elements.difficultyInput.value = "Mudah";
  }
  renderQuestionList();
  requestAnimationFrame(() => elements.titleInput.focus());
}

function closeEditor() {
  state.editorId = null;
  elements.questionForm.hidden = true;
  elements.editorPlaceholder.hidden = false;
  elements.questionForm.reset();
  renderQuestionList();
}

function questionFromForm() {
  return {
    id: elements.questionId.value || `question-${Date.now()}`,
    title: elements.titleInput.value.trim(),
    language: elements.languageInput.value,
    difficulty: elements.difficultyInput.value,
    correctCode: elements.correctCodeInput.value.trim(),
    wrongCode: elements.wrongCodeInput.value.trim(),
    correctExplanation: elements.correctExplanationInput.value.trim(),
    wrongExplanation: elements.wrongExplanationInput.value.trim(),
  };
}

function saveQuestion(event) {
  event.preventDefault();
  const question = questionFromForm();
  const index = state.questions.findIndex((item) => item.id === question.id);
  if (index >= 0) {
    state.questions[index] = question;
  } else {
    state.questions.unshift(question);
  }

  saveQuestions(index >= 0 ? "Perubahan soal tersimpan." : "Soal baru ditambahkan.");
  state.editorId = question.id;
  renderQuestionList();

  if (!state.currentId || state.currentId === question.id) {
    state.currentId = question.id;
    state.options = [
      { code: question.correctCode, correct: true, explanation: question.correctExplanation },
      { code: question.wrongCode, correct: false, explanation: question.wrongExplanation },
    ].sort(() => Math.random() - 0.5);
    state.selectedIndex = null;
    state.revealed = false;
    renderGame();
  }
}

function requestDelete(id) {
  const question = state.questions.find((item) => item.id === id);
  if (!question) return;
  state.pendingDeleteId = id;
  elements.confirmText.textContent = `“${question.title}” akan dihapus dari bank soal lokal.`;
  elements.confirmDialog.showModal();
}

function deleteQuestion() {
  const id = state.pendingDeleteId;
  if (!id) return;
  state.questions = state.questions.filter((question) => question.id !== id);
  if (state.editorId === id) closeEditor();
  saveQuestions("Soal dihapus.");
  renderQuestionList();

  if (state.currentId === id) {
    state.currentId = null;
    startRound(false);
  } else {
    renderGame();
  }
  state.pendingDeleteId = null;
}

function resetQuestions() {
  if (!window.confirm("Pulihkan delapan soal bawaan? Soal buatanmu akan diganti.")) return;
  state.questions = cloneDefaults();
  state.round = 1;
  state.score = 0;
  state.attempts = 0;
  state.streak = 0;
  closeEditor();
  saveQuestions("Bank soal bawaan dipulihkan.");
  renderQuestionList();
  startRound(false);
}

function exportQuestions() {
  const blob = new Blob([JSON.stringify(state.questions, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "coding-bunny-bank-soal.json";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  showToast("Bank soal diekspor sebagai JSON.");
}

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("visible");
  toastTimer = setTimeout(() => elements.toast.classList.remove("visible"), 2400);
}

elements.themeToggle.addEventListener("click", toggleTheme);
elements.openBank.addEventListener("click", openBankDialog);
elements.closeBank.addEventListener("click", closeBankDialog);
elements.emptyAddButton.addEventListener("click", () => {
  openBankDialog();
  openEditor();
});
elements.addQuestion.addEventListener("click", () => openEditor());
elements.cancelEdit.addEventListener("click", closeEditor);
elements.questionSearch.addEventListener("input", renderQuestionList);
elements.questionForm.addEventListener("submit", saveQuestion);
elements.exportQuestions.addEventListener("click", exportQuestions);
elements.resetQuestions.addEventListener("click", resetQuestions);
elements.confirmDelete.addEventListener("click", deleteQuestion);
elements.revealButton.addEventListener("click", revealAnswer);
elements.skipButton.addEventListener("click", skipQuestion);

elements.bankDialog.addEventListener("click", (event) => {
  if (event.target === elements.bankDialog) closeBankDialog();
});

document.addEventListener("keydown", (event) => {
  if (elements.bankDialog.open || elements.confirmDialog.open) return;
  if (event.key === "1") selectCard(0);
  if (event.key === "2") selectCard(1);
  if (event.key === "Enter" && !elements.revealButton.disabled) revealAnswer();
  if (event.key.toLowerCase() === "b") openBankDialog();
});

initializeTheme();
loadQuestions();
saveQuestions("");
startRound(false);
