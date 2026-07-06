import { NextFunction, Request, Response } from 'express';
import { comparePassword, hashPassword } from './password.service';
import { createUser, findUserByEmail, findUserById } from '../users/users.service';

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, ...rest } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        data: null,
        error: { code: 'CONFLICT', message: 'User with this email already exists' },
      });
    }

    const user = await createUser({ 
      email, 
      password, 
      ...rest,
      heightCm: rest.heightCm ? Number(rest.heightCm) : null,
    });

    req.session.userId = user.id;

    const { passwordHash, ...userWithoutPassword } = user;
    res.status(201).json({ data: userWithoutPassword, error: null });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    if (!user || !(await comparePassword(password, user.passwordHash))) {
      return res.status(401).json({
        data: null,
        error: { code: 'UNAUTHORIZED', message: 'Invalid email or password' },
      });
    }

    req.session.userId = user.id;
    
    const { passwordHash, ...userWithoutPassword } = user;
    res.json({ data: userWithoutPassword, error: null });
  } catch (error) {
    next(error);
  }
}

export function logout(req: Request, res: Response) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        data: null,
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'Could not log out' },
      });
    }
    res.clearCookie('connect.sid'); // The default cookie name for express-session
    res.status(200).json({ data: { message: 'Logged out successfully' }, error: null });
  });
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.session.userId) {
        return res.json({ data: null, error: null });
      }
  
      const user = await findUserById(req.session.userId);
      if (!user) {
        // This case might happen if the user has been deleted but the session is still valid.
        req.session.destroy(() => {});
        res.clearCookie('connect.sid');
        return res.json({ data: null, error: null });
      }

      const { passwordHash, ...userWithoutPassword } = user;
      res.json({ data: userWithoutPassword, error: null });

    } catch (error) {
      next(error);
    }
  }