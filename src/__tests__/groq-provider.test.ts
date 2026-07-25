// src/__tests__/groq-provider.test.ts
import { GroqProvider } from '@/lib/ai/groq';
import Groq from 'groq-sdk';

jest.mock('groq-sdk');

const mockChatCreate = jest.fn();
(Groq as unknown as jest.Mock).mockImplementation(() => ({
  chat: { completions: { create: mockChatCreate } },
}));

describe('GroqProvider.evaluateCrisis', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const provider = new GroqProvider();

  it('parses a well‑formed JSON response', async () => {
    mockChatCreate.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify({ patientScript: 'ps', caregiverAdvice: 'ca', severityLevel: 'high' }) } }],
    });
    const plan = await provider.evaluateCrisis('transcript');
    expect(plan.patientScript).toBe('ps');
    expect(plan.caregiverAdvice).toBe('ca');
    expect(plan.severityLevel).toBe('high');
  });

  it('falls back to defaults when fields are missing', async () => {
    mockChatCreate.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify({ patientScript: 'only script' }) } }],
    });
    const plan = await provider.evaluateCrisis('transcript');
    expect(plan.patientScript).toBe('only script');
    expect(plan.caregiverAdvice).toContain('Stay calm'); // fallback value
    expect(plan.severityLevel).toBe('medium');
  });

  it('uses the full fallback plan on malformed JSON', async () => {
    mockChatCreate.mockResolvedValue({
      choices: [{ message: { content: 'not a json' } }],
    });
    const plan = await provider.evaluateCrisis('transcript');
    expect(plan.patientScript).toContain("You're not alone");
    expect(plan.severityLevel).toBe('medium');
  });
});
