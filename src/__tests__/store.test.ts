import { globalStore } from '@/lib/store';

describe('globalStore - Crisis State Management', () => {
  beforeEach(() => {
    globalStore.latestCrisis = null;
  });

  it('should initialise with null latestCrisis', () => {
    expect(globalStore.latestCrisis).toBeNull();
  });

  it('should store a full crisis plan correctly', () => {
    const crisis = {
      patientScript: 'You are safe. Breathe slowly.',
      caregiverAdvice: 'Stay present with them.',
      severityLevel: 'high' as const,
      transcript: 'I need help right now',
      timestamp: '2026-07-25T06:00:00.000Z',
    };
    globalStore.latestCrisis = crisis;
    expect(globalStore.latestCrisis).toEqual(crisis);
  });

  it('should allow overwriting a crisis with a newer one', () => {
    globalStore.latestCrisis = {
      patientScript: 'First response',
      caregiverAdvice: 'First advice',
      severityLevel: 'low' as const,
      transcript: 'first event',
      timestamp: '2026-07-25T06:00:00.000Z',
    };
    globalStore.latestCrisis = {
      patientScript: 'Second response',
      caregiverAdvice: 'Second advice',
      severityLevel: 'high' as const,
      transcript: 'second event',
      timestamp: '2026-07-25T07:00:00.000Z',
    };
    expect(globalStore.latestCrisis.patientScript).toBe('Second response');
    expect(globalStore.latestCrisis.severityLevel).toBe('high');
  });

  it('should allow resetting the crisis to null', () => {
    globalStore.latestCrisis = {
      patientScript: 'Test',
      caregiverAdvice: 'Test',
      severityLevel: 'medium' as const,
      transcript: 'test',
      timestamp: new Date().toISOString(),
    };
    globalStore.latestCrisis = null;
    expect(globalStore.latestCrisis).toBeNull();
  });

  it('should accept all valid severity levels', () => {
    const levels = ['low', 'medium', 'high'] as const;
    levels.forEach(level => {
      globalStore.latestCrisis = {
        patientScript: 'Script',
        caregiverAdvice: 'Advice',
        severityLevel: level,
        transcript: 'test',
        timestamp: new Date().toISOString(),
      };
      expect(globalStore.latestCrisis?.severityLevel).toBe(level);
    });
  });
});
