import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import { validateRequest } from '../../middleware/validateRequest';
import { GoalSchema, UpdateGoalSchema, GoalValueUpdateSchema } from './goals.schemas';
import { getGoals, getGoal, postGoal, putGoal, deleteGoal, postGoalValueUpdate } from './goals.controller';

const router = Router();
router.use(requireAuth);

router.get('/', getGoals);
router.post('/', validateRequest(GoalSchema), postGoal);
router.get('/:id', getGoal);
router.put('/:id', validateRequest(UpdateGoalSchema), putGoal);
router.delete('/:id', deleteGoal);
router.post('/:id/value-updates', validateRequest(GoalValueUpdateSchema), postGoalValueUpdate);

export default router;
