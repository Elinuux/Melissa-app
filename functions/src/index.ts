import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import webpush from 'web-push';

initializeApp();

const vapidPublic = defineSecret('WEB_PUSH_PUBLIC_KEY');
const vapidPrivate = defineSecret('WEB_PUSH_PRIVATE_KEY');
const openAIKey = defineSecret('OPENAI_API_KEY');
const geminiKey = defineSecret('GEMINI_API_KEY');
const anthropicKey = defineSecret('ANTHROPIC_API_KEY');

export const sendDueNotifications = onSchedule({ schedule:'every 1 minutes', timeZone:'Europe/Paris', secrets:[vapidPublic,vapidPrivate] }, async () => {
  webpush.setVapidDetails('mailto:owner@example.invalid', vapidPublic.value(), vapidPrivate.value());
  const db = getFirestore();
  const now = Timestamp.now();
  const due = await db.collectionGroup('notificationJobs').where('status','==','pending').where('scheduledAt','<=',now).limit(20).get();
  for (const job of due.docs) {
    const uid = job.ref.parent.parent?.id;
    if (!uid) continue;
    const data = job.data();
    const subscriptions = await db.collection('users').doc(uid).collection('pushSubscriptions').get();
    const navigate = `/?activity=${encodeURIComponent(data.kind || 'today')}&notification=1&job=${encodeURIComponent(job.id)}`;
    const payload = JSON.stringify({ web_push:8030, notification:{ title:data.title || 'Mélissa app', body:data.body || '', navigate, silent:false, app_badge:'1' } });
    await Promise.allSettled(subscriptions.docs.map((subscription) => webpush.sendNotification(subscription.data().subscription, payload)));
    await job.ref.update({ status:'sent', sentAt:Timestamp.now() });
  }
});

type Provider = 'openai' | 'gemini' | 'claude';
type Task = 'analyse-offer' | 'improve-cv' | 'adapt-cv' | 'interview-prep' | 'english-feedback';

export const aiAssistOpenAI = onCall({ region:'europe-west9', secrets:[openAIKey], timeoutSeconds:60, memory:'256MiB' }, async (request) =>
  handleAI('openai', request.auth, request.data));

export const aiAssistGemini = onCall({ region:'europe-west9', secrets:[geminiKey], timeoutSeconds:60, memory:'256MiB' }, async (request) =>
  handleAI('gemini', request.auth, request.data));

export const aiAssistClaude = onCall({ region:'europe-west9', secrets:[anthropicKey], timeoutSeconds:60, memory:'256MiB' }, async (request) =>
  handleAI('claude', request.auth, request.data));

async function handleAI(provider: Provider, auth: unknown, data: any) {
  if (!auth) throw new HttpsError('unauthenticated', 'Connexion requise pour utiliser l’assistant IA.');
  const task = String(data?.task || '') as Task;
  const payload = (data?.payload ?? {}) as Record<string, unknown>;
  if (!['analyse-offer','improve-cv','adapt-cv','interview-prep','english-feedback'].includes(task)) {
    throw new HttpsError('invalid-argument', 'Tâche IA invalide.');
  }
  const prompt = buildPrompt(task, payload);
  try {
    const text = provider === 'openai' ? await callOpenAI(prompt) : provider === 'gemini' ? await callGemini(prompt) : await callClaude(prompt);
    return { text, provider };
  } catch (error) {
    console.error('AI provider failure', provider, error);
    throw new HttpsError('unavailable', 'Assistant IA temporairement indisponible.');
  }
}

function buildPrompt(task: Task, payload: Record<string, unknown>): string {
  const safety = `Tu aides Mélissa, étudiante en M2 Expert financier recherchant une alternance en Île-de-France. N'invente jamais une expérience, un diplôme, un logiciel, une compétence, un niveau de langue ou un résultat. Si une information manque, signale-la. Réponds de façon concise et exploitable en français, sauf exercice d'anglais.`;
  if (task === 'improve-cv') return `${safety}\n\nAnalyse le CV ci-dessous. Le texte contient des identifiants [sectionId:...]. Retourne UNIQUEMENT un JSON valide de la forme {"suggestions":[{"sectionId":"...","after":"...","reason":"..."}]}. Ne modifie que la présentation de faits déjà présents.\n\n${String(payload.cv || '')}`;
  if (task === 'adapt-cv') return `${safety}\n\nAdapte la présentation du CV à l'offre, sans rien inventer. Retourne un JSON de suggestions section par section.\nCV:\n${String(payload.cv || '')}\n\nOFFRE:\n${String(payload.offer || '')}`;
  if (task === 'analyse-offer') return `${safety}\n\nAnalyse cette offre et fournis: ce qu'ils recherchent, points à mettre en avant, points à renforcer, mots-clés CV et questions d'entretien.\n\n${String(payload.text || '')}`;
  if (task === 'interview-prep') return `${safety}\n\nPrépare un entretien court et réaliste à partir de ce contexte:\n${String(payload.context || '')}`;
  return `${safety}\n\nAgis comme professeur d'anglais professionnel. Analyse cette transcription sans prétendre évaluer précisément l'accent. Donne: points réussis, 2 améliorations maximum et une meilleure formulation.\nContexte: ${String(payload.context || '')}\nTranscription: ${String(payload.transcript || '')}`;
}

async function callOpenAI(prompt: string): Promise<string> {
  const key = openAIKey.value();
  if (!key) throw new Error('OPENAI_API_KEY missing');
  const response = await fetch('https://api.openai.com/v1/responses', {
    method:'POST',
    headers:{ 'Authorization':`Bearer ${key}`, 'Content-Type':'application/json' },
    body:JSON.stringify({ model:'gpt-5.5', input:prompt, max_output_tokens:1800 }),
  });
  if (!response.ok) throw new Error(`OpenAI ${response.status}`);
  const json = await response.json() as any;
  const direct = typeof json.output_text === 'string' ? json.output_text : '';
  if (direct) return direct;
  return (json.output ?? []).flatMap((item:any) => item.content ?? []).filter((part:any) => part.type === 'output_text').map((part:any) => part.text).join('\n');
}

async function callGemini(prompt: string): Promise<string> {
  const key = geminiKey.value();
  if (!key) throw new Error('GEMINI_API_KEY missing');
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent', {
    method:'POST',
    headers:{ 'x-goog-api-key':key, 'Content-Type':'application/json' },
    body:JSON.stringify({ contents:[{ role:'user', parts:[{ text:prompt }] }] }),
  });
  if (!response.ok) throw new Error(`Gemini ${response.status}`);
  const json = await response.json() as any;
  return json.candidates?.[0]?.content?.parts?.map((part:any) => part.text ?? '').join('\n') ?? '';
}

async function callClaude(prompt: string): Promise<string> {
  const key = anthropicKey.value();
  if (!key) throw new Error('ANTHROPIC_API_KEY missing');
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method:'POST',
    headers:{ 'x-api-key':key, 'anthropic-version':'2023-06-01', 'content-type':'application/json' },
    body:JSON.stringify({ model:'claude-haiku-4-5-20251001', max_tokens:1800, messages:[{ role:'user', content:prompt }] }),
  });
  if (!response.ok) throw new Error(`Claude ${response.status}`);
  const json = await response.json() as any;
  return (json.content ?? []).filter((part:any) => part.type === 'text').map((part:any) => part.text).join('\n');
}
