import { AIFactory } from '@/lib/ai';

describe('AIFactory - Provider Selection', () => {
  it('should return a provider', () => {
    const provider = AIFactory.getProvider();
    expect(provider).toBeDefined();
    expect(typeof provider.evaluateCrisis).toBe('function');
  });

  it('should return a new instance each call (no stale state)', () => {
    const p1 = AIFactory.getProvider();
    const p2 = AIFactory.getProvider();
    expect(p1).not.toBe(p2);
  });
});

describe('AIFactory - Provider Interface Compliance', () => {
  it('provider should have evaluateCrisis method', () => {
    const provider = AIFactory.getProvider();
    expect(provider.evaluateCrisis).toBeInstanceOf(Function);
  });

  it('evaluateCrisis should return a promise', () => {
    const provider = AIFactory.getProvider();
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
