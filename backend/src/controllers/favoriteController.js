import {
    listFavorites,
    addFavorite,
    removeFavorite,
} from '../services/favoriteService.js';

export const getFavorites = async (req, res) => {
    try {
        const favorites = await listFavorites(req.userId);
        return res.status(200).json({
            success: true,
            message: 'Favorites retrieved successfully',
            favorites,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const addFavoriteHandler = async (req, res) => {
    const { book_id: bookId } = req.body;

    if (!bookId) {
        return res.status(400).json({
            success: false,
            message: 'Please fill the following fields: book_id',
        });
    }

    try {
        const result = await addFavorite(req.userId, bookId);

        if (result.error === 'BOOK_NOT_FOUND') {
            return res.status(404).json({
                success: false,
                message: 'Book not found',
            });
        }

        return res.status(201).json({
            success: true,
            message: 'Favorite added successfully',
            favorite: result.favorite,
            book: result.book,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const removeFavoriteHandler = async (req, res) => {
    try {
        const removed = await removeFavorite(req.userId, req.params.bookId);

        if (!removed) {
            return res.status(404).json({
                success: false,
                message: 'Favorite not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Favorite removed successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
