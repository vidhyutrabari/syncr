export function debounce<T extends (...args:any[])=>any>(fn:T, ms:number){
  let t:any;
  return (...args:any[])=>{
    clearTimeout(t);
    t = setTimeout(()=>fn(...args), ms);
  };
}

export function isBrowser(){
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function deepEqual(a:any,b:any){
  try { return JSON.stringify(a) === JSON.stringify(b); } catch { return a === b; }
}
