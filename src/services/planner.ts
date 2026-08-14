import type { ActivityKind, Energy, EveningActivity } from '../types';
const labels:Record<ActivityKind,string>={jobs:'Recherche d’alternance',sport:'Sport',english:'Business English'};
const icons:Record<ActivityKind,string>={jobs:'💼',sport:'🏃',english:'🇬🇧'};
export function buildEvening(start='18:00', availableMinutes=95, energy:Energy='normal', weekly={jobs:0,sport:0,english:0}):EveningActivity[]{
  const min = energy==='tired'?15:20;
  const weights:{kind:ActivityKind;w:number}[]=[
    {kind:'jobs',w: weekly.jobs===0?1.5:1.25},
    {kind:'sport',w: weekly.sport<3?1.1:.7},
    {kind:'english',w: weekly.english<3?1:.75}
  ];
  const total=weights.reduce((a,b)=>a+b.w,0);
  const gap=5; const usable=Math.max(min*3,availableMinutes-gap*2);
  let cursor=timeToMinutes(start);
  return weights.map((x,i)=>{
    const duration=i===weights.length-1?Math.max(min, usable-weights.slice(0,i).reduce((s,y)=>s+Math.max(min,Math.round(usable*y.w/total/5)*5),0)):Math.max(min,Math.round(usable*x.w/total/5)*5);
    const a={id:`${Date.now()}-${x.kind}`,kind:x.kind,title:`${icons[x.kind]} ${labels[x.kind]}`,start:minutesToTime(cursor),duration,status:'planned' as const};
    cursor+=duration+gap; return a;
  });
}
const timeToMinutes=(v:string)=>{const [h,m]=v.split(':').map(Number);return h*60+m};
const minutesToTime=(m:number)=>`${String(Math.floor(m/60)%24).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;
