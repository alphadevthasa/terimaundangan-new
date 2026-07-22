import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as fs from 'fs';
import * as path from 'path';

// Remove published HTML directory for a given slug
function removePublishedHtml(slug: string): void {
  if (!slug) return;
  const dir = path.join(process.cwd(), 'public', 'undangan_publish', slug);
  try {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  } catch (e) {
    console.error('Error removing published HTML:', e);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'TemplateData ID required' }, { status: 400 });
    }

    const existing = await prisma.templateData.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // Remove static HTML files
    removePublishedHtml(existing.slug);

    const updated = await prisma.templateData.update({
      where: { id },
      data: { published: false },
    });

    return NextResponse.json({
      published: updated.published,
      slug: updated.slug,
    });
  } catch (error) {
    console.error('Error unpublishing template:', error);
    return NextResponse.json({ error: 'Failed to unpublish template' }, { status: 500 });
  }
}
