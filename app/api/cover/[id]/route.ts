import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TEMPLATE_CONFIGS, DEFAULT_TEMPLATE_CONFIG } from '@/app/lib/templates-config';

const v = (d: Record<string, string>, camel: string, kebab: string) => d[camel] || d[kebab];

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const template = await prisma.template.findUnique({ where: { id: params.id } });
    if (!template) return new NextResponse('Template not found', { status: 404 });

    const config = TEMPLATE_CONFIGS[template.name] || DEFAULT_TEMPLATE_CONFIG;
    let html = template.html || config.html;
    let d = config.demoData;
    try { const parsed = JSON.parse(template.defaultData); if (Object.keys(parsed).length) d = parsed; } catch {}

    const coverReplacements: Record<string, string> = {};

    const brideName = v(d, 'brideName', 'bride-nick');
    const groomName = v(d, 'groomName', 'groom-nick');
    const heroDate = v(d, 'heroDate', 'date-text');

    // Elite Wedding (kebab-case, e- prefix)
    if (d['bride-nick']) coverReplacements['id="e-bride-nick">Bride'] = `id="e-bride-nick">${d['bride-nick']}`;
    if (d['groom-nick']) coverReplacements['id="e-groom-nick">Groom'] = `id="e-groom-nick">${d['groom-nick']}`;
    if (d['date-text']) coverReplacements['id="e-date-text">Date'] = `id="e-date-text">${d['date-text']}`;

    // Honey Wedding (camelCase, e- prefix)
    if (brideName) coverReplacements['id="e-bride-name">Sienna'] = `id="e-bride-name">${brideName}`;
    if (groomName) coverReplacements['id="e-groom-name">Arka'] = `id="e-groom-name">${groomName}`;
    if (heroDate) coverReplacements['id="e-hero-date">20 . 12 . 2025'] = `id="e-hero-date">${heroDate}`;

    // Forest Nature (camelCase, no date in cover)
    if (brideName) coverReplacements['id="e-bride-name">Elena'] = `id="e-bride-name">${brideName}`;
    if (groomName) coverReplacements['id="e-groom-name">Arthur'] = `id="e-groom-name">${groomName}`;

    // Java Batik (camelCase, e- prefix)
    if (brideName) coverReplacements['id="e-bride-name">Sekarwangi'] = `id="e-bride-name">${brideName}`;
    if (groomName) coverReplacements['id="e-groom-name">Baskoro'] = `id="e-groom-name">${groomName}`;
    if (heroDate) coverReplacements['id="e-hero-date">Sabtu, 20 Desember 2025'] = `id="e-hero-date">${heroDate}`;

    // West Sumatra (no id attributes — text-based fallback)
    if (v(d, 'heroDate', 'hero-date')) coverReplacements['>Sabtu, 20 Desember 2025<'] = `>${v(d, 'heroDate', 'hero-date')}<`;

    // Parallax Video Cover (kebab-case, e-groom-nick / e-bride-nick / e-date-text)
    if (d['bride-nick']) coverReplacements['id="e-bride-nick">Amanda'] = `id="e-bride-nick">${d['bride-nick']}`;
    if (d['groom-nick']) coverReplacements['id="e-groom-nick">Rizky'] = `id="e-groom-nick">${d['groom-nick']}`;
    if (d['date-text']) coverReplacements['id="e-date-text">12 . 12 . 2026'] = `id="e-date-text">${d['date-text']}`;

    for (const [key, value] of Object.entries(coverReplacements)) {
      html = html.replace(key, value);
    }

    // Inject via postMessage for sections below the fold
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
