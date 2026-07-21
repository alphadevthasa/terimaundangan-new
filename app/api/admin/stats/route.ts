import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [totalTemplates, totalUsers, totalOrders, totalPendapatan, recentOrders] = await Promise.all([
      prisma.template.count(),
      prisma.customer.count(),
      prisma.order.count(),
      prisma.order.aggregate({ where: { status: 'paid' }, _sum: { amount: true } }),
      prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    ]);
    return NextResponse.json({ totalTemplates, totalUsers, totalOrders, totalPendapatan: totalPendapatan._sum.amount ?? 0, recentOrders });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
