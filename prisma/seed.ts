import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
  { name: 'Wedding', slug: 'wedding', description: 'Undangan pernikahan untuk berbagai tema dan gaya', icon: 'fas fa-heart', sortOrder: 1 },
  { name: 'Birthday', slug: 'birthday', description: 'Undangan ulang tahun untuk segala usia', icon: 'fas fa-cake-candles', sortOrder: 2 },
  { name: 'Corporate', slug: 'corporate', description: 'Undangan corporate event dan seminar', icon: 'fas fa-building', sortOrder: 3 },
  { name: 'Other', slug: 'other', description: 'Kategori lainnya', icon: 'fas fa-file', sortOrder: 4 },
];

async function seedCategories() {
  for (const cat of DEFAULT_CATEGORIES) {
    const existing = await prisma.category.findUnique({ where: { slug: cat.slug } });
    if (!existing) {
      await prisma.category.create({ data: cat });
      console.log(`  ✅ Created category: ${cat.name}`);
    } else {
      console.log(`  ⏭️  Category already exists: ${cat.name}`);
    }
  }
}

async function main() {
  // Seed categories first
  console.log('Seeding categories...');
  await seedCategories();
  console.log('✅ Categories seeded successfully!');

  // Link existing templates to categories
  const allCategories = await prisma.category.findMany();
  for (const cat of allCategories) {
    const result = await prisma.template.updateMany({
      where: { category: cat.slug, categoryId: null },
      data: { categoryId: cat.id },
    });
    if (result.count > 0) {
      console.log(`  🔗 Linked ${result.count} template(s) to category: ${cat.name}`);
    }
  }

  const existing = await prisma.template.count();
  if (existing === 0) {
    await prisma.template.createMany({
      data: [
        {
          name: 'Elite Wedding',
          description: 'Undangan pernikahan elegan dengan tema gold dan dark. Cocok untuk pernikahan formal dan mewah.',
          type: 'wedding',
          theme: 'Elegant',
          thumbnail: '',
          price: 'Free',
          isPopular: true,
          defaultData: JSON.stringify({
            "bride-nick": "Sophia", "groom-nick": "Alexander", "date-text": "Saturday, October 24th, 2026",
            "countdown-master": "2026-10-24T10:00", "couple-title": "Two Souls, One Heart",
            "couple-sub": "We invite you to share in our joy as we exchange our vows.",
            "groom-full": "Alexander Pierce", "groom-role": "The Groom", "groom-dad": "Mr. Robert Pierce", "groom-mom": "Mrs. Elena Pierce",
            "bride-full": "Sophia Laurent", "bride-role": "The Bride", "bride-dad": "Mr. Arthur Laurent", "bride-mom": "Mrs. Clara Laurent",
            "verse-text": "\"And above all these put on love, which binds everything together in perfect harmony.\"", "verse-source": "Colossians 3:14",
            "story-date-1": "June 2018", "story-title-1": "First Meeting", "story-desc-1": "We met at a small coffee shop in the city.",
            "story-date-2": "Dec 2024", "story-title-2": "The Proposal", "story-desc-2": "Under the stars, a promise was made to last forever.",
            "akad-date": "Saturday, October 24, 2026", "akad-time": "08:00 AM - 10:00 AM", "akad-place": "Grand Heritage Mosque",
            "resepsi-date": "Saturday, October 24, 2026", "resepsi-time": "07:00 PM - End", "resepsi-place": "The Ritz-Carlton Ballroom",
            "bank-name": "BCA", "bank-acc": "1234567890", "bank-holder": "Alexander Pierce",
            "rsvp-title": "Will You Join Us?", "rsvp-desc": "Please kindly confirm your attendance by October 1st, 2026.",
            "closing-thanks": "Terima Kasih", "closing-fam": "The Pierce & Laurent Families",
          }),
        },
        {
          name: 'Honey Wedding',
          description: 'Undangan pernikahan manis dengan nuansa hangat dan elegan.',
          type: 'wedding',
          theme: 'Romantic',
          thumbnail: '',
          price: 'Free',
          isPopular: false,
          defaultData: JSON.stringify({
            "bride-nick": "Sienna", "groom-nick": "Arka",
            "date-text": "20 . 12 . 2025", "countdown-master": "2025-12-20T08:00:00+07:00",
            "bride-full": "Sienna Pradipta Reswari", "groom-full": "Arka Mahesa Wijaya",
            "akad-date": "Sabtu, 20 Desember 2025", "akad-time": "08.00 — 10.00 WIB", "akad-place": "Masjid Agung Al-Azhar<br>Jakarta Selatan",
            "resepsi-date": "Sabtu, 20 Desember 2025", "resepsi-time": "11.00 — 14.00 WIB", "resepsi-place": "The Ritz-Carlton Ballroom<br>Jakarta Selatan",
          }),
        },
        {
          name: 'Java Batik',
          description: 'Undangan pernikahan tradisional Jawa dengan motif batik dan nuansa keraton.',
          type: 'wedding',
          theme: 'Traditional',
          thumbnail: '',
          price: 'Free',
          isPopular: false,
          defaultData: JSON.stringify({
            "bride-nick": "Sekarwangi", "groom-nick": "Baskoro",
            "date-text": "Sabtu, 20 Desember 2025", "countdown-master": "2025-12-20T08:00:00+07:00",
            "bride-full": "Raden Ayu Sekarwangi Putri, S.Ked.", "groom-full": "Raden Mas Baskoro Wicaksono, S.T.",
            "akad-date": "Sabtu, 20 Desember 2025", "akad-time": "08.00 — 10.00 WIB", "akad-place": "Pendopo Agung Keraton<br>Yogyakarta",
            "resepsi-date": "Sabtu, 20 Desember 2025", "resepsi-time": "11.00 — 14.00 WIB", "resepsi-place": "Ballroom Hotel Phoenix<br>Yogyakarta",
            "bank-name": "Bank BCA", "bank-acc": "1234 5678 9012", "bank-holder": "Raden Ayu Sekarwangi",
            "closing-thanks": "Matur Nuwun", "closing-fam": "Keluarga Besar Raden Mas Baskoro & Raden Ayu Sekarwangi",
          }),
        },
        {
          name: 'Forest Nature',
          description: 'Undangan pernikahan bernuansa hutan tropis dengan sentuhan sinematik.',
          type: 'wedding',
          theme: 'Nature',
          thumbnail: '',
          price: 'Free',
          isPopular: false,
          defaultData: JSON.stringify({
            "bride-nick": "Elena", "groom-nick": "Arthur",
            "countdown-master": "2026-10-28T08:00:00+07:00",
            "akad-date": "Sabtu, 28 Oktober 2026", "akad-time": "08:00 - 10:00 WIB", "akad-place": "<strong>Pine Forest Camp</strong><br>Lembang, Bandung",
            "resepsi-date": "Sabtu, 28 Oktober 2026", "resepsi-time": "11:00 - 14.00 WIB", "resepsi-place": "<strong>Pine Forest Camp</strong><br>Lembang, Bandung",
            "verse-text": "\"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri.\"", "verse-source": "Ar-Rum: 21",
            "closing-thanks": "Terima Kasih",
          }),
        },
        {
          name: 'West Sumatra',
          description: 'Undangan pernikahan adat Minangkabau dengan nuansa biru gelap dan emas songket.',
          type: 'wedding',
          theme: 'Traditional',
          thumbnail: '',
          price: 'Free',
          isPopular: false,
          defaultData: JSON.stringify({
            "bride-nick": "Sri", "groom-nick": "Raka",
            "bride-full": "Sri Wahyuni Zainul", "groom-full": "Raka Pratama Bukhari",
            "countdown-master": "2025-12-20T08:00:00+07:00",
            "hero-date": "20 . 12 . 2025",
          }),
        },
        {
          name: 'Fogging 3D Cinematic Wedding',
          description: 'Undangan pernikahan sinematik 3D dengan efek fogging interaktif dan tampilan modern.',
          type: 'wedding',
          theme: 'Modern',
          thumbnail: '',
          price: 'Premium',
          isPopular: false,
          defaultData: JSON.stringify({
            "bride-nick": "Juliet", "groom-nick": "Romeo",
            "bride-full": "Juliet Capulet, S.Ked.", "groom-full": "Romeo Montague, S.T.",
            "date-text": "25.12.2026", "countdown-master": "2026-12-25T08:00:00+07:00",
            "akad-date": "Jumat, 25 Desember 2026", "akad-time": "08.00 - 10.00 WIB", "akad-place": "Grand Ballroom Hotel Indonesia, Jakarta",
            "resepsi-date": "Jumat, 25 Desember 2026", "resepsi-time": "11.00 - Selesai", "resepsi-place": "Grand Ballroom Hotel Indonesia, Jakarta",
            "bank-name": "BCA", "bank-acc": "1234567890", "bank-holder": "Romeo Montague",
          }),
        },
        {
          name: 'Cover Video',
          description: 'Undangan pernikahan sinematik dengan video cover dan nuansa gold elegan. Cocok untuk pernikahan modern dan mewah.',
          type: 'wedding',
          theme: 'Modern',
          thumbnail: '',
          price: 'Free',
          isPopular: true,
          defaultData: JSON.stringify({
            "bride-nick": "Amanda", "groom-nick": "Rizky",
            "date-text": "12 . 12 . 2026", "countdown-master": "2026-12-12T08:00:00+07:00",
            "bride-full": "Amanda Putri Lestari", "groom-full": "Rizky Aditya Pratama",
            "akad-date": "Sabtu, 12 Desember 2026", "akad-time": "08.00 - 10.00 WIB", "akad-place": "Masjid Al-Ikhlas, Jakarta",
            "resepsi-date": "Sabtu, 12 Desember 2026", "resepsi-time": "11.00 - 15.00 WIB", "resepsi-place": "The Grand Ballroom, Jakarta",
            "bank-name": "BCA", "bank-acc": "1234 5678 9012", "bank-holder": "Rizky Aditya Pratama",
          }),
        },
        {
          name: 'Parallax Video Cover',
          description: 'Undangan pernikahan sinematik dengan parallax video cover dan nuansa gold elegan.',
          type: 'wedding',
          theme: 'Modern',
          thumbnail: '',
          price: 'Free',
          isPopular: false,
          defaultData: JSON.stringify({
            "bride-nick": "Amanda", "groom-nick": "Rizky",
            "date-text": "12 . 12 . 2026", "countdown-master": "2026-12-12T08:00:00+07:00",
            "bride-full": "Amanda Putri Lestari", "groom-full": "Rizky Aditya Pratama",
            "akad-date": "Sabtu, 12 Desember 2026", "akad-time": "08.00 - 10.00 WIB", "akad-place": "Masjid Al-Ikhlas, Jakarta",
            "resepsi-date": "Sabtu, 12 Desember 2026", "resepsi-time": "11.00 - 15.00 WIB", "resepsi-place": "The Grand Ballroom, Jakarta",
            "gal-1": "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
            "gal-2": "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80",
            "gal-3": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
            "gal-4": "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80",
            "gal-5": "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
            "gal-6": "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
          }),
        },
      ],
    });
    console.log('✅ Static templates seeded successfully!');
  } else {
    console.log('Templates already seeded, skipping...');
    // Backfill defaultData for existing templates that don't have it
    const emptyDefaults = await prisma.template.findMany({ where: { defaultData: '{}' } });
    const defaultsMap: Record<string, string> = {
      'Elite Wedding': JSON.stringify({"bride-nick":"Sophia","groom-nick":"Alexander","date-text":"Saturday, October 24th, 2026","countdown-master":"2026-10-24T10:00","couple-title":"Two Souls, One Heart","couple-sub":"We invite you to share in our joy as we exchange our vows.","groom-full":"Alexander Pierce","groom-role":"The Groom","groom-dad":"Mr. Robert Pierce","groom-mom":"Mrs. Elena Pierce","bride-full":"Sophia Laurent","bride-role":"The Bride","bride-dad":"Mr. Arthur Laurent","bride-mom":"Mrs. Clara Laurent","verse-text":"\"And above all these put on love, which binds everything together in perfect harmony.\"","verse-source":"Colossians 3:14","story-date-1":"June 2018","story-title-1":"First Meeting","story-desc-1":"We met at a small coffee shop in the city.","story-date-2":"Dec 2024","story-title-2":"The Proposal","story-desc-2":"Under the stars, a promise was made to last forever.","akad-date":"Saturday, October 24, 2026","akad-time":"08:00 AM - 10:00 AM","akad-place":"Grand Heritage Mosque","resepsi-date":"Saturday, October 24, 2026","resepsi-time":"07:00 PM - End","resepsi-place":"The Ritz-Carlton Ballroom","bank-name":"BCA","bank-acc":"1234567890","bank-holder":"Alexander Pierce","rsvp-title":"Will You Join Us?","rsvp-desc":"Please kindly confirm your attendance by October 1st, 2026.","closing-thanks":"Terima Kasih","closing-fam":"The Pierce & Laurent Families"}),
      'Honey Wedding': JSON.stringify({"bride-nick":"Sienna","groom-nick":"Arka","date-text":"20 . 12 . 2025","countdown-master":"2025-12-20T08:00:00+07:00","bride-full":"Sienna Pradipta Reswari","groom-full":"Arka Mahesa Wijaya","akad-date":"Sabtu, 20 Desember 2025","akad-time":"08.00 — 10.00 WIB","akad-place":"Masjid Agung Al-Azhar<br>Jakarta Selatan","resepsi-date":"Sabtu, 20 Desember 2025","resepsi-time":"11.00 — 14.00 WIB","resepsi-place":"The Ritz-Carlton Ballroom<br>Jakarta Selatan"}),
      'Java Batik': JSON.stringify({"bride-nick":"Sekarwangi","groom-nick":"Baskoro","date-text":"Sabtu, 20 Desember 2025","countdown-master":"2025-12-20T08:00:00+07:00","bride-full":"Raden Ayu Sekarwangi Putri, S.Ked.","groom-full":"Raden Mas Baskoro Wicaksono, S.T.","akad-date":"Sabtu, 20 Desember 2025","akad-time":"08.00 — 10.00 WIB","akad-place":"Pendopo Agung Keraton<br>Yogyakarta","resepsi-date":"Sabtu, 20 Desember 2025","resepsi-time":"11.00 — 14.00 WIB","resepsi-place":"Ballroom Hotel Phoenix<br>Yogyakarta","bank-name":"Bank BCA","bank-acc":"1234 5678 9012","bank-holder":"Raden Ayu Sekarwangi","closing-thanks":"Matur Nuwun","closing-fam":"Keluarga Besar Raden Mas Baskoro & Raden Ayu Sekarwangi"}),
      'Forest Nature': JSON.stringify({"bride-nick":"Elena","groom-nick":"Arthur","countdown-master":"2026-10-28T08:00:00+07:00","akad-date":"Sabtu, 28 Oktober 2026","akad-time":"08:00 - 10:00 WIB","akad-place":"<strong>Pine Forest Camp</strong><br>Lembang, Bandung","resepsi-date":"Sabtu, 28 Oktober 2026","resepsi-time":"11:00 - 14.00 WIB","resepsi-place":"<strong>Pine Forest Camp</strong><br>Lembang, Bandung","verse-text":"\"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri.\"","verse-source":"Ar-Rum: 21","closing-thanks":"Terima Kasih"}),
      'West Sumatra': JSON.stringify({"bride-nick":"Sri","groom-nick":"Raka","bride-full":"Sri Wahyuni Zainul","groom-full":"Raka Pratama Bukhari","countdown-master":"2025-12-20T08:00:00+07:00","hero-date":"20 . 12 . 2025"}),
      'Fogging 3D Cinematic Wedding': JSON.stringify({"bride-nick":"Juliet","groom-nick":"Romeo","bride-full":"Juliet Capulet, S.Ked.","groom-full":"Romeo Montague, S.T.","date-text":"25.12.2026","countdown-master":"2026-12-25T08:00:00+07:00","akad-date":"Jumat, 25 Desember 2026","akad-time":"08.00 - 10.00 WIB","akad-place":"Grand Ballroom Hotel Indonesia, Jakarta","resepsi-date":"Jumat, 25 Desember 2026","resepsi-time":"11.00 - Selesai","resepsi-place":"Grand Ballroom Hotel Indonesia, Jakarta","bank-name":"BCA","bank-acc":"1234567890","bank-holder":"Romeo Montague"}),
      'Cover Video': JSON.stringify({"bride-nick":"Amanda","groom-nick":"Rizky","date-text":"12 . 12 . 2026","countdown-master":"2026-12-12T08:00:00+07:00","bride-full":"Amanda Putri Lestari","groom-full":"Rizky Aditya Pratama","akad-date":"Sabtu, 12 Desember 2026","akad-time":"08.00 - 10.00 WIB","akad-place":"Masjid Al-Ikhlas, Jakarta","resepsi-date":"Sabtu, 12 Desember 2026","resepsi-time":"11.00 - 15.00 WIB","resepsi-place":"The Grand Ballroom, Jakarta","bank-name":"BCA","bank-acc":"1234 5678 9012","bank-holder":"Rizky Aditya Pratama"}),
      'Parallax Video Cover': JSON.stringify({"bride-nick":"Amanda","groom-nick":"Rizky","date-text":"12 . 12 . 2026","countdown-master":"2026-12-12T08:00:00+07:00","bride-full":"Amanda Putri Lestari","groom-full":"Rizky Aditya Pratama","akad-date":"Sabtu, 12 Desember 2026","akad-time":"08.00 - 10.00 WIB","akad-place":"Masjid Al-Ikhlas, Jakarta","resepsi-date":"Sabtu, 12 Desember 2026","resepsi-time":"11.00 - 15.00 WIB","resepsi-place":"The Grand Ballroom, Jakarta","gal-1":"https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80","gal-2":"https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80","gal-3":"https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80","gal-4":"https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80","gal-5":"https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80","gal-6":"https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80"}),
    };
    for (const t of emptyDefaults) {
      const d = defaultsMap[t.name];
      if (d) {
        await prisma.template.update({ where: { id: t.id }, data: { defaultData: d } });
        console.log(`  Updated defaultData for ${t.name}`);
      }
    }
  }

  const templates = await prisma.template.findMany();
  const orderCount = await prisma.order.count();
  if (orderCount === 0 && templates.length > 0) {
    const orders = [
      { templateId: templates[0].id, templateName: templates[0].name, customerName: 'Sarah Andini', customerEmail: 'sarah@example.com', amount: 150000, status: 'paid', paymentMethod: 'BCA Virtual Account', paidAt: new Date('2026-07-15T10:30:00Z') },
      { templateId: templates[1].id, templateName: templates[1].name, customerName: 'Budi Santoso', customerEmail: 'budi@example.com', amount: 150000, status: 'paid', paymentMethod: 'GoPay', paidAt: new Date('2026-07-14T14:20:00Z') },
      { templateId: templates[2].id, templateName: templates[2].name, customerName: 'Dewi Lestari', customerEmail: 'dewi@example.com', amount: 0, status: 'paid', paymentMethod: '', paidAt: new Date('2026-07-13T08:00:00Z') },
      { templateId: templates[0].id, templateName: templates[0].name, customerName: 'Rizky Pratama', customerEmail: 'rizky@example.com', amount: 150000, status: 'pending' },
      { templateId: templates[3].id, templateName: templates[3].name, customerName: 'Maya Indah', customerEmail: 'maya@example.com', amount: 150000, status: 'pending' },
    ];
    await prisma.order.createMany({ data: orders });
    console.log('✅ Demo orders seeded successfully!');
  }
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
