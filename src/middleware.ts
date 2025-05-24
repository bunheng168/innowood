import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  console.log('Middleware running for path:', req.nextUrl.pathname);
  
  const res = NextResponse.next();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Check if we're on an admin route
  if (req.nextUrl.pathname.startsWith('/admin')) {
    console.log('Checking admin route access');
    
    // Skip auth check for login page
    if (req.nextUrl.pathname === '/admin/login') {
      console.log('Allowing access to login page');
      return res;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session check result:', session ? 'Session exists' : 'No session');

      // If no session, redirect to login
      if (!session) {
        console.log('No session found, redirecting to login');
        const redirectUrl = new URL('/admin/login', req.url);
        return NextResponse.redirect(redirectUrl);
      }

      console.log('User authenticated, allowing access');
      return res;
    } catch (error) {
      console.error('Error checking session:', error);
      // On error, redirect to login for safety
      const redirectUrl = new URL('/admin/login', req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

export const config = {
  matcher: '/admin/:path*',
} 