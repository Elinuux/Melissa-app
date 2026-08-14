import { useState, type ReactNode } from 'react';
import { useSession } from '../services/session';
import { appConfig } from '../config';

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, ready, demo, login } = useSession();
  const [error, setError] = useState('');
  const [localMode, setLocalMode] = useState(() => sessionStorage.getItem('melissa-local-mode') === '1');

  if (!ready) return <div className="center-screen">Chargement…</div>;
  if (demo || user || localMode) return <>{children}</>;

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      await login(String(form.get('email')), String(form.get('password')));
    } catch {
      setError('Email ou mot de passe incorrect.');
    }
  };

  const continueLocally = () => {
    sessionStorage.setItem('melissa-local-mode', '1');
    setLocalMode(true);
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <p className="eyebrow">{appConfig.name}</p>
        <h1>Bonsoir Mélissa</h1>
        <p className="muted">Connecte-toi pour retrouver ton programme sur tous tes appareils.</p>
        <form className="stack" onSubmit={submit}>
          <input name="email" type="email" inputMode="email" placeholder="Email" autoComplete="email" required />
          <input name="password" type="password" placeholder="Mot de passe" autoComplete="current-password" required />
          <button className="primary">SE CONNECTER</button>
        </form>
        <button className="secondary" type="button" onClick={continueLocally}>CONTINUER SUR CET IPHONE</button>
        {error && <p className="notice error">{error}</p>}
      </div>
    </div>
  );
}
