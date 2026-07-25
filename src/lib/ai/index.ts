export interface CrisisPlan {
  patientScript: string;
  caregiverAdvice: string;
  severityLevel: 'low' | 'medium' | 'high';
}

export interface IAIProvider {
  evaluateCrisis(transcript: string): Promise<CrisisPlan>;
}

import { GeminiProvider } from './gemini';
import { GroqProvider } from './groq';

export class AIFactory {
  static getProvider(name: 'gemini' | 'groq' = 'gemini'): IAIProvider {
    if (name === 'gemini') {
      return new GeminiProvider();
    }
    if (name === 'groq') {
      return new GroqProvider();
    }
    throw new Error('Unsupported AI provider');
  }
}
