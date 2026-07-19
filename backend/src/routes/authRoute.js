import { Router } from 'express';
import {
    register,
    login,
    logout,
    getMe,
    updateMe,
} from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, updateMe);

export default router;
