import { prisma } from '@/lib/prisma';
import { TEMPLATE_CONFIGS, DEFAULT_TEMPLATE_CONFIG } from '@/app/lib/templates-config';
import { buildFieldMap, generatePublishedHtml } from '@/app/lib/publish-html';
import { notFound } from 'next/navigation';
import * as fs from 'fs';
import * as path from 'path';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Published wedding page.
 *
 * Priority:
 * 1. Serve pre-generated static HTML from public/undangan_publish/{slug}/index.html
 *    (no flicker — data already baked in at publish time)
 * 2. Fall back to dynamic rendering from DB if static file not found
 *    (e.g. during development or if publish didn't generate file)
 *
 * The static file is generated at publish time by PATCH /api/template-data/publish
 * via generatePublishedHtml() which bakes all customer data directly into the HTML.
 */
export default async function PublishedWeddingPage({ params }: PageProps) {
  const { slug } = await params;

  // === TRY 1: Serve pre-generated static HTML ===
  try {
    const staticPath = path.join(process.cwd(), 'public', 'undangan_publish', slug, 'index.html');
    if (fs.existsSync(staticPath)) {
      const html = fs.readFileSync(staticPath, 'utf-8');
      return (
        <>
          <head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Wedding Invitation</title>
          </head>
          <body style={{ margin: 0, padding: 0 }}>
            <div id="wedding-root" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />
          </body>
        </>
      );
    }
  } catch {
    // Fall through to dynamic rendering
  }

  // === TRY 2: Dynamic rendering from DB (fallback) ===
  const td = await (prisma as any).templateData.findFirst({
    where: { slug, published: true },
    include: { template: true },
  }) as Record<string, any> | null;

  if (!td) {
    notFound();
  }

  const template = td.template || {};
  const templateName = template.name || 'Elite Wedding';
  const templateConfig = TEMPLATE_CONFIGS[templateName] || DEFAULT_TEMPLATE_CONFIG;
  const templateHtml = template.html || templateConfig.html;

  // Build fieldMap (shared utility with publish API)
  const fieldMap = buildFieldMap(td, templateConfig);

  // Bake data into HTML server-side
  const bakedHtml = generatePublishedHtml(templateHtml, fieldMap);

  return (
    <>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Wedding Invitation - {td.groomNick || td.brideNick || 'The Couple'}</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <style>{`html,body{margin:0;padding:0;width:100%;background:#0a0807;}`}</style>
      </head>
      <body style={{ margin: 0, padding: 0, background: '#0a0807' }}>
        <div id="wedding-root" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: bakedHtml }} />
      </body>
    </>
  );
}
