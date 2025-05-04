import express from 'express';
import * as authController from '../controller/auth.controller';

const router = express.Router();

// Fix: Use the router.post/get/etc methods to register routes
router.post('/register', authController.register);
router.post('/login', authController.login);

export default router;