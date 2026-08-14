import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { initializeFirestore, memoryLocalCache, persistentLocalCache, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getFunctions, type Functions } from 'firebase/functions';

const publicFirebaseDefaults = {
  apiKey: 'AIzaSyAoVKxq-iljgyoFn9UtuG8Vpl-kz-JhTrU',
  authDomain: 'melissa-app-c3eb6.firebaseapp.com',
  projectId: 'melissa-app-c3eb6',
  storageBucket: 'melissa-app-c3eb6.firebasestorage.app',
  messagingSenderId: '336665919619',
  appId: '1:336665919619:web:b3b8b66dbf14c256519bb6'
};

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || publicFirebaseDefaults.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || publicFirebaseDefaults.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || publicFirebaseDefaults.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || publicFirebaseDefaults.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || publicFirebaseDefaults.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || publicFirebaseDefaults.appId
};

export const firebaseConfigured = Object.values(config).every(Boolean);
export let firebaseApp: FirebaseApp | null = null;
export let auth: Auth | null = null;
export let db: Firestore | null = null;
export let storage: FirebaseStorage | null = null;
export let functions: Functions | null = null;

if (firebaseConfigured) {
  firebaseApp = initializeApp(config);
  auth = getAuth(firebaseApp);
  try {
    db = initializeFirestore(firebaseApp, { localCache: persistentLocalCache() });
  } catch {
    db = initializeFirestore(firebaseApp, { localCache: memoryLocalCache() });
  }
  storage = getStorage(firebaseApp);
  functions = getFunctions(firebaseApp, 'europe-west9');
}
