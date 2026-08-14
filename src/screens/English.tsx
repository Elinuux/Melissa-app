import { useEffect, useMemo, useRef, useState } from 'react';
import { Card } from '../components/Card';
import { englishQuestions } from '../data/englishQuestions';
import { englishTracks, miniLessons, speakingModes } from '../data/englishContent';
import { store } from '../services/storageService';
import type { EnglishLevel, EnglishMistake, EnglishProfile, EnglishQuestion } from '../types';
import { aiService } from '../services/aiService';

type View = 'home' | 'quiz' | 'results' | 'mistakes' | 'speaking' | 'lesson';
type QuizFeedback = { ok:boolean; text:string } | null;

export function English() {
  const [view, setView] = useState<View>('home');
  const [profile, setProfile] = useState<EnglishProfile | null>(() => store.get<EnglishProfile | null>('englishProfile', null));
  const [questions, setQuestions] = useState<EnglishQuestion[]>([]);
  const [sessionTitle, setSessionTitle] = useState('');
  const [assessment, setAssessment] = useState(false);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<QuizFeedback>(null);
  const [sessionMistakes, setSessionMistakes] = useState<EnglishMistake[]>([]);
  const [selectedLesson, setSelectedLesson] = useState(miniLessons[0]);
  const [selectedSpeakingId, setSelectedSpeakingId] = useState(speakingModes[0].id);
  const allMistakes = store.get<EnglishMistake[]>('englishMistakes', []);

  const startSession = (title: string, categories: string[], count: number, isAssessment = false) => {
    let pool = englishQuestions.filter((question) => categories.length === 0 || categories.includes(question.category));
    if (!isAssessment && profile) pool = pool.filter((question) => levelAllows(profile.level, question.difficulty));
    if (pool.length < count) pool = englishQuestions.filter((question) => isAssessment || !profile || levelAllows(profile.level, question.difficulty));
    const selected = shuffle(pool).slice(0, count);
    setQuestions(selected);
    setSessionTitle(title);
    setAssessment(isAssessment);
    setIndex(0);
    setScore(0);
    setFeedback(null);
    setSessionMistakes([]);
    setView('quiz');
  };

  const answer = (choiceIndex: number) => {
    if (feedback) return;
    const question = questions[index];
    const ok = choiceIndex === question.answer;
    if (ok) {
      setScore((value) => value + 1);
      setFeedback({ ok:true, text:'Bonne réponse. Continue.' });
    } else {
      const mistake: EnglishMistake = {
        questionId:question.id,
        prompt:question.prompt,
        chosen:question.choices[choiceIndex],
        correct:question.choices[question.answer],
        explanation:question.explanation,
        category:question.category,
        date:new Date().toISOString(),
      };
      setSessionMistakes((current) => [...current, mistake]);
      setFeedback({ ok:false, text:question.explanation });
    }
  };

  const next = () => {
    setFeedback(null);
    if (index < questions.length - 1) {
      setIndex((value) => value + 1);
      return;
    }
    finishSession();
  };

  const finishSession = () => {
    const previous = store.get<EnglishMistake[]>('englishMistakes', []);
    store.set('englishMistakes', [...sessionMistakes, ...previous].slice(0, 100));
    const weak = [...new Set(sessionMistakes.map((mistake) => mistake.category))];
    store.set('englishWeakCategories', weak);
    if (assessment) {
      const ratio = questions.length ? score / questions.length : 0;
      const level = scoreToLevel(ratio);
      const nextProfile: EnglishProfile = { level, score, weakCategories:weak, assessedAt:new Date().toISOString() };
      store.set('englishProfile', nextProfile);
      setProfile(nextProfile);
    } else if (profile && weak.length) {
      const nextProfile = { ...profile, weakCategories:weak };
      store.set('englishProfile', nextProfile);
      setProfile(nextProfile);
    }
    setView('results');
  };

  if (view === 'quiz') {
    const question = questions[index];
    if (!question) return <main><Card><p>Cette session n’a pas pu être préparée.</p><button className="primary" onClick={() => setView('home')}>RETOUR</button></Card></main>;
    return <main className="english-quiz">
      <header className="screen-header"><p className="eyebrow">{sessionTitle}</p><h1>{index + 1} / {questions.length}</h1><div className="quiz-progress"><span style={{ width:`${((index + 1) / questions.length) * 100}%` }}/></div></header>
      <Card className="question-card"><span className="question-topic">{question.category} · {question.difficulty}</span><h2>{question.prompt}</h2><div className="answers">{question.choices.map((choice, choiceIndex) => <button key={`${choice}-${choiceIndex}`} onClick={() => answer(choiceIndex)}>{String.fromCharCode(65 + choiceIndex)}. {choice}</button>)}</div>{feedback && <div className={`feedback ${feedback.ok ? 'feedback-ok' : 'feedback-error'}`}><strong>{feedback.ok ? '✓ Bien vu' : 'À comprendre'}</strong><p>{feedback.text}</p><button className="primary" onClick={next}>{index === questions.length - 1 ? 'VOIR MON BILAN' : 'CONTINUER'}</button></div>}</Card>
    </main>;
  }

  if (view === 'results') {
    const ratio = questions.length ? score / questions.length : 0;
    const detected = assessment ? scoreToLevel(ratio) : profile?.level;
    const weak = [...new Set(sessionMistakes.map((mistake) => mistake.category))];
    return <main><header className="screen-header"><p className="eyebrow">Bilan de session</p><h1>{score} / {questions.length}</h1><p className="muted">{assessment ? `Niveau de travail proposé : ${detected}` : 'Chaque session ajuste progressivement les prochaines révisions.'}</p></header>
      <Card className="english-result-card"><div className="score-ring" style={{ '--score':`${Math.round(ratio * 100)}%` } as React.CSSProperties}><strong>{Math.round(ratio * 100)}%</strong><small>réussite</small></div><div><p className="eyebrow">À RETENIR</p><h2>{weak.length ? `${weak.length} point${weak.length > 1 ? 's' : ''} à revoir` : 'Session maîtrisée'}</h2><p className="muted">{weak.length ? weak.join(' · ') : 'Tu peux passer à une session un peu plus exigeante.'}</p></div></Card>
      {sessionMistakes.length > 0 && <Card><p className="eyebrow">PROCHAINE ÉTAPE</p><h2>Comprendre mes erreurs</h2><p className="muted">Les erreurs sont regroupées par notion pour éviter de revoir dix fois la même explication.</p><button className="primary" onClick={() => setView('mistakes')}>VOIR MES ERREURS</button></Card>}
      <button className="secondary full" onClick={() => setView('home')}>RETOUR À ENGLISH</button>
    </main>;
  }

  if (view === 'mistakes') return <MistakesView mistakes={allMistakes.length ? allMistakes : sessionMistakes} onPractice={(category) => startSession(`Révision · ${category}`, [category], 5)} onBack={() => setView('home')} />;
  if (view === 'speaking') return <SpeakingView selectedId={selectedSpeakingId} setSelectedId={setSelectedSpeakingId} onBack={() => setView('home')} />;
  if (view === 'lesson') return <LessonView lesson={selectedLesson} onBack={() => setView('home')} onPractice={() => startSession(selectedLesson.title, selectedLesson.id === 'emails' ? ['Emails'] : selectedLesson.id === 'figures' ? ['Presenting figures','Finance vocabulary'] : ['Introduce yourself','Job interviews'], 6)} />;

  const weak = profile?.weakCategories ?? store.get<string[]>('englishWeakCategories', []);
  return <main>
    <header className="screen-header english-header"><p className="eyebrow">English</p><h1>Ton anglais, utile au travail.</h1><p className="muted">Business English, finance, grammaire et oral — au niveau qui te correspond.</p></header>

    {!profile ? <Card className="hero-card level-card"><div className="level-badge">?</div><div><p className="eyebrow">DÉPART</p><h2>Évaluer mon niveau</h2><p className="muted">20 questions courtes pour adapter la suite, sans examen interminable.</p></div><button className="primary" onClick={() => startSession('Évaluation', [], 20, true)}>COMMENCER L’ÉVALUATION</button></Card> : <Card className="level-card"><div className="level-badge">{profile.level}</div><div><p className="eyebrow">TON NIVEAU DE TRAVAIL</p><h2>{profile.level}</h2><p className="muted">Basé sur ton dernier test. Les exercices proposés restent autour de ce niveau.</p></div><button className="secondary full" onClick={() => startSession('Nouvelle évaluation', [], 20, true)}>RÉÉVALUER</button></Card>}

    <div className="english-shortcuts">
      <button onClick={() => setView('speaking')}><span>🎙️</span><strong>Oral</strong><small>Parler et s’écouter</small></button>
      <button onClick={() => setView('mistakes')}><span>↺</span><strong>Mes erreurs</strong><small>{allMistakes.length} enregistrées</small></button>
    </div>

    <div className="section-heading"><div><p className="eyebrow">AUJOURD’HUI</p><h2>Choisir une session</h2></div></div>
    <div className="learning-grid">{englishTracks.map((track) => <button key={track.id} className="learning-card" onClick={() => startSession(track.title, track.categories, track.count)}><span className="learning-icon">{track.icon}</span><strong>{track.title}</strong><small>{track.subtitle}</small><span className="learning-arrow">→</span></button>)}</div>

    {weak.length > 0 && <Card className="weak-card"><p className="eyebrow">À RENFORCER</p><h2>Je te repropose ces notions</h2><div className="muscle-chips">{weak.map((category) => <button key={category} onClick={() => startSession(`Révision · ${category}`, [category], 5)}>{category}</button>)}</div></Card>}

    <div className="section-heading"><div><p className="eyebrow">MINI-LEÇONS</p><h2>Comprendre avant de répondre</h2></div></div>
    {miniLessons.map((lesson) => <Card key={lesson.id} className="lesson-preview" onClick={() => { setSelectedLesson(lesson); setView('lesson'); }}><span className="lesson-level">{lesson.level}</span><h3>{lesson.title}</h3><p className="muted">{lesson.phrases[0]}</p><span className="text-link">Ouvrir la leçon →</span></Card>)}
  </main>;
}

