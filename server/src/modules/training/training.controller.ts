import { NextFunction, Request, Response } from 'express';
import * as trainingService from './training.service';

// Training Types
export async function getTrainingTypes(req: Request, res: Response, next: NextFunction) {
  try {
    const types = await trainingService.findTrainingTypes();
    res.json({ data: types, error: null });
  } catch (error) {
    next(error);
  }
}

export async function postTrainingType(req: Request, res: Response, next: NextFunction) {
  try {
    const type = await trainingService.createTrainingType(req.body);
    res.status(201).json({ data: type, error: null });
  } catch (error) {
    next(error);
  }
}

export async function putTrainingType(req: Request, res: Response, next: NextFunction) {
    try {
      const type = await trainingService.updateTrainingType(req.params.id, req.body);
      res.json({ data: type, error: null });
    } catch (error) {
      next(error);
    }
  }

export async function deleteTrainingType(req: Request, res: Response, next: NextFunction) {
    try {
        // This is a soft delete
        await trainingService.deactivateTrainingType(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

// Training Logs
export async function getTrainingLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const logs = await trainingService.findTrainingLogsByUserId(req.session.userId!);
      res.json({ data: logs, error: null });
    } catch (error) {
      next(error);
    }
  }
  
  export async function getTrainingLog(req: Request, res: Response, next: NextFunction) {
    try {
      const log = await trainingService.findTrainingLogById(req.params.id);
      if (!log || log.userId !== req.session.userId) {
        return res.status(404).json({ data: null, error: { code: 'NOT_FOUND', message: 'Log not found' } });
      }
      res.json({ data: log, error: null });
    } catch (error) {
      next(error);
    }
  }
  
  export async function postTrainingLog(req: Request, res: Response, next: NextFunction) {
    try {
      const log = await trainingService.createTrainingLog(req.session.userId!, req.body);
      res.status(201).json({ data: log, error: null });
    } catch (error) {
      next(error);
    }
  }
  
  export async function putTrainingLog(req: Request, res: Response, next: NextFunction) {
    try {
      const log = await trainingService.findTrainingLogById(req.params.id);
      if (!log || log.userId !== req.session.userId) {
        return res.status(404).json({ data: null, error: { code: 'NOT_FOUND', message: 'Log not found' } });
      }
      const updatedLog = await trainingService.updateTrainingLog(req.params.id, req.body);
      res.json({ data: updatedLog, error: null });
    } catch (error) {
      next(error);
    }
  }
  
  export async function deleteTrainingLog(req: Request, res: Response, next: NextFunction) {
    try {
      const log = await trainingService.findTrainingLogById(req.params.id);
      if (!log || log.userId !== req.session.userId) {
        return res.status(404).json({ data: null, error: { code: 'NOT_FOUND', message: 'Log not found' } });
      }
      await trainingService.deleteTrainingLog(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }