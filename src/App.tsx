import { useEffect, useState } from 'react';
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

const themeColors: Record<Tab, string> = {
  today: '#8B78A8',
  jobs: '#2D69B3',
  sport: '#E76347',
  english: '#327E80',
  profile: '#76677F',
};

export default function App() {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [workout, setWorkout] = useState<SportSession | null>(null);

  useEffect(() => {
    document.documentElement.dataset.appTheme = workout ? 'sport' : tab;
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute('content', workout ? themeColors.sport : themeColors[tab]);
  }, [tab, workout]);

  if (workout) {
    return <div className="app-shell theme-sport"><Workout session={workout} onExit={() => setWorkout(null)} /></div>;
  }

  const startActivity = (activity: EveningActivity) => setTab(activity.kind === 'jobs' ? 'jobs' : activity.kind === 'sport' ? 'sport' : 'english');

  return <div className={`app-shell theme-${tab}`}>
    <NotificationActionBar onNavigate={setTab} />
    {tab === 'today' && <Today onStart={startActivity} />}
    {tab === 'jobs' && <Jobs />}
    {tab === 'sport' && <Sport onStart={setWorkout} />}
    {tab === 'english' && <English />}
    {tab === 'profile' && <Profile />}
    <Nav tab={tab} setTab={setTab} />
  </div>;
}
