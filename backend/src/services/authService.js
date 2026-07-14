import pool from '../config/db.js';

export const registerService = async (name, email, password, role, phone = null) => {
    let sql = '';
    let params = [name, email, password, role];

    if (phone) {
        sql = 'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)';
        params.push(phone);
    } else {
        sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    }
    
    const user = await pool.query(sql, params);

    return user;
};