import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // Not logged in → redirect to login
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Role-based access control
  const role = user.user_metadata?.role ?? 'patient';

  if (role === 'patient' && pathname.startsWith('/caregiver')) {
    const url = request.nextUrl.clone();
    url.pathname = '/patient';
    url.searchParams.set('blocked', '1');
    return NextResponse.redirect(url);
  }

  if (role === 'caregiver' && pathname.startsWith('/patient')) {
    const url = request.nextUrl.clone();
    url.pathname = '/caregiver';
    url.searchParams.set('blocked', '1');
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/patient/:path*', '/caregiver/:path*', '/journal/:path*'],
};
