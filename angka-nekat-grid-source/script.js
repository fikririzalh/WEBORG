(function(){
  'use strict';
  var STORE_KEY = 'angka_nekat_grid_v4';

  // ---------- helpers ----------
  function isPrime(n){
    if (n < 2) return false;
    for (var i = 2; i * i <= n; i++){ if (n % i === 0) return false; }
    return true;
  }
  function hasPrimeInRange(min, max){
    for (var i = min; i <= max; i++){ if (isPrime(i)) return true; }
    return false;
  }
  function digitsInRange(min, max){
    var set = {};
    for (var i = min; i <= max; i++){
      String(i).split('').forEach(function(d){ set[d] = true; });
    }
    return Object.keys(set);
  }
  function midOf(ctx){ return Math.round((ctx.min + ctx.max) / 2); }
  function quartiles(ctx){
    var span = ctx.max - ctx.min;
    return { q1: ctx.min + Math.round(span * 0.25), q3: ctx.max - Math.round(span * 0.25) };
  }
  function tierOf(row, rows){ return Math.min(2, Math.floor(row * 3 / rows)); }
  function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }

  // ---------- challenge pool (flavor text, tidak mengatur grid) ----------
  var CHALLENGES = [
    { tiers:[0,1,2], weight:function(){return 3;}, feasible:function(){return true;}, text:function(){return 'Harus GENAP';} },
    { tiers:[0,1,2], weight:function(){return 3;}, feasible:function(){return true;}, text:function(){return 'Harus GANJIL';} },
    { tiers:[0,1], weight:function(){return 3;}, feasible:function(c){return c.max>=3;}, text:function(){return 'Kelipatan 3';} },
    { tiers:[1,2], weight:function(){return 2;}, feasible:function(c){return c.max>=4;}, text:function(){return 'Kelipatan 4';} },
    { tiers:[1,2], weight:function(){return 2;}, feasible:function(c){return c.max>=5;}, text:function(){return 'Kelipatan 5';} },
    { tiers:[1], weight:function(){return 1;}, feasible:function(c){return c.max>=5;}, text:function(){return 'BUKAN kelipatan 5';} },
    { tiers:[1], weight:function(){return 2;}, feasible:function(c){return midOf(c)>c.min;}, text:function(c){return 'Harus di BAWAH '+midOf(c);} },
    { tiers:[1], weight:function(){return 2;}, feasible:function(c){return midOf(c)<c.max;}, text:function(c){return 'Harus di ATAS '+midOf(c);} },
    { tiers:[1,2], weight:function(){return 2;}, feasible:function(c){return (c.max-c.min)>=4;}, text:function(c){var q=quartiles(c); return 'Harus \u2264 '+q.q1+' atau \u2265 '+q.q3+' (tengah dilarang)';} },
    { tiers:[1,2], weight:function(){return 2;}, feasible:function(c){return c.col>0;}, text:function(){return 'Harus LEBIH BESAR dari kotak sebelah kiri';} },
    { tiers:[1,2], weight:function(){return 2;}, feasible:function(c){return c.row>0;}, text:function(){return 'Harus LEBIH KECIL dari kotak di atasnya';} },
    { tiers:[1,2], weight:function(){return 2;}, feasible:function(c){return c.linearIndex>0;}, text:function(){return 'Paritas harus BEDA dari kotak sebelumnya';} },
    { tiers:[2], weight:function(){return 3;}, feasible:function(c){return hasPrimeInRange(c.min,c.max);}, text:function(){return 'Harus bilangan PRIMA';} },
    { tiers:[2], weight:function(){return 2;}, feasible:function(c){return midOf(c)<c.max;}, text:function(c){return 'GANJIL dan di ATAS '+midOf(c);} },
    { tiers:[2], weight:function(){return 1;}, feasible:function(c){return c.min<=2&&c.max>=2;}, text:function(){return 'GENAP dan PRIMA sekaligus (cuma satu angka di dunia yang bisa\u2026)';} },
    { tiers:[2], weight:function(){return 2;}, feasible:function(){return true;}, text:function(){return 'Jumlah semua digitnya harus GENAP';} },
    { tiers:[2], weight:function(){return 2;}, feasible:function(c){return digitsInRange(c.min,c.max).length>0;}, text:function(c){var ds=digitsInRange(c.min,c.max); var d=ds[Math.floor(Math.random()*ds.length)]; return 'Harus mengandung digit '+d;} },
    { tiers:[2], weight:function(){return 1;}, feasible:function(c){return c.row>0 && c.max>=3;}, text:function(){return 'Kelipatan 3 DAN lebih besar dari kotak di atasnya';} },
    { tiers:[0,1,2], weight:function(t){return t===0?5:(t===1?2:1);}, feasible:function(){return true;}, text:function(){return 'BEBAS! Isi apa aja, asal jangan bentrok pas REVEAL nanti';}, type:'relief' },
    { tiers:[0,1,2], weight:function(t){return t===0?1:(t===1?3:5);}, feasible:function(){return true;}, text:function(){return 'REVEAL! Cocokkan kotak-kotak sejak REVEAL terakhir dengan pemain lain, sekarang.';}, type:'reveal' },
    { tiers:[0], weight:function(){return 2;}, feasible:function(){return true;}, text:function(){return 'SHIELD! Tempel di kotak mana aja yang kalian mau \u2014 kotak itu aman selamanya.';}, type:'helper' },
    { tiers:[0], weight:function(){return 2;}, feasible:function(){return true;}, text:function(){return 'BONUS X2! Tempel di kotak manapun, nilainya dihitung dobel kalau lolos.';}, type:'helper' },
    { tiers:[0], weight:function(){return 1;}, feasible:function(){return true;}, text:function(){return 'ASURANSI! Bentrok PERTAMA kalian di REVEAL manapun nanti, tetap dapat setengah poin.';}, type:'helper' }
  ];

  function pickChallenge(ctx){
    var tier = tierOf(ctx.row, ctx.rows);
    var pool = [];
    CHALLENGES.forEach(function(c){
      if (c.tiers.indexOf(tier) === -1) return;
      if (!c.feasible(ctx)) return;
      var w = c.weight(tier);
      if (w > 0) pool.push({ tpl: c, w: w });
    });
    var total = pool.reduce(function(a,p){return a+p.w;}, 0);
    var r = Math.random() * total;
    for (var i = 0; i < pool.length; i++){
      r -= pool[i].w;
      if (r <= 0) return { text: pool[i].tpl.text(ctx), type: pool[i].tpl.type || 'normal' };
    }
    var last = pool[pool.length-1].tpl;
    return { text: last.text(ctx), type: last.type || 'normal' };
  }

  function ctxFor(idx, cols, rows, min, max){
    return { linearIndex: idx, row: Math.floor(idx/cols), col: idx%cols, cols: cols, rows: rows, min: min, max: max };
  }

  // ---------- state ----------
  var state = {
    kertas: { min:1, max:10, size:3, idx:0, challenge:null },
    digital: { min:1, max:10, size:3, cells:[], stepperVal:1, challenge:null, tool:'number' }
  };

  function save(){ try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch(e){} }
  function load(){
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return;
      var parsed = JSON.parse(raw);
      if (parsed && parsed.kertas && parsed.digital) state = parsed;
    } catch(e){}
  }

  // ---------- DOM refs ----------
  var el = {};
  ['infoBtn','infoPanel','tabKertasBtn','tabDigitalBtn','modeKertas','modeDigital',
   'k-min','k-max','k-size','k-pos','k-grid','k-card','k-tag','k-text','k-next','k-reset',
   'd-min','d-max','d-size','d-pos','d-score','d-card','d-tag','d-text','d-draw','d-toolbar',
   'd-stepperWrap','d-dec','d-inc','d-val','d-toolHint','d-grid','d-reset'
  ].forEach(function(id){ el[id.replace(/-([a-zA-Z])/g, function(m,c){return c.toUpperCase();})] = document.getElementById(id); });

  // ---------- info panel ----------
  el.infoBtn.addEventListener('click', function(){
    el.infoPanel.style.display = (el.infoPanel.style.display === 'none') ? 'block' : 'none';
  });

  // ---------- tabs ----------
  el.tabKertasBtn.addEventListener('click', function(){ switchTab('kertas'); });
  el.tabDigitalBtn.addEventListener('click', function(){ switchTab('digital'); });
  function switchTab(name){
    var kertasOn = name === 'kertas';
    el.modeKertas.classList.toggle('active', kertasOn);
    el.modeDigital.classList.toggle('active', !kertasOn);
    el.tabKertasBtn.classList.toggle('active', kertasOn);
    el.tabDigitalBtn.classList.toggle('active', !kertasOn);
  }

  function applyCardStyle(cardEl, tagEl, textEl, result){
    cardEl.className = 'challenge-card' + (result.type !== 'normal' ? ' ' + result.type : '');
    var labels = { normal:'TANTANGAN', relief:'NAPAS', reveal:'REVEAL', helper:'BANTUAN' };
    tagEl.textContent = labels[result.type] || 'TANTANGAN';
    textEl.textContent = result.text;
  }

  // ================= MODE KERTAS (dispenser tantangan, posisi berurutan) =================
  function totalCellsK(){ var n = state.kertas.size; return n*n; }

  function renderMiniGridReadonly(container, idx, size){
    var total = size*size;
    container.style.gridTemplateColumns = 'repeat(' + size + ', 1fr)';
    var html = '';
    for (var i = 0; i < total; i++){
      var cls = 'cell';
      if (i < idx) cls += ' done';
      if (i === idx) cls += ' active';
      html += '<div class="' + cls + '">' + (i < idx ? '\u2713' : (i+1)) + '</div>';
    }
    container.innerHTML = html;
  }

  function renderKertas(){
    var s = state.kertas;
    var total = totalCellsK();
    if (s.idx >= total){
      el.kPos.textContent = 'GRID SELESAI \u2014 ' + total + '/' + total;
      el.kText.textContent = 'Semua kotak udah dapet tantangan. Cocokkan hasil akhir kalian, lalu mulai grid baru.';
      el.kCard.className = 'challenge-card';
      el.kTag.textContent = 'SELESAI';
      el.kNext.style.display = 'none';
    } else {
      var row = Math.floor(s.idx / s.size);
      el.kPos.textContent = 'KOTAK ' + (s.idx+1) + ' / ' + total + ' \u00b7 BARIS ' + (row+1);
      el.kNext.style.display = 'block';
      if (s.challenge) applyCardStyle(el.kCard, el.kTag, el.kText, s.challenge);
    }
    renderMiniGridReadonly(el.kGrid, s.idx, s.size);
  }

  function nextKertas(){
    var s = state.kertas;
    var total = totalCellsK();
    if (s.idx >= total) return;
    var ctx = ctxFor(s.idx, s.size, s.size, s.min, s.max);
    s.challenge = pickChallenge(ctx);
    s.idx += 1;
    save();
    renderKertas();
  }

  function resetKertas(){
    var s = state.kertas;
    s.min = clamp(parseInt(el.kMin.value)||1, 1, 9998);
    s.max = clamp(parseInt(el.kMax.value)||10, s.min+1, 9999);
    s.size = parseInt(el.kSize.value) || 3;
    s.idx = 0;
    s.challenge = null;
    save();
    el.kNext.style.display = 'block';
    el.kText.textContent = 'Tekan tombol di bawah buat mulai';
    el.kTag.textContent = 'TANTANGAN';
    el.kCard.className = 'challenge-card';
    renderKertas();
  }

  el.kNext.addEventListener('click', nextKertas);
  el.kReset.addEventListener('click', resetKertas);
  [el.kMin, el.kMax, el.kSize].forEach(function(input){
    input.addEventListener('change', resetKertas);
  });

  // ================= MODE DIGITAL (tap-to-place, bebas, tanpa aturan) =================
  // cells[i] = null | {type:'number', value:N} | {type:'shield'} | {type:'x2'}
  function totalCellsD(){ var n = state.digital.size; return n*n; }

  function computeScore(){
    return state.digital.cells.reduce(function(a,c){
      return a + (c && c.value !== null && c.value !== undefined ? c.value : 0);
    }, 0);
  }
  function filledCount(){
    return state.digital.cells.filter(function(c){ return c && c.value !== null && c.value !== undefined; }).length;
  }

  function renderDigital(){
    var s = state.digital;
    var total = totalCellsD();
    el.dScore.textContent = 'SKOR: ' + computeScore();
    el.dPos.textContent = 'TERISI: ' + filledCount() + ' / ' + total;

    if (s.challenge) applyCardStyle(el.dCard, el.dTag, el.dText, s.challenge);

    // stepper only shown in number mode
    el.dStepperWrap.style.display = (s.tool === 'number') ? 'flex' : 'none';
    s.stepperVal = clamp(s.stepperVal, s.min, s.max);
    el.dVal.textContent = s.stepperVal;

    var hints = {
      number: 'Ketuk kotak mana aja buat isi/ubah ANGKA-nya (Shield & x2 di kotak itu tetap nyala)',
      shield: 'Ketuk buat nyala/matiin \uD83D\uDEE1\uFE0F Shield di kotak itu \u2014 angkanya nggak keganggu',
      x2: 'Ketuk buat nyala/matiin \u2728 x2 di kotak itu \u2014 angkanya nggak keganggu',
      clear: 'Ketuk buat bersihin SEMUA isi kotak (angka + Shield + x2)'
    };
    el.dToolHint.textContent = hints[s.tool] || '';

    el.dToolbar.querySelectorAll('.toolbtn').forEach(function(btn){
      btn.classList.toggle('active', btn.getAttribute('data-tool') === s.tool);
    });

    renderGridInteractive();
    save();
  }

  function renderGridInteractive(){
    var s = state.digital;
    var total = totalCellsD();
    el.dGrid.style.gridTemplateColumns = 'repeat(' + s.size + ', 1fr)';
    var html = '';
    for (var i = 0; i < total; i++){
      var c = s.cells[i] || { value:null, shield:false, x2:false };
      var hasValue = c.value !== null && c.value !== undefined;
      var cls = 'cell' + (hasValue ? ' done' : '');
      var badges = '';
      if (c.shield) badges += '<span class="badge badge-shield">S</span>';
      if (c.x2) badges += '<span class="badge badge-x2">\u00d72</span>';
      var content = hasValue ? c.value : '';
      html += '<div class="' + cls + '" data-idx="' + i + '">' + badges + content + '</div>';
    }
    el.dGrid.innerHTML = html;
    el.dGrid.querySelectorAll('.cell').forEach(function(cellEl){
      cellEl.addEventListener('click', function(){
        var i = parseInt(cellEl.getAttribute('data-idx'));
        placeAt(i);
      });
    });
  }

  function placeAt(i){
    var s = state.digital;
    if (!s.cells[i]) s.cells[i] = { value:null, shield:false, x2:false };
    if (s.tool === 'number'){
      s.cells[i].value = s.stepperVal;
    } else if (s.tool === 'shield'){
      s.cells[i].shield = !s.cells[i].shield;
    } else if (s.tool === 'x2'){
      s.cells[i].x2 = !s.cells[i].x2;
    } else if (s.tool === 'clear'){
      s.cells[i] = { value:null, shield:false, x2:false };
    }
    renderDigital();
  }

  function drawChallengeDigital(){
    var s = state.digital;
    var rows = 3;
    var row = Math.floor(Math.random() * rows);
    var col = Math.floor(Math.random() * 3);
    var ctx = ctxFor(row * 3 + col, 3, rows, s.min, s.max);
    s.challenge = pickChallenge(ctx);
    save();
    renderDigital();
  }

  function resetDigital(){
    var s = state.digital;
    s.min = clamp(parseInt(el.dMin.value)||1, 1, 9998);
    s.max = clamp(parseInt(el.dMax.value)||10, s.min+1, 9999);
    s.size = parseInt(el.dSize.value) || 3;
    var total = s.size*s.size;
    s.cells = [];
    for (var i = 0; i < total; i++) s.cells.push({ value:null, shield:false, x2:false });
    s.stepperVal = s.min;
    s.challenge = null;
    s.tool = 'number';
    renderDigital();
  }

  el.dDraw.addEventListener('click', drawChallengeDigital);
  el.dToolbar.addEventListener('click', function(e){
    var btn = e.target.closest('.toolbtn');
    if (!btn) return;
    state.digital.tool = btn.getAttribute('data-tool');
    renderDigital();
  });
  el.dDec.addEventListener('click', function(){
    state.digital.stepperVal = clamp(state.digital.stepperVal - 1, state.digital.min, state.digital.max);
    el.dVal.textContent = state.digital.stepperVal;
    save();
  });
  el.dInc.addEventListener('click', function(){
    state.digital.stepperVal = clamp(state.digital.stepperVal + 1, state.digital.min, state.digital.max);
    el.dVal.textContent = state.digital.stepperVal;
    save();
  });
  el.dReset.addEventListener('click', resetDigital);
  [el.dMin, el.dMax, el.dSize].forEach(function(input){
    input.addEventListener('change', resetDigital);
  });

  // ---------- boot ----------
  load();
  el.kMin.value = state.kertas.min; el.kMax.value = state.kertas.max; el.kSize.value = state.kertas.size;
  el.dMin.value = state.digital.min; el.dMax.value = state.digital.max; el.dSize.value = state.digital.size;
  var expected = state.digital.size*state.digital.size;
  if (!state.digital.cells || state.digital.cells.length !== expected){
    state.digital.cells = [];
    for (var bi = 0; bi < expected; bi++) state.digital.cells.push({ value:null, shield:false, x2:false });
  }
  if (!state.digital.tool) state.digital.tool = 'number';
  renderKertas();
  renderDigital();
})();
