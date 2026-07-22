import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

  await prisma.order.updateMany({
    where: { templateId, status: 'pending' },
    data: { status: 'paid', paidAt: new Date(), paymentMethod },
  });

  const staticTemplate = await prisma.template.findUnique({ where: { id: templateId } });
  if (!staticTemplate) {
    console.log('[xendit-webhook] template not found:', templateId);
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  const existing = customerEmail
    ? await prisma.customer.findFirst({
        where: { email: customerEmail, templateData: { some: { templateId } } },
      })
    : null;
  if (existing) {
    console.log('[xendit-webhook] already installed, skipping:', existing.id);
    return NextResponse.json({ received: true, skip: true, customerId: existing.id });
  }

  let customer = customerEmail
    ? await prisma.customer.findFirst({ where: { email: customerEmail } })
    : null;
  if (!customer) {
    customer = await prisma.customer.create({
      data: { name: customerName, email: customerEmail, status: 'active' },
    });
  } else {
    customer = await prisma.customer.update({
      where: { id: customer.id },
      data: { status: 'active', name: customerName },
    });
  }

  const defaults = JSON.parse(staticTemplate.defaultData || '{}');
  const slug = customerName
    ? customerName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + customer.id.slice(0, 6)
    : customer.id.slice(0, 12);
  const templateData = await prisma.templateData.create({
    data: {
      customerId: customer.id,
      templateId: staticTemplate.id,
      slug,
      ...defaults,
    },
  });

  console.log('[xendit-webhook] installed customer:', customer.id, 'templateData:', templateData.id, templateId);
  return NextResponse.json({ received: true, customerId: customer.id });
}
