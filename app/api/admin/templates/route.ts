import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { response } = await requireAdmin(request);
  if (response) return response;
  try {
    const templates = await prisma.template.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { response } = await requireAdmin(request);
  if (response) return response;
  try {
    const body = await request.json();
    const template = await prisma.template.create({
      data: {
        name: body.name,
        description: body.description ?? '',
        type: body.type ?? 'wedding',
        theme: body.theme ?? '',
        category: 'wedding',
        thumbnail: body.thumbnail ?? '',
        price: body.price ?? 'Free',
        isPopular: body.isPopular ?? false,
        isPublished: body.isPublished ?? true,
        html: body.html ?? '',
        defaultData: body.defaultData ?? '{}',
      },
    });
    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}
