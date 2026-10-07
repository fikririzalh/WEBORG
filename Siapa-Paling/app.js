const QUESTIONS=[
 'Siapa yang paling mungkin mengajak alien selfie sebelum bertanya asalnya?',
 'Siapa yang paling mungkin mengubah salah jalan menjadi tur wisata?',
 'Siapa yang paling mungkin membawa dua koper untuk liburan dua hari?',
 'Siapa yang paling mungkin berteman dengan hantu di rumah kosong?',
 'Siapa yang paling mungkin menjadi ketua tim saat tersesat di luar angkasa?',
 'Siapa yang paling mungkin memberi nama pada tanaman di rumah?',
 'Siapa yang paling mungkin menawar harga dengan robot?',
 'Siapa yang paling mungkin menemukan restoran enak tanpa sengaja?',
 'Siapa yang paling mungkin menjadi terkenal gara-gara video yang tidak disengaja?',
 'Siapa yang paling mungkin berbicara dengan kucing seolah kucing itu menjawab?',
 'Siapa yang paling mungkin mengadakan pesta untuk benda kesayangannya?',
 'Siapa yang paling mungkin punya rencana cadangan untuk rencana cadangan?',
 'Siapa yang paling mungkin tertawa duluan saat semua harus diam?',
 'Siapa yang paling mungkin membawa camilan ke acara yang sudah menyediakan makanan?',
 'Siapa yang paling mungkin membuat grup chat khusus untuk satu perjalanan?',
 'Siapa yang paling mungkin menang lomba membuat alasan yang masuk akal?',
 'Siapa yang paling mungkin tersesat di museum lalu menikmati pameran lain?',
 'Siapa yang paling mungkin memberi pidato saat menerima hadiah kecil?',
 'Siapa yang paling mungkin dipercaya menjaga telur naga?',
 'Siapa yang paling mungkin mengajari dinosaurus menggunakan ponsel?',
 'Siapa yang paling mungkin memesan makanan yang sama sambil berkata ingin mencoba hal baru?',
 'Siapa yang paling mungkin menganggap suara aneh sebagai awal petualangan?',
 'Siapa yang paling mungkin membuat peta harta karun untuk hadiah ulang tahun?',
 'Siapa yang paling mungkin membawa payung walau ramalan cuaca cerah?',
 'Siapa yang paling mungkin mengajak seluruh rombongan bernyanyi di perjalanan?',
 'Siapa yang paling mungkin membela monster yang ternyata cuma ingin berteman?',
 'Siapa yang paling mungkin membaca instruksi mi instan sampai selesai?',
 'Siapa yang paling mungkin memotret makanan dari lima sudut sebelum makan?',
 'Siapa yang paling mungkin menjadi pemandu wisata dadakan di kota asing?',
 'Siapa yang paling mungkin menamai kapal bajak laut dengan nama lucu?',
 'Siapa yang paling mungkin membuat jadwal piknik sampai menit terakhir?',
 'Siapa yang paling mungkin mengajak satpam ikut permainan pesta?',
 'Siapa yang paling mungkin membuat hadiah dari barang seadanya dan hasilnya bagus?',
 'Siapa yang paling mungkin mengirim stiker sebagai seluruh jawaban?',
 'Siapa yang paling mungkin menanyakan nama seekor burung yang lewat?',
 'Siapa yang paling mungkin berbicara di depan umum tanpa persiapan?',
 'Siapa yang paling mungkin menemukan jalan pulang dari petunjuk yang aneh?',
 'Siapa yang paling mungkin membuka kafe untuk makhluk dongeng?',
 'Siapa yang paling mungkin membuat semua orang ikut permainan dadakan?',
 'Siapa yang paling mungkin menyimpan tiket bioskop sebagai kenang-kenangan?',
 'Siapa yang paling mungkin memilih duduk di depan saat naik wahana seram?',
 'Siapa yang paling mungkin bertanya apakah alien punya makanan khas?',
 'Siapa yang paling mungkin membawa pengeras suara untuk karaoke dadakan?',
 'Siapa yang paling mungkin menjadi juru damai antara dua karakter kartun?',
 'Siapa yang paling mungkin menukar takhta kerajaan dengan kebun binatang?',
 'Siapa yang paling mungkin menganggap hujan sebagai alasan untuk piknik di dalam rumah?',
 'Siapa yang paling mungkin memasak tanpa resep dan hasilnya mengejutkan?',
 'Siapa yang paling mungkin memberi nama pada mobil atau motornya?',
 'Siapa yang paling mungkin menyiapkan kostum untuk pesta yang belum pasti ada?',
 'Siapa yang paling mungkin mengumpulkan semua orang untuk foto bersama?',
 'Siapa yang paling mungkin menjawab telepon dari nomor tak dikenal dengan suara resmi?',
 'Siapa yang paling mungkin menemukan kegunaan baru untuk barang rusak?',
 'Siapa yang paling mungkin mengajak robot liburan agar tidak bosan?',
 'Siapa yang paling mungkin membuat aturan baru ketika permainan terlalu mudah?',
 'Siapa yang paling mungkin bertepuk tangan paling keras untuk hal kecil?',
 'Siapa yang paling mungkin mengubah ruang tamu menjadi panggung konser?',
 'Siapa yang paling mungkin memenangkan lomba bercerita tanpa naskah?',
 'Siapa yang paling mungkin mengajak tetangga ikut lomba masak?',
 'Siapa yang paling mungkin tahu nama semua peliharaan orang lain?',
 'Siapa yang paling mungkin menulis surat terima kasih kepada mesin penjual otomatis?'
];
const KEY='siapa-paling-game-v1',THEME='siapa-paling-theme';
const app=document.getElementById('app');
function getStore(k){try{return window.localStorage.getItem(k)}catch{return null}}
function setStore(k,v){try{window.localStorage.setItem(k,v)}catch{}}
function fresh(){return {phase:'setup',mode:'pass',names:[],round:0,deck:[],votes:[],tally:[],results:null,awards:[],completed:[]}}
let state;try{state=JSON.parse(getStore(KEY))}catch{state=null}
if(!state||!['setup','handoff','voting','narrator','result','end'].includes(state.phase)||!Array.isArray(state.deck)||!Array.isArray(state.names))state=fresh();
state.completed ||= [];
state.awards ||= [];
state.tally ||= state.names.map(()=>0);
let draftMode=state.mode,draftNames=state.names.join(', '),error='';
let theme=getStore(THEME)||((window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light');
let seconds=15,timer=null;
function save(){setStore(KEY,JSON.stringify(state))}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function deck(){const a=Array.from({length:QUESTIONS.length},(_,i)=>i);for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a.slice(0,10)}
function question(){return QUESTIONS[state.deck[state.round]]||QUESTIONS[0]}
function titleFor(questionId){return QUESTIONS[questionId].replace(/^Siapa yang paling mungkin /,'Paling mungkin ').replace(/\?$/,'')}
function backButton(){return '<button class="back-button" id="back" type="button">← Kembali</button>'}
function header(){return `${backButton()}<div class="game-meta"><span>RONDE ${state.round+1} / 10</span><span>${state.mode==='pass'?'📱 Pass and play':'✎ Narator + kertas'}</span></div><div class="progress"><span style="width:${(state.round+1)*10}%"></span></div>`}
function setup(){return `<section><div class="eyebrow">PARTY GAME SATU PONSEL</div><h1>Siapa paling...?</h1><p class="intro">Baca pertanyaannya, pilih satu teman secara diam-diam, lalu lihat siapa yang paling banyak dipilih. Tiap ronde punya gelar baru.</p><div class="card"><p class="section-label">Pilih cara main</p><div class="mode-grid"><button class="mode ${draftMode==='pass'?'selected':''}" type="button" data-mode="pass" aria-pressed="${draftMode==='pass'}"><span class="emoji">📱</span><strong>Pass and play</strong><small>Ponsel berputar. Semua memilih diam-diam.</small></button><button class="mode ${draftMode==='narrator'?'selected':''}" type="button" data-mode="narrator" aria-pressed="${draftMode==='narrator'}"><span class="emoji">✎</span><strong>Narator + kertas</strong><small>Semua menulis nama. Narator menghitung.</small></button></div><div class="field"><label for="names">Nama pemain (${draftMode==='pass'?'3–12':'3–20'} orang)</label><textarea id="names" placeholder="Contoh: Adit, Bela, Citra, Danu" spellcheck="false">${escapeHTML(draftNames)}</textarea><p class="hint">Pisahkan nama dengan koma atau baris baru. Pilihan nama akan muncul otomatis di bawah pertanyaan.</p></div>${error?`<p class="error" role="alert">${escapeHTML(error)}</p>`:''}<div class="actions"><button class="primary" id="start" type="button">Mulai 10 ronde</button></div></div><details class="rules"><summary>Aturan singkat</summary><p>Pilih satu pemain selain dirimu. Pemain dengan suara terbanyak mendapat gelar ronde itu; jika seri, gelarnya dibagi. Hasil hanya menampilkan jumlah suara, bukan nama pemberi suara. Di mode kertas, narator juga ikut memilih sebelum menghitung.</p></details></section>`}
function handoff(){const n=state.names[state.votes.length];return `<section class="card handoff">${header()}<span class="lock" aria-hidden="true">🔒</span><div class="eyebrow">GILIRAN ${state.votes.length+1} DARI ${state.names.length}</div><h2>Serahkan ponsel ke ${escapeHTML(n)}</h2><p>Pastikan hanya ${escapeHTML(n)} yang melihat layar saat memilih.</p><button class="primary" id="ready" type="button">Saya ${escapeHTML(n)}, lihat pertanyaan</button></section>`}
function questionCard(voting=false){const choices=state.names.map((n,i)=>voting&&i===state.votes.length?'':voting?`<button class="candidate" type="button" data-vote="${i}"><span class="avatar">${escapeHTML(n.charAt(0).toUpperCase())}</span><span>${escapeHTML(n)}</span></button>`:`<div class="candidate"><span class="avatar">${escapeHTML(n.charAt(0).toUpperCase())}</span><span>${escapeHTML(n)}</span></div>`).join('');return `<section class="question-card"><div class="eyebrow">PILIH SATU TEMAN · BUKAN DIRI SENDIRI</div><h2>${escapeHTML(question())}</h2><div class="candidate-grid">${choices}</div></section>`}
function voting(){return `${header()}<p class="eyebrow" style="margin-bottom:12px">${escapeHTML(state.names[state.votes.length])} SEDANG MEMILIH · JANGAN INTIP</p>${questionCard(true)}<p class="hint" style="margin-top:19px">Ketuk satu nama. Layar akan langsung tertutup untuk pemain berikutnya.</p>`}
function narrator(){const total=state.tally.reduce((a,b)=>a+b,0);return `${header()}${questionCard()}<section class="card under-card"><h3>Buka kertas bersama</h3><p class="subtext">Semua menulis nama pemain selain dirinya. Hitung suara untuk setiap nama.</p><div class="tally-list">${state.names.map((n,i)=>`<div class="tally-row"><span class="tally-name">${escapeHTML(n)}</span><div class="stepper"><button type="button" data-step="${i}" data-delta="-1" aria-label="Kurangi suara ${escapeHTML(n)}">−</button><output aria-label="Suara ${escapeHTML(n)}">${state.tally[i]}</output><button type="button" data-step="${i}" data-delta="1" aria-label="Tambah suara ${escapeHTML(n)}">+</button></div></div>`).join('')}</div><p class="count-line">${total} dari ${state.names.length} suara tercatat</p><div class="actions"><button class="primary" id="reveal" type="button" ${total!==state.names.length?'disabled':''}>Buka hasil</button></div></section>`}
function countVotes(votes){const tally=state.names.map(()=>0);votes.forEach(i=>tally[i]++);const high=Math.max(...tally);return {tally,winners:tally.map((v,i)=>v===high?i:-1).filter(i=>i>=0)}}
function result(){const r=state.results;if(!r)return setup();const winners=r.winners.map(i=>state.names[i]);return `${header()}<section class="card"><div class="eyebrow">HASIL RONDE ${state.round+1}</div><h2 class="result-title">${escapeHTML(question())}</h2><div class="winner-banner ${winners.length>1?'tie':''}">${winners.length>1?'Gelar bersama: ':'Paling terpilih: '}${escapeHTML(winners.join(' & '))} ★</div><div class="result-list">${state.names.map((n,i)=>({n,i,count:r.tally[i]})).sort((a,b)=>b.count-a.count).map(x=>`<div class="result-row ${r.winners.includes(x.i)?'winner':''}"><span>${escapeHTML(x.n)}</span><strong>${x.count} suara</strong><div class="bar-track"><div class="bar" style="width:${x.count/state.names.length*100}%"></div></div></div>`).join('')}</div><div class="story-box"><strong>Waktunya membela diri!</strong><p>${escapeHTML(winners.join(' & '))}, setuju dengan pilihan teman-teman? Ceritakan alasannya dalam 15 detik.</p><div class="timer"><button id="timer" type="button">${timer?'Ulang 15 detik':'Mulai 15 detik'}</button><output id="timer-value" aria-live="off">${seconds} dtk</output></div></div><div class="actions"><button class="primary" id="next" type="button">${state.round===9?'Lihat rekap gelar':'Ronde berikutnya'}</button></div></section>`}
function end(){const cards=state.names.map((n,i)=>{const titles=state.awards.filter(a=>a.winners.includes(i)).map(a=>titleFor(a.questionId));return `<div class="recap-card"><h3>${escapeHTML(n)} · ${titles.length} gelar</h3>${titles.length?titles.map(t=>`<span class="badge">★ ${escapeHTML(t)}</span>`).join(''):'<span class="empty">Belum mendapat gelar kali ini.</span>'}</div>`}).join('');return `${backButton()}<section class="card"><div class="eyebrow">10 RONDE SELESAI</div><h1>Inilah gelar kalian!</h1><p class="subtext">Tidak ada juara tunggal. Tiap nama punya ceritanya sendiri.</p><div class="recap">${cards}</div><div class="actions"><button class="primary" id="restart" type="button">Main lagi</button></div></section>`}
function render(){document.body.classList.toggle('dark',theme==='dark');document.getElementById('theme').textContent=theme==='dark'?'☀ Terang':'☾ Gelap';app.innerHTML=({setup,handoff,voting,narrator,result,end}[state.phase]||setup)()}
function begin(){const names=draftNames.split(/[,\n]+/).map(n=>n.trim()).filter(Boolean);const max=draftMode==='pass'?12:20;if(names.length<3||names.length>max){error=`Masukkan 3 sampai ${max} nama pemain.`;render();return}if(new Set(names.map(n=>n.toLocaleLowerCase('id'))).size!==names.length){error='Setiap nama pemain harus berbeda.';render();return}if(names.some(n=>n.length>28)){error='Nama pemain maksimal 28 karakter.';render();return}state={phase:draftMode==='pass'?'handoff':'narrator',mode:draftMode,names,round:0,deck:deck(),votes:[],tally:names.map(()=>0),results:null,awards:[],completed:[]};error='';save();render()}
function stopTimer(){if(timer){clearInterval(timer);timer=null}seconds=15}
function back(){stopTimer();if(state.phase==='voting')state.phase='handoff';else if(state.phase==='handoff'&&state.votes.length){const n=state.names[state.votes.length-1];if(!window.confirm(`Batalkan pilihan ${n}? Serahkan ponsel kembali kepadanya.`))return;state.votes.pop()}else if(state.phase==='result'){if(state.mode==='pass'){if(!window.confirm('Hasil sudah dibuka. Batalkan suara terakhir dan hitung ulang ronde ini?'))return;state.votes.pop();state.phase='handoff'}else{state.tally=[...state.results.tally];state.phase='narrator'}state.awards=state.awards.filter(a=>a.round!==state.round);state.results=null}else if(state.phase==='end')state.phase='result';else if(state.phase==='handoff'||state.phase==='narrator'){if(state.phase==='narrator'&&state.tally.some(Boolean)&&!window.confirm('Hitungan suara ronde ini akan dibuang. Kembali?'))return;const prev=state.completed.pop();if(prev){state.round=prev.round;state.votes=prev.votes;state.tally=prev.tally;state.results=prev.results;state.awards=prev.awards;state.phase='result'}else{draftMode=state.mode;draftNames=state.names.join(', ');state=fresh()}}save();render();window.scrollTo(0,0)}
app.addEventListener('input',e=>{if(e.target.id==='names')draftNames=e.target.value});
app.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.mode){draftMode=b.dataset.mode;error='';render();return}
 if(b.id==='start'){begin();return}
 if(b.id==='back'){back();return}
 if(b.id==='ready'){state.phase='voting';save();render();return}
 if(b.dataset.vote!==undefined&&state.phase==='voting'){const i=Number(b.dataset.vote);if(i===state.votes.length||i<0||i>=state.names.length)return;state.votes.push(i);if(state.votes.length===state.names.length){state.results=countVotes(state.votes);state.awards.push({round:state.round,questionId:state.deck[state.round],winners:[...state.results.winners]});state.phase='result';stopTimer()}else state.phase='handoff';save();render();window.scrollTo(0,0);return}
 if(b.dataset.step!==undefined&&state.phase==='narrator'){const i=Number(b.dataset.step),d=Number(b.dataset.delta),total=state.tally.reduce((a,n)=>a+n,0);if(Number.isInteger(i)&&i>=0&&i<state.names.length&&state.tally[i]+d>=0&&total+d<=state.names.length){state.tally[i]+=d;save();render()}return}
 if(b.id==='reveal'&&state.phase==='narrator'){if(state.tally.reduce((a,n)=>a+n,0)!==state.names.length)return;const high=Math.max(...state.tally);state.results={tally:[...state.tally],winners:state.tally.map((n,i)=>n===high?i:-1).filter(i=>i>=0)};state.awards.push({round:state.round,questionId:state.deck[state.round],winners:[...state.results.winners]});state.phase='result';stopTimer();save();render();window.scrollTo(0,0);return}
 if(b.id==='timer'&&state.phase==='result'){stopTimer();seconds=15;const out=document.getElementById('timer-value');out.textContent='15 dtk';timer=setInterval(()=>{seconds--;const current=document.getElementById('timer-value');if(current)current.textContent=seconds?`${seconds} dtk`:'Selesai!';if(seconds<=0){clearInterval(timer);timer=null}},1000);render();return}
 if(b.id==='next'&&state.phase==='result'){stopTimer();if(state.round===9)state.phase='end';else{state.completed.push({round:state.round,votes:[...state.votes],tally:[...state.tally],results:state.results,awards:state.awards.map(a=>({...a,winners:[...a.winners]}))});state.round++;state.votes=[];state.tally=state.names.map(()=>0);state.results=null;state.phase=state.mode==='pass'?'handoff':'narrator'}save();render();window.scrollTo(0,0);return}
 if(b.id==='restart'){stopTimer();state=fresh();draftMode='pass';draftNames='';error='';save();render();window.scrollTo(0,0)}
});
document.getElementById('theme').addEventListener('click',()=>{theme=theme==='dark'?'light':'dark';setStore(THEME,theme);render()});
render();
