import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token verifikasi tidak valid' }, { status: 400 });
    }

    const customer = await prisma.customer.findFirst({ where: { verificationToken: token } });

    if (!customer) {
      return NextResponse.json({ error: 'Token verifikasi tidak valid atau sudah kadaluarsa' }, { status: 400 });
    }

    if (customer.emailVerifiedAt) {
      return NextResponse.redirect(new URL('/login?verified=already', request.url));
    }

    await prisma.customer.update({
      where: { id: customer.id },
      data: { emailVerifiedAt: new Date(), verificationToken: null },
    });

    return NextResponse.redirect(new URL('/login?verified=true', request.url));
  } catch (error) {
    console.error('Verify email error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
