import type { CVFileMeta, CVSection } from '../types';
import { store } from './storageService';

const DB_NAME = 'melissa-app-files';
const STORE_NAME = 'cv-files';
const PRIMARY_KEY = 'primary';
const SECTIONS_KEY = 'cvSections';

export const defaultCVSections: CVSection[] = [
  { id:'title', type:'title', title:'Titre', content:'M2 Expert financier — Recherche d’alternance' },
  { id:'summary', type:'summary', title:'Profil', content:'' },
  { id:'experience', type:'experience', title:'Expériences', content:'' },
  { id:'education', type:'education', title:'Formation', content:'M2 Expert financier' },
  { id:'skills', type:'skills', title:'Compétences', content:'' },
  { id:'languages', type:'languages', title:'Langues', content:'Anglais — niveau à confirmer' },
  { id:'software', type:'software', title:'Logiciels', content:'' },
];

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveOriginalCV(file: File): Promise<CVFileMeta> {
  if (!['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type) && !file.name.toLowerCase().endsWith('.docx')) {
    throw new Error('UNSUPPORTED_CV_FILE');
  }
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).put(file, PRIMARY_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  db.close();
  const meta: CVFileMeta = { id:PRIMARY_KEY, name:file.name, type:file.type || 'application/octet-stream', size:file.size, importedAt:new Date().toISOString() };
  store.set('cvFileMeta', meta);
  return meta;
}

export function getCVMeta(): CVFileMeta | null {
  return store.get<CVFileMeta | null>('cvFileMeta', null);
}

export async function getOriginalCV(): Promise<Blob | null> {
  try {
    const db = await openDatabase();
    const result = await new Promise<Blob | null>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const request = transaction.objectStore(STORE_NAME).get(PRIMARY_KEY);
      request.onsuccess = () => resolve((request.result as Blob | undefined) ?? null);
      request.onerror = () => reject(request.error);
    });
    db.close();
    return result;
  } catch {
    return null;
  }
}

export function loadCVSections(): CVSection[] {
  return store.get<CVSection[]>(SECTIONS_KEY, defaultCVSections);
}

export function saveCVSections(sections: CVSection[]) {
  store.set(SECTIONS_KEY, sections);
}

export function cvAsText(sections: CVSection[]): string {
  return sections.map((section) => `[sectionId:${section.id}] ${section.title}\n${section.content}`.trim()).filter(Boolean).join('\n\n');
}
