import { Router } from 'express';
import {
    getFavorites,
    addFavoriteHandler,
    removeFavoriteHandler,
} from '../controllers/favoriteController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getFavorites);
router.post('/', addFavoriteHandler);
router.delete('/:bookId', removeFavoriteHandler);

export default router;
