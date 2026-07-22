import { prisma } from '@/lib/prisma';
import { TEMPLATE_CONFIGS, DEFAULT_TEMPLATE_CONFIG } from '@/app/lib/templates-config';
import { kebabToCamel } from '@/app/lib/editor-sections';
import { notFound } from 'next/navigation';
import GuestWishes from '@/components/GuestWishes';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublishedWeddingPage({ params }: PageProps) {
  const { slug } = await params;

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

  // Map TemplateData camelCase fields to kebab-case for the HTML template
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

  // Build map using template's keyMap if available
  const fieldMap: Record<string, string> = {};
  if (templateConfig.keyMap) {
    for (const [kebabKey, templateKey] of Object.entries(templateConfig.keyMap)) {
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

  const scriptData = JSON.stringify(fieldMap);

  return (
    <>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Wedding Invitation - {td.groomNick || td.brideNick || 'The Couple'}</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <style>{`
          html, body { margin: 0; padding: 0; width: 100%; background: #0a0807; }
          .wedding-frame { width: 100%; height: 100vh; border: none; display: block; }
        `}</style>
      </head>
      <body style={{ margin: 0, padding: 0, background: '#0a0807' }}>
        <iframe
          id="wedding-iframe"
          className="wedding-frame"
          srcDoc={templateHtml}
          title="Wedding Invitation"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var CUSTOMER_DATA = ${scriptData};
              function applyData() {
                var iframe = document.getElementById('wedding-iframe');
                if (iframe && iframe.contentWindow) {
                  try {
                    iframe.contentWindow.postMessage({ type: 'UPDATE', payload: CUSTOMER_DATA }, '*');
                  } catch(e) {}
                }
              }
              var iframe = document.getElementById('wedding-iframe');
              if (iframe) {
                iframe.addEventListener('load', applyData);
              }
              setTimeout(applyData, 500);
              setTimeout(applyData, 2000);
            `
          }}
        />

        {/* Guest Wishes Section */}
        <div id="guest-wishes-section" style={{
          background: '#0a0807',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '2rem',
        }}>
          <GuestWishes
            templateDataId={td.id}
            title={td.wishesTitle || 'Guest Book'}
            description={td.wishesDesc || 'Tinggalkan ucapan dan doa terbaik untuk kedua mempelai'}
          />
        </div>
      </body>
    </>
  );
}
