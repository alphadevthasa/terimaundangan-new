import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/wishes/recent?since=ISO_TIMESTAMP - Get count and latest wishes created since timestamp
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const since = searchParams.get('since');

    const where: any = {};
    if (since) {
      const sinceDate = new Date(since);
      if (!isNaN(sinceDate.getTime())) {
        where.createdAt = { gt: sinceDate };
      }
    }

    const [wishes, count] = await Promise.all([
      prisma.wish.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.wish.count({ where }),
    ]);

    return NextResponse.json({
      count,
      wishes: wishes.map(w => ({
        id: w.id,
        name: w.name,
        message: w.message,
        createdAt: w.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching recent wishes:', error);
    return NextResponse.json({ error: 'Gagal memuat ucapan terbaru' }, { status: 500 });
  }
}
