export type Tab = 'today' | 'jobs' | 'sport' | 'english' | 'profile';

const tabs: Array<{ id: Tab; label: string; icon: string }> = [
  { id: 'today', label: 'Aujourd’hui', icon: '⌂' },
  { id: 'jobs', label: 'Alternance', icon: '💼' },
  { id: 'sport', label: 'Sport', icon: '🏃' },
  { id: 'english', label: 'English', icon: '🇬🇧' },
  { id: 'profile', label: 'Profil', icon: '●' },
];

export function Nav({ tab, setTab }: { tab: Tab; setTab: (tab: Tab) => void }) {
  return (
    <nav className="bottom-nav" aria-label="Navigation principale">
      {tabs.map(({ id, label, icon }) => (
        <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)} aria-current={tab === id ? 'page' : undefined}>
          <span className="nav-icon" aria-hidden="true">{icon}</span>
          <small>{label}</small>
        </button>
      ))}
    </nav>
  );
}
