import pool from '../config/db.js';

export const createSession = async (userId, jti, expiresAt) => {
    await pool.query(
        'INSERT INTO sessions (user_id, jti, expires_at) VALUES (?, ?, ?)',
        [userId, jti, expiresAt],
    );
};

export const getValidSession = async (jti) => {
    const [rows] = await pool.query(
        'SELECT * FROM sessions WHERE jti = ? AND expires_at > NOW()',
        [jti],
    );
    return rows[0] || null;
};

export const deleteSession = async (jti) => {
    const [result] = await pool.query('DELETE FROM sessions WHERE jti = ?', [jti]);
    return result.affectedRows > 0;
};

export const deleteSessionsByUserId = async (userId) => {
    const [result] = await pool.query('DELETE FROM sessions WHERE user_id = ?', [userId]);
    return result.affectedRows;
};

export const deleteExpiredSessions = async () => {
    await pool.query('DELETE FROM sessions WHERE expires_at <= NOW()');
};
