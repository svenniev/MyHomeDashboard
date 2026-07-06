import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import { validateRequest } from '../../middleware/validateRequest';
import { UpdateUserSchema } from './users.schemas';
import { getMyProfile, updateMyProfile } from './users.controller';

const router = Router();

router.use(requireAuth);

router.get('/me', getMyProfile);
router.put('/me', validateRequest(UpdateUserSchema), updateMyProfile);

export default router;
