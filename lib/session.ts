import { SignJWT, jwtVerify } from 'jose';
import type { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Session management using signed JWTs (jose / WebCrypto).
 *
 * The previous implementation set a literal "session=true" cookie which could
 * be forged by any client (document.cookie='session=true'). We now issue a
 * signed HS256 JWT containing { sub, email, isAdmin }, stored in an
 * httpOnly + secure + sameSite=strict cookie. Verification happens both in the
 * Edge middleware and in per-route helpers (lib/auth.ts).
 */

export const SESSION_COOKIE = 'session';       // Customer session
/** Admin uses a separate cookie so both can coexist in the same browser. */
export const ADMIN_SESSION_COOKIE = 'admin_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24; // 24h

export interface SessionPayload {
  sub: string; // Customer.id
  email: string;
  name: string;
  isAdmin: boolean;
}

const encoder = new TextEncoder();

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    // Fail loud in code; callers should ensure SESSION_SECRET is set. In the
    // middleware we treat a missing secret as "no valid sessions" (safe).
    throw new Error(
      'SESSION_SECRET is not set. Generate one with: openssl rand -base64 48'
    );
  }
  // Minimum 32 bytes of entropy to keep HS256 strong.
  if (secret.length < 32) {
    throw new Error('SESSION_SECRET must be at least 32 characters long.');
  }
  return encoder.encode(secret);
}

/** Sign a session JWT for the given customer payload. */
export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .setSubject(payload.sub)
    .sign(getSecret());
}

/**
 * Verify a session JWT. Returns the decoded payload, or null if the token is
 * missing/invalid/expired. Never throws for bad tokens — returns null so
 * callers can treat "no session" uniformly.
 */
export async function verifySession(
  token: string | undefined | null
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ['HS256'],
    });
    // Coerce jose's generic payload into our shape.
    const sub = typeof payload.sub === 'string' ? payload.sub : null;
    const email = typeof payload.email === 'string' ? payload.email : null;
    if (!sub || !email) return null;
    return {
      sub,
      email,
      name: typeof payload.name === 'string' ? payload.name : email.split('@')[0],
      isAdmin: payload.isAdmin === true,
    };
  } catch {
    return null;
  }
}

const isProduction = process.env.NODE_ENV === 'production';

/** Helper: set a cookie with the given name. */
function setCookie(res: NextResponse, name: string, token: string): void {
  res.cookies.set(name, token, {
    path: '/',
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/** Helper: clear a cookie by name. */
function clearCookie(res: NextResponse, name: string): void {
  res.cookies.set(name, '', {
    path: '/',
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 0,
  });
}

/** Set the customer session cookie on a NextResponse (login/signup). */
export function setSessionCookie(res: NextResponse, token: string): void {
  setCookie(res, SESSION_COOKIE, token);
}

/** Set the admin session cookie (separate from customer session). */
export function setAdminSessionCookie(res: NextResponse, token: string): void {
  setCookie(res, ADMIN_SESSION_COOKIE, token);
}

/** Clear the customer session cookie on a NextResponse (logout). */
export function clearSessionCookie(res: NextResponse): void {
  clearCookie(res, SESSION_COOKIE);
}

/** Clear the admin session cookie. */
export function clearAdminSessionCookie(res: NextResponse): void {
  clearCookie(res, ADMIN_SESSION_COOKIE);
}

/** Clear ALL session cookies (customer + admin). */
export function clearAllSessionCookies(res: NextResponse): void {
  clearCookie(res, SESSION_COOKIE);
  clearCookie(res, ADMIN_SESSION_COOKIE);
}

/**
 * Read + verify the customer session from a NextRequest (Edge-compatible).
 * Used by middleware and by route helpers.
 */
export async function getSessionFromRequest(
  request: NextRequest
): Promise<SessionPayload | null> {
  const cookie = request.cookies.get(SESSION_COOKIE);
  return verifySession(cookie?.value);
}

/**
 * Read + verify the admin session from a NextRequest.
 */
export async function getAdminSessionFromRequest(
  request: NextRequest
): Promise<SessionPayload | null> {
  const cookie = request.cookies.get(ADMIN_SESSION_COOKIE);
  return verifySession(cookie?.value);
}
