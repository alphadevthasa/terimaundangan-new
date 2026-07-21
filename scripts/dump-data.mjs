import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: { db: { url: 'file:./prisma/dev.db' } },
});

async function main() {
  // Override env to force SQLite
  process.env.DATABASE_URL = 'file:./prisma/dev.db';

  const templates = await prisma.template.findMany();
  const customers = await prisma.customer.findMany();

  console.log(JSON.stringify({ templates, customers }, null, 2));
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
