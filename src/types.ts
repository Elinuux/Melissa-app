export type ActivityKind = 'jobs' | 'sport' | 'english';
export type ActivityStatus = 'planned' | 'done' | 'skipped';
export type Energy = 'tired' | 'normal' | 'good';
export interface EveningActivity { id:string; kind:ActivityKind; title:string; start:string; duration:number; status:ActivityStatus; }

export interface Application { id:string; company:string; title:string; url?:string; location?:string; date:string; notes?:string; status:'À regarder'|'À postuler'|'Envoyée'|'Relance'|'Entretien'|'Terminée'; }

export interface SportBlock { label:string; seconds:number; note?:string; exerciseId?:string; }
export interface SportSession { id:string; title:string; duration:number; type:string; blocks:SportBlock[]; }
export interface ExerciseGuide { id:string; name:string; muscles:string[]; difficulty:'facile'|'moyen'|'avancé'; video:string; alternatives:string[]; precaution:string; instructions:string[]; mistakes:string[]; }

export type EnglishLevel = 'A2'|'B1'|'B1+'|'B2';
export interface EnglishQuestion { id:string; prompt:string; choices:string[]; answer:number; explanation:string; category:string; difficulty:'A2'|'B1'|'B2'; }
export interface EnglishProfile { level:EnglishLevel; score:number; weakCategories:string[]; assessedAt:string; }
export interface EnglishMistake { questionId:string; prompt:string; chosen:string; correct:string; explanation:string; category:string; date:string; }

export type CVSectionType = 'title'|'summary'|'experience'|'education'|'skills'|'languages'|'software'|'other';
export interface CVSection { id:string; type:CVSectionType; title:string; content:string; }
export interface CVFileMeta { id:string; name:string; type:string; size:number; importedAt:string; }
export interface CVSuggestion { id:string; sectionId:string; before:string; after:string; reason:string; }

export type AIProvider = 'openai'|'gemini'|'claude';
export type AITask = 'analyse-offer'|'improve-cv'|'adapt-cv'|'interview-prep'|'english-feedback';
export interface AIResult { text:string; provider?:AIProvider; }
