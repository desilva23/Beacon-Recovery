import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const role = searchParams.get('role') ?? 'patient';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirect to the appropriate dashboard based on role
      const redirectTo = role === 'caregiver' ? '/caregiver' : '/patient';
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  // If something went wrong, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
