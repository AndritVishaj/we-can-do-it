import {KEY,S,save,replace,key,day,sanitize} from './store.js';
import {esc,photo} from './security.js';
import {GOALS,LEN,MS,dayNo,done,tiles,stats} from './game.js';
const $=s=>document.querySelector(s),TABS=[['home','⌂','Home'],['diary','♡','Diary'],['game','★','Game'],['progress','⌁','Admin'],['recipes','♧','Recipes']];
const B=['Berry oats','Avocado egg','Apple cinnamon','Greek yogurt','Spinach feta','Mango chia','Banana oat','Peanut butter','Garden chickpea','Lemon chicken'],
Y=['Breakfast bowl','Quick toast','Fresh salad','Warm grain bowl','Veggie wrap','One-pot soup','Roasted tray bake','Simple pasta','Colorful rice bowl','Light skillet'],
HOW=['Spoon a base of oats or yogurt into a bowl|Top with {b}|Add fruit, nuts or seeds and serve','Toast two slices of bread|Prepare {b} and pile it on top|Season with salt, pepper and olive oil','Wash and chop mixed greens and vegetables|Add {b}|Dress with olive oil and lemon, toss and serve','Cook a cup of rice or quinoa|Warm {b} in a pan|Combine in a bowl and season','Warm a wrap or flatbread|Fill with salad leaves and {b}|Roll tightly and slice in half','Sauté onion and garlic in a pot|Add stock, vegetables and {b}|Simmer 20 minutes, season and serve','Heat the oven to 200°C|Toss vegetables and {b} with oil and salt on a tray|Roast 25–30 minutes until golden','Boil pasta until just tender|Warm {b} with garlic and oil in a pan|Toss with the pasta and a splash of cooking water','Cook rice and cut colorful vegetables|Put {b} on top|Season with soy sauce or lemon','Heat a little oil in a skillet|Cook vegetables and {b} for 8–10 minutes|Season and serve warm'],
IC=['🥣','🥑','🍓','🥗','🍲'],
RC=Y.flatMap((y,j)=>B.map((b,k)=>({n:`${y} with ${b.toLowerCase()}`,m:15+(j+k)%5*5,e:IC[(j*10+k)%5],i:`${b}\nOlive oil\nSalt and pepper\nFresh vegetables or fruit`,s:HOW[j].replaceAll('{b}',b.toLowerCase()).split('|').join('\n')})));
let page=location.hash.slice(1),tt,wk=0,rec=null;
const toast=m=>{const t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(tt);tt=setTimeout(()=>t.hidden=true,2600)};
const card=(h,b)=>`<section class="card"><h3>${h}</h3>${b}</section>`,stat=a=>`<div class="stats">${a.map(s=>`<div class="stat"><span>${s[0]}</span><b>${s[1]}</b><small>${s[2]}</small></div>`).join('')}</div>`;
const EMPTY=()=>({steps:0,water:0,note:'',w:[],meals:[]}),lw=d=>d.w.length?d.w[d.w.length-1].v:null,L=v=>`${+(+v).toFixed(2)} L`,kc=d=>d.meals.reduce((n,m)=>n+m.c,0),sum=(R,f)=>R.reduce((n,r)=>n+f(r[1]??r),0);
const fmt=(x,o)=>x.toLocaleDateString(undefined,o);
const backup=()=>`<button class="btn soft" data-a="export">Export JSON (full backup)</button><label>Import JSON or CSV<input id="imp" type="file" accept=".json,.csv,application/json,text/csv"></label>`;
const rows=()=>{const ks=Object.keys(S.days).sort();if(!ks.length)return[];const[y,m,d]=ks[0].split('-').map(Number),o=[];for(let x=new Date(y,m-1,d);key(x)<=key()&&o.length<1500;x.setDate(x.getDate()+1)){const k=key(x);o.push([k,S.days[k]||EMPTY()])}return o.reverse()};
const wkDays=()=>{const t=new Date();t.setDate(t.getDate()-(t.getDay()+6)%7+wk*7);return Array.from({length:7},(_,i)=>{const x=new Date(t);x.setDate(t.getDate()+i);const k=key(x);return[k,S.days[k]||EMPTY(),x]})};
const home=()=>{const d=day(),w=Array.from({length:7},(_,i)=>{const x=new Date();x.setDate(x.getDate()-6+i);return`<div class="col"><div class="track"><i class="bar${i===6?' on':''}" data-h="${Math.max(4,Math.min(100,(S.days[key(x)]?.steps||0)/80))}"></i></div><small>${fmt(x,{weekday:'short'})}</small></div>`}).join('');
  return`<div class="hello"><div><p class="eyebrow">${fmt(new Date(),{weekday:'long',month:'long',day:'numeric'})} ✨</p><h1>Welcome back!</h1><p class="sub">Let’s make room for one small win today.</p></div><button class="btn" data-p="diary">＋ Add today's update</button></div>
<section class="hero"><div><small>A FRESH START, EVERY DAY</small><h2>You don't have to be perfect.<br>Just keep showing up.</h2><p>Track your little wins. Celebrate where you are.</p><button class="btn" data-p="diary">Let's log today →</button></div></section>
${stat([['👟',d.steps.toLocaleString(),'steps'],['💧',L(d.water),'water'],['🥗',d.meals.length,'meals'],['⚖️',lw(d)?lw(d)+' kg':'—','weight']])}
<div class="two">${card('Steps this week',`<div class="week">${w}</div>`)}${card('Water check-in',`<p class="sub">${L(d.water)} today · goal 2 L</p><button class="btn" data-a="water">＋ Add 0.25 L</button>`)}</div>
<div class="quick"><button data-p="diary"><b>♡ Log a meal</b><small>Add food &amp; a photo</small></button><button data-p="game"><b>★ Game mode</b><small>Your 30-day road map</small></button><button data-p="recipes"><b>♧ Find a new favorite</b><small>Browse healthy recipes</small></button></div>`};
const diary=()=>{const d=day();return`<h1>My diary</h1><p class="sub">Your daily check-in.</p>
<form id="wt" class="card"><h3>⚖️ Update my weight</h3><label>Weight (kg)<input name="v" type="number" inputmode="decimal" step="0.1" min="20" max="400" required></label><label>Time<input name="t" type="time" value="${new Date().toTimeString().slice(0,5)}" required></label><button class="btn">Add weight</button>${d.w.map((x,i)=>`<div class="meal"><div><b>${x.v} kg</b><small>${x.t}</small></div><button type="button" class="x" data-a="delw" data-i="${i}" aria-label="Remove weight">×</button></div>`).join('')}</form>
<form id="daily" class="card"><h3>Today</h3><label>Steps<input name="steps" type="number" inputmode="numeric" min="0" max="100000" value="${d.steps||''}"></label><label>Water (litres)<input name="water" type="number" inputmode="decimal" step="0.05" min="0" max="20" value="${d.water}"></label><label>A small win<textarea name="note" maxlength="300">${esc(d.note)}</textarea></label><button class="btn">Save today</button><button type="button" class="btn soft" data-a="water">＋ Add 0.25 L water</button></form>
<form id="meal" class="card"><h3>Add a meal</h3><label>What did you eat?<input name="n" required maxlength="60"></label><label>Meal<select name="t">${['Breakfast','Lunch','Dinner','Snack'].map(x=>`<option>${x}</option>`).join('')}</select></label><label>Calories (optional)<input name="c" type="number" inputmode="numeric" min="0" max="5000"></label><label>Photo<input name="p" type="file" accept="image/*"></label><button class="btn">Save meal</button></form>
${d.meals.map((m,i)=>`<article class="meal">${m.p?`<img src="${esc(m.p)}" alt="">`:'<span class="ico">🥗</span>'}<div><b>${esc(m.n)}</b><small>${m.t} · ${m.c} kcal</small></div><button class="x" data-a="del" data-i="${i}" aria-label="Remove meal">×</button></article>`).join('')}`};
const game=()=>{
  if(!S.start)return`<h1>Game mode</h1><p class="sub">30 days. A reward every day you finish.</p>${card('How it works','<p>Do all 4 daily goals to earn a ⭐, that day’s reward and 100 XP. Missed a day? Keep going, the road map waits for you.</p><button class="btn" data-a="start">Start my 30 days</button>')}`;
  const n=dayNo(),T=tiles(),st=stats(T),d=day();
  return`<h1>Game mode</h1><p class="sub">${n>LEN?'Month complete':`Day ${n} of ${LEN}`}</p>${stat([['⭐',st.stars,'stars'],['🔥',st.streak,'streak'],['✨',st.xp,'XP'],['📅',Math.min(n,LEN),'day']])}
${n>LEN?card('Month complete 🎉',`<p>You finished ${st.stars} of ${LEN} days. Export your backup, then start a new month.</p>${backup()}<button class="btn" data-a="reset">Start a new month</button>`):card(`Day ${n} goals`,`<ul class="goals">${GOALS.map(g=>`<li class="${g[2](d)?'ok':''}"><span>${g[2](d)?'✅':g[0]}</span>${g[1]}</li>`).join('')}</ul>`)}
${card('Road map',`<div class="map">${T.map(x=>`<div class="tile ${x.s}"><small>${x.n}</small><span>${x.s==='done'?x.r:x.s==='today'?'🎯':x.s==='locked'?'🔒':'·'}</span></div>`).join('')}</div>`)}
${card('Badges',`<div class="badges">${MS.map(([c,e])=>`<div class="${st.stars>=c?'':'off'}">${e}<small>${c} stars</small></div>`).join('')}</div>`)}`};
const admin=()=>{const D=wkDays(),R=rows(),a=D.filter(x=>x[0]<=key()),ws=a.flatMap(x=>x[1].w),r0=fmt(D[0][2],{month:'short',day:'numeric'})+' – '+fmt(D[6][2],{month:'short',day:'numeric'});
  return`<h1>Admin</h1><p class="sub">Everything you did, kept week by week.</p>
<div class="nav2"><button data-a="wk" data-i="-1" aria-label="Previous week">‹</button><b>${wk?r0:'This week · '+r0}</b><button data-a="wk" data-i="1" aria-label="Next week"${wk>=0?' disabled':''}>›</button></div>
${stat([['👟',sum(a,x=>x.steps).toLocaleString(),'steps'],['💧',L(sum(a,x=>x.water)),'water'],['🥗',sum(a,x=>x.meals.length),'meals'],['✅',a.filter(x=>done(x[0])).length,'goal days']])}
${ws.length>1?`<p class="sub">⚖️ ${ws[0].v} → ${ws[ws.length-1].v} kg this week</p>`:''}
${D.map(([k,r,x])=>`<article class="dcard${k>key()?' off2':''}"><div class="dh"><b>${fmt(x,{weekday:'long'})}</b><small>${k}</small><span>${done(k)?'✅':''}</span></div><p>👟 ${r.steps.toLocaleString()} · 💧 ${L(r.water)} · 🥗 ${r.meals.length} meals · 🔥 ${kc(r)} kcal</p>${r.meals.length?`<p class="m">${esc(r.meals.map(m=>m.n).join(', '))}</p>`:''}${r.w.length?`<p class="m">⚖️ ${r.w.map(w=>`${w.v} kg at ${w.t}`).join(' · ')}</p>`:''}${r.note?`<p class="m">✍️ ${esc(r.note)}</p>`:''}</article>`).join('')}
<h2 class="sec">All data</h2>${stat([['📅',R.length,'days'],['✅',R.filter(r=>done(r[0])).length,'goal days'],['👟',sum(R,x=>x.steps).toLocaleString(),'steps'],['💧',L(sum(R,x=>x.water)),'water']])}
${card('Export &amp; import',`<button class="btn" data-a="pdf">Save as PDF</button><button class="btn soft" data-a="csv">Export CSV</button>${backup()}`)}
${R.slice(0,120).map(([k,r])=>`<article class="meal"><div><b>${k}</b><small>👟 ${r.steps} · 💧 ${L(r.water)} · 🥗 ${r.meals.length}${lw(r)?' · ⚖️ '+lw(r)+' kg':''}</small></div><span>${done(k)?'✅':''}</span></article>`).join('')}
<table id="print"><tr><th>Date</th><th>Steps</th><th>Water L</th><th>Meals</th><th>kcal</th><th>Weights kg</th><th>Note</th></tr>${R.map(([k,r])=>`<tr><td>${k}</td><td>${r.steps}</td><td>${r.water}</td><td>${esc(r.meals.map(m=>m.n).join(', '))}</td><td>${kc(r)}</td><td>${r.w.map(w=>w.v+'@'+w.t).join(' ')}</td><td>${esc(r.note)}</td></tr>`).join('')}</table>`};
const pic=(p,e)=>p?`<img class="pic" src="${esc(p)}" alt="">`:`<div class="pic">${e}</div>`,lines=t=>t.split('\n').filter(Boolean).map(x=>`<li>${esc(x)}</li>`).join(''),
rc=(t,i,r,p)=>`<button class="rcard" data-a="open" data-t="${t}" data-i="${i}">${p}<h3>${esc(r.n)}</h3><small>${r.m} min</small></button>`;
const recipes=()=>{
  if(rec){const r=rec.t==='c'?S.recipes[rec.i]:RC[rec.i];if(r){const p=rec.t==='c'?r.p:S.photos[rec.i];
    return`<button class="btn soft" data-a="back">‹ All recipes</button><h1 class="rt">${esc(r.n)}</h1><p class="sub">${r.m} min</p><div class="card">${pic(p,r.e||'🍽️')}<label>${p?'Change photo':'Add your photo'}<input id="rph" type="file" accept="image/*"></label></div>${card('Ingredients',`<ul class="how">${lines(r.i)}</ul>`)}${card('How to make it',`<ol class="how">${lines(r.s)}</ol>`)}${rec.t==='c'?'<button class="btn danger" data-a="delrec">Delete recipe</button>':''}`}rec=null}
  return`<h1>Recipe book</h1><p class="sub">${S.recipes.length+RC.length} recipes. Tap one to see how to make it.</p>
<details class="card"><summary>＋ Add my own recipe</summary><form id="rcp"><label>Name<input name="n" required maxlength="60"></label><label>Minutes<input name="m" type="number" inputmode="numeric" min="1" max="600" value="20"></label><label>Ingredients (one per line)<textarea name="i" maxlength="600"></textarea></label><label>How to make it (one step per line)<textarea name="s" maxlength="1500"></textarea></label><label>Photo<input name="p" type="file" accept="image/*"></label><button class="btn">Save recipe</button></form></details>
<div class="recipes">${S.recipes.map((r,i)=>rc('c',i,r,pic(r.p,'🍽️'))).join('')}${RC.map((r,i)=>rc('b',i,r,pic(S.photos[i],r.e))).join('')}</div>`};
const me=()=>`<h1>Safe</h1><p class="sub">Your data stays on this phone.</p>${card('Backup',backup())}${card('Privacy','<p>No accounts, no tracking, no servers.</p><button class="btn danger" data-a="wipe">Erase all data</button>')}`;
const views={home,diary,game,progress:admin,recipes,me};
function render(){if(!views[page])page='home';$('#app').innerHTML=views[page]();
  const nav=TABS.map(([p,i,l])=>`<button data-p="${p}" class="${p===page?'on':''}"${p===page?' aria-current="page"':''}><span>${i}</span><small>${l}</small></button>`).join('');
  $('#tabs').innerHTML=nav;$('#side').innerHTML=`<a class="brand"><i>✳</i>we can <b>do it</b></a><p class="lab">YOUR SPACE</p>${nav}<div class="push"></div><div class="quote"><b>Small steps still move you forward.</b><small>YOU'RE DOING GREAT</small></div>`;
  $('#crumb').textContent=(TABS.find(t=>t[0]===page)||[0,0,'Safe'])[2];$('#date').textContent=fmt(new Date(),{weekday:'short',month:'short',day:'numeric'});
  document.querySelectorAll('[data-h]').forEach(e=>e.style.height=e.dataset.h+'%')}
