import {KEY,S,save,replace,key,day,sanitize} from './store.js';
import {esc,hash,verify,photo} from './security.js';
import {GOALS,LEN,MS,dayNo,done,tiles,stats} from './game.js';
const $=s=>document.querySelector(s),TABS=[['home','⌂','Home'],['diary','♡','Diary'],['game','★','Game'],['progress','⌁','Records'],['recipes','♧','Recipes']];
const B=['Berry oats','Avocado egg','Apple cinnamon','Greek yogurt','Spinach feta','Mango chia','Banana oat','Peanut butter','Garden chickpea','Lemon chicken'],
Y=['Breakfast bowl','Quick toast','Fresh salad','Warm grain bowl','Veggie wrap','One-pot soup','Roasted tray bake','Simple pasta','Colorful rice bowl','Light skillet'],
RC=Y.flatMap(y=>B.map(b=>`${y} with ${b.toLowerCase()}`)),IC=['🥣','🥑','🍓','🥗','🍲'];
let page=location.hash.slice(1),locked=!!S.pin,tt,away=0;
const toast=m=>{const t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(tt);tt=setTimeout(()=>t.hidden=true,2600)};
const card=(h,b)=>`<section class="card"><h3>${h}</h3>${b}</section>`;
const pin=(n='pin',l='PIN')=>`<label>${l}<input name="${n}" type="password" inputmode="numeric" pattern="[0-9]{4,8}" maxlength="8" autocomplete="off" required></label>`;
const stat=a=>`<div class="stats">${a.map(s=>`<div class="stat"><span>${s[0]}</span><b>${s[1]}</b><small>${s[2]}</small></div>`).join('')}</div>`;
const backup=()=>`<button class="btn soft" data-a="export">Export backup</button><label style="margin-top:12px">Import backup<input id="imp" type="file" accept="application/json,.json"></label>`;
const EMPTY=()=>({steps:0,water:0,weight:'',note:'',meals:[]});
const rows=()=>{const ks=Object.keys(S.days).sort();if(!ks.length)return[];const[y,m,d]=ks[0].split('-').map(Number),o=[];
  for(let x=new Date(y,m-1,d);key(x)<=key()&&o.length<1500;x.setDate(x.getDate()+1)){const k=key(x);o.push([k,S.days[k]||EMPTY()])}return o.reverse()};
