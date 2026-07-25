/**
 * API Route validation tests
 * Tests that API routes enforce correct HTTP methods and input validation
 */

describe('API Route - /api/ai/crisis-eval input validation', () => {
  const mockFetch = (body: object, method = 'POST') =>
    new Request('http://localhost:3000/api/ai/crisis-eval', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

  it('should reject empty transcript with 400', async () => {
    const { POST } = await import('@/app/api/ai/crisis-eval/route');
    const req = mockFetch({ transcript: '' });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data).toHaveProperty('error');
  });

  it('should reject whitespace-only transcript with 400', async () => {
    const { POST } = await import('@/app/api/ai/crisis-eval/route');
    const req = mockFetch({ transcript: '   ' });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('should reject missing transcript field with 400', async () => {
    const { POST } = await import('@/app/api/ai/crisis-eval/route');
    const req = mockFetch({});
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe('API Route - /api/caregiver/alerts', () => {
  it('should return null alert when store is empty', async () => {
    const { globalStore } = await import('@/lib/store');
    globalStore.latestCrisis = null;

    const { GET } = await import('@/app/api/caregiver/alerts/route');
    const req = new Request('http://localhost:3000/api/caregiver/alerts');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.alert).toBeNull();
  });

  it('should return alert data when store has a crisis', async () => {
    const { globalStore } = await import('@/lib/store');
    globalStore.latestCrisis = {
      patientScript: 'Take a breath',
      caregiverAdvice: 'Stay calm',
      severityLevel: 'high',
      transcript: 'I am struggling',
      timestamp: '2026-07-25T06:00:00.000Z',
    };

    const { GET } = await import('@/app/api/caregiver/alerts/route');
    const req = new Request('http://localhost:3000/api/caregiver/alerts');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.alert).not.toBeNull();
    expect(data.alert.severityLevel).toBe('high');
  });
});
