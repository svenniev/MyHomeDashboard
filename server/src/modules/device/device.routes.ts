import { Router } from 'express';
import { requireDeviceApiKey } from '../../middleware/requireDeviceApiKey';
import { validateRequest } from '../../middleware/validateRequest';
import { DeviceTrainingLogSchema } from './device.schemas';
import * as deviceController from './device.controller';

const router = Router();
router.use(requireDeviceApiKey);

router.get('/users', deviceController.getDeviceUsers);
router.get('/training-types', deviceController.getDeviceTrainingTypes);
router.post('/training-logs', validateRequest(DeviceTrainingLogSchema), deviceController.postDeviceTrainingLog);

export default router;
