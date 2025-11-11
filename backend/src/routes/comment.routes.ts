import { Router } from 'express';
import { CommentController } from '../entities/comment/comment.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
const commentController = new CommentController();

router.get('/note/:noteId', commentController.getByNoteId);
router.post('/', authenticateToken, commentController.create);
router.delete('/:id', authenticateToken, commentController.delete);

export default router;
