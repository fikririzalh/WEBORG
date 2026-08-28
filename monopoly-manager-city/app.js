/* ===================== Data & migration ===================== */
const STORAGE_KEY = "cities"; // kept identical to the original app so existing saved data still loads

const FLAGS = {
  indonesia:"🇮🇩", "united states":"🇺🇸", usa:"🇺🇸", amerika:"🇺🇸", japan:"🇯🇵", jepang:"🇯🇵",
  china:"🇨🇳", tiongkok:"🇨🇳", korea:"🇰🇷", "south korea":"🇰🇷", "korea selatan":"🇰🇷",
  singapore:"🇸🇬", singapura:"🇸🇬", malaysia:"🇲🇾", thailand:"🇹🇭", vietnam:"🇻🇳", philippines:"🇵🇭", filipina:"🇵🇭",
  india:"🇮🇳", "united kingdom":"🇬🇧", uk:"🇬🇧", inggris:"🇬🇧", england:"🇬🇧", france:"🇫🇷", perancis:"🇫🇷", prancis:"🇫🇷",
  germany:"🇩🇪", jerman:"🇩🇪", italy:"🇮🇹", italia:"🇮🇹", spain:"🇪🇸", spanyol:"🇪🇸", portugal:"🇵🇹",
  netherlands:"🇳🇱", belanda:"🇳🇱", russia:"🇷🇺", rusia:"🇷🇺", brazil:"🇧🇷", brasil:"🇧🇷", canada:"🇨🇦", kanada:"🇨🇦",
  australia:"🇦🇺", mexico:"🇲🇽", meksiko:"🇲🇽", egypt:"🇪🇬", mesir:"🇪🇬", turkey:"🇹🇷", turki:"🇹🇷",
  "saudi arabia":"🇸🇦", "arab saudi":"🇸🇦", uae:"🇦🇪", "united arab emirates":"🇦🇪", switzerland:"🇨🇭", swiss:"🇨🇭",
  sweden:"🇸🇪", swedia:"🇸🇪", norway:"🇳🇴", norwegia:"🇳🇴", finland:"🇫🇮", denmark:"🇩🇰", poland:"🇵🇱", polandia:"🇵🇱",
  greece:"🇬🇷", yunani:"🇬🇷", argentina:"🇦🇷", chile:"🇨🇱", "new zealand":"🇳🇿", "selandia baru":"🇳🇿",
};
function flagFor(country){
  if(!country) return "🏙️";
  const key = country.trim().toLowerCase();
  return FLAGS[key] || "🏙️";
}

function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }
function toNum(v){ const n = Number(v); return Number.isFinite(n) ? n : 0; }
function fmtNum(n){ return toNum(n).toLocaleString('id-ID'); }
function esc(v=''){ return String(v).replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])); }

let cities = [];
function loadData(){
  let raw = [];
  try{ raw = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }catch(e){ raw = []; }
  // migrate old entries: ensure id/createdAt on cities and properties, numeric price fields
  cities = raw.map(c => ({
    id: c.id || uid(),
    name: c.name || 'Tanpa Nama',
    country: c.country || '',
    createdAt: c.createdAt || Date.now(),
    properties: (c.properties||[]).map(p => ({
      id: p.id || uid(),
      name: p.name || 'Tanpa Nama',
      status: p.status || 'Available',
      house: toNum(p.house), apart: toNum(p.apart), hotel: toNum(p.hotel), landmark: toNum(p.landmark),
      createdAt: p.createdAt || Date.now(),
    })),
  }));
  saveData(); // persist normalized shape back
}
function saveData(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(cities)); }

