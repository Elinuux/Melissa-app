import { useEffect, useRef, useState } from 'react';
import type { PersistedWorkoutState } from '../services/workoutState';
import { clearWorkoutState, formatDuration, loadWorkoutState, saveWorkoutState } from '../services/workoutState';
import type { SportSession } from '../types';
import { store } from '../services/storageService';
import { findExercise } from '../data/sport';

export function Workout({ session, onExit }: { session:SportSession; onExit:()=>void }) {
  const initialRef = useRef<PersistedWorkoutState | null>(loadWorkoutState(session.id));
  const initial = initialRef.current;
  const [index, setIndex] = useState(() => Math.min(initial?.index ?? 0, session.blocks.length - 1));
  const [left, setLeft] = useState(() => initial?.left ?? session.blocks[0].seconds);
  const [running, setRunning] = useState(() => initial?.running ?? false);
  const [blockEndsAt, setBlockEndsAt] = useState<number | null>(() => initial?.blockEndsAt ?? null);
  const [elapsedBaseMs, setElapsedBaseMs] = useState(() => initial?.elapsedBaseMs ?? 0);
  const [runStartedAt, setRunStartedAt] = useState<number | null>(() => initial?.runStartedAt ?? null);
  const [startedAt, setStartedAt] = useState<number | null>(() => initial?.startedAt ?? null);
  const [now, setNow] = useState(Date.now());
  const [finished, setFinished] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const block = session.blocks[index];
  const exercise = findExercise(block.exerciseId);

  useEffect(() => {
    if (finished) return;
    saveWorkoutState({ sessionId:session.id, index, left, running, blockEndsAt, elapsedBaseMs, runStartedAt, startedAt });
  }, [session.id,index,left,running,blockEndsAt,elapsedBaseMs,runStartedAt,startedAt,finished]);

  useEffect(() => {
    const persist = () => {
      if (finished) return;
      saveWorkoutState({ sessionId:session.id, index, left, running, blockEndsAt, elapsedBaseMs, runStartedAt, startedAt });
    };
    window.addEventListener('pagehide', persist);
    document.addEventListener('visibilitychange', persist);
    return () => { window.removeEventListener('pagehide', persist); document.removeEventListener('visibilitychange', persist); };
  }, [session.id,index,left,running,blockEndsAt,elapsedBaseMs,runStartedAt,startedAt,finished]);

  useEffect(() => {
    if (!running || blockEndsAt === null) return;
    const tick = () => {
      const current = Date.now();
      setNow(current);
      let nextIndex = index;
      let nextEnd = blockEndsAt;
      while (nextEnd <= current && nextIndex < session.blocks.length - 1) {
        nextIndex += 1;
        nextEnd += session.blocks[nextIndex].seconds * 1000;
      }
      if (nextEnd <= current && nextIndex === session.blocks.length - 1) {
        const accumulated = elapsedBaseMs + (runStartedAt ? current - runStartedAt : 0);
        setElapsedBaseMs(accumulated);
        setRunStartedAt(null);
        setRunning(false);
        setBlockEndsAt(null);
        setLeft(0);
        setFinished(true);
        clearWorkoutState();
        if ('vibrate' in navigator) navigator.vibrate?.([160,80,160]);
        return;
      }
      if (nextIndex !== index) {
        setIndex(nextIndex);
        setShowGuide(false);
        if ('vibrate' in navigator) navigator.vibrate?.(120);
      }
      if (nextEnd !== blockEndsAt) setBlockEndsAt(nextEnd);
      const remaining = Math.max(0, Math.ceil((nextEnd - current) / 1000));
      setLeft((previous) => previous === remaining ? previous : remaining);
    };
    tick();
    const id = window.setInterval(tick, 400);
    return () => window.clearInterval(id);
  }, [running,blockEndsAt,index,session.blocks,elapsedBaseMs,runStartedAt]);

  const globalSeconds = Math.max(0, Math.floor((elapsedBaseMs + (running && runStartedAt ? now - runStartedAt : 0)) / 1000));

  const toggle = () => {
    const current = Date.now();
    if (running) {
      const remaining = blockEndsAt ? Math.max(0, Math.ceil((blockEndsAt - current) / 1000)) : left;
      setLeft(remaining);
      setElapsedBaseMs((value) => value + (runStartedAt ? current - runStartedAt : 0));
      setRunStartedAt(null);
      setBlockEndsAt(null);
      setRunning(false);
    } else {
      if (!startedAt) setStartedAt(current);
      setRunStartedAt(current);
      setBlockEndsAt(current + Math.max(1,left) * 1000);
      setRunning(true);
      setNow(current);
    }
  };

  const moveTo = (nextIndex: number) => {
    const safe = Math.max(0, Math.min(session.blocks.length - 1, nextIndex));
    setIndex(safe);
    setLeft(session.blocks[safe].seconds);
    setShowGuide(false);
    if (running) setBlockEndsAt(Date.now() + session.blocks[safe].seconds * 1000);
  };

  const addTenSeconds = () => {
    setLeft((value) => value + 10);
    if (running && blockEndsAt) setBlockEndsAt(blockEndsAt + 10000);
  };

  const stop = () => {
    const current = Date.now();
    if (running && runStartedAt) setElapsedBaseMs((value) => value + current - runStartedAt);
    setRunning(false);
    setRunStartedAt(null);
    setBlockEndsAt(null);
    setFinished(true);
    clearWorkoutState();
  };

  const save = (difficulty: string) => {
    const history = store.get<any[]>('sportHistory', []);
    store.set('sportHistory', [{ id:crypto.randomUUID(), sessionId:session.id, title:session.title, date:new Date().toISOString(), difficulty, durationSeconds:globalSeconds }, ...history]);
    clearWorkoutState();
    onExit();
  };

  if (finished) return <div className="workout summary"><div className="workout-total-label">TEMPS TOTAL · {formatDuration(globalSeconds)}</div><h1>Séance terminée</h1><p>Comment c’était ?</p><div className="summary-actions"><button onClick={() => save('Facile')}>Facile</button><button onClick={() => save('Correct')}>Correct</button><button onClick={() => save('Difficile')}>Difficile</button></div><button className="secondary full" onClick={onExit}>Plus tard</button></div>;

  return <div className="workout">
    <div className="workout-topbar"><div className="workout-global"><small>ENTRAÎNEMENT</small><strong>{formatDuration(globalSeconds)}</strong></div><button className="workout-close" onClick={onExit} aria-label="Réduire la séance">⌄</button></div>
    <div className="workout-progress"><span style={{ width:`${((index + 1) / session.blocks.length) * 100}%` }} /></div>
    <p className="workout-step">{index + 1} / {session.blocks.length}</p>
    <h1>{block.label.toUpperCase()}</h1>
    <div className="timer">{formatDuration(left)}</div>
    {block.note && <p className="workout-note">{block.note}</p>}
    {exercise && <button className="movement-button" onClick={() => setShowGuide(true)}>◎ VOIR LE MOUVEMENT</button>}
    <button className="workout-primary" onClick={toggle}>{running ? 'PAUSE' : startedAt ? 'REPRENDRE' : 'DÉMARRER'}</button>
    <div className="workout-controls"><button disabled={index===0} onClick={() => moveTo(index - 1)}>←</button><button onClick={addTenSeconds}>+10 s</button><button disabled={index===session.blocks.length-1} onClick={() => moveTo(index + 1)}>→</button></div>
    <button className="workout-stop" onClick={stop}>Arrêter la séance</button>

    {showGuide && exercise && <div className="exercise-sheet" role="dialog" aria-label={`Exécution ${exercise.name}`}>
      <div className="sheet-handle" />
      <div className="exercise-visual" aria-hidden="true"><div className="figure-head"/><div className="figure-body"/><div className="figure-legs"><span/><span/></div></div>
      <p className="eyebrow">BIEN EXÉCUTER</p><h2>{exercise.name}</h2>
      <div className="muscle-chips">{exercise.muscles.map((muscle) => <span key={muscle}>{muscle}</span>)}</div>
      <ol className="exercise-steps">{exercise.instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}</ol>
      <p className="exercise-warning"><strong>À éviter :</strong> {exercise.mistakes.join(' · ')}</p>
      <a className="primary video-link" href={exercise.video} target="_blank" rel="noreferrer">VOIR UNE VIDÉO YOUTUBE ↗</a>
      <button className="secondary full" onClick={() => setShowGuide(false)}>FERMER</button>
    </div>}
  </div>;
}
