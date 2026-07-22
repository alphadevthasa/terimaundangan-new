import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'admin@terimaundangan.com';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_NAME = 'Administrator';

async function main() {
  console.log('🌱 Admin Seed Script');
  console.log('━━━━━━━━━━━━━━━━━━━━\n');

  // Check if admin already exists
  const existing = await prisma.customer.findFirst({ where: { email: ADMIN_EMAIL } });

  if (existing) {
    if (existing.isAdmin) {
      console.log(`ℹ️  Admin already exists: ${ADMIN_EMAIL}`);
      console.log(`   Name: ${existing.name || ADMIN_NAME}`);
      console.log(`   Role: Admin`);
    } else {
      // Upgrade existing customer to admin
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

      await prisma.customer.update({
        where: { id: existing.id },
        data: {
          isAdmin: true,
          name: existing.name || ADMIN_NAME,
          password: hashedPassword,
          emailVerifiedAt: new Date(),
        },
      });
      console.log(`✅ Upgraded ${ADMIN_EMAIL} to admin!`);
      console.log(`   Password has been set.`);
    }
  } else {
    // Create new admin user
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    await prisma.customer.create({
      data: {
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        isAdmin: true,
        status: 'active',
        emailVerifiedAt: new Date(),
      },
    });
    console.log(`✅ Admin created successfully!`);
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Name:     ${ADMIN_NAME}`);
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━');
  console.log('🏁 Done.');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
