import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { customerDefaults } from '@/lib/template-utils';

export async function POST(request: NextRequest) {
  const token = request.headers.get('x-callback-token');
  if (token !== process.env.XENDIT_WEBHOOK_VERIFICATION_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  console.log('[xendit-webhook] received:', body.id, body.status, body.external_id);

  if (body.status !== 'PAID') {
    return NextResponse.json({ received: true });
  }

  const externalId = body.external_id || '';
  if (!externalId.startsWith('template-')) {
    return NextResponse.json({ error: 'Invalid external_id' }, { status: 400 });
  }

  const templateId = externalId.replace(/^template-/, '').replace(/-\d+$/, '');
  const customerEmail = body.payer_email || body.customer?.email || '';
  const customerName = body.customer?.given_names || 'Customer';
  const paymentMethod = body.payment_method || body.payment_channel || '';

  // Update Order record to paid
  await prisma.order.updateMany({
    where: { templateId, status: 'pending' },
    data: { status: 'paid', paidAt: new Date(), paymentMethod },
  });

  const staticTemplate = await prisma.template.findUnique({ where: { id: templateId } });
  if (!staticTemplate) {
    console.log('[xendit-webhook] template not found:', templateId);
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  // Idempotent: skip if customer with same template+email already exists
  const existing = customerEmail
    ? await prisma.customer.findFirst({ where: { templateId, email: customerEmail, status: 'active' } })
    : null;
  if (existing) {
    console.log('[xendit-webhook] already installed, skipping:', existing.id);
    return NextResponse.json({ received: true, skip: true, customerId: existing.id });
  }

  await prisma.customer.updateMany({
    where: { status: 'active' },
    data: { status: 'draft' },
  });

  const defaults = customerDefaults(staticTemplate.defaultData);

  const customer = await prisma.customer.create({
    data: {
      templateId: staticTemplate.id,
      name: customerName,
      email: customerEmail,
      status: 'active',
      ...defaults,
    },
  });

  console.log('[xendit-webhook] installed customer:', customer.id, templateId);
  return NextResponse.json({ received: true, customerId: customer.id });
}
