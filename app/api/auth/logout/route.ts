import { NextResponse } from 'next/server';
import { clearAllSessionCookies } from '@/lib/session';

// POST /api/auth/logout - Clear ALL session cookies (customer + admin).
export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logout berhasil' });
  clearAllSessionCookies(response);
  return response;
}
