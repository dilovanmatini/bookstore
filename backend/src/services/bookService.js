import pool from '../config/db.js';

const bookSelect = `
    SELECT
        books.*,
        categories.name AS category_name
    FROM books
    LEFT JOIN categories ON categories.id = books.category_id
`;

const buildBookFilters = ({ query, categoryId } = {}) => {
    const conditions = ['1 = 1'];
    const params = [];

    if (categoryId) {
        conditions.push('books.category_id = ?');
        params.push(categoryId);
    }

    if (query) {
        conditions.push(`(
            books.title LIKE ?
            OR books.description LIKE ?
            OR books.author LIKE ?
            OR books.isbn LIKE ?
            OR CAST(books.price AS CHAR) LIKE ?
            OR CAST(YEAR(books.published_at) AS CHAR) LIKE ?
        )`);
        const like = `%${query}%`;
        params.push(like, like, like, like, like, like);
    }

    return { where: conditions.join(' AND '), params };
};

export const listBooks = async ({ query, categoryId, limit = 20, offset = 0 } = {}) => {
    const { where, params } = buildBookFilters({ query, categoryId });
    const sql = `
        ${bookSelect}
        WHERE ${where}
        ORDER BY books.created_at DESC
        LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query(sql, [...params, Number(limit), Number(offset)]);
    return rows;
};

export const listRecentBooks = async ({ limit = 10 } = {}) => {
    const sql = `
        ${bookSelect}
        ORDER BY books.created_at DESC
        LIMIT ?
    `;
    const [rows] = await pool.query(sql, [Number(limit)]);
    return rows;
};

export const getBookById = async (id) => {
    const sql = `${bookSelect} WHERE books.id = ?`;
    const [rows] = await pool.query(sql, [id]);
    return rows[0] || null;
};

export const createBook = async ({
    categoryId,
    title,
    description = null,
    author,
    isbn = null,
    publishedAt = null,
    price,
    image = null,
}) => {
    const [result] = await pool.query(
        `INSERT INTO books
            (category_id, title, description, author, isbn, published_at, price, image)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [categoryId, title, description, author, isbn, publishedAt, price, image],
    );

    return getBookById(result.insertId);
};

export const updateBook = async (id, data) => {
    const fields = [];
    const params = [];

    const mapping = {
        categoryId: 'category_id',
        title: 'title',
        description: 'description',
        author: 'author',
        isbn: 'isbn',
        publishedAt: 'published_at',
        price: 'price',
        image: 'image',
    };

    for (const [key, column] of Object.entries(mapping)) {
        if (data[key] !== undefined) {
            fields.push(`${column} = ?`);
            params.push(data[key]);
        }
    }

    if (fields.length === 0) {
        return getBookById(id);
    }

    params.push(id);
    await pool.query(`UPDATE books SET ${fields.join(', ')} WHERE id = ?`, params);
    return getBookById(id);
};

export const deleteBook = async (id) => {
    const [result] = await pool.query('DELETE FROM books WHERE id = ?', [id]);
    return result.affectedRows > 0;
};
