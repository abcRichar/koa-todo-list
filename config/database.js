require("dotenv").config();

// Database configuration
const mysql = require("mysql2");

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "todo_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Get promise-based pool
const promisePool = pool.promise();

module.exports = {
  pool,
  promisePool,
};
