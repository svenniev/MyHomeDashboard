import { prisma } from '../../prisma';
import { findTrainingTypes } from '../training/training.service';
import { NextFunction, Request, Response } from 'express';
import { createTrainingLog } from '../training/training.service';

export async function getDeviceUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await prisma.applicationUser.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        nickname: true,
        profilePicturePath: true,
      },
    });
    res.json({ data: users, error: null });
  } catch (error) {
    next(error);
  }
}

export async function getDeviceTrainingTypes(req: Request, res: Response, next: NextFunction) {
  try {
    const types = await findTrainingTypes();
    res.json({ data: types, error: null });
  } catch (error) {
    next(error);
  }
}

export async function postDeviceTrainingLog(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, trainingTypeId, trainingTypeSlug, ...data } = req.body;
  
      // Validate user
      const user = await prisma.applicationUser.findUnique({ where: { id: userId } });
      if (!user) {
        return res.status(400).json({ data: null, error: { code: 'VALIDATION_ERROR', message: 'User not found' } });
      }
  
      // Validate training type
      let finalTrainingTypeId = trainingTypeId;
      if (trainingTypeSlug && !finalTrainingTypeId) {
        const type = await prisma.trainingType.findUnique({ where: { slug: trainingTypeSlug, isActive: true } });
        if (!type) {
            return res.status(400).json({ data: null, error: { code: 'VALIDATION_ERROR', message: 'Training type not found' } });
        }
        finalTrainingTypeId = type.id;
      } else {
        const type = await prisma.trainingType.findUnique({ where: { id: finalTrainingTypeId, isActive: true } });
        if (!type) {
            return res.status(400).json({ data: null, error: { code: 'VALIDATION_ERROR', message: 'Training type not found' } });
        }
      }
      
      const log = await createTrainingLog(userId, {
        trainingTypeId: finalTrainingTypeId,
        source: 'rowing_odometer',
        ...data,
      });
  
      res.status(201).json({ data: log, error: null });
    } catch (error) {
      next(error);
    }
  }