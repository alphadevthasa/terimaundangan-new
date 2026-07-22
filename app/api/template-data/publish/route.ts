import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TEMPLATE_CONFIGS, DEFAULT_TEMPLATE_CONFIG } from '@/app/lib/templates-config';
import { buildFieldMap, generatePublishedHtml } from '@/app/lib/publish-html';
import * as fs from 'fs';
import * as path from 'path';

function sanitizeSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 30)
    || 'untitled';
}

function generateRandomDigits(length = 4): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

// Save generated HTML to public/undangan_publish/{slug}/index.html
function savePublishedHtml(slug: string, html: string): { success: boolean; filePath: string } {
  const dir = path.join(process.cwd(), 'public', 'undangan_publish', slug);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, 'index.html');
  fs.writeFileSync(filePath, html, 'utf-8');
  return { success: true, filePath };
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, groomNick, brideNick } = body;

    if (!id) {
      return NextResponse.json({ error: 'TemplateData ID required' }, { status: 400 });
    }
    if (!groomNick || !brideNick) {
      return NextResponse.json({ error: 'groomNick and brideNick required' }, { status: 400 });
    }

    const groomSlug = sanitizeSlug(groomNick);
    const brideSlug = sanitizeSlug(brideNick);

    // Generate unique slug with retry on collision
    let slug = '';
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const random = generateRandomDigits(4);
      slug = `${groomSlug}-${brideSlug}-TU${random}`;

      const existing = await prisma.templateData.findUnique({ where: { slug } });
      if (!existing || existing.id === id) break;
      attempts++;
    }

    if (attempts >= maxAttempts) {
      return NextResponse.json({ error: 'Failed to generate unique slug, try different names' }, { status: 409 });
    }

    // Update templateData: set slug + published
    const updated = await prisma.templateData.update({
      where: { id },
      data: { slug, published: true },
    });

    // === Generate static HTML with baked-in data ===
    // Fetch full template data with template info
    const td = await prisma.templateData.findUnique({
      where: { id },
      include: { template: true },
    }) as Record<string, any> | null;

    if (td) {
      try {
        const tmpl = td.template || {};
        const tmplName = tmpl.name || 'Elite Wedding';
        const templateConfig = TEMPLATE_CONFIGS[tmplName] || DEFAULT_TEMPLATE_CONFIG;
        const templateHtml = tmpl.html || templateConfig.html || '';

        if (templateHtml) {
          const fieldMap = buildFieldMap(td, templateConfig);
          const bakedHtml = generatePublishedHtml(templateHtml, fieldMap);
          savePublishedHtml(slug, bakedHtml);
        }
      } catch (genError) {
        // Non-critical: published page can still fall back to dynamic rendering
        console.error('Error generating static HTML:', genError);
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || '';
    const url = baseUrl ? `${baseUrl}/${slug}` : `/${slug}`;

    return NextResponse.json({
      url,
      slug: updated.slug,
      published: updated.published,
    });
  } catch (error) {
    console.error('Error publishing template:', error);
    return NextResponse.json({ error: 'Failed to publish template' }, { status: 500 });
  }
}
