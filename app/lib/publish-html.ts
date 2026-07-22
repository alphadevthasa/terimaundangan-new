import { kebabToCamel } from './editor-sections';

/**
 * Build fieldMap from TemplateData and template config.
 * Shared between publish API and [slug]/page.tsx
 */
export function buildFieldMap(
  td: Record<string, any>,
  templateConfig: Record<string, any>
): Record<string, string> {
  const fieldMappings: Record<string, string> = {
    'bride-nick': td.brideNick,
    'groom-nick': td.groomNick,
    'date-text': td.dateText,
    'countdown-master': td.countdownMaster,
    'couple-title': td.coupleTitle,
    'couple-sub': td.coupleSub,
    'groom-full': td.groomFull,
    'groom-role': td.groomRole,
    'groom-photo': td.groomPhoto,
    'groom-dad': td.groomDad,
    'groom-mom': td.groomMom,
    'bride-full': td.brideFull,
    'bride-role': td.brideRole,
    'bride-photo': td.bridePhoto,
    'bride-dad': td.brideDad,
    'bride-mom': td.brideMom,
    'verse-text': td.verseText,
    'verse-source': td.verseSource,
    'story-date-1': td.storyDate1,
    'story-title-1': td.storyTitle1,
    'story-desc-1': td.storyDesc1,
    'story-date-2': td.storyDate2,
    'story-title-2': td.storyTitle2,
    'story-desc-2': td.storyDesc2,
    'akad-date': td.akadDate,
    'akad-time': td.akadTime,
    'akad-place': td.akadPlace,
    'resepsi-date': td.resepsiDate,
    'resepsi-time': td.resepsiTime,
    'resepsi-place': td.resepsiPlace,
    'gal-1': td.gal1,
    'gal-2': td.gal2,
    'gal-3': td.gal3,
    'gal-4': td.gal4,
    'gal-5': td.gal5,
    'gal-6': td.gal6,
    'rsvp-title': td.rsvpTitle,
    'rsvp-desc': td.rsvpDesc,
    'bank-name': td.bankName,
    'bank-acc': td.bankAcc,
    'bank-holder': td.bankHolder,
    'stream-title': td.streamTitle,
    'stream-desc': td.streamDesc,
    'wishes-title': td.wishesTitle,
    'wishes-desc': td.wishesDesc,
    'closing-thanks': td.closingThanks,
    'closing-fam': td.closingFam,
  };

  const fieldMap: Record<string, string> = {};
  const km = templateConfig.keyMap as Record<string, string> | undefined;
  if (km) {
    for (const [kebabKey, templateKey] of Object.entries(km)) {
      const camelKey = kebabToCamel(kebabKey);
      if (td[camelKey]) {
        fieldMap[templateKey] = td[camelKey];
      }
    }
  } else {
    for (const [key, value] of Object.entries(fieldMappings)) {
      if (value) fieldMap[key] = value;
    }
  }
  return fieldMap;
}

/**
 * Bake customer data into template HTML via server-side string replacement.
 * This eliminates the client-side flicker (default values → real data)
 * because all data is already in the HTML when the browser renders it.
 */
export function bakeDataIntoHtml(
  rawHtml: string,
  fieldMap: Record<string, string>
): string {
  let html = rawHtml;

  for (const [key, value] of Object.entries(fieldMap)) {
    if (!value) continue;

    const elementId = 'e-' + key;
    const escapedId = elementId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const safeValue = value.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    // 1. IMG elements: replace src="..." with the actual URL
    const imgRegex = new RegExp(
      `(<img[^>]*?id="${escapedId}"[^>]*?src=")[^"]*(")`,
      'g'
    );
    html = html.replace(imgRegex, `$1${value}$2`);

    // 2. Text elements: replace inner text content
    const textRegex = new RegExp(
      `(<[^>]*?id="${escapedId}"[^>]*?>)[^<]*?(<\\/[^>]*?>)`,
      'g'
    );
    html = html.replace(textRegex, `$1${safeValue}$2`);

    // 3. Background images: add inline background-image to elements with matching id
    // Handles templates like Java Batik where bg is set via CSS class + JS override
    if (key.endsWith('Bg') || key.endsWith('bg')) {
      const hasStyle = new RegExp(`(<[^>]*?id="${escapedId}"[^>]*?style=")[^"]*(")`, 'g');
      if (hasStyle.test(html)) {
        hasStyle.lastIndex = 0;
        html = html.replace(hasStyle, `$1background-image: url('${value}'); $2`);
      } else {
        // Element exists but has no inline style - add one
        const noStyle = new RegExp(`(<[^>]*?id="${escapedId}"[^>]*?)(\\s*>)`, 'g');
        html = html.replace(noStyle, `$1 style="background-image: url('${value}');"$2`);
      }
    }
  }

  // === Special cases for Elite Wedding ===

  // e-bride-nick-close (closing section initials)
  if (fieldMap['bride-nick']) {
    const closeId = 'e-bride-nick-close';
    const escaped = closeId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    html = html.replace(
      new RegExp(`(<[^>]*?id="${escaped}"[^>]*?>)[^<]*?(<\\/[^>]*?>)`, 'g'),
      `$1${fieldMap['bride-nick']}$2`
    );
  }

  // e-groom-nick-close (closing section initials)
  if (fieldMap['groom-nick']) {
    const closeId = 'e-groom-nick-close';
    const escaped = closeId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    html = html.replace(
      new RegExp(`(<[^>]*?id="${escaped}"[^>]*?>)[^<]*?(<\\/[^>]*?>)`, 'g'),
      `$1${fieldMap['groom-nick']}$2`
    );
  }

  return html;
}

/**
 * Generate a complete standalone HTML file with data baked in.
 */
export function generatePublishedHtml(
  templateHtml: string,
  fieldMap: Record<string, string>
): string {
  // Bake data into the template HTML
  let html = bakeDataIntoHtml(templateHtml, fieldMap);

  // Note: postMessage listeners are kept as-is.
  // They're harmless on a static page (no editor sends postMessage to published page)
  // and removing them via regex is dangerous because they share <script> blocks
  // with critical functionality (countdown, lightbox, audio).

  // Ensure DOCTYPE is present
  if (!html.trim().startsWith('<!DOCTYPE')) {
    html = '<!DOCTYPE html>\n' + html;
  }

  // Add a comment to identify this as a pre-generated file
  html = html.replace(
    '<html',
    '<html data-generated="terimaundangan-published"'
  );

  return html;
}
