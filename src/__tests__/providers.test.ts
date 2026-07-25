import { GeminiProvider } from '@/lib/ai/gemini';
import { GroqProvider } from '@/lib/ai/groq';

// Mock Google GenAI
jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: jest.fn().mockResolvedValue({
        text: JSON.stringify({
          patientScript: 'You are safe. Take a deep breath.',
          caregiverAdvice: 'Stay calm. Sit with them.',
          severityLevel: 'medium'
        })
      })
    }
  }))
}));

// Mock Groq SDK
jest.mock('groq-sdk', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{
            message: {
              content: JSON.stringify({
                patientScript: 'You are not alone. Breathe slowly.',
                caregiverAdvice: 'Listen without judgment.',
                severityLevel: 'high'
              })
            }
          }]
        })
      }
    }
  }));
});

describe('GeminiProvider', () => {
  it('should return a valid CrisisPlan', async () => {
    const provider = new GeminiProvider();
    const plan = await provider.evaluateCrisis('I feel like relapsing');
    expect(plan).toHaveProperty('patientScript');
    expect(plan).toHaveProperty('caregiverAdvice');
    expect(plan).toHaveProperty('severityLevel');
    expect(['low', 'medium', 'high']).toContain(plan.severityLevel);
  });
});

describe('GroqProvider', () => {
  it('should return a valid CrisisPlan', async () => {
    const provider = new GroqProvider();
    const plan = await provider.evaluateCrisis('I am feeling overwhelmed and anxious');
    expect(plan).toHaveProperty('patientScript');
    expect(plan).toHaveProperty('caregiverAdvice');
    expect(plan).toHaveProperty('severityLevel');
    expect(['low', 'medium', 'high']).toContain(plan.severityLevel);
  });
});
