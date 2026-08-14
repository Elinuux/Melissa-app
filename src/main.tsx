import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import './styles.css';
import './featureStyles.css';
import { SessionProvider } from './services/session';
import { AuthGate } from './components/AuthGate';
import { Onboarding } from './components/Onboarding';

registerSW({ immediate:true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SessionProvider>
      <AuthGate>
        <Onboarding><App /></Onboarding>
      </AuthGate>
    </SessionProvider>
  </StrictMode>,
);
