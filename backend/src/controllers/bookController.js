import {
    listBooks,
    listRecentBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
} from '../services/bookService.js';
import { getCategoryById } from '../services/categoryService.js';

export const getBooks = async (req, res) => {
    try {
        const books = await listBooks({
            query: req.query.query,
            categoryId: req.query.category_id,
            limit: req.query.limit || 20,
            offset: req.query.offset || 0,
        });

        return res.status(200).json({
            success: true,
            message: 'Books retrieved successfully',
            books,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const getRecentBooks = async (req, res) => {
    try {
        const books = await listRecentBooks({
            limit: req.query.limit || 10,
        });

        return res.status(200).json({
            success: true,
            message: 'Recent books retrieved successfully',
            books,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const getBook = async (req, res) => {
    try {
        const book = await getBookById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Book retrieved successfully',
            book,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const createBookHandler = async (req, res) => {
    const {
        category_id: categoryId,
        title,
        description,
        author,
        isbn,
        published_at: publishedAt,
        price,
        image,
    } = req.body;

    const missing = [];
    if (!categoryId) missing.push('category_id');
    if (!title) missing.push('title');
    if (!author) missing.push('author');
    if (price === undefined || price === null || price === '') missing.push('price');

    if (missing.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Please fill the following fields: ${missing.join(', ')}`,
        });
    }

    try {
        const category = await getCategoryById(categoryId);
        if (!category) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category_id',
            });
        }

        const book = await createBook({
            categoryId,
            title,
            description,
            author,
            isbn,
            publishedAt,
            price,
            image,
        });

        return res.status(201).json({
            success: true,
            message: 'Book created successfully',
            book,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const updateBookHandler = async (req, res) => {
    const {
        category_id: categoryId,
        title,
        description,
        author,
        isbn,
        published_at: publishedAt,
        price,
        image,
    } = req.body;

    try {
        const existing = await getBookById(req.params.id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Book not found',
            });
        }

        if (categoryId !== undefined) {
            const category = await getCategoryById(categoryId);
            if (!category) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid category_id',
                });
            }
        }

        const book = await updateBook(req.params.id, {
            categoryId,
            title,
            description,
            author,
            isbn,
            publishedAt,
            price,
            image,
        });

        return res.status(200).json({
            success: true,
            message: 'Book updated successfully',
            book,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const deleteBookHandler = async (req, res) => {
    try {
        const deleted = await deleteBook(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Book not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Book deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