function MistakesView({ mistakes, onPractice, onBack }: { mistakes:EnglishMistake[]; onPractice:(category:string)=>void; onBack:()=>void }) {
  const groups = useMemo(() => groupMistakes(mistakes), [mistakes]);
  return <main><header className="screen-header"><p className="eyebrow">Révision</p><h1>Mes erreurs</h1><p className="muted">Une notion = une explication claire, puis quelques questions ciblées.</p></header>
    {groups.length === 0 ? <Card><h2>Rien à revoir pour le moment</h2><p className="muted">Tes prochaines erreurs utiles apparaîtront ici.</p></Card> : groups.map(([category, items]) => <Card key={category} className="mistake-group"><div className="section-heading"><div><p className="eyebrow">{items.length} ERREUR{items.length > 1 ? 'S' : ''}</p><h2>{category}</h2></div></div><p><strong>Exemple :</strong> {items[0].prompt}</p><p>Ta réponse : <span className="wrong-answer">{items[0].chosen}</span></p><p>Bonne réponse : <strong>{items[0].correct}</strong></p><p className="muted">{items[0].explanation}</p><button className="primary" onClick={() => onPractice(category)}>M’ENTRAÎNER SUR CE POINT</button></Card>)}
    <button className="secondary full" onClick={onBack}>RETOUR</button>
  </main>;
}