const sum=(R,f)=>R.reduce((n,r)=>n+f(r[1]),0);
const home=()=>{const d=day(),k=sum([[0,d]],x=>x.meals.reduce((n,m)=>n+m.c,0)),w=Array.from({length:7},(_,i)=>{const x=new Date();x.setDate(x.getDate()-6+i);
  return`<div class="col"><div class="track"><i class="bar${i===6?' on':''}" data-h="${Math.max(4,Math.min(100,(S.days[key(x)]?.steps||0)/80))}"></i></div><small>${x.toLocaleDateString(undefined,{weekday:'short'})}</small></div>`}).join('');
  return`<div class="hello"><div><p class="eyebrow">${new Date().toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'})} ✨</p><h1>Welcome back!</h1><p class="sub">Let’s make room for one small win today.</p></div><button class="btn" data-p="diary">＋ Add today's update</button></div>
<section class="hero"><div><small>A FRESH START, EVERY DAY</small><h2>You don't have to be perfect.<br>Just keep showing up.</h2><p>Track your little wins. Celebrate where you are.</p><button class="btn" data-p="diary">Let's log today →</button></div></section>
${stat([['👟',d.steps.toLocaleString(),'steps'],['💧',d.water,'glasses'],['🥗',d.meals.length,'meals'],['🔥',k,'kcal']])}
<div class="two">${card('Steps this week',`<div class="week">${w}</div>`)}${card('Water check-in',`<button class="btn" data-a="water">＋ Add a glass</button>`)}</div>
<div class="quick"><button data-p="diary"><b>♡ Log a meal</b><small>Add food &amp; a photo</small></button><button data-p="game"><b>★ Game mode</b><small>Your 30-day road map</small></button><button data-p="recipes"><b>♧ Find a new favorite</b><small>Browse healthy recipes</small></button></div>`};
const progress=()=>{const R=rows();return`<h1>Records</h1><p class="sub">Every day that passes is saved here.</p>${stat([['📅',R.length,'days'],['✅',R.filter(r=>done(r[0])).length,'goals met'],['👟',sum(R,x=>x.steps).toLocaleString(),'steps'],['💧',sum(R,x=>x.water),'glasses']])}
${card('Export &amp; import',`<button class="btn" data-a="pdf">Save as PDF</button><button class="btn soft" data-a="csv">Export CSV</button><button class="btn soft" data-a="export">Export JSON (full backup)</button><label style="margin-top:12px">Import JSON or CSV<input id="imp" type="file" accept=".json,.csv,application/json,text/csv"></label>`)}
${R.map(([k,r])=>`<article class="meal"><div><b>${k}</b><small>👟 ${r.steps} · 💧 ${r.water} · 🥗 ${r.meals.length}${r.note?' · '+esc(r.note):''}</small></div><span>${done(k)?'✅':''}</span></article>`).join('')||card('Nothing yet','<p>Log your first day in the diary.</p>')}
<table id="print"><tr><th>Date</th><th>Steps</th><th>Water</th><th>Meals</th><th>kcal</th><th>Weight</th><th>Note</th></tr>${R.map(([k,r])=>`<tr><td>${k}</td><td>${r.steps}</td><td>${r.water}</td><td>${esc(r.meals.map(m=>m.n).join(', '))}</td><td>${sum([[0,r]],x=>x.meals.reduce((n,m)=>n+m.c,0))}</td><td>${esc(r.weight)}</td><td>${esc(r.note)}</td></tr>`).join('')}</table>`};
const q=v=>'"'+String(v).replace(/^[=+\-@]/,"'$&").replace(/"/g,'""')+'"';
const dl=(n,t,m)=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:m}));a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1e4)};
const exportCsv=()=>dl(`we-can-do-it-${key()}.csv`,'Date,Steps,Water,Meals,Kcal,Weight,Note,GoalsMet\n'+rows().reverse().map(([k,r])=>[k,r.steps,r.water,q(r.meals.map(m=>m.n).join('; ')),r.meals.reduce((n,m)=>n+m.c,0),q(r.weight),q(r.note),done(k)?1:0].join(',')).join('\n'),'text/csv');
const csvParse=t=>{const R=[];let r=[],c='',o=0;for(let i=0;i<t.length;i++){const h=t[i];if(o){if(h==='"'){if(t[i+1]==='"'){c+='"';i++}else o=0}else c+=h}else if(h==='"')o=1;else if(h===','){r.push(c);c=''}else if(h==='\n'||h==='\r'){if(h==='\r'&&t[i+1]==='\n')i++;r.push(c);c='';R.push(r);r=[]}else c+=h}if(c||r.length){r.push(c);R.push(r)}return R};
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
const views={home,diary,game,progress,recipes,me};
function render(){if(!views[page])page='home';document.body.classList.toggle('locked',locked);$('#lock').hidden=!locked;
  if(locked){$('#lock').innerHTML=lockV();return}
  $('#app').innerHTML=views[page]();
  const nav=TABS.map(([p,i,l])=>`<button data-p="${p}" class="${p===page?'on':''}"${p===page?' aria-current="page"':''}><span>${i}</span><small>${l}</small></button>`).join('');
  $('#tabs').innerHTML=nav;
  $('#side').innerHTML=`<a class="brand"><i>✳</i>we can <b>do it</b></a><p class="lab">YOUR SPACE</p>${nav}<div class="push"></div><div class="quote"><b>Small steps still move you forward.</b><small>YOU'RE DOING GREAT</small></div>`;
  $('#crumb').textContent=(TABS.find(t=>t[0]===page)||[0,0,'Safe'])[2];
  $('#date').textContent=new Date().toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'});
  document.querySelectorAll('[data-h]').forEach(e=>e.style.height=e.dataset.h+'%')}
const run=f=>{const b=done(key());f();save();const a=done(key());render();if(S.start&&!b&&a)toast('Day complete! +100 XP 🎉')};
const exportData=()=>{const{pin,fails,lockUntil,...o}=S;dl(`we-can-do-it-${key()}.json`,JSON.stringify(o),'application/json')};
const ACT={water:()=>run(()=>{day().water++}),start:()=>run(()=>{S.start=key()}),lock:()=>{locked=true;render()},export:exportData,csv:exportCsv,pdf:()=>{toast('Choose “Save as PDF” in the print sheet');setTimeout(()=>window.print(),400)},
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
  try{if(f.size>3e6)throw 0;const t=await f.text();
    if(/\.csv$/i.test(f.name)){const R=csvParse(t).slice(1,1500).filter(r=>/^\d{4}-\d{2}-\d{2}$/.test(r[0]));if(!R.length)throw 0;
      run(()=>R.forEach(r=>Object.assign(day(r[0]),{steps:+r[1]||0,water:+r[2]||0,weight:(r[5]||'').replace(/^'(?=[=+\-@])/,''),note:(r[6]||'').replace(/^'(?=[=+\-@])/,'')})));toast(`${R.length} days imported`)}
    else{const o=sanitize(JSON.parse(t));if(!confirm('Replace current data with this backup?'))return;o.pin=S.pin;replace(o);render();toast('Backup imported ✅')}}
  catch{toast('Not a valid backup file')}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)away=Date.now();else if(S.pin&&Date.now()-away>3e4){locked=true;render()}});
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
render();
