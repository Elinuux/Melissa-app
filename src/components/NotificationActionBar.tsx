import { useMemo, useState } from 'react';
import type { Tab } from './Nav';
import { dismissNotificationJob, snoozeNotificationJob } from '../services/notificationService';
import { useSession } from '../services/session';

const tabForActivity: Record<string, Tab> = { today: 'today', jobs: 'jobs', sport: 'sport', english: 'english' };

export function NotificationActionBar({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const { user } = useSession();
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const [visible, setVisible] = useState(params.get('notification') === '1');
  const activity = params.get('activity') || 'today';
  const jobId = params.get('job');
  const uid = user?.uid;
  if (!visible) return null;

  const clean = () => {
    window.history.replaceState({}, '', window.location.pathname);
    setVisible(false);
  };
  const start = () => { onNavigate(tabForActivity[activity] || 'today'); clean(); };
  const snooze = async (minutes: number) => { if (uid && jobId) await snoozeNotificationJob(uid, jobId, minutes); clean(); };
  const dismiss = async () => { if (uid && jobId) await dismissNotificationJob(uid, jobId); clean(); };

  return <div className="notification-sheet" role="dialog" aria-label="Action du rappel">
    <p className="eyebrow">Rappel</p><h2>Que veux-tu faire ?</h2>
    <button className="primary" onClick={start}>COMMENCER</button>
    <div className="notification-secondary"><button onClick={() => void snooze(10)}>+10 min</button><button onClick={() => void snooze(30)}>+30 min</button><button onClick={() => void dismiss()}>Passer</button></div>
  </div>;
}