function LessonView({ lesson, onBack, onPractice }: { lesson:typeof miniLessons[number]; onBack:()=>void; onPractice:()=>void }) {
  const listen = (phrase: string) => { if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(phrase)); } };
  return <main><header className="screen-header"><p className="eyebrow">Mini-leçon · {lesson.level}</p><h1>{lesson.title}</h1></header><Card><p>{lesson.tip}</p></Card>{lesson.phrases.map((phrase) => <Card key={phrase} className="phrase-card"><p>{phrase}</p><button className="listen-button" onClick={() => listen(phrase)}>🔊 Écouter</button></Card>)}<button className="primary" onClick={onPractice}>M’ENTRAÎNER</button><button className="secondary full" onClick={onBack}>RETOUR</button></main>;
}

function SpeakingView({ selectedId, setSelectedId, onBack }: { selectedId:string; setSelectedId:(id:string)=>void; onBack:()=>void }) {
  const mode = speakingModes.find((item) => item.id === selectedId) ?? speakingModes[0];
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => () => { streamRef.current?.getTracks().forEach((track) => track.stop()); if (audioUrl) URL.revokeObjectURL(audioUrl); }, [audioUrl]);

  const start = async () => {
    setMessage('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio:true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type:recorder.mimeType || 'audio/mp4' });
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.start();
      setRecording(true);
    } catch { setMessage('Le microphone n’est pas autorisé sur cet iPhone.'); }
  };

  const stop = () => { recorderRef.current?.stop(); setRecording(false); };
  const listen = () => { if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(mode.prompt)); } };

  return <main><header className="screen-header"><p className="eyebrow">Speaking</p><h1>Parler sans pression.</h1><p className="muted">Enregistre, réécoute, puis recommence si tu veux.</p></header>
    <div className="speaking-mode-row">{speakingModes.map((item) => <button key={item.id} className={selectedId===item.id?'active':''} onClick={() => setSelectedId(item.id)}>{item.icon}<span>{item.title}</span></button>)}</div>
    <Card className="speaking-card"><span className="speaking-duration">≈ {mode.duration} sec</span><h2>{mode.prompt}</h2>{mode.id === 'repeat' && <button className="secondary full" onClick={listen}>🔊 ÉCOUTER LA PHRASE</button>}<button className={`record-button ${recording?'recording':''}`} onClick={() => recording ? stop() : void start()}><span />{recording ? 'ARRÊTER' : 'ENREGISTRER MA RÉPONSE'}</button>{audioUrl && <div className="audio-review"><p className="eyebrow">TA RÉPONSE</p><audio controls src={audioUrl}/><p className="muted">Réécoute-toi. L’analyse de transcription et la reformulation seront proposées par l’IA lorsqu’elle sera activée.</p>{aiService.available && <button className="secondary full" onClick={() => setMessage('La transcription audio serveur sera activée dans l’étape IA avancée.')}>ANALYSER MA RÉPONSE</button>}</div>}{message && <p className="notice">{message}</p>}</Card>
    <button className="secondary full" onClick={onBack}>RETOUR</button>
  </main>;
}

function shuffle<T>(values: T[]): T[] { return [...values].sort(() => Math.random() - .5); }
function scoreToLevel(ratio: number): EnglishLevel { if (ratio < .4) return 'A2'; if (ratio < .7) return 'B1'; if (ratio < .86) return 'B1+'; return 'B2'; }
function levelAllows(level: EnglishLevel, difficulty: EnglishQuestion['difficulty']) { if (level === 'A2') return difficulty === 'A2'; if (level === 'B1') return difficulty !== 'B2'; return true; }
function groupMistakes(mistakes: EnglishMistake[]): Array<[string,EnglishMistake[]]> {
  const grouped = new Map<string,EnglishMistake[]>();
  mistakes.forEach((mistake) => grouped.set(mistake.category, [...(grouped.get(mistake.category) ?? []), mistake]));
  return [...grouped.entries()];
}
