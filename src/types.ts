export type ActivityKind = 'jobs' | 'sport' | 'english';
export type ActivityStatus = 'planned' | 'done' | 'skipped';
export type Energy = 'tired' | 'normal' | 'good';
export interface EveningActivity { id:string; kind:ActivityKind; title:string; start:string; duration:number; status:ActivityStatus; }
export interface Application { id:string; company:string; title:string; url?:string; location?:string; date:string; notes?:string; status:'À regarder'|'À postuler'|'Envoyée'|'Relance'|'Entretien'|'Terminée'; }
export interface SportSession { id:string; title:string; duration:number; type:string; blocks:Array<{label:string; seconds:number; note?:string}>; }
export interface EnglishQuestion { id:string; prompt:string; choices:string[]; answer:number; explanation:string; category:string; difficulty:'A2'|'B1'|'B2'; }
