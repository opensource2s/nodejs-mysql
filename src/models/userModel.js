const pool = require('../config/db');

// Initialize table
const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id        SERIAL PRIMARY KEY,
      name      VARCHAR(100) NOT NULL,
      email     VARCHAR(150) UNIQUE NOT NULL,
      age       INTEGER CHECK (age > 0),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await pool.query(query);
  console.log('✅ Users table ready');
};

// CRUD operations
const UserModel = {
  // Get all users
  findAll: async () => {
    const { rows } = await pool.query(
      'SELECT * FROM users ORDER BY created_at DESC'
    );
    return rows;
  },

  // Get user by ID
  findById: async (id) => {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  // Create user
  create: async ({ name, email, age }) => {
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, age)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, email, age]
    );
    return rows[0];
  },

  // Update user
  update: async (id, { name, email, age }) => {
    const { rows } = await pool.query(
      `UPDATE users
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           age = COALESCE($3, age),
           updated_at = NOW()
       WHERE id = $4 RETURNING *`,
      [name, email, age, id]
    );
    return rows[0] || null;
  },

  // Delete user
  delete: async (id) => {
    const { rows } = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [id]
    );
    return rows[0] || null;
  },
};

module.exports = { UserModel, createUsersTable };
