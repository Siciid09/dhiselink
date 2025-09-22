import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname, origin } = req.nextUrl;

  // Rule 1: Protect Auth Pages from logged-in users
  if (user && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', origin));
  }

  // Rule 2: Protect Private Pages from logged-out users
  // --- THIS IS THE ONLY CHANGE ---
  const privateRoutes = ['/dashboard', '/onboarding', '/select-role', '/admin'];
  if (!user && privateRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', origin));
  }
  
  // Rule 3: Your original, robust onboarding logic
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_complete')
      .eq('id', user.id)
      .single();

    const isOnboardingFlow = pathname.startsWith('/onboarding') || pathname.startsWith('/select-role');

    // This logic correctly handles new users who haven't finished onboarding
    if (profile && profile.onboarding_complete === false) {
      if (!isOnboardingFlow && pathname !== '/dashboard') { // Allow access to dashboard
        return NextResponse.redirect(new URL('/select-role', origin));
      }
    } else if (profile && profile.onboarding_complete === true) { // For completed users
      // If a fully onboarded user tries to visit an onboarding page, send them away.
      if (isOnboardingFlow) {
        return NextResponse.redirect(new URL('/dashboard', origin));
      }
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};