import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const customer = await prisma.customer.findFirst({ where: { email } });
    if (!customer) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });

    await prisma.notificationRead.upsert({
      where: { notificationId_customerId: { notificationId: params.id, customerId: customer.id } },
      update: { readAt: new Date() },
      create: { notificationId: params.id, customerId: customer.id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to mark as read' }, { status: 500 });
  }
}
