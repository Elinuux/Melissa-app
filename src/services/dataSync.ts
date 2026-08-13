import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { store } from './storageService';

export async function getSyncedValue<T>(uid: string | null, key: string, fallback: T): Promise<T> {
  const local = store.get<T>(key, fallback);
  if (!uid || !db) return local;
  try {
    const snap = await getDoc(doc(db, 'users', uid, 'settings', key));
    if (!snap.exists()) return local;
    const value = snap.data().value as T;
    store.set(key, value);
    return value;
  } catch {
    return local;
  }
}

export async function setSyncedValue<T>(uid: string | null, key: string, value: T): Promise<void> {
  store.set(key, value);
  if (!uid || !db) return;
  await setDoc(doc(db, 'users', uid, 'settings', key), { value, updatedAt: serverTimestamp() }, { merge: true });
}
