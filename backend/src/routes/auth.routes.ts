import { Router } from 'express';
import { UserController } from '../entities/user/user.controller';

const router = Router();
const authController = new UserController();


router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authController.me);

export default router;
