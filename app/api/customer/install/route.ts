import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { templateId, customerName, customerEmail } = await request.json();

    if (!templateId) {
      return NextResponse.json({ error: 'templateId is required' }, { status: 400 });
    }

    const staticTemplate = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!staticTemplate) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    await prisma.customer.updateMany({
      where: { status: 'active' },
      data: { status: 'draft' },
    });

    let customer = customerEmail
      ? await prisma.customer.findFirst({ where: { email: customerEmail } })
      : null;
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: customerName || '',
          email: customerEmail || '',
          status: 'active',
        },
      });
    } else {
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: { status: 'active', name: customerName || customer.name },
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

    return NextResponse.json({
      customer: { ...customer, templateData },
      message: 'Template installed successfully! You can now edit your wedding invitation.',
    });
  } catch (error) {
    console.error('Error installing template:', error);
    return NextResponse.json({ error: 'Failed to install template' }, { status: 500 });
  }
}
