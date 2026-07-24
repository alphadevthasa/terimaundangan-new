import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/send-verification-email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email wajib diisi' }, { status: 400 });
    }

    const customer = await prisma.customer.findFirst({ where: { email } });
    if (!customer) {
      return NextResponse.json({ error: 'Email tidak ditemukan' }, { status: 404 });
    }

    if (customer.emailVerifiedAt) {
      return NextResponse.json({ error: 'Email sudah diverifikasi' }, { status: 400 });
    }

    const verificationToken = crypto.randomUUID();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await prisma.customer.update({
      where: { id: customer.id },
      data: { verificationToken, verificationTokenExpiry },
    });

    sendVerificationEmail(email, verificationToken, customer.name).catch((err) =>
      console.error('[resend-verification] Background email failed:', err)
    );

    return NextResponse.json({ success: true, message: 'Email verifikasi telah dikirim ulang.' });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
