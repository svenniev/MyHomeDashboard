/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: './prisma/vitest-environment-prisma-v1.ts',
    setupFiles: [],
  },
});
