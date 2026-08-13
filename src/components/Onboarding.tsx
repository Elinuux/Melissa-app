import { useState, type ReactNode } from 'react';
import { appConfig } from '../config';
import { store } from '../services/storageService';

const slides = [
  ['Bienvenue Mélissa', appConfig.tagline],
  ['Tes objectifs', `💼 Trouver mon alternance\n🏃 Faire du sport\n🇬🇧 Améliorer mon anglais`],
  ['À partir de quelle heure ?', `${appConfig.defaultStartHour} est déjà prérempli.`],
  ['Sport', '3 séances par semaine pour commencer.'],
  ['Rappels', 'Tu pourras activer les notifications iPhone depuis Profil.'],
] as const;

export function Onboarding({ children }: { children: ReactNode }) {
  const [done, setDone] = useState(() => store.get('onboardingDone', false));
  const [index, setIndex] = useState(0);

  if (done) return <>{children}</>;

  const [title, text] = slides[index];
  const next = () => {
    if (index < slides.length - 1) {
      setIndex((value) => value + 1);
      return;
    }
    store.set('onboardingDone', true);
    setDone(true);
  };

  return (
    <div className="onboarding">
      <div className="onboarding-card">
        <div className="dots" aria-label={`Étape ${index + 1} sur ${slides.length}`}>
          {slides.map((_, itemIndex) => (
            <span className={itemIndex === index ? 'on' : ''} key={itemIndex} />
          ))}
        </div>
        <p className="eyebrow">{appConfig.name}</p>
        <h1>{title}</h1>
        <p className="onboarding-text">{text}</p>
        <button className="primary" onClick={next}>
          {index === slides.length - 1 ? 'COMMENCER' : 'CONTINUER'}
        </button>
      </div>
    </div>
  );
}
