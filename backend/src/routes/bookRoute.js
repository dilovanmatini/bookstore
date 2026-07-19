import { Router } from 'express';
import {
    getBooks,
    getRecentBooks,
    getBook,
} from '../controllers/bookController.js';

const router = Router();

router.get('/', getBooks);
router.get('/recent', getRecentBooks);
router.get('/:id', getBook);

export default router;
