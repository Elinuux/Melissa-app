import { store } from './storageService';

export interface PersistedWorkoutState {
  sessionId:string;
  index:number;
  left:number;
  running:boolean;
  blockEndsAt:number | null;
  elapsedBaseMs:number;
  runStartedAt:number | null;
  startedAt:number | null;
  updatedAt:number;
}

const KEY = 'activeWorkout';

export function loadWorkoutState(sessionId?: string): PersistedWorkoutState | null {
  const value = store.get<PersistedWorkoutState | null>(KEY, null);
  if (!value) return null;
  if (sessionId && value.sessionId !== sessionId) return null;
  return value;
}

export function saveWorkoutState(value: Omit<PersistedWorkoutState,'updatedAt'>) {
  store.set(KEY, { ...value, updatedAt:Date.now() });
}

export function clearWorkoutState() {
  store.set<PersistedWorkoutState | null>(KEY, null);
}

export function activeWorkoutSessionId(): string | null {
  return loadWorkoutState()?.sessionId ?? null;
}

export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return hours > 0
    ? `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`
    : `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
}
