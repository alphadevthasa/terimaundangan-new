import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { templateDataId, name, message } = await request.json();

    if (!templateDataId) {
      return NextResponse.json({ error: 'ID undangan wajib diisi' }, { status: 400 });
    }
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Nama wajib diisi' }, { status: 400 });
    }
    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Pesan wajib diisi' }, { status: 400 });
    }

    const templateData = await prisma.templateData.findUnique({ where: { id: templateDataId } });
    if (!templateData) {
      return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 });
    }

    const wish = await prisma.wish.create({
      data: {
        templateDataId,
        name: name.trim(),
        message: message.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      wish: {
        id: wish.id,
        name: wish.name,
        message: wish.message,
        createdAt: wish.createdAt.toISOString(),
      },
      message: 'Ucapan berhasil dikirim!',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating wish:', error);
    return NextResponse.json({ error: 'Gagal mengirim ucapan' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const templateDataId = searchParams.get('templateDataId');
    const search = searchParams.get('search') || '';
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.min(Number(searchParams.get('limit')) || 25, 100);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (templateDataId) where.templateDataId = templateDataId;
    if (search.trim()) {
      where.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { message: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    const [wishes, total] = await Promise.all([
      prisma.wish.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.wish.count({ where }),
    ]);

    return NextResponse.json({
      wishes: wishes.map(w => ({
        id: w.id,
        name: w.name,
        message: w.message,
        createdAt: w.createdAt.toISOString(),
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching wishes:', error);
    return NextResponse.json({ error: 'Gagal memuat ucapan' }, { status: 500 });
  }
}
