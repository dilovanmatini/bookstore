import pool from '../config/db.js';

const sanitizeUser = (user) => {
    if (!user) {
        return null;
    }

    const { password, ...safeUser } = user;
    return safeUser;
};

export const createUser = async ({ name, email, password, role, phone = null, isActive = true }) => {
    const [result] = await pool.query(
        'INSERT INTO users (name, email, password, role, phone, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email, password, role, phone, isActive ? 1 : 0],
    );

    return getUserById(result.insertId);
};

export const getUserById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] || null;
};

export const getUserByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
};

export const updateUserProfile = async (id, { name, phone, password }) => {
    const fields = [];
    const params = [];

    if (name !== undefined) {
        fields.push('name = ?');
        params.push(name);
    }

    if (phone !== undefined) {
        fields.push('phone = ?');
        params.push(phone);
    }

    if (password !== undefined) {
        fields.push('password = ?');
        params.push(password);
    }

    if (fields.length === 0) {
        return getUserById(id);
    }

    params.push(id);
    await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);
    return getUserById(id);
};

export const listUsers = async ({ query, limit = 20, offset = 0 } = {}) => {
    const params = [];
    let sql = 'SELECT id, name, email, phone, role, is_active, created_at FROM users WHERE 1 = 1';

    if (query) {
        sql += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
        const like = `%${query}%`;
        params.push(like, like, like);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(sql, params);
    return rows;
};

export const updateUser = async (id, { name, email, phone, role, password, isActive }) => {
    const fields = [];
    const params = [];

    if (name !== undefined) {
        fields.push('name = ?');
        params.push(name);
    }

    if (email !== undefined) {
        fields.push('email = ?');
        params.push(email);
    }

    if (phone !== undefined) {
        fields.push('phone = ?');
        params.push(phone);
    }

    if (role !== undefined) {
        fields.push('role = ?');
        params.push(role);
    }

    if (password !== undefined) {
        fields.push('password = ?');
        params.push(password);
    }

    if (isActive !== undefined) {
        fields.push('is_active = ?');
        params.push(isActive ? 1 : 0);
    }

    if (fields.length === 0) {
        return getUserById(id);
    }

    params.push(id);
    await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);
    return getUserById(id);
};

export const setUserActiveStatus = async (id, isActive) => {
    await pool.query('UPDATE users SET is_active = ? WHERE id = ?', [isActive ? 1 : 0, id]);
    return getUserById(id);
};

export const deleteUser = async (id) => {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
};

export { sanitizeUser };
