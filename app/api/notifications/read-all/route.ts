import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const customer = await prisma.customer.findFirst({ where: { email } });
    if (!customer) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });

    const notifications = await prisma.notification.findMany({
      where: { reads: { none: { customerId: customer.id } } },
    });

    if (notifications.length > 0) {
      await prisma.notificationRead.createMany({
        data: notifications.map(n => ({ notificationId: n.id, customerId: customer.id })),
        skipDuplicates: true,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to mark all as read' }, { status: 500 });
  }
}
