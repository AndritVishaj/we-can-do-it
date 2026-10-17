import {KEY,S,save,replace,key,day,sanitize} from './store.js';
import {esc,hash,verify,photo} from './security.js';
import {GOALS,LEN,MS,dayNo,done,tiles,stats} from './game.js';
const $=s=>document.querySelector(s),TABS=[['home','⌂','Home'],['diary','♡','Diary'],['game','★','Game'],['recipes','♧','Recipes'],['me','⚙','Safe']];
const B=['Berry oats','Avocado egg','Apple cinnamon','Greek yogurt','Spinach feta','Mango chia','Banana oat','Peanut butter','Garden chickpea','Lemon chicken'],
Y=['Breakfast bowl','Quick toast','Fresh salad','Warm grain bowl','Veggie wrap','One-pot soup','Roasted tray bake','Simple pasta','Colorful rice bowl','Light skillet'],
RC=Y.flatMap(y=>B.map(b=>`${y} with ${b.toLowerCase()}`)),IC=['🥣','🥑','🍓','🥗','🍲'];
let page=location.hash.slice(1),locked=!!S.pin,tt,away=0;
const toast=m=>{const t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(tt);tt=setTimeout(()=>t.hidden=true,2600)};
const card=(h,b)=>`<section class="card"><h3>${h}</h3>${b}</section>`;
const pin=(n='pin',l='PIN')=>`<label>${l}<input name="${n}" type="password" inputmode="numeric" pattern="[0-9]{4,8}" maxlength="8" autocomplete="off" required></label>`;
const stat=a=>`<div class="stats">${a.map(s=>`<div class="stat"><span>${s[0]}</span><b>${s[1]}</b><small>${s[2]}</small></div>`).join('')}</div>`;
const backup=()=>`<button class="btn soft" data-a="export">Export backup</button><label style="margin-top:12px">Import backup<input id="imp" type="file" accept="application/json,.json"></label>`;
const home=()=>{const d=day(),k=d.meals.reduce((n,m)=>n+m.c,0),w=Array.from({length:7},(_,i)=>{const x=new Date();x.setDate(x.getDate()-6+i);
  return`<div class="col"><div class="track"><i class="bar${i===6?' on':''}" data-h="${Math.max(4,Math.min(100,(S.days[key(x)]?.steps||0)/80))}"></i></div><small>${x.toLocaleDateString(undefined,{weekday:'short'})}</small></div>`}).join('');
  return`<h1>Welcome back</h1><p class="sub">One small win today is enough.</p>${stat([['👟',d.steps.toLocaleString(),'steps'],['💧',d.water,'glasses'],['🥗',d.meals.length,'meals'],['🔥',k,'kcal']])}${card('Steps this week',`<div class="week">${w}</div>`)}${card('Water',`<button class="btn" data-a="water">＋ Add a glass</button>`)}`};
const diary=()=>{const d=day();return`<h1>My diary</h1><p class="sub">Your daily check-in.</p>
<form id="daily" class="card"><h3>Today</h3><label>Steps<input name="steps" type="number" inputmode="numeric" min="0" max="100000" value="${d.steps||''}"></label><label>Water (glasses)<input name="water" type="number" inputmode="numeric" min="0" max="40" value="${d.water}"></label><label>Weight kg (optional)<input name="weight" inputmode="decimal" maxlength="6" value="${esc(d.weight)}"></label><label>A small win<textarea name="note" maxlength="300">${esc(d.note)}</textarea></label><button class="btn">Save today</button></form>
<form id="meal" class="card"><h3>Add a meal</h3><label>What did you eat?<input name="n" required maxlength="60"></label><label>Meal<select name="t">${['Breakfast','Lunch','Dinner','Snack'].map(x=>`<option>${x}</option>`).join('')}</select></label><label>Calories (optional)<input name="c" type="number" inputmode="numeric" min="0" max="5000"></label><label>Photo<input name="p" type="file" accept="image/*"></label><button class="btn">Save meal</button></form>
${d.meals.map((m,i)=>`<article class="meal">${m.p?`<img src="${esc(m.p)}" alt="">`:'<span class="ico">🥗</span>'}<div><b>${esc(m.n)}</b><small>${m.t} · ${m.c} kcal</small></div><button class="x" data-a="del" data-i="${i}" aria-label="Remove meal">×</button></article>`).join('')}`};
const game=()=>{
  if(!S.start)return`<h1>Game mode</h1><p class="sub">30 days. A reward every day you finish.</p>${card('How it works','<p>Do all 4 daily goals to earn a ⭐, that day’s reward and 100 XP. Missed a day? Keep going, the road map waits for you.</p><button class="btn" data-a="start">Start my 30 days</button>')}`;
  const n=dayNo(),T=tiles(),st=stats(T),d=day();
  return`<h1>Game mode</h1><p class="sub">${n>LEN?'Month complete':`Day ${n} of ${LEN}`}</p>${stat([['⭐',st.stars,'stars'],['🔥',st.streak,'streak'],['✨',st.xp,'XP'],['📅',Math.min(n,LEN),'day']])}
${n>LEN?card('Month complete 🎉',`<p>You finished ${st.stars} of ${LEN} days. Export your backup, then start a new month.</p>${backup()}<button class="btn" data-a="reset">Start a new month</button>`):card(`Day ${n} goals`,`<ul class="goals">${GOALS.map(g=>`<li class="${g[2](d)?'ok':''}"><span>${g[2](d)?'✅':g[0]}</span>${g[1]}</li>`).join('')}</ul>`)}
${card('Road map',`<div class="map">${T.map(x=>`<div class="tile ${x.s}"><small>${x.n}</small><span>${x.s==='done'?x.r:x.s==='today'?'🎯':x.s==='locked'?'🔒':'·'}</span></div>`).join('')}</div>`)}
${card('Badges',`<div class="badges">${MS.map(([c,e])=>`<div class="${st.stars>=c?'':'off'}">${e}<small>${c} stars</small></div>`).join('')}</div>`)}`};
const recipes=()=>`<h1>Recipe book</h1><p class="sub">100 simple ideas.</p><div class="recipes">${RC.map((n,i)=>`<article class="recipe"><span>${IC[i%5]}</span><h3>${n}</h3><small>${15+i%5*5} min</small></article>`).join('')}</div>`;
const me=()=>`<h1>Safe &amp; backup</h1><p class="sub">Your data stays on this phone.</p>${card('🔒 App lock',S.pin?`<button class="btn" data-a="lock">Lock now</button><form id="rmpin">${pin('pin','Current PIN')}<button class="btn soft">Remove PIN</button></form>`:`<form id="setpin">${pin('pin','New PIN (4–8 digits)')}<button class="btn">Set PIN</button></form>`)}${card('Backup',backup())}${card('Privacy','<p>No accounts, no tracking, no servers.</p><button class="btn danger" data-a="wipe">Erase all data</button>')}`;
const lockV=()=>`<form id="unlock" class="lockbox"><div class="logo">✳</div><h1>Welcome back</h1>${pin()}<button class="btn">Unlock</button><p id="lerr" class="sub"></p></form>`;
const views={home,diary,game,recipes,me};
function render(){if(!views[page])page='home';$('#lock').hidden=!locked;$('#app').hidden=$('#tabs').hidden=locked;
  if(locked){$('#lock').innerHTML=lockV();return}
  $('#app').innerHTML=views[page]();
  $('#tabs').innerHTML=TABS.map(([p,i,l])=>`<button data-p="${p}" class="${p===page?'on':''}"${p===page?' aria-current="page"':''}><span>${i}</span><small>${l}</small></button>`).join('');
  document.querySelectorAll('[data-h]').forEach(e=>e.style.height=e.dataset.h+'%')}
