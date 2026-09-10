import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const { pathname } = request.nextUrl;

  const isConfigured =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-project-ref') &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes('your-anon-public-key');

  if (!isConfigured) {
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      return NextResponse.redirect(loginUrl);
    }
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Protect /admin/* (except /admin/login)
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
      if (!user) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/admin/login';
        return NextResponse.redirect(loginUrl);
      }
    }

    // Redirect authenticated users away from /admin/login → /admin
    if (pathname === '/admin/login' && user) {
      const adminUrl = request.nextUrl.clone();
      adminUrl.pathname = '/admin';
      return NextResponse.redirect(adminUrl);
    }
  } catch (err) {
    console.error('Middleware Supabase auth error:', err);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};