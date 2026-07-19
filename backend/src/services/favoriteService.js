import pool from '../config/db.js';
import { getBookById } from './bookService.js';

export const listFavorites = async (userId) => {
    const [rows] = await pool.query(
        `SELECT
            favorites.id AS favorite_id,
            favorites.created_at AS favorited_at,
            books.*,
            categories.name AS category_name
         FROM favorites
         JOIN books ON books.id = favorites.book_id
         LEFT JOIN categories ON categories.id = books.category_id
         WHERE favorites.user_id = ?
         ORDER BY favorites.created_at DESC`,
        [userId],
    );
    return rows;
};

export const addFavorite = async (userId, bookId) => {
    const book = await getBookById(bookId);
    if (!book) {
        return { error: 'BOOK_NOT_FOUND' };
    }

    const [existing] = await pool.query(
        'SELECT * FROM favorites WHERE user_id = ? AND book_id = ?',
        [userId, bookId],
    );

    if (existing[0]) {
        return { favorite: existing[0], book };
    }

    const [result] = await pool.query(
        'INSERT INTO favorites (user_id, book_id) VALUES (?, ?)',
        [userId, bookId],
    );

    const [rows] = await pool.query('SELECT * FROM favorites WHERE id = ?', [result.insertId]);
    return { favorite: rows[0], book };
};

export const removeFavorite = async (userId, bookId) => {
    const [result] = await pool.query(
        'DELETE FROM favorites WHERE user_id = ? AND book_id = ?',
        [userId, bookId],
    );
    return result.affectedRows > 0;
};
