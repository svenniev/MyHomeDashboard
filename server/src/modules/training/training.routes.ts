import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import { validateRequest } from '../../middleware/validateRequest';
import { TrainingTypeSchema, UpdateTrainingTypeSchema } from './training.schemas';
import * as trainingController from './training.controller';

const router = Router();
router.use(requireAuth);

// Training Types
router.get('/', trainingController.getTrainingTypes);
router.post('/', validateRequest(TrainingTypeSchema), trainingController.postTrainingType);
router.put('/:id', validateRequest(UpdateTrainingTypeSchema), trainingController.putTrainingType);
router.delete('/:id', trainingController.deleteTrainingType);

// Training Logs
const logsRouter = Router();
logsRouter.use(requireAuth);
logsRouter.get('/', trainingController.getTrainingLogs);
logsRouter.post('/', trainingController.postTrainingLog);
logsRouter.get('/:id', trainingController.getTrainingLog);
logsRouter.put('/:id', trainingController.putTrainingLog);
logsRouter.delete('/:id', trainingController.deleteTrainingLog);

export { router as trainingTypesRouter, logsRouter as trainingLogsRouter };
