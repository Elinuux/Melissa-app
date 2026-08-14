import { useMemo, useState } from 'react';
import type { Energy, EveningActivity } from '../types';
import { buildEvening } from '../services/planner';
import { Card } from '../components/Card';
import { useSession } from '../services/session';
import { queueEveningPushes } from '../services/notificationService';
import { getGreeting } from '../utils/greeting';

export function Today({ onStart }: { onStart: (activity: EveningActivity) => void }) {
  const { user } = useSession();
  const [energy, setEnergy] = useState<Energy>('normal');
  const [minutes, setMinutes] = useState(95);
  const [plan, setPlan] = useState(() => buildEvening('18:00', 95, 'normal', { jobs: 0, sport: 1, english: 1 }));
  const next = useMemo(() => plan.find((activity) => activity.status === 'planned'), [plan]);

  const regenerate = async () => {
    const start = new Date().getHours() >= 18 ? new Date().toTimeString().slice(0, 5) : '18:00';
    const newPlan = buildEvening(start, minutes, energy, { jobs: 0, sport: 1, english: 1 });
    setPlan(newPlan);
    if (user) await queueEveningPushes(user.uid, newPlan);
  };

  const update = (id: string, mode: 'shorten' | 'delay' | 'skip') => setPlan((current) => current.map((activity) => activity.id !== id ? activity : {
    ...activity,
    duration: mode === 'shorten' ? Math.max(15, activity.duration - 10) : activity.duration,
    status: mode === 'skip' ? 'skipped' : activity.status,
    start: mode === 'delay' ? shift(activity.start, 10) : activity.start,
  }));

  return <main>
    <header className="screen-header">
      <p className="eyebrow">{getGreeting()}</p>
      <h1>Ce soir</h1>
      <p className="muted">Une soirée claire, sans avoir à tout organiser toi-même.</p>
    </header>

    <Card className="timeline-card">
      <div className="section-kicker">PROGRAMME</div>
      <div className="timeline">
        {plan.filter((activity) => activity.status !== 'skipped').map((activity) => <div className={`timeline-row activity-${activity.kind}`} key={activity.id}>
          <time>{activity.start}</time>
          <div className="timeline-dot" />
          <div><strong>{activity.title}</strong><p>{activity.duration} min</p></div>
        </div>)}
      </div>
    </Card>

    {next && <Card className="hero-card focus-card">
      <div className="focus-badge">PROCHAINE ACTIVITÉ</div>
      <h2>{next.title}</h2>
      <p className="duration">{next.duration} min</p>
      <button className="primary" onClick={() => onStart(next)}>COMMENCER</button>
      <div className="secondary-actions">
        <button onClick={() => update(next.id, 'delay')}>Décaler</button>
        <button onClick={() => update(next.id, 'shorten')}>Raccourcir</button>
        <button onClick={() => update(next.id, 'skip')}>Passer</button>
      </div>
    </Card>}

    <Card>
      <div className="section-heading"><div><p className="eyebrow">À LA CARTE</p><h2>Organiser ma soirée</h2></div><span className="time-pill">{minutes} min</span></div>
      <label className="range-label">Temps disponible<input type="range" min="45" max="180" step="15" value={minutes} onChange={(event) => setMinutes(Number(event.target.value))} /></label>
      <div className="segmented">{(['tired', 'normal', 'good'] as Energy[]).map((value) => <button className={energy === value ? 'selected' : ''} onClick={() => setEnergy(value)} key={value}>{value === 'tired' ? 'Fatiguée' : value === 'normal' ? 'Normale' : 'En forme'}</button>)}</div>
      <button className="secondary full" onClick={regenerate}>RÉORGANISER MA SOIRÉE</button>
    </Card>

    <Card>
      <div className="section-heading"><div><p className="eyebrow">PROGRESSION</p><h2>Cette semaine</h2></div></div>
      <div className="weekly-grid">
        <div><span>💼</span><strong>0</strong><small>candidature</small></div>
        <div><span>🏃</span><strong>1 / 3</strong><small>séances</small></div>
        <div><span>🇬🇧</span><strong>1</strong><small>session</small></div>
      </div>
    </Card>
  </main>;
}

function shift(time: string, minutes: number) {
  const [hour, minute] = time.split(':').map(Number);
  const total = hour * 60 + minute + minutes;
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}
