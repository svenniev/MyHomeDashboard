import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { RegisterSchema, LoginSchema } from './auth.schemas';
import { register, login, logout, getMe } from './auth.service';
import { requireAuth } from '../../middleware/requireAuth';

const router = Router();

router.post('/register', validateRequest(RegisterSchema), register);
router.post('/login', validateRequest(LoginSchema), login);
router.post('/logout', logout);
router.get('/me', getMe);

export default router;
