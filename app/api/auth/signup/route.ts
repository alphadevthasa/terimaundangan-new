import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { verifyTurnstile, getClientIp } from '@/lib/turnstile';
import { checkRateLimit } from '@/lib/rate-limiter';
import { sendVerificationEmail } from '@/lib/send-verification-email';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    // Per-IP rate limit on signups.
    const ipLimit = checkRateLimit(`signup:${ip}`, {
      maxRequests: 5,
      windowSeconds: 3600,
    });
    if (!ipLimit.allowed) {
      return NextResponse.json(
        {
          error:
            'Terlalu banyak pendaftaran. Silakan coba lagi dalam ' +
            ipLimit.retryAfter +
            ' detik.',
        },
        { status: 429 }
      );
    }

    const { name, email, password, turnstileToken } = await request.json();

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

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password wajib diisi' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Nama wajib diisi' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await prisma.customer.findFirst({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar. Silakan login.' },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token
    const verificationToken = crypto.randomUUID();

    // Create customer
    await prisma.customer.create({
      data: {
        name,
        email,
        password: hashedPassword,
        status: 'active',
        verificationToken,
      },
    });

    // Send verification email (fire-and-forget — don't block signup on email failure)
    sendVerificationEmail(email, verificationToken, name).catch((err) =>
      console.error('[signup] Background verification email failed:', err)
    );

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil. Silakan cek email untuk verifikasi.',
    }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