/* ===================== Derived stats ===================== */
function propertyValue(p){ return toNum(p.house)+toNum(p.apart)+toNum(p.hotel)+toNum(p.landmark); }
function cityValue(city){ return city.properties.reduce((sum,p)=>sum+propertyValue(p),0); }
function cityStatusCounts(city){
  const counts = {Available:0, Owned:0, Developing:0, Landmark:0};
  city.properties.forEach(p=>{ if(counts[p.status]===undefined) counts[p.status]=0; counts[p.status]++; });
  return counts;
}
function globalStats(){
  const totalCities = cities.length;
  let totalProperties=0, totalOwned=0, totalValue=0;
  cities.forEach(c=>{
    totalProperties += c.properties.length;
    totalValue += cityValue(c);
    c.properties.forEach(p=>{ if(p.status==='Owned' || p.status==='Landmark') totalOwned++; });
  });
  return {totalCities, totalProperties, totalOwned, totalValue};
}

/* ===================== UI state ===================== */
let selectedCityId = null;
let editingCityId = null;
let editingPropertyId = null;
let citySearchTerm = '';
let citySortMode = 'name';
let propSearchTerm = '';
let propStatusFilter = '';
let pendingConfirmAction = null;

const $ = s => document.querySelector(s);
const E = {
  globalStats: $('#globalStats'), cityGrid: $('#cityGrid'), cityEmpty: $('#cityEmpty'),
  homeView: $('#homeView'), detailView: $('#detailView'),
  citySearch: $('#citySearch'), citySort: $('#citySort'),
  detailFlag: $('#detailFlag'), detailTitle: $('#detailTitle'), detailCountry: $('#detailCountry'),
  cityStatsRow: $('#cityStatsRow'), propertyGrid: $('#propertyGrid'), propertyEmpty: $('#propertyEmpty'),
  propSearch: $('#propSearch'), propStatusFilter: $('#propStatusFilter'),
  cityModal: $('#cityModal'), cityModalTitle: $('#cityModalTitle'), cityName: $('#cityName'), cityCountry: $('#cityCountry'),
  propertyModal: $('#propertyModal'), propertyModalTitle: $('#propertyModalTitle'),
  propertyName: $('#propertyName'), propertyStatus: $('#propertyStatus'),
  house: $('#house'), apart: $('#apart'), hotel: $('#hotel'), landmark: $('#landmark'),
  confirmModal: $('#confirmModal'), confirmMessage: $('#confirmMessage'), confirmOkBtn: $('#confirmOkBtn'), confirmCancelBtn: $('#confirmCancelBtn'),
  toast: $('#toast'), exportBtn: $('#exportBtn'), importBtn: $('#importBtn'), importFile: $('#importFile'),
  countryList: $('#countryList'),
};

function toast(msg){ E.toast.textContent=msg; E.toast.classList.add('show'); clearTimeout(toast._t); toast._t=setTimeout(()=>E.toast.classList.remove('show'), 1900); }

/* ===================== Rendering: global stats ===================== */
function statCard(label, value){ return `<div class="stat-card"><div class="stat-label">${label}</div><div class="stat-value">${value}</div></div>`; }
function renderGlobalStats(){
  const s = globalStats();
  E.globalStats.innerHTML = [
    statCard('Total Kota', s.totalCities),
    statCard('Total Properti', s.totalProperties),
    statCard('Owned / Landmark', s.totalOwned),
    statCard('Estimasi Nilai', fmtNum(s.totalValue)),
  ].join('');
}

