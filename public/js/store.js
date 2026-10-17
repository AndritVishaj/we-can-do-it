export const KEY='wcdi-v1';
const D=/^\d{4}-\d{2}-\d{2}$/,MT=['Breakfast','Lunch','Dinner','Snack'],IMG=/^data:image\/jpeg;base64,[A-Za-z0-9+/=]{0,60000}$/;
export const key=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const n=(v,m)=>Math.min(m,Math.max(0,Math.floor(+v)||0)),L=v=>Math.min(20,Math.max(0,Math.round(+v*20)/20||0)),
t=(v,m)=>String(v??'').replace(/[\u0000-\u001f<>]/g,'').slice(0,m),tl=(v,m)=>String(v??'').replace(/[\u0000-\u0009\u000b-\u001f<>]/g,'').slice(0,m);
/** Rebuilds state from untrusted input: unknown fields dropped, values clamped. */
export function sanitize(o){
  const s={v:3,start:D.test(o?.start)?o.start:null,days:{},recipes:[],photos:{}};
  for(const [k,d] of Object.entries(o?.days||{}).slice(0,800))if(D.test(k)){
    const W=Array.isArray(d?.w)?d.w:d?.weight?[{t:'00:00',v:d.weight}]:[];
    s.days[k]={steps:n(d?.steps,1e5),water:L(d?.water),note:t(d?.note,300),
      w:W.slice(0,24).filter(x=>/^\d{2}:\d{2}$/.test(x?.t)&&+x.v>=20&&+x.v<=400).map(x=>({t:x.t,v:Math.round(+x.v*10)/10})),
      meals:(Array.isArray(d?.meals)?d.meals:[]).slice(0,20).map(m=>({n:t(m?.n,60),t:MT.includes(m?.t)?m.t:'Snack',c:n(m?.c,5000),p:IMG.test(m?.p)?m.p:''}))}}
  s.recipes=(Array.isArray(o?.recipes)?o.recipes:[]).slice(0,40).map(r=>({n:t(r?.n,60),m:n(r?.m,600)||20,i:tl(r?.i,600),s:tl(r?.s,1500),p:IMG.test(r?.p)?r.p:''})).filter(r=>r.n);
  for(const [k,p] of Object.entries(o?.photos||{}).slice(0,40))if(/^\d{1,2}$/.test(k)&&IMG.test(p))s.photos[k]=p;
  return s}
const load=()=>{try{return sanitize(JSON.parse(localStorage.getItem(KEY)))}catch{return sanitize({})}};
export let S=load();
export const save=()=>{S=sanitize(S);try{localStorage.setItem(KEY,JSON.stringify(S));return true}catch{return false}};
export const replace=o=>{S=o;save()};
export const day=(k=key())=>S.days[k]||(S.days[k]={steps:0,water:0,note:'',w:[],meals:[]});
