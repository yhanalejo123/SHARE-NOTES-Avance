import { Router } from 'express';
import { NoteController } from '../entities/note/note.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
const noteController = new NoteController();

router.get('/', authenticateToken, noteController.getAll);
router.get('/search', noteController.search);
router.get('/category/:categoryName', noteController.getByCategory);
router.get('/favorites', authenticateToken, noteController.getFavorites);
router.get('/:id', noteController.getById);
router.post('/', authenticateToken, noteController.create);
router.post('/:id/favorite', authenticateToken, noteController.toggleFavorite);
router.delete('/:id', authenticateToken, noteController.delete);

export default router;
