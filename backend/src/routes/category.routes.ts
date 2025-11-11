import { Router } from 'express';
import { CategoryController } from '../entities/category/category.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
const categoryController = new CategoryController();

router.get('/', authenticateToken, categoryController.getAll);
router.post('/', authenticateToken, categoryController.create);

export default router;
