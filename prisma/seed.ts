import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Check if templates already exist
  const existing = await prisma.template.count();
  if (existing > 0) {
    console.log('Templates already seeded, skipping...');
    return;
  }

  // Create static templates
  await prisma.template.createMany({
    data: [
      {
        name: 'Elite Wedding',
        description: 'Undangan pernikahan elegan dengan tema gold dan dark. Cocok untuk pernikahan formal dan mewah.',
        type: 'wedding',
        thumbnail: '',
        price: 'Free',
        isPopular: true,
      },
      {
        name: 'Honey Wedding',
        description: 'Undangan pernikahan manis dengan nuansa hangat dan elegan. Cocok untuk pernikahan dengan tema klasik modern.',
        type: 'wedding',
        thumbnail: '',
        price: 'Free',
        isPopular: false,
      },
      {
        name: 'Java Batik',
        description: 'Undangan pernikahan tradisional Jawa dengan motif batik dan nuansa keraton. Cocok untuk pernikahan adat Jawa yang mewah.',
        type: 'wedding',
        thumbnail: '',
        price: 'Free',
        isPopular: false,
      },
      {
        name: 'Forest Nature',
        description: 'Undangan pernikahan bernuansa hutan tropis dengan sentuhan sinematik. Cocok untuk pernikahan outdoor dan pecinta alam.',
        type: 'wedding',
        thumbnail: '',
        price: 'Free',
        isPopular: false,
      },
    ],
  });

  console.log('✅ Static templates seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