/* ===================== Rendering: city grid ===================== */
function getFilteredSortedCities(){
  let list = cities.filter(c=>{
    if(!citySearchTerm) return true;
    const t = citySearchTerm.toLowerCase();
    return c.name.toLowerCase().includes(t) || c.country.toLowerCase().includes(t);
  });
  const byName = (a,b)=>a.name.localeCompare(b.name);
  if(citySortMode==='name') list.sort(byName);
  else if(citySortMode==='name-desc') list.sort((a,b)=>byName(b,a));
  else if(citySortMode==='properties') list.sort((a,b)=>b.properties.length-a.properties.length);
  else if(citySortMode==='value') list.sort((a,b)=>cityValue(b)-cityValue(a));
  else if(citySortMode==='newest') list.sort((a,b)=>b.createdAt-a.createdAt);
  return list;
}
function statusDotsMarkup(counts){
  return Object.entries(counts).filter(([,n])=>n>0).map(([status,n])=>
    `<span class="badge ${status}">${status} ${n}</span>`
  ).join('') || `<span class="badge Available">Belum ada properti</span>`;
}
function renderCities(){
  const list = getFilteredSortedCities();
  E.cityEmpty.hidden = cities.length>0;
  E.cityGrid.hidden = cities.length===0;
  if(cities.length===0){ E.cityGrid.innerHTML=''; return; }
  if(list.length===0){
    E.cityGrid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-emoji">🔍</div><p>Tidak ada kota yang cocok dengan pencarian.</p></div>`;
    return;
  }
  E.cityGrid.innerHTML = list.map(c=>{
    const counts = cityStatusCounts(c);
    return `<div class="card">
      <div class="card-top">
        <div class="card-title"><span class="card-flag">${flagFor(c.country)}</span><div><h2>${esc(c.name)}</h2><div class="card-sub">${esc(c.country)||'—'}</div></div></div>
      </div>
      <div class="status-dots">${statusDotsMarkup(counts)}</div>
      <div class="card-value">💰 ${fmtNum(cityValue(c))}</div>
      <div class="card-sub">${c.properties.length} properti</div>
      <div class="card-actions">
        <button class="open-btn" onclick="openCity('${c.id}')">Buka</button>
        <button class="edit-btn" onclick="openCityForm('${c.id}')">Edit</button>
        <button class="del-btn" onclick="deleteCity('${c.id}')">Hapus</button>
      </div>
    </div>`;
  }).join('');
}

/* ===================== Rendering: detail / properties ===================== */
function getCity(id){ return cities.find(c=>c.id===id); }
function openCity(id){
  selectedCityId = id;
  E.homeView.classList.add('hidden');
  E.detailView.classList.remove('hidden');
  propSearchTerm=''; propStatusFilter=''; E.propSearch.value=''; E.propStatusFilter.value='';
  renderDetail();
}
function backHome(){
  selectedCityId = null;
  E.homeView.classList.remove('hidden');
  E.detailView.classList.add('hidden');
  renderCities();
}
function renderDetail(){
  const city = getCity(selectedCityId);
  if(!city){ backHome(); return; }
  E.detailFlag.textContent = flagFor(city.country);
  E.detailTitle.textContent = city.name;
  E.detailCountry.textContent = city.country || '—';
  const counts = cityStatusCounts(city);
  E.cityStatsRow.innerHTML = [
    statCard('Total Properti', city.properties.length),
    statCard('Owned', counts.Owned||0),
    statCard('Developing', counts.Developing||0),
    statCard('Estimasi Nilai', fmtNum(cityValue(city))),
  ].join('');
  renderProperties();
}
function getFilteredProperties(city){
  return city.properties.filter(p=>{
    if(propStatusFilter && p.status!==propStatusFilter) return false;
    if(propSearchTerm && !p.name.toLowerCase().includes(propSearchTerm.toLowerCase())) return false;
    return true;
  });
}
function renderProperties(){
  const city = getCity(selectedCityId);
  if(!city) return;
  const list = getFilteredProperties(city);
  E.propertyEmpty.hidden = city.properties.length>0;
  E.propertyGrid.hidden = city.properties.length===0;
  if(city.properties.length===0){ E.propertyGrid.innerHTML=''; return; }
  if(list.length===0){
    E.propertyGrid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-emoji">🔍</div><p>Tidak ada properti yang cocok.</p></div>`;
    return;
  }
  E.propertyGrid.innerHTML = list.map(p=>`<div class="card">
    <div class="card-top">
      <h3>🏢 ${esc(p.name)}</h3>
      <span class="badge ${p.status}">${p.status}</span>
    </div>
    <div class="tier-mini">
      <div>🏠<b>${fmtNum(p.house)}</b></div>
      <div>🏬<b>${fmtNum(p.apart)}</b></div>
      <div>🏨<b>${fmtNum(p.hotel)}</b></div>
      <div>⭐<b>${fmtNum(p.landmark)}</b></div>
    </div>
    <div class="card-value">💰 ${fmtNum(propertyValue(p))}</div>
    <div class="card-actions">
      <button class="edit-btn" onclick="openPropertyForm('${p.id}')">Edit</button>
      <button class="del-btn" onclick="deleteProperty('${p.id}')">Hapus</button>
    </div>
  </div>`).join('');
}

