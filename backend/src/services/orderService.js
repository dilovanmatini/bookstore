import pool from '../config/db.js';
import { OrderStatus } from '../constants/orderStatus.js';
import {
    getDraftOrder,
    getOrderItems,
    recalculateOrderTotal,
} from './cartService.js';

export const getOrderById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    return rows[0] || null;
};

export const getOrderWithItems = async (id) => {
    const order = await getOrderById(id);
    if (!order) {
        return null;
    }

    const items = await getOrderItems(id);
    return { ...order, items };
};

export const checkout = async (userId, address) => {
    const order = await getDraftOrder(userId);

    if (!order) {
        return { error: 'CART_EMPTY' };
    }

    const items = await getOrderItems(order.id);
    if (items.length === 0) {
        return { error: 'CART_EMPTY' };
    }

    await recalculateOrderTotal(order.id);
    await pool.query(
        'UPDATE orders SET status = ?, address = ? WHERE id = ? AND user_id = ?',
        [OrderStatus.Pending, address, order.id, userId],
    );

    return { order: await getOrderWithItems(order.id) };
};

export const listUserOrders = async (userId, { status } = {}) => {
    const params = [userId];
    let sql = 'SELECT * FROM orders WHERE user_id = ? AND status != ?';
    params.push(OrderStatus.Draft);

    if (status) {
        sql += ' AND status = ?';
        params.push(status);
    }

    sql += ' ORDER BY created_at DESC';
    const [orders] = await pool.query(sql, params);

    const result = [];
    for (const order of orders) {
        const items = await getOrderItems(order.id);
        result.push({ ...order, items });
    }

    return result;
};

export const cancelUserOrder = async (userId, orderId) => {
    const order = await getOrderById(orderId);

    if (!order || Number(order.user_id) !== Number(userId)) {
        return { error: 'NOT_FOUND' };
    }

    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [
        OrderStatus.Cancelled,
        orderId,
    ]);

    return { order: await getOrderWithItems(orderId) };
};

export const listAdminOrders = async ({ query, status, limit = 20, offset = 0 } = {}) => {
    const params = [];
    let sql = `
        SELECT
            orders.*,
            users.name AS user_name,
            users.email AS user_email
        FROM orders
        JOIN users ON users.id = orders.user_id
        WHERE orders.status != ?
    `;
    params.push(OrderStatus.Draft);

    if (status) {
        sql += ' AND orders.status = ?';
        params.push(status);
    }

    if (query) {
        sql += ` AND (
            users.name LIKE ?
            OR users.email LIKE ?
            OR orders.address LIKE ?
            OR CAST(orders.id AS CHAR) LIKE ?
        )`;
        const like = `%${query}%`;
        params.push(like, like, like, like);
    }

    sql += ' ORDER BY orders.created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(sql, params);
    return rows;
};

export const updateOrderStatus = async (orderId, status) => {
    const order = await getOrderById(orderId);

    if (!order) {
        return { error: 'NOT_FOUND' };
    }

    if (order.status === OrderStatus.Draft) {
        return { error: 'INVALID_STATUS' };
    }

    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    return { order: await getOrderWithItems(orderId) };
};
