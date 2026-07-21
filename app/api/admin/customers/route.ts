import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({ orderBy: { createdAt: 'desc' } });
    const templateIds = Array.from(new Set(customers.map(c => c.templateId).filter(Boolean))) as string[];
    const templates = templateIds.length
      ? await prisma.template.findMany({ where: { id: { in: templateIds } }, select: { id: true, name: true } })
      : [];
    const templateMap = new Map(templates.map(t => [t.id, t.name]));
    const result = customers.map(c => ({
      ...c,
      templateName: c.templateId ? templateMap.get(c.templateId) ?? null : null,
    }));
    return NextResponse.json({ customers: result });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}
