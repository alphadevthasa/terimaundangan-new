import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { VALID_TEMPLATE_DATA_FIELDS } from '@/app/lib/template-data-fields';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const customerId = searchParams.get('customerId');
    const templateId = searchParams.get('templateId');
    const slug = searchParams.get('slug');

    let data;

    if (id) {
      data = await prisma.templateData.findUnique({ where: { id } });
      if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    } else if (customerId && templateId) {
      data = await prisma.templateData.findFirst({ where: { customerId, templateId } });
      if (!data) {
        const template = await prisma.template.findUnique({ where: { id: templateId } });
        let slug = `${customerId.slice(0, 8)}`;
        if (template) slug = template.name.toLowerCase().replace(/\s+/g, '-') + '-' + slug;
        data = await prisma.templateData.create({
          data: { customerId, templateId, slug },
        });
      }
    } else if (customerId) {
      data = await prisma.templateData.findFirst({
        where: { customerId },
        orderBy: { createdAt: 'desc' },
      });
    } else if (slug) {
      data = await prisma.templateData.findUnique({ where: { slug } });
    } else {
      return NextResponse.json({ error: 'Provide id, customerId+templateId, or slug' }, { status: 400 });
    }

    return NextResponse.json({ templateData: data });
  } catch (error) {
    console.error('Error fetching template data:', error);
    return NextResponse.json({ error: 'Failed to fetch template data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, templateId, ...fields } = body;

    if (!id) {
      return NextResponse.json({ error: 'TemplateData ID required' }, { status: 400 });
    }

    const data: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(fields)) {
      // Only include fields that exist in the Prisma schema
      if (value !== undefined && VALID_TEMPLATE_DATA_FIELDS.has(key)) {
        data[key] = value;
      }
    }

    const updated = await prisma.templateData.update({
      where: { id },
      data,
    });

    return NextResponse.json({ templateData: updated });
  } catch (error) {
    console.error('Error updating template data:', error);
    return NextResponse.json({ error: 'Failed to update template data' }, { status: 500 });
  }
}
