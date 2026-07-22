import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  getSessionFromRequest,
  getAdminSessionFromRequest,
  type SessionPayload,
} from '@/lib/session';

/**
 * Per-route auth helpers (defense-in-depth on top of the Edge middleware).
 *
 * Usage in a protected route handler:
 *
 *   export async function GET(request: NextRequest) {
 *     const { session, response } = await requireAdmin(request);
 *     if (response) return response;
 *     // session.email / session.sub / session.isAdmin available here
 *     ...
 *   }
 *
 * `response` is a ready-to-send NextResponse (401/403) when access is denied,
 * or undefined when access is granted (in which case `session` is populated).
 */

export interface AuthResult {
  session: SessionPayload | null;
  response?: NextResponse;
}

function unauthorized(message = 'Unauthorized'): AuthResult {
  return {
    session: null,
    response: NextResponse.json({ error: message }, { status: 401 }),
  };
}

function forbidden(message = 'Forbidden'): AuthResult {
  return {
    session: null,
    response: NextResponse.json({ error: message }, { status: 403 }),
  };
}

/** Require any valid logged-in session (customer or admin). */
export async function requireSession(request: NextRequest): Promise<AuthResult> {
  // Check customer session first, then admin session.
  const session = await getSessionFromRequest(request);
  if (session) return { session };
  const adminSession = await getAdminSessionFromRequest(request);
  if (adminSession) return { session: adminSession };
  return unauthorized();
}

/** Require an admin session (isAdmin === true). */
export async function requireAdmin(request: NextRequest): Promise<AuthResult> {
  // The admin_session cookie is the canonical source for admin auth.
  // Fall back to session cookie (isAdmin === true) for backward compatibility.
  const adminSession = await getAdminSessionFromRequest(request);
  if (adminSession?.isAdmin) return { session: adminSession };
  const session = await getSessionFromRequest(request);
  if (session?.isAdmin) return { session };
  return forbidden();
}

/**
 * Require a logged-in customer session. Admins pass through too (they are also
 * Customers in this schema) — use `requireAdmin` when the action is admin-only.
 */
export async function requireCustomer(
  request: NextRequest
): Promise<AuthResult> {
  return requireSession(request);
}
