const E={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'};
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>E[c]);
/** Re-encodes to a small JPEG (drops EXIF/GPS) and enforces size. */
export async function photo(f){
  if(!f.type.startsWith('image/')||f.size>8e6)throw 0;
  const b=await createImageBitmap(f),r=Math.min(1,320/Math.max(b.width,b.height)),c=document.createElement('canvas');
  c.width=Math.round(b.width*r);c.height=Math.round(b.height*r);c.getContext('2d').drawImage(b,0,0,c.width,c.height);
  for(const q of[.7,.5,.3]){const u=c.toDataURL('image/jpeg',q);if(u.length<60000)return u}throw 0}
