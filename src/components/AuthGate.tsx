import { useState, type ReactNode } from 'react';
import { useSession } from '../services/session';
import { getGreeting } from '../utils/greeting';
import { BrandMark } from './BrandMark';

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, ready, demo, login } = useSession();
  const [error, setError] = useState('');
  const [localMode, setLocalMode] = useState(() => localStorage.getItem('melissa-local-mode') === '1');

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
    localStorage.setItem('melissa-local-mode', '1');
    setLocalMode(true);
  };

  return (
    <div className="login-screen">
      <div className="login-glow login-glow--one" />
      <div className="login-glow login-glow--two" />
      <div className="login-card">
        <BrandMark />
        <div className="login-copy">
          <p className="eyebrow">Ton espace personnel</p>
          <h1>{getGreeting()}</h1>
          <p className="muted">Retrouve ton programme, tes candidatures et ta progression sur tous tes appareils.</p>
        </div>
        <form className="stack auth-form" onSubmit={submit}>
          <input name="email" type="email" inputMode="email" placeholder="Email" autoComplete="email" required />
          <input name="password" type="password" placeholder="Mot de passe" autoComplete="current-password" required />
          <button className="primary auth-action">SE CONNECTER</button>
        </form>
        <button className="secondary auth-action auth-local" type="button" onClick={continueLocally}>CONTINUER SUR CET IPHONE</button>
        {error && <p className="notice error">{error}</p>}
      </div>
    </div>
  );
}
