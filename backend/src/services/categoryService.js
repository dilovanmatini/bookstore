import pool from '../config/db.js';

export const listCategories = async ({ query } = {}) => {
    const params = [];
    let sql = 'SELECT * FROM categories WHERE 1 = 1';

    if (query) {
        sql += ' AND name LIKE ?';
        params.push(`%${query}%`);
    }

    sql += ' ORDER BY name ASC';
    const [rows] = await pool.query(sql, params);
    return rows;
};

export const getCategoryById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0] || null;
};

export const createCategory = async (name) => {
    const [result] = await pool.query('INSERT INTO categories (name) VALUES (?)', [name]);
    return getCategoryById(result.insertId);
};

export const updateCategory = async (id, name) => {
    await pool.query('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
    return getCategoryById(id);
};

export const deleteCategory = async (id) => {
    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    return result.affectedRows > 0;
};
