import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Skip middleware for public assets and api routes
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/api') ||
    req.nextUrl.pathname.startsWith('/static')
  ) {
    return res;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: Record<string, unknown>) {
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If there's no session and trying to access admin routes (except login)
  if (!session && req.nextUrl.pathname.startsWith('/admin') && req.nextUrl.pathname !== '/admin/login') {
    const redirectUrl = new URL('/admin/login', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If there's a session and on the login page
  if (session && req.nextUrl.pathname === '/admin/login') {
    const redirectUrl = new URL('/admin/products', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 