export interface Store { get<T>(key:string, fallback:T):T; set<T>(key:string,value:T):void; }
class LocalStore implements Store {
  get<T>(key:string,fallback:T):T { try { const raw=localStorage.getItem(`melissa:${key}`); return raw?JSON.parse(raw) as T:fallback; } catch { return fallback; } }
  set<T>(key:string,value:T){ localStorage.setItem(`melissa:${key}`,JSON.stringify(value)); }
}
export const store:Store=new LocalStore();
