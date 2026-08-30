"use strict";

const PROFESSIONS = {
  baker:{name:"Baker",rank:"A",icon:"🥐",color:"#EE8B58",color2:"#F5B26A",skill:"Bonus Shift",short:"Ambil dan tempatkan 1 Worker ekstra. Worker bonus tidak menyalakan skill."},
  recruiter:{name:"Recruiter",rank:"2",icon:"🧶",color:"#9B72CF",color2:"#C499EA",skill:"Talent Search",short:"Ambil sampai 3 Worker, pilih 1 untuk ditempatkan, sisanya kembali ke tas."},
  courier:{name:"Courier",rank:"3",icon:"📦",color:"#D95F61",color2:"#F28A72",skill:"Express Move",short:"Pindahkan 1 TOP WORKER yang adjacent ke hex valid mana pun."},
  mechanic:{name:"Mechanic",rank:"4",icon:"🔧",color:"#547EA8",color2:"#74A1C8",skill:"Fine Tune",short:"Geser hingga 2 TOP WORKER adjacent, masing-masing sejauh 1 hex."},
  barista:{name:"Barista",rank:"5",icon:"☕",color:"#B77B4A",color2:"#D9A36E",skill:"Table Swap",short:"Tukar posisi 2 TOP WORKER pada dua hex berbeda."},
  manager:{name:"Manager",rank:"6",icon:"📣",color:"#4D9A79",color2:"#76BE91",skill:"Team Lead",short:"Aktifkan skill 1 TOP WORKER adjacent. Rantai Manager dibatasi."}
};
const PROF_IDS = Object.keys(PROFESSIONS);
const DIRECTIONS = [[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];
const MAX_STACK = 3;

const JOB_TEMPLATES = [
  ["Morning Bakery Rush","line",["baker","courier","barista"]],
  ["New Hire Orientation","triangle",["recruiter","manager","barista"]],
  ["Express Lunch Run","line",["courier","courier","baker"]],
  ["Workshop Tune-Up","triangle",["mechanic","mechanic","manager"]],
  ["Coffee Break Meeting","line",["barista","manager","recruiter"]],
  ["Team Briefing","triangle",["manager","manager","courier"]],
  ["Fresh Batch Dispatch","line",["baker","baker","courier"]],
  ["Talent Delivery","triangle",["recruiter","courier","manager"]],
  ["Repair & Refresh","line",["mechanic","barista","mechanic"]],
  ["Café Recruitment Day","triangle",["barista","recruiter","recruiter"]],
  ["Boss Needs Coffee","line",["manager","barista","barista"]],
  ["Bakery Maintenance","triangle",["baker","mechanic","mechanic"]],
  ["Parcel Sorting Shift","line",["courier","manager","courier"]],
  ["Interview Snack Tray","triangle",["recruiter","baker","barista"]],
  ["Emergency Repair Crew","line",["manager","mechanic","courier"]],
  ["Office Breakfast","triangle",["baker","manager","recruiter"]],
  ["Recruitment Express","line",["recruiter","courier","recruiter"]],
  ["Machine Coffee Calibration","triangle",["mechanic","barista","manager"]],
  ["Bread Board Meeting","line",["baker","manager","baker"]],
  ["Late-Night Delivery","triangle",["courier","barista","mechanic"]],
  ["Toolbox Dispatch","line",["mechanic","courier","manager"]],
  ["Hiring Breakfast","triangle",["recruiter","baker","manager"]],
  ["Cafe Supply Run","line",["barista","courier","baker"]],
  ["Workshop Interview","triangle",["mechanic","recruiter","manager"]],
  ["Double Espresso Shift","line",["barista","barista","courier"]],
  ["Team Repair Huddle","triangle",["manager","mechanic","recruiter"]],
  ["Morning Route Check","line",["courier","mechanic","baker"]],
  ["Bakery Hiring Day","triangle",["baker","recruiter","recruiter"]],
  ["Supervisor Delivery","line",["manager","courier","manager"]],
  ["Coffee Machine Rush","triangle",["barista","mechanic","courier"]],
  ["Craft Fair Setup","line",["recruiter","mechanic","barista"]],
  ["Priority Breakfast","triangle",["manager","baker","courier"]],
  ["Courier Team Sync","line",["courier","recruiter","manager"]],
  ["Café Workshop","triangle",["barista","baker","mechanic"]],
  ["Recruiter Check-In","line",["recruiter","manager","recruiter"]],
  ["All-Hands Prep","triangle",["manager","baker","mechanic"]]
];

const JOBS = JOB_TEMPLATES.map((j,i)=>({id:`J${String(i+1).padStart(2,"0")}`,title:j[0],shape:j[1],jobs:j[2]}));
const els = {};
let state = null;
let toastTimer = null;

function cacheDom(){[
  "setupScreen","startBtn","name1","name2","name3","playerStrip","jobMarket","hexBoard","bagCount","jobDeckCount","turnNo",
  "phaseLabel","activePlayerName","phaseName","currentWorker","phaseTitle","phaseHint","mainActionBtn","skipAbilityBtn","abilityDoneBtn",
  "abilityChoice","legendRow","toast","turnFlash","turnFlashText","choiceModal","choiceEyebrow","choiceTitle","choiceText","workerChoices",
  "skillBtn","rulesBtn","resetBtn","skillDialog","rulesDialog","skillGrid","endOverlay","newGameBtn"
].forEach(id=>els[id]=document.getElementById(id));}

function boardCoords(){
  const out=[];
  for(let q=-2;q<=2;q++) for(let r=-2;r<=2;r++){const s=-q-r;if(Math.max(Math.abs(q),Math.abs(r),Math.abs(s))<=2) out.push({q,r,key:`${q},${r}`});}
  const extra=[[0,-3],[1,-3],[3,-3],[3,-1],[0,3],[-1,3],[-3,3],[-3,1]];
  extra.forEach(([q,r])=>out.push({q,r,key:`${q},${r}`}));
  return out;
}

function makeToken(jobs){return{uid:`t-${Math.random().toString(36).slice(2,8)}-${Date.now().toString(36)}`,jobs:[...jobs],dual:jobs.length>1};}
function createState(names){
  const board={};boardCoords().forEach(c=>board[c.key]=[]);
  const starters=shuffle(PROF_IDS.map(p=>makeToken([p])));
  DIRECTIONS.map(([q,r])=>`${q},${r}`).forEach((key,i)=>board[key].push(starters[i]));
  const bag=[];
  PROF_IDS.forEach(p=>{for(let i=0;i<5;i++) bag.push(makeToken([p]));});
  [["baker","recruiter"],["recruiter","mechanic"],["mechanic","barista"],["barista","manager"],["manager","courier"],["courier","baker"]].forEach(pair=>bag.push(makeToken(pair)));
  const deck=shuffle(JOBS);
  return{board,bag:shuffle(bag),jobDeck:deck.slice(3),market:deck.slice(0,3),players:names,active:0,turn:1,phase:"draw",currentToken:null,placedCoord:null,abilityState:null,abilityDepth:0,claimUsed:false,ended:false};
}

function init(){cacheDom();bind();buildLegend();buildSkillBook();}
function bind(){
  els.startBtn.addEventListener("click",startGame);
  els.mainActionBtn.addEventListener("click",handleMainAction);
  els.skipAbilityBtn.addEventListener("click",enterScorePhase);
  els.abilityDoneBtn.addEventListener("click",finishCurrentAbility);
  els.skillBtn.addEventListener("click",()=>els.skillDialog.showModal());
  els.rulesBtn.addEventListener("click",()=>els.rulesDialog.showModal());
  els.resetBtn.addEventListener("click",()=>{if(confirm("Mulai ulang MIAW-CRAFT V2?")) resetToSetup();});
  els.newGameBtn.addEventListener("click",resetToSetup);
}

function startGame(){
  const names=[els.name1.value.trim()||"Mochi",els.name2.value.trim()||"Yuki",els.name3.value.trim()||"Kuro"];
  state=createState(names);els.setupScreen.classList.add("hidden");els.endOverlay.classList.remove("show");renderAll();flashTurn();
}
function resetToSetup(){state=null;els.endOverlay.classList.remove("show");els.setupScreen.classList.remove("hidden");}

function handleMainAction(){
  if(!state||state.ended)return;
  if(state.phase==="draw")drawWorker();
  else if(state.phase==="ability")requestAbility();
  else if(state.phase==="score")endTurn();
}
function drawWorker(){
  if(!state.bag.length){showToast("Worker Bag kosong. Selesaikan shift terakhir.");enterScorePhase();return;}
  state.currentToken=drawRandom();state.phase="place";showToast(`${tokenName(state.currentToken)} masuk shift.`);renderAll();
}
function drawRandom(){if(!state.bag.length)return null;const i=Math.floor(Math.random()*state.bag.length);return state.bag.splice(i,1)[0];}
function handleHexClick(key){
  if(!state||state.ended)return;
  if(state.phase==="place"||state.phase==="bonus-place") return placeCurrentToken(key);
  if(state.phase==="ability-action"&&state.abilityState) handleAbilityHexClick(key);
}
function placeCurrentToken(key){
  if(!state.currentToken||state.board[key].length>=MAX_STACK)return;
  state.board[key].push(state.currentToken);state.placedCoord=key;
  const wasBonus=state.phase==="bonus-place";const placed=state.currentToken;state.currentToken=null;
  if(wasBonus){showToast(`${tokenName(placed)} ditempatkan sebagai Worker ekstra.`);finishCurrentAbility();}
  else{state.phase="ability";showToast(`${tokenName(placed)} siap memakai skill.`);renderAll();}
}
function requestAbility(){
  const token=topToken(state.placedCoord);if(!token)return enterScorePhase();
  if(token.dual)return showDualChoice(token,state.placedCoord,0,"DUAL WORKER · PILIH 1 SKILL");
  beginAbility(token.jobs[0],state.placedCoord,0);
}
function showDualChoice(token,origin,depth,label){
  els.abilityChoice.innerHTML=`<span class="micro-label">${label}</span>`+token.jobs.map(p=>`<button class="ability-option" data-job="${p}">${PROFESSIONS[p].icon} ${PROFESSIONS[p].skill}</button>`).join("");
  els.abilityChoice.classList.remove("hidden");
  els.abilityChoice.querySelectorAll("[data-job]").forEach(btn=>btn.addEventListener("click",()=>{els.abilityChoice.classList.add("hidden");beginAbility(btn.dataset.job,origin,depth);}));
}
function beginAbility(id,origin,depth=0){
  state.abilityDepth=depth;showToast(`${PROFESSIONS[id].icon} ${PROFESSIONS[id].skill}`);
  if(id==="baker")return abilityBaker();
  if(id==="recruiter")return abilityRecruiter();
  if(id==="courier")state.abilityState={type:"courier",origin,step:"source",source:null};
  if(id==="mechanic")state.abilityState={type:"mechanic",origin,step:"source",source:null,moves:0,used:[]};
  if(id==="barista")state.abilityState={type:"barista",step:"first",first:null};
  if(id==="manager")state.abilityState={type:"manager",origin,step:"target",depth};
  state.phase="ability-action";renderAll();
}
function abilityBaker(){
  if(!state.bag.length){showToast("Tas kosong. Bonus Shift tidak dapat dipakai.");return finishCurrentAbility();}
  state.currentToken=drawRandom();state.phase="bonus-place";state.abilityState={type:"baker"};renderAll();
}
function abilityRecruiter(){
  if(!state.bag.length){showToast("Tas kosong. Talent Search tidak dapat dipakai.");return finishCurrentAbility();}
  const options=[];for(let i=0;i<3&&state.bag.length;i++)options.push(drawRandom());state.abilityState={type:"recruiter",options};
  els.choiceText.textContent="Pilih satu. Worker lain kembali ke Worker Bag. Worker terpilih langsung ditempatkan dan tidak menyalakan skill.";
  els.workerChoices.innerHTML=options.map((t,i)=>`<button class="worker-choice-btn" data-choice="${i}"><div class="choice-token" style="background:${tokenBackground(t)}">🐱</div><strong>${tokenName(t)}</strong></button>`).join("");
  els.choiceModal.classList.add("show");els.workerChoices.querySelectorAll("[data-choice]").forEach(b=>b.addEventListener("click",()=>chooseRecruiter(Number(b.dataset.choice))));
}
function chooseRecruiter(index){
  const opts=state.abilityState?.options||[];const chosen=opts[index];opts.forEach((t,i)=>{if(i!==index)state.bag.push(t);});state.bag=shuffle(state.bag);els.choiceModal.classList.remove("show");state.currentToken=chosen;state.phase="bonus-place";renderAll();
}
function handleAbilityHexClick(key){const a=state.abilityState;if(!a)return;if(a.type==="courier")handleCourier(key,a);if(a.type==="mechanic")handleMechanic(key,a);if(a.type==="barista")handleBarista(key,a);if(a.type==="manager")handleManager(key,a);}
function handleCourier(key,a){
  if(a.step==="source"){if(!isAdjacent(a.origin,key)||!topToken(key))return;a.source=key;a.step="destination";return renderAll();}
  if(key===a.source||state.board[key].length>=MAX_STACK)return;state.board[key].push(state.board[a.source].pop());showToast("Courier memindahkan satu Worker.");finishCurrentAbility();
}
function handleMechanic(key,a){
  if(a.step==="source"){if(!isAdjacent(a.origin,key)||!topToken(key)||a.used.includes(key))return;a.source=key;a.step="destination";return renderAll();}
  if(!isAdjacent(a.source,key)||key===a.source||state.board[key].length>=MAX_STACK)return;
  const source=a.source;state.board[key].push(state.board[source].pop());a.used.push(source);a.moves++;a.source=null;a.step="source";
  if(a.moves>=2||!availableMechanicSources(a).length){showToast(`Mechanic menyelesaikan ${a.moves} pergeseran.`);finishCurrentAbility();}else{showToast("Mechanic boleh menggeser satu Worker lagi atau selesai.");renderAll();}
}
function availableMechanicSources(a){return neighborKeys(a.origin).filter(k=>topToken(k)&&!a.used.includes(k));}
function handleBarista(key,a){
  if(!topToken(key))return;if(a.step==="first"){a.first=key;a.step="second";return renderAll();}
  if(key===a.first)return;const t1=state.board[a.first].pop(),t2=state.board[key].pop();state.board[a.first].push(t2);state.board[key].push(t1);showToast("Barista menukar dua TOP WORKER.");finishCurrentAbility();
}
function handleManager(key,a){
  if(!isAdjacent(a.origin,key))return;const token=topToken(key);if(!token)return;
  if(a.depth>=1&&token.jobs.includes("manager")){showToast("Manager tidak boleh meneruskan rantai Manager.");return;}
  if(token.dual)return showDualChoice(token,key,a.depth+1,"TEAM LEAD · PILIH SKILL YANG DICONTOH");
  beginAbility(token.jobs[0],key,a.depth+1);
}
function finishCurrentAbility(){state.abilityState=null;state.currentToken=null;els.choiceModal.classList.remove("show");els.abilityChoice.classList.add("hidden");enterScorePhase();}
function enterScorePhase(){state.abilityState=null;state.currentToken=null;els.choiceModal.classList.remove("show");els.abilityChoice.classList.add("hidden");state.phase="score";renderAll();const ready=state.market.filter(isJobMatch).length;showToast(ready?`${ready} Job publik cocok. Pilih maksimal satu.`:"Belum ada Job publik yang cocok.");}
function claimJob(slot){
  if(state.phase!=="score"||state.claimUsed)return;const job=state.market[slot];if(!job||!isJobMatch(job))return;
  state.claimUsed=true;const who=state.players[state.active];showToast(`✓ ${who} mengklaim ${job.title}. Catat poin secara fisik.`);
  if(state.jobDeck.length)state.market[slot]=state.jobDeck.shift();else state.market.splice(slot,1);renderAll();
}
function endTurn(){
  if(state.phase!=="score")return;
  if(!state.bag.length){state.ended=true;els.endOverlay.classList.add("show");renderAll();return;}
  state.active=(state.active+1)%3;state.turn++;state.phase="draw";state.currentToken=null;state.placedCoord=null;state.abilityState=null;state.claimUsed=false;renderAll();flashTurn();
}

function isJobMatch(job){const groups=job.shape==="line"?getLineTriplets():getTriangleTriplets();return groups.some(g=>groupMatches(g,job));}
function groupMatches(group,job){const tokens=group.map(topToken);if(tokens.some(t=>!t))return false;if(job.shape==="line")return seq(tokens,job.jobs)||seq([...tokens].reverse(),job.jobs);return permutations([0,1,2]).some(order=>job.jobs.every((p,i)=>tokenMatches(tokens[order[i]],p)));}
function seq(tokens,jobs){return jobs.every((p,i)=>tokenMatches(tokens[i],p));}
function tokenMatches(token,p){return !!token&&token.jobs.includes(p);}
function getLineTriplets(){
  const keys=new Set(Object.keys(state.board)),seen=new Set(),out=[];const dirs=[[1,0],[0,1],[1,-1]];
  keys.forEach(key=>{const[q,r]=parseKey(key);dirs.forEach(([dq,dr])=>{const g=[`${q},${r}`,`${q+dq},${r+dr}`,`${q+2*dq},${r+2*dr}`];if(g.every(k=>keys.has(k))){const sig=[...g].sort().join("|");if(!seen.has(sig)){seen.add(sig);out.push(g);}}});});return out;
}
function getTriangleTriplets(){
  const keys=new Set(Object.keys(state.board)),seen=new Set(),out=[];keys.forEach(key=>{const[q,r]=parseKey(key);for(let i=0;i<6;i++){const[d1q,d1r]=DIRECTIONS[i],[d2q,d2r]=DIRECTIONS[(i+1)%6];const g=[key,`${q+d1q},${r+d1r}`,`${q+d2q},${r+d2r}`];if(g.every(k=>keys.has(k))){const sig=[...g].sort().join("|");if(!seen.has(sig)){seen.add(sig);out.push(g);}}}});return out;
}
function permutations(arr){if(arr.length<=1)return[arr];const out=[];arr.forEach((item,i)=>{const rest=[...arr.slice(0,i),...arr.slice(i+1)];permutations(rest).forEach(p=>out.push([item,...p]));});return out;}
function topToken(key){const s=state.board[key];return s&&s.length?s[s.length-1]:null;}
function parseKey(k){return k.split(",").map(Number);}
function neighborKeys(key){const[q,r]=parseKey(key);return DIRECTIONS.map(([dq,dr])=>`${q+dq},${r+dr}`).filter(k=>Object.prototype.hasOwnProperty.call(state.board,k));}
function isAdjacent(a,b){return neighborKeys(a).includes(b);}

function renderAll(){if(!state)return;renderPlayers();renderBoard();renderMarket();renderStatus();renderPhase();}
function renderPlayers(){
  const colors=["#e98250","#6c91bd","#739d76"];
  els.playerStrip.innerHTML=state.players.map((n,i)=>`<div class="player-chip ${i===state.active&&!state.ended?"active":""}" style="--player:${colors[i]}"><span class="player-num">P${i+1}</span><div><strong>${escapeHtml(n)}</strong><small>${i===state.active&&!state.ended?"ACTIVE TURN":"WAITING"}</small></div></div>`).join("");
}
function renderBoard(){
  const coords=boardCoords(),size=47,centerX=355,centerY=272;els.hexBoard.replaceChildren();
  coords.forEach(({q,r,key})=>{const x=size*Math.sqrt(3)*(q+r/2),y=size*1.5*r;const cell=document.createElement("button");cell.className="hex-cell";cell.style.left=`${centerX+x-46}px`;cell.style.top=`${centerY+y-52}px`;cell.dataset.key=key;const interaction=getCellInteraction(key);if(interaction)cell.classList.add(interaction);const stack=state.board[key];if(stack.length)cell.appendChild(renderTokenStack(stack));cell.addEventListener("click",()=>handleHexClick(key));els.hexBoard.appendChild(cell);});
}
function getCellInteraction(key){
  if(state.phase==="place"||state.phase==="bonus-place")return state.board[key].length<MAX_STACK?"valid-target":"invalid";
  const a=state.abilityState;if(state.phase!=="ability-action"||!a)return null;
  if(a.type==="courier"){if(a.step==="source")return isAdjacent(a.origin,key)&&topToken(key)?"valid-source":null;if(key===a.source)return"selected-source";return state.board[key].length<MAX_STACK?"valid-target":null;}
  if(a.type==="mechanic"){if(a.step==="source")return isAdjacent(a.origin,key)&&topToken(key)&&!a.used.includes(key)?"valid-source":null;if(key===a.source)return"selected-source";return isAdjacent(a.source,key)&&state.board[key].length<MAX_STACK?"valid-target":null;}
  if(a.type==="barista"){if(a.step==="first")return topToken(key)?"valid-source":null;if(key===a.first)return"selected-source";return topToken(key)?"valid-target":null;}
  if(a.type==="manager")return isAdjacent(a.origin,key)&&topToken(key)?"valid-source":null;return null;
}
function renderTokenStack(stack){
  const wrap=document.createElement("div");wrap.className="token-stack";if(stack.length>=2){const x=document.createElement("div");x.className="stack-shadow one";wrap.appendChild(x);}if(stack.length>=3){const x=document.createElement("div");x.className="stack-shadow two";wrap.appendChild(x);}const t=stack[stack.length-1],disc=document.createElement("div");disc.className="cat-token";disc.style.background=tokenBackground(t);disc.innerHTML=`<span>🐱</span><span class="job-icon-badge">${t.jobs.map(j=>PROFESSIONS[j].icon).join("")}</span>`;wrap.appendChild(disc);if(stack.length>1){const c=document.createElement("span");c.className="stack-count";c.textContent=stack.length;wrap.appendChild(c);}return wrap;
}
function renderMarket(){
  els.jobMarket.replaceChildren();state.market.forEach((job,i)=>{const ready=state.phase==="score"&&!state.claimUsed&&isJobMatch(job),card=document.createElement("article");card.className=`job-card ${ready?"ready":""} ${state.claimUsed?"claimed-lock":""}`;card.style.setProperty("--accent",PROFESSIONS[job.jobs[0]].color);card.innerHTML=`<div class="job-top"><span class="job-code">${job.id}</span><span class="shape-badge">${job.shape.toUpperCase()}</span></div><h3>${escapeHtml(job.title)}</h3>`;card.appendChild(renderMiniPattern(job));const btn=document.createElement("button");btn.className="claim-btn";btn.type="button";btn.disabled=!ready;btn.textContent=state.claimUsed?"CLAIM USED":ready?"✓ CLAIM JOB":"BELUM COCOK";btn.addEventListener("click",()=>claimJob(i));card.appendChild(btn);els.jobMarket.appendChild(card);});
}
function renderMiniPattern(job){
  const box=document.createElement("div");box.className="mini-pattern";const pos=job.shape==="line"?[{x:8,y:20},{x:72,y:20},{x:136,y:20}]:[{x:72,y:0},{x:28,y:39},{x:116,y:39}];const centers=pos.map(p=>({x:p.x+19,y:p.y+19})),edges=job.shape==="line"?[[0,1],[1,2]]:[[0,1],[1,2],[2,0]];edges.forEach(([a,b])=>{const dx=centers[b].x-centers[a].x,dy=centers[b].y-centers[a].y,l=Math.hypot(dx,dy),angle=Math.atan2(dy,dx)*180/Math.PI,line=document.createElement("i");line.className="mini-line";line.style.left=`${centers[a].x}px`;line.style.top=`${centers[a].y}px`;line.style.width=`${l}px`;line.style.transform=`rotate(${angle}deg)`;box.appendChild(line);});job.jobs.forEach((p,i)=>{const n=document.createElement("span");n.className="mini-node";n.style.left=`${pos[i].x}px`;n.style.top=`${pos[i].y}px`;n.style.setProperty("--node",PROFESSIONS[p].color);n.textContent=PROFESSIONS[p].icon;box.appendChild(n);});return box;
}
function renderStatus(){els.bagCount.textContent=state.bag.length;els.jobDeckCount.textContent=state.jobDeck.length;els.turnNo.textContent=state.turn;els.activePlayerName.textContent=state.players[state.active];els.phaseName.textContent=phaseText(state.phase);}
function renderPhase(){
  const token=state.currentToken||(["ability","ability-action"].includes(state.phase)&&state.placedCoord?topToken(state.placedCoord):null);
  els.mainActionBtn.classList.remove("hidden");els.skipAbilityBtn.classList.add("hidden");els.abilityDoneBtn.classList.add("hidden");
  els.phaseLabel.textContent="PLAY PHASE";
  if(state.phase==="draw"){els.phaseTitle.textContent="Ambil Worker dari tas";els.phaseHint.textContent=`${state.players[state.active]} memulai turn baru.`;els.mainActionBtn.textContent="Ambil Worker";}
  if(state.phase==="place"){els.phaseLabel.textContent="PLAY · PLACE";els.phaseTitle.textContent="Pilih hex untuk Worker";els.phaseHint.textContent="Hex hangat adalah lokasi legal. Maksimal 3 Worker per hex.";els.mainActionBtn.classList.add("hidden");}
  if(state.phase==="bonus-place"){els.phaseLabel.textContent="SKILL · BONUS PLACE";els.phaseTitle.textContent="Tempatkan Worker bonus";els.phaseHint.textContent="Worker bonus tidak menyalakan skill baru.";els.mainActionBtn.classList.add("hidden");}
  if(state.phase==="ability"){els.phaseLabel.textContent="SKILL PHASE";els.phaseTitle.textContent=token?`${tokenName(token)} dapat memakai skill`:"Skill opsional";els.phaseHint.textContent=token?tokenSkillText(token):"Lewati jika tidak diperlukan.";els.mainActionBtn.textContent="Aktifkan Skill";els.skipAbilityBtn.classList.remove("hidden");}
  if(state.phase==="ability-action"){renderAbilityInstruction();els.mainActionBtn.classList.add("hidden");if(state.abilityState?.type==="mechanic"&&state.abilityState.moves>0)els.abilityDoneBtn.classList.remove("hidden");}
  if(state.phase==="score"){const ready=state.market.filter(isJobMatch).length;els.phaseLabel.textContent="SCORE PHASE";els.phaseTitle.textContent=state.claimUsed?"Claim turn ini sudah dipakai":ready?`${ready} Job dapat diklaim`:"Belum ada Job yang cocok";els.phaseHint.textContent=state.claimUsed?"Job lain tetap terbuka untuk pemain berikutnya.":ready?"Pilih satu kartu hijau. Maksimal satu claim per turn.":"Akhiri turn untuk lanjut ke pemain berikutnya.";els.mainActionBtn.textContent=state.bag.length?"Akhiri Turn":"Akhiri Shift";}
  renderCurrentWorker(token);renderFlow();
}
function renderAbilityInstruction(){const a=state.abilityState,labels={courier:["COURIER · EXPRESS MOVE",a.step==="source"?"Pilih Worker adjacent":"Pilih tujuan baru",a.step==="source"?"Target harus TOP WORKER di sebelah Courier.":"Tujuan boleh hex legal mana pun."],mechanic:["MECHANIC · FINE TUNE",a.step==="source"?`Pilih Worker adjacent ${a.moves?"kedua":""}`:"Geser satu hex",a.step==="source"?"Boleh memindahkan hingga dua Worker berbeda.":"Tujuan harus adjacent dengan sumber."],barista:["BARISTA · TABLE SWAP",a.step==="first"?"Pilih Worker pertama":"Pilih Worker kedua","Dua TOP WORKER akan bertukar posisi."],manager:["MANAGER · TEAM LEAD","Pilih Worker adjacent","Manager menyalin satu skill dari Worker tersebut."]};const [l,t,h]=labels[a.type];els.phaseLabel.textContent=l;els.phaseTitle.textContent=t;els.phaseHint.textContent=h;}
function renderCurrentWorker(token){if(!token){els.currentWorker.innerHTML=`<div class="worker-placeholder">?</div><div><small>Worker berikutnya</small><strong>Belum diambil</strong></div>`;return;}els.currentWorker.innerHTML=`<div class="mini-token" style="background:${tokenBackground(token)}">🐱</div><div><small>${token.dual?"Dual Worker":"Worker aktif"}</small><strong>${tokenName(token)}</strong></div>`;}
function renderFlow(){const mapping={draw:0,place:1,"bonus-place":2,ability:2,"ability-action":2,score:3},idx=mapping[state.phase]??0;document.querySelectorAll("[data-flow]").forEach((el,i)=>{el.classList.toggle("done",i<idx);el.classList.toggle("now",i===idx);});}
function buildLegend(){els.legendRow.innerHTML=PROF_IDS.map(id=>{const p=PROFESSIONS[id];return`<div class="legend-item"><span class="legend-swatch" style="background:linear-gradient(145deg,${p.color2},${p.color})">${p.icon}</span><div><strong>${p.rank} · ${p.name}</strong><small>${p.skill}</small></div></div>`;}).join("");}
function buildSkillBook(){els.skillGrid.innerHTML=PROF_IDS.map(id=>{const p=PROFESSIONS[id];return`<section class="skill-entry"><div class="skill-head"><span class="skill-icon" style="background:linear-gradient(145deg,${p.color2},${p.color})">${p.icon}</span><div><h3>${p.rank} · ${p.name}</h3><small>${p.skill}</small></div></div><p>${p.short}</p></section>`;}).join("");}
function phaseText(p){return({draw:"Draw Worker",place:"Place Worker","bonus-place":"Bonus Place",ability:"Skill","ability-action":"Skill Action",score:"Score / Claim"})[p]||p;}
function tokenName(t){return t.jobs.map(j=>PROFESSIONS[j].name).join(" + ");}
function tokenSkillText(t){return t.dual?`Pilih salah satu: ${t.jobs.map(j=>PROFESSIONS[j].skill).join(" / ")}.`:PROFESSIONS[t.jobs[0]].short;}
function tokenBackground(t){if(!t)return"#ddd";if(!t.dual){const p=PROFESSIONS[t.jobs[0]];return`linear-gradient(145deg,${p.color2},${p.color})`;}const a=PROFESSIONS[t.jobs[0]].color,b=PROFESSIONS[t.jobs[1]].color;return`linear-gradient(135deg,${a} 0 48%,${b} 52% 100%)`;}
function showToast(msg){clearTimeout(toastTimer);els.toast.textContent=msg;els.toast.classList.add("show");toastTimer=setTimeout(()=>els.toast.classList.remove("show"),2200);}
function flashTurn(){els.turnFlashText.textContent=`P${state.active+1} TURN · ${state.players[state.active]}`;els.turnFlash.classList.add("show");setTimeout(()=>els.turnFlash.classList.remove("show"),520);}
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function escapeHtml(v){return String(v).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}

document.addEventListener("DOMContentLoaded",init);
