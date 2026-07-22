import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const paidOrders = await prisma.order.findMany({
      where: { status: 'paid' },
      orderBy: { paidAt: 'asc' },
      include: { template: { select: { name: true } } },
    });

    const totalRevenue = paidOrders.reduce((s, o) => s + o.amount, 0);
    const totalTax = paidOrders.reduce((s, o) => s + o.tax, 0);
    const totalDiscount = paidOrders.reduce((s, o) => s + o.discount, 0);
    const totalOrders = paidOrders.length;
    const gross = totalRevenue - totalTax + totalDiscount;
    const ppn = totalTax;
    const promo = totalDiscount;
    const nett = totalRevenue;

    const monthlyMap: Record<string, { revenue: number; count: number }> = {};
    const templateMap: Record<string, { name: string; revenue: number; count: number }> = {};

    for (const o of paidOrders) {
      const month = o.paidAt
        ? `${o.paidAt.getFullYear()}-${String(o.paidAt.getMonth() + 1).padStart(2, '0')}`
        : 'unknown';
      if (!monthlyMap[month]) monthlyMap[month] = { revenue: 0, count: 0 };
      monthlyMap[month].revenue += o.amount;
      monthlyMap[month].count += 1;

      const tplName = o.templateName || o.template?.name || 'Unknown';
      if (!templateMap[tplName]) templateMap[tplName] = { name: tplName, revenue: 0, count: 0 };
      templateMap[tplName].revenue += o.amount;
      templateMap[tplName].count += 1;
    }

    const monthlyData = Object.entries(monthlyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, d]) => ({ month, ...d }));

    const templateData = Object.values(templateMap).sort((a, b) => b.revenue - a.revenue);

    return NextResponse.json({
      totalRevenue, totalTax, totalDiscount, totalOrders,
      gross, ppn, promo, nett,
      monthlyData, templateData,
    });
  } catch (error) {
    console.error('Error fetching revenue:', error);
    return NextResponse.json({ error: 'Failed to fetch revenue' }, { status: 500 });
  }
}