const run=f=>{const b=done(key());f();const ok=save(),a=done(key());render();if(!ok)toast('Storage full: export a backup');else if(S.start&&!b&&a)toast('Day complete! +100 XP 🎉')};
const dl=(n,t,m)=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:m}));a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1e4)};
const q=v=>'"'+String(v).replace(/^[=+\-@]/,"'$&").replace(/"/g,'""')+'"',uq=v=>(v||'').replace(/^'(?=[=+\-@])/,'');
const exportCsv=()=>dl(`we-can-do-it-${key()}.csv`,'Date,Steps,Water_L,Meals,Kcal,Weight_kg,Note,GoalsMet\n'+rows().reverse().map(([k,r])=>[k,r.steps,r.water,q(r.meals.map(m=>m.n).join('; ')),kc(r),lw(r)??'',q(r.note),done(k)?1:0].join(',')).join('\n'),'text/csv');
const csvParse=t=>{const R=[];let r=[],c='',o=0;for(let i=0;i<t.length;i++){const h=t[i];if(o){if(h==='"'){if(t[i+1]==='"'){c+='"';i++}else o=0}else c+=h}else if(h==='"')o=1;else if(h===','){r.push(c);c=''}else if(h==='\n'||h==='\r'){if(h==='\r'&&t[i+1]==='\n')i++;r.push(c);c='';R.push(r);r=[]}else c+=h}if(c||r.length){r.push(c);R.push(r)}return R};
const ACT={water:()=>run(()=>{day().water+=.25}),start:()=>run(()=>{S.start=key()}),export:()=>dl(`we-can-do-it-${key()}.json`,JSON.stringify(S),'application/json'),csv:exportCsv,
  pdf:()=>{toast('Choose “Save as PDF” in the print sheet');setTimeout(()=>window.print(),400)},
  reset:()=>confirm('Start a new month? Make sure you exported a backup.')&&run(()=>{S.start=key()}),
  wipe:()=>{if(confirm('Erase ALL data? This cannot be undone.')){localStorage.removeItem(KEY);replace(sanitize({}));render()}},
  back:()=>{rec=null;render();scrollTo(0,0)},delrec:()=>{if(!confirm('Delete this recipe?'))return;const i=rec.i;rec=null;run(()=>S.recipes.splice(i,1))}};