/* ===================== City CRUD ===================== */
function refreshCountryList(){
  const set = new Set(cities.map(c=>c.country).filter(Boolean));
  E.countryList.innerHTML = [...set].map(c=>`<option value="${esc(c)}">`).join('');
}
function openCityForm(id){
  editingCityId = id || null;
  const city = id ? getCity(id) : null;
  E.cityModalTitle.textContent = city ? 'Edit Kota' : 'Tambah Kota';
  E.cityName.value = city ? city.name : '';
  E.cityCountry.value = city ? city.country : '';
  refreshCountryList();
  E.cityModal.classList.add('show');
  setTimeout(()=>E.cityName.focus(), 50);
}
function closeCityModal(){ E.cityModal.classList.remove('show'); editingCityId=null; }
function saveCity(){
  const name = E.cityName.value.trim();
  const country = E.cityCountry.value.trim();
  if(!name){ toast('Nama kota tidak boleh kosong'); return; }
  if(editingCityId){
    const city = getCity(editingCityId);
    city.name = name; city.country = country;
  } else {
    cities.push({ id: uid(), name, country, createdAt: Date.now(), properties: [] });
  }
  saveData();
  renderGlobalStats(); renderCities();
  if(selectedCityId) renderDetail();
  closeCityModal();
  toast('Kota disimpan ✔');
}
function deleteCity(id){
  const city = getCity(id);
  askConfirm(`Hapus kota "${city.name}" beserta ${city.properties.length} propertinya?`, ()=>{
    cities = cities.filter(c=>c.id!==id);
    saveData();
    if(selectedCityId===id) backHome();
    renderGlobalStats(); renderCities();
    toast('Kota dihapus');
  });
}

/* ===================== Property CRUD ===================== */
function openPropertyForm(id){
  editingPropertyId = id || null;
  const city = getCity(selectedCityId);
  const prop = id ? city.properties.find(p=>p.id===id) : null;
  E.propertyModalTitle.textContent = prop ? 'Edit Properti' : 'Tambah Properti';
  E.propertyName.value = prop ? prop.name : '';
  E.propertyStatus.value = prop ? prop.status : 'Available';
  E.house.value = prop ? prop.house : '';
  E.apart.value = prop ? prop.apart : '';
  E.hotel.value = prop ? prop.hotel : '';
  E.landmark.value = prop ? prop.landmark : '';
  E.propertyModal.classList.add('show');
  setTimeout(()=>E.propertyName.focus(), 50);
}
function closeProperty(){ E.propertyModal.classList.remove('show'); editingPropertyId=null; }
function saveProperty(){
  const name = E.propertyName.value.trim();
  if(!name){ toast('Nama properti tidak boleh kosong'); return; }
  const city = getCity(selectedCityId);
  const data = {
    name, status: E.propertyStatus.value,
    house: toNum(E.house.value), apart: toNum(E.apart.value),
    hotel: toNum(E.hotel.value), landmark: toNum(E.landmark.value),
  };
  if(editingPropertyId){
    const prop = city.properties.find(p=>p.id===editingPropertyId);
    Object.assign(prop, data);
  } else {
    city.properties.push({ id: uid(), createdAt: Date.now(), ...data });
  }
  saveData();
  renderGlobalStats(); renderDetail(); renderCities();
  closeProperty();
  toast('Properti disimpan ✔');
}
function deleteProperty(id){
  const city = getCity(selectedCityId);
  const prop = city.properties.find(p=>p.id===id);
  askConfirm(`Hapus properti "${prop.name}"?`, ()=>{
    city.properties = city.properties.filter(p=>p.id!==id);
    saveData();
    renderGlobalStats(); renderDetail(); renderCities();
    toast('Properti dihapus');
  });
}

