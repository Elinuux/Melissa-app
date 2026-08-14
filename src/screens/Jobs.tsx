import { useEffect, useState, type FormEvent } from 'react';
import { Card } from '../components/Card';
import { platforms, suggestedSearches } from '../data/jobs';
import type { Application } from '../types';
import { addApplication, listApplications } from '../services/applicationService';
import { useSession } from '../services/session';

export function Jobs() {
  const { user } = useSession();
  const uid = user?.uid ?? null;
  const [queryText, setQueryText] = useState(suggestedSearches[0]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { void listApplications(uid).then(setApplications); }, [uid]);

  const add = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const draft: Application = {
      id: crypto.randomUUID(),
      company: String(data.get('company')),
      title: String(data.get('title')),
      url: String(data.get('url') || ''),
      location: String(data.get('location') || ''),
      date: new Date().toISOString().slice(0, 10),
      status: 'À regarder',
    };
    const saved = await addApplication(uid, draft);
    setApplications((current) => [saved, ...current]);
    setShowForm(false);
  };

  return <main>
    <header className="screen-header">
      <p className="eyebrow">Alternance</p>
      <h1>Trouver une offre</h1>
      <p className="muted">M2 Expert financier · Île-de-France</p>
    </header>

    <Card className="jobs-search-card">
      <label className="search-box" aria-label="Recherche d’alternance">
        <span className="search-icon">⌕</span>
        <input value={queryText} onChange={(event) => setQueryText(event.target.value)} placeholder="Ex. alternance contrôle de gestion Paris" />
      </label>
      <div className="search-chips" aria-label="Suggestions de recherche">
        {suggestedSearches.slice(0, 6).map((value) => <button key={value} className={queryText === value ? 'active' : ''} onClick={() => setQueryText(value)}>{value.replace('alternance ', '').replace(' Île-de-France', '').replace(' Paris', '')}</button>)}
      </div>
      <p className="section-note">Ouvrir la même recherche sur :</p>
      <div className="platform-grid">{platforms.map((platform) => <a key={platform.name} className="platform" href={platform.url(queryText)} target="_blank" rel="noreferrer"><span className="platform-name">{platform.name}</span><span className="platform-arrow">↗</span></a>)}</div>
    </Card>

    <button className="primary sticky-action" onClick={() => setShowForm(true)}>＋ AJOUTER UNE OFFRE</button>
    {showForm && <Card><form onSubmit={add} className="stack"><input name="company" placeholder="Entreprise" required/><input name="title" placeholder="Intitulé" required/><input name="url" type="url" placeholder="Lien de l’offre"/><input name="location" placeholder="Localisation"/><button className="primary">Enregistrer</button><button type="button" className="secondary" onClick={() => setShowForm(false)}>Annuler</button></form></Card>}

    <div className="section-heading"><div><p className="eyebrow">SUIVI</p><h2>Mes candidatures</h2></div><span className="count-pill">{applications.length}</span></div>
    {applications.length === 0 ? <Card><p>Aucune offre enregistrée pour l’instant.</p><p className="muted">Dès qu’une offre t’intéresse, ajoute-la ici pour savoir quoi faire ensuite.</p></Card> : applications.map((application) => <Card key={application.id} className="application-card"><span className="status">{application.status}</span><h3>{application.company}</h3><p>{application.title}</p><small>{application.location}</small></Card>)}
  </main>;
}
