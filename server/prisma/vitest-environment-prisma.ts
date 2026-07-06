// Defines a custom environment for running Vitest tests with Prisma.
import type { Environment } from 'vitest';
import { randomUUID } from 'crypto';
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default <Environment>{
  name: 'prisma',
  async setup() {
    const schema = randomUUID();
    const databaseUrl = `postgresql://myhomedashboard:mysecretpassword@localhost:5433/myhomedashboard_${schema}?schema=public`;

    process.env.DATABASE_URL = databaseUrl;

    execSync(`npx prisma migrate deploy`, {
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
      },
    });

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "public" CASCADE;`
        );
        await prisma.$disconnect();
      },
    };
  },
};
