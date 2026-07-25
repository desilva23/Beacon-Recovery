import { GoogleGenAI } from '@google/genai';
import { IAIProvider, CrisisPlan } from './index';

export class GeminiProvider implements IAIProvider {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  }

  async evaluateCrisis(transcript: string): Promise<CrisisPlan> {
    const prompt = `You are a compassionate addiction recovery assistant.
Analyze this patient transcript and provide a crisis intervention plan.
Transcript: "${transcript}"

Return JSON matching this exact structure:
{
  "patientScript": "string: A calming, empathetic script to read to the patient",
  "caregiverAdvice": "string: Contextual advice for the caregiver on how to help",
  "severityLevel": "low | medium | high"
}`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    try {
      const text = response.text;
      return JSON.parse(text) as CrisisPlan;
    } catch (e) {
      console.error("Failed to parse Gemini response", e);
      throw e;
    }
  }
}
