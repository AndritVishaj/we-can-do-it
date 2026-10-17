import {S,key} from './store.js';
export const LEN=30,MS=[[7,'🥉'],[14,'🥈'],[21,'🥇'],[28,'👑']],R=['🌱','🍎','🌸','💎','🍀','🔥'];
const E={steps:0,water:0,note:'',meals:[]},P=s=>{const[y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
export const GOALS=[['👟','Walk 6,000 steps',d=>d.steps>=6000],['💧','Drink 2 litres of water',d=>d.water>=2],['🥗','Log 2 meals',d=>d.meals.length>=2],['✍️','Write one small win',d=>d.note.length>2]];
export const done=k=>GOALS.every(g=>g[2](S.days[k]||E));
export const dayNo=()=>S.start?Math.round((P(key())-P(S.start))/864e5)+1:0;
export function tiles(){const t=dayNo(),b=P(S.start);
  return Array.from({length:LEN},(_,i)=>{const k=key(new Date(b.getFullYear(),b.getMonth(),b.getDate()+i)),n=i+1;
    return{n,k,r:R[i%R.length],s:done(k)?'done':n===t?'today':n<t?'missed':'locked'}})}
export function stats(T){let streak=0;const stars=T.filter(x=>x.s==='done').length;
  for(const x of T.filter(x=>x.n<=dayNo()).reverse()){if(x.s==='done')streak++;else if(x.s!=='today')break}
  return{stars,streak,xp:stars*100+streak*10}}
