import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
  { name: 'Wedding', slug: 'wedding', description: 'Undangan pernikahan untuk berbagai tema dan gaya', icon: 'fas fa-heart', sortOrder: 1 },
  { name: 'Birthday', slug: 'birthday', description: 'Undangan ulang tahun untuk segala usia', icon: 'fas fa-cake-candles', sortOrder: 2 },
  { name: 'Corporate', slug: 'corporate', description: 'Undangan corporate event dan seminar', icon: 'fas fa-building', sortOrder: 3 },
  { name: 'Other', slug: 'other', description: 'Kategori lainnya', icon: 'fas fa-file', sortOrder: 4 },
];

async function main() {
  for (const cat of DEFAULT_CATEGORIES) {
    const existing = await prisma.category.findUnique({ where: { slug: cat.slug } });
    if (!existing) {
      await prisma.category.create({ data: cat });
      console.log(`✅ Created category: ${cat.name}`);
    } else {
      console.log(`⏭️  Category already exists: ${cat.name}`);
    }
  }
  console.log('✅ Categories seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
