import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const template = await prisma.template.findUnique({ where: { id: params.id } });
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }
    return NextResponse.json({ template });
  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json({ error: 'Failed to fetch template' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const template = await prisma.template.update({
      where: { id: params.id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.type !== undefined && { type: body.type }),
        ...(body.thumbnail !== undefined && { thumbnail: body.thumbnail }),
        ...(body.price !== undefined && { price: body.price }),
        ...(body.isPopular !== undefined && { isPopular: body.isPopular }),
        ...(body.html !== undefined && { html: body.html }),
        ...(body.defaultData !== undefined && { defaultData: body.defaultData }),
      },
    });
    return NextResponse.json({ template });
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderCount = await prisma.order.count({ where: { templateId: params.id } });
    if (orderCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete template with existing orders' },
        { status: 400 }
      );
    }
    await prisma.template.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 });
  }
}
