import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { verifyTurnstile, getClientIp } from '@/lib/turnstile';
import { checkRateLimit } from '@/lib/rate-limiter';
import { signSession, setSessionCookie, setAdminSessionCookie } from '@/lib/session';

// Generic message to avoid user enumeration (do not reveal which of
// email/password was wrong, nor whether the email exists).
const AUTH_FAILED = 'Email atau password salah';
const ACCOUNT_NO_PASSWORD =
  'Akun ini belum memiliki password. Silakan daftar ulang atau gunakan fitur lupa password.';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    // Per-IP rate limit on login attempts.
    const ipLimit = checkRateLimit(`login:${ip}`, {
      maxRequests: 10,
      windowSeconds: 600,
    });
    if (!ipLimit.allowed) {
      return NextResponse.json(
        {
          error:
            'Terlalu banyak percobaan login. Silakan coba lagi dalam ' +
            ipLimit.retryAfter +
            ' detik.',
        },
        { status: 429 }
      );
    }

    const { email, password, turnstileToken } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password wajib diisi' },
        { status: 400 }
      );
    }

    if (process.env.TURNSTILE_SECRET_KEY) {
      if (!turnstileToken) {
        return NextResponse.json(
          { error: 'Verifikasi keamanan wajib diisi' },
          { status: 400 }
        );
      }
      const valid = await verifyTurnstile(turnstileToken, ip, request);
      if (!valid) {
        return NextResponse.json(
          { error: 'Verifikasi keamanan gagal. Silakan coba lagi.' },
          { status: 400 }
        );
      }
    }

    // Find customer by email
    const customer = await prisma.customer.findFirst({ where: { email } });

    if (!customer) {
      // Track a failed attempt against the (claimed) email so a targeted
      // brute-force is throttled even though the account does not exist.
      checkRateLimit(`login-fail:${email}`, {
        maxRequests: 5,
        windowSeconds: 900,
      });
      return NextResponse.json({ error: AUTH_FAILED }, { status: 401 });
    }

    // Check if customer has a password set
    if (!customer.password) {
      return NextResponse.json({ error: ACCOUNT_NO_PASSWORD }, { status: 401 });
    }

    // Check if email is verified (skip for admins)
    if (!customer.isAdmin && !customer.emailVerifiedAt) {
      return NextResponse.json(
        { error: 'Email belum diverifikasi. Silakan cek email Anda.', needsVerification: true },
        { status: 403 }
      );
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, customer.password);
    if (!passwordValid) {
      const failLimit = checkRateLimit(`login-fail:${email}`, {
        maxRequests: 5,
        windowSeconds: 900,
      });
      if (!failLimit.allowed) {
        return NextResponse.json(
          {
            error:
              'Terlalu banyak percobaan gagal. Akun dikunci sementara, coba lagi dalam ' +
              failLimit.retryAfter +
              ' detik atau gunakan lupa password.',
          },
          { status: 429 }
        );
      }
      return NextResponse.json({ error: AUTH_FAILED }, { status: 401 });
    }

    // Return customer data (without password) — includes isAdmin flag
    const { password: _, ...customerSafe } = customer;

    // Issue a signed JWT session and store it in an httpOnly cookie.
    const token = await signSession({
      sub: customer.id,
      email: customer.email,
      name: customer.name,
      isAdmin: customer.isAdmin,
    });

    const response = NextResponse.json({
      success: true,
      customer: customerSafe,
      isAdmin: customer.isAdmin,
      message: 'Login berhasil',
    });

    // Customer logins set the regular session cookie.
    // Admin logins use the SEPARATE admin_session cookie so they NEVER
    // overwrite an existing customer session in the same browser.
    if (customer.isAdmin) {
      setAdminSessionCookie(response, token);
    } else {
      setSessionCookie(response, token);
    }

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
