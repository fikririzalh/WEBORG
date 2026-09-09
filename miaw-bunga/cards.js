(function(root){
'use strict';
const clone=x=>JSON.parse(JSON.stringify(x));
function stop(msg){throw Error(msg)}
function freshCards(){return [0,1,2,3].map(id=>({id,type:id===3?'trap':'flower'}))}
function create(mode,names){if(!['single','personal'].includes(mode))stop('Mode tidak valid.');if(!Array.isArray(names)||(mode==='single'&&(names.length<3||names.length>6))||(mode==='personal'&&names.length!==1))stop('Jumlah pemain tidak sesuai.');if(names.some(n=>typeof n!=='string'||!n.trim()||n.length>24)||new Set(names.map(n=>n.trim().toLowerCase())).size!==names.length)stop('Gunakan nama berbeda, maksimal 24 karakter.');return {format:2,mode,phase:'place',turn:0,round:1,players:names.map(name=>({name:name.trim(),cards:freshCards(),stack:[]}))}}
function hand(p){return p.cards.filter(c=>!p.stack.some(x=>x.id===c.id))}
function total(s){return s.players.reduce((a,p)=>a+p.stack.length,0)}
function next(s){for(let d=1;d<=s.players.length;d++){const i=(s.turn+d)%s.players.length;if(hand(s.players[i]).length)return i}return s.turn}
function apply(old,a){const s=clone(old);if(!a||typeof a!=='object')stop('Aksi tidak valid.');
if(a.type==='place'){if(s.phase!=='place')stop('Meja sudah dalam mode membuka.');const p=s.players[s.turn],c=hand(p).find(c=>c.id===a.card);if(!c)stop('Kartu tidak tersedia.');p.stack.push({...c,up:false});if(s.mode==='single')s.turn=next(s);
}else if(a.type==='turn'){if(s.phase!=='place'||s.mode!=='single'||!Number.isInteger(a.player)||!s.players[a.player]||!hand(s.players[a.player]).length)stop('Pemain tidak memiliki kartu untuk dipasang.');s.turn=a.player;
}else if(a.type==='reveal'){if(s.phase!=='place'||!total(s))stop('Belum ada kartu di meja.');s.phase='reveal';
}else if(a.type==='resumePlace'){if(s.phase!=='reveal'||s.players.some(p=>p.stack.some(c=>c.up)))stop('Kartu sudah dibuka. Selesaikan ronde terlebih dahulu.');s.phase='place';
}else if(a.type==='flip'){if(s.phase!=='reveal')stop('Tekan Ada bet terlebih dahulu.');const p=s.players[a.player];if(!Number.isInteger(a.player)||!p)stop('Tumpukan tidak valid.');const top=p.stack.findLastIndex(c=>!c.up);if(top<0||top!==a.index)stop('Buka kartu tertutup paling atas dahulu.');p.stack[top].up=true;
}else if(a.type==='finish'){if(s.phase!=='reveal')stop('Ronde belum masuk mode membuka.');s.phase='between';
}else if(a.type==='remove'){if(s.phase!=='between')stop('Kelola kartu setelah ronde selesai.');const p=s.players[a.player];if(!p||!Number.isInteger(a.player)||!p.cards.some(c=>c.id===a.card))stop('Kartu tidak tersedia.');p.cards=p.cards.filter(c=>c.id!==a.card);
}else if(a.type==='restore'){if(s.phase!=='between'||!s.players[a.player])stop('Tidak dapat mengatur kartu sekarang.');s.players[a.player].cards=freshCards();
}else if(a.type==='next'){if(s.phase!=='between')stop('Selesaikan ronde terlebih dahulu.');const starter=s.mode==='personal'?0:a.player;if(!Number.isInteger(starter)||!s.players[starter]||!s.players[starter].cards.length)stop('Pilih pemain yang masih punya kartu.');s.players.forEach(p=>p.stack=[]);s.turn=starter;s.round++;s.phase='place';
}else stop('Aksi tidak dikenal.');return s}
function publicView(s){return {mode:s.mode,phase:s.phase,turn:s.turn,round:s.round,players:s.players.map(p=>({name:p.name,count:p.cards.length,handCount:hand(p).length,stack:p.stack.map(c=>({up:c.up,type:c.up?c.type:null}))}))}}
function valid(s){if(!s||s.format!==2||!['single','personal'].includes(s.mode)||!['place','reveal','between'].includes(s.phase)||!Number.isInteger(s.round)||s.round<1||!Array.isArray(s.players)||!Number.isInteger(s.turn)||s.turn<0||s.turn>=s.players.length)return false;try{create(s.mode,s.players.map(p=>p.name));return s.players.every(p=>Array.isArray(p.cards)&&p.cards.length<=4&&new Set(p.cards.map(c=>c.id)).size===p.cards.length&&p.cards.every(c=>Number.isInteger(c.id)&&c.id>=0&&c.id<=3&&c.type===(c.id===3?'trap':'flower'))&&Array.isArray(p.stack)&&p.stack.length<=4&&new Set(p.stack.map(c=>c.id)).size===p.stack.length&&p.stack.every(c=>Number.isInteger(c.id)&&c.id>=0&&c.id<=3&&c.type===(c.id===3?'trap':'flower')&&typeof c.up==='boolean')&&(s.phase==='between'||p.stack.every(c=>p.cards.some(x=>x.id===c.id))));}catch{return false}}
const api={create,apply,hand,total,publicView,valid};if(typeof module==='object'&&module.exports)module.exports=api;else root.CardTable=api;
})(globalThis);
