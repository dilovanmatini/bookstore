import { Router } from 'express';
import {
    checkoutHandler,
    getOrders,
    getOrder,
    cancelOrder,
} from '../controllers/orderController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.post('/', checkoutHandler);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.patch('/:id/cancel', cancelOrder);

export default router;
