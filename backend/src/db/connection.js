const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,  // espera si todas las conexiones están ocupadas
  connectionLimit: 10,       // máximo 10 conexiones simultáneas
  queueLimit: 0              // sin límite de peticiones en cola
});

module.exports = pool;