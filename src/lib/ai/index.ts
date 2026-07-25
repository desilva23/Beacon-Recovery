export interface CrisisPlan {
  patientScript: string;
  caregiverAdvice: string;
  severityLevel: 'low' | 'medium' | 'high';
}

export interface IAIProvider {
  evaluateCrisis(transcript: string): Promise<CrisisPlan>;
}

import { GroqProvider } from './groq';

export class AIFactory {
  static getProvider(): IAIProvider {
    return new GroqProvider();
  }
}
