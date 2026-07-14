import app from '../app.js';
import express from 'express';
import { register } from '../controllers/authController.js';

const router = express();

router.post('/register', register);
// router.post('/login', login);

export default router;