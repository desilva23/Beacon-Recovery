import { GoogleGenAI } from '@google/genai';
import { IAIProvider, CrisisPlan } from './index';

// Singleton client — initialised once per process, not on every request
let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? '' });
  }
  return geminiClient;
}

const SYSTEM_INSTRUCTION =
  'You are a compassionate addiction recovery assistant. ' +
  'Return ONLY valid JSON. No markdown, no explanation.';

const buildPrompt = (transcript: string) =>
  `Transcript: "${transcript}"\n\n` +
  'Return JSON matching this exact structure:\n' +
  '{\n' +
  '  "patientScript": "A calming, empathetic script to read to the patient",\n' +
  '  "caregiverAdvice": "Contextual advice for the caregiver on how to help",\n' +
  '  "severityLevel": "low | medium | high"\n' +
  '}';

const FALLBACK_PLAN: CrisisPlan = {
  patientScript:
    "You're not alone. Take a slow, deep breath with me. You reached out — that takes real courage. Help is here.",
  caregiverAdvice:
    'Stay calm and present. Listen without judgment. Encourage grounding techniques and follow up regularly.',
  severityLevel: 'medium',
};

export class GeminiProvider implements IAIProvider {
  async evaluateCrisis(transcript: string): Promise<CrisisPlan> {
    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: buildPrompt(transcript),
      config: {
        responseMimeType: 'application/json',
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4,
        maxOutputTokens: 512,
      },
    });

    const text = response.text ?? '{}';

    try {
      const parsed = JSON.parse(text) as Partial<CrisisPlan>;
      return {
        patientScript: parsed.patientScript ?? FALLBACK_PLAN.patientScript,
        caregiverAdvice: parsed.caregiverAdvice ?? FALLBACK_PLAN.caregiverAdvice,
        severityLevel: parsed.severityLevel ?? FALLBACK_PLAN.severityLevel,
      };
    } catch (e) {
      console.error('Failed to parse Gemini response', e);
      return FALLBACK_PLAN;
    }
  }
}
