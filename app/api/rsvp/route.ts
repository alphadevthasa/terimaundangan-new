import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const templateDataId = searchParams.get('templateDataId');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.min(Number(searchParams.get('limit')) || 25, 100);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (templateDataId) where.templateDataId = templateDataId;
    if (status === 'hadir' || status === 'tidak') where.status = status;
    if (search.trim()) {
      where.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { message: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    const [rsvps, total] = await Promise.all([
      prisma.rsvp.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.rsvp.count({ where }),
    ]);

    return NextResponse.json({
      rsvps: rsvps.map(r => ({
        id: r.id,
        name: r.name,
        status: r.status,
        guestCount: r.guestCount,
        message: r.message,
        createdAt: r.createdAt.toISOString(),
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    return NextResponse.json({ error: 'Gagal memuat data RSVP' }, { status: 500 });
  }
}
