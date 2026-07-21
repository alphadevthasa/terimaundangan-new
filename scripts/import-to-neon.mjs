import { PrismaClient } from '@prisma/client';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const templates = require('/tmp/templates.json');
const customers = require('/tmp/customers.json');

const prisma = new PrismaClient();

async function main() {
  // Import Templates
  console.log(`\nImporting ${templates.length} templates...`);
  for (const t of templates) {
    const data = {
      id: t.id,
      name: t.name,
      description: t.description || '',
      type: t.type || 'wedding',
      thumbnail: t.thumbnail || '',
      price: t.price === 'Free' ? 'Premium' : t.price, // nothing is free
      isPopular: t.isPopular === 1 || t.isPopular === true,
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt),
    };
    await prisma.template.upsert({
      where: { id: t.id },
      create: data,
      update: data,
    });
    console.log(`  ✓ ${t.name} (${t.price} → ${data.price})`);
  }

  // Import Customers
  console.log(`\nImporting ${customers.length} customers...`);
  let ok = 0, skip = 0;
  for (const c of customers) {
    try {
      const data = {
        id: c.id,
        templateId: c.templateId || null,
        name: c.name || '',
        email: c.email || '',
        status: c.status || 'active',
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
        brideNick: c.brideNick || 'Sophia',
        groomNick: c.groomNick || 'Alexander',
        dateText: c.dateText || 'Saturday, October 24th, 2026',
        countdownMaster: c.countdownMaster || '2026-10-24T10:00',
        coupleTitle: c.coupleTitle || 'Two Souls, One Heart',
        coupleSub: c.coupleSub || 'We invite you...',
        groomFull: c.groomFull || 'Alexander Pierce',
        groomRole: c.groomRole || 'The Groom',
        groomPhoto: c.groomPhoto || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        groomDad: c.groomDad || "Mr. Robert Pierce",
        groomMom: c.groomMom || "Mrs. Elena Pierce",
        brideFull: c.brideFull || 'Sophia Laurent',
        brideRole: c.brideRole || 'The Bride',
        bridePhoto: c.bridePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        brideDad: c.brideDad || "Mr. Arthur Laurent",
        brideMom: c.brideMom || "Mrs. Clara Laurent",
        verseText: c.verseText || '"And above all these put on love..."',
        verseSource: c.verseSource || 'Colossians 3:14',
        storyDate1: c.storyDate1 || 'June 2018',
        storyTitle1: c.storyTitle1 || 'First Meeting',
        storyDesc1: c.storyDesc1 || 'We met at a small coffee shop.',
        storyDate2: c.storyDate2 || 'Dec 2024',
        storyTitle2: c.storyTitle2 || 'The Proposal',
        storyDesc2: c.storyDesc2 || 'Under the stars...',
        akadDate: c.akadDate || 'Saturday, October 24, 2026',
        akadTime: c.akadTime || '08:00 AM - 10:00 AM',
        akadPlace: c.akadPlace || 'Grand Heritage Mosque',
        resepsiDate: c.resepsiDate || 'Saturday, October 24, 2026',
        resepsiTime: c.resepsiTime || '07:00 PM - End',
        resepsiPlace: c.resepsiPlace || 'The Ritz-Carlton Ballroom',
        gal1: c.gal1 || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80',
        gal2: c.gal2 || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80',
        gal3: c.gal3 || 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=400&q=80',
        gal4: c.gal4 || 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=400&q=80',
        gal5: c.gal5 || 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=400&q=80',
        gal6: c.gal6 || 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=400&q=80',
        rsvpTitle: c.rsvpTitle || 'Will You Join Us?',
        rsvpDesc: c.rsvpDesc || 'Please kindly confirm your attendance.',
        bankName: c.bankName || 'BCA',
        bankAcc: c.bankAcc || '1234567890',
        bankHolder: c.bankHolder || 'Alexander Pierce',
        streamTitle: c.streamTitle || 'Virtual Wedding',
        streamDesc: c.streamDesc || 'For friends and family unable to attend.',
        wishesTitle: c.wishesTitle || 'Guest Book',
        wishesDesc: c.wishesDesc || 'Leave your warmest wishes.',
        closingThanks: c.closingThanks || 'Terima Kasih',
        closingFam: c.closingFam || 'The Pierce & Laurent Families',
      };
      await prisma.customer.upsert({
        where: { id: c.id },
        create: data,
        update: data,
      });
      ok++;
    } catch (e) {
      console.error(`  ✗ Error importing customer ${c.id}: ${e.message}`);
      skip++;
    }
  }
  console.log(`  ✓ Imported: ${ok}, Skipped: ${skip}`);

  // Verify
  const tCount = await prisma.template.count();
  const cCount = await prisma.customer.count();
  console.log(`\n✅ Verification: ${tCount} templates, ${cCount} customers`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
