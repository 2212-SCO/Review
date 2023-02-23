require("dotenv").config();

const { Pool } = require('pg')
const pool = new Pool({
  user: process.env.DB_USER || 'qchen',
  host: process.env.DB_HOST || 'localhost',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

pool.connect((err) => {
  if (err) {
    return console.error('error: ' + err.message);
  }
  console.log('Connected to the PSQL server.');
});

module.exports = pool;
