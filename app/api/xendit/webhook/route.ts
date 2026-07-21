import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const token = request.headers.get('x-callback-token');
  if (token !== process.env.XENDIT_WEBHOOK_VERIFICATION_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  console.log('[xendit-webhook] received:', body.id, body.status, body.external_id);

  if (body.status !== 'PAID') {
    return NextResponse.json({ received: true });
  }

  const externalId = body.external_id || '';
  if (!externalId.startsWith('template-')) {
    return NextResponse.json({ error: 'Invalid external_id' }, { status: 400 });
  }

  const templateId = externalId.replace(/^template-/, '').replace(/-\d+$/, '');
  const customerEmail = body.payer_email || body.customer?.email || '';
  const customerName = body.customer?.given_names || 'Customer';

  const staticTemplate = await prisma.template.findUnique({ where: { id: templateId } });
  if (!staticTemplate) {
    console.log('[xendit-webhook] template not found:', templateId);
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  // Idempotent: skip if customer with same template+email already exists
  const existing = customerEmail
    ? await prisma.customer.findFirst({ where: { templateId, email: customerEmail, status: 'active' } })
    : null;
  if (existing) {
    console.log('[xendit-webhook] already installed, skipping:', existing.id);
    return NextResponse.json({ received: true, skip: true, customerId: existing.id });
  }

  await prisma.customer.updateMany({
    where: { status: 'active' },
    data: { status: 'draft' },
  });

  const customer = await prisma.customer.create({
    data: {
      templateId: staticTemplate.id,
      name: customerName,
      email: customerEmail,
      status: 'active',
      brideNick: 'Bride',
      groomNick: 'Groom',
      dateText: 'Saturday, October 24th, 2026',
      countdownMaster: '2026-10-24T10:00',
      coupleTitle: 'Two Souls, One Heart',
      coupleSub: 'We invite you to share in our joy as we exchange our vows and begin our new life together.',
      groomFull: 'Groom Name',
      groomRole: 'The Groom',
      groomPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      groomDad: "Father's Name",
      groomMom: "Mother's Name",
      brideFull: 'Bride Name',
      brideRole: 'The Bride',
      bridePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      brideDad: "Father's Name",
      brideMom: "Mother's Name",
      verseText: '"And above all these put on love, which binds everything together in perfect harmony."',
      verseSource: 'Colossians 3:14',
      storyDate1: 'June 2018',
      storyTitle1: 'First Meeting',
      storyDesc1: 'We met at a small coffee shop in the city.',
      storyDate2: 'Dec 2024',
      storyTitle2: 'The Proposal',
      storyDesc2: 'Under the stars, a promise was made to last forever.',
      akadDate: 'Saturday, October 24, 2026',
      akadTime: '08:00 AM - 10:00 AM',
      akadPlace: 'Grand Heritage Mosque',
      resepsiDate: 'Saturday, October 24, 2026',
      resepsiTime: '07:00 PM - End',
      resepsiPlace: 'The Ritz-Carlton Ballroom',
      rsvpTitle: 'Will You Join Us?',
      rsvpDesc: 'Please kindly confirm your attendance by October 1st, 2026.',
      bankName: 'BCA',
      bankAcc: '1234567890',
      bankHolder: 'Account Holder',
      streamTitle: 'Virtual Wedding',
      streamDesc: 'For friends and family who cannot attend physically.',
      wishesTitle: 'Guest Book',
      wishesDesc: 'Leave your warmest wishes and blessings for our marriage.',
      closingThanks: 'Terima Kasih',
      closingFam: 'The Families',
    },
  });

  console.log('[xendit-webhook] installed customer:', customer.id, templateId);
  return NextResponse.json({ received: true, customerId: customer.id });
}
