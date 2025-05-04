import express from 'express';
import * as commentController from '../controller/comment.controller';
import auth from '../../middleware/auth';

const router = express.Router();

router.get('/image/:imageId', commentController.getCommentsByImageId);
router.post('/image/:imageId', auth, commentController.createComment);
router.delete('/:id', auth, commentController.deleteComment);

export default router;