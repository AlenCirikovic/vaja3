import express from 'express';
import * as voteController from '../controller/vote.controller';
import auth from '../../middleware/auth';

const router = express.Router();

router.post('/image/:imageId', auth, voteController.voteImage);
router.get('/image/:imageId/status', auth, voteController.getVoteStatus);

export default router;