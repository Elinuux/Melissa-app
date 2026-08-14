import { useEffect, useState, type FormEvent } from 'react';
import { Card } from '../components/Card';
import { platforms, suggestedSearches } from '../data/jobs';
import type { Application } from '../types';
import { addApplication, listApplications } from '../services/applicationService';
import { useSession } from '../services/session';
import { CV } from './CV';

type JobsView = 'offers' | 'applications' | 'cv';

export function Jobs() {
  const { user } = useSession();
  const uid = user?.uid ?? null;
  const [view, setView] = useState<JobsView>('offers');
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
      notes: String(data.get('notes') || ''),
      date: new Date().toISOString().slice(0, 10),
      status: 'À regarder',
    };
    const saved = await addApplication(uid, draft);
    setApplications((current) => [saved, ...current]);
    setShowForm(false);
    setView('applications');
  };

  return <main>
    <header className="screen-header">
      <p className="eyebrow">Alternance</p>
      <h1>{view === 'cv' ? 'Mon CV' : view === 'applications' ? 'Mes candidatures' : 'Trouver une offre'}</h1>
      <p className="muted">M2 Expert financier · Île-de-France</p>
    </header>

    <div className="section-tabs" role="tablist" aria-label="Alternance">
      <button className={view==='offers'?'active':''} onClick={() => setView('offers')}>Offres</button>
      <button className={view==='applications'?'active':''} onClick={() => setView('applications')}>Suivi <span>{applications.length}</span></button>
      <button className={view==='cv'?'active':''} onClick={() => setView('cv')}>Mon CV</button>
    </div>

    {view === 'offers' && <>
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
      {showForm && <Card><form onSubmit={add} className="stack"><input name="company" placeholder="Entreprise" required/><input name="title" placeholder="Intitulé" required/><input name="url" type="url" placeholder="Lien de l’offre"/><input name="location" placeholder="Localisation"/><textarea name="notes" placeholder="Notes"/><button className="primary">Enregistrer</button><button type="button" className="secondary" onClick={() => setShowForm(false)}>Annuler</button></form></Card>}
    </>}

    {view === 'applications' && <>
      <button className="primary sticky-action" onClick={() => { setView('offers'); setShowForm(true); }}>＋ AJOUTER UNE OFFRE</button>
      {applications.length === 0 ? <Card><p>Aucune offre enregistrée pour l’instant.</p><p className="muted">Dès qu’une offre t’intéresse, ajoute-la ici pour savoir quoi faire ensuite.</p></Card> : applications.map((application) => <Card key={application.id} className="application-card"><span className="status">{application.status}</span><h3>{application.company}</h3><p>{application.title}</p><small>{application.location}</small>{application.notes && <p className="muted">{application.notes}</p>}<div className="application-next">Prochaine action : <strong>{application.status === 'Envoyée' ? 'Préparer la relance' : application.status === 'Entretien' ? 'Préparer l’entretien' : 'Relire l’offre'}</strong></div></Card>)}
    </>}

    {view === 'cv' && <CV />}
  </main>;
}
