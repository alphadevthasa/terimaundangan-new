import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE /api/wishes/[id] - Delete a wish (admin)
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const wish = await prisma.wish.findUnique({ where: { id: params.id } });
    if (!wish) {
      return NextResponse.json({ error: 'Ucapan tidak ditemukan' }, { status: 404 });
    }

    await prisma.wish.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, message: 'Ucapan berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting wish:', error);
    return NextResponse.json({ error: 'Gagal menghapus ucapan' }, { status: 500 });
  }
}
