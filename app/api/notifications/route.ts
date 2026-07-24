import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const customer = await prisma.customer.findFirst({ where: { email } });
    if (!customer) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });

    const [notifications, reads] = await Promise.all([
      prisma.notification.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.notificationRead.findMany({ where: { customerId: customer.id } }),
    ]);

    const readIds = new Set(reads.map(r => r.notificationId));
    const data = notifications.map(n => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type,
      link: n.link,
      createdAt: n.createdAt.toISOString(),
      read: readIds.has(n.id),
    }));

    return NextResponse.json({ notifications: data, unreadCount: data.filter(n => !n.read).length });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}
