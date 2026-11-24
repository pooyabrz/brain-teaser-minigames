export type LocalResult={slug:string;score:number;elapsed:number;completed:boolean;date:string;daily?:string};
export const results=():LocalResult[]=>{try{return JSON.parse(localStorage.getItem('bw-results')||'[]');}catch{return [];}};
export function rememberResult(r:LocalResult){localStorage.setItem('bw-results',JSON.stringify([r,...results()].slice(0,2000)));window.dispatchEvent(new Event('bw-progress'));}
export const day=()=>new Date().toISOString().slice(0,10);
export function levelOf(xp:number){let level=1;while(xp>=Math.floor(100*level**1.5)){xp-=Math.floor(100*level**1.5);level++;}return {level,current:xp,next:Math.floor(100*level**1.5)};}
export function streakOf(rows:LocalResult[]){const days=new Set(rows.filter(r=>r.completed).map(r=>r.date.slice(0,10)));let n=0,d=new Date();if(!days.has(d.toISOString().slice(0,10)))d.setUTCDate(d.getUTCDate()-1);while(days.has(d.toISOString().slice(0,10))){n++;d.setUTCDate(d.getUTCDate()-1);}return n;}
