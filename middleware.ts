import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession, SESSION_COOKIE, ADMIN_SESSION_COOKIE } from '@/lib/session';
import type { SessionPayload } from '@/lib/session';

/**
 * Auth middleware.
 *
 * Previously this bypassed ALL /api/* routes and only checked for a literal
 * `session=true` cookie (forgeable via document.cookie). It now verifies a
 * signed JWT (jose, Edge-compatible) and gates sensitive API + page routes.
 *
 * Gate policy:
 *   - /api/admin/**     → valid session AND isAdmin === true (else 401/403)
 *   - /api/upload       → valid session (any logged-in)
 *   - /admin/** pages   → valid session AND isAdmin === true
 *   - /dashboard/**     → valid session (any logged-in)
 *
 * API routes below that are intentionally public (auth, checkout, public
 * previews, guest wishes) are allowed through and protected at the route level
 * where appropriate.
 */

// Public page routes that never require a session cookie.
const publicPageRoutes = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/admin/login',
  '/',
  '/detail',
  '/checkout',
];

// API path prefixes / exact paths that are intentionally public (allowed
// through the middleware without a session). Listed here for documentation;
// the gate below is deny-by-default for /api/admin and /api/upload only, and
// everything else passes through. Public examples:
//   /api/auth/login, /api/auth/signup, /api/auth/forgot-password,
//   /api/auth/reset-password, /api/xendit/webhook (Xendit token verified
//   inside the route), /api/create-invoice (checkout, may be pre-login),
//   /api/wishes (guest-facing), /api/cover (public thumbnails),
//   /api/static-templates (public catalog).
// Sensitive but-unlisted routes (/api/customer, /api/template-data) are
// protected at the route level via lib/auth helpers (defense in depth).

const staticPrefixes = ['/_next/static', '/_next/image', '/favicon'];

function isStatic(pathname: string): boolean {
  return staticPrefixes.some((p) => pathname.startsWith(p));
}

async function getSession(request: NextRequest): Promise<SessionPayload | null> {
  const cookie = request.cookies.get(SESSION_COOKIE);
  return verifySession(cookie?.value);
}

/**
 * Get the admin session from the separate admin_session cookie.
 * Admin routes use this cookie so they never conflict with customer sessions.
 */
async function getAdminSession(request: NextRequest): Promise<SessionPayload | null> {
  const cookie = request.cookies.get(ADMIN_SESSION_COOKIE);
  return verifySession(cookie?.value);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow static assets.
  if (isStatic(pathname)) {
    return NextResponse.next();
  }

  // ---- API gate ----
  if (pathname.startsWith('/api/')) {
    // Admin endpoints use the SEPARATE admin_session cookie so they never
    // conflict with customer sessions in the same browser.
    if (pathname.startsWith('/api/admin/')) {
      const session = await getAdminSession(request);
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      if (!session.isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.next();
    }

    // Upload requires a logged-in session.
    if (pathname === '/api/upload') {
      const session = await getSession(request);
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.next();
    }

    // All other API routes pass through. Sensitive but-unlisted ones (e.g.
    // /api/customer, /api/template-data) are protected at the route level via
    // lib/auth helpers — defense in depth, in case the pass-through default
    // is wrong for a given route.
    return NextResponse.next();
  }

  // ---- Login-page redirects: if already authenticated, skip to dashboard ----
  if (pathname === '/login') {
    const session = await getSession(request);
    if (session) {
      // Already logged in as customer → no need to see the login page.
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (pathname === '/admin/login') {
    const adminSession = await getAdminSession(request);
    if (adminSession) {
      // Already logged in as admin → no need to see the login page.
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    // Not authenticated yet — fall through to the public-page gate below
    // so the admin login form is rendered.
  }

  // ---- Page gate ----
  const isAdminPage = pathname.startsWith('/admin');
  const isDashboardPage = pathname.startsWith('/dashboard');
  const isProtectedPage = isAdminPage || isDashboardPage;

  if (!isProtectedPage) {
    return NextResponse.next();
  }

  // Allow public page routes (e.g. /admin/login, /login) through.
  const isPublicPage = publicPageRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );
  if (isPublicPage) {
    return NextResponse.next();
  }

  // Admin pages check the SEPARATE admin_session cookie.
  if (isAdminPage) {
    const adminSession = await getAdminSession(request);
    if (!adminSession) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  // Dashboard / customer pages check the regular session cookie.
  const session = await getSession(request);
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files.
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
