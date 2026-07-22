import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    // Per-IP rate limit on reset attempts (throttle token guessing).
    const ipLimit = checkRateLimit(`reset:${ip}`, {
      maxRequests: 5,
      windowSeconds: 900,
    });
    if (!ipLimit.allowed) {
      return NextResponse.json(
        {
          error:
            'Terlalu banyak permintaan reset. Silakan coba lagi dalam ' +
            ipLimit.retryAfter +
            ' detik.',
        },
        { status: 429 }
      );
    }

    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token dan password baru wajib diisi' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    // Find customer with valid reset token
    const customer = await prisma.customer.findFirst({
      where: { resetToken: token },
    });

    if (!customer) {
      // Track repeated invalid-token attempts from this IP.
      checkRateLimit(`reset-fail:${ip}`, {
        maxRequests: 10,
        windowSeconds: 900,
      });
      return NextResponse.json(
        { error: 'Token reset tidak valid atau sudah digunakan' },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (!customer.resetTokenExpiry || new Date() > customer.resetTokenExpiry) {
      // Clean up expired token
      await prisma.customer.update({
        where: { id: customer.id },
        data: { resetToken: null, resetTokenExpiry: null },
      });

      return NextResponse.json(
        { error: 'Token reset sudah kedaluwarsa. Silakan minta link reset baru.' },
        { status: 400 }
      );
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update password and clear reset token
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Password berhasil direset. Silakan login dengan password baru Anda.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
