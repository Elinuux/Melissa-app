export type Tab='today'|'jobs'|'sport'|'english'|'profile';
const tabs:[Tab,string,string][]=[['today','Aujourd’hui','⌂'],['jobs','Alternance','💼'],['sport','Sport','🏃'],['english','English','🇬🇧'],['profile','Profil','●']];
export function Nav({tab,setTab}:{tab:Tab;setTab:(t:Tab)=>void}){return <nav className="bottom-nav" aria-label="Navigation principale">{tabs.map(([id,label,icon])=><button key={id} className={tab===id?'active':''} onClick={()=>setTab(id)} aria-current={tab===id?'page':undefined}><span>{icon}</span><small>{label}</small></button>)}</nav>}
