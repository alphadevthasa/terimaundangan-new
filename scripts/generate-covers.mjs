import puppeteer from 'puppeteer-core';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function generate() {
  const templates = await prisma.template.findMany();
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  const BASE = 'http://localhost:3000';

  for (const t of templates) {
    const url = `${BASE}/api/cover/${t.id}`;
    console.log(`\n[${t.name}] fetching ${url}`);
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 20000 });
      // Wait for hero fade-in animations (up to 3.5s in Honey Wedding)
      await new Promise(r => setTimeout(r, 5000));
      const path = `public/covers/${t.id}.png`;
      await page.screenshot({ path, type: 'png' });
      console.log(`  ✓ saved ${path}`);

      await prisma.template.update({
        where: { id: t.id },
        data: { thumbnail: `/covers/${t.id}.png` },
      });
      console.log(`  ✓ DB updated`);
    } catch (e) {
      console.error(`  ✗ ${e.message}`);
    }
  }

  await browser.close();
  await prisma.$disconnect();
  console.log('\nDone.');
}

generate();
