import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/send-password-reset';
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter';
import { verifyTurnstile } from '@/lib/turnstile';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = checkRateLimit('forgot-password:' + ip, {
      maxRequests: 3,
      windowSeconds: 300,
    });
    if (!limit.allowed) {
      return NextResponse.json({
        error: 'Terlalu banyak permintaan. Silakan coba lagi dalam ' + limit.retryAfter + ' detik.',
      }, { status: 429 });
    }

    const { email, turnstileToken } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email wajib diisi' }, { status: 400 });
    }

    if (!turnstileToken) {
      return NextResponse.json({ error: 'Verifikasi keamanan wajib diisi' }, { status: 400 });
    }

    const turnstileValid = await verifyTurnstile(turnstileToken, ip, request);
    if (!turnstileValid) {
      return NextResponse.json({ error: 'Verifikasi keamanan gagal. Silakan coba lagi.' }, { status: 400 });
    }

    const customer = await prisma.customer.findFirst({ where: { email } });

    if (!customer) {
      return NextResponse.json({
        success: true,
        message: 'Jika email terdaftar, link reset password akan dikirim.',
      });
    }

    const emailLimit = checkRateLimit('forgot-password-email:' + email, {
      maxRequests: 1,
      windowSeconds: 60,
    });
    if (!emailLimit.allowed) {
      return NextResponse.json({
        success: true,
        message: 'Jika email terdaftar, link reset password akan dikirim.',
      });
    }

    const resetToken = crypto.randomUUID();
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.customer.update({
      where: { id: customer.id },
      data: { resetToken, resetTokenExpiry },
    });

    await sendPasswordResetEmail(email, resetToken, customer.name || 'User');

    return NextResponse.json({
      success: true,
      message: 'Jika email terdaftar, link reset password akan dikirim.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Gagal memproses permintaan' }, { status: 500 });
  }
}
