import { Card } from '../components/Card';
import { sportSessions } from '../data/sport';
import type { SportSession } from '../types';
import { activeWorkoutSessionId } from '../services/workoutState';

export function Sport({ onStart }: { onStart:(session:SportSession)=>void }) {
  const activeId = activeWorkoutSessionId();
  const active = sportSessions.find((session) => session.id === activeId);

  return <main>
    <header className="screen-header sport-header">
      <p className="eyebrow">Sport</p>
      <h1>Bouger, progresser, récupérer.</h1>
      <p className="muted">3 à 4 séances par semaine, avec une progression douce.</p>
    </header>

    {active && <Card className="active-workout-card"><div className="live-pill"><span /> SÉANCE EN COURS</div><h2>{active.title}</h2><p className="muted">Le chrono a été conservé même en quittant l’écran.</p><button className="primary" onClick={() => onStart(active)}>REPRENDRE LA SÉANCE</button></Card>}

    <div className="section-heading"><div><p className="eyebrow">PROGRAMMES</p><h2>Choisis ton format</h2></div></div>
    <div className="sport-session-list">{sportSessions.map((session, index) => <Card className={index === 0 && !active ? 'hero-card sport-session-card' : 'sport-session-card'} key={session.id}>
      <div className="sport-card-top"><span className="sport-type">{session.type}</span><span className="sport-duration">{session.duration} min</span></div>
      <h2>{session.title}</h2>
      <p className="muted">{session.type.includes('Course +') ? 'Course, renforcement et récupération guidés.' : session.type === 'Fractionné' ? 'Des accélérations contrôlées, avec récupération.' : session.type === 'Récupération' ? 'Une séance légère pour rester régulière.' : 'Une séance simple à lancer sans préparation.'}</p>
      <button className={index === 0 && !active ? 'primary' : 'secondary full'} onClick={() => onStart(session)}>{activeId === session.id ? 'REPRENDRE' : 'LANCER LA SÉANCE'}</button>
    </Card>)}</div>
  </main>;
}
