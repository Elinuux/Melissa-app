import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { store } from './storageService';
import type { Application } from '../types';

const localKey = 'applications';

export async function listApplications(uid: string | null): Promise<Application[]> {
  const local = store.get<Application[]>(localKey, []);
  if (!uid || !db) return local;
  try {
    const snap = await getDocs(query(collection(db, 'users', uid, 'applications'), orderBy('createdAt', 'desc')));
    const remote = snap.docs.map((item) => ({ id: item.id, ...item.data() })) as Application[];
    store.set(localKey, remote);
    return remote;
  } catch {
    return local;
  }
}

export async function addApplication(uid: string | null, application: Application): Promise<Application> {
  const local = store.get<Application[]>(localKey, []);
  if (!uid || !db) {
    store.set(localKey, [application, ...local]);
    return application;
  }
  const { id: _localId, ...payload } = application;
  const ref = await addDoc(collection(db, 'users', uid, 'applications'), { ...payload, createdAt: serverTimestamp() });
  const saved = { ...application, id: ref.id };
  store.set(localKey, [saved, ...local]);
  return saved;
}
