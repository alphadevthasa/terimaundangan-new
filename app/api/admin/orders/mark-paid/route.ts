import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { response } = await requireAdmin(request);
  if (response) return response;
  try {
    const { templateId, customerEmail } = await request.json();
    if (!templateId) {
      return NextResponse.json({ error: 'templateId required' }, { status: 400 });
    }
    const where: any = { templateId, status: 'pending' };
    if (customerEmail) where.customerEmail = customerEmail;
    await prisma.order.updateMany({ where, data: { status: 'paid', paidAt: new Date() } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
