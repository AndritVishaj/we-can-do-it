const E={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'},enc=new TextEncoder();
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>E[c]);
const hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
export async function hash(pin,s=hex(crypto.getRandomValues(new Uint8Array(16)))){
  const k=await crypto.subtle.importKey('raw',enc.encode(pin),'PBKDF2',false,['deriveBits']);
  return{s,h:hex(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:enc.encode(s),iterations:150000},k,256))}}
export const verify=async(pin,p)=>(await hash(pin,p.s)).h===p.h;
/** Re-encodes to a small JPEG (drops EXIF/GPS) and enforces size. */
export async function photo(f){
  if(!f.type.startsWith('image/')||f.size>8e6)throw 0;
  const b=await createImageBitmap(f),r=Math.min(1,320/Math.max(b.width,b.height)),c=document.createElement('canvas');
  c.width=Math.round(b.width*r);c.height=Math.round(b.height*r);c.getContext('2d').drawImage(b,0,0,c.width,c.height);
  for(const q of[.7,.5,.3]){const u=c.toDataURL('image/jpeg',q);if(u.length<60000)return u}throw 0}
