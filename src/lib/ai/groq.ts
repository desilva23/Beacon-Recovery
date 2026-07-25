import Groq from 'groq-sdk';
import { IAIProvider, CrisisPlan } from './index';

export class GroqProvider implements IAIProvider {
  private groq: Groq;

  constructor() {
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });
  }

  async evaluateCrisis(transcript: string): Promise<CrisisPlan> {
    const prompt = `You are a compassionate addiction recovery assistant.
Analyze this patient transcript and provide a crisis intervention plan.
Transcript: "${transcript}"

Return ONLY valid JSON matching this exact structure:
{
  "patientScript": "string: A calming, empathetic script to read to the patient",
  "caregiverAdvice": "string: Contextual advice for the caregiver on how to help",
  "severityLevel": "low | medium | high"
}`;

    const response = await this.groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    try {
      const text = response.choices[0]?.message?.content || '{}';
      return JSON.parse(text) as CrisisPlan;
    } catch (e) {
      console.error("Failed to parse Groq response", e);
      throw e;
    }
  }
}
