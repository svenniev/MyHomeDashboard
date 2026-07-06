import { NextFunction, Request, Response } from 'express';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({
      data: null,
      error: { code: 'UNAUTHORIZED', message: 'You must be logged in to access this resource.' },
    });
  }
}
