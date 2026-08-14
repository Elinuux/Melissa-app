import { httpsCallable } from 'firebase/functions';
import type { AIProvider, AIResult, AITask } from '../types';
import { functions } from './firebase';

export interface AIService {
  available: boolean;
  provider: AIProvider;
  run(task: AITask, payload: Record<string, unknown>): Promise<AIResult>;
  analyseOffer(text: string): Promise<AIResult>;
  improveCV(cv: string): Promise<AIResult>;
  adaptCV(cv: string, offer: string): Promise<AIResult>;
  interviewPrep(context: string): Promise<AIResult>;
  englishFeedback(transcript: string, context: string): Promise<AIResult>;
}

const configuredProvider = (import.meta.env.VITE_AI_PROVIDER || 'openai') as AIProvider;
const enabled = import.meta.env.VITE_AI_ENABLED === 'true' && Boolean(functions);

class FirebaseAIService implements AIService {
  available = enabled;
  provider = configuredProvider;

  async run(task: AITask, payload: Record<string, unknown>): Promise<AIResult> {
    if (!this.available || !functions) throw new Error('AI_NOT_CONFIGURED');
    const call = httpsCallable<{ task:AITask; provider:AIProvider; payload:Record<string,unknown> }, AIResult>(functions, 'aiAssist');
    const response = await call({ task, provider:this.provider, payload });
    return response.data;
  }

  analyseOffer(text: string) { return this.run('analyse-offer', { text }); }
  improveCV(cv: string) { return this.run('improve-cv', { cv }); }
  adaptCV(cv: string, offer: string) { return this.run('adapt-cv', { cv, offer }); }
  interviewPrep(context: string) { return this.run('interview-prep', { context }); }
  englishFeedback(transcript: string, context: string) { return this.run('english-feedback', { transcript, context }); }
}

export const aiService: AIService = new FirebaseAIService();
