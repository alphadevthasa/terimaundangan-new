import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { customerDefaults } from '@/lib/template-utils';

// POST /api/customer/install - Install a static template, creating a new Customer record
export async function POST(request: NextRequest) {
  try {
    const { templateId, customerName, customerEmail } = await request.json();

    if (!templateId) {
      return NextResponse.json({ error: 'templateId is required' }, { status: 400 });
    }

    // Verify the static template exists
    const staticTemplate = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!staticTemplate) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // Deactivate any existing active customer
    await prisma.customer.updateMany({
      where: { status: 'active' },
      data: { status: 'draft' },
    });

    // Create a new Customer record linked to the static template
    const defaults = customerDefaults(staticTemplate.defaultData);
    const customer = await prisma.customer.create({
      data: {
        templateId: staticTemplate.id,
        name: customerName || '',
        email: customerEmail || '',
        status: 'active',
        ...defaults,
      },
    });

    return NextResponse.json({
      customer,
      message: 'Template installed successfully! You can now edit your wedding invitation.',
    });
  } catch (error) {
    console.error('Error installing template:', error);
    return NextResponse.json({ error: 'Failed to install template' }, { status: 500 });
  }
}
