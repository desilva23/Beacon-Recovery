import { globalStore } from '@/lib/store';

describe('globalStore', () => {
  it('should initialise with null latestCrisis', () => {
    expect(globalStore.latestCrisis).toBeNull();
  });

  it('should allow storing a crisis plan', () => {
    globalStore.latestCrisis = {
      patientScript: 'Breathe in slowly.',
      caregiverAdvice: 'Stay close.',
      severityLevel: 'high',
      transcript: 'I need help',
      timestamp: new Date().toISOString()
    };
    expect(globalStore.latestCrisis.severityLevel).toBe('high');
  });

  it('should have all required crisis plan fields', () => {
    const crisis = globalStore.latestCrisis;
    expect(crisis).toHaveProperty('patientScript');
    expect(crisis).toHaveProperty('caregiverAdvice');
    expect(crisis).toHaveProperty('severityLevel');
    expect(crisis).toHaveProperty('transcript');
    expect(crisis).toHaveProperty('timestamp');
  });
});
