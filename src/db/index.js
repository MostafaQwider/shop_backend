const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL env var is required');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  

});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};