/* ===================== Confirm modal ===================== */
function askConfirm(message, onConfirm, okLabel){
  E.confirmMessage.textContent = message;
  E.confirmOkBtn.textContent = okLabel || 'Hapus';
  E.confirmOkBtn.className = okLabel ? 'primary-btn' : 'danger-btn';
  pendingConfirmAction = onConfirm;
  E.confirmModal.classList.add('show');
}
function closeConfirm(){ E.confirmModal.classList.remove('show'); pendingConfirmAction=null; }

/* ===================== Export / Import ===================== */
function exportData(){
  const blob = new Blob([JSON.stringify(cities, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const d = new Date();
  a.href = url;
  a.download = `monopoly-city-manager-backup-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}.json`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Data diexport 📦');
}
function importDataFromFile(file){
  const reader = new FileReader();
  reader.onload = () => {
    let parsed;
    try{ parsed = JSON.parse(reader.result); }
    catch(e){ toast('File tidak valid'); return; }
    if(!Array.isArray(parsed)){ toast('Format file tidak dikenali'); return; }
    askConfirm(`Import akan MENGGANTI semua data saat ini (${cities.length} kota) dengan data dari file (${parsed.length} kota). Lanjutkan?`, ()=>{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      loadData();
      renderGlobalStats(); renderCities();
      if(selectedCityId) backHome();
      toast('Data berhasil diimport ✔');
    }, 'Ya, Import');
  };
  reader.readAsText(file);
}

/* ===================== Bind ===================== */
function bind(){
  $('#addCityBtn').addEventListener('click', ()=>openCityForm());
  $('#backBtn').addEventListener('click', backHome);
  $('#editCityBtn').addEventListener('click', ()=>openCityForm(selectedCityId));
  $('#addPropertyBtn').addEventListener('click', ()=>openPropertyForm());

  E.citySearch.addEventListener('input', ()=>{ citySearchTerm=E.citySearch.value; renderCities(); });
  E.citySort.addEventListener('change', ()=>{ citySortMode=E.citySort.value; renderCities(); });
  E.propSearch.addEventListener('input', ()=>{ propSearchTerm=E.propSearch.value; renderProperties(); });
  E.propStatusFilter.addEventListener('change', ()=>{ propStatusFilter=E.propStatusFilter.value; renderProperties(); });

  E.cityModal.addEventListener('click', e=>{ if(e.target===E.cityModal) closeCityModal(); });
  E.propertyModal.addEventListener('click', e=>{ if(e.target===E.propertyModal) closeProperty(); });
  E.confirmModal.addEventListener('click', e=>{ if(e.target===E.confirmModal) closeConfirm(); });
  E.confirmCancelBtn.addEventListener('click', closeConfirm);
  E.confirmOkBtn.addEventListener('click', ()=>{ const fn=pendingConfirmAction; closeConfirm(); if(fn) fn(); });

  E.exportBtn.addEventListener('click', exportData);
  E.importBtn.addEventListener('click', ()=>E.importFile.click());
  E.importFile.addEventListener('change', e=>{ const f=e.target.files[0]; if(f) importDataFromFile(f); e.target.value=''; });

  document.addEventListener('keydown', e=>{
    if(e.key==='Escape'){ closeCityModal(); closeProperty(); closeConfirm(); }
    if(e.key==='Enter'){
      if(E.cityModal.classList.contains('show')) saveCity();
      else if(E.propertyModal.classList.contains('show')) saveProperty();
    }
  });
}

/* ===================== Init ===================== */
function init(){
  loadData();
  renderGlobalStats();
  renderCities();
  bind();
}
init();
