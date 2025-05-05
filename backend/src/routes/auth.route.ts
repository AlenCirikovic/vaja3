import express from 'express';
import * as authController from '../controller/auth.controller';
import auth from '../../middleware/auth'; // Use relative path

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/signout', auth, authController.signout);
router.get('/status', auth, authController.status);

export default router;