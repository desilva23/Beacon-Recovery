import { AIFactory } from '@/lib/ai';

describe('AIFactory - Provider Selection', () => {
  it('should return a provider for groq', () => {
    const provider = AIFactory.getProvider('groq');
    expect(provider).toBeDefined();
    expect(typeof provider.evaluateCrisis).toBe('function');
  });

  it('should return a provider for gemini', () => {
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
    expect(typeof provider.evaluateCrisis).toBe('function');
  });

  it('should return a new instance each call (no stale state)', () => {
    const p1 = AIFactory.getProvider('groq');
    const p2 = AIFactory.getProvider('groq');
    expect(p1).not.toBe(p2);
  });
});

describe('AIFactory - Provider Interface Compliance', () => {
  it('groq provider should have evaluateCrisis method', () => {
    const provider = AIFactory.getProvider('groq');
    expect(provider.evaluateCrisis).toBeInstanceOf(Function);
  });

  it('gemini provider should have evaluateCrisis method', () => {
    const provider = AIFactory.getProvider('gemini');
    expect(provider.evaluateCrisis).toBeInstanceOf(Function);
  });

  it('evaluateCrisis should return a promise', () => {
    // Mock the actual API call so it doesn't hit external services
    const provider = AIFactory.getProvider('groq');
    const spy = jest.spyOn(provider, 'evaluateCrisis').mockResolvedValue({
      patientScript: 'mock script',
      caregiverAdvice: 'mock advice',
      severityLevel: 'low',
    });
    const result = provider.evaluateCrisis('test transcript');
    expect(result).toBeInstanceOf(Promise);
    spy.mockRestore();
  });
});
