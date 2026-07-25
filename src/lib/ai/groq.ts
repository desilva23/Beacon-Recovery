import Groq from 'groq-sdk';
import { IAIProvider, CrisisPlan } from './index';

// Singleton client — initialised once per process, not on every request
let groqClient: Groq | null = null;

function getGroqClient(): Groq {
  if (!groqClient) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY ?? '' });
  }
  return groqClient;
}

const SYSTEM_PROMPT =
  'You are a compassionate addiction recovery assistant. ' +
  'Analyze the patient transcript and return ONLY valid JSON.';

const USER_PROMPT_TEMPLATE = (transcript: string) =>
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

export class GroqProvider implements IAIProvider {
  async evaluateCrisis(transcript: string): Promise<CrisisPlan> {
    const groq = getGroqClient();

    const response = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: USER_PROMPT_TEMPLATE(transcript) },
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      temperature: 0.4,
      max_tokens: 512,
    });

    const text = response.choices[0]?.message?.content ?? '{}';

    try {
      const parsed = JSON.parse(text) as Partial<CrisisPlan>;
      // Validate required fields; fall back gracefully if AI omits any
      return {
        patientScript: parsed.patientScript ?? FALLBACK_PLAN.patientScript,
        caregiverAdvice: parsed.caregiverAdvice ?? FALLBACK_PLAN.caregiverAdvice,
        severityLevel: parsed.severityLevel ?? FALLBACK_PLAN.severityLevel,
      };
    } catch (e) {
      console.error('Failed to parse Groq response', e);
      return FALLBACK_PLAN;
    }
  }
}
