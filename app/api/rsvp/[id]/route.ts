import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const rsvp = await prisma.rsvp.findUnique({ where: { id: params.id } });
    if (!rsvp) {
      return NextResponse.json({ error: 'Data RSVP tidak ditemukan' }, { status: 404 });
    }

    await prisma.rsvp.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, message: 'Data RSVP berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting RSVP:', error);
    return NextResponse.json({ error: 'Gagal menghapus data RSVP' }, { status: 500 });
  }
}
