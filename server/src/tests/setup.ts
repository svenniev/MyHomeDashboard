import { beforeAll, afterAll } from 'vitest';
import { execSync } from 'child_process';

beforeAll(async () => {
  execSync('npm run prisma:migrate');
});
