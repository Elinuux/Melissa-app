export interface AIService {
  available: boolean;
  analyseOffer(text: string): Promise<string>;
}

class DisabledAI implements AIService {
  available = false;

  async analyseOffer(_text: string): Promise<string> {
    throw new Error('AI_NOT_CONFIGURED');
  }
}

export const aiService: AIService = new DisabledAI();