const run=f=>{const b=done(key());f();save();const a=done(key());render();if(S.start&&!b&&a)toast('Day complete! +100 XP 🎉')};
const exportData=()=>{const{pin,fails,lockUntil,...o}=S,a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(o)],{type:'application/json'}));a.download=`we-can-do-it-${key()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1e4)};
const ACT={water:()=>run(()=>{day().water++}),start:()=>run(()=>{S.start=key()}),lock:()=>{locked=true;render()},export:exportData,
  reset:()=>confirm('Start a new month? Make sure you exported a backup.')&&run(()=>{S.start=key()}),
  wipe:()=>{if(!confirm('Erase ALL data and PIN? This cannot be undone.'))return;localStorage.removeItem(KEY);replace(sanitize({}));locked=false;render()}};
document.addEventListener('click',e=>{const p=e.target.closest('[data-p]');if(p){page=p.dataset.p;history.replaceState(null,'','#'+page);render();scrollTo(0,0);return}
  const a=e.target.closest('[data-a]');if(!a)return;const i=+a.dataset.i;if(a.dataset.a==='del')run(()=>day().meals.splice(i,1));else ACT[a.dataset.a]?.()});
document.addEventListener('submit',async e=>{e.preventDefault();const f=e.target,v=Object.fromEntries(new FormData(f));
  if(f.id==='daily')run(()=>Object.assign(day(),{steps:+v.steps||0,water:+v.water||0,weight:v.weight,note:v.note.trim()}));
  else if(f.id==='meal'){let p='';try{if(v.p.size)p=await photo(v.p)}catch{return toast('Choose a photo under 8 MB')}run(()=>day().meals.push({n:v.n.trim(),t:v.t,c:+v.c||0,p}))}
  else if(f.id==='setpin'){if(!/^\d{4,8}$/.test(v.pin))return toast('Use 4–8 digits');S.pin=await hash(v.pin);save();render();toast('PIN set 🔒')}
  else if(f.id==='rmpin'){if(await verify(v.pin,S.pin)){S.pin=null;save();render();toast('PIN removed')}else toast('Wrong PIN')}
  else if(f.id==='unlock'){const w=S.lockUntil-Date.now();if(w>0)return $('#lerr').textContent=`Try again in ${Math.ceil(w/1000)}s`;
    if(await verify(v.pin,S.pin)){S.fails=0;locked=false;save();render()}else{S.fails++;if(S.fails>=5)S.lockUntil=Date.now()+3e4*2**Math.min(S.fails-5,6);save();$('#lerr').textContent='Wrong PIN'}}});
document.addEventListener('change',async e=>{if(e.target.id!=='imp')return;const f=e.target.files[0];if(!f)return;
  try{if(f.size>3e6)throw 0;const o=sanitize(JSON.parse(await f.text()));if(!confirm('Replace current data with this backup?'))return;o.pin=S.pin;replace(o);render();toast('Backup imported ✅')}catch{toast('Not a valid backup file')}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)away=Date.now();else if(S.pin&&Date.now()-away>3e4){locked=true;render()}});
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
render();
