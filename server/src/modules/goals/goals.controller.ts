import { NextFunction, Request, Response } from 'express';
import { findGoalsByUserId, findGoalById, createGoal, updateGoal, archiveGoal, addGoalValueUpdate } from './goals.service';

export async function getGoals(req: Request, res: Response, next: NextFunction) {
  try {
    const goals = await findGoalsByUserId(req.session.userId!);
    res.json({ data: goals, error: null });
  } catch (error) {
    next(error);
  }
}

export async function getGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const goal = await findGoalById(req.params.id);
      if (!goal || goal.userId !== req.session.userId) {
        return res.status(404).json({ data: null, error: { code: 'NOT_FOUND', message: 'Goal not found' } });
      }
      res.json({ data: goal, error: null });
    } catch (error) {
      next(error);
    }
  }

export async function postGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const goal = await createGoal(req.session.userId!, req.body);
      res.status(201).json({ data: goal, error: null });
    } catch (error) {
      next(error);
    }
  }

export async function putGoal(req: Request, res: Response, next: NextFunction) {
    try {
        const goal = await findGoalById(req.params.id);
        if (!goal || goal.userId !== req.session.userId) {
          return res.status(404).json({ data: null, error: { code: 'NOT_FOUND', message: 'Goal not found' } });
        }
        const updatedGoal = await updateGoal(req.params.id, req.body);
        res.json({ data: updatedGoal, error: null });
      } catch (error) {
        next(error);
      }
}

export async function deleteGoal(req: Request, res: Response, next: NextFunction) {
    try {
        const goal = await findGoalById(req.params.id);
        if (!goal || goal.userId !== req.session.userId) {
          return res.status(404).json({ data: null, error: { code: 'NOT_FOUND', message: 'Goal not found' } });
        }
        await archiveGoal(req.params.id);
        res.status(204).send();
      } catch (error) {
        next(error);
      }
}

export async function postGoalValueUpdate(req: Request, res: Response, next: NextFunction) {
    try {
        const goal = await findGoalById(req.params.id);
        if (!goal || goal.userId !== req.session.userId) {
            return res.status(404).json({ data: null, error: { code: 'NOT_FOUND', message: 'Goal not found' } });
        }
        const { value, note } = req.body;
        const updatedGoal = await addGoalValueUpdate(req.params.id, req.session.userId!, value, note);
        res.json({ data: updatedGoal, error: null });
    } catch (error) {
        next(error);
    }
}