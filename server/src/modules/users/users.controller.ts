import { NextFunction, Request, Response } from 'express';
import { findUserById, updateUser } from './users.service';

export async function getMyProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await findUserById(req.session.userId!);
    if (!user) {
      return res.status(404).json({
        data: null,
        error: { code: 'NOT_FOUND', message: 'User not found' },
      });
    }
    const { passwordHash, ...userWithoutPassword } = user;
    res.json({ data: userWithoutPassword, error: null });
  } catch (error) {
    next(error);
  }
}

export async function updateMyProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await updateUser(req.session.userId!, req.body);
      const { passwordHash, ...userWithoutPassword } = user;
      res.json({ data: userWithoutPassword, error: null });
    } catch (error) {
      next(error);
    }
  }
