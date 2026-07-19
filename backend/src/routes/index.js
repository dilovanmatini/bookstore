import { Router } from 'express';
import authRoute from './authRoute.js';
import categoryRoute from './categoryRoute.js';
import bookRoute from './bookRoute.js';
import cartRoute from './cartRoute.js';
import orderRoute from './orderRoute.js';
import favoriteRoute from './favoriteRoute.js';
import adminRoute from './adminRoute.js';

const router = Router();

router.use('/auth', authRoute);
router.use('/categories', categoryRoute);
router.use('/books', bookRoute);
router.use('/cart', cartRoute);
router.use('/orders', orderRoute);
router.use('/favorites', favoriteRoute);
router.use('/admin', adminRoute);

export default router;
