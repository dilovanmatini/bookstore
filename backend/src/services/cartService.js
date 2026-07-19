import pool from '../config/db.js';
import { OrderStatus } from '../constants/orderStatus.js';
import { getBookById } from './bookService.js';

const getOrderItems = async (orderId) => {
    const [rows] = await pool.query(
        `SELECT
            order_items.*,
            books.title,
            books.author,
            books.image
         FROM order_items
         JOIN books ON books.id = order_items.book_id
         WHERE order_items.order_id = ?
         ORDER BY order_items.id ASC`,
        [orderId],
    );
    return rows;
};

export const recalculateOrderTotal = async (orderId, connection = pool) => {
    const [rows] = await connection.query(
        'SELECT COALESCE(SUM(quantity * price), 0) AS total FROM order_items WHERE order_id = ?',
        [orderId],
    );
    const total = rows[0].total;
    await connection.query('UPDATE orders SET total_price = ? WHERE id = ?', [total, orderId]);
    return total;
};

export const getDraftOrder = async (userId) => {
    const [rows] = await pool.query(
        'SELECT * FROM orders WHERE user_id = ? AND status = ? LIMIT 1',
        [userId, OrderStatus.Draft],
    );
    return rows[0] || null;
};

export const getOrCreateDraftOrder = async (userId) => {
    let order = await getDraftOrder(userId);

    if (!order) {
        const [result] = await pool.query(
            'INSERT INTO orders (user_id, status, total_price, address) VALUES (?, ?, 0.00, ?)',
            [userId, OrderStatus.Draft, ''],
        );
        const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [result.insertId]);
        order = rows[0];
    }

    return order;
};

export const getCart = async (userId) => {
    const order = await getOrCreateDraftOrder(userId);
    const items = await getOrderItems(order.id);
    return { ...order, items };
};

export const addCartItem = async (userId, bookId, quantity = 1) => {
    const book = await getBookById(bookId);
    if (!book) {
        return { error: 'BOOK_NOT_FOUND' };
    }

    const order = await getOrCreateDraftOrder(userId);
    const [existing] = await pool.query(
        'SELECT * FROM order_items WHERE order_id = ? AND book_id = ?',
        [order.id, bookId],
    );

    if (existing[0]) {
        await pool.query(
            'UPDATE order_items SET quantity = quantity + ? WHERE id = ?',
            [quantity, existing[0].id],
        );
    } else {
        await pool.query(
            'INSERT INTO order_items (order_id, book_id, quantity, price) VALUES (?, ?, ?, ?)',
            [order.id, bookId, quantity, book.price],
        );
    }

    await recalculateOrderTotal(order.id);
    return { cart: await getCart(userId) };
};

export const updateCartItem = async (userId, itemId, quantity) => {
    const order = await getDraftOrder(userId);
    if (!order) {
        return { error: 'CART_NOT_FOUND' };
    }

    const [items] = await pool.query(
        'SELECT * FROM order_items WHERE id = ? AND order_id = ?',
        [itemId, order.id],
    );

    if (!items[0]) {
        return { error: 'ITEM_NOT_FOUND' };
    }

    if (quantity <= 0) {
        await pool.query('DELETE FROM order_items WHERE id = ?', [itemId]);
    } else {
        await pool.query('UPDATE order_items SET quantity = ? WHERE id = ?', [quantity, itemId]);
    }

    await recalculateOrderTotal(order.id);
    return { cart: await getCart(userId) };
};

export const removeCartItem = async (userId, itemId) => {
    const order = await getDraftOrder(userId);
    if (!order) {
        return { error: 'CART_NOT_FOUND' };
    }

    const [result] = await pool.query(
        'DELETE FROM order_items WHERE id = ? AND order_id = ?',
        [itemId, order.id],
    );

    if (result.affectedRows === 0) {
        return { error: 'ITEM_NOT_FOUND' };
    }

    await recalculateOrderTotal(order.id);
    return { cart: await getCart(userId) };
};

export const clearCart = async (userId) => {
    const order = await getDraftOrder(userId);
    if (!order) {
        return { cart: await getCart(userId) };
    }

    await pool.query('DELETE FROM order_items WHERE order_id = ?', [order.id]);
    await recalculateOrderTotal(order.id);
    return { cart: await getCart(userId) };
};

export { getOrderItems };
