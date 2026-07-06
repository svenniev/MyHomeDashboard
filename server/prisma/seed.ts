import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  // Create default user if no users exist
  const userCount = await prisma.applicationUser.count();
  if (userCount === 0) {
    const password = process.env.SEED_USER_PASSWORD || 'password';
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.applicationUser.create({
      data: {
        email: process.env.SEED_USER_EMAIL || 'admin@example.local',
        passwordHash,
        firstName: process.env.SEED_USER_FIRST_NAME || 'Admin',
        lastName: process.env.SEED_USER_LAST_NAME || 'User',
        nickname: process.env.SEED_USER_NICKNAME || 'Admin',
      },
    });
    console.log('🌱 Seeded initial user');
  }

  // Create default training types if they don't exist
  const trainingTypes = [
    { name: 'Rowing Machine', slug: 'rowing-machine' },
    { name: 'Running', slug: 'running' },
    { name: 'Cycling', slug: 'cycling' },
    { name: 'Strength Training', slug: 'strength-training' },
    { name: 'Walking', slug: 'walking' },
  ];

  for (const type of trainingTypes) {
    const existingType = await prisma.trainingType.findUnique({
      where: { slug: type.slug },
    });
    if (!existingType) {
      await prisma.trainingType.create({ data: type });
      console.log(`🌱 Seeded training type: ${type.name}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
