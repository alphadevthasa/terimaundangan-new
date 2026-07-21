import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TEMPLATE_CONFIGS, DEFAULT_TEMPLATE_CONFIG } from '@/app/lib/templates-config';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const template = await prisma.template.findUnique({ where: { id: params.id } });
    if (!template) return new NextResponse('Template not found', { status: 404 });

    const config = TEMPLATE_CONFIGS[template.name] || DEFAULT_TEMPLATE_CONFIG;
    let html = config.html;
    const d = config.demoData;

    // Inject demo data into cover placeholders server-side
    const coverReplacements: Record<string, string> = {};
    if (d['bride-nick']) coverReplacements['id="e-bride-nick">Bride'] = `id="e-bride-nick">${d['bride-nick']}`;
    if (d['groom-nick']) coverReplacements['id="e-groom-nick">Groom'] = `id="e-groom-nick">${d['groom-nick']}`;
    if (d['date-text']) coverReplacements['id="e-date-text">Date'] = `id="e-date-text">${d['date-text']}`;
    if (d.brideName) coverReplacements['id="bride-nick">Bride'] = `id="bride-nick">${d.brideName}`;
    if (d.groomName) coverReplacements['id="groom-nick">Groom'] = `id="groom-nick">${d.groomName}`;
    if (d.heroDate) coverReplacements['id="date-text">Saturday, October 24 2026'] = `id="date-text">${d.heroDate}`;
    if (d.brideName) coverReplacements['id="e-bride-name">Elena'] = `id="e-bride-name">${d.brideName}`;
    if (d.groomName) coverReplacements['id="e-groom-name">Arthur'] = `id="e-groom-name">${d.groomName}`;

    for (const [key, value] of Object.entries(coverReplacements)) {
      html = html.replace(key, value);
    }

    // Also inject via postMessage for the sections below the fold
    const demoData = JSON.stringify(d);
    const injectScript = `
<script>
window.addEventListener('DOMContentLoaded', function() {
  var data = ${demoData};
  if (window.updateInvitation) window.updateInvitation(data);
  window.postMessage({ type: 'UPDATE', payload: data }, '*');
});
<\/script>`;

    html = html.replace('</body>', injectScript + '</body>');

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (error) {
    console.error('Error serving cover:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
