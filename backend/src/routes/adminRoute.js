import { Router } from 'express';
import {
    getCategories,
    getCategory,
    createCategoryHandler,
    updateCategoryHandler,
    deleteCategoryHandler,
} from '../controllers/categoryController.js';
import {
    getBooks,
    getBook,
    createBookHandler,
    updateBookHandler,
    deleteBookHandler,
} from '../controllers/bookController.js';
import {
    getAdminOrders,
    getAdminOrder,
    updateAdminOrder,
} from '../controllers/orderController.js';
import {
    getUsers,
    getUser,
    createUserHandler,
    updateUserHandler,
    setUserActiveHandler,
    deleteUserHandler,
} from '../controllers/userController.js';
import { authenticate, requireAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/categories', getCategories);
router.get('/categories/:id', getCategory);
router.post('/categories', createCategoryHandler);
router.put('/categories/:id', updateCategoryHandler);
router.delete('/categories/:id', deleteCategoryHandler);

router.get('/books', getBooks);
router.get('/books/:id', getBook);
router.post('/books', createBookHandler);
router.put('/books/:id', updateBookHandler);
router.delete('/books/:id', deleteBookHandler);

router.get('/orders', getAdminOrders);
router.get('/orders/:id', getAdminOrder);
router.patch('/orders/:id', updateAdminOrder);

router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.post('/users', createUserHandler);
router.put('/users/:id', updateUserHandler);
router.patch('/users/:id', setUserActiveHandler);
router.delete('/users/:id', deleteUserHandler);

export default router;
