import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { slug, name, status, guestCount, message } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: 'Slug undangan wajib diisi' }, { status: 400 });
    }
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Nama wajib diisi' }, { status: 400 });
    }

    const templateData = await prisma.templateData.findFirst({ where: { slug, published: true } });
    if (!templateData) {
      return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 });
    }

    const rsvp = await prisma.rsvp.create({
      data: {
        templateDataId: templateData.id,
        name: name.trim(),
        status: status === 'tidak' ? 'tidak' : 'hadir',
        guestCount: Math.max(1, Math.min(10, Number(guestCount) || 1)),
        message: (message || '').trim(),
      },
    });

    return NextResponse.json({
      success: true,
      rsvp: { id: rsvp.id, name: rsvp.name, status: rsvp.status, guestCount: rsvp.guestCount },
      message: 'Konfirmasi kehadiran berhasil dikirim!',
    }, { status: 201 });
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    return NextResponse.json({ error: 'Gagal mengirim konfirmasi' }, { status: 500 });
  }
}
