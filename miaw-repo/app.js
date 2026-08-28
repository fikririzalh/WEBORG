(() => {
  'use strict';

  const STORAGE = {
    theme: 'miawRepo.theme',
    read: 'miawRepo.readModules',
    best: 'miawRepo.bestScore'
  };

  const MODULES = [
    {
      id: 'fundamental', icon: '🧭', title: 'Git, GitHub, dan Repository', short: 'Pahami peta kerja sebelum mengetik perintah.',
      summary: 'Git mencatat riwayat proyek pada komputermu. GitHub menyimpan repository Git secara daring dan menambahkan sarana kolaborasi seperti issue, pull request, review, dan ruleset.',
      objective: 'Setelah modul ini, kamu dapat membedakan working directory, staging area, commit lokal, branch, dan remote repository.',
      concepts: [
        ['Working directory', 'File yang sedang kamu lihat dan ubah pada folder proyek.'],
        ['Staging area', 'Daftar perubahan yang dipilih untuk masuk ke commit berikutnya.'],
        ['Commit', 'Snapshot perubahan beserta identitas, waktu, dan pesan yang menjelaskan maksudnya.'],
        ['Branch', 'Jalur pengembangan paralel yang memungkinkan pekerjaan terisolasi dari main.'],
        ['Remote', 'Referensi ke repository lain, biasanya repository GitHub bernama origin.'],
        ['Pull request', 'Usulan untuk meninjau dan menggabungkan perubahan antar-branch.']
      ],
      blocks: [
        {title: 'Model mental tiga lapis', body: '<p>Alur dasar Git bergerak dari file kerja ke staging area, lalu menjadi commit lokal. Commit baru berpindah ke GitHub setelah kamu melakukan <code>push</code>.</p><ol><li>Ubah file pada working directory.</li><li>Periksa perubahan dengan <code>git status</code> dan <code>git diff</code>.</li><li>Pilih perubahan menggunakan <code>git add</code>.</li><li>Simpan snapshot menggunakan <code>git commit</code>.</li><li>Kirim commit ke remote menggunakan <code>git push</code>.</li></ol>'},
        {title: 'Konfigurasi identitas awal', body: '<p>Git menempelkan nama dan email pada commit. Gunakan identitas yang memang ingin kamu tampilkan dalam riwayat proyek.</p>', code: 'git config --global user.name "Nama Kamu"\ngit config --global user.email "email@example.com"\ngit config --global --list', note: ['tip', 'Perintah dengan opsi --global berlaku untuk pengguna pada komputer tersebut. Hilangkan --global jika satu repository memerlukan identitas berbeda.']},
        {title: 'Git bukan penyimpanan otomatis', body: '<p>Menyimpan file di editor tidak otomatis membuat commit, dan membuat commit tidak otomatis mengirimnya ke GitHub. Setiap lapis memiliki tindakan yang berbeda.</p>', note: ['warning', 'Jangan menaruh token, kata sandi, private key, atau isi file .env ke dalam commit. Menghapusnya pada commit berikutnya tidak otomatis menghapusnya dari riwayat lama.']}
      ],
      checklist: ['Saya tahu lokasi folder proyek.', 'Nama dan email Git sudah benar.', 'Saya dapat menjelaskan add, commit, dan push.', 'Saya tidak menyamakan Git dengan GitHub.'],
      sources: [
        ['GitHub Docs: About Git', 'https://docs.github.com/en/get-started/using-git/about-git'],
        ['GitHub Glossary', 'https://docs.github.com/en/get-started/learning-about-github/github-glossary']
      ]
    },
    {
      id: 'create', icon: '📦', title: 'Membuat dan Menghubungkan Repo', short: 'Pilih alur awal yang sesuai keadaan proyek.',
      summary: 'Repo baru dapat dimulai dari GitHub lalu di-clone, atau dimulai dari folder lokal lalu dihubungkan ke remote kosong. Jangan mencampur dua riwayat awal tanpa memahami konsekuensinya.',
      objective: 'Setelah modul ini, kamu dapat memilih alur repo baru yang aman dan menghubungkan proyek lokal ke GitHub.',
      concepts: [
        ['README', 'Halaman depan proyek yang menjelaskan tujuan, cara menjalankan, dan aturan kontribusi.'],
        ['.gitignore', 'Aturan file atau folder yang tidak perlu dilacak Git.'],
        ['License', 'Izin hukum tentang bagaimana orang lain boleh menggunakan karya.'],
        ['origin', 'Nama konvensional untuk remote utama hasil clone atau remote yang ditambahkan.']
      ],
      blocks: [
        {title: 'Alur A: mulai dari GitHub', body: '<p>Pilih alur ini ketika proyek belum ada di komputer. Buat repository di GitHub, tambahkan README bila diperlukan, lalu clone agar riwayat lokal sama dengan remote sejak awal.</p>', code: 'git clone https://github.com/USERNAME/REPOSITORY.git\ncd REPOSITORY\ngit status'},
        {title: 'Alur B: folder lokal sudah berisi proyek', body: '<p>Buat repository GitHub yang benar-benar kosong, tanpa README, license, atau .gitignore. Setelah itu inisialisasi proyek lokal dan hubungkan keduanya.</p>', code: 'cd nama-proyek\ngit init -b main\ngit add .\ngit commit -m "chore: initial commit"\ngit remote add origin https://github.com/USERNAME/REPOSITORY.git\ngit push -u origin main'},
        {title: 'Periksa hubungan remote', body: '<p><code>git remote -v</code> menampilkan alamat yang digunakan untuk mengambil dan mengirim perubahan. Opsi <code>-u</code> pada push pertama menetapkan upstream sehingga push berikutnya dapat lebih singkat.</p>', code: 'git remote -v\ngit branch -vv', note: ['warning', 'Jika repo GitHub dan folder lokal sama-sama sudah memiliki commit awal yang berbeda, push dapat ditolak. Tentukan satu sumber awal dan sinkronkan secara sadar, bukan memaksa dengan force push.']}
      ],
      checklist: ['Nama repo singkat dan jelas.', 'Visibility public/private sudah benar.', 'README menjelaskan proyek.', '.gitignore sesuai teknologi.', 'Remote origin menunjuk repo yang benar.'],
      sources: [
        ['Quickstart for repositories', 'https://docs.github.com/en/repositories/creating-and-managing-repositories/quickstart-for-repositories'],
        ['Create a repository', 'https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository'],
        ['Manage remote repositories', 'https://docs.github.com/en/get-started/git-basics/managing-remote-repositories']
      ]
    },
    {
      id: 'commit', icon: '📝', title: 'Status, Staging, dan Commit', short: 'Simpan perubahan yang terpilih dan dapat dijelaskan.',
      summary: 'Commit yang baik bukan sekadar cadangan. Ia merupakan unit perubahan yang logis, cukup kecil untuk ditinjau, dan memiliki pesan yang menjelaskan tujuan.',
      objective: 'Setelah modul ini, kamu dapat memeriksa perubahan, memilih file yang tepat, membuat commit fokus, dan menghindari file sensitif.',
      concepts: [
        ['Untracked', 'File baru yang belum pernah ditambahkan ke pelacakan Git.'],
        ['Modified', 'File terlacak yang isinya berubah sejak commit terakhir.'],
        ['Staged', 'Versi perubahan yang sudah dipilih untuk commit berikutnya.'],
        ['Clean', 'Tidak ada perubahan working directory atau staging area yang menunggu.']
      ],
      blocks: [
        {title: 'Siklus pemeriksaan', body: '<p>Periksa sebelum menambahkan, periksa lagi sebelum commit. Kebiasaan ini mencegah file sementara atau perubahan di luar cakupan ikut tersimpan.</p>', code: 'git status\ngit diff\ngit add README.md src/app.js\ngit diff --staged\ngit commit -m "feat: add repository search"'},
        {title: 'Pesan commit yang informatif', body: '<p>Gunakan kata kerja dan sebutkan maksud perubahan. Pesan seperti <code>fix: prevent duplicate submit</code> lebih mudah dipahami daripada <code>update</code> atau <code>final</code>.</p><ul><li><code>feat:</code> kemampuan baru.</li><li><code>fix:</code> perbaikan bug.</li><li><code>docs:</code> perubahan dokumentasi.</li><li><code>refactor:</code> perubahan struktur tanpa mengubah perilaku yang dimaksud.</li><li><code>test:</code> perubahan pengujian.</li></ul>'},
        {title: 'Membatalkan staging dengan aman', body: '<p>Jika file terlanjur masuk staging tetapi belum ingin di-commit, keluarkan dari staging tanpa menghapus perubahan pada file.</p>', code: 'git restore --staged nama-file\ngit status', note: ['warning', 'git restore nama-file dapat membuang perubahan lokal yang belum di-commit. Periksa status dan diff sebelum menggunakannya.']}
      ],
      checklist: ['Status sudah diperiksa.', 'Diff sesuai tujuan commit.', 'Tidak ada secret atau file build.', 'Pesan commit menjelaskan maksud.', 'Satu commit memiliki satu fokus logis.'],
      sources: [
        ['Using Git on GitHub Docs', 'https://docs.github.com/en/contributing/collaborating-on-github-docs/using-git-on-github-docs'],
        ['Ignoring files', 'https://docs.github.com/en/get-started/git-basics/ignoring-files'],
        ['Storing secrets safely', 'https://docs.github.com/en/get-started/learning-to-code/storing-your-secrets-safely']
      ]
    },
    {
      id: 'branch', icon: '🌿', title: 'Branch, Merge, dan Conflict', short: 'Pisahkan pekerjaan dan gabungkan secara terkendali.',
      summary: 'Branch memberi ruang aman untuk mengembangkan fitur atau memperbaiki bug tanpa langsung mengubah main. Setelah perubahan siap, branch dapat ditinjau dan digabungkan.',
      objective: 'Setelah modul ini, kamu dapat membuat branch, berpindah branch, menggabungkan perubahan, dan memahami penyebab conflict.',
      concepts: [
        ['main', 'Branch utama yang biasanya mewakili keadaan stabil proyek.'],
        ['Feature branch', 'Branch sementara untuk satu fitur, bug, atau pekerjaan terfokus.'],
        ['Merge', 'Menggabungkan riwayat suatu branch ke branch lain.'],
        ['Conflict', 'Keadaan ketika Git memerlukan keputusan manusia tentang hasil akhir perubahan.']
      ],
      blocks: [
        {title: 'Alur branch sederhana', body: '<p>Mulai dari main yang sudah sinkron. Buat branch dengan nama yang menjelaskan pekerjaan, commit di sana, lalu ajukan pull request.</p>', code: 'git switch main\ngit pull\ngit switch -c feat/profile-card\n# ubah file, lalu commit\ngit push -u origin feat/profile-card'},
        {title: 'Merge lokal dan pembersihan', body: '<p>Untuk latihan lokal, pindah ke branch tujuan sebelum merge. Hapus feature branch hanya setelah perubahan sudah tergabung dan tidak lagi diperlukan.</p>', code: 'git switch main\ngit merge feat/profile-card\ngit branch -d feat/profile-card'},
        {title: 'Menghadapi merge conflict', body: '<p>Conflict sering muncul ketika branch mengubah baris yang sama, atau satu branch menghapus file yang diubah branch lain. Baca penanda conflict, pilih isi final, uji hasilnya, lalu stage dan commit resolusi.</p>', code: 'git status\n# edit file yang berkonflik\ngit add nama-file\ngit commit -m "fix: resolve merge conflict"', note: ['tip', 'Jangan memilih “ours” atau “theirs” secara buta. Hasil final dapat memerlukan gabungan logika dari kedua perubahan.']}
      ],
      checklist: ['Main sudah diperbarui sebelum mulai.', 'Nama branch menjelaskan pekerjaan.', 'Perubahan pada branch tetap terfokus.', 'Hasil conflict sudah diuji.', 'Branch lama dibersihkan setelah merge.'],
      sources: [
        ['Branches', 'https://docs.github.com/en/pull-requests/reference/branches'],
        ['Resolve conflict with command line', 'https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/resolving-a-merge-conflict-using-the-command-line']
      ]
    },
    {
      id: 'remote', icon: '☁️', title: 'Clone, Fetch, Pull, dan Push', short: 'Sinkronkan lokal dan remote tanpa menimpa riwayat.',
      summary: 'Remote workflow menghubungkan pekerjaan lokal dengan GitHub. Fetch mengambil informasi tanpa langsung menggabungkannya, pull memperbarui branch lokal, sedangkan push mengirim commit lokal.',
      objective: 'Setelah modul ini, kamu dapat memilih clone, fetch, pull, atau push berdasarkan keadaan repo.',
      concepts: [
        ['clone', 'Membuat salinan lokal lengkap dari repository remote.'],
        ['fetch', 'Mengambil commit dan referensi remote tanpa menggabungkannya ke branch aktif.'],
        ['pull', 'Mengambil pembaruan lalu mengintegrasikannya ke branch lokal.'],
        ['push', 'Mengirim commit lokal ke branch remote.']
      ],
      blocks: [
        {title: 'Lihat sebelum menggabungkan', body: '<p><code>fetch</code> berguna ketika kamu ingin memeriksa pembaruan remote lebih dahulu. Setelah fetch, bandingkan branch lokal dengan referensi remote.</p>', code: 'git fetch origin\ngit log --oneline --graph --decorate --all\ngit diff main..origin/main'},
        {title: 'Perbarui dan kirim branch', body: '<p>Pull digunakan ketika pembaruan remote memang perlu masuk ke branch aktif. Push pertama sebuah branch lazimnya memakai <code>-u</code> agar hubungan upstream tersimpan.</p>', code: 'git switch main\ngit pull origin main\ngit switch feat/search\ngit push -u origin feat/search'},
        {title: 'Push ditolak non-fast-forward', body: '<p>Penolakan ini melindungi commit remote yang belum ada pada lokal. Ambil dan integrasikan pembaruan tersebut, selesaikan conflict bila ada, lalu push kembali.</p>', code: 'git fetch origin\ngit pull origin main\n# selesaikan conflict jika muncul\ngit push origin main', note: ['warning', 'Hindari force push ke branch bersama. Ia dapat menulis ulang riwayat dan menghilangkan commit orang lain dari referensi branch.']}
      ],
      checklist: ['Remote yang dituju sudah diverifikasi.', 'Branch aktif sudah benar.', 'Perubahan lokal sudah di-commit atau diamankan.', 'Pembaruan remote sudah diperiksa.', 'Tidak menggunakan force push tanpa alasan dan koordinasi.'],
      sources: [
        ['Get changes from a remote', 'https://docs.github.com/en/get-started/using-git/getting-changes-from-a-remote-repository'],
        ['Push commits to a remote', 'https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository'],
        ['Non-fast-forward errors', 'https://docs.github.com/en/get-started/using-git/dealing-with-non-fast-forward-errors']
      ]
    },
    {
      id: 'collaborate', icon: '🤝', title: 'Issue, Pull Request, dan Review', short: 'Ubah pekerjaan individual menjadi kolaborasi terlacak.',
      summary: 'Issue membantu mendefinisikan pekerjaan. Pull request mengusulkan perubahan dari compare branch ke base branch, menyediakan diff, diskusi, review, pemeriksaan otomatis, dan keputusan merge.',
      objective: 'Setelah modul ini, kamu dapat menghubungkan issue, branch, commit, pull request, review, dan merge sebagai satu alur.',
      concepts: [
        ['Issue', 'Catatan pekerjaan, bug, ide, atau keputusan yang perlu dilacak.'],
        ['Base branch', 'Branch tujuan penerima perubahan, biasanya main.'],
        ['Compare branch', 'Branch sumber yang berisi perubahan yang diajukan.'],
        ['Review', 'Pemeriksaan diff yang dapat menghasilkan komentar, approval, atau request changes.']
      ],
      blocks: [
        {title: 'GitHub Flow ringkas', body: '<ol><li>Buat issue atau pahami kebutuhan.</li><li>Buat branch dari main.</li><li>Buat commit kecil dan push branch.</li><li>Buka pull request ke main.</li><li>Jelaskan tujuan, perubahan, dan cara menguji.</li><li>Tanggapi review dan pastikan checks lulus.</li><li>Merge, lalu sinkronkan main dan hapus branch lama.</li></ol>'},
        {title: 'Hubungkan pull request dengan issue', body: '<p>Kata kunci penutup pada deskripsi pull request dapat menutup issue secara otomatis ketika PR di-merge ke default branch.</p>', code: 'Ringkasan perubahan...\n\nCloses #17\n\nCara uji:\n1. ...\n2. ...'},
        {title: 'Review dan perlindungan main', body: '<p>PR yang kecil dan fokus lebih mudah diperiksa. Repository dapat mewajibkan review atau status check sebelum merge melalui aturan perlindungan branch atau ruleset.</p>', note: ['warning', 'Jangan menyalin token ke issue, komentar, commit, atau pull request. Jika secret sudah terpublikasi, segera cabut atau rotasi kredensial sebelum menangani riwayat Git.']}
      ],
      checklist: ['Issue atau tujuan perubahan jelas.', 'Base dan compare branch tidak tertukar.', 'PR kecil dan terfokus.', 'Deskripsi memuat cara menguji.', 'Review dan checks selesai sebelum merge.', 'Secret tidak pernah masuk riwayat.'],
      sources: [
        ['GitHub Flow', 'https://docs.github.com/en/get-started/using-github/github-flow'],
        ['About pull requests', 'https://docs.github.com/en/pull-requests/get-started/about-pull-requests'],
        ['Link PR to an issue', 'https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue'],
        ['Repository best practices', 'https://docs.github.com/en/repositories/creating-and-managing-repositories/best-practices-for-repositories']
      ]
    }
  ];

  const QUIZ_BANK = [
    {topic:'Dasar', situation:'Kamu menyimpan perubahan pada editor, tetapi belum menjalankan perintah Git.', q:'Di mana perubahan itu berada?', options:['Working directory','Staging area','Remote repository','Pull request'], answer:'Working directory', explain:'Menyimpan file hanya mengubah working directory. git add diperlukan untuk memasukkannya ke staging area.'},
    {topic:'Dasar', situation:'Kamu sudah membuat commit lokal, tetapi GitHub belum menampilkan perubahan.', q:'Tindakan yang masih diperlukan adalah...', options:['git push','git add','git init','git status'], answer:'git push', explain:'Commit tersimpan lokal. Push mengirim commit lokal ke remote.'},
    {topic:'Dasar', situation:'Tim ingin mengembangkan fitur tanpa langsung mengubah main.', q:'Fitur Git yang paling tepat adalah...', options:['Branch','Tag','Staging area','README'], answer:'Branch', explain:'Branch menyediakan jalur pengembangan paralel yang terisolasi dari main.'},
    {topic:'Dasar', situation:'Seorang anggota menyebut Git dan GitHub sebagai hal yang sama.', q:'Pernyataan yang paling tepat adalah...', options:['Git adalah version control, GitHub adalah platform hosting dan kolaborasi repository Git','Git hanya bekerja jika terhubung ke GitHub','GitHub adalah nama lain dari commit','Git adalah fitur untuk membuka pull request'], answer:'Git adalah version control, GitHub adalah platform hosting dan kolaborasi repository Git', explain:'Git bekerja secara lokal sebagai DVCS. GitHub menambahkan hosting dan fitur kolaborasi.'},
    {topic:'Dasar', situation:'Kamu ingin melihat identitas yang akan ditempelkan ke commit.', q:'Perintah pemeriksaan yang sesuai adalah...', options:['git config --list','git remote -v','git branch -d','git push'], answer:'git config --list', explain:'git config --list menampilkan konfigurasi Git, termasuk nama dan email.'},

    {topic:'Membuat Repo', situation:'Proyek belum ada di komputer. Repo sudah dibuat di GitHub dengan README.', q:'Langkah lokal awal yang paling tepat adalah...', options:['git clone URL_REPO','git init lalu force push','git add origin','git merge README'], answer:'git clone URL_REPO', explain:'Clone membuat salinan lokal dengan riwayat yang sama dengan remote.'},
    {topic:'Membuat Repo', situation:'Folder lokal sudah berisi aplikasi, sedangkan repo GitHub akan dibuat sebagai tujuan pertama.', q:'Konfigurasi GitHub yang paling aman adalah...', options:['Buat repo kosong tanpa commit awal','Tambahkan README dan license agar ada dua riwayat','Aktifkan force push','Buat dua branch main terpisah'], answer:'Buat repo kosong tanpa commit awal', explain:'Repo remote kosong mencegah dua commit awal independen yang perlu direkonsiliasi.'},
    {topic:'Membuat Repo', situation:'Kamu ingin memastikan origin menunjuk repository yang benar.', q:'Perintah yang digunakan adalah...', options:['git remote -v','git status --remote','git origin show','git repo -v'], answer:'git remote -v', explain:'Perintah ini menampilkan URL fetch dan push untuk setiap remote.'},
    {topic:'Membuat Repo', situation:'File node_modules dan .env tidak boleh masuk commit.', q:'Berkas aturan yang perlu dibuat adalah...', options:['.gitignore','README.md','LICENSE','remote.txt'], answer:'.gitignore', explain:'.gitignore memberi tahu Git pola file dan folder yang tidak perlu dilacak.'},
    {topic:'Membuat Repo', situation:'Push pertama branch main perlu menetapkan upstream.', q:'Perintah yang sesuai adalah...', options:['git push -u origin main','git push --all --force','git remote main origin','git upstream add main'], answer:'git push -u origin main', explain:'-u menetapkan origin/main sebagai upstream branch lokal main.'},

    {topic:'Commit', situation:'git status menampilkan tiga file berubah, tetapi hanya README yang terkait tugas saat ini.', q:'Tindakan paling fokus adalah...', options:['git add README.md lalu commit','git add . agar semuanya cepat selesai','Hapus dua file lainnya','Langsung git push'], answer:'git add README.md lalu commit', explain:'Stage hanya perubahan yang terkait agar commit tetap fokus.'},
    {topic:'Commit', situation:'File sudah staged, tetapi kamu ingin memeriksa versi yang akan masuk commit.', q:'Perintah yang tepat adalah...', options:['git diff --staged','git diff origin','git show --remote','git status --push'], answer:'git diff --staged', explain:'Perintah tersebut menampilkan perubahan pada staging area terhadap commit terakhir.'},
    {topic:'Commit', situation:'config.env terlanjur di-stage tetapi belum di-commit.', q:'Cara mengeluarkannya dari staging tanpa menghapus isi file adalah...', options:['git restore --staged config.env','git restore config.env','git clean -f config.env','git reset --hard'], answer:'git restore --staged config.env', explain:'Opsi --staged memindahkan file keluar dari staging sambil mempertahankan perubahan lokal.'},
    {topic:'Commit', situation:'Kamu memperbaiki validasi submit ganda.', q:'Pesan commit yang paling informatif adalah...', options:['fix: prevent duplicate form submission','update','final terbaru','ubah kode'], answer:'fix: prevent duplicate form submission', explain:'Pesan menyebut jenis dan tujuan perubahan secara spesifik.'},
    {topic:'Commit', situation:'Token API masuk ke commit dan sudah didorong ke repository publik.', q:'Tindakan pertama yang paling penting adalah...', options:['Cabut atau rotasi token','Tambahkan token ke .gitignore saja','Hapus file pada commit berikutnya dan selesai','Ubah nama file token'], answer:'Cabut atau rotasi token', explain:'Secret dianggap bocor setelah dipublikasikan. Rotasi kredensial harus diprioritaskan.'},

    {topic:'Branch', situation:'Kamu berada di main dan akan mengerjakan halaman profil.', q:'Perintah yang langsung membuat sekaligus berpindah branch adalah...', options:['git switch -c feat/profile','git branch main feat/profile','git merge feat/profile','git push feat/profile'], answer:'git switch -c feat/profile', explain:'git switch -c membuat branch baru dan mengaktifkannya.'},
    {topic:'Branch', situation:'Feature branch sudah di-merge dan tidak diperlukan lagi secara lokal.', q:'Perintah penghapusan aman adalah...', options:['git branch -d feat/profile','git branch -D main','git reset --hard feat/profile','git clean feat/profile'], answer:'git branch -d feat/profile', explain:'-d menolak penghapusan jika branch belum tergabung sehingga lebih aman daripada -D.'},
    {topic:'Branch', situation:'Dua branch mengubah baris yang sama dengan isi berbeda.', q:'Apa yang kemungkinan terjadi saat merge?', options:['Merge conflict','Git otomatis memilih commit terbaru','Semua file dihapus','Remote dibuat ulang'], answer:'Merge conflict', explain:'Perubahan yang bersaing pada lokasi sama dapat memerlukan keputusan manusia.'},
    {topic:'Branch', situation:'Conflict marker masih ada pada file setelah kamu memilih isi final.', q:'Urutan penyelesaian berikutnya adalah...', options:['Uji hasil, git add, lalu commit','Langsung force push','Hapus folder .git','Buat repository baru'], answer:'Uji hasil, git add, lalu commit', explain:'Resolusi perlu diuji, di-stage, lalu disimpan sebagai commit.'},
    {topic:'Branch', situation:'Kamu hendak menggabungkan feature branch secara lokal ke main.', q:'Branch mana yang harus aktif sebelum git merge feat/search?', options:['main','feat/search','origin','Tidak ada branch'], answer:'main', explain:'Merge memasukkan branch yang disebut ke branch yang sedang aktif.'},

    {topic:'Remote', situation:'Kamu ingin melihat pembaruan remote tanpa langsung menggabungkannya.', q:'Perintah yang paling tepat adalah...', options:['git fetch origin','git pull origin main','git push origin main','git clone .'], answer:'git fetch origin', explain:'Fetch mengambil referensi dan commit remote tanpa menggabungkannya ke branch aktif.'},
    {topic:'Remote', situation:'Push ditolak karena non-fast-forward.', q:'Makna keadaan tersebut adalah...', options:['Remote memiliki commit yang belum ada di lokal','Password Git rusak','Staging area kosong','Branch lokal tidak memiliki nama'], answer:'Remote memiliki commit yang belum ada di lokal', explain:'Git menolak push untuk mencegah riwayat remote tertimpa.'},
    {topic:'Remote', situation:'Branch lokal baru belum memiliki pasangan pada remote.', q:'Perintah publikasi awal yang sesuai adalah...', options:['git push -u origin nama-branch','git fetch -u nama-branch','git init origin nama-branch','git merge --publish'], answer:'git push -u origin nama-branch', explain:'Perintah ini mengirim branch sekaligus menetapkan upstream.'},
    {topic:'Remote', situation:'Kamu baru bergabung dan perlu salinan lengkap repository.', q:'Perintah yang sesuai adalah...', options:['git clone URL_REPO','git fetch tanpa repo lokal','git add URL_REPO','git commit URL_REPO'], answer:'git clone URL_REPO', explain:'Clone membuat repository lokal beserta riwayat dan konfigurasi origin.'},
    {topic:'Remote', situation:'Kamu hendak force push ke main untuk mengatasi penolakan.', q:'Penilaian yang paling tepat adalah...', options:['Berisiko menulis ulang riwayat bersama; sinkronkan perubahan lebih dahulu','Selalu aman jika commit lokal lebih baru','Wajib dilakukan pada setiap conflict','Sama dengan git fetch'], answer:'Berisiko menulis ulang riwayat bersama; sinkronkan perubahan lebih dahulu', explain:'Force push dapat menghilangkan commit dari referensi branch bersama.'},

    {topic:'Kolaborasi', situation:'Perubahan berada di feat/search dan ingin diajukan ke main.', q:'Konfigurasi pull request yang benar adalah...', options:['base: main, compare: feat/search','base: feat/search, compare: main','base dan compare sama-sama main','Hapus feat/search sebelum membuat PR'], answer:'base: main, compare: feat/search', explain:'Base menerima perubahan, compare menyediakan perubahan.'},
    {topic:'Kolaborasi', situation:'PR memperbaiki issue #17 dan harus menutupnya ketika merge.', q:'Teks yang dapat ditempatkan pada deskripsi PR adalah...', options:['Closes #17','Open #17','Commit #17','Branch #17'], answer:'Closes #17', explain:'Kata kunci penutup yang didukung dapat menghubungkan PR dan menutup issue setelah merge.'},
    {topic:'Kolaborasi', situation:'Reviewer meminta perubahan pada pull request.', q:'Tindakan yang tepat adalah...', options:['Perbaiki pada branch yang sama, commit, lalu push','Tutup PR dan hapus repository','Edit langsung main tanpa review','Buat akun GitHub baru'], answer:'Perbaiki pada branch yang sama, commit, lalu push', explain:'Commit baru pada compare branch otomatis memperbarui pull request.'},
    {topic:'Kolaborasi', situation:'Tim ingin main hanya menerima perubahan setelah review dan checks lulus.', q:'Fitur yang sesuai adalah...', options:['Protected branch atau ruleset','Menghapus branch main','Menyimpan token di README','Menonaktifkan pull request'], answer:'Protected branch atau ruleset', explain:'Aturan branch dapat mewajibkan review dan status checks sebelum merge.'},
    {topic:'Kolaborasi', situation:'PR berisi 2.000 baris perubahan untuk lima tujuan yang tidak berkaitan.', q:'Perbaikan proses yang paling rasional adalah...', options:['Pecah menjadi PR kecil berdasarkan tujuan','Tambahkan lebih banyak reviewer tanpa mengubah PR','Hapus deskripsi PR','Merge tanpa membaca agar cepat'], answer:'Pecah menjadi PR kecil berdasarkan tujuan', explain:'PR kecil dan fokus lebih mudah dipahami, diuji, serta direview.'}
  ];

  const SCENARIOS = [
    {
      id:'new-local', title:'Proyek Lokal Menjadi Repo GitHub', brief:'Folder miaw-notes sudah berisi HTML, CSS, dan JS. Belum ada repository Git maupun remote GitHub.',
      initial:{repository:'Belum dibuat',initialized:false,branch:'-',staged:'0 file',commits:0,remote:'Belum terhubung',remoteBranch:'-',issue:'-',pr:'-'},
      intro:['[kondisi] folder lokal: miaw-notes/','[kondisi] Git: belum diinisialisasi','[kondisi] GitHub: repository belum ada'],
      steps:[
        {title:'Buat tujuan remote',context:'Proyek lokal sudah memiliki file. Kamu ingin mencegah dua riwayat awal yang berbeda.',options:['Buat repo GitHub kosong bernama miaw-notes','Buat repo dengan README lalu force push lokal','Unggah ZIP sebagai satu-satunya commit tanpa Git','Buat dua repo dengan nama sama'],correct:'Buat repo GitHub kosong bernama miaw-notes',explain:'Remote kosong dapat menerima riwayat awal dari proyek lokal tanpa perlu merekonsiliasi commit awal lain.',patch:{repository:'miaw-notes (remote kosong)'},log:'[web] Repository miaw-notes dibuat tanpa README'},
        {title:'Inisialisasi Git',context:'Kamu berada di folder proyek dan ingin memakai main sebagai branch awal.',options:['git init -b main','git clone .','git push -b main','git remote init main'],correct:'git init -b main',explain:'Perintah ini membuat repository Git lokal dan menetapkan main sebagai branch awal.',patch:{initialized:true,branch:'main'},log:'$ git init -b main\nInitialized empty Git repository'},
        {title:'Pilih perubahan awal',context:'git status menampilkan index.html, styles.css, dan app.js sebagai untracked.',options:['git add index.html styles.css app.js','git push origin main','git merge main','git branch -d main'],correct:'git add index.html styles.css app.js',explain:'git add memilih ketiga file untuk snapshot awal.',patch:{staged:'3 file'},log:'$ git add index.html styles.css app.js\n$ git status\nChanges to be committed: 3 files'},
        {title:'Buat snapshot pertama',context:'Tiga file sudah berada pada staging area.',options:['git commit -m "chore: initial project setup"','git status --delete','git fetch origin','git clean -fd'],correct:'git commit -m "chore: initial project setup"',explain:'Commit menyimpan snapshot staged sebagai riwayat lokal pertama.',patch:{staged:'0 file',commits:1},log:'$ git commit -m "chore: initial project setup"\n[main a1b2c3d] chore: initial project setup'},
        {title:'Hubungkan remote',context:'Repository GitHub tersedia, tetapi repository lokal belum mengenal alamatnya.',options:['git remote add origin https://github.com/user/miaw-notes.git','git push https://github.com/user','git branch origin','git init origin'],correct:'git remote add origin https://github.com/user/miaw-notes.git',explain:'Remote bernama origin sekarang menunjuk repo GitHub tujuan.',patch:{remote:'origin → GitHub'},log:'$ git remote add origin https://github.com/user/miaw-notes.git\n$ git remote -v'},
        {title:'Publikasikan main',context:'Commit lokal siap dikirim dan main belum memiliki upstream.',options:['git push -u origin main','git pull --force origin main','git add origin main','git commit --remote'],correct:'git push -u origin main',explain:'Push mengirim commit dan -u menyimpan hubungan main dengan origin/main.',patch:{remoteBranch:'origin/main'},log:'$ git push -u origin main\nbranch main set up to track origin/main'},
        {title:'Mulai perubahan dokumentasi',context:'README perlu ditambahkan tanpa langsung mengubah main.',options:['git switch -c docs/readme','git branch -D main','git reset --hard origin/main','git remote remove origin'],correct:'git switch -c docs/readme',explain:'Feature branch memisahkan pekerjaan dokumentasi dari main.',patch:{branch:'docs/readme'},log:'$ git switch -c docs/readme\nSwitched to a new branch docs/readme'},
        {title:'Ajukan dan gabungkan perubahan',context:'README sudah di-commit dan branch docs/readme sudah di-push. Review menyatakan perubahan layak.',options:['Buka PR base main ← compare docs/readme, lalu merge','Force push docs/readme ke main','Hapus main lalu ubah nama branch','Download ulang repository'],correct:'Buka PR base main ← compare docs/readme, lalu merge',explain:'Pull request menjaga perubahan dapat dilihat dan ditinjau sebelum masuk main.',patch:{branch:'main',commits:2,remoteBranch:'origin/main',pr:'Merged: docs/readme → main'},log:'[web] Pull request dibuka: main ← docs/readme\n[web] Review approved\n[web] Pull request merged'}
      ]
    },
    {
      id:'issue-fix', title:'Perbaiki Bug dari Issue sampai Merge', brief:'Repo cat-shop sudah ada di GitHub. Issue #17 melaporkan tombol Simpan dapat ditekan dua kali.',
      initial:{repository:'cat-shop (remote)',initialized:false,branch:'-',staged:'0 file',commits:0,remote:'Belum diklon',remoteBranch:'origin/main',issue:'#17 Open',pr:'-'},
      intro:['[web] issue #17: cegah double submit','[kondisi] repository tersedia di GitHub','[kondisi] belum ada salinan lokal'],
      steps:[
        {title:'Ambil repository',context:'Kamu belum memiliki salinan lokal dari cat-shop.',options:['git clone https://github.com/team/cat-shop.git','git init --force cat-shop','git fetch tanpa repository lokal','git add https://github.com/team/cat-shop.git'],correct:'git clone https://github.com/team/cat-shop.git',explain:'Clone membuat salinan lokal lengkap dan mengatur origin.',patch:{initialized:true,branch:'main',remote:'origin → GitHub',commits:8},log:'$ git clone https://github.com/team/cat-shop.git\nCloning into cat-shop...'},
        {title:'Buat ruang kerja bug',context:'Main tidak boleh menerima perubahan yang belum direview.',options:['git switch -c fix/double-submit','git commit -m "fix" pada main','git branch -D main','git push --force origin main'],correct:'git switch -c fix/double-submit',explain:'Branch terfokus mengisolasi perbaikan issue #17.',patch:{branch:'fix/double-submit'},log:'$ git switch -c fix/double-submit'},
        {title:'Periksa perubahan',context:'Kamu menambahkan loading state dan guard isSubmitting pada form.',options:['git status lalu git diff','git clean -fd','git reset --hard','git remote remove origin'],correct:'git status lalu git diff',explain:'Status dan diff memastikan perubahan sesuai issue dan tidak membawa file lain.',patch:{staged:'0 file (2 modified)'},log:'$ git status\nmodified: src/Form.js\nmodified: src/Form.test.js\n$ git diff'},
        {title:'Stage file terkait',context:'Hanya Form.js dan Form.test.js yang berkaitan dengan perbaikan.',options:['git add src/Form.js src/Form.test.js','git add .env','git add node_modules','git push tanpa commit'],correct:'git add src/Form.js src/Form.test.js',explain:'Stage selektif menjaga cakupan commit tetap fokus.',patch:{staged:'2 file'},log:'$ git add src/Form.js src/Form.test.js\n$ git diff --staged'},
        {title:'Simpan perbaikan',context:'Diff staged sudah benar dan tes lokal lulus.',options:['git commit -m "fix: prevent duplicate form submission"','git commit -m "update" --force','git reset --hard HEAD','git merge main --delete'],correct:'git commit -m "fix: prevent duplicate form submission"',explain:'Pesan commit menyebut perilaku yang diperbaiki.',patch:{staged:'0 file',commits:9},log:'$ git commit -m "fix: prevent duplicate form submission"\n[fix/double-submit d4e5f6a] fix: prevent duplicate form submission'},
        {title:'Publikasikan feature branch',context:'Branch ini belum ada pada remote.',options:['git push -u origin fix/double-submit','git push -u origin main','git pull origin fix/double-submit --delete','git remote add fix/double-submit'],correct:'git push -u origin fix/double-submit',explain:'Branch remote dibuat tanpa menyentuh main.',patch:{remoteBranch:'origin/main + origin/fix/double-submit'},log:'$ git push -u origin fix/double-submit'},
        {title:'Buka pull request',context:'Issue harus terlihat terhubung dan tertutup otomatis saat perubahan di-merge.',options:['PR base main ← compare fix/double-submit, tulis Closes #17','PR base fix/double-submit ← compare main','Tutup issue sebelum review tanpa tautan','Force push commit ke main'],correct:'PR base main ← compare fix/double-submit, tulis Closes #17',explain:'Base menerima perubahan. Kata kunci penutup menghubungkan PR ke issue.',patch:{pr:'Open: fix/double-submit → main'},log:'[web] Pull request opened\n[web] Description includes: Closes #17'},
        {title:'Selesaikan workflow',context:'Review disetujui dan seluruh checks lulus.',options:['Merge PR, pull main, lalu hapus branch lama','Hapus repository remote','Force push main dari branch lama','Biarkan issue dan PR terbuka selamanya'],correct:'Merge PR, pull main, lalu hapus branch lama',explain:'Setelah merge, main disinkronkan dan branch sementara dibersihkan. Issue #17 tertutup oleh tautan PR.',patch:{branch:'main',remoteBranch:'origin/main',issue:'#17 Closed',pr:'Merged',commits:10},log:'[web] PR merged; issue #17 closed\n$ git switch main\n$ git pull\n$ git branch -d fix/double-submit'}
      ]
    },
    {
      id:'conflict', title:'Selamatkan Pull Request yang Conflict', brief:'Branch feat/navbar memiliki dua commit. Sementara itu, main berubah pada baris navigasi yang sama.',
      initial:{repository:'miaw-dashboard',initialized:true,branch:'feat/navbar',staged:'0 file',commits:2,remote:'origin → GitHub',remoteBranch:'origin/feat/navbar',issue:'#31 In progress',pr:'Open, conflict'},
      intro:['[kondisi] branch aktif: feat/navbar','[remote] origin/main memiliki commit baru','[web] pull request tidak dapat di-merge karena conflict'],
      steps:[
        {title:'Ambil informasi remote',context:'Kamu ingin melihat pembaruan tanpa langsung mengubah branch aktif.',options:['git fetch origin','git pull --force origin main','git reset --hard origin/main','git push origin main'],correct:'git fetch origin',explain:'Fetch memperbarui referensi remote tanpa langsung menggabungkannya.',patch:{remoteBranch:'origin/main terbaru + origin/feat/navbar'},log:'$ git fetch origin\nFrom github.com/team/miaw-dashboard\n   main updated'},
        {title:'Integrasikan main ke feature branch',context:'Kamu tetap berada pada feat/navbar dan ingin memasukkan keadaan origin/main terbaru.',options:['git merge origin/main','git merge feat/navbar ke feat/navbar','git branch -D main','git push --force origin main'],correct:'git merge origin/main',explain:'Merge memasukkan origin/main ke branch aktif dan memunculkan conflict yang perlu diselesaikan.',patch:{staged:'Conflict: src/Nav.js'},log:'$ git merge origin/main\nCONFLICT (content): Merge conflict in src/Nav.js'},
        {title:'Identifikasi file conflict',context:'Git menghentikan merge agar kamu memilih hasil akhir.',options:['git status','git clean -fd','git remote remove origin','git commit --allow-empty'],correct:'git status',explain:'Status menunjukkan file unmerged dan petunjuk tindakan berikutnya.',patch:{staged:'1 unmerged file'},log:'$ git status\nboth modified: src/Nav.js'},
        {title:'Tentukan isi final',context:'Nav.js memuat penanda <<<<<<<, =======, dan >>>>>>>.',options:['Gabungkan logika yang benar, lalu hapus seluruh penanda conflict','Hapus file tanpa membaca','Pilih sisi lokal untuk semua keadaan','Salin kedua versi beserta penandanya'],correct:'Gabungkan logika yang benar, lalu hapus seluruh penanda conflict',explain:'Resolusi adalah keputusan tentang kode final, bukan sekadar menghapus pesan error.',patch:{staged:'Nav.js resolved, belum staged'},log:'$ editor src/Nav.js\n# conflict markers removed; tests passed'},
        {title:'Tandai conflict selesai',context:'Isi final sudah diuji dan berfungsi.',options:['git add src/Nav.js','git reset --hard','git branch -D feat/navbar','git clone ulang'],correct:'git add src/Nav.js',explain:'Staging file resolved memberi tahu Git bahwa conflict sudah ditangani.',patch:{staged:'1 resolved file'},log:'$ git add src/Nav.js\n$ git status\nAll conflicts fixed but you are still merging'},
        {title:'Simpan resolusi merge',context:'File resolved sudah staged.',options:['git commit -m "fix: resolve navbar merge conflict"','git push --force origin main','git clean src/Nav.js','git init --reset'],correct:'git commit -m "fix: resolve navbar merge conflict"',explain:'Commit menyelesaikan operasi merge dan menyimpan keputusan resolusi.',patch:{staged:'0 file',commits:3},log:'$ git commit -m "fix: resolve navbar merge conflict"'},
        {title:'Perbarui pull request',context:'Branch lokal memiliki commit resolusi yang belum ada di remote.',options:['git push origin feat/navbar','git push origin main --force','git fetch --delete','git remote set-url main'],correct:'git push origin feat/navbar',explain:'Push memperbarui compare branch sehingga pull request ikut diperbarui.',patch:{remoteBranch:'origin/feat/navbar terbaru',pr:'Open, checks berjalan'},log:'$ git push origin feat/navbar\n[web] Pull request updated'},
        {title:'Merge setelah validasi',context:'Review disetujui, tests lulus, dan conflict tidak lagi ada.',options:['Merge pull request ke main','Force push branch ke semua remote','Hapus main sebelum merge','Abaikan checks dan buat repo baru'],correct:'Merge pull request ke main',explain:'Perubahan siap digabungkan setelah review dan checks memenuhi aturan repository.',patch:{branch:'main',remoteBranch:'origin/main',issue:'#31 Closed',pr:'Merged',commits:4},log:'[web] Review approved\n[web] Checks passed\n[web] Pull request merged; issue #31 closed'}
      ]
    }
  ];

  const SHORTCUTS = [
    {icon:'⚙️',title:'Konfigurasi dan Awal',items:[
      ['git config --global user.name "Nama"','Atur nama pembuat commit.','safe'],
      ['git config --global user.email "email"','Atur email pembuat commit.','safe'],
      ['git init -b main','Inisialisasi repo lokal dengan branch main.','safe'],
      ['git clone URL_REPO','Buat salinan lokal dari remote.','safe'],
      ['git remote -v','Periksa URL fetch dan push.','safe'],
      ['git remote add origin URL','Hubungkan repo lokal ke remote origin.','safe']
    ]},
    {icon:'🔎',title:'Periksa Keadaan',items:[
      ['git status','Lihat branch, staged, modified, dan untracked.','safe'],
      ['git diff','Lihat perubahan yang belum staged.','safe'],
      ['git diff --staged','Lihat perubahan yang akan di-commit.','safe'],
      ['git log --oneline --graph --decorate --all','Lihat riwayat ringkas seluruh branch.','safe'],
      ['git branch -vv','Lihat branch dan upstream.','safe'],
      ['git show HASH','Lihat detail satu commit.','safe']
    ]},
    {icon:'📝',title:'Stage dan Commit',items:[
      ['git add nama-file','Stage file tertentu.','safe'],
      ['git add .','Stage seluruh perubahan di folder saat ini. Periksa status dulu.','caution'],
      ['git restore --staged nama-file','Keluarkan file dari staging tanpa membuang perubahan.','safe'],
      ['git commit -m "pesan"','Buat commit dari staged changes.','safe'],
      ['git commit --amend','Ubah commit terakhir. Hindari jika sudah dibagikan.','caution'],
      ['git revert HASH','Buat commit baru yang membalik commit lama.','safe']
    ]},
    {icon:'🌿',title:'Branch dan Merge',items:[
      ['git branch','Daftar branch lokal.','safe'],
      ['git switch nama-branch','Pindah ke branch yang ada.','safe'],
      ['git switch -c nama-branch','Buat dan pindah ke branch baru.','safe'],
      ['git merge nama-branch','Gabungkan branch tersebut ke branch aktif.','safe'],
      ['git branch -d nama-branch','Hapus branch lokal yang sudah merged.','safe'],
      ['git branch -D nama-branch','Paksa hapus branch walaupun belum merged.','caution']
    ]},
    {icon:'☁️',title:'Remote dan Sinkronisasi',items:[
      ['git fetch origin','Ambil referensi remote tanpa merge.','safe'],
      ['git pull origin main','Ambil dan integrasikan origin/main ke branch aktif.','safe'],
      ['git push -u origin nama-branch','Push pertama dan tetapkan upstream.','safe'],
      ['git push','Kirim commit ke upstream yang sudah diatur.','safe'],
      ['git remote set-url origin URL','Ganti alamat remote origin.','caution'],
      ['git push --force','Tulis ulang referensi remote. Hindari pada branch bersama.','caution']
    ]},
    {icon:'🛟',title:'Pemulihan dan Kebersihan',items:[
      ['git restore nama-file','Buang perubahan belum commit pada file.','caution'],
      ['git stash push -m "pesan"','Simpan sementara perubahan lokal.','safe'],
      ['git stash pop','Terapkan stash terbaru dan hapus dari daftar.','caution'],
      ['git clean -n','Pratinjau untracked files yang akan dibersihkan.','safe'],
      ['git clean -fd','Hapus untracked files dan folder. Tidak masuk recycle bin.','caution'],
      ['git reset --hard HASH','Pindahkan branch dan buang perubahan lokal.','caution']
    ]},
    {icon:'🤝',title:'GitHub Workflow',items:[
      ['Closes #17','Tutup issue #17 saat PR di-merge ke default branch.','safe'],
      ['base: main','Branch tujuan pada pull request.','safe'],
      ['compare: feat/nama','Branch sumber perubahan pada pull request.','safe'],
      ['Request changes','Review belum menyetujui dan meminta perbaikan.','safe'],
      ['Approve','Review menyatakan perubahan dapat diterima.','safe'],
      ['Squash and merge','Gabungkan commit PR menjadi satu commit.','caution']
    ]}
  ];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const clone = value => JSON.parse(JSON.stringify(value));
  const shuffle = items => {
    const copy = [...items];
    for(let i = copy.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  function readStorage(key, fallback){
    try{
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    }catch{ return fallback; }
  }

  function writeStorage(key, value){
    try{ localStorage.setItem(key, JSON.stringify(value)); }
    catch{ showToast('Progres aktif sementara karena penyimpanan browser tidak tersedia.'); }
  }

  let toastTimer;
  function showToast(message){
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  const state = {
    view: 'learn',
    moduleIndex: 0,
    readModules: new Set(readStorage(STORAGE.read, [])),
    quiz: [], quizIndex: 0, quizScore: 0, quizAnswered: false,
    scenario: null, scenarioSteps: [], chainIndex: 0, chainSolved: false, mistakes: 0, repo: {}, terminal: []
  };

  function showView(view){
    state.view = view;
    $$('.view').forEach(section => section.classList.toggle('active', section.id === `view-${view}`));
    $$('.nav-btn').forEach(button => {
      const active = button.dataset.viewTarget === view;
      button.classList.toggle('active', active);
      if(active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    window.scrollTo({top:0, behavior:'smooth'});
  }

  function renderPaws(){
    $('#pawProgress').innerHTML = MODULES.map(lesson => `<span class="${state.readModules.has(lesson.id) ? 'done' : ''}" title="${lesson.title}">🐾</span>`).join('');
    $('#moduleReadCount').textContent = `${state.readModules.size}/${MODULES.length} dibaca`;
  }

  function renderModuleNav(){
    $('#moduleNav').innerHTML = MODULES.map((lesson, index) => `
      <button class="module-nav-btn ${index === state.moduleIndex ? 'active' : ''}" type="button" data-module-index="${index}">
        <span class="module-number">${index + 1}</span>
        <span><b>${lesson.title}</b><small>${lesson.short}</small></span>
        <span class="read-check ${state.readModules.has(lesson.id) ? 'done' : ''}" aria-label="${state.readModules.has(lesson.id) ? 'Sudah dibaca' : 'Belum dibaca'}">✓</span>
      </button>`).join('');
  }

  function renderModule(){
    const lesson = MODULES[state.moduleIndex];
    const concepts = lesson.concepts.map(([name, description]) => `<div class="concept-card"><strong>${name}</strong><p>${description}</p></div>`).join('');
    const blocks = lesson.blocks.map(block => `
      <section class="lesson-block">
        <h3>${block.title}</h3>
        ${block.body || ''}
        ${block.code ? `<div class="code-block"><button class="copy-btn" type="button">Salin</button><pre><code>${escapeHtml(block.code)}</code></pre></div>` : ''}
        ${block.note ? `<div class="${block.note[0] === 'warning' ? 'warning-box' : 'tip-box'}"><span>${block.note[0] === 'warning' ? '⚠️' : '💡'}</span><span>${block.note[1]}</span></div>` : ''}
      </section>`).join('');
    const sources = lesson.sources.map(([label, url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`).join('');
    const isRead = state.readModules.has(lesson.id);

    $('#moduleContent').innerHTML = `
      <div class="module-kicker"><span>${lesson.icon}</span> MODUL ${state.moduleIndex + 1} DARI ${MODULES.length}</div>
      <h2>${lesson.title}</h2>
      <p class="module-summary">${lesson.summary}</p>
      <div class="objective-box"><span>🎯</span><p><strong>Target belajar:</strong> ${lesson.objective}</p></div>
      <section class="lesson-block"><h3>Peta konsep</h3><div class="concept-grid">${concepts}</div></section>
      ${blocks}
      <section class="lesson-block"><h3>Daftar periksa</h3><ul class="checklist">${lesson.checklist.map(item => `<li>${item}</li>`).join('')}</ul></section>
      <div class="source-links">${sources}</div>
      <div class="module-footer">
        <button class="ghost-btn" type="button" id="prevModule" ${state.moduleIndex === 0 ? 'disabled' : ''}>← Sebelumnya</button>
        <button class="secondary-btn" type="button" id="markModuleRead">${isRead ? '✓ Sudah Dibaca' : 'Tandai Sudah Dibaca'}</button>
        <button class="primary-btn" type="button" id="nextModule">${state.moduleIndex === MODULES.length - 1 ? 'Buka Kuis →' : 'Modul Berikutnya →'}</button>
      </div>`;

    renderModuleNav();
    renderPaws();
  }

  function escapeHtml(value){
    return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'})[char]);
  }

  function prepareQuiz(){
    state.quiz = shuffle(QUIZ_BANK).slice(0, 10).map(question => ({...question, shuffledOptions:shuffle(question.options)}));
    state.quizIndex = 0;
    state.quizScore = 0;
    state.quizAnswered = false;
    $('#quizStart').hidden = true;
    $('#quizResult').hidden = true;
    $('#quizPlay').hidden = false;
    renderQuizQuestion();
  }

  function renderQuizQuestion(){
    const question = state.quiz[state.quizIndex];
    state.quizAnswered = false;
    $('#quizCounter').textContent = `Soal ${state.quizIndex + 1} dari ${state.quiz.length}`;
    $('#quizLiveScore').textContent = `Skor ${state.quizScore}`;
    $('#quizProgressBar').style.width = `${(state.quizIndex / state.quiz.length) * 100}%`;
    $('#quizQuestion').innerHTML = `
      <div class="situation"><strong>Keadaan:</strong> ${question.situation}</div>
      <div class="question-topic">${question.topic.toUpperCase()}</div>
      <div class="question-text">${question.q}</div>
      <div class="option-list">${question.shuffledOptions.map((option, index) => `
        <button class="option-btn" type="button" data-quiz-option="${index}"><span class="option-letter">${String.fromCharCode(65 + index)}</span><span>${option}</span></button>`).join('')}</div>
      <div id="quizFeedback"></div>`;
  }

  function answerQuiz(index){
    if(state.quizAnswered) return;
    state.quizAnswered = true;
    const question = state.quiz[state.quizIndex];
    const selected = question.shuffledOptions[index];
    const correct = selected === question.answer;
    if(correct) state.quizScore++;
    $$('.option-btn', $('#quizQuestion')).forEach((button, buttonIndex) => {
      const value = question.shuffledOptions[buttonIndex];
      button.disabled = true;
      if(value === question.answer) button.classList.add('correct');
      if(buttonIndex === index && !correct) button.classList.add('wrong');
    });
    $('#quizFeedback').innerHTML = `
      <div class="answer-feedback ${correct ? 'good' : 'bad'}"><strong>${correct ? 'Benar. 🐾' : 'Belum tepat.'}</strong> ${question.explain}</div>
      <div class="next-row"><button class="primary-btn" id="nextQuiz" type="button">${state.quizIndex === state.quiz.length - 1 ? 'Lihat Hasil →' : 'Soal Berikutnya →'}</button></div>`;
    $('#quizLiveScore').textContent = `Skor ${state.quizScore}`;
  }

  function nextQuiz(){
    if(state.quizIndex < state.quiz.length - 1){
      state.quizIndex++;
      renderQuizQuestion();
    }else finishQuiz();
  }

  function finishQuiz(){
    const percent = Math.round((state.quizScore / state.quiz.length) * 100);
    const priorBest = Number(readStorage(STORAGE.best, 0));
    if(percent > priorBest) writeStorage(STORAGE.best, percent);
    renderBestScore();
    let rank = 'Kitten Git';
    let message = 'Baca kembali modul dasar, lalu coba lagi dengan soal acak baru.';
    if(percent >= 80){ rank = 'Repo Master'; message = 'Keputusanmu sudah konsisten pada sebagian besar keadaan GitHub.'; }
    else if(percent >= 60){ rank = 'Branch Explorer'; message = 'Fondasi sudah terbentuk. Perkuat bagian remote, conflict, dan pull request.'; }
    $('#quizPlay').hidden = true;
    $('#quizResult').hidden = false;
    $('#quizResult').innerHTML = `
      <div class="result-stamp">${rank} 🐾</div>
      <h2>Skor ${state.quizScore}/${state.quiz.length} (${percent}%)</h2>
      <p>${message}</p>
      <div class="module-footer"><button class="secondary-btn" type="button" data-view-target="learn">Baca Materi</button><button class="primary-btn" id="retryQuiz" type="button">Acak Soal Lagi →</button></div>`;
  }

  function renderBestScore(){
    const best = Number(readStorage(STORAGE.best, 0));
    $('#bestScore').textContent = best ? `${best}%` : 'Belum ada';
  }

  function startRandomScenario(){
    let candidates = SCENARIOS;
    if(state.scenario && SCENARIOS.length > 1) candidates = SCENARIOS.filter(item => item.id !== state.scenario.id);
    state.scenario = clone(candidates[Math.floor(Math.random() * candidates.length)]);
    state.scenarioSteps = state.scenario.steps.map(step => ({...step, shuffledOptions:shuffle(step.options)}));
    state.chainIndex = 0;
    state.chainSolved = false;
    state.mistakes = 0;
    state.repo = clone(state.scenario.initial);
    state.terminal = [...state.scenario.intro];
    renderScenario();
  }

  function renderScenario(){
    $('#scenarioTitle').textContent = state.scenario.title;
    $('#scenarioBrief').textContent = state.scenario.brief;
    renderChainPaws();
    renderRepoState();
    renderChainStep();
  }

  function renderChainPaws(){
    $('#chainPaws').innerHTML = state.scenarioSteps.map((_step, index) => `<span class="${index < state.chainIndex ? 'done' : index === state.chainIndex ? 'current' : ''}">🐾</span>`).join('');
  }

  function renderRepoState(){
    const values = [
      ['Repository', state.repo.repository],
      ['Git lokal', state.repo.initialized ? 'Aktif' : 'Belum aktif'],
      ['Branch aktif', state.repo.branch],
      ['Staging', state.repo.staged],
      ['Commit lokal', String(state.repo.commits)],
      ['Remote', state.repo.remote],
      ['Remote branch', state.repo.remoteBranch],
      ['Issue', state.repo.issue],
      ['Pull request', state.repo.pr]
    ];
    $('#repoState').innerHTML = values.map(([label, value]) => `<div class="state-item"><dt>${label}</dt><dd class="${['Aktif','Merged'].some(word => String(value).includes(word)) ? 'yes' : String(value).includes('Belum') ? 'no' : ''}">${value}</dd></div>`).join('');
    $('#terminalLog').textContent = state.terminal.join('\n');
    const terminal = $('#terminalLog');
    terminal.scrollTop = terminal.scrollHeight;
  }

  function renderChainStep(){
    if(state.chainIndex >= state.scenarioSteps.length){
      $('#chainPanel').innerHTML = `
        <div class="quiz-result" style="padding:22px 8px">
          <div class="result-stamp">REPO READY 🐾</div>
          <h2>Chain selesai tanpa lompat langkah</h2>
          <p>Kamu menyelesaikan ${state.scenarioSteps.length} keputusan berurutan dengan ${state.mistakes} kesalahan percobaan.</p>
          <button class="primary-btn" id="finishScenario" type="button">Coba Skenario Lain →</button>
        </div>`;
      return;
    }
    const step = state.scenarioSteps[state.chainIndex];
    $('#chainPanel').innerHTML = `
      <div class="step-count">LANGKAH ${state.chainIndex + 1} DARI ${state.scenarioSteps.length}</div>
      <h2>${step.title}</h2>
      <p class="chain-context">${step.context}</p>
      <div class="option-list">${step.shuffledOptions.map((option,index) => `<button class="option-btn chain-command" type="button" data-chain-option="${index}"><span class="option-letter">${String.fromCharCode(65 + index)}</span><span>${option}</span></button>`).join('')}</div>
      <div id="chainFeedback"></div>
      <div class="chain-footer"><span class="mistakes">Percobaan keliru: ${state.mistakes}</span></div>`;
  }

  function answerChain(index){
    if(state.chainSolved) return;
    const step = state.scenarioSteps[state.chainIndex];
    const selected = step.shuffledOptions[index];
    const button = $(`[data-chain-option="${index}"]`);
    if(selected !== step.correct){
      state.mistakes++;
      button.classList.add('wrong');
      $('#chainFeedback').innerHTML = `<div class="chain-feedback bad"><strong>Keadaan repo belum berubah.</strong> Pilihan ini tidak cocok dengan kondisi saat ini. Periksa kembali tujuan langkah dan coba pilihan lain.</div>`;
      $('.mistakes').textContent = `Percobaan keliru: ${state.mistakes}`;
      return;
    }
    state.chainSolved = true;
    Object.assign(state.repo, step.patch);
    state.terminal.push(step.log);
    $$('.option-btn', $('#chainPanel')).forEach((item, itemIndex) => {
      item.disabled = true;
      if(step.shuffledOptions[itemIndex] === step.correct) item.classList.add('correct');
    });
    renderRepoState();
    $('#chainFeedback').innerHTML = `<div class="chain-feedback good"><strong>Keadaan repo diperbarui.</strong> ${step.explain}</div>`;
    $('.chain-footer').innerHTML = `<span class="mistakes">Percobaan keliru: ${state.mistakes}</span><button class="primary-btn" id="nextChain" type="button">${state.chainIndex === state.scenarioSteps.length - 1 ? 'Selesaikan Chain →' : 'Langkah Berikutnya →'}</button>`;
  }

  function nextChain(){
    state.chainIndex++;
    state.chainSolved = false;
    renderChainPaws();
    renderChainStep();
  }

  function renderShortcuts(query = ''){
    const needle = query.trim().toLocaleLowerCase('id');
    const groups = SHORTCUTS.map(group => ({
      ...group,
      items: group.items.filter(item => !needle || `${group.title} ${item[0]} ${item[1]}`.toLocaleLowerCase('id').includes(needle))
    })).filter(group => group.items.length);
    if(!groups.length){
      $('#shortcutSections').innerHTML = '<div class="card empty-shortcut">Tidak ada shortcut yang cocok. Coba kata kunci lain.</div>';
      return;
    }
    $('#shortcutSections').innerHTML = groups.map(group => `
      <section class="shortcut-group card">
        <div class="shortcut-group-head"><span>${group.icon}</span><h2>${group.title}</h2></div>
        <div class="shortcut-grid">${group.items.map(([command,description,risk]) => `
          <article class="shortcut-item">
            <div class="shortcut-top"><code>${escapeHtml(command)}</code><span class="risk-tag ${risk}">${risk === 'safe' ? 'AMAN' : 'HATI-HATI'}</span></div>
            <p>${description}</p>
          </article>`).join('')}</div>
      </section>`).join('');
  }

  document.addEventListener('click', event => {
    const viewButton = event.target.closest('[data-view-target]');
    if(viewButton){ showView(viewButton.dataset.viewTarget); return; }

    const moduleButton = event.target.closest('[data-module-index]');
    if(moduleButton){
      state.moduleIndex = Number(moduleButton.dataset.moduleIndex);
      renderModule();
      window.scrollTo({top:0,behavior:'smooth'});
      return;
    }

    const copyButton = event.target.closest('.copy-btn');
    if(copyButton){
      const value = $('code', copyButton.parentElement).textContent;
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(value).then(() => showToast('Perintah disalin.')).catch(() => showToast('Salin manual dari blok perintah.'));
      }else{
        showToast('Salin manual dari blok perintah.');
      }
      return;
    }

    const quizOption = event.target.closest('[data-quiz-option]');
    if(quizOption){ answerQuiz(Number(quizOption.dataset.quizOption)); return; }
    const chainOption = event.target.closest('[data-chain-option]');
    if(chainOption){ answerChain(Number(chainOption.dataset.chainOption)); }
  });

  $('#moduleNav').addEventListener('keydown', event => {
    if(!['ArrowDown','ArrowUp'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowDown' ? 1 : -1;
    state.moduleIndex = (state.moduleIndex + direction + MODULES.length) % MODULES.length;
    renderModule();
    $(`[data-module-index="${state.moduleIndex}"]`).focus();
  });

  $('#moduleContent').addEventListener('click', event => {
    if(event.target.closest('#prevModule')){
      state.moduleIndex = Math.max(0,state.moduleIndex - 1); renderModule(); window.scrollTo({top:0,behavior:'smooth'});
    }
    if(event.target.closest('#nextModule')){
      if(state.moduleIndex === MODULES.length - 1) showView('quiz');
      else{ state.moduleIndex++; renderModule(); window.scrollTo({top:0,behavior:'smooth'}); }
    }
    if(event.target.closest('#markModuleRead')){
      const id = MODULES[state.moduleIndex].id;
      if(state.readModules.has(id)) state.readModules.delete(id); else state.readModules.add(id);
      writeStorage(STORAGE.read,[...state.readModules]);
      renderModule();
      showToast(state.readModules.has(id) ? 'Modul ditandai sudah dibaca.' : 'Tanda baca dibatalkan.');
    }
  });

  $('#startQuiz').addEventListener('click', prepareQuiz);
  $('#quizShell').addEventListener('click', event => {
    if(event.target.closest('#nextQuiz')) nextQuiz();
    if(event.target.closest('#retryQuiz')) prepareQuiz();
  });
  $('#newScenario').addEventListener('click', startRandomScenario);
  $('#chainPanel').addEventListener('click', event => {
    if(event.target.closest('#nextChain')) nextChain();
    if(event.target.closest('#finishScenario')) startRandomScenario();
  });
  $('#shortcutSearch').addEventListener('input', event => renderShortcuts(event.target.value));

  const html = document.documentElement;
  const savedTheme = readStorage(STORAGE.theme, 'light');
  html.dataset.theme = savedTheme === 'dark' ? 'dark' : 'light';
  updateThemeButton();
  $('#themeToggle').addEventListener('click', () => {
    html.dataset.theme = html.dataset.theme === 'light' ? 'dark' : 'light';
    writeStorage(STORAGE.theme, html.dataset.theme);
    updateThemeButton();
  });

  function updateThemeButton(){
    const dark = html.dataset.theme === 'dark';
    $('#themeIcon').textContent = dark ? '🌙' : '☀️';
    $('#themeToggle').setAttribute('aria-pressed', String(dark));
    $('#themeToggle').setAttribute('aria-label', dark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap');
  }

  renderModule();
  renderBestScore();
  renderShortcuts();
  startRandomScenario();
})();
