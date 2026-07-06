import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import { validateRequest } from '../../middleware/validateRequest';
import { BodyCompositionSchema, UpdateBodyCompositionSchema } from './body.schemas';
import * as bodyController from './body.controller';

const router = Router();
router.use(requireAuth);

router.get('/', bodyController.getBodyComposition);
router.post('/', validateRequest(BodyCompositionSchema), bodyController.postBodyComposition);
router.get('/latest', bodyController.getLatestBodyComposition);
router.put('/:id', validateRequest(UpdateBodyCompositionSchema), bodyController.putBodyComposition);
router.delete('/:id', bodyController.deleteBodyComposition);

export default router;
