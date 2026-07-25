import { AIFactory } from '@/lib/ai';

describe('AIFactory', () => {
  it('should return a GroqProvider instance when groq is requested', () => {
    const provider = AIFactory.getProvider('groq');
    expect(provider).toBeDefined();
    expect(typeof provider.evaluateCrisis).toBe('function');
  });

  it('should return a GeminiProvider instance when gemini is requested', () => {
    const provider = AIFactory.getProvider('gemini');
    expect(provider).toBeDefined();
    expect(typeof provider.evaluateCrisis).toBe('function');
  });

  it('should throw an error for unsupported providers', () => {
    expect(() => AIFactory.getProvider('unsupported' as any)).toThrow('Unsupported AI provider');
  });

  it('should default to groq when no argument is provided', () => {
    const provider = AIFactory.getProvider();
    expect(provider).toBeDefined();
  });
});
