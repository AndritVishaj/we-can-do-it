export const KEY='wcdi-v1';
const D=/^\d{4}-\d{2}-\d{2}$/,MT=['Breakfast','Lunch','Dinner','Snack'],H=/^[a-f0-9]+$/;
export const key=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const n=(v,m)=>Math.min(m,Math.max(0,Math.floor(+v)||0)),t=(v,m)=>String(v??'').replace(/[\u0000-\u001f<>]/g,'').slice(0,m);
/** Rebuilds state from untrusted input: unknown fields dropped, values clamped. */
export function sanitize(o,keepPin){
  const s={v:1,start:D.test(o?.start)?o.start:null,days:{},pin:null,fails:0,lockUntil:0};
  for(const [k,d] of Object.entries(o?.days||{}).slice(0,800))if(D.test(k))s.days[k]={steps:n(d?.steps,1e5),water:n(d?.water,40),weight:t(d?.weight,6),note:t(d?.note,300),
    meals:(Array.isArray(d?.meals)?d.meals:[]).slice(0,20).map(m=>({n:t(m?.n,60),t:MT.includes(m?.t)?m.t:'Snack',c:n(m?.c,5000),p:/^data:image\/jpeg;base64,[A-Za-z0-9+/=]{0,60000}$/.test(m?.p)?m.p:''}))};
  const p=o?.pin;if(keepPin&&p&&p.h?.length===64&&H.test(p.h)&&p.s?.length===32&&H.test(p.s)){s.pin={h:p.h,s:p.s};s.fails=n(o.fails,50);s.lockUntil=n(o.lockUntil,9e15)}
  return s}
const load=()=>{try{return sanitize(JSON.parse(localStorage.getItem(KEY)),true)}catch{return sanitize({})}};
export let S=load();
export const save=()=>{S=sanitize(S,true);try{localStorage.setItem(KEY,JSON.stringify(S))}catch{}};
export const replace=o=>{S=o;save()};
export const day=(k=key())=>S.days[k]||(S.days[k]={steps:0,water:0,weight:'',note:'',meals:[]});
