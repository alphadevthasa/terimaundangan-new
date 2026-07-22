import { chromium } from 'playwright';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BASE = 'http://localhost:3000';

async function main() {
  const templates = await prisma.template.findMany({
    select: { id: true, name: true }
  });

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });

  for (const t of templates) {
    const url = `${BASE}/api/cover/${t.id}`;
    console.log(`Screenshotting ${t.name} (${t.id})...`);
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const outPath = `public/covers/${t.id}.png`;
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`  → saved ${outPath}`);
    await page.close();

    await prisma.template.update({
      where: { id: t.id },
      data: { thumbnail: `/covers/${t.id}.png` }
    });
    console.log(`  → DB updated`);
  }

  await browser.close();
  await prisma.$disconnect();
  console.log('Done.');
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
