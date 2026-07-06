import 'dotenv/config';

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  databaseUrl: process.env.DATABASE_URL || '',
  sessionSecret: process.env.SESSION_SECRET || 'super-secret',
  deviceApiKey: process.env.DEVICE_API_KEY || '',
  seed: {
    user: {
      email: process.env.SEED_USER_EMAIL || 'admin@example.local',
      password: process.env.SEED_USER_PASSWORD || 'password',
      firstName: process.env.SEED_USER_FIRST_NAME || 'Admin',
      lastName: process.env.SEED_USER_LAST_NAME || 'User',
      nickname: process.env.SEED_USER_NICKNAME || 'Admin',
    },
  },
};
