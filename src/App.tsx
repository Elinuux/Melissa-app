import { useState } from 'react';
import { Nav, type Tab } from './components/Nav';
import { NotificationActionBar } from './components/NotificationActionBar';
import { Today } from './screens/Today';
import { Jobs } from './screens/Jobs';
import { Sport } from './screens/Sport';
import { English } from './screens/English';
import { Profile } from './screens/Profile';
import { Workout } from './screens/Workout';
import type { EveningActivity, SportSession } from './types';

const initialTab = (): Tab => {
  const value = new URLSearchParams(window.location.search).get('activity');
  return value === 'jobs' || value === 'sport' || value === 'english' ? value : 'today';
};

export default function App() {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [workout, setWorkout] = useState<SportSession | null>(null);
  if (workout) return <Workout session={workout} onExit={() => setWorkout(null)} />;
  const startActivity = (activity: EveningActivity) => setTab(activity.kind === 'jobs' ? 'jobs' : activity.kind === 'sport' ? 'sport' : 'english');
  return <div className="app-shell">
    <NotificationActionBar onNavigate={setTab} />
    {tab === 'today' && <Today onStart={startActivity} />}
    {tab === 'jobs' && <Jobs />}
    {tab === 'sport' && <Sport onStart={setWorkout} />}
    {tab === 'english' && <English />}
    {tab === 'profile' && <Profile />}
    <Nav tab={tab} setTab={setTab} />
  </div>;
}