document.addEventListener('click',e=>{const p=e.target.closest('[data-p]');if(p){page=p.dataset.p;rec=null;history.replaceState(null,'','#'+page);render();scrollTo(0,0);return}
  const a=e.target.closest('[data-a]');if(!a)return;const i=+a.dataset.i,k=a.dataset.a;
  if(k==='del')run(()=>day().meals.splice(i,1));else if(k==='delw')run(()=>day().w.splice(i,1));else if(k==='wk'){wk=Math.min(0,wk+i);render()}
  else if(k==='open'){rec={t:a.dataset.t,i};render();scrollTo(0,0)}else ACT[k]?.()});
document.addEventListener('submit',async e=>{e.preventDefault();const f=e.target,v=Object.fromEntries(new FormData(f));let p='';
  if(f.id==='daily')run(()=>Object.assign(day(),{steps:+v.steps||0,water:+v.water||0,note:v.note.trim()}));
  else if(f.id==='wt')run(()=>{day().w.push({t:v.t,v:+v.v});day().w.sort((x,y)=>x.t<y.t?-1:1)});
  else if(f.id==='meal'||f.id==='rcp'){try{if(v.p.size)p=await photo(v.p)}catch{return toast('Choose a photo under 8 MB')}
    if(f.id==='meal')run(()=>day().meals.push({n:v.n.trim(),t:v.t,c:+v.c||0,p}));else run(()=>S.recipes.unshift({n:v.n.trim(),m:+v.m||20,i:v.i,s:v.s,p}))}});
document.addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;
  if(e.target.id==='rph'){try{const p=await photo(f);run(()=>{if(rec.t==='c')S.recipes[rec.i].p=p;else S.photos[rec.i]=p})}catch{toast('Choose a photo under 8 MB')}return}
  if(e.target.id!=='imp')return;
  try{if(f.size>3e6)throw 0;const t=await f.text();
    if(/\.csv$/i.test(f.name)){const R=csvParse(t).slice(1,1500).filter(r=>/^\d{4}-\d{2}-\d{2}$/.test(r[0]));if(!R.length)throw 0;
      run(()=>R.forEach(r=>{const d=day(r[0]);Object.assign(d,{steps:+r[1]||0,water:+r[2]||0,note:uq(r[6])});if(+r[5]&&!d.w.length)d.w=[{t:'00:00',v:+r[5]}]}));toast(`${R.length} days imported`)}
    else{const o=sanitize(JSON.parse(t));if(!confirm('Replace current data with this backup?'))return;replace(o);render();toast('Backup imported ✅')}}
  catch{toast('Not a valid backup file')}});
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
render();
