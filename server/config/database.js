const { Pool } = require('pg');
require('dotenv').config();

let pool;

if (process.env.NODE_ENV === 'test' || process.env.USE_MOCK_DB === 'true') {
  const { newDb } = require('pg-mem');
  const memDb = newDb();

  // Set up mock database schema & helper query interface
  const memAdapter = memDb.adapters.createPg();
  pool = new memAdapter.Pool();

  console.log('[Database] Configured in-memory mock database for testing.');
} else {
  const config = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
    database: process.env.PGDATABASE,
    ssl: process.env.PGSSL === 'false' ? false : { rejectUnauthorized: false }
  };

  if (process.env.DATABASE_URL) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
  } else {
    pool = new Pool(config);
  }
}

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params)
};
