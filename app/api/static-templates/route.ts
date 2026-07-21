import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/static-templates - Fetch all static templates
export async function GET() {
  try {
    const templates = await prisma.template.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error fetching static templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}
