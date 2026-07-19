import { Router } from 'express';
import {
    getCartHandler,
    addToCart,
    updateCartItemHandler,
    removeCartItemHandler,
    clearCartHandler,
} from '../controllers/cartController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getCartHandler);
router.post('/', addToCart);
router.patch('/:itemId', updateCartItemHandler);
router.delete('/:itemId', removeCartItemHandler);
router.delete('/', clearCartHandler);

export default router;
