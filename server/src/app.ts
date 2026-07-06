import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { PrismaClient } from '@prisma/client';

import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/users.routes';
import goalRoutes from './modules/goals/goals.routes';
import bodyRoutes from './modules/body/body.routes';
import { trainingTypesRouter, trainingLogsRouter } from './modules/training/training.routes';
import deviceRoutes from './modules/device/device.routes';
import { config } from './config';
import { prisma } from './prisma';

const app: Express = express();
const PgStore = connectPgSimple(session);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(
  session({
    store: new PgStore({
      pool,
      tableName: 'user_sessions',
    }),
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);

// Serve API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/body-composition', bodyRoutes);
app.use('/api/training-types', trainingTypesRouter);
app.use('/api/training-logs', trainingLogsRouter);
app.use('/api/device', deviceRoutes);

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ data: { status: 'ok' }, error: null });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    data: null,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong!',
    },
  });
});


// Serve the React SPA
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDistPath));

  // For any other request, serve the index.html file
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

export { app };
