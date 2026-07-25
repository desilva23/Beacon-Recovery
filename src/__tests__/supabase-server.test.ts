// src/__tests__/supabase-server.test.ts
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

describe('createClient – Supabase server helper', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates client and forwards all cookies', async () => {
    const mockCookieStore = {
      getAll: jest.fn().mockReturnValue([{ name: 'sb:token', value: 'abc' }]),
      set: jest.fn(),
    } as any;
    (cookies as jest.Mock).mockReturnValue(mockCookieStore);

    const client = await createClient();
    expect(typeof (client as any).auth).toBe('object');
    expect(mockCookieStore.getAll).toHaveBeenCalled();
  });

  it('gracefully handles cookie store errors (fallback to empty list)', async () => {
    const mockCookieStore = {
      getAll: jest.fn(() => {
        throw new Error('cookies not available');
      }),
      set: jest.fn(),
    } as any;
    (cookies as jest.Mock).mockReturnValue(mockCookieStore);

    const client = await createClient();
    // should not throw; still returns a client with auth property
    expect(typeof (client as any).auth).toBe('object');
  });
});
