import { NextFunction, Request, Response } from 'express';
import { config } from '../config';

export function requireDeviceApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.get('X-Device-Api-Key');
  if (apiKey && apiKey === config.deviceApiKey) {
    next();
  } else {
    res.status(401).json({
      data: null,
      error: { code: 'UNAUTHORIZED', message: 'Invalid or missing device API key.' },
    });
  }
}
