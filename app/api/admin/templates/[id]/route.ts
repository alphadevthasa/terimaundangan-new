import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { response } = await requireAdmin(request);
  if (response) return response;
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
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { response } = await requireAdmin(request);
  if (response) return response;
  try {
    const body = await request.json();
    const template = await prisma.template.update({
      where: { id: params.id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.type !== undefined && { type: body.type }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.theme !== undefined && { theme: body.theme }),
        ...(body.thumbnail !== undefined && { thumbnail: body.thumbnail }),
        ...(body.price !== undefined && { price: body.price }),
        ...(body.isPopular !== undefined && { isPopular: body.isPopular }),
        ...(body.isPublished !== undefined && { isPublished: body.isPublished }),
        ...(body.html !== undefined && { html: body.html }),
        ...(body.defaultData !== undefined && { defaultData: typeof body.defaultData === 'string' ? body.defaultData : JSON.stringify(body.defaultData) }),
      },
    });
    return NextResponse.json({ template });
  } catch (error) {
    console.error('Error updating template:', error);
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : JSON.stringify(error));
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { response } = await requireAdmin(request);
  if (response) return response;
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
