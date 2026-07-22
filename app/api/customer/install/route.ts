import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireCustomer } from '@/lib/auth';
import { VALID_TEMPLATE_DATA_FIELDS } from '@/app/lib/template-data-fields';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, customerName, customerEmail } = body as Record<string, string>;

    if (!templateId) {
      return NextResponse.json({ error: 'templateId is required' }, { status: 400 });
    }

    const staticTemplate = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!staticTemplate) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // Prefer the logged-in customer from the httpOnly session cookie/JWT.
    // This endpoint is called from the dashboard, so the customer should be
    // authenticated. Fall back to body fields only for backward compatibility
    // with flows that do not have a session (e.g. webhook-like callers).
    const { session } = await requireCustomer(request);
    let effectiveCustomerId = session?.sub || '';
    let resolvedCustomerEmail = session?.email || '';

    if (!resolvedCustomerEmail) {
      resolvedCustomerEmail = customerEmail || '';
    }

    let customer = effectiveCustomerId
      ? await prisma.customer.findUnique({ where: { id: effectiveCustomerId } })
      : resolvedCustomerEmail
        ? await prisma.customer.findFirst({ where: { email: resolvedCustomerEmail } })
        : null;

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: customerName || '',
          email: resolvedCustomerEmail || '',
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

    const camelcase = (key: string) =>
      key.replace(/[-_](\w)/g, (_, c) => c.toUpperCase());

    const mapped: Record<string, any> = {};
    for (const [key, value] of Object.entries(defaults)) {
      const camel = camelcase(key);
      if (VALID_TEMPLATE_DATA_FIELDS.has(camel)) {
        mapped[camel] = value;
      }
    }

    const templateData = await prisma.templateData.create({
      data: {
        customerId: customer.id,
        templateId: staticTemplate.id,
        slug,
        ...mapped,
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
